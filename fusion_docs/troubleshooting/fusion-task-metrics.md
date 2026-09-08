---
title: Fusion task metrics
description: "Read the per-task Fusion metrics file to diagnose slow, stalled, or throttled tasks"
date created: "2026-09-08"
last updated: "2026-09-08"
tags: [troubleshooting, fusion, metrics, performance, diagnostics]
---

Every task that runs with Fusion writes a metrics file describing what the file system did during the task: how the cache behaved, how the cloud object store responded, how much data moved, and whether anything got stuck. Reading it requires nothing more than `zcat` and `jq`, and it answers most "the pipeline is slow" or "the task hangs" questions without an escalation to Seqera support.

## Fusion version requirements

Task metrics require **Fusion 2.6.4 or later**, or **Fusion 2.5.15 or later** on the 2.5 release line. Earlier versions write no metrics file. Where metrics are available, collection is enabled by default.

All five metric families described on this page are present in both of those versions.

:::note
If a task produced no metrics file, the most likely cause is a Fusion version that predates these releases. See [The metrics file is missing](#the-metrics-file-is-missing) for the other causes.
:::

## What each metric family tells you

Metrics are grouped into five families by name prefix. Each family answers a different question about your task, so start by deciding which question you are asking.

| Family            | Name prefix       | What you are trying to find out                                                                                                                                     |
| ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Object store**  | `fusion_backend_` | How the cloud object store (S3, Azure Blob Storage, or Google Cloud Storage) responded to Fusion. Use this for throttling, permission errors, cross-region latency, and total data transferred. |
| **Cache**         | `fusion_cache_`   | Whether Fusion could reuse data it already had locally, or had to fetch it again. Use this to decide whether the node's local disk is large enough for the working set. |
| **File system**   | `fusion_fs_`      | What the application asked Fusion to do through the mount, how long Fusion took to answer, and whether any request was never answered. Use this to tell an application-side hang apart from a Fusion-side stall. |
| **Chunk transfer**| `fusion_chunk_`   | How the individual pieces of large files moved between the node and the object store. Use this for stalled or repeatedly retried transfers.                          |
| **System health** | `fusion_health_`  | Resource state on the node itself: mount uptime, memory, open file handles, and free space on the cache device. Use this for local disk exhaustion.                  |

## Metric catalog

Values are cumulative. Every sample re-states the running total since the mount started, so the last record of a series is the end-of-task total, and the difference between two consecutive samples is the activity during that interval.

A metric that never fired is absent from the file. A healthy task has no eviction series and no throttling retries at all, so treat a missing series as zero rather than as a broken file.

### Object store (`fusion_backend_*`)

| Metric                                   | Type      | Expected value                                                        | An anomalous reading indicates                                                                                            |
| ---------------------------------------- | --------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `fusion_backend_requests_total`           | Counter   | Almost all series carry `outcome="ok"`.                               | A sustained share of `outcome="error"` points at permissions, credentials, or provider faults. Check the `error_code` label for the category. |
| `fusion_backend_requests_retries_total`   | Counter   | Absent or near zero.                                                  | Any sustained count with `retry_reason="throttling"` means the provider rate-limited you. Reduce task parallelism, spread data across more prefixes, or request a rate limit increase. |
| `fusion_backend_requests_bytes_total`     | Counter   | Comparable to the input and output volume of the process.             | Far more bytes downloaded than the inputs contain means data was fetched more than once. Cross-check the cache hit ratio.  |
| `fusion_backend_requests_latency_seconds` | Histogram | Same-region time to first byte sits in the tens of milliseconds.      | A mean in the hundreds of milliseconds, consistently rather than in bursts, points at a bucket in a different region than the compute, or traffic leaving through a NAT instead of a VPC endpoint. |
| `fusion_backend_requests_bytes`           | Histogram | Reflects the read sizes the process issues.                           | A distribution concentrated in the smallest buckets means many small requests where fewer large ones would be cheaper.     |
| `fusion_backend_requests_in_flight`       | Gauge     | Returns to `0` when the task goes quiet.                              | A non-zero value in the final sample means a request started and never completed: a hang or a leaked connection. Escalate. |

Requests that return `404` are recorded as `outcome="expected-miss"` rather than `error`, because a negative lookup is normal. Requests the caller abandoned are recorded as `outcome="cancelled"`. Neither counts towards the error rate.

### Cache (`fusion_cache_*`)

Cache tiers are named by access type: `lookup` resolves whether a path exists, `directory` tracks directory-listing freshness, and `data` is the local cache of file content.

| Metric                        | Type    | Expected value                                                                                    | An anomalous reading indicates                                                                                       |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `fusion_cache_hits_total`      | Counter | High relative to misses on `data` for workloads that re-read their inputs.                        | A low hit ratio alone can simply mean a streaming workload that reads everything once.                               |
| `fusion_cache_misses_total`    | Counter | Low relative to hits on re-reading workloads.                                                     | A low hit ratio **combined with a large eviction count** is the cache thrash signature.                              |
| `fusion_cache_evictions_total` | Counter | Absent on a task whose working set fits the local disk.                                           | A large count means data was cached, discarded under disk pressure, and fetched again. Use a larger local disk, an instance type with more NVMe, or fewer concurrent tasks per node. |
| `fusion_cache_io_bytes_total`  | Counter | Roughly tracks the data the task read and wrote.                                                  | No fixed baseline. Compare it against `fusion_backend_requests_bytes_total` to see how much traffic the cache absorbed. |
| `fusion_cache_entries`         | Gauge   | Grows during the task and does not fall on eviction.                                              | Unbounded growth well beyond the number of files touched. This gauge tracks tracking slots, not cache occupancy.       |

:::note
The `directory` miss counter is also incremented by renames, moves, and copies, so the `directory` hit ratio biases downward under heavy rename traffic. Read it as populate frequency, not as a pure read-cache ratio.
:::

### File system (`fusion_fs_*`)

The `operation` label is the actual VFS handler name, such as `read`, `write`, `lookup`, `getattr`, `open`, or `readdir`, not a coarse rollup.

| Metric                                        | Type      | Expected value                                                                 | An anomalous reading indicates                                                                                          |
| --------------------------------------------- | --------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `fusion_fs_requests_total`                     | Counter   | Proportional to the work the process performs.                                 | Millions of `read` operations against a small byte total is the tiny-read signature. See [Diagnostic queries](#diagnostic-queries). |
| `fusion_fs_requests_bytes_total`               | Counter   | Matches the volume of data the process reads and writes.                       | Divide by the read count. A mean of a few hundred bytes per read means the tool issues many small random reads, each paying a round trip through FUSE. |
| `fusion_fs_requests_latency_seconds`           | Histogram | Cached metadata operations complete in single-digit milliseconds.              | A long tail on `read` usually traces back to object store latency rather than to Fusion. Compare with the object store histogram. |
| `fusion_fs_requests_in_flight`                 | Gauge     | Small and fluctuating; returns to `0` when the task goes quiet.                | A value that only ever rises means requests arrive and are never answered. The label localises the stall to a call type. |
| `fusion_fs_requests_in_flight_oldest_seconds`  | Gauge     | Near zero on a healthy mount.                                                  | A value climbing sample after sample without recovering, into hundreds of seconds, means a request is stuck inside Fusion or its backend. Escalate. A value near zero during an apparent hang means nothing is calling Fusion, so the stall is in the application or the environment. |

### Chunk transfer (`fusion_chunk_*`)

| Metric                               | Type      | Expected value                                                    | An anomalous reading indicates                                                                                    |
| ------------------------------------ | --------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `fusion_chunk_transfers_total`         | Counter   | Scales with the volume of large-file data moved.                   | No fixed baseline. Use it as the denominator for the stall and retry counters.                                     |
| `fusion_chunk_stalls_total`            | Counter   | Absent.                                                            | Any count means a transfer stopped mid-stream and the stall watchdog intervened. Usually a network path problem.   |
| `fusion_chunk_retries_total`           | Counter   | Absent or a small fraction of transfers.                           | A high ratio to `fusion_chunk_transfers_total` means transfers repeatedly fail and resume, which slows the task without failing it. |
| `fusion_chunk_errors_total`            | Counter   | Absent, except for `error_type="canceled"`.                        | Counts under `stall`, `timeout`, or `exhausted` are real failures. Exclude `canceled`, which marks a normal caller interruption. |
| `fusion_chunk_transfers_in_flight`     | Gauge     | Returns to `0` when the task goes quiet.                           | A non-zero value in the final sample means a transfer never finished.                                             |
| `fusion_chunk_size_bytes`              | Histogram | Concentrated near the configured chunk size for sequential reads.  | A distribution skewed to small sizes means fragmented or random access rather than streaming.                     |
| `fusion_chunk_queue_wait_seconds`       | Histogram | Milliseconds when transfer capacity is sufficient.                 | Seconds of queue wait means transfers are backing up behind available bandwidth or concurrency.                    |
| `fusion_chunk_prefetch_drops_total`     | Counter   | Low or absent.                                                     | A high count means the prefetcher is shedding work because it cannot keep up. Read it alongside the queue wait histogram. |

### System health (`fusion_health_*`)

| Metric                                | Type      | Expected value                                                            | An anomalous reading indicates                                                                    |
| --------------------------------------- | --------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `fusion_health_uptime_seconds`            | Gauge     | Rises monotonically and roughly matches the task duration.                | A final value far below the task duration means the mount restarted mid-task.                     |
| `fusion_health_goroutines`                | Gauge     | Stable after the mount warms up.                                          | Unbounded growth suggests work accumulating that never completes.                                 |
| `fusion_health_memory_bytes`              | Gauge     | Plateaus once the workload reaches steady state. Labelled `heap`, `stacks`, and `other`. | A `heap` value that climbs without plateauing risks an out-of-memory kill of the task.            |
| `fusion_health_open_file_handles`         | Gauge     | Returns to `0` when the task goes quiet.                                  | A value that only ever rises means the application opens files without closing them.              |
| `fusion_health_disk_bytes`                | Gauge     | `free` stays well clear of zero for the whole task.                       | `free` bottoming out near zero means the cache device filled up. This usually appears alongside the cache thrash signature. |
| `fusion_health_mount_init_seconds`        | Histogram | Seconds.                                                                  | Tens of seconds delays every task in the run and is usually a credential or network setup problem. |
| `fusion_health_shutdown_flush_seconds`    | Histogram | Proportional to the volume of output still to upload at task end.         | A long flush relative to the task's own runtime means output upload, not computation, dominates the task. |

## Where to find the metrics

Fusion writes the metrics to your task work directory, next to `.fusion.log`:

```
<task work directory>/.fusion/metrics.jsonl.gz
```

Find the task work directory on the task detail page in Seqera Platform, under **Work directory**. It also appears near the top of `.nextflow.log`.

Download it with your cloud tooling:

```bash
# AWS
aws s3 cp s3://<bucket>/<workdir>/.fusion/metrics.jsonl.gz .

# Azure
az storage blob download --account-name <account> -c <container> \
  -n '<workdir>/.fusion/metrics.jsonl.gz' -f metrics.jsonl.gz

# Google Cloud
gcloud storage cp gs://<bucket>/<workdir>/.fusion/metrics.jsonl.gz .
```

The file is a standard gzip stream of JSON records, sampled every 10 seconds by default. Read it with `zcat` and `jq`. There is no metrics dashboard in Seqera Platform; the file is the interface.

Start by printing the header record, which identifies the Fusion version, the mount start time in Unix nanoseconds, and the host:

```bash
zcat metrics.jsonl.gz | head -1 | jq .
```

Then list which metrics the file actually contains:

```bash
zcat metrics.jsonl.gz | jq -r '.metric // empty' | sort -u
```

Finally, check for a closing record:

```bash
zcat metrics.jsonl.gz | jq -c 'select(.type=="closing")'
```

If nothing comes back, the task was killed before Fusion could shut down cleanly. That is itself a useful data point, pointing at a spot reclaim, an out-of-memory kill, or a hard cancellation.

:::note
The file is safe to attach to a support ticket. The metric records carry only numbers and fixed label vocabularies, and never contain file names, bucket names, or paths.
:::

## Diagnostic queries

Each query below returns the end-of-task total for a specific failure signature. Run them against a downloaded `metrics.jsonl.gz`.

### The provider is rate-limiting you

Tasks look slow but keep making progress, and nothing in the task log looks wrong.

```bash
zcat metrics.jsonl.gz | jq -s '[.[] |
    select(.metric=="fusion_backend_requests_retries_total"
           and .labels.retry_reason=="throttling")] |
  group_by(.labels) | map(last |
    {provider: .labels.provider, operation: .labels.operation, retries: .value})'
```

Any sustained non-zero count means the provider pushed back and Fusion had to retry. Corroborate it by breaking the failed requests down by status code and category, where `RateLimited` appears as 429 or 503:

```bash
zcat metrics.jsonl.gz | jq -s '[.[] |
    select(.metric=="fusion_backend_requests_total"
           and .labels.outcome=="error")] |
  group_by(.labels) | map(last | {labels, value})'
```

The fix is on the workload side: lower the task parallelism, spread the data across more prefixes, or ask the provider for a rate limit increase.

### The cache is thrashing

The working set does not fit on the node's local disk, so Fusion keeps evicting data it is about to need again.

```bash
zcat metrics.jsonl.gz | jq -s '
  def lastval(name): [.[] |
    select(.metric == name and .labels.cache_type == "data")] | last | .value;
  {hits: lastval("fusion_cache_hits_total"),
   misses: lastval("fusion_cache_misses_total"),
   evictions: lastval("fusion_cache_evictions_total")} |
  . + {hit_ratio: (.hits / (.hits + .misses))}'
```

A low hit ratio on its own can just mean a streaming workload. The thrash signature is a low hit ratio combined with a large eviction count. The remedy is more cache: a bigger local disk, an instance type with more NVMe, or fewer concurrent tasks per node.

### The object store is far away

Every request pays a high fixed latency before the first byte arrives.

```bash
zcat metrics.jsonl.gz | jq -s '[.[] |
    select(.metric=="fusion_backend_requests_latency_seconds"
           and .labels.latency_type=="time_to_first_byte"
           and .labels.operation=="GetObject")] |
  last | {requests: .histogram.count,
          mean_ttfb_seconds: (.histogram.sum / .histogram.count)}'
```

Same-region time to first byte sits in the tens of milliseconds. A mean in the hundreds of milliseconds points at distance or routing. Confirm that the bucket and the compute run in the same region, and on AWS check whether the VPC has an S3 gateway endpoint.

### The tool issues many tiny reads

Some tools issue millions of very small reads at random offsets. Each is cheap on a local disk but pays a round trip through FUSE on a Fusion mount.

```bash
zcat metrics.jsonl.gz | jq -s '
  def lastval(name): [.[] |
    select(.metric == name and .labels.operation == "read")] | last | .value;
  {reads: lastval("fusion_fs_requests_total"),
   bytes: lastval("fusion_fs_requests_bytes_total")} |
  . + {mean_bytes_per_read: (.bytes / .reads)}'
```

Millions of reads with a mean of a few hundred bytes each is the signature. This is workload behaviour, not a Fusion malfunction, and there is no Fusion setting that changes it. For tools known to behave this way, copy the input to local scratch inside the process before running the tool, so the small reads hit local disk instead of the mount.

### A request never completed

The task looks hung.

```bash
zcat metrics.jsonl.gz | jq -s '[.[] |
    select(.metric=="fusion_fs_requests_in_flight_oldest_seconds") | .value] | max'
```

This gauge reads near zero on a healthy mount. A value that climbs sample after sample without ever recovering means a request is stuck inside Fusion or its backend. Escalate this one: collect the metrics file and `.fusion.log`, and open a support ticket.

### The local disk filled up

The cache device ran out of space, which surfaces as eviction storms, slowdowns, or task failures late in the run.

```bash
zcat metrics.jsonl.gz | jq -s '[.[] |
    select(.metric=="fusion_health_disk_bytes" and .labels.state=="free") |
    .value] | min'
```

If free space bottoms out near zero, size the node's disk to the working set. This often appears alongside the cache thrash signature.

## Turn off metrics collection

There are two levels of opt-out.

### Stop the Seqera copy, keep the local file

On Seqera Cloud, turn off **Send Fusion metrics to Seqera** on the compute environment, either when you create it or by editing an existing compute environment. Seqera then stops retaining a copy, but Fusion still writes `.fusion/metrics.jsonl.gz` to the task work directory so it remains available for your own troubleshooting.

The toggle is on by default for new Fusion-enabled compute environments only. Existing compute environments keep the setting they already have.

### Disable collection entirely

To stop Fusion writing the metrics file at all, set `FUSION_METRICS_ENABLED=false` in the task container environment. In `nextflow.config`:

```groovy
process {
    containerOptions = { "-e FUSION_METRICS_ENABLED=false" }
}
```

No metrics file is written, and nothing is retained by Seqera.

:::note
Disabling metrics does not remove operational visibility. Fusion's critical operational events, such as stall watchdog warnings and errors, are always written to `.fusion.log` regardless of this setting.
:::

### Change the sampling interval

Instead of disabling collection, you can reduce the sampling frequency with `FUSION_METRICS_SAMPLE_INTERVAL`, which accepts a Go duration and defaults to `10s`:

```groovy
process {
    containerOptions = { "-e FUSION_METRICS_SAMPLE_INTERVAL=60s" }
}
```

## The metrics file is missing

If a task produced no `.fusion/metrics.jsonl.gz`, work through these causes in order:

| Cause                                                              | How to confirm                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| The Fusion version is earlier than 2.6.4, or earlier than 2.5.15 on the 2.5 line. | Check the Fusion version reported in `.fusion.log`.              |
| Collection was disabled with `FUSION_METRICS_ENABLED=false`.        | Check `containerOptions` in your Nextflow configuration.                        |
| A non-default output format is configured.                          | `FUSION_METRICS_FORMAT=log` writes no file. The debug-only `json-otel` writes an uncompressed file that `zcat` refuses. |
| The node disappeared before Fusion could upload the file.           | Look for a spot reclaim or a hard kill on the task.                             |

A file from an uncleanly ended task can also be truncated. In that case `zcat` prints everything up to the truncation point and then reports an error on stderr. That is expected, and every line it printed is valid.

## Getting help

When you open a support ticket about task performance, attach:

1. The `metrics.jsonl.gz` file for the affected task.
1. The `.fusion.log` file from the same task work directory.
1. The Fusion version and host from the metrics header record.
1. The cloud provider, the bucket region, and the compute region.
1. The Seqera Platform run URL, or the task work directory path.

That bundle lets Seqera reconstruct the timeline without a further round trip.

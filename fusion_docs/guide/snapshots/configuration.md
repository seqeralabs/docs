---
title: Advanced configuration
description: "Advanced configuration options for Fusion Snapshots"
date: "2024-11-29"
tags: [fusion, fusion snapshots, snapshot, configuration, nextflow]
---

Fusion Snapshots work optimally with default configuration for most workloads. You typically do not need to modify these settings unless you have specific organizational policies, experience issues with default behavior, or have edge case requirements.

:::tip
For troubleshooting, focus on task memory usage and instance selection before adjusting these advanced configuration options. See [Troubleshooting](../../troubleshooting.md) for more information.
:::

## Retry handling

When spot instances are reclaimed, you can configure how Nextflow retries the tasks. There are two approaches:

- [Automatic retries with `maxSpotAttempts`](#automatic-retries-with-maxspotattempts)
- [Fine-grained retries with `errorStrategy`](#fine-grained-retries-with-errorstrategy)


### Automatic retries with `maxSpotAttempts`

The simplest approach uses `maxSpotAttempts` to automatically retry any task that fails due to spot reclamation, regardless of the specific failure reason. When you enable Fusion Snapshots, Nextflow automatically sets `maxSpotAttempts = 5`. This allows the checkpoint to be restored on a new instance after reclamation up to 5 times.

**Increase retries**

If you experience frequent spot reclamations, increase `maxSpotAttempts` above `5`:

- AWS Batch:

    ```groovy
    aws.batch.maxSpotAttempts = 10
    ```

- Google Cloud Batch:

    ```groovy
    google.batch.maxSpotAttempts = 10
    ```

**Disable retries**

To disable automatic retries, set `maxSpotAttempts = 0`:

- AWS Batch:

    ```groovy
    aws.batch.maxSpotAttempts = 0
    ```

- Google Cloud Batch:

    ```groovy
    google.batch.maxSpotAttempts = 0
    ```

### Fine-grained retries with `errorStrategy`

For fine-grained control of retries, configure your Nextflow [`errorStrategy`](https://www.nextflow.io/docs/latest/reference/process.html#errorstrategy) to implement retry logic based on specific checkpoint failure types. This allows you to handle different failure scenarios (e.g., checkpoint dump failures differently from restore failures) differently.

To configure, set to `maxSpotAttempts = 0` and add an [`errorStrategy`](https://www.nextflow.io/docs/latest/reference/process.html#errorstrategy) to your process configuration. For example:

```groovy
process {
    maxRetries = 2
    errorStrategy = {
        if (task.exitStatus == 175) {
            return 'retry'  // Retry checkpoint dump failures
        } else {
            return 'terminate'  // Don't retry other failures
        }
    }
}
```

**Exit codes**:

- `175`: Checkpoint dump failed — The snapshot could not be saved (e.g., insufficient memory, I/O errors)
- `176`: Checkpoint restore failed — The snapshot could not be restored on the new instance

**Configuration options**:

See [`errorStrategy`](https://www.nextflow.io/docs/latest/reference/process.html#errorstrategy) for more configuration options.

## TCP connection handling

By default, Fusion Snapshots use `established` mode to preserve TCP connections during checkpoint operations. This works well for plain TCP connections. If your application uses SSL/TLS connections (HTTPS, SSH, etc.), you need to configure TCP close mode because CRIU cannot preserve encrypted connections.

To close all TCP connections during checkpoint operations, set:

```groovy
process.containerOptions = '-e FUSION_SNAPSHOTS_TCP_MODE=close'
```

**Options:**

- `established`: Preserve TCP connections (default)
- `close`: Close all TCP connections during checkpoint

## Debug logging

By default, Fusion Snapshots use `WARN` level logging (warnings and errors only). If you are troubleshooting checkpoint issues, you can enable more detailed logging to help diagnose problems.

To enable debug logging, set:

```groovy
process.containerOptions = '-e FUSION_SNAPSHOT_LOG_LEVEL=debug'
```

**Log levels**:

- `ERROR`: Only critical errors
- `WARN`: Warnings and errors (default)
- `INFO`: General informational messages
- `DEBUG`: Detailed debug information

:::warning
Use `debug` logging only when troubleshooting. It is verbose and may impact performance.
:::

## Resource limits

By default, tasks can request any amount of resources. If a task requests more resources than are available on a single instance, the job waits indefinitely and never runs. Use the `process.resourceLimits` directive to set maximum requested resources below the capacity of a single instance.

Setting resource limits ensures tasks can checkpoint successfully and prevents jobs from becoming unschedulable. For example:

```groovy
// AWS Batch example (120-second reclamation window)
process.resourceLimits = [cpus: 32, memory: '60.GB']

// Google Cloud Batch example (Up to 30-second reclamation window - more conservative)
process.resourceLimits = [cpus: 16, memory: '20.GB']
```

See [AWS Batch](./aws.md) or [Google Cloud Batch](./gcp.md) for more information about reclamation windows. See [`resourceLimits`](https://www.nextflow.io/docs/latest/reference/process.html#resourcelimits) for more configuration options.

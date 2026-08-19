---
title: Google Cloud Batch
description: "Fusion Snapshots configuration and best practices for Google Cloud Batch"
date created: "2024-11-29"
last updated: "2026-08-19"
tags: [fusion, fusion snapshots, storage, compute, snapshot, gcp, google, batch]
---

Fusion Snapshots enable checkpoint/restore functionality for Nextflow processes running on Google Cloud Batch preemptible instances. When a preemption occurs, Google Batch provides up to 30 seconds before instance termination.

:::warning
Google Cloud [guarantees only up to 30 seconds](https://cloud.google.com/compute/docs/instances/spot) before instance termination. Careful instance selection and conservative memory planning are critical for successful checkpoints.
:::

## Seqera Platform compute environment requirements

Fusion Snapshots require the following Seqera Platform compute environment configuration:

- **Provider**: Google Batch
- **Work directory**: GCS bucket in the same region as compute resources
- **Fusion**: Enabled
- **Wave**: Enabled
- **Fusion Snapshots (beta)**: Enabled
- **Provisioning model**: Spot

:::tip Configuration
You must set the number of spot retries you want to attempt to a sensible number. The default is 0. For configuration options, see [Advanced configuration](./configuration.md).

If your runs encounter Google Cloud Batch infrastructure failures beyond Spot reclamation, see [Retrying Google Cloud Batch infrastructure failures](./configuration.md#retrying-google-cloud-batch-infrastructure-failures).
:::

## Incremental snapshots

[Incremental snapshots](./index.md#incremental-snapshots) are enabled by default on x86_64 instances and capture only changed memory pages between checkpoints. This is particularly beneficial for Google Batch's shorter reclamation window. Use x86_64 instances to enable incremental snapshots.

## Machine type guidance

Fusion Snapshots on Google Batch work best when the underlying compute environment uses machine types that provide local SSD support and enough memory bandwidth to complete checkpoints within the preemption window.

- If you do not specify a machine type, Seqera Platform selects a VM from Google Cloud families that support local SSDs.
- Any machine type you specify for Fusion Snapshots must support local SSDs.
- For production workloads, start with an `n2-highmem-16-lssd` VM or larger, then validate checkpoint duration with your workload profile.
- If your workload has larger memory footprints, increase the machine size conservatively and re-test snapshot and restore times before widening usage.

See [Google Cloud Batch compute environment configuration](https://docs.seqera.io/platform-cloud/compute-envs/google-cloud-batch#use-fusion-v2) for the underlying Fusion v2 compute recommendations that also apply to Fusion Snapshots on Google Batch.

## Resource limits

A single job can request more resources than are available on a single instance. To prevent this, set resource limits using the `process.resourceLimits` directive in your Nextflow configuration. See [Resource limits](./configuration.md#resource-limits) for more information.

## Storage and cleanup

Fusion writes snapshot data to a `.fusion/dump/` directory inside each task work directory in your GCS work bucket. Google Cloud bills it as standard GCS storage in that bucket. Fusion Snapshots write ordinary objects. They do not use GCS object versioning, and they do not create or require a second bucket. Enabling Fusion Snapshots does not change the storage class or the versioning configuration of your work bucket.

When a task process exits, Fusion removes the memory image files from that task's checkpoints, including checkpoints written by earlier attempts of the same task. Small metadata and log files remain. Snapshot data has no expiry. Anything left behind by a run that was killed before its tasks could exit stays in the bucket until you delete it.

Check the work directories of runs that ended abnormally for leftover `.fusion/dump/` directories, and remove them if you no longer need the diagnostic data. See [Snapshot storage and lifecycle](./index.md#snapshot-storage-and-lifecycle) for details.

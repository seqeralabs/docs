---
title: Google Cloud Batch
description: "Fusion Snapshots configuration and best practices for Google Cloud Batch"
date created: "2024-11-29"
last updated: "2025-12-19"
tags: [fusion, fusion-snapshots, storage, compute, snapshot, gcp, google, batch]
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
Fusion Snapshots work with sensible defaults (5 automatic retry attempts). For configuration options, see [Advanced configuration](./configuration.md).
:::

## Incremental snapshots

[Incremental snapshots](./index.md#incremental-snapshots) are enabled by default on x86_64 instances and capture only changed memory pages between checkpoints. This is particularly beneficial for Google Batch's shorter reclamation window. Use x86_64 instances to enable incremental snapshots.

## Machine type guidance

Fusion Snapshots on Google Batch work best when the underlying compute environment uses machine types that provide local SSD support and enough memory bandwidth to complete checkpoints within the preemption window.

- If you don't specify a machine type, Seqera Platform selects a VM from Google Cloud families that support local SSDs.
- Any machine type you specify for Fusion Snapshots must support local SSDs.
- For production workloads, start with an `n2-highmem-16-lssd` VM or larger, then validate checkpoint duration with your workload profile.
- If your workload has larger memory footprints, increase the machine size conservatively and re-test snapshot and restore times before widening usage.

See [Google Cloud Batch compute environment configuration](../../platform-cloud/docs/compute-envs/google-cloud-batch.md#use-fusion-v2) for the underlying Fusion v2 compute recommendations that also apply to Fusion Snapshots on Google Batch.

## Resource limits

A single job can request more resources than are available on a single instance. To prevent this, set resource limits using the `process.resourceLimits` directive in your Nextflow configuration. See [Resource limits](./configuration.md#resource-limits) for more information.

## Manual cleanup

The `/fusion` folder in object storage may need manual cleanup. Administrators should verify Fusion has properly cleaned up and remove the folder if necessary.

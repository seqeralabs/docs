---
title: Google Cloud Batch
description: "Fusion Snapshots configuration and best practices for Google Cloud Batch"
date created: "2024-11-29"
last updated: "2025-12-19"
tags: [fusion, fusion-snapshots, storage, compute, snapshot, gcp, google, batch]
---

Fusion Snapshots enable checkpoint/restore functionality for Nextflow processes running on Google Cloud Batch preemptible instances. When a preemption occurs, Google Batch provides up to 30 seconds before instance termination.

:::note
When using Google Cloud Batch, Fusion Snapshots is currently only available for Seqera Cloud.
:::

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

## Resource limits

A single job can request more resources than are available on a single instance. To prevent this, set resource limits using the `process.resourceLimits` directive in your Nextflow configuration. See [Resource limits](./configuration.md#resource-limits) for more information.

## Manual cleanup

The `/fusion` folder in object storage may need manual cleanup. Administrators should verify Fusion has properly cleaned up and remove the folder if necessary.

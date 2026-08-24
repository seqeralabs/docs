---
title: Fusion Snapshots
description: "Checkpoint and restore for Nextflow tasks on Spot and preemptible instances"
date created: "2024-11-29"
last updated: "2026-08-19"
tags: [fusion, fusion snapshots, storage, snapshot, checkpoint, restore]
---

Fusion Snapshots enable checkpoint/restore functionality for Nextflow pipeline processes running on cloud Spot/preemptible instances. When a cloud provider reclaims an instance, Fusion Snapshots creates a checkpoint of the running process and restores it on a new instance, allowing the process to resume exactly where it left off.

Key benefits of Fusion Snapshots include:

- **Cost savings**: Use Spot instances without risk of lost work.
- **Time efficiency**: Resume from interruption point instead of restarting tasks.
- **Resource optimization**: Avoid recomputing completed work.
- **Automatic operation**: Your pipelines require no code changes.

## Cloud provider support

Fusion Snapshots is available for the following cloud providers:

- **[AWS Batch with Spot instances](./aws.md)**: 120-second guaranteed reclamation window.
- **[Google Batch with preemptible instances](./gcp.md)**: Up to 30-second reclamation window.

## How Fusion Snapshots work

Fusion Snapshots use [CRIU](https://criu.org/) (Checkpoint Restore in Userspace) to capture the complete state of a running process, including:

- Process memory
- Open files and file descriptors
- Process tree and relationships
- Execution state

### Snapshot triggers

Fusion takes snapshots automatically. Your pipeline does not call a snapshot command, and individual file writes do not trigger snapshots. Two events trigger a snapshot:

- **On a timer**: On `x86_64` instances, Fusion checkpoints the running process every 5 minutes by default. These periodic checkpoints are [incremental snapshots](#incremental-snapshots). Each one captures only the memory pages that changed since the previous checkpoint, and the process keeps running.
- **On reclamation**: Fusion detects a Spot interruption notice on AWS or a preemption notice on Google Cloud, then freezes the process and takes a final checkpoint within the reclamation window.

Fusion takes snapshots only on Spot and preemptible instances, never on an on-demand instance, even when Fusion Snapshots are enabled for the compute environment.

:::note
Periodic checkpoints require Fusion 2.5.8 or later. Earlier versions checkpoint only when an instance is reclaimed.
:::

When an instance is reclaimed:

1. Fusion freezes the process and takes the final checkpoint.
1. Fusion writes the snapshot data to the task work directory in object storage.
1. The task retries on a new instance, where Fusion downloads and restores the process state.
1. The process continues from the point of interruption.

## Incremental snapshots

Incremental snapshots optimize performance by capturing only changed memory pages between checkpoints. This reduces snapshot time and data transfer. Fusion Snapshots automatically perform incremental snapshots on `x86_64` instances.

Key features of incremental snapshots include:

- **Pre-dumps**: Periodic checkpoints that capture only the memory pages that changed since the previous checkpoint. The first pre-dump after a task starts, after a restore, or after a failed pre-dump captures the full memory footprint.
- **Full dumps**: The final checkpoint, taken when the instance is reclaimed. It stops the process and completes the chain. Where a chain of pre-dumps exists, the full dump writes only the pages that changed since the last pre-dump. Writing less data keeps the final checkpoint inside the reclamation window.
- **Automatic**: Enabled by default on `x86_64` instances, at a 5-minute interval. No configuration needed.

On ARM64 instances, Fusion takes no periodic checkpoints. The only snapshot is the full dump taken when the instance is reclaimed. That dump must transfer the entire memory footprint within the reclamation window.

## Snapshot storage and lifecycle

Fusion writes snapshot data to a `.fusion/dump/` directory inside the task work directory, in the same S3 or Google Cloud Storage bucket that holds the rest of the run's work directory. For a task with the work directory `s3://my-bucket/work/a1/b2c3d4`, Fusion writes checkpoint data to `s3://my-bucket/work/a1/b2c3d4/.fusion/dump/`.

The checkpoint files are ordinary objects, written through the Fusion mount like any other pipeline output. Fusion Snapshots do not use S3 or Google Cloud Storage object versioning, and they do not create a separate bucket. Your cloud provider bills snapshot data as standard object storage in the work directory bucket. The amount of data is proportional to the memory the task uses.

### Checkpoint size

Each checkpoint writes the memory pages that changed since the previous checkpoint in the same chain. A task with a large or rapidly changing memory footprint writes more data per checkpoint than a small one.

Two kinds of checkpoint write the full memory footprint:

- The first checkpoint after a task starts.
- Any checkpoint with no usable predecessor, such as the final checkpoint on an ARM64 instance.

Fusion does not keep snapshot data between tasks or reuse it across runs. Snapshot data exists only to restore its own task on a new instance.

### Cleanup

When the task process exits, Fusion removes the memory image files (the bulk of the snapshot data) from every checkpoint in the task work directory. Cleanup runs whether the task succeeded or failed, and covers checkpoints written by earlier attempts of the same task.

The small files left behind are the CRIU metadata and log files described in [Fusion Snapshots troubleshooting](../../troubleshooting/fusion-snapshots.md). Keep them if you have an open support case. They are the diagnostic data Seqera support asks for.

Snapshot data has no expiry. Nothing deletes it on a schedule or after a retention period. Anything the cleanup step does not remove stays in the bucket until you delete it, including memory images from a run that was killed before its tasks could exit.

:::caution
Avoid bucket lifecycle rules that delete objects under `.fusion/dump/` by age, unless the rule is scoped so that it can only fire after a pipeline has completed. Deleting checkpoint data while a task is still running prevents Fusion from restoring the task after an interruption. To clear snapshot data from completed runs, delete the work directory, or use the Nextflow [`cleanup`](https://docs.seqera.io/nextflow/reference/config/unscoped#cleanup) option to remove it after a successful run.
:::

## Get started

To get started with your cloud provider, see:

- [AWS Batch](./aws.md)
- [Google Cloud Batch](./gcp.md)

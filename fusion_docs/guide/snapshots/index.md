---
title: Fusion Snapshots Overview
description: "Introduction to Fusion Snapshots checkpoint/restore functionality"
date: "21 Nov 2024"
tags: [fusion, storage, snapshot, checkpoint, restore]
---

Fusion Snapshots enable checkpoint/restore functionality for Nextflow pipeline processes running on cloud spot/preemptible instances. When a cloud provider reclaims an instance, Fusion Snapshots creates a checkpoint of the running process and restores it on a new instance, allowing the process to resume exactly where it left off.

## How it works

Fusion Snapshots uses [CRIU](https://criu.org/) (Checkpoint Restore in Userspace) to capture the complete state of a running process, including:

- Process memory
- Open files and file descriptors
- Process tree and relationships
- Execution state

When the system detects a spot instance interruption:

1. **Checkpoint**: The system freezes the process and creates a snapshot of its state.
1. **Upload**: Snapshot data is kept in sync with remote object storage via Fusion.
1. **Restore**: On a new instance, the process state is downloaded and restored.
1. **Resume**: The process continues execution from the exact point it was interrupted.

## Key benefits

- **Cost savings**: Use spot instances without risk of lost work
- **Time efficiency**: Resume from interruption point instead of restarting tasks
- **Resource optimization**: Avoid recomputing completed work
- **Automatic operation**: Your pipelines require no code changes

## Cloud providers

Fusion Snapshots currently supports:

- **[AWS Batch with Spot instances](./aws.md)**: 120-second guaranteed reclamation window
- **[Google Batch with preemptible instances](./gcp.md)**: Up to 30-second reclamation window

## Incremental snapshots

On x86_64 instances only, Fusion Snapshots performs incremental snapshots automatically to optimize performance:

- **Pre-dumps**: Captures only changed memory pages since the last checkpoint
- **Full dumps**: Complete process state captured periodically
- **Automatic**: Enabled by default, no configuration needed
- **Efficient**: Reduces checkpoint time and data transfer

See cloud-specific documentation for detailed incremental snapshot behavior.

## Next steps

For more setup, configuration options, and troubleshooting, see:

- [AWS Batch](./aws.md)
- [Google Batch](./gcp.md)
- [Advanced configuration](./configuration.md)
- [Troubleshooting](./troubleshooting.md)

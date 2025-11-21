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

When a spot instance interruption is detected:

1. **Checkpoint**: The system freezes the process and creates a snapshot of its state
2. **Upload**: Snapshot data is kept in sync with remote object storage via Fusion
3. **Restore**: On a new instance, the process state is downloaded and restored
4. **Resume**: The process continues execution from the exact point it was interrupted

## Key benefits

- **Cost savings**: Use spot instances without risk of lost work
- **Time efficiency**: Resume from interruption point instead of restarting tasks
- **Resource optimization**: Avoid recomputing completed work
- **Automatic operation**: No code changes required in your pipelines

## Cloud provider support

Fusion Snapshots currently supports:

- **[AWS Batch with Spot instances](aws.md)** (120-second guaranteed reclamation window)
- **[Google Batch with Preemptible instances](gcp.md)** (up to 30-second reclamation window)

## Incremental snapshots

On X86_64 instances only, Fusion Snapshots does incremental snapshots automatically to optimize performance:

- **Pre-dumps**: Capture only changed memory pages since the last checkpoint
- **Full dumps**: Complete process state captured periodically
- **Automatic**: Enabled by default, no configuration needed
- **Efficient**: Reduces checkpoint time and data transfer

See cloud-specific documentation for detailed incremental snapshot behavior.

## Next steps

- **AWS Batch users**: See [Fusion Snapshots for AWS Batch](aws.md)
- **Google Batch users**: See [Fusion Snapshots for Google Batch](gcp.md)
- **Configuration**: See [Configuration Guide](configuration.md) (optional, for edge cases)
- **Troubleshooting**: See [Troubleshooting Guide](troubleshooting.md)

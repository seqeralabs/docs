---
title: Fusion Snapshots for Google Batch
description: "Fusion Snapshots configuration and best practices for Google Batch"
date: "21 Nov 2024"
tags: [fusion, storage, compute, snapshot, gcp, google, batch]
---

Fusion Snapshots enable checkpoint/restore functionality for Nextflow processes running on Google Batch preemptible instances. When a preemption occurs, the task is checkpointed and restored on a new instance.

:::warning Short and variable reclamation window
Google Batch provides **up to 30 seconds** before instance termination (not guaranteed - could be less), significantly shorter than AWS Batch's guaranteed 120 seconds. Careful instance selection and conservative memory planning are critical for successful checkpoints.
:::

## Requirements

### Seqera Platform compute environment

- **Provider**: Google Batch
- **Work directory**: GCS bucket in the same region as compute resources
- **Enable Fusion Snapshots (beta)**
- **Provisioning model**: Spot

:::tip Configuration
Fusion Snapshots work with sensible defaults (5 automatic retry attempts). For advanced configuration options like changing retry behavior or TCP handling, see the [Configuration Guide](configuration.md).
:::

## Incremental snapshots

Incremental snapshots are enabled by default on X86_64 instances, capturing only changed memory pages between checkpoints. This is particularly beneficial for Google Batch's shorter reclamation window.

### Key guidelines

- Use **x86_64** instances (incremental snapshots enabled by default)


### Resource limits

It's possible for a single job to request more resources than are available on a single instance. This can be configured using the `process.resourceLimits` directive in your Nextflow configuration.



```groovy
process.resourceLimits = [cpus: 16, memory: '20.GB']
```

## Troubleshooting

- **Exit code 175**: Dump failed, likely due to timeout because too much memory is used and cannot be dumped fast enough.
- **Exit code 176**: Restore failed. Check logs and verify checkpoint data integrity.

For detailed troubleshooting, see [Troubleshooting Guide](troubleshooting.md).

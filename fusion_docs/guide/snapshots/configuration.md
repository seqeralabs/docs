---
title: Advanced configuration
description: "Advanced configuration options for Fusion Snapshots"
date: "2024-11-22"
tags: [fusion, snapshot, configuration, nextflow]
---

Fusion Snapshots work optimally with default configuration for most workloads. You typically don't need to modify these settings unless you have specific organizational policies, experience issues with default behavior, or have edge case requirements.

:::tip
For troubleshooting, focus on task memory usage and instance selection before adjusting these advanced configuration options.
:::

## Spot reclamation retries

You can control how many times Nextflow automatically retries a task after spot instance reclamation.

**Default with Fusion Snapshots enabled**: `5`
**Default without Fusion Snapshots**: `0`

:::info
When you enable Fusion Snapshots, Nextflow automatically sets `maxSpotAttempts = 5` to enable automatic retries on spot reclamation. This allows the checkpoint to be restored on a new instance after reclamation.
:::


### When to customize

- Increase above `5` if you expect frequent spot reclamations
- Set to `0` if you want to handle retries only through error strategies

**AWS Batch**

## Error retry strategy

Configure how Nextflow handles checkpoint failures. This is the recommended approach for retry logic.

```groovy
process {
    maxRetries = 2
    errorStrategy = {
        if (task.exitStatus == 175) {
            return 'retry'  // Retry on checkpoint dump failure
        } else {
            return 'terminate'
        }
Using error strategy gives you fine-grained control over retry behavior per exit code, while `maxSpotAttempts` retries all spot reclamations regardless of the cause. This is the recommended approach for retry logic.
}
```

**Exit codes**:
- `175`: Checkpoint dump failed
- `176`: Restore failed

**Why this is better**: Using error strategy gives you fine-grained control over retry behavior per exit code, while `maxSpotAttempts` retries all spot reclamations regardless of the cause.

## TCP connection handling

Control how TCP connections are handled during checkpoint operations.

**Default**: `established` (preserve TCP connections)

```groovy
process.containerOptions = '-e FUSION_SNAPSHOTS_TCP_MODE=close'
```

**Options**:
- `established`: Preserve TCP connections (default, for plain TCP)
- `close`: Close all TCP connections during checkpoint
Fusion Snapshots preserve TCP connections during checkpoint operations by default. This works well for plain TCP connections.

Change this setting to `close` if your application uses SSL/TLS connections (e.g., HTTPS, SSH), as CRIU cannot preserve encrypted connections.


Prevent tasks from requesting resources that exceed available capacity.

```groovy
// AWS Batch example
process.resourceLimits = [cpus: 32, memory: '60.GB']

// Google Batch example (more conservative for 30s window)
process.resourceLimits = [cpus: 16, memory: '20.GB']
```

**When to use**:
- Prevent jobs from becoming unschedulable
- Ensure tasks can checkpoint within reclamation windows
- Enforce organization-wide resource policies

See [AWS Batch](aws.md#best-practices) or [Google Batch](gcp.md#best-practices) for recommended memory limits.

## Summary

Most users never need to modify these settings. Fusion Snapshots are designed to work optimally with default configuration. Only adjust these settings if:

- You have specific organizational policies
- You're experiencing issues with the default behavior
- You have edge case requirements not covered by defaults

For most troubleshooting scenarios, focus on task memory usage and instance selection rather than configuration changes.

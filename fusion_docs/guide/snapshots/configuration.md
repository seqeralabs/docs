---
title: Fusion Snapshots Configuration
description: "Advanced configuration options for Fusion Snapshots"
date: "22 Nov 2024"
tags: [fusion, snapshot, configuration, nextflow]
---

Fusion Snapshots are designed with sensible defaults and typically require no additional configuration. The settings below are provided for edge cases and advanced use scenarios.

:::note
You likely don't need to change these settings. Fusion Snapshots work out of the box with optimal defaults for most workloads.
:::

## Spot reclamation retries

Control how many times Nextflow automatically retries a task after spot instance reclamation.

**Default with Fusion Snapshots enabled**: `5` (automatic retries on spot reclamation)
**Default without Fusion Snapshots**: `0` (no automatic retries)

:::info
When Fusion Snapshots are enabled, Nextflow automatically sets `maxSpotAttempts = 5` to enable automatic retry on spot reclamation. This allows the checkpoint to be restored on a new instance after reclamation.
:::

### AWS Batch

```groovy
aws.batch.maxSpotAttempts = 10  // Increase retries beyond default of 5
aws.batch.maxSpotAttempts = 0   // Disable automatic retries
```

### Google Batch

```groovy
google.batch.maxSpotAttempts = 10  // Increase retries beyond default of 5
google.batch.maxSpotAttempts = 0   // Disable automatic retries
```

**When to customize**:
- Increase above 5 if you expect frequent spot reclamations
- Set to 0 if you want to handle retries only through error strategies
- Most users should keep the default (5)

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
    }
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

**When to use**: Set to `close` if your application uses SSL/TLS connections (HTTPS, SSH, etc.), as CRIU cannot preserve encrypted connections.

## Debug logging

Enable detailed logging for troubleshooting.

**Default**: `WARN` (warnings and errors only)

```groovy
process.containerOptions = '-e FUSION_SNAPSHOT_LOG_LEVEL=debug'
```

**Log levels**:
- `ERROR`: Only critical errors
- `WARN`: Warnings and errors (default)
- `INFO`: General informational messages
- `DEBUG`: Detailed debug information

**When to use**: Only for troubleshooting checkpoint issues. Debug logs are verbose and may impact performance.

## Resource limits

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

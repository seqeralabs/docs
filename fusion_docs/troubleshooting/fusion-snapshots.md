---
title: Fusion Snapshots
description: "Troubleshooting for Fusion Snapshots"
date created: "2025-11-29"
last updated: "2025-01-12"
tags: [troubleshooting, fusion, fusion-snapshots, configuration]
---

When working with Fusion Snapshots, you might encounter the following issues.

## Exit code `175`: Checkpoint dump failed

Task fails with exit code `175`, indicating the checkpoint dump operation did not complete successfully.

This issue can occur due to:

1. Checkpoint timeout - The process could not be saved within the reclamation window (typically due to high memory usage). The reclamation windows are:
   - AWS Batch: 120 seconds (guaranteed)
   - Google Batch: Up to 30 seconds (not guaranteed)
   - Other factors: Large number of open file descriptors, complex process trees
1. Insufficient network bandwidth - Cannot upload checkpoint data fast enough.
1. Disk space issues - Not enough local storage for checkpoint files.

To resolve this issue:

1. Reduce memory usage:

   - Lower memory requested by tasks
   - Process smaller data chunks
   - Set `process.resourceLimits` to enforce limits:

      ```groovy
      // AWS Batch example
      process.resourceLimits = [cpus: 32, memory: '60.GB']

      // Google Batch example (more conservative for 30s window)
      process.resourceLimits = [cpus: 16, memory: '20.GB']
      ```

1. Increase network bandwidth:

   - Use instance types with higher guaranteed network bandwidth.
   - Ensure memory:bandwidth ratio is appropriate (5:1 or better for AWS).

1. Enable incremental snapshots (automatic on `x86_64`):

   - Verify you're using `x86_64` architecture: `uname -m`
   - Avoid ARM64 instances if checkpoints are failing.

1. Configure retry strategy:

   ```groovy
      process {
         maxRetries = 2
         errorStrategy = {
            if (task.exitStatus == 175) {
                  return 'retry'
            } else {
                  return 'terminate'
            }
         }
      }
   ```

See [AWS Batch instance selection](../guide/snapshots/aws#selecting-an-ec2-instance) or [Google Batch best practices](../guide/snapshots/gcp) for recommended configurations.

:::tip
For a comprehensive explanation of exit code `175`, see [Exit Codes](./error-codes-exit-messages#exit-codes).
:::

## Exit code `176`: Checkpoint restore failed

Task fails with exit code `176` when attempting to restore from a checkpoint.

This issue can occur due to:

1. Corrupted checkpoint - Previous checkpoint did not complete properly.
1. Missing checkpoint files - Checkpoint data missing or inaccessible in object storage.
1. State conflict - Attempting to restore while dump still in progress.
1. Environment mismatch - Different environment between checkpoint and restore.

To resolve this issue:

1. Check if previous checkpoint completed:
   - Review logs for "Dumping finished successfully".
   - If the "Dumping finished successfully" message is missing, it means the previous checkpoint timed out with a `175` exit error.

1. Verify checkpoint data exists:
   - Check that the `.fusion/dump/` work directory contains checkpoint files.
   - Ensure that the S3/GCS bucket is accessible.
   - If the bucket is missing, open a support ticket. See [Getting help](#getting-help) for more information.

1. Configure retry for dump failures first:
   - Handle exit code `175` with retry. See [Retry handling](../guide/snapshots/configuration#retry-handling) for more information.

:::tip
For a comprehensive explanation of exit code `176`, see [Exit Codes](./error-codes-exit-messages#exit-codes).
:::

## Long checkpoint times

Checkpoints take longer than expected, approaching timeout limits.

This issue can occur due to:

1. High memory usage - Memory is typically the primary factor affecting checkpoint time.
1. ARM64 architecture - Only full dumps available (no incremental snapshots).
1. Insufficient network bandwidth - Instance bandwidth too low for memory size.
1. Open file descriptors - Large number of open files or complex process trees.

To resolve this issue:

1. For AWS Batch (120-second window):
   - Use instances with 5:1 or better memory:bandwidth ratio.
   - Use `x86_64` instances for incremental snapshot support (`c6id`, `m6id`, `r6id` families).
   - Check architecture: `uname -m`

1. For Google Batch (30-second window):
   - Use `x86_64` instances (mandatory for larger workloads).
   - Use more conservative memory limits.
   - Consider smaller instance types with better ratios.

1. Review instance specifications:
   - Verify guaranteed network bandwidth (not "up to" values).
   - Prefer NVMe storage instances on AWS (instances with `d` suffix).

See [Selecting an EC2 instance](../guide/snapshots/aws#selecting-an-ec2-instance) for detailed recommendations.

## Frequent checkpoint failures

Checkpoints consistently fail across multiple tasks.

This issue can occur due to:

1. Task too large for reclamation window - Memory usage exceeds what can be checkpointed in time (more common on Google Batch with 30-second window).
1. Network congestion or throttling - Bandwidth lower than instance specifications.
1. ARM64 architecture limitations - Full dumps only, requiring much more time and bandwidth.

To resolve this issue:

1. Split large tasks:
   - Break into smaller, checkpointable units.
   - Process data in chunks.

1. Switch to `x86_64` instances:
   - Essential for Google Batch.
   - Recommended for AWS Batch tasks > 40 GiB.

1. Adjust memory limits:

   ```groovy
      // For AWS Batch
      process.resourceLimits = [cpus: 32, memory: '60.GB']

      // For Google Batch (more conservative)
      process.resourceLimits = [cpus: 16, memory: '20.GB']
   ```

## SSL/TLS connection errors after restore

Applications fail after restore with connection errors, especially HTTPS connections.

This issue occurs when applications use HTTPS connections, as CRIU cannot preserve encrypted TCP connections (SSL/TLS).

To resolve this issue, configure TCP close mode to drop connections during checkpoint:
```groovy
process.containerOptions = '-e FUSION_SNAPSHOTS_TCP_MODE=close'
```

Applications will need to re-establish connections after restore. See [TCP connection handling](../guide/snapshots/configuration#tcp-connection-handling) for more information.

## Debugging workflow

To diagnose checkpoint problems:

1. Check the exit code to identify the failure type:

   - Exit code `175`: Checkpoint dump failed - The snapshot could not be saved.
   - Exit code `176`: Checkpoint restore failed - The snapshot could not be restored.
   - Other exit codes: Likely an application error, not snapshot-related.

1. Review task logs:

   - Check `.command.log` in the task work directory for Fusion Snapshots messages (prefixed with timestamps).

     :::tip
     Enable `debug` logging for more details.

     ```groovy
     process.containerOptions = '-e FUSION_SNAPSHOT_LOG_LEVEL=debug'
     ```
     :::

1. Inspect your checkpoint data:

   1. Open the `.fusion/dump/` folder:

      ```console
      .fusion/dump/
      ├── 1/                   # First dump
      │   ├── pre_*.log        # Pre-dump log (if incremental)
      │   └── <CRIU files>
      ├── 2/                   # Second dump
      │   ├── pre_*.log
      │   └── <CRIU files>
      ├── 3/                   # Third dump (full)
      │   ├── dump_*.log       # Full dump log
      │   ├── restore_*.log    # Restore log (if restored)
      │   └── <CRIU files>
      └── dump_metadata        # Metadata tracking all dumps
      ```

   1. For incremental dumps (PRE type), check for success markers at the end of the `pre_*.log` file:

      ```console
      (66.525687) page-pipe: Killing page pipe
      (66.563939) irmap: Running irmap pre-dump
      (66.610871) Writing stats
      (66.658902) Pre-dumping finished successfully
      ```

   1. For full dumps (FULL type), check for success markers at the end of the `dump_*.log` file:

      ```console
      (25.867099) Unseizing 90 into 2
      (27.160829) Writing stats
      (27.197458) Dumping finished successfully
      ```

   1. If the log ends abruptly without success message, check the last timestamp:

      ```console
      (121.37535) Dumping path for 329 fd via self 353 [/path/to/file.tmp]
      (121.65146) 90 fdinfo 330: pos: 0x4380000 flags: 100000/0
      # Log truncated - instance was reclaimed before dump completed
      ```

      - AWS Batch: Timestamps near 120 seconds indicate instance terminated during dump.
      - Google Batch: Timestamps near 30 seconds indicate instance terminated during dump.

      Cause: Task memory too large or bandwidth too low for reclamation window.

    1. For restore operations, check for a success marker at the end of the `restore_*.log` file:

         ```console
               (145.81974) Running pre-resume scripts
               (145.81994) Restore finished successfully. Tasks resumed.
               (145.82001) Writing stats
         ```

1. Verify your configuration:

   Confirm your environment is properly configured:

   - Instance type has sufficient network bandwidth.
   - Memory usage is within safe limits for your cloud provider.
   - Architecture is `x86_64` (not ARM64) if experiencing issues.
   - Fusion Snapshots are enabled in your compute environment.

1. Test with different instance types. If uncertain:

    - Run the same task with different instance types that have better disk iops and bandwidth guarantees and verify if Fusions Snapshots work there.
    - Decrease memory usage to a manageable amount.

:::tip
For detailed information about error codes and logging, see [Error reference](./error-codes-exit-messages).
:::

## Getting help

When contacting Seqera support about Fusion Snapshots issues, provide the following information to help diagnose the problem:

1. Task information:

   - Nextflow version
   - Cloud provider (AWS Batch or Google Cloud Batch)
   - Instance type used
   - Memory and CPU requested
   - Linux kernel version

1. Error details:

   - Exit code (especially `175` or `176` for snapshot failures)
   - Task logs from the work directory (`.command.log`)
   - Fusion Snapshots logs (if available)
   - Timestamp of failure

1. Configuration:

   - Compute environment settings in Platform
   - Nextflow config related to Fusion Snapshots (`fusion.snapshots.*` settings)
   - Architecture (`x86_64` or ARM64)

1. Dump data (if available):

   Diagnostic data from snapshot operations can help identify the root cause:

   - Preferred: Complete `.fusion/dump/` directory from the task work directory.
   - Minimum: The `dump_metadata` file and all `*.log` files from numbered dump folders.

   If the directory is too large to share, prioritize the metadata and log files over the full checkpoint data.

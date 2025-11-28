---
title: Troubleshooting
description: "Troubleshooting guide for Fusion Snapshots issues"
date: "21 Nov 2024"
tags: [fusion, snapshot, troubleshooting, support]
---

## GCP

- **Exit code 175**: Dump failed, likely due to timeout because too much memory is used and cannot be dumped fast enough.
- **Exit code 176**: Restore failed. Check logs and verify checkpoint data integrity.

For detailed troubleshooting, see [Troubleshooting Guide](troubleshooting.md).

## AWS Troubleshooting

- **Exit code 175**: Dump failed, likely due to timeout. To resolve this, reduce memory usage or increase bandwidth.
- **Exit code 176**: Restore failed. Check the logs and verify checkpoint data integrity.
- **Long checkpoint times**: Review your instance bandwidth and consider using x86_64 instances for incremental snapshots.
- **State stuck in DUMPING**: Previous checkpoint exceeded reclamation window.

For detailed troubleshooting, see [Fusion Snapshots troubleshooting](./troubleshooting.md).


This guide helps you diagnose and resolve common Fusion Snapshots issues.

## Understanding exit codes

Fusion Snapshots uses specific exit codes to indicate failure types:

- **Exit code 175**: Checkpoint (dump) operation failed
- **Exit code 176**: Restore operation failed

## Common issues

### Exit code 175: Checkpoint failed

**Symptom**: Task fails with exit code 175, indicating the checkpoint operation didn't complete successfully.

**Common causes**:

1. **Checkpoint timeout**: Process couldn't be saved within the reclamation window (typically due to high memory usage)
   - AWS Batch: 120 seconds (guaranteed)
   - Google Batch: up to 30 seconds (not guaranteed)
   - Other factors: large number of open file descriptors, complex process trees

2. **Insufficient network bandwidth**: Can't upload checkpoint data fast enough

3. **Disk space issues**: Not enough local storage for checkpoint files

**Solutions**:

1. **Reduce memory usage**:
   - Lower memory requested by tasks
   - Process smaller data chunks
   - Set `process.resourceLimits` to enforce limits

2. **Increase bandwidth**:
   - Use instance types with higher network bandwidth
   - Ensure memory:bandwidth ratio is appropriate

3. **Enable incremental snapshots** (automatic on X86_64):
   - Verify you're using X86_64 architecture: `uname -m`
   - Avoid ARM64 instances if checkpoints are failing

4. **Configure retry strategy**:
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

### Exit code 176: Restore failed

**Symptom**: Task fails with exit code 176 when attempting to restore from a checkpoint.

**Common causes**:

1. **Corrupted checkpoint**: Previous checkpoint didn't complete properly
2. **Missing files**: Checkpoint data missing or inaccessible
3. **State conflict**: Attempting to restore while dump still in progress
4. **Environment mismatch**: Different environment between checkpoint and restore

**Solutions**:

1. **Check if previous checkpoint completed**:
   - Review logs for "Dumping finished successfully"
   - If missing, previous checkpoint timed out (exit 175)

2. **Verify checkpoint data exists**:
   - Check work directory `.fusion/dump/` contains checkpoint files
   - Ensure S3/GCS bucket is accessible

3. **Configure retry for dump failures first**:
   - Handle exit code 175 with retry (see above)
   - This prevents attempting restores from incomplete checkpoints

### Checkpoint times too long

**Symptom**: Checkpoints take longer than expected, approaching timeout limits.

**Diagnosis**:

Check these factors:

1. **Memory usage**: How much memory is your task using?
   - Memory is typically the primary factor affecting checkpoint time
   - Other factors: number of open file descriptors, process complexity

2. **Architecture**: Are you on X86_64 or ARM64?
   ```bash
   uname -m
   ```
   - ARM64 only does full dumps (no incremental snapshots)
   - x86_64 enables incremental snapshots automatically

3. **Network bandwidth**: Is your instance bandwidth sufficient?
   - Check instance type specifications
   - Prefer instances with guaranteed bandwidth

**Solutions**:

1. **For AWS Batch (120s window)**:
   - Use instances with 5:1 or better memory:bandwidth ratio
   - Use X86_64 instances (c6id, m6id, r6id families)

2. **For Google Batch (30s window)**:
   - Use X86_64 instances

### Frequent checkpoint failures

**Symptom**: Checkpoints consistently fail.

**Analysis**:

1. **Task too large for reclamation window**:
   - Memory usage exceeds what can be checkpointed in time
   - More common on GCP (30s) than AWS (120s)

2. **Network congestion or throttling**:
   - Bandwidth lower than instance specifications
   - Region or availability zone issues

3. **ARM64 architecture limitations**:
   - Full dumps only, no incremental snapshots
   - Requires much more time and bandwidth

**Solutions**:

1. **Split large tasks**:
   - Break into smaller, checkpointable units
   - Process data in chunks

2. **Switch to X86_64 instances**:
   - Essential for Google Batch
   - Recommended for AWS Batch tasks > 40 GiB

3. **Adjust memory limits**:
   ```groovy
   // For AWS Batch
   process.resourceLimits = [cpus: 32, memory: '60.GB']

   // For Google Batch (more conservative)
   process.resourceLimits = [cpus: 16, memory: '20.GB']
   ```

### SSL/TLS connection errors

**Symptom**: Applications fail after restore with connection errors, especially HTTPS connections.

**Cause**: CRIU cannot preserve encrypted TCP connections (SSL/TLS).

**Solution**:

Configure TCP close mode to drop connections during checkpoint:

```groovy
process.containerOptions = '-e FUSION_SNAPSHOTS_TCP_MODE=close'
```

Applications will need to re-establish connections after restore.

## Debugging workflow

When encountering issues, follow this workflow:

### 1. Identify the failure point

Check the exit code:
- **175**: Checkpoint failed
- **176**: Restore failed
- **Other**: Likely application error, not snapshot-related

### 2. Review logs

Check `.command.log` in the task work directory for:
- Fusion Snapshots messages (prefixed with timestamp)
- Exit code information
- Error messages

Enable debug logging if needed:
```groovy
process.containerOptions = '-e FUSION_SNAPSHOT_LOG_LEVEL=debug'
```

### 3. Check checkpoint data

Look in the work directory's `.fusion/dump/` folder:

**Directory structure**:
```
.fusion/dump/
├── 1/                    # First dump
│   ├── pre_*.log        # Pre-dump log (if incremental)
│   └── <CRIU files>
├── 2/                    # Second dump
│   ├── pre_*.log
│   └── <CRIU files>
├── 3/                    # Third dump (full)
│   ├── dump_*.log       # Full dump log
│   ├── restore_*.log    # Restore log (if restored)
│   └── <CRIU files>
└── dump_metadata         # Metadata tracking all dumps
```

**Check the log files**:

Each numbered directory contains log files that show what happened during that checkpoint:

1. **Pre-dump logs** (`pre_*.log`): For incremental dumps (PRE type)
   - **Success indicator**: Look at the bottom of the file
   - Should end with: `Pre-dumping finished successfully`
   - Example:
     ```
     (66.525687) page-pipe: Killing page pipe
     (66.563939) irmap: Running irmap pre-dump
     (66.610871) Writing stats
     (66.658902) Pre-dumping finished successfully
     ```

2. **Full dump logs** (`dump_*.log`): For full checkpoints (FULL type)
   - **Success indicator**: Look at the bottom of the file
   - Should end with: `Dumping finished successfully`
   - Example:
     ```
     (25.867099)     Unseizing 90 into 2
     (27.160829) Writing stats
     (27.197458) Dumping finished successfully
     ```
   - **Failure indicator**: Log ends abruptly without success message
   - If timestamps approach reclamation window limits, the instance was terminated mid-dump:
     - **AWS Batch**: Log timestamps near 120 seconds = instance terminated during dump (guaranteed 120s window)
     - **Google Batch**: Log timestamps near 30 seconds = instance terminated during dump (up to 30s, not guaranteed)
   - Example (AWS Batch instance terminated at ~121s while dumping):
     ```
     (121.37535) Dumping path for 329 fd via self 353 [/path/to/file.tmp]
     (121.65146) 90 fdinfo 330: pos: 0x4380000 flags: 100000/0
     # Log truncated - instance was reclaimed before dump completed
     ```
   - **Root cause**: Task memory too large or bandwidth too low for reclamation window

3. **Restore logs** (`restore_*.log`): Only in FULL dump directories that were restored
   - **Success indicator**: Look at the bottom of the file
   - Should end with: `Restore finished successfully. Tasks resumed.`
   - Example:
     ```
     (145.81974) Running pre-resume scripts
     (145.81994) Restore finished successfully. Tasks resumed.
     (145.82001) Writing stats
     ```

**Quick diagnostic checklist**:

- Are there numbered directories?
- Do timestamps align with reclamation events?
- Do log files exist in each directory?
- Do logs end with "finished successfully"?
- Do logs end abruptly without success message?
  - Check last timestamp: ~120s (AWS Batch) or ~30s (Google Batch) = instance terminated during dump
  - Solution: Reduce memory usage or increase bandwidth

### 4. Verify configuration

Confirm:
- Instance type has sufficient bandwidth
- Memory usage is within safe limits for your cloud provider
- Architecture is x86_64 (not ARM64) if having issues
- Fusion Snapshots are enabled in compute environment

### 5. Test with different instance types

If uncertain:
- Try to run the same task with different instance types (that have better disk iops and bandwidth guarantees)
- Verify if snapshots work there
- Decrease memory usage to a manageable amount

## Getting help

When contacting support, provide:

1. **Task information**:
   - Nextflow version
   - Cloud provider (AWS/GCP)
   - Instance type used
   - Memory and CPU requested
   - Linux Kernel Version

2. **Error details**:
   - Exit code
   - Relevant log excerpts
   - Timestamp of failure

3. **Configuration**:
   - Compute environment settings
   - Nextflow config related to snapshots
   - Architecture (x86_64 or ARM64)

4. **Dump data** (if available):
   - From the task workdir, `.fusion/dump/` directory contents
   - It might be not practical to share the whole directory, in that case, please start by sharing the `dump_metadata` file and any `*.log` files you can find inside the numbered dump folders


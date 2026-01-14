---
title: Error codes and exit messages
description: "Reference for Fusion error codes, exit codes, and error messages"
date created: "2025-01-12"
last updated: "2025-01-12"
tags: [errors, error-codes, exit-codes, fuse, logging, fusion]
---

This page describes Fusion's error reporting system, including exit codes, FUSE status codes (errno values), cloud provider error categories, and internal error types.

## Architectural limitations

Fusion plays two critical roles in the execution of a Nextflow task. Each impacts error reporting differently:

- **As a filesystem**: Fusion operates as a FUSE filesystem to provide transparent access to cloud storage. When processes execute I/O operations (e.g., `open()`, `read()`, `write()`, `unlink()`), they interact with Fusion through the standard POSIX filesystem interface.

- **As a container entrypoint**: Fusion acts as the container's entrypoint, wrapping the execution of the Nextflow task. When a container starts, Fusion initializes first, mounts the filesystem, and then launches the actual task command. Upon task completion, both Fusion and the task must communicate their status through a single exit code, which is constrained to 256 possible values (`0`-`255`). This creates a ambiguity as Fusion reports its own failures using specific codes (e.g. `174`), but the task process can return any value in this range. Consequently, when a container exits with a specific code, determining whether the failure originated from Fusion or the task is impossible without examining the logs.

These architectural roles impose constraints on how Fusion can communicate operation errors as well as its own failures:

- **Limitations in POSIX error codes**: As a filesystem, Fusion communicates I/O operation failures only through standard POSIX error codes (`ENOENT`, `EACCES`, `EIO`, etc.). The filesystem interface provides no mechanism to return rich error context—it cannot explain why an operation failed beyond a generic error code. As a result, Fusion cannot tell the user process through the filesystem interface and returns only a generic I/O error (`EIO`).

- **User process controls output**: When Fusion returns a POSIX error code, the process (not Fusion) determines what to display to the user. Fusion cannot control this output.

- **Ambiguity of exit codes**: As the container entrypoint, the container's final exit code can originate from either Fusion itself (e.g., exit code `174`) or from the task's actual command. When a container exits with a failure code, there's no immediate way to determine the source of the failure without examining logs.

- **Mixed log outputs**: Fusion also emits errors to stdout, where they typically mix with the task output. They are indistinguishable from a task's own errors when your review the task's logs.

## Error paths

Fusion is a FUSE filesystem that bridges applications and cloud object stores. Errors originate from multiple layers and propagate through the filesystem components in three main paths:

1. **Cloud → Storage Backend → FUSE Layer → Kernel → Application**

   - Storage backends catch and normalize cloud errors (network timeouts, auth failures, rate limits) using the `clouderr` package
   - Storage backends return normalized cloud errors (with provider-agnostic categories) or internal errors (`ErrNotFound`, `ErrReadOnly`, etc.)
   - The FUSE layer maps both cloud errors and internal errors to FUSE status codes (`ENOENT`, `EACCES`, `EREMOTEIO`, `EIO`)
   - The kernel translates FUSE status to errno values for the application
   - Fusion logs cloud errors with structured details (provider, error code, HTTP status, request ID)

1. **Failures during start up/shut down → Exit Code**

   - Startup: Configuration errors, missing credentials, or mount failures terminate Fusion immediately
   - Shutdown: Async uploads or consolidation of pending operations
   - Failures surface as exit code `174` (Fusion I/O error) or `1` (fatal error)

1. **Background Operations → Logs**

   - Async uploads during normal operation, cache eviction, and snapshot operations log errors but may not surface them to applications
   - Errors are reported in Fusion (see [Understanding Fusion logs](#understanding-fusion-logs))

## Triaging errors

When troubleshooting Fusion errors:

1. Check the exit code:
    - Check the process exit code (`$?`) to understand if Fusion terminated normally (`0`), encountered an I/O error (`174`), or had a command issue (`127`).
1. Look at FUSE status in the logs:
    - If a filesystem operation failed, use the logs to identify the FUSE status code (e.g., `ENOENT`, `EREMOTEIO`, `EIO`) returned to the application.
1. Check for cloud error fields:
    - If you see `EREMOTEIO` or cloud-related failures, identify the specific cloud error fields in the logs:
        - `provider`
        - `provider_code`
        - `provider_http_status`
        - `provider_request_id`

    :::note
    The field `error_code` indicates Fusion's internal categorization of the cloud error normalized across providers (e.g., `ResourceNotFound`, `Forbidden`, `RateLimited`).
    :::

1. Identify the mapped internal error:
    - The FUSE status code maps back to either a cloud error category or a specific internal error (e.g., `EACCES` indicates an authentication problem, `EREMOTEIO` indicates a cloud backend issue). Check the Fusion logs for more details on the error that triggered the FUSE status code (see [Understanding Fusion logs](#understanding-fusion-logs)).

:::tip
Enable `debug` logging to for the full log:

```bash
export FUSION_LOG_LEVEL=debug
```

:::

## Exit codes

Fusion binaries return specific exit codes to indicate the outcome of execution.

:::tip
For exit codes `175` and `176`, see [Fusion Snapshots](./fusion-snapshots.md).
:::

### Fusion binary

| Exit code | Constant | Description |
|-----------|----------|-------------|
| `0` | - | Success, normal completion. |
| `1` | - | Fatal error during startup (via `log.Fatal()`). |
| `127` | - | Command not found (`.command.sh` missing). Triggers automatic retry up to `FUSION_MAX_MOUNT_RETRIES` times. |
| `174` | `ErrorExitCode` | Fusion I/O error, application-level input/output error. |

:::note
`log.Fatal()` calls during startup produce exit code `1`. See [Fatal error messages](#fatal-error-messages) for the specific messages that trigger this exit.
:::

The `sysexits.h` standard uses exit code 74 for "input/output error" and reserves 150-199 for application use. In Fusion's context, 174 means "application input/output error".

| Scenario | Log cue | Suggested next step |
|----------|----------------|---------------------|
| Failed to start FUSE process in background | `on FUSE process` | Check FUSE/kernel support. Verify `/dev/fuse` exists. |
| Failed to send SIGTERM to FUSE process | `on FUSE sigterm send` | Check kernel logs (`dmesg`) for crashed processes. |
| Failed to wait for FUSE process termination | `on FUSE stop wait` | Check for zombie processes. Review kernel signal handling. |
| Error during filesystem shutdown | `on file system shutdown` | Check Fusion logs for pending upload errors. See [Understanding Fusion logs](#understanding-fusion-logs). |
| Error during filesystem unmount | `on file system unmount` | Run `fusermount -u /fusion` or `umount -l /fusion` manually. |
| Failed read/write path validation | `check-rw` or `check-ro` | Verify cloud credentials and bucket permissions. |

### GPU tracer binary

| Exit code | Meaning | When |
|-----------|---------|------|
| `0` | Success | Normal completion (GPU detected or not) |
| `1` | Error | Failed to start GPU monitoring |
| `2` | Invalid input | Missing PID, invalid PID format, or PID `<= 0` |

## FUSE status codes

Fusion maps internal errors to standard FUSE status codes returned to the operating system. These are the [errno](https://man7.org/linux/man-pages/man3/errno.3.html) values applications receive when filesystem operations fail.

:::note
For a complete list of errno values and their meanings, see the [Linux errno man page](https://man7.org/linux/man-pages/man3/errno.3.html) or run `errno -l` on a Linux system.
:::

### Returned status codes

Fusion's filesystem implementation actively returns these status codes:

| FUSE status | Errno | Description | Common causes in Fusion |
|------------------|-------|---------------------------|-------------------------|
| `fuse.OK`        | 0     | Success                   | Operation completed successfully |
| `fuse.ENOENT`    | 2     | No such file or directory | File/entry not found in cache or remote store; cloud provider ResourceNotFound/ContainerNotFound errors |
| `fuse.EINTR`     | 4     | Interrupted system call   | Context cancelled |
| `fuse.EIO`       | 5     | I/O error                 | General I/O errors, internal failures, remote store errors, unknown non-cloud errors |
| `fuse.EACCES`    | 13    | Permission denied         | Write attempt to read-only path; cloud provider Unauthenticated/InvalidCredentials/Forbidden/AccountError errors |
| `fuse.EBUSY`     | 16    | Device or resource busy   | Cloud provider RateLimited/Busy/ResourceArchived errors |
| `fuse.EEXIST`    | 17    | File exists               | Cloud provider Conflict errors (e.g., resource already exists) |
| `fuse.EINVAL`    | 22    | Invalid argument          | Invalid parameters (e.g., readlink on non-symlink) |
| `fuse.EROFS`     | 30    | Read-only file system     | Attempt to modify read-only object |
| `fuse.ERANGE`    | 34    | Result too large          | Buffer too small for xattr value |
| `fuse.ENOSYS`    | 38    | Function not implemented  | Operation not wired in Fusion's FUSE layer |
| `fuse.ENOATTR`   | 93    | No such attribute         | Extended attribute not found |
| `fuse.ENOTSUP`   | 95    | Operation not supported   | Operation explicitly rejected (e.g., hard links) |
| `fuse.ETIMEDOUT` | 110   | Connection timed out      | Context deadline exceeded |
| `fuse.EREMOTEIO` | 121   | Remote I/O error          | Cloud provider errors (QuotaExceeded, unknown cloud errors) |

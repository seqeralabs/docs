---
title: Error codes and exit messages
description: "Reference for Fusion error codes, exit codes, and error messages"
date created: "2025-01-12"
last updated: "2025-01-20"
tags: [errors, error-codes, exit-codes, fuse, logging, fusion]
---

This page describes Fusion's error reporting system, including exit codes, FUSE status codes (errno values), cloud provider error categories, and internal error types.

## Error paths

Fusion is a FUSE filesystem that bridges applications and cloud object stores. Errors originate from multiple layers and propagate through the filesystem components in three main paths:

1. **Cloud > Storage Backend > FUSE Layer > Kernel > Application**

   - Storage backends catch and normalize cloud errors (network timeouts, auth failures, rate limits) using the `clouderr` package
   - Storage backends return normalized cloud errors (with provider-agnostic categories) or internal errors (`ErrNotFound`, `ErrReadOnly`, etc.)
   - The FUSE layer maps both cloud errors and internal errors to FUSE status codes (`ENOENT`, `EACCES`, `EREMOTEIO`, `EIO`)
   - The kernel translates FUSE status to errno values for the application
   - Fusion logs cloud errors with structured details (provider, error code, HTTP status, request ID)

1. **Failures during startup/shutdown → Exit Code**

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
Enable `debug` logging for the full log:

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
| `fuse.ENOTSUP`   | 95    | Operation not supported   | Operation explicitly rejected (for example, hard links) |
| `fuse.ETIMEDOUT` | 110   | Connection timed out      | Context deadline exceeded |
| `fuse.EREMOTEIO` | 121   | Remote I/O error          | Cloud provider errors (QuotaExceeded, unknown cloud errors) |

### Troubleshooting FUSE status codes

When you encounter a FUSE status code, use the following table to identify likely causes and next steps:

| Status | Likely causes and troubleshooting steps |
|--------|----------------------------------------|
| `ENOENT` | Path typo or object deleted from remote store. Check if the path exists using your cloud provider's CLI (`aws s3 ls`, `gsutil ls`, `az storage blob list`). |
| `EACCES` | Mount configured as read-only, object ACL blocking writes, or authentication/permission issues. Check cloud IAM permissions and credentials. |
| `EEXIST` | Resource already exists in cloud storage. Check if the operation was retried or if there's a naming conflict. |
| `EIO` | General I/O error or unknown internal failure. Check Fusion logs for the underlying cause. See [Understanding Fusion logs](#understanding-fusion-logs). |
| `EREMOTEIO` | Cloud provider error. Check Fusion logs for detailed cloud error information (provider, error code, HTTP status, request ID). May indicate quota exceeded, rate limiting, or other cloud-specific issues. See [Understanding Fusion logs](#understanding-fusion-logs). |
| `EBUSY` | Cloud provider rate limiting requests or temporarily busy. Retry with backoff. Check cloud provider dashboard for service status. |
| `ETIMEDOUT` | Operation timed out due to network connectivity issues or slow cloud response. Check network connection and cloud service status. |
| `EINTR` | Caller cancelled the operation. Usually safe to retry. |
| `ENOTSUP` | Unsupported operation. Adjust workload to avoid hard links. Use symlinks or copies instead. |
| `ENOSYS` | Operation not implemented in Fusion. Check if the operation is supported or use an alternative approach. |

### ENOSYS vs ENOTSUP

Both indicate an operation cannot be performed, but they have different meanings:

- **`ENOSYS` (Function not implemented)**: The operation is not implemented in Fusion's FUSE layer. This is the default response for operations Fusion doesn't handle.

- **`ENOTSUP` (Operation not supported)**: The operation exists in Fusion but is explicitly rejected for specific cases. For example:
  - **Hard links (`Link`)**: Fusion explicitly returns `ENOTSUP` because hard links cannot be meaningfully represented on object storage backends.
  - **Whiteout character device creation**: During overlay-style renames, if creating the whiteout marker fails, `ENOTSUP` signals this specific failure.

:::tip
If you encounter `ENOTSUP` on hard links, use symbolic links (`ln -s`) or file copies instead.
:::

### EREMOTEIO vs EIO

Fusion distinguishes between local I/O failures and cloud provider errors:

- **`EREMOTEIO` (Remote I/O error)**: Used specifically for cloud provider errors. This errno value indicates that:
  - The error originated from a remote cloud storage system (S3, Azure Blob Storage, or Google Cloud Storage).
  - The failure is due to cloud provider issues (quota exceeded, rate limiting, service unavailable).
  - Debugging should focus on cloud provider logs and status, not local system issues.
  - The request ID from logs can be provided to cloud support for investigation.

- **`EIO` (I/O error)**: Used as a generic catch-all for:
  - Unknown internal errors that are not cloud-related.
  - Local filesystem or system failures.
  - Errors that cannot be classified into more specific categories.

:::note
Using `EREMOTEIO` for cloud errors provides more accurate error context, making it easier to distinguish between local system issues and cloud service problems during troubleshooting and monitoring.
:::

:::tip
When you see `EREMOTEIO`, check the Fusion logs for cloud error fields: `provider`, `error_code`, `provider_code`, `provider_http_status`, and `provider_request_id`. See [Understanding Fusion logs](#understanding-fusion-logs).
:::

### Error mapping

Fusion maps cloud provider errors and internal errors to FUSE status codes.

#### Cloud provider error mapping

Cloud provider errors are normalized and mapped to appropriate FUSE status codes:

| Cloud error category | FUSE status | Examples |
|---------------------|-------------|----------|
| `Unauthenticated` | `fuse.EACCES` | No credentials provided |
| `InvalidCredentials` | `fuse.EACCES` | Wrong, malformed, or expired credentials |
| `Forbidden` | `fuse.EACCES` | Valid credentials, insufficient permissions |
| `AccountError` | `fuse.EACCES` | Account disabled, suspended, or has billing issues |
| `ResourceNotFound` | `fuse.ENOENT` | S3 "NoSuchKey", Azure "BlobNotFound", GCS 404 |
| `ContainerNotFound` | `fuse.ENOENT` | S3 "NoSuchBucket", Azure "ContainerNotFound", GCS 404 with bucket error |
| `RateLimited` | `fuse.EBUSY` | Request rate limits exceeded |
| `Busy` | `fuse.EBUSY` | Service temporarily unavailable or overloaded |
| `ResourceArchived` | `fuse.EBUSY` | Resource in archived/transitional state (for example, Glacier) |
| `Conflict` | `fuse.EEXIST` | Resource already exists or precondition failed |
| `InvalidArgument` | `fuse.EINVAL` | Malformed request or invalid parameters |
| `QuotaExceeded` | `fuse.EREMOTEIO` | Storage quota or capacity limit reached |
| `Unknown` (cloud errors) | `fuse.EREMOTEIO` | Unclassified cloud provider errors |

#### Internal error mapping

| Internal error | FUSE status |
|---------------|-------------|
| Not found | `fuse.ENOENT` |
| Read-only | `fuse.EROFS` |
| Unsupported | `fuse.ENOSYS` |
| Context cancelled | `fuse.EINTR` |
| Context deadline exceeded | `fuse.ETIMEDOUT` |
| Other errors | `fuse.EIO` |

## Cloud provider error categories

Fusion normalizes errors from different cloud storage providers (S3, Azure Blob Storage, Google Cloud Storage) into consistent categories. When you see an `error_code` field in Fusion logs, it represents one of these categories:

| Category | Description | Common provider codes |
|----------|-------------|----------------------|
| `ResourceNotFound` | Requested resource (object/file) does not exist | S3: "NoSuchKey", Azure: "BlobNotFound", GCS: HTTP 404 |
| `ContainerNotFound` | Storage container (bucket) does not exist | S3: "NoSuchBucket", Azure: "ContainerNotFound", GCS: HTTP 404 with bucket error |
| `Unauthenticated` | No credentials provided | S3: "MissingSecurityHeader", GCS: HTTP 401 with no credentials |
| `InvalidCredentials` | Credentials provided but wrong, malformed, or expired | S3: "InvalidAccessKeyId", "ExpiredToken", Azure: "InvalidAuthenticationInfo", GCS: HTTP 401 with invalid credentials |
| `Forbidden` | Valid credentials but insufficient permissions | S3: "AccessDenied", Azure: "AuthorizationPermissionMismatch", GCS: HTTP 403 |
| `AccountError` | Account-level problems (disabled, suspended, billing issues) | S3: "AccountProblem", Azure: "AccountIsDisabled", GCS: HTTP 403 with specific messages |
| `ResourceArchived` | Resource exists but is in archived/transitional state | S3: "InvalidObjectState" (Glacier), Azure: "BlobArchived" |
| `RateLimited` | Request rate limits exceeded | S3: "SlowDown", Azure: "TooManyRequests", GCS: HTTP 429 |
| `Busy` | Service temporarily unavailable or overloaded | S3: "ServiceUnavailable", "InternalError", Azure: "ServerBusy", GCS: HTTP 503 |
| `Conflict` | Resource state conflict or precondition failure | S3: "BucketAlreadyExists", Azure: "BlobAlreadyExists", "ConditionNotMet", GCS: HTTP 409/412 |
| `InvalidArgument` | Malformed request or invalid parameters | S3: "InvalidArgument", "InvalidRange", Azure: "InvalidQueryParameterValue", GCS: HTTP 400 |
| `QuotaExceeded` | Storage quota or capacity limit reached | S3: "TooManyBuckets", Azure: "AccountLimitExceeded", GCS: HTTP 429 with quota message |
| `Unknown` | Unclassified or unexpected error | Various |

## Fatal error messages

These messages indicate Fusion terminated immediately with exit code 1. They occur during startup or critical failures:

| Message | Cause |
|---------|-------|
| `configuring fusion` | Failed to configure Fusion (invalid config, missing environment variables) |
| `building remote store options` | Failed to build remote store options |
| `creating metadata store` | Failed to create metadata store |
| `creating data store` | Failed to create data store connection |
| `validating work path` | Work path validation failed (empty prefix or connection error) |
| `creating filesystem` | Failed to create FUSE filesystem |
| `mounting filesystem` | Failed to mount FUSE filesystem |
| `could not get current job attempt` | Failed to get job attempt from compute environment |

## Understanding Fusion logs

Fusion emits logs in two formats:

- **Console logs** (stderr): Timestamped, human-readable format with `[seqera-fusion]` prefix. These logs are collected by Seqera Platform and shown in the UI. They provide immediate visibility during runtime.
- **File logs** (`${workdir}/.fusion.log`): Structured logs in JSON format for detailed analysis and troubleshooting.

:::note
The `[seqera-fusion]` prefix for console logs was introduced in Fusion v2.6, v2.5.9, and v2.4.20.
:::

### Log fields reference

Fusion uses structured logging with consistent field names. Understanding these fields is essential for troubleshooting.

#### Cloud error fields

These fields appear automatically when a cloud provider error is detected:

| Field | Description | Example values |
|-------|-------------|----------------|
| `provider` | Cloud provider name | `s3`, `azure`, `gcs` |
| `error_code` | Normalized error category (provider-agnostic) | `Forbidden`, `ResourceNotFound`, `InvalidCredentials` |
| `provider_code` | Provider-specific error code | S3: `NoSuchKey`, Azure: `BlobNotFound`, GCS: `invalid` |
| `provider_http_status` | HTTP status code from cloud provider | `403`, `404`, `429`, `500` |
| `provider_request_id` | Request ID for cloud provider support tickets | `ABCD1234EXAMPLE`, `b8e8a1f5-...` |
| `provider_error` | Original error message from cloud provider | `The specified key does not exist.` |

:::tip
When opening support tickets with cloud providers, always include the `provider_request_id` from logs. This enables their support team to trace the exact request in their systems.
:::

#### Common operational fields

These fields appear in most log entries to provide operation context:

| Field | Description | Example values |
|-------|-------------|----------------|
| `path` | Filesystem path where operation occurred | `/fusion/s3/bucket/file.txt`, `/.Trash` |
| `operation` | FUSE operation or internal operation name | `Read`, `Write`, `Lookup`, `listDirectory` |
| `error` | Main error message (non-cloud portion) | `not found`, `permission denied` |
| `message` | Human-readable log message describing what happened | `find entry error`, `configuration` |
| `level` | Log severity level | `debug`, `info`, `warn`, `error`, `fatal` |

### Log examples

#### Fatal error (causes termination)

This example indicates Fusion could not authenticate with the cloud provider and terminated immediately:

**Console logs:**
```
11:23AM FTL [seqera-fusion] creating data store error="NoCredentialProviders: no valid providers in chain"
```

**File logs (`.fusion.log`):**
```json
{
  "level": "fatal",
  "error": "NoCredentialProviders: no valid providers in chain",
  "time": 1765738531263809778,
  "message": "creating data store"
}
```

#### Recoverable error (operation failed, Fusion continues)

This example indicates a file lookup failed and returned `ENOENT` to the application. Fusion continues running:

**Console logs:**
```
11:24AM ERR [seqera-fusion] find entry error error="element not found" path=/fusion/s3/bucket/missing-file.txt
```

**File logs (`.fusion.log`):**
```json
{
  "level": "error",
  "error": "element not found",
  "path": "/.Trash",
  "time": 1765738531284473208,
  "message": "listDirectory"
}
```

#### Cloud provider error

This example shows a cloud provider error with structured fields:

**File logs (`.fusion.log`):**
```json
{
  "level": "error",
  "error": "not found",
  "provider": "s3",
  "error_code": "ResourceNotFound",
  "provider_code": "NoSuchKey",
  "provider_http_status": 404,
  "provider_request_id": "ABCD1234EXAMPLE",
  "provider_error": "The specified key does not exist.",
  "message": "The requested resource was not found in cloud storage. Verify the file path is correct and the resource exists."
}
```

### Searching logs

**Console logs** (grep-based searching):
```bash
# Find all cloud provider errors
grep 'provider=' .fusion.log

# Find specific error categories
grep 'error_code=' .fusion.log | grep 'Forbidden'

# Find operations on specific paths
grep 'path=/fusion/s3/bucket/file.txt' .fusion.log
```

**JSON logs** (jq-based searching):
```bash
# Find all cloud errors
jq 'select(.provider != null)' .fusion.log

# Find S3 errors only
jq 'select(.provider == "s3")' .fusion.log

# Find all Forbidden errors across providers
jq 'select(.error_code == "Forbidden")' .fusion.log

# Find errors with request IDs (for cloud support tickets)
jq 'select(.provider_request_id != null) | {provider, provider_request_id, provider_code, message}' .fusion.log
```

## Nextflow integration

When running Nextflow with Fusion:

- Exit code `0`: Task completed successfully
- Exit code `127`: Retry logic activates (`.command.sh` not found)
- Exit code `174`: Fusion I/O error—check logs for details

### Check exit codes

```bash
fusion --foreground
exit_code=$?

case $exit_code in
    0)
        echo "Success"
        ;;
    127)
        echo "Command not found - may retry"
        ;;
    174)
        echo "Fusion I/O error - check Fusion logs"
        ;;
    *)
        echo "Unknown exit code: $exit_code"
        ;;
esac
```

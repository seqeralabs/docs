---
title: Error codes and exit messages
description: "Reference for Fusion error codes, exit codes, and error messages"
date created: "2025-01-12"
last updated: "2025-01-12"
tags: [errors, error-codes, exit-codes, fuse, logging, fusion]
---

This page describes Fusion's error reporting system, including exit codes, FUSE status codes (errno values), cloud provider error categories, and internal error types.

Use the [triaging errors](#triaging-errors) workflow to diagnose failures and the [Understanding Fusion logs](#understanding-fusion-logs) section to interpret structured error fields.

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
        - `provider_request_id`.

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


#### What to check

| Status      | Likely causes |
|-------------|---------------|
| `ENOENT`    | Path typo? Object deleted from remote store? Check if path exists with cloud CLI (`aws s3 ls`, `gsutil ls`, `az storage blob list`) |
| `EACCES`    | Mount configured as read-only? Object ACL blocking writes? Authentication or permission issues? Check cloud IAM permissions, and credentials |
| `EEXIST`    | Resource already exists in cloud storage. Check if the operation was retried or if there's a naming conflict |
| `EIO`       | General I/O error or unknown internal failure. Check Fusion logs for underlying cause. See [Understanding Fusion logs](#understanding-fusion-logs)|
| `EREMOTEIO` | Cloud provider error. Check Fusion logs for detailed cloud error information (provider, error code, HTTP status, request ID). May indicate quota exceeded, rate limiting, or other cloud-specific issues. See [Understanding Fusion logs](#understanding-fusion-logs) |
| `EBUSY`     | Cloud provider is rate limiting requests or temporarily busy. Retry with backoff. Check cloud provider dashboard for service status |
| `ETIMEDOUT` | Operation timed out. Network connectivity issues or slow cloud response. Check network connection and cloud service status |
| `EINTR`     | Caller cancelled the operation. Usually safe to retry the operation |
| `ENOTSUP`   | Unsupported operation. Adjust workload to avoid hard links; use symlinks or copies instead |
| `ENOSYS`    | Operation not implemented in Fusion. Check if the operation is supported; may need alternative approach |

:::

#### ENOSYS vs ENOTSUP

Both indicate an operation cannot be performed, but they have different meanings:

- **`ENOSYS` (Function not implemented)**: Fusion's FUSE layer does not wire this operation at all. `defaultRawFileSystem` returns this default response for operations Fusion doesn't handle.

- **`ENOTSUP` (Operation not supported)**: The operation exists in Fusion but Fusion explicitly rejects it for specific cases. Examples:
  - **Hard links (`Link`)**: Fusion explicitly returns `ENOTSUP` because hard links cannot be meaningfully represented on object storage backends
  - **Whiteout character device creation**: During overlay-style renames, if creating the whiteout marker fails, `ENOTSUP` signals this specific failure

> [!TIP]
> If you encounter `ENOTSUP` on hard links, use symbolic links (`ln -s`) or file copies instead.

#### EREMOTEIO vs EIO

Fusion distinguishes between local I/O failures and cloud provider errors:

- **`EREMOTEIO` (Remote I/O error)**: Fusion uses this errno specifically for cloud provider errors. This value semantically indicates that:
  - The error originated from a remote cloud storage system (S3, Azure, GCS)
  - Cloud provider issues (quota exceeded, rate limiting, service unavailable, etc.) caused the failure
  - Focus debugging on cloud provider logs and status, not local system issues
  - Provide the request ID from logs to cloud support for investigation

- **`EIO` (I/O error)**: Fusion uses this as a generic catch-all for:
  - Unknown internal errors that are not cloud-related
  - Local filesystem or system failures
  - Errors that cannot be classified into more specific categories

**Why the distinction matters**

Using `EREMOTEIO` for cloud errors provides more accurate error context. This makes it easier to distinguish between local system issues and cloud service problems during troubleshooting and monitoring, and avoids overloading the generic `EIO` error code, which can obscure the root cause.

:::tip
When you see `EREMOTEIO`, check the Fusion logs for the flattened cloud error fields: `provider`, `error_code`, `provider_code`, `provider_http_status`, and `provider_request_id` (see [Understanding Fusion logs](#understanding-fusion-logs)).
:::

### Defined but not returned

The go-fuse library defines these FUSE status codes, but Fusion's filesystem implementation does not currently return them. We list them here for reference and to clarify that applications should not expect to receive them from Fusion:

| FUSE Status | Errno | Description | What you see instead |
|-------------|-------|-------------|------------------------|
| `fuse.ENOSPC` | 28 | No space left on device | A full cache disk triggers internal retries with exponential backoff (1s to 32s, up to 5 retries). If retries exhaust, the error surfaces as `fuse.EIO`. Free up cache disk space or increase `FUSION_CACHE_LOCATION` capacity |

### Error mapping

Fusion maps its internal errors to FUSE status codes:

:::note
Various Fusion packages define the internal errors listed below (e.g., `fusion.ErrNotFound`, `fusion.ErrReadOnly`). The [Internal error types](#internal-error-types) section documents them in detail.
:::

#### Cloud provider error mapping

The `clouderr` package normalizes cloud provider errors and maps them to appropriate FUSE status codes:

| Cloud error category | FUSE status | Examples |
|---------------------|-------------|----------|
| `clouderr.Unauthenticated` | `fuse.EACCES` | No credentials provided |
| `clouderr.InvalidCredentials` | `fuse.EACCES` | Wrong, malformed, or expired credentials |
| `clouderr.Forbidden` | `fuse.EACCES` | Valid credentials, insufficient permissions |
| `clouderr.AccountError` | `fuse.EACCES` | Account disabled, suspended, or has billing issues |
| `clouderr.ResourceNotFound` | `fuse.ENOENT` | S3 "NoSuchKey", Azure "BlobNotFound", GCS 404 |
| `clouderr.ContainerNotFound` | `fuse.ENOENT` | S3 "NoSuchBucket", Azure "ContainerNotFound", GCS 404 with bucket error |
| `clouderr.RateLimited` | `fuse.EBUSY` | Request rate limits exceeded |
| `clouderr.Busy` | `fuse.EBUSY` | Service temporarily unavailable or overloaded |
| `clouderr.ResourceArchived` | `fuse.EBUSY` | Resource in archived/transitional state (e.g., Glacier) |
| `clouderr.Conflict` | `fuse.EEXIST` | Resource already exists or precondition failed |
| `clouderr.InvalidArgument` | `fuse.EINVAL` | Malformed request or invalid parameters |
| `clouderr.QuotaExceeded` | `fuse.EREMOTEIO` | Storage quota or capacity limit reached |
| `clouderr.Unknown` (cloud errors) | `fuse.EREMOTEIO` | Unclassified cloud provider errors |

#### Internal error mapping

| Internal Error | FUSE Status |
|---------------|-------------|
| `fusion.ErrNotFound` | `fuse.ENOENT` |
| `fusion.ErrReadOnly` | `fuse.EROFS` |
| `fusion.ErrUnsupported` | `fuse.ENOSYS` |
| `context.Canceled` | `fuse.EINTR` |
| `context.DeadlineExceeded` | `fuse.ETIMEDOUT` |
| Other errors | `fuse.EIO` |

## Internal error types

Fusion defines specific error types across its packages to provide meaningful error information.

### Cloud provider errors

Fusion uses the `internal/clouderr` package to provide a unified interface for handling errors from different cloud storage providers (S3, Azure Blob Storage, Google Cloud Storage). This normalization enables consistent error handling, logging, and errno mapping across all backends.

#### Error interface

All cloud provider errors implement the `clouderr.Error` interface:

```go
type Error interface {
    error
    Category() Category        // Normalized error category
    Provider() string          // Cloud provider name ("s3", "azure", "gcs")
    ProviderCode() string      // Provider-specific error code
    RequestID() string         // Request ID for tracing
    HTTPStatus() int           // HTTP status code
    Cause() error              // Original underlying error from cloud provider
}
```

#### Error categories

| Category | Description | Common provider codes |
|----------|-------------|----------------------|
| `Unknown` | Unclassified or unexpected error | - |
| `ResourceNotFound` | Requested resource (object/file) does not exist | S3: `NoSuchKey`, Azure: `BlobNotFound`, GCS: HTTP 404 |
| `ContainerNotFound` | Storage container (bucket) does not exist | S3: `NoSuchBucket`, Azure: `ContainerNotFound`, GCS: HTTP 404 with bucket error |
| `Unauthenticated` | No credentials provided at all | S3: `MissingSecurityHeader`, Azure: rarely used, GCS: HTTP 401 with no credentials |
| `InvalidCredentials` | Credentials provided but wrong, malformed, or expired | S3: `InvalidAccessKeyId`, `ExpiredToken`, Azure: `InvalidAuthenticationInfo`, GCS: HTTP 401 with invalid credentials |
| `Forbidden` | Valid credentials but insufficient permissions | S3: `AccessDenied`, Azure: `AuthorizationPermissionMismatch`, GCS: HTTP 403 |
| `AccountError` | Account-level problems (disabled, suspended, billing issues) | S3: `AccountProblem`, Azure: `AccountIsDisabled`, GCS: HTTP 403 with specific messages |
| `ResourceArchived` | Resource exists but is in archived/transitional state | S3: `InvalidObjectState` (Glacier), Azure: `BlobArchived`, GCS: similar conditions |
| `RateLimited` | Request rate limits exceeded | S3: `SlowDown`, Azure: `TooManyRequests`, GCS: HTTP 429 |
| `Busy` | Service temporarily unavailable or overloaded | S3: `ServiceUnavailable`, `InternalError`, Azure: `ServerBusy`, GCS: HTTP 503 |
| `Conflict` | Resource state conflict or precondition failure | S3: `BucketAlreadyExists`, Azure: `BlobAlreadyExists`, `ConditionNotMet`, GCS: HTTP 409/412 |
| `InvalidArgument` | Malformed request or invalid parameters | S3: `InvalidArgument`, `InvalidRange`, Azure: `InvalidQueryParameterValue`, GCS: HTTP 400 |
| `QuotaExceeded` | Storage quota or capacity limit reached | S3: `TooManyBuckets`, Azure: `AccountLimitExceeded`, GCS: HTTP 429 with quota message |

#### Provider implementations

Each storage backend implements cloud error detection and normalization:

- **S3** (`internal/s3store/s3_errors.go`): Analyzes AWS SDK errors and HTTP responses
- **Azure** (`internal/azstore/az_errors.go`): Analyzes Azure SDK errors and service codes
- **GCS** (`internal/gsstore/gs_errors.go`): Analyzes GCS API errors and HTTP status codes

#### Usage in code

```go
import "github.com/seqeralabs/fusion/internal/clouderr"

// Check if an error is a cloud error
if cloudErr, ok := clouderr.AsCloudError(err); ok {
    log.Error().Err(err).Msg("Cloud provider error occurred")
    // Cloud error details are automatically logged
}

// Or simply check existence
if clouderr.IsCloudError(err) {
    // Handle cloud error
}
```

**Source:** `internal/clouderr/error.go`

### Core Fusion errors

| Error | Description | Package |
|-------|-------------|---------|
| `ErrReadOnly` | Returned when trying to write to a read-only object | `internal/fusion` |
| `ErrNotFound` | Returned if the element is not found | `internal/fusion` |
| `ErrListTruncated` | Returned when the list of entries was not fully loaded from remote store | `internal/fusion` |
| `ErrUnsupported` | Returned when an operation is not supported | `internal/fusion` |

### License errors

| Error | Description | Package |
|-------|-------------|---------|
| `ErrMissingToken` | License token not found | `internal/license` |
| `ErrInvalidToken` | Invalid token format | `internal/license` |
| `ErrInvalidCert` | Invalid certificate | `internal/license` |
| `ErrCertChainInvalid` | Certificate chain validation failed | `internal/license` |
| `ErrSignatureInvalid` | Token signature validation failed | `internal/license` |
| `ErrDecodeHeaders` | Failed to decode headers | `internal/license` |
| `ErrUnMarshalJSON` | Failed to unmarshal JSON | `internal/license` |
| `ErrX5CNotFound` | x5c array is empty | `internal/license` |
| `ErrExpiredLicense` | License expired | `internal/license` |

### Compute environment errors

| Error | Description | Package |
|-------|-------------|---------|
| `ErrJobAttemptNotAvailable` | Job attempt not available in environment | `internal/computeenv` |
| `ErrEnvVarNotSet` | Required environment variable not set | `internal/computeenv` |
| `ErrInvalidValue` | Invalid environment variable value | `internal/computeenv` |
| `ErrAttemptOutOfRange` | Job attempt number out of valid range | `internal/computeenv` |

### Azure storage errors

| Error | Description | Package |
|-------|-------------|---------|
| `ErrMissingCredentials` | Either an Account Key, SAS Token, or Managed Identity must be provided | `internal/azstore` |
| `ErrMultipleCredentials` | Only one authentication method can be used at a time | `internal/azstore` |
| `ErrMissingAccountName` | An Azure Storage account name must be provided | `internal/azstore` |
| `ErrTooManyIDs` | A Client ID and Resource ID cannot be provided at the same time | `internal/azstore` |
| `ErrCreatingCredential` | Error creating credential | `internal/azstore` |

### Storage and content errors

| Error | Description | Package |
|-------|-------------|---------|
| `ErrStoreNotFound` | Store not found for the given path | `internal/multistore` |
| `ErrInvalidTargetObject` | Target object does not implement required interfaces | `internal/asyncstore` |
| `ErrNonWritableTarget` | Target object must be a writable object | `internal/filecontent` |
| `ErrNonComposableObject` | Target object must implement WritableObject and Composer interfaces | `internal/chunkcontent` |
| `ErrNotFound` | Chunk not found in cache | `internal/chunkcontent` |

### Buffer pool errors

| Error | Description | Package |
|-------|-------------|---------|
| `ErrZeroCapacity` | Capacity cannot be zero | `internal/bpool` |
| `ErrNegativeCapacity` | Capacity cannot be negative | `internal/bpool` |
| `ErrZeroBufferSize` | Buffer size cannot be zero | `internal/bpool` |
| `ErrNilAllocator` | Allocator cannot be nil | `internal/bpool` |

### Tracing/observability errors

| Error | Description | Package |
|-------|-------------|---------|
| `ErrEmptyDestination` | Destination is empty | `internal/observability/exporter` |
| `ErrCouldNotCreateGRPCClient` | Could not create gRPC client for collector | `internal/observability/exporter` |
| `ErrFailedToCreateGRPCExporter` | Failed to create gRPC exporter | `internal/observability/exporter` |
| `ErrFailedToOpenSpanExportFile` | Failed to open file for span export | `internal/observability/exporter` |
| `ErrFailedToCreateWriterSpanExporter` | Failed to create writer span exporter | `internal/observability/exporter` |
| `ErrUnsupportedTraceExporterDestination` | Unsupported trace exporter destination | `internal/observability/exporter` |

### Snapshots errors

:::tip
For troubleshooting Fusion Snapshots issues, see [Fusion Snapshots](./fusion-snapshots).
:::

Fusion Snapshots enables checkpointing of task state for spot instance recovery and incremental backups. These errors may occur when `FUSION_SNAPSHOT_ENABLED=true`:

| Error | Description | Package |
|-------|-------------|---------|
| `command cannot be nil when snapshot is enabled` | The snapshot manager initialized without a command to manage. This configuration error occurs when `FUSION_SNAPSHOT_ENABLED=true` but the command setup failed | `internal/snapshot` |
| `error setting up provider` | A snapshot provider (AWS Batch, Google Batch, or incremental) failed to initialize. Check logs for the specific provider name and underlying error | `internal/snapshot` |
| Invalid interval duration | `FUSION_SNAPSHOT_INCREMENTAL_INTERVAL` contains an unparseable duration string | `internal/snapshot/providers` |

#### Platform support detection

Fusion registers snapshot providers only when the platform supports them. Check these requirements if snapshots are enabled but providers don't register:

| Platform | Requirements | How Detected |
|----------|--------------|--------------|
| AWS Batch | Running on EC2 Spot instance | `s3store.IsSpotInstance()` queries EC2 instance metadata for `spot-instances-action` |
| Google Batch | Running on preemptible/spot VM | `gsstore.IsPreemptible()` queries GCP metadata for `scheduling/preemptible` |
| Incremental snapshots | amd64 architecture | Build-time detection via Go build tags |

**Debug log messages:**

| Message | Meaning |
|---------|---------|
| `incremental snapshots not supported on this architecture, skipping setup` | Running on non-amd64 architecture (e.g., arm64). Incremental snapshots are disabled |
| `setting up AWS Batch spot instance monitoring` | AWS Batch provider initialized successfully |
| `setting up Google Batch preemptible instance monitoring` | Google Batch provider initialized successfully |

:::note
Snapshot providers silently skip registration on non-spot/non-preemptible instances. Fusion logs no error—this is expected behavior since snapshots primarily support spot recovery.
:::

**Related environment variables:**

- `FUSION_SNAPSHOT_ENABLED`: Enable/disable snapshot feature
- `FUSION_SNAPSHOT_INCREMENTAL_INTERVAL`: Interval for incremental snapshots (e.g., `5m`, `1h`)

### Other internal errors

| Error | Description | Package |
|-------|-------------|---------|
| `ErrReadOnlyObject` | Read-only object cannot be modified | `internal/fragmentmanager` |
| `ErrInvalidFragment` | Invalid fragment specification | `internal/fragmentmanager` |
| `ErrNilEntry` | Entry is nil | `internal/entryfs` |
| `ErrMaxEntries` | Exceeding maximum files in a folder (default: 500,000) | `internal/entryfs` |
| `ErrInvalidFile` | Invalid file type | `internal/fpool` |
| `ErrInvalidKey` | Invalid key for classification | `internal/classifier` |

### Other errors

Fusion returns these errors directly to callers as plain strings rather than exported error variables. Recognize them in logs or CLI output:

| Message | Description | Location |
|---------|-------------|----------|
| `array is not enabled` | Nextflow `array` section missing or incomplete | `internal/nextflow/data.go` |
| `missing array variable '<name>'` | Required array index env var is not set | `internal/nextflow/data.go` |
| `malformated '<name>=<value>' array index variable -- <err>` | Array index env var cannot be parsed as int | `internal/nextflow/data.go` |
| `array index %d (%d - %d) out of bounds (len: %d)` | Array index outside configured bounds | `internal/nextflow/data.go` |
| `missing AWS_ACCESS_KEY_ID environment variable` | AWS credentials not provided when required | `internal/multistore/stores.go` |
| `missing AWS_SECRET_ACCESS_KEY environment variable` | AWS credentials not provided when required | `internal/multistore/stores.go` |
| `missing source objects to compose` | Compose API called without source parts (S3/GS/Azure) | `internal/s3store/s3_object_compose.go`, `internal/gsstore/gs_object_compose.go`, `internal/azstore/az_object_compose.go` |

## Fatal error messages

`log.Fatal()` logs these messages and causes immediate termination with exit code `1`.

| Message | Location | Cause |
|---------|----------|-------|
| `configuring fusion` | `cmd/fusion/mount.go` | Failed to configure Fusion (invalid config, missing env vars) |
| `building remote store options` | `cmd/fusion/mount.go` | Failed to build remote store options |
| `creating metadata store` | `cmd/fusion/mount.go` | Failed to create metadata store |
| `creating data store` | `cmd/fusion/mount.go` | Failed to create data store connection |
| `validating work path` | `cmd/fusion/mount.go` | Work path validation failed (empty prefix or connection error) |
| `creating filesystem` | `cmd/fusion/mount.go` | Failed to create FUSE filesystem |
| `mounting filesystem` | `cmd/fusion/mount.go` | Failed to mount FUSE filesystem |
| `could not get current job attempt` | `cmd/fusion/mount.go` | Failed to get job attempt from compute environment |
| `Failed to create socket writer` | `internal/entryfs/fusionfs.go` | Remote logger socket creation failed |
| `Failed to create GRPC connection` | `cmd/traces/main.go` | Failed to connect to OTLP collector |
| `Failed to start OTLP client` | `cmd/traces/main.go` | Failed to start tracing client |

## Understanding Fusion logs

Fusion emits logs in two formats depending on the output destination:

- **Console logs** (stderr): Timestamped, human-readable format with `[seqera-fusion]` prefix. Platform collects these logs and shows them in the UI for immediate visibility during runtime.
- **File logs** (`${workdir}/.fusion.log`): Structured logs in JSON format for detailed analysis and troubleshooting.

:::warning
The following Fusion versions introduced the `[seqera-fusion]` prefix for console logs:

- Fusion `v2.6`
- Fusion `v2.5.9`
- Fusion `v2.4.20`

:::

### Logging patterns

Fusion uses structured logging with different severity levels.

#### Fatal errors (immediate Fusion termination)

Used for unrecoverable errors during startup or critical failures. For example, Fusion could not authenticate with the cloud provider and terminated immediately:

- **Console logs**

  ```console
  # format: TIME LEVEL PREFIX message field=value
  11:23AM FTL [seqera-fusion] creating data store error="NoCredentialProviders: no valid providers in chain"
  ```

- **File logs**

  ```json
  {"level":"fatal","error":"NoCredentialProviders: no valid providers in chain","time":1765738531263809778,"goid":1,"message":"creating data store"}
  ```

#### Recoverable errors (an operation on Fusion failed, Fusion continues)

Used for operation failures that don't require termination. For example, a file lookup failed (returned `ENOENT` to application) but Fusion continues to run:

- **Console logs**

  ```
  # format: TIME LEVEL PREFIX message field=value
  11:24AM ERR [seqera-fusion] find entry error error="element not found" path=/fusion/s3/bucket/missing-file.txt
  ```

- **File logs**

  ```json
  {"level":"error","error":"element not found","path":"/.Trash","time":1765738531284473208,"goid":134,"message":"listDirectory"}
  ```

#### Warning level (degraded operation)

Used for non-critical issues (e.g., cannot set process priority).

#### Debug level

Used for detailed operational information. For example, An I/O error occurred during a file lookup and it is logged at debug level for diagnostic purposes.

- **Console logs**

  ```console
  # format: TIME LEVEL PREFIX message field=value
  11:25AM DBG [seqera-fusion] find entry not found path=/.Trash
  ```

- **File logs**

  ```json
  {"level":"debug","path":"/.Trash","time":1765738531284580851,"goid":134,"message":"find entry not found"}
  ```

#### Cloud error logging

Fusion automatically detects and provides category-specific error messages for cloud provider errors.

**Automatic cloud error detection**

When an error chain contains a `clouderr.Error`, the logging system:

1. Generates a category-specific, actionable error message via `GetCloudErrorMessage(err)`
1. Extracts structured cloud error details and logs them as flattened top-level fields (`provider`, `error_code`, `provider_code`, `provider_http_status`, `provider_request_id`, `provider_error`)
1. Logs the non-cloud portion of the error chain in the main `error` field
1. Provides complete context for debugging cloud provider issues

**Category-specific messages**

The `GetCloudErrorMessage()` function returns tailored messages based on error category:

- **Unauthenticated**: Directs users to configure credentials properly
- **InvalidCredentials**: Directs users to verify credentials are correct and not expired
- **Forbidden**: Explains permission issues and IAM requirements
- **AccountError**: Indicates account-level problems and directs users to check with cloud provider
- **ResourceNotFound**: Directs users to verify file paths and resource existence
- **ContainerNotFound**: Guides users to verify container/bucket names and access
- **ResourceArchived**: Explains restoration requirements and expected timelines
- **RateLimited/Busy**: Indicates transient nature and suggests actions
- **Conflict**: Explains resource conflicts and precondition failures
- **InvalidArgument**: Points to invalid parameters requiring investigation
- **QuotaExceeded**: Directs users to check provider-specific quota limits
- **Unknown**: Directs users to investigate cloud provider logs

**Non-Cloud Errors**

Non-cloud I/O errors also use descriptive messages that explain the failure, direct investigation paths, and reference structured log fields for details.

### Log fields reference

Fusion uses structured logging with consistent field names across all log outputs. Understand these fields to troubleshoot and monitor effectively.

#### Cloud error fields

These fields appear automatically when Fusion detects a cloud provider error in the error chain:

| Field | Type | Description | Example values |
|-------|------|-------------|----------------|
| `provider` | string | Cloud provider name | `s3`, `azure`, `gcs` |
| `error_code` | string | Normalized error category (provider-agnostic) | `Forbidden`, `ResourceNotFound`, `InvalidCredentials` |
| `provider_code` | string | Provider-specific error code | S3: `NoSuchKey`, Azure: `BlobNotFound`, GCS: `invalid` |
| `provider_http_status` | integer | HTTP status code from cloud provider | `403`, `404`, `429`, `500` |
| `provider_request_id` | string | Request ID for cloud provider support tickets | `ABCD1234EXAMPLE`, `b8e8a1f5-...` |
| `provider_error` | string | Original error message from cloud provider | `The specified key does not exist.` |

:::tip
When opening support tickets with cloud providers, always include the `provider_request_id` from logs. This enables their support team to trace the exact request in their systems.
:::

#### Common operational fields

These fields appear in most log entries to provide operation context:

| Field | Type | Description | Examples |
|-------|------|-------------|----------------|
| `path` | string | Filesystem path where operation occurred | `/fusion/s3/bucket/file.txt`, `/.Trash` |
| `operation` | string | FUSE operation or internal operation name | `Read`, `Write`, `Lookup`, `listDirectory` |
| `error` | string | Main error message (non-cloud portion) | `not found`, `permission denied` |
| `message` | string | Human-readable log message describing what happened | `find entry error`, `configuration` |
| `level` | string | Log severity level | `debug`, `info`, `warn`, `error`, `fatal` |

#### System and runtime fields

These fields provide system-level context:

| Field         | Type    | Description                                       | Examples                     |
|---------------|---------|---------------------------------------------------|------------------------------|
| `time`        | integer | Unix timestamp in nanoseconds                     | `1765738531263809778`        |
| `goid`        | integer | Goroutine ID for concurrent operation tracking    | `1`, `134`                   |
| `version`     | string  | Fusion version (in configuration logs)            | `2.6-develop-3921736`        |
| `mount_point` | string  | FUSE mount location (in configuration logs)       | `/fusion`                    |
| `work_prefix` | string  | Cloud storage work prefix (in configuration logs) | `/s3/fusion-develop/scratch` |

### Searching logs by field

**Console logs** (grep-based searching):

```bash
# Find all cloud provider errors
grep 'provider=' .fusion.log

# Find specific error categories
grep 'error_code=' .fusion.log | grep 'Forbidden'

# Find operations on specific paths
grep 'path=/fusion/s3/bucket/important-file.txt' .fusion.log
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

# Find operations on specific path
jq 'select(.path == "/fusion/s3/bucket/file.txt")' .fusion.log

# Find errors by HTTP status
jq 'select(.provider_http_status == 403)' .fusion.log
```

#### 6. Non-cloud error messages

For errors that originate from Fusion's internal operations (cache I/O, metadata operations, local filesystem issues), use the message constants defined in `internal/entryfs/errors.go`. These messages follow a consistent format that provides actionable guidance to users.

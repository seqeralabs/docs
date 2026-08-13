---
title: "Compute environment pre-flight checks"
description: "How Seqera Platform validates compute environments and credentials, and what to do when a check fails"
date created: "2026-07-24"
last updated: "2026-08-13"
tags: [compute environments, credentials, troubleshooting, configuration]
---

Pre-flight checks validate that a compute environment is usable before you launch a pipeline. They run when you create or update a compute environment, on a recurring background schedule, and again at launch time. Problems surface before submission rather than mid-run. Pre-flight checks only flag conditions that would block a launch.

Pre-flight checks are **disabled by default** in Seqera Platform Enterprise and must be enabled by an administrator.

## What to verify before creating a compute environment

Before creating or deploying a compute environment, confirm the following:

**Credentials**
- The access keys, service account key, or managed identity are valid and have not been rotated or revoked.
- The IAM role or service account has the permissions required by the cloud provider. See the relevant compute environment page for the minimum required policy.

**Wave** (if enabled)
- The Wave service is running and reachable from Seqera Platform.

**Tower Agent** (HPC/grid compute environments only)
- Tower Agent is reachable from Platform. See [Tower Agent](../supported_software/agent/overview) for installation and startup instructions.

## Enable pre-flight checks

Pre-flight checks require two flags set to `true` in `tower.yml`. Setting only one is not sufficient.

| Environment variable | `tower.yml` key | What it does | Default |
|---|---|---|---|
| `TOWER_CREDENTIALS_VALIDATION_ENABLED` | `tower.credentials.validation.enabled` | Enables credential status tracking. When `true`, credentials are automatically validated against the cloud provider on create and update. The validation result (status and error message) is persisted on the credential record and displayed in the UI. When `false`, validation is skipped on create/update, the credential status block is hidden in the UI, and `/credentials/{id}/validate` returns a non-persisting result. | `false` |
| `TOWER_PREFLIGHT_CHECK_ENABLED` | `tower.preflight.check.enabled` | Master switch for pre-flight checks. When `true`, the background credentials-validation cron probes in-scope credentials on a schedule, the compute environment validation cron validates environments on a schedule, Platform rejects launches against `INVALID` credentials or compute environments with a `400 Bad Request`, and the compute environment creation picker hides `INVALID` credentials. When `false`, both crons are dormant, the launch API treats `INVALID` status as advisory only, and the picker shows every credential regardless of status. | `false` |

:::note
Both flags are read once at process start. Restart the `backend` and `cron` containers after changing either value.
:::

## Validation process

Platform runs four tiers of validation:

### 1. Compute environment creation and update checks

Runs synchronously when you create a compute environment, and when you update a compute environment to use different credentials. Platform reads the persisted status of the selected credential. If the credential has been deleted or is marked `INVALID`, Platform rejects the request with a `400 Bad Request` that names the credential and the recovery step, instead of saving a compute environment that fails later. The check runs before any provider validation.

This check does not apply to compute environments that use a managed identity, because no credential is attached.

On update, Seqera Platform checks only the newly selected credential. Seqera Platform does not block other edits, such as a name or description change. To restore a compute environment whose credential has failed, replace the `INVALID` or deleted credential with a working one.

:::note
This is the only check that reads credential status regardless of `TOWER_PREFLIGHT_CHECK_ENABLED`. Every other consumer of the status is gated by that flag: the launch-time rejection, the compute environment creation picker, and both validation crons. When `TOWER_PREFLIGHT_CHECK_ENABLED` is `false`, Platform rejects a new compute environment that uses an `INVALID` credential, but does not block launches against a compute environment that already uses one.

The check only takes effect where credential validation has run at some point, because nothing else writes the `INVALID` status. On an installation where both flags have always been `false`, every credential is `AVAILABLE` and this check never fires.
:::

### 2. Credential validation

Runs on a recurring schedule. For each cloud credential (AWS, Google Cloud, Azure) in scope, Platform calls the provider API to verify that the credential is still accepted. For AWS role-based credentials and Google Cloud Workload Identity Federation, this check confirms the credential is well-formed but cannot fully verify the underlying role or identity provider trust configuration.

When a credential fails this check, Platform marks it **INVALID** and records the provider error on the credential record. This error appears in the launch-time error message when a pipeline is blocked, but not in the compute environment banner. To see the specific provider error, check the credential record directly.

### 3. Compute environment validation

Platform checks the associated credential status. If the credential is `INVALID`, the compute environment is marked `INVALID` immediately.

A compute environment marked `INVALID` displays a banner with the error message. An `AVAILABLE` compute environment has its `lastValidated` timestamp refreshed.

:::note
These checks cover AWS Batch, AWS Cloud, Azure Batch, Azure Cloud, Google Cloud Batch, and Google Cloud compute environments.
:::

### 4. Pipeline launch-time checks

Runs immediately when a user submits a pipeline launch. If any check fails, the launch is blocked and a specific error is returned. Multiple failures are reported together.

| Check | What it does |
|---|---|
| Compute environment status | Reads the last recorded status from the database. Blocks launch if the compute environment is marked `INVALID`. |
| Credential status | Reads the last recorded status from the database. Blocks launch if the credential associated with the compute environment is marked `INVALID`. |
| Wave connectivity | For compute environments with Wave enabled, verifies the Wave service connection is active |
| Tower Agent | For HPC compute environments, verifies a Tower Agent is online for the environment |

## Validate a credential manually

After you rotate the keys or fix the underlying issue on an `INVALID` credential, trigger an immediate re-validation:

1. Navigate to **Credentials** in your workspace.
2. Find the credential and select **Validate**.

Platform makes a live call to the cloud provider and updates the credential status immediately. If the check passes, the credential returns to `AVAILABLE`.

Compute environments marked `INVALID` because of this credential do not recover automatically. Use **Validate** on each affected compute environment after restoring the credential.

## Validate a compute environment manually

After you fix the underlying issue on an `INVALID` compute environment, trigger an immediate re-validation without waiting for the next background sweep:

1. Navigate to **Compute environments** in your workspace.
2. Find the compute environment and open its **⋮** (three-dot) drop-down.
3. Select **Validate**.

Platform runs pre-flight checks and updates the compute environment status immediately. If all checks pass, the compute environment returns to `AVAILABLE`.

:::warning[Validate the credential before the compute environment]
If both the credential and its associated compute environment are marked `INVALID`, you must restore the credential to `AVAILABLE` before validating the compute environment. If the credential is still `INVALID`, the compute environment remains `INVALID`.
:::

## Advanced configuration (optional)

The defaults work for most deployments. Only adjust these if you have specific rate-limit or scheduling requirements. These parameters only take effect when `TOWER_PREFLIGHT_CHECK_ENABLED=true`.

### Credential validation cron

| Environment variable | `tower.yml` key | Description | Default |
|---|---|---|---|
| `TOWER_CRON_CREDENTIALS_VALIDATION_INTERVAL` | `tower.cron.credentials-validation.interval` | Per-credential re-validation cadence. After each successful probe, the credential is rescheduled at `now + interval ± 10%` jitter. This is a background freshness job. Because the launch-path check independently handles real-time launch-blocking on revoked credentials, you can safely relax this cadence. | `12h` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_TICK_RATE` | `tower.cron.credentials-validation.tick-rate` | How often the evaluator polls the Redis schedule store for due credentials. Distinct from the per-credential interval. | `60s` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_DELAY` | `tower.cron.credentials-validation.delay` | Initial delay before the first evaluator tick after process start. Randomised ±50% to spread cold-start load across replicas. | `20s` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_BATCH_SIZE` | `tower.cron.credentials-validation.batch-size` | Maximum credential IDs drained from the Redis schedule store per evaluator tick. | `100` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_CONCURRENCY` | `tower.cron.credentials-validation.concurrency` | Global in-flight cap on concurrent cloud probes across all evaluator pumps. Tune conservatively when many credentials in one workspace share a single cloud account to avoid provider rate limits (for example, AWS STS `TooManyRequests`). | `10` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_PROBE_DELAY` | `tower.cron.credentials-validation.probe-delay` | Optional sleep between probes within a single pump. Set to a non-zero value (for example, `200ms`) when many credentials share a cloud account and a cold-start burst would exceed provider rate limits. | `0ms` (no pacing) |
| `TOWER_CRON_CREDENTIALS_VALIDATION_TRANSIENT_RETRY_INTERVAL` | `tower.cron.credentials-validation.transient-retry-interval` | Shorter cadence used to re-enqueue a credential after a transient probe failure (network interruption, provider 5xx, unexpected SDK exception). Prevents a credential from being silently skipped until the next process restart. | `5m` |

### Compute environment validation cron

| Environment variable | `tower.yml` key | Description | Default |
|---|---|---|---|
| `TOWER_CRON_COMPUTE_ENV_VALIDATION_INTERVAL` | `tower.cron.compute-env-validation.interval` | Compute environment re-validation cadence. A compute environment is due when its `lastValidated` timestamp is null or older than `now - interval`. | `12h` |
| `TOWER_CRON_COMPUTE_ENV_VALIDATION_TICK_RATE` | `tower.cron.compute-env-validation.tick-rate` | How often the evaluator sweeps the database for due compute environments. Distinct from the per-compute-environment interval. | `60s` |
| `TOWER_CRON_COMPUTE_ENV_VALIDATION_DELAY` | `tower.cron.compute-env-validation.delay` | Initial delay before the first evaluator tick after process start. Randomised ±50% to spread cold-start load across replicas. | `20s` |
| `TOWER_CRON_COMPUTE_ENV_VALIDATION_BATCH_SIZE` | `tower.cron.compute-env-validation.batch-size` | Maximum compute environment IDs swept from the database per evaluator tick. | `100` |

### Credential auto-validation timeout

Only effective when `TOWER_CREDENTIALS_VALIDATION_ENABLED=true`.

| Environment variable | `tower.yml` key | Description | Default |
|---|---|---|---|
| `TOWER_CREDENTIALS_AUTO_VALIDATION_TIMEOUT_SEC` | `tower.credentials.autoValidationTimeoutSec` | Timeout in seconds for the cloud provider probe triggered when a credential is created or updated. Platform treats timeout expiry as a transient failure and leaves the persisted status untouched. | `10` |

## Error reference

For pre-flight check error messages, causes, and resolutions, see [Pre-flight checks troubleshooting](../troubleshooting_and_faqs/preflight_checks_troubleshooting).

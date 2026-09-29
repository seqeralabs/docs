---
title: "Compute environment pre-flight checks"
description: "How Seqera Platform validates credentials and compute environments before a launch, the flags that control the checks, and how to re-validate after a fix"
date created: "2026-07-24"
last updated: "2026-09-17"
tags: [compute environments, credentials, troubleshooting, configuration]
---

Pre-flight checks confirm that a compute environment is usable before you launch a pipeline. They run when you create or update a compute environment, on a recurring background schedule, and again at launch time. Problems surface before submission rather than mid-run. Pre-flight checks only flag conditions that would block a launch.

Seqera Platform Enterprise enables pre-flight checks and credential validation by default. An administrator can disable either with the environment variables described in [Feature flags](#feature-flags).

## Checked conditions

Pre-flight checks confirm the following conditions. Verify them before you create a compute environment:

**Credentials**
- The access keys, service account key, or managed identity are valid and have not been rotated or revoked.
- The IAM role or service account has the permissions the cloud provider requires. See the relevant compute environment page for the minimum required policy.

**Wave** (if enabled)
- The Wave service is running and reachable from Seqera Platform.

**Tower Agent** (high-performance computing (HPC) and grid compute environments only)
- Tower Agent is reachable from Platform. See [Tower Agent](../supported_software/agent/overview) for installation and startup instructions.

## Feature flags

Two flags control pre-flight checks and credential validation. Both default to `true`. A new installation runs every check described on this page with no extra configuration. To disable pre-flight checks, set both flags to `false` in `tower.yml`.

| Environment variable | `tower.yml` key | What it does | Default |
|---|---|---|---|
| `TOWER_CREDENTIALS_VALIDATION_ENABLED` | `tower.credentials.validation.enabled` | Validates credentials against the cloud provider when you create or update them, stores the result on the credential record, and shows the status in the UI. When `false`, Platform skips this validation, hides the status block in the UI, and `/credentials/{id}/validate` returns a result without saving it. | `true` |
| `TOWER_PREFLIGHT_CHECK_ENABLED` | `tower.preflight.check.enabled` | Runs the credential and compute environment validation crons, rejects launches against `INVALID` credentials or compute environments with a `400 Bad Request`, and hides `INVALID` credentials in the compute environment creation picker. When `false`, the crons do not run, the launch API ignores `INVALID` status, and the picker shows every credential. | `true` |

:::note
Platform reads both flags once at process start. Restart the `backend` and `cron` containers after changing either value.
:::

:::warning[Disable both flags together]
If you set `TOWER_CREDENTIALS_VALIDATION_ENABLED` to `false` but leave `TOWER_PREFLIGHT_CHECK_ENABLED` at `true`, the background cron still marks failing credentials `INVALID` and Platform still rejects launches against them. The **Credentials** page hides the `INVALID` status and the **Validate** action, and updating the credential does not re-validate it.
:::

## Validation process

Validation runs at four points:

### Compute environment creation and update checks

This check runs when you create a compute environment, and when you update one to use different credentials. Platform reads the stored status of the selected credential. If the credential has been deleted or is `INVALID`, Platform rejects the request with a `400 Bad Request` that names the credential and the recovery step. The check runs before any provider validation.

This check does not apply to compute environments that use a managed identity, because no credential is attached.

On update, Platform checks only the newly selected credential. Other edits, such as a name or description change, are not blocked. To restore a compute environment whose credential has failed, replace the `INVALID` or deleted credential with a working one.

:::note
This is the only check that reads credential status when `TOWER_PREFLIGHT_CHECK_ENABLED` is `false`. In that state, Platform rejects a new compute environment that uses an `INVALID` credential, but does not block launches against a compute environment that already uses one.

The check only fires where credential validation has run at some point, because nothing else writes the `INVALID` status. On an installation that has always run with both flags set to `false`, every credential is `AVAILABLE` and this check never fires.
:::

### Credential validation

This check runs on a recurring schedule. For each AWS, Google Cloud, and Azure credential in scope, Platform calls the provider API to confirm that the credential is still accepted. For AWS role-based credentials and Google Cloud Workload Identity Federation, the check confirms the credential is well-formed. It cannot fully verify the underlying role or identity provider trust configuration.

When a credential fails this check, Platform marks it `INVALID` and records the provider error on the credential record. The error appears in the launch-time error message when a pipeline is blocked, but not in the compute environment banner. To see the provider error, check the credential record.

A transient probe failure, such as a network interruption or provider throttling, does not mark the credential `INVALID`. Platform retries the credential with exponential backoff. Some failures show that the credential can never validate, such as an Azure storage or Batch account hostname that no longer resolves. After 10 consecutive failures of this kind, Platform marks the credential `INVALID`. See [Credential validation cron](#credential-validation-cron) to tune the retry ceiling and the escalation threshold.

### Compute environment validation

This check runs on a recurring schedule. Platform reads the status of the associated credential. If the credential is `INVALID`, Platform marks the compute environment `INVALID` immediately.

An `INVALID` compute environment displays a banner with the error message. An `AVAILABLE` compute environment has its `lastValidated` timestamp refreshed.

:::note
This check covers AWS Batch, AWS Cloud, Azure Batch, Azure Cloud, Google Cloud Batch, and Google Cloud compute environments.
:::

### Pipeline launch-time checks

These checks run when a user submits a pipeline launch. If any check fails, Platform blocks the launch and reports every failure in one error.

| Check | What it does |
|---|---|
| Compute environment status | Reads the last recorded status from the database. Blocks the launch if the compute environment is `INVALID`. |
| Credential status | Reads the last recorded status from the database. Blocks the launch if the credential associated with the compute environment is `INVALID`. |
| Wave connectivity | For compute environments with Wave enabled, confirms that the Wave service connection is active. |
| Tower Agent | For HPC compute environments, confirms that a Tower Agent is online for the environment. |

## Validate a credential manually

After you rotate the keys or fix the underlying issue on an `INVALID` credential, trigger an immediate re-validation:

1. Go to **Credentials** in your workspace.
2. Find the credential, open its **⋮** menu, and select **Validate**.

Platform makes a live call to the cloud provider and updates the credential status immediately. If the check passes, the credential returns to `AVAILABLE`. The **Validate** action is available only while the credential is `INVALID`.

Compute environments marked `INVALID` because of this credential do not recover automatically. Use **Validate** on each affected compute environment after restoring the credential.

## Validate a compute environment manually

After you fix the underlying issue on an `INVALID` compute environment, trigger an immediate re-validation without waiting for the next background sweep:

1. Go to **Compute environments** in your workspace.
2. Find the compute environment, open its **⋮** menu, and select **Validate**.

Platform runs pre-flight checks and updates the compute environment status immediately. If all checks pass, the compute environment returns to `AVAILABLE`.

:::warning[Validate the credential before the compute environment]
If both the credential and its associated compute environment are `INVALID`, restore the credential to `AVAILABLE` first. If the credential is still `INVALID`, the compute environment remains `INVALID`.
:::

## Validation settings

The defaults work for most deployments. Adjust these settings only if you have specific rate-limit or scheduling requirements. The cron settings have no effect when `TOWER_PREFLIGHT_CHECK_ENABLED` is `false`.

### Credential validation cron

| Environment variable | `tower.yml` key | Description | Default |
|---|---|---|---|
| `TOWER_CRON_CREDENTIALS_VALIDATION_INTERVAL` | `tower.cron.credentials-validation.interval` | Per-credential re-validation cadence. After each successful probe, Platform reschedules the credential at `now + interval ± 10%` jitter. Because the launch-time check independently blocks launches on revoked credentials, you can relax this cadence. | `12h` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_TICK_RATE` | `tower.cron.credentials-validation.tick-rate` | How often the evaluator polls the Redis schedule store for due credentials. Distinct from the per-credential interval. | `60s` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_DELAY` | `tower.cron.credentials-validation.delay` | Initial delay before the first evaluator tick after process start. Randomized ±50% to spread cold-start load across replicas. | `20s` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_BATCH_SIZE` | `tower.cron.credentials-validation.batch-size` | Maximum credential IDs drained from the Redis schedule store per evaluator tick. | `100` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_CONCURRENCY` | `tower.cron.credentials-validation.concurrency` | Global cap on concurrent cloud probes across all evaluator pumps. Lower it when many credentials in one workspace share a single cloud account, to avoid provider rate limits such as AWS STS `TooManyRequests`. | `10` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_PROBE_DELAY` | `tower.cron.credentials-validation.probe-delay` | Optional pause between probes within a single pump. Set a non-zero value, for example `200ms`, when many credentials share a cloud account and a cold-start burst would exceed provider rate limits. | `0ms` (no pacing) |
| `TOWER_CRON_CREDENTIALS_VALIDATION_TRANSIENT_RETRY_INTERVAL` | `tower.cron.credentials-validation.transient-retry-interval` | Cadence for re-enqueuing a credential after a transient probe failure, such as a network interruption, a provider 5xx, or an unexpected SDK exception. Without it, Platform skips a failed credential until the next process restart. | `5m` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_TRANSIENT_RETRY_MAX_INTERVAL` | `tower.cron.credentials-validation.transient-retry-max-interval` | Ceiling on the transient retry delay. The delay doubles after each consecutive transient failure, starting from `TOWER_CRON_CREDENTIALS_VALIDATION_TRANSIENT_RETRY_INTERVAL` (5m, 10m, 20m, 40m, up to this ceiling), so Platform probes a persistently failing credential less often over time. Must be greater than or equal to the transient retry interval, or the process fails at startup. | `24h` |
| `TOWER_CRON_CREDENTIALS_VALIDATION_UNVERIFIABLE_MAX_ATTEMPTS` | `tower.cron.credentials-validation.unverifiable-max-attempts` | Number of consecutive unverifiable probe failures before Platform marks the credential `INVALID`. Only a DNS resolution failure on a hostname derived from the credential itself counts as unverifiable. This applies to Azure storage and Batch account hostnames. Platform never escalates fixed provider endpoints, such as `sts.amazonaws.com`. Must be `1` or greater, or the process fails at startup. To disable escalation and keep backoff only, set a very high value and also lower `TOWER_CRON_CREDENTIALS_VALIDATION_TRANSIENT_RETRY_MAX_INTERVAL`, for example to `21h`. With the default `24h` ceiling, values above `10` fail the startup check described later. | `10` (about 1.8 days) |

The consecutive-failure counters behind these two settings expire 24 hours after the last failed probe. At startup, Platform verifies that the configured combination cannot delay the final escalation attempt past that window. If it can, the process fails to start with an error that names both settings. Lower one of the two values to resolve it.

### Compute environment validation cron

| Environment variable | `tower.yml` key | Description | Default |
|---|---|---|---|
| `TOWER_CRON_COMPUTE_ENV_VALIDATION_INTERVAL` | `tower.cron.compute-env-validation.interval` | Compute environment re-validation cadence. A compute environment is due when its `lastValidated` timestamp is null or older than `now - interval`. | `12h` |
| `TOWER_CRON_COMPUTE_ENV_VALIDATION_TICK_RATE` | `tower.cron.compute-env-validation.tick-rate` | How often the evaluator sweeps the database for due compute environments. Distinct from the per-compute-environment interval. | `60s` |
| `TOWER_CRON_COMPUTE_ENV_VALIDATION_DELAY` | `tower.cron.compute-env-validation.delay` | Initial delay before the first evaluator tick after process start. Randomized ±50% to spread cold-start load across replicas. | `20s` |
| `TOWER_CRON_COMPUTE_ENV_VALIDATION_BATCH_SIZE` | `tower.cron.compute-env-validation.batch-size` | Maximum compute environment IDs swept from the database per evaluator tick. | `100` |

### Credential auto-validation timeout

This setting has no effect when `TOWER_CREDENTIALS_VALIDATION_ENABLED` is `false`.

| Environment variable | `tower.yml` key | Description | Default |
|---|---|---|---|
| `TOWER_CREDENTIALS_AUTO_VALIDATION_TIMEOUT_SEC` | `tower.credentials.autoValidationTimeoutSec` | Timeout in seconds for the cloud provider probe that runs when you create or update a credential. Platform treats timeout expiry as a transient failure and leaves the stored status untouched. | `10` |

## Error reference

For pre-flight check error messages, causes, and resolutions, see [Pre-flight checks troubleshooting](../troubleshooting_and_faqs/preflight_checks_troubleshooting).

---
title: "Pre-flight checks"
description: "Pre-flight check error messages, causes, and resolutions for compute environments and credentials in Seqera Platform Enterprise."
date created: "2026-07-24"
last updated: "2026-08-24"
tags: [faq, help, pre-flight, troubleshooting, credentials, compute environments]
---

When pre-flight checks flag a compute environment or credential as `INVALID`, you might encounter the following errors. See [Compute environment pre-flight checks](../compute-envs/preflight-checks) for feature background and manual re-validation steps.

## Compute environment creation and update errors

These errors are returned immediately when you create a compute environment, or update one to use different credentials, and the selected credential cannot be used. No changes are saved. On update, only the newly selected credential is checked. Other edits to the compute environment are unaffected.

#### `The credentials '...' are invalid`

Full message:

```
The credentials '<name>' are invalid — <provider error>. Update and validate the credentials, then try again
```

The selected credential is marked `INVALID`. When the credential record has no stored provider error, the message omits the `— <provider error>` clause.

To resolve, go to **Credentials**, update or rotate the credential, select **Validate**, then create or update the compute environment again.

#### `The credentials '...' have been deleted`

Full message:

```
The credentials '<name>' have been deleted. Select different credentials and try again
```

The selected credential has been deleted.

To resolve, select a different credential or create a new one.

## Compute environment banners

These banners appear on the compute environment detail page when the compute environment is `INVALID`.

#### `Associated credentials are invalid or expired`

Full message:

```
Associated credentials are invalid or expired. Update the credentials and validate this compute environment, or contact your workspace maintainer to resolve this.
```

The background sweep found that the attached credential is no longer valid.

To resolve, go to **Credentials**, update or rotate the credential, then use **Validate** on the compute environment.

## Launch-time errors

These errors are returned immediately when a launch is blocked. Multiple failures are reported together.

#### `The selected compute environment '...' is in an invalid state`

The compute environment is marked `INVALID`. Check the compute environment banner for the specific reason.

To resolve, fix the root cause, then use **Validate** on the compute environment.

#### `The credentials '...' used by this compute environment are invalid`

The credential attached to the compute environment is marked `INVALID`.

To resolve, go to **Credentials**, update or rotate the credential, then use **Validate** on the compute environment.

#### `Wave service connection is not active`

Full message:

```
Wave is required by the selected compute environment but the Wave service connection is not active. Verify that Wave is running and check for connectivity issues.
```

Platform cannot reach the Wave service.

To resolve, contact your platform administrator. Once Wave is restored, retry the launch.

#### `No Tower Agent is online for the selected compute environment`

Full message:

```
No Tower Agent is online for the selected compute environment. Check that Tower Agent is running at your cluster.
```

No Tower Agent is connected for this compute environment (HPC/grid environments only).

To resolve, start or restart Tower Agent on the cluster. See [Tower Agent](../supported_software/agent/overview).

## Credential errors by provider

When the credential sweep marks a credential `INVALID`, Platform stores the provider-specific reason on the credential record. It appears in the launch-time error message when a pipeline is blocked, but not in the compute environment banner. To see the specific provider error, check the credential record directly.

| Provider | Example message |
|---|---|
| AWS | `AWS credentials are invalid or expired. Update or rotate the access keys.` |
| Google Cloud | `Google credentials are invalid or expired. Update the service account key.` |
| Google Cloud Workload Identity Federation | `Google WIF credential validation failed. Verify the provider and service account configuration.` |
| Azure Batch | `Azure Batch credentials are invalid. Verify the Batch account name and key.` |
| Azure Storage | `Azure Storage credentials are invalid. Verify the storage account name and key.` |
| Azure Batch (account hostname does not resolve) | `Cannot validate Azure Batch Security Keys, reason: <hostname>` |
| Azure Storage (account hostname does not resolve) | `Cannot validate Azure Blob Security Keys, reason: <hostname>` |

## Backend log errors

#### `java.net.UnknownHostException: <account>.blob.core.windows.net`

Full message:

```
ERROR c.a.c.h.netty.NettyAsyncHttpClient - java.net.UnknownHostException: <account>.blob.core.windows.net
```

The Azure SDK cannot resolve a credential's storage or Batch account hostname during a background validation probe, and logs the failure before Platform's retry handling sees it. Platform treats the failure as transient and retries with exponential backoff. The probes, and the log bursts they produce, become less frequent over time. If the hostname still does not resolve after 10 consecutive attempts, Platform marks the credential `INVALID` with the corresponding `Cannot validate Azure Blob/Batch Security Keys` message.

If the DNS failure is temporary, no action is required. If the storage or Batch account was deleted or renamed, go to **Credentials** and update or delete the credential. See [Credential validation cron](../compute-envs/preflight-checks#credential-validation-cron) to tune the retry and escalation behavior.

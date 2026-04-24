---
title: Fusion Doctor
description: "Run Fusion Doctor diagnostics with nf-canary to validate Fusion compute environments"
date created: "2026-04-23"
last updated: "2026-04-23"
tags: [troubleshooting, fusion, fusion-doctor, nf-canary, diagnostics]
---

Fusion Doctor is a diagnostic tool that validates whether a compute environment meets the requirements for running Fusion. It checks the host kernel, memory, disk, vCPUs, and bucket access, then produces a report you can use to resolve environment issues or share with Seqera support.

:::note
Fusion Doctor requires Fusion 2.5 or later.
:::

## When to use Fusion Doctor

Run Fusion Doctor when you:

- Set up a new compute environment and want to confirm it is Fusion-ready before running production workloads.
- Troubleshoot Fusion-related task failures and want a structured view of the host environment.
- Need to attach environment diagnostics to a Seqera support ticket.

## Run Fusion Doctor with nf-canary

[nf-canary](https://github.com/seqeralabs/nf-canary) is a Nextflow pipeline that runs Fusion Doctor on your compute environment and generates an HTML report. This is the supported path for most users. It does not require direct access to the task container. Fusion Doctor is only possible with nf-canary.

### Select a validation profile

In Seqera Platform, launch `nf-canary` and select a validation profile under **General config > Config profiles**. The profile sets the thresholds that Fusion Doctor validates against, such as minimum kernel version, memory, disk capacity, and vCPUs.

Seqera provides nine pre-built profiles — one per cloud and workload tier:

| Cloud provider | Low                 | Recommended                 | High                 |
| -------------- | ------------------- | --------------------------- | -------------------- |
| AWS            | `fusion_aws_low`    | `fusion_aws_recommended`    | `fusion_aws_high`    |
| Google Cloud   | `fusion_google_low` | `fusion_google_recommended` | `fusion_google_high` |
| Azure          | `fusion_azure_low`  | `fusion_azure_recommended`  | `fusion_azure_high`  |

Use these tiers to match the workload you plan to run:

- **Low**: Minimum viable configuration. Use for smoke tests, proofs of concept, and small validation runs.
- **Recommended**: Matches Seqera's documented requirements for Fusion. Use as the default for production pipelines.
- **High**: Larger-scale production. Use for long-running pipelines that process large datasets.

Selecting a `fusion_*` profile automatically enables Fusion. You do not need to set it separately. The [`conf/fusion.config`](https://github.com/seqeralabs/nf-canary/blob/master/conf/fusion.config) file in the nf-canary repository defines the threshold values for each profile.

### Configure the launch form

In the launch form, open the **Fusion Filesystem Options** section and set:

- **Enable Fusion diagnostics**: Toggle on to run Fusion Doctor as part of the pipeline.
- **Redact PII**: Toggle on to mask bucket names, instance IDs, and home paths in the report. Enable this when sharing reports externally.
- **Read-only buckets**: Comma-separated list of bucket URIs to validate with read-only checks (e.g., `s3://reference-data,gs://shared-files`).
- **Read-write buckets**: Comma-separated list of bucket URIs to validate with read-write checks. The pipeline's work directory bucket is always appended automatically.

### Read the report

When the run completes, the diagnostic outputs appear in the **Reports** tab of the Platform run view. Two files are published to `outputs/fusion/` in the work directory:

- `fusion-report.html`: A self-contained HTML report with inline styles and scripts. Open it in the Reports tab to see an overview, recommendations, and expandable sections for system, storage, and object storage checks. You can also download this report and attach it to a support ticket.
- `fusion-report.json`: A combined machine-readable report with an `overall_status` field, useful for programmatic inspection or ingestion into monitoring systems.

The report assigns one of three overall statuses:

| Status     | Meaning                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `pass`     | All checks passed. The environment meets the thresholds in the selected profile.                                    |
| `degraded` | Non-critical checks failed or returned warnings. The environment is usable but may not meet recommended thresholds. |
| `fail`     | One or more critical checks failed. The environment does not meet the requirements for the selected profile.        |

:::tip
If Fusion Doctor reports `fail` or `degraded`, start with the highest-severity recommendations in the report. The HTML output sorts them automatically.
:::

## Getting help

When contacting Seqera support about Fusion Doctor findings, provide the following:

1. Environment details:

   - Cloud provider (AWS, Google Cloud, or Azure).
   - Compute environment type (AWS Batch, Google Batch, Azure Batch, EKS, or GKE).
   - Instance type used for the nf-canary run.
   - Fusion version.

1. Validation profile:

   - Name of the `fusion_*` profile selected (e.g., `fusion_aws_recommended`).
   - Any overrides applied in the launch form.

1. Report artifacts:

   - `fusion-report.html` from the **Reports** tab.
   - `fusion-report.json` from the work directory (`outputs/fusion/`).
   - The raw `fusion-doctor-report.json` if available.

1. Run identifiers:

   - The Seqera Platform run URL.
   - The workflow run ID or work directory path.

:::caution[Before sharing externally]
Enable **Redact PII** in the launch form before generating reports you plan to share outside your organization.
:::

---
title: "Overview"
description: "Introduction to pipelines in Seqera Platform."
date created: "2025-10-16"
tags: [pipelines, versioning, nextflow, parameters, reports, output, lineage]
---

Seqera Platform provides version-controlled, access-controlled, reproducible execution of Nextflow pipelines.

When you add a pipeline to Seqera, you define:

- The pipeline Git repository and [revision](./revision.md) (branch, tag, or commit)
- [Compute environment](../compute-envs/overview.md) for execution
- Pipeline parameters and [configuration profiles](https://docs.seqera.io/nextflow/config#config-profiles)
- (Optional) [Labels](../labels/overview.md), [resource labels](../resource-labels/overview.md), and [secrets](../secrets/overview.md)
- (Optional) [Pre-run and post-run](../launch/advanced.md#pre-and-post-run-scripts) bash scripts that execute in your compute environment

### Manage pipelines

- [Add pipelines](../getting-started/quickstart-demo/add-pipelines.md)
- [Edit pipelines](../launch/launchpad.md#edit-pipeline)
- [Launch pipelines](../launch/launchpad.md)

### Key features

#### Pipeline revision management

Workflow repositories change over time as code is updated. Seqera provides [revision management](./revision.md) features, such as **commit ID pinning** to ensure reproducible execution by locking pipelines to specific Git commits, and **Pull latest** controls to instruct Nextflow to fetch the most recent commit at execution time.

#### Pipeline outputs and reports

After a run completes, the [**Outputs** tab](../monitoring/run-details) on the run details page shows the files the pipeline produced. It contains up to two sub-tabs:

- **Pipeline outputs** — Output files declared using the [Nextflow workflow output syntax](https://docs.seqera.io/nextflow/workflow#outputs), with lineage IDs and labels that link each file back to the run that produced it. This sub-tab requires [data lineage](../data/data-lineage) enabled in the workspace or on the individual run, and a pipeline using the Nextflow workflow output syntax (Nextflow 24.10.0 or later).
- **Reports** — Named report files configured via `tower.yml`, visible for all runs where reports are set up. See [Reports](../reports/overview) to configure this.

#### Pipeline versioning

Seqera's [pipeline versioning system](./versioning.md) automatically tracks pipeline configuration changes as draft versions, creating an immutable audit trail of your pipeline evolution. Publish drafts to make important configurations easy to identify, share, and promote across your team. Version checksums provide cryptographic verification that workflow runs match their associated pipeline configurations.

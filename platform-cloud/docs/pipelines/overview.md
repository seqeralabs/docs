---
title: "Overview"
description: "Introduction to pipelines in Seqera Platform."
date created: "2025-10-16"
tags: [pipelines, versioning, nextflow, parameters]
---

Seqera Platform provides version-controlled, access-controlled, reproducible execution of Nextflow pipelines.

When you add a pipeline to Seqera, you define:

- The pipeline Git repository and [revision](./revision.md) (branch, tag, or commit)
- [Compute environment](../compute-envs/overview.md) for execution
- Pipeline parameters and [configuration profiles](https://www.nextflow.io/docs/latest/config.html#config-profiles)
- (Optional) [Labels](../labels/overview.md), [resource labels](../resource-labels/overview.md), and [secrets](../secrets/overview.md)
- (Optional) [Pre-run and post-run](../launch/advanced.md#pre-and-post-run-scripts) bash scripts that execute in your compute environment

### Manage pipelines

- [Add pipelines](../getting-started/quickstart-demo/add-pipelines.md)
- [Edit pipelines](../launch/launchpad.md#edit-pipeline)
- [Launch pipelines](../launch/launchpad.md)

### Key features

#### Pipeline revision management

Workflow repositories change over time as code is updated. Seqera provides [revision management](./revision.md) features, such as **commit ID pinning** to ensure reproducible execution by locking pipelines to specific Git commits, and **Pull latest** controls to instruct Nextflow to fetch the most recent commit at execution time.
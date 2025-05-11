---
title: "workspace"
description: "Introduction to Workspaces."
---

Each user has a unique workspace to manage all resources, such as pipelines, compute environments, and credentials.

:::tip
You can create multiple workspaces within an organization context and associate each of these workspaces with dedicated teams of users, while providing fine-grained access control for each of the teams. See [Orgs and teams](../orgs-and-teams/overview).
:::

The core components of a workspace are:

### Launchpad

The **Launchpad** offers a streamlined UI for launching and managing pipelines and their associated compute environments and credentials. Using the Launchpad, you can create a curated set of pipelines (including variations of the same pipeline) that are ready to be executed on the associated compute environments, while allowing the user to customize the pipeline-level parameters if needed.

### Runs

The **Runs** section monitors a launched workflow with real-time execution metrics, such as the number of pending or completed processes.

See [Launch](../launch/launch).

### Actions

You can trigger pipelines based on specific events, such as a version release on Github or a general Tower webhook.

See [Pipeline actions](../pipeline-actions/overview).

### Compute environments

Tower uses the concept of a **Compute environment** to define an execution platform for pipelines. Tower supports launching pipelines into a growing number of cloud (AWS, Azure, GCP) and on-premises (Slurm, IBM LSF, Grid Engine, etc.) infrastructures.

See [Compute environments](../compute-envs/overview).

### Credentials

The **Credentials** section allows users to set up the access credentials for various platforms (Github, Gitlab, BitBucket, etc.) and compute environments (cloud, Slurm, Kubernetes, etc.) See [Compute environments](../compute-envs/overview) and [Git integration](../git/overview) for information on your infrastructure.

See [Credentials](../credentials/overview).

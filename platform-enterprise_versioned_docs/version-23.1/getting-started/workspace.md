---
title: "Workspaces"
description: "Introduction to workspaces."
date: "21 Apr 2023"
tags: [workspaces]
---

Each user has a unique personal workspace to manage resources such as pipelines, compute environments, and credentials. You can also create multiple workspaces within an organization context and associate each of these workspaces with dedicated teams of users, while providing fine-grained access control for each of the teams. See [Orgs and teams](../orgs-and-teams/overview).

Each workspace consists of the same core components.

## Launchpad

The **Launchpad** offers a streamlined UI to launch and manage pipelines and associated compute environments and credentials. From the Launchpad, you can create a curated set of pipelines (including variations of the same pipeline) that are ready to be executed in the associated compute environments, while allowing the user to customize the pipeline-level parameters if needed.

## Runs

The **Runs** section monitors a launched workflow with real-time execution metrics, such as the number of pending or completed processes.

See [Launch](../launch/launch).

## Actions

You can trigger pipelines based on specific events, such as a version release on Github or a general Tower webhook.

See [Pipeline actions](../pipeline-actions/overview).

## Compute environments

A **compute environment** in Tower is used to define a pipeline execution platform. Tower supports a growing number of cloud (AWS, Azure, GCP) and on-premises (Slurm, IBM LSF, Grid Engine, etc.) infrastructures.

See [Compute environments](../compute-envs/overview).

## Credentials

The **Credentials** section allows users to set up the access credentials for Git providers (Github, Gitlab, BitBucket, etc.) and compute environments (AWS, Kubernetes, Slurm, etc.) See [Compute environments](../compute-envs/overview) and [Git integration](../git/overview) for information on your infrastructure.

See [Credentials](../credentials/overview).

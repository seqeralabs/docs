---
title: "Compute environment configuration"
description: Configuration options for compute environments
date: "21 Apr 2023"
tags: [compute, environment, configuration]
---

## `TOWER_ENABLE_PLATFORMS`

:::note
As of Tower 21.10.1, it is recommended to define your compute environments via the `TOWER_ENABLE_PLATFORMS` variable.

Earlier implementations which rely on the `MICRONAUT_ENVIRONMENTS` variable will continue to work and do not require modification.
:::

Tower allows the deployment of Nextflow pipelines on various execution platforms.

Populate the `TOWER_ENABLE_PLATFORMS` configuration variable with the platforms which your organization makes availabe to its Tower users.

**Example:**

```bash
# Include all available platforms, separating each value with a comma.
TOWER_ENABLE_PLATFORMS=awsbatch-platform,gls-platform,azbatch-platform,slurm-platform
```

The following options are available:

- `awsbatch-platform`: AWS Batch cloud compute service
- `gls-platform`: Google Life Sciences cloud compute service
- `azbatch-platform`: Azure Batch cloud compute service
- `lsf-platform`: IBM LSF batch scheduler
- `slurm-platform`: Slurm batch scheduler
- `altair-platform`: Altair PBS pro batch scheduler
- `uge-platform`: GridEngine batch scheduler
- `k8s-platform`: Kubernetes compute platform
- `eks-platform`: AWS EKS compute platform
- `gke-platform`: Google Kubernetes Engine compute platform
- `googlebatch-platform`: Google Batch cloud compute service

## `MICRONAUT_ENVIRONMENTS`

:::caution
These are required variables. Do not edit these values. As of Tower 21.1.0, the `TOWER_ENABLE_PLATFORMS` environment variable should be used to define your compute environment platforms.
:::

The Tower `cron` and `backend` containers are both based on container image `195996028523.dkr.ecr.eu-west-1.amazonaws.com/nf-tower-enterprise/backend:vxx.xx.x`. The values supplied to this configuration variable control the behavior of the resulting container.

```bash
# Settings for <CRON> container.
MICRONAUT_ENVIRONMENTS=prod,redis,cron

# Only for <BACKEND> container.
MICRONAUT_ENVIRONMENTS=prod,redis,ha
```

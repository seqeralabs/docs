---
title: "Usage limits"
description: "Seqera Platform usage limits per organization and workspace"
date: "19 Feb 2025"
tags: [limits]
---

Seqera Platform features have default limits per organization and workspace.

## Organizations

| Description             | Basic | Cloud Pro + Enterprise |
| ----------------------- | ----- | ---------------------- |
| Members                 | 3     | 50, or per license     |
| Workspaces              | 50    | 50, or per license     |
| Teams                   | 20    | 20, or per license     |
| Run history             | 250   | 250, or per license    |
| Active runs             | 3     | 100, or per license    |
| Running Studio sessions | 1     | 1000, or per license   |

:::note
A [service account](../orgs-and-teams/create-service-accounts) counts toward the **Members** limit. Creating one in an organization that has reached the limit fails.
:::

:::info
Seqera applies custom usage limits to academic institutions and commercial organizations evaluating Seqera Platform. [Contact us](https://seqera.io/contact-us/) for more information.
:::

## Workspaces

| Description  | Basic | Cloud Pro + Enterprise |
| ------------ | ----- | ---------------------- |
| Participants | 3     | 50, or per license     |
| Pipelines    | 100   | 100, or per license    |
| Datasets     | 100   | 1000, or per license   |
| Labels       | 1000  | 1000, or per license   |

:::note
Some Enterprise instances on older licenses are limited to 100 labels per workspace. [Contact support](mailto:support@seqera.io) to upgrade your license.
:::

## Datasets

| Description          | Default limit |
| -------------------- | ------------- |
| File size            | 10 MB         |
| Versions per dataset | 100           |

## Launch form

The launch form rejects run parameters and Nextflow configuration that exceed these sizes. The limits apply to the submitted payload, so a parameter set that passes validation in the form can still exceed the limit once Platform expands it.

| Description            | Configuration property        | Default limit |
| ---------------------- | ----------------------------- | ------------- |
| Run parameters         | `tower.launch.params.maxSize` | 20 KB         |
| Nextflow configuration | `tower.launch.config.maxSize` | 50 KB         |

Platform reports both limits through the `serviceInfo` API endpoint, so the launch form and the CLI apply the same values your installation is configured with.

If you need higher limits, [contact us](https://seqera.io/contact-us/) to discuss your requirements.

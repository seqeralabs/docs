---
title: "Usage limits"
description: "Seqera Platform usage limits per organization and workspace"
date created: "2025-02-19"
last updated: "2026-07-06"
tags: [limits, usage]
---

Seqera Platform features have default limits per organization and workspace.

:::info
Seqera applies custom usage limits to academic institutions and commercial organizations evaluating Seqera Platform. [Contact us](https://seqera.io/contact-us/) for more information.
:::

## Organizations

| Description               | Basic | Cloud Pro + Enterprise |
| ------------------------- | ----- | ---------------------- |
| Members                   | 3     | 50, or per license     |
| Workspaces                | 50    | 50, or per license     |
| Teams                     | 20    | 20, or per license     |
| Run history               | 250   | 250, or per license    |
| Active runs               | 3     | 100, or per license    |
| Running Studio sessions   | 1     | 1000, or per license   |
| Seqera Compute: Storage   | 25 GB per month | Unlimited    |
| Seqera Compute: CPU cores | 100   | 1000                   |

:::note
A [service account](../orgs-and-teams/create-service-accounts) counts toward the **Members** limit. Creating one in an organization that has reached the limit fails.
:::

:::note
Studios data egress is throttled at 100 GB per 24 hours per IP address, and 1 TB per `user_id` per month.
:::

## Workspaces

| Description                 | Basic | Cloud Pro + Enterprise |
| --------------------------- | ----- | ---------------------- |
| Participants                | 3     | 50, or per license     |
| Pipelines                   | 100   | 100, or per license    |
| Datasets                    | 100   | 1000, or per license   |
| Labels                      | 1000  | 1000, or per license   |
| Seqera Compute environments | 5     | 20                     |

:::note
Some Enterprise instances on older licenses are limited to 100 labels per workspace. [Contact support](mailto:support@seqera.io) to upgrade your license.
:::

## Datasets

| Description          | Default limit |
| -------------------- | ------------- |
| File size            | 10 MB         |
| Versions per dataset | 100           |

## Launch form

The launch form rejects run parameters and Nextflow configuration that exceed these sizes. The form checks run parameters when you launch, against the parameters it submits to Platform.

| Description            | Default limit |
| ---------------------- | ------------- |
| Run parameters         | 20 KB         |
| Nextflow configuration | 50 KB         |

If you need higher limits, [contact us](https://seqera.io/contact-us/) to discuss your requirements.

---
title: "Cloud providers"
description: "IAM, credentials, and data access setup for AWS, Azure, and Google Cloud."
tags: [cloud, aws, azure, gcp, integration]
---

Seqera Platform supports three cloud providers as compute backends. Each section here is the canonical reference for the IAM/role policies and credentials Seqera needs in that cloud account, independent of which compute environment type (Batch, Cloud, EKS) you create.

## Choose your cloud

| Cloud | Compute environment options | Setup |
|---|---|---|
| **AWS** | AWS Batch, AWS Cloud, Amazon EKS | [AWS integration](./aws/overview) |
| **Azure** | Azure Batch, Azure Cloud | [Azure integration](./azure/overview) |
| **Google Cloud** | Google Cloud Batch, Google Cloud | [Google Cloud integration](./google/overview) |

## What each section covers

Each cloud section contains:

- **Overview** — when to use each compute environment type for that cloud, and the credential models supported.
- **IAM policies / roles** — the canonical permissions Seqera Platform needs in your cloud account.
- **Credentials** — how to create IAM users, IAM roles, service principals, or service account keys, and how to add them to Seqera.
- **Data access / Storage** — bucket / container / file system prerequisites for the work directory.
- **Manual setup** (AWS and Azure only) — how to create cloud-side resources manually instead of letting Seqera Forge create them.

After completing the cloud-side setup, create the compute environment in Seqera using the relevant guide under [Compute](/platform-cloud/compute-envs/overview).

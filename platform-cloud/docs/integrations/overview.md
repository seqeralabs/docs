---
title: "Integrations overview"
description: "How Seqera Platform connects to external systems and what permissions it needs."
tags: [integrations, credentials]
---

Seqera Platform connects to a range of external systems — cloud providers, Git hosts, container registries, data sources, and HPC schedulers — to run pipelines, manage data, and orchestrate compute.

This section is the single home for **how to set those integrations up** and **what permissions each one needs**.

## Where to start

| If you want to... | Go to |
|---|---|
| Run pipelines on **AWS Batch**, **AWS Cloud**, or **Amazon EKS** | [AWS](./cloud-providers/aws/overview) |
| Run pipelines on **Azure Batch** or **Azure Cloud** | [Azure](./cloud-providers/azure/overview) |
| Run pipelines on **Google Cloud Batch** or **Google Cloud** | [Google Cloud](./cloud-providers/google/overview) |
| Pull pipelines from a **private Git repository** | [Git providers](./git-providers/overview) |
| Pull container images from a **private registry** (Wave) | [Container registries](./container-registries/overview) |
| Connect to **cloud storage** (S3 / Blob / GCS) for data | [Data sources](./data-sources/overview) |
| Use **managed identity** or **SSH** for compute access | [Identity & access](./identity/managed-identities) |
| Set up the **Seqera Agent** for hybrid or on-premises | [Agent credentials](./agent/credentials) |

## How credentials are stored

:::note
Seqera Platform encrypts all credentials with AES-256 encryption before storing them. No Seqera API exposes credentials in an unencrypted way.
:::

## Cloud provider integrations

The cloud provider sections cover IAM/role policies, credential creation, data access, and provider-specific extras. They are the canonical reference for the permissions Seqera needs in each cloud account.

- [AWS](./cloud-providers/aws/overview) — IAM policies, IAM user/role, S3/EFS/FSx, EKS additions, manual Batch setup
- [Azure](./cloud-providers/azure/overview) — custom roles, service principals, Storage and Batch accounts, manual Batch setup
- [Google Cloud](./cloud-providers/google/overview) — service account IAM, JSON keys, Cloud Storage

## Other integrations

- [Git providers](./git-providers/overview) — GitHub, GitLab, Bitbucket, Gitea, Azure DevOps, AWS CodeCommit, plus Seqera AI Git access.
- [Container registries](./container-registries/overview) — Docker Hub, AWS ECR, Azure ACR, Google Artifact Registry, Quay, GitHub/GitLab/Gitea registries.
- [Data sources](./data-sources/overview) — S3, Azure Blob, GCS, S3-compatible.
- [Identity & access](./identity/managed-identities) — Azure managed identities for compute environments, [SSH credentials](./identity/ssh-credentials) for HPC.
- [Agent](./agent/credentials) — Seqera Agent authentication for hybrid and on-premises deployments.

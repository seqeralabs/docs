---
title: "Azure integration"
description: "Connect Seqera Platform to Azure — roles, service principals, credentials, and storage."
tags: [azure, integration]
---

Seqera Platform integrates with Azure to run pipelines on Azure Batch and Azure Cloud, and to read input/output data from Azure Blob Storage. This page is the entry point for the Azure-side setup.

## Setup checklist

| Step | What to do | Page |
|---|---|---|
| 1 | Create a custom role and register an Entra application (service principal) | [Roles & service principals](./roles-and-service-principals) |
| 2 | Create or identify a Storage account and Blob container for the work directory | [Storage access](./storage-access) |
| 3 | (Azure Batch only) Create a Batch account and decide on credential type | [Roles & service principals](./roles-and-service-principals) |
| 4 | Add the credentials to Seqera | [Credentials](./credentials) |
| 5 | (Manual Batch only) Create Azure Batch pools and resources by hand | [Azure Batch manual setup](./manual-setup) |
| 6 | Create the compute environment | [Azure Batch](/platform-cloud/compute-envs/azure-batch) or [Azure Cloud](/platform-cloud/compute-envs/azure-cloud) |

## Choose a credential type

Azure supports two credential types:

- **Access keys** — Long-lived keys for the Storage and Batch accounts. Simple but limited (no VNet/subnet, two keys per account, broad access).
- **Entra service principals (recommended)** — Role-based access control via a registered application in Microsoft Entra ID. Required for VNet/subnet configuration. Optionally pair with a managed identity attached to the Batch pool for the most secure setup.

Both credential types support Batch Forge and Manual compute environments.

## Choose a compute environment type

| Compute environment | When to use it | Credential model |
|---|---|---|
| **Azure Batch** | Production-scale pipelines | Access keys or Entra service principal |
| **Azure Cloud** (preview) | Studios and small/medium pipelines, simplified setup | Entra service principal only |

For Azure Cloud, see the dedicated custom role JSON in [Roles & service principals](./roles-and-service-principals).

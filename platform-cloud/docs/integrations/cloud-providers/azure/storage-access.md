---
title: "Azure storage access"
description: "Storage account, Blob container, and Batch account prerequisites for Azure compute environments."
tags: [azure, storage, blob, batch, integration]
---

Seqera Platform on Azure requires:

- An **Azure resource group** to contain the resources.
- An **Azure Storage account** with at least one Blob container for the Nextflow work directory.
- An **Azure Batch account** (Azure Batch only).

The IAM/role permissions to access these resources are documented in [Roles & service principals](./roles-and-service-principals).

## Resource group

Create a resource group to contain the Azure Batch and Azure Storage resources.

:::note
A resource group can also be created on the fly when creating an Azure Storage or Azure Batch account.
:::

1. Log in to the Azure Portal, go to [Create Resource group](https://portal.azure.com/#create/Microsoft.ResourceGroup), and select **Create new resource group**.
1. Enter a name (e.g., `seqeracompute`).
1. Choose the preferred region.
1. Select **Review and Create**, then **Create**.

## Storage account

1. Log in to the Azure Portal, go to [Create storage account](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM), and select **Create a storage account**.
1. Enter a name (e.g., `seqeracomputestorage`).
1. Choose the preferred region. This must be the same region as the Batch account.
1. Platform supports all performance and redundancy settings — select what fits your use case.
1. Select **Next: Advanced**.
1. Enable **storage account key access**.
1. Select **Next: Networking**.
   - Enable public access from all networks. You can scope to specific virtual networks and IP addresses, but you cannot use Forge to create compute resources with that configuration. Disabling public access is not supported.
1. Configure **Data protection** (all settings supported) and **Encryption** (Microsoft-managed keys only).
1. Add tags as needed.
1. Select **Review and Create**, then **Create**.
1. Go to your new Storage account and select **+ Container** to create a Blob container (e.g., `seqeracomputestorage-container`).
1. Save the access keys from the **Access Keys** section if you plan to use shared-key authentication.

:::caution
Blob container storage credentials are associated with the Batch pool configuration. Avoid changing these credentials in your Seqera instance after creating the compute environment.
:::

## Batch account (Azure Batch only)

1. Log in to the Azure Portal and go to [Create a batch account](https://portal.azure.com/#create/Microsoft.BatchAccount).
1. Select an existing resource group or create a new one.
1. Enter a name (e.g., `seqeracomputebatch`).
1. Choose the preferred region — must match the Storage account region.
1. Select **Advanced**:
    - **Pool allocation mode**: **Batch service**
    - **Authentication mode**: **Shared Key**
1. Configure **Networking** to allow Platform access.
1. Select **Review and Create**, then **Create**.
1. From your new Batch account, copy the **Access Keys** if you plan to use shared-key authentication.

:::caution
A newly-created Azure Batch account may not be entitled to create virtual machines without making a service request to Azure. See [Azure Batch service quotas and limits](https://docs.microsoft.com/en-us/azure/batch/batch-quota-limit#view-batch-quotas).
:::

## Quotas

Check and increase Batch account quotas as needed:

- **Active jobs and schedules**: Each Nextflow process requires an active Azure Batch job per pipeline while running. Set this to a high level. See [jobs in Azure Batch](https://learn.microsoft.com/en-us/azure/batch/jobs-and-tasks).
- **Pools**: Each compute environment requires at least one pool. Batch Forge creates two pools by default (head + compute).
- **Batch accounts per region per subscription**: Set this to the number of accounts per region per subscription. One is usually enough.
- **Total Dedicated vCPUs per VM series**: Increase by the number of required concurrent CPUs. Machines are charged per CPU minute, so a higher quota does not increase cost. We recommend the latest E-series for cost-effective bioinformatics workloads.

## Next steps

- [Create the custom role and register the application](./roles-and-service-principals).
- [Add credentials to Seqera Platform](./credentials).
- Create the [Azure Batch](/platform-cloud/compute-envs/azure-batch) or [Azure Cloud](/platform-cloud/compute-envs/azure-cloud) compute environment.

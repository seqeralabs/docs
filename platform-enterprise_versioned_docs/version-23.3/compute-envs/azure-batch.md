---
title: "Azure Batch"
description: "Instructions to set up Azure Batch in Seqera Platform"
date: "04 Jan 2024"
tags: [azure, batch, compute environment]
---

:::note
This guide assumes you already have an Azure account with a valid Azure Subscription.
For details, visit [Azure Free Account][az-create-account].
Ensure you have sufficient permissions to create resource groups, an Azure Storage account, and a Batch account.
:::

## Concepts

### Accounts

Seqera Platform relies on an existing Azure Storage and Azure Batch account. You need at least 1 valid Azure Storage account and Azure Batch account within your subscription.

Azure uses 'accounts' for each service. For example, an [Azure Storage account][az-learn-storage] will house a collection of blob containers, file shares, queues, and tables. While you can have multiple Azure Storage and Azure Batch accounts in an Azure subscription, each compute environment on the platform can only use one of each (one storage and one Batch account). You can set up multiple compute environments on the platform with different credentials, storage accounts, and Batch accounts.

### Resource group

To create Azure Batch and Azure Storage accounts, first create a [resource group][az-learn-rg] in your preferred region.

:::note
A resource group can be created while creating an Azure Storage Account or Azure Batch account.
:::

### Regions

Azure resources can operate across regions, but this incurs additional costs and security requirements. It is recommended to place all resources in the same region. See the [Azure product page on data residency][az-data-residency] for more information.

## Resource group

A resource group in Azure is a unit of related resources in Azure. As a rule of thumb, resources that have a similar lifecycle should be within the same resource group. You can delete a resource group and all associated components together. We recommend placing all platform compute resources in the same resource group, but this is not necessary.

### Create a resource group

1. Log in to your Azure account, go to the [Create Resource group][az-create-rg] page, and select **Create new resource group**.
2. Enter a name for the resource group, e.g., _towerrg_.
3. Choose the preferred region.
4. Select **Review and Create** to proceed.
5. Select **Create**.

## Storage account

After creating a resource group, set up an [Azure storage account][az-learn-storage].

### Create a storage account

1. Log in to your Azure account, go to the [Create storage account][az-create-storage] page, and select **Create a storage account**.

    :::note
    If you haven't created a resource group, you can do so now.
    :::

2. Enter a name for the storage account (e.g., _towerrgstorage_).
3. Choose the preferred region (same as the Batch account).
4. The platform supports any performance or redundancy settings — select the most appropriate settings for your use case.
5. Select **Next: Advanced**.
6. Enable _storage account key access_.
7. Select **Next: Networking**.
   - Enable public access from all networks. You can enable public access from selected virtual networks and IP addresses, but you will be unable to use Forge to create compute resources. Disabling public access is not supported.
8. Select **Data protection**.
    - Configure appropriate settings. All settings are supported by the platform.
9. Select **Encryption**.
    - Only Microsoft-managed keys (MMK) are supported.
10. In **tags**, add any required tags for the storage account.
11. Select **Review and Create**.
12. Select **Create** to create the Azure Storage account.
13. You will need at least one blob storage container to act as a working directory for Nextflow.
14. Go to your new storage account and select **+ Container** to create a new Blob storage container. A new container dialogue will open. Enter a suitable name, e.g., _towerrgstorage-container_.
15. Go to the **Access Keys** section of your new storage account (_towerrgstorage_ in this example).
16. Store the access keys for your Azure Storage account, to be used when you create a Seqera compute environment.

:::caution
Blob container storage credentials are associated with the Batch pool configuration. Avoid changing these credentials in your Seqera instance after you have created the compute environment.
:::

## Batch account

After you have created a resource group and storage account, create a [Batch account][az-learn-batch].

### Create a Batch account

1. Log in to your Azure account and select **Create a batch account** on [this page][az-create-batch].
2. Select the existing resource group or create a new one.
3. Enter a name for the Batch account, e.g., _towerrgbatch_.
4. Choose the preferred region (same as the storage account).
5. Select **Advanced**.
6. For _Pool allocation mode_, select Batch service.
7. For _Authentication mode_, ensure _Shared Key_ is selected.
8. Select **Networking**. Ensure networking access is sufficient for the platform and any additional required resources.
9. In **tags**, add any required tags for the Batch account.
10. Select **Review and Create**.
11. Select **Create**.
12. Go to your new Batch account, then select **Access Keys**.
13. Store the access keys for your Azure Batch account, to be used when you create a Seqera compute environment.

:::caution
A newly-created Azure Batch account may not be entitled to create virtual machines without making a service request to Azure.
See [Azure Batch service quotas and limits][az-batch-quotas] for more information.
:::

14. Select the **+ Quotas** tab of the Azure Batch account to check and increase existing quotas if necessary.
15. Select **+ Request quota increase** and add the quantity of resources you require. Here is a brief guideline:

    - **Active jobs and schedules**: Each Nextflow process will require an active Azure Batch job per pipeline while running, so increase this number to a high level. See [here][az-learn-jobs] to learn more about jobs in Azure Batch.
    - **Pools**: Each Platform compute environment requires one Azure Batch pool. Each pool is composed of multiple machines of one virtual machine size.

    :::note
    To use separate pools for head and compute nodes, see [this FAQ entry](../faqs#azure).
    :::

    - **Batch accounts per region per subscription**: Set this to the number of Azure Batch accounts per region per subscription. Only one is required.
    - **Spot/low-priority vCPUs**: Platform does not support spot or low-priority machines when using Forge, so when using Forge this number can be zero. When manually setting up a pool, select an appropriate number of concurrent vCPUs here.
    - **Total Dedicated vCPUs per VM series**: See the Azure documentation for [virtual machine sizes][az-vm-sizes] to help determine the machine size you need. We recommend the latest version of the ED series available in your region as a cost-effective and appropriately-sized machine for running Nextflow. However, you will need to select alternative machine series that have additional requirements, such as those with additional GPUs or faster storage. Increase the quota by the number of required concurrent CPUs. In Azure, machines are charged per cpu minute so there is no additional cost for a higher number.

### Compute environment

There are two ways to create an Azure Batch compute environment in Seqera Platform:

- **Batch Forge**: Automatically creates Azure Batch resources.
- [**Manual**](#manual): For using existing Azure Batch resources.

### Batch Forge

:::caution
Batch Forge automatically creates resources that you may be charged for in your Azure account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

**Create a Batch Forge Azure Batch compute environment**

1. In a workspace, select **Compute Environments > New Environment**.
2. Enter a descriptive name, e.g., _Azure Batch (east-us)_.
3. Select **Azure Batch** as the target platform.
4. Choose existing Azure credentials or add a new credential. If you are using existing credentials, skip to step 7.

:::tip
You can create multiple credentials in your Seqera environment.
:::

5. Enter a name for the credentials, e.g., _Azure Credentials_.
6. Add the **Batch account** and **Blob Storage** account names and access keys.
7. Select a **Region**, e.g., _eastus_.
8. In the **Pipeline work directory** field, enter the Azure blob container created previously, e.g., `az://towerrgstorage-container/work`.

    :::note
    When you specify a Blob Storage bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://www.nextflow.io/docs/latest/cache-and-resume.html#cache-stores) by default. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
    :::

9. Select **Enable Wave containers** to facilitate access to private container repositories and provision containers in your pipelines using the Wave containers service. See [Wave containers][wave-docs] for more information.
10. Select **Enable Fusion v2** to allow access to your Azure Blob Storage data via the [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system. This speeds up most data operations. The Fusion v2 file system requires Wave containers to be enabled. See [Fusion file system](../supported_software/fusion/overview) for configuration details.
11. Set the **Config mode** to **Batch Forge**.
12. Enter the default **VMs type**, depending on your quota limits set previously. The default is _Standard_D4_v3_.
13. Enter the **VMs count**. If autoscaling is enabled (default), this is the maximum number of VMs you wish the pool to scale up to. If autoscaling is disabled, this is the fixed number of virtual machines in the pool.
14. Enable **Autoscale** to scale up and down automatically, based on the number of pipeline tasks. The number of VMs will vary from **0** to **VMs count**.
15. Enable **Dispose resources** for Seqera to automatically delete the Batch pool if the compute environment is deleted on the platform.
16. Select or create [**Container registry credentials**](../credentials/azure_registry_credentials) to authenticate a registry (used by the [Wave containers](https://www.nextflow.io/docs/latest/wave.html) service). It is recommended to use an [Azure Container registry](https://azure.microsoft.com/en-gb/products/container-registry) within the same region for maximum performance.
17. Apply [**Resource labels**](../resource-labels/overview). This will populate the **Metadata** fields of the Azure Batch pool.
18. Expand **Staging options** to include optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
19. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
20. Configure any advanced options you need:

    - Use **Jobs cleanup policy** to control how Nextflow process jobs are deleted on completion. Active jobs consume the quota of the Azure Batch account. By default, jobs are terminated by Nextflow and removed from the quota when all tasks succesfully complete. If set to _Always_, all jobs are deleted by Nextflow after pipeline completion. If set to _Never_, jobs are never deleted. If set to _On success_, successful tasks are removed but failed tasks will be left for debugging purposes.
    - Use **Token duration** to control the duration of the SAS token generated by Nextflow. This must be as long as the longest period of time the pipeline will run.

21. Select **Add** to finalize the compute environment setup. It will take a few seconds for all the resources to be created before the compute environment is ready to launch pipelines.

**See [Launch pipelines](../launch/launchpad) to start executing workflows in your Azure Batch compute environment.**

## Manual

This section is for users with a pre-configured Azure Batch pool. This requires an existing Azure Batch account with an existing pool.

:::caution
Your Seqera compute environment uses resources that you may be charged for in your Azure account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

**Create a manual Seqera Azure Batch compute environment**

1. In a workspace, select **Compute Environments > New Environment**.
2. Enter a descriptive name for this environment, e.g., _Azure Batch (east-us)_.
3. Select **Azure Batch** as the target platform.
4. Select your existing Azure credentials or select **+** to add new credentials. If you choose to use existing credentials, skip to step 7.

:::tip
You can create multiple credentials in your Seqera environment.
:::

5. Enter a name, e.g., _Azure Credentials_.
6. Add the **Batch account** and **Blob Storage** credentials you created previously.
7. Select a **Region**, e.g., _eastus (East US)_.
8. In the **Pipeline work directory** field, add the Azure blob container created previously, e.g., `az://towerrgstorage-container/work`.

    :::note
    When you specify a Blob Storage bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://www.nextflow.io/docs/latest/cache-and-resume.html#cache-stores) by default. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
    :::

9. Set the **Config mode** to **Manual**.
10. Enter the **Compute Pool name**. This is the name of the Azure Batch pool you created previously in the Azure Batch account.

    :::note
    The default Azure Batch implementation uses a single pool for head and compute nodes. To use separate pools for head and compute nodes (e.g., to use low-priority VMs for compute jobs), see [this FAQ entry](../faqs#azure).
    :::

11. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
12. Configure any advanced options you need:

    - Use **Jobs cleanup policy** to control how Nextflow process jobs are deleted on completion. Active jobs consume the quota of the Azure Batch account. By default, jobs are terminated by Nextflow and removed from the quota when all tasks succesfully complete. If set to _Always_, all jobs are deleted by Nextflow after pipeline completion. If set to _Never_, jobs are never deleted. If set to _On success_, successful tasks are removed but failed tasks will be left for debugging purposes.
    - Use **Token duration** to control the duration of the SAS token generated by Nextflow. This must be as long as the longest period of time the pipeline will run.

13. Select **Add** to finalize the compute environment setup. It will take a few seconds for all the resources to be created before you are ready to launch pipelines.

**See [Launch pipelines](../launch/launchpad) to start executing workflows in your Azure Batch compute environment.**

[az-data-residency]: https://azure.microsoft.com/en-gb/explore/global-infrastructure/data-residency/#select-geography
[az-batch-quotas]: https://docs.microsoft.com/en-us/azure/batch/batch-quota-limit#view-batch-quotas
[az-vm-sizes]: https://learn.microsoft.com/en-us/azure/virtual-machines/sizes
[az-create-account]: https://azure.microsoft.com/en-us/free/
[az-learn-rg]: https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groups
[az-create-batch]: https://portal.azure.com/#create/Microsoft.BatchAccount
[az-learn-storage]: https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview
[az-learn-batch]: https://learn.microsoft.com/en-us/training/modules/create-batch-account-using-azure-portal/
[az-learn-jobs]: https://learn.microsoft.com/en-us/azure/batch/jobs-and-tasks
[az-create-rg]: https://portal.azure.com/#create/Microsoft.ResourceGroup
[az-create-storage]: https://portal.azure.com/#create/Microsoft.StorageAccount-ARM

[wave-docs]: https://docs.seqera.io/wave

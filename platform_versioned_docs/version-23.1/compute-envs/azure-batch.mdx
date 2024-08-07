---
title: "Azure Batch"
description: "Instructions to set up Azure Batch in Nextflow Tower"
date: "21 Apr 2023"
tags: [batch, azure, compute environment]
---

:::caution
The Tower support for Azure Batch is currently in beta. Any feedback and suggestions are welcome.

    Depending on your region and subscription type, a newly-created account may not be entitled to any VMs without first making a service request to Azure. See Azure Batch [service quotas and limits](https://docs.microsoft.com/en-us/azure/batch/batch-quota-limit#view-batch-quotas) for more information.

:::

:::note
This guide assumes you have an existing [Azure account](https://azure.microsoft.com/en-us/free/).
:::

There are two ways to create an Azure Batch compute environment in Tower:

- [**Batch Forge**](#tower-forge): This option automatically creates the Azure Batch resources needed for your Tower compute environment. This eliminates the need to set up your Azure Batch infrastructure manually.

- [**Manual**](#manual): This option allows Tower to use existing Azure Batch resources.

## Batch Forge

Batch Forge creates the Azure Batch resources needed for your compute environment, recommended if you do not yet have an Azure Batch environment fully set up. Note that this will create resources that may have associated costs in your Azure account.

### Resource group

To create Azure Batch and Azure Storage accounts, first create a **resource group** in the region of your choice.

If you are logged in to your Azure account, select **Create new resource group** on [this page](https://portal.azure.com/#create/Microsoft.ResourceGroup).

1. Enter a name for the resource group (e.g. `towerrg`).

2. Select the preferred region for this resource group.

3. Select **Review and Create** to proceed to the review screen.

4. Select **Create** to create the resources.

### Storage account

The next step is to create the necessary Azure Storage.

If you are logged in to your Azure account, select **Create a storage account** on [this page](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts).

1. Enter a name for the storage account (e.g., `towerrgstorage`).

2. Select the preferred region for this storage account.

3. Select **Review and Create** to proceed to the review screen.

4. Select **Create** to create the Azure Storage account.

5. Navigate to your new storage account and select **Container**.

6. Create a new Blob container by selecting **+ Container**.

   A new container dialogue will open. Enter a suitable name (e.g. `towerrgstorage-container`).

7. Once the new Blob container is created, navigate to the **Access Keys** section of the storage account (`towerrgstorage` in this example).

8. Store the access keys for the newly created Azure Storage account.

   :::note
   Blob container storage credentials are associated with the Batch pool configuration when it is created. Once your compute environment has been created with Batch Forge, these credentials should not be changed in Tower.
   :::

### Batch account

The next step is to create the necessary Batch account.

If you are logged in to your Azure account, select **Create a batch account** on [this page](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Batch%2FbatchAccounts).

1. Enter a name for the Batch account (e.g. `towerrgbatch`).

2. Select the preferred region for this Batch account.

3. Select **Review and Create** to proceed to the review screen.

4. Select **Create** to create the Azure Batch account.

### Compute environment

Batch Forge automates the configuration of an [Azure Batch](https://azure.microsoft.com/en-us/services/batch/) compute environment and the queues required for the deployment of Nextflow pipelines.

Once the Azure resources are set up, add a new compute environment in Tower:

1. In a workspace, select **Compute Environments** and then **New Environment**.

2. Enter a descriptive name for this environment, e.g. "Azure Batch (east-us)"

3. Select **Azure Batch** as the target platform.

4. From the **Credentials** drop-down, select existing Azure credentials, or select **+** to add new credentials. If you have existing credentials, skip to step 7.

5. Enter a name, e.g. "Azure Credentials".

6. Add the **Batch account** and **Blob Storage** credentials that we created previously.

   :::tip
   You can create multiple credentials in your Tower environment.
   :::

7. Select a **Region**, for example "eastus (East US)".

8. In the **Pipeline work directory** field, enter the Azure blob container created previously, e.g., `az://towerrgstorage-container/work`.

   :::caution
   The blob container must be in the same **Region** from step 7.
   :::

9. Set the **Config mode** to **Batch Forge**.

10. Enter the default VM type, depending on your quota limits. The default is `Standard_D4_v3`.

11. Enter the **VMs count**. This is the number of VMs you wish to deploy.

12. Enable **Autoscale** if you'd like to scale up and down automatically based on the number of pipeline tasks. The number of VMs will vary from **0** to **VMs count**.

13. Enable **Dispose resources** if you'd like Tower to automatically delete the Batch pool once the workflow is complete.

14. Select or create a [**Container registry credential**](../credentials/azure_registry_credentials.mdx) to authenticate to an Azure registry (used by the [Wave containers](https://www.nextflow.io/docs/latest/wave.html) service).

15. Apply [**Resource labels**](../resource-labels/overview.mdx) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.

16. Expand **Staging options** to include optional pre- or post-run Bash scripts that execute before or after the Nextflow pipeline execution in your environment.

17. You can use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

18. Configure any advanced options (see below), as needed.

19. Select **Create** to finalize the compute environment setup. It will take a few seconds for all the resources to be created before the compute environment is ready to launch pipelines.

Jump to the documentation for [launching pipelines](../launch/launchpad.mdx).

### Advanced options

- Use **Jobs cleanup policy** to control how jobs are deleted upon workflow completion.

- Use **Token duration** to control the duration of the SAS token generated by Nextflow.

## Manual

This section is for users with a pre-configured Azure environment. You will need an Azure Batch account and Storage account already set up.

To create a new compute environment for AWS Batch (without Forge):

1. In a workspace, select **Compute Environments**, then **New Environment**.

2. Enter a descriptive name for this environment, e.g. "Azure Batch (east-us)".

3. Select **Azure Batch** as the target platform.

4. Select your existing Azure credentials or add new credentials by selecting the **+** button. If you are using existing credentials, skip to step 7.

5. Enter a name, e.g. "Azure Credentials".

6. Add the **Batch account** and **Blob Storage** credentials that we created previously.

   :::tip
   You can create multiple credentials in your Tower environment.
   :::

7. Select a **Region**, for example "eastus (East US)".

8. In the **Pipeline work directory** field, add the Azure blob container created previously, e.g. `az://towerrgstorage-container/work`.

   :::caution
   The Blob container must be in the same **Region** specified in step 7 above.
   :::

9. Set the **Config mode** to **Manual**.

10. Enter the **Compute Pool name**. This is the name of the Azure Batch pool provided to you by your Azure administrator.

11. Use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

12. Configure any advanced options described below, as needed.

13. Select **Create** to finalize the compute environment setup. It will take a few seconds for all the resources to be created, and then you will be ready to launch pipelines.

Jump to the documentation for [launching pipelines](../launch/launchpad.mdx).

### Advanced options

<!-- revisit with some nuance in future-->

- Use **Jobs cleanup policy** to control how jobs are deleted upon workflow completion.

- Use **Token duration** to control the duration of the SAS token generated by Nextflow.

---
title: "Azure Batch"
description: "Instructions to set up Azure Batch in Seqera Platform"
date created: "2024-01-04"
last updated: "2026-04-17"
tags: [azure, batch, compute environment]
---

:::note
This guide assumes you already have an Azure account with a valid Azure Subscription.
For details, visit [Azure Free Account][az-create-account].
Ensure you have sufficient permissions to create resource groups, an Azure Storage account, and an Azure Batch account.
:::

## Azure concepts

#### Regions

Azure regions are specific geographic locations around the world where Microsoft has established data centers to host its cloud services. Each Azure region is a collection of data centers that provide users with high availability, fault tolerance, and low latency for cloud services. Each region offers a wide range of Azure services that can be chosen to optimize performance, ensure data residency compliance, and meet regulatory requirements. Azure regions also enable redundancy and disaster recovery options by allowing resources to be replicated across different regions, enhancing the resilience of applications and data.

#### Resource groups

An Azure resource group is a logical container that holds related Azure resources such as virtual machines, storage accounts, databases, and more. A resource group serves as a management boundary to organize, deploy, monitor, and manage the resources within it as a single entity. Resources in a resource group share the same lifecycle, meaning they can be deployed, updated, and deleted together. This also enables easier access control, monitoring, and cost management, making resource groups a foundational element in organizing and managing cloud infrastructure in Azure.

#### Accounts

Azure uses accounts for each service. For example, an [Azure Storage account][az-learn-storage] will house a collection of blob containers, file shares, queues, and tables. An Azure subscription can have multiple Azure Storage and Azure Batch accounts - however, a Platform compute environment can only use one of each. Multiple Platform compute environments can be created to use separate credentials, Azure Storage accounts, and Azure Batch accounts.

#### Service principals

An Azure service principal is an identity created specifically for applications, hosted services, or automated tools to access Azure resources. It acts like a user identity with a defined set of permissions, enabling resources authenticated through the service principal to perform actions within the Azure account. Seqera can utilize an Azure service principal to authenticate and access Azure Batch for job execution and Azure Storage for data management.

## Before you start

Set up the [Azure integration](/platform-cloud/integrations/cloud-providers/azure/overview) before creating an Azure Batch compute environment in Seqera:

- [Storage access](/platform-cloud/integrations/cloud-providers/azure/storage-access) — resource group, Storage account, Blob container, and Batch account prerequisites.
- [Roles & service principals](/platform-cloud/integrations/cloud-providers/azure/roles-and-service-principals) — required role assignments and service principal registration.
- [Azure credentials](/platform-cloud/integrations/cloud-providers/azure/credentials) — access keys, Entra service principals, and managed identities.
- [Azure Batch manual setup](/platform-cloud/integrations/cloud-providers/azure/manual-setup) — manual pool wiring and advanced scenarios.

{/* Anchor stubs preserved for backwards compatibility with deep links from older content. */}
<a id="azure-concepts"></a>
<a id="create-azure-resources"></a>
<a id="resource-group"></a>
<a id="storage-account"></a>
<a id="batch-account"></a>
<a id="credentials"></a>
<a id="access-keys"></a>
<a id="entra-service-principal-and-managed-identity"></a>
<a id="service-principal"></a>
<a id="managed-identity"></a>

## Add Seqera compute environment

There are two ways to create an Azure Batch compute environment in Seqera Platform:

- [**Batch Forge**](#batch-forge): Automatically creates Azure Batch resources.
- [**Manual**](#manual): For using existing Azure Batch resources.

### VM size considerations

Azure Batch requires you to select an appropriate VM size for your compute environment. There are a number of considerations when selecting VM sizes — See [Sizes for virtual machines in Azure][az-vm-sizes] for more information.

1. **Family**: The first letter of the VM size name indicates the machine family. For example, `Standard_E16d_v5` is a member of the E family.
    - *A*: Economical machines, low power machines.
    - *B*: Burstable machines which use credits for cost allocation.
    - *D*: General purpose machines suitable for most applications.
    - *DC*: D machines with additional confidential compute capabilities.
    - *E*: The same as D but with more memory. These are generally the best machines for bioinformatics workloads.
    - *EC*: The same as E but with additional confidential compute capabilities.
    - *F*: Compute optimized machines which come with a faster CPU compared to D-series machines.
    - *M*: Memory optimized machines which come with extremely large and fast memory layers, typically more than is needed for bioinformatics workloads.
    - *L*: Storage optimized machines which come with large locally attached NVMe storage drives. Note that these need to be configured before you can use them with Azure Batch.
    - *N*: Accelerated computing machines which come with FPGAs, GPUs, or custom ASICs.
    - *H*: High performance machines which come with the fastest processors and memory.

In general, we recommend using the E family of machines for bioinformatics workloads since these are cost-effective, widely available, and sufficiently fast.

1. **vCPUs**: The machine's number of vCPUs. This is the main factor in determining the speed of the machine.
1. **features**: Additional machine features. For example, some machines come with a local SSD.
    - d: A local storage disk. Azure Batch can use this disk automatically instead of the operating system disk.
    - s: The VM supports a [premium storage account][az-premium-storage].
    - a: AMD CPUs instead of Intel.
    - p: ARM-based CPUs, such as Azure Cobalt.
    - l: Reduced memory with a large cost reduction.

1. **Version**: The version of the VM size. This is the generation of the machine. Typically, more recent is better but availability can vary between regions.

In the Azure Portal on the page for your Azure Batch account, request an appropriate quota for your desired VM size. See [Azure Batch service quotas and limits][az-batch-quotas] for more information.

### Batch Forge

:::caution
Batch Forge automatically creates resources that you may be charged for in your Azure account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

Create a Batch Forge Azure Batch compute environment:

1. In a workspace, select **Compute Environments > New Environment**.
1. Enter a descriptive name, such as _Azure Batch (east-us)_.
1. Select **Azure Batch** as the target platform.
1. Choose existing Azure credentials or add a new credential.

   :::note
   Both access keys and Entra service principal credentials are supported for Batch Forge. Some features, such as VNet/subnet configuration, require Entra credentials.
   :::
1. Add the **Batch account** and **Blob Storage** account names and access keys.
1. Select a **Region**, such as _eastus_.
1. In the **Work directory** field, enter the Azure blob container created previously. For example, `az://seqeracomputestorage-container/work`.
    :::note
    When you specify a Blob Storage bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://docs.seqera.io/nextflow/cache-and-resume#cache-stores) by default. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
    :::
1. Select **Enable Wave containers** to facilitate access to private container repositories and provision containers in your pipelines using the Wave containers service. See [Wave containers][wave-docs] for more information.
1. Select **Enable Fusion v2** to allow access to your Azure Blob Storage data via the [Fusion v2][fusion-docs] virtual distributed file system. This speeds up most data operations. The Fusion v2 file system requires Wave containers to be enabled. See [Fusion file system](../supported_software/fusion/overview) for configuration details.

    <details>
    <summary>Use Fusion v2</summary>

    :::note
    The compute recommendations below are based on internal benchmarking performed by Seqera. Benchmark runs of [nf-core/rnaseq](https://github.com/nf-core/rnaseq) used profile `test_full`, consisting of an input dataset with 16 FASTQ files and a total size of approximately 123.5 GB.
    :::

    Azure virtual machines include fast SSDs and require no additional storage configuration for Fusion. For optimal performance, use VMs with sufficient local storage to support Fusion's streaming data throughput.

    1. Use Seqera Platform version 23.1 or later.
    1. Use an Azure Blob storage container as the work directory.
    1. Enable **Wave containers** and **Fusion v2**.
    1. Select the **Batch Forge** config mode.
    1. Specify suitable VM sizes under **VMs type**. A `Standard_E16d_v5` VM or larger is recommended for production use.

    :::tip
    We recommend selecting machine types with a local temp storage disk of at least 200 GB and a random read speed of 1000 MBps or more for large and long-lived production pipelines. To work with files larger than 100 GB, increase temp storage accordingly (400 GB or more).

    The suffix `d` after the core number (e.g., `Standard_E16*d*_v5`) denotes a VM with a local temp disk. Select instances with Standard SSDs — Fusion does not support Azure network-attached storage (Premium SSDv2, Ultra Disk, etc.). Larger local storage increases Fusion's throughput and reduces the chance of overloading the machine. See [Sizes for virtual machines in Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview) for more information.
    :::

    </details>

1. (Optional) Enter a **Subnet ID** to connect the Batch pool nodes to a private Azure VNet. Enter the full Azure ARM subnet resource ID in the following format:

    ```
    /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Network/virtualNetworks/{vnetName}/subnets/{subnetName}
    ```

    :::note
    VNet/subnet configuration requires Entra credentials. This field is only available when Entra credentials are selected. If no subnet ID is provided, default networking is used.
    :::

1. Set the **Config mode** to **Batch Forge**.
1. Enter the default **VMs type** for compute tasks, depending on your quota limits set previously. The default is _Standard_D4_v3_.
1. Enter the **VMs count**. If autoscaling is enabled (default), this is the maximum number of VMs the compute pool will scale up to. If autoscaling is disabled, this is the fixed number of virtual machines in the compute pool.
1. (Optional) Configure **Head job resources** to control the VM type and resources allocated to the Nextflow head job:
    - **Head VM type**: The VM size for the head node pool. If not specified, the same VM type as the compute pool is used.
    - **Head job CPUs**: The number of CPUs allocated to the Nextflow head job.
    - **Head job memory**: The amount of memory allocated to the Nextflow head job.
1. Enable **Autoscale** to scale the compute pool up and down automatically, based on the number of pipeline tasks. The number of VMs will vary from **0** to **VMs count**.
1. Enable **Dispose resources** for Seqera to automatically delete the Batch pools if the compute environment is deleted on the platform.

:::info
Batch Forge creates separate Azure Batch pools for the Nextflow head job and compute tasks by default (named `tower-pool-{envId}-head` and `tower-pool-{envId}-worker`). This prevents the head node from competing for resources with compute tasks and allows independent sizing of each pool.
:::

1. Select or create [**Container registry credentials**](/platform-cloud/integrations/container-registries/azure) to authenticate a registry (used by the [Wave containers](https://docs.seqera.io/nextflow/wave) service). It is recommended to use an [Azure Container registry](https://azure.microsoft.com/en-gb/products/container-registry) within the same region for maximum performance.
1. Apply [**Resource labels**](../resource-labels/overview). This will populate the **Metadata** fields of the Azure Batch pools and jobs.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch.
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced#nextflow-config-file) for more information on configuration priority.
    :::
1. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
1. Configure any advanced options you need:

    - Use **Max wallclock time** to set the maximum duration a job can run. The default is 7 days. Accepts human-readable duration syntax (e.g., `7d`, `12h`, `1d6h30m`). The maximum allowed by Azure Batch is 180 days. Existing compute environments without this setting use Nextflow's default of 30 days.

    - **Job cleanup toggles** control how Nextflow process jobs are managed on completion. Active jobs consume the quota of your Azure Batch account. Three independent toggles are available:

      | Toggle | Default | Description |
      |--------|---------|-------------|
      | **Delete jobs on completion** | Off | Permanently deletes all jobs and their tasks from Azure Batch when the workflow finishes. |
      | **Delete tasks on completion** | On | Deletes individual tasks from jobs when they complete successfully. Failed tasks are preserved for debugging. |
      | **Terminate jobs on completion** | On | Sets jobs to terminate when all their tasks complete. Jobs remain in "completed" state but are no longer active. |

      Existing compute environments retain their current cleanup behavior.

    - Use **Token duration** to control the duration of the SAS token generated by Nextflow. This must be as long as the longest period of time the pipeline will run.
1. Select **Add** to finalize the compute environment setup. It will take a few seconds for all the resources to be created before the compute environment is ready to launch pipelines.

:::info
See [Launch pipelines](../launch/launchpad) to start executing workflows in your Azure Batch compute environment.
:::

### Manual

You can configure Seqera Platform to use a pre-existing Azure Batch pool. This allows the use of more advanced Azure Batch features, such as custom VM images and private networking. See [Azure Batch security best practices][az-batch-best-practices] for more information.

:::caution
Your Seqera compute environment uses resources that you may be charged for in your Azure account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

#### Create a Nextflow-compatible Azure Batch pool

If not described below, use the default settings:

1. **Account**: You must have an existing Azure Batch account. Ideally, you should already have tested whether you can run an Azure Batch task within this account. Any type of account is compatible.
1. **Quota**: You must check you have sufficient quota for the number of pools, jobs, and vCPUs per series. See [Azure Batch service quotas and limits][az-batch-quotas] for more information.
1. On the Azure Batch page of the Azure Portal, select **Pools** and then **+ Add**.
1. **Name**: Enter a **Pool ID** and **Display Name**. This ID will be used by Seqera and Nextflow.
1. **Identity**: Select **User assigned** to use a managed identity for the pool. Select **Add** for the user-assigned managed identity and select the managed identity with the correct permissions to the Azure Storage and Batch accounts.
1. **Operating System**: You can use any Linux-based image here, but it is recommended to use it with a Microsoft Azure Batch-provided image. Note that there are two generations of Azure Virtual Machine images, and certain VM series are only available in one generation. See [Azure Virtual Machine series][az-vm-gen] for more information. For default settings, select the following:
    - **Publisher**: `microsoft-dsvm`
    - **Offer**: `ubuntu-hpc`
    - **Sku**: `2204`
    - **Security type**: `standard`
1. **OS disk storage account type**: Certain VM series only support a specific Storage account type. See [Azure managed disk types][az-disk-type] and [Azure Virtual Machine series][az-vm-gen] for more information. In general, a VM series with the suffix *s* supports a *Premium LRS* Storage account type. For example, a `standard_e16ds_v5` supports `Premium_LRS` but a `standard_e16d_v5` does not. Premium LRS offers the best performance.
1. **OS disk size**: The size of the OS disk in GB. This must be sufficient to hold every Docker container the VM will run, plus any logging or further files. If you are not using a machine with attached storage, you must increase this disk size to accommodate task files (see VM type below). If you are using a machine with attached storage, this setting can be left at the OS default size.
1. **Container configuration**: Container configuration must be turned on. Do this by switching it from **None** to **Custom**. The type is **Docker compatible** which should be the only available option. This will enable the VM to use Docker images and is sufficient. However, you can add further options:
    - Under **Container image names** you can add containers for the VM to grab at startup time. Add a list of fully qualified Docker URIs, such as `quay.io/seqeralabs/nf-launcher:j17-23.04.2`. - Under **Container registries**, you can add any container registries that require additional authentication. Select **Container registries**, then **Add**. Here, you can add a registry username, password, and registry server. If you attached the managed identity earlier, select this as an authentication method so you don't have to enter a username and password.
1. **VM size**: This is the size of the VM. See [Sizes for virtual machines in Azure][az-vm-sizes] for more information.
1. **Scale**: Azure Node pools can be fixed in size or autoscale based on a formula. Autoscaling is recommended to enable scaling your resources down to zero when not in use. Select **Auto scale** and change the **AutoScale evaluation interval** to 5 minutes - this is the minimum period between evaluations of the autoscale formula. For **Formula**, you can use any valid formula — See [Create a formula to automatically scale compute nodes in a Batch pool][az-batch-autoscale] for more information. This is the default autoscaling formula, with a maximum of 8 VMs:

    ```
    // Get pool lifetime since creation.
    lifespan = time() - time("2024-10-30T00:00:00.880011Z");
    interval = TimeInterval_Minute * 5;

    // Compute the target nodes based on pending tasks.
    // $PendingTasks == The sum of $ActiveTasks and $RunningTasks
    $samples = $PendingTasks.GetSamplePercent(interval);
    $tasks = $samples < 70 ? max(0, $PendingTasks.GetSample(1)) : max( $PendingTasks.GetSample(1), avg($PendingTasks.GetSample(interval)));
    $targetVMs = $tasks > 0 ? $tasks : max(0, $TargetDedicatedNodes/2);
    targetPoolSize = max(0, min($targetVMs, 8));

    // For first interval, deploy 1 node, for other intervals scale up/down as per tasks.
    $TargetDedicatedNodes = lifespan < interval ? 1 : targetPoolSize;
    $NodeDeallocationOption = taskcompletion;
    ```

1. **Start task**: This is the task that will run on each VM when it joins the pool. This can be used to install additional software on the VM. When using Batch Forge, this is used to install `azcopy` for staging files onto and off of the node. Select **Enabled** and add the following command line to install `azcopy`:

    ```shell
    bash -c "chmod +x azcopy && mkdir $AZ_BATCH_NODE_SHARED_DIR/bin/ && cp azcopy $AZ_BATCH_NODE_SHARED_DIR/bin/"
    ```

    Select **Resource files** then select **Http url**. For the **URL**, add `https://nf-xpack.seqera.io/azcopy/linux_amd64_10.8.0/azcopy` and for **File path** enter `azcopy`. Every other setting can be left default.

    :::note
    When not using Fusion, every node **must** have `azcopy` installed.
    :::

1. **Task Slots**: Set task slots to the machine's number of vCPUs. For example, select `4` for a `Standard_D4_v3` VM size.
1. **Task scheduling policy**: This can be set to `Pack` or `Spread`. `Pack` will attempt to schedule tasks from the same job on the same VM, while `Spread` will attempt to distribute tasks evenly across VMs.
1. **Virtual Network**: If you are using a virtual network, you can select it here. Be sure to select the correct virtual network and subnet. The VMs require:
    - Access to container registries (such as quay.io and docker.io) to pull containers.
    - Access to Azure Storage to copy data using `azcopy`.
    - Access to any remote files required by the pipeline, such as AWS S3 storage.
    - Communication with the head node that runs Nextflow and Seqera to relay logs and information.
    Note that overly-restrictive networking may prevent pipelines from running successfully.
1. **Mount configuration**: Nextflow *only* supports Azure File Shares. Select `Azure Files Share`, then add:
    - **Source**: URL in format `https://${accountName}.file.core.windows.net/${fileShareName}`
    - **Relative mount path**: Path where the file share will be mounted on the VM
    - **Storage account name** and **Storage account key** (managed identity is not supported)

Leave the node pool to start and create a single Azure VM. Monitor the VM to ensure it starts correctly. If any errors occur, check and correct them - you may need to create a new Azure node pool if issues persist.

The following settings can be modified after creating a pool:

- Autoscale formula
- Start task
- Application packages
- Node communication
- Metadata

#### Create a manual Seqera Azure Batch compute environment

1. In a workspace, select **Compute Environments**, then **Add compute environment**.
1. Enter a descriptive name for this environment, such as _Azure Batch (east-us)_.
1. For **Provider**, select **Azure Batch**.
1. Select your existing Azure credentials (access keys or Entra service principal) or select **+** to add new credentials.

   :::note
   Both access keys and Entra service principal credentials are supported. Some features, such as VNet/subnet configuration, require Entra credentials. To use Entra with a managed identity, see [Managed identity](/platform-cloud/integrations/cloud-providers/azure/credentials#managed-identity-azure-batch).
   :::
1. Select a **Region**, such as _eastus (East US)_.
1. In the **Work directory** field, add the Azure blob container created previously. For example, `az://seqeracomputestorage-container/work`.
    :::note
    When you specify a Blob Storage bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://docs.seqera.io/nextflow/cache-and-resume#cache-stores) by default. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
    :::
1. Select **Enable Wave containers** to facilitate access to private container repositories and provision containers in your pipelines using the Wave containers service. See [Wave containers][wave-docs] for more information.
1. Select **Enable Fusion v2** to allow access to your Azure Blob Storage data via the [Fusion v2][fusion-docs] virtual distributed file system. This speeds up most data operations. The Fusion v2 file system requires Wave containers to be enabled. See [Fusion file system](../supported_software/fusion/overview) for configuration details.

    <details>
    <summary>Use Fusion v2</summary>

    :::note
    The compute recommendations below are based on internal benchmarking performed by Seqera. Benchmark runs of [nf-core/rnaseq](https://github.com/nf-core/rnaseq) used profile `test_full`, consisting of an input dataset with 16 FASTQ files and a total size of approximately 123.5 GB.
    :::

    Azure virtual machines include fast SSDs and require no additional storage configuration for Fusion. For optimal performance, use VMs with sufficient local storage to support Fusion's streaming data throughput.

    1. Use Seqera Platform version 23.1 or later.
    1. Use an Azure Blob storage container as the work directory.
    1. Enable **Wave containers** and **Fusion v2**.
    1. Specify suitable VM sizes under **VMs type**. A `Standard_E16d_v5` VM or larger is recommended for production use.

    :::tip
    We recommend selecting machine types with a local temp storage disk of at least 200 GB and a random read speed of 1000 MBps or more for large and long-lived production pipelines. To work with files larger than 100 GB, increase temp storage accordingly (400 GB or more).

    The suffix `d` after the core number (e.g., `Standard_E16*d*_v5`) denotes a VM with a local temp disk. Select instances with Standard SSDs — Fusion does not support Azure network-attached storage (Premium SSDv2, Ultra Disk, etc.). Larger local storage increases Fusion's throughput and reduces the chance of overloading the machine. See [Sizes for virtual machines in Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview) for more information.
    :::

    </details>

1. Set the **Config mode** to **Manual**.
1. Enter the **Compute Pool name**. This is the name of the Azure Batch pool you created previously in the Azure Batch account.
    :::note
    The default Azure Batch implementation uses a single pool for head and compute nodes. To use separate pools for head and compute nodes, see [this FAQ entry](../troubleshooting_and_faqs/azure_troubleshooting).
    :::
1. Enter a user-assigned **Managed identity client ID**, if one is attached to your Azure Batch pool. See [Managed identity](/platform-cloud/integrations/cloud-providers/azure/credentials#managed-identity-azure-batch).
1. Apply [**Resource labels**](../resource-labels/overview). This will populate the **Metadata** fields of the Azure Batch pool.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch.
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced#nextflow-config-file) for more information on configuration priority.
    :::
1. Define custom **Environment Variables** for the **Head Job** and/or **Compute Jobs**.
1. Configure any necessary advanced options:
    - Use **Jobs cleanup policy** to control how Nextflow process jobs are deleted on completion. Active jobs consume the quota of the Azure Batch account. By default, jobs are terminated by Nextflow and removed from the quota when all tasks succesfully complete. If set to _Always_, all jobs are deleted by Nextflow after pipeline completion. If set to _Never_, jobs are never deleted. If set to _On success_, successful tasks are removed but failed tasks will be left for debugging purposes.
    - Use **Token duration** to control the duration of the SAS token generated by Nextflow. This must be as long as the longest period of time the pipeline will run.
1. Select **Add** to complete the compute environment setup. The creation of resources will take a few seconds, after which you can launch pipelines.

:::info
See [Launch pipelines](../launch/launchpad) to start executing workflows in your Azure Batch compute environment.
:::

[az-data-residency]: https://azure.microsoft.com/en-gb/explore/global-infrastructure/data-residency/#select-geography
[az-batch-quotas]: https://docs.microsoft.com/en-us/azure/batch/batch-quota-limit#view-batch-quotas
[az-batch-best-practices]: https://learn.microsoft.com/en-us/azure/batch/security-best-practices
[az-vm-sizes]: https://learn.microsoft.com/en-us/azure/virtual-machines/sizes
[az-create-account]: https://azure.microsoft.com/en-us/free/
[az-create-sp]: https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal
[az-learn-rg]: https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groups
[az-create-batch]: https://portal.azure.com/#create/Microsoft.BatchAccount
[az-learn-storage]: https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview
[az-learn-batch]: https://learn.microsoft.com/en-us/training/modules/create-batch-account-using-azure-portal/
[az-learn-jobs]: https://learn.microsoft.com/en-us/azure/batch/jobs-and-tasks
[az-create-rg]: https://portal.azure.com/#create/Microsoft.ResourceGroup
[az-create-storage]: https://portal.azure.com/#create/Microsoft.StorageAccount-ARM
[az-premium-storage]: https://learn.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance
[az-vm-gen]: https://learn.microsoft.com/en-us/azure/virtual-machines/generation-2
[az-disk-type]: https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types
[az-batch-autoscale]: https://learn.microsoft.com/en-us/azure/batch/batch-automatic-scaling
[az-file-shares]: https://docs.seqera.io/nextflow/azure#azure-file-shares
[az-vm-sizes]: https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview

[wave-docs]: https://docs.seqera.io/wave
[fusion-docs]: https://docs.seqera.io/fusion

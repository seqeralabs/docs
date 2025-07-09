---
title: Azure Batch walkthrough
headline: "Azure Batch walkthrough"
description: "A tutorial for using advanced features of Azure Batch with Seqera Platform"
---

This guide details how to set up more complex Azure Batch compute environments with Seqera Platform. It begins with the simplest possible setup before adding complexity, therefore it is designed to be performed stepwise.

The first step indicates how to configure a simple Azure Batch compute environment on Azure and Seqera Platform, however beyond that is not required for most users and is only recommended for those who need to customize their compute environments.

## Prerequisites

- An Azure account with sufficient permissions to create resources.
- [Azure CLI][install-azure-cli]
- [Seqera Platform CLI][install-seqera-cli]

### Set up Azure Batch

In the Azure Portal:

1. Create an Azure Storage account with the default settings.
1. In the Azure Storage account, add a single blob container called `work`. This is the [Nextflow working directory][nextflow-working-directory].
1. Create a new Azure Batch account. Use Batch Managed for now, with the default settings. Use the same region as your Storage account and attach the Storage account to the Batch account when prompted.
1. On the Azure Batch page, select **Quotas**.
1. Select **Request Quota Increase**.
1. For **Quota Type**, select **Batch**, then select **Next**.
1. Select **Enter Details**, then choose the **Location** as the region of your Batch account.
1. Select **EDv5 Series**.
1. Select **Spot/low-priority vCPUS (all Series)**.
1. Select **Active jobs and job schedules per Batch account**.
1. Select **Pools per Batch account**.

Increase each value to a minimum of the following:

- **EDv5 Series**: 192
- **Active jobs and job schedules per Batch account**: 100
- **Pools per Batch account**: 50
- **Spot/low-priority vCPUS (all Series)**: 192

### Set up Seqera Cloud

In Seqera Cloud:

- Create a new account.
- [Create a new organization and workspace][create-org-workspace].
- Add a GitHub credential the workspace to prevent API rate-limiting issues with GitHub.

## Compute environment and pipeline configuration

### Option 1. Azure Batch with Seqera Batch Forge

**Behavior**:

- Seqera Platform will submit a Nextflow job and task to this pool.
- The Nextflow job will execute and submit each task to the same node pool on Azure Batch.
- The node pool will autoscale up and down based on the number of waiting tasks.

**Advantages**:

- Simple to set up.
- Low cost.
- Autoscales for number of waiting tasks.

**Disadvantages**:

- The Nextflow job will submit each task to the same node pool on Azure Batch, which can cause bottlenecks.
- Because the processes require larger resources than the head node, you often have oversized machines running Nextflow or undersized machines running processes.
- Dedicated nodes only.

The first configuration is a simple Azure Batch compute environment created with Batch Forge. This environment uses the same Batch pool for both the Nextflow head job and task nodes.

First, add the Azure Batch account credentials to Seqera Platform:

1. In the Azure portal, go to the Batch account you created and note the Batch account name and region.
1. Go to the **Keys** tab to find the primary access keys for the Batch account and Storage account.
1. In your Seqera Platform workspace, go to the **Credentials** tab and select **Add credentials**.
1. Enter a credential name such as `azure-keys` and select Azure from the **Provider** dropdown.
1. Enter the Batch account name and key, and Storage account name and key.
1. Select **Create** to save the credentials.

Seqera now has the credentials needed to access your Azure Batch and Storage accounts and make the necessary changes.

Next, create a compute environment with Batch Forge:

1. Go to the **Compute Environments** tab and select **Add Compute Environment**.
1. Enter a name such as `1-azure-batch-forge`.
1. Select Azure Batch from the **Provider** dropdown.
1. Sellect your `azure-keys` credentials.
1. Select the **Region** of your Batch account.
1. Select the `az://work` container in your Storage account.
1. For **VMs type**, select `standard_e2ds_v5`.
1. For **VMs count**, select 4.
1. Enable **Autoscale** and **Dispose resources**.
1. All other options can be left default. Select **Create** to save the compute environment.

Add the `nextflow-hello` pipeline to your workspace:

[Add a pipeline][add-pipeline] from your workspace Launchpad with the following settings:

- Select your Azure Batch compute environment from the dropdown.
- For **Pipeline to launch**, enter `https://github.com/nextflow-io/hello`.
- For **Work directory**, enter a subdirectory in the `az://work` container in your Storage account.

Select **Launch** next to the pipeline name in your workspace Launchpad to complete the launch form and launch the workflow.

### Option 2. Use a separate node and head pool on Seqera Platform

**Behavior**:

- Seqera Platform will submit a Nextflow job and task to the first pool.
- The Nextflow job will execute and submit each task to the second pool.
- Both pools will autoscale up and down based on the number of waiting tasks.

**Advantages**:

- The processes are not bottlenecked by the head node.
- You can set the worker nodes to use a different VM size than the head node.
- Cheaper nodes for work than for running Nextflow.

**Disadvantages**:

- More complex to set up.
- Still fairly inflexible.
- You have to wait a long time for nodes to autoscale up and down in response to the work.

This configuration separates head and task nodes into different Batch pools.

To create a separate node pool to run all the processes:

1. Create another compute environment in Seqera Platform, exactly as before:
    - **Name**: `2-azure-batch-low-priority` or similar
    - **Platform**: Azure Batch
    - **Credentials**: `azure-keys`
    - **Region**: As before
    - **Pipeline work directory**: As before
    - **VMs type**: `standard_e2ds_v5`
    - **VMs count**: `4`
1. Note the compute environment ID, which is the first item on the compute environment page.
1. In the Azure Portal, go to the Batch account you created earlier.
1. Go to the **Pools** tab and find the pool called `tower-pool-${id}`, where `${id}` is the ID you made a note of earlier.
1. Select **Scale**.
1. Select **Evaluate**, then **Save**.

You have created a new node pool that uses low-priority VMs, which are cheaper than dedicated VMs. You can now run Nextflow on the first pool, but execute all the processes on the second pool.

1. On the pipeline launch page, duplicate the existing pipeline, but do not save it yet.
1. Under advanced options, add the following configuration block to the `nextflow.config` text input:

    ```nextflow
    process.queue = 'tower-pool-${id}'
    ```

    :::info
    Remember to replace `${id}` with the ID of the compute environment you created earlier!
    :::

1. Save the pipeline as `hello-world-low-priority`.

Select **Launch** next to the `hello-world-low-priority` pipeline in your workspace Launchpad to complete the launch form and launch the workflow.

### Option 3. Configure the head pool with a hot node

**Behavior**:

- A "hot" head node is left running.
- The head node will run Nextflow as soon as the work is created.
- The worker node pool will autoscale up and down based on the number of waiting tasks.

**Advantages**:

- The latency of the pipeline is reduced.

**Disadvantages**:

- The always-on head node incurs additional cost.

This configuration separates the head and task pools as before and leaves a single head node up and running to make the response time faster.

To create the compute environment with a persistent head node:

1. Get the ID of the first node pool (`1-azure-batch-forge`).
1. In the Azure Portal, go to the Batch account you created earlier.
1. Go to the **Pools** tab and find the pool called `tower-pool-${id}`, where `${id}` is the ID you made a note of earlier.
1. Select **Scale**.
1. In the line `targetPoolSize = max(0, min($targetVMs, 4));`, change the `0` to `1`.
1. Select **Evaluate**, then **Save**.

The node pool will increase to a minimum of 1 node. Now, when you make adjustments to the pipeline, the head node will not be scaled down.

Select **Launch** next to the `hello-world-low-priority` pipeline in your workspace Launchpad to complete the launch form and launch the workflow. With this run, it should respond much faster. The _latency_ of the pipeline has improved, although the overall run time will be similar. This effect is more substantial on larger production pipelines.

:::tip
If you do not wish to continue paying for the head node, scale the node pool back down by replacing the original autoscale formula (`targetPoolSize = max(0, min($targetVMs, 4))`).
You can also delete the compute environment in Platform, which will delete the head node.
:::

### Option 4. Use the Nextflow autopool feature

**Behavior**:

- Seqera will submit a Nextflow job and task to the first pool, which uses dedicated VMs.
- The Nextflow job will create pools in the Azure Batch account based on the pipeline's requirements.
- The pools are called `nf-pool-${id}`, where `${id}` is a unique identifier for the pool.
- The pools are created with the VM size specified in the Nextflow config.
- The pools are created with the autoscale settings specified in the Nextflow config.

:::info
Nextflow will create a range of pools based on resource sizes and try to reuse them for similar tasks. This means that if you run a process with different CPU, memory, or machineType, it will create a new pool for that process.
:::

**Advantages**:

- Nextflow handles the creation and management of pools.
- You can create flexible pools with the correct VM size and autoscale settings.
- The pools are highly configurable via Nextflow configuration.

**Disadvantages**:

- You may be overly specific and end up with a lot of pools, which can exhaust your quota for the maximum number of pools.
- This configuration does not use low-priority nodes.

With the autopool feature, Nextflow automatically creates and manages Azure Batch pools based on your pipeline's requirements.

To configure your pipeline to use Nextflow autopool:

1. Duplicate the `hello-world-low-priority` pipeline to a new pipeline called `hello-world-autopool`.
1. Update your Nextflow config to use autopool mode:

```groovy
process.queue = "auto"
process.machineType = "Standard_E*d_v5"
azure {
    batch {
        autoPoolMode = true
        allowPoolCreation = true
        pools {
            auto {
                autoscale = true
                vmCount = 1
                maxVmCount = 4
            }
        }
    }
}
```

3. Save the pipeline.

Select **Launch** next to the `hello-world-autopool` pipeline in your workspace Launchpad to complete the launch form and launch the workflow.

### Option 5. Use Nextflow autopool feature with low-priority nodes

**Behavior**:

- Seqera submits a Nextflow job and task to the first pool, which uses dedicated VMs.
- The Nextflow job creates pools in the Azure Batch account based on the pipeline's requirements.
- The pools are named `nf-pool-${id}`, where `${id}` is a unique identifier for the pool.
- The pools are created with the VM size specified in the Nextflow config.
- The pools are created with the autoscale settings specified in the Nextflow config.
- These pools use low-priority nodes. It achieves this by modifying the autoscale formula.

**Advantages**:

- Nextflow handles the creation and management of pools.
- You can create flexible pools with the correct VM size and autoscale settings.
- This configuration uses low-priority nodes.

**Disadvantages**:

- Spot and low-priority nodes can be preempted, which can cause the pipeline to fail.

To configure your pipeline to use Nextflow autopool with low-priority nodes:

1. Duplicate the `hello-world-autopool` pipeline to a new pipeline called `hello-world-autopool-low-priority`.
1. Update your Nextflow config to use low-priority nodes:

```groovy
process.queue = "auto"
process.machineType = "Standard_E*d_v5"
azure {
    batch {
        autoPoolMode = true
        allowPoolCreation = true
        pools {
            auto {
                autoscale = true
                vmCount = 1
                maxVmCount = 4
            }
        }
    }
}
```

3. Save the pipeline.

Select **Launch** next to the `hello-world-autopool-low-priority` pipeline in your workspace Launchpad to complete the launch form and launch the workflow.

### Option 6. Use Entra authentication

**Behavior**:

- Seqera authenticates to Azure Batch and Azure Storage using a service principal.
- It submits a job and task to the Azure Batch service using the service principal.
- The task runs Nextflow, which authenticates to Azure Batch and Azure Storage using the managed identity.
- All processes run on the head node as in the first example.

**Advantages**:

- No keys or short access tokens are exchanged, increasing security.
- A service prinicipal can have very granular permissions, so you can grant it only the permissions it needs.
- Managed identities can be scoped to a specific resource, so the Nextflow head job has very restricted permissions.
- Different managed IDs can have different permissions, so different compute environments can have different scoped permissions.

**Disadvantages**:

- The setup is quite complicated with room for error.
- Errors can be harder to troubleshoot.

Seqera can utilize an Azure Entra service principal to authenticate and access Azure Batch for job execution and Azure Storage for data management, and Nextflow can authenticate to Azure services using a managed identity. This method offers enhanced security compared to access keys, but must run on Azure infrastructure.

See [Microsoft Entra](https://www.nextflow.io/docs/latest/azure.html#microsoft-entra) in the Nextflow documentation for more information.

#### Create a service principal for Seqera to use for authentication

1. [Create an Azure service principal](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal).
1. [Assign roles to the service principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal?tabs=current).
1. [Get the Service Principal ID, Tenant ID, and Client Secret](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret).
1. [Add to Seqera credentials](https://docs.seqera.io/platform/24.2/compute-envs/azure-batch#entra-service-principal).

In Seqera:

1. Add new credentials with the name `entra-keys` and select the Azure **Provider**.
1. Add the Service Principal ID, Tenant ID and Client Secret.
1. Select **Create** to save the credentials.

#### Create a managed identity for Nextflow to use for authentication

Back in the Azure Portal:

1. [Create a managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)
1. [Assign the relevant roles to the managed identity](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal?tabs=current). See [Required role assignments](https://www.nextflow.io/docs/latest/azure.html#required-role-assignments) for Nextflow requirements.
1. Note the managed identity client ID for later.
1. In the Azure Portal, go to the Batch account you created earlier.
1. Go to the **Pools** tab and find the pool called `tower-pool-${id}`, where `${id}` is the ID of the head node pool created earlier.
1. Select **Identity**.
1. Select **Add User Assigned Identity**.
1. Select the managed identity created earlier.
1. Select **Add**.

Processes running on this pool can now use the managed identity to authenticate to Azure Batch and Storage.

In Seqera:

1. Add a new compute environment with the name `entra-mi` and select the Azure Batch **Provider** type.
1. For **Location**, select the same region as your Batch account.
1. For **Config mode**, select Manual.
1. For **Compute pool**, select the pool you added the managed identity to earlier (`tower-pool-${id}`).
1. For **Managed Identity Client ID**, enter the client ID of the managed identity created earlier.

Duplicate the `hello-world-autopool-low-priority` pipeline and save it as `hello-world-entra-mi`.

Select **Launch** next to the `hello-world-entra-mi` pipeline in your workspace Launchpad to complete the launch form and launch the workflow.

The pipeline will run as before, but using the managed identity to authenticate to Azure Batch and Storage. No keys or storage required.

:::note
You can also use User Subscription mode instead of Batch Managed here, but this is beyond the scope of this tutorial.
:::

### Option 7. Use a node pool attached to a VNet

**Behavior**:

- Each node is attached to the VNet and uses the security and networking rules of that virtual network subnetwork.
- All other behaviour is as normal.

**Advantages**:

- Security can be increased by restricting the virtual network subnet.
- Exchange of data can be faster and cheaper than other services.

**Disadvantages**:

- It requires fairly complicated setup.
- If security is too restrictive, it can fail silently and be unable to report the error state.

It is common to attach Azure Batch pools to a virtual network. This is useful to connect to other resources in the same VNet or place things behind enhanced security. Seqera Platform does not support this feature directly, so you must manually create an Azure Batch pool.

See [Create a Nextflow-compatible Azure Batch pool](../../compute-envs/azure-batch#create-a-nextflow-compatible-azure-batch-pool) to create an Azure Batch pool manually that is compatible with Seqera and Nextflow. Use the following settings:

- Name & ID: `3-azure-batch-vnet`
- Add the managed identity created earlier as a user-assigned managed identity.
- VMs type: `standard_e2ds_v5`
- Use the autoscale formula described in the documentation, with a minimum size of 0 and a maximum size of 4.
- For Virtual network, create a new virtual network with the default subnet. You can add this to a new resource group here.

In practice, you are more likely to connect an Azure Batch Node pool to an existing virtual network that is connected to other resources, such as Seqera Platform or the Azure Storage Acccount. In this instance, connecting it to a VNet with public internet access will route the network traffic via the virtual network while still allowing you to perform every action.

Back in Seqera Platform, add a new Azure Batch compute environment:

1. Add a new compute environment with the name `3-azure-batch-vnet` and select the Azure Batch **Provider** type.
1. For **Location**, select the same region as your Batch account.
1. For **Credentials**, select the service principal credentials.
1. For **Config mode**, select Manual.
1. For **Compute pool**, select the Compute pool name `3-azure-batch-vnet`.
1. For **Managed Identity Client ID**, enter the client ID of the managed identity created earlier.

Duplicate the **original** `hellow-world` pipeline and save it as `hello-world-vnet`.

Select **Launch** next to the `hello-world-vnet` pipeline in your workspace Launchpad to complete the launch form and launch the workflow.

The pipeline runs as before, but it will run on the node pool attached to the VNet. It will resemble a normal Azure Batch pipeline run.

Using this technique allows you to run pipelines on Azure Batch with more restrictive networking and security requirements.

### Option 8. Use a node pool attached to a VNet with worker nodes attached to the same VNet

**Behavior**:

- We use a separate head node pool to run Nextflow, along with automatically created Nextflow autoscale pools to run processes.
- Each worker node is attached to the VNet and uses the security and networking rules of that virtual network subnetwork.

**Advantages**:

- Security can be increased by restricting the virtual network subnet.
- Exchange of data can be faster and cheaper than other services.
- Additionally, you get the advantages of using worker nodes with autopools.

**Disadvantages**:

- The set up is very complicated now and errors are likely to occur.
- Errors can be hard to troubleshoot.

Finally, you can combine some of the previous approaches. Nextflow can create and modify Azure Batch pools based on the pipeline requirements. You can also attach Azure Batch pools to a VNet. Next, attach the worker nodes to the same VNet.

To achieve this, the following requirements must be met:

- The pipeline must be launched on the node pool attached to the VNet.
- The managed identity must be used to authenticate to Azure Batch and Storage.
- The managed identity must have permissions to create resources attached to the VNet.
- Nextflow creates node pools attached to the VNet.

Do the following:

1. Duplicate the `hello-world-entra-mi` pipeline, but modfiy the compute environment to `3-azure-batch-vnet` and change the pipeline name to `hello-world-vnet`.
1. Check the virtual network string under the pool details in the Azure Portal, under the **Network Configuration** section. The value should be a Subnet ID, such as `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/virtualNetworks/${vnetName}/subnets/${subnetName}`. Save this value.
1. Change the Nextflow configuration under the **Advanced** tab to include a virtual network with the autopools:

```nextflow
process.queue = "auto"
process.machineType = "Standard_E*d_v5"
azure {
    batch {
        autoPoolMode = true
        allowPoolCreation = true
        pools {
            auto {
                autoscale = true
                vmCount = 1
                maxVmCount = 4
                virtualNetwork = '/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/virtualNetworks/${vnetName}/subnets/${subnetName}'
            }
        }
    }
}
```

Select **Launch** next to the `hello-world-vnet` pipeline in your workspace Launchpad to complete the launch form and launch the workflow.

The pipeline runs as before, but using the managed identity to authenticate to Azure Batch and Storage. It also creates worker pools attached to the VNet.

### Clear up resources

Once you have completed setup and workflow execution, you can delete the pipelines and compute environments from Seqera.

In Azure, you can delete the Batch account, which will delete all pools, jobs, and tasks. You can then delete the Storage account.

If you wish to keep the Azure resources, you can remove each pool within a Batch account and mark any active jobs as terminated to free up any quotas on your Azure Batch account.

[install-azure-cli]: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
[install-seqera-cli]: ../../cli/installation
[nextflow-working-directory]: https://www.nextflow.io/docs/latest/cache-and-resume.html#work-directory
[create-org-workspace]: ../../getting-started/workspace-setup
[add-pipeline]: ../../getting-started/quickstart-demo/add-pipelines#add-from-the-launchpad

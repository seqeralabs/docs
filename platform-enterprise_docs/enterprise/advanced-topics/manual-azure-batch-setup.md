---
title: Azure Batch walkthrough
headline: "Azure Batch walkthrough"
description: "A tutorial for using advanced features of Azure Batch with Seqera Platform"
---

This guide details how to set up more complex Azure Batch compute environments with Seqera Platform. It begins with the simplest possible setup before adding complexity, therefore it is designed to be performed stepwise.

Seqera Platform now provisions most advanced Azure Batch topologies natively through Batch Forge, including separate head and worker pools, dedicated head job resources, autoscaling, Entra authentication, and private networking. This walkthrough covers the native Batch Forge path, then the cases that still require manual Azure configuration, such as low-priority (spot) nodes and pre-existing pools.

For a field-by-field reference of every compute environment option, see [Azure Batch][azure-batch-reference].

:::info Prerequisites <span id="prerequisites" />
- An Azure account with sufficient permissions to create resources.
- [Azure CLI][install-azure-cli]
- [Seqera Platform CLI][install-seqera-cli]
:::

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
- Add a GitHub credential to the workspace to prevent API rate-limiting issues with GitHub.

## Part 1. Azure Batch with Batch Forge

Batch Forge creates and manages the Azure Batch pools for you. By default it creates **separate pools** for the Nextflow head job and compute tasks (named `tower-pool-{envId}-head` and `tower-pool-{envId}-worker`), so the head node does not compete with tasks for resources and each pool can be sized independently. Both pools autoscale based on the number of waiting tasks.

First, add the Azure Batch account credentials to Seqera Platform:

1. In the Azure portal, go to the Batch account you created and note the Batch account name and region.
1. Go to the **Keys** tab to find the primary access keys for the Batch account and Storage account.
1. In your Seqera Platform workspace, go to the **Credentials** tab and select **Add credentials**.
1. Enter a credential name such as `azure-keys` and select Azure from the **Provider** drop-down.
1. Enter the Batch account name and key, and Storage account name and key.
1. Select **Create** to save the credentials.

Next, create a compute environment with Batch Forge:

1. Go to the **Compute Environments** tab and select **Add Compute Environment**.
1. Enter a name such as `azure-batch-forge`.
1. Select Azure Batch from the **Provider** drop-down.
1. Select your `azure-keys` credentials.
1. Select the **Region** of your Batch account.
1. Select the `az://work` container in your Storage account.
1. Set **Config mode** to **Batch Forge**.
1. For **VMs type**, select `standard_e2ds_v5`.
1. For **VMs count**, select 4.
1. Enable **Autoscale** and **Dispose resources**.
1. (Optional) Under **Head job resources**, set a separate **Head VM type**, **Head job CPUs**, and **Head job memory** to size the head node independently of the compute tasks.
1. All other options can be left default. Select **Create** to save the compute environment.

:::tip
To reduce pipeline latency, disable **Autoscale** on the head pool so a head node stays running (fixed scale). This incurs additional cost for the always-on node but improves response time, which is more noticeable on larger production pipelines.
:::

Add the `nextflow-hello` pipeline to your workspace:

[Add a pipeline][add-pipeline] from your workspace Launchpad with the following settings:

- Select your Azure Batch compute environment from the drop-down.
- For **Pipeline to launch**, enter `https://github.com/nextflow-io/hello`.
- For **Work directory**, enter a subdirectory in the `az://work` container in your Storage account.

Select **Launch** next to the pipeline name in your workspace Launchpad to complete the launch form and launch the workflow.

## Part 2. Use low-priority (spot) worker nodes

**Advantages**:

- Low-priority (spot) VMs are cheaper than dedicated VMs.
- You keep the head node on dedicated VMs while running the cheaper work on the worker pool.

**Disadvantages**:

- Spot and low-priority nodes can be preempted, which can cause the pipeline to fail.

Batch Forge provisions dedicated nodes only. To use low-priority (spot) nodes for the compute tasks, edit the autoscale formula of the Forge-created worker pool to target low-priority nodes:

1. In the Azure Portal, go to the Batch account you created earlier.
1. Go to the **Pools** tab and find the worker pool called `tower-pool-{envId}-worker`, where `{envId}` is the compute environment ID (shown at the top of the compute environment page in Seqera).
1. Select **Scale**.
1. In the autoscale formula, find the line that starts with `$TargetDedicatedNodes` and change it to `$TargetLowPriorityNodes`.
1. Select **Evaluate**, then **Save**.

The worker pool now provisions low-priority VMs, while the head pool continues to use dedicated VMs. Launch the `nextflow-hello` pipeline again to run the compute tasks on low-priority nodes.

## Part 3. Use Entra authentication

**Advantages**:

- No keys or short access tokens are exchanged, increasing security.
- A service principal can have very granular permissions, so you can grant it only the permissions it needs.
- Managed identities can be scoped to a specific resource, so the Nextflow head job has very restricted permissions.
- Different managed identities can have different permissions, so different compute environments can have different scoped permissions.

Instead of access keys, Seqera can authenticate to Azure Batch and Storage using an Entra service principal, and Nextflow can authenticate using a managed identity. Batch Forge configures the pool identity for you. You create the service principal and managed identity in Azure, then select them in the compute environment form.

See [Microsoft Entra](https://docs.seqera.io/nextflow/azure#microsoft-entra) in the Nextflow documentation for more information.

#### Create a service principal for Seqera to use for authentication

1. [Create an Azure service principal](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal).
1. [Assign roles to the service principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal?tabs=current).
1. [Get the Service Principal ID, Tenant ID, and Client Secret](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret).
1. [Add to Seqera credentials](../../compute-envs/azure-batch#entra-service-principal-and-managed-identity).

In Seqera:

1. Add new credentials with the name `entra-keys` and select the Azure **Provider**.
1. Add the Service Principal ID, Tenant ID and Client Secret.
1. Select **Create** to save the credentials.

#### Create a managed identity for Nextflow to use for authentication

In the Azure Portal:

1. [Create a managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)
1. [Assign the relevant roles to the managed identity](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal?tabs=current). See [Required role assignments](https://docs.seqera.io/nextflow/azure#required-role-assignments) for Nextflow requirements.
1. Note the managed identity client ID for later.

In Seqera:

1. Add a new Batch Forge compute environment named `entra-mi` and select the Azure Batch **Provider** type.
1. For **Credentials**, select the `entra-keys` service principal credentials.
1. For **Location**, select the same region as your Batch account.
1. Under the managed identity fields, enter the client ID of the managed identity created earlier.
1. Configure the remaining fields as in [Part 1](#part-1-azure-batch-with-batch-forge).

Duplicate the `nextflow-hello` pipeline, save it as `hello-world-entra-mi`, and select the new compute environment.

Select **Launch** next to the `hello-world-entra-mi` pipeline in your workspace Launchpad to complete the launch form and launch the workflow. The pipeline runs as before, but uses the managed identity to authenticate to Azure Batch and Storage. No keys are exchanged.

:::note
You can also use User Subscription mode instead of Batch Managed here, but this is beyond the scope of this tutorial.
:::

## Part 4. Attach the pool to a virtual network (VNet)

**Advantages**:

- Security can be increased by restricting the virtual network subnet.
- Exchange of data can be faster and cheaper than routing over the public internet.

To connect the Batch pool nodes to a private Azure VNet, enter a **Subnet ID** when creating the Batch Forge compute environment. Batch Forge attaches the subnet to both the head and worker pools, so worker nodes inherit the same networking automatically.

:::note
VNet/subnet configuration requires Entra credentials. The **Subnet ID** field is only available when Entra credentials are selected. See [Entra service principal and managed identity][azure-batch-entra] in the Azure Batch reference.
:::

1. Add a new Batch Forge compute environment named `azure-batch-vnet` and select the Azure Batch **Provider** type.
1. For **Credentials**, select the `entra-keys` service principal credentials.
1. For **Location**, select the same region as your Batch account.
1. For **Subnet ID**, enter the full Azure ARM subnet resource ID:

    ```
    /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Network/virtualNetworks/{vnetName}/subnets/{subnetName}
    ```

1. Configure the remaining fields as in [Part 1](#part-1-azure-batch-with-batch-forge).

Duplicate the `nextflow-hello` pipeline, save it as `hello-world-vnet`, and select the new compute environment. Select **Launch** to run the workflow on the pool attached to the VNet.

## Advanced. Use a pre-existing Azure Batch pool

Some scenarios still require a manually created pool, such as custom VM images or Azure Batch features that Batch Forge does not expose. In these cases, create the pool yourself and select it in a **Manual** compute environment.

See [Create a Nextflow-compatible Azure Batch pool][azure-batch-manual-pool] in the Azure Batch reference for the full pool configuration (identity, OS image, autoscale formula, start task, and networking), then create a Manual compute environment that points at the pool name.

:::note
The Nextflow autopool feature (`azure.batch.autoPoolMode` and `azure.batch.allowPoolCreation`) is deprecated and not used by Seqera Platform. Use the Batch Forge separate-pool model described above instead.
:::

### Clear up resources

Once you have completed setup and workflow execution, you can delete the pipelines and compute environments from Seqera.

In Azure, you can delete the Batch account, which will delete all pools, jobs, and tasks. You can then delete the Storage account.

If you wish to keep the Azure resources, you can remove each pool within a Batch account and mark any active jobs as terminated to free up any quotas on your Azure Batch account.

[install-azure-cli]: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
[install-seqera-cli]: /platform-cli/installation
[nextflow-working-directory]: https://docs.seqera.io/nextflow/cache-and-resume#work-directory
[create-org-workspace]: ../../getting-started/workspace-setup
[add-pipeline]: ../../getting-started/quickstart-demo/add-pipelines#add-from-the-launchpad
[azure-batch-reference]: ../../compute-envs/azure-batch
[azure-batch-entra]: ../../compute-envs/azure-batch#entra-service-principal-and-managed-identity
[azure-batch-manual-pool]: ../../compute-envs/azure-batch#create-a-nextflow-compatible-azure-batch-pool

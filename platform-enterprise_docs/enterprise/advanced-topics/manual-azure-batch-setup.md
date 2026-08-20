---
title: Set up advanced Azure Batch compute environments
headline: "Set up advanced Azure Batch compute environments"
description: "Build Azure Batch compute environments with separate head and worker pools, Entra authentication, and private networking."
---

Batch Forge provisions most Azure Batch topologies for you: separate head and worker pools, dedicated head job resources, autoscaling, Microsoft Entra authentication, and private networking. Each part below adds one capability to the setup before it. Work through them in order. The final part covers the cases that still need a pool you create yourself.

For every compute environment field, see the [Azure Batch][azure-batch-reference] reference.

:::info[**Prerequisites**]

You need the following:

- An Azure account with permissions to create resources.
- The [Azure CLI][install-azure-cli].
- The [Seqera Platform CLI][install-seqera-cli].

:::

## Set up Azure Batch

In the Azure Portal:

1. Create an Azure Storage account with the default settings.
1. In the Storage account, add a single blob container called `work`. This is the [Nextflow working directory][nextflow-working-directory].
1. Create an Azure Batch account with the default settings and the Batch Managed pool allocation mode. Use the same region as your Storage account, and attach the Storage account to the Batch account when prompted.
1. On the Azure Batch page, select **Quotas**.
1. Select **Request Quota Increase**.
1. For **Quota Type**, select **Batch**, then select **Next**.
1. Select **Enter Details**, then set **Location** to the region of your Batch account.
1. Select **EDv5 Series**.
1. Select **Active jobs and job schedules per Batch account**.
1. Select **Pools per Batch account**.

Increase each value to at least the following:

- **EDv5 Series**: 192
- **Active jobs and job schedules per Batch account**: 100
- **Pools per Batch account**: 50

## Set up Seqera Platform

In Seqera Platform:

- Create a new account.
- [Create a new organization and workspace][create-org-workspace].
- Add a GitHub credential to the workspace to prevent API rate-limiting issues with GitHub.

## Part 1. Create a Batch Forge compute environment

Batch Forge creates and manages the Azure Batch pools for you. By default it creates two pools, one for the Nextflow head job and one for compute tasks, named `tower-pool-{envId}-head` and `tower-pool-{envId}-worker`. The head node does not compete with tasks for resources, and you can size each pool independently. Both pools autoscale based on the number of waiting tasks.

Add the Azure Batch account credentials to Seqera Platform:

1. In the Azure Portal, open the Batch account you created and note the Batch account name and region.
1. On the **Keys** tab, find the primary access keys for the Batch account and the Storage account.
1. In your Seqera Platform workspace, select the **Credentials** tab, then select **Add credentials**.
1. Enter a credential name such as `azure-keys`, then select **Azure** for **Provider**.
1. Enter the Batch account name and key, and the Storage account name and key.
1. Select **Create**.

Create the compute environment:

1. Select **Compute Environments**, then select **Add compute environment**.
1. Enter a name such as `azure-batch-forge`.
1. For **Provider**, select **Azure Batch**.
1. Select your `azure-keys` credentials.
1. Select the **Region** of your Batch account.
1. Select the `az://work` container in your Storage account.
1. Set **Config mode** to **Batch Forge**.
1. For **VMs type**, select `Standard_E2ds_v5`.
1. For **VMs count**, select 4.
1. Enable **Autoscale** and **Dispose resources**.
1. (Optional) Under **Head job resources**, set **Head VM type**, **Head job CPUs**, and **Head job memory** to size the head node independently of the compute tasks.
1. Leave the remaining options at their defaults, then select **Create**.

:::tip
To reduce pipeline latency, expand **Head job resources**, disable **Autoscale**, and set **VMs count** to `1`. One head node then stays running while the worker pool autoscales independently. An always-on head node costs more but responds faster. The difference is most noticeable on large production pipelines.
:::

[Add a pipeline][add-pipeline] named `nextflow-hello` from your workspace Launchpad with the following settings:

- Select your Azure Batch compute environment.
- For **Pipeline to launch**, enter `https://github.com/nextflow-io/hello`.
- For **Work directory**, enter a subdirectory of the `az://work` container in your Storage account.

On the Launchpad, select **Launch** next to the pipeline name, complete the launch form, and start the run.

## Part 2. Authenticate with Microsoft Entra

Instead of access keys, Seqera Platform can authenticate to Azure Batch and Storage with a Microsoft Entra service principal, and Nextflow can authenticate with a managed identity. You create the service principal and managed identity in Azure, then select them in the compute environment form. Batch Forge configures the pool identity for you.

Entra authentication has the following advantages over access keys:

- No keys or short-lived access tokens are exchanged.
- A service principal holds only the permissions you grant it.
- A managed identity scoped to a single resource keeps the Nextflow head job's permissions narrow.
- Different compute environments can use different managed identities, each with its own permissions.

For more detail, see [Microsoft Entra](https://docs.seqera.io/nextflow/azure#microsoft-entra) in the Nextflow documentation.

### Create a service principal for Seqera Platform

In the Azure Portal:

1. [Create an Azure service principal](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal).
1. [Assign roles to the service principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal?tabs=current).
1. [Create a client secret](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret), then note the client ID, tenant ID, and client secret value.

The service principal needs the following role assignments:

- **Azure Batch Data Contributor** on the Batch account.
- **Storage Blob Data Contributor** on the Storage account.
- **Managed Identity Operator** on each managed identity.
- **Network Contributor** on the virtual network (VNet), when you use one.

For details, see [Entra service principal and managed identity][azure-batch-entra] in the Azure Batch reference.

In Seqera Platform:

1. Select the **Credentials** tab, then select **Add credentials**.
1. Enter the name `entra-keys` and select **Azure** for **Provider**.
1. Select the **Entra** tab, then enter the **Client ID**, **Tenant ID**, and **Client secret**.
1. Select **Create**.

### Create a managed identity for Nextflow

In the Azure Portal:

1. [Create a managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp).
1. [Assign the relevant roles to the managed identity](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal?tabs=current). For the Nextflow requirements, see [Required role assignments](https://docs.seqera.io/nextflow/azure#required-role-assignments).
1. Note the managed identity client ID and resource ID.

In Seqera Platform:

1. Add a new Batch Forge compute environment named `entra-mi`, and select **Azure Batch** for **Provider**.
1. For **Credentials**, select the `entra-keys` service principal credentials.
1. Select the **Region** of your Batch account.
1. In the managed identity fields, enter the client ID and resource ID for both the head and worker pools. You can use the same managed identity for both pools.
1. Configure the remaining fields as in [Part 1](#part-1-create-a-batch-forge-compute-environment).

Duplicate the `nextflow-hello` pipeline, save it as `hello-world-entra-mi`, and select the new compute environment.

On the Launchpad, select **Launch** next to `hello-world-entra-mi` and start the run. The pipeline runs as before, but authenticates to Azure Batch and Storage with the managed identity. No keys are exchanged.

## Part 3. Attach the pool to a virtual network

To connect the Batch pool nodes to a private Azure VNet, enter a **Subnet ID** when you create the Batch Forge compute environment. Batch Forge attaches the subnet to both the head and worker pools, and the worker nodes inherit the same networking.

A private VNet restricts network access to the subnet you specify, and data transfer inside the VNet can be faster and cheaper than routing over the public internet.

:::note
The **Subnet ID** field is only available when you select Entra credentials. See [Entra service principal and managed identity][azure-batch-entra] in the Azure Batch reference.
:::

Before you create the compute environment, assign the **Network Contributor** role to the service principal on the VNet. Alternatively, use a custom role that grants `Microsoft.Network/virtualNetworks/subnets/join/action`.

1. Add a new Batch Forge compute environment named `azure-batch-vnet`, and select **Azure Batch** for **Provider**.
1. For **Credentials**, select the `entra-keys` service principal credentials.
1. Select the **Region** of your Batch account.
1. For **Subnet ID**, enter the full Azure Resource Manager (ARM) subnet resource ID:

    ```
    /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Network/virtualNetworks/{vnetName}/subnets/{subnetName}
    ```

1. Configure the remaining fields as in [Part 1](#part-1-create-a-batch-forge-compute-environment).

Duplicate the `nextflow-hello` pipeline, save it as `hello-world-vnet`, and select the new compute environment. Select **Launch** to run the pipeline on the pool attached to the VNet.

## Part 4. Use a pre-existing Azure Batch pool

Some setups still need a pool you create yourself: low-priority (spot) worker nodes, custom VM images, or Azure Batch features that Batch Forge does not expose. Batch Forge provisions dedicated (on-demand) nodes only. In these cases, create the pool in Azure and select it in a **Manual** compute environment.

Manual pools can use the Batch Managed or User Subscription pool allocation mode. Batch Forge supports Batch Managed only.

Manual mode does not attach a subnet to a pre-existing pool. Configure the VNet and subnet on each pool as you create it.

For the full pool configuration (identity, OS image, autoscale formula, start task, and networking), see [Create a Nextflow-compatible Azure Batch pool][azure-batch-manual-pool] in the Azure Batch reference. Then create a Manual compute environment that points at the pool name.

To run compute tasks on low-priority nodes, create one dedicated pool and one low-priority pool, then route compute tasks to the low-priority pool with the `process.queue` directive. See [Use separate Batch pools for head and compute nodes][azure-separate-pools].

:::note
The Nextflow autopool feature (`azure.batch.autoPoolMode` and `azure.batch.allowPoolCreation`) is deprecated and unused by Seqera Platform. Use the Batch Forge head and worker pools instead.
:::

## Clear up resources

After the setup and the runs are complete, delete the pipelines and compute environments from Seqera Platform.

In Azure, deleting the Batch account deletes all its pools, jobs, and tasks. You can then delete the Storage account.

To keep the Azure resources, remove each pool in the Batch account and mark any active jobs as terminated to free up quota on the Batch account.

[install-azure-cli]: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
[install-seqera-cli]: /platform-cli/installation
[nextflow-working-directory]: https://docs.seqera.io/nextflow/cache-and-resume#work-directory
[create-org-workspace]: ../../getting-started/workspace-setup
[add-pipeline]: ../../getting-started/quickstart-demo/add-pipelines#add-from-the-launchpad
[azure-batch-reference]: ../../compute-envs/azure-batch
[azure-batch-entra]: ../../compute-envs/azure-batch#entra-service-principal-and-managed-identity
[azure-batch-manual-pool]: ../../compute-envs/azure-batch#create-a-nextflow-compatible-azure-batch-pool
[azure-separate-pools]: ../../troubleshooting_and_faqs/azure_troubleshooting#use-separate-batch-pools-for-head-and-compute-nodes

---
title: "Azure Cloud"
description: "Instructions to set up an Azure Cloud compute environment in Seqera Platform"
date created: "2025-09-29"
last updated: "2025-09-29"
tags: [cloud, vm, azure, compute-environment]
---

:::note
This compute environment type is currently in public preview. Please consult this guide for the latest information on recommended configuration and limitations. This guide assumes you already have an Azure account with a valid Azure subscription.
:::

Many of the current implementations of compute environments for cloud providers rely on the use of batch services such as AWS Batch, Azure Batch, and Google Batch for the execution and management of submitted jobs, including pipelines and Studio session environments. Batch services are suitable for large-scale workloads, but they add management complexity. In practical terms, the currently used batch services result in some limitations:

- **Complex setup**: Azure Batch compute environments require users to independently configure their own Batch accounts.
- **Long-lived credentials**: Azure Batch uses access keys to authenticate with Batch and Storage accounts. These credentials are long-lived, and Azure has hard limits on the number of access keys that can be created per resource type.
- **Quotas**: Azure Batch accounts have limits for jobs, pools, and compute resources. If these limits are exceeded, no additional pipelines can run until the existing resources are removed.

The Azure Cloud compute environment addresses these pain points with:

- **Simplified configuration**: Fewer configurable options, with opinionated defaults, provide the best Nextflow pipeline and Studio session execution environment, with both [Wave](https://docs.seqera.io/wave) and [Fusion](https://docs.seqera.io/fusion) enabled.
- **More secure credentials**: Authenticate exclusively via [Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra). This provides enhanced security by default, with automatic configuration for the user.

This type of compute environment is best suited to run Studios and small to medium-sized pipelines. It offers more predictable compute pricing, given the fixed instance types. It spins up a standalone virtual machine and executes a Nextflow pipeline or Studio session with a local executor on the virtual machine. At the end of the execution, the instance is terminated.

## Limitations

- The Nextflow pipeline will run entirely on a single virtual machine. If the instance does not have sufficient resources, the pipeline execution will fail. For this reason, the number of tasks Nextflow can execute in parallel is limited by the number of cores of the instance type selected. If you need more computing resources, you must create a new compute environment with a larger instance type. This makes the compute environment less suited for larger, more complex pipelines.
- There is a considerable delay before streaming logs can be queried. This means that if your pipeline completes in under a minute, you might not see streaming logs during the execution.

## Created resources

Seqera will create the following resources in Azure when creating the compute environment:

- One Azure resource group: The container for all other created resources.
- One Azure managed identity: The Entra identity connected to the Virtual Machine, enabling Nextflow to authenticate to Azure services.
- One Azure role: The role attached to the managed identity, which grants the necessary permissions.
- One log analytics workspace: Used to collect and query execution logs.
- One data collection rule: To route execution logs to the appropriate Log Analytics table.
- One data collection endpoint: The endpoint that receives logs, tied to the data collection rule.
- One virtual network: The network in which virtual machines are launched.

When virtual machines are launched, other resources are provisioned for each machine and tied to the machine lifecycle:

- One network interface
- One OS disk

While the workflow is running, logs are streamed to the `Nextflow_log_CL` table in the Log Analytics workspace for the compute environment. You can query logs for your specific workflow ID with this expression:

```
Nextflow_log_CL | where workflowId == "<WORKFLOW_ID>"
```

The table retains logs for 7 days. Nextflow uploads log files to Azure Storage for long-term storage.

## Before you start

Set up the [Azure integration](/platform-cloud/integrations/cloud-providers/azure/overview) before creating an Azure Cloud compute environment in Seqera:

- [Roles & service principals](/platform-cloud/integrations/cloud-providers/azure/roles-and-service-principals) — custom role JSON, app registration, and role assignment.
- [Azure credentials](/platform-cloud/integrations/cloud-providers/azure/credentials) — Entra service principal credential setup.

{/* Anchor stubs preserved for backwards compatibility with deep links from older content. */}
<a id="requirements"></a>
<a id="platform-credentials"></a>
<a id="required-permissions"></a>
<a id="add-azure-cloud-credentials"></a>
<a id="create-a-custom-role-in-microsoft-entra"></a>
<a id="register-an-application-in-microsoft-entra-id"></a>
<a id="assign-the-custom-role-to-the-service-principal"></a>
<a id="configure-seqera-platform-credentials"></a>

### Create a compute environment

Create a compute environment in Seqera using the credentials:

1. In your Seqera workspace, navigate to the **Compute Environments** tab and select **Add Compute Environment**.
1. Select **Azure Cloud** as the target platform.
1. From the **Credentials** drop-down, select the credentials you created previously.
1. Enter a name for the compute environment.
1. Enter or select a **Location** for the compute environment.
1. Select the **Work directory** as the Azure blob container you plan to use as the Nextflow working directory. The container must be in the same **Location** as selected in the previous step.
1. (Optional) Under **Advanced options**, specify an **Instance Type**. If left blank, the default virtual machine used is a `Standard_D2ds_v4`.
1. Select **Create** to save the compute environment.

## Advanced options

- (Optional) **Subscription ID**: The ID of the subscription where resources must be deployed. If not specified, the subscription ID of the credentials is used.
- **Instance Type**: The virtual machine type used by the compute environment. Choosing the instance type will directly allocate the CPU and memory available for computation. See [virtual machine sizes](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview) for a comprehensive list of instance types and their resource limitations.

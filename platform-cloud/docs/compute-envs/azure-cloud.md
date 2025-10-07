---
title: "Azure Cloud"
description: "Instructions to set up an Azure Cloud compute environment in Seqera Platform"
date created: "2025-09-29"
last updated: "2025-09-29"
tags: [cloud, vm, azure, compute environment]
---

## Azure Cloud

:::note
This compute environment type is currently in public preview. Please consult this guide for the latest information on recommended configuration and limitations. This guide assumes you already have an Azure account with a valid Azure subscription.
:::

Many of the current implementations of compute environments for cloud providers rely on the use of batch services such as AWS Batch, Azure Batch, and Google Batch for the execution and management of submitted jobs, including pipelines and Studio session environments. Batch services are suitable for large-scale workloads, but they add management complexity. In practical terms, the currently used batch services result in some limitations:

- **Complex setup**: Azure Batch compute environments require users to independently configure their own Batch accounts.
- **Long-lived credentials**: Azure Batch uses access keys to authenticate with Batch and Storage accounts. These credentials are long-lived, and Azure has hard limits on the number of access keys that can be created per resource type.
- *Quotas**: Azure Batch accounts have limits for Jobs, Pools, and compute resources. If these limits are exceeded, no additional pipelines can run until the existing resources are removed.

The Azure Cloud compute environment addresses these pain points with:

- **Simplified configuration**: Fewer configurable options, with opinionated defaults, provide the best Nextflow pipeline and Studio session execution environment, with both [Wave](https://docs.seqera.io/wave) and [Fusion](https://docs.seqera.io/fusion) enabled.
- **More secure credentials**: Authenticate exclusively via [Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra). This provides enhanced security by default, with automatic configuration for the user.

This type of compute environment is best suited to run Studios and small to medium-sized pipelines. It offers more predictable compute pricing, given the fixed instance types. It spins up a standalone Virtual Machine and executes a Nextflow pipeline or Studio session with a local executor on the Virtual Machine. At the end of the execution, the instance is terminated.

## Limitations

- The Nextflow pipeline will run entirely on a single Virtual Machine. If the instance does not have sufficient resources, the pipeline execution will fail. For this reason, the number of tasks Nextflow can execute in parallel is limited by the number of cores of the instance type selected. If you need more computing resources, you must create a new compute environment with a larger instance type. This makes the compute environment less suited for larger, more complex pipelines.
- There is a considerable delay before streaming logs can be queried. This means that if your pipeline completes in under a minute, you might not see streaming logs during the execution.

## Created resources

Seqera will create the following resources in Azure when creating the compute environment:

- One Azure resource group: the container for all other created resources.
- One Azure managed identity: the Entra identity connected to the Virtual Machine, enabling Nextflow to authenticate to Azure services.
- One Azure role: the role attached to the managed identity, which grants the necessary permissions.
- One Log Analytics Workspace: used to collect and query execution logs.
- One Data collection rule: to route execution logs to the appropriate Log Analytics table.
- One Data collection endpoint: the endpoint that receives logs, tied to the data collection rule.
- One Virtual Network: the network in which Virtual Machines are launched.

When Virtual Machines are launched, other resources are provisioned for each machine and tied to the machine lifecycle:

- One network interface
- One OS disk

While the workflow is running, logs are streamed to the `Nextflow_log_CL` table in the Log Analytics workspace for the compute environment. You can query logs for your specific workflow ID with this expression:

```
Nextflow_log_CL | where workflowId == "<WORKFLOW_ID>"
```

The table retains logs for 7 days. Nextflow uploads log files to Azure Storage for long-term storage.

## Requirements

### Platform credentials

To create and launch pipelines or Studio sessions with Azure Cloud compute environments, you must attach Seqera credentials with an Entra client ID/client secret pair. These credentials must also include your Azure subscription ID and Storage account configuration.
See [Register an application in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) and [Add and manage application credentials in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials?tabs=client-secret) for more information.

### Required permissions

For granular control over the permissions granted to Seqera, use [Azure custom roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles) and [assign](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal) them to the service principal. The full role JSON definition is:

```json
{
    "properties": {
        "roleName": "seqera-azure-cloud",
        "description": "Role assumed by Seqera Platform to create Azure Cloud compute environments",
        "assignableScopes": [
            "/subscriptions/<SUBSCRIPTION-ID>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Compute/virtualMachines/read",
                    "Microsoft.Compute/virtualMachines/write",
                    "Microsoft.Compute/virtualMachines/delete",
                    "Microsoft.Compute/virtualMachines/deallocate/action",
                    "Microsoft.Compute/virtualMachines/attachDetachDataDisks/action",

                    "Microsoft.Resources/subscriptions/resourceGroups/write",
                    "Microsoft.Resources/subscriptions/resourceGroups/read",
                    "Microsoft.Resources/subscriptions/resourceGroups/delete",

                    "Microsoft.Network/publicIPAddresses/read",
                    "Microsoft.Network/publicIPAddresses/write",
                    "Microsoft.Network/publicIPAddresses/delete",
                    "Microsoft.Network/publicIPAddresses/join/action",

                    "Microsoft.Network/virtualNetworks/read",
                    "Microsoft.Network/virtualNetworks/write",
                    "Microsoft.Network/virtualNetworks/delete",
                    "Microsoft.Network/virtualNetworks/subnets/read",
                    "Microsoft.Network/virtualNetworks/subnets/write",
                    "Microsoft.Network/virtualNetworks/subnets/delete",
                    "Microsoft.Network/virtualNetworks/subnets/join/action",

                    "Microsoft.Network/networkInterfaces/delete",
                    "Microsoft.Network/networkInterfaces/write",
                    "Microsoft.Network/networkInterfaces/read",
                    "Microsoft.Network/networkInterfaces/join/action",

                    "Microsoft.ManagedIdentity/userAssignedIdentities/read",
                    "Microsoft.ManagedIdentity/userAssignedIdentities/write",
                    "Microsoft.ManagedIdentity/userAssignedIdentities/delete",
                    "Microsoft.ManagedIdentity/userAssignedIdentities/assign/action",

                    "Microsoft.Authorization/roleAssignments/read",
                    "Microsoft.Authorization/roleAssignments/write",
                    "Microsoft.Authorization/roleAssignments/delete",

                    "Microsoft.Authorization/roleDefinitions/read",
                    "Microsoft.Authorization/roleDefinitions/write",
                    "Microsoft.Authorization/roleDefinitions/delete",

                    "Microsoft.Insights/DataCollectionRules/Read",
                    "Microsoft.Insights/DataCollectionRules/Write",
                    "Microsoft.Insights/DataCollectionRules/Delete",

                    "Microsoft.Insights/DataCollectionEndpoints/Write",
                    "Microsoft.Insights/DataCollectionEndpoints/Delete",

                    "Microsoft.OperationalInsights/workspaces/write",
                    "Microsoft.OperationalInsights/workspaces/read",
                    "Microsoft.OperationalInsights/workspaces/delete",
                    "Microsoft.OperationalInsights/workspaces/sharedkeys/action",
                    "Microsoft.OperationalInsights/workspaces/tables/read",
                    "Microsoft.OperationalInsights/workspaces/tables/write",
                    "Microsoft.OperationalInsights/workspaces/tables/delete",
                    "Microsoft.OperationalInsights/workspaces/query/read",
                    "Microsoft.OperationalInsights/workspaces/query/Tables.Custom/read",

                    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
                    "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
                ],
                "notActions": [],
                "dataActions": [
                    "Microsoft.Insights/Telemetry/Write",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write",
                    "Microsoft.OperationalInsights/workspaces/tables/data/read"
                ],
                "notDataActions": []
            }
        ]
    }
}
```

See [Start from JSON](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles-portal#start-from-json) to create this custom role in the Azure Portal.

This role definition can be applied as is for convenience, or it can be broken down into smaller roles. The purpose for each permission is outlined in the following sections.

#### Compute environment creation

The following permissions are required to provision resources in the Azure account when first creating the compute environment:

```json
{
    "properties": {
        "roleName": "seqera-azure-cloud-create",
        "description": "Role assumed by Seqera Platform to create Azure Cloud compute environments",
        "assignableScopes": [
            "/subscriptions/<SUBSCRIPTION-ID>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Resources/subscriptions/resourceGroups/read",
                    "Microsoft.Resources/subscriptions/resourceGroups/write",

                    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
                    "Microsoft.Network/virtualNetworks/read",
                    "Microsoft.Network/virtualNetworks/write",

                    "Microsoft.Network/virtualNetworks/subnets/read",
                    "Microsoft.Network/virtualNetworks/subnets/write",

                    "Microsoft.ManagedIdentity/userAssignedIdentities/read",
                    "Microsoft.ManagedIdentity/userAssignedIdentities/write",

                    "Microsoft.Authorization/roleAssignments/read",
                    "Microsoft.Authorization/roleAssignments/write",

                    "Microsoft.Authorization/roleDefinitions/read",
                    "Microsoft.Authorization/roleDefinitions/write",

                    "Microsoft.Insights/DataCollectionRules/Read",
                    "Microsoft.Insights/DataCollectionRules/Write",

                    "Microsoft.Insights/DataCollectionEndpoints/Write",

                    "Microsoft.OperationalInsights/workspaces/read",
                    "Microsoft.OperationalInsights/workspaces/write",
                    "Microsoft.OperationalInsights/workspaces/tables/write"
                ],
                "notActions": [],
                "dataActions": [],
                "notDataActions": []
            }
        ]
    }
}
```

#### Pipeline and Studio launch

The following permissions are required to launch pipelines and Studios:

```json
{
    "properties": {
        "roleName": "seqera-azure-cloud-launch",
        "description": "Role assumed by Seqera Platform to launch Studios and pipelines on Azure Cloud compute environments",
        "assignableScopes": [
            "/subscriptions/<SUBSCRIPTION-ID>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Compute/virtualMachines/read",
                    "Microsoft.Compute/virtualMachines/write",
                    "Microsoft.Compute/virtualMachines/delete",
                    "Microsoft.Compute/virtualMachines/deallocate/action",
                    "Microsoft.Compute/virtualMachines/attachDetachDataDisks/action",

                    "Microsoft.Network/publicIPAddresses/read",
                    "Microsoft.Network/publicIPAddresses/write",
                    "Microsoft.Network/publicIPAddresses/delete",
                    "Microsoft.Network/publicIPAddresses/join/action",

                    "Microsoft.Network/networkInterfaces/read",
                    "Microsoft.Network/networkInterfaces/write",
                    "Microsoft.Network/networkInterfaces/join/action",
                    "Microsoft.Network/virtualNetworks/subnets/join/action",

                    "Microsoft.ManagedIdentity/userAssignedIdentities/assign/action",

                    "Microsoft.Insights/DataCollectionRules/Write",
                    "Microsoft.Insights/DataCollectionEndpoints/Write"
                ],
                "notActions": [],
                "dataActions": [
                    "Microsoft.Insights/Telemetry/Write"
                    ],
                "notDataActions": []
            }
        ]
    }
}
```

#### Live stream log fetching

The following permissions are required to fetch logs for the pipeline execution while the task is running:

``` json
{
    "properties": {
        "roleName": "seqera-azure-cloud-logs",
        "description": "Role to be assumed by Seqera Platform to read live-streamed logs for Azure Cloud compute environments",
        "assignableScopes": [
            "/subscriptions/<SUBSCRIPTION-ID>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.OperationalInsights/workspaces/query/read",
                    "Microsoft.OperationalInsights/workspaces/query/Tables.Custom/read"
                ],
                "notActions": [],
                "dataActions": [
                    "Microsoft.OperationalInsights/workspaces/tables/data/read"
                ],
                "notDataActions": []
            }
        ]
    }
}
```

#### Data-links

The following permissions are required to work with [Data Explorer](../data/data-explorer) data-links on Azure:

```json
{
    "properties": {
        "roleName": "seqera-azure-cloud-data-links",
        "description": "Role assumed by Seqera Platform to access data-links in Azure Cloud compute environments",
        "assignableScopes": [
            "/subscriptions/<SUBSCRIPTION-ID>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
                    "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
                ],
                "notActions": [],
                "dataActions": [
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write"
                ],
                "notDataActions": []
            }
        ]
    }
}
```

#### Compute environment termination and resource disposal

The following permissions are required to delete the resources created for the compute environment:

```json
{
    "properties": {
        "roleName": "seqera-azure-cloud-dispose",
        "description": "Role assumed by Seqera Platform to delete Azure Cloud compute environment resources",
        "assignableScopes": [
            "/subscriptions/<SUBSCRIPTION-ID>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Resources/subscriptions/resourceGroups/delete",
                    "Microsoft.Network/publicIPAddresses/delete",
                    "Microsoft.Network/virtualNetworks/delete",
                    "Microsoft.Network/virtualNetworks/subnets/delete",
                    "Microsoft.Network/networkInterfaces/delete",
                    "Microsoft.ManagedIdentity/userAssignedIdentities/delete",
                    "Microsoft.Authorization/roleAssignments/delete",
                    "Microsoft.Authorization/roleDefinitions/delete",
                    "Microsoft.Insights/DataCollectionRules/Delete",
                    "Microsoft.Insights/DataCollectionEndpoints/Delete",
                    "Microsoft.OperationalInsights/workspaces/delete",
                    "Microsoft.OperationalInsights/workspaces/tables/delete"
                ],
                "notActions": [],
                "dataActions": [],
                "notDataActions": []
            }
        ]
    }
}
```

## Add Azure Cloud credentials

### Create a custom role in Microsoft Entra

First, you must create a custom role with the permissions required for Seqera Platform to manage Azure resources.

1.  Save the relevant permissions from the preceding sections to a local JSON file. Replace <SUBSCRIPTION-ID> in the `assignableScopes` field of each permission with your Azure subscription ID.
1.  In the Azure Portal, go to **Subscriptions** and select your subscription.
1.  To create a custom role, select **Access control (IAM)**, then **Add** in the **Create a custom role** section. 
1.  Provide the following details:
    - **Custom role name**: e.g., `seqera-azure-cloud`
    - **Description**: e.g., `Role for Seqera Platform to manage Azure Cloud compute environments`
    - **Baseline permissions**: Select **Start from JSON**
    - **File**: Select the local JSON file you saved earlier
1.  Select **Next** and review the permissions to ensure all have been included correctly.
1.  Select **Next** and confirm that the assignable scope is your subscription ID.
1.  Select **Next**. If you found errors in the previous step, you can edit the JSON file here.
1.  Select **Next** and then **Create** to save the role.

### Register an application in Microsoft Entra ID

Create an application for Seqera Platform to use for authentication:

1.  In the Azure Portal, go to **App registrations** and select **New registration**.
1.  Give the app a descriptive name, such as `SeqeraPlatformApp`. Select `Single tenant` for the supported account types.
1.  Create a client secret for the application. Seqera will use this value to authenticate to Azure, so keep it secret and store it securely. Under **Certificates & secrets**, select **New client secret** and give it a description such as `SeqeraPlatformSecret`. Set the expiration to a duration that matches your security policy. Select **Add**.

1. After registration, you'll be taken to the application overview page. Copy and save the following values:
  - **Application (client) ID**: This is your Client ID
  - **Directory (tenant) ID**: This is your Tenant ID

### Assign the custom role to the service principal

Grant the service principal the necessary permissions by assigning the custom role.

1.  In the Azure Portal, navigate to **Subscriptions** and select your subscription. Then select **Access control (IAM)** and **Add role assignment** in the **Grant access to this resource** section.
1.  Select the **Privileged administrator roles** tab and select the role you created earlier, then select **Next**.
1.  Choose **Select members** and search for the application name (`SeqeraPlatformApp`). Then choose **Select**, then **Next**.
1.  Select **Review + assign**, **Review**, and then **Assign**.
1.  Under **What user can do**, select "Allow user to assign all roles except privileged administrator roles Owner, UAA, RBAC (Recommended)", then select **Next**.
1.  Check the final details and select **Review + assign**.

### Configure Seqera Platform credentials

Add the service principal credentials to Seqera:

1.  Sign in to your Seqera workspace and navigate to the **Credentials** tab.
1.  Select **Add credentials**, select **Azure** as the provider, and select the **Cloud** tab for Microsoft Entra ID authentication.
1.  Enter the details of the credentials you saved earlier:
    - **Name**: Provide a descriptive name, such as `AzureCloudCredentials`
    - **Subscription ID**: Your Azure subscription ID
    - **Tenant ID**: Your Directory (tenant) ID from the [Register an application in Microsoft Entra ID](#register-an-application-in-microsoft-entra-id) instructions
    - **Client ID**: Your Application (client) ID from the [Register an application in Microsoft Entra ID](#register-an-application-in-microsoft-entra-id) instructions
    - **Client secret**: Your client secret value from the [Register an application in Microsoft Entra ID](#register-an-application-in-microsoft-entra-id) instructions
    - **Blob Storage account name**: Your Azure Storage account name
1.  Review the details, then select **Add** to save the credentials.

### Create a compute environment

Create a compute environment in Seqera using the credentials:

1.  In your Seqera workspace, navigate to the **Compute Environments** tab and select **Add Compute Environment**.
1.  Select **Azure Cloud** as the target platform.
1.  From the **Credentials** drop-down, select the credentials you created previously.
1.  Enter a name for the compute environment.
1.  Enter or select a **Location** for the compute environment.
1.  Select the **Work directory** as the Azure blob container you plan to use as the Nextflow working directory. The container must be in the same **Location** as selected in the previous step.
1.  (Optional) Under **Advanced options**, specify an **Instance Type**. If left blank, the default VM used is a `Standard_D2ds_v4`.
1.  Select **Create** to save the compute environment.

## Advanced options

- (Optional) **Subscription ID**: The ID of the subscription where resources must be deployed. If not specified, the subscription ID of the credentials is used.
- **Instance Type**: The Virtual Machine type used by the compute environment. Choosing the instance type will directly allocate the CPU and memory available for computation. See [virtual machine sizes](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview) for a comprehensive list of instance types and their resource limitations.

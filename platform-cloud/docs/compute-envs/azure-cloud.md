---
title: "Azure Cloud"
description: "Instructions to set up an Azure Cloud CE in Seqera Platform"
date created: "2025-09-29"
last updated: "2025-09-29"
tags: [cloud, vm, azure, compute environment]
---

# Azure Cloud

:::note
This compute environment type is currently in public preview. Please consult this guide for the latest information on recommended configuration and limitations. This guide assumes you already have an Azure account with a valid Azure subscription.
:::

Many of the current implementations of compute environments for cloud providers rely on the use of batch services such as AWS Batch, Azure Batch, and Google Batch for the execution and management of submitted jobs, including pipelines and Studio session environments. Batch services are suitable for large-scale workloads, but they add management complexity. In practical terms, the currently used batch services result in some limitations:

- **Complex setup**: Azure Batch compute environments require users to independently configure their own Batch accounts.
- **Long lived credentials**: Azure Batch uses access keys to authenticate with the Batch account and the Storage account. These credentials are long lived, and Azure has hard limits on how many access keys can be created per resource type.
- *Quotas**: Azure Batch accounts have limits on the number of Jobs, Pools, and compute resources. If these limits are exceeded, no additional pipelines can run until the existing resources are removed.

The Azure Cloud compute environment addresses these pain points with:

- **Simplified configuration**: Fewer configurable options, with opinionated defaults, provide the best Nextflow pipeline and Studio session execution environment, with both Wave and Fusion enabled.
- **More secure credentials**: Authenticate exclusively via Entra. This provides enhanced security by default, with automatic configuration for the user.

This type of compute environment is best suited to run Studios and small to medium-sized pipelines. It offers more predictable compute pricing, given the fixed instance types. It spins up a standalone Virtual Machine and executes a Nextflow pipeline or Studio session with a local executor on the Virtual Machine. At the end of the execution, the instance is terminated.

## Limitations

- The Nextflow pipeline will run entirely on a single Virtual Machine. If the instance does not have sufficient resources, the pipeline execution will fail. For this reason, the number of tasks Nextflow can execute in parallel is limited by the number of cores of the instance type selected. If you need more computing resources, you must create a new compute environment with a larger instance type. This makes the compute environment less suited for larger, more complex pipelines.

## Created resources

Seqera platform will create the following resources in Azure when creating the Compute Environment:

- One Azure resource group: will be the container for all the other resources created.
- One Azure managed identity: this will be the Entra identity connected to the Virtual Machine, enabling Nextflow to authenticate to Azure services.
- One Azure role: will be the role attached to the managed identity granting the necessary permissions.
- One Log Analytics Workspace: will be used to collect and query execution logs.
- One Data collection rule: will route execution logs to the appropriate Log Analytics table.
- One Data collection endpoint: tied to the data collection rule, logs will be sent to this endpoint.
- One Virtual Network: Virtual Machines launched will be inside this network.

Upon launching Virtual Machines, other resources will be provisioned for each machine launched and will be tied to the machine lifecycle:
- One network interface
- One OS disk

## Requirements

### Platform credentials

To create and launch pipelines or Studio sessions with Azure Cloud compute environments, you must attach Seqera credentials with an Entra client ID/client secret pair. These credentials must also include your Azure subscription ID and storage account configuration.
Please refer to Azure official documentation on how to [register an application](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) and how to [create a client secret](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials?tabs=client-secret).

### Required permissions

In order to have more control over the permissions granted to Seqera platform, we recommend using [Azure custom roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles) and assign them to the service principal through a [role assignment](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal). The full role JSON definiton is:

```json
{
    "properties": {
        "roleName": "seqera-azure-cloud",
        "description": "Role to be assumed by Seqera platform to create Azure Cloud compute environment",
        "assignableScopes": [
            "/subscriptions/<YOUR-SUBSCRIPTION-ID>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Compute/virtualMachines/read",
                    "Microsoft.Compute/virtualMachines/write",
                    "Microsoft.Compute/virtualMachines/delete",
                    "Microsoft.Compute/virtualMachines/deallocate/action",
                    "Microsoft.Compute/virtualMachines/attachDetachDataDisks/action",
                    "Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/logDefinitions/read",
                    "Microsoft.Resources/subscriptions/resourceGroups/write",
                    "Microsoft.Resources/subscriptions/resourceGroups/read",
                    "Microsoft.Resources/subscriptions/resourceGroups/delete",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
                    "Microsoft.Network/publicIPAddresses/write",
                    "Microsoft.Network/publicIPAddresses/delete",
                    "Microsoft.Network/virtualNetworks/write",
                    "Microsoft.Network/virtualNetworks/delete",
                    "Microsoft.Network/virtualNetworks/subnets/read",
                    "Microsoft.Network/virtualNetworks/subnets/write",
                    "Microsoft.Network/virtualNetworks/subnets/delete",
                    "Microsoft.Network/networkInterfaces/delete",
                    "Microsoft.Network/networkInterfaces/write",
                    "Microsoft.Network/networkInterfaces/read",
                    "Microsoft.Network/virtualNetworks/read",
                    "Microsoft.Network/virtualNetworks/subnets/join/action",
                    "Microsoft.Network/networkInterfaces/join/action",
                    "Microsoft.Network/publicIPAddresses/read",
                    "Microsoft.Network/publicIPAddresses/join/action",
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
                    "Microsoft.OperationalInsights/workspaces/analytics/query/action",
                    "Microsoft.OperationalInsights/workspaces/searchJobs/write",
                    "Microsoft.OperationalInsights/workspaces/tables/read",
                    "Microsoft.OperationalInsights/workspaces/tables/query/read",
                    "Microsoft.OperationalInsights/workspaces/providers/Microsoft.Insights/logDefinitions/read",
                    "Microsoft.OperationalInsights/workspaces/query/read",
                    "Microsoft.OperationalInsights/workspaces/sharedkeys/action",
                    "Microsoft.OperationalInsights/workspaces/write",
                    "Microsoft.OperationalInsights/workspaces/read",
                    "Microsoft.OperationalInsights/workspaces/delete",
                    "Microsoft.OperationalInsights/workspaces/tables/write",
                    "Microsoft.OperationalInsights/workspaces/tables/delete",
                    "Microsoft.OperationalInsights/workspaces/search/action",
                    "Microsoft.OperationalInsights/workspaces/analytics/query/schema/read",
                    "Microsoft.OperationalInsights/workspaces/api/query/action",
                    "Microsoft.OperationalInsights/workspaces/api/query/schema/read",
                    "Microsoft.OperationalInsights/workspaces/customfields/read",
                    "Microsoft.OperationalInsights/workspaces/schema/read",
                    "Microsoft.OperationalInsights/workspaces/operations/read",
                    "Microsoft.OperationalInsights/workspaces/search/read",
                    "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
                ],
                "notActions": [],
                "dataActions": [
                    "Microsoft.Insights/Telemetry/Write",
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

Create this custom role on the Azure Portal by importing the JSON as per [the provided instructions](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles-portal#start-from-json).

It can be applied as is for convenience or it can be broken down into smaller roles. We'll outline the rationale for those permission based on their purpose in the next sections.

#### Compute environment creation

The following permissions are required to provision resources in the Azure account, when first creating the compute environment:

```json
{
    "properties": {
        "roleName": "seqera-azure-cloud-create",
        "description": "Role to be assumed by Seqera platform to create Azure Cloud compute environment",
        "assignableScopes": [
            "/subscriptions/<YOUR-SUBSCRIPTION-ID>"
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

The following permissions are required to launch pipelines and studios:

```json
{
    "properties": {
        "roleName": "seqera-azure-cloud-launch",
        "description": "Role to be assumed by Seqera platform to launch Studios and pipelines on Azure Cloud compute environment",
        "assignableScopes": [
            "/subscriptions/<YOUR-SUBSCRIPTION-ID>"
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

The following permissions are required to fetch logs for the pipeliene execution while the task is running:

``` json
{
    "properties": {
        "roleName": "seqera-azure-cloud-logs",
        "description": "Role to be assumed by Seqera platform to read live streamed logs for Azure Cloud compute environment",
        "assignableScopes": [
            "/subscriptions/<YOUR-SUBSCRIPTION-ID>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/logDefinitions/read",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
                    "Microsoft.OperationalInsights/workspaces/analytics/query/action",
                    "Microsoft.OperationalInsights/workspaces/searchJobs/write",
                    "Microsoft.OperationalInsights/workspaces/tables/read",
                    "Microsoft.OperationalInsights/workspaces/tables/query/read",
                    "Microsoft.OperationalInsights/workspaces/providers/Microsoft.Insights/logDefinitions/read",
                    "Microsoft.OperationalInsights/workspaces/query/read",
                    "Microsoft.OperationalInsights/workspaces/sharedkeys/action",
                    "Microsoft.OperationalInsights/workspaces/analytics/query/schema/read",
                    "Microsoft.OperationalInsights/workspaces/api/query/action",
                    "Microsoft.OperationalInsights/workspaces/api/query/schema/read",
                    "Microsoft.OperationalInsights/workspaces/customfields/read",
                    "Microsoft.OperationalInsights/workspaces/schema/read",
                    "Microsoft.OperationalInsights/workspaces/operations/read",
                    "Microsoft.OperationalInsights/workspaces/search/read",
                    "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
                ],
                "notActions": [],
                "dataActions": [
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read",
                ],
                "notDataActions": []
            }
        ]
    }
}
```

Additonally, to be able to fetch live logs from Workflow executions, the [builtin Reader role](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/general#reader) needs to be assigned to the service principal.

#### Data links

The following permissions are required to work with Data links on Azure:

```json
{
    "properties": {
        "roleName": "seqera-azure-cloud-data-links",
        "description": "Role to be assumed by Seqera platform to access data links in Azure Cloud compute environment",
        "assignableScopes": [
            "/subscriptions/<YOUR-SUBSCRIPTION-ID>"
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
        "description": "Role to be assumed by Seqera platform to delete Azure Cloud compute environment",
        "assignableScopes": [
            "/subscriptions/<YOUR-SUBSCRIPTION-ID>"
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

## Advanced options

- **Subscription ID**: The id of the subscription where to deploy resources. This is optional, if not specified the subscription id of the credentials will be used.
- **Instance Type**: The Virtual Machine type used by the compute environment. Choosing the instance type will directly allocate the CPU and memory available for computation. See [virtual machine sizes](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview) for a comprehensive list of instance types and their resource limitations.

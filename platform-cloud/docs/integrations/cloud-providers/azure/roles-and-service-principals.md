---
title: "Azure roles & service principals"
description: "Custom roles, app registration, and role assignment for Seqera Platform on Azure."
tags: [azure, role, service-principal, entra, integration]
---

Use [Azure custom roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles) for granular control over the permissions granted to Seqera, and assign them to a service principal that Seqera authenticates as.

This page covers:

- The full custom role JSON for the Azure Cloud compute environment, broken down by purpose.
- Role assignments for Azure Batch.
- Application registration and role assignment in the Azure Portal.

## Azure Cloud custom role

The full role JSON definition for Azure Cloud:

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

This role can be applied as-is for convenience, or broken down into the smaller roles below.

### Compute environment creation

Provision resources in the Azure account when first creating the compute environment:

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

### Pipeline and Studio launch

Launch pipelines and Studios:

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

### Live stream log fetching

Fetch logs while a task is running:

```json
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

### Data Explorer data-links

Work with [Data Explorer](/platform-cloud/data/data-explorer) data-links on Azure:

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

### Compute environment termination and resource disposal

Delete the resources created for the compute environment:

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

## Azure Batch role assignments

For Azure Batch (rather than Azure Cloud), no custom role is required. Assign these built-in roles to the service principal:

- On the Storage account: **Storage Blob Data Reader** and **Storage Blob Data Contributor**.
- On the Batch account: **Azure Batch Data Contributor**.

## Create a custom role in Microsoft Entra

1. Save the relevant permissions from the preceding sections to a local JSON file. Replace `<SUBSCRIPTION-ID>` in the `assignableScopes` field with your Azure subscription ID.
1. In the Azure Portal, go to **Subscriptions** and select your subscription.
1. Select **Access control (IAM)**, then **Add** in the **Create a custom role** section.
1. Provide:
   - **Custom role name**: e.g., `seqera-azure-cloud`
   - **Description**: e.g., `Role for Seqera Platform to manage Azure Cloud compute environments`
   - **Baseline permissions**: Select **Start from JSON**
   - **File**: Select the local JSON file you saved earlier.
1. Select **Next**, review the permissions and assignable scope, then **Next** again.
1. Select **Create** to save the role.

## Register an application in Microsoft Entra ID

Create an application that Seqera authenticates as:

1. In the Azure Portal, go to **App registrations** and select **New registration**.
1. Give the app a descriptive name (e.g., `SeqeraPlatformApp`).
1. Select **Single tenant** for supported account types.
1. Under **Certificates & secrets**, select **New client secret** with a description (e.g., `SeqeraPlatformSecret`) and an expiration matching your security policy. Select **Add**.
1. Copy and save:
    - **Application (client) ID** — your Client ID
    - **Directory (tenant) ID** — your Tenant ID
    - The client secret value (shown once)

## Assign the custom role to the service principal

1. In the Azure Portal, go to **Subscriptions** and select your subscription. Select **Access control (IAM)**, then **Add role assignment** in the **Grant access to this resource** section.
1. Select the **Privileged administrator roles** tab and select the role you created earlier, then **Next**.
1. Choose **Select members** and search for the application name (`SeqeraPlatformApp`). Select **Select**, then **Next**.
1. Under **What user can do**, select **Allow user to assign all roles except privileged administrator roles Owner, UAA, RBAC (Recommended)**, then **Next**.
1. Select **Review + assign**.

## Next steps

- [Add Azure credentials to Seqera Platform](./credentials).
- [Configure Storage account and Blob container access](./storage-access).
- For Azure Batch with manually-managed pools, see [Azure Batch manual setup](./manual-setup).

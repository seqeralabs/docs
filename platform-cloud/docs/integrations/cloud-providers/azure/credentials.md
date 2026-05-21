---
title: "Azure credentials"
description: "Add Azure access keys or Entra service principal credentials to Seqera Platform."
tags: [azure, credentials, entra, integration]
---

Once you have an Azure Storage account, a Batch account (if using Azure Batch), and either access keys or a registered Entra application, add the credentials to Seqera Platform.

## Credential types

### Access keys

Access keys are simple but limited:

- Long-lived.
- Provide full access to the Storage and Batch accounts.
- Azure allows only two access keys per account.
- Do not support VNet/subnet configuration.

To create an access key credential:

1. In the Azure Portal, locate your Azure Batch account and select **Keys** under **Account management**. Copy a Primary or Secondary key.
1. Locate your Azure Storage account and select **Access keys** under **Security and Networking**. Copy a Key1 or Key2 value.
1. In your Platform workspace **Credentials** tab, select **Add credentials** and complete:
   - **Name**
   - **Provider**: Azure
   - Select the **Shared key** tab
   - **Batch account** and **Blob Storage account** names and access keys
1. Delete the keys from their temporary location once they have been added to a credential in Platform.

### Entra service principal (recommended)

Entra service principals support role-based access control with precise permissions, work across multiple Batch and Storage accounts, and unlock features such as VNet/subnet configuration.

You must first complete [Roles & service principals](./roles-and-service-principals): create a custom role (Azure Cloud) or assign built-in roles (Azure Batch), register the application, and assign the role to the service principal.

To add the credentials to Seqera:

1. In your Platform workspace **Credentials** tab, select **Add credentials** and complete:
   - **Name**
   - **Provider**: Azure
   - Select the **Entra** tab
   - **Subscription ID**: your Azure subscription ID
   - **Tenant ID**: your Directory (tenant) ID
   - **Client ID**: your Application (client) ID
   - **Client secret**: your client secret value
   - **Batch account name** (Azure Batch only)
   - **Blob Storage account name**
1. Delete the values from their temporary location once added to a credential in Platform.

### Managed identity (Azure Batch)

To use a managed identity, Seqera requires Nextflow version 24.06.0-edge or later.

Nextflow can authenticate to Azure services using a managed identity attached to the Azure Batch pool. Seqera still needs access keys or an Entra service principal to submit the initial task to Azure Batch; Nextflow then uses the managed identity for subsequent authentication.

1. In Azure, create a user-assigned managed identity. See [Manage user-assigned managed identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities). Note both the **client ID** and the **resource ID**.
1. The managed identity must have the necessary access roles for Nextflow. See [Required role assignments](https://docs.seqera.io/nextflow/azure#required-role-assignments).
1. Associate the managed identity with the Azure Batch Pool. See [Set up managed identity in your Batch pool](https://learn.microsoft.com/en-us/troubleshoot/azure/hpc/batch/use-managed-identities-azure-batch-account-pool#set-up-managed-identity-in-your-batch-pool).
1. When you set up the Seqera compute environment, select the Azure Batch pool by name and enter the managed identity **client ID** and (optionally) the **resource ID**.

When you submit a pipeline, Nextflow authenticates using the managed identity associated with the Azure Batch node, rather than relying on access keys.

:::caution
If a managed identity is misconfigured (e.g., invalid client ID or missing RBAC roles), the pipeline fails with an explicit error. Seqera does not silently fall back to access key authentication.
:::

## Next steps

- Create the [Azure Batch](/platform-cloud/compute-envs/azure-batch) or [Azure Cloud](/platform-cloud/compute-envs/azure-cloud) compute environment.
- For manually-managed Azure Batch pools, see [Azure Batch manual setup](./manual-setup).

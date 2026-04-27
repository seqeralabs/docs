---
title: "Azure container registry credentials"
description: "Create Azure container registry credentials in Seqera Platform."
date created: "2023-04-21"
last updated: "2025-10-21"
tags: [azure, registry, credentials]
---

Azure Container Registry credentials allow the Wave container service to authenticate and pull container images from your private Azure registries. Azure uses Role-Based Access Control (RBAC) to manage registry access.

:::note
Container registry credentials are only used by the Wave container service. Add `wave { enabled=true }` to the **Nextflow config** field on the launch page, or to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

## Azure container registry access

Azure container registry makes use of Azure RBAC (Role-Based Access Control) to grant users access. For more information, see [Azure container registry roles and permissions](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-roles).

You must use Azure credentials with long-term registry read (**content/read**) access to authenticate Seqera to your registry. We recommend a [token with repository-scoped permissions](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-repository-scoped-permissions) that's used only by Seqera.

**Create an access token with Azure container registry access**

1. In the Azure portal, navigate to your container registry.
2. Under **Repository permissions**, select **Tokens > +Add**.
3. Enter a token name.
4. Under **Scope map**, select **Create new**.
5. In the **Create scope map** section, enter a name and description for the new scope map.
6. Select your **Repository** from the drop-down menu.
7. Select **content/read** from the **Permissions** drop-down menu, then select **Add** to create the scope map.
8. In the **Create token** section, ensure the **Status** is **Enabled** (default), then select **Create**.
9. Return to **Repository permissions > Tokens** for your registry, then select the token you just created.
10. On the token details page, select **password1** or **password2**.
11. In the password details section, uncheck the **Set expiration date?** checkbox, then select **Generate**.
12. Copy and save the generated password (this is only displayed once).

## Add credentials to Seqera

1.  Add your credentials to your organization or personal workspace:
    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: Specify a unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `my-registry-creds`.
    - **Provider**: Select **Container registry**.
    - **User name**: Specify your registry token name. For example, `my-registry-token`.
    - **Password**: Your registry token password. For example, `my-registry-token`.
    - **Registry server**: Specify the container registry server name. You can obtain this from the Azure portal: **Settings > Access keys > Login server**. For example, `myregistry.azurecr.io`.

3.  After you've completed all the form fields, select **Add**. The new credential is now listed under the **Credentials** tab.

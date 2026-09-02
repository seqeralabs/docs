---
title: "Deploy Platform"
description: "Seqera Platform Enterprise deployment and the ways to access your instance."
date created: "2023-04-21"
last updated: "2026-09-02"
tags: [platform, deployment]
---

Deploy Seqera Platform Enterprise in your organization's own infrastructure, then access it through the UI, the API, the CLI, or Nextflow.

[Seqera Platform Enterprise](../enterprise/overview) is installed in an organization's own cloud or on-premises infrastructure. It includes:

- Monitoring, logging, and observability
- Pipeline execution Launchpad
- Cloud resource provisioning
- Pipeline actions and event-based execution
- LDAP and OpenID authentication
- Enterprise role-based access control (RBAC)
- Full-featured API
- Dedicated support for Nextflow and Seqera Platform

To install Platform in your organization's infrastructure, [contact us](https://cloud.seqera.io/demo/) for a demo to discuss your requirements.

## Access Platform

You can access your Seqera instance through the UI, the [API](https://docs.seqera.io/platform-api), the [CLI](https://docs.seqera.io/platform-cli), or in Nextflow directly using the `-with-tower` option.

### Web-based UI

1. Sign in to your Seqera Platform instance at the URL provided by your administrator.

   :::note
   Login sessions remain active while the browser window is open and active. After you close the browser window, Platform signs you out within 6 hours by default.
   :::

2. Create and configure a new [compute environment](../compute-envs/overview).
3. Start [launching pipelines](../launch/launchpad).

### Seqera API

See [API](https://docs.seqera.io/platform-api).

### Seqera CLI

See [CLI](https://docs.seqera.io/platform-cli).

### Nextflow `-with-tower`

If you run Nextflow directly in an existing environment, add the `-with-tower` option to your run command to use Platform capabilities:

1. Sign in to your Seqera Platform instance.
2. In your personal workspace, go to the user menu and select **Settings** > **Your tokens**.
3. Select **Add token**.
4. Enter a unique name for your token, then select **Add**.
5. Copy and store your token securely.

    :::caution
    Platform displays the access token only once. Save the token value before you close the **Personal Access Token** window.
    :::

6. Open a terminal window and create environment variables to store the Seqera access token and Nextflow version. Replace `<ACCESS_TOKEN>` with your new token.

    ```bash
    export TOWER_ACCESS_TOKEN=<ACCESS_TOKEN>
    export NXF_VER=26.04.6
    ```

    :::note
    Bearer token support requires Nextflow version 20.10.0 or later. Set the version with the `NXF_VER` environment variable.
    :::

7. To submit a pipeline to a [workspace](../orgs-and-teams/workspace-management) using Nextflow, add the workspace ID to your environment:

    ```bash
    export TOWER_WORKSPACE_ID=000000000000000
    ```

    To find your workspace ID, select your organization in Seqera and navigate to the **Workspaces** tab.

8. Run your Nextflow pipeline with the `-with-tower` flag:

    ```bash
    nextflow run main.nf -with-tower
    ```

    Replace `main.nf` with the filename of your Nextflow script.

You can now monitor your workflow runs in the Seqera interface. To configure and execute Nextflow pipelines in cloud environments, see [compute environments](../compute-envs/overview).

:::tip
See the [Nextflow documentation](https://docs.seqera.io/nextflow/config.html?highlight=tower#scope-tower) for further run configuration options using Nextflow configuration files.
:::

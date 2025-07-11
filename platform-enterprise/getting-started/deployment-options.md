---
title: "Deploy Platform"
description: "An overview of deployment versions and ways to run Seqera Platform."
date: "21 Apr 2023"
tags: [deployment]
---

[Seqera Platform Enterprise](../../version-25.1/enterprise/overview) is installed in an organization's own cloud or on-premises infrastructure. It includes:

- Monitoring, logging, and observability
- Pipeline execution Launchpad
- Cloud resource provisioning
- Pipeline actions and event-based execution
- LDAP and OpenID authentication
- Enterprise role-based access control (RBAC)
- Full-featured API
- Dedicated support for Nextflow and Seqera Platform

To install Platform in your organization's infrastructure, [contact us](https://cloud.seqera.io/demo/) for a demo to discuss your requirements.

## How to use Platform

You can access your Seqera instance through the UI, the [API](../api/overview), the [CLI](../cli/overview), or in Nextflow directly using the `-with-tower` option.

### Platform web-based UI

1. Create an account and log in to Seqera Cloud at [cloud.seqera.io](https://cloud.seqera.io).

   :::note
   Platform login sessions remain active as long as the application browser window remains open and active. When the browser window is terminated, automatic logout occurs within 6 hours by default.
   :::

2. Create and configure a new [compute environment](../compute-envs/overview).
3. Start [launching pipelines](../launch/launchpad).

### Seqera API

See [API](../api/overview).

### Seqera CLI

See [CLI](../cli/overview).

### Nextflow `-with-tower`

If you have an existing environment where you run Nextflow directly, you can still leverage Seqera Platform capabilities by executing your Nextflow run with a `with-tower` flag:

1. Create an account and log in to Seqera at [cloud.seqera.io](https://cloud.seqera.io).
2. From your personal workspace: Go to the user menu and select **Settings > Your tokens**.
3. Select **Add token**.
4. Enter a unique name for your token, then select **Add**.
5. Copy and store your token securely.

    :::caution
    The access token is displayed only once. Save the token value before closing the **Personal Access Token** window.
    :::

6. Open a terminal window and create environment variables to store the Seqera access token and Nextflow version. Replace `<ACCESS_TOKEN>` with your newly-created token.

    ```bash
    export TOWER_ACCESS_TOKEN=<ACCESS_TOKEN>
    export NXF_VER=23.10.1
    ```

    :::note
    Bearer token support requires Nextflow version 20.10.0 or later. Set with the `NXF_VER` environment variable.
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
See the [Nextflow documentation](https://www.nextflow.io/docs/latest/config.html?highlight=tower#scope-tower) for further run configuration options using Nextflow configuration files.
:::

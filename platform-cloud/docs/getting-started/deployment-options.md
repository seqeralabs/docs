---
title: "Deployment options"
description: "Seqera Platform deployment options and ways to access your Seqera instance."
date created: "2023-04-21"
last updated: "2026-06-16"
tags: [deployment]
---

Seqera Platform is available in two deployment options: Seqera Cloud, hosted by Seqera, and Seqera Enterprise, installed in your organization's own infrastructure. You can access either deployment through the web-based user interface (UI), the API, the CLI, or directly in Nextflow.

## Platform options

### Seqera Cloud

[Seqera Cloud](https://cloud.seqera.io) is the hosted deployment, recommended for users who are new to Platform and for individuals and organizations that want to set up quickly. The free tier includes up to five concurrent runs per user. Seqera Cloud Pro offers unlimited runs and dedicated support. [Contact us](https://cloud.seqera.io/demo/) for a demo to discuss your requirements.

### Seqera Enterprise

[Seqera Enterprise](https://docs.seqera.io/platform-enterprise/enterprise) runs in your organization's own cloud or on-premises infrastructure. It includes:

- Monitoring, logging, and observability
- Pipeline execution Launchpad
- Cloud resource provisioning
- Pipeline actions and event-based execution
- LDAP and OpenID authentication
- Enterprise role-based access control (RBAC)
- Full-featured API
- Dedicated support for Nextflow and Seqera Platform

To install Platform in your organization's infrastructure, [contact us](https://cloud.seqera.io/demo/) for a demo.

## Access Platform

Access your Seqera instance through the UI, the API, the CLI, or in Nextflow directly with the `-with-tower` run option.

### Web-based UI

1. Create an account and sign in to Seqera Cloud at [cloud.seqera.io](https://cloud.seqera.io).

   :::note
   Login sessions remain active while the browser window is open and active. After you close the browser window, Platform signs you out within 6 hours by default.
   :::

2. Create and configure a new [compute environment](../compute-envs/overview).
3. Start [launching pipelines](../launch/launchpad).

### Seqera API

The Seqera API provides programmatic access to Platform. Use the API to automate operations such as launching pipelines, creating compute environments, and managing workspaces, or to integrate Platform with your existing infrastructure and tooling. Authenticate API requests with a Platform access token.

See [API](https://docs.seqera.io/platform-api) for the full endpoint reference and usage details.

:::tip
To find the organization and workspace IDs that API endpoints use, see [Automation](./quickstart-demo/automation#find-your-organization-and-workspace-ids).
:::

### Seqera CLI

The Seqera CLI (`tw`) brings Platform concepts such as pipelines and compute environments to the terminal. Launch pipelines, manage cloud resources, and administer your analyses from the command line, or define Platform resources declaratively to version and manage them as code.

See [CLI](https://docs.seqera.io/platform-cli) for installation instructions and the command reference.

### Nextflow `-with-tower`

If you run Nextflow directly in an existing environment, add the `-with-tower` option to your run command to use Platform capabilities:

1. Create an account and sign in to Seqera at [cloud.seqera.io](https://cloud.seqera.io).
2. In your personal workspace, go to the user menu and select **Settings** > **Your tokens**.
3. Select **Add token**.
4. Enter a unique name for your token, then select **Add**.
5. Copy and store your token securely.

    :::caution
    Platform displays the access token only once. Save the token value before you close the **Personal Access Token** window.
    :::

6. Open a terminal window and create environment variables to store the Seqera access token and Nextflow version. Replace `<ACCESS_TOKEN>` with your new token:

    ```bash
    export TOWER_ACCESS_TOKEN=<ACCESS_TOKEN>
    export NXF_VER=23.10.1
    ```

    :::note
    Bearer token support requires Nextflow version 20.10.0 or later. Set the version with the `NXF_VER` environment variable.
    :::

7. To submit a pipeline to a [workspace](../orgs-and-teams/workspace-management) using Nextflow, add the workspace ID to your environment:

    ```bash
    export TOWER_WORKSPACE_ID=000000000000000
    ```

    To find your workspace ID, select your organization in Seqera and select the **Workspaces** tab.

8. Run your Nextflow pipeline with the `-with-tower` option:

    ```bash
    nextflow run main.nf -with-tower
    ```

    Replace `main.nf` with the filename of your Nextflow script.

You can now monitor your runs in the Seqera UI. To configure and run Nextflow pipelines in cloud environments, see [compute environments](../compute-envs/overview).

:::tip
For additional run configuration options using Nextflow configuration files, see the [Nextflow documentation](https://docs.seqera.io/nextflow/config.html?highlight=tower#scope-tower).
:::

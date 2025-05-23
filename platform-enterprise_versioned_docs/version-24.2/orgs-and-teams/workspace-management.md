---
title: "Workspaces"
description: "Manage users and teams for an organization in Seqera Platform."
date: "24 Apr 2023"
tags: [workspaces, teams, users, administration]
---

Each user has a unique **user workspace** to manage resources such as pipelines, compute environments, and credentials. You can also create multiple workspaces within an organization context and associate each of these workspaces with dedicated teams of users, while providing fine-grained access control for each of the teams.

**Organization workspaces** extend the functionality of user workspaces by adding the ability to fine-tune access levels for specific members, collaborators, or teams. This is achieved by managing **participants** in the organization workspaces.

Organizations consist of members, while workspaces consist of participants.

:::note
A workspace participant may be a member of the workspace organization or a collaborator within that workspace only. Collaborators count toward the total number of workspace participants. See [Usage limits](../limits/overview).
:::

## Create a new workspace

Organization owners and admins can create a new workspace within an organization:

1. Go to the **Workspaces** tab of the organization page.
2. Select **Add Workspace**.
3. Enter the **Name** and **Full name** for the workspace.
4. Optionally, add a **Description** for the workspace.
5. Under **Visibility**, select either **Private** or **Shared**. Private visibility means that workspace pipelines are only accessible to workspace participants.
6. Select **Add**.

:::tip
As a workspace owner, you can modify optional workspace fields after workspace creation. You can either select **Edit** on an organization's workspaces list or the **Settings** tab within the workspace page.
:::

Apart from the **Participants** tab, the _organization_ workspace is similar to the _user_ workspace. As such, the relation to [runs](../launch/launchpad), [actions](../pipeline-actions/overview), [compute environments](../compute-envs/overview), and [credentials](../credentials/overview) is the same.

## Edit a workspace

:::note
From version 23.2, **workspace owners** can edit their workspace name, either from the workspace settings tab or the [Admin panel](../administration/overview).
:::

Open the **Settings** tab on the workspace page and select **Edit Workspace**. Make your updates and select **Update** to save changes.

Additionally, you can edit the Studios session lifespan, if you have enabled Studios for your Seqera instance. Select **Edit Settings** for the **Studios** card on the workspace page.

## Add a new participant

A new workspace participant can be an existing organization member, team, or collaborator. To add a new participant to a workspace:

1. Go to the **Participants** tab in the workspace menu.
2. Select **Add participant**.
3. Enter the **Name** of the new participant.
4. Optionally, update the participant **role**.

## Workspace run monitoring

To allow users executing pipelines from the command line to share their runs with a given workspace, see [deployment options](../getting-started/deployment-options#nextflow--with-tower).

Seqera Platform introduces the concept of shared workspaces as a solution for synchronization and resource sharing within an organization. A shared workspace enables the creation of pipelines in a centralized location, making them accessible to all members of an organization.

The benefits of using a shared workspace within an organization include:

- **Define once and share everywhere**: Set up shared resources once and automatically share them across the organization.
- **Centralize the management of key resources**: Organization administrators can ensure the correct pipeline configuration is used in all areas of an organization without the need to replicate pipelines across multiple workspaces.
- **Immediate update adoption**: Updated parameters for a shared pipeline become immediately available across the entire organization, reducing the risk of pipeline discrepancies.
- **Computational resource provision**: Pipelines in shared workflows can be shared along with the required computational resources. This eliminates the need to duplicate resource setup in individual workspaces across the organization. Shared workspaces centralize and simplify resource sharing within an organization.

### Create a shared workspace

Creating a shared workspace is similar to the creation of a private workspace, with the exception of the **Visibility** option, which must be set to **Shared**.

### Create a shared pipeline

When you create a pipeline in a shared workspace, associating it with a [compute environment](../compute-envs/overview) is optional.

If a compute environment from the shared workspace is associated with the pipeline, it will be available to users in other organization workspaces to launch the shared pipeline with the associated compute environment by default.

### Use shared pipelines from a private workspace

Once a pipeline is set up in a shared workspace and associated with a compute environment in that workspace, any user can launch the pipeline from an organization workspace using the shared workspace's compute environment. This eliminates the need for users to replicate shared compute environments in their private workspaces.

:::note
The shared compute environment will not be available to launch other pipelines limited to that specific private workspace.
:::

If a pipeline from a shared workspace is shared **without** an associated compute environment, users can run it from other organization workspaces. By default, the **primary** compute environment of the launching workspace will be selected.

### Make shared pipelines visible in a private workspace

:::note
Pipelines from _all_ shared workspaces are visible when the visibility is set to **Shared workspaces**.
:::

To view pipelines from shared workspaces, go to the [Launchpad](../launch/launchpad) and set the **Filter > Pipelines from** option to **This and shared workspaces**.
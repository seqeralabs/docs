---
title: "Workspaces"
description: "Manage users and teams for an organization in Seqera Platform."
date: "24 Apr 2023"
tags: [workspaces, teams, users, organization, administration]
---

Each user has a unique **user workspace** to manage resources such as pipelines, compute environments, and credentials. You can also create multiple workspaces within an organization context and associate each of these workspaces with dedicated teams of users, while providing fine-grained access control for each of the teams.

**Organization workspaces** extend the functionality of user workspaces by adding the ability to fine-tune access levels for specific members, collaborators, or teams. This is achieved by managing **participants** in the organization workspaces.

Organizations consist of members, while workspaces consist of participants.

:::note
A workspace participant may be a member of the workspace organization or a collaborator within that workspace only. Collaborators count toward the total number of workspace participants. See [Usage limits](../limits/overview).
:::

### Create a new workspace

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

### Workspace settings 

Select the **Settings** tab within a workspace to manage credits, Studios settings, workspace labels, and edit or delete the workspace.

#### Credits 

[Seqera Compute](../compute-envs/seqera-compute) environments consume credits when running pipelines or Studio sessions. Credits are consumed for CPU time, memory and storage usage, and network costs. One Seqera Compute credit is equivalent to $1 (USD), and resources are charged at the following rates:
- CPU time: 1 CPU/Hr = 0.1 credits
- Memory: 1 GiB/Hr = 0.025 credits
- Storage: 1 GB = 0.025 credits per month

:::note 
Storage and network costs vary per region, charged at standard AWS rates. Data ingress and egress across regions incur additional costs.
:::

Your available credit balance depends on the credits purchased and limits applied to your Seqera license. The **Credits** view contains the current credit balance available to the organization, and the credits spent in the workspace. Select **Contact us to upgrade** to purchase additional credits for your organization.

#### Studios settings

Edit the workspace's Studio settings to set a predefined lifespan (between 1 and 120 hours), after which all Studio sessions in the workspace are automatically stopped. To keep all workspace Studios running indefinitely, select **Always keep the session running**.

:::note
Studios sessions created in shared workspaces are not shared across all the workspaces in an organization.
:::

#### Edit labels

Select **Edit labels** to manage the workspace [labels and resource labels](../labels/overview).

#### Edit or delete workspace

:::note
Workspace **owners** can edit their workspace name from the workspace **Settings** tab.
:::

- Select **Edit workspace** to update the workspace name, full name, description, and sharing. Select **Update** to save changes.
- Select **Delete workspace** to delete the workspace and its associated resources. This action cannot be reveresed.

### Add a new participant

A new workspace participant can be an existing organization member, team, or collaborator. To add a new participant to a workspace:

1. Go to the **Participants** tab in the workspace menu.
2. Select **Add participant**.
3. Enter the **Name** of the new participant.
4. Optionally, update the participant **role**.

### Workspace run monitoring

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

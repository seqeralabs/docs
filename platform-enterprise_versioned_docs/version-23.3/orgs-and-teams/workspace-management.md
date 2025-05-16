---
title: "Workspace management"
description: "Manage users and teams for an organization in Seqera Platform."
date: "24 Apr 2023"
tags: [workspaces, teams, users, administration]
---

Each user has a unique **user workspaces** to manage resources such as pipelines, compute environments, and credentials. You can also create multiple workspaces within an organization context and associate each of these workspaces with dedicated teams of users, while providing fine-grained access control for each of the teams.

**Organization workspaces** extend the functionality of [user workspaces](../orgs-and-teams/shared-workspaces) by adding the ability to fine-tune access levels for specific members, collaborators, or teams. This is achieved by managing **participants** in the organization workspaces.

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
Optional workspace fields can be modified after workspace creation, either with the **Edit** option on an organization's workspaces list or the **Settings** tab within the workspace page, provided that you are the workspace **owner**.
:::

Apart from the **Participants** tab, the _organization_ workspace is similar to the _user_ workspace. As such, the relation to [runs](../launch/launchpad), [actions](../pipeline-actions/overview), [compute environments](../compute-envs/overview) and [credentials](../credentials/overview) is the same.

## Edit a workspace

:::note
From version 23.2, **workspace owners** can edit their workspace name, either from the workspace settings tab or the [Admin panel](../administration/overview).
:::

Open the **Settings** tab on the workspace page and select **Edit Workspace**. Make your updates and select **Update** to save changes.

## Add a new participant

A new workspace participant can be an existing organization member, team, or collaborator. To add a new participant to a workspace:

1. Go to the **Participants** tab in the workspace menu.
2. Select **Add participant**.
3. Enter the **Name** of the new participant.
4. Optionally, update the participant **role**. For more information on **roles**, see [participant roles](#participant-roles).

## Participant roles

Organization owners can assign role-based access levels to any **participant** in an organization workspace.

:::tip
You can group **members** and **collaborators** into **teams** and apply a role to that team. Members and collaborators inherit the access role of the team.
:::

There are five roles available for every workspace participant:

1. **Owner**: The participant has full permissions for all resources within the workspace, including the workspace settings.
2. **Admin**: The participant has full permissions for resources associated with the workspace. They can create, modify, and delete pipelines, compute environments, actions, and credentials. They can add/remove users to the workspace and edit workspace settings, but cannot delete it.
3. **Maintain**: The participant can launch pipelines and modify pipeline executions (e.g., they can change the pipeline launch compute environments, parameters, pre/post-run scripts, and Nextflow configuration) and create new pipelines in the Launchpad. Users with maintain permissions cannot modify compute environments and credentials.
4. **Launch**: The participant can launch pipelines and modify the pipeline input/output parameters in the Launchpad. They cannot modify the launch configuration or other resources.
5. **View**: The participant can view workspace pipelines and runs in read-only mode.

## Workspace run monitoring

To allow users executing pipelines from the command line to share their runs with a given workspace, see [deployment options](../getting-started/deployment-options#nextflow--with-tower).

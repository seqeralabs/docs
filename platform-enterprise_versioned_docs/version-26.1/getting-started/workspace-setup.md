---
title: "Set up your workspace"
description: "Create an organization workspace and add participants in Seqera Platform."
date created: "2024-04-15"
last updated: "2026-09-02"
tags: [platform, organizations, workspaces, users]
---

Create an organization and a workspace inside it, then add participants and control their access with teams.

Workspaces in Seqera Platform contain the resources to run your analyses and manage your computing infrastructure. Each workspace member has an access role that determines how they interact with the pipelines, compute environments, and data in the workspace. While each Platform user has a personal workspace, resource sharing and access management happen in organization workspaces.

To create an organization workspace and begin adding participants, first create your organization.

:::info[**Prerequisites**]

You need the following:

- An account on your organization's Seqera Platform instance. See [Deploy Platform](./deployment-options) for the ways to access your instance.

:::

## Create an organization

Organizations are the top-level structure and contain workspaces, members, and teams. You can also add external collaborators to an organization. See [Organization management](../orgs-and-teams/organizations) for more information.

1. Expand the **Organization | Workspace** drop-down and select **Add organization**.
1. Complete the organization details fields:
    - The organization's **Name** in Platform.
    - The **Full name** of the organization.
    - A **Description** of the organization to provide contextual information that may be helpful to other organization members.
    - The organization's **Location**.
    - The organization's **Website URL**.
    - Drag and drop or upload an image for the organization's **Logo**.
1. Select **Add**.

You are the first **Owner** of the organizations that you create. Add other organization owners and members as needed from the organization's **Members** tab.

## Create a workspace

1. From the organization's **Workspaces** tab, select **Add Workspace**.
1. Complete the workspace details fields:
    - The workspace's **Name** in Platform.
    - The **Full name** of the workspace.
    - A **Description** of the workspace to provide contextual information that may be helpful to other workspace participants.
    - **Visibility**: Choose whether the workspace's pipelines must be **Shared** to all organization members, or only visible to workspace participants (**Private**).
1. Select **Add**. Your new workspace is listed in the organization's **Workspaces** tab.
1. Select your new workspace, then select the **Participants** tab to **Add Participants**.
1. Enter the names of existing organization members or teams and select **Add**.
1. Update a participant's access **Role** from the drop-down, if needed.

## Simplify workspace access with teams

Teams group organization members for workspace role-based access control (RBAC). All team members inherit the per-workspace access roles you assign to the team.

Create a team, add team members, and add the team to workspaces from the **Teams** tab on your organization page:

1. Select **Add Team**, enter the team's details and an optional team avatar image, then select **Add**.
1. Select **Edit** next to the team name in the list, then select the **Members of team** tab to add new members by name or email.
    :::note
    Team members must be existing organization members.
    :::
1. From the team edit screen's **Workspaces** tab, add workspaces by name and select an access **Role** from the drop-down next to each workspace in the list. All team members inherit the workspace access role for the team.

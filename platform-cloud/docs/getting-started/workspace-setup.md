---
title: "Set up your workspace"
description: "Create an organization workspace and add participants in Seqera Platform."
date created: "2024-04-15"
last updated: "2026-06-29"
tags: [platform, organizations, workspaces, users]
---

Workspaces in Seqera Platform contain the resources to run your analyses and manage your computing infrastructure. Each workspace participant has an access role that determines how they interact with the pipelines, compute environments, and data in the workspace. While each Platform user has a personal workspace, resource sharing and access management happen in organization workspaces.

To set up an organization workspace, first create the organization that contains it.

### Create an organization

Organizations are the top-level structure and contain workspaces, members, and teams. You can also add external collaborators to an organization. For more information, see [Organization management](../orgs-and-teams/organizations).

1. Expand the **Organization | Workspace** drop-down and select **Add organization**.
1. Complete the organization details:
    - **Name**: The organization name displayed in Platform.
    - **Full name**: The full name of the organization.
    - **Description**: A description of the organization for other organization members.
    - **Location**: The organization's location.
    - **Website URL**: The organization's website.
    - **Logo**: Drag and drop or upload an image.
1. Select **Add**.

You are the first **Owner** of each organization you create. Add other organization owners and members from the organization's **Members** tab.

### Create a workspace

1. From the organization's **Workspaces** tab, select **Add Workspace**.
1. Complete the workspace details:
    - **Name**: The workspace name displayed in Platform.
    - **Full name**: The full name of the workspace.
    - **Description**: A description of the workspace for other workspace participants.
    - **Visibility**: Whether the workspace's pipelines are visible to all organization members (**Shared**) or only to workspace participants (**Private**).
1. Select **Add**. Your new workspace is listed in the organization's **Workspaces** tab.
1. Select your new workspace, then select the **Participants** tab to **Add Participants**.
1. Enter the names of existing organization members or teams and select **Add**.
1. Update a participant's access **Role** from the drop-down, if needed.

### Manage workspace access with teams

Teams group organization members for workspace role-based access control (RBAC). All team members inherit the per-workspace access roles you assign to the team.

Create a team, add team members, and add the team to workspaces from the **Teams** tab on your organization page:

1. Select **Add Team**, enter the team's details and an optional team avatar image, then select **Add**.
1. Select **Edit** next to the team name in the list, then select the **Members of team** tab to add new members by name or email.
    :::note
    Team members must be existing organization members.
    :::
1. From the team edit screen's **Workspaces** tab, add workspaces by name and select an access **Role** from the drop-down next to each workspace in the list.

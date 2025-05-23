---
title: "Set up your workspace"
description: "Instructions to create an organization workspace and add participants in Seqera Platform."
date: "15 April 2024"
tags: [platform, organizations, workspaces, users]
---

Workspaces in Seqera Platform contain the resources to run your analyses and manage your computing infrastructure. Workspace members are granted various access roles to interact with the pipelines, compute environments, and data in a workspace. While each Platform user has a personal workspace, resource sharing and access management happens in an organization workspace context. 

To create an organization workspace and begin adding participants, first create your organization: 

### Create an organization 

Organizations are the top-level structure and contain workspaces, members, and teams. You can also add external collaborators to an organization. See [Organization management](../orgs-and-teams/organizations) for more information. 

1. Expand the **Organization | Workspace** dropdown and select **Add organization**.
1. Complete the organization details fields:
    - The **Name** to be associated with the organization in Platform.
    - The **Full name** of the organization. 
    - A **Description** of the organization to provide contextual information that may be helpful to other organization members. 
    - The organization's **Location**.
    - The organization's **Website URL**. 
    - Drag and drop or upload an image to be used as the organization's **Logo** in Platform. 
1. Select **Add**. 

You are the first **Owner** of the organizations that you create. Add other organization owners and members as needed from the organization's **Members** tab. 

### Create a workspace 

1. From the organization's **Workspaces** tab, select **Add Workspace**.
1. Complete the workspace details fields:
    - The **Name** to be displayed for the workspace in Platform. 
    - The **Full name** of the workspace. 
    - A **Description** of the workspace to provide contextual information that may be helpful to other workspace participants.
    - **Visibility**: Choose whether the workspace's pipelines must be **Shared** to all organization members, or only visible to workspace participants (**Private**). 
1. Select **Add**. You are redirected to your organization's **Workspaces** tab with your new workspace listed.
1. Select your new workspace, then select the **Participants** tab to **Add Participants**. 
1. Enter the names of existing organization members or teams and select **Add**. 
1. Update a participant's access **Role** from the dropdown, if needed. 

### Simplify workspace access with teams

Teams simplify workspace role-based access control (RBAC) for groups of organization members. Per-workspace access roles assigned to teams are inherited by all team members. 

Create a new team, add team members, and add the team to workspaces from the **Teams** tab on your organization page:

1. Select **Add Team**, enter the team's details and an optional team avatar image, then select **Add**.
1. Select **Edit** next to the team name in the list, then select the **Members of team** tab to add new members by name or email. 
    :::note
    Team members must be existing organization members. 
    :::
1. From the team edit screen's **Workspaces** tab, add workspaces by name and select an access **Role** from the dropdown next to each workspace in the list. All team members inherit the workspace access role for the team. 

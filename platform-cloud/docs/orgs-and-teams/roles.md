---
title: "User roles"
description: "Understand the various roles in Seqera Platform."
date: "10 Jun 2024"
tags: [roles, user-roles]
---

Organization owners can assign role-based access levels to individual **participants** and **teams** in an organization workspace.

:::tip
You can group **members** and **collaborators** into **teams** and apply a role to that team. Members and collaborators inherit the access role of the team.
:::

### Organization user roles

- **Owner**: After an organization is created, the user who created the organization is the default owner of that organization. Aditional users can be assigned as organization owners. Owners have full read/write access to modify members, teams, collaborators, and settings within an organization.
- **Member**: A member is a user who is internal to the organization. Members have an organization role and can operate in one or more organization workspaces. In each workspace, members have a participant role that defines the permissions granted to them within that workspace.

### Workspace participant roles

| Permission / Role                          | Owner | Admin | Maintain | Launch | Connect | View |
|--------------------------------------------|-------|-------|----------|--------|---------|------|
| **Organization: Settings:** Add, edit, delete        | ✔     | ✖     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Workspaces:** Add, delete        | ✔     | ✖     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Workspaces:** Edit, change visibility        | ✔     | ✔     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Members:** Add, delete, change role        | ✔     | ✖     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Teams:** Add, edit, delete        | ✔     | ✖     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Teams: Members:** Add, remove        | ✔     | ✖     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Teams: Workspaces:** Add, remove, change role        | ✔     | ✖     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Collaborators:** Add, edit, delete        | ✔     | ✔     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Managed identities:** Add, delete        | ✔     | ✖     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Managed identities:** Edit        | ✔     | ✔     | ✖       | ✖     | ✖      | ✖   |
| **Organization: Managed identities: Users:** Manage credentials        | ✔     | ✖     | ✖       | ✖     | ✖      | ✖   |
| **Workspace: Settings: Studios:** Edit session lifespan  | ✔     | ✔     | ✖       | ✖     | ✖      | ✖   |
| **Workspace: Settings: Labels & Resource Labels:** Add, edit, delete | ✔     | ✔     | ✔       | ✖     | ✖      | ✖   |
| **Workspace: Compute environments:** Add, rename, make primary, duplicate, delete    | ✔     | ✔     | ✖       | ✖     | ✖      | ✖   |
| **Workspace: Actions:** Add, edit, delete  | ✔     | ✔     | ✔       | ✖     | ✖      | ✖   |
| **Workspace: Credentials:** Add, edit, delete  | ✔     | ✔     | ✔       | ✖     | ✖      | ✖   |
| **Workspace: Secrets:** Add, edit, delete  | ✔     | ✔     | ✔       | ✖     | ✖      | ✖   |
| **Workspace: Participants:** Add, remove, change role             | ✔     | ✔     | ✔       | ✖     | ✖      | ✖   |
| **Workspace: Pipelines:** Launch                          | ✔     | ✔     | ✔        | ✔      | ✖      | ✖   |
| **Workspace: Pipelines:** View                         | ✔     | ✔     | ✔        | ✔      | ✔      | ✔   |
| **Workspace: Pipelines:** Define input/output parameters   | ✔     | ✔     | ✔        | ✔      | ✖      | ✖   |
| **Workspace: Pipelines:** Modify execution configurations  | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Pipelines:** Add, edit, duplicate, delete  | ✔     | ✔     | ✔        | ✔     | ✖      | ✖   |
| **Workspace: Pipelines:** Modify resource labels       | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Pipelines: Run:** Apply labels, relaunch, save as new pipeline  | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Pipelines: Run:** Resume, delete, star (favourite)  | ✔     | ✔     | ✔        | ✔     | ✖      | ✖   |
| **Workspace: Pipelines:** Modify resource labels       | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Datasets:** Add, edit        | ✔     | ✔     | ✔        | ✔     | ✖      | ✖   |
| **Workspace: Datasets:** Delete        | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Data Explorer:** Upload, download, preview data        | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Data Explorer:** Attach, edit, remove buckets                            | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Data Explorer:** Hide/unhide buckets                       | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Data Explorer:** Edit bucket metadata   | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Studios:** Add, edit, delete a studio    | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Studios:** List/search/view studios          | ✔     | ✔     | ✔        | ✔      | ✔       | ✔    |
| **Workspace: Studios:** Connect to a running session       | ✔     | ✔     | ✔        | ✔      | ✔       | ✖   |
| **Workspace: Studios:** Add, edit, delete studio      | ✔     | ✔     | ✔       | ✖     | ✖      | ✖   |
| **Workspace: Studios:** Edit studio resource labels                        | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Studios:** Start, stop studio session                        | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Studios:** Add as new (duplicate studio)                        | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace: Studios: Checkpoints:** Edit studio checkpoint name                        | ✔     | ✔     | ✔        | ✖     | ✖      | ✖   |
| **Workspace:** View (read-only) resources         | ✔     | ✔     | ✔        | ✔     | ✔       | ✔    |

### Role inheritance

If a user is concurrently assigned to a workspace as both a named **participant** and member of a **team**, Seqera assigns the higher of the two privilege sets.

Example:

- If the participant role is Launch and the team role is Admin, the user will have Admin rights.
- If the participant role is Admin and the team role is Launch, the user will have Admin rights.
- If the participant role is Launch and the team role is Launch, the user will have Launch rights.

As a best practice, use teams as the primary vehicle for assigning rights within a workspace and only add named participants when one-off privilege escalations are deemed necessary.

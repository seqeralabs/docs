---
title: "User roles"
description: "Understand the various roles in Seqera Platform."
date created: "2024-06-10"
last updated: "2026-09-25"
tags: [roles]
---

Organization owners can assign role-based access levels to individual **participants** and **teams** in an organization workspace.

:::tip
You can group **members** and **collaborators** into **teams** and apply a role to that team. Members and collaborators inherit the access role of the team.
:::

### Organization user roles

- **Owner**: After an organization is created, the user who created the organization is the default owner of that organization. Additional users can be assigned as organization owners. Owners have full read/write access to modify members, teams, collaborators, and settings within an organization. Organization owners always have full owner access to organization workspaces, regardless of their participant roles at the workspace level.
- **Member**: A member is a user who is internal to the organization. Members have an organization role and can operate in one or more organization workspaces. In each workspace, members have a participant role that defines the permissions granted to them within that workspace.
- **Service account**: A [service account](./create-service-accounts) is a non-human identity for agents and automation. It holds a fixed organization role that cannot be changed, and cannot be made an organization owner. It receives workspace access only through direct participant roles, never through a team.

### Role inheritance

If a user is concurrently assigned to a workspace as both a named **participant** and member of a **team**, Seqera assigns the higher of the two privilege sets.

Example:

- If the participant role is Launch and the team role is Admin, the user will have Admin rights.
- If the participant role is Admin and the team role is Launch, the user will have Admin rights.
- If the participant role is Launch and the team role is Launch, the user will have Launch rights.

As a best practice, use teams as the primary vehicle for assigning rights within a workspace and only add named participants when one-off privilege escalations are necessary.

## Workspace participant roles

The default workspace participant roles are:
- **Owner**: The user who created the workspace is its first owner. Owners have full administrative privileges over a workspace and its resources, including permission to delete the workspace. Regular participants can also be promoted to workspace owners.
- **Admin**: Workspace admins share most of the administrative privileges of workspace owners, but admins cannot delete a workspace.
- **Maintain**: Workspace maintainers can use and manage all workspace resources, but cannot create workspace credentials or compute environments.
- **Launch**: Launch users can use existing workspace resources and launch pipelines, but they cannot modify workspace resources.
- **Connect**: Connect users can connect to running workspace Studios.
- **View**: View users can view workspace resources, but cannot modify or execute them.
- **Project**: Project users work only in the [Projects](../co-scientist/projects.md) view. They can view project resources, upload datasets, launch pipelines, and use Co-Scientist and background agents, but cannot see the rest of the workspace or create and rename projects.

See [Custom roles](./custom-roles.md) for instructions to create roles with custom permissions.

:::note
Workspace participants with any role can leave the workspace, i.e., remove themselves as a workspace participant. However, only workspace owners and admins can add or remove workspace participants other than themselves.
:::

:::note
A service account is assigned a workspace role directly, with **Launch** pre-selected and **Owner** not offered. Whoever assigns the role must already hold every permission it carries, checked once at the moment of assignment. See [Assign a service account to a workspace](./assign-service-accounts).
:::

### Role permissions

The following table shows which operations are available to the default workspace participant roles:

<div className="pinned-header-row">

| Permission                     | Owner | Admin | Maintain | Launch | Connect | Viewer | Project |
|--------------------------------|-------|-------|----------|--------|---------|--------|---------|
| **action:delete**              | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **action:execute**             | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ❌       |
| **action:read**                | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ❌       |
| **action:write**               | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **action_label:write**         | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **agent:delete**               | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **agent:execute**              | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ✅       |
| **agent:read**                 | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ✅       |
| **agent:write**                | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **chat:execute**               | ✅     | ✅     | ✅        | ✅      | ✅       | ❌      | ✅       |
| **compute_environment:delete** | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **compute_environment:read**   | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **compute_environment:write**  | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **container:read**             | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **credentials:delete**         | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **credentials:read**           | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **credentials:write**          | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **credentials_encrypted:read** | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ❌       |
| **data_link:admin**            | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **data_link:delete**           | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **data_link:read**             | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **data_link:write**            | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **data_link_object:delete**    | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **data_link_object:read**      | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **data_link_object:write**     | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **dataset:admin**              | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **dataset:delete**             | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **dataset:read**               | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **dataset:write**              | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ✅       |
| **dataset_label:write**        | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ✅       |
| **label:delete**               | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **label:read**                 | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **label:write**                | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **launch:read**                | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ✅       |
| **lineage:read**               | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **lineage:write**              | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **pipeline:delete**            | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **pipeline:read**              | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **pipeline:write**             | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **pipeline_label:write**       | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **pipeline_secrets:delete**    | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **pipeline_secrets:read**      | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **pipeline_secrets:write**     | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **platform:read**              | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **project_view:read**          | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **studio:admin**               | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **studio:delete**              | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **studio:execute**             | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **studio:read**                | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ❌       |
| **studio:write**               | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **studio_label:write**         | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **studio_session:execute**     | ✅     | ✅     | ✅        | ✅      | ✅       | ❌      | ❌       |
| **studio_session:read**        | ✅     | ✅     | ✅        | ✅      | ✅       | ❌      | ❌       |
| **studio_star:write**          | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ❌       |
| **workflow:delete**            | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ❌       |
| **workflow:execute**           | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ✅       |
| **workflow:read**              | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **workflow:write**             | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ✅       |
| **workflow_label:write**       | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **workflow_quick:execute**     | ✅     | ✅     | ✅        | ❌      | ❌       | ❌      | ❌       |
| **workflow_star:delete**       | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **workflow_star:read**         | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **workflow_star:write**        | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **workspace:admin**            | ✅     | ❌     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **workspace:delete**           | ✅     | ❌     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **workspace:read**             | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ❌       |
| **workspace:write**            | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **workspace_lineage:read**     | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ✅       |
| **workspace_lineage:write**    | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |
| **workspace_resources:read**   | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ❌       |
| **workspace_self:delete**      | ✅     | ✅     | ✅        | ✅      | ✅       | ✅      | ✅       |
| **workspace_studio:read**      | ✅     | ✅     | ✅        | ✅      | ❌       | ❌      | ❌       |
| **workspace_studio:write**     | ✅     | ✅     | ❌        | ❌      | ❌       | ❌      | ❌       |

</div>

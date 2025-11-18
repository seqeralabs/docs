---
title: "User roles"
description: "Understand the various roles in Seqera Platform."
date created: "2024-06-10"
last updated: "2025-07-03"
tags: [roles, user-roles]
---

Organization owners can assign role-based access levels to individual **participants** and **teams** in an organization workspace.

:::tip
You can group **members** and **collaborators** into **teams** and apply a role to that team. Members and collaborators inherit the access role of the team.
:::

### Organization user roles

- **Owner**: After an organization is created, the user who created the organization is the default owner of that organization. Additional users can be assigned as organization owners. Owners have full read/write access to modify members, teams, collaborators, and settings within an organization.
- **Member**: A member is a user who is internal to the organization. Members have an organization role and can operate in one or more organization workspaces. In each workspace, members have a participant role that defines the permissions granted to them within that workspace.

### Role inheritance

If a user is concurrently assigned to a workspace as both a named **participant** and member of a **team**, Seqera assigns the higher of the two privilege sets.

Example:

- If the participant role is Launch and the team role is Admin, the user will have Admin rights.
- If the participant role is Admin and the team role is Launch, the user will have Admin rights.
- If the participant role is Launch and the team role is Launch, the user will have Launch rights.

As a best practice, use teams as the primary vehicle for assigning rights within a workspace and only add named participants when one-off privilege escalations are necessary.

## Workspace participant roles

:::note
Workspace participants with any role can leave the workspace, i.e., remove themselves as a workspace participant. However, only workspace owners and admins can add or remove workspace participants other than themselves.
:::

### Role permissions

The following table shows which operations are available to the default workspace participant roles:

| Operation | Owner | Admin | Maintainer | Launcher | Connect | Viewer |
|-----------|-------|-------|------------|----------|---------|--------|
| `action:read` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `action:execute` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `action:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `action:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `action_label:write` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `compute_environment:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `compute_environment:write` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `compute_environment:delete` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `container:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `credentials:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `credentials:write` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `credentials:delete` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `credentials_encrypted:read` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `credits:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `data_link:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `data_link:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `data_link:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `data_link:admin` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `dataset:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `dataset:write` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `dataset:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `dataset:admin` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `dataset_label:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `dataset_legacy:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `dataset_legacy:write` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `dataset_legacy:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `essential:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `eval_workspace:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `ga4gh:execute` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `label:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `label:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `label:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `launch:read` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `pipeline:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `pipeline:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `pipeline:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `pipeline_label:write` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `pipeline_secrets:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `pipeline_secrets:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `pipeline_secrets:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `platform:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `studio:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `studio:execute` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `studio:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `studio:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `studio:admin` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `studio_label:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `studio_session:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `studio_session:execute` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `workflow:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `workflow:execute` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `workflow:write` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `workflow:delete` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `workflow_label:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `workflow_quick:execute` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `workflow_star:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `workflow_star:write` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `workflow_star:delete` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `workspace:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `workspace:write` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `workspace:delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `workspace:admin` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `workspace_self:delete` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `workspace_studio:read` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `workspace_studio:write` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `workspace_workflow_report:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
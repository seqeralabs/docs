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

- **Owner**: The participant has full permissions for all resources within the workspace, including the workspace settings.
- **Admin**: The participant has full permissions for resources associated with the workspace and access to all the actions associated with all roles, including all data-related roles. They can create, modify, and delete pipelines, compute environments, actions, credentials, and secrets. They can also add/remove users in the workspace and edit the workspace settings. A participant with this role cannot delete a workspace.
- **Maintain**: The participant can launch pipelines and modify pipeline executions (e.g., change the pipeline launch compute environment, parameters, pre/post-run scripts, Nextflow config), create new pipelines in the Launchpad, and add, edit, and delete workspace secrets. Workspace maintainers can also resume runs, delete runs, mark runs as favorites, and save runs as new Launchpad pipelines. They can upload, download, and preview data in Data Explorer, hide/unhide buckets, manage buckets, and manage the metadata associated with buckets. They can also add, update, and delete a data studio session. This includes starting, stopping, and changing the configuration. A participant with this role cannot modify compute environment settings and credentials, but can manage workspace labels and resource labels.
- **Launch**: The participant can launch pre-saved pipelines and modify the pipeline input/output parameters during launch. Launch users can resume runs, delete runs, and mark runs as favorites. They cannot modify the pipeline configuration or other resources, such as secrets or resource labels. They can list, search and view the status, configuration, and details of data studio sessions and connect to a running data studio session.
- **Connect**: The participant can list, search, and view the status, configuration, and details of data studios sessions. They cannot add, update (start/stop/change config) or delete data studios sessions. They can also connect to a running data studio session and interact with the contents, and access team resources in read-only mode. They cannot launch or maintain pipelines. A participant with this role also cannot manage any data in Data Explorer — uploading, downloading, or previewing data, hiding/unhiding, managing buckets, or managing the metadata associated with buckets.
- **View**: The participant can only access team resources in read-only mode. This includes the ability to list, search, and view the status, configuration, and details of mounted data in Data Explorer and data studio sessions.

### Role inheritance

If a user is concurrently assigned to a workspace as both a named **participant** and member of a **team**, Seqera assigns the higher of the two privilege sets.

Example:

- If the participant role is Launch and the team role is Admin, the user will have Admin rights.
- If the participant role is Admin and the team role is Launch, the user will have Admin rights.
- If the participant role is Launch and the team role is Launch, the user will have Launch rights.

As a best practice, use teams as the primary vehicle for assigning rights within a workspace and only add named participants when one-off privilege escalations are deemed necessary.
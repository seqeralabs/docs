---
title: "User and organization administration"
description: "Overview of Seqera user and organization administration"
date: "21 Apr 2023"
tags: [administration, user, workspace, organization]
---

As a root user, you can access a comprehensive overview of the organizations, workspaces, users, and teams in your Seqera account from the **Admin panel**. It also includes tabs for application event [audit logs](../monitoring/audit-logs), administrative statistics, and system configuration options.

The **Admin panel** menu is accessible in the user menu if you're logged in as a root user. This role should only be assigned to a system administrator as it provides high-level visibility and configuration access to your account.

:::tip
See [Basic configuration](../enterprise/configuration/overview#basic-configuration) to learn how to add root users to your account with the `TOWER_ROOT_USERS` environment variable.
:::

## Organization administration

The **Organization administration** tab lists all the organizations in your account.

#### Search organizations

You can use the search function to find a specific organization by its name or email, as well as perform various operations with that organization.

#### Create an organization

Select **Add organization** to create a new organization from scratch.

#### Edit an organization

Select an organization name from the table to edit or delete it.

:::note
From version 23.2, organization owners and root users can edit organization names on the **Edit organization** page.
:::

#### Membership administration

**Available from version 22.3.x**

Select **Manage users** to access the **Membership administration** page, where you can view all the memberships for the selected organization from the organizations list. You can also list and search for all users that are members or owners of the selected organization, change a user's role, remove a member from the organization, or add a new user to the organization.

**Note:** You can only add existing users to an organization. You can't remove a membership if the user being removed is the last owner of the selected organization until you promote another user to **Owner** before removing or demoting the last owner.

## Workspace administration

The **Workspaces** tab lists all the workspaces in your account. If a user is concurrently assigned to a workspace as both a named _participant_ and member of a _team_, Seqera assigns the higher of the two privilege sets.

Example:

- If the participant role is Launch and the team role is Admin, the user will have Admin rights.
- If the participant role is Admin and the team role is Launch, the user will have Admin rights.
- If the participant role is Launch and the team role is Launch, the user will have Launch rights.

As a best practice, use teams as the primary vehicle for assigning rights within a workspace and only add named participants when one-off privilege escalations are deemed necessary.

#### Search workspaces

You can use the search function to find a specific workspace by name to view and edit that workspace.

#### Create a workspace

Select **Add workspace** to create a new workspace. Choose a workspace name that isn't already in use - if the new workspace name already exists in the system, the creation will fail. Once the new workspace has been created, it's listed in the **Workspaces** tab list.

#### Edit a workspace

Select a workspace name to edit or delete it.

#### Membership administration

**Available from version 22.3.x**

Select **Edit organizations** to access the **Membership administration** page where you have an overview of all the memberships for the selected user. You can also list and search for all the organizations a user belongs to (as a member or as an owner), change a user's role, remove a user from an organization, or add a user to a new organization.

**Note:** You can only add users to an existing organization, and you can't remove the last owner of an organization until you promote another user to **Owner** before removing or demoting the last owner.

## User administration

The **Users** tab lists all the users in your account.

#### Search users

You can use the search function to find a specific user by name or email to view or edit that user.

#### Create a user

Select **Add user** to create a new user. If the new user email already exists in the system, the user creation will fail. Once you've created the new user, inform them that access has been granted.

#### Edit a user

Select a username from the table to edit or delete the user.

#### Membership administration

**Available from version 22.3.x**

Select **Edit organizations** to get to the membership administration page. From here, you can list and search for all the organizations the user belongs to (as a member or as an owner), change a user's role, remove a user from an organization, or add a user to a new organization. From the user list, you have an overview of all the memberships for the selected user.

**Note:** You can only add users to an existing organization, and you can't remove the last owner of an organization until you promote another user to **Owner** before removing or demoting the last owner.

## Team administration

**Available from version 23.1.X**

The **Team administration** tab lists all the teams in your account.

#### Search teams

You can use the search function to find a specific team, by name or description, and perform various operations.

#### Create a team

Select **Add team** to create a new team from scratch.

#### Edit a team

Select **Edit** next to your team of choice to you can edit the team's details or delete it.

#### Membership administration

From the teams list, you have an overview of the number of members and the unique ID of each team. Select **Edit** to view a team's page, or select the number next to **Members:** to go to the **Members** tab of the team page. From the **Members of team** tab, you can list and search for all users that are members of the selected team, change a user's role, remove a member from the team, or add a new member to the team.

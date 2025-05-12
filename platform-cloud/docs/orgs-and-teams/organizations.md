---
title: "Organizations"
description: "Manage organizations in Seqera Platform."
date: "21 Apr 2023"
tags: [organizations, administration]
---

Organizations are the top-level structure and contain workspaces, members, and teams. You can create multiple organizations, each of which can contain multiple workspaces with shared users and resources. This means you can customize and organize the use of resources while maintaining an access control layer for users associated with a workspace.

Organization owners can add or remove members from an organization or workspace, and can allocate specific access roles within workspaces. Teams provide a way to group users and participants together, such as `workflow-developers` or `analysts`, and apply access control for all users within that team.

You can also add external collaborators to an organization.

### Create an organization

1. From the user menu, select [Your organizations](https://cloud.seqera.io/orgs), then **Add Organization**.
2. Enter a **Name** and **Full name** for your organization.
3. Enter any other optional fields as needed: **Description**, **Location**, **Website URL**, and **Logo**.
4. Select **Add**.

### Organization settings 

Owners can view and manage organizations from the **Settings** tab. The card at the top of the page displays organization metadata (Name and Full name, Website URL, Location, and Description).

#### Credits 

[Seqera Compute](../compute-envs/seqera-compute) environments consume credits when running pipelines or Studio sessions. Credits are consumed for CPU time, memory and storage usage, and network costs. One Seqera Compute credit is equivalent to $1 (USD), and resources are charged at the following rates:
- CPU time: 1 CPU/Hr = 0.1 credits
- Memory: 1 GiB/Hr = 0.025 credits 
- Storage: 1 GB = 0.25 credits per month 

:::note 
Storage and network costs vary per region, charged at standard AWS rates. Data ingress and egress across regions incur additional costs. 
:::

Your available credit balance depends on the credits purchased and limits applied to your Seqera license. The **Credits** view contains the current credit balance available to the organization, and the total credits spent in the organization's workspaces. Select **Contact us to upgrade** to request additional credits for your organization. 

#### Rename or delete organization 

:::note
Organization **owners** can rename the organization from the organization **Settings** tab.
:::

As an **organization owner**, access the organization page from the organizations and workspaces dropdown, or open the user menu and select **Your organizations** to view and edit your organizations.

Select **Edit** in the **Edit organization** row to update the organization name, full name, description, location, website URL, and logo. Update the settings and select **Update** to save.

### Organization resource usage tracking 

Select **Usage overview** next to the organization and workspace selector dropdown to view a window with the following usage details:

- **Run history**: The total number of pipeline runs. 
- **Concurrent runs**: Total simultaneous pipeline runs.
- **Running Studio sessions**: Number of concurrent running Studio sessions.
- **Users**: Total users per organization. 

Organization resource usage information is also displayed on the organization's **Settings** tab, under **Usage**. 

Select **Contact us to upgrade** if you need to increase your Platform usage limits for your organization. 

:::info
Usage limits differ per organization and [subscription type](https://seqera.io/pricing/). [Contact us](https://seqera.io/contact-us/) to discuss your needs. 
:::

## Members

You can view the list of all organization **Members** from the organization's page. Once an organization is created, the user who created the organization is the default owner of that organization. You can invite or add additional members to the workspace from the workspace page or the [Admin panel](../administration/overview).

Seqera provides access control for members of an organization by classifying them either as an **Owner** or a **Member**. Each organization can have multiple owners and members.

### Add a member

To add a new member to an organization:

1. Go to the **Members** tab of the organization menu.
2. Select **Add member**.
3. Enter the name or email address of the user you'd like to add to the organization.

An email invitation will be sent to the user. Once they accept the invitation, they can switch to the organization (or organization workspace) from the workspace dropdown.

:::note
For information about what happens when a user deletes their account, see [user deletion](../data-privacy/overview#user-deletion).
:::

## Teams

**Teams** allow organization **owners** to group members and collaborators together into a single unit and to manage them as a whole.

### Create a new team

To create a new team within an organization:

1. Go to the **Teams** tab of the organization menu.
2. Select **Add Team**.
3. Enter the **Name** of team.
4. Optionally, add the **Description** and the team's **Avatar**.
5. Select **Add**.

To start adding members to your team, select **Edit > Members of team > Add member** and enter the name or email address of the organization members or collaborators.

## Collaborators

**Collaborators** are users who are invited to an organization's workspace, but are not members of that organization. As a result, their access is limited to that organization workspace. You can view the list of all organization **Collaborators** from the organization's page.

New collaborators to an organization's workspace can be added as **Participants** from the workspace page. See [User roles](./roles) to learn more about participant access levels.

:::note
**Collaborators** can only be added from a workspace. For more information, see [workspace management](./workspace-management#create-a-new-workspace).
:::

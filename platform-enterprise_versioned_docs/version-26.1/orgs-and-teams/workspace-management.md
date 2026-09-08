---
title: "Workspaces"
description: "Manage users and teams for an organization in Seqera Platform."
date created: "2023-04-24"
last updated: "2026-03-02"
tags: [workspaces, teams, users, administration]
---

Each user has a unique **user workspace** to manage resources such as pipelines, compute environments, and credentials. You can also create multiple workspaces within an organization context and associate each of these workspaces with dedicated teams of users, while providing fine-grained access control for each of the teams.

**Organization workspaces** extend the functionality of user workspaces by adding the ability to fine-tune access levels for specific members, collaborators, or teams. This is achieved by managing **participants** in the organization workspaces.

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
As a workspace owner, you can modify optional workspace fields after workspace creation. You can either select **Edit** on an organization's workspaces list or the **Settings** tab within the workspace page.
:::

Apart from the **Participants** tab, the _organization_ workspace is similar to the _user_ workspace. As such, the relation to [runs](../launch/launchpad), [actions](../pipeline-actions/overview), [compute environments](../compute-envs/overview), and [credentials](../credentials/overview) is the same.

## Workspace settings

### Studios

- **Collaboration mode**: Limit which members can connect to a running Studio in the workspace. Toggle between **Collaborative**  (any member with the right permissions can connect) and **Private** (only the creator can connect). Default is **Collaborative** mode.
- **Session lifespan**: Set a predefined lifespan (between 1 and 120 hours), after which all Studio sessions in the workspace are automatically stopped. To keep all workspace Studios running indefinitely, select **Always keep the session running**. Default is a session lifespan of **8 hours**.
- **Container repository**: Define the target container repository where custom Studio images built with Wave will be pushed. The workspace must have a credential with read and write permissions to the target container registry. There is no default and custom builds will fail for self-hosted deployments.
- **Container naming strategy**: Define your container registry naming strategy. Default for Seqera Cloud is **tagPrefix**.
  - **tagPrefix**: Differentiate application versions within the same repository (e.g., `registry/image:prefix-version`). This strategy is recommended for organizing specific image types (`dev`, `staging`, `prod`) and typically results in fewer repositories with more tags.
  - **imageSuffix**: Group different build types across repositories (e.g., `registry/image-suffix:version`). This strategy is recommended for managing permissions or different build environments (`front-end` vs. `back-end`, or `API` vs. `GUI`) and typically results in higher repository counts (i.e., one repository per environment/variant).

:::note
Studios sessions created in shared workspaces are not shared across all the workspaces in an organization.
:::

### Labels

Select **Manage** to open the workspace [labels and resource labels](../labels/overview).

### Lineage

:::note
Data lineage is in public preview and not enabled by default. See [Configuration options](../enterprise/configuration/overview#data-features).
:::

Configure where Nextflow lineage data are stored and whether lineage tracking is on by default for every run launched in the workspace.

Select **Manage** and then choose to enable lineage by default for all pipeline runs in the workspace. Configure the lineage settings manually or automatically.

| Field | Required | Description |
|-------|----------|-------------|
| **Credentials** | Yes | The workspace credentials Platform uses to create and access the lineage storage bucket. The credentials must include permission to create buckets in the chosen region (or to access an existing bucket if **Bucket name** is specified), activate object notifications on the bucket, and manage the SQS queue. |
| **Region** | Yes | Cloud region where the lineage storage bucket is created (for example, `us-east-1`, `eu-west-1`). |
| **Bucket name** | No | Bucket where lineage records are stored. If left empty, Platform generates a default bucket name in the form `seqera-lineage-<workspace-id>`. |

If configuring **manually**, two additional settings can be defined:

| Field | Required | Description |
|-------|----------|-------------|
| **SQS Queue name** | No | The Amazon Simple Queue Service (SQS) name. If left empty, Platform generates a default queue name in the form `<bucket-name>-notifications`. |
| **SQS Queue ARN** | No | The ARN of the SQS queue. This is useful if your Platform deployment requires cross-account access. |

### Edit or delete a workspace

:::note
From version 23.2, **workspace owners** can edit their workspace name, either from the workspace settings tab or the [Admin panel](../administration/overview).
:::

Select **Edit workspace** to update the workspace name, full name, description, and sharing. Select **Update** to save changes.

Select **Delete workspace** to delete the workspace and its associated resources. This action cannot be reversed.

## Add a new participant

A new workspace participant can be an existing organization member, a team, or a collaborator. To add a new participant to a workspace:

1. Go to the **Participants** tab in the workspace menu.
2. Select **Add participant**.
3. Enter one of the following:
   - The name of an existing organization **member** or **team**, selected from the suggestions.
   - The username or email address of a Seqera user, to add them to this workspace as a **collaborator**.
4. Optionally, update the participant **role**. New participants are added with the **Launch** role by default.

### What happens when you add a participant by username or email

Adding a participant this way can create two records: an **organization membership** and a **workspace participant**. Which of these are created determines which usage limit applies, and whether the person is notified by email.

| Their existing status | Organization membership | Email notification |
| --------------------- | ----------------------- | ------------------ |
| Already a member of this organization | Reused. Their organization role is unchanged | No |
| Already a collaborator elsewhere in this organization | Reused. They remain a collaborator | Yes |
| Has a Seqera account, but is not in this organization | Created, with the **Collaborator** role | Yes |
| Has no Seqera account | Created, if [account creation on add](#allow-accounts-to-be-created-on-the-fly) is enabled | Yes |

:::note
Having a Seqera account is not the same as being a member of your organization. Someone with an existing account who is not yet in your organization still consumes an organization member seat when you add them to a workspace.
:::

Two [usage limits](../limits/overview) apply independently:

- The **members per organization** limit is checked only when a new organization membership is created. Collaborators count toward this limit.
- The **participants per workspace** limit is checked every time, including when you add someone who is already a member of your organization.

Adding an existing organization member to a second workspace therefore consumes a participant slot but no member seat, while adding someone from outside the organization consumes both.

### Allow accounts to be created on the fly

By default, you can only add people who already have a Seqera account. To allow an account to be created when a participant is added by email address, set `TOWER_PARTICIPANT_AUTO_CREATE_USER=true`. See [Opt-in Seqera features](../enterprise/configuration/overview#core-features).

With this enabled, entering an email address that has no matching account creates the account, adds it to the organization as a collaborator, and adds it to the workspace.

Accounts are never created from a username. A username for someone without an account always fails, even when account creation on add is enabled — use their email address instead.

:::caution
Accounts created this way are marked as trusted regardless of your [trusted email](../enterprise/configuration/authentication/email#restrict-access) configuration. Anyone who can add workspace participants can therefore create a trusted account for an address that would otherwise be unable to sign in.
:::

:::note
The equivalent setting for organization members and team members, `TOWER_MEMBER_AUTO_CREATE_USER`, is enabled by default. The participant setting is disabled by default.
:::

### Participants that can't be added

| Message | Cause |
| ------- | ----- |
| `Can't find any user record with the given email` | No Seqera account matches that email address, and [account creation on add](#allow-accounts-to-be-created-on-the-fly) is disabled. |
| `Can't find any user record with the given name` | A username was entered for someone without a Seqera account. Usernames only resolve to existing accounts — use their email address instead. |
| `Cannot add external collaborators to workspaces in an organization with active SSO. Invite the user as an organization member instead.` | The organization uses SSO. See [Collaborators and SSO](./organizations#collaborators-and-sso). |
| `Already a participant` | That user or team is already a participant in this workspace. |

## Workspace run monitoring

To allow users executing pipelines from the command line to share their runs with a given workspace, see [deployment options](../getting-started/deployment-options#nextflow--with-tower).

Seqera Platform introduces the concept of shared workspaces as a solution for synchronization and resource sharing within an organization. A shared workspace enables the creation of pipelines in a centralized location, making them accessible to all members of an organization.

The benefits of using a shared workspace within an organization include:

- **Define once and share everywhere**: Set up shared resources once and automatically share them across the organization.
- **Centralize the management of key resources**: Organization administrators can ensure the correct pipeline configuration is used in all areas of an organization without the need to replicate pipelines across multiple workspaces.
- **Immediate update adoption**: Updated parameters for a shared pipeline become immediately available across the entire organization, reducing the risk of pipeline discrepancies.
- **Computational resource provision**: Pipelines in shared workflows can be shared along with the required computational resources. This eliminates the need to duplicate resource setup in individual workspaces across the organization. Shared workspaces centralize and simplify resource sharing within an organization.

### Create a shared workspace

Creating a shared workspace is similar to the creation of a private workspace, with the exception of the **Visibility** option, which must be set to **Shared**.

### Create a shared pipeline

When you create a pipeline in a shared workspace, associating it with a [compute environment](../compute-envs/overview) is optional.

If a compute environment from the shared workspace is associated with the pipeline, it will be available to users in other organization workspaces to launch the shared pipeline with the associated compute environment by default.

### Use shared pipelines from a private workspace

Once a pipeline is set up in a shared workspace and associated with a compute environment in that workspace, any user can launch the pipeline from an organization workspace using the shared workspace's compute environment. This eliminates the need for users to replicate shared compute environments in their private workspaces.

:::note
The shared compute environment will not be available to launch other pipelines limited to that specific private workspace.
:::

If a pipeline from a shared workspace is shared **without** an associated compute environment, users can run it from other organization workspaces. By default, the **primary** compute environment of the launching workspace will be selected.

### Make shared pipelines visible in a private workspace

:::note
Pipelines from _all_ shared workspaces are visible when the visibility is set to **Shared workspaces**.
:::

To view pipelines from shared workspaces, go to the [Launchpad](../launch/launchpad) and set the **Filter > Pipelines from** option to **This and shared workspaces**.

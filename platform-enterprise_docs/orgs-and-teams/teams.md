---
title: "Teams"
description: "Create and manage teams in a Seqera Platform Enterprise organization, including IdP-delegated teams."
date: "2026-05-12"
tags: [teams, organizations, administration, sso, idp-delegation, enterprise]
---

**Teams** allow organization owners to group members and collaborators together into a single unit and to manage them as a whole. Apply a workspace role to a team and every member inherits that access. See [User roles](./roles) for the available roles.

:::note
If your organization has [single sign-on (SSO)](../enterprise/configuration/authentication/overview) and IdP group claims mapping enabled, the team form includes an **IdP Group** field. Leave it empty to manage team membership manually, or select an IdP group to delegate membership to your identity provider. See [Delegate a team to an IdP group](#delegate-a-team-to-an-idp-group).
:::

## Create a team

To create a new team:

1. Go to the **Teams** tab in the sidebar of the organization landing page.
2. Select **Add Team**.
3. Enter the **Name** of the team.
4. Optionally, add the **Description** and the team's **Avatar**.
5. Select **Add**.

To add members to the team, select **Edit**, then **Members of team**, then **Add member**. Enter the name or email address of an organization member or collaborator.

## Edit a team

1. Open the **Teams** tab and select the team you want to edit.
2. Select **Edit**.
3. Update the **Name**, **Description**, **Avatar**, or membership.
4. Select **Update** to save.

The same surface is used to delete a team. The **Delete** action is disabled for delegated teams. Clear the **IdP Group** field first.

## Delegate a team to an IdP group

Organizations with an active OIDC SSO connection can delegate team membership to an identity provider (IdP) group. Once a team is delegated, the IdP becomes the sole authority for who belongs. Platform evaluates each user's IdP claims at every login and adjusts membership automatically.

For the runtime model behind delegation, see [IdP delegation overview](../enterprise/configuration/authentication/idp-delegation/overview).

### Before you begin

- An active OIDC SSO connection on your organization. See [Authentication](../enterprise/configuration/authentication/overview).
- A populated IdP group catalog. See [Manage your IdP group catalog](../enterprise/configuration/authentication/idp-delegation/group-catalog/overview).
- An IdP that emits the `groups` claim in OIDC tokens. See [IdP claim mapping](../enterprise/configuration/authentication/idp-delegation/claim-mapping).
- Organization owner access to your Seqera organization.

### Delegate the Team

1. From the organization's landing page, open the **Teams** tab.
2. Select the team you want to delegate, then **Edit**.
3. In the **IdP Group** field, select a group from the dropdown. The dropdown is populated from your organization's IdP group catalog.
4. Select **Update** to save.

The same IdP group can be assigned to more than one team. Each team can reference exactly one IdP group.

### What changes when a Team is delegated

After you delegate a team:

- Membership becomes immutable in the Platform UI. The **Add member** and **Remove member** controls are hidden.
- The team cannot be deleted. To delete a delegated team, clear the **IdP Group** field first.
- The team's name, description, avatar, and **IdP Group** value remain editable.
- Existing manual workspace and role assignments on the team are preserved.
- The team is marked **Managed in IdP** in the teams list.

### What happens at login

On every SSO login, Seqera evaluates each delegated team against the user's `groups` claim and updates membership accordingly:

- **Match found**: the user is added to the team if they aren't already a member.
- **No match**: and the user was previously a member - they're removed from the team.
- **No match**: and the user was never a delegation-driven member - no change.

Users added manually to a team with no **IdP Group** value keep their membership regardless of their IdP claims.

If the user's token has no `groups` claim, or the claim is malformed, Seqera treats it as no group memberships and revokes any delegation-driven team memberships the user previously had. To diagnose claim issues, see [IdP claim mapping](../enterprise/configuration/authentication/idp-delegation/claim-mapping).

### Stop delegating a team

To convert a delegated team back to manual management:

1. Open the team's **Edit** page.
2. Clear the **IdP Group** field.
3. Select **Update** to save.

Existing members are kept. The **Add member** and **Remove member** controls become available again, and the team can be deleted as normal.

## Workspace and role assignment

Delegation controls who belongs to the team. It doesn't assign the team to workspaces or grant roles. After delegation:

- Assign the team to a workspace using the workspace **Participants** page.
- Set the team's workspace role separately. See [User roles](./roles).

This separation is intentional: the IdP owns membership, but the organization owns access policy.

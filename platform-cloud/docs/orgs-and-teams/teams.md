---
title: "Teams"
description: "Create and manage teams in a Seqera Platform Cloud organization, including IdP-delegated teams."
date: "2026-06-29"
tags: [teams, organizations, administration, sso, idp delegation, cloud pro]
---

**Teams** allow organization owners to group members and collaborators together into a single unit and to manage them as a whole. Apply a workspace role to a team and every member inherits that access. See [User roles](./roles) for the available roles.

:::note
If your organization has [single sign-on (SSO)](../sso/single-sign-on) with IdP delegation enabled, you can delegate a team to an **IdP group** so your identity provider controls its membership. See [Delegate a team to an IdP group](#delegate-a-team-to-an-idp-group).
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

Organizations with an active SSO connection can delegate team membership to an identity provider (IdP) group. Once a team is delegated, the IdP becomes the sole authority for who belongs. Seqera evaluates each user's IdP claims at every login and adjusts membership automatically.

For the model behind delegation, see [IdP delegation overview](../sso/idp-delegation/overview).

:::info[**Prerequisites**]{#prerequisites}
You need the following:

- An active SSO connection on your organization. See [Single sign-on (SSO)](../sso/single-sign-on).
- A populated IdP group catalog. See [Manage your IdP group catalog](../sso/idp-delegation/group-catalog/overview).
- An IdP that emits the `groups` claim. See [IdP claim mapping](../sso/idp-delegation/claim-mapping).
- Organization owner access to your Seqera organization.
:::

### Delegate the team

1. Open your organization, then select **Settings**.
2. Open the **Teams** tab and select the team you want to delegate, or create a new team.
3. Set the **IdP Group** field to a group from the catalog.
4. Select **Update** to save.

The same IdP group can only be assigned to a single team, and each team can reference exactly one IdP group.

### What changes when a team is delegated

After you delegate a team:

- Membership becomes immutable in the Platform UI. The **Add member** and **Remove member** controls are hidden.
- The team can't be deleted. To delete a delegated team, clear the **IdP Group** field first.
- The team's name, description, avatar, and **IdP Group** value remain editable.
- Existing manual workspace and role assignments on the team are preserved.
- The team is labeled **Managed in IdP** in the teams list.

### What happens at login

Cloud Pro tokens carry an `org_id` claim that scopes evaluation to a single organization. On every SSO login, Seqera evaluates each delegated team against the user's `groups` claim and updates membership accordingly:

- **Match found**: The user is added to the team if they aren't already a member.
- **No match and the user was previously a delegation-driven member**: The user is removed from the team.
- **No match and the user was never a delegation-driven member**: No change.

Users added manually to a team with no **IdP Group** value keep their membership regardless of their IdP claims. If the user's token has no `groups` claim or the claim is malformed, no changes take place.

### Stop delegating a team

To convert a delegated team back to manual management:

1. Open the team and clear the **IdP Group** field.
2. Select **Update** to save.

Existing members are kept. The **Add member** and **Remove member** controls become available again, and the team can be deleted as normal.

## Workspace and role assignment

Delegation controls who belongs to the team. It doesn't assign the team to workspaces or grant roles. After delegation:

- Assign the team to a workspace using the workspace **Participants** page.
- Set the team's workspace role separately. See [User roles](./roles).

This separation is intentional. The IdP owns membership, but the organization owns access policy.

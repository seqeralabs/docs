---
title: "Teams"
description: "Create and manage teams in a Seqera Platform Cloud organization, including IdP-delegated teams."
date: "2026-06-29"
last updated: "2026-07-09"
tags: [teams, organizations, administration, sso, idp delegation, cloud pro]
---

Use **teams** to group organization members and collaborators and manage them together. Apply a workspace role to a team, and every member inherits that access. See [User roles](./roles) for the available roles.

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

Organizations with an active SSO connection can delegate team membership to an identity provider (IdP) group. After you delegate a team, the IdP becomes the sole authority for who belongs. Seqera evaluates each user's IdP claims at every login and adjusts membership to match.

For how delegation works, see [IdP delegation overview](../sso/idp-delegation/overview).

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

:::caution
After you delegate the team, your IdP is the sole authority for its membership. Members removed from the IdP group — or whose token stops carrying the `groups` claim — lose their delegated team memberships at their next login. See [What happens at login](#what-happens-at-login).
:::

### What changes when a team is delegated

After you delegate a team:

- Membership becomes immutable in the Platform UI. The **Add member** and **Remove member** controls are hidden.
- The member list displays a banner indicating that your identity provider manages the team's membership.
- The team can't be deleted. To delete a delegated team, clear the **IdP Group** field first.
- The team's name, description, avatar, and **IdP Group** value remain editable.
- Existing manual workspace and role assignments on the team are preserved.
- The team is labeled **Managed in IdP** in the teams list.

### What happens at login

Cloud Pro tokens carry an `org_id` claim that scopes evaluation to a single organization. On every SSO login, Seqera evaluates each delegated team against the user's `groups` claim and updates membership accordingly:

- **Match found**: The user is added to the team if they aren't already a member.
- **No match and the user was previously a delegation-driven member**: The user is removed from the team.
- **No match and the user was never a delegation-driven member**: No change.
- **Claim absent or empty**: All of the user's delegated team memberships in the organization are revoked. Major IdPs, including Okta and Entra ID, omit the `groups` claim entirely when a user belongs to no groups. An absent claim is treated the same as an empty one.
- **Claim malformed** (not a list, or containing non-string values): No membership changes are applied. Existing memberships are preserved as a safeguard against IdP or claim-mapping errors.

Users added manually to a team with no **IdP Group** value keep their membership regardless of their IdP claims.

### Stop delegating a team

To convert a delegated team back to manual management:

1. Open the team and clear the **IdP Group** field.
2. Select **Update** to save.

Existing members are kept. The **Add member** and **Remove member** controls become available again, and the team can be deleted as normal.

## Workspace and role assignment

Delegation controls who belongs to the team. It doesn't assign the team to workspaces or grant roles. Your IdP owns team membership, and your organization owns workspace and role assignment. After delegation:

- Assign the team to a workspace using the workspace **Participants** page.
- Set the team's workspace role separately. See [User roles](./roles).

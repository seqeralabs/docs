---
title: "Teams"
description: "Create and manage Teams in a Seqera Platform Enterprise organization, including IdP-delegated Teams."
date: "2026-05-12"
tags: [teams, organizations, administration, sso, idp-delegation, enterprise]
---

**Teams** allow organization owners to group members and collaborators together into a single unit and to manage them as a whole. Apply a workspace role to a Team and every member inherits that access. See [User roles](./roles) for the available roles.

:::note
If your organization has [single sign-on (SSO)](../enterprise/configuration/authentication/overview) configured, the Team form includes an **IdP Group** field. Leave it empty to manage Team membership manually, or select an IdP group to delegate membership to your identity provider. See [Delegate a Team to an IdP group](#delegate-a-team-to-an-idp-group).
:::

## Create a Team

To create a new Team:

1. Go to the **Teams** tab in the sidebar of the organization landing page.
2. Select **Add Team**.
3. Enter the **Name** of the Team.
4. Optionally, add the **Description** and the Team's **Avatar**.
5. Select **Add**.

To add members to the Team, select **Edit**, then **Members of team**, then **Add member**. Enter the name or email address of an organization member or collaborator.

## Edit a Team

1. Open the **Teams** tab and select the Team you want to edit.
2. Select **Edit**.
3. Update the **Name**, **Description**, **Avatar**, or membership.
4. Select **Update** to save.

The same surface is used to delete a Team. The **Delete** action is disabled for delegated Teams; clear the **IdP Group** field first.

## Delegate a Team to an IdP group

Organizations with an active SSO connection can delegate Team membership to an identity provider (IdP) group. Once a Team is delegated, the IdP becomes the sole authority for who belongs — Seqera evaluates each user's IdP claims at every SSO login and adjusts membership automatically.

For the runtime model behind delegation, see [IdP delegation overview](../enterprise/configuration/authentication/idp-delegation/overview).

### Before you begin

- An active SSO connection on your organization. See [Authentication](../enterprise/configuration/authentication/overview).
- A populated IdP group catalog. See [Manage your IdP group catalog](../enterprise/configuration/authentication/idp-delegation/group-catalog/overview).
- An IdP that emits the `groups` claim in OIDC or SAML tokens. See [IdP claim mapping](../enterprise/configuration/authentication/idp-delegation/claim-mapping).
- Organization owner access to your Seqera organization.

### Delegate the Team

1. From the organization's landing page, open the **Teams** tab.
2. Select the Team you want to delegate, then **Edit**.
3. In the **IdP Group** field, select a group from the dropdown. The dropdown is populated from your organization's IdP group catalog.
4. Select **Update** to save.

The same IdP group can be assigned to more than one Team. Each Team can reference exactly one IdP group.

### What changes when a Team is delegated

After you delegate a Team:

- Membership becomes immutable in the Seqera UI. The **Add member** and **Remove member** controls are hidden.
- The Team cannot be deleted. To delete a delegated Team, clear the **IdP Group** field first.
- The Team's name, description, avatar, and **IdP Group** value remain editable.
- Existing manual workspace and role assignments on the Team are preserved.
- The Team is marked **Managed in IdP** in the Teams list.

### What happens at login

On every SSO login, Seqera evaluates each delegated Team against the user's `groups` claim and updates membership accordingly:

- **Match found** — the user is added to the Team if they aren't already a member.
- **No match** and the user was previously a member — they're removed from the Team.
- **No match** and the user was never a delegation-driven member — no change.

Users added manually to a Team with no **IdP Group** value keep their membership regardless of their IdP claims.

If the user's token has no `groups` claim, or the claim is malformed, Seqera treats it as no group memberships and revokes any delegation-driven Team memberships the user previously had. To diagnose claim issues, see [IdP claim mapping](../enterprise/configuration/authentication/idp-delegation/claim-mapping).

### Stop delegating a Team

To convert a delegated Team back to manual management:

1. Open the Team's **Edit** page.
2. Clear the **IdP Group** field.
3. Select **Update** to save.

Existing members are kept. The **Add member** and **Remove member** controls become available again, and the Team can be deleted as normal.

## Workspace and role assignment

Delegation controls who belongs to the Team. It doesn't assign the Team to workspaces or grant roles. After delegation:

- Assign the Team to a workspace using the workspace **Participants** page.
- Set the Team's workspace role separately. See [User roles](./roles).

This separation is intentional: the IdP owns membership, but the organization owns access policy.

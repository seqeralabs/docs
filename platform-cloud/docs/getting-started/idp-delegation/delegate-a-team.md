---
title: "Delegate a Team to an IdP group"
description: "Map a Seqera Team to an identity provider group so membership is controlled at the IdP."
date created: "2026-05-12"
last updated: "2026-05-12"
tags: [sso, idp-delegation, teams, administration, cloud-pro]
---

When you delegate a Team to an identity provider (IdP) group, the IdP becomes the sole authority for who belongs to that Team. Seqera evaluates each user's IdP claims at every SSO login and adds or removes them from the Team automatically.

For the runtime model behind delegation, see [IdP delegation overview](./overview).

## Before you begin

- An active SSO connection on your organization. See [Single sign-on (SSO)](../single-sign-on).
- A populated IdP group catalog. See [Manage your IdP group catalog](./group-catalog/overview).
- An Auth0 connection mapping that emits the `groups` claim. See [Auth0 connection mapping](./auth0-connection-mapping).
- Organization owner access to your Seqera organization.

:::info
If your organization doesn't have SSO configured, the **IdP Group** field appears on the Team form but is disabled. Cloud Basic organization owners see an upgrade prompt when selecting the field.
:::

## Delegate a Team

1. From the organization's landing page, open the **Teams** tab.
2. Select the Team you want to delegate, then **Edit**.
3. In the **IdP Group** field, select a group from the dropdown. The dropdown is populated from your organization's IdP group catalog.
4. Select **Update** to save.

The same IdP group can be assigned to more than one Team. Each Team can reference exactly one IdP group.

## What changes when a Team is delegated

After you delegate a Team:

- Membership becomes immutable in the Seqera UI. The **Add member** and **Remove member** controls are hidden.
- The Team cannot be deleted. To delete a delegated Team, clear the **IdP Group** field first.
- The Team's name, description, avatar, and **IdP Group** value remain editable.
- Existing manual workspace and role assignments on the Team are preserved.
- The Team is marked **Managed in IdP** in the Teams list.

## What happens at login

On every SSO login, Seqera evaluates each delegated Team against the user's `groups` claim and updates membership accordingly:

- **Match found** — the user is added to the Team if they aren't already a member.
- **No match** and the user was previously a member — they're removed from the Team.
- **No match** and the user was never a delegation-driven member — no change.

Users added manually to a Team with no **IdP Group** value keep their membership regardless of their IdP claims.

If the user's token has no `groups` claim, or the claim is malformed, Seqera treats it as no group memberships and revokes any delegation-driven Team memberships the user previously had. To diagnose claim issues, see [Auth0 connection mapping](./auth0-connection-mapping).

## Stop delegating a Team

To convert a delegated Team back to manual management:

1. Open the Team's **Edit** page.
2. Clear the **IdP Group** field.
3. Select **Update** to save.

Existing members are kept. The **Add member** and **Remove member** controls become available again, and the Team can be deleted as normal.

## Workspace and role assignment

Delegation controls who belongs to the Team. It does **not** assign the Team to workspaces or grant roles. After delegation:

- Assign the Team to a workspace using the workspace **Participants** page.
- Set the Team's workspace role separately. See [User roles](../../orgs-and-teams/roles).

This separation is intentional: the IdP owns membership, but the organization owns access policy.

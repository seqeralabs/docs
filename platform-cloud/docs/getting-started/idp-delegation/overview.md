---
title: "IdP delegation overview"
description: "Map Seqera Teams to identity provider (IdP) groups so membership is controlled at the IdP and evaluated on every SSO login."
date created: "2026-05-12"
last updated: "2026-05-12"
tags: [sso, idp-delegation, teams, administration, cloud-pro]
---

IdP delegation lets you map a Seqera Team to a group in your identity provider (IdP). After you delegate a Team, the IdP becomes the sole authority for membership: every time a user signs in through SSO, Seqera reads the `groups` claim from their token and updates the user's delegated-Team memberships to match.

IdP delegation is available on **Cloud Pro** organizations with an active SSO connection. To set up SSO before configuring delegation, see [Single sign-on (SSO)](../single-sign-on).

:::info
Cloud Basic organizations see an upgrade prompt when an owner attempts to set the **IdP Group** field on a Team. To use IdP delegation, upgrade to Cloud Pro and configure SSO first.
:::

## How it works

Delegation has three components that you configure once per organization.

### 1. The IdP group catalog

Seqera maintains a per-organization catalog of IdP groups. The catalog populates the **IdP Group** dropdown on the Team form, so organization owners can select an IdP group when delegating a Team. Groups appear in the catalog as soon as they're synced or entered — before any user has signed in.

The catalog is populated in one of two ways:

- **SCIM 2.0 push** — your IdP pushes its group directory to Seqera's per-organization SCIM endpoint. Used with Okta and Entra ID.
- **Manual entry** — for IdPs that don't support SCIM group sync (Google Workspace, Keycloak), an organization owner enters group identifiers in the catalog UI.

A manually-entered group is automatically promoted to SCIM-managed if your IdP later pushes the same group. See [Manage your IdP group catalog](./group-catalog/overview).

### 2. The `groups` claim

At login, Seqera reads the user's IdP claims to decide which delegated Teams they belong to. The `groups` claim must be present in the token issued by Auth0, and its values must match the group identifiers in your catalog.

This requires an attribute mapping on the Auth0 SSO connection. See [Auth0 connection mapping](./auth0-connection-mapping).

### 3. The Team's `IdP Group` field

When an organization owner sets the **IdP Group** field on a Team, the Team becomes delegated. This:

- Marks the Team as "Managed in IdP" in the Teams list.
- Hides the **Add member** and **Remove member** controls.
- Blocks Team deletion until the field is cleared.
- Leaves the Team's name, description, avatar, and workspace assignments editable.

The same IdP group can be assigned to more than one Team. Each Team can reference exactly one IdP group. See [Delegate a Team to an IdP group](./delegate-a-team).

## What happens at login

On every SSO login, Seqera evaluates each delegated Team in your organization against the user's `groups` claim:

- **Match found** — the user is added to the Team if they aren't already a member.
- **No match** and the user was previously a member — they're removed from the Team.
- **No match** and the user was never a delegation-driven member — no change.

Manual assignments to non-delegated Teams are never touched by this evaluation. Users added manually to a Team with no **IdP Group** value keep their membership regardless of their IdP claims.

If the user's token has no `groups` claim or the claim is malformed, Seqera treats it as no group memberships and revokes any delegation-driven Team memberships the user previously had.

## Audit trail

Delegation activity is recorded in the audit log:

- Setting, changing, or clearing the **IdP Group** field on a Team produces a `team_updated` event with the previous and new value.
- Each delegation-driven membership change at login produces a `team_member_added` or `team_member_removed` event.
- Group catalog operations (create, rename, delete) produce `scimGroupCreated`, `scimGroupUpdated`, and `scimGroupDeleted` events so you can correlate catalog changes with downstream membership changes.

SCIM-originated entries — operations performed by your IdP's provisioning agent against Seqera's SCIM endpoint — are attributed to a **System** operator rather than to a named administrator, because they authenticate with a SCIM bearer token. To correlate a SCIM event with a specific administrator action in your IdP, match by `displayName` and timestamp against your IdP's provisioning logs.

## Set up delegation

Complete these steps in order. Each step links to a dedicated guide.

1. [Configure SSO](../single-sign-on) for your organization if you haven't already.
2. [Populate the IdP group catalog](./group-catalog/overview) — choose SCIM push or manual entry depending on your IdP.
3. [Map your IdP's `groups` claim through Auth0](./auth0-connection-mapping) so it reaches Seqera at login.
4. [Delegate a Team to an IdP group](./delegate-a-team).

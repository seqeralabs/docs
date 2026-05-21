---
title: "IdP delegation overview"
description: "Map Seqera teams to identity provider (IdP) groups so membership is controlled at the IdP and evaluated on every SSO login."
date: "2026-05-12"
tags: [sso, idp-delegation, teams, administration, enterprise]
---

IdP delegation lets you map a Seqera team to a group in your identity provider (IdP). After you delegate a team, the IdP becomes the sole authority for membership. Every time a user signs in through SSO, Seqera reads the `groups` claim from their token and updates the user's delegated-team memberships to match.

IdP delegation requires a working OIDC SSO connection. To set up SSO before configuring delegation, see [Authentication](../overview).

## How it works

Delegation has three components that you configure once per organization.

### The IdP group catalog

Seqera maintains a per-organization catalog of IdP groups. The catalog populates the **IdP Group** drop-down menu on the group mapping page. Oorganization owners can select an IdP group when delegating a team. Groups appear in the catalog as soon as they're synced or entered, before any user has signed in.

The catalog is populated in one of two ways:

- **SCIM 2.0 push** — your IdP pushes its group directory to Seqera's per-organization SCIM endpoint. Used with Okta and Entra ID.
- **Manual entry** — for IdPs that don't support SCIM group sync (Google Workspace, Keycloak), an organization owner enters group identifiers in the catalog UI.

A manually-entered group is automatically promoted to SCIM-managed if your IdP later pushes the same group. See [Manage your IdP group catalog](./group-catalog/overview).

### The `groups` claim

At login, Seqera reads the user's IdP claims to decide which delegated teams they belong to. The `groups` claim must be present in the token and must contain the same group identifiers as your catalog.

Unlike Cloud Pro, which authenticates through Auth0 and requires a connection-level mapping, Enterprise reads the IdP's tokens directly. Configure the claim at the IdP itself. See [IdP claim mapping](./claim-mapping).

### The Team's `IdP Group` field

When an organization owner sets the **IdP Group** field on a team, the team becomes delegated. Delegation has the following effects:

- The team is labeled **Managed in IdP** in the teams list.
- The **Add member** and **Remove member** controls are hidden.
- The team cannot be deleted until the **IdP Group** field is cleared.
- The team's name, description, avatar, and workspace assignments remain editable.

The same IdP group can only be assigned to a single team. Each team can reference exactly one IdP group. See [Delegate a team to an IdP group](../../../../orgs-and-teams/teams#delegate-a-team-to-an-idp-group).

When a user logs in via SSO, Seqera evaluates their group claims and adds them to any delegated teams that match. The user must already exist in the Platform, but does not need to be a member of the organization that owns the team.

:::info
In deployments with more than one organization, a user does not need to be an existing member of an organization to be added to a delegated team in that organization. When their IdP group claim matches a delegated team, the user is added to both the team and its owning organization automatically.
:::

## What happens at login

On every SSO login, Seqera evaluates each delegated team in your organization against the user's `groups` claim:

- **Match found**: The user is added to the team if they aren't already a member.
- **No match and the user was previously a member**: The user is removed from the team.
- **No match and the user was never a delegation-driven member**: no change.

Manual assignments to non-delegated teams are never touched by this evaluation. Users added manually to a team with no **IdP Group** value keep their membership regardless of their IdP claims.

If the user's token has no `groups` claim or the claim is malformed, Seqera treats it as no group memberships and revokes any delegation-driven team memberships the user previously had.

## Multi-organization deployments

Cloud Pro tokens carry an `org_id` claim that scopes evaluation to a single organization. Enterprise SSO tokens do not, so the platform routes by deployment topology and enforces a cross-organization uniqueness invariant on group display names. See [Multi-organization routing](./multi-org-routing) for the rules and conflict resolution.

## Audit trail

Delegation activity is recorded in the [audit log](../../../../monitoring/audit-logs):

- Setting, changing, or clearing the **IdP Group** field on a team produces a `team_updated` event with the previous and new value of `idpGroup`.
- Each delegation-driven membership change at login produces a `team_member_added` or `team_member_removed` event.
- Group catalog operations produce `idp_group_created`, `idp_group_updated`, and `idp_group_deleted` events so you can correlate catalog changes with downstream membership changes.

SCIM-originated entries (operations performed by your IdP's provisioning agent against Seqera's SCIM endpoint) are attributed to a **System** operator rather than to a named administrator, because they authenticate with a SCIM bearer token. To correlate a SCIM event with a specific administrator action, match by `displayName` and timestamp against your IdP's provisioning logs.

## Set up delegation

Complete these steps in order. Each step links to a dedicated guide.

1. [Configure authentication](../overview) for your Enterprise instance if you haven't already.
2. [Populate the IdP group catalog](./group-catalog/overview). Choose SCIM push or manual entry depending on your IdP.
3. [Configure the IdP to emit the `groups` claim](./claim-mapping) so it reaches Seqera at login.
4. If your instance hosts multiple organizations, review the [multi-organization routing rules](./multi-org-routing).
5. [Delegate a Team to an IdP group](../../../../orgs-and-teams/teams#delegate-a-team-to-an-idp-group).

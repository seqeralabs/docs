---
title: "IdP delegation overview"
description: "Map Seqera teams to identity provider (IdP) groups so team membership is controlled at the IdP and evaluated on every SSO login."
date created: "2026-06-29"
last updated: "2026-07-09"
tags: [sso, idp delegation, teams, organization settings, cloud pro]
---

<!--
REVIEW BEFORE MERGE — DO NOT PUBLISH YET (EDU-1266)

- IdP delegation is NOT GA on Seqera Cloud. The feature flag
  (TOWER_IDP_CLAIMS_MAPPING_ENABLED) is enabled in Cloud dev and stage but is
  OFF in tower-prod as of 2026-06-29. Hold this page set until the flag is
  enabled in Cloud production.
- Verify against the shipped Cloud UI before publish: exact menu labels
  (Organization settings > Group mapping / Teams), the SCIM endpoint URL host
  and path, and the team "IdP Group" field label.
- Draft adapted from the Enterprise IdP delegation pages. Multi-organization
  routing was intentionally dropped — Cloud Pro tokens carry an org_id claim,
  so evaluation is scoped to a single organization.
- Verify the delegated-team list label ("Managed in IdP" here vs "IdP
  Delegated" in Enterprise teams.md) — the two surfaces should agree.
- Verify whether linking a team to an IdP group shows a confirmation dialog
  (PLAT-5702 acceptance criterion, not delivered in PR #11672).
- Login semantics updated 2026-07-09 to match PLAT-5702 / platform PR #11603:
  an absent groups claim now revokes delegated memberships. Do not revert to
  "absent claim is a no-op".
-->

With IdP delegation, you map a Seqera team to a group in your identity provider (IdP). After you delegate a team, the IdP becomes the sole authority for that team's membership. Every time a user signs in through SSO, Seqera reads the `groups` claim from their token and updates the user's delegated-team memberships to match.

IdP delegation requires an active SSO connection for your organization. To set up SSO first, see [Single sign-on (SSO)](../single-sign-on).

:::caution
Once a team is delegated, the IdP is the sole authority for its membership. If the `groups` claim stops reaching Seqera — for example, because the IdP claim configuration is removed or the Auth0 connection mapping is misconfigured — users lose all their delegated team memberships at their next login. Confirm your claim mapping is stable before delegating teams. See [What happens at login](#what-happens-at-login).
:::

## How it works

Delegation has three components that an organization owner configures once.

### The IdP group catalog

Seqera maintains a per-organization catalog of IdP groups. The catalog populates the **IdP Group** drop-down on the team mapping page. Groups appear in the catalog as soon as they're synced or entered, before any user has signed in.

The catalog is populated in one of two ways:

- **SCIM 2.0 push**: Your IdP pushes its group directory to your organization's SCIM endpoint. Used with Okta and Entra ID.
- **Manual entry**: For IdPs that don't support SCIM group sync, an organization owner enters group identifiers in the catalog UI.

A manually-entered group is automatically promoted to SCIM-managed if your IdP later pushes the same group. See [Manage your IdP group catalog](./group-catalog/overview).

### The `groups` claim

At login, Seqera reads the user's IdP claims to decide which delegated teams they belong to. The `groups` claim must reach Seqera and must contain the same group identifiers as your catalog.

Cloud Pro authenticates through Auth0, which sits between your IdP and Seqera. The `groups` claim is mapped at the Auth0 connection, not read from the IdP token directly. See [IdP claim mapping](./claim-mapping).

### The team's `IdP Group` field

When an organization owner sets the **IdP Group** field on a team, the team becomes delegated. Delegation has the following effects:

- The team is labeled **Managed in IdP** in the teams list.
- The team's member list displays a banner indicating that your identity provider manages the team's membership, and that members removed from the IdP group lose access at their next login.
- The **Add member** and **Remove member** controls are hidden.
- The team can't be deleted until the **IdP Group** field is cleared.
- The team's name, description, avatar, and workspace assignments remain editable.

The same IdP group can only be assigned to a single team, and each team can reference exactly one IdP group.

## What happens at login

Cloud Pro tokens carry an `org_id` claim that scopes evaluation to a single organization. On every SSO login, Seqera evaluates each delegated team in that organization against the user's `groups` claim:

- **Match found**: The user is added to the team if they aren't already a member.
- **No match and the user was previously a delegation-driven member**: The user is removed from the team.
- **No match and the user was never a delegation-driven member**: No change.
- **Claim absent or empty**: All of the user's delegated team memberships in the organization are revoked. Major IdPs, including Okta and Entra ID, omit the `groups` claim entirely when a user belongs to no groups, so an absent claim is treated the same as an empty one.
- **Claim malformed** (not a list, or containing non-string values): No changes take place. This is a safety net against IdP or claim-mapping errors, so existing memberships are preserved.

This evaluation never changes manual assignments to non-delegated teams. Users added manually to a team with no **IdP Group** value keep their membership regardless of their IdP claims.

## Delegate a team to an IdP group

You delegate a team from the team's settings by setting its **IdP Group** field to a group from the catalog. The team is then labeled **Managed in IdP**, and its member list is controlled by the IdP from the next SSO login onward.

For the full procedure — prerequisites, what changes when a team is delegated, and how to stop delegating — see [Delegate a team to an IdP group](../../orgs-and-teams/teams#delegate-a-team-to-an-idp-group).

## Audit trail

Delegation activity is recorded in your organization's audit trail:

- Setting, changing, or clearing the **IdP Group** field on a team produces a `team_updated` event with the previous and new value of `idpGroup`.
- Each delegation-driven membership change at login produces a `team_member_added` or `team_member_removed` event.
- Group catalog operations produce `idp_group_created`, `idp_group_updated`, and `idp_group_deleted` events so you can correlate catalog changes with downstream membership changes.

SCIM-originated entries (operations performed by your IdP's provisioning agent against your organization's SCIM endpoint) are attributed to a **System** operator rather than to a named administrator. The provisioning agent authenticates with a SCIM bearer token, not as a named user. To correlate a SCIM event with a specific administrator action, match by `displayName` and timestamp against your IdP's provisioning logs.

## Set up delegation

Complete these steps in order. Each step links to a dedicated guide.

1. [Configure single sign-on](../single-sign-on) for your organization if you haven't already.
2. [Populate the IdP group catalog](./group-catalog/overview). Choose SCIM push or manual entry depending on your IdP.
3. [Configure the `groups` claim](./claim-mapping) so it reaches Seqera at login.
4. [Delegate a team to an IdP group](../../orgs-and-teams/teams#delegate-a-team-to-an-idp-group).

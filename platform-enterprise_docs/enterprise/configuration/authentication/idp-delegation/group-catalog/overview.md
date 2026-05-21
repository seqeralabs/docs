---
title: "Manage your IdP group catalog"
description: "Populate Seqera with your IdP's groups using SCIM push or manual entry."
date: "2026-05-12"
tags: [sso, scim, idp-delegation, administration, enterprise]
---

Seqera maintains a per-organization catalog of identity provider (IdP) groups. Groups appear in the catalog as soon as they're synced from the IdP or added manually. They don't depend on any user having signed in.

Use the table below to choose the path that fits your IdP.

| IdP | Recommended path | Setup guide |
|-----|------------------|-------------|
| Okta | SCIM push | [SCIM provisioning with Okta](./scim-okta) |
| Entra ID | SCIM push | [SCIM provisioning with Entra ID](./scim-entra-id) |

:::info[Other identity providers]
SCIM-based provisioning is supported for Okta and Microsoft Entra ID. With these providers, group membership syncs automatically, including lifecycle events (joiners, movers, leavers).

Other OIDC or SAML identity providers can authenticate users through Auth0, but group membership doesn't sync automatically. An admin must update memberships in Seqera as users join, move, or leave.

If you use Google Workspace, Keycloak, Ping, OneLogin, or another OIDC/SAML provider and want to delegate team membership, contact your Seqera account team to discuss your setup.
:::

## SCIM push

If your IdP supports SCIM 2.0 group provisioning, Platform exposes a per-organization SCIM endpoint that the IdP can push to. Group create, rename, and delete events flow through automatically, and the catalog stays in sync without administrator intervention.

To set up SCIM:

1. Open **Organization settings > Group mapping**.
2. Copy the **SCIM endpoint URL** and the generated **bearer token**.
3. Configure these values in your IdP's SCIM provisioning settings.
4. Trigger an initial sync from the IdP or wait until the IdP performs an scheduled sync.

After the sync completes, the catalog displays every group your IdP shared, and the **IdP Group** drop-down menu on the team form is populated.

:::caution
Treat the SCIM bearer token like a password. It grants write access to your organization's group catalog. If the token is compromised, rotate it immediately using **Rotate** in the **Group mapping** panel. The previous token is revoked atomically.
:::

## Manual entry

1. Open **Organization settings** and select **Group mapping**.
2. Select **Add manual group**.

To add a group manually:

To delete a manually-entered group, select **Delete** on its row. If any delegated team references the group, its members are immediately purged.
2. Select **Add manual group**.
3. Enter the group identifier exactly as it appears in your IdP's `groups` claim.
4. Select **Save**.

To delete a manually-entered group, select **Delete** on its row. If any delegated team references the group, its members are immediately purged and a warning indicates that the team has lost its source of membership.

:::info
A manually-entered group is automatically promoted to SCIM-managed if your IdP later pushes the same group via SCIM. The promotion happens in place; the catalog row is reused, and any delegated teams that reference it continue to work without interruption. After promotion, the row's lifecycle is fully driven by SCIM, and the manual **Delete** action is no longer available; the row is removed when your IdP issues a SCIM `DELETE`.
:::

## Remove catalog entry

When a group is removed from the catalog, by SCIM `DELETE`, manual deletion, or IdP-side rename detection, the following happens asynchronously:

- The catalog row is removed.
- Every delegated team that referenced the group has its delegation-driven members purged. The team's other settings — name, workspace assignments, role — are preserved.
- If a group is deleted on the IdP side, the team's membership can be reset by setting its **IdP Group** field to a different group, or clearing the field to convert the team back to manual management.

## Multi-organization deployments

On Enterprise instances that host more than one organization, group display names must be unique across all organizations on the instance. If you add a group that conflicts with another organization's catalog entry, this will fail with a `409 Conflict`. See [Multi-organization routing](../multi-org-routing) for the full rules.

---
title: "Manage your IdP group catalog"
description: "Populate Seqera with your IdP's groups using SCIM push or manual entry."
date: "2026-05-12"
tags: [sso, scim, idp-delegation, administration, enterprise]
---

Seqera maintains a per-organization catalog of identity provider (IdP) groups. The catalog populates the **IdP Group** dropdown on the Team form, so organization owners can select a group when delegating a Team. The catalog is independent of user activity — groups appear as soon as they're synced or entered, before any user has signed in.

Use the table below to choose the path that fits your IdP.

| IdP | Recommended path | Setup guide |
|-----|------------------|-------------|
| Okta | SCIM push | [SCIM provisioning with Okta](./scim-okta) |
| Entra ID | SCIM push | [SCIM provisioning with Entra ID](./scim-entra-id) |
| Google Workspace | Manual entry | [Manual entry for Google Workspace](./manual-google-workspace) |
| Keycloak | Manual entry | [Manual entry for Keycloak](./manual-keycloak) |
| Other | SCIM push if your IdP supports SCIM 2.0 group provisioning; otherwise manual entry. | — |

## SCIM push

If your IdP supports SCIM 2.0 group provisioning, Seqera exposes a per-organization SCIM endpoint that the IdP can push to. Group create, rename, and delete events flow through automatically, and the catalog stays in sync without administrator intervention.

To set up SCIM:

1. Open **Organization settings** and select **Manage single sign-on**, then **Group mapping**.
2. Copy the **SCIM endpoint URL** and the generated **bearer token**.
3. Configure these values in your IdP's SCIM provisioning settings.
4. Trigger an initial sync from the IdP.

After the sync completes, the catalog displays every group your IdP shared, and the **IdP Group** dropdown on the Team form is populated.

:::caution
Treat the SCIM bearer token like a password. It grants write access to your organization's group catalog. If the token is compromised, rotate it immediately using **Generate new token** in the **Group mapping** panel — the previous token is revoked atomically.
:::

## Manual entry

If your IdP doesn't support SCIM group sync, populate the catalog by entering group identifiers manually. The value to enter depends on your IdP — see the per-IdP guides for the format and where to find it.

To add a group manually:

1. Open **Organization settings** and select **Manage single sign-on**, then **Group mapping**.
2. Select **Add group manually**.
3. Enter the group identifier exactly as it appears in your IdP's `groups` claim. The form links to per-IdP guidance.
4. Save.

To delete a manually-entered group, select **Delete** on its row. If any delegated Team references the group, its members are immediately purged and a warning indicates that the Team has lost its source of membership.

:::info
A manually-entered group is automatically promoted to SCIM-managed if your IdP later pushes the same group via SCIM. The promotion happens in place — the catalog row is reused, and any delegated Teams that reference it continue to work without interruption. After promotion, the row's lifecycle is fully driven by SCIM, and the manual **Delete** action is no longer available; the row is removed when your IdP issues a SCIM `DELETE`.
:::

## What happens when a catalog entry is removed

When a group is removed from the catalog — by SCIM `DELETE`, manual deletion, or IdP-side rename detection — Seqera does the following synchronously:

- The catalog row is removed.
- Every delegated Team that referenced the group has its delegation-driven members purged. The Team's other settings — name, workspace assignments, role — are preserved.
- An orphaned-team warning appears in the **Group mapping** panel, listing the affected Teams. To restore the Team's membership, set its **IdP Group** field to a different group, or clear the field to convert the Team back to manual management.

## Multi-organization deployments

On Enterprise instances that host more than one organization, group display names must be unique across all organizations on the instance. Adding a group that conflicts with another organization's catalog entry fails with a `409 Conflict`. See [Multi-organization routing](../multi-org-routing) for the full rules.

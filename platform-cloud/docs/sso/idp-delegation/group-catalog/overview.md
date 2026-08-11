---
title: "Manage your IdP group catalog"
description: "Populate your Seqera Cloud organization with your IdP's groups using SCIM push or manual entry."
date created: "2026-06-29"
last updated: "2026-07-09"
tags: [sso, scim, idp delegation, organization settings, cloud pro]
---

Platform maintains a per-organization catalog of identity provider (IdP) groups. Groups appear in the catalog as soon as they're synced from the IdP or added manually. They don't depend on any user having signed in.

Choose the path that fits your IdP:

| IdP | Recommended path | Setup guide |
|-----|------------------|-------------|
| Okta | SCIM push | [SCIM provisioning with Okta](./scim-okta) |
| Entra ID | SCIM push | [SCIM provisioning with Entra ID](./scim-entra-id) |

:::info[Other identity providers]
Seqera supports SCIM provisioning for Okta and Microsoft Entra ID. With these providers, group membership syncs automatically, including lifecycle events (joiners, movers, leavers).

Other OIDC or SAML identity providers can authenticate users through Auth0, but group membership doesn't sync automatically. An organization owner must update memberships in Seqera as users join, move, or leave.

If you use Google Workspace, Keycloak, Ping, OneLogin, or another OIDC/SAML provider and want to delegate team membership, contact your Seqera account team to discuss your setup.
:::

## SCIM push

If your IdP supports SCIM 2.0 group provisioning, Platform exposes a per-organization SCIM endpoint that the IdP can push to. Create, rename, and delete events sync automatically without administrator intervention.

To set up SCIM:

1. In Platform, open **Organization settings > Group mapping**.
2. Copy the **SCIM endpoint URL** and the generated **bearer token**.
3. Configure these values in your IdP's SCIM provisioning settings.
4. Trigger an initial sync from the IdP, or wait until the IdP performs a scheduled sync.

After the sync completes, the catalog displays every group your IdP shared, and the **Linked team** drop-down on **Group mapping** is populated.

:::caution
Treat the SCIM bearer token like a password. It grants write access to your organization's group catalog. If the token is compromised, rotate it immediately by generating a new token in the **Group mapping** panel. The previous token is revoked when the new token is issued.
:::

## Manual entry

To add a group manually:

1. In Platform, open **Organization settings > Group mapping**.
2. Select **Add group manually**.
3. Enter the group identifier exactly as it appears in your IdP's `groups` claim.
4. Select **Save**.

To delete a manually-entered group, select **Delete** on its row. If any delegated team references the group, its members are immediately purged.

:::info
A manually-entered group is automatically promoted to SCIM-managed if your IdP later pushes the same group via SCIM. The promotion happens in place. The catalog row is reused, and any delegated teams that reference it continue to work without interruption. After promotion, the row's lifecycle is fully driven by SCIM, and the manual **Delete** action is no longer available. The row is removed when your IdP issues a SCIM `DELETE`.
:::

## Remove a catalog entry

When a group is removed from the catalog — by SCIM `DELETE`, manual deletion, or IdP-side rename detection:

- The catalog row is removed.
- Every delegated team that referenced the group has its delegation-driven members purged. The affected teams remain in place with empty membership and an orphaned-team warning. Other team settings (name, workspace assignments, role) are preserved.
- To reset an affected team's membership, set its **IdP Group** field to a different group, or clear the field to convert the team back to manual management.

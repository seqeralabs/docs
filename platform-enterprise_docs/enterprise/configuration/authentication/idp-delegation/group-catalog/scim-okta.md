---
title: "SCIM provisioning with Okta"
description: "Configure Okta to push group memberships to Seqera Platform Enterprise over SCIM 2.0."
date: "2026-05-12"
tags: [sso, scim, okta, idp-delegation, administration, enterprise]
---

Configure Okta to push your organization's groups to Seqera Platform Enterprise over SCIM 2.0. Once provisioning is enabled, your Okta group directory appears in Seqera's IdP group catalog and stays in sync with renames, additions, and deletions automatically.

## Before you begin

- An Okta application configured as your Seqera SSO connection. See [Okta authentication](../../okta).
- Organization owner access to your Seqera organization.
- Administrator access to your Okta tenant.

## Get the Seqera SCIM connection details

1. In Seqera, open **Organization settings** and select **Manage single sign-on**, then **Group mapping**.
2. Copy the **SCIM endpoint URL** — it has the form `https://<seqera-host>/orgs/<orgId>/scim/v2/Groups`.
3. Select **Generate token** to issue a SCIM bearer token. Copy it immediately; you can't view it again after closing the dialog.

:::caution
The bearer token grants write access to your group catalog. Store it in a secrets manager and rotate it on a schedule. To rotate, generate a new token in Seqera and update Okta's configuration; the previous token is revoked when the new one is issued.
:::

## Enable provisioning in Okta

1. Sign in to your Okta administrator console.
2. Open **Applications**, then select the application that fronts your Seqera SSO connection.
3. Open the **Provisioning** tab and select **Configure API integration**.
4. Select **Enable API integration** and provide:
   - **Base URL** — the Seqera SCIM endpoint URL from the previous section, with `/Groups` removed (Okta appends the resource path).
   - **API token** — the Seqera bearer token from the previous section.
5. Select **Test API Credentials**. Okta should report a successful connection.
6. Save.

## Enable group push

1. With the application still open, switch to the **Push Groups** tab.
2. Select **Push Groups**, then **Find groups by name** (or **By rule** for dynamic group sets).
3. Select the Okta groups you want available in Seqera.
4. Confirm the push. Okta sends an initial provisioning batch.

## Verify in Seqera

1. Return to Seqera's **Group mapping** panel.
2. Refresh the page. The pushed Okta groups should appear in the catalog list within a few seconds.
3. Open any Team's edit form. The **IdP Group** dropdown is now populated with the synced groups.

If groups don't appear, check the **Push Groups** status column in Okta for error details, and confirm that the **Provisioning** tab shows **Push Groups: ON**.

## Group rename and delete behavior

Renames and deletes propagate automatically:

- **Rename** — the next SCIM push updates the catalog row's display name. Delegated Teams that reference the group continue to work without interruption.
- **Delete** — Okta issues a SCIM `DELETE` for the group. Seqera removes the catalog row and synchronously purges members from any delegated Team that referenced it. The affected Teams remain in place with empty membership and an orphaned-team warning.

## Troubleshooting

### Groups appear in Okta but not in Seqera

Confirm the bearer token in Okta matches the latest token Seqera issued. If you generated a new token after configuring Okta, the previous one is revoked.

### `401 Unauthorized` from Okta logs

The bearer token is invalid or expired. Generate a new token in Seqera and replace it in Okta.

### `409 Conflict` on a specific group

A group with the same display name already exists in another organization on the same Enterprise instance. See [Multi-organization routing](../multi-org-routing) for the cross-organization uniqueness rule and conflict resolution.

---
title: "SCIM provisioning with Okta"
description: "Configure Okta to push group memberships to Seqera Platform Enterprise over SCIM 2.0."
date: "2026-05-12"
tags: [sso, scim, okta, idp-delegation, administration, enterprise]
---

Configure Okta to push your organization's groups to Platform over SCIM 2.0. Once provisioning is enabled, your Okta group directory appears in Seqera's IdP group catalog and stays in sync with renames, additions, and deletions automatically.

:::info[**Prerequisites**]{#prerequisites}
You will need the following to get started:

- An Okta application configured as your Platform SSO connection. See [Okta authentication](../../okta).
- Organization owner access to your Platform organization.
- Administrator access to your Okta tenant.
:::

## Get the Seqera SCIM connection details

1. In Platform, open **Organization settings > Group mapping**.
2. Copy the **SCIM endpoint URL**. It has the form `https://<seqera-host>/api/orgs/<orgId>/scim/v2`.
3. Select **Generate token** to issue a SCIM bearer token. Copy it immediately. You can't view it again after closing the dialog.

:::caution
The bearer token grants write access to your group catalog. Store it in a secrets manager and rotate it on a schedule. To rotate, generate a new token in Seqera and update Okta's configuration. The previous token is revoked when the new token is issued.
:::

## Enable provisioning in Okta

1. Sign in to your Okta administrator console.
2. Open **Applications**, then select the application that fronts your Seqera SSO connection.
3. Open the **Provisioning** tab and select **Configure API integration**.
4. Select **Enable API integration** and provide:
   - **Base URL**: The Platform SCIM endpoint URL from the previous section, with `/Groups` removed (Okta appends the resource path).
   - **API token**: The Platform bearer token from the previous section.
5. Select **Test API Credentials**. Okta should report a successful connection.
6. Select **Save**.

## Enable group push

1. With the application still open, switch to the **Push Groups** tab.
2. Select **Push Groups**, then **Find groups by name** (or **By rule** for dynamic group sets).
3. Select the Okta groups you want available in Platform.
4. Confirm the push. Okta sends an initial provisioning batch.

## Verify in Platform

1. In Platform, open **Organization settings > Group mapping**.
2. Select **Refresh**. The pushed Okta groups should appear in the catalog list within a few seconds.
3. The **Linked team** drop-down menu is now populated with the synced groups.

If groups don't appear, check the **Push Groups** status column in Okta for error details, and confirm that the **Provisioning** tab shows **Push Groups: ON**.

## Group rename and delete behavior

Renames and deletes propagate automatically:

- **Rename**: The next SCIM push updates the catalog row's display name. Delegated teams that reference the group continue to work without interruption.
- **Delete**: Okta issues a SCIM `DELETE` for the group. Seqera removes the catalog row and synchronously purges members from any delegated team that referenced it. The affected teams remain in place with empty membership and an orphaned-team warning.

## Troubleshooting

### Groups appear in Okta but not in Seqera

Confirm the bearer token in Okta matches the latest token Seqera issued. If you generated a new token after configuring Okta, the previous token is revoked.

### `401 Unauthorized` from Okta logs

The bearer token is invalid or expired. Generate a new token in Platform and replace it in Okta.

### `409 Conflict` on a specific group

A group with the same display name already exists in another organization on the same Enterprise instance. See [Multi-organization routing](../multi-org-routing) for the cross-organization uniqueness rule and conflict resolution.

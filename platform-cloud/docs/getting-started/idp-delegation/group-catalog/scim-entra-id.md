---
title: "SCIM provisioning with Entra ID"
description: "Configure Microsoft Entra ID to push group memberships to Seqera over SCIM 2.0."
date created: "2026-05-12"
last updated: "2026-05-12"
tags: [sso, scim, entra-id, idp-delegation, administration, cloud-pro]
---

Configure Microsoft Entra ID (formerly Azure AD) to push your tenant's groups to Seqera over SCIM 2.0. Once provisioning is enabled, the groups you assign to your Seqera enterprise application appear in Seqera's IdP group catalog and stay in sync with renames, additions, and deletions automatically.

## Before you begin

- An Entra ID enterprise application configured as your Seqera SSO connection. To set up SSO, see [Single sign-on (SSO)](../../single-sign-on).
- Organization owner access to your Seqera organization.
- Administrator access to your Entra ID tenant with permission to manage application provisioning.

## Get the Seqera SCIM connection details

1. In Seqera, open **Organization settings** and select **Manage single sign-on**, then **Group mapping**.
2. Copy the **SCIM endpoint URL** — it has the form `https://<seqera-host>/orgs/<orgId>/scim/v2`.
3. Select **Generate token** to issue a SCIM bearer token. Copy it immediately; you can't view it again after closing the dialog.

:::caution
The bearer token grants write access to your group catalog. Store it in a secrets manager and rotate it on a schedule. To rotate, generate a new token in Seqera and update Entra ID's configuration; the previous token is revoked when the new one is issued.
:::

## Enable provisioning in Entra ID

1. Sign in to the Azure portal and open **Entra ID**, then **Enterprise applications**.
2. Select the application that fronts your Seqera SSO connection.
3. Open **Provisioning** and select **Get started**.
4. Set **Provisioning Mode** to **Automatic**.
5. Under **Admin Credentials**, provide:
   - **Tenant URL** — the Seqera SCIM endpoint URL from the previous section.
   - **Secret Token** — the Seqera bearer token from the previous section.
6. Select **Test Connection**. Entra ID should report success.
7. Save.

## Scope and start provisioning

1. With **Provisioning** still open, expand **Settings**.
2. Set **Scope** to **Sync only assigned users and groups**.
3. Save, then set **Provisioning Status** to **On**.
4. Return to the application's **Users and groups** tab and assign the groups you want Seqera to receive.

Entra ID runs an initial cycle within minutes and then syncs incrementally every ~40 minutes.

## Group display names vs object IDs

:::caution
By default, Entra ID emits group **object GUIDs** in the `groups` claim, not display names. You have two options:

- **Recommended** — configure Entra ID to emit display names. In the application's **Token configuration**, add a **groups claim** and select **sAMAccountName** as the source where supported, or use a custom claims policy. This makes catalog entries and audit logs human-readable.
- **Alternative** — accept the default GUID emission. Use the GUID as the **IdP Group** value on each Team. This works but makes the catalog harder to read.

Pick one approach for your tenant and use it consistently. The GUID and the display name don't both flow at the same time.
:::

## Verify in Seqera

1. Return to Seqera's **Group mapping** panel.
2. Refresh the page. The assigned Entra ID groups should appear in the catalog list after the first provisioning cycle.
3. Open any Team's edit form. The **IdP Group** dropdown is now populated with the synced groups.

If groups don't appear, open the **Provisioning logs** for the application in Entra ID and review any failed actions.

## Group rename and delete behavior

Renames and deletes propagate automatically through SCIM:

- **Rename** — the next provisioning cycle updates the catalog row's display name. Delegated Teams that reference the group continue to work without interruption.
- **Delete** — Entra ID issues a SCIM `DELETE` for the group, or removes the assignment from the enterprise application. Seqera removes the catalog row and synchronously purges members from any delegated Team that referenced it. The affected Teams remain in place with empty membership and an orphaned-team warning.

## Troubleshooting

### Groups appear in Entra ID but not in Seqera

Confirm the bearer token configured in Entra ID matches the latest token Seqera issued. If you generated a new token after configuring Entra ID, the previous one is revoked.

### Provisioning logs show `401 Unauthorized`

The bearer token is invalid or expired. Generate a new token in Seqera and replace it in Entra ID.

### The catalog shows GUID-style identifiers instead of group names

Entra ID is emitting object IDs rather than display names. See the **Group display names vs object IDs** caution above for the two options.

### A group is assigned to the application but doesn't sync

Confirm the provisioning scope is set to **Sync only assigned users and groups** and that the group is actually listed under **Users and groups**, not just nested in another assigned group.

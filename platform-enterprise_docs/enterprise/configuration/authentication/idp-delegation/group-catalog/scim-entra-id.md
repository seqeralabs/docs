---
title: "SCIM provisioning with Entra ID"
description: "Configure Microsoft Entra ID to push group memberships to Seqera Platform Enterprise over SCIM 2.0."
date: "2026-05-12"
tags: [sso, scim, entra-id, idp-delegation, administration, enterprise]
---

Configure Microsoft Entra ID (formerly Azure AD) to push your tenant's groups to Platform over SCIM 2.0. Once provisioning is enabled, the groups you assign to your Seqera Enterprise application appear in Platform's IdP group catalog and stay in sync with renames, additions, and deletions automatically.

## Before you begin

- An Entra ID enterprise application configured as your Seqera SSO connection. See [Entra ID authentication](../../entra).
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
2. Select the application that fronts your Platform SSO connection.
3. Open **Provisioning** and select **Get started**.
4. Set **Provisioning Mode** to **Automatic**.
5. Under **Admin Credentials**, provide:
   - **Tenant URL**: The Platform SCIM endpoint URL from the previous section.
   - **Secret Token**: The Platform bearer token from the previous section.
6. Select **Test Connection**. Entra ID should report success.
7. Select **Save**.

## Scope and start provisioning

1. With **Provisioning** still open, expand **Settings**.
2. Set **Scope** to **Sync only assigned users and groups**.
3. Save, then set **Provisioning Status** to **On**.
4. Return to the application's **Users and groups** tab and assign the groups you want Platform to receive.

Entra ID runs an initial cycle within minutes and then syncs incrementally every ~40 minutes.

## Group display names vs. object IDs

:::caution
By default, Entra ID emits group **object GUIDs** in the `groups` claim, not display names. There are two options:

- **Recommended**: Configure Entra ID to emit display names. In the application's **Token configuration**, add a **groups claim** and select **sAMAccountName** as the source where supported, or use a custom claims policy. This makes catalog entries and audit logs human-readable.
- **Alternative**: Accept the default GUID emission. Use the GUID as the **IdP Group** value on each team. This works but makes the catalog harder to read.

Pick one approach for your tenant and use it consistently. The GUID and the display name don't both flow at the same time.
:::

## Verify in Platform

1. Return to Platform's **Group mapping** panel.
2. Refresh the page. The assigned Entra ID groups should appear in the catalog list after the first provisioning cycle.
3. Open any team's edit form. The **IdP Group** drop-down menu is now populated with the synced groups.

If groups don't appear, open the **Provisioning logs** for the application in Entra ID and review any failed actions.

## Group rename and delete behavior

Renames and deletes propagate automatically through SCIM:

- **Rename**: The next provisioning cycle updates the catalog row's display name. Delegated teams that reference the group continue to work without interruption.
- **Delete**: Entra ID issues a SCIM `DELETE` for the group, or removes the assignment from the enterprise application. Seqera removes the catalog row and synchronously purges members from any delegated team that referenced it. The affected teams remain in place with empty membership and an orphaned-team warning.

## Troubleshooting

### Groups appear in Entra ID but not in Platform

Confirm the bearer token configured in Entra ID matches the latest token that was issued. If you generated a new token after configuring Entra ID, the previous one is revoked.

### Provisioning logs show `401 Unauthorized`

The bearer token is invalid or expired. Generate a new token in Platform and replace it in Entra ID.

### The catalog shows GUID-style identifiers instead of group names

Entra ID is emitting object IDs rather than display names. See the **Group display names vs object IDs** caution above for the two options.

### `409 Conflict` on a specific group

A group with the same display name already exists in another organization on the same Enterprise instance. See [Multi-organization routing](../multi-org-routing) for the cross-organization uniqueness rule and conflict resolution.

### A group is assigned to the application but doesn't sync

Confirm the provisioning scope is set to **Sync only assigned users and groups** and that the group is actually listed under **Users and groups**, not just nested in another assigned group.

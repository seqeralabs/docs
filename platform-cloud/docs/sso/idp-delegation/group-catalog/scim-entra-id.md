---
title: "SCIM provisioning with Entra ID"
description: "Configure Microsoft Entra ID to push group memberships to your Seqera Platform Cloud organization over SCIM 2.0."
date created: "2026-06-29"
tags: [sso, scim, entra id, idp delegation, organization settings, cloud pro]
---

Configure Microsoft Entra ID (formerly Azure AD) to push your tenant's groups to Platform over SCIM 2.0. After provisioning is enabled, the groups you assign to your Seqera application appear in Platform's IdP group catalog and stay in sync with renames, additions, and deletions.

:::info[**Prerequisites**]{#prerequisites}
You need the following:

- An active [SSO connection](../../single-sign-on) for your organization with Entra ID as the IdP. SCIM provisioning requires a separate enterprise application that you create in this guide.
- Organization owner access to your Platform organization.
- Administrator access to your Entra ID tenant with permission to manage application provisioning.
:::

## Get the Platform SCIM connection details

To get Platform SCIM connection details:

1. In Platform, open **Organization settings > Group mapping**.
2. Copy the **SCIM endpoint URL** shown in the panel.
3. Select **Generate token** to issue a SCIM bearer token. Copy your bearer token immediately. You can't view it again after closing the dialog.

:::caution
The bearer token grants write access to your group catalog. Store it in a secrets manager and rotate it on a schedule. To rotate, generate a new token in Seqera and update Entra ID's configuration. The previous token is revoked when the new token is issued.
:::

## Create a provisioning application

:::caution
Entra ID does not support automatic provisioning on applications created through **App Registrations**. If your [SSO connection](../../single-sign-on) uses an application created that way, you cannot use it for SCIM. Its **Provisioning > Get started** button is disabled and Entra ID warns that out-of-the-box automatic provisioning is not supported. Create a separate non-gallery enterprise application for provisioning instead. Your existing SSO application continues to handle sign-in unchanged.
:::

To create the provisioning application:

1. In the Azure portal, open **Entra ID**, then **Enterprise applications**.
2. Select **New application**, then **Create your own application**.
3. Enter a name (for example, `Seqera SCIM provisioning`) and select **Integrate any other application you don't find in the gallery (Non-gallery)**.
4. Select **Create**.

Use this application only for SCIM provisioning. Do not configure sign-on for it.

## Enable provisioning in Entra ID

To enable provisioning in Entra ID:

1. In **Enterprise applications**, select the provisioning application you created in the previous section.
2. Open **Provisioning** and select **Get started**.
3. Set **Provisioning Mode** to **Automatic**.
4. Under **Admin Credentials**, provide:
   - **Tenant URL**: The Platform SCIM endpoint URL from [Get the Platform SCIM connection details](#get-the-platform-scim-connection-details).
   - **Secret Token**: The Platform bearer token from the same section.
5. Select **Test Connection**. Entra ID should report success.
6. Select **Save**.

## Scope and start provisioning

To scope and start provisioning:

1. With **Provisioning** still open, expand **Settings**.
2. Set **Scope** to **Sync only assigned users and groups**.
3. Save, then set **Provisioning Status** to **On**.
4. Return to the provisioning application's **Users and groups** tab and assign the groups you want Platform to receive.

Entra ID runs an initial cycle within minutes and then syncs incrementally every ~40 minutes.

## Group display names vs. object IDs

:::caution
By default, Entra ID emits group **object GUIDs** in the `groups` claim, not display names. There are two options:

- **Recommended**: Configure Entra ID to emit display names. In the application's **Token configuration**, add a **groups claim** and select **sAMAccountName** as the source where supported, or use a custom claims policy. This makes catalog entries and audit trail entries human-readable.
- **Alternative**: Accept the default GUID emission. Use the GUID as the **IdP Group** value on each team. This works but makes the catalog harder to read.

Pick one approach for your tenant and use it consistently. The GUID and the display name don't both flow at the same time.
:::

## Verify in Platform

To verify in Platform:

1. In Platform, open **Organization settings > Group mapping**.
2. Select **Refresh**. The assigned Entra ID groups should appear in the catalog list after the first provisioning cycle.
3. The **Linked team** drop-down is now populated with the synced groups.

If groups don't appear, open the **Provisioning logs** for the application in Entra ID and review any failed actions.

## Rename and delete behavior

Renames and deletes propagate automatically through SCIM:

- **Rename**: The next provisioning cycle updates the catalog row's display name. Delegated teams that reference the group continue to work without interruption.
- **Delete**: Entra ID issues a SCIM `DELETE` for the group, or removes the assignment from the enterprise application. Seqera removes the catalog row and synchronously purges members from any delegated team that referenced it. Affected teams remain in place with empty membership and an orphaned-team warning.

For provisioning problems, see [SSO troubleshooting](../../../troubleshooting_and_faqs/sso_troubleshooting).

---
title: "Create and manage service accounts"
description: "Create, edit, and delete service accounts in a Seqera Platform organization."
date created: "2026-09-10"
last updated: "2026-09-10"
tags: [service accounts, organizations, administration, automation]
---

A Seqera service account is a non-human identity that agents use to act in your organization. Create one when you want an agent's work attributed to the service account rather than to a person's account.

Service accounts are managed at the organization level and belong to the organization, not to the user who created them. They cannot sign in. Platform rejects a sign-in attempt with a service account address.

:::info[**Prerequisites**]

You need the following:

- The **Owner** role in the organization
- Service accounts enabled for your organization

:::

## Create a service account

1. From the organization page, select **Access control**, then select the **Service accounts** tab.
1. Select **Add service account**.
1. Enter a **Name**. The name must be unique across Seqera Platform, not only within your organization. Use lowercase letters, digits, and hyphens between them, from 2 to 39 characters.
1. Optional: enter a **Description** to record what the service account is for.
1. Optional: under **Workspace access**, select **Assign to workspace** to grant the service account a role in one or more workspaces. See [Assign a service account to a workspace](./assign-service-accounts).
1. Select **Add**.

A new service account has no access to any workspace until you assign it one. It holds a fixed organization role that you cannot change, and you cannot make a service account an organization owner.

## Edit a service account

1. From the **Service accounts** tab, select the service account.
1. Select **Edit**.
1. Change the **Name** or **Description**.
1. Select **Update**.

The edit page also shows the **Workspace access** and **Permissions** sections. Under **Workspace access**, you can assign the service account to workspaces, change its role in each, and remove it. These changes apply as soon as you make them. **Update** saves only the name and description, and **Cancel** does not undo workspace access changes. On the service account's detail page, both sections are read-only. See [Assign a service account to a workspace](./assign-service-accounts).

Renaming a service account does not interrupt anything using it. Its identity is independent of the name you give it.

## Where service accounts appear

The organization **Members** list does **not** show service accounts. It lists people only. Service accounts appear:

- In the **Service accounts** tab, where you manage them.
- In the participant list of every workspace they are assigned to, marked with a **Service Account** badge.

A service account counts toward your organization's **Members** limit, in the same way a person does. Creating one in an organization that has reached the limit fails. See [Usage limits](../limits/overview).

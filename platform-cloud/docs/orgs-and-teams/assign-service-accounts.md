---
title: "Assign a service account to a workspace"
description: "Grant a service account a role in a workspace so agents can act there."
date created: "2026-09-10"
last updated: "2026-09-10"
tags: [service accounts, workspaces, roles, administration, automation]
---

A Seqera service account has no workspace access until you assign it to a workspace with a role. Assign one when an agent needs to act in a specific workspace.

Each assignment is direct. You grant the service account a role in one workspace at a time, and repeat that for every workspace it needs.

:::info[**Prerequisites**]

You need the following:

- The **Owner** role in the organization
- An existing service account (see [Create and manage service accounts](./create-service-accounts))
- Every permission carried by the role you intend to grant

:::

## Assign a workspace role

1. From the organization page, select **Access control**, then select the **Service accounts** tab.
1. Select the service account.
1. Select **Edit**.
1. Under **Workspace access**, select **Assign to workspace**.
1. Select a workspace.
1. Select a **Role**. **Launch** is pre-selected. **Owner** is not offered, because a service account cannot own a workspace.
1. Select **Assign**.

The service account can now act in that workspace, bounded by the role you granted.

## Change a workspace role

1. From the **Service accounts** tab, select the service account.
1. Select **Edit**.
1. Under **Workspace access**, select the role next to the workspace.
1. Select the new role.

The change applies as soon as you select the new role. The permission check in [Role limits](#role-limits) runs on it too.

## Role limits

You cannot grant a service account a role carrying permissions you do not hold yourself. This check runs when you assign a service account a workspace role and when you change that role. Platform does not re-evaluate it later if your own permissions change.

To run an agent, a service account needs the `agent:execute` permission in the workspace. Every built-in role except **Connect** and **View** includes it. Platform rejects binding a service account that lacks it.

You can assign built-in roles to a service account, and [custom roles](./custom-roles) in a Cloud Pro organization.

Service accounts take workspace roles directly. Platform rejects adding one to a team. A service account therefore never inherits access the way a person in a team does.

## Remove workspace access

1. From the **Service accounts** tab, select the service account.
1. Select **Edit**.
1. Under **Workspace access**, find the workspace.
1. Select **Remove**.
1. In the confirmation dialog, select **Remove**.

The service account immediately loses its role in that workspace and can no longer act there. It remains in the organization, and its access to other workspaces is unaffected. You can re-add it to this workspace later, because removing it deletes its participation rather than the account.

Removing it also disables the agents bound to the service account in that workspace, and pauses the actions that trigger those agents. Re-adding the service account does not re-enable them. You must enable each agent again.

:::caution
Removing workspace access withdraws the service account's authorization in that workspace. Its requests there start failing. Removing access does not cancel work that is already running. That work continues, failing as it goes, until it finishes or you stop it where it runs.
:::

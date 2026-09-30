---
title: "Service account security"
description: "Scoping, reviewing, and retiring service accounts safely in Seqera Platform."
date created: "2026-09-10"
last updated: "2026-09-10"
tags: [service accounts, security, roles, administration, automation]
---

A Seqera service account holds access that no person signs in to use. That is what makes it useful for automation, and what makes its scope worth setting deliberately. Three things decide how safely one behaves: the role you grant it, who is allowed to grant that role, and when you delete it.

## Least-privilege role assignment

A service account has no access until it is assigned to a workspace. The assignment pre-selects the **Launch** role, which is enough to start pipelines and agents. Do not accept that by default. Drop to **View** where the automation only reads, and assign per workspace rather than granting broad access once. **Owner** is not offered at all. Running an agent needs `agent:execute`, which every built-in role except **Connect** and **View** carries.

Because a service account cannot be added to a team, its access is exactly what you granted it directly. There is no inherited access to audit separately, and no team change that can quietly widen it.

## What the permission check covers

You cannot grant a service account a role carrying permissions you do not hold yourself. That check runs on every workspace role assignment, at the moment of assignment.

It does not run again. If your own permissions are reduced later, the role you already granted stays as it is. A service account's access records what someone could delegate at one point in time, not what they can delegate now. Review assignments periodically rather than assuming they track the person who granted them.

## What the audit log captures

Actions taken by a service account are attributed to it. Audit records carry an actor type of `service_account`, and the lifecycle events `service_account_created`, `service_account_updated`, and `service_account_deleted` record its creation, changes, and deletion. Where an agent acts under a service account, the record also carries an **Agent ID**. That is the agent's raw identifier rather than a name you can look up, and it keeps per-agent actions distinguishable when several agents share one service account.

:::note
A service account's own authentication is not audited. Service accounts do not sign in, and bearer-token validation does not raise a sign-in event. The audit log records what a service account did, never that it authenticated.
:::

## When to delete a service account

Delete a service account as soon as the automation behind it is retired, rather than leaving an unused identity holding workspace roles. To stop one without deleting it, a root user can select **Disable user** for it in the [Admin panel](../administration/overview#users) **Users** tab. Its requests are refused until a root user selects **Enable user**.

Deletion is immediate and not recoverable, and everything depending on the service account starts failing at once. Check the workspaces listed in the confirmation dialog before you confirm. Audit records of what it did are retained.

:::caution
Removing a service account's access withdraws its authorization but does not stop work already running under it. This applies whether you delete it, remove it from a workspace, or unbind it from an agent. Treat "access removed" as "no further authorized requests" rather than "the workload has stopped", and stop the workload where it runs if that matters.
:::

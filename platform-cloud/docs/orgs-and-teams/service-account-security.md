---
title: "Service account security"
description: "Scoping, reviewing, and retiring service accounts safely in Seqera Platform."
date created: "2026-09-10"
last updated: "2026-09-10"
tags: [service accounts, security, roles, administration, automation]
---

A Seqera service account holds access that no person signs in to use. That is what makes it useful for agents, and what makes its scope worth setting deliberately. Three things decide how safely one behaves. These are the role you grant it, who is allowed to grant that role, and when you delete it.

## Least-privilege role assignment

A service account has no workspace access until you assign it to a workspace. The assignment pre-selects the **Launch** role, which can start pipelines as well as agents. Do not accept that by default. Running an agent needs `agent:execute`, which every built-in role except **Connect** and **View** carries, so a service account with either of those roles cannot run an agent. Where the built-in roles grant more than the agent needs, use a [custom role](./custom-roles) with `agent:execute` and only the other permissions the agent uses. Assign per workspace rather than granting broad access once. **Owner** is not offered at all.

Because you cannot add a service account to a team, its access is exactly what you granted it directly. There is no inherited access to audit separately, and no team change that can quietly widen it.

## What the permission check covers

You cannot grant a service account a role carrying permissions you do not hold yourself. That check runs when you assign a service account a workspace role and when you change that role.

It does not run again later. If your own permissions are reduced later, the role you already granted stays as it is. A service account's access records what someone could delegate at one point in time, not what they can delegate now. Review assignments periodically rather than assuming they track the person who granted them.

## How actions are attributed

Work started by a service account is recorded against the service account rather than against the person who created or configured it. Where an agent acts under a service account, the audit log entry also records the agent ID, so actions stay distinguishable when several agents share one service account.

Platform does not record a service account's own authentication. Service accounts do not sign in, so there is no sign-in event for one.

## When to delete a service account

There is no way to disable or suspend a service account. To stop one, delete it or remove it from every workspace. Delete one as soon as the agents that use it are retired, rather than leaving an unused identity holding workspace roles.

Deletion is immediate and not recoverable, and everything depending on the service account starts failing at once. Check the workspaces listed in the confirmation dialog before you confirm. Audit records of what it did remain.

:::caution
Deleting a service account or removing it from a workspace withdraws its authorization but does not stop work already running under it. Unbinding it from an agent changes only which identity that agent's future runs use. A run already in progress keeps acting as the service account until it ends. Treat "access removed" as "no further authorized requests" rather than "the workload has stopped", and stop the workload where it runs if that matters.
:::

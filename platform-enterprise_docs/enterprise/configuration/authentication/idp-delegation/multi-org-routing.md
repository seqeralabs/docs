---
title: "Multi-organization routing"
description: "How IdP delegation resolves users to organizations in single-organization and multi-organization Enterprise installations."
date: "2026-05-12"
tags: [sso, idp-delegation, enterprise, administration]
---

Cloud Pro tokens carry an `org_id` claim that scopes every IdP delegation evaluation to a single organization. Enterprise SSO tokens don't carry such a claim. Platform routes by deployment topology and relies on a cross-organization uniqueness invariant on group display names.

The rules on this page determine how Platform resolves a user's groups claim against each organization's catalog.

## Topology decision table

| Topology | How users are routed | Group-name uniqueness |
|----------|----------------------|------------------------|
| **No SSO** | Not applicable. | Not applicable. |
| **Single organization** | Trivially scoped to the single organization. | Not enforced; there is no second organization to collide with. |
| **Multi-organization** | Evaluated against every organization the user is a member of. | **Enforced**. Group display names must be unique across all organizations on the instance. |

## The uniqueness invariant

In a multi-organization Enterprise instance, when an administrator adds a group to the catalog (manually or through SCIM), Seqera checks the group's display name against every other organization's catalog on the instance. If another organization already has a row with the same display name, the operation fails:

- **Manual add**: The form rejects the value with a `409 Conflict` and a message naming the conflicting organization.
- **SCIM push**: Platform's SCIM endpoint returns `409 Conflict` for that group. The IdP's provisioning agent retries and surfaces the error in its administrator console.

This is the mechanism that lets Seqera resolve a `groups` claim back to a specific organization's catalog at login. Without it, two organizations could both have a group called `engineering` and Seqera couldn't determine which delegation rules to apply.

:::info
On Cloud Pro, the uniqueness check is skipped because the `org_id` claim disambiguates without it.
:::

## Resolving a conflict

If a group-name conflict prevents you from adding a group:

- Coordinate with the conflicting organization's owner to rename one of the groups in the upstream IdP. The rename propagates via SCIM (or is re-entered manually), and the catalog row becomes available again.
- If renaming isn't possible, namespace the group in your IdP — for example, prefix the group with the organization's name (`acme-engineering` instead of `engineering`).

There is no per-organization override. Uniqueness is enforced at the instance level.

## Cross-organization users

When a user belongs to multiple organizations on the same instance, Platform evaluates their `groups` claim against every organization's delegated teams at login. Because group display names are unique instance-wide, each claim value maps unambiguously to one organization's catalog, and the user joins the matching teams in every organization where they apply.

## Operator guidance for new instances

For new multi-organization Enterprise deployments, establish a naming convention for IdP groups before onboarding the first organization. Common patterns:

- **Organization prefix** — `acme-eng-admins`, `beta-eng-admins`. Easy to read; explicit ownership.
- **Reverse-DNS namespace** — `io.acme.eng.admins`. Compact; aligns with IdP best practice.
- **Functional grouping with project codes** — `eng-NF-admins` where `NF` denotes a project. Useful when groups span organizations but require unique names.

Document the convention in your organization onboarding checklist so administrators avoid `409 Conflict` errors when they configure delegation.

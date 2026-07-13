---
title: "Authentication"
description: "Authentication troubleshooting with Seqera Platform."
date created: "2026-07-14"
last updated: "2026-07-14"
tags: [faq, help, authentication, sso, scim, troubleshooting]
---

When configuring authentication for Seqera Platform, you might encounter the following issues.

## SCIM provisioning

These issues apply to SCIM group provisioning with [Okta](../enterprise/configuration/authentication/idp-delegation/group-catalog/scim-okta) and [Entra ID](../enterprise/configuration/authentication/idp-delegation/group-catalog/scim-entra-id).

#### Groups appear in the identity provider but not in Platform

This issue occurs when the bearer token configured in your identity provider doesn't match the current Platform token. Generating a new token in Platform revokes the previous one. To resolve, confirm the token in your identity provider matches the current Platform token, and replace it if necessary.

#### `401 Unauthorized` in provisioning logs

This error occurs when the bearer token is invalid or expired. To resolve, generate a new token in Platform and replace it in your identity provider.

#### `409 Conflict` on a specific group

This error occurs when a group with the same display name already exists in another organization on the same Enterprise instance. See [Multi-organization routing](../enterprise/configuration/authentication/idp-delegation/multi-org-routing) for the cross-organization uniqueness rule and conflict resolution.

#### Catalog shows GUID-style identifiers instead of group names

This issue occurs when Entra ID emits group object IDs rather than display names. To resolve, configure Entra ID to emit display names. See [Group display names vs. object IDs](../enterprise/configuration/authentication/idp-delegation/group-catalog/scim-entra-id#group-display-names-vs-object-ids).

#### A group assigned in Entra ID doesn't sync

This issue occurs when the provisioning scope excludes the group. To resolve, set the scope to **Sync only assigned users and groups** and confirm the group is listed directly under **Users and groups**, not nested inside another assigned group.

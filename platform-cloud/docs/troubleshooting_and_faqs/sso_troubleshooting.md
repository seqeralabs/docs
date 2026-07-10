---
title: "Single sign-on"
description: "Single sign-on (SSO) troubleshooting with Seqera Platform."
date created: "2026-06-05"
last updated: "2026-06-05"
tags: [faq, help, sso, troubleshooting]
---

These issues can occur when you configure or use [single sign-on (SSO)](../sso/single-sign-on) with your organization's corporate identity provider (IdP).

## Common issues

#### Domain claiming is blocked

Seqera blocks domain claiming when the organization has members with email addresses outside the claimed domain or existing workspace collaborators. The setup flow lists the affected users.

To resolve, see [Prepare users before setup](../sso/single-sign-on#prepare-users-before-setup).

#### The claimed domain is rejected or becomes unclaimable

Another organization might already have claimed the domain, or enabled a connection with the same domain claim after you claimed it. Contact Seqera support.

#### Users are not redirected to the corporate IdP

Confirm that SSO is enabled for the organization and that the user's email domain matches the claimed domain.

#### An IdP user can't sign in

Confirm that the user has access to the application or connection configured in your IdP and that the user's email domain matches the domain claimed in Seqera.

#### An existing user sees a linking problem during sign-in

If Seqera can't link an existing account to the SSO identity, the user should contact an organization owner or Seqera support before trying again.

## IdP group provisioning (SCIM)

#### Groups appear in the IdP but not in Seqera

Confirm the bearer token configured in your IdP matches the latest token that Seqera issued. If you generated a new token after configuring the IdP, the previous token is revoked.

#### `401 Unauthorized` in IdP provisioning logs

The bearer token is invalid or expired. Generate a new token from **Organization settings > Group mapping** in Platform and replace it in the IdP.

#### The catalog shows GUID-style identifiers instead of group names (Entra ID)

Entra ID is emitting object IDs rather than display names. See [Group display names vs. object IDs](../sso/idp-delegation/group-catalog/scim-entra-id#group-display-names-vs-object-ids) for the two options.

#### A group is assigned to the application but doesn't sync (Entra ID)

Confirm the provisioning scope is set to **Sync only assigned users and groups**, and that the group is listed directly under **Users and groups** rather than nested inside another assigned group.

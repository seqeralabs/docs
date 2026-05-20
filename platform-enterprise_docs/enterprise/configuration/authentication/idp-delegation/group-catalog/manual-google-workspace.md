---
title: "Manual entry for Google Workspace"
description: "Populate Seqera Platform Enterprise's IdP group catalog manually for Google Workspace organizations."
date: "2026-05-12"
tags: [sso, google-workspace, idp-delegation, administration, enterprise]
---

Google Workspace doesn't expose a SCIM 2.0 group provisioning API, so the Seqera group catalog is populated manually for Google Workspace organizations. This guide explains the format Seqera expects and where to find the right value in your Google Workspace administrator console.

## Before you begin

- Administrator access to your Google Workspace admin console.
- Organization owner access to your Seqera organization.
- An active SSO connection. See [Google authentication](../../google).

:::note
Google Workspace doesn't include group memberships in OIDC tokens by default. Before catalog entries match at login, configure your IdP to emit a `groups` claim and complete the [IdP claim mapping](../claim-mapping) guidance.
:::

## What value to enter

Google Workspace identifies groups in OIDC tokens by the **group's primary email address**, not its display name. The value you enter in the Seqera catalog must match that email exactly — for example:

```
nextflow-admins@yourcompany.com
```

The value is case-insensitive but must include the full domain. Seqera matches the user's `groups` claim against this value at login.

## Find a group's primary email

1. Sign in to your Google Workspace admin console at [admin.google.com](https://admin.google.com).
2. Open **Directory**, then **Groups**.
3. Select the group you want to add to Seqera.
4. Copy the **Group email** value at the top of the group's details page.

## Add the group to Seqera

1. In Seqera, open **Organization settings** and select **Manage single sign-on**, then **Group mapping**.
2. Select **Add manual group**.
3. In **Group name**, paste the group's email address.
4. (Optional) In **Display name**, enter a human-friendly label for the group. This appears in the **IdP Group** dropdown on the team form.
6. (Optional) Select a Linked team
7. Select **Add**.

The group now appears in the catalog. To delegate a team to this group, see [Delegate a Team to an IdP group](../../../../../orgs-and-teams/teams#delegate-a-team-to-an-idp-group).

## Verify the value at login

If a delegated team isn't picking up users you expect, inspect what Google Workspace is actually emitting:

1. Sign in to a Seqera test account using SSO.
2. In your Seqera Enterprise instance logs, look for the SSO callback log line. It records the full claim set the platform received.
3. Confirm the `groups` claim is present and that its values match the catalog entries.

## Limitations

- Google Workspace doesn't support SCIM group sync, so renames and deletes don't propagate automatically. If you rename a group in Workspace, update the catalog entry in Seqera. If you delete a group, also delete the catalog entry to avoid stale references.
- Nested groups are flattened by Google Workspace into the user's `groups` claim. A user is a member of any group whose membership chain reaches them.

## Multi-organization deployments

On Enterprise instances that host more than one organization, group display names must be unique across all organizations. The manual-add form rejects a value with `409 Conflict` if another organization already has a catalog entry with the same display name. See [Multi-organization routing](../multi-org-routing).

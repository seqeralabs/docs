---
title: "Manual entry for Google Workspace"
description: "Populate Seqera's IdP group catalog manually for Google Workspace organizations."
date created: "2026-05-12"
last updated: "2026-05-12"
tags: [sso, google-workspace, idp-delegation, administration, cloud-pro]
---

Google Workspace doesn't expose a SCIM 2.0 group provisioning API, so the Platform group catalog is populated manually for Google Workspace organizations. This guide explains the format Platform expects and where to find the right value in your Google Workspace administrator console.

## Before you begin

- Administrator access to your Google Workspace admin console.
- Organization owner access to your Seqera organization.
- An active SSO connection. To set up SSO, see [Single sign-on (SSO)](../../single-sign-on).

## What value to enter

Google Workspace identifies groups in OIDC tokens by the **group's primary email address**, not its display name. The value you enter in the Platform catalog must match that email exactly — for example:

```
nextflow-admins@yourcompany.com
```

The value is case-insensitive but must include the full domain. Platform matches the user's `groups` claim against this value at login.

## Find a group's primary email

1. Sign in to your Google Workspace admin console at [admin.google.com](https://admin.google.com).
2. Open **Directory**, then **Groups**.
3. Select the group you want to add to Platform.
4. Copy the **Group email** value at the top of the group's details page.

## Add the group to Seqera

1. In Seqera, open **Organization settings** and select **Manage single sign-on**, then **Group mapping**.
2. Select **Add group manually**.
3. In **Group identifier**, paste the group's email address.
4. (Optional) In **Display name**, enter a human-friendly label for the group. This appears in the **IdP Group** dropdown on the team form.
5. Select **Save**.

The group now appears in the catalog and in the **IdP Group** dropdown on the team form. To delegate a team to this group, see [Delegate a team to an IdP group](../delegate-a-team).

## Verify the value at login

If a delegated team isn't picking up users you expect, the most common cause is a mismatch between the value you entered and the value Google Workspace actually emits in the user's token.

To inspect the value:

1. Sign in to a Seqera Cloud Pro test account using SSO.
2. In your Auth0 tenant, open **Monitoring**, then **Logs**, and find the **Success Login** event for your test user.
  3. Look for `user.groups` in the event details. The values listed there are the exact strings Platform matches against the catalog.

## Limitations

- Google Workspace doesn't support SCIM group sync, so renames and deletes don't propagate automatically. If you rename a group in workspace, update the catalog entry in Platform. If you delete a group in workspace, also delete the catalog entry to avoid stale references.
- Nested groups are flattened by Google Workspace into the user's `groups` claim. A user is a member of any group whose membership chain reaches them.

:::tip
A manually-entered group is automatically promoted to SCIM-managed if your IdP later pushes the same group via SCIM. If you migrate from Google Workspace to an IdP that supports SCIM, your existing delegations continue to work without reconfiguration.
:::

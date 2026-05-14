---
title: "Manual entry for Keycloak"
description: "Populate Seqera's IdP group catalog manually for Keycloak realms."
date created: "2026-05-12"
last updated: "2026-05-12"
tags: [sso, keycloak, idp-delegation, administration, cloud-pro]
---

Keycloak doesn't expose a SCIM 2.0 group provisioning API by default, so the Platform group catalog is populated manually for Keycloak realms. This guide explains the format Platform expects and where to find the right value in your Keycloak administrator console.

## Before you begin

- Administrator access to your Keycloak realm.
- Organization owner access to your Seqera organization.
- An active SSO connection. To set up SSO, see [Single sign-on (SSO)](../../single-sign-on).
- A **Group Membership** mapper configured on the client scope your Platform connection uses, so the `groups` claim is included in tokens.

## What value to enter

Keycloak emits group memberships as **group paths** in the `groups` claim — for example:

```
/engineering/admins
```

The leading slash and the full path are significant. If your Group Membership mapper is configured with **Full group path: OFF**, Keycloak emits just the group name (`admins`) instead. The value in the Seqera catalog must match the token format exactly.

:::caution
Check the **Full group path** setting on your Group Membership mapper before adding catalog entries. Mixing full paths and bare names within the same realm leads to login-time mismatches that are hard to diagnose. Pick one format and use it consistently.
:::

## Find a group's path

1. Sign in to your Keycloak administrator console.
2. Open the realm containing the Seqera client.
3. Select **Groups** in the left sidebar.
4. Navigate to the group you want to add to Platform. The path shown in the breadcrumb is the value Keycloak emits when **Full group path** is **ON**.

## Add the group to Platform

1. In Platform, open **Organization settings** and select **Manage single sign-on**, then **Group mapping**.
2. Select **Add group manually**.
3. In **Group identifier**, paste the group path (with the leading slash) or the bare group name, matching your Keycloak Group Membership mapper configuration.
4. (Optional) In **Display name**, enter a human-friendly label for the group.
5. Select **Save**.

The group now appears in the catalog and in the **IdP Group** dropdown on the team form. To delegate a team to this group, see [Delegate a team to an IdP group](../delegate-a-team).

## Verify the value at login

If a delegated team isn't picking up users you expect, inspect what Keycloak is actually emitting:

1. Sign in to a Cloud Pro test account using SSO.
2. In your Auth0 tenant, open **Monitoring**, then **Logs**, and find the **Success Login** event for your test user.
3. Look for `user.groups` in the event details. The values listed there are the exact strings Platform matches against the catalog.

If you see no `groups` claim in the Auth0 log, your Keycloak Group Membership mapper isn't attached to the client scope. See [Auth0 connection mapping](../auth0-connection-mapping) for the upstream scope and attribute requirements.

## Limitations

- Keycloak doesn't push group changes to Platform automatically. If you rename a group in Keycloak, update the catalog entry in Platform. If you delete a group, also delete the catalog entry to avoid stale references.
- Nested groups in Keycloak each emit their own path in the `groups` claim. A user who belongs to `/engineering/admins` is emitted as a member of `/engineering/admins` only, not also of `/engineering`. Add catalog entries for every level you want to delegate.

:::tip
A manually-entered group is automatically promoted to SCIM-managed if your IdP later pushes the same group via SCIM. If you adopt a Keycloak SCIM extension in the future, your existing delegations continue to work without reconfiguration.
:::

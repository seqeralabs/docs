---
title: "IdP claim mapping"
description: "Configure your identity provider and Auth0 connection to deliver the groups claim to Seqera Platform Cloud at login."
date created: "2026-06-29"
last updated: "2026-07-09"
tags: [sso, idp delegation, oidc, organization settings, cloud pro]
---

For IdP-delegated teams to evaluate correctly at login, tokens that reach Seqera must include a `groups` claim. Cloud Pro authenticates through Auth0, so two layers are involved:

- Your **identity provider** emits the group membership for each user.
- The **Auth0 connection** that fronts your SSO passes that group data through to Seqera as a `groups` claim.

Configure the group emission at the IdP. The Auth0 self-service SSO connection passes the claim through to Seqera.

:::caution
Keep the claim configuration stable after you delegate teams. If the `groups` claim stops reaching Seqera — for example, the Auth0 Post-Login Action is removed, or the IdP claim mapping is deleted — all delegated team memberships are revoked at next login. A malformed claim (not a list of strings) is ignored, and existing memberships are preserved.
:::

## Identity provider configuration

Configure your identity provider to emit a `groups` claim so team membership flows into the catalog. The steps differ by provider.

### Okta

In Okta, add a custom claim to the authorization server that backs your application:

1. In the Okta administrator console, open **Security**, then **API**, then **Authorization Servers**.
2. Select the authorization server backing your application (typically `default`).
3. Open **Claims**, then **Add claim**.
4. Set:
   - **Name**: `groups`
   - **Include in token type**: **ID Token** (and **Access Token** if you use access tokens for downstream services)
   - **Value type**: **Groups**
   - **Filter**: Match the groups you want exposed (`Matches regex .*` to expose all of them).
5. Select **Save**.

### Entra ID

Entra ID requires an app-registration change. Pay attention to the format Entra emits.

1. In the Azure portal, open the app registration that backs your connection.
2. Open **Token configuration**, then **Add groups claim**.
3. Select the group types to emit (typically **Security groups**).
4. Under **Customize token properties by type**, choose whether to emit **Group ID** (object GUIDs) or **sAMAccountName** (display names where supported).
5. In Entra ID's **Token Preview**, confirm that a sample sign-in includes the `groups` claim.

:::caution
With **Group ID** selected, Entra ID emits group object GUIDs. You have two options:

- Use the GUID values as the catalog identifier and the **IdP Group** field on each team. This works but makes the catalog harder to read.
- Configure Entra ID to emit display names instead. Set **sAMAccountName** as the source where supported, or post-process via a custom claims policy.

The GUID and the display name don't both flow at the same time. Pick one approach for your tenant and use it consistently.
:::

## Verify the mapping

After saving the IdP changes, confirm the claim reaches Platform:

1. Sign in to Platform as a test user via SSO.
2. Confirm the user is added to the expected delegated teams. If they aren't, the `groups` claim either isn't reaching Seqera or doesn't match the catalog identifiers.

:::caution
If a test user's token carries no `groups` claim, or the claim is empty, all of their delegated team memberships are revoked at that login. Verify the mapping with a test user before you delegate production teams.
:::

For sign-in and claim problems, see [SSO troubleshooting](../../troubleshooting_and_faqs/sso_troubleshooting).

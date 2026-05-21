---
title: "IdP claim mapping"
description: "Configure your identity provider to include the groups claim in OIDC tokens issued to Seqera Platform Enterprise."
date: "2026-05-12"
tags: [sso, idp-delegation, oidc, administration, enterprise]
---

For IdP-delegated teams to evaluate correctly at login, the tokens your identity provider sends to Platform must include a `groups` claim. This page lists the per-IdP configuration steps for the supported providers.

Enterprise reads the IdP's tokens directly.

## OIDC providers

### Okta

1. In the Okta administrator console, open **Security**, then **API**, then **Authorization Servers**.
2. Select the authorization server backing your Seqera application (typically `default`).
3. Open **Claims**, then **Add claim**.
4. Set:
   - **Name**: `groups`
   - **Include in token type**: **ID Token** (and **Access Token** if you use access tokens for downstream services)
   - **Value type**: **Groups**
   - **Filter**: Match the groups you want exposed (`Matches regex .*` to expose all of them).
5. Select **Save**.

### Entra ID

Entra ID requires an app-registration change and attention to the format Entra emits.

1. In the Azure portal, open the app registration that backs your Platform connection.
2. Open **Token configuration**, then **Add groups claim**.
3. Select the group types you want emitted (typically **Security groups**).
4. Under **Customize token properties by type**, choose whether to emit **Group ID** (object GUIDs) or **sAMAccountName** (display names where supported).
5. Confirm via Entra ID's **Token Preview** that a sample sign-in includes the `groups` claim.

:::caution
With **Group ID** selected, Entra ID emits group object GUIDs. You have two options:

- Use the GUID values directly as the catalog identifier and the **IdP Group** field on each team. This works but makes the catalog harder to read.
- Configure Entra ID to emit display names instead. Set **sAMAccountName** as the source where supported, or post-process via a custom claims policy.

The GUID and the display name don't both flow at the same time, so pick one approach for your tenant and stick with it.
:::

## Verify the mapping

After saving the IdP changes, confirm the claim is reaching Platform::

1. Sign in to Platform as a test user via SSO.
2. In your Platform instance logs, look for the SSO callback log line. It records the full claim set received.
3. Confirm the `groups` claim is present and contains the expected group identifiers.

:::caution
Platform treats an absent or empty `groups` claim as no-membership, not as "no change." If the claim ever stops flowing after an IdP config rollback, a misapplied policy, or a token-format change, affected users lose their delegated team access at their next login. Fix the IdP-side mapping before delegating production teams.
:::

---
title: "IdP claim mapping"
description: "Configure your identity provider to include the groups claim in OIDC or SAML tokens issued to Seqera Platform Enterprise."
date: "2026-05-12"
tags: [sso, idp-delegation, oidc, saml, administration, enterprise]
---

For IdP-delegated Teams to evaluate correctly at login, the tokens your identity provider sends to Seqera must include a `groups` claim. This page lists the per-IdP configuration steps for the supported providers.

Unlike Cloud Pro — which authenticates through Auth0 and requires a connection-level mapping in the Auth0 tenant — Enterprise reads the IdP's tokens directly. The mapping happens at the IdP, not in front of it.

## OIDC providers

### Okta

1. In the Okta administrator console, open **Security**, then **API**, then **Authorization Servers**.
2. Select the authorization server backing your Seqera application (typically `default`).
3. Open **Claims**, then **Add claim**.
4. Set:
   - **Name** — `groups`
   - **Include in token type** — **ID Token** (and **Access Token** if you use access tokens for downstream services)
   - **Value type** — **Groups**
   - **Filter** — match the groups you want exposed (`Matches regex .*` to expose all of them).
5. Save.

### Entra ID

Entra ID requires an app-registration change, plus attention to the format Entra emits.

1. In the Azure portal, open the app registration that backs your Seqera connection.
2. Open **Token configuration**, then **Add groups claim**.
3. Select the group types you want emitted (typically **Security groups**).
4. Under **Customize token properties by type**, choose whether to emit **Group ID** (object GUIDs) or **sAMAccountName** (display names where supported).
5. Confirm via Entra ID's **Token Preview** that a sample sign-in includes the `groups` claim.

:::caution
With **Group ID** selected, Entra ID emits group object GUIDs. You have two options:

- Use the GUID values directly as the catalog identifier and the **IdP Group** field on each Team. This works but makes the catalog harder to read.
- Configure Entra ID to emit display names instead — set **sAMAccountName** as the source where supported, or post-process via a custom claims policy.

The GUID and the display name don't both flow at the same time, so pick one approach for your tenant and stick with it.
:::

### Keycloak

1. In your Keycloak administrator console, open the realm containing the Seqera client.
2. Open **Client scopes**, then **Create client scope**.
3. Set **Name** to `groups` and **Type** to **Default**.
4. Open the new scope's **Mappers** tab and create a **Group Membership** mapper:
   - **Token Claim Name** — `groups`
   - **Full group path** — **OFF** if you want simple group names; **ON** if you prefer paths like `/engineering/admins`. Match this with what you store in the Seqera catalog.
   - **Add to ID token** — **ON**
   - **Add to access token** — **ON** (if used)
5. Open **Clients**, then your Seqera client, then **Client scopes**, and add the `groups` scope to the **Default Client Scopes** list.

### Google Workspace

Google Workspace doesn't include group memberships in OIDC tokens by default. There is no token-level configuration to enable this directly. Seqera Platform Enterprise installations on Google Workspace must use the [manual entry flow](./group-catalog/manual-google-workspace) and rely on the email-address claim chain. Contact Seqera support if you need an alternative configuration for your deployment.

## SAML providers

For SAML SSO connections, configure the IdP's attribute statement to include groups:

| IdP | Attribute name | Notes |
|-----|----------------|-------|
| Okta | `groups` | Set the **Filter** to match the groups you want emitted. |
| Entra ID | `http://schemas.microsoft.com/ws/2008/06/identity/claims/groups` | Same GUID-vs-display-name caveat as the OIDC flow. |
| Other SAML providers | Configure the attribute name to match what your IdP emits. | — |

Seqera reads the `groups` claim from the SAML response on every login.

## Verify the mapping

To confirm the `groups` claim is reaching Seqera:

1. Have a test user sign in via SSO.
2. In your Seqera Enterprise instance logs, look for the SSO callback log line. It records the full claim set the platform received.
3. Confirm the `groups` claim is present and contains the expected group identifiers.

If the claim is missing or empty, the user's delegated-Team memberships are revoked at login (this is by design — Seqera treats absent claims as no-membership). Fix the IdP-side mapping before delegating production Teams.

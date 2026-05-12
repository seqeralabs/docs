---
title: "Auth0 connection mapping"
description: "Map your IdP's groups claim through Auth0 so Seqera can see it at login."
date created: "2026-05-12"
last updated: "2026-05-12"
tags: [sso, auth0, idp-delegation, administration, cloud-pro]
---

For IdP delegation to work on Cloud Pro, your IdP's `groups` claim must reach Seqera at login. Cloud Pro authenticates through Auth0, and Auth0 needs to be told how to extract the `groups` claim from the upstream IdP's token and surface it on the Auth0 user profile. This page provides copy-pasteable mapping snippets for the supported protocols and IdPs.

:::caution
Auth0 connection mapping is configured in **your** Auth0 tenant for Cloud Pro organizations that bring their own connection. Seqera cannot configure it on your behalf. Without this configuration, delegated Teams will never match — the `groups` claim won't be available at login evaluation time.
:::

## Before you begin

- An active SSO connection. See [Single sign-on (SSO)](../single-sign-on).
- Administrator access to the Auth0 tenant that hosts your SSO connection.
- A populated IdP group catalog in Seqera. See [Manage your IdP group catalog](./group-catalog/overview).

## Where to apply these snippets

In Auth0:

1. Open **Authentication**, then **Enterprise** (or the section matching your connection type).
2. Select the connection that fronts your IdP.
3. Open **Settings**, then **Mappings** (or the equivalent for your connection type).
4. Paste the snippet for your protocol from one of the sections below.

## OIDC connections

For OIDC connections (Okta, Keycloak, Google Workspace, generic OIDC), use this `attribute_map`:

```json
{
  "mapping_mode": "use_map",
  "attributes": {
    "name": "${context.tokenset.name}",
    "given_name": "${context.tokenset.given_name}",
    "family_name": "${context.tokenset.family_name}",
    "nickname": "${context.tokenset.nickname}",
    "picture": "${context.tokenset.picture}",
    "email": "${context.tokenset.email}",
    "email_verified": "${context.tokenset.email_verified}",
    "groups": "${context.tokenset.groups}"
  },
  "userinfo_scope": "openid email profile groups",
  "bind_all": true
}
```

The two entries specific to delegation are:

- `"groups": "${context.tokenset.groups}"` — copies the `groups` claim from the IdP's token into the Auth0 user profile.
- `"userinfo_scope": "openid email profile groups"` — instructs Auth0 to request the `groups` scope from the IdP. Required for IdPs that gate group claims on a scope (Keycloak does; Okta does not).

## SAML connections

For SAML connections, use this `fieldsMap`:

```json
{
  "groups": "<the SAML attribute name your IdP uses for groups>"
}
```

The right-hand value differs by IdP:

| IdP | SAML attribute name |
|-----|---------------------|
| Okta | `groups` |
| Entra ID | `http://schemas.microsoft.com/ws/2008/06/identity/claims/groups` |
| Other SAML providers | Check your IdP's SAML attribute statement configuration. |

:::caution
Entra ID's default group claim emits **group object GUIDs** (for example, `a8b3c0d1-...`), not display names. You have two options:

- **Recommended** — configure Entra ID to emit display names. In the Entra application registration, open **Token configuration**, then **Add groups claim**, and configure the source attribute to emit display names where supported. Refer to Microsoft's documentation for the current UI flow.
- **Alternative** — use the GUID itself as the **IdP Group** value on each Team and as the catalog identifier when adding groups manually. This works but makes the catalog harder to read.
:::

## Verify the mapping

After saving the mapping in Auth0:

1. Sign out of Seqera, then sign in again as a test user who's a member of at least one IdP group.
2. In Auth0, open **Monitoring**, then **Logs**, and find the **Success Login** event for your test user.
3. Expand the event details and look for `user.groups`. It should contain the array of group identifiers your IdP emitted.

If `user.groups` is empty or missing:

- Confirm the IdP itself is sending groups in the token. Most IdPs expose raw tokens through their administrator console — for example, Okta's **Token Preview** and Entra's **Token Configuration**.
- Confirm the scope or attribute name in your snippet matches the IdP's emission.
- Check Auth0's real-time logs during a login attempt for errors in the mapping.

Once `user.groups` is populated, sign in to Seqera as the test user. Their delegated-Team memberships should reflect their IdP group membership immediately.

---
title: "Authentication"
description: Configure authentication and identity providers for Seqera Platform
date: "2026-01-27"
tags: [authentication, configuration, sso, oidc]
---

Seqera Platform supports email and various OAuth providers for login authentication.


## Identity providers

Configure single sign-on (SSO) login with any of the following identity providers:

| Provider               | Protocol | Configuration    |
| :--------------------- | :------- | :--------------- |
| [GitHub](./github)     | OAuth    | `TOWER_GITHUB_*` |
| [Google](./google)     | OAuth    | `TOWER_GOOGLE_*` |
| [Keycloak](./keycloak) | OIDC     | `TOWER_OIDC_*`   |
| [Entra ID](./entra)    | OIDC     | `TOWER_OIDC_*`   |
| [Okta](./okta)         | OIDC     | `TOWER_OIDC_*`   |

## OpenID Connect configuration

:::note
You can combine different OAuth and OIDC provider types. However, only one OIDC provider can be configured at a time.
:::

For OIDC providers, configure authentication with these environment variables:

| Variable            | Description                                                                                 |
| :------------------ | :------------------------------------------------------------------------------------------ |
| `TOWER_OIDC_CLIENT` | The client ID provided by your authentication service                                       |
| `TOWER_OIDC_SECRET` | The client secret provided by your authentication service                                   |
| `TOWER_OIDC_ISSUER` | The authentication service URL to which Seqera connects to authenticate the sign-in request |

Some providers require the full authentication service URL while others require only the SSO root domain (without the trailing sub-directories).

In your OpenID provider settings, specify the following URL as a callback address or authorized redirect:

```
https://<HOST_OR_IP>/oauth/callback/oidc
```

## Root users

Root users have administrative access to all Platform resources. Configure root users by their user ID or email address in a comma-separated list:

**Environment variable**

```env
TOWER_ROOT_USERS=1,admin@your-company.example.com
```

**tower.yml**

```yaml
tower:
  admin:
    root-users: "1,admin@your-company.example.com"
```

## Disable email login

Disable email-based (magic link) authentication when OAuth providers are configured.

:::note
This setting only takes effect when at least one OAuth provider (GitHub, Google) or OIDC is configured.
:::

**Environment variable**

```env
TOWER_AUTH_DISABLE_EMAIL=true
```

**tower.yml**

```yaml
tower:
  auth:
    disable-email: true
```

## Session management

Platform login sessions remain active as long as the application browser window remains open and active. Sessions use short-lived access tokens that are automatically refreshed via heartbeat.

| Setting                    | Default    | Description                                                            |
| :------------------------- | :--------- | :--------------------------------------------------------------------- |
| `micronaut.security.token.generator.access-token.expiration`       | 3600s (1h) | Short-lived token, auto-refreshed via heartbeat                             |
| `micronaut.security.token.jwt.signatures.refresh-token.expiration` | 6h         | Session idle timeout — users are logged out after this period of inactivity |
| `micronaut.security.token.refresh.cookie.cookie-max-age`           | 12h        | Browser cookie lifetime (should be ≥ refresh token)                         |

**tower.yml**

```yaml
micronaut:
  security:
    token:
      jwt:
        signatures:
          refresh-token:
            expiration: 8h
      generator:
        access-token:
          expiration: 3600
      refresh:
        cookie:
          cookie-max-age: 10h
```

## User access allow list

Restrict access to specific user email addresses or domains. Allow list entries are case-insensitive.

Replace `<PROVIDER>` with `github`, `google`, or `oidc`. Use `oidc` for any authentication service based on OpenID Connect (Okta, Entra ID, Keycloak, etc.). Include each provider separately if you configure more than one.

**tower.yml**

```yaml
tower:
  auth:
    <PROVIDER>:
      allow-list:
        - "*@your-company.example.com"
        - "specific-user@another-company.example.net"
```

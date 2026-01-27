---
title: "Entra ID"
description: Configure Microsoft Entra ID as an identity provider for Seqera Platform
date: "2026-01-27"
tags: [authentication, entra, azure, oidc]
---

Configure [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc) as a single sign-on (SSO) provider for Seqera Platform using OpenID Connect.

## Prerequisites

Before you begin, you need:

- An Azure account with Entra ID access
- Permission to create app registrations

Ensure you know how to register applications in Entra ID. See Microsoft's documentation on [registering an application](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) for more information.

## Register an Entra ID application

1. In the [Azure portal](https://portal.azure.com/), go to **Entra ID > App Registrations**.
2. Select **New Registration** and specify a name and supported account types.
3. Set the redirect URI to `https://<HOST>/oauth/callback/oidc` (must be HTTPS) - replace `<HOST>` with your enterprise installation hostname.
4. Note the **Application (client) ID** from the app overview.
5. Go to **Certificates & secrets** and create a new client secret. Note the secret value.
6. Go to **Endpoints** and note the OpenID Connect metadata document URI (up to `v2.0`).

## Configure Seqera

Add the following environment variables to your Seqera configuration:

| Variable | Description |
| :------- | :---------- |
| `TOWER_OIDC_CLIENT` | The application (client) ID from step 4 |
| `TOWER_OIDC_SECRET` | The client secret from step 5 |
| `TOWER_OIDC_ISSUER` | The issuer URL from step 6, e.g., `https://login.microsoftonline.com/<tenant-id>/v2.0` |

Add `auth-oidc` to the `MICRONAUT_ENVIRONMENTS` environment variable for both the `cron` and `backend` services.

### User consent settings

Configure user consent settings to **Allow user consent for apps** to ensure admin approval is not required for each login. See [User consent settings](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/configure-user-consent?pivots=portal#configure-user-consent-settings).

### Compatibility note

Users on Seqera Platform version 25.2.3 and below may need to set the following environment variable to resolve an authentication method incompatibility:

```env
MICRONAUT_SECURITY_OAUTH2_CLIENTS_OIDC_OPENID_TOKEN_AUTH_METHOD=client_secret_post
```

## Restrict access

To restrict access to specific email addresses or domains, configure an allow list in `tower.yml`:

```yaml
tower:
  auth:
    oidc:
      allow-list:
        - "*@your-company.example.com"
        - "specific-user@another-company.example.net"
```

See [User access allow list](./overview#user-access-allow-list) for more information.

---
title: "Keycloak"
description: Configure Keycloak as an identity provider for Seqera Platform
date: "2023-04-21"
tags: [authentication, keycloak, oidc]
---

Configure [Keycloak](https://www.keycloak.org/) as a single sign-on (SSO) provider for Seqera Platform using OpenID Connect.

## Prerequisites

Before you begin, you need:

- A Keycloak instance
- Admin access to create clients in Keycloak

Ensure you know how to configure Keycloak clients. See the [Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/#assembly-managing-clients_server_administration_guide) for more information.

## Create a Keycloak client

1. In **Realm settings**, verify the **Endpoints** field includes _OpenID Endpoint Configuration_.
2. Go to **Clients** and select **Create**.
3. Configure the client with protocol `openid-connect`, access type `confidential`, and redirect URI `https://<HOST>/oauth/callback/oidc`.
4. In the **Credentials** tab, note the **Secret**.
5. In the **Keys** tab, set **Use JWKS URL** to `OFF`.
6. Note the issuer URL from **Realm Settings > Endpoints > OpenID Configuration** (the `issuer` value in the JSON).

## Configure Seqera

Add the following environment variables to your Seqera configuration:

| Variable | Description |
| :------- | :---------- |
| `TOWER_OIDC_CLIENT` | The client ID from step 3 |
| `TOWER_OIDC_SECRET` | The secret from step 4 |
| `TOWER_OIDC_ISSUER` | The issuer URL from step 6, e.g., `https://keycloak.example.com/auth/realms/master` |

## Restrict access

To restrict access to specific email addresses or domains, configure an allow list in `tower.yml`:

```yaml
tower:
  auth:
    oidc:
      allow-list:
        - "*@your-company.com"
        - "specific-user@example.com"
```

See [User access allow list](./overview#user-access-allow-list) for more information.

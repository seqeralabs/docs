---
title: "Okta"
description: Configure Okta as an identity provider for Seqera Platform
date: "2023-04-21"
tags: [authentication, okta, oidc]
---

Configure [Okta](https://www.okta.com/) as a single sign-on (SSO) provider for Seqera Platform using OpenID Connect.

## Prerequisites

Before you begin, you need:

- An Okta organization
- Administrator access to create applications

Ensure you know how to create Okta app integrations. See Okta's documentation on [creating OIDC app integrations](https://help.okta.com/en-us/content/topics/apps/apps_app_integration_wizard_oidc.htm) for more information.

## Create an Okta app integration

1. In the **Admin Console**, go to **Applications > Applications**.
2. Select **Create App Integration**.
3. Select **OIDC - OpenID Connect** as the sign-in method and **Web Application** as the application type.
4. Enter a name for the app, e.g., `Seqera`.
5. Set the sign-in redirect URI to `https://<HOST>/oauth/callback/oidc`.
6. Set the sign-out redirect URI to `https://<HOST>/logout`.
7. Note the **Client ID** and **Client secret** from the application settings.
8. Note the **Issuer** URL from **Sign On > OpenID Connect ID Token**.

## Configure Seqera

Add the following environment variables to your Seqera configuration:

| Variable | Description |
| :------- | :---------- |
| `TOWER_OIDC_CLIENT` | The client ID from step 7 |
| `TOWER_OIDC_SECRET` | The client secret from step 7 |
| `TOWER_OIDC_ISSUER` | The issuer URL from step 8 |

:::note
Connection strings can differ based on the issuer type. Verify the issuer URL via the Okta console.
:::

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

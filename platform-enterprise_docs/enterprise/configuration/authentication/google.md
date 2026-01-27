---
title: "Google"
description: Configure Google as an identity provider for Seqera Platform
date: "2026-01-27"
tags: [authentication, google, oauth]
---

Configure Google as a single sign-on (SSO) provider for Seqera Platform.

## Prerequisites

Before you begin, you need:

- A Google Cloud account
- Permission to create OAuth credentials in the Google Cloud console

Ensure you know how to create Google OAuth credentials. See Google's documentation on [setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849) for more information.

## Create Google OAuth credentials

1. In the [Google Cloud console](https://console.developers.google.com), create a new project or select an existing one.
2. Go to **APIs & Services > Credentials**.
3. Select **Create credentials > OAuth client ID**.
4. Select **Web Application** as the application type.
5. Add your redirect URI: `https://<HOST>/oauth/callback/google` (must be HTTPS) - replace `<HOST>` with your enterprise installation hostname.
6. Note your **Client ID** and **Client secret**.

## Configure Seqera

Add the following environment variables to your Seqera configuration:

| Variable | Description |
| :------- | :---------- |
| `TOWER_GOOGLE_CLIENT` | The client ID from step 6 |
| `TOWER_GOOGLE_SECRET` | The client secret from step 6 |

## Restrict access

To restrict access to specific email addresses or domains, configure an allow list in `tower.yml`:

```yaml
tower:
  auth:
    google:
      allow-list:
        - "*@your-company.example.com"
        - "specific-user@another-company.example.net"
```

See [User access allow list](./overview#user-access-allow-list) for more information.

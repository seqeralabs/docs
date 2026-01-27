---
title: "GitHub"
description: Configure GitHub as an identity provider for Seqera Platform
date: "2026-01-27"
tags: [authentication, github, oauth]
---

Configure GitHub as a single sign-on (SSO) provider for Seqera Platform.

## Prerequisites

Before you begin, you need:

- A GitHub organization
- Permission to create OAuth Apps in your organization

Ensure you know how to create a GitHub OAuth app. See GitHub's documentation on [creating an OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) for more information.

## Create a GitHub OAuth App

1. In **Profile > Settings > Developer settings**, select **OAuth Apps**.
2. Select **New OAuth App**.
3. Complete the required fields. In the **Authorization callback URL** field, enter `https://<HOST>/oauth/callback/github` (must be HTTPS) - replace `<HOST>` with your enterprise installation hostname.
4. Note your **Client ID**.
5. Generate a client secret, then note your **Client secret**.

## Configure Seqera

Add the following environment variables to your Seqera configuration:

| Variable | Description |
| :------- | :---------- |
| `TOWER_GITHUB_CLIENT` | The client ID from step 4 |
| `TOWER_GITHUB_SECRET` | The client secret from step 5 |

## Restrict access

To restrict access to specific email addresses or domains, configure an allow list in `tower.yml`:

```yaml
tower:
  auth:
    github:
      allow-list:
        - "*@your-company.example.com"
        - "specific-user@another-company.example.net"
```

See [User access allow list](./overview#user-access-allow-list) for more information.

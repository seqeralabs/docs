---
title: "Email"
description: Configure email-based authentication for Seqera Platform
date: "2026-01-27"
tags: [authentication, email, passwordless]
---

Configure email-based passwordless authentication for Seqera Platform. This is the default authentication method that allows users to sign in using their email address.

## Overview

Email authentication provides a passwordless login experience where users:

1. Enter their email address on the login page
2. Receive an email containing a temporary access link
3. Click the link to authenticate and access the platform

New users are automatically registered on their first login if their email address matches the trusted email patterns. The access link contains a time-limited token that expires after use.

## Prerequisites

Before enabling email authentication, you need:

- A configured SMTP server for sending authentication emails
- Valid SMTP credentials with permission to send emails

## Configure SMTP

Email authentication requires an SMTP server to send login links. Add the following environment variables to your Seqera configuration:

| Variable              | Description                                              | Required                      |
| :-------------------- | :------------------------------------------------------- | :---------------------------- |
| `TOWER_SMTP_HOST`     | SMTP server hostname                                     | Yes                           |
| `TOWER_SMTP_PORT`     | SMTP server port (e.g., 587 for TLS, 25 for unencrypted) | Yes                           |
| `TOWER_SMTP_USER`     | SMTP username                                            | If authentication is required |
| `TOWER_SMTP_PASSWORD` | SMTP password                                            | If authentication is required |
| `TOWER_SMTP_AUTH`     | Set to `true` to enable SMTP authentication              | No (default: `false`)         |
| `TOWER_CONTACT_EMAIL` | Sender email address for authentication emails           | Yes                           |

:::tip
For development, you can use a local SMTP server like [Mailpit](https://github.com/axllent/mailpit) to test email authentication without sending real emails.
:::

## Restrict access

By default, all email addresses are allowed to authenticate. To restrict access to specific email addresses or domains, configure a trusted email list in `tower.yml`:

```yaml
tower:
  trustedEmails:
    - "*@your-company.com"
    - "*@partner-company.com"
    - "external-user@example.com"
```

Pattern matching:

- `*@domain.com` - allows all emails from the domain
- `*@*.example.com` - allows all subdomains
- `user@domain.com` - allows a specific email address
- `user+*@domain.com` - allows plus addressing (e.g., `user+tag@domain.com`)

When `trustedEmails` is not specified, all email addresses are trusted and can create accounts.

See [User access allow list](./overview#user-access-allow-list) for more information.

## Disable email authentication

To disable email authentication when other authentication providers (OAuth, OIDC, etc.) are configured, add the following environment variable:

| Variable                   | Description                                |
| :------------------------- | :----------------------------------------- |
| `TOWER_AUTH_DISABLE_EMAIL` | Set to `true` to disable email-based login |

:::warning
Email authentication can only be disabled when at least one other authentication provider is configured. Users will not be able to log in if email authentication is disabled without an alternative authentication method.
:::

## Additional options

### Welcome email

Send a welcome email to newly registered users:

| Variable                   | Description                                                          |
| :------------------------- | :------------------------------------------------------------------- |
| `TOWER_USER_WELCOME_EMAIL` | Set to `true` to send welcome emails to new users (default: `false`) |

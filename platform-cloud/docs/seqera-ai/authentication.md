---
title: "Authentication"
description: "Login, logout, and session management for Seqera AI CLI"
date: "15 Dec 2025"
tags: [seqera-ai, cli, authentication, login]
---

:::caution Seqera AI CLI is in beta
Seqera AI CLI is currently in beta. Features and commands may change as we continue to improve the product.
:::

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Seqera AI uses your Seqera Platform account for authentication. This page describes authentication concepts and step-by-step instructions for managing your sessions.

## Authenticating Seqera AI

### Log in

To authenticate with your Seqera Platform account, run:

```bash
seqera login
```

This will:

1. Open your default browser to the Seqera login page
1. Prompt you to sign in with your Seqera Platform credentials
1. Automatically capture the authentication token
1. Display a success message in your terminal

   ```
   Opening browser for authentication...
   Successfully authenticated as user@example.com
   ```

### View session status

To view your current authentication status, run:

```bash
seqera status
```

You should see output similar to:

```console
Logged in as: user@example.com
Session expires: 2025-12-16 14:30:00
```

### Add access tokens for automation

For automated environments, you can provide a Seqera Platform access token directly:

```bash
seqera ai --token <PLATFORM_ACCESS_TOKEN>
```

You can also set the token via environment variable:

```bash
export TOWER_ACCESS_TOKEN=<PLATFORM_ACCESS_TOKEN>
seqera ai
```

This shows your login status, authenticated email, and session details.

### Log out

#### Standard logout

To sign out from the current session, run:

```bash
seqera logout
```

This command revokes your current authentication token and removes locally stored credentials. You will need to re-authenticate on next use.

#### Clear all sessions

To remove all profiles and completely reset authentication, run:

```bash
seqera logout --all
```

This command removes all stored credentials and session data.

## Token refresh

Seqera AI CLI automatically refreshes your authentication token when needed. You are not required to log in again unless:

- You explicitly log out
- Your refresh token expires (typically after extended inactivity)
- Your Seqera Platform account permissions change

## Learn more

- [Seqera AI CLI](index.md): Seqera AI CLI overview
- [Installation](./installation.mdx): Detailed installation instructions
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Seqera AI use cases
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

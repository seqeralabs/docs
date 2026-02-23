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
   [Login] Starting Seqera CLI authentication...
   [Login] ✓ Authentication successful!
   [Login] ✓ Organization set: <org_name>
   ```

### View session status

To view your current session status, use the `/status` command inside the TUI:

```
/status
```

This shows your authentication status and organization details.

### Add access tokens for automation

For automated environments, you can provide a Seqera Platform access token directly using the `SEQERA_ACCESS_TOKEN` environment variable:

```bash
export SEQERA_ACCESS_TOKEN=<PLATFORM_ACCESS_TOKEN>
seqera ai
```

When this environment variable is set, the CLI skips the OAuth login flow and uses the provided token directly.

### Log out

To sign out from the current session, run:

```bash
seqera logout
```

This command revokes your current authentication token and removes locally stored credentials. You will need to re-authenticate on next use.

## Organization management

Seqera AI CLI supports managing your organization selection for billing. Use the `seqera org` command to view and switch organizations.

**View current organization**:

```bash
seqera org
```

**List all organizations**:

```bash
seqera org list
```

**Switch organization**:

```bash
seqera org switch
```

**Clear organization selection**:

```bash
seqera org clear
```

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

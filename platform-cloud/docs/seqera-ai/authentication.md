---
title: "Authentication"
description: "Login, logout, and session management for Seqera CLI"
date created: "2025-12-15"
tags: [seqera-ai, cli, authentication, login]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Co-Scientist. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Co-Scientist uses your Seqera Platform account for authentication. This page describes authentication concepts and step-by-step instructions for managing your sessions.

## Authenticating Co-Scientist

### Log in

To authenticate with your Seqera Platform account, run:

```bash
seqera login
```

This will:

1. Open your default browser to the Seqera login page.
1. Prompt you to sign in with your Seqera Platform credentials.
1. Automatically capture the authentication token.
1. Display a success message in your terminal.

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

### Point a development build at the hosted Co-Scientist backend

If you are testing a development build of the CLI against the hosted production Co-Scientist service, set the following environment variables before starting `seqera ai`.

| Variable | Purpose | Example value |
| --- | --- | --- |
| `SEQERA_AI_BACKEND_URL` | Co-Scientist backend endpoint used by the CLI | `https://ai-api.seqera.io` |
| `SEQERA_AUTH_DOMAIN` | Platform API base URL used for browser-based login | `https://cloud.seqera.io/api` |
| `SEQERA_AUTH_CLI_CLIENT_ID` | OAuth client ID for the Co-Scientist CLI | `seqera_ai_cli` |
| `TOWER_ACCESS_TOKEN` | Platform personal access token used instead of browser login | `<PLATFORM_ACCESS_TOKEN>` |

Use the OAuth login flow:

```bash
export SEQERA_AUTH_DOMAIN=https://cloud.seqera.io/api
export SEQERA_AUTH_CLI_CLIENT_ID=seqera_ai_cli
export SEQERA_AI_BACKEND_URL=https://ai-api.seqera.io
seqera ai
```

Use a Platform personal access token instead of browser login:

```bash
export TOWER_ACCESS_TOKEN=<PLATFORM_ACCESS_TOKEN>
export SEQERA_AI_BACKEND_URL=https://ai-api.seqera.io
seqera ai
```

You only need `SEQERA_AUTH_DOMAIN` and `SEQERA_AUTH_CLI_CLIENT_ID` when using the OAuth login flow.

### Log out

To sign out from the current session, run:

```bash
seqera logout
```

This command revokes your current authentication token and removes locally stored credentials. You will need to re-authenticate on next use.

## Organization management

Co-Scientist CLI supports managing your organization selection for billing. Use the `seqera org` command to view and switch organizations.

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

Co-Scientist CLI automatically refreshes your authentication token when needed. You are not required to log in again unless:

- You explicitly log out
- Your refresh token expires (typically after extended inactivity)
- Your Seqera Platform account permissions change

## Learn more

- [Co-Scientist CLI](index.md): Co-Scientist CLI overview
- [Installation](./installation.md): Detailed installation instructions
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Co-Scientist use cases
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

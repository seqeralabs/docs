---
title: "Authentication"
description: "Log in, log out, and manage organizations and tokens in the Seqera CLI"
date created: "2025-12-15"
last updated: "2026-06-12"
tags: [co-scientist, cli, authentication, login]
---

The Seqera CLI uses your Seqera Platform account to authenticate you with Co-Scientist. This page covers how to log in and out, authenticate in automated environments, connect to your Enterprise backend, and how token refresh works.

:::info[**Prerequisites**]{#prerequisites}
You will need the following to get started:

- [Seqera CLI](./installation.mdx)
- A user account on your Seqera Platform Enterprise deployment
:::

## Log in

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

## View session status

To view your current session status, use the `/status` command inside the TUI:

```
/status
```

This shows your authentication status and organization details.

## Log out

To sign out from the current session, run:

```bash
seqera logout
```

This command revokes your current authentication token and removes locally stored credentials. You will need to re-authenticate on next use.

## Organization management

The Seqera CLI manages your organization selection for billing. Use the `seqera org` commands to view and switch organizations:

- `seqera org`: View your current organization
- `seqera org list`: List all organizations
- `seqera org switch`: Switch organization
- `seqera org clear`: Clear organization selection

## Token refresh

The Seqera CLI automatically refreshes your authentication token when needed. You are not required to log in again unless:

- You explicitly log out
- Your refresh token expires (typically after extended inactivity)
- Your Seqera Platform account permissions change

## Add access tokens for automation

For automated environments, you can provide a Seqera Platform access token directly using the `SEQERA_ACCESS_TOKEN` environment variable:

```bash
export SEQERA_ACCESS_TOKEN=<PLATFORM_ACCESS_TOKEN>
seqera ai
```

When this environment variable is set, the CLI skips the OAuth login flow and uses the provided token directly.

## Connect to an Enterprise backend

Set the following environment variables before starting `seqera ai`:

| Variable | Purpose | Example value |
| --- | --- | --- |
| `SEQERA_AI_BACKEND_URL` | Co-Scientist backend endpoint used by the CLI | `https://ai-api.platform.example.com` |
| `SEQERA_AUTH_DOMAIN` | OIDC authority base URL. The CLI fetches OpenID configuration from this URL and opens the discovered authorization endpoint in your browser. | `https://platform.example.com/api` |
| `SEQERA_AUTH_CLI_CLIENT_ID` | OAuth client ID for the Seqera CLI | `seqera_ai_cli` |
| `TOWER_ACCESS_TOKEN` | Platform personal access token used instead of browser login | `<PLATFORM_ACCESS_TOKEN>` |

Use the OAuth login flow:

```bash
export SEQERA_AUTH_DOMAIN=https://platform.example.com/api
export SEQERA_AUTH_CLI_CLIENT_ID=seqera_ai_cli
export SEQERA_AI_BACKEND_URL=https://ai-api.platform.example.com
seqera ai
```

Use a Platform personal access token instead of browser login:

```bash
export SEQERA_AUTH_DOMAIN=https://platform.example.com/api
export TOWER_ACCESS_TOKEN=<PLATFORM_ACCESS_TOKEN>
export SEQERA_AI_BACKEND_URL=https://ai-api.platform.example.com
seqera ai
```

Set `SEQERA_AUTH_CLI_CLIENT_ID` only for OAuth deployments that use a non-default CLI client ID. Current CLI builds still require `SEQERA_AUTH_DOMAIN` for Enterprise token-based authentication so the CLI can target the correct Platform authority.

## Learn more

- [Co-Scientist](index.md): Co-Scientist overview
- [Installation](./installation.mdx): Install, update, and configure the CLI
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Co-Scientist use cases
- [Usage and cost](./usage-and-cost.md): Co-Scientist usage in Enterprise deployments
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits

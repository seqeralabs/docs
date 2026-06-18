---
title: "Authentication"
description: "Log in, log out, and manage organizations and tokens in the Seqera CLI"
date created: "2025-12-15"
last updated: "2026-06-18"
tags: [co-scientist, cli, authentication, login]
---

The Seqera CLI uses your Seqera Platform account to authenticate you with Co-Scientist. This page covers how to log in and out, authenticate in automated environments, manage your organization, and how token refresh works.

## Log in

To authenticate with your Seqera Platform account, run:

```bash
seqera login
```

This will:

1. Open your default browser to the Seqera login page.
1. Prompt you to sign in with your Seqera Platform credentials.
1. Automatically capture the authentication token.
1. Display a success message in your terminal:

   ```console
   [Login] Starting Seqera CLI authentication...
   [Login] ✓ Authentication successful!
   [Login] ✓ Organization set: <org_name>
   ```

## View session status

To view your current session status, run the `/status` command:

```
/status
```

This shows your authentication status and organization details.

## Add access tokens for automation

For automated environments, provide a Seqera Platform access token directly using the `SEQERA_ACCESS_TOKEN` environment variable:

```bash
export SEQERA_ACCESS_TOKEN=<PLATFORM_ACCESS_TOKEN>
```

When this environment variable is set, the CLI skips the OAuth login flow and uses the provided token directly.

## Point a development build at the hosted Co-Scientist backend

If you are testing a development build of the CLI against the hosted production Co-Scientist service, set the following environment variables before starting `seqera ai`.

| Variable | Purpose | Example value |
| --- | --- | --- |
| `SEQERA_AI_BACKEND_URL` | Co-Scientist backend endpoint used by the CLI | `https://ai-api.seqera.io` |
| `SEQERA_AUTH_DOMAIN` | Platform API base URL used for browser-based login | `https://cloud.seqera.io/api` |
| `SEQERA_AUTH_CLI_CLIENT_ID` | OAuth client ID for the Seqera CLI | `seqera_ai_cli` |
| `TOWER_ACCESS_TOKEN` | Platform personal access token used instead of browser login | `<PLATFORM_ACCESS_TOKEN>` |

Use the OAuth login flow:

```bash
export SEQERA_AUTH_DOMAIN=https://cloud.seqera.io/api
export SEQERA_AUTH_CLI_CLIENT_ID=seqera_ai_cli
export SEQERA_AI_BACKEND_URL=https://ai-api.seqera.io
```

Use a Platform personal access token instead of browser login:

```bash
export TOWER_ACCESS_TOKEN=<PLATFORM_ACCESS_TOKEN>
export SEQERA_AI_BACKEND_URL=https://ai-api.seqera.io
```

:::note
You only need `SEQERA_AUTH_DOMAIN` and `SEQERA_AUTH_CLI_CLIENT_ID` when using the OAuth login flow.
:::

## Manage organizations

The Seqera CLI operates against one organization at a time, which determines billing.
Use `seqera org` commands to view or change the active organization.

View your current organization:

```bash
seqera org
```

List all organizations:

```bash
seqera org list
```

Switch organization:

```bash
seqera org switch
```

Clear organization selection:

```bash
seqera org clear
```

## Refresh tokens

The Seqera CLI automatically refreshes your authentication token when needed. You are not required to log in again unless:

- You explicitly log out
- Your refresh token expires (typically after extended inactivity)
- Your Seqera Platform account permissions change

## Log out

To sign out from the current session, run:

```bash
seqera logout
```

This command revokes your current authentication token and removes locally stored credentials. You will need to re-authenticate on next use.

## Learn more

- [Quickstart](./quickstart.md): Run your first Co-Scientist session
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Using Co-Scientist](./configuration.md): Configure modes, sessions, skills, command approval, and more
- [Coding Agents](./coding-agents.md): Install Co-Scientist as a skill in your coding agent
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

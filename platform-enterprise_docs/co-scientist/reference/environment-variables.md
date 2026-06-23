---
title: "Environment variables"
description: "Environment variables for authenticating and configuring the Seqera CLI"
date created: "2026-05-28"
last updated: "2026-06-23"
tags: [co-scientist, cli, reference]
---

The Seqera CLI reads the following environment variables for authentication and for connecting to your Enterprise agent backend.

| Variable | Description |
| --- | --- |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_ACCESS_TOKEN</code> | Platform access token for non-interactive use. When set, the CLI skips the browser login flow and uses this token directly. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AI_BACKEND_URL</code> | Co-Scientist agent backend endpoint used by the CLI. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_DOMAIN</code> | OIDC authority base URL. The CLI fetches OpenID configuration from this URL and opens the discovered authorization endpoint in your browser. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_CLI_CLIENT_ID</code> | OAuth client ID for the Seqera CLI. |
| <code style={{whiteSpace: 'nowrap'}}>TOWER_ACCESS_TOKEN</code> | Platform personal access token used instead of browser login. |

:::note
`SEQERA_AI_BACKEND_URL` and `SEQERA_AUTH_DOMAIN` point the CLI at your Enterprise agent backend. See [Authentication](../authentication.md#connect-to-an-enterprise-backend) for OAuth and token-based setup.
:::

## Learn more

- [Authentication](../authentication.md): Log in, log out, and manage tokens
- [Installation](../installation.mdx): Install, update, and configure the CLI
- [CLI](./cli.md): Seqera CLI commands and options
- [Skills](./skills-reference.md): Built-in skills, slash commands, and session limits

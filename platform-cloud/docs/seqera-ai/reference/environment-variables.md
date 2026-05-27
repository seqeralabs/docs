---
title: "Environment variables"
description: "Environment variables for authenticating and configuring the Seqera CLI"
date created: "2026-05-28"
tags: [co-scientist, cli, reference]
---

The Seqera CLI reads the following environment variables for authentication and for pointing development builds at a backend.

| Variable | Purpose |
| --- | --- |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_ACCESS_TOKEN</code> | Platform access token for non-interactive use. When set, the CLI skips the browser login flow and uses this token directly. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AI_BACKEND_URL</code> | Co-Scientist backend endpoint used by the CLI. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_DOMAIN</code> | Platform API base URL used for browser-based login. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_CLI_CLIENT_ID</code> | OAuth client ID for the Seqera CLI. |
| <code style={{whiteSpace: 'nowrap'}}>TOWER_ACCESS_TOKEN</code> | Platform personal access token used instead of browser login. |

:::note
`SEQERA_AUTH_DOMAIN` and `SEQERA_AUTH_CLI_CLIENT_ID` are only needed for the OAuth login flow when pointing a development build at the hosted Co-Scientist backend. See [Authentication](../authentication.md) for the full setup.
:::

## Learn more

- [Authentication](../authentication.md): Log in, log out, and manage tokens
- [Installation](../installation.mdx): Install, update, and configure the CLI
- [CLI](./cli.md): Seqera CLI commands and options
- [Skills](./skills-reference.md): Built-in skills, slash commands, and session limits

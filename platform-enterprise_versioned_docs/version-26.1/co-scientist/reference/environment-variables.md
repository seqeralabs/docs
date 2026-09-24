---
title: "Environment variables"
description: "Environment variables for authenticating and configuring the Seqera CLI"
date created: "2026-05-28"
last updated: "2026-09-22"
tags: [co-scientist, cli, reference]
---

The Seqera CLI reads the following environment variables for authentication, for connecting to your Enterprise agent backend, and for controlling CLI behavior.

## Connection and authentication

| Variable | Description |
| --- | --- |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AI_BACKEND_URL</code> | Co-Scientist agent backend endpoint used by the CLI. Overrides `backendUrl` in the [configuration file](#configuration-file). |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_DOMAIN</code> | OIDC authority base URL. The CLI fetches OpenID configuration from this URL and opens the discovered authorization endpoint in your browser. Overrides `authDomain` in the configuration file. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_PLATFORM_API_URL</code> | Platform API endpoint used by `seqera info`. The CLI also uses it as the OIDC authority when neither `SEQERA_AUTH_DOMAIN` nor `authDomain` is set. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_CLI_CLIENT_ID</code> | OAuth client ID for the Seqera CLI. Defaults to `seqera_ai_cli`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_AUDIENCE</code> | OAuth audience requested during login. Defaults to `platform`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_REDIRECT_PORT</code> | Local port for the browser login callback. Defaults to `53682`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_CALLBACK_TIMEOUT_MS</code> | How long the CLI waits for the browser login callback, in milliseconds. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_BROWSER_AUTO_OPEN</code> | Set to `false` to print the login URL instead of opening a browser, for example on a remote host. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_ACCESS_TOKEN</code> | Platform access token for non-interactive use. When set, the CLI skips the browser login flow and uses this token directly. |
| <code style={{whiteSpace: 'nowrap'}}>TOWER_ACCESS_TOKEN</code> | Platform personal access token used instead of browser login. |

## CLI behavior

| Variable | Description |
| --- | --- |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AI_CWD</code> | Working directory for local operations. Defaults to the directory you start the CLI in. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_CLI_OUTPUT_FORMAT</code> | Set to `json` to make JSON the default output format for `seqera info`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_THEME</code> | Force the `light` or `dark` terminal theme instead of detecting it. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_LOG_LEVEL</code> | CLI log level. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_LOG_FILE</code> | Path of the CLI diagnostic log file. Defaults to `/tmp/seqera-cli-diag.jsonl`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_DISABLE_LSP_DOWNLOAD</code> | Set to `true` to stop the CLI from downloading the Nextflow language server. See [Nextflow LSP](../nextflow-lsp.md). |

## Configuration file

The CLI also reads connection settings from `~/.config/seqera-ai/config.json`. Use it instead of exporting environment variables in every shell:

```json
{
  "authDomain": "https://platform.example.com/api",
  "backendUrl": "https://ai-api.platform.example.com"
}
```

Environment variables take precedence over the configuration file. The CLI resolves the OIDC authority in this order: `SEQERA_AUTH_DOMAIN`, `authDomain`, `SEQERA_PLATFORM_API_URL`. It resolves the agent backend from `SEQERA_AI_BACKEND_URL`, then `backendUrl`.

:::note
See [Authentication](../authentication.md#connect-to-an-enterprise-backend) for OAuth and token-based setup.
:::

## Learn more

- [Authentication](../authentication.md): Log in, log out, and manage tokens
- [Installation](../installation.mdx): Install, update, and configure the CLI
- [CLI](./cli.md): Seqera CLI commands and options
- [Skills](./skills-reference.md): Built-in skills, slash commands, and session limits

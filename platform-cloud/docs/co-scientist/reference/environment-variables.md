---
title: "Environment variables"
description: "Environment variables for authenticating and configuring the Seqera CLI"
date created: "2026-05-28"
last updated: "2026-09-22"
tags: [co-scientist, cli, reference]
---

The Seqera CLI reads the following environment variables for authentication, for pointing development builds at a backend, and for controlling CLI behavior.

## Connection and authentication

| Variable | Description |
| --- | --- |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_ACCESS_TOKEN</code> | Platform access token for non-interactive use. When set, the CLI skips the browser login flow and uses this token directly. |
| <code style={{whiteSpace: 'nowrap'}}>TOWER_ACCESS_TOKEN</code> | Platform personal access token used instead of browser login. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AI_BACKEND_URL</code> | Co-Scientist backend endpoint used by the CLI. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_DOMAIN</code> | Platform API base URL used for browser-based login. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_CLI_CLIENT_ID</code> | OAuth client ID for the Seqera CLI. Defaults to `seqera_ai_cli`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_PLATFORM_API_URL</code> | Platform API endpoint used by `seqera info`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_REDIRECT_PORT</code> | Local port for the browser login callback. Defaults to `53682`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AUTH_CALLBACK_TIMEOUT_MS</code> | How long the CLI waits for the browser login callback, in milliseconds. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_BROWSER_AUTO_OPEN</code> | Set to `false` to print the login URL instead of opening a browser, for example on a remote host. |

:::note
You need `SEQERA_AI_BACKEND_URL`, `SEQERA_AUTH_DOMAIN`, and `SEQERA_AUTH_CLI_CLIENT_ID` only when you point a development build at the hosted Co-Scientist backend. See [Authentication](../authentication.md) for the full setup.
:::

## CLI behavior

| Variable | Description |
| --- | --- |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_AI_CWD</code> | Working directory for local operations. Defaults to the directory you start the CLI in. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_CLI_OUTPUT_FORMAT</code> | Set to `json` to make JSON the default output format for `seqera info`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_THEME</code> | Force the `light` or `dark` terminal theme instead of detecting it. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_REDUCE_MOTION</code> | Disable tip rotation animations. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_LOG_LEVEL</code> | CLI log level. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_LOG_FILE</code> | Path of the CLI diagnostic log file. Defaults to `/tmp/seqera-cli-diag.jsonl`. |
| <code style={{whiteSpace: 'nowrap'}}>SEQERA_DISABLE_LSP_DOWNLOAD</code> | Set to `true` to stop the CLI from downloading the Nextflow language server. See [Nextflow LSP](../nextflow-lsp.md). |

## Learn more

- [Authentication](../authentication.md): Log in, log out, and manage tokens
- [Installation](../installation.mdx): Install, update, and configure the CLI
- [CLI](./cli.md): Seqera CLI commands and options
- [Skills](./skills-reference.md): Built-in skills, slash commands, and session limits

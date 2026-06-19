---
title: "CLI"
description: "Seqera CLI commands and options for Co-Scientist"
date created: "2026-05-28"
last updated: "2026-06-19"
tags: [co-scientist, cli, reference]
---

Reference for the `seqera` commands used with Co-Scientist. To install the CLI, see [Installation](../installation.mdx). For the slash commands available inside a session, see [Skills](./skills-reference.md).

## seqera login

Authenticate the CLI against your Seqera Platform account through a browser login.

```bash
seqera login
```

## seqera logout

Sign out of the current session, revoke the authentication token, and remove locally stored credentials.

```bash
seqera logout
```

## seqera ai

Start an interactive Co-Scientist session. Pass an optional initial query to begin with a prompt.

```bash
seqera ai [query] [options]
```

| Option | Description |
|--------|-------------|
| `[query]` | Optional initial prompt to start the session with |
| `-c` | Continue your most recent session |
| `-s <session-id>` | Resume a specific session by ID |
| `--approval-mode <mode>` | Set the approval mode for local commands, for example `basic` or `full` (see [Command approval](../command-approval.md)) |
| `--headless` | Run non-interactively and send output to stdout |
| `--show-thinking` | Include thinking messages in headless output |
| `--show-tools` | Include tool calls in headless output |
| `--sub-agent` | Run as a subagent with structured JSONL output |

See [Sessions](../sessions.md) for usage examples.

## seqera org

Manage your organization selection for billing.

| Command | Description |
|---------|-------------|
| `seqera org` | View your current organization |
| `seqera org list` | List all organizations |
| `seqera org switch` | Switch organization |
| `seqera org clear` | Clear organization selection |

## seqera skill install

Install Co-Scientist as a skill or instruction file for a coding agent.

```bash
seqera skill install [options]
```

| Option | Short | Description |
|--------|-------|-------------|
| `--local` | `-l` | Install to repo root |
| `--path <PATH>` | `-p` | Install to a custom path (relative or absolute) |
| `--global` | `-g` | Install to home directory |
| `--detect` | `-d` | Auto-detect an existing installation and update it |

## seqera skill check

Verify that an installed skill matches your current CLI version.

```bash
seqera skill check [options]
```

| Option | Short | Description |
|--------|-------|-------------|
| `--update` | `-u` | Automatically update outdated skills |
| `--global` | | Check only global installations |
| `--local` | | Check only local (repository) installations |

## seqera --version

Print the installed CLI version.

```bash
seqera --version
```

## Learn more

- [Installation](../installation.mdx): Install, update, and configure the CLI
- [Sessions](../sessions.md): Start, continue, resume, and exit sessions
- [Coding agents](../coding-agents.md): Install Co-Scientist as a skill in your coding agent
- [Skills](./skills-reference.md): Built-in skills, slash commands, and session limits
- [Environment variables](./environment-variables.md): Variables for authenticating and configuring the CLI

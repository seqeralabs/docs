---
title: "Codex"
description: "Install and maintain the Co-Scientist skill for Codex"
date created: "2026-03-11"
last updated: "2026-09-22"
tags: [co-scientist, cli, skills, codex]
---

The `seqera skill` command installs a skill file that enables [Codex](https://openai.com/codex) to use Co-Scientist as a subagent. Once installed, Codex can invoke Co-Scientist directly to manage workflows, build containers, query nf-core modules, and more without leaving your environment.

This page covers how to install the skill into Codex and keep it in sync as you update the CLI.

## `seqera skill install`

Use `seqera skill install` to add the Co-Scientist skill to Codex. Pass the Codex skill directory with `--path`. Relative paths resolve from the repository root.

Install into the current repository:

```bash
seqera skill install --path .codex/skills/seqera
```

Install for your user account, relative to your home directory:

```bash
seqera skill install --global --path .codex/skills/seqera
```

Detect and update an existing installation:

```bash
seqera skill install --detect
```

:::note
Without `--path`, `seqera skill install` installs the Claude Code layout (`.claude/skills/seqera`) at the repository root, or in your home directory with `--global`. It does not prompt for a location. Unless you pass `--global` or an absolute `--path`, run the command inside a git repository. The CLI creates the `--path` directory and writes `SKILL.md` and its supporting files inside it.
:::

### Usage

```bash
seqera skill install [OPTIONS]
```

### Options

`seqera skill install` accepts the following options:

| Option | Short | Description |
|--------|-------|-------------|
| `--local` | `-l` | Install to repo root |
| `--path <PATH>` | `-p` | Install to a custom path (relative or absolute) |
| `--global` | `-g` | Install to home directory |
| `--detect` | `-d` | Auto-detect an existing installation and update it |

## `seqera skill check`

The skill file is tied to the version of the CLI that created it, so it can fall out of date when you upgrade. Use `seqera skill check` to confirm your installed skill still matches your current CLI version, and update it when it doesn't.

Verify that your installed skill matches your current CLI version:

```bash
seqera skill check
```

Update automatically if needed:

```bash
seqera skill check --update
```

### Usage

```bash
seqera skill check [OPTIONS]
```

### Options

`seqera skill check` accepts the following options:

| Option | Short | Description |
|--------|-------|-------------|
| `--update` | `-u` | Automatically update outdated skills |
| `--global` | `-g` | Check only global installations |
| `--local` | `-l` | Check only local (repository) installations |

## Learn more

- [Installation](./installation.mdx): Install, update, and configure the CLI
- [Quickstart](./quickstart.md): Run your first Co-Scientist session
- [Authentication](./authentication.md): Log in, log out, and manage sessions
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Using Co-Scientist](./configuration.md): Configure modes, sessions, skills, command approval, and more
- [Coding Agents](./coding-agents.md): Install Co-Scientist as a skill in your coding agent
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

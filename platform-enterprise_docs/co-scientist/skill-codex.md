---
title: "Codex"
description: "Install and maintain the Co-Scientist skill for Codex"
date created: "2026-03-11"
last updated: "2026-06-22"
tags: [co-scientist, cli, skills, codex]
---

The `seqera skill` command installs a skill file that enables [Codex](https://openai.com/codex) to use Co-Scientist as a subagent. Once installed, Codex can invoke Co-Scientist directly to manage workflows, build containers, query nf-core modules, and more without leaving your environment.

This page covers how to install the skill into Codex and keep it in sync as you update the CLI.

## `seqera skill install`

Use `seqera skill install` to add the Co-Scientist skill to Codex. Run it without options to launch an interactive installer that detects your setup and prompts for a location, or pass a flag to install directly to a specific path.

Launch the interactive installer:

```bash
seqera skill install
```

Install to your project `AGENTS.md` path:

```bash
seqera skill install --path AGENTS.md
```

Install into the current repository root and let the CLI select the Codex format automatically:

```bash
seqera skill install --local
```

Or install to your home directory:

```bash
seqera skill install --global
```

You can also auto-detect and update an existing installation:

```bash
seqera skill install --detect
```

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
| `--global` | | Check only global installations |
| `--local` | | Check only local (repository) installations |

## Learn more

- [Installation](./installation.mdx): Install, update, and configure the CLI
- [Quickstart](./quickstart.md): Run your first Co-Scientist session
- [Authentication](./authentication.md): Log in, log out, and manage sessions
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Using Co-Scientist](./configuration.md): Configure modes, sessions, skills, command approval, and more
- [Coding Agents](./coding-agents.md): Install Co-Scientist as a skill in your coding agent
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits

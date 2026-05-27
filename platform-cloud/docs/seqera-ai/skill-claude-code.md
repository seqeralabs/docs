---
title: "Claude Code"
description: "Install and maintain the Co-Scientist skill for Claude Code"
date created: "2026-03-11"
tags: [seqera-ai, co-scientist, cli, skills, claude-code]
---

The `seqera skill` command installs a skill file that enables [Claude Code](https://claude.ai/code) to use Co-Scientist as a subagent. Once installed, Claude Code can invoke Co-Scientist directly to manage workflows, build containers, query nf-core modules, and more without leaving your environment.

This page covers how to install the skill into Claude Code and keep it in sync as you update the CLI.

### `seqera skill install`

Use `seqera skill install` to add the Co-Scientist skill to Claude Code. Run it without options to launch an interactive installer that detects your setup and prompts for a location, or pass a flag to install directly to a specific path.

Launch the interactive installer:

```bash
seqera skill install
```

Install to the standard Claude Code location:

```bash
seqera skill install --path .claude/skills/
```

Install into the current repository root:

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

### `seqera skill check`

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

### Learn more

- [Skills](./skills.md): Discover, create, and install skills
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Code intelligence](./nextflow-lsp.md): Language-aware coding support
- [Installation](./installation.md): Detailed installation instructions
- [Credits](./credits.md): Co-Scientist credits and how to request more

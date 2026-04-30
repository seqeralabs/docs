---
title: "Working with GitHub Copilot"
description: "Install and maintain the Co-Scientist skill for GitHub Copilot"
date created: "2026-03-11"
tags: [seqera-ai, co-scientist, cli, skills, github-copilot]
---

The `seqera skill` command installs a skill file that enables [GitHub Copilot](https://github.com/features/copilot) to use Co-Scientist as a subagent. Once installed, GitHub Copilot can invoke Co-Scientist directly to manage workflows, build containers, query nf-core modules, and more without leaving your environment.

### `seqera skill install`

Launch the interactive installer:

```bash
seqera skill install
```

Install to the standard Copilot instructions file:

```bash
seqera skill install --path .github/copilot-instructions.md
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

| Option | Short | Description |
|--------|-------|-------------|
| `--local` | `-l` | Install to repo root |
| `--path <PATH>` | `-p` | Install to a custom path (relative or absolute) |
| `--global` | `-g` | Install to home directory |
| `--detect` | `-d` | Auto-detect an existing installation and update it |

### `seqera skill check`

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

| Option | Short | Description |
|--------|-------|-------------|
| `--update` | `-u` | Automatically update outdated skills |
| `--global` | | Check only global installations |
| `--local` | | Check only local (repository) installations |

### Learn more

- [Skills](./skills.md): Discover, create, and install skills
- [Use cases](./use-cases.md): Co-Scientist CLI use cases
- [Code intelligence](./nextflow-lsp.md): Language-aware coding support
- [Installation](./installation.md): Detailed installation instructions
- [Credits](./credits.md): Co-Scientist credits and how to request more

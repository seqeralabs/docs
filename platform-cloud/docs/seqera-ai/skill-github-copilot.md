---
title: "Working with GitHub Copilot"
description: "Install and maintain the Seqera AI skill for GitHub Copilot"
date: "2026-02-26"
tags: [seqera-ai, cli, skills, github-copilot]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

The `seqera skill` command installs a skill file that enables [GitHub Copilot](https://github.com/features/copilot) to use Seqera AI as a subagent. Once installed, GitHub Copilot can invoke Seqera AI directly to manage workflows, build containers, query nf-core modules, and more without leaving your environment.

### `seqera skill install`

Install to the standard Copilot instructions file:

```bash
seqera skill install --path .github/copilot-instructions.md
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

- [Use cases](./use-cases.md): Seqera AI CLI use cases
- [Code intelligence](./nextflow-lsp.md): Language-aware coding support
- [Installation](./installation.mdx): Detailed installation instructions

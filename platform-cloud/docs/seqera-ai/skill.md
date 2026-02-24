---
title: "Skill for coding agents"
description: "Install Seqera AI skills for coding agents"
date: "2026-02-24"
tags: [seqera-ai, cli, skills, coding-agents]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

The `seqera skill` command installs a skill file that enables your coding agent to use Seqera AI as a subagent. Once installed, agents like Claude Code, Codex, and GitHub Copilot can invoke Seqera AI directly to manage workflows, build containers, query nf-core modules, and more—without leaving their environment.

### Supported agents

| Agent | Format |
|-------|--------|
| [Claude Code](https://claude.ai/code) | `.claude/skills/` |
| [Codex](https://openai.com/codex) | `AGENTS.md` |
| [Cursor](https://www.cursor.com/) | `.cursor/rules/` |
| [GitHub Copilot](https://github.com/features/copilot) | `.github/copilot-instructions.md` |
| [OpenCode](https://opencode.ai/) | `.opencode/` |
| [Pi](https://github.com/badlogic/pi-mono) | `.pi/` |
| [Windsurf](https://windsurf.com/) | `.windsurf/rules/` |

### seqera skill install

Install a skill file for your coding agent.

```bash
seqera skill install [OPTIONS]
```

When no flag is provided, `seqera skill install` prompts you to select your agent and install location interactively.

#### Options

| Option | Short | Description |
|--------|-------|-------------|
| `--path <PATH>` | `-p` | Install to a custom path (relative or absolute) |
| `--global` | `-g` | Install to home directory |
| `--detect` | `-d` | Auto-detect an existing installation and update it |

### seqera skill check

Verify that your installed skills match the current CLI version.

```bash
seqera skill check [OPTIONS]
```

By default, `seqera skill check` scans both local and global installations. Use `--global` or `--local` to narrow the scope.

#### Options

| Option | Short | Description |
|--------|-------|-------------|
| `--update` | `-u` | Automatically update outdated skills |
| `--global` | | Check only global installations |
| `--local` | | Check only local (repository) installations |

### Learn more

- [Seqera AI CLI](index.md): Seqera AI CLI overview
- [Installation](./installation.mdx): Detailed installation instructions
- [Authentication](./authentication.md): Login, logout, and session management
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Seqera AI use cases

---
title: "Antigravity/Gemini"
description: "Install and maintain the Co-Scientist skill for Google's Antigravity/Gemini IDE"
date created: "2026-04-29"
last updated: "2026-06-19"
tags: [co-scientist, cli, skills, antigravity, gemini]
---

The `seqera skill` command installs a skill file that enables [Antigravity/Gemini](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/) to use Co-Scientist as a subagent. Once installed, Antigravity can invoke Co-Scientist directly to manage workflows, build containers, query nf-core modules, and more without leaving your environment.

This page covers the Antigravity skill format, how to install the skill automatically or by hand, the invocation patterns Antigravity uses, and how to keep the skill in sync as you update the CLI.

## Antigravity/Gemini skill format

Antigravity/Gemini discovers skills from the `.agents/skills/` directory at the repository root. Each skill is a folder containing a `SKILL.md` file with YAML frontmatter (name, description) and detailed instructions.

| Agent | Format |
|-------|--------|
| [Antigravity/Gemini](https://blog.google/technology/google-deepmind/) | `.agents/skills/` |

## `seqera skill install`

Use `seqera skill install` to add the Co-Scientist skill to Antigravity. Install it to the Antigravity skill directory, or pass another flag to choose a different location. If the installer can't write the skill, create it by hand with [Manual installation](#manual-installation).

Install to the Antigravity skill directory:

```bash
seqera skill install --path .agents/skills/seqera-ai-subagent/
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

:::note
If you encounter a `ENOENT: no such file or directory, scandir '/$bunfs/root/content/seqera'` error with `seqera skill install`, you can manually create the skill file. See [Manual installation](#manual-installation) below.
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

## Manual installation

If the automated installer does not support your agent platform, you can manually create the skill file:

1. Create the skill directory:
    ```bash
    mkdir -p .agents/skills/seqera-ai-subagent/
    ```

2. Create `.agents/skills/seqera-ai-subagent/SKILL.md` with the following content:
    ```markdown
    ---
    name: seqera-ai-subagent
    description: Invokes Co-Scientist as a domain-expert subagent for Nextflow
    pipeline development, nf-core module management, Seqera Platform workspace
    operations, and Wave container builds.
    ---

    # Co-Scientist Subagent

    When the user asks about Nextflow pipelines, nf-core modules, Seqera Platform,
    or Wave containers, invoke Co-Scientist:

    seqera ai --headless --approval-mode basic "<query>" 2>&1
    ```

3. Verify the installation:
    ```bash
    seqera skill check
    ```

## Invocation patterns

Antigravity invokes Co-Scientist dynamically via shell commands rather than static context injection. The recommended patterns are:

| Pattern | Command | Use case |
|---------|---------|----------|
| Headless query | `seqera ai --headless --approval-mode basic "<query>"` | Read-only questions, analysis |
| Sub-agent mode | `seqera ai --sub-agent --approval-mode basic "<query>"` | Structured JSONL output |
| Goal mode | `seqera ai --headless --approval-mode full "/goal <task>"` | Multi-step autonomous work |
| Module QA review | `seqera ai --headless --approval-mode basic "Review modules/nf-core/<module>/main.nf for correctness"` | Pre-push nf-core module validation |

## Validated use case: nf-core module QA

Antigravity uses Co-Scientist as a domain-expert QA gate before pushing nf-core module PRs. In [PR #11377](https://github.com/nf-core/modules/pull/11377) (emmtyper), Co-Scientist caught that `emmtyper --version | sed` was fragile across Docker/conda environments due to Click version differences, and recommended using `python -c "import emmtyper; print(emmtyper.__version__)"` instead.

```bash
seqera ai --headless --approval-mode basic \
  "Review modules/nf-core/emmtyper/main.nf for topic channel, stub, and eval correctness" 2>&1
```

This pattern complements `nf-core modules lint` by catching semantic issues that static linting misses.

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
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

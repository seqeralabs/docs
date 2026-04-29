---
title: "Working with Antigravity/Gemini"
description: "Install and maintain the Seqera AI skill for Google's Antigravity/Gemini IDE"
date created: "2026-04-29"
tags: [seqera-ai, cli, skills, antigravity, gemini]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

The `seqera skill` command installs a skill file that enables [Antigravity/Gemini](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/) to use Seqera AI as a subagent. Once installed, Antigravity can invoke Seqera AI directly to manage workflows, build containers, query nf-core modules, and more without leaving your environment.

### Antigravity/Gemini skill format

Antigravity/Gemini discovers skills from the `.agents/skills/` directory at the repository root. Each skill is a folder containing a `SKILL.md` file with YAML frontmatter (name, description) and detailed instructions.

| Agent | Format |
|-------|--------|
| [Antigravity/Gemini](https://blog.google/technology/google-deepmind/) | `.agents/skills/` |

### `seqera skill install`

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

### Manual installation

If the automated installer does not support your agent platform, you can manually create the skill file:

1. Create the skill directory:
    ```bash
    mkdir -p .agents/skills/seqera-ai-subagent/
    ```

2. Create `.agents/skills/seqera-ai-subagent/SKILL.md` with the following content:
    ```markdown
    ---
    name: seqera-ai-subagent
    description: Invokes the Seqera AI CLI as a domain-expert subagent for Nextflow
    pipeline development, nf-core module management, Seqera Platform workspace
    operations, and Wave container builds.
    ---

    # Seqera AI Subagent

    When the user asks about Nextflow pipelines, nf-core modules, Seqera Platform,
    or Wave containers, invoke the Seqera AI CLI:

    seqera ai --headless --approval-mode basic "<query>" 2>&1
    ```

3. Verify the installation:
    ```bash
    seqera skill check
    ```

### Invocation patterns

Antigravity invokes Seqera AI dynamically via shell commands rather than static context injection. The recommended patterns are:

| Pattern | Command | Use case |
|---------|---------|----------|
| Headless query | `seqera ai --headless --approval-mode basic "<query>"` | Read-only questions, analysis |
| Sub-agent mode | `seqera ai --sub-agent --approval-mode basic "<query>"` | Structured JSONL output |
| Goal mode | `seqera ai --headless --approval-mode full "/goal <task>"` | Multi-step autonomous work |
| Module QA review | `seqera ai --headless --approval-mode basic "Review modules/nf-core/<module>/main.nf for correctness"` | Pre-push nf-core module validation |

### Validated use case: nf-core module QA

Antigravity uses Seqera AI as a domain-expert QA gate before pushing nf-core module PRs. In [PR #11377](https://github.com/nf-core/modules/pull/11377) (emmtyper), Seqera AI caught that `emmtyper --version | sed` was fragile across Docker/Conda environments due to Click version differences, and recommended using `python -c "import emmtyper; print(emmtyper.__version__)"` instead.

```bash
seqera ai --headless --approval-mode basic \
  "Review modules/nf-core/emmtyper/main.nf for topic channel, stub, and eval correctness" 2>&1
```

This pattern complements `nf-core modules lint` by catching semantic issues that static linting misses.

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
- [Use cases](./use-cases.md): Seqera AI CLI use cases
- [Code intelligence](./nextflow-lsp.md): Language-aware coding support
- [Installation](./installation.md): Detailed installation instructions

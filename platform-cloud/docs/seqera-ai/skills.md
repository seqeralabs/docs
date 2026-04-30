---
title: "Skills"
description: "Discover, create, and install skills in Co-Scientist CLI"
date created: "2026-03-11"
tags: [seqera-ai, cli, skills]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Co-Scientist. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Skills are reusable instruction sets that extend Co-Scientist with domain-specific workflows, prompts, and operating guidance.

Co-Scientist supports two skill workflows:

- **CLI skills**: `SKILL.md` files discovered from project and user skill directories and sent to the backend as session context
- **Agent integrations**: skill files installed by `seqera skill install` so other coding agents can invoke Co-Scientist as a subagent

## Use skills in the CLI

When you start `seqera ai`, the CLI discovers available skills automatically. Backend-provided skills are also exposed as slash commands in the `/` command palette and `/help`.

You can:

- Type `/` to browse built-in commands and backend skills
- Run `/help` to see commands and skill descriptions in the terminal
- Add project-specific `SKILL.md` files so Co-Scientist starts each session with the right context

## Built-in skills

Your Co-Scientist deployment can expose built-in skills as slash commands. These appear in the `/` command palette and in `/help`.

The CLI includes the following built-in skills by default:

| Command | Description |
|---------|-------------|
| `/nextflow-config` | Generate and explain Nextflow configuration files |
| `/nextflow-schema` | Generate `nextflow_schema.json` and sample sheet schema files |
| `/debug-local-run` | Debug a local Nextflow pipeline run using `.nextflow.log`, work directories, and related artifacts |
| `/debug-last-run-on-seqera` | Debug the last pipeline run on Seqera Platform |
| `/convert-jupyter-notebook` | Convert Jupyter notebooks to Nextflow pipelines |
| `/convert-python-script` | Convert Python scripts, including standalone scripts and Snakemake-style logic, to Nextflow |
| `/convert-r-script` | Convert R scripts to Nextflow pipelines |
| `/fix-strict-syntax` | Fix Nextflow strict syntax errors and help migrate pipelines to the v2 parser |
| `/nf-aggregate` | Aggregate metrics from Nextflow runs on Seqera Platform using the `nf-aggregate` pipeline |
| `/nf-data-lineage` | Explore Nextflow data lineage to trace which inputs and processes produced a result |
| `/nf-pipeline-structure` | Analyze a local Nextflow pipeline structure, including processes, workflows, modules, and channel flow |
| `/nf-run-history` | Analyze local Nextflow run history and summarize recent activity, progress, and recurring issues |
| `/nf-schema-migration` | Migrate Nextflow pipelines from `nf-validation` to `nf-schema` v2 |
| `/seqera-mcp` | Access Seqera Platform through MCP tools for structured, validated operations |
| `/seqera-platform-api` | Query and manipulate Seqera Platform resources directly through the REST API |
| `/seqerakit` | Write `seqerakit` YAML configuration for automating Seqera Platform setup |
| `/simplify` | Review changed code for reuse, quality, and efficiency, then clean up issues found |

:::note
The exact built-in skills available in your environment may vary by deployment and release. Use `/help` or type `/` in the CLI to see the current list.
:::

## Skill format

Each skill lives in its own directory and includes a `SKILL.md` file with YAML frontmatter:

```text
my-skill/
  SKILL.md
  references/
```

```markdown
---
name: my-skill
description: Short description of what this skill does
---

Detailed instructions, examples, and guidelines.
```

`name` and `description` are required. Skills missing either field are skipped.

## Discovery directories

Co-Scientist searches these directories in order. The first directory to register a skill name takes precedence, and later skills with the same name are ignored.

| Priority | Path | Scope |
|----------|------|-------|
| 1 | `<cwd>/.agents/skills/` | project |
| 2 | `<cwd>/.seqera/skills/` | project |
| 3 | `~/.agents/skills/` | user |
| 4 | `~/.seqera/skills/` | user |
| 5 | `~/.config/agents/skills/` | user |
| 6 | `~/.config/seqera/skills/` | user |

Project skills take priority over user skills, so you can override a global skill with a repository-specific version.

### Cross-agent compatibility

`.agents/skills/` follows the [Agent Skills](https://agentskills.io) convention, which makes skills portable across coding agents. `.seqera/skills/` is Seqera-specific.

## Install skills into Co-Scientist

You can add skills by creating the directory structure manually or by installing them from the [Agent Skills](https://agentskills.io) ecosystem:

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

After adding a skill, restart `seqera ai` so the new skill is loaded into the session.

## Install Co-Scientist into coding agents

Use `seqera skill install` to install Co-Scientist as a skill or instruction file for another agent:

```bash
seqera skill install
```

Common installation flows:

```bash
seqera skill install --local
seqera skill install --global
seqera skill install --detect
```

Supported agents include:

| Agent | Format |
| --- | --- |
| [Claude Code](https://claude.ai/code) | `.claude/skills/` |
| [Codex](https://openai.com/codex) | `AGENTS.md` |
| [Cursor](https://www.cursor.com/) | `.cursor/rules/` |
| [GitHub Copilot](https://github.com/features/copilot) | `.github/copilot-instructions.md` |
| [OpenCode](https://opencode.ai/) | `.opencode/` |
| [Pi](https://github.com/badlogic/pi-mono) | `.pi/` |
| [Windsurf](https://windsurf.com/) | `.windsurf/rules/` |

Verify installed agent integrations with:

```bash
seqera skill check
```

Update outdated installations automatically:

```bash
seqera skill check --update
```

## Payload limits

To keep session payloads small, Co-Scientist caps discovered skill context at **5 KB**. The total session payload cap is **20 KB**.

## Learn more

- [Modes](./modes.md): Work in build mode, plan mode, and goal mode
- [Working with Claude Code](./skill-claude-code.md): Install Co-Scientist as a skill for Claude Code
- [Working with Codex](./skill-codex.md): Install Co-Scientist as a skill for Codex
- [Working with GitHub Copilot](./skill-github-copilot.md): Install Co-Scientist as a skill for GitHub Copilot
- [Working with other coding agents](./skill-other-agents.md): Install Co-Scientist for other coding agents

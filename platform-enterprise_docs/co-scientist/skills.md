---
title: "Skills configuration"
description: "Discover, create, and install skills in the Seqera CLI"
date created: "2026-03-11"
last updated: "2026-06-09"
tags: [co-scientist, cli, skills]
---

Skills are reusable instruction sets that extend Co-Scientist with domain-specific workflows, prompts, and operating guidance.

Co-Scientist supports two skill workflows:

- **Session skills**: `SKILL.md` files discovered from project and user skill directories and sent to the Co-Scientist backend as session context when you run `seqera ai`
- **Agent integrations**: skill files installed by `seqera skill install` so other coding agents can invoke Co-Scientist as a subagent

:::tip
See [Skills](./reference/skills-reference.md) for a list of the available built-in skills and slash commands.
:::

## Use skills in the CLI

When you start `seqera ai`, the CLI discovers available skills automatically. Backend-provided skills are also exposed as slash commands in the `/` command palette and `/help`.

You can:

- Type `/` to browse built-in commands and backend skills
- Run `/help` to see commands and skill descriptions in the terminal
- Add project-specific `SKILL.md` files so Co-Scientist starts each session with the right context

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

Co-Scientist can install itself as a skill or instruction file so another coding agent can invoke it as a subagent. See [Coding agents](./coding-agents.md) for the supported agents and the `seqera skill install` and `seqera skill check` commands.

## Learn more

- [Installation](./installation.mdx): Install, update, and configure the CLI
- [Quickstart](./quickstart.md): Run your first Co-Scientist session
- [Authentication](./authentication.md): Log in, log out, and manage sessions
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Using Co-Scientist](./configuration.md): Configure modes, sessions, skills, command approval, and more
- [Coding Agents](./coding-agents.md): Install Co-Scientist as a skill in your coding agent
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits

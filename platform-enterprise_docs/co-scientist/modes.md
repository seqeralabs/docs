---
title: "Modes"
description: "Work in Co-Scientist's build, plan, and goal modes"
date created: "2026-03-11"
last updated: "2026-06-08"
tags: [co-scientist, cli, modes]
---

Co-Scientist offers three modes that control how much autonomy it has in a session. Choose the right level for each task with [Build mode](#build-mode), [Plan mode](#plan-mode), and [Goal mode](#goal-mode).

## Build mode

Build mode is the default interactive mode. Co-Scientist can:

- Read and search files
- Execute commands
- Edit or create files
- Carry out workflow changes directly in your workspace

Use build mode for implementation work, debugging, code generation, and file edits.

## Plan mode

Plan mode is optimized for analysis and implementation planning.

In plan mode, Co-Scientist focuses on:

- Understanding the problem
- Comparing approaches and trade-offs
- Producing a step-by-step implementation plan
- Reading files and searching code for context

Plan mode blocks write and execution tools, including:

- `execute_bash_local`
- `write_file_local`
- `edit_file_local`
- `create_directory_local`

If the assistant tries to use one of these tools, the request is rejected and the assistant is told to switch back to build mode.

For example:

```text
Compare whether I should add FastQC or fastp as the first QC step in this RNA-seq pipeline, including the workflow changes each option would require
```

```text
Plan the work to add GPU support to this pipeline
```

```text
Inspect this repository and outline the changes needed for Seqera Platform deployment
```

## Switch between build mode and plan mode

Toggle modes during a session with `Shift+Tab`.

You can also:

- Check the current mode in the composer footer.
- Run `/status` to view the current mode alongside session and LSP status.
- Use `/help` to see mode-aware command guidance.

## Goal mode

Goal mode is a persistent workflow for longer tasks. Set a goal with:

```bash
/goal <task description>
```

For example:

```text
/goal migrate this pipeline to DSL2 and add nf-tests
```

```text
/goal update this workflow for AWS Batch and verify the config
```

When goal mode is active, Co-Scientist:

- Keeps working toward the same objective over multiple model attempts.
- Automatically continues if more work is needed.
- Stops when the goal is complete or the goal attempt limit is reached.
- Switches approval mode to `full` so work can continue without repeated prompts.

Goal mode commands:

- `/goal`
- `/goal off`

Run `/goal` without arguments to inspect the current goal. Run `/goal off` to disable goal mode.

Co-Scientist currently gives goal mode up to **3 model attempts** before it stops and asks you to start a new goal.

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift+Tab` | Toggle between build mode and plan mode. |
| <code style={{whiteSpace: 'nowrap'}}>Ctrl+Enter</code> | If your terminal supports it, interrupt the current response and send a queued follow-up immediately. |
| `Esc` | Clear a queued follow-up or interrupt the current response. |

## Learn more

- [Sessions](./sessions.md): Start, continue, resume, and exit sessions
- [Skills configuration](./skills.md): Discover, create, and install skills
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Usage and cost](./usage-and-cost.md): Co-Scientist usage in Enterprise deployments
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits

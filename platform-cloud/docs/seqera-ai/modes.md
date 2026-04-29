---
title: "Modes"
description: "Work in build mode, plan mode, and goal mode in Co-Scientist CLI"
date created: "2026-03-11"
tags: [seqera-ai, cli, modes]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Co-Scientist. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Co-Scientist includes **build mode**, **plan mode**, and **goal mode** so you can choose the right level of autonomy for each task.

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

When goal mode is active, Co-Scientist:

- Keeps working toward the same objective over multiple model attempts.
- Automatically continues if more work is needed.
- Stops when the goal is complete or the goal attempt limit is reached.
- Switches approval mode to `full` so work can continue without repeated prompts.

Goal mode commands:

```bash
/goal
/goal off
```

Run `/goal` without arguments to inspect the current goal. Run `/goal off` to disable goal mode.

Co-Scientist currently gives goal mode up to **3 model attempts** before it stops and asks you to start a new goal.

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift+Tab` | Toggle between build mode and plan mode. |
| `Ctrl+Enter` | If your terminal supports it, interrupt the current response and send a queued follow-up immediately. |
| `Esc` | Clear a queued follow-up or interrupt the current response. |

## Examples

### Plan mode

```text
Compare whether I should add FastQC or fastp as the first QC step in this RNA-seq pipeline, including the workflow changes each option would require
```

```text
Inspect this repository and outline the changes needed for Seqera Platform deployment
```

### Goal mode

```text
/goal migrate this pipeline to DSL2 and add nf-tests
```

```text
/goal update this workflow for AWS Batch and verify the config
```

## Learn more

- [Skills](./skills.md): Discover, create, and install skills
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Co-Scientist CLI use cases

---
title: "Sessions"
description: "Start, continue, resume, and exit Co-Scientist sessions, and run non-interactively"
date created: "2026-05-27"
tags: [co-scientist, cli, sessions]
---

A session is one interactive conversation with Co-Scientist. Co-Scientist preserves your conversation history, so you can resume earlier sessions to continue your work. This page covers how to start, continue, and exit sessions, and how to run non-interactively.

## Start a session

Launch an interactive session:

```bash
seqera ai
```

Start with an initial query:

```bash
seqera ai "list my pipelines"
```

Set the approval mode for local commands at launch:

```bash
seqera ai --approval-mode full
```

See [Command approval](./command-approval.md) for the available modes.

## Continue or resume a session

Continue your most recent session:

```bash
seqera ai -c
```

Continue with a follow-up question:

```bash
seqera ai -c "now run the pipeline with the test profile"
```

Resume a specific session by ID:

```bash
seqera ai -s <session-id>
```

## Run in headless mode

Run Co-Scientist in headless mode for scripting and automation. Output is sent to stdout instead of the interactive TUI.

Run a query and pipe the output:

```bash
seqera ai --headless "list my pipelines"
```

Include thinking messages in the output:

```bash
seqera ai --headless --show-thinking "debug my pipeline"
```

Include tool calls in the output:

```bash
seqera ai --headless --show-tools "list my workflows"
```

:::note
Headless mode is also auto-detected when stdout is piped, for example `seqera ai "query" | grep "result"`.
:::

## Exit a session

- Type `/exit`, `/quit`, or `/q`
- Press `Ctrl+C`

Your conversation history is preserved, so you can resume later with `seqera ai -c`.

## Learn more

- [Modes](./modes.md): Work in build, plan, and goal modes
- [Command approval](./command-approval.md): Control which commands run automatically
- [Quickstart](./quickstart.md): Run your first Co-Scientist session
- [Skills reference](./reference/skills-reference.md): Built-in skills, slash commands, and session limits

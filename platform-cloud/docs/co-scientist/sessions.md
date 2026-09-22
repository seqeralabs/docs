---
title: "Sessions"
description: "Start, continue, resume, and exit Co-Scientist sessions, and run non-interactively"
date created: "2026-05-27"
last updated: "2026-09-22"
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

## Session retention and limits

Co-Scientist keeps session history for a fixed period and caps the number of sessions:

| Setting | Limit |
| --- | --- |
| CLI session history retention | 14 days |
| Seqera Platform Co-Scientist conversation retention | 180 days |
| Idle time before a session's in-memory state is released | 48 hours |
| Sessions per user | 100 |
| Sessions per workspace | 500 |

After 48 hours without activity, Co-Scientist releases a session's in-memory state. The conversation history is kept, so you can still resume the session until it reaches the retention limit. After the retention limit, the session is deleted and can no longer be resumed.

## Interrupt a response

Press `Esc` to interrupt the current response. The CLI stops the run on the Co-Scientist backend as well as in your terminal, so interrupted work does not continue in the background.

## Exit a session

- Type `/exit`, `/quit`, or `/q`
- Press `Ctrl+C`

Your conversation history is preserved, so you can resume later with `seqera ai -c`.

## Learn more

- [Modes](./modes.md): Work in build, plan, and goal modes
- [Command approval](./command-approval.md): Control which commands run automatically
- [Quickstart](./quickstart.md): Run your first Co-Scientist session
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits

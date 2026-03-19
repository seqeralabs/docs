---
title: "Installation"
description: "Install and configure Seqera AI CLI"
date created: "2026-03-11"
tags: [seqera-ai, cli, installation]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

### Requirements

- Node.js 18 or later
- macOS, Linux, or Windows with WSL
- A Seqera Platform account ([sign up for free](https://cloud.seqera.io))
- An internet connection

### npm install

```bash
npm install -g seqera
```

Install the development build:

```bash
npm install -g seqera@dev
```

Verify your installation:

```bash
seqera --version
```

### npm update

```bash
npm update -g seqera
```

### Developer configuration

If you are testing a development build of the CLI against the hosted production Seqera AI service, set `SEQERA_AI_BACKEND_URL=https://ai-api.seqera.io` before running `seqera ai`.

See [Authentication](./authentication.md#point-a-development-build-at-the-hosted-seqera-ai-backend) for the complete environment variable reference and OAuth versus token-based examples.

### Install agent integrations

Install Seqera AI as a skill for your coding agent:

```bash
seqera skill install
```

Install directly into the current repository:

```bash
seqera skill install --local
```

Check installed skills and update them after upgrading the CLI:

```bash
seqera skill check --update
```

:::info
If you use Seqera AI as a skill for a coding agent, run `seqera skill check --update` after updating the CLI to keep your installed skills in sync with the current version. By default, this scans both local and global installations. Use `--global` or `--local` to narrow the scope. See [Working with Claude Code](./skill-claude-code.md), [Working with Codex](./skill-codex.md), [Working with GitHub Copilot](./skill-github-copilot.md), and [Working with other coding agents](./skill-other-agents.md).

```bash
seqera skill check --update
```
:::

### npm uninstall

```bash
npm uninstall -g seqera
```

### Learn more

- [Seqera AI CLI](index.md): Seqera AI CLI overview
- [Authentication](./authentication.md): Login, logout, and session management
- [Skills](./skills.md): Discover, create, and install skills
- [Modes](./modes.md): Work in build mode, plan mode, and goal mode
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Seqera AI CLI use cases
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

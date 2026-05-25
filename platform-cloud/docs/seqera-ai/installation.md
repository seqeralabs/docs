---
title: "Installation"
description: "Install and configure the Co-Scientist CLI"
date created: "2026-03-11"
tags: [seqera-ai, co-scientist, cli, installation]
---

The Co-Scientist CLI runs in your terminal on macOS, Linux, or Windows (via WSL). It connects to Seqera Platform and to an AI backend so you can build, run, and debug Nextflow pipelines from a single interactive session.

This page covers how to install, update, and uninstall the CLI with npm, how to switch to a development build, and how to resolve common installation errors.
Once the CLI is on your PATH, see [Get started](./get-started.md) to log in and start a session.

:::info[**Prerequisites**]{#prerequisites}
You will need the following to get started:

- Node.js 18 or later
- macOS, Linux, or Windows with WSL
- A Seqera Platform account ([sign up for free](https://cloud.seqera.io))

:::

## Install the CLI

To install the CLI globally with npm, run:

```bash
npm install -g seqera
```

Then confirm the CLI is on your PATH:

```bash
seqera --version
```

### Install a development build

To install the latest pre-release, run:

```bash
npm install -g seqera@dev
```

The `@dev` tag tracks the latest pre-release CLI. Use it only to test unreleased features. Otherwise install the default tag. To point a development build at the hosted Co-Scientist backend, set:

```bash
SEQERA_AI_BACKEND_URL=https://ai-api.seqera.io
```

See [Authentication](./authentication.md#point-a-development-build-at-the-hosted-co-scientist-backend) for the full environment variable reference.

## Update the CLI

To update the CLI to the latest published version, run:

```bash
npm update -g seqera
```

If you use Co-Scientist as a skill for a coding agent, sync your installed skills with the new CLI version after upgrading:

```bash
seqera skill check --update
```

This scans both local and global installations by default. Pass `--global` or `--local` to narrow the scope.

## Uninstall the CLI

To remove the CLI from your system, run:

```bash
npm uninstall -g seqera
```

## Next steps

- [Get started](./get-started.md): Run your first Co-Scientist session
- [Authentication](./authentication.md): Log in, log out, and manage sessions
- [Skills](./skills.md#install-co-scientist-into-coding-agents): Install Co-Scientist as a skill for your coding agent
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Resolve installation, login, and runtime issues

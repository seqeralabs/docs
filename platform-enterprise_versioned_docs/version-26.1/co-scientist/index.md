---
title: "Co-Scientist"
description: "AI assistant for bioinformatics in Seqera Platform Enterprise"
date created: "2026-03-11"
last updated: "2026-08-25"
tags: [co-scientist, cli, ai, enterprise]
---

Co-Scientist is Seqera's AI assistant for bioinformatics. It builds, runs, and debugs Nextflow pipelines, manages your data, and works with your Seqera Platform resources.

In Seqera Platform Enterprise, Co-Scientist is available on two surfaces:

- **In the Seqera CLI**: Run `seqera ai` in your terminal to work in your local checkout with access to your Platform workspace. See [Installation](./installation.mdx).
- **In the Co-Scientist web interface**: The browser interface deployed alongside your installation, including [projects](./projects.md).

Both surfaces use the same assistant and the same Seqera Platform Enterprise account.

:::note
Co-Scientist is not part of a default Seqera Platform Enterprise installation. An administrator must deploy the agent backend, the Seqera Model Context Protocol (MCP) server, and the web interface, and configure an inference provider. See [Install Co-Scientist](../enterprise/install-seqera-coscientist.mdx) and [Prerequisites](./prerequisites.md).
:::

## Get started

After an administrator deploys Co-Scientist for your installation:

1. Install the Seqera CLI:

   ```bash
   npm install -g seqera
   ```

1. Log in to Seqera:

   ```bash
   seqera login
   ```

1. Start your first session:

   ```bash
   seqera ai
   ```

The CLI must point at your Enterprise deployment rather than Seqera Platform Cloud. See [Installation](./installation.mdx) for prerequisites and updates, [Authentication](./authentication.md) for signing in to your installation, and [Quickstart](./quickstart.md) to walk through your first session.

## What you can do

Co-Scientist helps across the full pipeline lifecycle, from writing code to running it on Seqera Platform:

### Develop pipelines

Generate Nextflow configurations and pipeline schemas, convert scripts from other languages (WDL, R) to Nextflow, and discover over 1,000 nf-core modules with ready-to-run commands. Build reproducible Wave containers from conda or pip packages without writing a Dockerfile. Real-time language server protocol (LSP) code intelligence detects errors and powers AI navigation across Nextflow, Python, and R files.

### Run and debug on Platform

Launch, monitor, and debug Nextflow workflows with real-time status, logs, and run metrics. Browse cloud storage through data links, manage datasets, generate upload and download URLs, and access reference genomes. Co-Scientist works with the compute environments, datasets, and workspaces your account can already access.

### Work your way

Ask in plain English, or use reusable [skills](./skills.md) exposed as slash commands in the `/` palette. Switch between [build, plan, and goal modes](./modes.md) to match execution, analysis, or long-running tasks. Resume earlier sessions with `seqera ai -c`, and organize workspace resources into [projects](./projects.md) using Platform labels.

## Learn more

- [Prerequisites](./prerequisites.md): What your installation needs before deploying Co-Scientist
- [Install Co-Scientist](../enterprise/install-seqera-coscientist.mdx): Deploy the agent backend, MCP server, and web interface
- [Installation](./installation.mdx): Install, update, and configure the CLI
- [Quickstart](./quickstart.md): Run your first Co-Scientist session
- [Authentication](./authentication.md): Log in, log out, and manage sessions
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Using Co-Scientist](./configuration.md): Configure modes, sessions, skills, command approval, and more
- [Coding Agents](./coding-agents.md): Install Co-Scientist as a skill in your coding agent
- [Usage and cost](./usage-and-cost.md): Co-Scientist usage in Enterprise deployments
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits
- [Troubleshooting](../troubleshooting_and_faqs/coscientist_troubleshooting.md): Troubleshoot common errors

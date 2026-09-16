---
title: "Co-Scientist"
description: "AI assistant for bioinformatics, available in Seqera Platform and the Seqera CLI"
date created: "2026-03-11"
last updated: "2026-08-25"
tags: [co-scientist, platform, cli, ai]
---

Co-Scientist is Seqera's AI assistant for bioinformatics. It builds, runs, and debugs Nextflow pipelines, manages your data, and works with your Seqera Platform resources.

You can use Co-Scientist in two places:

- **In Seqera Platform**: Open the Co-Scientist panel from any workspace page. Because Co-Scientist reads the page you are on, you can ask about the run, pipeline, or dataset in front of you without describing it first. See [Co-Scientist in Seqera Platform](./platform.md).
- **In the Seqera CLI**: Run `seqera ai` in your terminal to work in your local checkout with access to your Platform workspace. See [Installation](./installation.mdx).

Both use the same assistant and the same Seqera Platform account. Skills, modes, command approval, and the Nextflow language server protocol (LSP) are available only in the CLI.

## Get started

### In Seqera Platform

1. Sign in to [Seqera Platform](https://cloud.seqera.io) and open a workspace.
1. Select **Co-Scientist** in the navigation to open the panel.
1. Ask a question about the page you are on, such as why a run failed.

See [Co-Scientist in Seqera Platform](./platform.md) for page context, conversation history, and workspace scope.

### In the Seqera CLI

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

See [Installation](./installation.mdx) for prerequisites, updates, and development builds. Then see [Quickstart](./quickstart.md) to walk through your first session.

## What you can do

Co-Scientist works across the pipeline lifecycle, from writing Nextflow code to running it on Seqera Platform.

### Develop pipelines

Generate Nextflow configurations and pipeline schemas, convert scripts from other languages (WDL, R) to Nextflow, and discover over 1,000 nf-core modules with ready-to-run commands. Build reproducible Wave containers from conda or pip packages without writing a Dockerfile. The Nextflow language server detects errors as you edit and lets Co-Scientist navigate Nextflow, Python, and R files.

### Run and debug on Platform

Launch, monitor, and debug pipeline runs with real-time status, logs, and run metrics. Browse cloud storage through data-links, manage datasets, generate upload and download URLs, and access reference genomes. Co-Scientist works with the compute environments, datasets, and workspaces your account can already access.

### Sessions, skills, and modes

Ask in plain English in Seqera Platform or the CLI. In the CLI, use reusable [skills](./skills.md) exposed as slash commands in the `/` palette. Switch between [build, plan, and goal modes](./modes.md) to match execution, analysis, or long-running tasks. Resume earlier sessions with `seqera ai -c`, and organize workspace resources into [projects](./projects.md) using Platform labels.

## Learn more

- [Co-Scientist in Seqera Platform](./platform.md): Use the Co-Scientist panel in Seqera Platform
- [Installation](./installation.mdx): Install, update, and configure the CLI
- [Quickstart](./quickstart.md): Run your first Co-Scientist session in the CLI
- [Authentication](./authentication.md): Log in, log out, and manage sessions
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Using Co-Scientist](./configuration.md): Configure modes, sessions, skills, command approval, and more
- [Coding Agents](./coding-agents.md): Install Co-Scientist as a skill in your coding agent
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

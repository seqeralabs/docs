---
title: "Co-Scientist in Seqera CLI"
description: "AI-powered assistant for bioinformatics workflows and Seqera Platform"
date created: "2026-03-11"
last updated: "2026-04-29"
tags: [co-scientist, cli, ai]
---

Co-Scientist is Seqera's AI assistant for bioinformatics. You interact with it through the [Seqera CLI](./installation.mdx) (`seqera ai`) to build, run, and debug Nextflow pipelines, manage your data, and drive Seqera Platform from a single terminal session. It combines self-service bioinformatics, conversational intelligence, and autonomous execution in one experience.

Co-Scientist works across three contexts:

- **Your Seqera Platform workspace**: View and manage workflows, pipelines, and data through your authenticated account.
- **Your local environment**: Run commands and edit files in your working directory, with configurable approval controls.
- **AI capabilities**: Natural language understanding, code generation, and intelligent suggestions.

## Get started

To get started with Co-Scientist:

1. Install Seqera CLI:

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

Co-Scientist helps across the full pipeline lifecycle, from writing code to running it on Seqera Platform:

### Develop pipelines

Generate Nextflow configurations and pipeline schemas, convert scripts from other languages (WDL, R) to Nextflow, and discover over 1,000 nf-core modules with ready-to-run commands. Build reproducible Wave containers from conda or pip packages without writing a Dockerfile. Real-time LSP code intelligence detects errors and powers AI navigation across Nextflow, Python, and R files.

### Run and debug on Platform

Launch, monitor, and debug Nextflow workflows from your terminal with real-time status, logs, and run metrics. Browse cloud storage through data links, manage datasets, generate upload and download URLs, and access reference genomes. Co-Scientist has full access to your compute environments, datasets, and workspace.

### Work your way

Interact in plain English, or use reusable [skills](./skills.md) exposed as slash commands in the `/` palette. Switch between [build, plan, and goal modes](./modes.md) to match execution, analysis, or long-running tasks. Resume earlier sessions with `seqera ai -c`, and organize workspace resources into [projects](./projects.md) using Platform labels.

## Learn more

- [Installation](./installation.mdx): Install, update, and configure the CLI
- [Quickstart](./quickstart.md): Run your first Co-Scientist session
- [Authentication](./authentication.md): Log in, log out, and manage sessions
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Using Co-Scientist](./configuration.md): Configure modes, sessions, skills, command approval, and more
- [Coding Agents](./coding-agents.md): Install Co-Scientist as a skill in your coding agent
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

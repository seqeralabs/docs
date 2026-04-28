---
title: "Co-Scientist CLI"
description: "AI-powered assistant for bioinformatics workflows and Seqera Platform"
date created: "2026-03-11"
tags: [seqera-ai, cli, ai]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Co-Scientist. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Co-Scientist CLI is an intelligent command-line assistant that helps you build, run, and manage bioinformatics workflows. Powered by advanced AI, it provides an interactive terminal experience for working with Nextflow pipelines and Seqera Platform.

Co-Scientist has access to:

- **Your Seqera Platform workspace**: View and manage workflows, pipelines, and data through your authenticated account
- **Your local environment**: Execute commands and edit files in your working directory (with configurable approval controls)
- **AI capabilities**: Natural language understanding, code generation, and intelligent suggestions

## Co-Scientist features

### Skills

Co-Scientist supports reusable skills for common workflows. Backend skills are exposed as slash commands in the `/` command palette and `/help`, and project or user `SKILL.md` files are discovered automatically from standard skill directories.

### Natural language interface

Interact with Seqera Platform using plain English. Ask questions, launch workflows, and manage pipelines through conversational commands.

### Build and plan modes

Switch between **build** and **plan** modes during an interactive session with `Shift+Tab`. Build mode is the default for execution and file changes, while plan mode is optimized for analysis, implementation planning, and read-only investigation.

### Goal mode

Use `/goal <task>` to set a persistent goal. Co-Scientist will keep working toward that goal across multiple model attempts until it is complete or the goal attempt limit is reached.

### Workflow management

Launch, monitor, and debug Nextflow workflows directly from your terminal. Get real-time status updates, view logs, and analyze run metrics.

### Pipeline development

Generate Nextflow configurations, create pipeline schemas, and convert scripts from other workflow languages (WDL, R) to Nextflow.

### nf-core integration

Search and discover nf-core modules, get detailed execution information, and access ready-to-run Nextflow commands for over 1,000 standardized bioinformatics tools.

### Data management

Browse cloud storage through data links, manage datasets, generate download and upload URLs, and access reference genomes and sequencing data.

### Wave containers

Build containerized environments on-the-fly with conda packages, pip packages, or custom Docker images. Create reproducible containers for your bioinformatics tools without writing Dockerfiles.

### Local file operations

Edit files, run commands, and manage your local development environment with AI assistance and configurable approval modes.

### LSP code intelligence

Real-time error detection and AI-powered code navigation for Nextflow, Python, and R files in your workspace.

### Session management

Resume previous sessions to continue your work. Use `seqera ai -c` to continue your most recent session or `seqera ai -s <id>` to resume a specific session.

### Seqera Platform integration

Full access to Platform capabilities including compute environments, datasets, data links, and workspace management.

### Projects

Organize a workspace into projects by applying Seqera Platform labels prefixed with `project_`. Each project scopes the pipelines, datasets, workflow runs, and chat context the AI sees — without needing a separate CRUD surface in Co-Scientist.

## Learn more

- [Installation](./installation.md): Detailed installation instructions
- [Authentication](./authentication.md): Log in, log out, and session management
- [Skills](./skills.md): Discover, create, and install skills
- [Modes](./modes.md): Work in build mode, plan mode, and goal mode
- [Command approval](./command-approval.md): Control which commands run automatically
- [Working with Claude Code](./skill-claude-code.md): Install Co-Scientist as a skill for Claude Code
- [Working with Codex](./skill-codex.md): Install Co-Scientist as a skill for Codex
- [Working with GitHub Copilot](./skill-github-copilot.md): Install Co-Scientist as a skill for GitHub Copilot
- [Working with other coding agents](./skill-other-agents.md): Install Co-Scientist for other coding agents
- [Code intelligence](./nextflow-lsp.md): Language-server support in Co-Scientist
- [Use cases](./use-cases.md): Co-Scientist CLI use cases
- [Projects](./projects.md): Organize workspace resources into projects using Platform labels
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

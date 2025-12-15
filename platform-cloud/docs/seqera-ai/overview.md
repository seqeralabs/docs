---
title: "Overview of Seqera AI CLI"
description: "AI-powered assistant for bioinformatics workflows and Seqera Platform"
date: "15 Dec 2025"
tags: [seqera-ai, cli, ai]
---

:::caution
Seqera AI is currently in beta. Features and commands may change as we continue to improve the product.
:::

Seqera AI is an intelligent command-line assistant that helps you build, run, and manage bioinformatics workflows. Powered by advanced AI, it provides an interactive terminal experience for working with Nextflow pipelines and the Seqera Platform.

## Key features

- **Natural language interface**: Interact with Seqera Platform using plain English. Ask questions, launch workflows, and manage pipelines through conversational commands.

- **Workflow management**: Launch, monitor, and debug Nextflow workflows directly from your terminal. Get real-time status updates, view logs, and analyze run metrics.

- **Pipeline development**: Generate Nextflow configurations, create pipeline schemas, and convert scripts from other workflow languages (WDL, Snakemake) to Nextflow.

- **nf-core integration**: Search and discover nf-core modules, get detailed execution information, and access ready-to-run Nextflow commands for over 1,000 standardized bioinformatics tools.

- **Data management**: Browse cloud storage through data links, manage datasets, generate download and upload URLs, and access reference genomes and sequencing data.

- **Wave containers**: Build containerized environments on-the-fly with conda packages, pip packages, or custom Docker images. Create reproducible containers for your bioinformatics tools without writing Dockerfiles.

- **Local file operations**: Edit files, run commands, and manage your local development environment with AI assistance and configurable approval modes.

- **Seqera Platform integration**: Full access to Platform capabilities including compute environments, datasets, data links, and workspace management.

## How it works

Seqera AI runs as a local CLI tool that connects to the Seqera AI backend service. When you start a session, the assistant has access to:

1. **Your Seqera Platform workspace** - View and manage workflows, pipelines, and data through your authenticated account.
2. **Your local environment** - Execute commands and edit files in your working directory (with configurable approval controls).
3. **AI capabilities** - Natural language understanding, code generation, and intelligent suggestions.

## Getting started

Install the CLI and start your first session in minutes:

```bash
# Install with pipx (recommended)
pipx install seqera-ai

# Login to your Seqera account
seqera login

# Start the AI assistant
seqera ai
```

See [Getting started](./getting-started) for a complete walkthrough.

## Requirements

- Python 3.13 or later
- A Seqera Platform account ([sign up for free](https://cloud.seqera.io))
- macOS, Linux, or Windows with WSL

## Learn more

- [Getting started](./getting-started) - Quick start guide with examples
- [Installation](./installation) - Detailed installation instructions
- [Authentication](./authentication) - Login, logout, and session management
- [Approval modes](./approval-modes) - Control which commands run automatically

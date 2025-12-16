---
title: "Seqera AI CLI"
description: "AI-powered assistant for bioinformatics workflows and Seqera Platform"
date: "2025-12-15"
tags: [seqera-ai, cli, ai]
---

:::caution Seqera AI CLI is in beta
Seqera AI CLI is currently in beta. Features and commands may change as we continue to improve the product.
:::

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Seqera AI CLI is an intelligent command-line assistant that helps you build, run, and manage bioinformatics workflows. Powered by advanced AI, it provides an interactive terminal experience for working with Nextflow pipelines and Seqera Platform.

Seqera AI has access to:

- **Your Seqera Platform workspace**: View and manage workflows, pipelines, and data through your authenticated account
- **Your local environment**: Execute commands and edit files in your working directory (with configurable approval controls)
- **AI capabilities**: Natural language understanding, code generation, and intelligent suggestions

## Seqera AI features

### Natural language interface

Interact with Seqera Platform using plain English. Ask questions, launch workflows, and manage pipelines through conversational commands.

### Workflow management

Launch, monitor, and debug Nextflow workflows directly from your terminal. Get real-time status updates, view logs, and analyze run metrics.

### Pipeline development

Generate Nextflow configurations, create pipeline schemas, and convert scripts from other workflow languages (WDL, Snakemake) to Nextflow.

### nf-core integration

Search and discover nf-core modules, get detailed execution information, and access ready-to-run Nextflow commands for over 1,000 standardized bioinformatics tools.

### Data management

Browse cloud storage through data links, manage datasets, generate download and upload URLs, and access reference genomes and sequencing data.

### Wave containers

Build containerized environments on-the-fly with conda packages, pip packages, or custom Docker images. Create reproducible containers for your bioinformatics tools without writing Dockerfiles.

### Local file operations

Edit files, run commands, and manage your local development environment with AI assistance and configurable approval modes.

### Seqera Platform integration

Full access to Platform capabilities including compute environments, datasets, data links, and workspace management.

## Quick start

To quick start with Seqera AI:


1. Install the Seqera AI CLI:

    ```bash
    pip install seqera-ai
    ```

    See [Installation](./installation) for a comprehensive installation guide.

1. Log in to your Seqera account:

    ```bash
    seqera login
    ```

    See [Authentication](./authentication) for a comprehensive authentication guide.


1. Start Seqera AI:

    ```bash
    seqera ai
    ```

1. Run your first prompt:

    ```
    /debug
    ```

    See [Use cases](./use-cases.md) for a comprehensive list of use cases.

## Learn more

- [Installation](./installation): Detailed installation instructions
- [Authentication](./authentication): Login, logout, and session management
- [Use cases](./use-cases.md): Seqera AI use cases
- [Approval modes](./approval-modes): Control which commands run automatically

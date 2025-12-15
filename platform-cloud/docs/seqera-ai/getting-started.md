---
title: "Getting started"
description: "Quick start guide for Seqera AI CLI"
date: "15 Dec 2025"
tags: [seqera-ai, cli, ai, getting-started]
---

:::caution
Seqera AI is currently in beta. Features and commands may change as we continue to improve the product.
:::

This guide walks you through installing Seqera AI and running your first commands.

## Prerequisites

Before you begin, ensure you have:

- Python 3.13 or later installed
- A [Seqera Platform](https://cloud.seqera.io) account

## Step 1: Install the CLI

Install Seqera AI using pipx (recommended) or pip:

```bash
# Using pipx (recommended - installs in isolated environment)
pipx install seqera-ai

# Or using pip
pip install seqera-ai
```

Verify the installation:

```bash
seqera --version
```

## Step 2: Login to Seqera Platform

Authenticate with your Seqera Platform account:

```bash
seqera login
```

This opens your browser to complete authentication. Once successful, you'll see a confirmation message in your terminal.

## Step 3: Start the AI assistant

Launch the interactive assistant:

```bash
seqera ai
```

You'll see a welcome message and prompt where you can start typing commands in natural language.

## Step 4: Try your first commands

Once in the assistant, try these example commands:

### List your workflows

```
> List my recent workflows
```

The assistant will show your recent workflow runs from Seqera Platform.

### Check workflow status

```
> What's the status of my last run?
```

Get details about your most recent workflow execution, including status, duration, and any errors.

### Launch a pipeline

```
> Launch the nf-core/rnaseq pipeline with the test profile
```

The assistant will guide you through launching a workflow, asking for any required parameters.

## Basic usage examples

### Monitor a running workflow

```
> Show me the progress of workflow run 12345
```

```
> Get the logs for the failed task in my last run
```

### Debug a failed workflow

```
> Why did my last workflow fail?
```

The assistant analyzes logs and provides insights into what went wrong and how to fix it.

### Work with pipelines

```
> List all pipelines in my workspace
```

```
> Show me the parameters for nf-core/sarek
```

### Generate configuration files

Use the `/config` command to generate a nextflow.config file:

```
> /config
```

The assistant will analyze your project and create an appropriate configuration.

### Convert scripts to Nextflow

```
> /convert-python-script
```

Convert a Python script in your working directory to a Nextflow process.

## Working with nf-core modules

Seqera AI provides access to over 1,000 nf-core modules for common bioinformatics tasks:

### Search for modules

```
> Find nf-core modules for sequence alignment
```

```
> What modules are available for variant calling?
```

### Get module details

```
> Show me how to use the nf-core/bwa/mem module
```

The assistant returns detailed information including input/output schemas and ready-to-run Nextflow commands.

### Run a module

```
> Run FastQC on my FASTQ files
```

The assistant can generate the exact Nextflow command with proper parameters for your data.

## Working with data

Seqera AI helps you manage data through Platform data links and access reference datasets:

### Browse data links

```
> List my data links
```

```
> Show me the contents of my S3 data link
```

### Download and upload files

```
> Generate a download URL for results/final_report.html
```

```
> Upload my local results to the data link
```

### Access reference data

```
> Find the human reference genome GRCh38
```

```
> Search for RNA-Seq test data
```

## Building containers with Wave

Seqera AI can create containerized environments using Wave, without requiring you to write Dockerfiles:

### Create a container with conda packages

```
> Create a container with samtools and bwa from bioconda
```

### Create a container with pip packages

```
> Build a container with pandas, numpy, and scikit-learn
```

### Get a container for a specific tool

```
> I need a container with FastQC version 0.12.1
```

The assistant will generate a Wave container URL that you can use directly in your Nextflow pipelines or pull with Docker.

## Working with local files

Seqera AI can interact with files in your current working directory. Start the assistant from your project folder:

```bash
cd /path/to/your/project
seqera ai
```

Then ask the assistant to help with local tasks:

```
> Show me the structure of main.nf
```

```
> Add a new process to handle quality control
```

:::note
Local file operations are controlled by [approval modes](./approval-modes). By default, the assistant will ask for your approval before making changes outside your working directory or running potentially dangerous commands.
:::

## Using slash commands

Seqera AI includes built-in slash commands for common workflows. Type `/` to see all available commands:

| Command | Description |
|---------|-------------|
| `/config` | Generate a nextflow.config file |
| `/schema` | Generate a Nextflow schema |
| `/debug` | Run nextflow lint and preview |
| `/debug-last-run` | Debug the last local run |
| `/debug-last-run-on-seqera` | Debug the last Platform run |
| `/migrate-from-wdl` | Convert WDL to Nextflow |
| `/migrate-from-snakemake` | Convert Snakemake to Nextflow |
| `/convert-python-script` | Convert Python script to Nextflow |
| `/convert-r-script` | Convert R script to Nextflow |
| `/convert-jupyter-notebook` | Convert Jupyter notebook to Nextflow |
| `/write-nf-test` | Write nf-tests for your pipeline |

## Command-line options

Customize your session with these options:

```bash
# Start in a specific directory
seqera ai -w /path/to/project

# Set approval mode for local commands
seqera ai -a full
```

## Exiting the assistant

To end your session:

- Type `exit` or `quit`
- Press `Ctrl+C`

Your conversation history is preserved for the session but not stored permanently.

## Next steps

- [Installation](./installation) - Advanced installation options
- [Authentication](./authentication) - Manage login sessions
- [Approval modes](./approval-modes) - Configure command approval settings

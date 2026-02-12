---
title: "Use cases"
description: "Learn how to use Seqera AI CLI for bioinformatics workflows, pipeline development, and data management"
date: "2025-12-15"
tags: [seqera-ai, cli, ai, use cases]
---

:::caution Seqera AI CLI is in beta
Seqera AI CLI is currently in beta. Features and commands may change as we continue to improve the product.
:::

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Seqera AI is an intelligent command-line assistant that helps you build, run, and manage bioinformatics workflows. The following sections describe several common use cases.

## Work with Nextflow

Seqera AI helps you develop, debug, and understand Nextflow pipelines with AI-powered analysis and code generation.

<!-- TODO: Replace with OpenTUI screenshots -->
![Use Seqera AI CLI to debug Nextflow pipeline scripts](./_images/pipeline-debug.gif)

<details open>
<summary>**Working with Nextflow**</summary>

**Understand your pipeline structure**:

```
> Show me the structure of main.nf
```

```
> What processes are defined in this pipeline?
```

**Generate a `nextflow.config` file**:

```
> /config
```

**Debug your pipeline**:

```
> /debug
```

```
> Why is my pipeline failing?
```

**Generate a schema (`nextflow_schema.json`) file**:

```
> /schema
```


**Convert scripts to Nextflow**:

```
> /convert-python-script
```

</details>

## Build containers with Wave

Seqera AI can create containerized environments using Wave, without requiring you to write Dockerfiles.

<!-- TODO: Replace with OpenTUI screenshots -->
![Use Seqera AI CLI to build containers with Wave](./_images/building-wave-container.gif)

<details open>
<summary>**Building containers with Wave**</summary>

**Create a container with conda packages**:

```
> Create a container with samtools and bwa from bioconda
```

**Create a container with pip packages**:

```
> Build a container with pandas, numpy, and scikit-learn
```

**Get a container for a specific tool**:

```
> I need a container with FastQC version 0.12.1
```

:::note
The assistant will generate a Wave container URL that you can use directly in your Nextflow pipelines or pull with Docker.
:::

</details>

## Customize your session

Customize your session with command-line options.

<details open>
<summary>**Customize your session**</summary>

**Start with an initial query**:

```bash
seqera ai "list my pipelines"
```

**Continue your last session**:

```bash
seqera ai -c
```

**Resume a specific session**:

```bash
seqera ai -s <session-id>
```

**Set approval mode for local commands**:

```bash
seqera ai --approval-mode full
```

</details>

## Exit the assistant

End your Seqera AI session when done.

<details open>
<summary>**Exit the assistant**</summary>

**To end your session**:

- Type `/exit`, `/quit`, or `/q`
- Press `Ctrl+C`

:::note
Your conversation history is preserved. You can resume a session later with `seqera ai -c` to continue your most recent session.
:::

</details>

## Use slash commands

Seqera AI includes built-in slash commands for common workflows.

<details open>
<summary>**TUI commands**</summary>

These commands are handled locally by the CLI:

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/exit` (`/quit`, `/q`) | Exit the application |
| `/clear` | Clear conversation history |
| `/thinking` | Toggle thinking display |
| `/scroll` | Toggle auto-scroll |
| `/org` | Show current organization |
| `/lsp` | Show LSP server status |
| `/status` | Show system status |
| `/credits` | Show credit balance and usage |
| `/approval` | Show or set approval mode |
| `/feedback` | Open feedback form |
| `/help-community` | Open community help |
| `/stickers` | Get Seqera stickers |

</details>

<details open>
<summary>**AI commands**</summary>

These commands are sent to the AI backend for processing:

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

</details>

## Work with data

Seqera AI helps you manage data through Platform data links and access reference datasets.

<details open>
<summary>**Working with data**</summary>

**Browse data links**:

```
> List my data links
```

```
> Show me the contents of my S3 data link
```

**Download and upload files**:

```
> Generate a download URL for results/final_report.html
```

```
> Upload my local results to the data link
```

**Access reference data**:

```
> Find the human reference genome GRCh38
```

```
> Search for RNA-Seq test data
```

</details>

## Work with local files

Seqera AI can interact with files in your current working directory.

<details open>
<summary>**Work with local files**</summary>

**Start the assistant from your project folder**:

```bash
cd /path/to/your/project
seqera ai
```

**Then, ask the assistant to help with local tasks**:

```
> Show me the structure of main.nf
```

```
> Add a new process to handle quality control
```

:::note
Local file operations are controlled by [approval modes](./command-approval.md#approval-modes). By default, the assistant will ask for your approval before making changes outside your working directory or running potentially dangerous commands.
:::

</details>

## Work with nf-core modules

Seqera AI provides access to over 1,000 nf-core modules for common bioinformatics tasks.

<details open>
<summary>**Working with nf-core modules**</summary>

**Search for modules**:

```
> Find nf-core modules for sequence alignment
```

```
> What modules are available for variant calling?
```

**Get module details**:

```
> Show me how to use the nf-core/bwa/mem module
```

**Run a module**:

```
> Run FastQC on my FASTQ files
```

:::note
The assistant can generate the exact Nextflow command with proper parameters for your data.
:::

</details>

## Work with Seqera Platform

Use Seqera Platform capabilities to run and manage workflows at scale with AI assistance.

<!-- TODO: Replace with OpenTUI screenshots -->
![Use Seqera AI CLI to debug Platform run errors](./_images/sp-run-debug.gif)

<details open>
<summary>**Working with Seqera Platform**</summary>

**List your workflows**:

```
> List my recent workflows
```

**Launch a pipeline**:

```
> Launch the nf-core/rnaseq pipeline with the test profile
```

**Debug failed runs**:

```
> Why did my last workflow fail?
```

```
> Get the logs for the failed task in my last run
```

</details>

## Headless mode

Run Seqera AI in headless mode for scripting and automation. Output is sent to stdout instead of the interactive TUI.

<details open>
<summary>**Headless mode**</summary>

**Run a query and pipe the output**:

```bash
seqera ai --headless "list my pipelines"
```

**Include thinking messages in the output**:

```bash
seqera ai --headless --show-thinking "debug my pipeline"
```

**Include tool calls in the output**:

```bash
seqera ai --headless --show-tools "list my workflows"
```

:::note
Headless mode is also auto-detected when stdout is piped (e.g., `seqera ai "query" | grep "result"`).
:::

</details>

## Session management

Seqera AI preserves your conversation history across sessions. You can resume previous sessions to continue your work.

<details open>
<summary>**Session management**</summary>

**Continue your most recent session**:

```bash
seqera ai -c
```

**Continue with a follow-up question**:

```bash
seqera ai -c "now run the pipeline with the test profile"
```

**Resume a specific session by ID**:

```bash
seqera ai -s <session-id>
```

</details>

<h2>Learn more</h2>

- [Seqera AI CLI](index.md): Seqera AI CLI overview
- [Installation](./installation.mdx): Detailed installation instructions
- [Authentication](./authentication.md): Log in, log out, and session management
- [Command approval](./command-approval.md): Control which commands run automatically
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

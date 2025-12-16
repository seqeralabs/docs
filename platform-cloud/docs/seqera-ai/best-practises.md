---
title: "Best practices"
description: "Best practices for working with Seqera AI"
date: "2025-12-15"
tags: [seqera-ai, cli, approval, best practices]
---

:::caution Seqera AI CLI is in beta
Seqera AI CLI is currently in beta. Features and commands may change as we continue to improve the product.
:::

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::



## Working with local files

Seqera AI can interact with files in your current working directory.

<details open>
<summary>**Working with local files**</summary>

Start the assistant from your project folder:

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

</details>

## Using slash commands

Seqera AI includes built-in slash commands for common workflows.

<details open>
<summary>**Using slash commands**</summary>

Type `/` to see all available commands:

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

## Command-line options

Customize your session with command-line options.

<details open>
<summary>**Command-line options**</summary>

```bash
# Start in a specific directory
seqera ai -w /path/to/project

# Set approval mode for local commands
seqera ai -a full
```

</details>

## Exiting the assistant

End your Seqera AI session when done.

<details open>
<summary>**Exiting the assistant**</summary>

To end your session:

- Type `exit` or `quit`
- Press `Ctrl+C`

Your conversation history is preserved for the session but not stored permanently.

</details>

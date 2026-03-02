---
title: "Use cases"
description: "Learn how to use Seqera AI CLI for bioinformatics workflows, pipeline development, and data management"
date: "2025-12-15"
tags: [seqera-ai, cli, ai, use cases]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Seqera AI is an intelligent command-line assistant that helps you build, run, and manage bioinformatics workflows. The following sections describe several common use cases.

## Work with Nextflow

Seqera AI helps you develop, debug, and understand Nextflow pipelines with AI-powered analysis and code generation.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/qJ46rsIbZsY?autoplay=1&mute=1" title="Use Seqera AI CLI to debug Nextflow pipeline scripts" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

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

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/jZy-5OtJ5Wc?autoplay=1&mute=1" title="Use Seqera AI CLI to generate a Nextflow config file" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

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

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/KxNzu7mqPjo?autoplay=1&mute=1" title="Use Seqera AI CLI to generate a Nextflow schema file" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

**Convert scripts to Nextflow**:

```
> /convert-python-script
```

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/93m4qsn8NO8?autoplay=1&mute=1" title="Use Seqera AI CLI to convert scripts to Nextflow" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

</details>

## Work with Seqera Platform

Use Seqera Platform capabilities to run and manage workflows at scale with AI assistance.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/69QSCQdgVR0?autoplay=1&mute=1" title="Use Seqera AI CLI to debug Platform run errors" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

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

## Build containers with Wave

Seqera AI can create containerized environments using Wave, without the need to write Dockerfiles.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/lihF6g9C3RY?autoplay=1&mute=1" title="Use Seqera AI CLI to build containers with Wave" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

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

**Start in a specific directory**:

```bash
seqera ai -w /path/to/project
```

**Set approval mode for local commands**:

```bash
seqera ai -a full
```

</details>

## Exit the assistant

End your Seqera AI session when done.

<details open>
<summary>**Exit the assistant**</summary>

**To end your session**:

- Type `exit` or `quit`
- Press `Ctrl+C`

:::note
Your conversation history is preserved for the session but not stored permanently.
:::

</details>

## Use slash commands

Seqera AI includes built-in slash commands for common workflows.

<details open>
<summary>**Use slash commands**</summary>

**Type `/` to see all available commands**:

| Command | Description |
|---------|-------------|
| `/config` | Generate a nextflow.config file |
| `/schema` | Generate a Nextflow schema |
| `/debug` | Run nextflow lint and preview |
| `/debug-last-run` | Debug the last local run |
| `/debug-last-run-on-seqera` | Debug the last Platform run |
| `/migrate-from-wdl` | Convert WDL to Nextflow |
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

<h2>Learn more</h2>

- [Seqera AI CLI](index.md): Seqera AI CLI overview
- [Installation](./installation.md): Detailed installation instructions
- [Authentication](./authentication.md): Log in, log out, and session management
- [Command approval](./command-approval.md): Control which commands run automatically
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

---
title: "Use cases"
description: "Common tasks you can do with Co-Scientist, with example prompts"
date created: "2026-03-11"
last updated: "2026-06-23"
tags: [co-scientist, cli, ai, use cases]
---

Co-Scientist is an AI assistant for building, running, and managing bioinformatics workflows, available through the Seqera CLI. The sections below walk through common tasks with example prompts you can adapt to your own work:

- [Develop and debug Nextflow pipelines](#develop-and-debug-nextflow-pipelines): Understand pipeline structure, generate config and schema files, debug runs, and convert scripts to Nextflow.
- [Run pipelines on Seqera Platform](#run-pipelines-on-seqera-platform): Launch, monitor, and debug workflow runs in your workspace.
- [Build containers with Wave](#build-containers-with-wave): Create containers from conda or pip packages without writing a Dockerfile.
- [Work with data](#work-with-data): Browse data links, move files, and find reference datasets.
- [Discover and run nf-core modules](#discover-and-run-nf-core-modules): Search over 1,000 nf-core modules and generate ready-to-run commands.
- [Edit local project files](#edit-local-project-files): Make AI-assisted edits to files in your working directory.

## Develop and debug Nextflow pipelines

Co-Scientist helps you develop, debug, and understand Nextflow pipelines with AI-powered analysis and code generation. The examples below are prompts you can adapt to your own pipeline.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/qJ46rsIbZsY?autoplay=1&mute=1" title="Use Co-Scientist to debug Nextflow pipeline scripts" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### Understand your pipeline structure

```
> Show me the structure of main.nf
```

```
> What processes are defined in this pipeline?
```

```
> /nf-pipeline-structure
```

### Generate configuration files

```
> /nextflow-config
```

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/jZy-5OtJ5Wc?autoplay=1&mute=1" title="Use Co-Scientist to generate a Nextflow config file" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### Debug your pipeline

```
> /debug
```

```
> Why is my pipeline failing?
```

### Review local execution history

```
> /nf-run-history
```

Trace output provenance with data lineage:

```
> /nf-data-lineage
```

### Generate schema files

```
> /nextflow-schema
```

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/KxNzu7mqPjo?autoplay=1&mute=1" title="Use Co-Scientist to generate a Nextflow schema file" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### Convert scripts to Nextflow

```
> /convert-python-script
```

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/93m4qsn8NO8?autoplay=1&mute=1" title="Use Co-Scientist to convert scripts to Nextflow" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### Fix strict syntax

```
> /fix-strict-syntax
```

### Migrate old schema definitions

```
> /nf-schema-migration
```

## Run pipelines on Seqera Platform

Use Seqera Platform capabilities to run and manage workflows at scale with AI assistance. The examples below are prompts you can adapt to your own workspace.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/69QSCQdgVR0?autoplay=1&mute=1" title="Use Co-Scientist to debug Platform run errors" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### List your workflows

```
> List my recent workflows
```

### Launch a pipeline

```
> Launch the nf-core/rnaseq pipeline with the test profile
```

### Debug failed runs

```
> Why did my last workflow fail?
```

```
> Get the logs for the failed task in my last run
```

### Debug your most recent run

```
> /debug-last-run-on-seqera
```

## Build containers with Wave

Co-Scientist can create containerized environments using Wave, without the need to write Dockerfiles. The examples below are prompts you can adapt to your own tools.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/lihF6g9C3RY?autoplay=1&mute=1" title="Use Co-Scientist to build containers with Wave" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

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

:::note
Co-Scientist generates a Wave container URL that you can use directly in your Nextflow pipelines or pull with Docker.
:::

## Work with data

Co-Scientist helps you manage data through Platform data links and access reference datasets. The examples below are prompts you can adapt to your own data.

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

## Discover and run nf-core modules

Co-Scientist provides access to over 1,000 nf-core modules for common bioinformatics tasks. The examples below are prompts you can adapt to your own analysis.

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

### Run a module

```
> Run FastQC on my FASTQ files
```

:::note
Co-Scientist can generate the exact Nextflow command with the correct parameters for your data.
:::

## Edit local project files

Co-Scientist can interact with files in your current working directory. The examples below are prompts you can adapt to your own project.

### Start from your project folder

```bash
cd /path/to/your/project
seqera ai
```

### Ask for help with local tasks

```
> Show me the structure of main.nf
```

```
> Add a new process to handle quality control
```

:::note
Local file operations are controlled by [approval modes](./command-approval.md#approval-modes). By default, Co-Scientist asks for your approval before making changes outside your working directory or running potentially dangerous commands.
:::

## Learn more

- [Modes](./modes.md): Work in build, plan, and goal modes
- [Skills configuration](./skills.md): Discover, create, and install skills
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits
- [Command approval](./command-approval.md): Control which commands run automatically
- [Code intelligence](./nextflow-lsp.md): Language-server support for Nextflow, Python, and R
- [Projects](./projects.md): Organize workspace resources into projects using Platform labels
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

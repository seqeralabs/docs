---
title: "Use cases"
description: "Learn how to use Co-Scientist CLI for bioinformatics workflows, pipeline development, and data management"
date created: "2026-03-11"
tags: [seqera-ai, cli, ai, use cases]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Co-Scientist. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Co-Scientist is an intelligent command-line assistant that helps you build, run, and manage bioinformatics workflows. The following sections describe several common use cases.

## Work with Nextflow

Co-Scientist helps you develop, debug, and understand Nextflow pipelines with AI-powered analysis and code generation.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/qJ46rsIbZsY?autoplay=1&mute=1" title="Use Co-Scientist CLI to debug Nextflow pipeline scripts" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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

```
> /nf-pipeline-structure
```

**Use `/nextflow-config` to generate and explain Nextflow configuration files**:

```
> /nextflow-config
```

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/jZy-5OtJ5Wc?autoplay=1&mute=1" title="Use Co-Scientist CLI to generate a Nextflow config file" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

**Debug your pipeline**:

```
> /debug
```

```
> Why is my pipeline failing?
```

**Review local execution history**:

```
> /nf-run-history
```

**Trace output provenance with data lineage**:

```
> /nf-data-lineage
```

**Use `/nextflow-schema` to generate `nextflow_schema.json` and sample sheet schema files**:

```
> /nextflow-schema
```

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/KxNzu7mqPjo?autoplay=1&mute=1" title="Use Co-Scientist CLI to generate a Nextflow schema file" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

**Convert scripts to Nextflow**:

```
> /convert-python-script
```

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/93m4qsn8NO8?autoplay=1&mute=1" title="Use Co-Scientist CLI to convert scripts to Nextflow" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

**Fix strict syntax issues**:

```
> /fix-strict-syntax
```

**Migrate old schema definitions**:

```
> /nf-schema-migration
```

</details>

## Work with Seqera Platform

Use Seqera Platform capabilities to run and manage workflows at scale with AI assistance.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/69QSCQdgVR0?autoplay=1&mute=1" title="Use Co-Scientist CLI to debug Platform run errors" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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

Co-Scientist can create containerized environments using Wave, without the need to write Dockerfiles.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/lihF6g9C3RY?autoplay=1&mute=1" title="Use Co-Scientist CLI to build containers with Wave" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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

**Switch between build mode and plan mode**:

- Press `Shift+Tab` in the composer
- Check the current mode in the composer footer
- Use `/status` if you want a full status readout

**Inspect available built-in commands and skills**:

```
/help
```

</details>

## Plan work before you edit

Use **plan mode** when you want analysis and a concrete implementation plan before making changes.

<details open>
<summary>**Planning in plan mode**</summary>

**Compare implementation strategies**:

```
> Compare whether I should add FastQC or fastp as the first QC step in this RNA-seq pipeline, including the workflow changes each option would require
```

**Ask for a step-by-step rollout plan**:

```
> Plan the work to add GPU support to this pipeline
```

**Review a codebase without modifying it**:

```
> Inspect this repository and outline the changes needed for Seqera Platform deployment
```

:::note
Plan mode is designed for read-only analysis. To execute commands, edit files, or write code, switch back to build mode with `Shift+Tab`.
:::

</details>

## Use goal mode for longer tasks

Use **goal mode** when you want Co-Scientist to keep working toward a task over multiple model attempts.

<details open>
<summary>**Working in goal mode**</summary>

**Start a persistent task**:

```
/goal migrate this pipeline to DSL2 and add nf-tests
```

**Check the active goal**:

```
/goal
```

**Disable goal mode**:

```
/goal off
```

:::note
Goal mode automatically switches command approval to `full` so the assistant can keep making progress. See [Command approval](./command-approval.md) for details.
:::

</details>

## Exit the assistant

End your Co-Scientist session when done.

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

Co-Scientist includes built-in slash commands for common workflows.

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
| `/help` | Show available commands and skills |
| `/status` | Show current mode, LSP, organization, and session status |
| `/sessions` | Browse and switch sessions |
| `/goal` | Set, inspect, or disable a persistent goal |
| `/credits` | Show monthly credit balance and usage |
| `/update` | Check for CLI updates |
| `/nextflow-config` | Generate and explain Nextflow configuration files |
| `/nextflow-schema` | Generate `nextflow_schema.json` and sample sheet schema files |
| `/debug` | Run nextflow lint and preview |
| `/debug-local-run` | Debug a local Nextflow pipeline run |
| `/debug-last-run-on-seqera` | Debug the last Platform run |
| `/migrate-from-wdl` | Convert WDL to Nextflow |
| `/convert-python-script` | Convert Python script to Nextflow |
| `/convert-r-script` | Convert R script to Nextflow |
| `/convert-jupyter-notebook` | Convert Jupyter notebook to Nextflow |
| `/write-nf-test` | Write nf-tests for your pipeline |

Skills exposed by your Co-Scientist deployment also appear in the `/` command palette and in `/help`.

</details>

## Work with skills

Co-Scientist can use reusable skills from your current project, your user profile, and the backend skill catalog exposed by your deployment.

<details open>
<summary>**Using skills**</summary>

**Open the command palette**:

- Type `/` to browse built-in commands and backend skills
- Run `/help` to see the same commands in a text list

**Use a built-in backend skill**:

Examples include:

- `/fix-strict-syntax`
- `/nf-pipeline-structure`
- `/nf-run-history`
- `/nf-data-lineage`
- `/seqera-platform-api`
- `/seqerakit`

**Create a project skill**:

Create a `SKILL.md` file in `.agents/skills/` or `.seqera/skills/` and restart `seqera ai`.

**Install Co-Scientist into coding agents**:

```bash
seqera skill install
```

</details>

## Work with data

Co-Scientist helps you manage data through Platform data links and access reference datasets.

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

Co-Scientist can interact with files in your current working directory.

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

Co-Scientist provides access to over 1,000 nf-core modules for common bioinformatics tasks.

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
![Use Co-Scientist CLI to debug Platform run errors](./_images/sp-run-debug.gif)

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

Run Co-Scientist in headless mode for scripting and automation. Output is sent to stdout instead of the interactive TUI.

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

Co-Scientist preserves your conversation history across sessions. You can resume previous sessions to continue your work.

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

- [Co-Scientist CLI](index.md): Co-Scientist CLI overview
- [Installation](./installation.md): Detailed installation instructions
- [Authentication](./authentication.md): Log in, log out, and session management
- [Skills](./skills.md): Discover, create, and install skills
- [Modes](./modes.md): Work in build mode, plan mode, and goal mode
- [Command approval](./command-approval.md): Control which commands run automatically
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

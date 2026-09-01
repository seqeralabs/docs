---
title: "Skills"
description: "Built-in skills, slash commands, and session limits for the Seqera CLI"
date created: "2026-05-27"
last updated: "2026-07-29"
tags: [co-scientist, cli, skills, reference]
---

This page lists the slash commands and built-in skills available in a Co-Scientist session. To learn how to discover, author, and install skills, see [Skills configuration](../skills.md).

## Slash commands

Co-Scientist exposes two kinds of slash command in the `/` palette. TUI commands are handled locally by the CLI to control the session itself:

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

The second kind, AI commands, are backed by skills and sent to the AI backend. The built-in ones are listed below, and any skills your deployment exposes appear alongside them in `/` and `/help`.

## Built-in skills

Co-Scientist includes a set of built-in skills. Invoke a skill directly with its slash command, or describe your task and Co-Scientist loads the matching skill.

:::note
Built-in skills change from release to release. Treat this page as a guide rather than an inventory. Type `/` or run `/help` in your session to see the current list for your deployment.
:::

### Build a pipeline

| Command | Description |
|---------|-------------|
| `/build-nextflow-pipeline` | Plan and scaffold a new DSL2 pipeline from scripts, notebooks, papers, or informal instructions, before you write any `.nf` code |
| `/create-workflow` | Assemble a pipeline from existing modules |
| `/nf-pipeline-design` | Design or refactor pipeline structure, including the shape of `main.nf`, subworkflow boundaries, and channel and metadata flow |
| `/nextflow-config` | Generate and explain `nextflow.config` files, including scopes, selectors, profiles, and container runtimes |
| `/nextflow-schema` | Generate `nextflow_schema.json` and sample sheet schema files |
| `/triage-pipeline-parameters` | Extract each meaningful setting from source material and triage it into a parameter, a pinned constant, or a profile override |
| `/nextflow-output-patterns` | Apply the correct operator idioms when aggregating per-sample outputs, including `collectFile`, `join`, `groupTuple`, and channel-level null handling |
| `/create-container` | Build, claim, or recommend a verified container for a tool, and verify it runs before you write a module |
| `/nf-docker-scripts` | Decide whether custom scripts belong in `bin/`, in the `template` directive, or inline |
| `/search-existing-modules` | Search nf-core and the wider community for an existing module before writing your own |
| `/run-module` | Discover, inspect, and run a single module with `nextflow module search`, `view`, and `run` |

### Migrate and modernize

| Command | Description |
|---------|-------------|
| `/convert-jupyter-notebook` | Convert Jupyter notebooks to Nextflow processes and workflows |
| `/convert-python-script` | Convert standalone Python scripts to Nextflow |
| `/convert-r-script` | Convert R scripts to Nextflow, with containers and conda environments |
| `/migrate-from-snakemake` | Convert Snakemake workflows to idiomatic DSL2, using a test-first migration loop |
| `/nextflow-26-syntax` | Write, migrate, or debug workflows under the v2 strict-syntax parser used by Nextflow 26+ |
| `/nf-v2-boolean-params` | Fix boolean parameter handling under v2 strict syntax |
| `/nf-schema-migration` | Migrate from `nf-validation` to `nf-schema` v2 |
| `/maintain-nf-core-pipeline` | Bring an nf-core pipeline up to date, applying template syncs and module updates before remaining code changes |
| `/nf-plugin-legacy-migration` | Move a legacy plugin to the current plugin registry format |

### Test

| Command | Description |
|---------|-------------|
| `/nf-test` | Set up nf-test and write tests for pipelines, modules, and subworkflows |
| `/repair-nf-test` | Diagnose and fix failing nf-tests, snapshot mismatches, and assertion errors |

### Debug and repair

| Command | Description |
|---------|-------------|
| `/debug-local-run` | Debug a local run from `.nextflow.log`, work directories, and task error logs |
| `/debug-seqera-failed-run` | Debug a failed run on Seqera Platform using workflow details, failed tasks, and logs |
| `/repair-workflow` | Fix or improve an existing workflow, with the right validation loop for the problem |
| `/doctor` | Run an end-to-end self-test of your Co-Scientist deployment and report pass/fail per subsystem |

### Understand a pipeline or its history

| Command | Description |
|---------|-------------|
| `/nf-pipeline-structure` | Analyze how a local pipeline is organized, including processes, workflows, modules, and data flow |
| `/nf-run-history` | Summarize your recent local runs, including patterns, progress, and recurring issues |
| `/nextflow-history` | Inspect the local Nextflow history and cache, and correlate runs with work directories |
| `/nf-data-lineage` | Trace which inputs and processes produced a result, using the lineage store |
| `/nf-aggregate` | Aggregate metrics across Seqera Platform runs with the `nf-aggregate` pipeline |
| `/generate-pipeline-docs` | Generate publishable pipeline documentation from the code and its observed run patterns |
| `/generate-pipeline-memory` | Build private notes on a pipeline's run history and failure patterns at your organization |

### Work with Seqera Platform

| Command | Description |
|---------|-------------|
| `/launch-workflow` | Launch a pipeline on cloud or high-performance computing (HPC) infrastructure, and choose or confirm a compute environment |
| `/ce-credentials-setup` | Set up compute environments and the cloud or cluster credentials they need |
| `/seqera-data-links` | Add, list, update, and delete data links, including Amazon S3, Google Cloud Storage, and Azure storage |
| `/seqera-mcp` | Access Seqera Platform through Model Context Protocol (MCP) tools for structured, validated operations |
| `/seqerakit` | Write `seqerakit` YAML to automate Seqera Platform setup |

### Choose tools and accelerate

| Command | Description |
|---------|-------------|
| `/find-alternative-tools` | For a given analysis step, find the credible tool options with pros, cons, licensing, and a ranked recommendation |
| `/enumerate-alternative-tools` | Run the same tool enumeration as `/find-alternative-tools`. The `/create-workflow` and `/nf-pipeline-design` planning flows invoke this skill |
| `/parabricks` | Get version-aware guidance on NVIDIA Parabricks `pbrun` tools and assess GPU readiness |
| `/genomics-workflow-acceleration` | Add optional GPU steps to an existing genomics workflow, with runtime toggles that default to off |

### Set up and extend Nextflow

| Command | Description |
|---------|-------------|
| `/install-nextflow` | Install, upgrade, or verify Nextflow and its Java prerequisites |
| `/nf-plugin-development` | Create a plugin from the official template and publish it to the plugin registry |

### Review your code

| Command | Description |
|---------|-------------|
| `/simplify` | Review changed code for reuse, quality, and efficiency, then clean up the issues found |

## Payload limits

To keep session payloads small, Co-Scientist caps discovered skill context at **5 KB**. The total session payload cap is **20 KB**.

## Learn more

- [Installation](../installation.mdx): Install, update, and configure the CLI
- [Quickstart](../quickstart.md): Run your first Co-Scientist session
- [Authentication](../authentication.md): Log in, log out, and manage sessions
- [Use cases](../use-cases.md): Seqera CLI use cases
- [Using Co-Scientist](../configuration.md): Configure modes, sessions, skills, command approval, and more
- [Coding Agents](../coding-agents.md): Install Co-Scientist as a skill in your coding agent
- [Troubleshooting](../../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

---
title: "Skills"
description: "Built-in skills, slash commands, and session limits for the Seqera CLI"
date created: "2026-05-27"
last updated: "2026-06-18"
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

Your Co-Scientist deployment can expose built-in skills as slash commands. These appear in the `/` command palette and in `/help`.

The CLI includes the following built-in skills by default:

| Command | Description |
|---------|-------------|
| `/nextflow-config` | Generate and explain Nextflow configuration files |
| `/nextflow-schema` | Generate `nextflow_schema.json` and sample sheet schema files |
| `/debug-local-run` | Debug a local Nextflow pipeline run using `.nextflow.log`, work directories, and related artifacts |
| `/debug-last-run-on-seqera` | Debug the last pipeline run on Seqera Platform |
| `/convert-jupyter-notebook` | Convert Jupyter notebooks to Nextflow pipelines |
| `/convert-python-script` | Convert Python scripts, including standalone scripts and Snakemake-style logic, to Nextflow |
| `/convert-r-script` | Convert R scripts to Nextflow pipelines |
| `/migrate-from-wdl` | Convert WDL to Nextflow |
| `/write-nf-test` | Write nf-tests for your pipeline |
| `/fix-strict-syntax` | Fix Nextflow strict syntax errors and help migrate pipelines to the v2 parser |
| `/nf-aggregate` | Aggregate metrics from Nextflow runs on Seqera Platform using the `nf-aggregate` pipeline |
| `/nf-data-lineage` | Explore Nextflow data lineage to trace which inputs and processes produced a result |
| `/nf-pipeline-structure` | Analyze a local Nextflow pipeline structure, including processes, workflows, modules, and channel flow |
| `/nf-run-history` | Analyze local Nextflow run history and summarize recent activity, progress, and recurring issues |
| `/nf-schema-migration` | Migrate Nextflow pipelines from `nf-validation` to `nf-schema` v2 |
| `/seqera-mcp` | Access Seqera Platform through MCP tools for structured, validated operations |
| `/seqera-platform-api` | Query and manipulate Seqera Platform resources directly through the REST API |
| `/seqerakit` | Write `seqerakit` YAML configuration for automating Seqera Platform setup |
| `/simplify` | Review changed code for reuse, quality, and efficiency, then clean up issues found |

:::note
The exact built-in skills available in your environment may vary by deployment and release. Use `/help` or type `/` in the CLI to see the current list.
:::

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

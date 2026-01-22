---
title: Seqera Platform Tools
description: "Manage workflows, compute environments, and containers through Seqera Platform"
date created: "2026-01-12"
tags: [seqera, platform, nextflow, workflows, containers]
---

The Seqera tools provide comprehensive access to Seqera Platform for workflow management, compute environments, datasets, and Wave container provisioning. With 74+ tools available, this page highlights the most commonly used operations.

## RAG search tools

### search_seqera_api

Natural language search across all Seqera Platform, Wave, and SeqeraHub APIs. Use this to discover available operations.

**Example prompts:**

- "How do I launch a workflow?"
- "What APIs are available for managing compute environments?"
- "Find tools for creating containers"
- "Search for dataset management operations"

### call_seqera_api

Execute discovered APIs with validated parameters. Use after `search_seqera_api` to perform operations.

**Example prompts:**

- "Call the API to list my workflows"
- "Execute the container creation API"
- "Run the workflow launch operation"

## Workflow management

### platform_list_workflows

List all workflow runs in a workspace with status, duration, and metadata.

**Example prompts:**

- "List all my workflow runs"
- "Show me the recent workflows in my workspace"
- "What workflows have I run this week?"

### platform_get_workflow

Get detailed information about a specific workflow run including status, logs, and outputs.

**Example prompts:**

- "Get details for workflow run 5abc123"
- "Show me the status of my latest workflow"
- "What's the output of workflow 12345?"

### platform_launch_workflow

Launch a new workflow run with specified parameters, compute environment, and configuration.

**Example prompts:**

- "Launch nf-core/rnaseq with my sample sheet"
- "Run the variant calling pipeline on AWS Batch"
- "Start a new workflow with these parameters"

### platform_cancel_workflow

Cancel a running workflow.

**Example prompts:**

- "Cancel workflow run 5abc123"
- "Stop my currently running pipeline"

## Compute environments

### platform_list_compute_envs

List available compute environments in a workspace.

**Example prompts:**

- "List my compute environments"
- "What compute resources do I have available?"
- "Show me the AWS Batch environments"

### platform_get_compute_env

Get detailed configuration for a compute environment.

**Example prompts:**

- "Show details for compute environment aws-batch-prod"
- "What's the configuration of my Kubernetes environment?"

### platform_create_compute_env

Create a new compute environment (AWS Batch, Google Cloud, Azure, Kubernetes, etc.).

**Example prompts:**

- "Create an AWS Batch compute environment"
- "Set up a new Kubernetes executor"
- "Configure a Google Cloud environment for my pipelines"

## Datasets

### platform_list_datasets

List datasets available in a workspace.

**Example prompts:**

- "List all datasets in my workspace"
- "What datasets do I have available?"

### platform_create_dataset

Create a new dataset from a CSV/TSV file.

**Example prompts:**

- "Create a dataset from my sample sheet"
- "Upload this CSV as a new dataset"

## Pipelines

### platform_list_pipelines

List configured pipelines in a workspace.

**Example prompts:**

- "List all pipelines in my workspace"
- "What pipelines are available to run?"

### platform_add_pipeline

Add a new pipeline to the workspace.

**Example prompts:**

- "Add nf-core/rnaseq to my workspace"
- "Configure a new pipeline from GitHub"

## Wave container service

### wave_get_container

Create a container with specified packages (conda, pip) or from a Dockerfile.

**Example prompts:**

- "Create a container with samtools and bwa"
- "Build a container with Python 3.11 and pandas"
- "Get a container with bioconda packages: salmon, kallisto"

### wave_inspect_container

Inspect a container image to see its layers, packages, and metadata.

**Example prompts:**

- "Inspect the container image biocontainers/samtools"
- "What packages are in this container?"

## Package Search

### seqerahub_search_conda

Search for conda packages across bioconda, conda-forge, and other channels.

**Example prompts:**

- "Search for samtools in conda"
- "Find bioinformatics packages for alignment"
- "What versions of bwa are available?"

### seqerahub_search_pypi

Search for Python packages on PyPI.

**Example prompts:**

- "Search for pandas on PyPI"
- "Find Python packages for data visualization"

## Organizations & Teams

### platform_list_organizations

List organizations you belong to.

**Example prompts:**

- "List my organizations"
- "What organizations do I have access to?"

### platform_list_workspaces

List workspaces in an organization.

**Example prompts:**

- "List workspaces in my organization"
- "Show me all available workspaces"

### platform_list_members

List members of a workspace or organization.

**Example prompts:**

- "Who are the members of this workspace?"
- "List team members in my organization"

## Example Session

```
User: I want to run an RNA-seq analysis on my human samples

AI: Let me help you set that up. First, let me check your available resources.
    [Uses platform_list_compute_envs]

    You have these compute environments:
    - aws-batch-prod (AWS Batch, running)
    - local-docker (Local, running)

User: Use the AWS Batch one. I need a container with STAR and samtools

AI: [Uses wave_get_container with packages: star, samtools]
    Created container: wave.seqera.io/wt/abc123
    Contains: STAR 2.7.10b, samtools 1.17

User: Now launch nf-core/rnaseq with my samples

AI: [Uses platform_launch_workflow]
    Launched workflow run: 5x7abc123
    Pipeline: nf-core/rnaseq
    Compute: aws-batch-prod
    Status: SUBMITTED

User: What's the status?

AI: [Uses platform_get_workflow]
    Workflow: 5x7abc123
    Status: RUNNING
    Progress: 45% (18/40 tasks complete)
    Running for: 2h 15m
```

## Workspace Context

Most Platform operations require a workspace context. The AI assistant automatically uses your current workspace, or you can specify one:

**Example prompts:**

- "List workflows in workspace 'production'"
- "Switch to the 'development' workspace"
- "Use organization 'my-lab' and workspace 'rnaseq-project'"

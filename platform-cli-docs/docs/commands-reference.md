---
title: "Command Reference"
description: "Complete reference for Seqera Platform CLI commands"
date: "15 Jan 2026"
tags: [cli, commands, reference]
---

This reference documents all `tw` CLI commands for managing Seqera Platform resources. Each command page includes detailed descriptions, options, and examples.

:::note
The CLI performs operations in the user workspace context by default. Use the `TOWER_WORKSPACE_ID` environment variable or the `--workspace` parameter to specify an organization workspace ID.
:::

## `--help` flag

Use `-h` or `--help` with any command to view available options:

```bash
tw --help                         # List all commands
tw <command> -h                   # Show command options
tw <command> <subcommand> -h      # Show subcommand options
```

Example:

```bash
tw runs view -h              # Help for viewing runs
tw pipelines import -h        # Help for import subcommand
tw credentials add google -h  # Help for specific provider
```

## Commands by Category

### Info

- [**info**](reference/info) - Show system info and health status

### Resources

- [**credentials**](reference/credentials) - Manage workspace credentials
- [**compute-envs**](reference/compute-envs) - Manage compute environments
- [**datasets**](reference/datasets) - Manage datasets
- [**data-links**](reference/data-links) - Manage data links
- [**labels**](reference/labels) - Manage workspace labels
- [**secrets**](reference/secrets) - Manage secrets

### Pipelines & Runs

- [**pipelines**](reference/pipelines) - Manage pipelines
- [**launch**](reference/launch) - Launch a pipeline
- [**runs**](reference/runs) - Manage pipeline runs
- [**actions**](reference/actions) - Manage pipeline actions

### Organization & Access

- [**organizations**](reference/organizations) - Manage organizations
- [**workspaces**](reference/workspaces) - Manage workspaces
- [**teams**](reference/teams) - Manage teams
- [**members**](reference/members) - Manage organization members
- [**participants**](reference/participants) - Manage workspace participants
- [**collaborators**](reference/collaborators) - Manage organization collaborators

### Interactive environments

- [**studios**](reference/studios) - Manage studios

## Common Patterns

### Output Formats

Export command results to JSON:

```bash
tw <command> --output=json
```

Use with `jq` for filtering:

```bash
tw workspaces list --output=json | jq -r '.workspaces[].orgId'
```

### Workspace Context

Specify workspace by ID:

```bash
tw <command> -w 123456789012345
```

Or by organization/workspace name:

```bash
tw <command> -w myorg/myworkspace
```

Set default workspace:

```bash
export TOWER_WORKSPACE_ID=123456789012345
```

## Next Steps

- See individual command references using the navigation
- See [Installation](installation) for setup instructions and [Overview](overview) for CLI introduction

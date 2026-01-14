---
title: tw pipelines
description: Manage pipelines
---

# `tw pipelines`

Manage pipelines

## Overview

The `tw pipelines` commands allow you to manage and execute Nextflow pipelines in Seqera Platform. Use these commands to add pipelines to your workspace, launch pipeline runs with custom configurations, and manage pipeline resources.

## Common Workflows

### Quick Start: Running Your First Pipeline

1. Add a pipeline to your workspace:
   ```bash
   tw pipelines add \
     --name "My nf-core pipeline" \
     --url "https://github.com/nf-core/rnaseq"
   ```

2. Launch the pipeline:
   ```bash
   tw pipelines launch --id <pipeline-id>
   ```

3. Monitor the execution:
   ```bash
   tw runs view --id <run-id>
   ```

### CI/CD Integration

For automated pipeline execution in continuous integration:

```bash
#!/bin/bash
# Launch and monitor pipeline
RUN_ID=$(tw pipelines launch \
  --id $PIPELINE_ID \
  --params-file params.json \
  --output json | jq -r '.runId')

tw runs view --id $RUN_ID --wait
```

## Best Practices

- **Test in dev first**: Always test pipeline configurations in a development workspace before production runs
- **Use compute environment labels**: Organize resources by project or cost center using labels
- **Tag your runs**: Apply consistent tags to pipeline runs for easier tracking and reporting
- **Version your parameters**: Keep parameter files in version control alongside your analysis code
- **Monitor costs**: Use workspace insights to track compute costs per pipeline

## Pipeline Organization

Consider organizing pipelines by:
- **Project**: Group related analyses together
- **Stage**: Separate development, staging, and production pipelines
- **Team**: Organize by research group or department
- **Frequency**: Distinguish one-time analyses from recurring pipelines


## `tw pipelines list`

List pipelines

### Synopsis

```bash
tw pipelines list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Show only pipelines that contain the given word |  |  |
| `--visibility` | Show pipelines: ${COMPLETION-CANDIDATES} [default: private]. |  | `private` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

## `tw pipelines add`

Add a pipeline

### Synopsis

```bash
tw pipelines add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Pipeline name. Must be unique within the workspace. | ✓ |  |
| `-d`, `--description` | Pipeline description. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--labels` | Labels to apply to the resource. Provide comma-separated label values (use key=value format for resource labels). Labels will be created if they don't exist |  |  |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. |  |  |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. |  |  |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. |  |  |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. |  |  |
| `--revision` | Git revision, branch, or tag to use. |  |  |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. |  |  |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. |  |  |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. |  |  |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. |  |  |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). |  |  |
| `--main-script` | Alternative main script filename. Default: `main.nf`. |  |  |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. |  |  |
| `--schema-name` | Name of the pipeline schema to use. |  |  |
| `--user-secrets` | Array of user secrets to make available to the pipeline. |  |  |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. |  |  |

## `tw pipelines delete`

Remove a pipeline

### Synopsis

```bash
tw pipelines delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier |  |  |
| `-n`, `--name` | Pipeline name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw pipelines view`

View pipeline details

### Synopsis

```bash
tw pipelines view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier |  |  |
| `-n`, `--name` | Pipeline name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw pipelines update`

Update a pipeline

### Synopsis

```bash
tw pipelines update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-d`, `--description` | Pipeline description |  |  |
| `--new-name` | Pipeline new name |  |  |
| `--pipeline` | Nextflow pipeline URL |  |  |
| `-i`, `--id` | Pipeline identifier |  |  |
| `-n`, `--name` | Pipeline name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. |  |  |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. |  |  |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. |  |  |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. |  |  |
| `--revision` | Git revision, branch, or tag to use. |  |  |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. |  |  |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. |  |  |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. |  |  |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. |  |  |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). |  |  |
| `--main-script` | Alternative main script filename. Default: `main.nf`. |  |  |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. |  |  |
| `--schema-name` | Name of the pipeline schema to use. |  |  |
| `--user-secrets` | Array of user secrets to make available to the pipeline. |  |  |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. |  |  |

## `tw pipelines export`

Export a pipeline

### Synopsis

```bash
tw pipelines export [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier |  |  |
| `-n`, `--name` | Pipeline name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw pipelines import`

Add a pipeline from file content

### Synopsis

```bash
tw pipelines import [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Pipeline name | ✓ |  |
| `-c`, `--compute-env` | Compute environment name (defaults to value defined in JSON environment file) |  |  |
| `--overwrite` | Overwrite the pipeline if it already exists. |  | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw pipelines labels`

Manage pipeline labels

### Synopsis

```bash
tw pipelines labels [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier |  |  |
| `-n`, `--name` | Pipeline name |  |  |
| `--no-create` | Assign labels without creating the ones which were not found. |  |  |
| `--operations`, `-o` | Type of operation (set, append, delete) [default: set]. |  | `set` |

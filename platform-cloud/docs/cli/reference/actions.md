---
title: tw actions
description: Manage pipeline actions
---

# `tw actions`

Manage pipeline actions

Run `tw actions -h` to view supported pipeline action operations.

[Actions](../../pipeline-actions/overview) enable event-based pipeline execution, such as triggering a pipeline launch with a GitHub webhook whenever the pipeline repository is updated.


## `tw actions list`

List pipeline actions.

```bash
tw actions list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw actions view`

View pipeline action details.

```bash
tw actions view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Action unique identifier |  |  |
| `-n`, `--name` | Action name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw actions delete`

Delete a pipeline action.

```bash
tw actions delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Action unique identifier |  |  |
| `-n`, `--name` | Action name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw actions add`

Add a pipeline action.

```bash
tw actions add [OPTIONS]
```

Run `tw actions add -h` to view the required and optional fields for adding an action.


### `tw actions add github`

Add a pipeline action triggered by GitHub events.

```bash
tw actions add github [OPTIONS]
```

### `tw actions add tower`

Add a pipeline action triggered by Seqera Platform events.

```bash
tw actions add tower [OPTIONS]
```

## `tw actions update`

Update a pipeline action.

```bash
tw actions update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-s`, `--status` | Action status (pause or active) |  |  |
| `--new-name` | Updated action name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. |  |  |
| `-i`, `--id` | Action unique identifier |  |  |
| `-n`, `--name` | Action name |  |  |
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

## `tw actions labels`

Manage pipeline action labels.

```bash
tw actions labels [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Action unique identifier |  |  |
| `-n`, `--name` | Action name |  |  |
| `--no-create` | Assign labels without creating the ones which were not found. |  |  |
| `--operations`, `-o` | Type of operation (set, append, delete) [default: set]. |  | `set` |

---
title: "tw actions"
description: "Manage pipeline actions"
---

# `tw actions`

Manage pipeline actions

Run `tw actions -h` to view supported pipeline action operations.

[Actions][actions] enable event-based pipeline execution, such as triggering a pipeline launch with a GitHub webhook whenever the pipeline repository is updated.

## `tw actions list`

List pipeline actions

```bash
tw actions list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-l`, `--labels` | Show labels. | No | `false` |

## `tw actions view`

View pipeline action details

```bash
tw actions view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Action unique identifier | Yes |  |
| `-n`, `--name` | Action name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

## `tw actions delete`

Delete a pipeline action

```bash
tw actions delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Action unique identifier | Yes |  |
| `-n`, `--name` | Action name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

## `tw actions add`

Add a pipeline action

```bash
tw actions add
```

Run `tw actions add -h` to view the required and optional fields for adding an action.

Use `--nextflow-version`, `--syntax-parser`, and `--output-dir` to save the Nextflow version, language parser, and workflow output directory with the action. See [Nextflow version][nextflow-version], [Enable Nextflow syntax parser v2][syntax-parser-v2], and [Output directory][output-directory].

### `tw actions add github`

Add a pipeline action triggered by GitHub events

```bash
tw actions add github [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Action name. | Yes |  |
| `--pipeline` | Pipeline to launch. | Yes |  |
| `--labels` | Labels to apply to the resource. Provide comma-separated label values (use key=value format for resource labels). Labels will be created if they don't exist | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--syntax-parser` | Nextflow language syntax parser version: 'v1' (legacy) or 'v2'. Takes precedence over the value stored in the launch configuration. | No |  |
| `--nextflow-version` | Nextflow version to run the workflow with. Must exist in the Platform version catalog and meet the minimum required by the compute environment. Takes precedence over the value stored in the launch configuration. | No |  |
| `--output-dir` | Per-run output directory, passed to Nextflow as '-output-dir'. Requires Nextflow 24.10.0 or later and the workflow outputs syntax. Takes precedence over the value stored in the launch configuration. | No |  |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. | No |  |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. | No |  |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. | No |  |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. | No |  |
| `--revision` | Git revision, branch, or tag to use. Use --commit-id to pin to a specific commit within the revision. | No |  |
| `--commit-id` | Specific Git commit hash to pin the pipeline execution to. | No |  |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. | No |  |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No |  |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No |  |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. | No |  |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). | No |  |
| `--main-script` | Alternative main script filename. Default: `main.nf`. | No |  |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. | No |  |
| `--schema-name` | Name of the pipeline schema to use. | No |  |
| `--user-secrets` | Array of user secrets to make available to the pipeline. | No |  |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. | No |  |
| `--overwrite` | Overwrite the action if it already exists. | No | `false` |

### `tw actions add tower`

Add a pipeline action triggered by Seqera Platform events

```bash
tw actions add tower [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Action name. | Yes |  |
| `--pipeline` | Pipeline to launch. | Yes |  |
| `--labels` | Labels to apply to the resource. Provide comma-separated label values (use key=value format for resource labels). Labels will be created if they don't exist | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--syntax-parser` | Nextflow language syntax parser version: 'v1' (legacy) or 'v2'. Takes precedence over the value stored in the launch configuration. | No |  |
| `--nextflow-version` | Nextflow version to run the workflow with. Must exist in the Platform version catalog and meet the minimum required by the compute environment. Takes precedence over the value stored in the launch configuration. | No |  |
| `--output-dir` | Per-run output directory, passed to Nextflow as '-output-dir'. Requires Nextflow 24.10.0 or later and the workflow outputs syntax. Takes precedence over the value stored in the launch configuration. | No |  |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. | No |  |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. | No |  |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. | No |  |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. | No |  |
| `--revision` | Git revision, branch, or tag to use. Use --commit-id to pin to a specific commit within the revision. | No |  |
| `--commit-id` | Specific Git commit hash to pin the pipeline execution to. | No |  |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. | No |  |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No |  |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No |  |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. | No |  |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). | No |  |
| `--main-script` | Alternative main script filename. Default: `main.nf`. | No |  |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. | No |  |
| `--schema-name` | Name of the pipeline schema to use. | No |  |
| `--user-secrets` | Array of user secrets to make available to the pipeline. | No |  |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. | No |  |
| `--overwrite` | Overwrite the action if it already exists. | No | `false` |

## `tw actions update`

Update a pipeline action

```bash
tw actions update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Action unique identifier | Yes |  |
| `-n`, `--name` | Action name | Yes |  |
| `-s`, `--status` | Action status (pause or active) | No |  |
| `--new-name` | Updated action name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--syntax-parser` | Nextflow language syntax parser version: 'v1' (legacy) or 'v2'. Takes precedence over the value stored in the launch configuration. | No |  |
| `--nextflow-version` | Nextflow version to run the workflow with. Must exist in the Platform version catalog and meet the minimum required by the compute environment. Takes precedence over the value stored in the launch configuration. | No |  |
| `--output-dir` | Per-run output directory, passed to Nextflow as '-output-dir'. Requires Nextflow 24.10.0 or later and the workflow outputs syntax. Takes precedence over the value stored in the launch configuration. | No |  |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. | No |  |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. | No |  |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. | No |  |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. | No |  |
| `--revision` | Git revision, branch, or tag to use. Use --commit-id to pin to a specific commit within the revision. | No |  |
| `--commit-id` | Specific Git commit hash to pin the pipeline execution to. | No |  |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. | No |  |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No |  |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No |  |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. | No |  |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). | No |  |
| `--main-script` | Alternative main script filename. Default: `main.nf`. | No |  |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. | No |  |
| `--schema-name` | Name of the pipeline schema to use. | No |  |
| `--user-secrets` | Array of user secrets to make available to the pipeline. | No |  |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. | No |  |

Run `tw actions update -h` to view the fields you can change on an existing action.

Options you omit keep their stored values. For example, updating only `--params-file` leaves the action's saved revision, profiles, Nextflow version, syntax parser, and output directory unchanged.

## `tw actions labels`

Manage pipeline action labels

```bash
tw actions labels [OPTIONS] [labels]
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `&lt;labels&gt;` | Comma-separated list of labels. | No |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Action unique identifier | Yes |  |
| `-n`, `--name` | Action name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--no-create` | Assign labels without creating the ones which were not found. | No |  |
| `--operations`, `-o` | Type of operation (set, append, delete) [default: set]. | No | `set` |

[actions]: /platform-cloud/pipeline-actions/overview
[aws-batch-pipeline-secrets]: /platform-cloud/compute-envs/aws-batch#pipeline-secrets-optional
[aws-cloud-advanced-options]: /platform-cloud/compute-envs/aws-cloud#advanced-options
[compute-envs]: /platform-cloud/compute-envs/overview
[credentials]: /platform-cloud/credentials/overview
[data-explorer]: /platform-cloud/data/data-explorer
[datasets]: /platform-cloud/data/datasets
[git-integration]: /platform-cloud/git/overview
[google-cloud-advanced-options]: /platform-cloud/compute-envs/google-cloud#advanced-options
[labels]: /platform-cloud/labels/overview
[nextflow-config]: https://docs.seqera.io/nextflow/config#config-syntax
[nextflow-version]: /platform-cloud/launch/advanced#nextflow-version
[organizations]: /platform-cloud/orgs-and-teams/organizations
[output-directory]: /platform-cloud/launch/launchpad#output-directory
[participant-roles]: /platform-cloud/orgs-and-teams/roles
[resource-labels]: /platform-cloud/resource-labels/overview
[run-details]: /platform-cloud/monitoring/run-details
[secrets]: /platform-cloud/secrets/overview
[shared-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[studio-checkpoints]: /platform-cloud/studios/managing#studio-session-checkpoints
[studios]: /platform-cloud/studios/overview
[syntax-parser-v2]: /platform-cloud/launch/advanced#enable-nextflow-syntax-parser-v2
[tower-agent]: /platform-cloud/supported_software/agent/overview
[user-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave

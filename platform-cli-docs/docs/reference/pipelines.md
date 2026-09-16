---
title: "tw pipelines"
description: "Manage pipelines"
---

# `tw pipelines`

Manage pipelines

Run `tw pipelines -h` to view the list of supported operations.

Pipelines define pre-configured workflows in a workspace. A pipeline consists of a workflow repository, launch parameters, and a compute environment.

## `tw pipelines list`

List pipelines

```bash
tw pipelines list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-l`, `--labels` | Show labels. | No | `false` |
| `-f`, `--filter` | Show only pipelines that contain the given word | No |  |
| `--visibility` | Show pipelines: all, private, shared [default: private]. | No | `private` |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

## `tw pipelines add`

Add a pipeline

```bash
tw pipelines add [OPTIONS] <PIPELINE_URL>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `PIPELINE_URL` | Nextflow pipeline URL | Yes |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Pipeline name. Must be unique within the workspace. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-d`, `--description` | Pipeline description. | No |  |
| `--version-name` | Initial pipeline version name. | No |  |
| `--labels` | Labels to apply to the resource. Provide comma-separated label values (use key=value format for resource labels). Labels will be created if they don't exist | No |  |
| `--pipeline-schema-id` | Pipeline schema identifier to use. | No |  |
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

Run `tw pipelines add -h` to view the required and optional fields for adding your pipeline.

Add a pre-configured pipeline to the Launchpad:

```bash
tw pipelines add --name=my_rnaseq_nf_pipeline \
--params-file=my_rnaseq_nf_pipeline_params.yaml \
--config=<path/to/nextflow/conf/file> \
https://github.com/nextflow-io/rnaseq-nf

New pipeline 'my_rnaseq_nf_pipeline' added at user workspace
```

The optional `--params-file` flag is used to pass a set of default parameters that will be associated with the pipeline in the Launchpad.

The optional `--config` flag is used to pass a custom Nextflow configuration file — configuration values passed here override the same values in the default pipeline repository `nextflow.conf` file. When this flag is set, all configuration values specified in Platform pipeline or compute environment **Nextflow config** fields are ignored.

:::tip
The `params-file` or `--config` file must be a YAML or JSON file using [Nextflow configuration][nextflow-config] syntax.
:::

Use `--nextflow-version`, `--syntax-parser`, and `--output-dir` to save the Nextflow version, language parser, and workflow output directory with the pipeline. Launches of the pipeline use these values unless a launch overrides them. See [Nextflow version][nextflow-version], [Enable Nextflow syntax parser v2][syntax-parser-v2], and [Output directory][output-directory].

## `tw pipelines delete`

Remove a pipeline

```bash
tw pipelines delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Pipeline identifier | Yes |  |
| `-n`, `--name` | Pipeline name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

## `tw pipelines view`

View pipeline details

```bash
tw pipelines view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Pipeline identifier | Yes |  |
| `-n`, `--name` | Pipeline name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--version-id` | Pipeline version identifier | Yes |  |
| `--version-name` | Pipeline version name | Yes |  |

## `tw pipelines update`

Update a pipeline

```bash
tw pipelines update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Pipeline identifier | Yes |  |
| `-n`, `--name` | Pipeline name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-d`, `--description` | Pipeline description | No |  |
| `--new-name` | Pipeline new name | No |  |
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
| `--pipeline-schema-id` | Pipeline schema identifier to use. | No |  |
| `--pipeline` | Nextflow pipeline URL | No |  |
| `--allow-draft` | If versionable fields change, keep the new version as an unnamed draft instead of auto-naming and promoting it to default. | No |  |
| `--version-id` | Pipeline version identifier | Yes |  |
| `--version-name` | Pipeline version name | Yes |  |

The default launch parameters can be changed with the `update` command:

```bash
tw pipelines update --name=my_rnaseq_nf_pipeline \
--params-file=my_rnaseq_nf_pipeline_params_2.yaml
```

Options you omit keep their stored values. For example, updating only `--params-file` leaves the pipeline's saved Nextflow version, syntax parser, and output directory unchanged.

## `tw pipelines export`

Export a pipeline

```bash
tw pipelines export [OPTIONS] [FILENAME]
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `FILENAME` | File name to export | No |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Pipeline identifier | Yes |  |
| `-n`, `--name` | Pipeline name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--version-id` | Pipeline version identifier | Yes |  |
| `--version-name` | Pipeline version name | Yes |  |

Export a pipeline configuration as JSON for scripting and reproducibility.

Command:

```bash
tw pipelines export --name=my_rnaseq_nf_pipeline my_rnaseq_nf_pipeline_v1.json
```

Example output:

```console
Pipeline exported into 'my_rnaseq_nf_pipeline_v1.json'
```

## `tw pipelines import`

Add a pipeline from file content

```bash
tw pipelines import [OPTIONS] <FILENAME>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `FILENAME` | File name to import | Yes |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Pipeline name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--compute-env` | Compute environment name (defaults to value defined in JSON compute environment file) | No |  |
| `--overwrite` | Overwrite the pipeline if it already exists. | No | `false` |

Import a pipeline into a workspace from a previously exported JSON file.

Command:

```bash
tw pipelines import --name=my_rnaseq_nf_pipeline_v1 ./my_rnaseq_nf_pipeline_v1.json
```

Example output:

```console
New pipeline 'my_rnaseq_nf_pipeline_v1' added at user workspace
```

## `tw pipelines labels`

Manage pipeline labels

```bash
tw pipelines labels [OPTIONS] [labels]
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `&lt;labels&gt;` | Comma-separated list of labels. | No |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Pipeline identifier | Yes |  |
| `-n`, `--name` | Pipeline name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--no-create` | Assign labels without creating the ones which were not found. | No |  |
| `--operations`, `-o` | Type of operation (set, append, delete) [default: set]. | No | `set` |

## `tw pipelines versions`

Manage pipeline versions

```bash
tw pipelines versions
```

### `tw pipelines versions list`

List pipeline versions

```bash
tw pipelines versions list [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Pipeline identifier | Yes |  |
| `-n`, `--name` | Pipeline name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-f`, `--filter` | Search pipeline versions by name prefix. Also supports keyword filters: versionName, versionId, versionHash. Multiple filters can be combined e.g. 'myPipeline versionName:&lt;name&gt; versionHash:&lt;hash&gt;'. | No |  |
| `--is-published` | Show only published pipeline versions if true, draft versions only if false, all versions by default | No |  |
| `--full-hash` | Show full-length hash values without truncation | No |  |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

### `tw pipelines versions manage`

Manage a pipeline version name or default version status

```bash
tw pipelines versions manage [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Pipeline identifier | Yes |  |
| `-n`, `--name` | Pipeline name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--version-id` | Pipeline version identifier | Yes |  |
| `--version-name` | Pipeline version name | Yes |  |
| `--new-name` | New name for the pipeline version | No |  |
| `--set-default` | Set this version as the default | No |  |

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

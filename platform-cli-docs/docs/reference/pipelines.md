---
title: tw pipelines
description: Manage pipelines
---

# tw pipelines

Run `tw pipelines -h` to view the list of supported operations.

Pipelines define pre-configured workflows in a workspace. A saved pipeline includes the repository source, launch parameters, compute environment, and, in newer Platform releases, optional persisted schemas and multiple saved versions.

## Pipeline versioning

Seqera Platform CLI `0.24` adds support for pipeline versioning workflows. In workspaces where pipeline versioning is enabled, you can:

- create a saved pipeline with an initial version name
- list saved versions for a pipeline
- target a specific version by `--version-id` or `--version-name`
- promote a version to default
- update a versionable field and let Platform create a new version

If you do not specify a version explicitly, the CLI uses the pipeline's default saved version.

## tw pipelines list

List pipelines.

```bash
tw pipelines list [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Show only pipelines that contain the given word | No | `null` |
| `--visibility` | Show pipelines: OWNER, MEMBER, COLLABORATOR [default: private]. | No | `private` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display | No | `null` |

#### Example

```bash
tw pipelines list -w 123456789012345
```

## tw pipelines add

Add a pipeline.

```bash
tw pipelines add [OPTIONS] <repository-url>
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Pipeline name. Must be unique within the workspace. | Yes | `null` |
| `<repository-url>` | Pipeline repository URL. Must be a full Git repository URL. | Yes | `null` |
| `-d`, `--description` | Pipeline description. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |
| `--labels` | Labels to apply to the resource. Provide comma-separated label values (use key=value format for resource labels). Labels will be created if they do not exist. | No | `null` |
| `--version-name` | Initial pipeline version name. | No | `null` |
| `--pipeline-schema-id` | Pipeline schema identifier to attach to the saved pipeline. | No | `null` |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. | No | `null` |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. | No | `null` |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. | No | `null` |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. | No | `null` |
| `--revision` | Git revision, branch, or tag to use. Use `--commit-id` to pin a specific commit within that revision. | No | `null` |
| `--commit-id` | Specific Git commit hash to pin the saved pipeline to. | No | `null` |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. | No | `null` |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. Provide the path to a file containing the content. | No | `null` |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. Provide the path to a file containing the content. | No | `null` |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. | No | `null` |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). | No | `null` |
| `--main-script` | Alternative main script filename. Default: `main.nf`. | No | `null` |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. | No | `null` |
| `--schema-name` | Name of the pipeline schema to use. | No | `null` |
| `--user-secrets` | Array of user secrets to make available to the pipeline. | No | `null` |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. | No | `null` |

#### Example

```bash
tw pipelines add \
  --name my-rnaseq \
  --version-name v1.0 \
  --pipeline-schema-id 98765 \
  --revision main \
  --commit-id a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2 \
  --params-file my-rnaseq-params.yaml \
  -w 123456789012345 \
  https://github.com/nextflow-io/rnaseq-nf
```

Example output:

```bash
New pipeline 'my-rnaseq' added at [my-organization / my-workspace] workspace
```

Use `--pipeline-schema-id` with a schema uploaded by `tw pipeline-schemas add` to make that schema part of the saved pipeline definition in Platform.

## tw pipelines view

View pipeline details.

```bash
tw pipelines view [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `--version-id` | Pipeline version identifier | No | `null` |
| `--version-name` | Pipeline version name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

If no version is specified, `view` shows the default saved version.

#### Example

```bash
tw pipelines view -n my-rnaseq --version-name v1.0 -w 123456789012345
```

The output includes version metadata such as the version name, whether it is the default version, and the version hash, followed by the resolved launch configuration.

## tw pipelines update

Update a pipeline.

```bash
tw pipelines update [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `--version-id` | Pipeline version identifier to update. If omitted, the default saved version is updated. | No | `null` |
| `--version-name` | Pipeline version name to update. If omitted, the default saved version is updated. | No | `null` |
| `-d`, `--description` | Pipeline description | No | `null` |
| `--new-name` | Pipeline new name | No | `null` |
| `--pipeline` | Nextflow pipeline URL | No | `null` |
| `--allow-draft` | If versionable fields change, keep the new version as an unnamed draft instead of auto-naming and promoting it to default. | No | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |
| `--pipeline-schema-id` | Pipeline schema identifier to attach to the saved pipeline. | No | `null` |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. | No | `null` |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. | No | `null` |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. | No | `null` |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. | No | `null` |
| `--revision` | Git revision, branch, or tag to use. Use `--commit-id` to pin a specific commit within that revision. | No | `null` |
| `--commit-id` | Specific Git commit hash to pin the saved pipeline to. | No | `null` |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. | No | `null` |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. Provide the path to a file containing the content. | No | `null` |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. Provide the path to a file containing the content. | No | `null` |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. | No | `null` |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). | No | `null` |
| `--main-script` | Alternative main script filename. Default: `main.nf`. | No | `null` |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. | No | `null` |
| `--schema-name` | Name of the pipeline schema to use. | No | `null` |
| `--user-secrets` | Array of user secrets to make available to the pipeline. | No | `null` |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. | No | `null` |

Version-aware update behavior:

- Non-versioned changes are applied in place.
- Changing versioned launch fields such as repository revision can cause Platform to create a new saved version.
- By default, the CLI auto-names that new version and promotes it to the default Launchpad version.
- With `--allow-draft`, the CLI leaves the new version as a draft so you can manage it later with `tw pipelines versions`.

#### Example

```bash
tw pipelines update \
  --name my-rnaseq \
  --version-name v1.0 \
  --revision release-branch \
  --allow-draft
```

Example output:

```bash
Pipeline 'my-rnaseq' updated at [my-organization / my-workspace] workspace
New draft version 'draft789' created. Use 'tw pipelines versions' to manage it.
```

## tw pipelines versions list

List saved pipeline versions.

```bash
tw pipelines versions list [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |
| `-f`, `--filter` | Search pipeline versions by name prefix. Also supports keyword filters: `versionName`, `versionId`, `versionHash`. | No | `null` |
| `--is-published` | Show only published pipeline versions if `true`, draft versions only if `false`, or all versions by default. | No | all versions |
| `--full-hash` | Show full-length hash values without truncation. | No | `false` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display | No | `null` |

#### Example

```bash
tw pipelines versions list \
  -n my-rnaseq \
  --is-published true \
  --full-hash
```

This command shows each version's ID, name, default status, hash, creator, and creation time.

## tw pipelines versions manage

Manage a pipeline version name or default status.

```bash
tw pipelines versions manage [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |
| `--version-id` | Pipeline version identifier | No | `null` |
| `--version-name` | Pipeline version name | No | `null` |
| `--new-name` | New name for the pipeline version | No | `null` |
| `--set-default` | Set this version as the default | No | `null` |

Provide at least one of `--new-name` or `--set-default`.

#### Example

```bash
tw pipelines versions manage \
  -n my-rnaseq \
  --version-id 7TnlaOKANkiDIdDqOO2kCs \
  --set-default \
  --new-name v2.0
```

Example output:

```bash
Pipeline version '7TnlaOKANkiDIdDqOO2kCs' of pipeline 'my-rnaseq' updated at workspace [my-organization / my-workspace]
```

## tw pipelines delete

Remove a pipeline.

```bash
tw pipelines delete [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

#### Example

```bash
tw pipelines delete -n my-rnaseq -w 123456789012345
```

## tw pipelines export

Export a pipeline.

```bash
tw pipelines export [OPTIONS] [FILENAME]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `--version-id` | Pipeline version identifier | No | `null` |
| `--version-name` | Pipeline version name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

If you do not provide a version selector, `export` uses the default saved version.

#### Example

```bash
tw pipelines export -n my-rnaseq --version-name v2.0 my-rnaseq-export.json
```

## tw pipelines import

Add a pipeline from file content.

```bash
tw pipelines import [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Pipeline name | Yes | `null` |
| `-c`, `--compute-env` | Compute environment name (defaults to value defined in the JSON file) | No | `null` |
| `--overwrite` | Overwrite the pipeline if it already exists. | No | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

#### Example

```bash
tw pipelines import -n my-rnaseq-imported -w 123456789012345 my-rnaseq-export.json
```

## tw pipelines labels

Manage pipeline labels.

```bash
tw pipelines labels [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `--no-create` | Assign labels without creating the ones that were not found. | No | `null` |
| `--operations`, `-o` | Type of operation (`set`, `append`, `delete`) [default: `set`]. | No | `set` |

#### Example

```bash
tw pipelines labels -n my-rnaseq -w 123456789012345 project=demo
```

:::tip
The `--params-file` flag is used to pass default launch parameters that are associated with the saved pipeline in the Launchpad.
:::

:::tip
The `--config` file must use [Nextflow configuration](https://docs.seqera.io/nextflow/config#config-syntax) syntax.
:::

---
title: tw pipelines
description: Manage pipelines
---

# tw pipelines

Run `tw pipelines -h` to view the list of supported operations.

Pipelines define pre-configured workflows in a workspace. A pipeline consists of a workflow repository, launch parameters, and a compute environment.

## tw pipelines list

List pipelines.

```bash
tw pipelines list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Show only pipelines that contain the given word |  |  |
| `--visibility` | Show pipelines: OWNER, MEMBER, COLLABORATOR [default: private]. |  | `private` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `TOWER_WORKSPACE_ID` |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

### Example

```bash
tw pipelines list -w 123456789012345

# Output:
  Pipelines at [my-organization-updated / my-workspace] workspace:

     ID              | Name                 | Repository                           | Visibility
    -----------------+----------------------+--------------------------------------+------------
     777888999000111 | rnaseq4              | https://github.com/nf-core/rnaseq    | SHARED
     888999000111222 | nf-core-rnaseq       | https://github.com/nf-core/rnaseq    | SHARED
     999000111222333 | rnaseq2              | https://github.com/nf-core/rnaseq    | SHARED
     555666777888999 | nextflow-hello-saved | https://github.com/nextflow-io/hello | SHARED
     000111222333444 | rnaseqapitest        | https://github.com/nf-core/rnaseq    | SHARED
     111222333444555 | rnaseq3              | https://github.com/nf-core/rnaseq    | SHARED
```

## tw pipelines add

Add a pipeline.

```bash
tw pipelines add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Pipeline name. Must be unique within the workspace. | ✓ |  |
| `-d`, `--description` | Pipeline description. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `TOWER_WORKSPACE_ID` |
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
The `params-file` or `--config` file must be a YAML or JSON file using [Nextflow configuration](https://www.nextflow.io/docs/latest/config.html#config-syntax) syntax.
:::

## tw pipelines view

View pipeline details.

```bash
tw pipelines view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier |  |  |
| `-n`, `--name` | Pipeline name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `TOWER_WORKSPACE_ID` |

### Example

```bash
tw pipelines view -n nextflow-hello-saved -w 123456789012345

# Output:
  Pipeline at [my-organization-updated / my-workspace] workspace:

    --------------+--------------------------------------
     ID           | 555666777888999
     Name         | nextflow-hello-saved
     Description  |
     Repository   | https://github.com/nextflow-io/hello
     Compute env. | deleted-999888777666555
     Labels       | label3

  Configuration:

     {
       "id" : "4n5o6p7q8r9s0t1u2v3w4x",
       "computeEnvId" : "5o6p7q8r9s0t1u2v3w4x5",
       "pipeline" : "https://github.com/nextflow-io/hello",
       "workDir" : "s3://my-bucket/work",
       "userSecrets" : [ ],
       "workspaceSecrets" : [ ],
       "resume" : false,
       "pullLatest" : false,
       "stubRun" : false,
       "dateCreated" : "2025-01-28T19:32:07Z"
     }
```

## tw pipelines update

Update a pipeline.

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
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `TOWER_WORKSPACE_ID` |
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

The default launch parameters can be changed with the `update` command:

```bash
tw pipelines update --name=my_rnaseq_nf_pipeline \
--params-file=my_rnaseq_nf_pipeline_params_2.yaml
```

## tw pipelines delete

Remove a pipeline.

```bash
tw pipelines delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier |  |  |
| `-n`, `--name` | Pipeline name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `TOWER_WORKSPACE_ID` |

### Example

```bash
tw pipelines delete -n rnaseq2 -w 123456789012345

# Output:
  Pipeline 'rnaseq2' deleted at [my-organization-updated / my-workspace] workspace
```

## tw pipelines export

Export a pipeline.

```bash
tw pipelines export [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier |  |  |
| `-n`, `--name` | Pipeline name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `TOWER_WORKSPACE_ID` |

### Example

```bash
tw pipelines export -n nf-hello-2026 -w 123456789012345 hello-pipeline-export2.json

# Output:
  Pipeline exported into 'hello-pipeline-export2.json'
```

## tw pipelines import

Add a pipeline from file content.

```bash
tw pipelines import [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Pipeline name | ✓ |  |
| `-c`, `--compute-env` | Compute environment name (defaults to value defined in JSON environment file) |  |  |
| `--overwrite` | Overwrite the pipeline if it already exists. |  | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `TOWER_WORKSPACE_ID` |

### Example

```bash
tw pipelines import -n nf-hello-2026-imported -w 123456789012345 hello-pipeline-export2.json

# Output:
  New pipeline 'nf-hello-2026-imported' added at [my-organization-updated / my-workspace] workspace
```

## tw pipelines labels

Manage pipeline labels.

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

### Example

```bash
tw pipelines labels -n nf-hello-2026 -w 123456789012345 newlabel

# Output:
 'set' labels on 'pipeline' with id '666777888999000' at 123456789012345 workspace
```

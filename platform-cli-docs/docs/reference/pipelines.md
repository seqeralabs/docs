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
| `-f`, `--filter` | Show only pipelines that contain the given word | No | `null` |
| `--visibility` | Show pipelines: OWNER, MEMBER, COLLABORATOR [default: private]. | No | `private` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display (default: ) | No | `null` |

### Example

Command:

```bash
tw pipelines list -w 123456789012345
```

Example output:

```bash
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
tw pipelines add [OPTIONS] <repository-url>
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Pipeline name. Must be unique within the workspace. | Yes | `null` |
| `<repository-url>` | Pipeline repository URL. Must be a full Git repository URL (e.g., https://github.com/nextflow-io/rnaseq-nf). | Yes | `null` |
| `-d`, `--description` | Pipeline description. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |
| `--labels` | Labels to apply to the resource. Provide comma-separated label values (use key=value format for resource labels). Labels will be created if they don't exist | No | `null` |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. | No | `null` |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. | No | `null` |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. | No | `null` |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. | No | `null` |
| `--revision` | Git revision, branch, or tag to use. | No | `null` |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. | No | `null` |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No | `null` |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No | `null` |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. | No | `null` |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). | No | `null` |
| `--main-script` | Alternative main script filename. Default: `main.nf`. | No | `null` |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. | No | `null` |
| `--schema-name` | Name of the pipeline schema to use. | No | `null` |
| `--user-secrets` | Array of user secrets to make available to the pipeline. | No | `null` |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. | No | `null` |

Run `tw pipelines add -h` to view the required and optional fields for adding your pipeline.

Add a pre-configured pipeline to the Launchpad.

### Example

Command:

```bash
tw pipelines add --name=my_rnaseq_nf_pipeline \
--params-file=my_rnaseq_nf_pipeline_params.yaml \
--config=<path/to/nextflow/conf/file> \
-w 123456789012345 \
https://github.com/nextflow-io/rnaseq-nf
```

Example output:

```bash
New pipeline 'my_rnaseq_nf_pipeline' added at [my-organization / my-workspace] workspace
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
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw pipelines view -n nextflow-hello-saved -w 123456789012345
```

Example output:

```bash
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
| `-d`, `--description` | Pipeline description | No | `null` |
| `--new-name` | Pipeline new name | No | `null` |
| `--pipeline` | Nextflow pipeline URL | No | `null` |
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. | No | `null` |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. | No | `null` |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. | No | `null` |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. | No | `null` |
| `--revision` | Git revision, branch, or tag to use. | No | `null` |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. | No | `null` |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No | `null` |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No | `null` |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. | No | `null` |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). | No | `null` |
| `--main-script` | Alternative main script filename. Default: `main.nf`. | No | `null` |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. | No | `null` |
| `--schema-name` | Name of the pipeline schema to use. | No | `null` |
| `--user-secrets` | Array of user secrets to make available to the pipeline. | No | `null` |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. | No | `null` |

The default launch parameters can be changed with the `update` command.

### Example

Command:

```bash
tw pipelines update --name=my_rnaseq_nf_pipeline \
--params-file=my_rnaseq_nf_pipeline_params_2.yaml
```

Example output:

```bash
Pipeline 'my_rnaseq_nf_pipeline' updated at [my-organization / my-workspace] workspace
```

## tw pipelines delete

Remove a pipeline.

```bash
tw pipelines delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw pipelines delete -n rnaseq2 -w 123456789012345
```

Example output:

```bash
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
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw pipelines export -n nf-hello-2026 -w 123456789012345 hello-pipeline-export2.json
```

Example output:

```bash
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
| `-n`, `--name` | Pipeline name | Yes | `null` |
| `-c`, `--compute-env` | Compute environment name (defaults to value defined in JSON environment file) | No | `null` |
| `--overwrite` | Overwrite the pipeline if it already exists. | No | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw pipelines import -n nf-hello-2026-imported -w 123456789012345 hello-pipeline-export2.json
```

Example output:

```bash
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
| `-i`, `--id` | Pipeline identifier | No | `null` |
| `-n`, `--name` | Pipeline name | No | `null` |
| `--no-create` | Assign labels without creating the ones which were not found. | No | `null` |
| `--operations`, `-o` | Type of operation (set, append, delete) [default: set]. | No | `set` |

### Example

Command:

```bash
tw pipelines labels -n nf-hello-2026 -w 123456789012345 newlabel
```

Example output:

```bash


 'set' labels on 'pipeline' with id '666777888999000' at 123456789012345 workspace
```

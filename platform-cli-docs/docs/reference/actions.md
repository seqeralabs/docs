---
title: tw actions
description: Manage pipeline actions
---

# tw actions

Manage pipeline actions.

Run `tw actions -h` to view supported pipeline action operations.

[Actions](/platform-cloud/pipeline-actions/overview) enable event-based pipeline execution, such as triggering a pipeline launch with a GitHub webhook whenever the pipeline repository is updated.


## tw actions list

List pipeline actions.

```bash
tw actions list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

### Example

```bash
tw actions list -w 123456789012345

# Output:
  Actions for user-name user:

     ID                     | Name  | Endpoint                                                                                      | Status | Source
    ------------------------+-------+-----------------------------------------------------------------------------------------------+--------+--------
     1a2b3c4d5e6f7g8h9i0j1k | Testy | https://api.cloud.seqera.io/actions/1a2b3c4d5e6f7g8h9i0j1k/launch?workspaceId=123456789012345 | ACTIVE | tower
```

## tw actions view

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

### Example

```bash
tw actions view -n Testy -w 123456789012345

# Output:
  Details for action 'Testy'

    --------------+-------------------------------------------------------------------
     ID           | 1a2b3c4d5e6f7g8h9i0j1k
     Name         | Testy
     Status       | ACTIVE
     Pipeline URL | https://github.com/nextflow-io/rnaseq-nf
     Source       | tower
     Hook URL     | https://api.cloud.seqera.io/actions/1a2b3c4d5e6f7g8h9i0j1k/launch
     Last event   | never
     Date created | Tue, 10 Jun 2025 09:02:12 GMT
     Last event   | never
     Labels       | No labels found

  Configuration:

     {
       "id" : "3c4d5e6f7g8h9i0j1k2l3m",
       "computeEnvId" : "4d5e6f7g8h9i0j1k2l3m4n",
       "pipeline" : "https://github.com/nextflow-io/rnaseq-nf",
       "workDir" : "s3://my-bucket",
       "configProfiles" : [ ],
       "userSecrets" : [ ],
       "workspaceSecrets" : [ ],
       "resume" : false,
       "pullLatest" : false,
       "stubRun" : false,
       "dateCreated" : "2025-06-10T09:02:12Z"
     }
```

## tw actions add

Add a pipeline action.

```bash
tw actions add [OPTIONS]
```

Run `tw actions add -h` to view the list of supported event sources.

Run `tw actions add <source> -h` to view the required and optional fields for your event source.

### Example

```bash
tw actions add tower -n example-hello-action --pipeline=https://github.com/nextflow-io/hello -w 123456789012345

# Output:
  Pipeline action 'example-hello-action' added at [my-organization / my-workspace] workspace with id '2b3c4d5e6f7g8h9i0j1k2l'
```

:::note
The `--pipeline` parameter requires a full Git repository URL, not a saved pipeline name or ID.
:::

## tw actions update

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

### Example

```bash
tw actions update -n example-hello-action --status disabled -w 123456789012345

# Output:
  Pipeline action 'example-hello-action' updated at [my-organization / my-workspace] workspace with id '2b3c4d5e6f7g8h9i0j1k2l'
```

## tw actions delete

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

### Example

```bash
tw actions delete -n example-hello-action -w 123456789012345

# Output:
  Pipeline action 'example-hello-action' deleted at [my-organization / my-workspace] workspace
```

## tw actions labels

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

### Example

```bash
tw actions labels -n Testy -w 123456789012345 test-environment,label2

# Output:
 'set' labels on 'action' with id '1a2b3c4d5e6f7g8h9i0j1k' at 123456789012345 workspace
```

:::note
Requires either action name (`-n`) or action ID (`-i`). Labels are provided as a comma-separated list at the end of the command.
:::

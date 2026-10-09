---
title: "tw lineage"
description: "Explore data lineage records. Lineage must be enabled for the workspace."
---

# `tw lineage`

Explore data lineage records. Lineage must be enabled for the workspace.

## `tw lineage resolve`

Resolve a pipeline run or a file path to its lineage record identifier (LID)

```bash
tw lineage resolve [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |
| `--file-path` | Absolute path of a file produced by a pipeline run | Yes |  |
| `--session-id` | Nextflow session ID of the run | Yes |  |
| `--run-name` | Nextflow run name | Yes |  |

## `tw lineage view`

View a lineage record

```bash
tw lineage view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |
| `-i`, `--id` | Lineage record identifier (LID), e.g. lid://&lt;hash&gt;/&lt;path&gt; | Yes |  |
| `--summary` | Show only the record summary (name, path or run, and labels), read from the lineage index instead of the full record. | No |  |

## `tw lineage search`

Search lineage records across all the workspaces you can access

```bash
tw lineage search [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-q`, `--query` | Search query. Combines free text and the qualifiers: `type`, `workflow`, `task`, `pipeline`, `pipelineId`, `label`, and `workspace` (org/name) or `workspaceId` to narrow the scope. Whitespace means AND, a comma inside a qualifier means OR. Example: -q 'type:FileOutput workspace:acme/dev multiqc'. | No |  |
| `--max` | Maximum number of records per page (capped by the server) | No |  |
| `--page-token` | Token of the page to show, as printed by a previous search with the same query | No |  |

## `tw lineage upstream`

List the records one hop upstream of a task or file record. By default, the task that produced a file, or the input files of a task.

```bash
tw lineage upstream [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |
| `-i`, `--id` | Lineage record identifier (LID), e.g. lid://&lt;hash&gt;/&lt;path&gt; | Yes |  |
| `-t`, `--type` | Show only records of this type (FileOutput, TaskRun) | No |  |

## `tw lineage downstream`

List the records one hop downstream of a task or file record. By default, the tasks that consumed a file, or the output files of a task.

```bash
tw lineage downstream [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |
| `-i`, `--id` | Lineage record identifier (LID), e.g. lid://&lt;hash&gt;/&lt;path&gt; | Yes |  |
| `-t`, `--type` | Show only records of this type (FileOutput, TaskRun) | No |  |

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

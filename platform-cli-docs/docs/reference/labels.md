---
title: "tw labels"
description: "Manage workspace labels"
---

# `tw labels`

Manage workspace labels

Run `tw labels -h` to view supported label operations.

Manage labels and resource labels.

## `tw labels add`

Add a label

```bash
tw labels add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Label name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-v`, `--value` | Label value | No |  |

Run `tw labels add -h` to view the required and optional fields for adding a label.

:::note
[Resource labels][resource-labels] consist of a `name=value` pair and can only be applied to compute environments, pipelines, runs, and actions.
[Labels][labels] require only a name and can be applied to pipelines, runs, and actions.
:::

```bash
tw labels add -n Label1 -w DocTestOrg2/Testing -v Value1

Label 'Label1=Value1' added at 'DocTestOrg2/Testing' workspace with id '268741348267491'
```

## `tw labels list`

List labels

```bash
tw labels list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-t`, `--type` | Label type: normal, resource, or all (default: all) | No | `all` |
| `-f`, `--filter` | Filter labels by substring | No |  |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

Run `tw labels list -h` to view the optional fields for filtering labels.

Command:

```bash
tw labels list

Labels at 97652229034604 workspace:
```

Example output:

```bash
ID            | Name                   | Value     | Type
  -----------------+------------------------+-----------+----------
    116734717739444 | manual-fusion-amd64    |           | Normal
    120599302764779 | test-with-prefix       |           | Normal
    128477232893714 | manual-fusion-arm64    |           | Normal
    214201679620273 | test-config-link       |           | Normal
    244634136444435 | manual-nonfusion-amd64 |           | Normal
    9184612610501   | Resource1              | Value1    | Resource
```

## `tw labels update`

Update a label

```bash
tw labels update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Label identifier | Yes |  |
| `-n`, `--name` | Label name | No |  |
| `-v`, `--value` | Label value | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

Run `tw labels update -h` to view the required and optional fields for updating labels.

## `tw labels delete`

Delete a label

```bash
tw labels delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Label ID | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

Run `tw labels delete -h` to view the required and optional fields for deleting labels.

```bash
tw labels delete -i 203879852150462

Label '203879852150462' deleted at '97652229034604' workspace
```

[actions]: /platform-cloud/pipeline-actions/overview
[compute-envs]: /platform-cloud/compute-envs/overview
[credentials]: /platform-cloud/credentials/overview
[data-explorer]: /platform-cloud/data/data-explorer
[datasets]: /platform-cloud/data/datasets
[git-integration]: /platform-cloud/git/overview
[labels]: /platform-cloud/labels/overview
[nextflow-config]: https://docs.seqera.io/nextflow/config#config-syntax
[organizations]: /platform-cloud/orgs-and-teams/organizations
[participant-roles]: /platform-cloud/orgs-and-teams/roles
[resource-labels]: /platform-cloud/resource-labels/overview
[run-details]: /platform-cloud/monitoring/run-details
[secrets]: /platform-cloud/secrets/overview
[shared-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[studio-checkpoints]: /platform-cloud/studios/managing#studio-session-checkpoints
[studios]: /platform-cloud/studios/overview
[tower-agent]: /platform-cloud/supported_software/agent/overview
[user-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave

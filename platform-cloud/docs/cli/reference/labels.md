---
title: tw labels
description: Manage workspace labels
---

# `tw labels`

Manage workspace [labels](../../labels/overview.md) and [resource labels](../../resource-labels/overview.md).

Run `tw labels -h` to view supported label operations.

## `tw labels add`

Add a label.

```bash
tw labels add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Label name | ✓ |  |
| `-v`, `--value` | Label value |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

Run `tw labels add -h` to view the required and optional fields for adding a label.

:::note
[Resource labels](../../resource-labels/overview) consist of a `name=value` pair and can only be applied to compute environments, pipelines, runs, and actions.
[Labels](../../labels/overview) require only a name and can be applied to pipelines, runs, and actions.
:::

```bash
tw labels add -n Label1 -w DocTestOrg2/Testing -v Value1

Label 'Label1=Value1' added at 'DocTestOrg2/Testing' workspace with id '268741348267491'
```

## `tw labels list`

List labels.

```bash
tw labels list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-t`, `--type` | Label type: normal, resource, or all (default: all) |  | `all` |
| `-f`, `--filter` | Filter labels by substring |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

Run `tw labels list -h` to view the optional fields for filtering labels.

```bash
tw labels list

Labels at 97652229034604 workspace:

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

Update a label.

```bash
tw labels update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Label identifier | ✓ |  |
| `-n`, `--name` | Label name |  |  |
| `-v`, `--value` | Label value |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

Run `tw labels update -h` to view the required and optional fields for updating labels.

## `tw labels delete`

Delete a label.

```bash
tw labels delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Label ID | ✓ |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

Run `tw labels delete -h` to view the required and optional fields for deleting labels.

```bash
tw labels delete -i 203879852150462

Label '203879852150462' deleted at '97652229034604' workspace
```

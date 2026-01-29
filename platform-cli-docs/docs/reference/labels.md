---
title: tw labels
description: Manage workspace labels
---

# tw labels

Manage workspace [labels](/platform-cloud/labels/overview) and [resource labels](/platform-cloud/resource-labels/overview).

Run `tw labels -h` to view supported label operations.

## tw labels add

Add a label.

Command:

```bash
tw labels add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Label name | Yes | `null` |
| `-v`, `--value` | Label value | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

Run `tw labels add -h` to view the required and optional fields for adding a label.

:::note
[Resource labels](/platform-cloud/resource-labels/overview) consist of a `name=value` pair and can only be applied to compute environments, pipelines, runs, and actions.
[Labels](/platform-cloud/labels/overview) require only a name and can be applied to pipelines, runs, and actions.
:::

```bash
tw labels add -n Label1 -w DocTestOrg2/Testing -v Value1

Label 'Label1=Value1' added at 'DocTestOrg2/Testing' workspace with id '268741348267491'
```

## tw labels list

List labels.

```bash
tw labels list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-t`, `--type` | Label type: normal, resource, or all (default: all) | No | `all` |
| `-f`, `--filter` | Filter labels by substring | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display (default: ) | No | `null` |

Run `tw labels list -h` to view the optional fields for filtering labels.

Command:

```bash
tw labels list
```

Example output:

```bash
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

## tw labels update

Update a label.

```bash
tw labels update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Label identifier | Yes | `null` |
| `-n`, `--name` | Label name | No | `null` |
| `-v`, `--value` | Label value | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

Run `tw labels update -h` to view the required and optional fields for updating labels.

### Example

Command:

```bash
tw labels update -i 444555666777888 -n label3 -w 123456789012345
```

Example output:

```bash
Label with id '444555666777888' at '123456789012345' workspace updated to 'label3'
```

## tw labels delete

Delete a label.

```bash
tw labels delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Label ID | Yes | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

Run `tw labels delete -h` to view the required and optional fields for deleting labels.

```bash
tw labels delete -i 203879852150462

Label '203879852150462' deleted at '97652229034604' workspace
```

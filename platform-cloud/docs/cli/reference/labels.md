---
title: tw labels
description: Manage workspace labels
---

# `tw labels`

Manage workspace labels

## `tw labels add`

Add a label

### Synopsis

```bash
tw labels add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Label name | ✓ |  |
| `-v`, `--value` | Label value |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw labels list`

List labels

### Synopsis

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

## `tw labels update`

Update a label

### Synopsis

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

## `tw labels delete`

Delete a label

### Synopsis

```bash
tw labels delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Label ID | ✓ |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

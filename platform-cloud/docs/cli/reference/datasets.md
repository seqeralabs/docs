---
title: tw datasets
description: Manage datasets
---

# `tw datasets`

Manage datasets

## `tw datasets add`

Add a dataset

### Synopsis

```bash
tw datasets add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Dataset name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. | ✓ |  |
| `-d`, `--description` | Optional dataset description. |  |  |
| `--header` | Treat first row as header |  |  |
| `--overwrite` | Overwrite the dataset if it already exists |  | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

## `tw datasets delete`

Delete a dataset

### Synopsis

```bash
tw datasets delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

## `tw datasets download`

Download a dataset

### Synopsis

```bash
tw datasets download [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--dataset-version` | Dataset version to download |  |  |
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

## `tw datasets list`

List datasets

### Synopsis

```bash
tw datasets list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Filter datasets by name substring |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

## `tw datasets view`

View dataset details

### Synopsis

```bash
tw datasets view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

### `tw datasets view versions`

Display dataset versions.

### Synopsis

```bash
tw datasets view versions [OPTIONS]
```

## `tw datasets update`

Update a dataset

### Synopsis

```bash
tw datasets update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--new-name` | Updated dataset name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. |  |  |
| `-d`, `--description` | Updated dataset description. |  |  |
| `--header` | Treat first row as header |  |  |
| `-f`, `--file` | Data file to upload |  |  |
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

## `tw datasets url`

Get dataset URL

### Synopsis

```bash
tw datasets url [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--dataset-version` | Dataset version for URL |  |  |
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

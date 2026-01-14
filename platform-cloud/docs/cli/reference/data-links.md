---
title: tw data-links
description: Manage data links
---

# `tw data-links`

Manage data links

## `tw data-links list`

List data links

### Synopsis

```bash
tw data-links list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--credentials` | Credentials identifier |  |  |
| `--wait` | Wait for all data links to be fetched to cache |  |  |
| `--visibility` | Filter by visibility: hidden, visible, or all |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

## `tw data-links add`

Add a data link

### Synopsis

```bash
tw data-links add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Data link name | ✓ |  |
| `-d`, `--description` | Data link description |  |  |
| `-u`, `--uri` | Data link URI | ✓ |  |
| `-p`, `--provider` | Cloud provider: aws, azure, or google | ✓ |  |
| `-c`, `--credentials` | Credentials identifier |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw data-links delete`

Delete a data link

### Synopsis

```bash
tw data-links delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Data link identifier |  |  |
| `-n`, `--name` | Data link name |  |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) |  |  |

## `tw data-links update`

Update a data link

### Synopsis

```bash
tw data-links update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Data link identifier | ✓ |  |
| `-n`, `--name` | Data link name | ✓ |  |
| `-d`, `--description` | Data link description |  |  |
| `-c`, `--credentials` | Credentials identifier |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw data-links browse`

Browse data link contents

### Synopsis

```bash
tw data-links browse [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--credentials` | Credentials identifier |  |  |
| `-p`, `--path` | Path to browse within the data link |  |  |
| `-f`, `--filter` | Filter results by prefix |  |  |
| `-t`, `--token` | Next page token for pagination |  |  |
| `--page` | Page number to display |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Data link identifier |  |  |
| `-n`, `--name` | Data link name |  |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) |  |  |

## `tw data-links download`

Download data link contents

### Synopsis

```bash
tw data-links download [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--credentials` | Credentials identifier | ✓ |  |
| `-o`, `--output-dir` | Output directory for downloaded files |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Data link identifier |  |  |
| `-n`, `--name` | Data link name |  |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) |  |  |

## `tw data-links upload`

Upload files to a data link

### Synopsis

```bash
tw data-links upload [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--credentials` | Credentials identifier | ✓ |  |
| `-o`, `--output-dir` | Destination directory in the data link |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Data link identifier |  |  |
| `-n`, `--name` | Data link name |  |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) |  |  |

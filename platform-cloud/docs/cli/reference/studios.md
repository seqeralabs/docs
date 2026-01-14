---
title: tw studios
description: Manage studios
---

# `tw studios`

Manage studios

## `tw studios view`

View studio details

### Synopsis

```bash
tw studios view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |

## `tw studios list`

List studios

### Synopsis

```bash
tw studios list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Optional filter criteria, allowing free text search on name and templateUrl and keywords: `userName`, `computeEnvName` and `status`. Example keyword usage: -f status:RUNNING. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

## `tw studios start`

Start a studio.

### Synopsis

```bash
tw studios start [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--wait` | Wait until given status or fail. Valid options: ${COMPLETION-CANDIDATES}. |  |  |
| `--labels` | Comma-separated list of labels |  |  |
| `--description` | Optional configuration override for 'description'. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). |  |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). |  |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). |  |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. |  |  |

## `tw studios add`

Add a studio

### Synopsis

```bash
tw studios add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Studio name. | ✓ |  |
| `-d`, `--description` | Studio description |  |  |
| `--conda-env-yml`, `--conda-env-yaml` | Path to a YAML env file with Conda packages to be installed in the studio environment |  |  |
| `-c`, `--compute-env` | Compute environment name | ✓ |  |
| `-a`, `--auto-start` | Create studio and start it immediately (default: false) |  | `false` |
| `--private` | Create a private studio that only you can access or manage (default: false) |  | `false` |
| `--labels` | Comma-separated list of labels |  |  |
| `--wait` | Wait until Studio is in RUNNING status. Valid options: ${COMPLETION-CANDIDATES}. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-t`, `--template` | Container image template to be used for Studio. Available templates can be listed with 'studios templates' command. |  |  |
| `-ct`, `--custom-template` | Custom container image template to be used for Studio. |  |  |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). |  |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). |  |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). |  |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. |  |  |

## `tw studios templates`

List available studio templates

### Synopsis

```bash
tw studios templates [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--max` | Maximum number of templates to return, defaults to 20. |  | `20` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw studios checkpoints`

List studio checkpoints

### Synopsis

```bash
tw studios checkpoints [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Optional filter criteria, allowing free text search on name and keywords: `after: YYYY-MM-DD`, `before: YYYY-MM-DD` and `author`. Example keyword usage: -f author:my-name. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

## `tw studios add-as-new`

Add a studio from an existing one

### Synopsis

```bash
tw studios add-as-new [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--parent-checkpoint-id` | Parent Studio checkpoint id, to be used as the starting point for the new Studio session. If not provided, it defaults to the most recent existing checkpoint of the parent Studio session. |  |  |
| `-n`, `--name` | Studio name. | ✓ |  |
| `-d`, `--description` | Studio description |  |  |
| `-a`, `--auto-start` | Create studio and start it immediately (default: false) |  | `false` |
| `--private` | Create a private studio that only you can access or manage (default: false) |  | `false` |
| `--labels` | Comma-separated list of labels |  |  |
| `--wait` | Wait until Studio is in RUNNING status. Valid options: ${COMPLETION-CANDIDATES}. |  |  |
| `-pid`, `--parent-id` | Parent studio session identifier |  |  |
| `-pn`, `--parent-name` | Parent studio name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). |  |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). |  |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). |  |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. |  |  |

## `tw studios stop`

Stop a studio.

### Synopsis

```bash
tw studios stop [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--wait` | Wait until given status or fail. Valid options: ${COMPLETION-CANDIDATES}. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |

## `tw studios delete`

Delete a studio.

### Synopsis

```bash
tw studios delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |

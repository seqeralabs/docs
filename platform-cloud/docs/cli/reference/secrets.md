---
title: tw secrets
description: Manage secrets
---

# `tw secrets`

Manage secrets

## `tw secrets list`

List secrets

### Synopsis

```bash
tw secrets list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw secrets add`

Add a secret

### Synopsis

```bash
tw secrets add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Secret name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. | ✓ |  |
| `-v`, `--value` | Secret value, to be stored securely. The secret is made available to pipeline executions at runtime. |  |  |
| `--overwrite` | Overwrite the secret if it already exists |  | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw secrets delete`

Delete a secret

### Synopsis

```bash
tw secrets delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Secret identifier |  |  |
| `-n`, `--name` | Secret name |  |  |

## `tw secrets view`

View secret details

### Synopsis

```bash
tw secrets view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Secret identifier |  |  |
| `-n`, `--name` | Secret name |  |  |

## `tw secrets update`

Update a secret

### Synopsis

```bash
tw secrets update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-v`, `--value` | New secret value, to be stored securely. The secret is made available to pipeline executions at runtime. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Secret identifier |  |  |
| `-n`, `--name` | Secret name |  |  |

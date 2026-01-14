---
title: tw participants
description: Manage workspace participants
---

# `tw participants`

Manage workspace participants

## `tw participants list`

List workspace participants

### Synopsis

```bash
tw participants list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-t`, `--type` | Participant type to list (MEMBER, TEAM, COLLABORATOR). |  |  |
| `-f`, `--filter` | Show only participants that it's name starts with the given word. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

## `tw participants add`

Add a workspace participant

### Synopsis

```bash
tw participants add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Team name, username or email for existing organization member. | ✓ |  |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | ✓ |  |
| `--overwrite` | Overwrite the participant if it already exists. |  | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

## `tw participants update`

Update a participant role

### Synopsis

```bash
tw participants update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Team name, username or email for existing organization member. | ✓ |  |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | ✓ |  |
| `-r`, `--role` | Workspace participant role (OWNER, ADMIN, MAINTAIN, LAUNCH, CONNECT or VIEW). | ✓ |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

## `tw participants delete`

Remove a workspace participant

### Synopsis

```bash
tw participants delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Team name, username or email for existing organization member. | ✓ |  |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | ✓ |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

## `tw participants leave`

Leave a workspace

### Synopsis

```bash
tw participants leave [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

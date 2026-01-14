---
title: tw workspaces
description: Manage workspaces
---

# `tw workspaces`

Manage workspaces

## `tw workspaces list`

List workspaces

### Synopsis

```bash
tw workspaces list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--org`, `--organization` | Workspace organization name |  |  |

## `tw workspaces delete`

Delete a workspace

### Synopsis

```bash
tw workspaces delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier |  |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format |  |  |

## `tw workspaces add`

Add a workspace

### Synopsis

```bash
tw workspaces add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--org`, `--organization` | Workspace organization name | ✓ |  |
| `-n`, `--name` | Unique workspace name within the organization. Must be 2-40 characters, start and end with alphanumeric characters, and can contain hyphens or underscores between characters. | ✓ |  |
| `-f`, `--full-name` | Full display name for the workspace. Maximum 100 characters. | ✓ |  |
| `-d`, `--description` | Optional description of the workspace. Maximum 1000 characters. |  |  |
| `-v`, `--visibility` | Workspace visibility setting. Accepts `PRIVATE` (only participants can access) or `SHARED` (all organization members can view). |  |  |
| `--overwrite` | Overwrite the workspace if it already exists |  | `false` |

## `tw workspaces update`

Update a workspace

### Synopsis

```bash
tw workspaces update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier | ✓ |  |
| `--new-name` | Updated workspace name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. Must be 2-40 characters. |  |  |
| `-f`, `--fullName` | Updated full display name for the workspace. Maximum 100 characters. |  |  |
| `-d`, `--description` | Updated workspace description. Maximum 1000 characters. |  |  |

## `tw workspaces view`

View workspace details

### Synopsis

```bash
tw workspaces view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier |  |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format |  |  |

## `tw workspaces leave`

Leave a workspace

### Synopsis

```bash
tw workspaces leave [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier |  |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format |  |  |

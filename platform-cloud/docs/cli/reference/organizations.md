---
title: tw organizations
description: Manage organizations
---

# `tw organizations`

Manage organizations

## `tw organizations list`

List organizations

### Synopsis

```bash
tw organizations list [OPTIONS]
```

## `tw organizations delete`

Delete an organization

### Synopsis

```bash
tw organizations delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Organization numeric identifier. The unique ID assigned when the organization was created. |  |  |
| `-n`, `--name` | Organization name. The unique organization name used as a human-readable identifier. |  |  |

## `tw organizations add`

Add an organization

### Synopsis

```bash
tw organizations add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Organization unique name. Must be unique across Seqera Platform. Used as the organization identifier in URLs and API calls. Cannot be changed after creation without --new-name. | ✓ |  |
| `-f`, `--full-name` | Organization display name. The full, human-readable name for the organization shown in the UI. Can contain spaces and special characters. | ✓ |  |
| `--overwrite` | Overwrite existing organization. If an organization with this name already exists, delete it first before creating the new one. Use with caution as this permanently deletes the existing organization and all associated data. |  | `false` |
| `-d`, `--description` | Organization description. Free-text description providing context about the organization's purpose, team, or projects. |  |  |
| `-l`, `--location` | Organization location. Geographic location or region where the organization is based (e.g., 'San Francisco, CA' or 'EU'). |  |  |
| `-w`, `--website` | Organization website URL. Public website or documentation site for the organization. Must be a valid URL (e.g., https://example.com). |  |  |

## `tw organizations update`

Update an organization

### Synopsis

```bash
tw organizations update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--new-name` | New unique name for the organization. Changes the organization's identifier. Must be unique across Seqera Platform. Updates URLs and API references. |  |  |
| `-f`, `--full-name` | New display name for the organization. The full, human-readable name shown in the UI. Can contain spaces and special characters. |  |  |
| `-i`, `--id` | Organization numeric identifier. The unique ID assigned when the organization was created. |  |  |
| `-n`, `--name` | Organization name. The unique organization name used as a human-readable identifier. |  |  |
| `-d`, `--description` | Organization description. Free-text description providing context about the organization's purpose, team, or projects. |  |  |
| `-l`, `--location` | Organization location. Geographic location or region where the organization is based (e.g., 'San Francisco, CA' or 'EU'). |  |  |
| `-w`, `--website` | Organization website URL. Public website or documentation site for the organization. Must be a valid URL (e.g., https://example.com). |  |  |

## `tw organizations view`

View organization details

### Synopsis

```bash
tw organizations view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Organization numeric identifier. The unique ID assigned when the organization was created. |  |  |
| `-n`, `--name` | Organization name. The unique organization name used as a human-readable identifier. |  |  |

---
title: tw members
description: Manage organization members
---

# `tw members`

Manage organization members

## `tw members list`

List organization members

### Synopsis

```bash
tw members list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | ✓ |  |
| `-f`, `--filter` | Filter members by username prefix. Case-insensitive prefix matching on the username field (e.g., 'john' matches 'john.doe'). |  |  |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

## `tw members add`

Add an organization member

### Synopsis

```bash
tw members add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-u`, `--user` | User email address to invite. If the user doesn't have a Seqera Platform account, they will receive an invitation email to join the organization. | ✓ |  |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | ✓ |  |

## `tw members delete`

Remove an organization member

### Synopsis

```bash
tw members delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-u`, `--user` | Username or email address of the member to remove. Removes the user from the organization and all associated teams and workspaces. Use 'tw members leave' to remove yourself. | ✓ |  |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | ✓ |  |

## `tw members update`

Update an organization member role

### Synopsis

```bash
tw members update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-u`, `--user` | Username or email address of the member to update. Specify either their platform username or email address. | ✓ |  |
| `-r`, `--role` | Organization role to assign. OWNER: full administrative access including member management and billing. MEMBER: standard access with ability to create workspaces and teams. COLLABORATOR: limited access, cannot create resources but can participate in shared workspaces. | ✓ |  |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | ✓ |  |

## `tw members leave`

Leave an organization

### Synopsis

```bash
tw members leave [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--organization` | Organization name or numeric ID to leave. Removes yourself from the organization and all associated teams and workspaces. Cannot be undone except by another member re-inviting you. | ✓ |  |

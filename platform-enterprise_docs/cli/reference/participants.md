---
title: tw participants
description: Manage workspace participants
---

# `tw participants`

Run `tw participants -h` to view supported participant operations.

Manage [workspace participants](../../orgs-and-teams/workspace-management.md).

:::note
The operations listed below require workspace `OWNER` or `ADMIN` permissions.
:::

## `tw participants list`

List workspace participants.

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

```bash
tw participants list

  Participants for 'my-tower-org/shared-workspace' workspace:

    ID             | Participant Type | Name                        | Workspace Role
    ----------------+------------------+-----------------------------+----------------
    45678460861822 | MEMBER           | user (user@mydomain.com) | owner
```


## `tw participants add`

Add a workspace participant.

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

Run `tw participants add -h` to view the required and optional fields for adding a participant.

To add a new _collaborator_ to the workspace, use the `add` subcommand. The default role assigned to a _collaborator_ is `Launch`.

See [Participant roles][participant-roles] for more information.

```bash
tw participants add --name=collaborator@mydomain.com --type=MEMBER

  User 'collaborator' was added as participant to 'shared-workspace' workspace with role 'launch'
```

## `tw participants update`

Update a participant role.

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

To update the role of a _Collaborator_ to `ADMIN` or `MAINTAIN`, use the `update` subcommand:

```bash
tw  participants update --name=collaborator@mydomain.com --type=COLLABORATOR --role=MAINTAIN

  Participant 'collaborator@mydomain.com' has now role 'maintain' for workspace 'shared-workspace'
```

## `tw participants delete`

Remove a workspace participant.

```bash
tw participants delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Team name, username or email for existing organization member. | ✓ |  |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | ✓ |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

### Example

```bash
tw participants delete -n user2-name -t MEMBER -w 123456789012345

# Output:
  Participant 'user2-name' was removed from 'my-workspace' workspace
```

:::note
Requires participant name, type, and workspace ID.
:::

## `tw participants leave`

Leave a workspace.

```bash
tw participants leave [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

### Example

```bash
tw participants leave -w organization5/test-workspace

# Output:
  You have been removed as a participant from 'test-workspace' workspace
```

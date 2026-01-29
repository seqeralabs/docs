---
title: tw participants
description: Manage workspace participants
---

# tw participants

Run `tw participants -h` to view supported participant operations.

Manage [workspace participants](/platform-cloud/orgs-and-teams/workspace-management).

:::note
The operations listed below require workspace `OWNER` or `ADMIN` permissions.
:::

## tw participants list

List workspace participants.

Command:

```bash
tw participants list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-t`, `--type` | Participant type to list (MEMBER, TEAM, COLLABORATOR). | No | `null` |
| `-f`, `--filter` | Show only participants that it's name starts with the given word. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | Yes | `TOWER_WORKSPACE_ID` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display (default: ) | No | `null` |

### Example


Command:

```bash
tw participants list
```

Example output:

```bash
Participants for 'my-tower-org/shared-workspace' workspace:

    ID             | Participant Type | Name                        | Workspace Role
    ----------------+------------------+-----------------------------+----------------
    45678460861822 | MEMBER           | user (user@mydomain.com) | owner
```


## tw participants add

Add a workspace participant.

Command:

```bash
tw participants add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Team name, username or email for existing organization member. | Yes | `null` |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | Yes | `null` |
| `--overwrite` | Overwrite the participant if it already exists. | No | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | Yes | `TOWER_WORKSPACE_ID` |

Run `tw participants add -h` to view the required and optional fields for adding a participant.

To add a new _collaborator_ to the workspace, use the `add` subcommand. The default role assigned to a _collaborator_ is `Launch`.

See [Participant roles](/platform-cloud/orgs-and-teams/roles) for more information.

Command:

```bash
tw participants add --name=collaborator@mydomain.com --type=MEMBER
```

Example output:

```bash
User 'collaborator' was added as participant to 'shared-workspace' workspace with role 'launch'
```

## tw participants update

Update a participant role.

Command:

```bash
tw participants update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Team name, username or email for existing organization member. | Yes | `null` |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | Yes | `null` |
| `-r`, `--role` | Workspace participant role (OWNER, ADMIN, MAINTAIN, LAUNCH, CONNECT or VIEW). | Yes | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | Yes | `TOWER_WORKSPACE_ID` |

To update the role of a _Collaborator_ to `ADMIN` or `MAINTAIN`, use the `update` subcommand:

Command:

```bash
tw  participants update --name=collaborator@mydomain.com --type=COLLABORATOR --role=MAINTAIN
```

Example output:

```bash
Participant 'collaborator@mydomain.com' has now role 'maintain' for workspace 'shared-workspace'
```

## tw participants delete

Remove a workspace participant.

```bash
tw participants delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Team name, username or email for existing organization member. | Yes | `null` |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | Yes | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | Yes | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw participants delete -n user2-name -t MEMBER -w 123456789012345
```

Example output:

```bash
Participant 'user2-name' was removed from 'my-workspace' workspace
```

:::note
Requires participant name, type, and workspace ID.
:::

## tw participants leave

Leave a workspace.

```bash
tw participants leave [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | Yes | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw participants leave -w organization5/test-workspace
```

Example output:

```bash


  You have been removed as a participant from 'test-workspace' workspace
```

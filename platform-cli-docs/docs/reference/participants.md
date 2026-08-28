---
title: "tw participants"
description: "Manage workspace participants"
---

# `tw participants`

Manage workspace participants

Run `tw participants -h` to view supported participant operations.

Manage workspace participants.

:::note
The operations listed below require workspace `OWNER` or `ADMIN` permissions.
:::

## `tw participants list`

List workspace participants

```bash
tw participants list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-t`, `--type` | Participant type to list (MEMBER, TEAM, COLLABORATOR). | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |
| `-f`, `--filter` | Show only participants that it's name starts with the given word. | No |  |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

Command:

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

## `tw participants add`

Add a workspace participant

```bash
tw participants add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Team name, username or email for existing organization member. | Yes |  |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |
| `--overwrite` | Overwrite the participant if it already exists. | No | `false` |

Run `tw participants add -h` to view the required and optional fields for adding a participant.

To add a new _collaborator_ to the workspace, use the `add` subcommand. The default role assigned to a _collaborator_ is `Launch`.

See [Participant roles][participant-roles] for more information.

Command:

```bash
tw participants add --name=collaborator@mydomain.com --type=MEMBER
```

Example output:

```bash
User 'collaborator' was added as participant to 'shared-workspace' workspace with role 'launch'
```

## `tw participants update`

Update a participant role

```bash
tw participants update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Team name, username or email for existing organization member. | Yes |  |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | Yes |  |
| `-r`, `--role` | Workspace participant role name: predefined (OWNER, ADMIN, MAINTAIN, LAUNCH, CONNECT, VIEW) or custom. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

To update the role of a _Collaborator_ to `ADMIN` or `MAINTAIN`, use the `update` subcommand:

Command:

```bash
tw  participants update --name=collaborator@mydomain.com --type=COLLABORATOR --role=MAINTAIN
```

Example output:

```bash
Participant 'collaborator@mydomain.com' has now role 'maintain' for workspace 'shared-workspace'
```

## `tw participants delete`

Remove a workspace participant

```bash
tw participants delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Team name, username or email for existing organization member. | Yes |  |
| `-t`, `--type` | Type of participant (MEMBER, COLLABORATOR or TEAM). | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

## `tw participants leave`

Leave a workspace

```bash
tw participants leave [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

[actions]: /platform-cloud/pipeline-actions/overview
[compute-envs]: /platform-cloud/compute-envs/overview
[credentials]: /platform-cloud/credentials/overview
[data-explorer]: /platform-cloud/data/data-explorer
[datasets]: /platform-cloud/data/datasets
[git-integration]: /platform-cloud/git/overview
[labels]: /platform-cloud/labels/overview
[nextflow-config]: https://docs.seqera.io/nextflow/config#config-syntax
[organizations]: /platform-cloud/orgs-and-teams/organizations
[participant-roles]: /platform-cloud/orgs-and-teams/roles
[resource-labels]: /platform-cloud/resource-labels/overview
[run-details]: /platform-cloud/monitoring/run-details
[secrets]: /platform-cloud/secrets/overview
[shared-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[studio-checkpoints]: /platform-cloud/studios/managing#studio-session-checkpoints
[studios]: /platform-cloud/studios/overview
[tower-agent]: /platform-cloud/supported_software/agent/overview
[user-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave

---
title: tw workspaces
description: Manage workspaces
---

# tw workspaces

Run `tw workspaces -h` to view supported workspace operations.

[Workspaces](/platform-cloud/orgs-and-teams/workspace-management) provide the context in which a user launches workflow executions, defines the available resources, and manages who can access those resources. Workspaces contain pipelines, runs, actions, datasets, compute environments, credentials, and secrets. Access permissions are controlled with participants, collaborators, and teams.

## tw workspaces list

List workspaces.

Command:

```bash
tw workspaces list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--org`, `--organization` | Workspace organization name | No | `null` |

List all the workspaces in which you are a participant:

Command:

```bash
tw workspaces list
```

Example output:

```bash
Workspaces for default user:

    Workspace ID    | Workspace Name   | Organization Name | Organization ID
    -----------------+------------------+-------------------+-----------------
    26002603030407  | shared-workspace | my-tower-org      | 04303000612070
```

## tw workspaces delete

Delete a workspace.

Command:

```bash
tw workspaces delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier | No | `null` |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format | No | `null` |

## tw workspaces add

Add a workspace.

```bash
tw workspaces add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--org`, `--organization` | Workspace organization name | Yes | `null` |
| `-n`, `--name` | Unique workspace name within the organization. Must be 2-40 characters, start and end with alphanumeric characters, and can contain hyphens or underscores between characters. | Yes | `null` |
| `-f`, `--full-name` | Full display name for the workspace. Maximum 100 characters. | Yes | `null` |
| `-d`, `--description` | Optional description of the workspace. Maximum 1000 characters. | No | `null` |
| `-v`, `--visibility` | Workspace visibility setting. Accepts `PRIVATE` (only participants can access) or `SHARED` (all organization members can view). | No | `null` |
| `--overwrite` | Overwrite the workspace if it already exists | No | `false` |

:::note
Workspace management operations require organization `OWNER` permissions.
:::

Run `tw workspaces add -h` to view the required and optional fields for adding your workspace.

In the example below, we create a shared workspace to be used for sharing pipelines with other private workspaces. See [Shared workspaces](/platform-cloud/orgs-and-teams/workspace-management) for more information.

Command:

```bash
tw workspaces add --name=shared-workspace --full-name=shared-workspace-for-all  --org=my-tower-org --visibility=SHARED
```

Example output:

```bash
A 'SHARED' workspace 'shared-workspace' added for 'my-tower-org' organization
```

:::note
By default, a workspace is set to private when created.
:::

## tw workspaces update

Update a workspace.

Command:

```bash
tw workspaces update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier | Yes | `null` |
| `--new-name` | Updated workspace name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. Must be 2-40 characters. | No | `null` |
| `-f`, `--fullName` | Updated full display name for the workspace. Maximum 100 characters. | No | `null` |
| `-d`, `--description` | Updated workspace description. Maximum 1000 characters. | No | `null` |

## tw workspaces view

View workspace details.

```bash
tw workspaces view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier | No | `null` |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format | No | `null` |

### Example

Command:

```bash
tw workspaces view -i 123456789012345
```

Example output:

```bash
Details for workspace 'Workspace one'


--------------+------------------------------------------------
  ID           | 123456789012345
  Name         | my-workspace
  Full Name    | Workspace one
  Description  | Workspace created with seqerakit CLI scripting
  Visibility   | SHARED
```

## tw workspaces update

Update a workspace.

```bash
tw workspaces update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Workspace identifier | Yes | `null` |
| `--new-name` | Updated workspace name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. Must be 2-40 characters. | No | `null` |
| `-f`, `--fullName` | Updated full display name for the workspace. Maximum 100 characters. | No | `null` |
| `-d`, `--description` | Updated workspace description. Maximum 1000 characters. | No | `null` |

### Example

Command:

```bash
tw workspaces update -i 123456789012345 --new-name my-workspace-updated
```

Example output:

```bash
A 'SHARED' workspace 'my-workspace' updated for 'my-organization-updated' organization
```

## tw workspaces delete

Delete a workspace.

```bash
tw workspaces delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Workspace identifier | No | `null` |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format | No | `null` |

### Example

Command:

```bash
tw workspaces delete -i 222333444555667
```

Example output:

```bash
Workspace 'test-workspace' deleted for organization5 organization
```

## tw workspaces leave

Leave a workspace.

```bash
tw workspaces leave [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier | No | `null` |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format | No | `null` |

### Example

Command:

```bash
tw workspaces leave -i 222333444555668
```

Example output:

```bash


  You have been removed as a participant from 'new-workspace' workspace
```

---
title: tw workspaces
description: Manage workspaces
---

# tw workspaces

Run `tw workspaces -h` to view supported workspace operations.

[Workspaces](/platform-cloud/orgs-and-teams/workspace-management) provide the context in which a user launches workflow executions, defines the available resources, and manages who can access those resources. Workspaces contain pipelines, runs, actions, datasets, compute environments, credentials, and secrets. Access permissions are controlled with participants, collaborators, and teams.

## tw workspaces list

List workspaces.

```bash
tw workspaces list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--org`, `--organization` | Workspace organization name |  |  |

List all the workspaces in which you are a participant:

```bash
tw workspaces list

  Workspaces for default user:

    Workspace ID    | Workspace Name   | Organization Name | Organization ID
    -----------------+------------------+-------------------+-----------------
    26002603030407  | shared-workspace | my-tower-org      | 04303000612070
```

## tw workspaces delete

Delete a workspace.

```bash
tw workspaces delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier |  |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format |  |  |

## tw workspaces add

Add a workspace.

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

:::note
Workspace management operations require organization `OWNER` permissions.
:::

Run `tw workspaces add -h` to view the required and optional fields for adding your workspace.

In the example below, we create a shared workspace to be used for sharing pipelines with other private workspaces. See [Shared workspaces](/platform-cloud/orgs-and-teams/workspace-management) for more information.

```bash
tw workspaces add --name=shared-workspace --full-name=shared-workspace-for-all  --org=my-tower-org --visibility=SHARED

  A 'SHARED' workspace 'shared-workspace' added for 'my-tower-org' organization
```

:::note
By default, a workspace is set to private when created.
:::

## tw workspaces update

Update a workspace.

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

## tw workspaces view

View workspace details.

```bash
tw workspaces view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Workspace identifier |  |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format |  |  |

### Example

```bash
tw workspaces view -i 123456789012345

# Output:
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
| `-i`, `--id` | Workspace identifier | ✓ |  |
| `--new-name` | Updated workspace name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. Must be 2-40 characters. |  |  |
| `-f`, `--fullName` | Updated full display name for the workspace. Maximum 100 characters. |  |  |
| `-d`, `--description` | Updated workspace description. Maximum 1000 characters. |  |  |

### Example

```bash
tw workspaces update -i 123456789012345 --new-name my-workspace-updated

# Output:
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
| `-i`, `--id` | Workspace identifier |  |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format |  |  |

### Example

```bash
tw workspaces delete -i 222333444555667

# Output:
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
| `-i`, `--id` | Workspace identifier |  |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format |  |  |

### Example

```bash
tw workspaces leave -i 222333444555668

# Output:
  You have been removed as a participant from 'new-workspace' workspace
```

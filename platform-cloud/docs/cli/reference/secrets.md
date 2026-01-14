---
title: tw secrets
description: Manage secrets
---

# `tw secrets`

Manage secrets

Run `tw secrets -h` to view supported workspace secret operations.

[Secrets](../../secrets/overview) are used to store the keys and tokens used by workflow tasks to interact with external systems, such as a password to connect to an external database or an API token.


## `tw secrets list`

List secrets.

```bash
tw secrets list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw secrets add`

Add a secret.

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

Run `tw secrets add -h` to view the required and optional fields for adding a secret.


[compute-envs]: ../../compute-envs/overview
[credentials]: ../../credentials/overview
[git-integration]: ../../git/overview
[nextflow-config]: https://www.nextflow.io/docs/latest/config.html#config-syntax
[participant-roles]: ../../orgs-and-teams/roles
[shared-workspaces]: ../../orgs-and-teams/workspace-management
[tower-agent]: ../../supported_software/agent/overview
[user-workspaces]: ../../orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave


## `tw secrets delete`

Delete a secret.

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

View secret details.

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

Update a secret.

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

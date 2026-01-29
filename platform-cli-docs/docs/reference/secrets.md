---
title: tw secrets
description: Manage secrets
---

# tw secrets

Run `tw secrets -h` to view supported workspace secret operations.

[Secrets](/platform-cloud/secrets/overview) are used to store the keys and tokens used by workflow tasks to interact with external systems, such as a password to connect to an external database or an API token.

## tw secrets list

List secrets.

```bash
tw secrets list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

### Example

```bash
tw secrets list -w 123456789012345

# Output:
  Secrets at [my-organization-updated / my-workspace] workspace:

    ID              | Name                 | Last updated
    -----------------+----------------------+-------------------------------
    333444555666777 | secret2              | Thu, 15 Jan 2026 13:33:55 GMT
```

## tw secrets add

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

### Example

```bash
tw secrets add -n secret2 -v secret-value -w 123456789012345

# Output:
  New secret 'secret2' (333444555666777) added at [my-organization-updated / my-workspace] workspace
```

## tw secrets view

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

### Example

```bash
tw secrets view -n secret2 -w 123456789012345

# Output:
  Secret at [my-organization-updated / my-workspace] workspace:

    ---------+-------------------------------
     ID      | 333444555666777
     Name    | secret2
     Created | Thu, 15 Jan 2026 13:33:55 GMT
     Updated | Thu, 15 Jan 2026 13:33:55 GMT
     Used    |
```

## tw secrets update

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

### Example

```bash
tw secrets update -n secret2 -v new-value -w 123456789012345

# Output:
  Secret 'secret2' updated at [my-organization-updated / my-workspace] workspace
```

## tw secrets delete

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

### Example

```bash
tw secrets delete -n secret2 -w 123456789012345

# Output:
  Secret 'secret2' deleted at [my-organization-updated / my-workspace] workspace
```

---
title: tw organizations
description: Manage organizations
---

# tw organizations

Run `tw organizations -h` to view supported workspace operations.

Organizations are the top-level structure and contain workspaces, members, and teams. You can also add external collaborators to an organization. See [Organization management](https://docs.seqera.io/platform-cloud/orgs-and-teams/organizations) for more information.

## tw organizations list

List organizations.

```bash
tw organizations list [OPTIONS]
```

### Example

Command:

```bash
tw organizations list
```

Example output:

```bash
  Organizations for user-name user:


ID              | Name
    -----------------+------------------------------
     111222333444556  | organization1
     111222333444557 | organization7
     111222333444558  | organization8
     111222333444559 | organization3
     111222333444560  | organization2
     111222333444561 | organization4
     111222333444555 | my-organization
     111222333444562  | organization5
```

## tw organizations add

Add an organization.

```bash
tw organizations add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Organization unique name. Must be unique across Seqera Platform. Used as the organization identifier in URLs and API calls. Cannot be changed after creation without --new-name. | Yes | `null` |
| `-f`, `--full-name` | Organization display name. The full, human-readable name for the organization shown in the UI. Can contain spaces and special characters. | Yes | `null` |
| `--overwrite` | Overwrite existing organization. If an organization with this name already exists, delete it first before creating the new one. Use with caution as this permanently deletes the existing organization and all associated data. | No | `false` |
| `-d`, `--description` | Organization description. Free-text description providing context about the organization's purpose, team, or projects. | No | `null` |
| `-l`, `--location` | Organization location. Geographic location or region where the organization is based (e.g., 'San Francisco, CA' or 'EU'). | No | `null` |
| `-w`, `--website` | Organization website URL. Public website or documentation site for the organization. Must be a valid URL (e.g., https://example.com). | No | `null` |

Run `tw organizations add -h` to view the required and optional fields for adding your workspace.

### Example

Command:

```bash
tw organizations add -n TestOrg2 -f 2nd\ Test\ Organization\ LLC -l RSA
```

Example output:

```bash
Organization 'TestOrg2' with ID '204336622618177' was added
```

## tw organizations view

View organization details.

```bash
tw organizations view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Organization numeric identifier. The unique ID assigned when the organization was created. | No | `null` |
| `-n`, `--name` | Organization name. The unique organization name used as a human-readable identifier. | No | `null` |

### Example

Command:

```bash
tw organizations view -n my-organization
```

Example output:

```bash
Details for organization 'My organization LLC'


-------------+---------------------------------------------------
    ID          | 111222333444555
    Name        | my-organization
    Full Name   | My organization LLC
    Description | Organization created with seqerakit CLI scripting
    Website     | https://example.com/
```

## tw organizations update

Update an organization.

```bash
tw organizations update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--new-name` | New unique name for the organization. Changes the organization's identifier. Must be unique across Seqera Platform. Updates URLs and API references. | No | `null` |
| `-f`, `--full-name` | New display name for the organization. The full, human-readable name shown in the UI. Can contain spaces and special characters. | No | `null` |
| `-i`, `--id` | Organization numeric identifier. The unique ID assigned when the organization was created. | No | `null` |
| `-n`, `--name` | Organization name. The unique organization name used as a human-readable identifier. | No | `null` |
| `-d`, `--description` | Organization description. Free-text description providing context about the organization's purpose, team, or projects. | No | `null` |
| `-l`, `--location` | Organization location. Geographic location or region where the organization is based (e.g., 'San Francisco, CA' or 'EU'). | No | `null` |
| `-w`, `--website` | Organization website URL. Public website or documentation site for the organization. Must be a valid URL (e.g., https://example.com). | No | `null` |

### Example

Command:

```bash
tw organizations update -n my-organization --new-name=my-organization-updated
```

Example output:

```bash
Organization 'my-organization' was updated
```

## tw organizations delete

Delete an organization.

```bash
tw organizations delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Organization numeric identifier. The unique ID assigned when the organization was created. | No | `null` |
| `-n`, `--name` | Organization name. The unique organization name used as a human-readable identifier. | No | `null` |

### Example

Command:

```bash
tw organizations delete -n organization4
```

Example output:

```bash


  Organization 'organization4' deleted
```

---
title: tw members
description: Manage organization members
---

# tw members

Run `tw members -h` to view supported member operations.

Manage organization members. Organization membership management requires organization `OWNER` permissions.

## tw members list

List organization members.

```bash
tw members list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes | `null` |
| `-f`, `--filter` | Filter members by username prefix. Case-insensitive prefix matching on the username field (e.g., 'john' matches 'john.doe'). | No | `null` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display (default: ) | No | `null` |

Run `tw members list -h` view all the optional fields for listing organization members.

### Example

Command:

```bash
tw members list -o TestOrg2
```

Example output:

```bash
Members for TestOrg2 organization:

ID              | Username             | Email                           | Role
  -----------------+----------------------+---------------------------------+--------
    200954501314303 | user1                | user1@domain.com                | MEMBER
    277776534946151 | user2                | user2@domain.com                | MEMBER
    243277166855716 | user3                | user3@domain.com                | OWNER
```

## tw members add

Add an organization member.

```bash
tw members add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-u`, `--user` | User email address to invite. If the user doesn't have a Seqera Platform account, they will receive an invitation email to join the organization. | Yes | `null` |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes | `null` |

Run `tw members add -h` view all the required and optional fields for adding organization members.

### Example

Command:

```bash
tw members add -u user1@domain.com -o DocTestOrg2
```

Example output:

```bash
Member 'user1' with ID '134534064600266' was added in organization 'TestOrg2'
```

## tw members delete

Remove an organization member.

```bash
tw members delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-u`, `--user` | Username or email address of the member to remove. Removes the user from the organization and all associated teams and workspaces. Use 'tw members leave' to remove yourself. | Yes | `null` |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes | `null` |

Run `tw members delete -h` view all the required and optional fields for deleting organization members.

### Example

Command:

```bash
tw members delete -u user1 -o TestOrg2
```

Example output:

```bash
Member 'user1' deleted from organization 'TestOrg2'
```

## tw members update

Update an organization member role.

```bash
tw members update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-u`, `--user` | Username or email address of the member to update. Specify either their platform username or email address. | Yes | `null` |
| `-r`, `--role` | Organization role to assign. OWNER: full administrative access including member management and billing. MEMBER: standard access with ability to create workspaces and teams. COLLABORATOR: limited access, cannot create resources but can participate in shared workspaces. | Yes | `null` |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes | `null` |

Run `tw members update -h` view all the required and optional fields for updating organization members.

### Example

Command:

```bash
tw members update -u user1 -r OWNER -o TestOrg2
```

Example output:

```bash
Member 'user1' updated to role 'owner' in organization 'TestOrg2'
```

## tw members leave

Leave an organization.

```bash
tw members leave [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--organization` | Organization name or numeric ID to leave. Removes yourself from the organization and all associated teams and workspaces. Cannot be undone except by another member re-inviting you. | Yes | `null` |

Run `tw members leave -o <organization_name>` to be removed from the given organization's members.

### Example

Command:

```bash
tw members leave -o example-organization
```

Example output:

```bash


  You have been removed from organization 'example-organization'
```

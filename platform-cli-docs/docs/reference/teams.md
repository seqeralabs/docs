---
title: tw teams
description: Manage teams
---

# tw teams

Run `tw teams -h` to view supported team operations.

Manage [organization teams](/platform-cloud/orgs-and-teams/organizations#teams).

:::note
Team management operations require organization `OWNER` permissions.
:::

## tw teams list

List organization teams.

Command:

```bash
tw teams list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes | `null` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display (default: ) | No | `null` |

Run `tw teams list -h` to view the required and optional fields for listing teams.

Command:

```bash
tw teams list -o TestOrg2
```

Example output:

```bash
Teams for TestOrg2 organization:

Team ID        | Team Name | Members Count Name
  ----------------+-----------+--------------------
    84866234211969 | Testing   | 1
```

## tw teams add

Add a team.

Command:

```bash
tw teams add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Team name. The unique identifier for the team within the organization. Used to reference the team in commands and workspace permissions. | Yes | `null` |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes | `null` |
| `-d`, `--description` | Team description. Free-text description providing context about the team's purpose, members, or project scope. | No | `null` |
| `--overwrite` | Overwrite existing team. If a team with this name already exists in the organization, delete it first before creating the new one. Use with caution as this removes all team members and permissions. | No | `false` |

Run `tw teams add -h` to view the required and optional fields for creating a team.

Command:

```bash
tw teams add -n team1 -o TestOrg2 -d testing
```

Example output:

```bash
A 'team1' team added for 'TestOrg2' organization
```

## tw teams delete

Delete a team.

```bash
tw teams delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Team numeric identifier. The unique ID assigned when the team was created. Find team IDs using 'tw teams list'. | Yes | `null` |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes | `null` |

### Example


Command:

```bash
tw teams delete -i 169283393825479 -o TestOrg2
```

Example output:

```bash
Team '169283393825479' deleted for TestOrg2 organization
```

## tw teams members

List team members.

```bash
tw teams members [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-t`, `--team` | Team name. The unique team identifier within the organization. Lists all members who belong to this team. | Yes | `null` |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes | `null` |

### Example

Command:

```bash
tw teams members -t Team1 -o my-organization-updated
```

Example output:

```bash
Members for team 'Team1':

Member ID       | Username          | Email                       | Role
    -----------------+-------------------+-----------------------------+--------
     987654321098765 | user1-name | user1@example.com | member
     987654321098766  | user2-name   | user2@example.com    | member
```

### tw teams members add

Add a team member.

```bash
tw teams members add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-m`, `--member` | Member username or email address. The user must already be a member of the organization before being added to the team. Use either their platform username or email address. | Yes | `null` |

### tw teams members delete

Remove a team member.

```bash
tw teams members delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-m`, `--member` | Member username to remove from team. Removes the user from this team but does not remove them from the organization. They will lose access to workspaces shared with this team. | Yes | `null` |

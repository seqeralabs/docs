---
title: tw teams
description: Manage teams
---

# `tw teams`

Run `tw teams -h` to view supported team operations.

Manage [organization teams](../../orgs-and-teams/organizations.md#teams).

:::note
Team management operations require organization `OWNER` permissions.
:::

## `tw teams list`

List organization teams.

```bash
tw teams list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | ✓ |  |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

Run `tw teams list -h` to view the required and optional fields for listing teams.

```bash
tw teams list -o TestOrg2

Teams for TestOrg2 organization:

    Team ID        | Team Name | Members Count Name
  ----------------+-----------+--------------------
    84866234211969 | Testing   | 1
```

## `tw teams add`

Add a team.

```bash
tw teams add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Team name. The unique identifier for the team within the organization. Used to reference the team in commands and workspace permissions. | ✓ |  |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | ✓ |  |
| `-d`, `--description` | Team description. Free-text description providing context about the team's purpose, members, or project scope. |  |  |
| `--overwrite` | Overwrite existing team. If a team with this name already exists in the organization, delete it first before creating the new one. Use with caution as this removes all team members and permissions. |  | `false` |

Run `tw teams add -h` to view the required and optional fields for creating a team.

```bash
tw teams add -n team1 -o TestOrg2 -d testing

A 'team1' team added for 'TestOrg2' organization
```

## `tw teams delete`

Delete a team.

```bash
tw teams delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Team numeric identifier. The unique ID assigned when the team was created. Find team IDs using 'tw teams list'. | ✓ |  |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | ✓ |  |

```bash
tw teams delete -i 169283393825479 -o TestOrg2

Team '169283393825479' deleted for TestOrg2 organization
```

## `tw teams members`

List team members.

```bash
tw teams members [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-t`, `--team` | Team name. The unique team identifier within the organization. Lists all members who belong to this team. | ✓ |  |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | ✓ |  |

### `tw teams members add`

Add a team member.

```bash
tw teams members add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-m`, `--member` | Member username or email address. The user must already be a member of the organization before being added to the team. Use either their platform username or email address. | ✓ |  |

### `tw teams members delete`

Remove a team member.

```bash
tw teams members delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-m`, `--member` | Member username to remove from team. Removes the user from this team but does not remove them from the organization. They will lose access to workspaces shared with this team. | ✓ |  |

---
title: "tw teams"
description: "Manage teams"
---

# `tw teams`

Manage teams

Run `tw teams -h` to view supported team operations.

Manage organization teams.

:::note
Team management operations require organization `OWNER` permissions.
:::

## `tw teams list`

List organization teams

```bash
tw teams list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

Run `tw teams list -h` to view the required and optional fields for listing teams.

Command:

```bash
tw teams list -o TestOrg2

Teams for TestOrg2 organization:
```

Example output:

```bash
Team ID        | Team Name | Members Count Name
  ----------------+-----------+--------------------
    84866234211969 | Testing   | 1
```

## `tw teams add`

Add a team

```bash
tw teams add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Team name. The unique identifier for the team within the organization. Used to reference the team in commands and workspace permissions. | Yes |  |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-d`, `--description` | Team description. Free-text description providing context about the team's purpose, members, or project scope. | No |  |
| `--overwrite` | Overwrite existing team. If a team with this name already exists in the organization, delete it first before creating the new one. Use with caution as this removes all team members and permissions. | No | `false` |

Run `tw teams add -h` to view the required and optional fields for creating a team.

```bash
tw teams add -n team1 -o TestOrg2 -d testing

A 'team1' team added for 'TestOrg2' organization
```

## `tw teams delete`

Delete a team

```bash
tw teams delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Team numeric identifier. The unique ID assigned when the team was created. Find team IDs using 'tw teams list'. | Yes |  |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |

```bash
tw teams delete -i 169283393825479 -o TestOrg2

Team '169283393825479' deleted for TestOrg2 organization
```

## `tw teams members`

List team members

```bash
tw teams members [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-t`, `--team` | Team name. The unique team identifier within the organization. Lists all members who belong to this team. | Yes |  |
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |

Run `tw teams members -h` to view the commands for managing team members.

Add an existing username or a new user's email address:

```console
$ tw teams members -t Testing -o TestOrg2 add -m user1@domain.com

Member 'user1' added to team 'Testing' with id '243206491381406'
```

Delete a team member by username:

```console
$ tw teams members -t Testing -o TestOrg2 delete -m user1

Team member 'user1' deleted at 'Testing' team
```

### `tw teams members add`

Add a team member

```bash
tw teams members add [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-m`, `--member` | Member username or email address. The user must already be a member of the organization before being added to the team. Use either their platform username or email address. | Yes |  |

### `tw teams members delete`

Remove a team member

```bash
tw teams members delete [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-m`, `--member` | Member username to remove from team. Removes the user from this team but does not remove them from the organization. They will lose access to workspaces shared with this team. | Yes |  |

[actions]: /platform-cloud/pipeline-actions/overview
[aws-batch-pipeline-secrets]: /platform-cloud/compute-envs/aws-batch#pipeline-secrets-optional
[aws-cloud-advanced-options]: /platform-cloud/compute-envs/aws-cloud#advanced-options
[compute-envs]: /platform-cloud/compute-envs/overview
[credentials]: /platform-cloud/credentials/overview
[data-explorer]: /platform-cloud/data/data-explorer
[datasets]: /platform-cloud/data/datasets
[git-integration]: /platform-cloud/git/overview
[google-cloud-advanced-options]: /platform-cloud/compute-envs/google-cloud#advanced-options
[labels]: /platform-cloud/labels/overview
[nextflow-config]: https://docs.seqera.io/nextflow/config#config-syntax
[nextflow-version]: /platform-cloud/launch/advanced#nextflow-version
[organizations]: /platform-cloud/orgs-and-teams/organizations
[output-directory]: /platform-cloud/launch/launchpad#output-directory
[participant-roles]: /platform-cloud/orgs-and-teams/roles
[resource-labels]: /platform-cloud/resource-labels/overview
[run-details]: /platform-cloud/monitoring/run-details
[secrets]: /platform-cloud/secrets/overview
[shared-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[studio-checkpoints]: /platform-cloud/studios/managing#studio-session-checkpoints
[studios]: /platform-cloud/studios/overview
[syntax-parser-v2]: /platform-cloud/launch/advanced#enable-nextflow-syntax-parser-v2
[tower-agent]: /platform-cloud/supported_software/agent/overview
[user-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave

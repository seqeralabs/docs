---
title: "tw roles"
description: "Manage workspace roles. Custom roles are not available for Seqera Cloud Basic organizations."
---

# `tw roles`

Manage workspace roles. Custom roles are not available for Seqera Cloud Basic organizations.

## `tw roles list`

List predefined and custom roles

```bash
tw roles list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-t`, `--type` | Role type to list (predefined or custom). | No |  |
| `-f`, `--filter` | Show only roles whose name contains the given text (* wildcards allowed). | No |  |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

## `tw roles view`

View a role and its permissions

```bash
tw roles view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-n`, `--name` | Role name. | Yes |  |

## `tw roles add`

Add a custom role

```bash
tw roles add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-n`, `--name` | Custom role name. Must be unique within the organization and different from the predefined role names. | Yes |  |
| `-d`, `--description` | Custom role description (max 120 characters). | Yes |  |
| `-p`, `--permissions` | Comma-separated list of permissions granted by the role. See 'tw roles permissions' for the available names. | Yes |  |

## `tw roles update`

Update a custom role

```bash
tw roles update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-n`, `--name` | Custom role name. | Yes |  |
| `--new-name` | New custom role name. | No |  |
| `-d`, `--description` | New custom role description (max 120 characters). | No |  |
| `-p`, `--permissions` | Comma-separated list of permissions. Replaces the current permissions of the role. | No |  |

## `tw roles delete`

Delete a custom role

```bash
tw roles delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-n`, `--name` | Custom role name. | Yes |  |

## `tw roles permissions`

List the permissions that can be granted by a custom role

```bash
tw roles permissions [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |

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

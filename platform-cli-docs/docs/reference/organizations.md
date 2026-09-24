---
title: "tw organizations"
description: "Manage organizations"
---

# `tw organizations`

Manage organizations

Run `tw organizations -h` to view supported workspace operations.

Organizations are the top-level structure and contain workspaces, members, and teams. You can also add external collaborators to an organization. See [Organization management][organizations] for more information.

## `tw organizations list`

List organizations

```bash
tw organizations list
```

## `tw organizations delete`

Delete an organization

```bash
tw organizations delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Organization numeric identifier. The unique ID assigned when the organization was created. | Yes |  |
| `-n`, `--name` | Organization name. The unique organization name used as a human-readable identifier. | Yes |  |

## `tw organizations add`

Add an organization

```bash
tw organizations add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Organization unique name. Must be unique across Seqera Platform. Used as the organization identifier in URLs and API calls. Cannot be changed after creation without --new-name. | Yes |  |
| `-f`, `--full-name` | Organization display name. The full, human-readable name for the organization shown in the UI. Can contain spaces and special characters. | Yes |  |
| `-d`, `--description` | Organization description. Free-text description providing context about the organization's purpose, team, or projects. | No |  |
| `-l`, `--location` | Organization location. Geographic location or region where the organization is based (e.g., 'San Francisco, CA' or 'EU'). | No |  |
| `-w`, `--website` | Organization website URL. Public website or documentation site for the organization. Must be a valid URL (e.g., https://example.com). | No |  |
| `--overwrite` | Overwrite existing organization. If an organization with this name already exists, delete it first before creating the new one. Use with caution as this permanently deletes the existing organization and all associated data. | No | `false` |

Run `tw organizations add -h` to view the required and optional fields for adding your workspace.

```bash
tw organizations add -n TestOrg2 -f 2nd\ Test\ Organization\ LLC -l RSA

Organization 'TestOrg2' with ID '204336622618177' was added
```

## `tw organizations update`

Update an organization

```bash
tw organizations update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Organization numeric identifier. The unique ID assigned when the organization was created. | Yes |  |
| `-n`, `--name` | Organization name. The unique organization name used as a human-readable identifier. | Yes |  |
| `--new-name` | New unique name for the organization. Changes the organization's identifier. Must be unique across Seqera Platform. Updates URLs and API references. | No |  |
| `-f`, `--full-name` | New display name for the organization. The full, human-readable name shown in the UI. Can contain spaces and special characters. | No |  |
| `-d`, `--description` | Organization description. Free-text description providing context about the organization's purpose, team, or projects. | No |  |
| `-l`, `--location` | Organization location. Geographic location or region where the organization is based (e.g., 'San Francisco, CA' or 'EU'). | No |  |
| `-w`, `--website` | Organization website URL. Public website or documentation site for the organization. Must be a valid URL (e.g., https://example.com). | No |  |

## `tw organizations view`

View organization details

```bash
tw organizations view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Organization numeric identifier. The unique ID assigned when the organization was created. | Yes |  |
| `-n`, `--name` | Organization name. The unique organization name used as a human-readable identifier. | Yes |  |

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

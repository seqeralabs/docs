---
title: "tw secrets"
description: "Manage secrets"
---

# `tw secrets`

Manage secrets

Run `tw secrets -h` to view supported workspace secret operations.

[Secrets][secrets] are used to store the keys and tokens used by workflow tasks to interact with external systems, such as a password to connect to an external database or an API token.

## `tw secrets list`

List secrets

```bash
tw secrets list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

## `tw secrets add`

Add a secret

```bash
tw secrets add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Secret name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-v`, `--value` | Secret value, to be stored securely. The secret is made available to pipeline executions at runtime. | No |  |
| `--overwrite` | Overwrite the secret if it already exists | No | `false` |

Run `tw secrets add -h` to view the required and optional fields for adding a secret.

## `tw secrets delete`

Delete a secret

```bash
tw secrets delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Secret identifier | Yes |  |
| `-n`, `--name` | Secret name | Yes |  |

## `tw secrets view`

View secret details

```bash
tw secrets view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Secret identifier | Yes |  |
| `-n`, `--name` | Secret name | Yes |  |

## `tw secrets update`

Update a secret

```bash
tw secrets update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-v`, `--value` | New secret value, to be stored securely. The secret is made available to pipeline executions at runtime. | No |  |
| `-i`, `--id` | Secret identifier | Yes |  |
| `-n`, `--name` | Secret name | Yes |  |

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

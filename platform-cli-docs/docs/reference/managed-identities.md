---
title: "tw managed-identities"
description: "Manage organization managed identities for HPC clusters"
---

# `tw managed-identities`

Manage organization managed identities for HPC clusters

## `tw managed-identities list`

List organization managed identities

```bash
tw managed-identities list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |

## `tw managed-identities add`

Add a managed identity for an HPC cluster. Each organization member then adds their own SSH credentials with 'tw managed-identities credentials add'.

```bash
tw managed-identities add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-n`, `--name` | Cluster name. Must be unique per organization. Names consist of alphanumeric, hyphen, and underscore characters. | Yes |  |
| `-p`, `--platform` | Cluster workload manager: altair, lsf, moab, slurm, uge. | Yes |  |
| `-H`, `--host-name` | Hostname of the cluster to connect to via SSH, usually the login node. Must be a fully qualified hostname, not a local IP address. | Yes |  |
| `--port` | SSH port for the login connection [default: 22]. | No | `22` |

## `tw managed-identities view`

View managed identity details

```bash
tw managed-identities view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-i`, `--id` | Managed identity numeric identifier | Yes |  |
| `-n`, `--name` | Managed identity name | Yes |  |

## `tw managed-identities update`

Update a managed identity. Changing the host of a cluster used by compute environments may break them.

```bash
tw managed-identities update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-i`, `--id` | Managed identity numeric identifier | Yes |  |
| `-n`, `--name` | Managed identity name | Yes |  |
| `--new-name` | New cluster name. Must be unique per organization. | No |  |
| `-H`, `--host-name` | New hostname of the cluster to connect to via SSH. | No |  |
| `--port` | New SSH port for the login connection. | No |  |

## `tw managed-identities delete`

Delete a managed identity and all its members' credentials. Compute environments that use it become invalid.

```bash
tw managed-identities delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-i`, `--id` | Managed identity numeric identifier | Yes |  |
| `-n`, `--name` | Managed identity name | Yes |  |
| `--force` | Delete the managed identity even if running jobs use its credentials. Those jobs are stopped. By default, a managed identity in use is not deleted. | No |  |

## `tw managed-identities credentials`

List the organization members' SSH credentials for a managed identity

```bash
tw managed-identities credentials [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or numeric ID. Specify either the unique organization name or the numeric organization ID returned by 'tw organizations list'. | Yes |  |
| `-i`, `--id` | Managed identity numeric identifier | Yes |  |
| `-n`, `--name` | Managed identity name | Yes |  |

### `tw managed-identities credentials add`

Add SSH credentials to a managed identity

```bash
tw managed-identities credentials add [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-m`, `--member` | Platform username of the organization member the credentials belong to. Only organization owners can add credentials for other members [default: you]. | No |  |
| `-l`, `--linux-username` | Linux username of the organization member on the cluster. | Yes |  |
| `-k`, `--key` | Path to the SSH private key file used to connect to the cluster. | Yes |  |
| `-p`, `--passphrase` | Passphrase for an encrypted SSH private key. | No |  |

### `tw managed-identities credentials update`

Replace the SSH credentials of an organization member in a managed identity

```bash
tw managed-identities credentials update [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-m`, `--member` | Platform username of the organization member the credentials belong to. Only organization owners can update credentials of other members [default: you]. | No |  |
| `-l`, `--linux-username` | Linux username of the organization member on the cluster. | Yes |  |
| `-k`, `--key` | Path to the SSH private key file used to connect to the cluster. | Yes |  |
| `-p`, `--passphrase` | Passphrase for an encrypted SSH private key. | No |  |

### `tw managed-identities credentials delete`

Delete the SSH credentials of an organization member from a managed identity

```bash
tw managed-identities credentials delete [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-m`, `--member` | Platform username of the organization member the credentials belong to. Only organization owners can delete credentials of other members [default: you]. | No |  |
| `--force` | Delete the credentials even if running jobs use them. Those jobs are stopped. By default, credentials in use are not deleted. | No |  |

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

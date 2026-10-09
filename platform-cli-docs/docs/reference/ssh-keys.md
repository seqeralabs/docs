---
title: "tw ssh-keys"
description: "Manage your SSH public keys"
---

# `tw ssh-keys`

Manage your SSH public keys

## `tw ssh-keys list`

List your SSH public keys

```bash
tw ssh-keys list
```

## `tw ssh-keys add`

Add an SSH public key

```bash
tw ssh-keys add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | SSH key name. Must be unique. Names consist of alphanumeric, hyphen, and underscore characters. | Yes |  |
| `-k`, `--key` | Path to the SSH public key file (e.g. ~/.ssh/id_ed25519.pub). Use '-' to read it from stdin. Create a key pair with 'ssh-keygen'. | Yes |  |

## `tw ssh-keys view`

View SSH public key details

```bash
tw ssh-keys view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | SSH key numeric identifier | Yes |  |
| `-n`, `--name` | SSH key name | Yes |  |

## `tw ssh-keys delete`

Delete an SSH public key

```bash
tw ssh-keys delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | SSH key numeric identifier | Yes |  |
| `-n`, `--name` | SSH key name | Yes |  |

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

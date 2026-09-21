---
title: "tw collaborators"
description: "Manage organization collaborators"
---

# `tw collaborators`

Manage organization collaborators

Run `tw collaborators -h` view all the required and optional fields for managing organization collaborators.

Manage organization collaborators.

## `tw collaborators list`

List organization collaborators

```bash
tw collaborators list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--organization` | Organization name or identifier | Yes |  |
| `-f`, `--filter` | Filter members by username prefix | No |  |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

Command:

Command:

```bash
tw collaborators list -o seqeralabs

Collaborators for 88848180287xxx organization:
```

Example output:

```bash
ID              | Username             | Email
  -----------------+----------------------+--------------------
    13136942731xxx  | external_user1       | user1@domain.com
    127726720173xxx | external_user2       | user2@domain.com
    59151157784xxx  | external_user3       | user3@domain.com
    132868466675xxx | external_user4       | user4@domain.com
    178756942629xxx | external_user5       | user5@domain.com
```

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

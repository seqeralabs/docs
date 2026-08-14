---
title: "tw studios"
description: "Manage studios"
---

# `tw studios`

Manage studios

Run `tw studios -h` to view the list of supported operations.

Manage [Studio sessions][studios] hosted in Seqera Platform. Studio sessions allow interactive analysis using Jupyter, RStudio, VS Code, and Xpra. Additional custom analysis environments can be defined as needed.

:::note
Most Studio operations require workspace `MAINTAIN` permissions.
:::

## `tw studios view`

View studio details

```bash
tw studios view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Studio session identifier | Yes |  |
| `-n`, `--name` | Studio name | Yes |  |

Run `tw studios view -h` to view the required and optional fields for viewing session details.

Command:

```bash
tw studios view -i 23ce7967 -w community/showcase
```

Example output:

```bash
Studio at workspace '[community / showcase]'

---------------------+------------------------------------------------------------
SessionID           | 23ce7967
Name                | experiment-analysis-session
Status              | STARTING
Status Last Update  | Fri, 31 Jan 2025 19:35:07 GMT
Studio URL          | https://a23ce7967.connect.cloud.seqera.io
Description         |
Created on          | Fri, 31 Jan 2025 18:12:27 GMT
Created by          | rob-newman | rob.newman@seqera.io
Template            | public.cr.seqera.io/platform/data-studio-jupyter:4.1.5-0.7
Mounted Data        |
Compute environment | aws-datastudios-sandbox-ireland-16cpus
Region              | eu-west-1
GPU allocated       | 0
CPU allocated       | 2
Memory allocated    | 8192
Build reports       | NA
```

## `tw studios list`

List studios

```bash
tw studios list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-f`, `--filter` | Optional filter criteria, allowing free text search on name and templateUrl and keywords: `userName`, `computeEnvName` and `status`. Example keyword usage: -f status:RUNNING. | No |  |
| `-l`, `--labels` | Show labels. | No | `false` |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

## `tw studios start`

Start a studio.

```bash
tw studios start [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Studio session identifier | Yes |  |
| `-n`, `--name` | Studio name | Yes |  |
| `--mount-data-uris` | Comma separate list of data-link URIs: s3://nextflow-bucket,s3://another-bucket | No |  |
| `--mount-data` | Comma separate list of data-link names: nextflow-bucket,my-custom-data-link-name | No |  |
| `--mount-data-ids` | Comma separate list of data-link ids: v1-cloud-YjI3MjMwOTMyNjUwNzk5tbG9yZQ=,v1-user-d2c505e70901d2bf6516d | No |  |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). | No |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). | No |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). | No |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. | No |  |
| `-e`, `--env` | Add environment variables to the studio as key=value pairs. Can be specified multiple times (e.g. -e KEY1=value1 -e KEY2=value2). | No |  |
| `--wait` | Wait until given status or fail. Valid options: starting, running, stopping, stopped, errored, building, buildFailed. | No |  |
| `--labels` | Comma-separated list of labels | No |  |
| `--description` | Optional configuration override for 'description'. | No |  |
| `--spot` | Optional override to launch the studio on spot instances. | No |  |
| `--ssh` | Optional override to enable SSH connectivity to the studio. | No |  |
| `--allow-user` | Override the user (numeric ID, username, or email), besides the creator, allowed to connect to and start this studio when it is private. Omit to leave the allow list unchanged. Only the studio creator may change it. | No |  |

For a private Studio, its creator can use `--allow-user=<USER>` when starting it to replace the additional user allowed to connect and start the Studio. Identify the user by numeric ID, username, or email address. Omit the option to leave the allow list unchanged.

## `tw studios add`

Add a studio

```bash
tw studios add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Studio name. | Yes |  |
| `-d`, `--description` | Studio description | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-t`, `--template` | Container image template to be used for Studio. Available templates can be listed with 'studios templates' command. | Yes |  |
| `-ct`, `--custom-template` | Custom container image template to be used for Studio. | Yes |  |
| `--conda-env-yml`, `--conda-env-yaml` | Path to a YAML env file with Conda packages to be installed in the studio environment | No |  |
| `-c`, `--compute-env` | Compute environment name | Yes |  |
| `--mount-data-uris` | Comma separate list of data-link URIs: s3://nextflow-bucket,s3://another-bucket | No |  |
| `--mount-data` | Comma separate list of data-link names: nextflow-bucket,my-custom-data-link-name | No |  |
| `--mount-data-ids` | Comma separate list of data-link ids: v1-cloud-YjI3MjMwOTMyNjUwNzk5tbG9yZQ=,v1-user-d2c505e70901d2bf6516d | No |  |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). | No |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). | No |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). | No |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. | No |  |
| `-e`, `--env` | Add environment variables to the studio as key=value pairs. Can be specified multiple times (e.g. -e KEY1=value1 -e KEY2=value2). | No |  |
| `--repository` | Git repository URL to import studio configuration from. | No |  |
| `--revision` | Optional branch, tag or commit of the Git repository to check out. Requires --repository. | No |  |
| `-a`, `--auto-start` | Create studio and start it immediately (default: false) | No | `false` |
| `--private` | Create a private studio that only you can access or manage (default: false) | No | `false` |
| `--spot` | Launch the studio on spot instances (default: provider/compute environment default). | No |  |
| `--ssh` | Enable SSH connectivity to the studio (default: false). | No |  |
| `--allow-user` | User (numeric ID, username, or email), besides the creator, allowed to connect to and start this studio when it is private. | No |  |
| `--labels` | Comma-separated list of labels | No |  |
| `--wait` | Wait until Studio is in RUNNING status. Valid options: starting, running, stopping, stopped, errored, building, buildFailed. | No |  |

Run `tw studios add -h` to view the required and optional fields for adding sessions.

Add a new Studio session in a workspace.

Command:

```bash
tw studios add -n new-analysis -w community/showcase \
--description="New Python analysis for RNA experiment ABC" \
--template="public.cr.seqera.io/platform/data-studio-jupyter:4.1.5-0.7" \
--compute-env=48bB2PDk83AxskE40lealy \
--cpu=2 \
--memory=8192
```

Example output:

```bash
Studio 2aa60bb7 CREATED at [community / showcase] workspace.
```

To create a private Studio and grant access to one additional user, add `--private --allow-user=<USER>`. Identify the user by numeric ID, username, or email address.

## `tw studios templates`

List available studio templates

```bash
tw studios templates [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--max` | Maximum number of templates to return, defaults to 20. | No | `20` |

## `tw studios checkpoints`

List studio checkpoints

```bash
tw studios checkpoints [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Studio session identifier | Yes |  |
| `-n`, `--name` | Studio name | Yes |  |
| `-f`, `--filter` | Optional filter criteria, allowing free text search on name and keywords: `after: YYYY-MM-DD`, `before: YYYY-MM-DD` and `author`. Example keyword usage: -f author:my-name. | No |  |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

Run `tw studios checkpoints -h` to view the required and optional fields for listing Studio checkpoints.

List checkpoints for a Studio session:

```console
$ tw studios checkpoints -i 19a3abbd -w community/showcase
```

## `tw studios add-as-new`

Add a studio from an existing one

```bash
tw studios add-as-new [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-pid`, `--parent-id` | Parent studio session identifier | Yes |  |
| `-pn`, `--parent-name` | Parent studio name | Yes |  |
| `--parent-checkpoint-id` | Parent Studio checkpoint id, to be used as the starting point for the new Studio session. If not provided, it defaults to the most recent existing checkpoint of the parent Studio session. | No |  |
| `-n`, `--name` | Studio name. | Yes |  |
| `-d`, `--description` | Studio description | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--mount-data-uris` | Comma separate list of data-link URIs: s3://nextflow-bucket,s3://another-bucket | No |  |
| `--mount-data` | Comma separate list of data-link names: nextflow-bucket,my-custom-data-link-name | No |  |
| `--mount-data-ids` | Comma separate list of data-link ids: v1-cloud-YjI3MjMwOTMyNjUwNzk5tbG9yZQ=,v1-user-d2c505e70901d2bf6516d | No |  |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). | No |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). | No |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). | No |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. | No |  |
| `-e`, `--env` | Add environment variables to the studio as key=value pairs. Can be specified multiple times (e.g. -e KEY1=value1 -e KEY2=value2). | No |  |
| `-a`, `--auto-start` | Create studio and start it immediately (default: false) | No | `false` |
| `--private` | Create a private studio that only you can access or manage (default: false) | No | `false` |
| `--allow-user` | User (numeric ID, username, or email), besides the creator, allowed to connect to and start this studio when it is private. | No |  |
| `--labels` | Comma-separated list of labels | No |  |
| `--wait` | Wait until Studio is in RUNNING status. Valid options: starting, running, stopping, stopped, errored, building, buildFailed. | No |  |

Add a Studio from an existing Studio and checkpoint. Use this to experiment without changing the parent Studio state.

Command:

```bash
tw studios add-as-new \
  --parent-id=657ddbca \
  --name=analysis-env-from-parent \
  --workspace=community/showcase \
  --description="New sandbox for temporary analysis" \
  --cpu=2 \
  --memory=8192 \
  --auto-start
```

Example output:

```console
Studio 19a3abbd CREATED at [community / showcase] workspace and auto-started.
```

For a private Studio, use `--private --allow-user=<USER>` to allow one additional user, identified by numeric ID, username, or email address, to connect to and start it.

## `tw studios stop`

Stop a studio.

```bash
tw studios stop [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Studio session identifier | Yes |  |
| `-n`, `--name` | Studio name | Yes |  |
| `--wait` | Wait until given status or fail. Valid options: starting, running, stopping, stopped, errored, building, buildFailed. | No |  |

Run `tw studios stop -h` to view the required and optional fields for adding sessions.

Stop an existing Studio session in a workspace.

Command:

```bash
tw studios stop -i 13083356 -w community/showcase
```

Example output:

```bash
Studio 13083356 STOP successfully submitted at [community / showcase] workspace.
```

## `tw studios update`

Update a studio.

```bash
tw studios update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Studio session identifier | Yes |  |
| `-n`, `--name` | Studio name | Yes |  |
| `--mount-data-uris` | Comma separate list of data-link URIs: s3://nextflow-bucket,s3://another-bucket | No |  |
| `--mount-data` | Comma separate list of data-link names: nextflow-bucket,my-custom-data-link-name | No |  |
| `--mount-data-ids` | Comma separate list of data-link ids: v1-cloud-YjI3MjMwOTMyNjUwNzk5tbG9yZQ=,v1-user-d2c505e70901d2bf6516d | No |  |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). | No |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). | No |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). | No |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. | No |  |
| `-e`, `--env` | Add environment variables to the studio as key=value pairs. Can be specified multiple times (e.g. -e KEY1=value1 -e KEY2=value2). | No |  |
| `--labels` | Comma-separated list of labels | No |  |
| `--description` | Optional configuration override for 'description'. | No |  |
| `--new-name` | Optional new name for the studio. | No |  |
| `--ssh` | Optional override to enable or disable SSH connectivity to the studio. | No |  |
| `-c`, `--compute-env` | Move the studio to a different (compatible) compute environment. Only allowed while the studio is stopped. | No |  |

## `tw studios delete`

Delete a studio.

```bash
tw studios delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Studio session identifier | Yes |  |
| `-n`, `--name` | Studio name | Yes |  |

Run `tw studios delete -h` to view the required and optional fields for listing sessions.

Delete an existing Studio session from a workspace.

```bash
tw studios delete -i 2aa60bb7

Studio 2aa60bb7 deleted at [community / showcase] workspace.
```

[actions]: /platform-cloud/pipeline-actions/overview
[compute-envs]: /platform-cloud/compute-envs/overview
[credentials]: /platform-cloud/credentials/overview
[data-explorer]: /platform-cloud/data/data-explorer
[datasets]: /platform-cloud/data/datasets
[git-integration]: /platform-cloud/git/overview
[labels]: /platform-cloud/labels/overview
[nextflow-config]: https://docs.seqera.io/nextflow/config#config-syntax
[organizations]: /platform-cloud/orgs-and-teams/organizations
[participant-roles]: /platform-cloud/orgs-and-teams/roles
[resource-labels]: /platform-cloud/resource-labels/overview
[run-details]: /platform-cloud/monitoring/run-details
[secrets]: /platform-cloud/secrets/overview
[shared-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[studio-checkpoints]: /platform-cloud/studios/managing#studio-session-checkpoints
[studios]: /platform-cloud/studios/overview
[tower-agent]: /platform-cloud/supported_software/agent/overview
[user-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave

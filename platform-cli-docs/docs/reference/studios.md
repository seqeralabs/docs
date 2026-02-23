---
title: tw studios
description: Manage studios
---

# tw studios

Run `tw studios -h` to view the list of supported operations.

Manage [Studio sessions](https://docs.seqera.io/platform-cloud/studios/overview) hosted in Seqera Platform. Studio sessions allow interactive analysis using Jupyter, RStudio, VS Code, and Xpra. Additional custom analysis environments can be defined as needed.

:::note
Most Studio operations require workspace `MAINTAIN` permissions.
:::

## tw studios view

View studio details.

```bash
tw studios view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable). Studios are not available in personal workspaces. | No | `TOWER_WORKSPACE_ID` |
| `-i`, `--id` | Studio session identifier | No | `null` |
| `-n`, `--name` | Studio name | No | `null` |

Run `tw studios view -h` to view the required and optional fields for viewing session details.

### Example

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

## tw studios list

List studios.

```bash
tw studios list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Optional filter criteria, allowing free text search on name and templateUrl and keywords: `userName`, `computeEnvName` and `status`. Example keyword usage: -f status:RUNNING. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable). Studios are not available in personal workspaces. | No | `TOWER_WORKSPACE_ID` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display (default: ) | No | `null` |

Run `tw studios list -h` to view the required and optional fields for listing studios.

List all studios in a workspace.

### Example

Command:

```bash
tw studios list -w 123456789012345
```

Example output:

```bash
Checkpoints at Studio 9s0t1u2v at [organization2 / organization6] workspace:


ID   | Name                 | Author     | Date Created                  | Date Saved
    ------+----------------------+------------+-------------------------------+-------------------------------
     7889 | snakemake_1768412934 | user3-name | Wed, 14 Jan 2026 17:48:54 GMT | Thu, 15 Jan 2026 14:28:01 GMT
     7838 | snakemake_1768226043 | user3-name | Mon, 12 Jan 2026 13:54:03 GMT | Mon, 12 Jan 2026 14:22:31 GMT
```

## tw studios templates

List available Studio templates.

```bash
tw studios templates [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--max` | Maximum number of templates to return. | No | `20` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable). Studios are not available in personal workspaces. | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw studios templates -w 123456789012345
```

Example output:

```bash
Available templates for Studios:


Templates
    --------------------------------------------------------------
     public.cr.seqera.io/platform/data-studio-jupyter:4.2.5-0.8
     public.cr.seqera.io/platform/data-studio-jupyter:4.2.5-0.9
     public.cr.seqera.io/platform/data-studio-ride:2025.04.1-0.8
     public.cr.seqera.io/platform/data-studio-ride:2025.04.1-0.9
```

## tw studios start


Start a studio.

```bash
tw studios start [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--wait` | Wait until given status or fail. Valid options: STARTING, RUNNING, STOPPED, STOPPING. | No | `null` |
| `--labels` | Comma-separated list of labels | No | `null` |
| `--description` | Optional configuration override for 'description'. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable). Studios are not available in personal workspaces. | No | `TOWER_WORKSPACE_ID` |
| `-i`, `--id` | Studio session identifier | No | `null` |
| `-n`, `--name` | Studio name | No | `null` |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). | No | `null` |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). | No | `null` |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). | No | `null` |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. | No | `null` |

Run `tw studios add-as-new -h` to view the required and optional fields for adding and starting a new session from an existing session checkpoint.

Add a new session from an existing parent Studio session and checkpoint. Useful for experimentation without impacting the parent Studio session state.

### Example

Command:

```bash
tw studios add-as-new -pid 0t1u2v3w -n cloned-studio-example -w 123456789012345
```

Example output:

```bash
Studio 1u2v3w4x CREATED at [my-organization-updated / my-workspace] workspace.
```

## tw studios add

Add a studio.

```bash
tw studios add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Studio name. | Yes | `null` |
| `-d`, `--description` | Studio description | No | `null` |
| `--conda-env-yml`, `--conda-env-yaml` | Path to a YAML env file with Conda packages to be installed in the studio environment | No | `null` |
| `-c`, `--compute-env` | Compute environment name | Yes | `null` |
| `-a`, `--auto-start` | Create studio and start it immediately (default: false) | No | `false` |
| `--private` | Create a private studio that only you can access or manage (default: false) | No | `false` |
| `--labels` | Comma-separated list of labels | No | `null` |
| `--wait` | Wait until Studio is in RUNNING status. Valid options: STARTING, RUNNING, STOPPED, STOPPING. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable). Studios are not available in personal workspaces. | No | `TOWER_WORKSPACE_ID` |
| `-t`, `--template` | Container image template to be used for Studio. Available templates can be listed with 'studios templates' command. | No | `null` |
| `-ct`, `--custom-template` | Custom container image template to be used for Studio. | No | `null` |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). | No | `null` |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). | No | `null` |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). | No | `null` |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. | No | `null` |

Run `tw studios add -h` to view the required and optional fields for adding sessions.

Add a new Studio session in a workspace.

### Example

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

## tw studios checkpoints

List studio checkpoints.

```bash
tw studios checkpoints [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Optional filter criteria, allowing free text search on name and keywords: `after: YYYY-MM-DD`, `before: YYYY-MM-DD` and `author`. Example keyword usage: -f author:my-name. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable). Studios are not available in personal workspaces. | No | `TOWER_WORKSPACE_ID` |
| `-i`, `--id` | Studio session identifier | No | `null` |
| `-n`, `--name` | Studio name | No | `null` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display (default: ) | No | `null` |

Run `tw studios checkpoints -h` to view the required and optional fields for viewing checkpoints for a session.

List all checkpoints for an existing Studio session in a workspace. See [Session checkpoints](https://docs.seqera.io/platform-cloud/studios/managing#studio-session-checkpoints) for more information.

### Example

Command:

```bash
tw studios checkpoints -i 9s0t1u2v -w 123456789012345
```

Example output:

```bash
Checkpoints for studio '9s0t1u2v' at [my-organization / my-workspace] workspace:

ID             | Name                | Created
---------------+---------------------+-------------------------------
1a2b3c4d5e     | checkpoint-001      | Mon, 15 Jan 2024 10:30:00 GMT
2b3c4d5e6f     | checkpoint-002      | Mon, 15 Jan 2024 14:45:00 GMT
```

## tw studios add-as-new

Add a studio from an existing one.

```bash
tw studios add-as-new [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--parent-checkpoint-id` | Parent Studio checkpoint id, to be used as the starting point for the new Studio session. If not provided, it defaults to the most recent existing checkpoint of the parent Studio session. | No | `null` |
| `-n`, `--name` | Studio name. | Yes | `null` |
| `-d`, `--description` | Studio description | No | `null` |
| `-a`, `--auto-start` | Create studio and start it immediately (default: false) | No | `false` |
| `--private` | Create a private studio that only you can access or manage (default: false) | No | `false` |
| `--labels` | Comma-separated list of labels | No | `null` |
| `--wait` | Wait until Studio is in RUNNING status. Valid options: STARTING, RUNNING, STOPPED, STOPPING. | No | `null` |
| `-pid`, `--parent-id` | Parent studio session identifier | No | `null` |
| `-pn`, `--parent-name` | Parent studio name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable). Studios are not available in personal workspaces. | No | `TOWER_WORKSPACE_ID` |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). | No | `null` |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). | No | `null` |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). | No | `null` |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. | No | `null` |

## tw studios stop

Stop a studio.

```bash
tw studios stop [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--wait` | Wait until given status or fail. Valid options: STARTING, RUNNING, STOPPED, STOPPING. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable). Studios are not available in personal workspaces. | No | `TOWER_WORKSPACE_ID` |
| `-i`, `--id` | Studio session identifier | No | `null` |
| `-n`, `--name` | Studio name | No | `null` |

Run `tw studios stop -h` to view the required and optional fields for adding sessions.

Stop an existing Studio session in a workspace.

### Example

Command:

```bash
tw studios stop -i 13083356 -w community/showcase
```

Example output:

```bash
Studio 13083356 STOP successfully submitted at [community / showcase] workspace.
```

## tw studios delete

Delete an existing Studio session from a workspace.

```bash
tw studios delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable). Studios are not available in personal workspaces. | No | `TOWER_WORKSPACE_ID` |
| `-i`, `--id` | Studio session identifier | No | `null` |
| `-n`, `--name` | Studio name | No | `null` |

Run `tw studios delete -h` to view the required and optional fields for listing sessions.

### Example

Command:

```bash
tw studios delete -i 2aa60bb7
```

Example output:

```bash
Studio 2aa60bb7 deleted at [community / showcase] workspace.
```

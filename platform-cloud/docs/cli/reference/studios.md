---
title: tw studios
description: Manage studios
---

# `tw studios`

Run `tw studios -h` to view the list of supported operations.

Manage [Studio sessions](../../studios/overview) hosted in Seqera Platform. Studio sessions allow interactive analysis using Jupyter, RStudio, VS Code, and Xpra. Additional custom analysis environments can be defined as needed.

:::note
Most Studio operations require workspace `MAINTAIN` permissions.
:::

## `tw studios view`

View studio details.

```bash
tw studios view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |

Run `tw studios view -h` to view the required and optional fields for viewing session details.

```bash
tw studios view -i 23ce7967 -w community/showcase

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

List studios.

```bash
tw studios list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Optional filter criteria, allowing free text search on name and templateUrl and keywords: `userName`, `computeEnvName` and `status`. Example keyword usage: -f status:RUNNING. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

Run `tw studios checkpoints -h` to view the required and optional fields for viewing checkpoints for a session.

List all checkpoints for an existing Studio session in a workspace. See [Session checkpoints](../../studios/managing#studio-session-checkpoints) for more information.

```bash
tw studios checkpoints -i 19a3abbd -w community/showcase

Checkpoints at studio 19a3abbd at [community / showcase] workspace:

    ID   | Name                 | Author     | Date Created                  | Date Saved
  ------+----------------------+------------+-------------------------------+-------------------------------
    2010 | my_custom_named_ckpt | rob-newman | Fri, 31 Jan 2025 20:22:15 GMT | Fri, 31 Jan 2025 20:33:00 GMT
    2011 | foo_1738355617       | rob-newman | Fri, 31 Jan 2025 20:33:37 GMT | Fri, 31 Jan 2025 20:35:22 GMT
```

## `tw studios start`


Start a studio.

```bash
tw studios start [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--wait` | Wait until given status or fail. Valid options: ${COMPLETION-CANDIDATES}. |  |  |
| `--labels` | Comma-separated list of labels |  |  |
| `--description` | Optional configuration override for 'description'. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). |  |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). |  |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). |  |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. |  |  |

Run `tw studios start-as-new -h` to view the required and optional fields for adding and starting a new session from an existing session checkpoint.

Add a new session from an existing parent Studio session and checkpoint. Useful for experimentation without impacting the parent Studio session state.

```bash
tw studios start-as-new -pid=657ddbca \
-n=analysis-env-from-parent \
-w community/showcase \
--description="New sandbox for temporary analysis"  \
--cpu=2 \
--memory=8192 \
-a

  Studio 19a3abbd CREATED at [community / showcase] workspace and auto-started.
```

## `tw studios add`

Add a studio.

```bash
tw studios add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Studio name. | ✓ |  |
| `-d`, `--description` | Studio description |  |  |
| `--conda-env-yml`, `--conda-env-yaml` | Path to a YAML env file with Conda packages to be installed in the studio environment |  |  |
| `-c`, `--compute-env` | Compute environment name | ✓ |  |
| `-a`, `--auto-start` | Create studio and start it immediately (default: false) |  | `false` |
| `--private` | Create a private studio that only you can access or manage (default: false) |  | `false` |
| `--labels` | Comma-separated list of labels |  |  |
| `--wait` | Wait until Studio is in RUNNING status. Valid options: ${COMPLETION-CANDIDATES}. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-t`, `--template` | Container image template to be used for Studio. Available templates can be listed with 'studios templates' command. |  |  |
| `-ct`, `--custom-template` | Custom container image template to be used for Studio. |  |  |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). |  |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). |  |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). |  |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. |  |  |

Run `tw studios add -h` to view the required and optional fields for adding sessions.

Add a new Studio session in a workspace.

```bash
tw studios add -n new-analysis -w community/showcase \
--description="New Python analysis for RNA experiment ABC" \
--template="public.cr.seqera.io/platform/data-studio-jupyter:4.1.5-0.7" \
--compute-env=48bB2PDk83AxskE40lealy \
--cpu=2 \
--memory=8192

  Studio 2aa60bb7 CREATED at [community / showcase] workspace.
```

## `tw studios templates`

List available studio templates.

```bash
tw studios templates [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--max` | Maximum number of templates to return, defaults to 20. |  | `20` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw studios checkpoints`

List studio checkpoints.

```bash
tw studios checkpoints [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Optional filter criteria, allowing free text search on name and keywords: `after: YYYY-MM-DD`, `before: YYYY-MM-DD` and `author`. Example keyword usage: -f author:my-name. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

## `tw studios add-as-new`

Add a studio from an existing one.

```bash
tw studios add-as-new [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--parent-checkpoint-id` | Parent Studio checkpoint id, to be used as the starting point for the new Studio session. If not provided, it defaults to the most recent existing checkpoint of the parent Studio session. |  |  |
| `-n`, `--name` | Studio name. | ✓ |  |
| `-d`, `--description` | Studio description |  |  |
| `-a`, `--auto-start` | Create studio and start it immediately (default: false) |  | `false` |
| `--private` | Create a private studio that only you can access or manage (default: false) |  | `false` |
| `--labels` | Comma-separated list of labels |  |  |
| `--wait` | Wait until Studio is in RUNNING status. Valid options: ${COMPLETION-CANDIDATES}. |  |  |
| `-pid`, `--parent-id` | Parent studio session identifier |  |  |
| `-pn`, `--parent-name` | Parent studio name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--gpu` | Optional configuration override for 'gpu' setting (integer representing number of cores). |  |  |
| `--cpu` | Optional configuration override for 'cpu' setting (integer representing number of cores). |  |  |
| `--memory` | Optional configuration override for 'memory' setting (integer representing memory in MBs). |  |  |
| `--lifespan` | Optional configuration override for 'lifespan' setting (integer representing hours). Defaults to workspace lifespan setting. |  |  |

## `tw studios stop`

Stop a studio.

```bash
tw studios stop [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--wait` | Wait until given status or fail. Valid options: ${COMPLETION-CANDIDATES}. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |

Run `tw studios stop -h` to view the required and optional fields for adding sessions.

Stop an existing Studio session in a workspace.

```bash
tw studios stop -i 13083356 -w community/showcase

  Studio 13083356 STOP successfully submitted at [community / showcase] workspace.
```

## `tw studios delete`

Delete a studio.

```bash
tw studios delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Studio session identifier |  |  |
| `-n`, `--name` | Studio name |  |  |

Run `tw studios delete -h` to view the required and optional fields for listing sessions.

Delete an existing Studio session from a workspace.

```bash
tw studios delete -i 2aa60bb7

Studio 2aa60bb7 deleted at [community / showcase] workspace.
```

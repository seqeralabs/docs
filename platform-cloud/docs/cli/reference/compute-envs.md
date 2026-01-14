---
title: tw compute-envs
description: Manage compute environments.
---

# `tw compute-envs`

Manage compute environments.

## `tw compute-envs add`

Add a new compute environment.

### Synopsis

```bash
tw compute-envs add [OPTIONS]
```

### `tw compute-envs add k8s`

Add new Kubernetes compute environment.

### Synopsis

```bash
tw compute-envs add k8s [OPTIONS]
```

### `tw compute-envs add aws-batch`

Add new AWS Batch compute environment.

### Synopsis

```bash
tw compute-envs add aws-batch [OPTIONS]
```

### `tw compute-envs add eks`

Add new Amazon EKS compute environment.

### Synopsis

```bash
tw compute-envs add eks [OPTIONS]
```

### `tw compute-envs add slurm`

Add new Slurm compute environment.

### Synopsis

```bash
tw compute-envs add slurm [OPTIONS]
```

### `tw compute-envs add lsf`

Add new IBM LSF compute environment.

### Synopsis

```bash
tw compute-envs add lsf [OPTIONS]
```

### `tw compute-envs add uge`

Add new UNIVA grid engine compute environment.

### Synopsis

```bash
tw compute-envs add uge [OPTIONS]
```

### `tw compute-envs add altair`

Add new Altair PBS Pro compute environment.

### Synopsis

```bash
tw compute-envs add altair [OPTIONS]
```

### `tw compute-envs add moab`

Add new MOAB compute environment.

### Synopsis

```bash
tw compute-envs add moab [OPTIONS]
```

### `tw compute-envs add gke`

Add new Google GKE compute environment.

### Synopsis

```bash
tw compute-envs add gke [OPTIONS]
```

### `tw compute-envs add google-ls`

Add new Google life sciences compute environment.

### Synopsis

```bash
tw compute-envs add google-ls [OPTIONS]
```

### `tw compute-envs add google-batch`

Add new Google Batch compute environment.

### Synopsis

```bash
tw compute-envs add google-batch [OPTIONS]
```

### `tw compute-envs add azure-batch`

Add new Azure Batch compute environments.

### Synopsis

```bash
tw compute-envs add azure-batch [OPTIONS]
```

### `tw compute-envs add seqera-compute`

Add new Seqera Compute environment.

### Synopsis

```bash
tw compute-envs add seqera-compute [OPTIONS]
```

## `tw compute-envs update`

Update a compute environment.

### Synopsis

```bash
tw compute-envs update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--new-name` | New compute environment name. |  |  |
| `-i`, `--id` | Compute environment unique identifier. |  |  |
| `-n`, `--name` | Compute environment name. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw compute-envs delete`

Delete a compute environment.

### Synopsis

```bash
tw compute-envs delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Compute environment unique identifier. |  |  |
| `-n`, `--name` | Compute environment name. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw compute-envs view`

View compute environment details.

### Synopsis

```bash
tw compute-envs view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Compute environment unique identifier. |  |  |
| `-n`, `--name` | Compute environment name. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw compute-envs list`

List compute environments.

### Synopsis

```bash
tw compute-envs list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw compute-envs export`

Export compute environment configuration as a JSON file.

### Synopsis

```bash
tw compute-envs export [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Compute environment unique identifier. |  |  |
| `-n`, `--name` | Compute environment name. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw compute-envs import`

Import a compute environment configuration from a JSON file.

### Synopsis

```bash
tw compute-envs import [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--overwrite` | Overwrite the compute environment if it already exists. |  | `false` |

## `tw compute-envs primary`

Manage the primary compute environment.

### Synopsis

```bash
tw compute-envs primary [OPTIONS]
```

### `tw compute-envs primary get`

Get the primary compute environment.

### Synopsis

```bash
tw compute-envs primary get [OPTIONS]
```

### `tw compute-envs primary set`

Set a compute environment as primary.

### Synopsis

```bash
tw compute-envs primary set [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Compute environment unique identifier. |  |  |
| `-n`, `--name` | Compute environment name. |  |  |

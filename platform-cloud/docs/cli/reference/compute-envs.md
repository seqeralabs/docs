---
title: tw compute-envs
description: Manage compute environments.
---

# `tw compute-envs`

Manage compute environments.

Compute environments define the execution platform where a pipeline runs. A compute environment is composed of the credentials, configuration, and storage options related to a particular computing platform.  See [Compute environments][compute-envs] for more information on supported providers.

Run `tw compute-envs -h` to view the list of supported compute environment operations.


## `tw compute-envs add`


Add a new compute environment.

```bash
tw compute-envs add [OPTIONS]
```

Run `tw compute-envs add -h` to view the list of supported providers.

Run `tw compute-envs add <platform> -h` to view the required and optional fields for your provider.

You must add the credentials for your provider before creating your compute environment.

```bash
tw compute-envs add aws-batch forge --name=my_aws_ce \
--credentials=<my_aws_creds_1> --region=eu-west-1 --max-cpus=256 \
--work-dir=s3://<bucket name> --wait=AVAILABLE

  New AWS-BATCH compute environment 'my_aws_ce' added at user workspace
```

This command will:

- Use **Batch Forge** to automatically manage the AWS Batch resource lifecycle (`forge`)
- Use the credentials previously added to the workspace (`--credentials`)
- Create the required AWS Batch resources in the AWS Ireland (`eu-west-1`) region
- Provision a maximum of 256 CPUs in the compute environment (`--max-cpus`)
- Use an existing S3 bucket to store the Nextflow work directory (`--work-dir`)
- Wait until the compute environment has been successfully created and is ready to use (`--wait`)

See the [compute environment][compute-envs] page for your provider for detailed information on Batch Forge and manual compute environment creation.


### `tw compute-envs add k8s`


Add new Kubernetes compute environment.

```bash
tw compute-envs add k8s [OPTIONS]
```

### `tw compute-envs add aws-batch`


Add new AWS Batch compute environment.

```bash
tw compute-envs add aws-batch [OPTIONS]
```

### `tw compute-envs add eks`


Add new Amazon EKS compute environment.

```bash
tw compute-envs add eks [OPTIONS]
```

### `tw compute-envs add slurm`


Add new Slurm compute environment.

```bash
tw compute-envs add slurm [OPTIONS]
```

### `tw compute-envs add lsf`


Add new IBM LSF compute environment.

```bash
tw compute-envs add lsf [OPTIONS]
```

### `tw compute-envs add uge`


Add new UNIVA grid engine compute environment.

```bash
tw compute-envs add uge [OPTIONS]
```

### `tw compute-envs add altair`


Add new Altair PBS Pro compute environment.

```bash
tw compute-envs add altair [OPTIONS]
```

### `tw compute-envs add moab`


Add new MOAB compute environment.

```bash
tw compute-envs add moab [OPTIONS]
```

### `tw compute-envs add gke`


Add new Google GKE compute environment.

```bash
tw compute-envs add gke [OPTIONS]
```

### `tw compute-envs add google-ls`


Add new Google life sciences compute environment.

```bash
tw compute-envs add google-ls [OPTIONS]
```

### `tw compute-envs add google-batch`


Add new Google Batch compute environment.

```bash
tw compute-envs add google-batch [OPTIONS]
```

### `tw compute-envs add azure-batch`


Add new Azure Batch compute environments.

```bash
tw compute-envs add azure-batch [OPTIONS]
```

### `tw compute-envs add seqera-compute`


Add new Seqera Compute environment.

```bash
tw compute-envs add seqera-compute [OPTIONS]
```

## `tw compute-envs update`


Update a compute environment.

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

```bash
tw compute-envs delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Compute environment unique identifier. |  |  |
| `-n`, `--name` | Compute environment name. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

```bash
tw compute-envs delete --name=my_aws_ce

  Compute environment '1sxCxvxfx8xnxdxGxQxqxH' deleted at user workspace
```


## `tw compute-envs view`


View compute environment details.

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

```bash
tw compute-envs list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw compute-envs export`


Export compute environment configuration as a JSON file.

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

```bash
tw compute-envs import [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--overwrite` | Overwrite the compute environment if it already exists. |  | `false` |

## `tw compute-envs primary`


Manage the primary compute environment.

```bash
tw compute-envs primary [OPTIONS]
```

### `tw compute-envs primary get`


Get the primary compute environment.

```bash
tw compute-envs primary get [OPTIONS]
```

### `tw compute-envs primary set`


Set a compute environment as primary.

```bash
tw compute-envs primary set [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Compute environment unique identifier. |  |  |
| `-n`, `--name` | Compute environment name. |  |  |

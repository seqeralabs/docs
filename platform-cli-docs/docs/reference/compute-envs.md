---
title: tw compute-envs
description: Manage compute environments.
---

# tw compute-envs

Manage compute environments.

Compute environments define the execution platform where a pipeline runs. A compute environment is composed of the credentials, configuration, and storage options related to a particular computing platform.  See [Compute environments](https://docs.seqera.io/platform-cloud/compute-envs/overview) for more information on supported providers.

Run `tw compute-envs -h` to view the list of supported compute environment operations.

## tw compute-envs add

Add a new compute environment.

```bash
tw compute-envs add [OPTIONS]
```

Run `tw compute-envs add -h` to view the list of supported providers.

Run `tw compute-envs add <platform> -h` to view the required and optional fields for your provider.

You must add the credentials for your provider before creating your compute environment.

### Example

Command:

```bash
tw compute-envs add aws-batch forge --name=my_aws_ce \
--credentials=<my_aws_creds_1> --region=eu-west-1 --max-cpus=256 \
--work-dir=s3://<bucket name> --wait=AVAILABLE
```

Example output:

```bash
New AWS-BATCH compute environment 'my_aws_ce' added at user workspace
```

This command will:

- Use **Batch Forge** to automatically manage the AWS Batch resource lifecycle (`forge`)
- Use the credentials previously added to the workspace (`--credentials`)
- Create the required AWS Batch resources in the AWS Ireland (`eu-west-1`) region
- Provision a maximum of 256 CPUs in the compute environment (`--max-cpus`)
- Use an existing S3 bucket to store the Nextflow work directory (`--work-dir`)
- Wait until the compute environment has been successfully created and is ready to use (`--wait`)

See the [compute environment](https://docs.seqera.io/platform-cloud/compute-envs/overview) page for your provider for detailed information on Batch Forge and manual compute environment creation.

## tw compute-envs update

Update a compute environment.

```bash
tw compute-envs update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `--new-name` | New compute environment name. | No | `null` |
| `-i`, `--id` | Compute environment unique identifier. | No | `null` |
| `-n`, `--name` | Compute environment name. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw compute-envs update -n AWSCloudCE2 --new-name AWSCloud-primary -w 123456789012345
```

Example output:

```bash
Compute environment 'AWSCloudCE2' updated at [my-organization / my-workspace] workspace
```

## tw compute-envs delete

Delete a compute environment.

```bash
tw compute-envs delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Compute environment unique identifier. | No | `null` |
| `-n`, `--name` | Compute environment name. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw compute-envs delete --name=my_aws_ce
```

Example output:

```bash
Compute environment '1sxCxvxfx8xnxdxGxQxqxH' deleted at user workspace
```

## tw compute-envs view

View compute environment details.

```bash
tw compute-envs view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Compute environment unique identifier. | No | `null` |
| `-n`, `--name` | Compute environment name. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw compute-envs view -n AWSBatchCE -w 123456789012345
```

Example output:

```bash
Compute environment at [my-organization / my-workspace] workspace:


---------------+-------------------------------
     ID            | 7g8h9i0j1k2l3m4n5o6p7q
     Name          | AWSBatchCE
     Platform      | aws-batch
     Last updated  | Thu, 10 Jul 2025 11:23:28 GMT
     Last activity | Thu, 10 Jul 2025 11:24:20 GMT
     Created       | Thu, 10 Jul 2025 11:22:49 GMT
     Status        | AVAILABLE
     Labels        |

  Configuration:

     {
       "discriminator" : "aws-batch",
       "region" : "eu-west-2",
       "executionRole" : "arn:aws:iam::123456789012:role/TowerForge-7g8h9i0j1k2l3m4n5o6p7q-ExecutionRole",
       "waveEnabled" : true,
       "fusion2Enabled" : true,
       "nvnmeStorageEnabled" : true,
       "fusionSnapshots" : false,
       "forge" : {
         "type" : "SPOT",
         "minCpus" : 0,
         "maxCpus" : 500,
         "gpuEnabled" : false,
         "instanceTypes" : [ ],
         "subnets" : [ ],
         "securityGroups" : [ ],
         "disposeOnDeletion" : true,
         "allowBuckets" : [ ],
         "efsCreate" : false,
         "dragenEnabled" : false,
         "fargateHeadEnabled" : false
       },
       "workDir" : "s3://my-bucket",
       "environment" : [ ]
     }
```

## tw compute-envs list

List compute environments.

```bash
tw compute-envs list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw compute-envs list -w 123456789012345
```

Example output:

```bash
Compute environments at [my-organization / my-workspace] workspace:


ID                     | Status    | Platform     | Name        | Last activity
    --------------------------+-----------+--------------+-------------+-------------------------------
       5e6f7g8h9i0j1k2l3m4n5o | AVAILABLE | eks-platform | AWS-EKS     | never
       6f7g8h9i0j1k2l3m4n5o6p | AVAILABLE | gke-platform | gke-ce      | never
       7g8h9i0j1k2l3m4n5o6p7q | AVAILABLE | aws-batch    | AWSBatchCE  | Thu, 10 Jul 2025 11:24:20 GMT
       8h9i0j1k2l3m4n5o6p7q8r | AVAILABLE | aws-cloud    | AWSCloud    | never
       9i0j1k2l3m4n5o6p7q8r9s | AVAILABLE | gke-platform | GKE-CE2     | never
       0j1k2l3m4n5o6p7q8r9s0t | AVAILABLE | google-batch | GCPBatch    | never
     * 1k2l3m4n5o6p7q8r9s0t1  | AVAILABLE | aws-cloud    | AWSCloudCE2 | never
```

## tw compute-envs export

Export compute environment configuration as a JSON file.

```bash
tw compute-envs export [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Compute environment unique identifier. | No | `null` |
| `-n`, `--name` | Compute environment name. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw compute-envs export -n AWSCloud-primary -w 123456789012345 > /tmp/cloudce-export.json
```

Example output:

```bash
(empty)
```

## tw compute-envs import

Import a compute environment configuration from a JSON file.

```bash
tw compute-envs import [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `--overwrite` | Overwrite the compute environment if it already exists. | No | `false` |

### Example

Command:

```bash
tw compute-envs import -n example-imported-ce -c 2l3m4n5o6p7q8r9s0t1u2v /tmp/cloudce-export.json -w 123456789012345
```

Example output:

```bash
New AWS-CLOUD compute environment 'example-imported-ce' added at [my-organization / my-workspace] workspace
```

## tw compute-envs primary

Manage the primary compute environment.

```bash
tw compute-envs primary [OPTIONS]
```

### tw compute-envs primary get

Get the primary compute environment.

```bash
tw compute-envs primary get [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw compute-envs primary get -w 123456789012345
```

Example output:

```bash
Primary compute environment for workspace '[my-organization / my-workspace]' is 'AWSCloud-primary (1k2l3m4n5o6p7q8r9s0t1)'
```

### tw compute-envs primary set

Set a compute environment as primary.

```bash
tw compute-envs primary set [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Compute environment unique identifier. | No | `null` |
| `-n`, `--name` | Compute environment name. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example

Command:

```bash
tw compute-envs primary set -n AWS-EKS -w 123456789012345
```

Example output:

```bash
  Primary compute environment for workspace '[my-organization / my-workspace]' was set to 'AWS-EKS (5e6f7g8h9i0j1k2l3m4n5o)'
```

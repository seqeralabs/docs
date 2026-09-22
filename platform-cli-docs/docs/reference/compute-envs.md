---
title: "tw compute-envs"
description: "Manage compute environments."
---

# `tw compute-envs`

Manage compute environments.

Compute environments define the execution platform where a pipeline runs. A compute environment is composed of the credentials, configuration, and storage options related to a particular computing platform.  See [Compute environments][compute-envs] for more information on supported providers.

Run `tw compute-envs -h` to view the list of supported compute environment operations.

## `tw compute-envs add`

Add a new compute environment.

```bash
tw compute-envs add
```

Run `tw compute-envs add -h` to view the list of supported providers.

Run `tw compute-envs add <platform> -h` to view the required and optional fields for your provider.

You must add the credentials for your provider before creating your compute environment.

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

See the [compute environment][compute-envs] page for your provider for detailed information on Batch Forge and manual compute environment creation.

### `tw compute-envs add k8s`

Add new Kubernetes compute environment.

```bash
tw compute-envs add k8s [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--storage-mount` | Mount path for the PersistentVolumeClaim. Directory where the storage is mounted in containers. If absent, Platform defaults to /scratch. | No |  |
| `--compute-account` | Kubernetes service account for Nextflow-submitted pipeline jobs. Controls permissions for individual task pods. If absent, Platform defaults to default. | No |  |
| `--pod-cleanup` | Pod cleanup policy after job completion. ON_SUCCESS removes pods only on success. ALWAYS removes all pods. NEVER keeps all pods. | No |  |
| `--head-pod-spec` | Custom PodSpec YAML for the Nextflow head job pod. Provide path to YAML file with custom pod configuration. | No |  |
| `--service-pod-spec` | Custom PodSpec YAML for the compute environment service pod. Provide path to YAML file with custom pod configuration. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored on the shared storage. | Yes |  |
| `-s`, `--server` | Kubernetes control plane URL. The API server endpoint for cluster communication (e.g., https://your-k8s-host.com). | Yes |  |
| `--namespace` | Kubernetes namespace for workflow execution. Isolates resources within the cluster. | Yes |  |
| `--ssl-cert` | SSL certificate to authenticate the connection. Provide path to certificate file for secure cluster communication. | Yes |  |
| `--head-account` | Kubernetes service account for connecting to the cluster. Used by the Nextflow head job to authenticate with the Kubernetes API. | Yes |  |
| `--storage-claim` | PersistentVolumeClaim name for scratch storage. Must support ReadWriteMany access mode for shared workflow data. | Yes |  |

### `tw compute-envs add aws-batch`

Add new AWS Batch compute environment.

```bash
tw compute-envs add aws-batch
```

Use `--secrets-kms-key` to encrypt the temporary AWS Secrets Manager secrets that Platform creates for runs that use pipeline secrets with a customer-managed KMS key. Pass a key ARN or a key ID. When omitted, Platform uses the AWS-managed default key. The compute environment credentials and the execution role need additional KMS permissions on the key. See [Pipeline secrets][aws-batch-pipeline-secrets] for the required policy statements.

#### `tw compute-envs add aws-batch forge`

Add new AWS Batch compute environment with automatic provisioning of compute resources.

```bash
tw compute-envs add aws-batch forge [OPTIONS]
```

##### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--create-efs` | A OneZone EFS without backup will be created. EC2 instances can run on a different zone and inter-region transfer fees will be billed. If you want to remove transfer costs, restrict to only one subnet at advanced options. | No |  |
| `--efs-id` | Enter the EFS file system id e.g. fs-0123456789. | No |  |
| `--efs-mount` | Enter the EFS mount path [default: pipeline work directory]. | No |  |
| `--fsx-size` | Enter the FSx storage capacity in GB (minimum 1,200 GB or increments of 2,400 GB). | No |  |
| `--fsx-dns` | Enter the FSx file system DNS name e.g. 'fs-0123456789.fsx.eu-west-1.amazonaws.com'. | No |  |
| `--fsx-mount` | Enter the FSx mount path [default: pipeline work directory]. | No |  |
| `--instance-types` | EC2 instance types for compute resources. Comma-separated list of instance families or types. Use 'optimal' for automatic selection of M4, C4, and R4 instances. | No |  |
| `--alloc-strategy` | Instance allocation strategy. Controls how AWS Batch launches instances. BEST_FIT_PROGRESSIVE recommended for On-Demand. SPOT_CAPACITY_OPTIMIZED recommended for Spot instances. | No |  |
| `--vpc-id` | VPC identifier. The Virtual Private Cloud where compute resources will be deployed. | No |  |
| `--subnets` | VPC subnets for compute resources. Comma-separated list of subnet IDs for network isolation and internet access control. | No |  |
| `--security-groups` | Security group IDs for network access control. Comma-separated list defining firewall rules for EC2 compute nodes. | No |  |
| `--ami-id` | Custom AMI identifier. Must be AWS Linux 2 ECS-optimized image meeting compute resource specifications. If absent, Platform defaults to latest approved Amazon ECS-optimized AMI. | No |  |
| `--key-pair` | EC2 key pair name for SSH access. Enables remote access to compute nodes for debugging and maintenance. | No |  |
| `--min-cpus` | Minimum CPUs to keep provisioned. These CPUs remain active continuously and incur costs regardless of workload activity. If absent, Platform defaults to 0. | No |  |
| `--boot-disk-size` | Boot disk size in GB. Controls the root volume size for EC2 instances. If absent, Platform defaults to 50 GB. | No |  |
| `--head-job-cpus` | Number of CPUs allocated to the Nextflow head job. Controls the compute resources for the main workflow orchestration process. | No |  |
| `--head-job-memory` | Memory allocation for the Nextflow head job in megabytes. Determines available memory for workflow orchestration. | No |  |
| `--head-job-role` | IAM role ARN to grant fine-grained permissions to the Nextflow head job. Enables secure access to AWS resources. | No |  |
| `--compute-job-role` | IAM role ARN to grant fine-grained permissions to Nextflow compute jobs. Controls access for individual pipeline tasks. | No |  |
| `--batch-execution-role` | IAM role ARN for ECS task execution. Grants Amazon ECS containers permission to make AWS API calls on your behalf. | No |  |
| `--ebs-blocksize` | Initial EBS auto-expandable volume size in GB. Additional blocks of this size are added automatically when storage runs low. If absent, Platform defaults to 50 GB. | No |  |
| `--bid-percentage` | Maximum Spot instance price as percentage of On-Demand price. Controls cost ceiling for Spot instances. You pay the market price up to this maximum. If absent, Platform defaults to 100%. | No |  |
| `--cli-path` | AWS CLI installation path on EC2 instances. Specify custom path if AWS CLI is installed in non-standard location. | No |  |
| `--secrets-kms-key` | Customer-managed KMS key used to encrypt the temporary Secrets Manager secrets created for runs that use pipeline secrets. Accepts a key ARN or a key id. When omitted, the AWS-managed default Secrets Manager key is used. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored. Must be an S3 bucket path (e.g., s3://your-bucket/work). | Yes |  |
| `-r`, `--region` | AWS region where compute resources will be created (e.g., us-east-1, eu-west-1). | Yes |  |
| `--max-cpus` | Maximum CPUs provisioned by Batch Forge. Defines the upper limit for auto-scaling compute capacity. | Yes |  |
| `--provisioning-model` | Instance provisioning model. EC2 uses on-demand instances for reliability. SPOT uses interruptible instances for cost savings. Default: SPOT. | No | `SPOT` |
| `--no-ebs-auto-scale` | Disable EBS auto-expandable disk provisioning. When disabled, instances use fixed-size storage volumes. | No |  |
| `--fusion` | DEPRECATED - Use '--fusion-v2' instead. | No |  |
| `--fusion-v2` | Enable Fusion file system. Provides native access to S3 storage with low-latency I/O. Requires Wave containers. | No |  |
| `--wave` | Enable Wave containers. Allows access to private container repositories and on-demand container provisioning. | No |  |
| `--fast-storage` | Enable NVMe instance storage. Provides high-performance local storage for faster I/O operations. Requires Fusion file system. | No |  |
| `--snapshots` | Enable Fusion Snapshots. Automatically restores jobs interrupted by spot instance reclamation. Requires Fusion file system. | No |  |
| `--fargate` | Run Nextflow head job on Fargate. Enables serverless container execution for the orchestration process. Requires Fusion v2 and Spot provisioning model. | No |  |
| `--gpu` | Enable GPU instances. Provisions GPU-enabled EC2 instances for compute-intensive workloads requiring hardware acceleration. | No |  |
| `--allow-buckets` | Additional S3 buckets for read-write access. Comma-separated list of S3 bucket paths beyond the work directory. Format: s3://bucket-name or s3://bucket-name/path. | No |  |
| `--preserve-resources` | Preserve Batch Forge resources on deletion. Keeps AWS Batch compute environments and related resources when the compute environment is deleted from Seqera Platform. | No |  |
| `--ecs-config` | Custom ECS agent configuration file. Appends custom parameters to /etc/ecs/ecs.config on each cluster node. Provide path to configuration file. | No |  |
| `--fusion-metrics-collection` | Send Fusion metrics to Seqera for this compute environment. Fusion always generates the metrics; this only controls whether they are collected and sent to Seqera. Only valid when Fusion is enabled. If unset, Platform applies its default. | No |  |

#### `tw compute-envs add aws-batch manual`

Add new AWS Batch compute environment using an existing environment.

```bash
tw compute-envs add aws-batch manual [OPTIONS]
```

##### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--head-job-cpus` | Number of CPUs allocated to the Nextflow head job. Controls the compute resources for the main workflow orchestration process. | No |  |
| `--head-job-memory` | Memory allocation for the Nextflow head job in megabytes. Determines available memory for workflow orchestration. | No |  |
| `--head-job-role` | IAM role ARN to grant fine-grained permissions to the Nextflow head job. Enables secure access to AWS resources. | No |  |
| `--compute-job-role` | IAM role ARN to grant fine-grained permissions to Nextflow compute jobs. Controls access for individual pipeline tasks. | No |  |
| `--batch-execution-role` | IAM role ARN for ECS task execution. Grants Amazon ECS containers permission to make AWS API calls on your behalf. | No |  |
| `--cli-path` | Nextflow requires the AWS CLI installed in the Ec2 instances. Use this field to specify the path. | No |  |
| `--secrets-kms-key` | Customer-managed KMS key used to encrypt the temporary Secrets Manager secrets created for runs that use pipeline secrets. Accepts a key ARN or a key id. When omitted, the AWS-managed default Secrets Manager key is used. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored. Must be an S3 bucket path (e.g., s3://your-bucket/work). | Yes |  |
| `-r`, `--region` | AWS region where compute resources will be created (e.g., us-east-1, eu-west-1). | Yes |  |
| `--head-queue` | AWS Batch queue for the Nextflow head job. Should use on-demand instances for reliability. | Yes |  |
| `--compute-queue` | AWS Batch compute queue for running pipeline jobs. Nextflow submits tasks to this queue. Can be overridden in pipeline config. | Yes |  |
| `--fusion-v2` | Enable Fusion file system. Provides native access to S3 storage with low-latency I/O. Requires Wave containers. | No |  |
| `--wave` | Enable Wave containers. Allows access to private container repositories and on-demand container provisioning. | No |  |
| `--fast-storage` | Enable NVMe instance storage. Provides high-performance local storage for faster I/O operations. Requires Fusion file system. | No |  |
| `--fusion-metrics-collection` | Send Fusion metrics to Seqera for this compute environment. Fusion always generates the metrics; this only controls whether they are collected and sent to Seqera. Only valid when Fusion is enabled. If unset, Platform applies its default. | No |  |

### `tw compute-envs add aws-cloud`

Add new AWS Cloud compute environment.

```bash
tw compute-envs add aws-cloud [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--sched-enabled` | Enable the Seqera scheduler for this compute environment. Defaults to false if not specified. | No |  |
| `--provisioning-model` | Instance provisioning model used by the Seqera scheduler. Valid values: SPOT, SPOT_FIRST, ONDEMAND. | No |  |
| `--sched-machine-types` | EC2 instance types for compute nodes managed by the Seqera scheduler. Comma-separated list (e.g., m5.xlarge,c5.2xlarge). Leave empty to let the scheduler select the most cost-effective types. | No |  |
| `--arm64` | Enable ARM64 (Graviton) architecture EC2 instances to run compute jobs. Provides cost-effective compute with comparable performance to x86. | No |  |
| `--boot-disk-size` | EC2 instance boot disk size in GB. Controls the root volume size for compute instances. If absent, Platform defaults to 50 GB gp3 volume. | No |  |
| `--ebs-encryption` | Encrypt the boot EBS volume of provisioned instances. Defaults to false if not specified. | No |  |
| `--ebs-kms-key` | KMS key ARN used to encrypt the boot EBS volume. Only applied when EBS encryption is enabled (--ebs-encryption). When omitted, the account/region default EBS encryption key is used. | No |  |
| `--secrets-kms-key` | Customer-managed KMS key used to encrypt the temporary Secrets Manager secrets created for runs that use pipeline secrets. Accepts a key ARN or a key id. When omitted, the AWS-managed default Secrets Manager key is used. | No |  |
| `--ec2-key-pair` | EC2 key pair name for SSH access to running instances. The key pair must already exist in the specified region. | No |  |
| `--image-id` | AMI ID for launching EC2 instances. If omitted, Seqera-maintained default AMI is used. Use Seqera AMIs for best performance. | No |  |
| `--instance-profile-arn` | IAM instance profile ARN used by EC2 instances to assume roles. If unspecified, Seqera provisions an ARN with sufficient permissions. | No |  |
| `--instance-type` | EC2 instance type (e.g., t3.medium, m5.large). If omitted, a default instance type is used. | No |  |
| `--security-groups` | Security group IDs for network access control. Comma-separated list defining firewall rules for EC2 instances. | No |  |
| `--subnet-id` | DEPRECATED - Use '--subnet-ids' instead. VPC subnet ID for instance placement. Determines network isolation and internet access configuration. | No |  |
| `--subnet-ids` | VPC subnet IDs for instance placement. Comma-separated list; the first subnet is used for basic placement while Intelligent Compute may use all of them. Mutually exclusive with --subnet-id. | No |  |
| `--vpc-id` | VPC ID used to scope subnet and security-group selection. Determines the network in which EC2 instances are launched. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored. Must be an S3 bucket path (e.g., s3://your-bucket/work). Credentials must have read-write access. | Yes |  |
| `-r`, `--region` | AWS region where EC2 instances will be launched (e.g., us-east-1, eu-west-1). | Yes |  |
| `--allow-buckets` | S3 buckets that the compute environment can access. Comma-separated list of S3 bucket names or paths to grant read-write permissions for workflow data. | No |  |
| `--fusion-metrics-collection` | Send Fusion metrics to Seqera for this compute environment. Fusion always generates the metrics; this only controls whether they are collected and sent to Seqera. Only valid when Fusion is enabled. If unset, Platform applies its default. | No |  |

Use `--secrets-kms-key` to encrypt the temporary AWS Secrets Manager secrets that Platform creates for runs that use pipeline secrets with a customer-managed KMS key. Pass a key ARN or a key ID. When omitted, Platform uses the AWS-managed default key. The instance profile role needs `kms:Decrypt` on the key. See [Advanced options][aws-cloud-advanced-options] for the field description and the required policy statement.

### `tw compute-envs add eks`

Add new Amazon EKS compute environment.

```bash
tw compute-envs add eks [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--storage-mount` | Mount path for the PersistentVolumeClaim. Directory where the storage is mounted in containers. If absent, Platform defaults to /scratch. | No |  |
| `--compute-account` | Kubernetes service account for Nextflow-submitted pipeline jobs. Controls permissions for individual task pods. If absent, Platform defaults to default. | No |  |
| `--pod-cleanup` | Pod cleanup policy after job completion. ON_SUCCESS removes pods only on success. ALWAYS removes all pods. NEVER keeps all pods. | No |  |
| `--head-pod-spec` | Custom PodSpec YAML for the Nextflow head job pod. Provide path to YAML file with custom pod configuration. | No |  |
| `--service-pod-spec` | Custom PodSpec YAML for the compute environment service pod. Provide path to YAML file with custom pod configuration. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored on the shared storage. | Yes |  |
| `-r`, `--region` | AWS region where the EKS cluster is deployed (e.g., us-east-1, eu-west-1). | Yes |  |
| `--cluster-name` | Name of the AWS EKS (Elastic Kubernetes Service) cluster for workflow execution. | Yes |  |
| `--namespace` | Kubernetes namespace for workflow execution. Isolates resources within the cluster. | Yes |  |
| `--head-account` | Kubernetes service account for connecting to the cluster. Used by the Nextflow head job to authenticate with the Kubernetes API. | Yes |  |
| `--storage-claim` | PersistentVolumeClaim name for scratch storage. Must support ReadWriteMany access mode for shared workflow data. | No |  |

### `tw compute-envs add slurm`

Add new Slurm compute environment.

```bash
tw compute-envs add slurm [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--max-queue-size` | Maximum number of jobs Nextflow can submit simultaneously to the Slurm queue. Controls job submission rate. If absent, Platform defaults to 100. | No |  |
| `--head-job-options` | Additional submit options for the Nextflow head job. Appended to the sbatch command for the main orchestration process. | No |  |
| `--work-dir` | Nextflow work directory on the cluster's shared file system. Must be an absolute path accessible from all compute nodes. | Yes |  |
| `-u`, `--user-name` | Username for SSH connection to the HPC cluster. Used to authenticate and launch pipeline execution on the head node. | No |  |
| `-H`, `--host-name` | Hostname or IP address of the HPC head node for SSH connection. Typically the cluster login node. Must be a fully qualified hostname, not a local IP address. | No |  |
| `-p`, `--port` | SSH port for cluster connection. If absent, Platform defaults to port 22. | No |  |
| `-q`, `--head-queue` | Slurm queue for launching the Nextflow head job. The queue where the main workflow orchestration process runs. | Yes |  |
| `--compute-queue` | Slurm queue for pipeline task submission. Nextflow submits individual jobs to this queue. Can be overridden in pipeline configuration. | No |  |
| `--launch-dir` | Directory where Nextflow executes. Must be an absolute path with read-write permissions (if absent, Platform defaults to the pipeline work directory). | No |  |

### `tw compute-envs add lsf`

Add new IBM LSF compute environment.

```bash
tw compute-envs add lsf [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--max-queue-size` | Maximum number of jobs Nextflow can submit simultaneously to the LSF queue. Controls job submission rate. If absent, Platform defaults to 100. | No |  |
| `--head-job-options` | Additional submit options for the Nextflow head job. Appended to the bsub command for the main orchestration process. | No |  |
| `--unit-for-limits` | Memory limit unit for LSF cluster. Must match LSF_UNIT_FOR_LIMITS in lsf.conf configuration file. | No |  |
| `--per-job-mem-limit` | Memory limit interpretation: per-job or per-process. Must match LSB_JOB_MEMLIMIT in lsf.conf configuration file. | No |  |
| `--per-task-reserve` | Memory reservation mode: per-task or per-host. Must match RESOURCE_RESERVE_PER_TASK in lsf.conf configuration file. | No |  |
| `--work-dir` | Nextflow work directory on the cluster's shared file system. Must be an absolute path accessible from all compute nodes. | Yes |  |
| `-u`, `--user-name` | Username for SSH connection to the HPC cluster. Used to authenticate and launch pipeline execution on the head node. | No |  |
| `-H`, `--host-name` | Hostname or IP address of the HPC head node for SSH connection. Typically the cluster login node. Must be a fully qualified hostname, not a local IP address. | No |  |
| `-p`, `--port` | SSH port for cluster connection. If absent, Platform defaults to port 22. | No |  |
| `-q`, `--head-queue` | LSF queue for launching the Nextflow head job. The queue where the main workflow orchestration process runs. | Yes |  |
| `--compute-queue` | LSF queue for pipeline task submission. Nextflow submits individual jobs to this queue. Can be overridden in pipeline configuration. | No |  |
| `--launch-dir` | Directory where Nextflow executes. Must be an absolute path with read-write permissions (if absent, Platform defaults to the pipeline work directory). | No |  |

### `tw compute-envs add uge`

Add new UNIVA grid engine compute environment.

```bash
tw compute-envs add uge [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--max-queue-size` | Maximum number of jobs Nextflow can submit simultaneously to the Univa Grid Engine queue. Controls job submission rate. If absent, Platform defaults to 100. | No |  |
| `--head-job-options` | Additional submit options for the Nextflow head job. Appended to the submit command for the main orchestration process. | No |  |
| `--work-dir` | Nextflow work directory on the cluster's shared file system. Must be an absolute path accessible from all compute nodes. | Yes |  |
| `-u`, `--user-name` | Username for SSH connection to the HPC cluster. Used to authenticate and launch pipeline execution on the head node. | No |  |
| `-H`, `--host-name` | Hostname or IP address of the HPC head node for SSH connection. Typically the cluster login node. Must be a fully qualified hostname, not a local IP address. | No |  |
| `-p`, `--port` | SSH port for cluster connection. If absent, Platform defaults to port 22. | No |  |
| `-q`, `--head-queue` | Univa Grid Engine queue for launching the Nextflow head job. The queue where the main workflow orchestration process runs. | Yes |  |
| `--compute-queue` | Univa Grid Engine queue for pipeline task submission. Nextflow submits individual jobs to this queue. Can be overridden in pipeline configuration. | No |  |
| `--launch-dir` | Directory where Nextflow executes. Must be an absolute path with read-write permissions (if absent, Platform defaults to the pipeline work directory). | No |  |

### `tw compute-envs add altair`

Add new Altair PBS Pro compute environment.

```bash
tw compute-envs add altair [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--max-queue-size` | Maximum number of jobs Nextflow can submit simultaneously to the Altair PBS queue. Controls job submission rate. If absent, Platform defaults to 100. | No |  |
| `--head-job-options` | Additional submit options for the Nextflow head job. Appended to the submit command for the main orchestration process. | No |  |
| `--work-dir` | Nextflow work directory on the cluster's shared file system. Must be an absolute path accessible from all compute nodes. | Yes |  |
| `-u`, `--user-name` | Username for SSH connection to the HPC cluster. Used to authenticate and launch pipeline execution on the head node. | No |  |
| `-H`, `--host-name` | Hostname or IP address of the HPC head node for SSH connection. Typically the cluster login node. Must be a fully qualified hostname, not a local IP address. | No |  |
| `-p`, `--port` | SSH port for cluster connection. If absent, Platform defaults to port 22. | No |  |
| `-q`, `--head-queue` | Altair PBS queue for launching the Nextflow head job. The queue where the main workflow orchestration process runs. | Yes |  |
| `--compute-queue` | Altair PBS queue for pipeline task submission. Nextflow submits individual jobs to this queue. Can be overridden in pipeline configuration. | No |  |
| `--launch-dir` | Directory where Nextflow executes. Must be an absolute path with read-write permissions (if absent, Platform defaults to the pipeline work directory). | No |  |

### `tw compute-envs add moab`

Add new MOAB compute environment.

```bash
tw compute-envs add moab [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--max-queue-size` | Maximum number of jobs Nextflow can submit simultaneously to the Moab queue. Controls job submission rate. If absent, Platform defaults to 100. | No |  |
| `--head-job-options` | Additional submit options for the Nextflow head job. Appended to the submit command for the main orchestration process. | No |  |
| `--work-dir` | Nextflow work directory on the cluster's shared file system. Must be an absolute path accessible from all compute nodes. | Yes |  |
| `-u`, `--user-name` | Username for SSH connection to the HPC cluster. Used to authenticate and launch pipeline execution on the head node. | No |  |
| `-H`, `--host-name` | Hostname or IP address of the HPC head node for SSH connection. Typically the cluster login node. Must be a fully qualified hostname, not a local IP address. | No |  |
| `-p`, `--port` | SSH port for cluster connection. If absent, Platform defaults to port 22. | No |  |
| `-q`, `--head-queue` | Moab queue for launching the Nextflow head job. The queue where the main workflow orchestration process runs. | Yes |  |
| `--compute-queue` | Moab queue for pipeline task submission. Nextflow submits individual jobs to this queue. Can be overridden in pipeline configuration. | No |  |
| `--launch-dir` | Directory where Nextflow executes. Must be an absolute path with read-write permissions (if absent, Platform defaults to the pipeline work directory). | No |  |

### `tw compute-envs add gke`

Add new Google GKE compute environment.

```bash
tw compute-envs add gke [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--storage-mount` | Mount path for the PersistentVolumeClaim. Directory where the storage is mounted in containers. If absent, Platform defaults to /scratch. | No |  |
| `--compute-account` | Kubernetes service account for Nextflow-submitted pipeline jobs. Controls permissions for individual task pods. If absent, Platform defaults to default. | No |  |
| `--pod-cleanup` | Pod cleanup policy after job completion. ON_SUCCESS removes pods only on success. ALWAYS removes all pods. NEVER keeps all pods. | No |  |
| `--head-pod-spec` | Custom PodSpec YAML for the Nextflow head job pod. Provide path to YAML file with custom pod configuration. | No |  |
| `--service-pod-spec` | Custom PodSpec YAML for the compute environment service pod. Provide path to YAML file with custom pod configuration. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored on the shared storage. | Yes |  |
| `-r`, `--region` | Google Cloud region or zone where the GKE cluster is deployed (e.g., us-central1, europe-west1). | Yes |  |
| `--cluster-name` | Name of the Google GKE (Google Kubernetes Engine) cluster for workflow execution. | Yes |  |
| `--namespace` | Kubernetes namespace for workflow execution. Isolates resources within the cluster. | Yes |  |
| `--head-account` | Kubernetes service account for connecting to the cluster. Used by the Nextflow head job to authenticate with the Kubernetes API. | Yes |  |
| `--storage-claim` | PersistentVolumeClaim name for scratch storage. Must support ReadWriteMany access mode for shared workflow data. | No |  |

### `tw compute-envs add google-batch`

Add new Google Batch compute environment.

```bash
tw compute-envs add google-batch [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--network` | Google Cloud VPC network name or URI. Required when using network tags or subnets. | No |  |
| `--subnetwork` | Google Cloud VPC subnetwork name or URI. Must be in the same region as the compute environment location. | No |  |
| `--network-tags` | Comma-separated list of network tags applied to VMs for firewall rule targeting. Tags must be lowercase, use only letters, numbers, and hyphens (1-63 chars). Requires --network. | No |  |
| `--use-private-address` | Do not attach a public IP address to VM instances. When enabled, only Google internal services are accessible. Requires Cloud NAT for external access. | No |  |
| `--boot-disk-size` | Boot disk size in GB. Controls the root volume size for compute instances. If absent, Platform defaults to 50 GB. | No |  |
| `--boot-disk-image` | Custom boot disk image for compute job VMs. Accepts: projects/&#123;PROJECT&#125;/global/images/&#123;IMAGE&#125;, projects/&#123;PROJECT&#125;/global/images/family/&#123;FAMILY&#125;, or a Batch image name (e.g., batch-debian). | No |  |
| `--head-job-cpus` | Number of CPUs allocated to the Nextflow head job. Controls the compute resources for the main workflow orchestration process. | No |  |
| `--head-job-memory` | Memory allocation for the Nextflow head job in megabytes. Value must be a multiple of 256 MiB and from 0.5 GB to 8 GB per CPU. | No |  |
| `--service-account-email` | Google Cloud service account email for pipeline execution. Grants fine-grained IAM permissions to Nextflow jobs. | No |  |
| `--head-job-machine-type` | GCP machine type for the Nextflow head job (e.g., n2-standard-4). Mutually exclusive with --head-job-template. | No |  |
| `--head-job-template` | Google Compute Engine instance template for the Nextflow head job. Specify either the template name (if in the same project) or the fully qualified reference (projects/PROJECT_ID/global/instanceTemplates/TEMPLATE_NAME). Mutually exclusive with --head-job-machine-type. | No |  |
| `--compute-jobs-machine-type` | Comma-separated list of GCP machine types for compute jobs (e.g., n2-standard-8,c2-standard-4). Supports wildcard families (e.g., n2-*). Mutually exclusive with --compute-job-template. | No |  |
| `--compute-job-template` | Google Compute Engine instance template for pipeline compute jobs. Specify either the template name (if in the same project) or the fully qualified reference (projects/PROJECT_ID/global/instanceTemplates/TEMPLATE_NAME). Mutually exclusive with --compute-jobs-machine-type. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored. Must be a Google Cloud Storage bucket path (e.g., gs://your-bucket/work). | Yes |  |
| `-l`, `--location` | Google Cloud region where job executions are deployed to Google Batch API (e.g., us-central1, europe-west1). | Yes |  |
| `--spot` | Use Spot virtual machines. Enables cost-effective preemptible instances for compute workloads. Spot VMs may be interrupted when capacity is needed. | No |  |
| `--fusion-v2` | Enable Fusion file system. Provides native access to Google Cloud Storage with low-latency I/O. Requires Wave containers. | No |  |
| `--fusion-snapshots` | Enable Fusion Snapshots (beta). Allows Fusion to restore jobs interrupted by Spot VM reclamation. Requires Fusion v2. | No |  |
| `--wave` | Enable Wave containers. Allows access to private container repositories and on-demand container provisioning. | No |  |
| `--fusion-metrics-collection` | Send Fusion metrics to Seqera for this compute environment. Fusion always generates the metrics; this only controls whether they are collected and sent to Seqera. Only valid when Fusion is enabled. If unset, Platform applies its default. | No |  |

### `tw compute-envs add google-cloud`

Add new Google Cloud compute environment.

```bash
tw compute-envs add google-cloud [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--sched-enabled` | Enable the Seqera scheduler for this compute environment. Defaults to false if not specified. | No |  |
| `--provisioning-model` | Instance provisioning model used by the Seqera scheduler. Valid values: SPOT, SPOT_FIRST, ONDEMAND. | No |  |
| `--sched-machine-types` | Compute Engine machine types for compute nodes managed by the Seqera scheduler. Comma-separated list (e.g., n2-standard-4,c2-standard-8). Leave empty to let the scheduler select the most cost-effective types. | No |  |
| `--arm64` | Enable ARM64 (Axion) architecture instances to run compute jobs. Provides efficient compute for compatible workloads. | No |  |
| `--boot-disk-size` | Boot disk size in GB for Compute Engine instances. Uses pd-standard disk type. If absent, Platform defaults to 50 GB. | No |  |
| `--gpu` | Enable GPU-enabled instances for compute jobs. When enabled, Deep Learning VM base images with CUDA are automatically selected. | No |  |
| `--image-id` | Image ID defining the operating system and pre-installed software for Compute Engine instances. Supports Ubuntu LTS Google public images. For GPU instances, Deep Learning VM base images with CUDA are automatically selected. | No |  |
| `--instance-type` | Compute Engine machine type (e.g., n1-standard-1, n2-standard-2). If omitted, a default machine type is used. | No |  |
| `--network` | Google Cloud VPC network name or URI. Required when using subnetworks or network tags. When omitted, the project's 'default' network is used. | No |  |
| `--subnetworks` | Google Cloud VPC subnetworks for instance placement. Comma-separated list of names or URIs in the same region as the compute environment; the first is used for basic placement while Intelligent Compute may use all of them. Requires --network. | No |  |
| `--network-tags` | Comma-separated list of network tags applied to VMs for firewall rule targeting. Tags must be lowercase, use only letters, numbers, and hyphens (1-63 chars). Requires --network. | No |  |
| `--use-private-address` | Do not attach a public IP address to VM instances. When enabled, only Google internal services are accessible. Requires Cloud NAT for external access. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored. Must be a Google Cloud Storage bucket path (e.g., gs://your-bucket/work). Credentials must have read-write access. | Yes |  |
| `-r`, `--region` | Google Cloud region where compute instances will be launched (e.g., us-central1, europe-west1). | Yes |  |
| `-z`, `--zone` | Google Cloud zone within the region (e.g., us-central1-a). If omitted, defaults to the first zone alphabetically in the region. | Yes |  |
| `--fusion-metrics-collection` | Send Fusion metrics to Seqera for this compute environment. Fusion always generates the metrics; this only controls whether they are collected and sent to Seqera. Only valid when Fusion is enabled. If unset, Platform applies its default. | No |  |

Use the networking options to place VMs in an existing VPC instead of the project's default network:

```bash
tw compute-envs add google-cloud --name=my_gcp_ce \
--credentials=<my_gcp_creds> --region=europe-west2 --zone=europe-west2-a \
--work-dir=gs://<bucket name> \
--network=my-vpc --subnetworks=my-subnet-a,my-subnet-b \
--network-tags=allow-ssh --use-private-address
```

- `--subnetworks` and `--network-tags` require `--network`. The CLI rejects the command before contacting Platform if `--network` is missing or a tag is not lowercase letters, numbers, and hyphens.
- Subnetworks must be in the compute environment region. VMs are placed in the first listed subnetwork, and Intelligent Compute may use all of them.
- With `--use-private-address`, VMs have no public IP address, so the VPC must provide outbound access through Cloud NAT and Private Google Access.

See [Advanced options][google-cloud-advanced-options] for the equivalent fields in the Platform UI.

### `tw compute-envs add azure-batch`

Add new Azure Batch compute environments.

```bash
tw compute-envs add azure-batch
```

#### `tw compute-envs add azure-batch forge`

Add new Azure Batch compute environment with automatic provisioning of compute resources.

```bash
tw compute-envs add azure-batch forge [OPTIONS]
```

##### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--head-vm-type` | Azure VM size for the head pool (dual pool mode). If absent, defaults to Standard_D2s_v3. | No |  |
| `--head-vm-count` | Number of VMs in the head pool (dual pool mode). If absent, defaults to 1. | No |  |
| `--head-no-auto-scale` | Disable autoscaling for the head pool (dual pool mode). | No |  |
| `--head-boot-disk-size` | Boot disk size in GB for the head pool nodes (dual pool mode). Overrides --boot-disk-size for this pool. | No |  |
| `--worker-vm-type` | Azure VM size for the worker pool (dual pool mode). If absent, defaults to Standard_D4s_v3. | No |  |
| `--worker-vm-count` | Max number of VMs in the worker pool (dual pool mode). | No |  |
| `--worker-no-auto-scale` | Disable autoscaling for the worker pool (dual pool mode). | No |  |
| `--worker-boot-disk-size` | Boot disk size in GB for the worker pool nodes (dual pool mode). Overrides --boot-disk-size for this pool. | No |  |
| `--managed-identity-head-client-id` | Head job managed identity client ID (UUID). The user-assigned managed identity used by the Nextflow launcher (head job). | No |  |
| `--managed-identity-pool-client-id` | Compute job managed identity client ID (UUID). The user-assigned managed identity used by compute tasks running on Batch pool nodes. | No |  |
| `--managed-identity-head-resource-id` | Head job managed identity resource ID. Full Azure resource ID of the user-assigned managed identity for the head job. Required in Forge mode when head job managed identity client ID is specified. Format: /subscriptions/&#123;sub&#125;/resourceGroups/&#123;rg&#125;/providers/Microsoft.ManagedIdentity/userAssignedIdentities/&#123;name&#125; | No |  |
| `--managed-identity-pool-resource-id` | Compute job managed identity resource ID. Full Azure resource ID of the user-assigned managed identity for compute jobs. Required in Forge mode when compute job managed identity client ID is specified. Format: /subscriptions/&#123;sub&#125;/resourceGroups/&#123;rg&#125;/providers/Microsoft.ManagedIdentity/userAssignedIdentities/&#123;name&#125; | No |  |
| `--delete-jobs-on-completion` | Delete Azure Batch jobs when the workflow completes successfully. Failed jobs are always preserved. Default: false. | No |  |
| `--delete-tasks-on-completion` | Delete individual Azure Batch tasks when they complete successfully. Failed tasks are preserved. Default: true. | No |  |
| `--terminate-jobs-on-completion` | Terminate Azure Batch jobs when all tasks complete. Default: true. | No |  |
| `--token-duration` | Duration of the SAS (shared access signature) token for Azure Blob Storage access. If absent, Platform defaults to 12h. | No |  |
| `--job-max-wall-clock-time` | Maximum elapsed time for an Azure Batch job before automatic termination. Accepts duration syntax (e.g., '7d', '1d12h', '168h'). Defaults to 7d. Maximum: 180 days. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored. Must be an Azure Blob Storage path. | Yes |  |
| `-l`, `--location` | Azure region where compute resources will be deployed (e.g., eastus, westeurope). | Yes |  |
| `--dual-pool` | Enable dual pool mode with separate head and worker pools. Head pool runs the Nextflow launcher on a small VM; worker pool scales independently for pipeline tasks. | No |  |
| `--vm-type` | Azure VM size for compute pool (single pool mode). Must be a valid Azure Batch VM type. If absent, Platform defaults to Standard_D4_v3. | No |  |
| `--vm-count` | Number of VMs in the Batch pool (single pool mode). With autoscaling enabled, this is the maximum capacity. Pool scales to zero when unused. | No |  |
| `--no-auto-scale` | Disable pool autoscaling (single pool mode). When disabled, pool maintains fixed VM count and does not scale based on workload. | No |  |
| `--boot-disk-size` | Boot disk size in GB for pool nodes. Applies to all pools. In dual pool mode, per-pool values (--head-boot-disk-size, --worker-boot-disk-size) take precedence. If absent, Azure's default is used. | No |  |
| `--preserve-resources` | Preserve Azure Batch pool resources on deletion. Keeps the compute pool and related resources when the compute environment is deleted from Seqera Platform. | No |  |
| `--registry-credentials` | Container registry credentials for private registries. Comma-separated list of credential names to access private Docker registries. | No |  |
| `--fusion-v2` | Enable Fusion file system. Provides native access to Azure Blob Storage with low-latency I/O. Requires Wave containers. | No |  |
| `--wave` | Enable Wave containers. Allows access to private container repositories and on-demand container provisioning. | No |  |
| `--subnet-id` | Azure VNet subnet resource ID for private network isolation. Requires Entra (service principal) credentials. Format: /subscriptions/&#123;sub&#125;/resourceGroups/&#123;rg&#125;/providers/Microsoft.Network/virtualNetworks/&#123;vnet&#125;/subnets/&#123;subnet&#125; | No |  |
| `--fusion-metrics-collection` | Send Fusion metrics to Seqera for this compute environment. Fusion always generates the metrics; this only controls whether they are collected and sent to Seqera. Only valid when Fusion is enabled. If unset, Platform applies its default. | No |  |

#### `tw compute-envs add azure-batch manual`

Add new Azure Batch compute environment using an existing environment.

```bash
tw compute-envs add azure-batch manual [OPTIONS]
```

##### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--managed-identity-head-client-id` | Head job managed identity client ID (UUID). The user-assigned managed identity used by the Nextflow launcher (head job). | No |  |
| `--managed-identity-pool-client-id` | Compute job managed identity client ID (UUID). The user-assigned managed identity used by compute tasks running on Batch pool nodes. | No |  |
| `--delete-jobs-on-completion` | Delete Azure Batch jobs when the workflow completes successfully. Failed jobs are always preserved. Default: false. | No |  |
| `--delete-tasks-on-completion` | Delete individual Azure Batch tasks when they complete successfully. Failed tasks are preserved. Default: true. | No |  |
| `--terminate-jobs-on-completion` | Terminate Azure Batch jobs when all tasks complete. Default: true. | No |  |
| `--token-duration` | Duration of the SAS (shared access signature) token for Azure Blob Storage access. If absent, Platform defaults to 12h. | No |  |
| `--job-max-wall-clock-time` | Maximum elapsed time for an Azure Batch job before automatic termination. Accepts duration syntax (e.g., '7d', '1d12h', '168h'). Defaults to 7d. Maximum: 180 days. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored. Must be an Azure Blob Storage path. | Yes |  |
| `-l`, `--location` | Azure region where compute resources will be deployed (e.g., eastus, westeurope). | Yes |  |
| `--compute-pool-name` | Pre-configured Azure Batch pool for the Nextflow head job. When used with --worker-pool, this pool handles only the launcher. Must include azcopy command-line tool. | Yes |  |
| `--worker-pool` | Pre-configured Azure Batch pool for pipeline worker tasks. When specified, the head job runs on --compute-pool-name and worker tasks run on this pool. Must be different from the head pool. | No |  |
| `--fusion-v2` | Enable Fusion file system. Provides native access to Azure Blob Storage with low-latency I/O. Requires Wave containers. | No |  |
| `--wave` | Enable Wave containers. Allows access to private container repositories and on-demand container provisioning. | No |  |
| `--subnet-id` | Azure VNet subnet resource ID for private network isolation. Requires Entra (service principal) credentials. Format: /subscriptions/&#123;sub&#125;/resourceGroups/&#123;rg&#125;/providers/Microsoft.Network/virtualNetworks/&#123;vnet&#125;/subnets/&#123;subnet&#125; | No |  |
| `--fusion-metrics-collection` | Send Fusion metrics to Seqera for this compute environment. Fusion always generates the metrics; this only controls whether they are collected and sent to Seqera. Only valid when Fusion is enabled. If unset, Platform applies its default. | No |  |

### `tw compute-envs add azure-cloud`

Add new Azure Cloud compute environment.

```bash
tw compute-envs add azure-cloud [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--sched-enabled` | Enable the Seqera scheduler for this compute environment. Defaults to false if not specified. | No |  |
| `--provisioning-model` | Instance provisioning model used by the Seqera scheduler. Valid values: SPOT, SPOT_FIRST, ONDEMAND. | No |  |
| `--sched-machine-types` | Azure VM sizes for compute nodes managed by the Seqera scheduler. Comma-separated list (e.g., Standard_D4s_v3,Standard_E4s_v3). Leave empty to let the scheduler select the most cost-effective sizes. | No |  |
| `--data-collection-endpoint` | Azure Monitor data collection endpoint URL for log ingestion. Used to route logs to Log Analytics workspace. | No |  |
| `--data-collection-rule-id` | Azure Monitor data collection rule ID. Defines how logs are processed and routed to destination workspaces. | No |  |
| `--instance-type` | Azure virtual machine size (e.g., Standard_D2s_v3, Standard_E4s_v3). If omitted, a default VM size is used. | No |  |
| `--log-table-name` | Custom table name in Log Analytics workspace for storing compute environment logs. Enables organized log management. | No |  |
| `--log-workspace-id` | Azure Log Analytics workspace ID for monitoring compute environment activity and logs. | No |  |
| `--managed-identity-client-id` | User-assigned managed identity client ID for authentication. Used with managed identity resource ID for VM access control. | No |  |
| `--managed-identity-id` | User-assigned managed identity resource ID. Provides VMs with Azure resource access without storing credentials. | No |  |
| `--network-id` | Azure virtual network resource ID. Defines the network where VMs will be deployed for network isolation and connectivity. | No |  |
| `--subnets` | Subnet names within the virtual network for VM placement. Comma-separated list scoping where VMs are launched inside the network specified by --network-id. | No |  |
| `--subscription-id` | Azure subscription ID where resources will be created. Used to specify the billing and access control boundary. | No |  |
| `--work-dir` | Nextflow work directory. Path where workflow intermediate files are stored. Must be an Azure Blob Storage path (e.g., az://your-container/work). Credentials must have read-write access. | Yes |  |
| `-r`, `--region` | Azure region where virtual machines will be deployed (e.g., eastus, westeurope). | Yes |  |
| `--resource-group` | Azure resource group for organizing and managing virtual machines. The resource group must already exist in the subscription. | Yes |  |
| `--fusion-metrics-collection` | Send Fusion metrics to Seqera for this compute environment. Fusion always generates the metrics; this only controls whether they are collected and sent to Seqera. Only valid when Fusion is enabled. If unset, Platform applies its default. | No |  |

### `tw compute-envs add seqera-compute`

Add new Seqera Compute environment.

```bash
tw compute-envs add seqera-compute [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--pre-run` | Pre-run script. | No |  |
| `--post-run` | Post-run script. | No |  |
| `--nextflow-config` | Nextflow config | No |  |
| `-e`, `--env` | Add environment variables. By default are only added to the Nextflow head job process, if you want to add them to the process task prefix the name with 'compute:' or 'both:' if you want to make it available to both locations. | No |  |
| `--work-dir` | Work directory suffix relative to the S3 bucket that will be created by Seqera Compute. | No |  |
| `-r`, `--region` | AWS region. | Yes |  |
| `--instance-type-size` | Studios instance size, controlling compute resources and capabilities. Options: SMALL, MEDIUM, LARGE. Free-tier organizations are limited to SMALL. | No |  |

## `tw compute-envs update`

Update a compute environment.

```bash
tw compute-envs update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Compute environment unique identifier. | Yes |  |
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--new-name` | New compute environment name. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |

## `tw compute-envs delete`

Delete a compute environment.

```bash
tw compute-envs delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Compute environment unique identifier. | Yes |  |
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--wait` | Wait until the compute environment is fully deleted. | No |  |

Command:

Command:

```bash
tw compute-envs delete --name=my_aws_ce
```

Example output:

```bash
Compute environment '1sxCxvxfx8xnxdxGxQxqxH' deleted at user workspace
```

## `tw compute-envs view`

View compute environment details.

```bash
tw compute-envs view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Compute environment unique identifier. | Yes |  |
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

## `tw compute-envs list`

List compute environments.

```bash
tw compute-envs list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

## `tw compute-envs export`

Export compute environment configuration as a JSON file.

```bash
tw compute-envs export [OPTIONS] [FILENAME]
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `FILENAME` | File name and path for the exported compute environment configuration. | No |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Compute environment unique identifier. | Yes |  |
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

Export a compute environment configuration as JSON for scripting and reproducibility.

Command:

```bash
tw compute-envs export --name=my_aws_ce my_aws_ce_v1.json
```

Example output:

```console
Compute environment exported into 'my_aws_ce_v1.json'
```

## `tw compute-envs import`

Import a compute environment configuration from a JSON file.

```bash
tw compute-envs import [OPTIONS] <FILENAME>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `FILENAME` | File path containing the compute environment configuration. | Yes |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-c`, `--credentials` | Credentials identifier [default: workspace credentials]. | No |  |
| `--wait` | Wait until given status or fail. Valid options: CREATING, AVAILABLE, DISABLED, DELETING, ERRORED, INVALID, DELETED. | No |  |
| `-d`, `--description` | Compute environment description. | No |  |
| `--labels` | Comma-separated list of labels. | No |  |
| `--overwrite` | Overwrite the compute environment if it already exists. | No | `false` |

Import a compute environment into a workspace from a previously exported JSON file.

Command:

```bash
tw compute-envs import --name=my_aws_ce_v1 ./my_aws_ce_v1.json
```

Example output:

```console
New AWS-BATCH compute environment 'my_aws_ce_v1' added at user workspace
```

## `tw compute-envs primary`

Manage the primary compute environment.

```bash
tw compute-envs primary
```

### `tw compute-envs primary get`

Get the primary compute environment.

```bash
tw compute-envs primary get [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

### `tw compute-envs primary set`

Set a compute environment as primary.

```bash
tw compute-envs primary set [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Compute environment unique identifier. | Yes |  |
| `-n`, `--name` | Compute environment name. | Yes |  |

Select a **primary** compute environment to use by default in a workspace. You can override the workspace primary compute environment when you create or launch a pipeline.

Command:

```bash
tw compute-envs primary set --name=my_aws_ce
```

Example output:

```console
Primary compute environment for workspace 'user' was set to 'my_aws_ce (1sxCxvxfx8xnxdxGxQxqxH)'
```

## `tw compute-envs validate`

Validate a compute environment by re-running its pre-flight checks (credential and work-directory).

```bash
tw compute-envs validate [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Compute environment unique identifier. | Yes |  |
| `-n`, `--name` | Compute environment name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--force` | Skip the pre-flight checks and force an INVALID compute environment (with an AVAILABLE credential) to AVAILABLE. Rejected otherwise. | No |  |

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

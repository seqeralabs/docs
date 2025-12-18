---
title: "AWS Batch Test"
description: "Instructions to set up AWS Batch in Seqera Platform"
date created: "2023-04-21"
last updated: "2025-12-18"
tags: [aws, batch, compute environment]
---

# AWS Batch compute environments

AWS Batch compute environments allow you to run Nextflow pipelines on AWS infrastructure. Seqera can either manage AWS Batch resources automatically (Batch Forge) or connect to resources you've already created (Manual configuration).

This page covers the configuration options, requirements, and constraints for AWS Batch compute environments in Seqera Platform.

:::tip
This guide assumes you have an existing AWS account. The AWS Batch service quota for job queues is 50 per account. See [AWS Batch service quotas](https://docs.aws.amazon.com/batch/latest/userguide/service_limits.html) for more information.
:::

---

## Configuration modes

Seqera supports two configuration modes for AWS Batch compute environments. Your choice affects which permissions are required, what options are available, and how resources are managed.

### Batch Forge (automatic)

Batch Forge lets Seqera create and manage AWS Batch resources in your account. When you create a compute environment with Batch Forge, Seqera creates:

- Head and compute job queues
- Compute environments for job execution
- IAM roles for Nextflow execution (optional)
- CloudWatch log groups
- EFS or FSx file systems (if configured)

Resources created by Batch Forge use the `TowerForge-*` naming prefix. This prefix is hardcoded for Platform Cloud and cannot be customized.

When you delete a Batch Forge compute environment, Seqera deletes all associated AWS resources unless you disable **Dispose resources** in the advanced options.

Job queues created by Batch Forge include [job state limit actions](https://docs.aws.amazon.com/batch/latest/APIReference/API_JobStateTimeLimitAction.html) to automatically purge jobs that cannot be scheduled on available instance types.

### Manual configuration

Manual configuration connects Seqera to AWS Batch resources you've already created. Use this mode when you have existing infrastructure, need custom configurations not supported by Batch Forge, or when organizational policies require pre-provisioned resources.

See [Manual AWS Batch setup](/platform-cloud/enterprise/advanced-topics/manual-aws-batch-setup) for instructions on creating the required AWS Batch queues and compute environments.

---

## Storage options

AWS Batch compute environments require storage for Nextflow intermediate files. You can use S3 buckets, EFS file systems, or FSx for Lustre file systems.

### S3 buckets

S3 is object storage suitable for most pipeline workloads. When you specify an S3 bucket as your work directory, Seqera automatically configures it for the Nextflow [cloud cache](https://www.nextflow.io/docs/latest/cache-and-resume.html#cache-stores). Platform adds a `cloudcache` block to the Nextflow configuration pointing to `s3://<bucket>/cloudcache/.cache`.

S3 buckets are required for:
- Fusion v2 file system
- Fargate head jobs
- Studios and Data Explorer access

To create an S3 bucket:

1. Navigate to the [AWS S3 console](https://console.aws.amazon.com/s3/home).
2. Select the same region where you'll create your compute environment.
3. Select **Create bucket** and enter a unique name.
4. Use default settings and select **Create bucket**.

:::note
Production pipelines can generate substantial intermediate data. Consider setting a retention policy to automatically delete intermediate files after 30 days. See [AWS documentation](https://aws.amazon.com/premiumsupport/knowledge-center/s3-empty-bucket-lifecycle-rule/) for details.
:::

### EFS file systems

EFS (Elastic File System) is shared file storage that can be mounted across multiple compute instances. EFS is compatible with Studios for data access, but has one significant constraint:

:::warning
Using EFS as your **work directory** is incompatible with Studios. This causes errors with checkpoints and mounted data. Use S3 for work directories if you need Studios support.
:::

Batch Forge can create EFS file systems automatically, or you can specify an existing file system. File systems created by Batch Forge are tagged as `Name=TowerForge-<compute-environment-id>`.

EFS requires a security group that allows NFS traffic between resources. Create a security group with:
- Inbound rule: Type `NFS`, Source: the security group itself (self-referencing)
- Outbound rule: Type `All traffic`, Destination: `Anywhere-IPv4`/`Anywhere-IPv6`

To create an EFS file system manually:

1. Navigate to the [EFS console](https://console.aws.amazon.com/efs/home).
2. Select **Create file system**.
3. Select the VPC where your compute environment will run.
4. Use default settings and select **Create file system**.

### FSx for Lustre

FSx for Lustre is high-performance file storage for compute-intensive workloads. Like EFS, Batch Forge can create FSx file systems automatically or connect to existing ones.

FSx requires a security group that allows Lustre traffic:
- Inbound rules: Type `Custom TCP`, Port `988` and Port range `1018-1023`, Source: the security group itself
- Outbound rule: Type `All traffic`, Destination: `Anywhere-IPv4`/`Anywhere-IPv6`

The AMI used by your compute environment must include the [Lustre client](https://docs.aws.amazon.com/fsx/latest/LustreGuide/install-lustre-client.html).

To create an FSx file system manually:

1. Navigate to the [FSx console](https://console.aws.amazon.com/fsx/home).
2. Select **Create file system** and choose **FSx for Lustre**.
3. Configure according to your requirements and create the file system.

---

## Feature options

AWS Batch compute environments support several optional features that enhance performance, enable specific workloads, or integrate with other Seqera products.

### Wave containers

Wave containers facilitate access to private container repositories and enable container provisioning within pipelines. Wave is a prerequisite for Fusion v2 and Graviton support.

See [Wave containers](https://www.nextflow.io/docs/latest/wave.html) for more information.

### Fusion v2 file system

Fusion v2 provides virtual distributed file system access to S3-hosted data, improving performance for most data operations. Fusion v2 requires Wave containers.

When Fusion v2 is enabled without fast instance storage, Seqera applies these EBS optimizations automatically:
- Boot disk size: 100 GB
- Boot disk type: GP3
- Boot disk throughput: 325 MB/s

Benchmarking shows these increased costs are generally offset by reduced run time.

**Fast instance storage**: For best performance, enable fast instance storage with NVMe-based EC2 instances. When enabled, do not select `optimal` instance type families (c4, m4, r4) as these are not NVMe-based. Either specify NVMe instance types explicitly or leave the field empty for Platform to select appropriate instances.

For large production pipelines, Seqera recommends:
- Instance size 8xlarge or above
- Local temp storage of at least 200 GB (400 GB+ for files larger than 100 GB)
- Dedicated networking for guaranteed bandwidth

### Fusion Snapshots (beta)

Fusion Snapshots automatically restore jobs interrupted by AWS Spot instance reclamation. This feature requires Fusion v2.

See [Fusion Snapshots](https://docs.seqera.io/fusion/guide/snapshots) for details.

### Fargate for head job

Fargate runs the Nextflow head job as a serverless container, reducing pipeline launch time from several minutes (EC2 spin-up) to under a minute.

Requirements:
- Fusion v2 file system
- Spot provisioning model
- S3 work directory (not EFS or FSx)

Limitations:
- Not compatible with GPU instances
- Not compatible with custom AMIs
- Maximum 16 vCPUs

EC2 is more suitable when you need GPU support, custom AMIs, or more than 16 vCPUs.

### GPU support

Enable GPU support for pipelines that require GPU-accelerated computation. Seqera supports NVIDIA GPUs only—select instances with NVIDIA GPUs for GPU-dependent processes.

When you enable GPUs and specify a custom AMI, the custom AMI is used instead of the AWS-recommended GPU-optimized AMI.

See [GPU usage](/platform-cloud/compute-envs/overview#aws-batch) for more information.

### Graviton CPU architecture

Graviton executes pipelines on ARM64-based EC2 instances (m6g, r6g, c6g families by default). Third-generation Graviton instances are also supported.

Requirements:
- Fargate enabled
- Wave containers enabled
- Fusion v2 file system enabled

Graviton is not compatible with GPU-based workloads.

---

## Feature compatibility matrix

| Feature | Requires | Incompatible with |
|---------|----------|-------------------|
| Fusion v2 | Wave containers | — |
| Fusion Snapshots | Fusion v2 | — |
| Fargate | Fusion v2, Spot provisioning | EFS/FSx, Custom AMI, GPU |
| Graviton | Fargate, Wave, Fusion v2 | GPU |
| Fast instance storage | Fusion v2, NVMe instances | c4/m4/r4 instance families |
| EFS work directory | — | Studios |

---

## Provisioning models

Compute environments can provision either Spot or On-Demand instances.

### Spot instances

Spot instances cost as little as 20% of On-Demand pricing. When you select Spot provisioning, Seqera creates a dedicated queue for the Nextflow head job using a single On-Demand instance to prevent execution interruptions from Spot reclamation.

**Spot reclamation behavior**: From Nextflow 24.10, the default Spot reclamation retry setting is `0` on AWS. Spot reclamations cause immediate job failure (exit code 1) with no internal retries. Nextflow treats these like any other job failure unless you configure a retry strategy.

See [Spot instance failures and retries](/platform-cloud/troubleshooting_and_faqs/nextflow#spot-instance-failures-and-retries-in-nextflow) for configuration options.

### On-Demand instances

On-Demand instances provide consistent availability without interruption risk, at higher cost.

### Allocation strategies

If not specified, Seqera uses these defaults:
- On-Demand: `BEST_FIT_PROGRESSIVE`
- Spot: `SPOT_PRICE_CAPACITY_OPTIMIZED`

:::caution
Platform CLI (tw) v0.8 and earlier does not support `SPOT_PRICE_CAPACITY_OPTIMIZED`. You cannot use CLI to create or interact with Spot compute environments using this allocation strategy.
:::

---

## IAM configuration

AWS Batch compute environments require IAM permissions for Seqera to create resources, submit jobs, and access logs. Permissions can be attached directly to an IAM user or to an IAM role that the user assumes.

### Required permissions

These permissions are mandatory for compute environment operation:

**Batch management**: Create, update, delete, and describe compute environments and job queues. Can be scoped to resources with the `TowerForge-*` prefix or specific manually-created resources.

**Batch jobs**: Submit, cancel, terminate, describe, and list jobs. Job definition and job resources cannot be restricted to specific names (requires wildcard).

**Launch templates**: Create, delete, and describe EC2 launch templates. AWS does not support restricting these permissions by resource name or tag.

**Pass role**: Allow Seqera to pass execution IAM roles to AWS Batch. Can be scoped to specific roles and the `batch.amazonaws.com` and `ec2.amazonaws.com` services.

**CloudWatch logs**: Read access to display log data in the Platform interface. Can be scoped to specific log groups.

### Optional permissions

These permissions enable specific Platform features:

| Permission set | Enables |
|---------------|---------|
| S3 access | Studios, Data Explorer, work directory dropdown |
| IAM role management | Automatic IAM role creation by Batch Forge |
| SSM parameters | Automatic ECS-optimized AMI identification |
| EC2 describe | VPC/subnet/security group dropdowns in UI |
| FSx management | Automatic FSx file system creation |
| EFS management | Automatic EFS file system creation |
| Secrets Manager | Pipeline secrets synchronization |

### Permissions that cannot be scoped

AWS does not support restricting these actions by resource name or tag:
- EC2 launch template operations
- EC2 Describe operations
- FSx DescribeFileSystems
- EFS DescribeFileSystems, DescribeMountTargets
- Secrets Manager ListSecrets
- S3 ListAllMyBuckets

### IAM user setup

1. Open the [AWS IAM console](https://console.aws.amazon.com/iam).
2. Select **Users** > **Create User**.
3. Enter a name (e.g., `seqera`) and select **Next**.
4. Select **Attach policies directly** and attach your policy.
5. Complete user creation.

To obtain credentials:
1. Select the user and go to **Security credentials**.
2. Under **Access keys**, select **Create access key**.
3. Select **Command line interface (CLI)** and acknowledge the confirmation.
4. Save the Access key and Secret access key securely.

### IAM role assumption (optional)

For environments where multiple users access the same AWS account, create an IAM role with the required permissions and allow IAM users to assume it.

Create a role with a trust policy specifying the IAM user(s):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["arn:aws:iam::<ACCOUNT_ID>:user/<IAM_USER_NAME>"]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Attach your permissions policy to this role. The IAM user only needs `sts:AssumeRole` permission for the role ARN.

When creating credentials in Seqera, specify the role ARN in the **Assume role** field.

---

## Advanced options

### Instance configuration

**Instance types**: Specify preferred instance types. AWS allocates from up to 20 types based on availability. Leave empty for Platform to select automatically based on your configuration (NVMe instances for fast storage, Graviton for ARM, etc.).

**Min CPUs**: Set greater than 0 to keep instances running between pipeline executions for faster startup. This incurs charges even when pipelines aren't running.

**Max CPUs**: Maximum combined CPUs across all instances that AWS Batch will provision.

**Custom AMI**: Specify an AMI ID to use instead of AWS-recommended ECS-optimized AMIs. Platform supports Amazon Linux 2023 (recommended, names start with `al2023-`) and Amazon Linux 2 AMIs.

### Head job configuration

**Head Job CPUs/Memory**: Hardware resources for the Nextflow head job. Default memory is 4096 MiB. These values also limit the maximum size of Studio sessions in this compute environment.

**Head Job role**: IAM role with fine-grained permissions for the head job.

### Compute job configuration

**Compute Job role**: IAM role with fine-grained permissions for compute jobs.

**Batch execution role**: Required for pipelines that access workspace secrets. Grants permissions to make API calls to the ECS container used by Batch.

### Networking

**VPC ID, Subnets, Security groups**: Custom networking configuration. If not specified, defaults for the selected region are used. When using EFS or FSx, select the security group that allows file system access.

**Key pair**: SSH key for debugging EC2 instances.

### Storage options

**EBS auto-expandable block size**: Initial size (GB) for auto-expandable EBS volumes. Deprecated and incompatible with Fusion v2.

**Boot disk size**: Size (GB) of VM boot disks.

**Allowed S3 buckets**: Additional buckets pipelines can access. The work directory bucket is included automatically.

### Logging and agents

**CloudWatch Log group**: Log group for the `awslogs` driver to stream job logs.

**ECS agent configuration**: Custom ECS agent parameters appended to `/etc/ecs/ecs.config`. See [Amazon ECS container agent configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html).

:::note
Altering ECS agent configuration may cause compute environment malfunction.
:::

**AWS CLI tool path**: Custom location for the `aws` CLI binary.

### Cost management

**Cost percentage** (Spot only): Maximum Spot instance price as percentage of On-Demand price. Spot instances won't launch until current Spot price is below this threshold.

---

## Resource labels

Apply resource labels to cloud resources created by the compute environment. Workspace default labels are applied automatically. Labels help with cost tracking and resource organization in AWS.

File systems created by Batch Forge are automatically tagged as `Name=TowerForge-<id>`. A manually-applied label with key `Name` (capital N) overrides this automatic tag.

See [Resource labels](/platform-cloud/resource-labels/overview) for more information.

---

## Pipeline secrets

Seqera can synchronize workspace secrets with AWS Secrets Manager. Secrets created by Platform use the `tower-*` prefix.

Required permissions:
- `secretsmanager:ListSecrets` (cannot be scoped)
- `secretsmanager:DescribeSecret`, `CreateSecret`, `DeleteSecret` (can be scoped to `tower-*` resources)

IAM roles used by compute jobs must also be configured to access secrets. See [AWS Secrets Manager integration](/platform-cloud/secrets/overview#aws-secrets-manager-integration).

---

## Staging options

**Pre-run script**: Bash script that executes before the Nextflow pipeline.

**Post-run script**: Bash script that executes after the Nextflow pipeline.

**Nextflow config file**: Global configuration settings for all pipelines using this compute environment. Values here are pre-filled in the launch form and can be overridden per-launch. These settings override values in the pipeline repository's `nextflow.config`.

See [Pre and post-run scripts](/platform-cloud/launch/advanced#pre-and-post-run-scripts) and [Nextflow config file](/platform-cloud/launch/advanced#nextflow-config-file) for details.

---

## Environment variables

Specify custom environment variables for head jobs, compute jobs, or both. Variables are available to processes running in the respective job contexts.

---

## Resource cleanup

When you delete a Batch Forge compute environment with **Dispose resources** enabled, Seqera deletes all AWS resources it created, including EFS and FSx file systems.

From Nextflow v24.10+, compute jobs include the Seqera workflow ID as a prefix. Search your AWS console for jobs with a specific workflow ID to check status and perform cleanup in edge cases.

:::caution
Seqera terminates compute resources when pipelines complete or are canceled. However, residual resources may persist due to workflow logic, transient cloud faults, or abnormal exits. Customers are responsible for final resource cleanup.
:::

**EBS volumes**: Large clusters (hundreds of nodes) may exceed EC2 API rate limits, causing EBS volume deletion to fail. Monitor for orphaned volumes via the EC2 console or use a Lambda function. See [AWS guidance on deleting unused EBS volumes](https://aws.amazon.com/blogs/mt/controlling-your-aws-costs-by-deleting-unused-amazon-ebs-volumes/).

---

## Deprecated features

These features remain available but are not recommended for new compute environments:

**EBS Auto scale**: Dynamically expands disk space during task execution. Incompatible with Fusion v2. Consider using Fusion v2 with fast instance storage instead.

**Fusion mounts (v1)**: Mounts S3 buckets as file system volumes at `/fusion/s3/<bucket-name>`. Superseded by Fusion v2.

---

## Related pages

- [Manual AWS Batch setup](/platform-cloud/enterprise/advanced-topics/manual-aws-batch-setup)
- [Launch pipelines](/platform-cloud/launch/launchpad)
- [Fusion file system](/platform-cloud/supported_software/fusion/overview)
- [Studios](/platform-cloud/studios/overview)
- [Data Explorer](/platform-cloud/data/data-explorer)
- [Cloud costs](/platform-cloud/monitoring/cloud-costs)
- [Credentials](/platform-cloud/credentials/overview)
- [Resource labels](/platform-cloud/resource-labels/overview)
- [Pipeline secrets](/platform-cloud/secrets/overview)

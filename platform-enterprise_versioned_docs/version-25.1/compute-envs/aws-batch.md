---
title: "AWS Batch"
description: "Instructions to set up AWS Batch in Seqera Platform"
date: "21 Apr 2023"
tags: [aws, batch, compute environment]
---

:::tip
This guide assumes you have an existing [Amazon Web Service (AWS)](https://aws.amazon.com/) account.

The AWS Batch service quota for job queues is 50 per account. For more information on AWS Batch service quotas, see [AWS Batch service quotas](https://docs.aws.amazon.com/batch/latest/userguide/service_limits.html).
:::

There are two ways to create a Seqera Platform compute environment for AWS Batch:

- [**Batch Forge**](#batch-forge): This option automatically creates the AWS Batch resources in your AWS account. This eliminates the need to set up your AWS Batch infrastructure manually.
- [**Manual**](#manual): This option allows Seqera to use existing AWS Batch resources.

## Batch Forge

Batch Forge automates the configuration of an [AWS Batch](https://aws.amazon.com/batch/) compute environment and the queues required for deploying Nextflow pipelines.

:::caution
Batch Forge automatically creates resources that you may be charged for in your AWS account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

### IAM

Batch Forge requires an Identity and Access Management (IAM) user with the permissions listed in [this policy file](https://github.com/seqeralabs/nf-tower-aws/blob/master/forge/forge-policy.json). These authorizations are more permissive than those required to only [launch](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/launch-policy.json) a pipeline, since Seqera needs to manage AWS resources on your behalf. Note that launch permissions also require the S3 storage write permissions in [this policy file](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/s3-bucket-write.json).

We recommend that you create separate IAM policies for Batch Forge and launch permissions using the policy files above. These policies can then be assigned to the Seqera IAM user.

**Create Seqera IAM policies**

1. Open the [AWS IAM console](https://console.aws.amazon.com/iam).
1. From the left navigation menu, select **Policies** under **Access management**.
1. Select **Create policy**.
1. On the **Create policy** page, select the **JSON** tab.

1. Copy the contents of your policy JSON file ([Forge](https://github.com/seqeralabs/nf-tower-aws/blob/master/forge/forge-policy.json) or [Launch](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/launch-policy.json), depending on the policy being created) and replace the default text in the policy editor area under the JSON tab.

1. To create a Launch user, you must also create the [S3 bucket write policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/s3-bucket-write.json) separately to attach to your Launch user.

1. To use Data Explorer and Studios, you must create the [data policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/data/data-explorer-policy.json) separately to attach to your Platform users.

1. Select **Next: Tags**.
1. Select **Next: Review**.
1. Enter a name and description for the policy on the **Review policy** page, then select **Create policy**.
1. Repeat these steps for both the `forge-policy.json` and `launch-policy.json` files. For a Launch user, also create the `s3-bucket-write-policy.json` listed in step 5 above.

**Create an IAM user**

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Users** in the left navigation menu, then select **Add User** at the top right of the page.
1. Enter a name for your user (e.g., _seqera_) and select the **Programmatic access** type.
1. Select **Next: Permissions**.
1. Select **Next: Tags > Next: Review > Create User**.
    :::note
    For the time being, you can ignore the "user has no permissions" warning. Permissions will be applied using the **IAM Policy**.
    :::
1. Save the **Access key ID** and **Secret access key** in a secure location as you will use these when creating credentials in Seqera.
1. After you have saved the keys, select **Close**.
1. Back in the users table, select the newly created user, then select **Add permissions** under the **Permissions** tab.
1. Select **Attach existing policies**, then search for and select each of the policies created above.
1. Select **Next: Review > Add permissions**.

### S3 Bucket

S3 (Simple Storage Service) is a type of **object storage**. To access files and store the results for your pipelines, create an **S3 bucket** that your Seqera IAM user can access.

**Create an S3 bucket**

1. Navigate to the [S3 service](https://console.aws.amazon.com/s3/home).
1. Select **Create New Bucket**.
1. Enter a unique name for your bucket and select a region.
    :::note
    To maximize data transfer resilience and minimize cost, storage should be in the same region as compute.
    :::
1. Select the default options in **Configure options**.
1. Select the default options in **Set permissions**.
1. Review and select **Create bucket**.

:::note
S3 is used by Nextflow for the storage of intermediate files. In production pipelines, this can amount to a lot of data. To reduce costs, consider using a retention policy when creating a bucket, such as automatically deleting intermediate files after 30 days. See [here](https://aws.amazon.com/premiumsupport/knowledge-center/s3-empty-bucket-lifecycle-rule/) for more information.
:::

### Batch Forge compute environment

Batch Forge automates the configuration of an [AWS Batch](https://aws.amazon.com/batch/) compute environment and the queues required to deploy Nextflow pipelines. After your IAM user and S3 bucket have been set up, create a new **AWS Batch** compute environment in Seqera.

:::caution
Batch Forge automatically creates resources that you may be charged for in your AWS account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

**Create a Batch Forge AWS Batch compute environment**

1. In a workspace, select **Compute environments > New environment**.
1. Enter a descriptive name for this environment, e.g., _AWS Batch Spot (eu-west-1)_.
1. Select **AWS Batch** as the target platform.
1. From the **Credentials** drop-down, select existing AWS credentials, or select **+** to add new credentials. If you're using existing credentials, skip to step 8.
    :::note
    You can create multiple credentials in your Seqera environment. See [Credentials](../credentials/overview).
    :::
1. Enter a name, e.g., _AWS Credentials_.
1. Add the **Access key** and **Secret key**. These are the keys you saved previously when you created the Seqera IAM user.
1. (Optional) Under **Assume role**, specify the IAM role to be assumed by the Seqera IAM user to access the compute environment's AWS resources.
    :::note
    When using AWS keys without an assumed role, the associated AWS user account must have [Launch](https://github.com/seqeralabs/nf-tower-aws/tree/master/launch) and [Forge](https://github.com/seqeralabs/nf-tower-aws/tree/master/forge) permissions. When an assumed role is provided, the keys are only used to retrieve temporary credentials impersonating the role specified. In this case, [Launch](https://github.com/seqeralabs/nf-tower-aws/tree/master/launch) and [Forge](https://github.com/seqeralabs/nf-tower-aws/tree/master/forge) permissions must be granted to the role instead of the user account.
    :::
1. Select a **Region**, e.g., _eu-west-1 - Europe (Ireland)_.
1. Enter your S3 bucket path in the **Pipeline work directory** field, e.g., `s3://seqera-bucket`. This bucket must be in the same region chosen in the previous step.
    :::note
    When you specify an S3 bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://www.nextflow.io/docs/latest/cache-and-resume.html#cache-stores) by default. Seqera adds a `cloudcache` block to the Nextflow configuration file for all runs executed with this compute environment. This block includes the path to a `cloudcache` folder in your work directory, e.g., `s3://seqera-bucket/cloudcache/.cache`. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
    :::
    :::warning
    Using an EFS file system as your work directory is currently incompatible with [Studios](../studios/overview), and will result in errors with checkpoints and mounted data.
    :::
1. Select **Enable Wave containers** to facilitate access to private container repositories and provision containers in your pipelines using the Wave containers service. See [Wave containers](https://www.nextflow.io/docs/latest/wave.html) for more information.
1. Select **Enable Fusion v2** to allow access to your S3-hosted data via the [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system. This speeds up most data operations. The Fusion v2 file system requires Wave containers to be enabled. See [Fusion file system](../supported_software/fusion/overview) for configuration details.

    <details>
    <summary>Use Fusion v2 file system</summary>

    :::note
    The compute recommendations below are based on internal benchmarking performed by Seqera. Benchmark runs of [nf-core/rnaseq](https://github.com/nf-core/rnaseq) used profile `test_full`, consisting of an input dataset with 16 FASTQ files and a total size of approximately 123.5 GB.
    :::

    We recommend using Fusion with AWS NVMe instances (fast instance storage) as this delivers the fastest performance when compared to environments using only AWS EBS (Elastic Block Store).

    1. Use Seqera Platform version 23.1 or later.
    1. Use an S3 bucket as the pipeline work directory.
    1. Enable **Wave containers**, **Fusion v2**, and **fast instance storage**.
    1. Select the **Batch Forge** config mode.
    1. Fast instance storage requires an EC2 instance type that uses NVMe disks. Specify NVMe-based instance types in **Instance types** under **Advanced options**. If left unspecified, Platform selects instances from AWS NVMe-based instance type families. See [Instance store temporary block storage for EC2 instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) for more information.

    :::note
    When enabling fast instance storage, do not select the `optimal` instance type families (c4, m4, r4) for your compute environment as these are not NVMe-based instances. Specify AWS NVMe-based instance types, or leave the **Instance types** field empty for Platform to select NVMe instances for you.
    :::

    :::tip
    We recommend selecting 8xlarge or above for large and long-lived production pipelines:
    - A local temp storage disk of at least 200 GB and a random read speed of 1000 MBps or more. To work with files larger than 100 GB, increase temp storage accordingly (400 GB or more).
    - Dedicated networking ensures a guaranteed network speed service level compared with "burstable" instances. See [Instance network bandwidth](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html) for more information.
    :::

    When using Fusion v2 without fast instance storage, the following EBS settings are applied to optimize file system performance:

    - EBS boot disk size is increased to 100 GB
    - EBS boot disk type GP3 is selected
    - EBS boot disk throughput is increased to 325 MB/s

    Extensive benchmarking of Fusion v2 has demonstrated that the increased cost associated with these settings are generally outweighed by the costs saved due to decreased run time.

    </details>

1. Set the **Config mode** to **Batch Forge**.
1. Select a **Provisioning model**. In most cases, this will be **Spot**. You can specify an allocation strategy and instance types under [**Advanced options**](#advanced-options). If advanced options are omitted, Seqera Platform 23.2 and later versions default to `BEST_FIT_PROGRESSIVE` for On-Demand and `SPOT_PRICE_CAPACITY_OPTIMIZED` for Spot compute environments.
    :::note
    You can create a compute environment that launches either Spot or On-Demand instances. Spot instances can cost as little as 20% of On-Demand instances, and with Nextflow's ability to automatically relaunch failed tasks, Spot is almost always the recommended provisioning model. Note, however, that when choosing Spot instances, Seqera will also create a dedicated queue for running the main Nextflow job using a single On-Demand instance to prevent any execution interruptions.

    From Nextflow version 24.10, the default Spot reclamation retry setting changed to `0` on AWS and Google. By default, no internal retries are attempted on these platforms. Spot reclamations now lead to an immediate failure, exposed to Nextflow in the same way as other generic failures (returning for example, `exit code 1` on AWS). Nextflow will treat these failures like any other job failure unless you actively configure a retry strategy. For more information, see [Spot instance failures and retries](https://docs.seqera.io/platform/24.2/troubleshooting_and_faqs/nextflow#spot-instance-failures-and-retries-in-nextflow).
    :::
1. Enter the **Max CPUs**, e.g., `64`. This is the maximum number of combined CPUs (the sum of all instances' CPUs) AWS Batch will provision at any time.
1. Select **EBS Auto scale (deprecated)** to allow the EC2 virtual machines to dynamically expand the amount of available disk space during task execution. This feature is deprecated, and is not compatible with Fusion v2.
    :::note
    When you run large AWS Batch clusters (hundreds of compute nodes or more), EC2 API rate limits may cause the deletion of unattached EBS volumes to fail. You should delete volumes that remain active after Nextflow jobs have completed to avoid additional costs. Monitor your AWS account for any orphaned EBS volumes via the EC2 console, or with a Lambda function. See [here](https://aws.amazon.com/blogs/mt/controlling-your-aws-costs-by-deleting-unused-amazon-ebs-volumes/) for more information.
    :::
1. With the optional **Enable Fusion mounts (deprecated)** feature enabled, S3 buckets specified in **Pipeline work directory** and **Allowed S3 Buckets** are mounted as file system volumes in the EC2 instances carrying out the Batch job execution. These buckets can then be accessed at `/fusion/s3/<bucket-name>`. For example, if the bucket name is `s3://imputation-gp2`, your pipeline will access it using the file system path `/fusion/s3/imputation-gp2`. **Note:** This feature has been deprecated. Consider using Fusion v2 (see above) for enhanced performance and stability.
    :::note
    You do not need to modify your pipeline or files to take advantage of this feature. Nextflow will automatically recognize and replace any reference to files prefixed with `s3://` with the corresponding Fusion mount paths.
    :::
1. Select **Enable Fargate for head job** to run the Nextflow head job with the [AWS Fargate](https://aws.amazon.com/fargate/) container service and speed up pipeline launch. Fargate is a serverless compute engine that enables users to run containers without the need to provision servers or clusters in advance. AWS takes a few minutes to spin up an EC2 instance, whereas jobs can be launched with Fargate in under a minute (depending on container size). We recommend Fargate for most pipeline deployments, but EC2 is more suitable for environments that use GPU instances, custom AMIs, or that require more than 16 vCPUs. If you specify a custom AMI ID in the [Advanced options](#advanced-options) below, this will not be applied to the Fargate-enabled head job. See [here](https://docs.aws.amazon.com/batch/latest/userguide/fargate.html#when-to-use-fargate) for more information on Fargate's limitations.
    :::note
    Fargate requires the Fusion v2 file system and a **Spot** provisioning model. Fargate is not compatible with EFS and FSx file systems.
    :::
1. Select **Enable GPUs** if you intend to run GPU-dependent workflows in the compute environment. See [GPU usage](./overview#aws-batch) for more information.
    :::note
    Seqera only supports NVIDIA GPUs. Select instances with NVIDIA GPUs for your GPU-dependent processes.
    :::
1. Select **Use Graviton CPU architecture** to execute on Graviton-based EC2 instances (i.e., ARM64 CPU architecture). When enabled, `m6g`, `r6g`, and `c6g` instance types are used by default for compute jobs, but 3rd-generation Graviton [instances](https://www.amazonaws.cn/en/ec2/graviton/) are also supported. You can specify your own **Instance types** under [**Advanced options**](#advanced-options).
    :::note
    Graviton requires Fargate, Wave containers, and Fusion v2 file system to be enabled. This feature is not compatible with GPU-based architecture.
    :::
1. Enter any additional **Allowed S3 buckets** that your workflows require to read input data or write output data. The **Pipeline work directory** bucket above is added by default to the list of **Allowed S3 buckets**.
1. To use **EFS**, you can either select **Use existing EFS file system** and specify an existing EFS instance, or select **Create new EFS file system** to create one. To use the EFS file system as your work directory, specify `<your_EFS_mount_path>/work` in the **Pipeline work directory** field (step 8 of this guide).
    - To use an existing EFS file system, enter the **EFS file system id** and **EFS mount path**. This is the path where the EFS volume is accessible to the compute environment. For simplicity, we recommend that you use `/mnt/efs` as the EFS mount path.
    - To create a new EFS file system, enter the **EFS mount path**. We advise that you specify `/mnt/efs` as the EFS mount path.
    - EFS file systems created by Batch Forge are automatically tagged in AWS with `Name=TowerForge-<id>`, with `<id>` being the compute environment ID. Any manually-added resource label with the key `Name` (capital N) will override the automatically-assigned `TowerForge-<id>` label.
    :::warning
    EFS file systems are compatible with [Studios](../studios/overview), **except** when using the EFS file system as your **work directory**.
    :::
1. To use **FSx for Lustre**, you can either select **Use existing FSx file system** and specify an existing FSx instance, or select **Create new FSx file system** to create one. To use the FSx file system as your work directory, specify `<your_FSx_mount_path>/work` in the **Pipeline work directory** field (step 8 of this guide).
    - To use an existing FSx file system, enter the **FSx DNS name** and **FSx mount path**. The FSx mount path is the path where the FSx volume is accessible to the compute environment. For simplicity, we recommend that you use `/mnt/fsx` as the FSx mount path.
    - To create a new FSx file system, enter the **FSx size** (in GB) and the **FSx mount path**. We advise that you specify `/mnt/fsx` as the FSx mount path.
    - FSx file systems created by Batch Forge are automatically tagged in AWS with `Name=TowerForge-<id>`, with `<id>` being the compute environment ID. Any manually-added resource label with the key `Name` (capital N) will override the automatically-assigned `TowerForge-<id>` label.
1. Select **Dispose resources** to automatically delete these AWS resources if you delete the compute environment in Seqera Platform.
1. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch.
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced#nextflow-config-file) for more information on configuration priority.
    :::
1. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
1. Configure any advanced options described in the next section, as needed.
1. Select **Create** to finalize the compute environment setup. It will take a few seconds for all the AWS resources to be created before you are ready to launch pipelines.

:::info
See [Launch pipelines](../launch/launchpad) to start executing workflows in your AWS Batch compute environment.
:::

### Advanced options

Seqera Platform compute environments for AWS Batch include advanced options to configure instance types, resource allocation, custom networking, and CloudWatch and ECS agent integration.

**Batch Forge AWS Batch advanced options**

Specify the **Allocation strategy** and indicate any preferred **Instance types**. AWS applies quotas for the number of running and requested [Spot](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-limits.html) and [On-Demand](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#ec2-on-demand-instances-limits) instances per account. AWS will allocate instances from up to 20 instance types, based on those requested for the compute environment. AWS excludes the largest instances when you request more than 20 instance types.

    :::note
    If these advanced options are omitted, allocation strategy defaults are `BEST_FIT_PROGRESSIVE` for On-Demand and `SPOT_PRICE_CAPACITY_OPTIMIZED` for Spot compute environments.
    :::
    :::caution
    tw CLI v0.8 and earlier does not support the `SPOT_PRICE_CAPACITY_OPTIMIZED` allocation strategy in AWS Batch. You cannot currently use CLI to create or otherwise interact with AWS Batch Spot compute environments that use this allocation strategy.
    :::

- Configure a custom networking setup using the **VPC ID**, **Subnets**, and **Security groups** fields.
- You can specify a custom **AMI ID**.

    :::note
    From version 24.2, Seqera supports Amazon Linux 2023 ECS-optimized AMIs, in addition to previously supported Amazon Linux-2 AMIs. AWS-recommended Amazon Linux 2023 AMI names start with `al2023-`. To learn more about approved versions of the Amazon ECS-optimized AMIs or creating a custom AMI, see [this AWS guide](https://docs.aws.amazon.com/batch/latest/userguide/compute_resource_AMIs.html#batch-ami-spec).

    If a custom AMI is specified and the **Enable GPU** option is also selected, the custom AMI will be used instead of the AWS-recommended GPU-optimized AMI.
    :::

- If you need to debug the EC2 instance provisioned by AWS Batch, specify a **Key pair** to log in to the instance via SSH.
- You can set **Min CPUs** to be greater than `0`, in which case some EC2 instances will remain active. An advantage of this is that pipeline executions will initialize faster.

    :::note
    Setting Min CPUs to a value greater than 0 will keep the required compute instances active, even when your pipelines are not running. This will result in additional AWS charges.
    :::

- Use **Head Job CPUs** and **Head Job Memory** to specify the hardware resources allocated for the Nextflow head job. The default head job memory allocation is 4096 MiB.

    :::warning
    Setting Head Job values will also limit the size of any Studio session that can be created in the compute environment.
    :::

- Use **Head Job role** and **Compute Job role** to grant fine-grained IAM permissions to the **Head Job** and **Compute Jobs**.
- Add an execution role ARN to the **Batch execution role** field to grant permissions to make API calls on your behalf to the ECS container used by Batch. This is required if the pipeline launched with this compute environment needs access to the secrets stored in this workspace. This field can be ignored if you are not using secrets.
- Specify an EBS block size (in GB) in the **EBS auto-expandable block size** field to control the initial size of the EBS auto-expandable volume. New blocks of this size are added when the volume begins to run out of free space. This feature is deprecated, and is not compatible with Fusion v2.
- Enter the **Boot disk size** (in GB) to specify the size of the boot disk in the VMs created by this compute environment.
- If you're using **Spot** instances, you can also specify the **Cost percentage**, which is the maximum allowed price of a **Spot** instance as a percentage of the **On-Demand** price for that instance type. Spot instances will not be launched until the current Spot price is below the specified cost percentage.
- Use **AWS CLI tool path** to specify the location of the `aws` CLI.
- Specify a **CloudWatch Log group** for the `awslogs` driver to stream the logs entry to an existing Log group in Cloudwatch.
- Specify a custom **ECS agent configuration** for the ECS agent parameters used by AWS Batch. This is appended to the `/etc/ecs/ecs.config` file in each cluster node.

    :::note
    Altering this file may result in a malfunctioning Batch Forge compute environment. See [Amazon ECS container agent configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) to learn more about the available parameters.
    :::

## Manual

This section is for users with a pre-configured AWS environment. You will need a [Batch queue, a Batch compute environment, an IAM user, and an S3 bucket](../enterprise/advanced-topics/manual-aws-batch-setup.mdx) already set up.

To enable Seqera in your existing AWS configuration, you need an IAM user with the following permissions:

- `AmazonS3ReadOnlyAccess`
- `AmazonEC2ContainerRegistryReadOnly`
- `CloudWatchLogsReadOnlyAccess`
- A [custom policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/launch-policy.json) to grant the ability to submit and control Batch jobs
- Write access to any S3 bucket used by pipelines with [this policy template](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/s3-bucket-write.json)

### S3 bucket access

Seqera can use S3 to store the intermediate files and output data generated by pipeline executions. Create a policy for your Seqera IAM user that grants access to specific buckets.

**Assign an S3 access policy to Seqera IAM users**

1. Go to the IAM User table in the [IAM service](https://console.aws.amazon.com/iam/home).
1. Select the IAM user.
1. Select **Add inline policy**.
1. Copy the contents of [this policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/s3-bucket-write.json) into the **JSON** tab. Replace `YOUR-BUCKET-NAME` (lines 10 and 21) with your bucket name.
1. Name your policy and select **Create policy**.

### Seqera manual compute environment

With your AWS environment and resources set up and your user permissions configured, create an AWS Batch compute environment in Seqera manually.

:::caution
Your Seqera compute environment uses resources that you may be charged for in your AWS account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

**Create a manual Seqera compute environment**

1. In a workspace, select **Compute environments > New environment**.
1. Enter a descriptive name for this environment, e.g., _AWS Batch Manual (eu-west-1)_.
1. Select **AWS Batch** as the target platform.
1. Select **+** to add new credentials.
1. Enter a name for the credentials, e.g., _AWS Credentials_.
1. Enter the **Access key** and **Secret key** for your IAM user.
    :::note
    You can create multiple credentials in your Seqera environment. See [Credentials](../credentials/overview).
    :::
1. Select a **Region**, e.g., _eu-west-1 - Europe (Ireland)_.
1. Enter an S3 bucket path for the **Pipeline work directory**, e.g., `s3://seqera-bucket`. This bucket must be in the same region chosen in the previous step.
    :::note
    When you specify an S3 bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://www.nextflow.io/docs/latest/cache-and-resume.html#cache-stores) by default. Seqera adds a `cloudcache` block to the Nextflow configuration file for all runs executed with this compute environment. This block includes the path to a `cloudcache` folder in your work directory, e.g., `s3://seqera-bucket/cloudcache/.cache`. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
    :::
1. Select **Enable Wave containers** to facilitate access to private container repositories and provision containers in your pipelines using the Wave containers service. See [Wave containers](https://www.nextflow.io/docs/latest/wave.html) for more information.
1. Select **Enable Fusion v2** to allow access to your S3-hosted data via the [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system. This speeds up most data operations. The Fusion v2 file system requires Wave containers to be enabled. See [Fusion file system](../supported_software/fusion/overview) for configuration details.

    <details>
    <summary>Use Fusion v2 file system</summary>

    :::note
    The compute recommendations below are based on internal benchmarking performed by Seqera. Benchmark runs of [nf-core/rnaseq](https://github.com/nf-core/rnaseq) used profile `test_full`, consisting of an input dataset with 16 FASTQ files and a total size of approximately 123.5 GB.
    :::

    We recommend using Fusion with AWS NVMe instances (fast instance storage) as this delivers the fastest performance when compared to environments using only AWS EBS (Elastic Block Store).

    1. Use Seqera Platform version 23.1 or later.
    1. Use an S3 bucket as the pipeline work directory.
    1. Enable **Wave containers**, **Fusion v2**, and **fast instance storage**.
    1. Fast instance storage requires an EC2 instance type that uses NVMe disks. Specify NVMe-based instance types in **Instance types** under **Advanced options**. If left unspecified, Platform selects instances from AWS NVMe-based instance type families. See [Instance store temporary block storage for EC2 instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) for more information.

    :::note
    When enabling fast instance storage, do not select the `optimal` instance type families (c4, m4, r4) for your compute environment as these are not NVMe-based instances. Specify AWS NVMe-based instance types, or leave the **Instance types** field empty for Platform to select NVMe instances for you.
    :::

    :::tip
    We recommend selecting 8xlarge or above for large and long-lived production pipelines:
    - A local temp storage disk of at least 200 GB and a random read speed of 1000 MBps or more. To work with files larger than 100 GB, increase temp storage accordingly (400 GB or more).
    - Dedicated networking ensures a guaranteed network speed service level compared with "burstable" instances. See [Instance network bandwidth](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html) for more information.
    :::

    When using Fusion v2 without fast instance storage, the following EBS settings are applied to optimize file system performance:

    - EBS boot disk size is increased to 100 GB
    - EBS boot disk type GP3 is selected
    - EBS boot disk throughput is increased to 325 MB/s

    Extensive benchmarking of Fusion v2 has demonstrated that the increased cost associated with these settings are generally outweighed by the costs saved due to decreased run time.

    </details>

1. Set the **Config mode** to **Manual**.
1. Enter the **Head queue**, which is the name of the AWS Batch queue that the Nextflow main job will run.
1. Enter the **Compute queue**, which is the name of the AWS Batch queue where tasks will be submitted.
1. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch.
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced#nextflow-config-file) for more information on configuration priority.
    :::
1. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
1. Configure any advanced options described in the next section, as needed.
1. Select **Create** to finalize the compute environment setup.

:::info
See [Launch pipelines](../launch/launchpad) to start executing workflows in your AWS Batch compute environment.
:::

### Advanced options

Seqera Platform compute environments for AWS Batch include advanced options to configure resource allocation, execution roles, custom AWS CLI tool paths, and CloudWatch integration.

**Seqera AWS Batch advanced options**

- Use **Head Job CPUs** and **Head Job Memory** to specify the hardware resources allocated for the Nextflow head job. The default head job memory allocation is 4096 MiB.
- Use **Head Job role** and **Compute Job role** to grant fine-grained IAM permissions to the Head Job and Compute Jobs,
- Add an execution role ARN to the **Batch execution role** field to grant permissions to make API calls on your behalf to the ECS container used by Batch. This is required if the pipeline launched with this compute environment needs access to the secrets stored in this workspace. This field can be ignored if you are not using secrets.
- Use **AWS CLI tool path** to specify the location of the `aws` CLI.
- Specify a **CloudWatch Log group** for the `awslogs` driver to stream the logs entry to an existing Log group in Cloudwatch.

:::caution
Seqera platform is designed to terminate compute resources when a Nextflow pipeline completes or is canceled. However, due to external factors — including user-defined workflow logic, transient cloud faults, or abnormal pipeline exits — residual resources may persist. While Platform provides visibility to detect and resolve these states, customers are responsible for final resource cleanup and ensuring compute environments operate according to Platform expectations.

From Nextflow v24.10+, compute jobs are identifiable by Seqera workflow ID. If you search your AWS console/CLI/API for jobs prefixed by a given workflow ID, you can check the status and perform additional cleanup in edge case scenarios.
:::

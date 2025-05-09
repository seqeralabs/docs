---
title: "AWS Batch"
description: "Instructions to set up AWS Batch in Nextflow Tower"
date: "21 Apr 2023"
tags: [aws, batch, compute environment]
---

:::tip
This guide assumes you have an existing [Amazon Web Service (AWS)](https://aws.amazon.com/) account.

The AWS Batch service quota for job queues is 50 per account. For more information on AWS Batch service quotas, see [AWS Batch service quotas][quota].
:::

There are two ways to create a **compute environment** for **AWS Batch** with Tower:

1. [**Batch Forge**](#tower-forge): This option automatically creates the AWS Batch resources in your AWS account. This eliminates the need to set up your AWS Batch infrastructure manually.

2. [**Manual**](#manual): This option allows Tower to use existing AWS Batch resources.

## Batch Forge

Batch Forge automates the configuration of an [AWS Batch](https://aws.amazon.com/batch/) compute environment and the queues required for deploying Nextflow pipelines. Note that this option will automatically create resources in your AWS account that you may be charged for by AWS.

### IAM

To use the Batch Forge feature, Tower requires an Identity and Access Management (IAM) user with the permissions listed in [this policy file](https://github.com/seqeralabs/nf-tower-aws/blob/master/forge/forge-policy.json). These authorizations are more permissive than those required to only [launch](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/launch-policy.json) a pipeline, since Tower needs to manage AWS resources on your behalf. Note that launch permissions also require the S3 storage write permissions in [this policy file](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/s3-bucket-write.json).

We recommend creating separate IAM policies for Batch Forge and Tower launch permissions using the policy files linked above. These policies can then be assigned to the Tower IAM user.

#### Create Tower IAM policies

1. Open the [AWS IAM console](https://console.aws.amazon.com/iam).

2. From the left navigation menu, select **Policies** under **Access management**.

3. Select **Create policy**.

4. On the **Create policy** page, select the **JSON** tab.

5. Copy the contents of your policy JSON file ([Forge](https://github.com/seqeralabs/nf-tower-aws/blob/master/forge/forge-policy.json) or [Launch](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/launch-policy.json), depending on the policy being created) and replace the default text in the policy editor area under the JSON tab. To create a Launch user, you must also create the [S3 bucket write policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/s3-bucket-write.json) separately to attach to your Launch user.

6. Select **Next: Tags**.

7. Select **Next: Review**.

8. Enter a name and description for the policy on the Review policy page, then select **Create policy**.

9. Repeat these steps for both the `forge-policy.json` and `launch-policy.json` files. For a Launch user, also create the `s3-bucket-write-policy.json` listed in step 5 above.

#### Create an IAM user

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Users** in the left navigation menu, then select **Add User** at the top rigt of the page.

2. Enter a name for your user (e.g. `tower`) and select the **Programmatic access** type.

3. Select **Next: Permissions**.

4. Select **Next: Tags**, then **Next: Review** and **Create User**.

   :::caution
   For the time being, you can ignore the warning. Permissions will be applied using the **IAM Policy**.
   :::

5. Save the **Access key ID** and **Secret access key** in a secure location as we will use these in the next section.

6. Once you have saved the keys, select **Close**.

7. Back in the users table, select the newly created user,then select **Add permissions** under the Permissions tab.

8. Select **Attach existing policies**, search for the policies created [previously](./aws-batch.mdx#create-tower-iam-policies), and select each one.

9. Select **Next: Review**.

10. Select **Add permissions**.

### S3 Bucket

S3 (Simple Storage Service) is a type of **object storage**. To access files and store the results for our pipelines, we have to create an **S3 bucket** and grant our new Tower IAM user access to it.

1. Navigate to the [S3 service](https://console.aws.amazon.com/s3/home).

2. Select **Create New Bucket**.

3. Enter a unique name for your bucket and select a region.

   :::caution
   To maximize data transfer resilience and minimize cost, storage should be in the same region as compute.
   :::

4. Select the default options for **Configure options**.

5. Select the default options for **Set permissions**.

6. Review and select **Create bucket**.

:::caution
S3 is used by Nextflow for the storage of intermediate files. In production pipelines, this can amount to a large quantity of data. To reduce costs, consider using a retention policy when creating a bucket, such as automatically deleting intermediate files after 30 days. See [here](https://aws.amazon.com/premiumsupport/knowledge-center/s3-empty-bucket-lifecycle-rule/) for more information.
:::

### Compute environment

Batch Forge automates the configuration of an [AWS Batch](https://aws.amazon.com/batch/) compute environment and queues required for the deployment of Nextflow pipelines.

Once the AWS resources are set up, we can add a new **AWS Batch** environment in Tower. To create a new compute environment:

1.  In a workspace, select **Compute environments** and then **New environment**.

2.  Enter a descriptive name for this environment, e.g., "AWS Batch Spot (eu-west-1)".

3.  Select **Amazon Batch** as the target platform.

4.  From the **Credentials** drop-down, select existing AWS credentials, or add new credentials by selecting the **+** button. If you select to use existing credentials, skip to step 7.

5.  Enter a name, e.g. "AWS Credentials".

6.  Add the **Access key** and **Secret key**. These are the keys you saved previously when you created the AWS [IAM user](#iam).

        :::tip
        You can create multiple credentials in your Tower environment.
        :::

7.  Select a **Region**, e.g., "eu-west-1 - Europe (Ireland)".

8.  Enter the S3 bucket path created in the previous section to the **Pipeline work directory** field, e.g. `s3://unique-tower-bucket`.

        :::caution
        The bucket should be in the same region selected in the previous step.
        :::

9.  Select **Enable Wave containers** to facilitate access to private container repositories and provision containers in your pipelines using the Wave containers service. See [Wave containers](https://www.nextflow.io/docs/latest/wave.html) for more information.

10. Select **Enable Fusion v2** to allow access to your S3-hosted data via the [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system. This speeds up most data operations. The Fusion v2 file system requires Wave containers to be enabled (see above). See [Fusion file system](../supported_software/fusion/fusion.mdx) for configuration details.

        :::note
        When using Fusion v2 without fast instance storage (see below), the following EBS settings are applied to optimize file system performance:

        - EBS autoscaling is disabled
        - EBS boot disk size is increased to 100 GB
        - EBS boot disk type GP3 is selected
        - EBS boot disk throughput is increased to 325 MB/s

        Extensive benchmarking of Fusion v2 has demonstrated that the increased cost associated with these settings are generally outweighed by the costs saved due to decreased run time.
        :::

11. Select **Enable fast instance storage** to allow the use of NVMe instance storage to speed up I/O and disk access operations. NVMe instance storage requires Fusion v2 to be enabled (see above).

        :::note
        Fast instance storage requires an EC2 instance type that uses NVMe disks. Tower validates any instance types you specify (from **Advanced options > Instance types**) during compute environment creation. If you do not specify an instance type, a standard EC2 instance with NVMe disks will be used (`'c5ad', 'c5d', 'c6id', 'i3', 'i4i', 'm5ad', 'm5d', 'm6id', 'r5ad', 'r5d', 'r6id'` EC2 instance families) for fast storage.
        :::

12. Set the **Config mode** to **Batch Forge**.

13. Select a **Provisioning model**. In most cases this will be **Spot**.

        :::tip
        You can choose to create a compute environment that launches either Spot or On-Demand instances. Spot instances can cost as little as 20% of On-Demand instances, and with Nextflow's ability to automatically relaunch failed tasks, Spot is almost always the recommended provisioning model.

        Note, however, that when choosing Spot instances, Tower will also create a dedicated queue for running the main Nextflow job using a single On-Demand instance in order to prevent any execution interruptions.
        :::

14. Enter the **Max CPUs** e.g. `64`. This is the maximum number of combined CPUs (the sum of all instances CPUs) AWS Batch will provision at any time.

15. Select **EBS Auto scale** to allow the EC2 virtual machines to dynamically expand the amount of available disk space during task execution.

        :::caution
        When running large AWS Batch clusters (hundreds of compute nodes or more), EC2 API rate limits may cause the deletion of unattached EBS volumes to fail. Volumes that remain active after Nextflow jobs have completed will incur additional costs, and should be manually deleted. Monitor your AWS account for any orphaned EBS volumes via the EC2 console, or with a Lambda function. See [here](https://aws.amazon.com/blogs/mt/controlling-your-aws-costs-by-deleting-unused-amazon-ebs-volumes/) for more information.
        :::

16. With the optional **Enable Fusion mounts (deprecated)** feature enabled, S3 buckets specified in **Pipeline work directory** and **Allowed S3 Buckets** are mounted as file system volumes in the EC2 instances carrying out the Batch job execution. These buckets can then be accessed at `/fusion/s3/<bucket-name>`. For example, if the bucket name is `s3://imputation-gp2`, your pipeline will access it using the file system path `/fusion/s3/imputation-gp2`. **Note:** This feature has been deprecated. Consider using Fusion v2 (see above) for enhanced performance and stability.

        :::tip
        You do not need to modify your pipeline or files to take advantage of this feature. Nextflow will automatically recognize and replace any reference to files prefixed with `s3://` with the corresponding Fusion mount paths.
        :::

17. Select **Enable GPUs** if you intend to run GPU-dependent workflows in the compute environment. See [GPU usage](./overview.mdx#aws-batch) for more information.

18. Select **Use Graviton CPU architecture** to deploy the pipeline execution on Graviton-based Ec2 instances (i.e. ARM64 CPU architecture). When enabling Tower automatically selects the following instance types for compute jobs: `m6g`, `r6g` and `c6g`. You can override them using the **Instance types** in the Advanced settings. Note: this feature requires Fargate, Wave service and Fusion v2 file system to be enabled; also it's not compatible with GPU-based architecture.

19. Enter any additional **Allowed S3 buckets** that your workflows require to read input data or write output data. The **Pipeline work directory** bucket above is added by default to the list of **Allowed S3 buckets**.

20. To use **EFS**, you can either select **Use existing EFS file system** and specify an existing EFS instance, or select **Create new EFS file system** to create one. If you intend to use the EFS file system as your work directory, you will need to specify `<your_EFS_mount_path>/work` in the **Pipeline work directory** field (step 8 of this guide).

    - To use an existing EFS file system, enter the **EFS file system id** and **EFS mount path**. This is the path where the EFS volume is accessible to the compute environment. For simplicity, we advise that you use `/mnt/efs` as the EFS mount path.
    - To create a new EFS file system, enter the **EFS mount path**. We advise that you specify `/mnt/efs` as the EFS mount path.
    - EFS file systems created by Batch Forge are automatically tagged in AWS with `Name=TowerForge-<id>`, with `<id>` being the compute environment ID. Any manually added Tower resource label with the key `Name` (capital N) will override the automatically-assigned `TowerForge-<id>` label.

21. To use **FSx for Lustre**, you can either select **Use existing FSx file system** and specify an existing FSx instance, or select **Create new FSx file system** to create one. If you intend to use the FSx file system as your work directory, you will need to specify `<your_FSx_mount_path>/work` in the **Pipeline work directory** field (step 8 of this guide).

    - To use an existing FSx file system, enter the **FSx DNS name** and **FSx mount path**. The FSx mount path is the path where the FSx volume is accessible to the compute environment. For simplicity, we advise that you use `/mnt/fsx` as the FSx mount path.
    - To create a new FSx file system, enter the **FSx size** (in GB) and the **FSx mount path**. We advise that you specify `/mnt/fsx` as the FSx mount path.
    - FSx file systems created by Batch Forge are automatically tagged in AWS with `Name=TowerForge-<id>`, with `<id>` being the compute environment ID. Any manually added Tower resource label with the key `Name` (capital N) will override the automatically-assigned `TowerForge-<id>` label.

22. Select **Dispose resources** if you want Tower to automatically delete these AWS resources if you delete the compute environment in Tower.

23. Apply [**Resource labels**](../resource-labels/overview.mdx) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.

24. Expand **Staging options** to include optional pre- or post-run Bash scripts that execute before or after the Nextflow pipeline execution in your environment.

25. You can use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

26. Configure any advanced options described below, as needed.

27. Select **Create** to finalize the compute environment setup. It will take a few seconds for all the resources to be created, and then you will be ready to launch pipelines.

Jump to the documentation for [launching pipelines](../launch/launchpad.mdx).

### Advanced options

- Specify the **Allocation strategy** and indicate any preferred **Instance types**. AWS applies quotas for the number of running and requested [Spot](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-limits.html) and [On-Demand](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#ec2-on-demand-instances-limits) instances per account. AWS will [allocate](https://aws.amazon.com/ec2/faqs/#how-many-instances-ec2) instances from up to 20 instance types, based on those requested for the compute environment. AWS excludes the largest instances when you request more than 20 instance types.

- Configure a custom networking setup using the **VPC ID**, **Subnets**, and **Security groups** fields.

- You can specify a custom **AMI ID**.

    :::caution
    To use a custom AMI, make sure the AMI is based on an Amazon Linux-2 ECS optimized image that meets the Batch requirements. To learn more about approved versions of the Amazon ECS optimized AMI, see [this AWS guide](https://docs.aws.amazon.com/batch/latest/userguide/compute_resource_AMIs.html#batch-ami-spec)
    :::

    :::caution
    If a custom AMI is specified and the **Enable GPU** option is also selected, the custom AMI will be used instead of the AWS-recommended GPU-optimized AMI.
    :::

- If you need to debug the EC2 instance provisioned by AWS Batch, specify a **Key pair** to log in to the instance via SSH.

- You can set **Min CPUs** to be greater than `0`, in which case some EC2 instances will remain active. An advantage of this is that pipeline executions will initialize faster.

    :::caution
    Setting Min CPUs to a value greater than 0 will keep the required compute instances active, even when your pipelines are not running. This will result in additional AWS charges.
    :::

- Use **Head Job CPUs** and **Head Job Memory** to specify the hardware resources allocated for the Head Job.

- Use **Head Job role** and **Compute Job role** to grant fine-grained IAM permissions to the Head Job and Compute Jobs.

- Add an execution role ARN to the **Batch execution role** field to grant permissions to make API calls on your behalf to the ECS container used by Batch. This is required if the pipeline launched with this compute environment needs access to the secrets stored in this workspace. This field can be ignored if you are not using secrets.

- Specify an EBS block size (in GB) in the **EBS auto-expandable block size** field to control the initial size of the EBS auto-expandable volume. New blocks of this size are added when the volume begins to run out of free space.

- Enter the **Boot disk size** (in GB) to specify the size of the boot disk in the VMs created by this compute environment.

- If you're using **Spot** instances, you can also specify the **Cost percentage**, which is the maximum allowed price of a **Spot** instance as a percentage of the **On-Demand** price for that instance type. Spot instances will not be launched until the current Spot price is below the specified cost percentage.

- Use **AWS CLI tool path** to specify the location of the `aws` CLI.

- Specify a **CloudWatch Log group** for the `awslogs` driver to stream the logs entry to an existing Log group in Cloudwatch.

- Specify a custom **ECS agent configuration** for the ECS agent parameters used by AWS Batch. This is appended to the `/etc/ecs/ecs.config` file in each cluster node.

    :::note
    Altering this file may result in a malfunctioning Batch Forge compute environment. See [Amazon ECS container agent configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) to learn more about the available parameters.
    :::

## Manual

This section is for users with a pre-configured AWS environment. You will need a Batch queue, a Batch compute environment, an IAM user and an S3 bucket already set up.

To enable Tower within your existing AWS configuration, you need to have an IAM user with the following IAM permissions:

- `AmazonS3ReadOnlyAccess`
- `AmazonEC2ContainerRegistryReadOnly`
- `CloudWatchLogsReadOnlyAccess`
- A [custom policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/launch-policy.json) to grant the ability to submit and control Batch jobs.
- Write access to any S3 bucket used by pipelines with the following [policy template](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/s3-bucket-write.json). See below for details.

With these permissions set, we can add a new **AWS Batch** compute environment in Tower.

### Access to S3 Buckets

Tower can use S3 to store intermediate and output data generated by pipelines. You need to create a policy for your Tower IAM user that grants access to specific buckets.

1. Go to the IAM User table in the [IAM service](https://console.aws.amazon.com/iam/home)

2. Select the IAM user.

3. Select **Add inline policy**.

4. Copy the contents of [this policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/s3-bucket-write.json) into the **JSON** tab. Replace `YOUR-BUCKET-NAME` (lines 10 and 21) with your bucket name.

5. Name your policy and select **Create policy**.

### Compute environment

To create a new compute environment for AWS Batch (without Forge):

1. In a workspace, select **Compute environments** and then **New environment**.

2. Enter a descriptive name for this environment, e.g., "AWS Batch Manual (eu-west-1)".

3. Select **Amazon Batch** as the target platform.

4. Add new credentials by selecting the **+** button.

5. Enter a name for the credentials, e.g., "AWS Credentials".

6. Enter the **Access key** and **Secret key** for your IAM user.

    :::tip
    You can create multiple credentials in your Tower environment. See the [Credentials](../credentials/overview.mdx) section.
    :::

7. Select a **Region**, e.g., "eu-west-1 - Europe (Ireland)".

8. Enter an S3 bucket path for the **Pipeline work directory**, e.g., `s3://tower-bucket`.

9. Set the **Config mode** to **Manual**.

10. Enter the **Head queue**, which is the name of the AWS Batch queue that the Nextflow driver job will run.

11. Enter the **Compute queue**, which is the name of the AWS Batch queue that tasks will be submitted to.

12. Use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

13. Configure any advanced options described below, as needed.

14. Select **Create** to finalize the compute environment setup.

Jump to the documentation for [launching pipelines](../launch/launchpad.mdx).

### Advanced options

- Use **Head Job CPUs** and **Head Job Memory** to specify the hardware resources allocated for the Head Job.

- Use **Head Job role** and **Compute Job role** to grant fine-grained IAM permissions to the Head Job and Compute Jobs

- Add an execution role ARN to the **Batch execution role** field to grant permissions to make API calls on your behalf to the ECS container used by Batch. This is required if the pipeline launched with this compute environment needs access to the secrets stored in this workspace. This field can be ignored if you are not using secrets.

- Use **AWS CLI tool path** to specify the location of the `aws` CLI.

- Specify a **CloudWatch Log group** for the `awslogs` driver to stream the logs entry to an existing Log group in Cloudwatch.


[quota]: https://docs.aws.amazon.com/batch/latest/userguide/service_limits.html

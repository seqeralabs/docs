---
title: "AWS Batch"
description: "Instructions to set up AWS Batch in Seqera Platform"
date created: "2023-04-21"
last updated: "2025-12-18"
tags: [aws, batch, compute environment]
---

:::tip
This guide assumes you have an existing [Amazon Web Service (AWS)](https://aws.amazon.com/) account.

The AWS Batch service quota for job queues is 50 per account. For more information on AWS Batch service quotas, see [AWS Batch service quotas](https://docs.aws.amazon.com/batch/latest/userguide/service_limits.html).
:::

There are two ways to create a Seqera Platform compute environment for AWS Batch:

- [**Automatically**](#automatic-configuration-of-batch-resources): this option lets Seqera automatically create the required AWS Batch resources in your AWS account, using an internal tool within Seqera Platform called "Forge". This removes the need to set up your AWS Batch infrastructure manually. Resources can also be automatically deleted when the compute environment is removed from Platform.
- [**Manually**](#manual-configuration-of-batch-resources): this option lets Seqera use existing AWS Batch resources previously created.

Both options require specific IAM permissions to function correctly, as well as access to an S3 bucket or EFS/FSx file system to store intermediate Nextflow files.

## S3 bucket creation

AWS S3 (Simple Storage Service) is a type of **object storage**. To access input and output files using Seqera products like [Studios](../data_studios/overview) and [Data Explorer](../data/data-explorer) create one or more **S3 buckets**. An S3 bucket can also be used to store intermediate results of your Nextflow pipelines, as an alternative to using EFS or FSx file systems.
:::note
Using EFS or FSx as work directory is incompatible with Studios.
:::

1. Navigate to the [AWS S3 console](https://console.aws.amazon.com/s3/home).
1. In the top right of the page, select the same region where you plan to create your AWS Batch compute environment.
1. Select **Create bucket**.
1. Enter a unique name for your bucket.
1. Leave the rest of the options as default and select **Create bucket**.

:::note
S3 can be used by Nextflow for the storage of intermediate files. In production pipelines, this can amount to a lot of data. To reduce costs, consider using a retention policy when creating a bucket, such as automatically deleting intermediate files after 30 days. See the [AWS documentation](https://aws.amazon.com/premiumsupport/knowledge-center/s3-empty-bucket-lifecycle-rule/) for more information.
:::

## EFS or FSx file system creation

[AWS Elastic File System (EFS)](https://aws.amazon.com/efs/) and [AWS FSx for Lustre](https://aws.amazon.com/fsx/lustre/) are types of **file storage** that can be used as a Nextflow work directory to store intermediate files, as an alternative to using S3 buckets.

:::note
Using EFS or FSx as work directory is incompatible with Studios.
:::

To use EFS or FSx as your Nextflow work directory, create an EFS or FSx file system in the same region where you plan to create your AWS Batch compute environment.

The creation of an EFS or FSx file system can be done automatically by Seqera when creating the AWS Batch compute environment, or manually by following the steps below. If you let Seqera create the file system automatically, it will also be deleted when the compute environment is removed from Platform, unless the "Dispose Resources" option is disabled in the advanced options.

### Creating an EFS file system

To create a new EFS file system manually, visit the [EFS console](https://console.aws.amazon.com/efs/home).

1. Select **Create file system**.
1. Optionally give it a name, then select the VPC where your AWS Batch compute environment will be created.
1. Leave the rest of the options as default and select **Create file system**.

### Creating an FSx file system

To create a new FSx for Lustre file system manually, visit the [FSx console](https://console.aws.amazon.com/fsx/home).

1. Select **Create file system**.
1. Select FSx for Lustre
1. Follow the prompts to configure the file system according to your requirements, then select **Next**.
1. Review the configuration and select **Create file system**.

Make sure the [Lustre client](https://docs.aws.amazon.com/fsx/latest/LustreGuide/install-lustre-client.html) is available in the AMIs used by your AWS Batch compute environment to allow mounting FSx file systems.

## Required Platform IAM permissions

To create and launch pipelines, explore buckets with Data Explorer or run Studio sessions with the AWS Batch compute environment, an IAM user with specific permissions must be provided. Some permissions are mandatory for the compute environment to be created and function correctly, while others are optional and used for example to provide list of values to pick from in the Platform UI.

Permissions can be attached directly to an [IAM user](#iam-user-creation), or to an [IAM role](#iam-role-creation-optional) that the IAM user can assume when accessing AWS resources.

A permissive and broad policy with all the required permissions is provided here for a quick start. However, we recommend following the principle of least privilege and only granting the necessary permissions for your use case, as shown in the following sections.

<details>
<summary>Full permissive policy (for reference)</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BatchEnvironmentManagementCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "batch:CreateComputeEnvironment",
        "batch:CreateJobQueue",
        "batch:DeleteComputeEnvironment",
        "batch:DeleteJobQueue",
        "batch:DescribeComputeEnvironments",
        "batch:DescribeJobQueues",
        "batch:UpdateComputeEnvironment",
        "batch:UpdateJobQueue"
      ],
      "Resource": [
        "arn:aws:batch:*:*:compute-environment/TowerForge-*",
        "arn:aws:batch:*:*:job-queue/TowerForge-*"
      ]
    },
    {
      "Sid": "BatchJobsManagementCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "batch:CancelJob",
        "batch:DescribeJobDefinitions",
        "batch:DescribeJobs",
        "batch:ListJobs",
        "batch:RegisterJobDefinition",
        "batch:SubmitJob",
        "batch:TagResource",
        "batch:TerminateJob"
      ],
      "Resource": "*"
    },
    {
      "Sid": "LaunchTemplateManagement",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateLaunchTemplate",
        "ec2:DeleteLaunchTemplate",
        "ec2:DescribeLaunchTemplates",
        "ec2:DescribeLaunchTemplateVersions"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PassRolesToBatchCanBeRestricted",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": [
            "batch.amazonaws.com",
            "ec2.amazonaws.com"
          ]
        }
      }
    },
    {
      "Sid": "CloudWatchLogsAccessCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "logs:Describe*",
        "logs:FilterLogEvents",
        "logs:Get*",
        "logs:List*",
        "logs:StartQuery",
        "logs:StopQuery",
        "logs:TestMetricFilter"
      ],
      "Resource": "*"
    },
    {
      "Sid": "OptionalS3PlatformDataAccessCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "s3:Get*",
        "s3:List*",
        "s3:PutObject"
      ],
      "Resource": "*"
    },
    {
      "Sid": "OptionalIAMManagementCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "iam:AddRoleToInstanceProfile",
        "iam:AttachRolePolicy",
        "iam:CreateInstanceProfile",
        "iam:CreateRole",
        "iam:DeleteInstanceProfile",
        "iam:DeleteRole",
        "iam:DeleteRolePolicy",
        "iam:DetachRolePolicy",
        "iam:GetRole",
        "iam:ListAttachedRolePolicies",
        "iam:ListRolePolicies",
        "iam:PutRolePolicy",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:TagInstanceProfile",
        "iam:TagRole"
      ],
      "Resource": "arn:aws:iam::*:role/TowerForge-*"
    },
    {
      "Sid": "OptionalFetchOptimizedAMIMetadata",
      "Effect": "Allow",
      "Action": "ssm:GetParameters",
      "Resource": "arn:aws:ssm:*:*:parameter/aws/service/ecs/*"
    },
    {
      "Sid": "OptionalEC2MetadataDescribe",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeAccountAttributes",
        "ec2:DescribeImages",
        "ec2:DescribeInstanceTypeOfferings",
        "ec2:DescribeInstanceTypes",
        "ec2:DescribeKeyPairs",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs"
      ],
      "Resource": "*"
    },
    {
      "Sid": "OptionalFSXManagementCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "fsx:CreateFileSystem",
        "fsx:DeleteFileSystem",
        "fsx:DescribeFileSystems",
        "fsx:TagResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "OptionalEFSManagementCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "elasticfilesystem:CreateFileSystem",
        "elasticfilesystem:DeleteFileSystem",
        "elasticfilesystem:CreateMountTarget",
        "elasticfilesystem:DeleteMountTarget",
        "elasticfilesystem:DescribeFileSystems",
        "elasticfilesystem:DescribeMountTargets",
        "elasticfilesystem:UpdateFileSystem",
        "elasticfilesystem:PutLifecycleConfiguration",
        "elasticfilesystem:TagResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "OptionalPipelineSecretsListing",
      "Effect": "Allow",
      "Action": "secretsmanager:ListSecrets",
      "Resource": "*"
    },
    {
      "Sid": "OptionalPipelineSecretsManagementCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:DescribeSecret",
        "secretsmanager:DeleteSecret",
        "secretsmanager:CreateSecret"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:tower-*"
    }
  ]
}
```

</details>

### AWS Batch management

The first section of the policy allows Seqera to create, update and delete Batch compute environments ("CE"), job queues ("JQ") and jobs.

If you are required to use manually created CEs and JQs or prefer not to let Seqera manage their lifecycle for you, you can restrict the permissions to the specific Batch resources you created in your account and region; you can also restrict permissions based on Resource tag, which need to be defined by users when [setting up a pipeline in Platform](https://docs.seqera.io/platform-enterprise/resource-labels/overview).

```json
{
  "Sid": "BatchEnvironmentManagement",
  "Effect": "Allow",
  "Action": [
    "batch:DescribeComputeEnvironments",
    "batch:DescribeJobQueues"
  ],
  "Resource": [
    "arn:aws:batch:<REGION>:<ACCOUNT_ID>:compute-environment/MyManualCE",
    "arn:aws:batch:<REGION>:<ACCOUNT_ID>:job-queue/MyManualJQ"
  ],
  "Condition": {
    "StringEqualsIfExists": {
      "aws:ResourceTag/MyCustomTag": "MyCustomValue"
    }
  }
},
{
  "Sid": "BatchJobsManagement",
  "Effect": "Allow",
  "Action": [
    "batch:CancelJob",
    "batch:DescribeJobDefinitions",
    "batch:DescribeJobs",
    "batch:ListJobs",
    "batch:RegisterJobDefinition",
    "batch:SubmitJob",
    "batch:TagResource",
    "batch:TerminateJob"
  ],
  "Resource": [
    "arn:aws:batch:<REGION>:<ACCOUNT_ID>:job-definition/*",
    "arn:aws:batch:<REGION>:<ACCOUNT_ID>:job/*"
  ],
  "Condition": {
    "StringEqualsIfExists": {
      "aws:ResourceTag/MyCustomTag": "MyCustomValue"
    }
  }
}
```

:::warning
Restricting the `batch` actions using resource tags requires that you set the appropriate tags on each Seqera pipeline when configuring it in Platform. Forgetting to set the tag will cause the pipeline to fail to run.
:::

The job definition and job name resources cannot be restricted to specific names, as Seqera creates job definitions and jobs with dynamic names. Therefore, the wildcard `*` must be used for these resources.

If you prefer to let Seqera manage Batch resources for you, you can still restrict the permissions to specific resources in your account ID and region; you can also restrict permissions based on Resource tag, as shown with the `Condition`s in the example above.

:::note
The quick start policy is expecting CE and JQ names automatically created by Seqera to start with the `TowerForge-` prefix, which is the default prefix used by Platform Enterprise. If you [customized it on your Enterprise installations](../enterprise/configuration/overview#compute-environments) with `TOWER_FORGE_PREFIX` adapt the policy to the new prefix.
:::

### Launch template management

Seqera requires the ability to create and manage EC2 launch templates using optimized AMIs identified via AWS Systems Manager (SSM).

:::note
AWS does not support restricting IAM permissions on EC2 launch templates based on specific resource names or tags. As a result, permission to operate on any resource `*` must be granted.
:::

### Pass role to Batch

The `iam:PassRole` permission allows Seqera to pass [execution IAM roles](https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html#create-execution-role) to AWS Batch to run Nextflow pipelines.

Permissions can be restricted to only allow passing the manually created roles or the roles created by Seqera automatically with the default prefix `TowerForge-` to the AWS Batch and EC2 services, in a specific account:

```json
{
  "Sid": "PassRolesToBatch",
  "Effect": "Allow",
  "Action": "iam:PassRole",
  "Resource": "arn:aws:iam::<ACCOUNT_ID>:role/TowerForge-*",
  "Condition": {
    "StringEquals": {
      "iam:PassedToService": [
        "batch.amazonaws.com",
        "ec2.amazonaws.com"
      ]
    }
  }
}
```

### CloudWatch logs access

Seqera requires access to CloudWatch logs to display relevant log data in the web interface.

The policy can be scoped down to limit access to the [specific log group](#advanced-options) defined on the compute environment in a specific account and region:

```json
{
  "Sid": "CloudWatchLogsAccess",
  "Effect": "Allow",
  "Action": [
    "logs:Describe*",
    "logs:FilterLogEvents",
    "logs:Get*",
    "logs:List*",
    "logs:StartQuery",
    "logs:StopQuery",
    "logs:TestMetricFilter"
  ],
  "Resource": "arn:aws:logs:<REGION>:<ACCOUNT_ID>:log-group:/aws/batch/job/*"
}
```

### S3 access (optional)

Seqera offers several products to manipulate data on AWS S3 buckets, such as [Studios](../data_studios/overview) and [Data Explorer](../data/data-explorer); in addition to that, Seqera automatically fetches the list of buckets available in the AWS accounts connected to Platform, to provide them in a dropdown menu to be used as Nextflow working directory. The Studios and Data Explorer features are optional, and users can type the bucket name manually when creating pipelines, so this section of the policy is optional and can be omitted if these features are not used.

The policy can be scoped down to only allow limited Read/Write permissions in certain S3 buckets used by Studios/Data Explorer, and to allow listing all the buckets in the account to populate the dropdown menu in the UI (the `s3:ListAllMyBuckets` action must have `Resource` set to `*` because it is not possible to restrict it to specific buckets).

```json
{
  "Sid": "S3ListBuckets",
  "Effect": "Allow",
  "Action": "s3:ListAllMyBuckets",
  "Resource": "*"
},
{
  "Sid": "S3ReadWriteBucketsForStudiosDataExplorer",
  "Effect": "Allow",
  "Action": [
    "s3:Get*",
    "s3:List*",
    "s3:PutObject"
  ],
  "Resource": [
    "arn:aws:s3:::example-bucket-read-write-studios",
    "arn:aws:s3:::example-bucket-read-write-studios/*",
    "arn:aws:s3:::example-bucket-read-write-data-explorer",
    "arn:aws:s3:::example-bucket-read-write-data-explorer/*"
  ]
}
```

:::note
If you opted to create a separate S3 bucket only for Nextflow work directories, there is no need for the IAM user to have access to it: if Platform is allowed to manage resources (using Batch Forge) the IAM roles automatically created will have the necessary permissions; if you set up the compute environment manually, you can create the required IAM roles with the necessary permissions as detailed in the [manual AWS Batch setup documentation](../enterprise/advanced-topics/manual-aws-batch-setup).
:::

### IAM roles for AWS Batch (optional)

Seqera can automatically create the IAM roles needed to interact with AWS Batch and other AWS services. You can opt out of this behavior by creating the required IAM roles manually and providing their ARNs during compute environment creation in Platform: refer to the [documentation](../enterprise/advanced-topics/manual-aws-batch-setup) for more details on how to manually set up IAM roles.

To allow Seqera to create IAM roles but restrict it to your specific account and the default IAM role prefix, use the following statement:

```json
{
  "Sid": "IAMRoleAndProfileManagement",
  "Effect": "Allow",
  "Action": [
    "iam:AddRoleToInstanceProfile",
    "iam:AttachRolePolicy",
    "iam:CreateInstanceProfile",
    "iam:CreateRole",
    "iam:DeleteInstanceProfile",
    "iam:DeleteRole",
    "iam:DeleteRolePolicy",
    "iam:DetachRolePolicy",
    "iam:GetRole",
    "iam:ListAttachedRolePolicies",
    "iam:ListRolePolicies",
    "iam:PutRolePolicy",
    "iam:RemoveRoleFromInstanceProfile",
    "iam:TagInstanceProfile",
    "iam:TagRole"
  ],
  "Resource": "arn:aws:iam::<ACCOUNT_ID>:role/TowerForge-*"
}
```

:::note
The quick start policy is expecting role names automatically created by Seqera to start with the `TowerForge-` prefix, which is the default prefix used by Platform Enterprise. If you [customized it on your Enterprise installations](../enterprise/configuration/overview#compute-environments) with `TOWER_FORGE_PREFIX` adapt the policy to the new prefix.
:::

### AWS Systems Manager (optional)

Seqera Platform can interact with AWS Systems Manager (SSM) to [identify ECS Optimized AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/retrieve-ecs-optimized_AMI.html) for pipeline execution. This permission is optional, meaning that a [custom AMI ID](#advanced-options) can be provided at compute environment creation, removing the need for this permission.

### EC2 describe permissions (optional)

Seqera can interact with EC2 to retrieve information about existing AWS resources in your account, including VPCs, subnets, and security groups. This data is used to populate dropdown menus in the Platform UI when creating new compute environments. While these permissions are optional, they are recommended to enhance the user experience. Without these permissions, resource ARNs need to be manually entered in the interface by the user.

:::note
AWS does not support restricting IAM permissions on EC2 Describe actions based on specific resource names or tags. As a result, permission to operate on any resource `*` must be granted.
:::

### FSx file systems (optional)

Seqera can manage [AWS FSx file systems](https://aws.amazon.com/fsx/), if needed by the pipelines.

This section of the policy is optional and can be omitted if FSx file systems are not used by your pipelines. The describe actions cannot be restricted to specific resources, so permission to operate on any resource `*` must be granted. The management actions can be restricted to specific resources, like in the example below.

```json
{
  "Sid": "FSxDescribe",
  "Effect": "Allow",
  "Action": [
    "fsx:DescribeFileSystems"
  ],
  "Resource": "*"
},
{
  "Sid": "FSxManagement",
  "Effect": "Allow",
  "Action": [
    "fsx:CreateFileSystem",
    "fsx:DeleteFileSystem",
    "fsx:TagResource"
  ],
  "Resource": "arn:aws:fsx:<REGION>:<ACCOUNT_ID>:file-system/MyManualFSx"
}
```

### EFS file systems (optional)

Seqera can manage [AWS EFS file systems](https://aws.amazon.com/efs/), if needed by the pipelines.

This section of the policy is optional and can be omitted if EFS file systems are not used by your pipelines. The describe actions cannot be restricted to specific resources, so permission to operate on any resource `*` must be granted. The management actions can be restricted to specific resources, like in the example below.

```json
{
  "Sid": "EFSDescribe",
  "Effect": "Allow",
  "Action": [
    "elasticfilesystem:DescribeFileSystems",
    "elasticfilesystem:DescribeMountTargets"
  ],
  "Resource": "*"
},
{
  "Sid": "EFSManagement",
  "Effect": "Allow",
  "Action": [
    "elasticfilesystem:CreateFileSystem",
    "elasticfilesystem:DeleteFileSystem",
    "elasticfilesystem:CreateMountTarget",
    "elasticfilesystem:DeleteMountTarget",
    "elasticfilesystem:UpdateFileSystem",
    "elasticfilesystem:PutLifecycleConfiguration",
    "elasticfilesystem:TagResource"
  ],
  "Resource": "arn:aws:elasticfilesystem:<REGION>:<ACCOUNT_ID>:file-system/MyManualEFS"
}
```

### Pipeline secrets (optional)

Seqera can synchronize [pipeline secrets](../secrets/overview) defined on the Platform workspace with AWS Secrets Manager, which requires additional permissions on the IAM user. If you do not plan to use pipeline secrets, you can omit this section of the policy.

The listing of secrets cannot be restricted, but the management actions can be restricted to only allow managing secrets in a specific account and region, which must be the same region where the pipeline runs. Note that Seqera only creates secrets with the `tower-` prefix.

```json
{
  "Sid": "PipelineSecretsListing",
  "Effect": "Allow",
  "Action": "secretsmanager:ListSecrets",
  "Resource": "*"
},
{
  "Sid": "PipelineSecretsManagementCanBeRestricted",
  "Effect": "Allow",
  "Action": [
    "secretsmanager:DescribeSecret",
    "secretsmanager:DeleteSecret",
    "secretsmanager:CreateSecret"
  ],
  "Resource": "arn:aws:secretsmanager:<REGION>:<ACCOUNT_ID>:secret:tower-*"
}
```

#### Additional steps required to use secrets in a pipeline

To successfully use pipeline secrets, the IAM roles manually created must follow the steps detailed in the [documentation](../secrets/overview#aws-secrets-manager-integration).

## Create the IAM policy

The policy above must be created in the AWS account where the AWS Batch resources need to be created.

1. Open the [AWS IAM console](https://console.aws.amazon.com/iam) in the account where you want to create the AWS Batch resources.
1. From the left navigation menu, select **Policies** under **Access management**.
1. Select **Create policy**.
1. On the **Policy editor** section, select the **JSON** tab.
1. Following the instructions detailed in the [IAM permissions breakdown section](#required-platform-iam-permissions) replace the default text in the policy editor area under the **JSON** tab with a policy adapted to your use case, then select **Next**.
1. Enter a name and description for the policy on the **Review and create** page, then select **Create policy**.

## IAM user creation

Seqera requires an Identity and Access Management (IAM) User to create and manage AWS Batch resources in your AWS account.

In certain scenarios, for example when multiple users need to access the same AWS account and provision AWS Batch resources, an IAM role with the required permissions can be created instead, and the IAM user can assume that role when accessing AWS resources, as detailed in the [IAM role creation (optional)](#iam-role-creation-optional) section.

Depending whether you choose to let Seqera automatically create the required AWS Batch resources in your account, or prefer to set them up manually, the IAM user must have specific permissions as detailed in the [Required Platform IAM permissions](#required-platform-iam-permissions) section. Alternatively, you can create an IAM role with the required permissions and allow the IAM user to assume that role when accessing AWS resources, as detailed in the [IAM role creation (optional)](#iam-role-creation-optional) section.

### Create an IAM user

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Users** in the left navigation menu, then select **Create User** at the top right of the page.
1. Enter a name for your user (e.g., _seqera_) and select **Next**.
1. Under **Permission options**, select **Attach policies directly**, then search for and select the policy created above, and select **Next**.
   * If you prefer to make the IAM user assume a role to manage AWS resources (see the [IAM role creation (optional)](#iam-role-creation-optional) section), create a policy with the following content (edit the AWS principal with the ARN of the role created) and attach it to the IAM user:

   ```json
   {
     "Sid": "AssumeRoleToManageBatchResources",
     "Effect": "Allow",
     "Action": "sts:AssumeRole",
     "Resource": "arn:aws:iam::<ACCOUNT_ID>:role/<IAM_ROLE_NAME>"
   }
   ```
1. On the last page, review the user details and select **Create user**.

The user has now been created. The most up-to-date instructions for creating an IAM user can be found in the [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).

### Obtain IAM user credentials

To get the credentials needed to connect Seqera to your AWS account, follow these steps:

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Users** in the left navigation menu, then select the newly created user from the users table.
1. Select the **Security credentials** tab, then select **Create access key** under the **Access keys** section.
1. In the **Use case** dialog that appears, select **Command line interface (CLI)**, then tick the confirmation checkbox at the bottom to acknowledge that you want to proceed creating an access key, and select **Next**.
1. Optionally provide a description for the access key, like the reason for creating it, then select **Create access key**.
1. Save the **Access key** and **Secret access key** in a secure location as you will need to provide them when creating credentials in Seqera.

## IAM role creation (optional)

Rather than attaching permissions directly to the IAM user, you can create an IAM role with the required permissions and allow the IAM user to assume that role when accessing AWS resources. This is useful when multiple IAM users are used to access the same AWS account: this way the actual permissions to operate on the resources are only granted to a single centralized role.

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Roles** in the left navigation menu, then select **Create role** at the top right of the page.
1. Select **Custom trust policy** as the type of trusted entity, provide the following policy and edit the AWS principal with the ARN of the IAM user created in the [IAM user creation](#iam-user-creation) section, then select **Next**.
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": [
              "arn:aws:iam::<ACCOUNT_ID>:user/<IAM_USER_NAME>"
            ]
         },
         "Action": "sts:AssumeRole"
       }
     ]
   }
   ```
1. On the **Permissions** page, search for and select the policy created in the [IAM user creation](#iam-user-creation) section, then select **Next**.
1. Give the role a name and optionally a description, review the details of the role, optionally provide tags to help you identify the role, then select **Create role**.

Multiple users can be specified in the trust policy by adding more ARNs to the `Principal` section.

## Automatic configuration of Batch resources

Seqera automates the configuration of an [AWS Batch](https://aws.amazon.com/batch/) compute environment and the queues required for deploying Nextflow pipelines.

:::caution
AWS Batch creates resources that you may be charged for in your AWS account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

### AWS Batch

Seqera automates the configuration of an [AWS Batch](https://aws.amazon.com/batch/) compute environment and the queues required to deploy Nextflow pipelines. After your IAM user and S3 bucket have been set up, create a new **AWS Batch** compute environment in Seqera.

#### Create a Seqera AWS Batch compute environment

Seqera will create the head and compute [job queues](https://docs.aws.amazon.com/batch/latest/userguide/job_queues.html) and their respective [compute environments](https://docs.aws.amazon.com/batch/latest/userguide/compute_environments.html) where jobs will be executed. The job queues are configured with [job state limit actions](https://docs.aws.amazon.com/batch/latest/APIReference/API_JobStateTimeLimitAction.html) to automatically purge jobs that cannot be scheduled on any node type available for the compute environment.
Depending on the provided configuration in the UI, Seqera might also create IAM roles for Nextflow head job execution, CloudWatch log groups, EFS or FSx filesystems, etc.

1. After logging in to [Seqera](https://cloud.seqera.io) and selecting a workspace from the dropdown menu at the top of the page, select **Compute environments** from the navigation menu.
1. Select **Add compute environment**.
1. Enter a descriptive name for this environment, e.g., _AWS Batch Spot (eu-west-1)_.
1. Select **AWS Batch** as the target platform.
1. From the **Credentials** drop-down, select existing AWS credentials, or select **+** to add new credentials. If you're using existing credentials, skip to step 9.
    :::note
    You can create multiple credentials in your Seqera environment. See [Credentials](../credentials/overview).
    :::
1. Enter a name, e.g., _AWS Credentials_.
1. Add the **Access key** and **Secret key** you [previously obtained](#obtain-iam-user-credentials) when you created the Seqera IAM user.
1. (Optional) Under **Assume role**, specify the IAM role to be assumed by the Seqera IAM user to access the compute environment's AWS resources.
    :::note
    When using AWS keys without an assumed role, the associated AWS user must have been granted permissions to operate on the cloud resources directly. When an assumed role is provided, the IAM user keys are only used to retrieve temporary credentials impersonating the role specified: this could be useful when e.g. multiple IAM users are used to access the same AWS account, and the actual permissions to operate on the resources are only granted to the role.
    :::
1. Select a **Region**, e.g., _eu-west-1 - Europe (Ireland)_. This region must match the location of the S3 bucket or EFS/FSx file system you plan to use as work directory.
1. In the **Pipeline work directory** field type or select from the dropdown menu the S3 bucket [previously created](#s3-bucket-creation), e.g., `s3://seqera-bucket`. The work directory can be customized to specify a folder inside the bucket where Nextflow intermediate files will be stored, e.g., `s3://seqera-bucket/nextflow-workdir`. The bucket must be located in the same region chosen in the previous step.

    :::note
    When you specify an S3 bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://www.nextflow.io/docs/latest/cache-and-resume.html#cache-stores) by default. Seqera adds a `cloudcache` block to the Nextflow configuration file for all runs executed with this compute environment. This block includes the path to a `cloudcache` folder in your work directory, e.g., `s3://seqera-bucket/cloudcache/.cache`. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
    :::

   Similarly you can specify a path in an EFS or FSx file system as your work directory. When using EFS or FSx, you'll need to scroll down to "EFS file system" or "FSx for Lustre" sections to specify either an existing file system ID or let Seqera create a new one for you automatically. Read the notes in steps 23 and 24 below on how to setup EFS or FSx.

    :::warning
    Using an EFS or FSx file system as your work directory is currently incompatible with [Studios](../data_studios/overview), and will result in errors with checkpoints and mounted data. Use an S3 bucket as your work directory when using Studios.
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

1. Select **Enable Fusion Snapshots (beta)** to enable Fusion to automatically restore jobs that are interrupted when an AWS Spot instance reclamation occurs. Requires Fusion v2. See [Fusion Snapshots](https://docs.seqera.io/fusion/guide/snapshots) for more information.
1. Set the **Config mode** to **Batch Forge** to allow Seqera Platform to manage AWS Batch compute environments using the Forge tool.
1. Select a **Provisioning model**. To minimize compute costs select **Spot**. You can specify an allocation strategy and instance types under [**Advanced options**](#advanced-options). If advanced options are omitted, Seqera Platform 23.2 and later versions default to `BEST_FIT_PROGRESSIVE` for On-Demand and `SPOT_PRICE_CAPACITY_OPTIMIZED` for Spot compute environments.
    :::note
    You can create a compute environment that launches either Spot or On-Demand instances. Spot instances can cost as little as 20% of On-Demand instances, and with Nextflow's ability to automatically relaunch failed tasks, Spot is almost always the recommended provisioning model. Note, however, that when choosing Spot instances, Seqera will also create a dedicated queue for running the main Nextflow job using a single On-Demand instance to prevent any execution interruptions.

    From Nextflow version 24.10, the default Spot reclamation retry setting changed to `0` on AWS and Google. By default, no internal retries are attempted on these platforms. Spot reclamations now lead to an immediate failure, exposed to Nextflow in the same way as other generic failures (returning for example, `exit code 1` on AWS). Nextflow will treat these failures like any other job failure unless you actively configure a retry strategy.
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
1. To use an **EFS** file system in your pipeline, you can either select **Use existing EFS file system** and specify an existing EFS instance, or select **Create new EFS file system** to create one.

   To use the EFS file system as the work directory of the compute environment specify `<your_EFS_mount_path>/work` in the **Pipeline work directory** field (step 10 of this guide).
    - To use an existing EFS file system, enter the **EFS file system id** and **EFS mount path**. This is the path where the EFS volume is accessible to the compute environment. For simplicity, we recommend that you use `/mnt/efs` as the EFS mount path.
    - To create a new EFS file system, enter the **EFS mount path**. We advise that you specify `/mnt/efs` as the EFS mount path.
    - EFS file systems created by Batch Forge are automatically tagged in AWS with `Name=TowerForge-<id>`, with `<id>` being the compute environment ID. Any manually-added resource label with the key `Name` (capital N) will override the automatically-assigned `TowerForge-<id>` label.
    - A custom EC2 security group needs to be configured to allow the compute environment to access the EFS file system.
      * Visit the [AWS Console for Security groups](https://console.aws.amazon.com/ec2/home?#SecurityGroups) and switch to the region where your workload will run.
      * Select **Create security group**.
      * Enter a relevant name like `seqera-efs-access-sg` and description, e.g., _EFS access for Seqera Batch compute environment_.
      * Empty both **Inbound rules** and **Outbound rules** sections by deleting default rules.
      * Optionally add **Tags** to the security group, then select **Create security group**.
      * After creating the security group, select it from the security groups list, then select the **Inbound rules** tab and select **Edit inbound rules**.
      * Select **Add rule** and configure the new rule as follows:
        - **Type**: `NFS`
        - **Source**: `Custom` and enter the security group ID that you're editing (you can search for it by name, e.g., `seqera-efs-access-sg`). This allows resources associated with the same security group to communicate with each other.
      * Select **Save rules** to finalize the inbound rule configuration.
      * Repeat the same steps to add an outbound rule to allow all outbound traffic: set type `All traffic` and destination `Anywhere-IPv4`/`Anywhere-IPv6`.
      * See the [AWS documentation about EFS security groups](https://docs.aws.amazon.com/efs/latest/ug/network-access.html) for more information.
      * The Security group then needs to be defined in the **Advanced options** below to allow the compute environment to access the EFS file system.
    :::warning
    EFS file systems cannot be used as work directory for [Studios](../data_studios/overview), but can be mounted and used by applications running in Studios.
    :::

1. To use a **FSx for Lustre** file system in your pipeline, you can either select **Use existing FSx file system** and specify an existing FSx instance, or select **Create new FSx file system** to create one.

   To use the FSx file system as your work directory, specify `<your_FSx_mount_path>/work` in the **Pipeline work directory** field (step 10 of this guide).
    - To use an existing FSx file system, enter the **FSx DNS name** and **FSx mount path**. The FSx mount path is the path where the FSx volume is accessible to the compute environment. For simplicity, we recommend that you use `/mnt/fsx` as the FSx mount path.
    - To create a new FSx file system, enter the **FSx size** (in GB) and the **FSx mount path**. We advise that you specify `/mnt/fsx` as the FSx mount path.
    - FSx file systems created by Batch Forge are automatically tagged in AWS with `Name=TowerForge-<id>`, with `<id>` being the compute environment ID. Any manually-added resource label with the key `Name` (capital N) will override the automatically-assigned `TowerForge-<id>` label.
    - A custom EC2 security group needs to be configured to allow the compute environment to access the FSx file system.
      * Visit the [AWS Console for Security groups](https://console.aws.amazon.com/ec2/home?#SecurityGroups) and switch to the region where your workload will run.
      * Select **Create security group**.
      * Enter a relevant name like `seqera-fsx-access-sg` and description, e.g., _FSx access for Seqera Batch compute environment_.
      * Empty both **Inbound rules** and **Outbound rules** sections by deleting default rules.
      * Optionally add **Tags** to the security group, then select **Create security group**.
      * After creating the security group, select it from the security groups list, then select the **Inbound rules** tab and select **Edit inbound rules**.
      * Select **Add rule** and configure the new rule as follows:
        - **Type**: `Custom TCP`
        - **Port range**: `988`
        - **Source**: `Custom` and enter the security group ID that you're editing (you can search for it by name, e.g., `seqera-fsx-access-sg`). This allows resources associated with the same security group to communicate with each other.
      * Repeat the step to add another rule with:
        - **Type**: `Custom TCP`
        - **Port range**: `1018-1023`
        - **Source**: `Custom`, same as above.
      * Select **Save rules** to finalize the inbound rule configuration.
      * Repeat the same steps to add an outbound rule to allow all outbound traffic: set type `All traffic` and destination `Anywhere-IPv4`/`Anywhere-IPv6`.
      * See the [AWS documentation about FSx security groups](https://docs.aws.amazon.com/fsx/latest/LustreGuide/limit-access-security-groups.html) for more information.
      * The Security group then needs to be defined in the **Advanced options** below to allow the compute environment to access the FSx file system.
   - You may need to install the `lustre` client in the AMI used by your compute environment to access FSx file systems. See [Installing the Lustre client](https://docs.aws.amazon.com/fsx/latest/LustreGuide/install-lustre-client.html) for more information.
    :::warning
    FSx file systems cannot be used as work directory for [Studios](../studios/overview), but can be mounted and used by applications running in Studios.
    :::

1. Select **Dispose resources** to automatically delete all AWS resources created by Seqera Platform when you delete the compute environment, including EFS/FSx file systems.
1. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources produced by this compute environment. Workspace default resource labels are prefilled.
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

#### Seqera AWS Batch advanced options

- Specify the **Allocation strategy** and indicate any preferred **Instance types**. AWS applies quotas for the number of running and requested [Spot](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-limits.html) and [On-Demand](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html#ec2-on-demand-instances-limits) instances per account. AWS will allocate instances from up to 20 instance types, based on those requested for the compute environment. AWS excludes the largest instances when you request more than 20 instance types.

    :::note
    If these advanced options are omitted, allocation strategy defaults are `BEST_FIT_PROGRESSIVE` for On-Demand and `SPOT_PRICE_CAPACITY_OPTIMIZED` for Spot compute environments.
    :::
    :::caution
    Platform CLI (known as `tw`) v0.8 and earlier do not support the `SPOT_PRICE_CAPACITY_OPTIMIZED` allocation strategy in AWS Batch. You cannot currently use CLI to create or otherwise interact with AWS Batch Spot compute environments that use this allocation strategy.
    :::

- Configure a custom networking setup using the **VPC ID**, **Subnets**, and **Security groups** fields.
  * If not defined, the default VPC, subnets, and security groups for the selected region will be used.
  * When using EFS or FSx file systems, select the security group previously created to allow access to the file system. The VPC ID the security group belongs to needs to match the VPC ID defined for the Seqera Batch compute environment.
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

## Manual configuration of Batch resources

This section is for users with a pre-configured AWS environment: follow the [AWS Batch queue and compute environment creation instructions](../enterprise/advanced-topics/manual-aws-batch-setup.mdx) to set up the required AWS Batch resources in your account.

A [S3 bucket](#s3-bucket-creation) or EFS/FSx file system is required to store Nextflow intermediate files when using Seqera with AWS Batch.

Refer to the [IAM user creation](#iam-user-creation) section to ensure that your IAM user has the necessary permissions to run pipelines in Seqera Platform. Remove any permissions that are not required for your use case.

### Seqera manual compute environment

With your AWS environment and resources set up and your user permissions configured, create an AWS Batch compute environment in Seqera.

:::caution
AWS Batch creates resources that you may be charged for in your AWS account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

1. After logging in to your Seqera installation and selecting a workspace from the dropdown menu at the top of the page, select **Compute environments** from the navigation menu.
1. Select **Add compute environment**.
1. Enter a descriptive name for this environment, e.g., _AWS Batch Spot (eu-west-1)_.
1. Select **AWS Batch** as the target platform.
1. From the **Credentials** drop-down, select existing AWS credentials, or select **+** to add new credentials. If you're using existing credentials, skip to step 9.
    :::note
    You can create multiple credentials in your Seqera environment. See [Credentials](../credentials/overview).
    :::
1. Enter a name, e.g., _AWS Credentials_.
1. Add the **Access key** and **Secret key** you [previously obtained](#obtain-iam-user-credentials) when you created the Seqera IAM user.
1. (Optional) Under **Assume role**, specify the IAM role to be assumed by the Seqera IAM user to access the compute environment's AWS resources.
    :::note
    When using AWS keys without an assumed role, the associated AWS user must have been granted permissions to operate on the cloud resources directly. When an assumed role is provided, the IAM user keys are only used to retrieve temporary credentials impersonating the role specified: this could be useful when e.g. multiple IAM users are used to access the same AWS account, and the actual permissions to operate on the resources are only granted to the role.
    :::
1. Select a **Region**, e.g., _eu-west-1 - Europe (Ireland)_. This region must match the region where your S3 bucket or EFS/FSx work directory is located to avoid high data transfer costs.
1. Enter or select from the dropdown menu the S3 bucket [previously created](#s3-bucket-creation) in the **Pipeline work directory** field, e.g., `s3://seqera-bucket`. This bucket must be in the same region chosen in the previous step to avoid incurring high data transfer costs. The work directory can be customized to specify a folder inside the bucket, e.g., `s3://seqera-bucket/nextflow-workdir`.
    :::note
    When you specify an S3 bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://www.nextflow.io/docs/latest/cache-and-resume.html#cache-stores) by default. Seqera adds a `cloudcache` block to the Nextflow configuration file for all runs executed with this compute environment. This block includes the path to a `cloudcache` folder in your work directory, e.g., `s3://seqera-bucket/cloudcache/.cache`. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
    :::

   Similarly you can specify a path in an EFS or FSx file system as your work directory. When using EFS or FSx, you'll need to scroll down to "EFS file system" or "FSx for Lustre" sections to specify either an existing file system ID or let Seqera create a new one for you automatically. Read the notes in steps 23 and 24 below on how to setup EFS or FSx.

    :::warning
    Using an EFS or FSx file system as your work directory is currently incompatible with [Studios](../data_studios/overview), and will result in errors with checkpoints and mounted data. Use an S3 bucket as your work directory when using Studios.
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

1. Select **Enable Fusion Snapshots (beta)** to enable Fusion to automatically restore jobs that are interrupted when an AWS Spot instance reclamation occurs. Requires Fusion v2. See [Fusion Snapshots](https://docs.seqera.io/fusion/guide/snapshots) for more information.

1. Set the **Config mode** to **Manual**.
1. Enter the **Head queue** created following the [instructions](../enterprise/advanced-topics/manual-aws-batch-setup.mdx), which is the name of the AWS Batch queue that the Nextflow main job will run.
1. Enter the **Compute queue**, which is the name of the AWS Batch queue where tasks will be submitted.
1. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources produced by this compute environment. Workspace default resource labels are prefilled.
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

Seqera compute environments for AWS Batch include advanced options to configure resource allocation, execution roles, custom AWS CLI tool paths, and CloudWatch integration.

- Configure a custom networking setup using the **VPC ID**, **Subnets**, and **Security groups** fields.
  * If not defined, the default VPC, subnets, and security groups for the selected region will be used.
  * When using EFS or FSx file systems, select the security group previously created to allow access to the file system. The VPC ID the security group belongs to needs to match the VPC ID defined for the Seqera Batch compute environment.
- Use **Head Job CPUs** and **Head Job Memory** to specify the hardware resources allocated for the Nextflow head job. The default head job memory allocation is 4096 MiB.
- Use **Head Job role** and **Compute Job role** to grant fine-grained IAM permissions to the Head Job and Compute Jobs,
- Add an execution role ARN to the **Batch execution role** field to grant permissions to make API calls on your behalf to the ECS container used by Batch. This is required if the pipeline launched with this compute environment needs access to the secrets stored in this workspace. This field can be ignored if you are not using secrets.
- Use **AWS CLI tool path** to specify the location of the `aws` CLI.
- Specify a **CloudWatch Log group** for the `awslogs` driver to stream the logs entry to an existing Log group in Cloudwatch.

:::caution
Seqera is designed to terminate compute resources when a Nextflow pipeline completes or is canceled. However, due to external factors — including user-defined workflow logic, transient cloud faults, or abnormal pipeline exits — residual resources may persist. While Seqera provides visibility to detect and resolve these states, customers are responsible for final resource cleanup and ensuring compute environments operate according to Platform expectations.

From Nextflow v24.10+, compute jobs are identifiable by Seqera workflow ID. If you search your AWS console/CLI/API for jobs prefixed by a given workflow ID, you can check the status and perform additional cleanup in edge case scenarios.
:::

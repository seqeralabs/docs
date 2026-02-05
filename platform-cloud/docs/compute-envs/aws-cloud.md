---
title: "AWS Cloud"
description: "Instructions to set up an AWS Cloud CE in Seqera Platform"
date created: "2025-05-15"
last updated: "2026-01-30"
tags: [cloud, vm, amazon, compute environment]
---

# AWS Cloud

:::note
This compute environment type is currently in public preview. Please consult this guide for the latest information on recommended configuration and limitations. This guide assumes you already have an AWS account with a valid AWS subscription.
:::

Many of the current implementations of compute environments for cloud providers rely on the use of batch services such as AWS Batch, Azure Batch, and Google Batch for the execution and management of submitted jobs, including pipelines and Studio session environments. Batch services are suitable for large-scale workloads, but they add management complexity. In practical terms, the currently used batch services result in some limitations:

- **Long launch delay**: When you launch a pipeline or Studio in a batch compute environment, there's a delay of several minutes before the pipeline or Studio session environment is in a running state. This is caused by the batch services that need to provision the associated compute service to run a single job.
- **Complex setup**: Standard batch services require complex identity management policies and configuration of multiple services including compute environments, job queues, job definitions, etc.
- **Allocation constraints**: AWS Batch and other cloud batch services have strict resource quotas. For example, a hard limit of 50 job queues per AWS account per region. This means that no new compute environment can be created when this quota limit is reached.

The AWS Cloud compute environment addresses these pain points with:

- **Faster startup time**: Nextflow pipelines reach a `Running` status and Studio sessions connect in under a minute (a 4x improvement compared to classic AWS Batch compute environments).
- **Simplified configuration**: Fewer configurable options, with opinionated defaults, provide the best Nextflow pipeline and Studio session execution environment, with both Wave and Fusion enabled.
- **Fewer AWS dependencies**: Only one IAM role in AWS is required. IAM roles are subject to a 1000 soft limit per AWS account.
- **Spot instances**: Studios can be launched on a Spot instance.

This type of compute environment is best suited to run Studios and small to medium-sized pipelines. It offers more predictable compute pricing, given the fixed instance types. It spins up a standalone EC2 instance and executes a Nextflow pipeline or Studio session with a local executor on the EC2 machine. At the end of the execution, the instance is terminated.

## Limitations

- The Nextflow pipeline will run entirely on a single EC2 instance. If the instance does not have sufficient resources, the pipeline execution will fail. For this reason, the number of tasks Nextflow can execute in parallel is limited by the number of cores of the instance type selected. If you need more computing resources, you must create a new compute environment with a larger instance type. This makes the compute environment less suited for larger, more complex pipelines.

## Supported regions

The following regions are currently supported:

- `af-south-1`
- `ap-east-1`
- `ap-northeast-1`
- `ap-northeast-2`
- `ap-northeast-3`
- `ap-south-1`
- `ap-southeast-1`
- `ap-southeast-2`
- `ap-southeast-3`
- `ca-central-1`
- `eu-central-1`
- `eu-north-1`
- `eu-south-1`
- `eu-west-1`
- `eu-west-2`
- `eu-west-3`
- `me-south-1`
- `sa-east-1`
- `us-east-1`
- `us-east-2`
- `us-west-1`
- `us-west-2`

## Required Platform IAM permissions

To create and launch pipelines, explore buckets with Data Explorer or run Studio sessions with the AWS Cloud compute environment, an IAM user with specific permissions must be provided. Some permissions are mandatory for the compute environment to be created and function correctly, while others are optional and used for example to provide list of values to pick from in the Platform UI.

Permissions can be attached directly to an [IAM user](#iam-user-creation), or to an [IAM role](#iam-role-creation-optional) that the IAM user can assume when accessing AWS resources.

A permissive and broad policy with all the required permissions is provided here for a quick start. However, follow the principle of least privilege and only grant the necessary permissions for your use case, as shown in the following sections.

<details>
<summary>Full permissive policy (For reference)</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AwsCloudCreate",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:AddRoleToInstanceProfile",
        "iam:CreateInstanceProfile",
        "iam:AttachRolePolicy",
        "iam:PutRolePolicy",
        "iam:TagRole",
        "iam:TagInstanceProfile"
      ],
      "Resource": [
        "arn:aws:iam::*:role/TowerForge-*",
        "arn:aws:iam::*:instance-profile/TowerForge-*"
      ]
    },
    {
      "Sid": "AwsCloudCreatePassRole",
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::*:role/TowerForge-*"
    },
    {
      "Sid": "AwsCloudLaunchEC2",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateTags",
        "ec2:DeleteTags",
        "ec2:DescribeInstances",
        "ec2:RunInstances",
        "ec2:TerminateInstances"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AwsCloudLaunchLogs",
      "Effect": "Allow",
      "Action": [
        "logs:GetLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:*:log-stream:*"
    },
    {
      "Sid": "AwsCloudLaunchS3",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AwsCloudDelete",
      "Effect": "Allow",
      "Action": [
        "iam:GetRole",
        "iam:ListAttachedRolePolicies",
        "iam:ListRolePolicies",
        "iam:DeleteRole",
        "iam:DeleteInstanceProfile",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:DetachRolePolicy",
        "iam:DeleteRolePolicy"
      ],
      "Resource": [
        "arn:aws:iam::*:role/TowerForge-*",
        "arn:aws:iam::*:instance-profile/TowerForge-*"
      ]
    },
    {
      "Sid": "AwsCloudRead",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstanceTypes",
        "ec2:DescribeKeyPairs",
        "ec2:DescribeVpcs",
        "ec2:DescribeImages",
        "ec2:DescribeSubnets",
        "ec2:DescribeSecurityGroups",
        "s3:ListAllMyBuckets"
      ],
      "Resource": "*"
    }
  ]
}
```

</details>

### Compute environment creation

The following permissions are required to provision resources in the AWS account. Only IAM roles that will be assumed by the EC2 instance must be provisioned:

```json
{
  "Sid": "AwsCloudCreate",
  "Effect": "Allow",
  "Action": [
    "iam:CreateRole",
    "iam:AddRoleToInstanceProfile",
    "iam:CreateInstanceProfile",
    "iam:AttachRolePolicy",
    "iam:PutRolePolicy",
    "iam:TagRole",
    "iam:TagInstanceProfile"
  ],
  "Resource": [
    "arn:aws:iam::*:role/TowerForge-*",
    "arn:aws:iam::*:instance-profile/TowerForge-*"
  ]
},
{
  "Sid": "AwsCloudCreatePassRole",
  "Effect": "Allow",
  "Action": [
    "iam:PassRole"
  ],
  "Resource": "arn:aws:iam::*:role/TowerForge-*"
}
```

### Compute environment validation

The following permissions are required to validate the compute environment at creation time. Seqera validates the input provided and that the resource ARNs exist in the target AWS account:

```json
{
  "Sid": "AwsCloudValidate",
  "Effect": "Allow",
  "Action": [
    "ec2:DescribeInstanceTypes",
    "ec2:DescribeImages",
    "ec2:DescribeSubnets",
    "ec2:DescribeSecurityGroups"
  ],
  "Resource": "*"
}
```

### Pipeline and Studio session management

The following permissions are required to launch pipelines, run Studio sessions, fetch live execution logs from CloudWatch, download logs from S3, and stop the execution:

```json
{
  "Sid": "AwsCloudLaunchEC2",
  "Effect": "Allow",
  "Action": [
    "ec2:CreateTags",
    "ec2:DeleteTags",
    "ec2:DescribeInstances",
    "ec2:RunInstances",
    "ec2:TerminateInstances"
  ],
  "Resource": "*"
},
{
  "Sid": "AwsCloudLaunchLogs",
  "Effect": "Allow",
  "Action": [
    "logs:GetLogEvents"
  ],
  "Resource": "arn:aws:logs:*:*:log-group:*:log-stream:*"
},
{
  "Sid": "AwsCloudLaunchS3",
  "Effect": "Allow",
  "Action": [
    "s3:GetObject"
  ],
  "Resource": "arn:aws:s3:::<BUCKET_NAME>/WORKDIR/*"
}
```

### Compute environment termination and resource disposal

The following permissions are required to remove resources created by Seqera when the compute environment is deleted:

```json
{
  "Sid": "AwsCloudDelete",
  "Effect": "Allow",
  "Action": [
    "iam:GetRole",
    "iam:ListAttachedRolePolicies",
    "iam:ListRolePolicies",
    "iam:DeleteRole",
    "iam:DeleteInstanceProfile",
    "iam:RemoveRoleFromInstanceProfile",
    "iam:DetachRolePolicy",
    "iam:DeleteRolePolicy"
  ],
  "Resource": [
    "arn:aws:iam::*:role/TowerForge-*",
    "arn:aws:iam::*:instance-profile/TowerForge-*"
  ]
}
```

### Optional permissions

The following permissions enable Seqera to populate values for dropdown fields. If missing, the input fields will not be auto-populated but can still be manually entered. Though optional, these permissions are recommended for a smoother and less error-prone user experience:

```json
{
  "Sid": "AwsCloudRead",
  "Effect": "Allow",
  "Action": [
    "ec2:DescribeInstanceTypes",
    "ec2:DescribeKeyPairs",
    "ec2:DescribeVpcs",
    "ec2:DescribeImages",
    "ec2:DescribeSubnets",
    "ec2:DescribeSecurityGroups",
    "s3:ListAllMyBuckets"
  ],
  "Resource": "*"
}
```

## Create the IAM policy

The policy above must be created in the AWS account where the AWS Batch resources need to be created.

1. Open the [AWS IAM console](https://console.aws.amazon.com/iam) in the account where you want to create the AWS Batch resources.
1. From the left navigation menu, select **Policies** under **Access management**.
1. Select **Create policy**.
1. On the **Policy editor** section, select the **JSON** tab.
1. Following the instructions detailed in the [IAM permissions breakdown section](#required-platform-iam-permissions) replace the default text in the policy editor area under the **JSON** tab with a policy adapted to your use case, then select **Next**.
1. Enter a name and description for the policy on the **Review and create** page, then select **Create policy**.

## IAM user creation

Seqera requires an Identity and Access Management (IAM) User to create and manage AWS Batch resources in your AWS account. We recommend creating a separate IAM policy rather than an IAM User inline policy, as the latter only allows 2048 characters, which may not be sufficient for all the required permissions.

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

## Managed Amazon Machine Image (AMI)

The AWS Cloud compute environment uses a public AMI maintained by Seqera, and the pipeline launch procedure assumes that some basic tooling is already present in the image itself. If you want to provide your own AMI, it must include at least the following:

- Docker engine, configured to run at startup.
- CloudWatch agent.
- The ability to shut down with the `shutdown` command. If this is missing, EC2 instances will keep running and accumulate additional costs.

### Release cadence and software updates

The AMI is based on the [Amazon Linux 2023 image](https://docs.aws.amazon.com/linux/al2023/ug/what-is-amazon-linux.html). System package versions are pinned for each specific Amazon Linux 2023 version. Seqera subscribes to the [AWS SNS topic](https://docs.aws.amazon.com/linux/al2023/ug/receive-update-notification.html) to receive Amazon Linux 2023 update notifications. When updates are available, this triggers a new Seqera AMI release built on the latest image, which includes system package updates and security patches.

## Advanced options

- **Instance Type**: The EC2 instance type used by the compute environment. Choosing the instance type will directly allocate the CPU and memory available for computation. See [EC2 instance types](https://aws.amazon.com/ec2/instance-types/) for a comprehensive list of instance types and their resource limitations.
- **Graviton architecture**: Enable the use of Graviton instances. AWS Graviton processors, based on the ARM64 architecture, tend to offer a better performance-to-price ratio, however, the tooling used by your pipelines must be compatible with ARM architecture.
- **AMI ID**: The ID of the AMI that will be used to launch the EC2 instance. Use Seqera-maintained AMIs for best performance.
- **Key pair**: The [EC2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) to enable SSH connectivity to the running instance. If unspecified, no SSH key will be present in the running EC2 instance.
- **VPC ID**: The ID of the VPC where the EC2 instance will be launched. If unspecified, the default VPC will be used.
- **Subnets**: The list of VPC subnets where the EC2 instance will run. If unspecified, all the subnets of the VPC will be used.
- **Security groups**: The security groups the EC2 instance will be a part of. If unspecified, no security groups will be used.
- **Instance Profile**: The ARN of the `InstanceProfile` used by the EC2 instance to assume a role while running. If unspecified, Seqera will provision one with enough permissions to run.
- **Boot disk size**: The size of the EBS boot disk for the EC2 instance. If undefined, a default 50 GB `gp3` volume will be used.

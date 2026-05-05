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

AWS S3 (Simple Storage Service) is a type of **object storage**. To access input and output files using Seqera products like [Studios](../studios/overview) and [Data Explorer](../data/data-explorer) create one or more **S3 buckets**. An S3 bucket can also be used to store intermediate results of your Nextflow pipelines, as an alternative to using EFS or FSx file systems.
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
        "batch:UpdateComputeEnvironment",
        "batch:UpdateJobQueue"
      ],
      "Resource": [
        "arn:aws:batch:*:*:compute-environment/TowerForge-*",
        "arn:aws:batch:*:*:job-queue/TowerForge-*"
      ]
    },
    {
      "Sid": "BatchEnvironmentListing",
      "Effect": "Allow",
      "Action": [
        "batch:DescribeComputeEnvironments",
        "batch:DescribeJobDefinitions",
        "batch:DescribeJobQueues",
        "batch:DescribeJobs"
      ],
      "Resource": "*"
    },
    {
      "Sid": "BatchJobsManagementCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "batch:CancelJob",
        "batch:RegisterJobDefinition",
        "batch:SubmitJob",
        "batch:TagResource",
        "batch:TerminateJob"
      ],
      "Resource": [
        "arn:aws:batch:*:*:job-definition/*",
        "arn:aws:batch:*:*:job-queue/TowerForge-*",
        "arn:aws:batch:*:*:job/*"
      ]
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
      "Resource": [
        "arn:aws:iam::*:role/TowerForge-*",
        "arn:aws:iam::*:instance-profile/TowerForge-*"
      ]
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
        "ec2:Descr
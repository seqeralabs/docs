---
title: "AWS data access"
description: "S3 bucket, EFS, and FSx prerequisites for Seqera Platform on AWS."
tags: [aws, s3, efs, fsx, integration]
---

Set up an S3 bucket, EFS, or FSx file system to use as the Nextflow work directory and to store input and output data. The IAM permissions to access these resources are documented in [AWS IAM policies](./iam-policies#s3-access-optional).

## S3 bucket creation

AWS S3 (Simple Storage Service) is a type of **object storage**. Use one or more **S3 buckets** to access input and output files with [Studios](/platform-cloud/studios/overview) and [Data Explorer](/platform-cloud/data/data-explorer). An S3 bucket can also store intermediate Nextflow files, as an alternative to EFS or FSx.

:::note
EFS and FSx work directories are incompatible with Studios.
:::

1. Navigate to the [AWS S3 console](https://console.aws.amazon.com/s3/home).
1. In the top right, select the same region where you plan to create your AWS Batch compute environment.
1. Select **Create bucket**.
1. Enter a unique name for your bucket.
1. Leave the rest of the options as default and select **Create bucket**.

:::note
Nextflow uses S3 to store intermediate files. In production pipelines, this can amount to a lot of data. Consider a retention policy to automatically delete intermediate files after 30 days. See the [AWS documentation](https://aws.amazon.com/premiumsupport/knowledge-center/s3-empty-bucket-lifecycle-rule/) for more information.
:::

## EFS or FSx file system creation

[AWS Elastic File System (EFS)](https://aws.amazon.com/efs/) and [AWS FSx for Lustre](https://aws.amazon.com/fsx/lustre/) are types of **file storage** that can be used as a Nextflow work directory, as an alternative to S3 buckets.

:::note
EFS and FSx work directories are incompatible with Studios.
:::

To use EFS or FSx as your Nextflow work directory, create the file system in the same region as your AWS Batch compute environment.

You can let Seqera create EFS or FSx automatically when creating the AWS Batch compute environment, or create them manually. If Seqera creates the file system, it is also deleted when the compute environment is removed from Platform, unless **Dispose Resources** is disabled in the advanced options.

### Creating an EFS file system

To create an EFS file system manually, visit the [EFS console](https://console.aws.amazon.com/efs/home).

1. Select **Create file system**.
1. Optionally give it a name, then select the VPC where your AWS Batch compute environment will be created.
1. Leave the rest of the options as default and select **Create file system**.

### Creating an FSx file system

To create an FSx for Lustre file system manually, visit the [FSx console](https://console.aws.amazon.com/fsx/home).

1. Select **Create file system**.
1. Select **FSx for Lustre**.
1. Follow the prompts to configure the file system, then select **Next**.
1. Review the configuration and select **Create file system**.

Make sure the [Lustre client](https://docs.aws.amazon.com/fsx/latest/LustreGuide/install-lustre-client.html) is available in the AMIs used by your AWS Batch compute environment to mount FSx file systems.

## Next steps

- [Configure required IAM permissions for S3, EFS, and FSx](./iam-policies#s3-access-optional).
- Create your [AWS Batch compute environment](/platform-cloud/compute-envs/aws-batch) and reference the bucket or file system as the work directory.

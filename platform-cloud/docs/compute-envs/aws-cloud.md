---
title: "AWS Cloud"
description: "Instructions to set up an AWS Cloud VM in Seqera Platform"
date: "12 May 2025"
tags: [cloud, vm, amazon, compute environment]
---

:::note
This guide assumes you already have an AWS account with a valid AWS subscription.
::: 

The current implementation of compute environments for cloud providers all rely on the use of batch services such as AWS Batch, Azure Batch, and Google Batch for the execution of submitted jobs including the Nextflow application running Studio environments. Batch services work well for large scale workloads, however they add a lot of complexity and overhead to run a few compute jobs. In practical terms the current use of batch services results in limitations such as:

- **Long launch delay**: When launching a pipeline execution, there's a delay of several minutes before the pipeline starts running or the Studio environment is launched. This is caused by the batch services that need to provision the associated compute service to run even a single job.
- **Complex setup**: Services such as AWS Batch requires complex IAM policies and the configuration of complex services such as Batch Compute Environment, Batch Job definition, Batch queues, etc.
- **Allocation constraints**: Services such as AWS Batch have strict quotas on the number of resources, for example the number of queues that can be created has a hard limit of 50. This means that no compute environment can be created beyond that limit.

The AWS Cloud VM compute environment addresses these pain points with:

- **Faster startup time**: Nextflow pipelines reach a `Running` status and Studio sessions connect in under a minute (a 4x improvement compared to classic AWS Batch compute environment).
- **Simplified configuration**: Leaner configurable options, with opinionated defaults to provide the best Nextflow pipeline execution environment, with Wave and Fusion enabled.
- **Fewer AWS dependencies**: Only one IAM role in AWS is needed, which is subject to a 1000 soft quota limit per Region.
- **Spot instances**: Studios can be launched on a Spot instance.

This compute environment is best suited to run Studios and small to medium sized pipelines and offers more predictable compute pricing given the fixed instance type. It spins up a standalone, On-Demand EC2 instance, and executes a Nextflow pipeline with a local executor on the EC2 machine. At the end of the execution, the instance is terminated.

## Limitations

- The Nextflow pipeline will run entirely on a single EC2 instance and if the instance type does not have enough resources, the pipeline execution will fail. For this same reason, the amount of parallelism Nextflow can leverage to execute tasks in parallel is bounded by the number of cores of the instance type selected. If you need more computing resources, you’ll need to create a new compute environment with a different instance type. This could mean that the compute environment is not a viable choice for larger pipelines.
- Currentely only the `eu-west-2` Region is supported.

## Requirements

### Platform credentials

In order to create and launch pipelines on this compute environment, you need to provision Platform credentials for the AWS cloud provider. Some permissions are mandatory for the compute environment to be created and function correctly; others are optional and used to pre-fill options in Platform.

### Mandatory permissions

#### Compute Environment Creation

The following are the permissions needed to provision resources in the AWS account. Only IAM roles that will be assumed by the EC2 instance need to be provisioned:

- `iam:CreateRole`
- `iam:AddRoleToInstanceProfile`
- `iam:CreateInstanceProfile`
- `iam:AttachRolePolicy`
- `iam:PutRolePolicy`
- `iam:PassRole`
- `iam:TagRole`
- `iam:TagInstanceProfile`

### Compute Environment validation

The following are the permissions needed to validate the compute environment at creation time. Platform makes sure that the input provided is actually valid and the resource ARNs exist in the target AWS account:

- `ec2:DescribeInstanceTypes`
- `ec2:DescribeImages`
- `ec2:DescribeSubnets`
- `ec2:DescribeSecurityGroups`

#### Pipeline launch and monitor

These are the permissions required to launch pipeline executions, studio sessions, fetch live execution logs from CloudWatch, download logs from S3, and stop the execution:

- `ec2:RunInstances`
- `ec2:DescribeInstances`
- `ec2:CreateTags`
- `ec2:TerminateInstances`
- `ec2:DeleteTags`
- `logs:GetLogEvents`
- `s3:GetObject`

#### Compute Environment disposal

These permissions are needed to remove resources created by Platform when the compute environment is deleted:

- `iam:GetRole`
- `iam:ListAttachedRolePolicies`
- `iam:ListRolePolicies`
- `iam:DeleteRole`
- `iam:DeleteInstanceProfile`
- `iam:RemoveRoleFromInstanceProfile`
- `iam:DetachRolePolicy`
- `iam:DeleteRolePolicy`

#### Optional permissions

These are the permissions needed for Platform to populate values for dropdown fields. If missing, the input fields will not be auto-populated but can be manually entered. We recommend granting these permissions nevertheless for a smoother and less error-prone experience:

- `ec2:DescribeInstanceTypes`
- `ec2:DescribeKeyPairs`
- `ec2:DescribeVpcs`
- `ec2:DescribeImages`
- `ec2:DescribeSubnets`
- `ec2:DescribeSecurityGroups`
- `s3:ListAllMyBuckets`

## AMI

This compute environment uses an AMI maintained by Seqera, and the pipeline launch procedure assumes that some basic tooling is already present in the image itself. If you want to provide your own AMI, it should have the following:

- Docker engine, configured to be running at startup.
- CloudWatch agent.
- Be able to shut themselves down with the shutdown command. If this is missing, EC2 instances will keep running and accumulate additional costs.

## Advanced options

- **Instance Type**: The EC2 instance type that will be spun up by the compute environment. Choosing the instance type will directly address the amount of CPU and memory available for the computation. You can find a comprehensive list of instance types and their resource limitations at [https://aws.amazon.com/ec2/instance-types/](https://aws.amazon.com/ec2/instance-types/).
- **Graviton Architecture**: You can choose whether or not to use Graviton instances. AWS Graviton processors, based on the ARM64 architecture, tend to offer a better performance-to-price ratio, however the tooling used by your pipelines must be compatible with the ARM architecture to work.
- **AMI ID**: The ID of the AMI that will be used to launch the EC2 instance. We recommend using Seqera’s maintained AMIs for best performance.
- **Key pair**: The EC2 [key pair https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) to be able to SSH into the running instance. If unspecified, no SSH key will be present in the running EC2 instance.
- **VPC ID**: The ID of the VPC where the EC2 instance will be launched. If unspecified, the default VPC will be used.
- **Subnets**: the list of VPC subnets where the EC2 instance will run. If unspecified, all the subnets of the VPC will be used.
- **Security groups**: The security groups the EC2 instance will be part of. If unspecified, no security groups will be used.
- **Instance Profile**: The ARN of the `InstanceProfile` used by the EC2 instance to assume a role while running. If unspecified, Platform will provision one with enough permissions to run.
- **Boot disk size**: The size of the EBS root disk for the EC2 instance. If unspecified, a 50GB gp3 volume will be used.

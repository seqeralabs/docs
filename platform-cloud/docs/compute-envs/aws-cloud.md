---
title: "AWS Cloud"
description: "Instructions to set up an AWS Cloud CE in Seqera Platform"
date: "15 May 2025"
tags: [cloud, vm, amazon, compute environment]
---

# AWS Cloud

:::note
This compute environment type is currently in public preview. Please consult this guide for the latest information on recommended configuration and limitations. This guide assumes you already have an AWS account with a valid AWS subscription.
::: 

Many of the current implementations of compute environments for cloud providers rely on the use of batch services such as AWS Batch, Azure Batch, and Google Batch for the execution and management of submitted jobs, including pipelines and Studio session environments. Batch services are suitable for large-scale workloads, but they add management complexity. In practical terms, the currently used batch services result in some limitations:

- **Long launch delay**: When you launch a pipeline or Studio in a batch compute environment, there's a delay of several minutes before the pipeline or Studio session environment is in a running state. This is caused by the batch services that need to provision the associated compute service to run a single job.
- **Complex setup**: Standard batch services require complex identity management policies and configuration of multiple services including compute environments, job queues, job definitions, etc.
- **Allocation constraints**: AWS Batch and other cloud batch services have strict resource quotas. For example, a hard limit of 50 job queues per account per region. This means that no new compute environment can be created when this quota limit is reached.

The AWS Cloud compute environment addresses these pain points with:

- **Faster startup time**: Nextflow pipelines reach a `Running` status and Studio sessions connect in under a minute (a 4x improvement compared to classic AWS Batch compute environments).
- **Simplified configuration**: Fewer configurable options, with opinionated defaults, provide the best Nextflow pipeline and Studio session execution environment, with both Wave and Fusion enabled.
- **Fewer AWS dependencies**: Only one IAM role in AWS is required. IAM roles are subject to a 1000 soft limit per account.
- **Spot instances**: Studios can be launched on a Spot instance.

This type of compute environment is best suited to run Studios and small to medium-sized pipelines. It offers more predictable compute pricing, given the fixed instance types. It spins up a standalone EC2 instance and executes a Nextflow pipeline or Studio session with a local executor on the EC2 machine. At the end of the execution, the instance is terminated.

## Limitations

- The Nextflow pipeline will run entirely on a single EC2 instance. If the instance does not have sufficient resources, the pipeline execution will fail. For this reason, the number of tasks Nextflow can execute in parallel is limited by the number of cores of the instance type selected. If you need more computing resources, you must create a new compute environment with a larger instance type. This makes the compute environment less suited for larger, more complex pipelines.

## Supported regions

The following regions are currently supported: 

- `eu-west-1`
- `us-east-1`
- `us-west-2`
- `eu-west-2`
- `us-east-2`
- `eu-central-1`
- `us-west-1`
- `eu-west-3`
- `ap-southeast-1`

## Requirements

### Platform credentials

To create and launch pipelines or Studio sessions with this compute environment type, you must attach Seqera credentials for the cloud provider. Some permissions are mandatory for the compute environment to be created and function correctly; others are optional and used to pre-fill options in Platform.

### Required permissions

#### Compute environment creation

The following permissions are required to provision resources in the AWS account. Only IAM roles that will be assumed by the EC2 instance need to be provisioned:

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
                "iam:PassRole",
                "iam:TagRole",
                "iam:TagInstanceProfile"
            ],
            "Resource": "*"
        }
    ]
}
```

### Compute environment validation

The following permissions are required to validate the compute environment at creation time. Seqera validates the input provided and that the resource ARNs exist in the target AWS account:

```json
{
    "Version": "2012-10-17",
    "Statement": [
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
    ]
}
```
#### Pipeline and Studio session management

The following permissions are required to launch pipelines, run Studio sessions, fetch live execution logs from CloudWatch, download logs from S3, and stop the execution:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AwsCloudLaunch",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances",
                "ec2:DescribeInstances",
                "ec2:CreateTags",
                "ec2:TerminateInstances",
                "ec2:DeleteTags",
                "logs:GetLogEvents",
                "s3:GetObject"
            ],
            "Resource": "*"
        }
    ]
}
```

#### Compute environment termination and resource disposal

The following permissions are required to remove resources created by Seqera when the compute environment is deleted:

```json
{
    "Version": "2012-10-17",
    "Statement": [
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
            "Resource": "*"
        }
    ]
}
```

#### Optional permissions

The following permissions enable Seqera to populate values for dropdown fields. If missing, the input fields will not be auto-populated but can still be manually entered. Though optional, these permissions are recommended for a smoother and less error-prone user experience:

```json
{
    "Version": "2012-10-17",
    "Statement": [
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

## Managed Amazon Machine Image (AMI) 

The AWS Cloud compute environment uses an AMI maintained by Seqera, and the pipeline launch procedure assumes that some basic tooling is already present in the image itself. If you want to provide your own AMI, it must include at least the following:

- Docker engine, configured to be running at startup.
- CloudWatch agent.
- The ability to shut down with the `shutdown` command. If this is missing, EC2 instances will keep running and accumulate additional costs.

## Advanced options

- **Instance Type**: The EC2 instance type used by the compute environment. Choosing the instance type will directly allocate the CPU and memory available for computation. See [EC2 instance types](https://aws.amazon.com/ec2/instance-types/) for a comprehensive list of instance types and their resource limitations.
- **Graviton architecture**: Enable the use of Graviton instances. AWS Graviton processors, based on the ARM64 architecture, tend to offer a better performance-to-price ratio, however, the tooling used by your pipelines must be compatible with ARM architecture.
- **AMI ID**: The ID of the AMI that will be used to launch the EC2 instance. Use Seqera-maintained AMIs for best performance.
- **Key pair**: The [EC2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) to enable SSH connectivity to the running instance. If unspecified, no SSH key will be present in the running EC2 instance.
- **VPC ID**: The ID of the VPC where the EC2 instance will be launched. If unspecified, the default VPC will be used.
- **Subnets**: The list of VPC subnets where the EC2 instance will run. If unspecified, all the subnets of the VPC will be used.
- **Security groups**: The security groups the EC2 instance will be a part of. If unspecified, no security groups will be used.
- **Instance Profile**: The ARN of the `InstanceProfile` used by the EC2 instance to assume a role while running. If unspecified, Seqera will provision one with enough permissions to run.
- **Boot disk size**: The size of the EBS boot disk for the EC2 instance. If undefined, a default 50 GB gp3 volume will be used.


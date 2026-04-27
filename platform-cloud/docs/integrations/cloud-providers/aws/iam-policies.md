---
title: "AWS IAM policies"
description: "Required and optional IAM policies for Seqera Platform on AWS."
tags: [aws, iam, permissions, integration]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page is the canonical reference for the AWS IAM permissions Seqera Platform needs. Pick the tab that matches your compute environment type, copy the policy, and follow [AWS credentials](./credentials) to attach it to an IAM user or role.

:::tip Permission required for...
- **AWS Batch / Batch Forge** — select the **AWS Batch** tab below.
- **AWS Cloud (EC2-based CE)** — select the **AWS Cloud** tab.
- **Amazon EKS** — select the **Amazon EKS** tab.
- **S3 access for Studios / Data Explorer** — see [S3 access](#s3-access-optional).
- **AWS Secrets Manager (pipeline secrets)** — see [Pipeline secrets](#pipeline-secrets-optional) inside the AWS Batch tab.
- **EFS / FSx work directories** — see the AWS Batch tab.
:::

To create and launch pipelines, explore buckets with Data Explorer, or run Studio sessions, an IAM user (or assumed role) must hold the permissions documented here. Some permissions are mandatory; others are optional and only enable convenience features such as dropdown auto-population.

We recommend the principle of least privilege: start from the permissive policy in your tab, then trim to your use case using the per-section breakdowns.

<Tabs groupId="aws-ce-type">

<TabItem value="batch" label="AWS Batch" default>

### Full permissive policy (AWS Batch)

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

The first section of the policy allows Seqera to create, update, and delete Batch compute environments ("CE"), job queues ("JQ"), and jobs.

If you use manually created CEs and JQs or prefer to manage their lifecycle yourself, remove the permissions to manipulate CEs and JQs. The minimum permissions required are:

- `batch:DescribeJobs` to report job status
- `batch:DescribeJobDefinitions` to list existing job definitions
- `batch:RegisterJobDefinition` to create new job definitions
- `batch:CancelJob` to cancel jobs
- `batch:SubmitJob` to submit jobs
- `batch:TagResource` to tag jobs
- `batch:TerminateJob` to terminate jobs

`batch:DescribeJobQueues` populates the existing job queues in a drop-down menu but is not required if you specify manually created job queues. It is required when you let Seqera create and manage job queues with Forge — in that case, also add `batch:DescribeComputeEnvironments`.

You can also restrict permissions based on resource tags. Tags are defined by users when they [set up a pipeline in Platform](/platform-cloud/resource-labels/overview).

```json
{
  "Sid": "BatchEnvironmentListing",
  "Effect": "Allow",
  "Action": [
    "batch:DescribeJobDefinitions",
    "batch:DescribeJobs"
  ],
  "Resource": "*"
},
{
  "Sid": "BatchJobsManagement",
  "Effect": "Allow",
  "Action": [
    "batch:CancelJob",
    "batch:RegisterJobDefinition",
    "batch:SubmitJob",
    "batch:TagResource",
    "batch:TerminateJob"
  ],
  "Resource": [
    "arn:aws:batch:<REGION>:<ACCOUNT_ID>:job-queue/MyCustomJQ",
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
Restricting `batch` actions with resource tags requires you to set the appropriate tags on each Seqera pipeline when configuring it in Platform. Forgetting to set the tag causes the pipeline to fail to run.
:::

Job definition and job name resources cannot be restricted to specific names because Seqera creates these with dynamic names. Use the wildcard `*` in their resource names. `batch:SubmitJob` requires permission on both job definitions and job queues — include both ARNs in the `Resource` array.

:::note
The quick start policy expects CE and JQ names automatically created by Seqera to start with the `TowerForge-` prefix. This is the default for Platform Cloud and cannot be customized.
:::

### Launch template management

Seqera creates and manages EC2 launch templates using optimized AMIs identified via AWS Systems Manager (SSM).

:::note
AWS does not support restricting IAM permissions on EC2 launch templates by resource name or tag, so permission must be granted on `*`.
:::

### Pass role to Batch

`iam:PassRole` allows Seqera to pass [execution IAM roles](https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html#create-execution-role) to AWS Batch to run Nextflow pipelines.

You can restrict the permission to manually created roles or to roles created by Seqera with the default `TowerForge-` prefix, in a specific account:

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

Seqera reads CloudWatch logs to display run logs in the web interface. Scope this down to a [specific log group](/platform-cloud/compute-envs/aws-batch#advanced-options) on the compute environment in a specific account and region:

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

### IAM roles for AWS Batch (optional)

Seqera can automatically create the IAM roles needed to interact with AWS Batch and other AWS services. To opt out, create the IAM roles manually and provide their ARNs during compute environment creation: see [AWS Batch manual setup](./manual-setup) for details.

To allow Seqera to create roles but restrict it to your account and the default IAM role prefix:

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
  "Resource": [
    "arn:aws:iam::<ACCOUNT_ID>:role/TowerForge-*"
    "arn:aws:iam::<ACCOUNT_ID>:instance-profile/TowerForge-*"
  ]
}
```

### AWS Systems Manager (optional)

Seqera Platform can interact with AWS Systems Manager (SSM) to [identify ECS-optimized AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/retrieve-ecs-optimized_AMI.html) for pipeline execution. This permission is optional — you can supply a [custom AMI ID](/platform-cloud/compute-envs/aws-batch#advanced-options) at compute environment creation instead.

### EC2 describe permissions (optional)

Seqera reads EC2 metadata to populate VPCs, subnets, and security groups in dropdown menus during compute environment creation. Without these permissions, users must enter resource ARNs manually.

:::note
AWS does not support restricting IAM permissions on EC2 Describe actions by resource name or tag, so permission must be granted on `*`.
:::

### FSx file systems (optional)

If your pipelines use [AWS FSx for Lustre](https://aws.amazon.com/fsx/), Seqera can manage the file systems. Omit this section if you do not use FSx. Describe actions cannot be restricted to specific resources; management actions can.

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

If your pipelines use [AWS EFS](https://aws.amazon.com/efs/), Seqera can manage the file systems. Omit this section if you do not use EFS.

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

Seqera can synchronize [pipeline secrets](/platform-cloud/secrets/overview) defined in a Platform workspace with AWS Secrets Manager. If you don't use pipeline secrets, omit this section.

`secretsmanager:ListSecrets` cannot be restricted, but management actions can be scoped to a specific account and region. Seqera only creates secrets prefixed with `tower-`.

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

To use pipeline secrets, the manually-created IAM roles must follow the steps in the [Secrets documentation](/platform-cloud/secrets/overview#aws-secrets-manager-integration).

</TabItem>

<TabItem value="aws-cloud" label="AWS Cloud">

### Full permissive policy (AWS Cloud)

The AWS Cloud compute environment runs Nextflow pipelines and Studio sessions on a single EC2 instance. Only one IAM role in AWS is required, simplifying permissions compared to AWS Batch.

<details>
<summary>Full permissive policy (for reference)</summary>

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

Provision the IAM role that the EC2 instance will assume:

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

Validate ARNs at creation time:

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

Launch pipelines and Studios, fetch live logs from CloudWatch, download logs from S3, and stop execution:

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

Remove resources created by Seqera when the compute environment is deleted:

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

Populate dropdown values in the Platform UI. If missing, fields will not auto-populate but can still be entered manually.

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

</TabItem>

<TabItem value="eks" label="Amazon EKS">

### Full permissive policy (EKS)

For Amazon EKS, Seqera Platform requires permissions to list and describe clusters. Cluster operations are performed through Kubernetes RBAC by the Service Account, not through the IAM user — see [EKS additions](./eks-additions) for RBAC setup.

<details>
<summary>Full permissive policy (for reference)</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EKSClusterAccessCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster",
        "eks:ListClusters"
      ],
      "Resource": "*"
    },
    {
      "Sid": "OptionalS3PlatformDataAccessCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "s3:Get*",
        "s3:List*",
        "s3:PutObject",
        "s3:PutObjectTagging",
        "s3:DeleteObject"
      ],
      "Resource": "*"
    }
  ]
}
```

</details>

### EKS cluster access

`eks:ListClusters` cannot be restricted to specific resources, but `eks:DescribeCluster` can be restricted to the cluster used as compute environment.

```json
{
  "Sid": "EKSClusterListing",
  "Effect": "Allow",
  "Action": [
    "eks:ListClusters"
  ],
  "Resource": "*"
},
{
  "Sid": "EKSClusterDescription",
  "Effect": "Allow",
  "Action": [
    "eks:DescribeCluster"
  ],
  "Resource": "arn:aws:eks:<REGION>:<ACCOUNT_ID>:cluster/<CLUSTER_NAME>"
}
```

No other IAM user permissions are required to launch pipelines on EKS. The Service Account performs the management of pods and resources, and the IAM user accesses it via [EKS authentication](./eks-additions#allow-an-iam-user-or-role-access-to-eks).

</TabItem>
</Tabs>

## S3 access (optional)

Seqera can fetch a list of S3 buckets to populate dropdown menus during compute environment creation. This is optional — users can enter bucket names manually. To enable list, add `s3:ListAllMyBuckets` with `Resource: *`.

[Studios](/platform-cloud/studios/overview) and [Data Explorer](/platform-cloud/data/data-explorer) require additional S3 permissions; if you don't use those features, omit them.

You can scope down to limited read/write on specific buckets, plus permission to check the region and list the work-directory bucket. We recommend granting `s3:GetObject` on the work directory path to fetch Nextflow log files.

:::note
If your S3 bucket is dedicated to Nextflow work directories, the IAM user does not need read/write access — Forge-created IAM roles will have the necessary permissions. If you set up the compute environment manually, see [AWS Batch manual setup](./manual-setup) for IAM role creation.
:::

```json
{
  "Sid": "S3CheckBucketWorkDirectory",
  "Effect": "Allow",
  "Action": [
    "s3:GetBucketLocation",
    "s3:ListBucket"
  ],
  "Resource": [
    "arn:aws:s3:::example-bucket-used-as-work-directory"
  ]
},
{
  "Sid": "S3ReadOnlyNextflowLogFiles",
  "Effect": "Allow",
  "Action": [
    "s3:GetObject"
  ],
  "Resource": [
    "arn:aws:s3:::example-bucket-used-as-work-directory/path/to/work/directory/*"
  ]
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

## Next steps

- [Create the IAM policy, IAM user, and IAM role](./credentials) to attach these permissions in AWS.
- [Set up data access (S3, EFS, FSx)](./data-access) for your work directory.
- For Amazon EKS, also configure [Kubernetes RBAC and the Service Account IAM role](./eks-additions).
- For AWS Batch with manually-managed resources, see [AWS Batch manual setup](./manual-setup).

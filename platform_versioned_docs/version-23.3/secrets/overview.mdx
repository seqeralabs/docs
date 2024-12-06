---
title: "Secrets"
description: "Instructions to use secrets in Seqera Platform."
date: "24 Apr 2023"
tags: [pipeline, secrets]
---

Seqera Platform uses **secrets** to store the keys and tokens used by workflow tasks to interact with external systems, e.g., a password to connect to an external database or an API token. Seqera Platform relies on third-party secret manager services to maintain security between the workflow execution context and the secret container. This means that no secure data is transmitted from your Seqera instance to the compute environment.

:::note
AWS, Google Cloud, and HPC compute environments are currently supported. See [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/index.html) and [Google Secret Manager](https://cloud.google.com/secret-manager/docs/overview) for more information.
:::

## Pipeline secrets

To create a pipeline secret, go to a workspace (private or shared) and select the **Secrets** tab in the navigation bar. Available secrets are listed here and users with appropriate permissions (maintainer, admin, or owner) can create or update secret values.

Select **Add Pipeline Secret** and enter a name and value for the secret. Then select **Add**.

## User secrets

Listing, creating, and updating secrets for users is the same as secrets in a workspace. You can access user secrets from **Your secrets** in the user menu.

:::caution
Secrets defined by a user have higher priority and will override any secrets with the same name defined in a workspace.
:::

## Use secrets in workflows

When you launch a new workflow, all secrets are sent to the corresponding secrets manager for the compute environment. Nextflow downloads these secrets internally when they're referenced in the pipeline code. See [Nextflow secrets](https://www.nextflow.io/docs/edge/secrets.html#process-secrets) for more information.

Secrets are automatically deleted from the secret manager when the pipeline completes, successfully or unsuccessfully.

:::note 
In AWS Batch compute environments, Seqera passes stored secrets to jobs as part of the Seqera-created job definition. Seqera secrets cannot be used in Nextflow processes that use a [custom job definition](https://www.nextflow.io/docs/latest/aws.html#custom-job-definition). 
:::

## AWS Secrets Manager integration

Seqera and associated AWS Batch IAM Roles require additional permissions to interact with AWS Secrets Manager.

### Seqera instance permissions

Augment the existing instance [permissions](https://github.com/seqeralabs/nf-tower-aws) with this policy:

**IAM Permissions**

Augment the permissions given to Seqera with the following Sid:

```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowTowerEnterpriseSecrets",
                "Effect": "Allow",
                "Action": [
                    "secretsmanager:DeleteSecret",
                    "secretsmanager:ListSecrets",
                    "secretsmanager:CreateSecret"
                ],
                "Resource": "*"
            }
        ]
    }
```

### ECS Agent permissions

The ECS Agent uses the [Batch Execution role](https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html#create-execution-role) to communicate with AWS Secrets Manager.

- If your AWS Batch compute environment does not have an assigned execution role, create one.
- If your AWS Batch compute environment already has an assigned execution role, augment it.

**IAM permissions**

1. Add the [`AmazonECSTaskExecutionRolePolicy` managed policy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonECSTaskExecutionRolePolicy.html).
2. Add this inline policy:

```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowECSAgentToRetrieveSecrets",
                "Action": [
                    "secretsmanager:GetSecretValue"
                ],
                "Resource": [
                    "arn:aws:secretsmanager:<YOUR_COMPUTE_REGION>:*:secret:*"
                ],
                "Effect": "Allow"
            }
        ]
    }
```

**IAM trust relationship**

```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowECSTaskAssumption",
                "Effect": "Allow",
                "Principal": {
                    "Service": "ecs-tasks.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }
```

### Compute permissions

The Nextflow head job must communicate with AWS Secrets Manager. Its permissions are inherited either from a custom role assigned during the [AWS Batch CE creation process](../compute-envs/aws-batch.mdx#advanced-options), or from its host [EC2 instance](https://docs.aws.amazon.com/batch/latest/userguide/instance_IAM_role.html).

Augment your Nextflow head job permissions source with one of the following policies:

**EC2 Instance role**

Add this policy to your EC2 Instance role:

```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowNextflowHeadJobToAccessSecrets",
                "Effect": "Allow",
                "Action": "secretsmanager:ListSecrets",
                "Resource": "*"
            }
        ]
    }
```

**Custom IAM role**

Add this policy to your custom IAM role:

```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "AllowNextflowHeadJobToAccessSecrets",
                    "Effect": "Allow",
                    "Action": "secretsmanager:ListSecrets",
                    "Resource": "*"
                },
                {
                    "Sid": "AllowNextflowHeadJobToPassRoles",
                    "Effect": "Allow",
                    "Action": [
                        "iam:GetRole",
                        "iam:PassRole"
                    ],
                    "Resource": "arn:aws:iam::YOUR_ACCOUNT:role/YOUR_BATCH_CLUSTER-ExecutionRole"
                }
            ]
        }
```

Add this trust policy to your custom IAM role:

```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "AllowECSTaskAssumption",
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "ecs-tasks.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }
```

## Google Secret Manager integration

You must [enable Google Secret Manager](https://cloud.google.com/secret-manager/docs/configuring-secret-manager) in the same project that your Google compute environment credentials have access to. Your compute environment credentials require additional IAM permissions to interact with Google Secret Manager.

### IAM permissions

See the [Google documentation](https://cloud.google.com/secret-manager/docs/access-control) for permission configuration instructions to integrate with Google Secret Manager.

Seqera Platform requires `roles/secretmanager.admin` permissions in the project where it will manage your secrets. Ensure that your compute environment contains credentials with this access role for the same `project_id` listed in the service account JSON file.

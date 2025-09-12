---
title: "Secrets"
description: "Instructions to use secrets in Seqera Platform."
date: "2023-04-24"
last_update: "2025-09-12"
tags: [pipeline, secrets, security, authentication]
---

**Secrets** store keys and tokens that your workflow tasks use to interact with external systems, such as passwords for external databases or API tokens. Seqera Platform relies on third-party secret manager services to maintain security between the workflow execution context and the secret container. This means that no secure data is transmitted from your Seqera instance to the compute environment.

:::note
AWS, Google Cloud, and HPC compute environments are currently supported. See [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/index.html) and [Google Secret Manager](https://cloud.google.com/secret-manager/docs/overview) for more information.
:::

## Pipeline secrets

Create a pipeline secret by navigating to a workspace (private or shared) and selecting the **Secrets** tab. Available secrets are listed here and users with appropriate [permissions](../orgs-and-teams/roles) (maintainer, admin, or owner) can create or update secret values.

:::note
Multi-line secrets must be base64-encoded.
:::

Select **Add Pipeline Secret**, enter a name and value for the secret, then click **Add**.

## User secrets

You can list, create, and update user secrets the same way you manage workspace secrets. You can access user secrets from **Your secrets** in the user menu.

:::caution
Secrets defined by a user have higher priority and will override any secrets with the same name defined in a workspace.
:::

## Use secrets in workflows

When you launch a new workflow, Seqera Platform sends all secrets to the corresponding secrets manager for the compute environment. Nextflow downloads these secrets internally when they're referenced in the pipeline code. See [Nextflow secrets](https://www.nextflow.io/docs/edge/secrets.html#process-secrets) for more information.

Seqera Platform automatically deletes secrets from the secret manager when your pipeline completes, whether successfully or unsuccessfully.

:::note
In AWS Batch compute environments, Seqera passes stored secrets to jobs as part of the Seqera-created job definition. Seqera secrets cannot be used in Nextflow processes that use a [custom job definition](https://www.nextflow.io/docs/latest/aws.html#custom-job-definition).
:::

## AWS Secrets Manager integration

Seqera and associated AWS Batch IAM Roles require additional permissions to interact with AWS Secrets Manager.

### Seqera instance permissions

You need to augment the existing instance [permissions](https://github.com/seqeralabs/nf-tower-aws) with this policy:

**IAM Permissions**

Add the following policy statement to your Seqera permissions:

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
1. Add this inline policy, replacing `<COMPUTE_REGION>` with your actual compute region:

```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowECSAgentToRetrieveSecrets",
                "Effect": "Allow",
                "Action": "secretsmanager:GetSecretValue",
                "Resource": "arn:aws:secretsmanager:<COMPUTE_REGION>:*:secret:tower-*"
        }
      ]
    }
```

:::note
Including `tower-*` in the Resource ARN limits access to Platform secrets only (as opposed to all secrets in the given region).
:::

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

The Nextflow head job must communicate with AWS Secrets Manager. Its permissions are inherited either from a custom role assigned during the [AWS Batch CE creation process](../compute-envs/aws-batch#advanced-options), or from its host [EC2 instance](https://docs.aws.amazon.com/batch/latest/userguide/instance_IAM_role.html).

Add one of the following policies to your Nextflow head job permissions source:

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

Add this policy to your custom IAM role, replacing `<ACCOUNT>` with your AWS account ID and `<BATCH_CLUSTER>` with your Batch cluster name:

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
                    "Resource": "arn:aws:iam::<ACCOUNT>:role/<BATCH_CLUSTER>-ExecutionRole"
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

Enable [Google Secret Manager](https://cloud.google.com/secret-manager/docs/configuring-secret-manager) in the same project that contains your Google compute environment credentials. Your compute environment credentials require additional IAM permissions to interact with Google Secret Manager.

### IAM permissions

See the [Google documentation](https://cloud.google.com/secret-manager/docs/access-control) for permission configuration instructions to integrate with Google Secret Manager.

Seqera Platform requires `roles/secretmanager.admin` permissions in the project where it manages your secrets. Ensure that your compute environment contains credentials with this access role for the same `project_id` listed in the service account JSON file.

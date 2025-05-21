---
title: "Secrets"
description: "Instructions to use secrets in Tower."
date: "24 Apr 2023"
tags: [pipeline, secrets]
---

Tower uses **secrets** to store the keys and tokens used by workflow tasks to interact with external systems, e.g., a password to connect to an external database or an API token. Tower relies on third-party secret manager services to maintain security between the workflow execution context and the secret container. This means that no secure data is transmitted from Tower to the compute environment.

:::note
Currently, AWS Batch and HPC batch schedulers are supported. See [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/index.html) for more information.
:::

## Pipeline secrets

To create a pipeline secret, navigate to a workspace (private or shared) and select the **Secrets** tab in the top navigation bar. Available secrets are listed here and users with appropriate permissions (maintainer, admin, or owner) can create or update secret values.

Select **Add Pipeline Secret** and enter a name and value for the secret. Then select **Add**.

## User secrets

Define a user secret by opening the user top-right menu and selecting **Your Secrets**. Listing, creating, and updating secrets for users is the same as secrets in a workspace.

:::caution
Secrets defined by a user have higher priority and will override any secrets with the same name defined in a workspace.
:::

## Use secrets in workflows

When you launch a new workflow, all secrets are sent to the corresponding secrets manager for the compute environment. Nextflow downloads these secrets internally for use when referenced in the pipeline code. See [Nextflow secrets](https://www.nextflow.io/docs/edge/secrets.html#process-secrets) for more information.

Secrets will be automatically deleted from the secret manager when the pipeline completes, successfully or unsuccessfully.

## AWS Secrets Manager integration

Tower and associated AWS Batch IAM Roles require additional IAM permissions to interact with AWS Secrets Manager.

### Tower instance permissions

Augment the existing Tower instance [permissions](https://github.com/seqeralabs/nf-tower-aws) with this policy:

=== "IAM Permissions" 1. Augment the permissions given to Tower with the following Sid:

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

=== "IAM permissions"

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

=== "IAM trust relationship"

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

The Nextflow Head job must communicate with AWS Secrets Manager. Its permissions are inherited either from a custom role assigned during the [AWS Batch CE creation process](https://help.tower.nf/compute-envs/aws-batch/#advanced-options), or from its host [EC2 instance](https://docs.aws.amazon.com/batch/latest/userguide/instance_IAM_role.html).

Augment your Nextflow Head job permissions source with one of the following policies:

=== "EC2 Instance Role"

    1. Add the following policy to your EC2 Instance Role:
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

=== "Custom IAM role"

    1. Add this policy to your custom IAM Role:

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

    2. Add this trust policy to your custom IAM role:

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

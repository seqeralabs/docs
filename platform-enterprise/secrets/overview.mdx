---
title: Secrets Overview
headline: "Secrets"
description: "Step-by-step instructions to set-up Secrets in Tower."
---

## Overview

Tower uses the concept of **Secrets** to store the keys and tokens used by workflow tasks to interact with external systems e.g. a password to connect to an external database or an API token. Tower relies on third-party secret manager services in order to maintain security between the workflow execution context and the secret container. This means that no secure data is transmitted from Tower to the Compute Environment.

::: note
Currently only AWS Batch or HPC batch schedulers are supported. Please read more about the AWS Secret Manager [here](https://docs.aws.amazon.com/secretsmanager/index.html)
:::

### Pipeline Secrets

To create a Pipeline Secret navigate to a Workspace (private or shared) and click on the **Secrets** tab in the top navigation pane to gain access to the Secrets management interface.

![](./_images/workspace_secrets_and_credentials.png)

All of the available Secrets will be listed here and users with the appropriate permissions (maintainer, admin or owner) will be able to create or update Secret values.

![](./_images/secrets_list.png)

The form for creating or updating a Secret is very similar to the one used for Credentials.

![](./_images/secrets_creation_form.png)

### Pipeline Secrets for users

Secrets can be defined for users by clicking on your avatar in the top right corner of the Tower interface and selecting "Your Secrets". Listing, creating and updating Secrets for users is the same as Secrets in a Workspace. However, Secrets defined by a user have a higher priority and will override any Secrets defined in a Workspace with the same name.

![](./_images/personal_secrets_and_and_credentials.png)

:::caution
Secrets defined by a user have higher priority and will override any Secrets defined in a Workspace with the same name.
:::

### Using Secrets in workflows

When a new workflow is launched, all Secrets are sent to the corresponding secret manager for the Compute Environment. Nextflow will download these Secrets internally and use them when they are referenced in the pipeline code as described in the [Nextflow Secrets documentation](https://www.nextflow.io/docs/edge/secrets.html#process-secrets).

Secrets will be automatically deleted from the secret manager when the Pipeline completes (successful or unsuccessful).

### AWS Secrets Manager Integration

If you are planning to use the Pipeline Secrets feature provided by Tower with the AWS Secrets Manager, the following IAM permissions should be provided:

1. Create the AWS Batch [IAM Execution role](https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html#create-execution-role) as specified in the AWS documentation.

2. Add the `AmazonECSTaskExecutionRolePolicy` policy and [this custom policy](../_templates/aws-batch/secrets-policy-execution-role.json) to the execution role created above.

3. Specify the execution role ARN in the **Batch execution role** option (under **Advanced options**) when creating your Compute Environment in Tower.

4. Add [this custom policy](../_templates/aws-batch/secrets-policy-instance-role.json) to the ECS Instance role associated with the Batch compute environment that will be used to deploy your pipelines. Replace `YOUR-ACCOUNT` and `YOUR-EXECUTION-ROLE-NAME` with the appropriate values. See [here](https://docs.aws.amazon.com/batch/latest/userguide/instance_IAM_role.html) for more details about the Instance role.

5. Add [this custom policy](../_templates/aws-batch/secrets-policy-account.json) to your Tower IAM user (the one specified in the Tower credentials).

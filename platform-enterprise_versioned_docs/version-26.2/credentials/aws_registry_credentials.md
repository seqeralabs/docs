---
title: "AWS ECR credentials"
description: "Instructions to create AWS ECR credentials in Seqera Platform."
date: "21 Apr 2023"
tags: [aws, ecr, credentials]
---

From version 22.3, Seqera Platform supports the configuration of credentials for the Nextflow Wave container service to authenticate to private and public container registries. For more information on Wave containers, see [the Nextflow documentation](https://docs.seqera.io/nextflow/wave).

:::note
Container registry credentials are only used by the Wave container service. Add `wave { enabled=true }` to the **Nextflow config** field on the launch page, or to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

## AWS ECR Private Registry

Wave requires programmatic access to your private Elastic Container Registry (ECR) via [long-term access keys](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#create-long-term-access-keys). Create a user with registry read permissions (e.g., a subset of the AWS-managed `AmazonEC2ContainerRegistryReadOnly` policy) for this purpose.

**Create an IAM user with AWS ECR access**

1. Open the [IAM console](https://console.aws.amazon.com/iam/).
2. Select **Users** from the navigation pane.
3. Select the name of the user whose keys you want to manage, then select the **Security credentials** tab. We recommend creating an IAM user specifically for Wave authentication instead of using existing credentials with broader permissions.
4. In the **Access keys** section, select **Create access key**. Each IAM user can have only two access keys at a time, so if the Create option is deactivated, delete an existing access key first.
5. On the **Access key best practices & alternatives** page, select **Other** and then **Next**.
6. On the **Retrieve access key** page, you can either **Show** the user's secret access key details, or store them by selecting **Download .csv file**.
7. The newly created access key pair is active by default and can be stored as a container registry credential in Seqera.

:::note
Your credential must be stored in Seqera as a **container registry** credential, even if the same access keys already exist as a workspace credential.
:::

## Add private ECR credentials to Seqera

1.  Add your credentials to your organization or personal workspace:
    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: Specify a unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `my-registry-creds`.
    - **Provider**: Select **Container registry**.
    - **User name**: Specify your IAM user access key ID. For example, `AKIAIOSFODNN7EXAMPLE`.
    - **Password**: Specify your IAM user secret access key.
    - **Registry server**: Specify your private ECR registry URL. For example, `<aws_account_id>.dkr.ecr.<region>.amazonaws.com`.

3.  After you've completed all the form fields, select **Add**. The new credential is now listed under the **Credentials** tab.

## AWS ECR Public Registry

Amazon ECR Public Gallery (`public.ecr.aws`) hosts publicly accessible container images. While images can be pulled without authentication, AWS applies rate limits to unauthenticated pulls. Authenticating with AWS credentials removes these rate limits and is required when running pipelines at scale.

### Required IAM permissions

The IAM user needs the following permissions to authenticate to ECR Public:

- `ecr-public:GetAuthorizationToken`
- `ecr-public:BatchCheckLayerAvailability`
- `ecr-public:GetRepositoryPolicy`
- `ecr-public:DescribeRepositories`
- `ecr-public:DescribeImages`
- `ecr-public:DescribeImageTags`
- `sts:GetServiceBearerToken`

Attach the AWS managed policy `AmazonElasticContainerRegistryPublicReadOnly` and add the `sts:GetServiceBearerToken` permission. This permission is not included in the managed policy and must be granted separately, or ECR Public authentication will fail.

### Add ECR Public credentials to Seqera

1.  Add your credentials to your organization or personal workspace:
    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: Specify a unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `ecr-public-creds`.
    - **Provider**: Select **Container registry**.
    - **User name**: Specify your IAM user access key ID. For example, `AKIAIOSFODNN7EXAMPLE`.
    - **Password**: Specify your IAM user secret access key.
    - **Registry server**: Enter `public.ecr.aws`.

3.  After you've completed all the form fields, select **Add**.

Wave matches the `public.ecr.aws` hostname to these credentials and authenticates ECR Public pulls on your behalf.

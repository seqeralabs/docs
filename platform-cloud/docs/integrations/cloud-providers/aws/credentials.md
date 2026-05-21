---
title: "AWS credentials"
description: "Create the IAM policy, IAM user, and IAM role for Seqera Platform on AWS, and add credentials in Seqera."
tags: [aws, iam, credentials, integration]
---

This page covers how to create the IAM policy, IAM user, and IAM role in AWS, then add the resulting credentials to Seqera Platform. The same procedure applies to AWS Batch, AWS Cloud, and Amazon EKS compute environments — only the underlying [IAM policy](./iam-policies) differs.

## Create the IAM policy

The policy must be created in the AWS account where the Seqera-managed AWS resources will live.

1. Open the [AWS IAM console](https://console.aws.amazon.com/iam) in the target AWS account.
1. From the left navigation menu, select **Policies** under **Access management**.
1. Select **Create policy**.
1. On the **Policy editor** section, select the **JSON** tab.
1. Replace the default text with a policy adapted to your use case (see [IAM policies](./iam-policies)), then select **Next**.
1. Enter a name and description on the **Review and create** page, then select **Create policy**.

## IAM user creation

Seqera requires an IAM user to manage AWS resources in your account. We recommend creating a separate IAM policy rather than an IAM user inline policy — inline policies allow only 2,048 characters, which may not be sufficient for the required permissions.

When multiple users need to access the same AWS account, create an [IAM role](#iam-role-creation-optional) with the required permissions instead and let the IAM user assume that role.

### Create an IAM user

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Users** in the left navigation menu, then select **Create User** at the top right.
1. Enter a name (e.g., `seqera`) and select **Next**.
1. Under **Permission options**, select **Attach policies directly**, then search for and select the policy you created above. Select **Next**.
   - To make the IAM user assume a role to manage AWS resources (see [IAM role creation (optional)](#iam-role-creation-optional)), instead create a policy with the following content (edit the AWS principal with the role's ARN) and attach it to the IAM user:

   ```json
   {
     "Sid": "AssumeRoleToManageBatchResources",
     "Effect": "Allow",
     "Action": "sts:AssumeRole",
     "Resource": "arn:aws:iam::<ACCOUNT_ID>:role/<IAM_ROLE_NAME>",
     "Condition": {
       "StringEquals": {
         "sts:ExternalId": "<EXTERNAL_ID>"
       }
     }
   }
   ```
1. On the last page, review the user details and select **Create user**.

For more details, see the [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).

### Obtain IAM user credentials

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Users** in the left navigation menu, then select the newly created user.
1. Select the **Security credentials** tab, then select **Create access key** under the **Access keys** section.
1. In the **Use case** dialog, select **Command line interface (CLI)**, tick the confirmation checkbox, and select **Next**.
1. Optionally provide a description, then select **Create access key**.
1. Save the **Access key** and **Secret access key** in a secure location — you will provide them when creating credentials in Seqera.

## IAM role creation (optional)

Rather than attaching permissions directly to the IAM user, create an IAM role with the required permissions and let the IAM user assume that role. This is useful when multiple IAM users access the same AWS account: actual permissions to operate on resources are granted only to a single centralized role.

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Roles** in the left navigation menu, then select **Create role**.
1. Select **Custom trust policy** as the type of trusted entity. Provide the following policy and edit the AWS principal with the IAM user ARN:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": [
              "arn:aws:iam::<ACCOUNT_ID>:user/<IAM_USER_NAME>"
            ]
         },
         "Action": "sts:AssumeRole",
         "Condition": {
           "StringEquals": {
             "sts:ExternalId": "<EXTERNAL_ID>"
           }
         }
       },
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": [
              "arn:aws:iam::<ACCOUNT_ID>:user/<IAM_USER_NAME>"
            ]
         },
         "Action": "sts:TagSession"
       }
     ]
   }
   ```

1. On the **Permissions** page, search for and select the policy created in [IAM user creation](#iam-user-creation). Select **Next**.
1. Give the role a name and optionally a description and tags, then select **Create role**.

Multiple users can be specified in the trust policy by adding more ARNs to the `Principal` section.

:::note
Seqera Platform generates the `External ID` value during AWS credential creation. For role-based credentials, use this exact value in your IAM trust policy (`sts:ExternalId`).
:::

### Role-based trust policy example (Seqera Cloud)

For role-based AWS credentials in Seqera Cloud, allow the Seqera Cloud access role `arn:aws:iam::161471496260:role/SeqeraPlatformCloudAccessRole` in your trust policy and enforce the External ID generated during credential creation:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::161471496260:role/SeqeraPlatformCloudAccessRole"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "<ExternalId>"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::161471496260:role/SeqeraPlatformCloudAccessRole"
      },
      "Action": "sts:TagSession"
    }
  ]
}
```

## AWS credential options

AWS credentials can be configured in two ways:

- **Key-based credentials**: Access key and secret key with direct IAM permissions. If you provide a role ARN in **Assume role**, the **Generate External ID** switch is displayed and External ID generation is optional.
- **Role-based credentials (recommended)**: Use role assumption only (no static keys). Paste the IAM role ARN in **Assume role**. External ID is generated automatically when you save.

The **Assume role** field is available for both modes. It is optional for key-based credentials and required for role-based credentials.

Existing credentials created before March 2026 continue to work without changes.

## Next steps

- [Set up S3, EFS, or FSx work directories](./data-access).
- For Amazon EKS, complete [Kubernetes RBAC and Service Account setup](./eks-additions).
- For AWS Batch with manually-managed resources, see [AWS Batch manual setup](./manual-setup).
- Add the credentials to Seqera Platform: see [the AWS Batch compute environment guide](/platform-cloud/compute-envs/aws-batch) (or [AWS Cloud](/platform-cloud/compute-envs/aws-cloud) / [EKS](/platform-cloud/compute-envs/eks)) for the in-product steps.

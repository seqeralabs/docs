---
title: "Use AWS IAM roles"
description: Use AWS IAM Roles instead of user credentials
date: "12 Apr 2023"
tags: [aws, iam, role]
---

AWS-based customers can configure Seqera Platform to authenticate to AWS services like Batch with an IAM Role instead of IAM user credentials.

:::note
The provided policies were designed with certain assumptions:

1. **IAM Policy**: Seqera must have full access to identified S3 buckets.
2. **Trust Policy**: The Role should be assumable by EC2 or EKS (depending on your Seqera deployment), and only specifically-named IAM actors.

You may wish to limit S3 access to specific prefixes, and/or Role assumption to more specific platforms.
:::

## Configure the Seqera IAM policy

1. Download the [custom IAM Policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/forge/forge-policy.json).
1. Download the [S3 bucket write policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/s3-bucket-write.json).
1. Modify the S3 bucket write policy by adding `"arn:aws:s3:::YOUR-BUCKET-NAME"` for each bucket that will be used as a pipeline work directory. 
1. Revise the scope of access to a specific prefix in the S3 buckets, if needed (modify `"arn:aws:s3:::YOUR-BUCKET-NAME/*"`).

:::note
AWS credentials in Seqera are used to access S3 cloud buckets in [Data Explorer](../../data/data-explorer). If the scope of access for the Seqera IAM policy excludes buckets or directories you need to access in Data Explorer, create additional Seqera credentials with S3 access specific to your Data Explorer needs. 
:::

## Modify the Seqera IAM role trust policy (optional)

You can optionally create a Seqera role trust policy to allow EC2 instances or EKS clusters (depending on your Seqera deployment) to assume the Seqera IAM role.

1. Download the [Seqera IAM role trust policy](https://github.com/seqeralabs/nf-tower-aws/blob/master/launch/seqera-role-trust-policy.json).
1. Replace `YOUR-AWS-ACCOUNT` with your AWS Account ID.
1. Replace `USER-OR-ROLE/USER-OR-ROLE-ID` with the users and or roles that must be able to assume the Seqera IAM role. 

## Create the IAM artifacts

[Create the IAM artifacts](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html) in your AWS account.

1. Navigate to the folder containing your configured IAM documents:

   ```bash
   cd <FOLDER_WITH_YOUR_CONFIGURED_IAM_DOCUMENTS>
   ```

2. Create the **Role**:

   ```bash
   aws iam create-role --role-name Seqera-Role --assume-role-policy-document file://Seqera-Role-Trust-Policy.json
   ```

3. Create an **inline policy** for the Role:

   ```bash
   aws iam put-role-policy --role-name Seqera-Role --policy-name Seqera-Role-Policy --policy-document file://Seqera-Role-Policy.json
   ```

4. Create an **instance profile**:

   ```bash
   aws iam create-instance-profile --instance-profile-name Seqera-Instance
   ```

5. **Bind** the Role to the instance profile:

   ```bash
   aws iam add-role-to-instance-profile --instance-profile-name Seqera-Instance --role-name Seqera-Role
   ```

## Configure Seqera

With the IAM artifacts created, update your application configuration:

1. Add the following entry to your `tower.env`

   ```env
   TOWER_ALLOW_INSTANCE_CREDENTIALS=true
   ```

2. Restart the Seqera application.

3. Verify that the change took effect by querying the Seqera instance `service-info` endpoint:

   ```bash
   curl -X GET "https://YOUR-TOWER-DOMAIN/api/service-info" -H "Accept: application/json" | jq ".serviceInfo.allowInstanceCredentials"
   ```

4. Log in to Seqera and create a new AWS credential. You are now prompted for an AWS `arn` instead of access keys.


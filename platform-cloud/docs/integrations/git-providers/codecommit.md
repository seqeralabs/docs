---
title: "AWS CodeCommit"
description: "Connect Seqera Platform to private AWS CodeCommit repositories."
tags: [git, aws, codecommit, integration]
---

To connect to a private AWS CodeCommit repository, see the [AWS documentation](https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-iam-identity-based-access-control.html) for IAM permissions for CodeCommit.

## Create AWS CodeCommit credentials

Use your IAM account access key and secret key:

1. From an organization workspace: Select **Credentials** > **Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials** > **Add credentials**.
1. Enter a **Name** for the new credentials.
1. Select **CodeCommit** as the **Provider**.
1. Enter the **Access key** and **Secret key** of the AWS IAM account.
1. (Recommended) Enter the **Repository base URL** to scope the credentials to a specific region (e.g., `https://git-codecommit.eu-west-1.amazonaws.com`).

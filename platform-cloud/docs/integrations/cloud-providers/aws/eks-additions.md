---
title: "EKS additions"
description: "Service Account IAM role for Fusion v2 and EKS aws-auth configuration."
tags: [aws, eks, kubernetes, irsa, integration]
---

Amazon EKS requires two pieces of setup beyond the [base AWS IAM policies](./iam-policies) and [credentials](./credentials):

1. A Kubernetes Service Account IAM role that lets pods access S3 (required for Fusion v2).
2. An EKS authentication entry that lets the Seqera IAM user (or role) reach the cluster.

## Configure EKS Service Account IAM role for Fusion v2

To use [Fusion v2](https://docs.seqera.io/fusion) in your Amazon EKS compute environment, an AWS S3 bucket must be the work directory and both the head and compute Service Accounts (if separate) must have access to it.

If you do not plan to use Fusion (legacy storage), skip this section.

1. Create an IAM role with the following permissions:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::<YOUR-BUCKET>"
         ]
       },
       {
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:PutObjectTagging",
           "s3:DeleteObject"
         ],
         "Resource": [
           "arn:aws:s3:::<YOUR-BUCKET>/*"
         ],
         "Effect": "Allow"
       }
     ]
   }
   ```

   Replace `<YOUR-BUCKET>` with the bucket used as work directory.

1. Create a trust relationship with the Kubernetes Service Account (or accounts) that Seqera uses to manage the EKS cluster — `tower-launcher-sa` in the default configuration:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::<YOUR-ACCOUNT-ID>:oidc-provider/oidc.eks.<YOUR-REGION>.amazonaws.com/id/<YOUR-CLUSTER-ID>"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "oidc.eks.<YOUR-REGION>.amazonaws.com/id/<YOUR-CLUSTER-ID>:aud": "sts.amazonaws.com",
             "oidc.eks.<YOUR-REGION>.amazonaws.com/id/<YOUR-CLUSTER-ID>:sub": "system:serviceaccount:<YOUR-EKS-NAMESPACE>:<YOUR-EKS-SERVICE-ACCOUNT>"
           }
         }
       }
     ]
   }
   ```

   Replace `<YOUR-ACCOUNT-ID>`, `<YOUR-REGION>`, `<YOUR-CLUSTER-ID>`, `<YOUR-EKS-NAMESPACE>`, and `<YOUR-EKS-SERVICE-ACCOUNT>`.

1. Annotate the Kubernetes Service Account with the IAM role:

   ```shell
   kubectl annotate serviceaccount <YOUR-EKS-SERVICE-ACCOUNT> --namespace <YOUR-EKS-NAMESPACE> eks.amazonaws.com/role-arn=arn:aws:iam::<YOUR-ACCOUNT-ID>:role/<YOUR-IAM-ROLE>
   ```

   Replace `<YOUR-EKS-SERVICE-ACCOUNT>` (default `tower-launcher-sa` from the [cluster preparation guide](/platform-cloud/compute-envs/k8s)), `<YOUR-EKS-NAMESPACE>`, and `<YOUR-IAM-ROLE>`.

Pods using the service account can now assume the IAM role and access the work directory bucket. See the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html) for further details.

## Allow an IAM User or Role access to EKS

Configure the EKS cluster to let the IAM user (or role) access the cluster and manage pods.

1. Retrieve from the [AWS IAM console](https://console.aws.amazon.com/iam) the ARN of the [IAM User](./credentials#iam-user-creation) or [IAM Role](./credentials#iam-role-creation-optional) you created.

    :::note
    The AWS credentials for the IAM user are used in the Seqera compute environment configuration.
    :::

1. Modify the EKS `aws-auth` ConfigMap to allow the IAM User to access the cluster and manage pods. This step may require cluster administrator privileges:

    ```bash
    kubectl edit configmap -n kube-system aws-auth
    ```

1. In the editor, add the following entry to `mapUsers`, replacing `<AWS-IAM-USER-ARN>` with the user ARN:

    ```yaml
    mapUsers: |
      - userarn: <AWS-IAM-USER-ARN>
        username: tower-launcher-user
        groups:
          - tower-launcher-role
    ```

   To allow an IAM role to authenticate to the cluster instead, add the role to `mapRoles`. The role ARN must be specified in the **Assume role** field on the Seqera compute environment, the role must have a trust relationship with the Seqera IAM user, and the entry takes the form:

    ```yaml
    mapRoles: |
      - rolearn: <AWS-IAM-ROLE-ARN>
        username: tower-launcher-role
        groups:
          - tower-launcher-role
    ```

   See the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/auth-configmap.html) for more details.

## Next steps

- Configure the [base AWS IAM policy](./iam-policies) and [credentials](./credentials).
- Create the [Amazon EKS compute environment](/platform-cloud/compute-envs/eks).

---
title: "Amazon EKS"
description: "Instructions to set up Amazon EKS in Seqera Platform"
date: "21 Apr 2023"
tags: [eks, amazon, compute environment]
---

[Amazon EKS](https://aws.amazon.com/eks/) is a managed Kubernetes cluster that enables the execution of containerized workloads in the AWS cloud at scale.

Seqera Platform offers native support for Amazon EKS clusters to streamline the deployment of Nextflow pipelines.

## Requirements

You must have an EKS cluster up and running. Follow the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions to create the resources required by your Seqera instance. In addition to the generic Kubernetes instructions, you must make a number of EKS-specific modifications.

### Service account role

Assign a service account role to the AWS IAM user used by Seqera to access the EKS cluster.

**Assign a service account role to your Seqera IAM user**

1. Modify the EKS auth configuration:

    ```bash
    kubectl edit configmap -n kube-system aws-auth
    ```

1. In the editor that opens, add this entry:

    ```yaml
    mapUsers: |
    - userarn: <AWS USER ARN>
        username: tower-launcher-user
        groups:
        - tower-launcher-role
    ```

1. Retrieve your user ARN from the [AWS IAM console](https://console.aws.amazon.com/iam), or with the AWS CLI:

    ```bash
    aws sts get-caller-identity
    ```

    :::note
    The same user must be used when specifying the AWS credentials in the Seqera compute environment configuration.
    :::

1. The AWS user must have [this](../_templates/eks/eks-iam-policy.json) IAM policy applied.

See the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html) for more details.

## Seqera compute environment

:::caution
Your Seqera compute environment uses resources that you may be charged for in your AWS account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

After you have prepared your Kubernetes cluster and assigned a service account role to your Seqera IAM user, create a Seqera EKS compute environment:

1. In a workspace, select **Compute environments > New environment**.
1. Enter a descriptive name for this environment, e.g., _Amazon EKS (eu-west-1)_.
1. From the **Provider** drop-down menu, select **Amazon EKS**.
1. Under **Storage**, select either **Fusion storage** (recommended) or **Legacy storage**. The [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system allows access to your AWS S3-hosted data (`s3://` URLs). This eliminates the need to configure a shared file system in your Kubernetes cluster. See [Fusion v2](#fusion-v2) below.
1. From the **Credentials** drop-down menu, select existing AWS credentials, or select **+** to add new credentials. If you choose to use existing credentials, skip to step 9.
    :::note
    The user must have the IAM permissions required to describe and list EKS clusters, per service account role requirements in the previous section.
    :::
1. Enter a name, e.g., _EKS Credentials_.
1. Add the IAM user **Access key** and **Secret key**. This is the IAM user with the service account role detailed in the previous section.
1. (Optional) Under **Assume role**, specify the IAM role to be assumed by the Seqera IAM user to access the compute environment AWS resources.
    :::note
    When using AWS keys without an assumed role, the associated AWS user account must have Seqera [Launch](https://github.com/seqeralabs/nf-tower-aws/tree/master/launch) and [Forge](https://github.com/seqeralabs/nf-tower-aws/tree/master/forge) permissions. When an assumed role is provided, the keys are only used to retrieve temporary credentials impersonating the role specified. In this case, Seqera [Launch](https://github.com/seqeralabs/nf-tower-aws/tree/master/launch) and [Forge](https://github.com/seqeralabs/nf-tower-aws/tree/master/forge) permissions must be granted to the role instead of the user account.
    :::
1. Select a **Region**, e.g., _eu-west-1 - Europe (Ireland)_.
1. Select a **Cluster name** from the list of available EKS clusters in the selected region.
1. Specify the **Namespace** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions, which is _tower-nf_ by default.
1. Specify the **Head service account** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions, which is _tower-launcher-sa_ by default.
    :::note
    If you enable Fusion v2 (**Fusion storage** in step 4 above), the head service account must have access to the S3 storage bucket specified as your work directory.
    :::
1. Specify the **Storage claim** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions, which serves as a scratch filesystem for Nextflow pipelines. The storage claim is called _tower-scratch_ in the provided examples.
    :::note
    The **Storage claim** isn't needed when Fusion v2 is enabled.
    :::
1. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch. 
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced#nextflow-config-file) for more information on configuration priority. 
    :::
1. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
1. Configure any advanced options described in the next section, as needed.
1. Select **Create** to finalize the compute environment setup.

### Advanced options

Seqera Platform compute environments for EKS include advanced options for storage and work directory paths, resource allocation, and pod customization.

**Seqera EKS advanced options**

- The **Storage mount path** is the file system path where the Storage claim is mounted (default: `/scratch`).
- The **Work directory** is the file system path used as a working directory by Nextflow pipelines. This must be the storage mount path (default) or a subdirectory of it.
- The **Compute service account** is the service account used by Nextflow to submit tasks (default: the `default` account in the given namespace).
- The **Pod cleanup policy** determines when to delete terminated pods.
- Use **Custom head pod specs** to provide custom options for the Nextflow workflow pod (`nodeSelector`, `affinity`, etc). For example:

```yaml
spec:
    nodeSelector:
    disktype: ssd
```

- Use **Custom service pod specs** to provide custom options for the compute environment pod. See above for an example.
- Use **Head Job CPUs** and **Head Job memory** to specify the hardware resources allocated for the Nextflow workflow pod.

:::info
See [Launch pipelines](../launch/launchpad) to start executing workflows in your EKS compute environment.
:::

### Fusion v2

To use [Fusion v2](https://docs.seqera.io/fusion) in your Seqera EKS compute environment:
1. Use Seqera Platform version 23.1 or later.
1. Use an S3 bucket as the pipeline work directory. 
1. Both the head service and compute service accounts must have access to the S3 bucket specified as the work directory.

<details>
  <summary>Configure IAM to use Fusion v2</summary>

  1. Allow the IAM role access to your S3 bucket:

      ```json
      {
          "Version": "2012-10-17",
          "Statement": [
              {
                  "Effect": "Allow",
                  "Action": ["s3:ListBucket"],
                  "Resource": ["arn:aws:s3:::<YOUR-BUCKET>"]
              },
              {
                  "Action": [
                      "s3:GetObject",
                      "s3:PutObject",
                      "s3:PutObjectTagging",
                      "s3:DeleteObject"
                  ],
                  "Resource": ["arn:aws:s3:::<YOUR-BUCKET>/*"],
                  "Effect": "Allow"
              }
          ]
      }
      ```

      Replace `<YOUR-BUCKET>` with a bucket name of your choice.

  1. The IAM role must have a trust relationship with your Kubernetes service account:

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
                          "oidc.eks.eu-west-2.amazonaws.com/id/<YOUR CLUSTER ID>:aud": "sts.amazonaws.com",
                          "oidc.eks.eu-west-2.amazonaws.com/id/<YOUR CLUSTER ID>:sub": "system:serviceaccount:<YOUR-EKS-SERVICE-ACCOUNT>"
                      }
                  }
              }
          ]
      }
      ```

      Replace `<YOUR-ACCOUNT-ID>`, `<YOUR-REGION>`, `<YOUR-CLUSTER-ID>`, `<YOUR-EKS-SERVICE-ACCOUNT>` with your corresponding values.

  1. Annotate the Kubernetes service account with the IAM role:

      ```shell
      kubectl annotate serviceaccount <YOUR-EKS-SERVICE-ACCOUNT> --namespace <YOUR-EKS-NAMESPACE> eks.amazonaws.com/role-arn=arn:aws:iam::<YOUR-ACCOUNT-ID>:role/<YOUR-IAM-ROLE>
      ```

      Replace `<YOUR-EKS-SERVICE-ACCOUNT>`, `<YOUR-EKS-NAMESPACE>`, and `<YOUR-IAM-ROLE>` with your corresponding values.

    See the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html) for further details.

</details>


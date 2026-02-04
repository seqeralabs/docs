---
title: "Amazon EKS"
description: "Instructions to set up Amazon EKS in Seqera Platform"
date: "2026-02-04"
tags: [eks, amazon, compute environment, ce]
---

[Amazon EKS](https://aws.amazon.com/eks/) provides managed Kubernetes clusters that enable the execution of containerized workloads at scale.

Seqera Platform offers native support for Amazon EKS clusters as Compute Environments for Nextflow pipelines.

## Requirements

Seqera Platform assumes an EKS cluster already exists. You must have administrative privileges to configure the cluster for Seqera.
Follow the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions to create the resources required by Platform. In addition to the generic Kubernetes instructions, the following EKS-specific modifications are required.

### Service account role

Assign a service account role to the AWS IAM user used by Seqera to access the EKS cluster.

**Assign a service account role to your Seqera IAM user**

1. Retrieve your user ARN from the [AWS IAM console](https://console.aws.amazon.com/iam).

    :::note
    The same user must be used when specifying the AWS credentials in the Seqera compute environment configuration.
    :::

1. Modify the EKS auth configuration:

    ```bash
    kubectl edit configmap -n kube-system aws-auth
    ```

1. In the editor that opens, add the following entry, replacing `<AWS USER ARN>` with the user ARN retrieved from the AWS IAM console:

    ```yaml
    mapUsers: |
      - userarn: <AWS USER ARN>
        username: tower-launcher-user
        groups:
          - tower-launcher-role
    ```

1. The AWS user must have [this](../_templates/eks/eks-iam-policy.json) IAM policy applied.

Alternatively, an IAM role with the required permissions can be created and the Seqera IAM user can be allowed to assume that role: in this case, the role ARN must be specified in the **Assume role** field when configuring the Seqera compute environment (step 9 in the next section), the role must have a trust relationship with the Seqera IAM user, and the role must be added to the `mapRoles` section of the EKS auth configuration:

```yaml
mapRoles: |
  - rolearn: <IAM ROLE ARN>
    username: tower-launcher-role
    groups:
      - tower-launcher-role
```

See the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/auth-configmap.html) for more details.

## Seqera compute environment

:::caution
Your Seqera compute environment uses resources that you may be charged for in your AWS account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

Once all prerequisites are met, create a Seqera EKS compute environment:

1. After logging in to [Seqera](https://cloud.seqera.io) and selecting a workspace from the dropdown menu at the top of the page, select **Compute environments** from the navigation menu, then select **Add compute environment**.
1. Enter a descriptive name for this environment, e.g., _Amazon EKS (eu-west-1)_.
1. Select **Amazon EKS** as the target platform.
1. Under **Storage**, select either **Fusion storage** (recommended) or **Legacy storage**. The [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system allows access to your AWS S3-hosted data (`s3://` URLs). This eliminates the need to configure a shared file system in your Kubernetes cluster. See [Fusion v2](#fusion-v2) below.
1. From the **Credentials** drop-down, select existing AWS credentials, or select **+** to add new credentials. If you're using existing credentials, skip to step 9. The user must have the IAM permissions required to describe and list EKS clusters, per service account role requirements.

    :::note
    You can create multiple credentials in your Seqera environment. See [Credentials](../credentials/overview).
    :::
1. Enter a name, e.g., _EKS Credentials_.
1. Add the **Access key** and **Secret key** obtained from the AWS IAM console. This is the IAM user with the service account role detailed in the requirements section.
1. (Optional) Under **Assume role**, specify the IAM role to be assumed by the Seqera IAM user to access the compute environment's AWS resources.
    :::note
    When using AWS keys without an assumed role, the associated AWS user must have been granted permissions to operate on the cloud resources directly. When an assumed role is provided, the IAM user keys are only used to retrieve temporary credentials impersonating the role specified: this could be useful when e.g. multiple IAM users are used to access the same AWS account, and the actual permissions to operate on the resources are only granted to the role.
    :::
1. Select a **Region**, e.g., _eu-west-1 - Europe (Ireland)_. If using Fusion v2, this region must match the location of the S3 bucket you plan to use as work directory.
1. Select a **Cluster name** from the list of available EKS clusters in the selected region.
1. Specify the **Namespace** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions, which is _tower-nf_ by default.
1. Specify the **Head service account** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions, which is _tower-launcher-sa_ by default.
    :::note
    If you enable Fusion v2 (**Fusion storage** in step 4 above), the head service account must have access to the S3 storage bucket specified as your work directory.
    :::
1. Define the **Work directory** used as the working directory by Nextflow pipelines. If using Fusion v2, this must be an S3 bucket (e.g., `s3://my-bucket/work-dir`). If using Legacy storage, this must the name of a Persistent Volume Claim (PVC) created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions, e.g., _tower-scratch_.
1. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources produced by this compute environment. Workspace default resource labels are prefilled.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch.
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced#nextflow-config-file) for more information on configuration priority.
    :::
1. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
1. Configure any advanced options described in the next section, as needed.
1. Select **Create** to finalize the compute environment setup.

:::info
See [Launch pipelines](../launch/launchpad) to start executing workflows in your AWS Batch compute environment.
:::

### Advanced options

Seqera Platform compute environments for EKS include advanced options for storage and work directory paths, resource allocation, and pod customization.

**Seqera EKS advanced options**

- The **Storage mount path** is the file system path where the Storage claim is mounted (default: `/scratch`).
- The **Work directory** is the file system path used as a working directory by Nextflow pipelines. This must be the storage mount path (default) or a subdirectory of it.
- The **Compute service account** is the service account used by Nextflow to submit tasks (default: the `default` account in the given namespace).
- The **Pod cleanup policy** determines when to delete terminated pods.
- Use **Custom head pod specs** to provide custom options for the Nextflow workflow pod (e.g., `nodeSelector`, `affinity`, etc). For example:

```yaml
spec:
  nodeSelector:
    disktype: ssd
```

- Use **Custom service pod specs** to provide custom options for the compute environment pod, just like the custom head pod specs.
- Use **Head Job CPUs** and **Head Job memory** to specify the hardware resources allocated for the Nextflow workflow pod.

:::info
See [Launch pipelines](../launch/launchpad) to start executing workflows in your EKS compute environment.
:::

### Fusion v2

To use [Fusion v2](https://docs.seqera.io/fusion) in your Seqera EKS compute environment:
1. Use an S3 bucket as the work directory.
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

      Replace `<YOUR-BUCKET>` with the bucket name used as work directory.

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
                          "oidc.eks.eu-west-2.amazonaws.com/id/<YOUR-CLUSTER-ID>:aud": "sts.amazonaws.com",
                          "oidc.eks.eu-west-2.amazonaws.com/id/<YOUR-CLUSTER-ID>:sub": "system:serviceaccount:<YOUR-EKS-SERVICE-ACCOUNT>"
                      }
                  }
              }
          ]
      }
      ```

      Replace `<YOUR-ACCOUNT-ID>`, `<YOUR-REGION>`, `<YOUR-CLUSTER-ID>`, `<YOUR-EKS-SERVICE-ACCOUNT>` with the corresponding values.

  1. Annotate the Kubernetes service account with the IAM role:

      ```shell
      kubectl annotate serviceaccount <YOUR-EKS-SERVICE-ACCOUNT> --namespace <YOUR-EKS-NAMESPACE> eks.amazonaws.com/role-arn=arn:aws:iam::<YOUR-ACCOUNT-ID>:role/<YOUR-IAM-ROLE>
      ```

      Replace `<YOUR-EKS-SERVICE-ACCOUNT>`, `<YOUR-EKS-NAMESPACE>`, and `<YOUR-IAM-ROLE>` with the corresponding values previously defined.

    See the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html) for further details.

</details>

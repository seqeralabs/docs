---
title: "Amazon EKS"
description: "Instructions to set up Amazon EKS in Seqera Platform"
date: "2026-02-04"
tags: [eks, amazon, compute environment, ce]
---

[Amazon EKS](https://aws.amazon.com/eks/) provides managed Kubernetes clusters that enable the execution of containerized workloads at scale. Seqera Platform offers native support for Amazon EKS clusters as Compute Environments for Nextflow pipelines.

## Requirements

- Seqera Platform needs an IAM User to obtain details about the EKS cluster, and to fetch log files from the S3 bucket, if one is used as work directory. This user must have the permissions detailed in the [AWS IAM policies](/platform-cloud/integrations/cloud-providers/aws/iam-policies) reference (select the **Amazon EKS** tab). Optionally, permissions can instead be granted to an IAM role that the IAM user can assume when accessing AWS resources.

- To use Fusion (recommended) to access data hosted on S3, including writing files to the Nextflow work directory, you need an IAM role that allows the EKS Service Account that Seqera pods use to interact with AWS resources. Refer to section [Configure EKS Service Account IAM role for Fusion v2](/platform-cloud/integrations/cloud-providers/aws/eks-additions#configure-eks-service-account-iam-role-for-fusion-v2) for details.
Create a separate IAM role from the optional one assumed by the IAM user to separate the permissions needed by the EKS Service Account from those needed by the IAM user. If you plan to use legacy storage instead of Fusion, you can skip this step.

:::tip
Seqera Platform assumes an EKS cluster already exists. Follow the [cluster preparation](./k8s) instructions to create the resources required by Seqera. Some administrative privileges are also needed to allow the IAM User to access the cluster, as detailed in the [EKS access](/platform-cloud/integrations/cloud-providers/aws/eks-additions#allow-an-iam-user-or-role-access-to-eks) section.
:::

Once you meet all the prerequisites, configure an [Amazon EKS Compute Environment](#amazon-eks-compute-environment) in Seqera.

## Before you start

Set up the [AWS integration](/platform-cloud/integrations/cloud-providers/aws/overview) before creating an Amazon EKS compute environment in Seqera:

- [AWS IAM policies](/platform-cloud/integrations/cloud-providers/aws/iam-policies) — required permissions (select the **Amazon EKS** tab).
- [AWS credentials](/platform-cloud/integrations/cloud-providers/aws/credentials) — IAM policy, IAM user, IAM role, and how to add credentials in Seqera.
- [EKS additions](/platform-cloud/integrations/cloud-providers/aws/eks-additions) — Service Account IAM role for Fusion v2 and `aws-auth` ConfigMap setup.

Cluster preparation steps that are specific to running pods in EKS (rather than to Seqera's authentication) remain in the [Kubernetes cluster guide](/platform-cloud/compute-envs/k8s).

{/* Anchor stubs preserved for backwards compatibility with deep links from older content. */}
<a id="required-platform-iam-permissions"></a>
<a id="create-the-iam-policy"></a>
<a id="iam-user-creation"></a>
<a id="iam-role-creation-optional"></a>
<a id="obtain-iam-user-credentials"></a>
<a id="aws-credential-options"></a>
<a id="configure-eks-service-account-iam-role-for-fusion-v2"></a>
<a id="allow-an-iam-user-or-role-access-to-eks"></a>

## Amazon EKS compute environment

:::caution
Your compute environment uses resources that you may be charged for in your AWS account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

Once all prerequisites are met, create a Seqera EKS compute environment:

1. Select **Compute environments** from the navigation menu of the Seqera Workspace where you want to setup the CE.
1. Enter a descriptive name for this environment, e.g., `Amazon EKS (eu-west-1)`.
1. Select **Amazon EKS** as the target platform.
1. Under **Storage**, select either **Fusion storage** (recommended) or **Legacy storage**. The [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system allows access to your AWS S3-hosted data (`s3://` URLs). This eliminates the need to configure a shared file system in your Kubernetes cluster. See [Configure EKS Service Account IAM role for Fusion v2](/platform-cloud/integrations/cloud-providers/aws/eks-additions#configure-eks-service-account-iam-role-for-fusion-v2) below.
1. From the **Credentials** drop-down, select existing AWS credentials, or select **+** to add new credentials. If you're using existing credentials, skip to step 9. The user must have the IAM permissions required to describe and list EKS clusters, per Service Account role requirements.

    :::note
    You can create multiple credentials in your Seqera environment. See [Credentials](/platform-cloud/integrations/overview).
    :::

1. Enter a name, e.g., `EKS Credentials`.
1. Under **AWS credential mode**, select **Keys** or **Role**.
1. For **Keys** mode:
   - Add the **Access key** and **Secret key** obtained from the AWS IAM console.
   - Optionally paste the IAM role ARN which Seqera must use for accessing your AWS resources in **Assume role**.
   - If you paste a role ARN in **Assume role**, the **Generate External ID** switch is displayed. Generating an External ID is optional in **Keys** mode.
   - If **Generate External ID** is selected, an External ID is automatically generated and shown after you save the credential.
1. For **Role** mode:
   - Paste the IAM role ARN which Seqera must use for accessing your AWS resources in **Assume role**.
   - External ID is generated automatically when you save the credential.

    :::note
    When using AWS keys without an assumed role, the associated AWS user must have been granted permissions to operate on the cloud resources directly. When an assumed role is provided, the IAM user keys are only used to retrieve temporary credentials impersonating the role specified: this could be useful when e.g. multiple IAM users are used to access the same AWS account, and the actual permissions to operate on the resources are only granted to the role.
    :::

1. Select a **Region**, e.g., `eu-west-1 - Europe (Ireland)`. If using Fusion v2, this region must match the location of the S3 bucket you plan to use as work directory.
1. Select a **Cluster name** from the list of available EKS clusters in the selected region.
1. Specify the **Namespace** created in the [cluster preparation](./k8s) instructions, `tower-nf` by default.
1. Specify the **Head service account** created in the [cluster preparation](./k8s) instructions, `tower-launcher-sa` by default.

    :::note
    If you enable Fusion v2 (**Fusion storage** in step 4 above), the head service account must have access to the S3 storage bucket specified as your work directory. In the [Advanced options](#amazon-eks-advanced-options) below, a service account for compute jobs need to also be specified to allow pods to interact with AWS.
    :::

1. Define the **Work directory** used as the working directory by Nextflow pipelines. If using Fusion v2, this must be an S3 bucket (e.g., `s3://my-bucket/work-dir`). If using Legacy storage, this must the name of a Persistent Volume Claim (PVC) created in the [cluster preparation](./k8s) instructions, e.g., `tower-scratch`.
1. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources produced by this compute environment. Workspace default resource labels are prefilled.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch.
      Here's an example configuration to require the compute pods to be scheduled on specific nodes:

    ```groovy
    k8s {
      pod = [
        [
          nodeSelector: 'myNodeSelector=my-nodes-for-k8s-as-compute'
        ],
        [
          toleration: [
            key: 'myNodeSelector',
            operator: 'Equal',
            value: 'my-nodes-for-k8s-as-compute',
            effect: 'NoSchedule'
          ]
        ]
      ]
    }
    ```

    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced#nextflow-config-file) for more information on configuration priority.
    :::

1. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
1. Configure any advanced options described in the next section, as needed.

### Amazon EKS advanced options

Amazon EKS compute environments include advanced options for storage and work directory paths, resource allocation, and pod customization.

- The **Storage mount path** is the file system path where Seqera mounts the Storage claim (default: `/scratch`).

- The **Work directory** is the file system path that Nextflow pipelines use as a working directory. This must be the storage mount path (default) or a subdirectory of it.
- The **Compute service account** is the service account that Nextflow uses to submit tasks (default: the `default` account in the given namespace).

    :::note
    If you enable Fusion v2 (**Fusion storage** in step 4 above), the compute service account must have access to the S3 storage bucket specified as your work directory.
    This can be the same Service Account used by the Head jobs (`tower-launcher-sa`, created in the [cluster preparation](./k8s) guide), or a separate Service Account with more granular permissions.
    :::

- The **Pod cleanup policy** determines when to delete terminated pods.
- Use **Custom head pod specs** to provide custom options for the Nextflow workflow pod (e.g., `nodeSelector`, `affinity`, etc). For example:

```yaml
spec:
  nodeSelector:
    disktype: ssd
```

- Use **Head Job CPUs** and **Head Job memory** to specify resource requirements of the Nextflow workflow pods.

:::info
See [Launch pipelines](../launch/launchpad) to start executing workflows in your Amazon EKS compute environment.
:::

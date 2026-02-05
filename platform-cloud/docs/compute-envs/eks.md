---
title: "Amazon EKS"
description: "Instructions to set up Amazon EKS in Seqera Platform"
date: "2026-02-04"
tags: [eks, amazon, compute environment, ce]
---

[Amazon EKS](https://aws.amazon.com/eks/) provides managed Kubernetes clusters that enable the execution of containerized workloads at scale. Seqera Platform offers native support for Amazon EKS clusters as Compute Environments for Nextflow pipelines.

## Requirements

- Seqera Platform needs an IAM User to obtain details about the EKS cluster, and to fetch log files from the S3 bucket, if one is used as work directory. This user must have the permissions detailed in the [Required Platform IAM permissions](#required-platform-iam-permissions) section. Optionally, permissions can instead be granted to an IAM role that the IAM user can assume when accessing AWS resources.

- To use Fusion (recommended) to access data hosted on S3, including writing files to the Nextflow work directory, you need an IAM role that allows the EKS Service Account that Seqera pods use to interact with AWS resources. Refer to section [Configure EKS Service Account IAM role for Fusion v2](#configure-eks-service-account-iam-role-for-fusion-v2) for details.
Create a separate IAM role from the optional one assumed by the IAM user to separate the permissions needed by the EKS Service Account from those needed by the IAM user. If you plan to use legacy storage instead of Fusion, you can skip this step.

- Seqera Platform assumes an EKS cluster already exists. Follow the [cluster preparation](./k8s) instructions to create the resources required by Platform. Some administrative privileges are also needed to allow the IAM User to access the cluster, as detailed in the [Kubernetes Service Account setup](#allow-iam-user-or-role-to-access-eks) section.

Once you meet all the prerequisites, configure an [Amazon EKS Compute Environment](#amazon-eks-compute-environment) in Seqera Platform.


## Required Platform IAM permissions

Seqera Platform requires an IAM user with specific permissions to launch pipelines, explore buckets with Data Explorer, and run Studio sessions on the AWS EKS compute environment. Some permissions are mandatory for the compute environment to function correctly, while others are optional and enable features like populating dropdown lists in the Platform UI.

Attach permissions directly to an [IAM user](#iam-user-creation), or to an [IAM role](#iam-role-creation-optional) that the IAM user can assume.


A permissive and broad policy with all the required permissions is provided here for a quick start. However, we recommend following the principle of least privilege and only granting the necessary permissions for your use case, as shown in the following sections.

<details>
<summary>Full permissive policy (for reference)</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EKSClusterAccessCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster",
        "eks:ListClusters"
      ],
      "Resource": "*"
    },
    {
      "Sid": "OptionalS3PlatformDataAccessCanBeRestricted",
      "Effect": "Allow",
      "Action": [
        "s3:Get*",
        "s3:List*",
        "s3:PutObject",
        "s3:PutObjectTagging",
        "s3:DeleteObject"
      ],
      "Resource": "*"
    }
  ]
}
```

</details>

### EKS cluster access

Seqera needs permissions to list EKS clusters in the selected region and to describe the selected cluster to retrieve its connection details. The `eks:ListClusters` action cannot be restricted to specific resources, but the `eks:DescribeCluster` action can be restricted to the specific cluster used as compute environment.

```json
{
  "Sid": "EKSClusterListing",
  "Effect": "Allow",
  "Action": [
    "eks:ListClusters"
  ],
  "Resource": "*"
},
{
  "Sid": "EKSClusterDescription",
  "Effect": "Allow",
  "Action": [
    "eks:DescribeCluster"
  ],
  "Resource": "arn:aws:eks:<REGION>:<ACCOUNT_ID>:cluster/<CLUSTER_NAME>"
}
```

No other permissions are required for the IAM user to launch pipelines on the EKS compute environment, as the Service Account created in the [cluster preparation](./k8s) phase performs the actual management of pods and resources, which the IAM user can access via EKS authentication, detailed [in the section below](#allow-iam-user-or-role-to-access-eks).


### S3 access (optional)

Seqera automatically attempts to fetch a list of S3 buckets available in the AWS account connected to Platform, to provide them in a drop-down menu to be used as Nextflow working directory, and make the compute environment creation smoother. This feature is optional, and users can type the bucket name manually when setting up a compute environment. To allow Seqera to fetch the list of buckets in the account, the `s3:ListAllMyBuckets` action can be added, and it must have the `Resource` field set to `*`.

Seqera offers several products to manipulate data on AWS S3 buckets, such as [Studios](../studios/overview) and [Data Explorer](../data/data-explorer); if these features are not needed the related permissions can be omitted.

The IAM policy can be scoped down to only allow limited read/write permissions in certain S3 buckets used by Studios/Data Explorer. In addition, the policy must include permission to check the region and list the content of the S3 bucket used as Nextflow work directory. We also recommend granting the `s3:GetObject` permission on the work directory path to fetch Nextflow log files.

:::note
If you opted to create a separate S3 bucket only for Nextflow work directories, the IAM user or the Role it assumes only need read access to it. The IAM role used by the EKS Service Account (detailed in the [separate section](#configure-eks-service-account-iam-role-for-fusion-v2)) must have full read/write access to the work directory bucket to allow Fusion to operate correctly.
:::

```json
{
  "Sid": "S3CheckBucketWorkDirectory",
  "Effect": "Allow",
  "Action": [
    "s3:ListBucket"
  ],
  "Resource": [
    "arn:aws:s3:::example-bucket-used-as-work-directory"
  ]
},
{
  "Sid": "S3ReadOnlyNextflowLogFiles",
  "Effect": "Allow",
  "Action": [
    "s3:GetObject"
  ],
  "Resource": [
    "arn:aws:s3:::example-bucket-used-as-work-directory/path/to/work/directory/*"
  ]
},
{
  "Sid": "S3ReadWriteBucketsForStudiosDataExplorer",
  "Effect": "Allow",
  "Action": [
    "s3:Get*",
    "s3:List*",
    "s3:PutObject"
  ],
  "Resource": [
    "arn:aws:s3:::example-bucket-read-write-studios",
    "arn:aws:s3:::example-bucket-read-write-studios/*",
    "arn:aws:s3:::example-bucket-read-write-data-explorer",
    "arn:aws:s3:::example-bucket-read-write-data-explorer/*"
  ]
}
```

## Create the IAM policy

The policy above must be created in the AWS account where the EKS and S3 resources are located.

1. Open the [AWS IAM console](https://console.aws.amazon.com/iam).
1. From the left navigation menu, select **Policies** under **Access management**.
1. Select **Create policy**.
1. On the **Policy editor** section, select the **JSON** tab.
1. Following the instructions detailed in the [IAM permissions breakdown section](#required-platform-iam-permissions) replace the default text in the policy editor area under the **JSON** tab with a policy adapted to your use case, then select **Next**.
1. Enter a name and description for the policy on the **Review and create** page, then select **Create policy**.

## IAM user creation

Seqera requires an Identity and Access Management (IAM) User to describe EKS clusters and S3 buckets in your AWS account. We recommend creating a separate IAM policy rather an IAM User inline policy, as the latter only allows 2048 characters, which may not be sufficient for all the required permissions.

In certain scenarios, for example when multiple users need to access the same AWS account, an IAM role with the required permissions can be created instead, and the IAM user allowed to assume the role, as detailed in the [IAM role creation (optional)](#iam-role-creation-optional) section.

### Create an IAM user

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Users** in the left navigation menu, then select **Create User** at the top right of the page.
1. Enter a name for your user (e.g., _seqera_) and select **Next**.
1. Under **Permission options**, select **Attach policies directly**, then search for and select the policy created above, and select **Next**.
   * If you instead prefer to make the IAM user assume a role to manage AWS resources (see the [IAM role creation (optional)](#iam-role-creation-optional) section), create a policy with the following content (edit the AWS principal with the ARN of the role created) and attach it to the IAM user:

   ```json
   {
     "Sid": "AssumeRole",
     "Effect": "Allow",
     "Action": "sts:AssumeRole",
     "Resource": "arn:aws:iam::<ACCOUNT_ID>:role/<IAM_ROLE_NAME>"
   }
   ```
1. On the last page, review the user details and select **Create user**.

The user has now been created. For more details see the [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).

### Obtain IAM user credentials

To get the credentials needed to connect Seqera to your AWS account, follow these steps:

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Users** in the left navigation menu, then select the newly created user from the users table.
1. Select the **Security credentials** tab, then select **Create access key** under the **Access keys** section.
1. In the **Use case** dialog that appears, select **Command line interface (CLI)**, then tick the confirmation checkbox at the bottom to acknowledge that you want to proceed creating an access key, and select **Next**.
1. Optionally provide a description for the access key, like the reason for creating it, then select **Create access key**.
1. Save the **Access key** and **Secret access key** in a secure location as they are needed when configuring credentials in Seqera.

## IAM role creation (optional)

Rather than attaching permissions directly to the IAM user, you can create an IAM role with the required permissions and allow the IAM user to assume that role when accessing AWS resources. This is useful when multiple IAM users are used to access the same AWS account: this way the actual permissions to operate on the resources are only granted to a single centralized role.

1. From the [AWS IAM console](https://console.aws.amazon.com/iam), select **Roles** in the left navigation menu, then select **Create role** at the top right of the page.
1. Select **Custom trust policy** as the type of trusted entity, provide the following policy and edit the AWS principal with the ARN of the IAM user created in the [IAM user creation](#iam-user-creation) section, then select **Next**.

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
         "Action": "sts:AssumeRole"
       }
     ]
   }
   ```

1. On the **Permissions** page, search for and select the policy created in the [IAM user creation](#iam-user-creation) section, then select **Next**.
1. Give the role a name and optionally a description, review the details of the role, optionally provide tags to help you identify the role, then select **Create role**.

Multiple users can be specified in the trust policy by adding more ARNs to the `Principal` section.

## Configure EKS Service Account IAM role for Fusion v2

To use [Fusion v2](https://docs.seqera.io/fusion) in your Amazon EKS compute environment, an AWS S3 bucket must be used as work directory and both the head and compute Service Accounts (if separate) must have access to the S3 bucket specified as the work directory.

If you do not plan to use Fusion in favor of legacy storage, you can skip this section.

Create an IAM role with the following permissions:


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

Replace `<YOUR-BUCKET>` with the bucket name used as work directory.

The IAM role must also have a trust relationship with the Kubernetes service account (or accounts) that Seqera uses to manage the EKS cluster, which is `tower-launcher-sa` in the default configuration.:


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

Replace `<YOUR-ACCOUNT-ID>`, `<YOUR-REGION>`, `<YOUR-CLUSTER-ID>`, `<YOUR-EKS-NAMESPACE>`, `<YOUR-EKS-SERVICE-ACCOUNT>` with the corresponding values.

Annotate the Kubernetes Service Account with the IAM role:

```shell
kubectl annotate serviceaccount <YOUR-EKS-SERVICE-ACCOUNT> --namespace <YOUR-EKS-NAMESPACE> eks.amazonaws.com/role-arn=arn:aws:iam::<YOUR-ACCOUNT-ID>:role/<YOUR-IAM-ROLE>
```

Replace `<YOUR-EKS-SERVICE-ACCOUNT>` (by default `tower-launcher-sa`, as created in the [cluster preparation guide](./k8s)), `<YOUR-EKS-NAMESPACE>`, and `<YOUR-IAM-ROLE>` with the corresponding values previously defined.

This will allow pods using that service account to assume the IAM role and access the S3 bucket specified as work directory.
See the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html) for further details.

## Allow IAM User or Role to access EKS

Configure the EKS cluster to allow the IAM user (or the IAM role it assumes) to access the cluster and manage pods.

1. Retrieve from the [AWS IAM console](https://console.aws.amazon.com/iam) the ARN of the [IAM User](#iam-user-creation) or [IAM Role](#iam-role-creation-optional) previously created.

    :::note
    The AWS credentials for the IAM user will be used in the Seqera compute environment configuration.
    :::

1. Modify the EKS aws-auth ConfigMap to allow the IAM User to access the cluster and manage pods. This step may require cluster administrator privileges:

    ```bash
    kubectl edit configmap -n kube-system aws-auth
    ```

1. In the editor that opens, edit the `mapUsers` section to add the following entry, replacing `<AWS-IAM-USER-ARN>` with the user ARN retrieved from the AWS IAM console:

    ```yaml
    mapUsers: |
      - userarn: <AWS-IAM-USER-ARN>
        username: tower-launcher-user
        groups:
          - tower-launcher-role
    ```

   Alternatively, an IAM role can be allowed to authenticate to the cluster: in this case, the role ARN must be specified in the **Assume role** field when configuring the Seqera compute environment (step 9 in the [Amazon EKS compute environment](#amazon-eks-compute-environment) section), the role must have a trust relationship with the Seqera IAM user, and the role `<AWS-IAM-ROLE-ARN>` must be added to the `mapRoles` section of the EKS auth configuration instead:

    ```yaml
    mapRoles: |
      - rolearn: <AWS-IAM-ROLE-ARN>
        username: tower-launcher-role
        groups:
          - tower-launcher-role
    ```

   See the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/auth-configmap.html) for more details on modifying the aws-auth ConfigMap of an EKS cluster.

## Amazon EKS compute environment

:::caution
Your compute environment uses resources that you may be charged for in your AWS account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

Once all prerequisites are met, create a Seqera EKS compute environment:

1. After logging in to [Seqera](https://cloud.seqera.io) and selecting a workspace from the dropdown menu at the top of the page, select **Compute environments** from the navigation menu, then select **Add compute environment**.
1. Enter a descriptive name for this environment, e.g., `Amazon EKS (eu-west-1)`.
1. Select **Amazon EKS** as the target platform.
1. Under **Storage**, select either **Fusion storage** (recommended) or **Legacy storage**. The [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system allows access to your AWS S3-hosted data (`s3://` URLs). This eliminates the need to configure a shared file system in your Kubernetes cluster. See [Configure EKS Service Account IAM role for Fusion v2](#configure-eks-service-account-iam-role-for-fusion-v2) below.
1. From the **Credentials** drop-down, select existing AWS credentials, or select **+** to add new credentials. If you're using existing credentials, skip to step 9. The user must have the IAM permissions required to describe and list EKS clusters, per Service Account role requirements.

    :::note
    You can create multiple credentials in your Seqera environment. See [Credentials](../credentials/overview).
    :::

1. Enter a name, e.g., `EKS Credentials`.
1. Add the **Access key** and **Secret key** obtained from the AWS IAM console. This is the [IAM user](#obtain-iam-user-credentials) with the Service Account role detailed in the requirements section.
1. (Optional) Under **Assume role**, specify the [IAM role](#iam-role-creation-optional) to be assumed by the Seqera IAM user to access the compute environment's AWS resources.

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

---
title: "eks"
description: "Step-by-step instructions to set up a Tower compute environment for Amazon EKS clusters"
---

## Overview

[Amazon EKS](https://aws.amazon.com/eks/) is a managed Kubernetes cluster that allows the execution of containerized workloads in the AWS cloud at scale.

Tower offers native support for AWS EKS clusters and streamlines the deployment of Nextflow pipelines in such environments.

## Requirements

You need to have an EKS cluster up and running. Make sure you have followed the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions to create the cluster resources required by Tower. In addition to the generic Kubernetes instructions, you will need to make a few modifications specific to EKS.

**Assign service account role to IAM user.** You will need to assign the service role with an AWS user that will be used by Tower to access the EKS cluster.

First, use the following command to modify the EKS auth configuration:

```bash
kubectl edit configmap -n kube-system aws-auth
```

Once the editor is open, add the following entry:

```yaml
mapUsers: |
  - userarn: <AWS USER ARN>
    username: tower-launcher-user
    groups:
      - tower-launcher-role
```

Your user ARN can be retrieved from the [AWS IAM console](https://console.aws.amazon.com/iam) or from the AWS CLI:

```bash
aws sts get-caller-identity
```

:::note
The same user needs to be used when specifying the AWS credentials in the configuration of the Tower compute environment for EKS.
:::

The AWS user should have the following IAM policy:

<details>
    <summary>Click to view eks-iam-policy.json</summary>
    ```yaml
     "docs/_templates/eks/eks-iam-policy.json"
    ```
</details>

For more details, refer to the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html).

### Compute Environment

1. In a workspace, select **Compute Environments** and then **New Environment**.

2. Enter a descriptive name for this environment, e.g. "Amazon EKS (eu-west-1)".

3. Select **Amazon EKS** as the target platform.

4. From the **Credentials** drop-down, select existing AWS credentials, or add new credentials by selecting the **+** button. If you select to use existing credentials, skip to step 7.

   :::note
   Make sure the user has the IAM permissions required to describe and list EKS clusters as explained [here](#requirements).
   :::

   :::note
   From version 22.3, Tower supports the use of credentials for container registry services. These credentials can be created from the [Credentials](../credentials/overview) tab.
   :::

5. Select a **Region**, for example "eu-west-1 - Europe (Ireland)".

6. Select a **Cluster name** from the list of available EKS clusters in the selected region.

7. Specify the **Namespace** created in the [cluster preparation](#cluster-preparation) instructions, which is `tower-nf` by default.

8. Specify the **Head service account** created in the [cluster preparation](#cluster-preparation) instructions, which is `tower-launcher-sa` by default.

9. Specify the **Storage claim** created in the [cluster preparation](#cluster-preparation) instructions, which serves as a scratch filesystem for Nextflow pipelines. In each of the provided examples, the storage claim is called `tower-scratch`.

10. You can use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

11. Configure any advanced options described below, as needed.

12. Select **Create** to finalize the compute environment setup.

Jump to the documentation for [Launching Pipelines](../launch/launchpad).

### Advanced options

- The **Storage mount path** is the file system path where the Storage claim is mounted (default: `/scratch`).

- The **Work directory** is the file system path used as a working directory by Nextflow pipelines. It must be the storage mount path (default) or a subdirectory of it.

- The **Compute service account** is the service account used by Nextflow to submit tasks (default: the `default` account in the given namespace).

- The **Pod cleanup policy** determines when terminated pods should be deleted.

- You can use **Custom head pod specs** to provide custom options for the Nextflow workflow pod (`nodeSelector`, `affinity`, etc). For example:

  ```yaml
  spec:
    nodeSelector:
      disktype: ssd
  ```

- You can use **Custom service pod specs** to provide custom options for the compute environment pod. See above for an example.

- You can use **Head Job CPUs** and **Head Job Memory** to specify the hardware resources allocated for the Nextflow workflow pod.

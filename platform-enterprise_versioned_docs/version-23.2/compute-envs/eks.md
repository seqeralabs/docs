---
title: "Amazon EKS"
description: "Instructions to set up Amazon EKS in Nextflow Tower"
date: "21 Apr 2023"
tags: [eks, amazon, compute environment]
---

[Amazon EKS](https://aws.amazon.com/eks/) is a managed Kubernetes cluster that enables the execution of containerized workloads in the AWS cloud at scale.

Tower offers native support for Amazon EKS clusters to streamline the deployment of Nextflow pipelines.

## Requirements

You must have an EKS cluster up and running. Follow the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions to create the resources required by Tower. In addition to the generic Kubernetes instructions, you must make a number of EKS-specific modifications.

### Assign service account role to IAM user

You will need to assign the service role to an AWS user that will be used by Tower to access the EKS cluster.

First, modify the EKS auth configuration:

```bash
kubectl edit configmap -n kube-system aws-auth
```

Once the editor is open, add this entry:

```yaml
mapUsers: |
  - userarn: <AWS USER ARN>
    username: tower-launcher-user
    groups:
      - tower-launcher-role
```

Retrieve your user ARN from the [AWS IAM console](https://console.aws.amazon.com/iam), or with the AWS CLI:

```bash
aws sts get-caller-identity
```

:::note
The same user must be used when specifying the AWS credentials in the Tower compute environment configuration.
:::

The AWS user must have the following IAM policy:

<details>
    <summary>eks-iam-policy.json</summary>

```yaml file=../_templates/eks/eks-iam-policy.json

```

</details>

See the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html) for more details.

## Compute environment

1. In a workspace, select **Compute environments** and then **New environment**.

2. Enter a descriptive name for this environment, e.g., "Amazon EKS (eu-west-1)".

3. Select **Amazon EKS** as the target platform.

4. From the **Credentials** drop-down, select existing AWS credentials, or add new credentials by selecting the **+** button. If you select to use existing credentials, skip to step 7.

:::note
The user must have the IAM permissions required to describe and list EKS clusters as explained [here](#requirements).
:::

5. Select a **Region**, e.g., "eu-west-1 - Europe (Ireland)".

6. Select a **Cluster name** from the list of available EKS clusters in the selected region.

7. Specify the **Namespace** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions, which is `tower-nf` by default.

8. Specify the **Head service account** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions, which is `tower-launcher-sa` by default.

9. Specify the **Storage claim** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions, which serves as a scratch filesystem for Nextflow pipelines. The storage claim is called `tower-scratch` in each of the provided examples.

10. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.

11. Expand **Staging options** to include optional pre- or post-run Bash scripts that execute before or after the Nextflow pipeline execution in your environment.

12. Use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

13. Configure any advanced options described below, as needed.

14. Select **Create** to finalize the compute environment setup.

Jump to the documentation for [launching pipelines](../launch/launchpad).

### Advanced options

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

<!--revisit for k8s CE pages consolidation:

Fusion v2 config options

Did you actually follow this steps during your review?

When I set up my EKS installation a while ago (following @bentsherman 's guide here: https://seqera.io/blog/deploying-nextflow-on-amazon-eks/) I ran into difficulties getting the Tower-EKS link up and had to go off-script to get things working.

We should probably verify nothing changes depending on EKS version (e.g. 1.25). @enekui-->

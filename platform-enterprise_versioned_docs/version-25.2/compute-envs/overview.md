---
title: "Compute environment overview"
description: "Overview of compute environments in Seqera Platform"
date: "21 Apr 2023"
tags: [compute environment]
---

Seqera Platform **compute environments** define the execution platform where a pipeline will run. Compute environments enable users to launch pipelines on a growing number of **cloud** and **on-premises** platforms.

Each compute environment must be configured to enable Seqera to submit tasks. See the individual compute environment pages below for platform-specific configuration steps.

## Platforms

- [AWS Batch](./aws-batch)
- [Azure Batch](./azure-batch)
- [Google Cloud Batch](./google-cloud-batch)
- [Google Life Sciences](./google-cloud-lifesciences)
- [Grid Engine](./hpc)
- [Altair PBS Pro](./hpc)
- [IBM LSF](./hpc)
- [Moab](./hpc)
- [Slurm](./hpc)
- [Kubernetes](./k8s)
- [Amazon EKS](./eks)
- [Google Kubernetes Engine](./gke)

## Select default compute environment

If you have more than one compute environment, you can select a workspace primary compute environment to be used as the default when launching pipelines in that workspace. In a workspace, select **Compute Environments**. Then select **Make primary** from the options menu next to the compute environment you wish to use as default.

## Rename compute environment

You can edit the names of compute environments in private and organization workspaces. Select **Rename** from the options menu next to the compute environment you wish to edit.

Select **Update** on the edit page to save your changes after you have updated the compute environment name.

## GPU usage

The process for provisioning GPU instances in your compute environment differs for each cloud provider.

### AWS Batch

The AWS Batch compute environment creation form in Seqera includes an **Enable GPUs** option. This enables you to run GPU-dependent workflows in the compute environment.

Some important considerations:

- Seqera only supports NVIDIA GPUs. Select instances with NVIDIA GPUs for your GPU-dependent processes.
- The **Enable GPUs** setting causes Batch Forge to specify the most current [AWS-recommended GPU-optimized ECS AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html) as the EC2 fleet AMI when creating the compute environment. This setting can be overridden by **AMI ID** in the advanced options.
- The **Enable GPUs** setting alone does not deploy GPU instances in your compute environment. You must still specify GPU-enabled instance types in the **Advanced options > Instance types** field.
- Your Nextflow script must include [accelerator directives](https://www.nextflow.io/docs/latest/process.html?highlight=accelerator#accelerator) to use the provisioned GPUs.
- The NVIDIA Container Runtime uses [environment variables](https://github.com/NVIDIA/nvidia-container-runtime#environment-variables-oci-spec) in container images to specify a GPU accelerated container. These variables should be included in the [`containerOptions`](https://www.nextflow.io/docs/latest/process.html#process-containeroptions) directive for each GPU-dependent process in your Nextflow script. The `containerOptions` directive can be set inline in your process definition or via configuration. For example, to add the directive to a process named `UseGPU` via configuration:

```groovy
process {
  withName: UseGPU {
    containerOptions '-e NVIDIA_DRIVER_CAPABILITIES=compute,utility -e NVIDIA_VISIBLE_DEVICES=all'
  }
}
```

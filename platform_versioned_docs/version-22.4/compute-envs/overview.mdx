---
title: "overview"
description: "Overview of compute environments in Nextflow Tower."
---

## Overview

Tower uses the concept of **compute environments** to define the execution platform where a pipeline will run. Compute environments enable Tower users to launch pipelines on a growing number of **cloud** and **on-premise** infrastructures.

Each compute environment must be configured to enable Tower to submit tasks. See the individual compute environment pages below for platform-specific configuration steps.

### Platforms

- [AWS Batch](./aws-batch.mdx)
- [Azure Batch](./azure-batch.mdx)
- [Google Cloud Batch](./google-cloud-batch.mdx)
- [Google Life Sciences](./google-cloud-lifesciences.mdx)
- [Altair Grid Engine](./altair-grid-engine.mdx)
- [Altair PBS Pro](./altair-pbs-pro.mdx)
- [IBM LSF](./lsf.mdx)
- [Moab](./moab.mdx)
- [Slurm](./slurm.mdx)
- [Kubernetes](./k8s.mdx)
- [Amazon EKS](./eks.mdx)
- [Google GKE](./gke.mdx)

### Select a default compute environment

If you have more than one compute environment, you can select which one will be used by default when launching a pipeline.

1. In a workspace, select **Compute Environments**.

2. Select **Make primary** for a particular compute environment to make it your default.

### GPU usage

The process for provisioning GPU instances in your compute environment differs for each cloud provider.

### AWS Batch

The AWS Batch compute environment creation form in Tower includes an **Enable GPUs** option. This option makes it possible to run GPU-dependent workflows in the compute environment. Note that:

- The **Enable GPUs** setting alone does not cause GPU instances to deploy in your compute environment. You must still specify GPU-enabled instance types in the **Advanced options > Instance types** field.

- The **Enable GPUs** setting causes Batch Forge to specify the most current [AWS-recommended GPU-optimized ECS AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html) as the EC2 fleet AMI when creating the compute environment.

- This setting can be overridden by **AMI ID** in the advanced options.

- The NVIDIA Container Runtime uses [environment variables](https://github.com/NVIDIA/nvidia-container-runtime#environment-variables-oci-spec) in container images to specify a GPU accelerated container. These variables should be included in the [`containerOptions`](https://www.nextflow.io/docs/latest/process.html#process-containeroptions) directive for each GPU-dependent process in your Nextflow script. The `containerOptions` directive can be set inline in your process definition or via configuration. For example, to add the directive to a process named `UseGPU` via configuration:

```groovy
process {
  withName: UseGPU {
    containerOptions '-e NVIDIA_DRIVER_CAPABILITIES=compute,utility -e NVIDIA_VISIBLE_DEVICES=all'
  }
}
```

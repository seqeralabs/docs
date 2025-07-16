---
title: "Google Cloud"
description: "Instructions to set up an Google Cloud CE in Seqera Platform"
date created: "2025-07-15"
tags: [cloud, vm, google, compute environment]
---

# Google Cloud

:::note
This compute environment type is currently in public preview. Consult this guide for the latest information on recommended configuration and limitations. This guide assumes you already have a GCP account with a valid subscription.
::: 

Many of the current implementations of compute environments for cloud providers rely on the use of batch services such as AWS Batch, Azure Batch, and Google Batch for the execution and management of submitted jobs, including pipelines and Studio session environments. Batch services are suitable for large-scale workloads, but they add management complexity. In practical terms, the currently used batch services result in some limitations:

- **Long launch delay**: When you launch a pipeline or Studio in a batch compute environment, there's a delay of several minutes before the pipeline or Studio session environment is in a running state. This is caused by the batch services that need to provision the associated compute service to run a single job.
- **Complex setup**: Standard batch services require complex identity management policies and configuration of multiple components including batch job definitions, task specifications, resource policies, etc.

The Google Cloud compute environment addresses these pain points with:

- **Faster startup time**: By eliminating the per-task overhead of VM provisioning, environment bootstrapping, and container image pulling that occurs with traditional batch, Nextflow pipelines reach a `Running` status and Studio sessions connect in under a minute (a 4x improvement compared to classic GCP Batch compute environments).
- **Simplified configuration**: Fewer configurable options, with opinionated defaults, provide the best Nextflow pipeline and Studio session execution environment, with both Wave and Fusion enabled.
- **Fewer GCP dependencies**: Direct use of Compute Engine eliminates the reliance on Google Batch APIs and reduces the required IAM permissions to core services (Compute Engine, Cloud Storage, and IAM), resulting in a simpler architecture with fewer potential points of failure.

This type of compute environment is best suited to run Studios and small to medium-sized pipelines. It offers more predictable compute pricing, given the fixed instance types. It spins up a standalone Google Compute Engine instance and executes a Nextflow pipeline or Studio session with a local executor on the Google Compute Engine machine. At the end of the execution, the instance is terminated.

## Limitations

The Nextflow pipeline will run entirely on a single Google Compute Engine instance. If the instance does not have sufficient resources, the pipeline execution will fail. For this reason, the number of tasks Nextflow can execute in parallel is limited by the number of cores of the instance type selected. If you need more computing resources, you must create a new compute environment with a larger instance type. This makes the compute environment less suited for larger, more complex pipelines.

## Supported regions

The following regions are currently supported: 

- `eu-west-1`
- `us-east-1`
- `us-west-2`
- `eu-west-2`
- `us-east-2`
- `eu-central-1`
- `us-west-1`
- `eu-west-3`
- `ap-southeast-1`

## Requirements

### Platform credentials

To create and launch pipelines or Studio sessions with this compute environment type, you must attach Seqera credentials for the cloud provider. Some permissions are mandatory for the compute environment to be created and function correctly; others are used to pre-fill Platform options, which are optional .

### Required permissions

#### Service account permissions​

[Create a custom service account](https://cloud.google.com/iam/docs/service-accounts-create#creating) with at least the following permissions:

- Compute instance admin (`roles/compute.instanceAdmin.v1`)
- Project IAM admin (`roles/resourcemanager.projectIamAdmin`)
- Service Account Admin (`roles/iam.serviceAccountAdmin`)
- Service Account User (`roles/iam.serviceAccountUser`)
- Service Usage Consumer (`roles/serviceusage.serviceUsageConsumer`)

If your Google Cloud project does not require access restrictions on any of its Cloud Storage buckets, you can grant project Storage Admin (`roles/storage.admin`) permissions to your service account to simplify setup. To grant access only to specific buckets, add the service account as a principal [on each bucket individually](https://docs.seqera.io/platform-cloud/compute-envs/google-cloud-batch#cloud-storage-bucket). For each Google Cloud compute environment created in the Seqera platform, a separate service account is created with the necessary permissions to launch pipelines/studios.

## Advanced options

- **Use an ARM64 architecture instance**: Select this option to enable an ARM architecture instance to be created for your compute workload. This option defaults to using a [C4A machine series](https://cloud.google.com/compute/docs/general-purpose-machines#c4a_series) VM with Google's ARM-based Axion™ processor.
- **User GPU-enabled instance**: Select this option to enable a GPU-enabled instance to be created for your compute workload. This option defaults to using an [A2 machine series](https://cloud.google.com/compute/docs/gpus) VM with an NVIDIA A100 GPU.
- **Instance type**: The Compute Engine machine type used by the compute environment. Choosing the instance type will directly allocate the CPU and memory available for computation. See the [machine resource type documentation](https://cloud.google.com/compute/docs/machine-resource) for a comprehensive list of instance types and their resource limitations.
  - :::note
    It is not possible to specify instance templates with predefined machine types, storage, bootstrapped, etc.
    :::  
- **Image**: The image defining the operating system and pre-installed software for the VM. Currently only [Ubuntu LTS](https://cloud.google.com/compute/docs/images/os-details#ubuntu_lts) Google public image project images are available and supported. For GPU-enabled instances, a Deep Learning VM base image with CUDA pre-installed is automatically selected (See [Google Deep Learning VM Images](https://cloud.google.com/deep-learning-vm/docs/images#base_versions) for more details). Optimized, Seqera-owned custom images will be available in a future release.
- **Boot disk size**: The size of the boot disk for the Compute Engine instance. A standard persistent disk (`pd-standard`) is used. If undefined, a default 50 GB volume will be used.
- **Zone**: The [zone](https://cloud.google.com/compute/docs/regions-zones) within the selected region where the VM will be provisioned (defaults to the first zone in the alphabetical list).

---
title: Get started
description: "Use the Fusion v2 file system in Seqera Platform and Nextflow"
date: "23 Aug 2024"
tags: [fusion, storage, compute, file system, posix, client]
---

Use Fusion directly in Seqera Platform compute environments, or add Fusion to your Nextflow pipeline configuration.

### Seqera Platform

Use Fusion directly in the following Seqera Platform compute environments:
- [AWS Batch](https://docs.seqera.io/platform-cloud/compute-envs/aws-batch)
- [Azure Batch](https://docs.seqera.io/platform-cloud/compute-envs/azure-batch)
- [Google Cloud Batch](https://docs.seqera.io/platform-cloud/compute-envs/google-cloud-batch)
- [Amazon Elastic Kubernetes Service](https://docs.seqera.io/platform-cloud/compute-envs/eks)
- [Google Kubernetes Engine](https://docs.seqera.io/platform-cloud/compute-envs/gke)

See the Platform compute environment page for your cloud provider for Fusion configuration instructions and optimal compute and storage recommendations. 

### Nextflow

:::note
Fusion requires Nextflow `22.10.0` or later.
:::

Fusion integrates with Nextflow directly and does not require any installation or change in pipeline code. It only requires to use of a container runtime or a container computing service such as Kubernetes, AWS Batch, or Google Cloud Batch.

#### Nextflow installation

If you already have Nextflow installed, update to the latest version using this command:

```bash
nextflow -self-update
```

Otherwise, install Nextflow with this command:

```bash
curl get.nextflow.io | bash
```

#### Fusion configuration

To enable Fusion in your Nextflow pipeline, add the following snippet to your `nextflow.config` file:

```groovy
fusion.enabled = true
wave.enabled = true
tower.accessToken = '<PLATFORM_ACCESS_TOKEN>'
```

Replace `<PLATFORM_ACCESS_TOKEN>` with your Platform access token.

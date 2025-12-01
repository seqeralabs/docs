---
title: Get started
description: "Use the Fusion v2 file system in Seqera Platform and Nextflow"
date: "2024-08-23"
tags: [fusion, storage, compute, file system, posix, client]
---

Fusion is a distributed virtual file system optimized for cloud-native data pipelines. It provides fast, efficient access to cloud object storage (S3, Azure Blob, Google Cloud Storage) by allowing your pipeline tasks to work with cloud data as if it were a local POSIX file system, eliminating the need for data staging and transfer.

Use Fusion directly in Seqera Platform compute environments, or add Fusion to your Nextflow pipeline configuration.

## Seqera Platform

Fusion is available in the following Seqera Platform compute environments:

- [AWS Batch](https://docs.seqera.io/platform-cloud/compute-envs/aws-batch)
- [Azure Batch](https://docs.seqera.io/platform-cloud/compute-envs/azure-batch)
- [Google Cloud Batch](https://docs.seqera.io/platform-cloud/compute-envs/google-cloud-batch)
- [Amazon Elastic Kubernetes Service](https://docs.seqera.io/platform-cloud/compute-envs/eks)
- [Google Kubernetes Engine](https://docs.seqera.io/platform-cloud/compute-envs/gke)

See the compute environment documentation for your specific cloud provider above for detailed configuration instructions, required permissions, and optimal compute and storage recommendations.

## Nextflow

Fusion integrates seamlessly with Nextflow and requires no installation or pipeline code changes.

This section describes how to enable Fusion in your Nextflow pipelines. It includes:

- Creating a Platform access token
- Configuring Fusion in your pipeline
- Running your Nextflow pipeline with Fusion

:::info[Prerequisites]
You will need the following to get started:

- Nextflow 22.10.0 or later installed locally
- A Seqera account
- A configured container runtime or container computing service (e.g., Kubernetes, AWS Batch, or Google Cloud Batch)

:::

### Create your Platform access token

A Platform access token is your personal authentication key that enables access to Seqera Platform services.

To create a Platform access token:

1. Log in to [Seqera](https://cloud.seqera.io/login)
2. From your personal workspace, go to the user menu and select **Settings > Your tokens**
3. Select **Add token**
4. Enter a unique name for your token, then select **Add**
5. Copy and store your token securely

:::caution
The access token is displayed only once. Save the token value before you close the **Personal Access Token** window.
:::

### Configure Fusion

To enable Fusion, add the following to your `nextflow.config` file:

```groovy
fusion.enabled = true
wave.enabled = true
tower.accessToken = '<TOWER_ACCESS_TOKEN>'
```

Replace `<TOWER_ACCESS_TOKEN>` with your Platform access token.

### Run your pipeline

Run the pipeline as you normally would. For example:

```bash
nextflow run main.nf
```

Fusion will automatically provision and mount your pipeline storage.

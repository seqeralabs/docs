---
title: Get started
description: "Use the Fusion v2 file system in Seqera Platform and Nextflow"
date: "2024-08-23"
tags: [fusion, storage, compute, file system, posix, client]
---

Fusion is a distributed virtual file system optimized for cloud-native data pipelines. It provides fast, efficient access to cloud object storage (AWS S3, Azure Blob Storage, Google Cloud Storage) by allowing your pipeline tasks to work with cloud data as if it were a local POSIX file system, eliminating the need for data staging and transfer.

Use Fusion directly in Seqera Platform compute environments, or add Fusion to your Nextflow pipeline configuration.

## Seqera Platform

Fusion is available in the following Seqera Platform compute environments:

- [AWS Batch](https://docs.seqera.io/platform-cloud/compute-envs/aws-batch)
- [Azure Batch](https://docs.seqera.io/platform-cloud/compute-envs/azure-batch)
- [Google Cloud Batch](https://docs.seqera.io/platform-cloud/compute-envs/google-cloud-batch)
- [Amazon Elastic Kubernetes Service](https://docs.seqera.io/platform-cloud/compute-envs/eks)
- [Google Kubernetes Engine](https://docs.seqera.io/platform-cloud/compute-envs/gke)

See the compute environment documentation for your specific cloud provider above for detailed configuration instructions, required permissions, and optimal compute and storage recommendations.

### Task metrics

On Seqera Cloud, Fusion records per-task performance metrics and Seqera retains a copy of them. Seqera uses these metrics to troubleshoot support tickets and to improve Fusion. Self-hosted Seqera Platform installations ship with metrics retention turned off.

Retention is on by default for **new Fusion-enabled compute environments only**. Existing compute environments are unaffected: they keep whatever setting they already have, and Seqera does not start retaining metrics for them.

You can opt out at any time by turning off **Send Fusion metrics to Seqera** on the compute environment, either when you create it or by editing an existing one. Fusion then continues to write metrics to your own work directory for your own troubleshooting, but Seqera retains nothing.

The retained copy contains only numeric measurements and a fixed set of labels, such as operation names, cloud providers, and HTTP status codes. It contains no personally identifiable information: no file names, object keys, bucket names, paths, hostnames, or user identifiers. Fields that identify your environment are removed before the copy is written to Seqera-owned storage.

See [Fusion task metrics](./troubleshooting/fusion-task-metrics) for the metric catalog, diagnostic queries, and how to disable collection entirely.

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

Run your pipeline as you normally would. For example:

```bash
nextflow run main.nf
```

Fusion will automatically provision and mount your pipeline storage.

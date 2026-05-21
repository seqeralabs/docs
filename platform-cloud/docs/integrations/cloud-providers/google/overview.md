---
title: "Google Cloud integration"
description: "Connect Seqera Platform to Google Cloud — IAM, service accounts, credentials, and storage."
tags: [gcp, google, integration]
---

Seqera Platform integrates with Google Cloud to run pipelines on Google Cloud Batch and Google Cloud (preview), and to read input/output data from Cloud Storage. This page is the entry point for the Google Cloud-side setup.

## Setup checklist

| Step | What to do | Page |
|---|---|---|
| 1 | Create a project, enable billing, and enable required APIs | [IAM](./iam) |
| 2 | Create a custom service account with required permissions | [IAM](./iam) |
| 3 | Create a Cloud Storage bucket for the work directory | [Storage access](./storage-access) |
| 4 | Generate a service account JSON key and add credentials in Seqera | [Credentials](./credentials) |
| 5 | Create the compute environment | [Google Cloud Batch](/platform-cloud/compute-envs/google-cloud-batch) or [Google Cloud](/platform-cloud/compute-envs/google-cloud) |

## Choose a compute environment type

| Compute environment | When to use it |
|---|---|
| **Google Cloud Batch** | Production-scale pipelines, mature Batch API workloads |
| **Google Cloud** (preview) | Studios and small/medium pipelines, simplified setup, fewer GCP dependencies |

For Google Cloud Batch, use the IAM roles in [IAM](./iam#google-cloud-batch-permissions). For Google Cloud, use the service account permissions in [IAM](./iam#google-cloud-permissions).

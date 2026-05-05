---
title: "AWS integration"
description: "Connect Seqera Platform to AWS — IAM, credentials, data access, and EKS additions."
tags: [aws, integration]
---

Seqera Platform integrates with AWS to run pipelines on AWS Batch, AWS Cloud, and Amazon EKS, and to read input/output data from S3, EFS, and FSx. This page is the entry point for the AWS-side setup.

## Setup checklist

| Step | What to do | Page |
|---|---|---|
| 1 | Create an IAM policy with the permissions Seqera needs | [IAM policies](./iam-policies) |
| 2 | Create the IAM user (and optionally an IAM role) | [Credentials](./credentials) |
| 3 | Create an S3 bucket — and optionally EFS or FSx — for the work directory | [Data access](./data-access) |
| 4 | (EKS only) Set up the Service Account IAM role and `aws-auth` | [EKS additions](./eks-additions) |
| 5 | (Manual Batch only) Create AWS Batch resources by hand | [AWS Batch manual setup](./manual-setup) |
| 6 | Add the credentials to Seqera and create the compute environment | [AWS Batch](/platform-cloud/compute-envs/aws-batch), [AWS Cloud](/platform-cloud/compute-envs/aws-cloud), [Amazon EKS](/platform-cloud/compute-envs/eks) |

## Choose a credential model

Seqera supports two AWS credential modes:

- **Key-based credentials** — Access key + secret key with direct IAM permissions. Optionally pair with **Assume role** to scope down via role assumption.
- **Role-based credentials (recommended)** — Role assumption only, no static keys. Seqera generates an External ID automatically.

For Seqera Cloud, role-based credentials let you allow only the Seqera Cloud access role `arn:aws:iam::161471496260:role/SeqeraPlatformCloudAccessRole` in your trust policy. See [Role-based trust policy example](./credentials#role-based-trust-policy-example-seqera-cloud).

## Choose a compute environment type

| Compute environment | When to use it | IAM scope |
|---|---|---|
| **AWS Batch** | Production-scale pipelines, mature workloads | Largest IAM surface (Batch + EC2 + IAM + optional services) |
| **AWS Cloud** (preview) | Studios and small/medium pipelines, simplified setup | Smallest IAM surface (single role) |
| **Amazon EKS** | Pipelines on existing Kubernetes clusters | EKS describe + Kubernetes RBAC |

The IAM policy you create depends on which compute environment(s) you plan to use. See the tabbed policy in [IAM policies](./iam-policies).

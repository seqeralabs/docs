---
title: "AWS Cloud"
description: "Instructions to set up an AWS Cloud CE in Seqera Platform"
date created: "2025-05-15"
last updated: "2026-01-30"
tags: [cloud, vm, amazon, compute environment]
---

# AWS Cloud

:::note
This compute environment type is currently in public preview. Please consult this guide for the latest information on recommended configuration and limitations. This guide assumes you already have an AWS account with a valid AWS subscription.
:::

Many of the current implementations of compute environments for cloud providers rely on the use of batch services such as AWS Batch, Azure Batch, and Google Batch for the execution and management of submitted jobs, including pipelines and Studio session environments. Batch services are suitable for large-scale workloads, but they add management complexity. In practical terms, the currently used batch services result in some limitations:

- **Long launch delay**: When you launch a pipeline or Studio in a batch compute environment, there's a delay of several minutes before the pipeline or Studio session environment is in a running state. This is caused by the batch services that need to provision the associated compute service to run a single job.
- **Complex setup**: Standard batch services require complex identity management policies and configuration of multiple services including compute environments, job queues, job definitions, etc.
- **Allocation constraints**: AWS Batch and other cloud batch services have strict resource quotas. For example, a hard limit of 50 job queues per AWS account per region. This means that no new compute environment can be created when this quota limit is reached.

The AWS Cloud compute environment addresses these pain points with:

- **Faster startup time**: Nextflow pipelines reach a `Running` status and Studio sessions connect in under a minute (a 4x improvement compared to classic AWS Batch compute environments).
- **Simplified configuration**: Fewer configurable options, with opinionated defaults, provide the best Nextflow pipeline and Studio session execution environment, with both Wave and Fusion enabled.
- **Fewer AWS dependencies**: Only one IAM role in AWS is required. IAM roles are subject to a 1000 soft limit per AWS account.
- **Spot instances**: Studios can be launched on a Spot instance.

This type of compute environment is best suited to run Studios and small to medium-sized pipelines. It offers more predictable compute pricing, given the fixed instance types. It spins up a standalone EC2 instance and executes a Nextflow pipeline or Studio session with a local executor on the EC2 machine. At the end of the execution, the instance is terminated.

## Limitations

- The Nextflow pipeline will run entirely on a single EC2 instance. If the instance does not have sufficient resources, the pipeline execution will fail. For this reason, the number of tasks Nextflow can execute in parallel is limited by the number of cores of the instance type selected. If you need more computing resources, you must create a new compute environment with a larger instance type. This makes the compute environment less suited for larger, more complex pipelines.

## Supported regions

The following regions are currently supported:

- `af-south-1`
- `ap-east-1`
- `ap-northeast-1`
- `ap-northeast-2`
- `ap-northeast-3`
- `ap-south-1`
- `ap-southeast-1`
- `ap-southeast-2`
- `ap-southeast-3`
- `ca-central-1`
- `eu-central-1`
- `eu-north-1`
- `eu-south-1`
- `eu-west-1`
- `eu-west-2`
- `eu-west-3`
- `me-south-1`
- `sa-east-1`
- `us-east-1`
- `us-east-2`
- `us-west-1`
- `us-west-2`

## Before you start

Set up the [AWS integration](/platform-cloud/integrations/cloud-providers/aws/overview) before creating an AWS Cloud compute environment in Seqera:

- [AWS IAM policies](/platform-cloud/integrations/cloud-providers/aws/iam-policies) — required permissions (select the **AWS Cloud** tab).
- [AWS credentials](/platform-cloud/integrations/cloud-providers/aws/credentials) — IAM policy, IAM user, IAM role, and how to add credentials in Seqera.

{/* Anchor stubs preserved for backwards compatibility with deep links from older content. */}
<a id="required-platform-iam-permissions"></a>
<a id="create-the-iam-policy"></a>
<a id="iam-user-creation"></a>
<a id="iam-role-creation-optional"></a>
<a id="obtain-iam-user-credentials"></a>
<a id="aws-credential-options"></a>

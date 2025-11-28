---
title: AWS Batch
description: "Fusion Snapshots configuration and best practices for AWS Batch"
date: "2024-11-21"
tags: [fusion, storage, compute, snapshot, aws, batch]
---

Fusion Snapshots enable checkpoint/restore functionality for Nextflow processes running on AWS Batch Spot instances. When a Spot instance interruption occurs, AWS provides a guaranteed 120-second warning window to checkpoint and save the task state before the instance terminates.

## Compute environment requirements

Fusion Snapshots require the following Seqera Platform compute environment configuration:

- **Provider**: AWS Batch
- **Work directory**: S3 bucket in the same region as compute resources
- **Fusion Snapshots (beta)**: Enabled
- **Config mode**: Batch Forge
- **Provisioning model**: Spot
- **Instance types**: See [recommendations below](#ec2-instance-selection)

:::tip
Fusion Snapshots work with sensible defaults (e.g., 5 automatic retry attempts). For configuration options, see [Advanced configuration](./configuration.md).
:::

### Seqera Enterprise specific requirements

Fusion Snapshots require instances running Amazon Linux 2023 (which ships with Linux Kernel 6.1) and an ECS container-optimized AMI for optimal performance.

To find the recommended AL2023 ECS-optimized AMI for your region, run:

```bash
export REGION=<AWS_REGION>
aws ssm get-parameter --name "/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended" --region $REGION
```

Replace `<AWS_REGION>` with your AWS region (for example, `eu-central-1`).

The output for the `eu-central-1` region is similar to the following:

```json
{
    "Parameter": {
        "Name": "/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended",
        "Type": "String",
        "Value": "{\"ecs_agent_version\":\"1.88.0\",\"ecs_runtime_version\":\"Docker version 25.0.6\",\"image_id\":\"ami-0281c9a5cd9de63bd\",\"image_name\":\"al2023-ami-ecs-hvm-2023.0.20241115-kernel-6.1-x86_64\",\"image_version\":\"2023.0.20241115\",\"os\":\"Amazon Linux 2023\",\"schema_version\":1,\"source_image_name\":\"al2023-ami-minimal-2023.6.20241111.0-kernel-6.1-x86_64\"}",
        "Version": 61,
        "LastModifiedDate": "2024-11-18T17:08:46.926000+01:00",
        "ARN": "arn:aws:ssm:eu-central-1::parameter/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended",
        "DataType": "text"
}
```

Note the `image_id` in your output (in the above example, `ami-0281c9a5cd9de63bd`). Specify this ID in the **Advanced options > AMI ID** field when you create your Seqera compute environment.

:::note
You only need to select a custom Amazon Linux 2023 ECS-optimized AMI for compute environments in Seqera Enterprise deployments. Seqera Cloud AWS Batch compute environments use Amazon Linux 2023 AMIs by default.
:::

## Selecting an EC2 instance

AWS provides a guaranteed 120-second reclamation window. Select instance types that can transfer checkpoint data within this timeframe. Checkpoint time is primarily determined by memory usage. Other factors like the number of open file descriptors also affect performance.

When you select an EC2 instance:

- Select instances with guaranteed network bandwidth, not "up to" values
- Maintain a 5:1 ratio between memory (GiB) and network bandwidth (Gbps)
- Prefer NVMe storage instances (those with a `d` suffix: `c6id`, `r6id`, `m6id`)
- Use x86_64 instances for [incremental snapshots](./index.md#incremental-snapshots)

For example, a c6id.8xlarge instance provides 64 GiB memory and 12.5 Gbps guaranteed network bandwidth. This configuration can transfer the entire memory contents to S3 in approximately 70 seconds. Instances with memory:bandwidth ratios over 5:1 may not complete transfers before termination and risk task failures.

| Instance type  | Cores | Memory (GiB) | Network bandwidth (Gbps) | Memory:bandwidth ratio | Estimated snapshot time |
|----------------|-------|--------------|--------------------------|------------------------|-------------------------|
| c6id.4xlarge   | 16    | 32           | 12.5                     | 2.56:1                 | ~45 seconds             |
| c6id.8xlarge   | 32    | 64           | 12.5                     | 5.12:1                 | ~70 seconds             |
| r6id.2xlarge   | 8     | 16           | 12.5                     | 1.28:1                 | ~20 seconds             |
| m6id.4xlarge   | 16    | 64           | 12.5                     | 5.12:1                 | ~70 seconds             |
| c6id.12xlarge  | 48    | 96           | 18.75                    | 5.12:1                 | ~70 seconds             |
| r6id.4xlarge   | 16    | 128          | 12.5                     | 10.24:1                | ~105 seconds            |
| m6id.8xlarge   | 32    | 128          | 25                       | 5.12:1                 | ~70 seconds             |

:::info
[Incremental snapshots](./index.md#incremental-snapshots) are enabled by default on x86_64 instances.
:::

## Resource limits

A single job can request more resources than are available on a single instance. To prevent this, set resource limits using the `process.resourceLimits` directive in your Nextflow configuration. See [Resource limits](./configuration.md#resource-limits) for more information.

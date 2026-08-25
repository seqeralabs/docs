---
title: AWS Batch
description: "Fusion Snapshots requirements, instance selection, and storage on AWS Batch"
date created: "2024-11-21"
last updated: "2026-08-25"
tags: [fusion, fusion snapshots, storage, compute, snapshot, aws, batch]
---

Fusion Snapshots enable checkpoint/restore functionality for Nextflow processes running on AWS Batch Spot instances. When a Spot instance interruption occurs, AWS provides a guaranteed 120-second warning window to checkpoint and save the task state before the instance terminates.

## Seqera Platform compute environment requirements

Fusion Snapshots require the following Seqera Platform compute environment configuration:

- **Provider:** AWS Batch
- **Work directory:** S3 bucket in the same region as compute resources
- **Fusion Snapshots (beta):** Enabled
- **Config mode:** Batch Forge
- **Provisioning model:** Spot. Do not enable Fusion Snapshots on an on-demand compute environment.
- **AMI:** See [Selecting an AMI](#selecting-an-ami) for details
- **Instance types:** Restrict **Instance types** under **Advanced options** to the recommended sizes. Enabling Fusion Snapshots does not populate this field. See [Selecting an EC2 instance](#selecting-an-ec2-instance).

:::tip
Fusion Snapshots work with sensible defaults (e.g., 5 automatic retry attempts). For configuration options, see [Advanced configuration](./configuration.md).
:::

### Selecting an AMI

Fusion Snapshots require instances running Amazon Linux 2023 (which ships with Linux Kernel 6.1) and an ECS container-optimized AMI for optimal performance.

#### Seqera Cloud

Seqera Cloud AWS Batch compute environments use an ECS container-optimized AMI by default. No additional AMI configuration is required.

#### Seqera Enterprise

Specify an Amazon Linux 2023 ECS-optimized AMI for your region when creating your compute environment.

To find the recommended AMI:

1. Retrieve the application configuration:

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

1. Identify the `image_id` in your output (e.g, `ami-0281c9a5cd9de63bd` in the above example) and set in the **Advanced options > AMI ID** field when you create your Seqera compute environment.

## Selecting an EC2 instance

AWS provides a guaranteed 120-second reclamation window. Checkpoint time is primarily determined by memory usage. Other factors like the number of open file descriptors also affect performance.

Restrict the Seqera Platform AWS Batch compute environment to the recommended instance sizes before you enable Fusion Snapshots. Enabling **Fusion Snapshots (beta)** does not populate **Instance types**.

The **Instance types** field accepts families or specific sizes. Paste the sizes below, not family names such as `c6id`, `m6id`, or `r6id`. A family allows every size in that family, including types that miss the 120-second window. Do not use `default_x86_64`.

1. Copy this comma-separated list:

    ```text
    c6id.4xlarge,c6id.8xlarge,c6id.12xlarge,m6id.4xlarge,m6id.8xlarge,r6id.2xlarge
    ```

1. In **Advanced options**, paste it into **Instance types**. See [AWS Batch (Cloud)](https://docs.seqera.io/platform-cloud/compute-envs/aws-batch#advanced-options) or [AWS Batch (Enterprise)](https://docs.seqera.io/platform-enterprise/compute-envs/aws-batch#advanced-options).
1. Enable **Fusion Snapshots (beta)** and set **Provisioning model** to **Spot**.

:::caution
If you enable Fusion Snapshots without restricting instance types, AWS Batch can schedule tasks onto non-recommended types. Those instances can have burst-only ("up to") network, no NVMe `d` suffix, ARM64 architecture, or a memory:bandwidth ratio worse than 5:1. The 120-second Spot window is then missed.

Fusion Snapshots require Spot instances. Do not enable Fusion Snapshots on an on-demand compute environment. Fusion takes snapshots only on Spot instances, even when the option is enabled.
:::

The table lists the same recommended sizes and the bandwidth and 5:1 guidance for each.

When you select instance types:

- Select instances with guaranteed network bandwidth, not "up to" values.
- Maintain a 5:1 or better ratio between memory (GiB) and network bandwidth (Gbps). Lower ratios complete faster.
- Prefer NVMe storage instances (those with a `d` suffix: `c6id`, `r6id`, `m6id`).
- Use `x86_64` instances for [incremental snapshots](./index.md#incremental-snapshots). Do not enable **Use Graviton CPU architecture**.

For example, a `c6id.8xlarge` instance provides 64 GiB memory and 12.5 Gbps guaranteed network bandwidth. This configuration can transfer the entire memory contents to S3 in approximately 70 seconds. Instances with memory:bandwidth ratios over 5:1 may not complete a full-memory transfer before termination.

| Instance type   | Cores | Memory (GiB) | Network bandwidth (Gbps) | Memory:bandwidth ratio | Estimated snapshot time |
|-----------------|-------|--------------|--------------------------|------------------------|-------------------------|
| `c6id.4xlarge`  | 16    | 32           | 12.5                     | 2.56:1                 | ~45 seconds             |
| `c6id.8xlarge`  | 32    | 64           | 12.5                     | 5.12:1                 | ~70 seconds             |
| `r6id.2xlarge`  | 8     | 64           | 12.5                     | 5.12:1                 | ~70 seconds             |
| `m6id.4xlarge`  | 16    | 64           | 12.5                     | 5.12:1                 | ~70 seconds             |
| `c6id.12xlarge` | 48    | 96           | 18.75                    | 5.12:1                 | ~70 seconds             |
| `m6id.8xlarge`  | 32    | 128          | 12.5                     | 10.24:1                | ~105 seconds            |

`m6id.8xlarge` exceeds the 5:1 ratio if a task uses most of the 128 GiB. Prefer a type at or below 5:1, or set [`process.resourceLimits`](./configuration.md#resource-limits) so requested memory fits the 120-second window.

:::info
[Incremental snapshots](./index.md#incremental-snapshots) are enabled by default on `x86_64` instances.
:::

## Resource limits

A single job can request more resources than are available on a single instance. To prevent this, set resource limits using the `process.resourceLimits` directive in your Nextflow configuration. See [Resource limits](./configuration.md#resource-limits) for more information.

## Storage and cleanup

Fusion writes snapshot data to a `.fusion/dump/` directory inside each task work directory in your S3 work bucket. AWS bills it as standard S3 storage. Fusion Snapshots do not use S3 object versioning.

When a task process exits, Fusion removes the memory image files from that task's checkpoints, including checkpoints written by earlier attempts of the same task. Small metadata and log files remain. Snapshot data has no expiry. Anything left behind by a run that was killed before its tasks could exit stays in the bucket until you delete it.

Check the work directories of runs that ended abnormally for leftover `.fusion/dump/` directories, and remove them if you no longer need the diagnostic data. See [Snapshot storage and lifecycle](./index.md#snapshot-storage-and-lifecycle) for details.

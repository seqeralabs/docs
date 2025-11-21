---
title: Fusion Snapshots for AWS Batch
description: "Fusion Snapshots configuration and best practices for AWS Batch"
date: "21 Nov 2024"
tags: [fusion, storage, compute, snapshot, aws, batch]
---

Fusion Snapshots enable checkpoint/restore functionality for Nextflow processes running on AWS Batch Spot instances. When a Spot instance interruption occurs, AWS provides a **guaranteed 120-second warning window** to checkpoint and save the task state before the instance terminates.

## Requirements

### Seqera Platform compute environment

- **Provider**: AWS Batch
- **Work directory**: S3 bucket in the same region as compute resources
- **Enable Fusion Snapshots (beta)**
- **Config mode**: Batch Forge
- **Provisioning model**: Spot
- **Instance types**: See recommendations below

:::tip Configuration
Fusion Snapshots work with sensible defaults (5 automatic retry attempts). For advanced configuration options like changing retry behavior or TCP handling, see the [Configuration Guide](configuration.md).
:::

### (Seqera Enterprise only) Select an Amazon Linux 2023 ECS-optimized AMI

To obtain sufficient performance, Fusion Snapshots require instances with Amazon Linux 2023 (which ships with Linux Kernel 6.1), with an ECS Container-optimized AMI.

:::note
Selecting a custom Amazon Linux 2023 ECS-optimized AMI is only required for compute environments in Seqera Enterprise deployments. Seqera Cloud AWS Batch compute environments use Amazon Linux 2023 AMIs by default.
:::

To find the recommended AL2023 ECS-optimized AMI for your region, run the following (replace eu-central-1 with your AWS region):


```bash
export REGION=eu-central-1
aws ssm get-parameter --name "/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended" --region $REGION
```

The result for the `eu-central-1` region is similar to the following:

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

Note the `image_id` in your result (in this example, `ami-0281c9a5cd9de63bd`). Specify this ID in the **AMI ID** field under **Advanced options** when you create your Seqera compute environment.

## Incremental snapshots

Incremental snapshots are enabled by default on amd64 instances, capturing only changed memory pages between checkpoints for faster operations and reduced data transfer.

## EC2 instance selection

AWS provides a **guaranteed 120-second reclamation window**. Choose instances that can transfer checkpoint data within this time frame. Checkpoint time is primarily determined by memory usage, though other factors like number of open file descriptors also contribute.

### Key guidelines

- Select instances with **guaranteed** network bandwidth (not "up to" values)
- Maintain a **5:1 ratio** between memory (GiB) and network bandwidth (Gbps)
- Prefer **NVMe storage** instances (`d` suffix: `c6id`, `r6id`, `m6id`)
- Use **x86_64** instances for incremental snapshot support

### Recommended instance types

- Choose EC2 Spot instances with sufficient memory and network bandwidth to dump the cache of task intermediate files to S3 storage before AWS terminates an instance.
- Select instances with guaranteed network bandwidth (not instances with bandwidth "up to" a maximum value).
- Maintain a 5:1 ratio between memory (GiB) and network bandwidth (Gbps).
- Recommended instance families: `c6id`, `r6id`, or `m6id` series instances work optimally with Fusion fast instance storage.

:::info With incremental snapshots
A c6id.8xlarge instance provides 64 GiB memory and 12.5 Gbps guaranteed network bandwidth. This configuration can transfer the entire memory contents to S3 in approximately 70 seconds, well within the 2-minute reclamation window.

Instances with memory:bandwitdth ratios over 5:1 may not complete transfers before termination, potentially resulting in task failures.
:::


| Instance type  | Cores | Memory (GiB) | Network bandwidth (Gbps) | Memory:bandwidth ratio | Est. snapshot time|
|----------------|-------|--------------|--------------------------|------------------------|-------------------|
| c6id.4xlarge   | 16    | 32           | 12.5                     | 2.56:1                 | ~45 seconds       |
| c6id.8xlarge   | 32    | 64           | 12.5                     | 5.12:1                 | ~70 seconds       |
| r6id.2xlarge   | 8     | 16           | 12.5                     | 1.28:1                 | ~20 seconds       |
| m6id.4xlarge   | 16    | 64           | 12.5                     | 5.12:1                 | ~70 seconds       |
| c6id.12xlarge  | 48    | 96           | 18.75                    | 5.12:1                 | ~70 seconds       |
| r6id.4xlarge   | 16    | 128          | 12.5                     | 10.24:1                | ~105 seconds      |
| m6id.8xlarge   | 32    | 128          | 25                       | 5.12:1                 | ~70 seconds       |


### Resource limits

It's possible for a single job to request more resources than are available on a single instance. In this case, the job will wait indefinitely and never progress to running. To prevent this from occurring, you should set the maximum resources requested to below the size of a single instance listed above. This can be configured using the `process.resourceLimits` directive in your Nextflow configuration. For example, to limit a single process to fit within a `c6id.8xlarge` machine, you could set the following:


```groovy
process.resourceLimits = [cpus: 32, memory: '60.GB']
```

## Best practices

- **Instance selection**: Prefer instances with 5:1 or lower memory:bandwidth ratio
- **Architecture**: Use x86_64 instances to enable incremental snapshots

## Troubleshooting

- **Exit code 175**: Dump failed, likely due to timeout. Reduce memory usage or increase bandwidth.
- **Exit code 176**: Restore failed. Check logs and verify checkpoint data integrity.
- **Long checkpoint times**: Review instance bandwidth, consider x86_64 for incremental snapshots.
- **State stuck in DUMPING**: Previous checkpoint exceeded reclamation window.

For detailed troubleshooting, see [Troubleshooting Guide](troubleshooting.md).

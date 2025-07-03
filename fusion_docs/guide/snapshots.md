---
title: Fusion Snapshots for AWS Batch
description: "Overview of the Fusion Snapshots feature for AWS Batch"
date: "23 Aug 2024"
tags: [fusion, storage, compute, file system, snapshot]
---

Fusion Snapshots enable you to create a checkpoint of a running Nextflow process and restore it on a different machine. Leveraging the Fusion file system, you can move the task between different instances connected to the same S3 bucket.

More specifically, the first use case for this feature is for Seqera Platform users to leverage AWS Spot instances without restarting an entire task from scratch if an instance is terminated. When a Spot instance interruption occurs, the task is restored from the last checkpoint on a new AWS instance, saving time and computational resources.

### Seqera Platform compute environment requirements

Fusion Snapshots v1 requires the following [Seqera compute environment](https://docs.seqera.io/platform-cloud/compute-envs/aws-batch) configuration:

- **Provider**: AWS Batch
- **Pipeline work directory**: An S3 bucket located in the same region as your AWS Batch compute resources
- **Enable Fusion Snapshots (beta)**
- **Config mode**: Batch Forge
- **Provisioning model**: Spot 
- **Instance types**: See recommended instance sizes below

When Fusion Snapshots are enabled, the Nextflow Spot reclamation retry setting automatically defaults to `aws.batch.maxSpotAttempts = 5`. 

### EC2 instance selection guidelines

- Choose EC2 Spot instances with sufficient memory and network bandwidth to dump the cache of task intermediate files to S3 storage before AWS terminates an instance.
- Select instances with guaranteed network bandwidth (not instances with bandwidth "up to" a maximum value).
- Maintain a 5:1 ratio between memory (GiB) and network bandwidth (Gbps).
- Recommended instance families: `c6id`, `r6id`, or `m6id` series instances work optimally with Fusion fast instance storage.

:::info Example
A c6id.8xlarge instance provides 64 GiB memory and 12.5 Gbps guaranteed network bandwidth. This configuration can transfer the entire memory contents to S3 in approximately 70 seconds, well within the 2-minute reclamation window.

Instances with memory:bandwitdth ratios over 5:1 may not complete transfers before termination, potentially resulting in task failures.
:::

#### Recommended instance types

| Instance type  | Cores | Memory (GiB) | Network bandwidth (Gbps) | Memory:bandwidth ratio | Est. Snapshot time|
|----------------|-------|--------------|--------------------------|------------------------|-------------------|
| c6id.4xlarge   | 16    | 32           | 12.5                     | 2.56:1                 | ~45 seconds       |
| c6id.8xlarge   | 32    | 64           | 12.5                     | 5.12:1                 | ~70 seconds       |
| r6id.2xlarge   | 8     | 16           | 12.5                     | 1.28:1                 | ~20 seconds       |
| m6id.4xlarge   | 16    | 64           | 12.5                     | 5.12:1                 | ~70 seconds       |
| c6id.12xlarge  | 48    | 96           | 18.75                    | 5.12:1                 | ~70 seconds       |
| r6id.4xlarge   | 16    | 128          | 12.5                     | 10.24:1                | ~105 seconds      |
| m6id.8xlarge   | 32    | 128          | 25                       | 5.12:1                 | ~70 seconds       |

It's possible for a single job to request more resources than are available on a single instance. In this case, the job will wait indefinitely and never progress to running. To prevent this from occurring, you should set the maximum resources requested to below the size of a single instance listed above. This can be configured using the `process.resourceLimits` directive in your Nextflow configuration. For example, to limit a single process to fit within a c6id.8xlarge machine, you could set the following:

```groovy
process.resourceLimits = [cpus: 32, memory: '60.GB']
```

Note that if a process requests the maximum CPUs and memory in the table above, it will not be satisfiable by a single instance and therefore fail to be assigned to a machine.

### (Seqera Enterprise only) Select an Amazon Linux 2023 ECS-optimized AMI 

To obtain sufficient performance, Fusion Snapshots require instances with Amazon Linux 2023 (which ships with Linux Kernel 6.1), with an ECS Container-optimized AMI. 

:::note
Selecting a custom Amazon Linux 2023 ECS-optimized AMI is only required for compute environments in Seqera Enterprise deployments. Seqera Cloud AWS Batch compute environments use Amazon Linux 2023 AMIs by default. 
:::

To find the recommended AL2023 ECS-optimized AMI for your region, run the following (replace `eu-central-1` with your AWS region):

```bash 
export REGION=eu-central-1
aws ssm get-parameter --name "/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended" --region $REGION
```

The result for the `eu-central-1` region is similar to the following:

```bash 
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

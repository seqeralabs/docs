---
title: Fusion Snapshots for AWS Batch
description: "Overview of the Fusion Snapshots feature for AWS Batch"
date: "23 Aug 2024"
tags: [fusion, storage, compute, file system, snapshot]
---

:::info
Fusion Snapshots is in private preview. [Contact Seqera](https://support.seqera.io) to request access to this feature. 
:::

Fusion Snapshots enable you to create a checkpoint of a running Nextflow process and restore it on a different machine. Leveraging the Fusion file system, you can move the task between different instances connected to the same S3 bucket.

More specifically, the first use case for this feature is for Seqera Platform users to leverage AWS Spot instances without restarting an entire task from scratch if an instance is terminated. When a Spot instance interruption occurs, the task is restored from the last checkpoint on a new AWS instance, saving time and computational resources.

### Seqera Platform compute environment requirements

Fusion Snapshots v1.0.0 requires the following [Seqera compute environment](https://docs.seqera.io/platform/latest/compute-envs/aws-batch) configuration:

- **Provider**: AWS Batch
- **Pipeline work directory**: An S3 bucket in the same region as the compute environment
- **Enable Wave containers**
- **Enable Fusion v2**
- **Enable fast instance storage**
- **Config mode**: Batch Forge
- **Provisioning model**: Spot 
- **Nextflow config**: Set AWS Batch max spot attempts and the custom Fusion container URL received from Seqera [shown below](#enable-snapshots-via-nextflow-config)
- **Instance types**: See recommended instance sizes below
- **AMI ID**: Amazon Linux 2023 ECS Optimized

### Enable Snapshots via Nextflow config 

:::note
Fusion Snapshots is a private preview feature that requires setting a custom `fusion.containerConfigUrl`. [Contact Seqera](https://support.seqera.io) to request access to this feature. 
:::

To use Fusion Snapshots in a Seqera AWS Batch compute environment, set the following Nextflow config values in the **Nextflow config** field under **Staging options**: 

```java
aws.batch.maxSpotAttempts= 5
fusion.containerConfigUrl = '<CUSTOM-CONTAINER-URL>'
```

`maxSpotAttempts` must be a value higher than `0`.

### Recommended instance sizes

Fusion Snapshots require EC2 Spot instances with enough memory and network bandwidth to dump the cache of task intermediate files to S3 storage before AWS terminates an instance. When AWS issues a Spot instance reclamation notice, Fusion has two minutes to complete this transfer. 

It is recommended to select instances with guaranteed network bandwidth (as opposed to bandwidth _up to_ a maximum value) and maintain a ratio of 5:1 between memory and network bandwidth. 

For example, taking into account the bandwidth and compute necessary to create a snapshot, a  `c6i.8xlarge` instance with 64 GIB memory and a guaranteed network bandwidth of 12.5 Gbps can take approximately 70 seconds to dump the entire instance to S3 storage before instance reclamation occurs. 

### Amazon Linux 2023 ECS-optimized AMI 

To obtain sufficient performance, Fusion Snapshots require instances with Amazon Linux 2023 (which ships with Linux Kernel 6.1), with an ECS Container-optimized AMI. 

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
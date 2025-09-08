---
title: AWS Batch
description: "Use Fusion with AWS Batch and S3 storage"
date: "23 Aug 2024"
tags: [fusion, storage, compute, aws batch, s3]
---

Fusion simplifies and improves the efficiency of Nextflow pipelines in [AWS Batch](https://aws.amazon.com/batch/) in several ways:

- No need to use the AWS CLI tool for copying data to and from S3 storage.
- No need to create a custom AMI or create custom containers to include the AWS CLI tool.
- Fusion uses an efficient data transfer and caching algorithm that provides much faster throughput compared to AWS CLI and does not require a local copy of data files.
- By replacing the AWS CLI with a native API client, the transfer is much more robust at scale.

### Platform AWS Batch compute environments 

Seqera Platform supports Fusion in Batch Forge and manual AWS Batch compute environments. 

See [AWS Batch](https://docs.seqera.io/platform-cloud/compute-envs/aws-batch) for compute and storage recommendations and instructions to enable Fusion.

### Nextflow CLI

:::tip
Fusion file system implements a lazy download and upload algorithm that runs in the background to transfer files in
parallel to and from the object storage and container-local temporary directory (`/tmp`).

Several AWS EC2 instance types include one or more NVMe SSD volumes. These volumes must be formatted to be used. See [SSD instance storage](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ssd-instance-store.html) for details.

Seqera Platform automatically formats and configures NVMe instance storage with the **Fast instance storage** option when you create an AWS Batch compute environment using **Batch Forge**.
:::

1. Add the following to your `nextflow.config` file:

    ```groovy
    process.executor = 'awsbatch'
    process.queue = '<AWS_BATCH_QUEUE>'
    process.scratch = false
    process.containerOptions = '-v <PATH_TO_SSD>:/tmp' // Required for SSD volumes
    wave.enabled = true
    fusion.enabled = true
    tower.accessToken = '<PLATFORM_ACCESS_TOKEN>'
    aws.region = '<AWS_REGION>'
    ```

    Replace the following:
    - `<AWS_BATCH_QUEUE>`: the path to your AWS Batch queue.
    - `<PATH_TO_SSD>`: your SSD path.
    - `<PLATFORM_ACCESS_TOKEN>`: your Platform access token.


1. Run the pipeline with the Nextflow run command:

    ```
    nextflow run <PIPELINE_SCRIPT> -w s3://<S3_BUCKET>/work
    ```

    Replace the following:
    - `<PIPELINE_SCRIPT>`: your pipeline Git repository URI.
    - `<S3_BUCKET>`: your S3 bucket.

:::tip
**Storage recommendations for Fusion scratch space:**

**For small workloads:** You can use an EBS gp3 volume with a throughput of 325 MiB/s (or more) and a size of 100 GiB as an alternative to configuring NVMe storage on your compute node. While slower than NVMe storage, this configuration provides sufficient performance for smaller instances and workloads.

The scratch space at `/tmp` is shared by all tasks running on the instance. For large instances running many concurrent tasks, insufficient scratch space can cause backpressure and significant performance slowdowns.

**For production workloads:** Consider these options based on your requirements:
- **Use NVMe storage (recommended):** NVMe disks provide better performance and their capacity scales with instance size
- **Use larger EBS volumes:** Scale EBS volume size with instance size (400 GiB or more may be required for larger instances hosting many concurrent tasks)
- **Manual compute environments:** Scale EBS volume size proportionally with the number of CPUs via a custom launch template to ensure adequate scratch space per task
:::

### IAM permissions

Configure with the following IAM permissions:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::<S3_BUCKET>"
            ]
        },
        {
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:PutObjectTagging",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::<S3_BUCKET>/*"
            ],
            "Effect": "Allow"
        }
    ]
}
```

Replace `<S3_BUCKET>` with your S3 bucket name.

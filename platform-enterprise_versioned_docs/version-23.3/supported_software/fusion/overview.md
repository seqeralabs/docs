---
title: "Fusion v2 file system"
description: "Fusion file system"
---

Seqera Platform 22.4 adds official support for the Fusion v2 file system.

Fusion v2 is a lightweight container-based client that enables containerized tasks to access data in Amazon S3, Google Cloud, or Azure Blob Storage buckets using POSIX file access semantics. Depending on your data handling requirements, Fusion can improve pipeline throughput, which should reduce cloud computing costs. See [here](https://docs.seqera.io/fusion) for more information on Fusion's features.

Fusion relies on the Wave containers service. When Fusion v2 and Wave containers is enabled on a Seqera compute environment, the corresponding configuration values are added to your Nextflow config file when running pipelines with that compute environment:

```yaml
wave {
enabled = true
}

fusion {
enabled = true
}
```

### Fusion performance and cost considerations

Fusion v2 improves pipeline throughput for containerized tasks by simplifying direct access to cloud data storage. Dedicated networking and fast I/O influence pipeline performance and are important to consider when selecting compute instances.

### Configure Seqera Platform compute environments with Fusion

#### Batch Forge AWS Batch compute environments with fast instance storage (recommended)

We recommend using Fusion with AWS NVMe instances (fast instance storage) as this delivers the fastest performance when compared to environments using only AWS EBS (Elastic Block Store).

1. For this configuration, use Seqera Platform version 23.1 or later.
2. Create an [AWS Batch compute environment](../../compute-envs/aws-batch#batch-forge).
3. Enable Wave containers, Fusion v2, and fast instance storage.
4. Select the **Batch Forge** config mode.
5. Select your **Instance types** under Advanced options:
   - If unspecified, Seqera will select the following NVMe-based instance type families: `'c5ad', 'c5d', 'c6id', 'i3', 'i4i', 'm5ad', 'm5d', 'm6id', 'r5ad', 'r5d', 'r6id'`
   - To specify an NVMe instance family type, select from the following:
     - Intel: `'c5ad', 'c5d', 'c6id', 'dl1', 'f1', 'g4ad', 'g4dn', 'g5', 'i3', 'i3en', 'i4i', 'm5ad', 'm5d', 'm5dn', 'm6id', 'p3dn', 'p4d', 'p4de', 'r5ad', 'r5d', 'r5dn', 'r6id', 'x2idn', 'x2iedn', 'z1d'`
     - ARM: `'c6gd', 'm6gd', 'r6gd', 'x2gd', 'im4gn', 'is4gen'`

:::note
When enabling fast instance storage, do not select the `optimal` instance type families (c4, m4, r4) for your compute environment as these are not NVMe-based instances. Specify the NVMe instance types listed above.
:::

:::tip
We recommend selecting 8xlarge or above for large and long-lived production pipelines. Dedicated networking ensures a guaranteed network speed service level compared with "burstable" instances. See [Instance network bandwidth](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html) for more information.
:::

6. Use an S3 bucket as the pipeline work directory.

#### Batch Forge AWS compute environments with Fusion only

To use Fusion in AWS environments without NVMe instances, enable Wave containers and Fusion v2 when creating a new compute environment without enabling fast instance storage. This option configures an AWS EBS (Elastic Bucket Store) disk with settings optimized for the Fusion file system.

1. For this configuration, use Seqera Platform version 23.1 or later.
2. Create an [AWS Batch compute environment](../../compute-envs/aws-batch#batch-forge).
3. Enable Wave containers and Fusion v2.
4. Select the **Batch Forge** config mode.
5. When you enable Fusion v2 without fast instance storage, the following settings are applied:

   - `process.scratch = false` is added to the Nextflow configuration file
   - EBS autoscaling is disabled
   - EBS boot disk size is increased to 100GB
   - EBS boot disk type is changed to GP3
   - EBS boot disk throughput is increased to 325MB/s

6. Use an S3 bucket as the pipeline work directory.

#### Fusion in manual compute environments

Seqera supports Fusion v2 for both Batch Forge and manual compute environments on AWS Batch, Google Cloud Batch, and Azure Batch compute environments. Detailed instructions for configuration in manual AWS, Azure, and Google Cloud compute environments will be available soon. In the meantime, we recommend using Fusion v2 in Batch Forge compute environments with the default settings described above.

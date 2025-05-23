---
title: "Fusion v2 file system"
description: "Fusion file system"
---

Fusion v2 is a lightweight container-based client that enables containerized tasks to access data in Amazon S3, Google Cloud, or Azure Blob Storage buckets using POSIX file access semantics. Depending on your data handling requirements, Fusion can improve pipeline throughput and reduce cloud computing costs. 

See [here](https://docs.seqera.io/fusion) for more information on Fusion's features.

### Fusion mechanics

The Fusion file system implements a lazy download and upload algorithm that runs in the background to transfer files in parallel to and from object storage into a container-local temporary folder. This means that the performance of the disk volume used to carry out your computation is key to achieving maximum performance.

By default, Fusion uses the container `/tmp` directory as a temporary cache, so the size of the volume can be much lower than the actual needs of your pipeline processes. Fusion has a built-in garbage collector that constantly monitors remaining disk space and deletes old cached entries when necessary. 

### Fusion performance and cost considerations

Fusion v2 improves pipeline throughput for containerized tasks by simplifying direct access to cloud data storage. Compute instance performance, local storage, and networking influence pipeline execution — the following guidelines are important when creating a compute environment that uses Fusion: 

- Fusion requires compute instances with attached local storage: 
    - We recommend at least 200 GB storage with a random read speed of 1000 MBps or more. Machines with local disks that do not meet this requirement may encounter issues where local storage cannot keep up with streaming data.
- Based on internal benchmarking, we recommend instances with 16 vCPUs and 128 GB memory or more for large, long-lived production pipelines. Seqera benchmarking runs of [nf-core/rnaseq](https://github.com/nf-core/rnaseq) used profile `test_full`, consisting of an input dataset with 16 FASTQ files and a total size of approximately 123.5 GB. 
- Dedicated networking and fast I/O influence pipeline performance and are important to consider when selecting compute instances.

### Configure Seqera Platform compute environments with Fusion

See the compute environment page for your cloud provider for Fusion configuration instructions:

- [AWS Batch](../../compute-envs/aws-batch.md)
- [Amazon EKS](../../compute-envs/eks.md)
- [Azure Batch](../../compute-envs/azure-batch.md)
- [Google Cloud Batch](../../compute-envs/google-cloud-batch.md)
- [Google Kubernetes Engine](../../compute-envs/gke.md)

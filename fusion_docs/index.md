---
title: Fusion file system
description: "Overview of the Fusion v2 file system"
date: "23 Aug 2024"
tags: [fusion, storage, compute, file system, posix, client]
---

Cloud object stores such as AWS S3 are scalable and cost-effective, but they don't present a [POSIX](https://en.wikipedia.org/wiki/POSIX) (Portable Operating System Interface). This means containerized applications must copy data to and from cloud storage for every task — a slow and inefficient process.

Fusion is a virtual, lightweight, distributed file system that bridges the gap between pipelines and cloud-native
storage. Fusion enables seamless filesystem I/O to cloud object stores via a standard POSIX interface, resulting in
simpler pipeline logic and faster, more efficient pipeline execution.

:::note
Fusion requires a license for use in Seqera Platform compute environments or directly in Nextflow. See [Fusion licensing](https://seqera.io/contact-us) for more information.
:::

### Transparent, automated installation

Traditionally, pipeline developers needed to bundle utilities in containers to copy data in and out of cloud object storage.

With Fusion, there is nothing to install or manage. The Fusion thin client is automatically installed using [Wave](https://docs.seqera.io/wave)'s container augmentation facilities, enabling containerized applications to read from and write to cloud storage buckets as if they were local storage.

### No shared file system required

To share data among pipeline tasks, organizations often turn to shared file systems such as Amazon EFS, Amazon FSx for Lustre, or NFS.

Fusion removes the need to deploy, manage, and mount shared file systems on every cloud instance by providing the same functionality directly over cloud object storage – significantly reducing cost and complexity.

### Maximize pipeline performance and efficiency

Copying data to and from cloud storage adds latency for every task, increasing the time containers and cloud instances are deployed. This translates into longer runtimes and significantly higher costs for pipelines with thousands of tasks.

Fusion eliminates these bottlenecks and delays, reducing execution time and cloud spending and using compute instances more efficiently.

### Dramatically reduce data movement

When pipelines run with cloud storage, tasks typically read data from a bucket, copy it to compute instance storage for processing, and copy the results back to the cloud storage bucket.

The result is significant overhead for every task. Fusion enables direct file access to cloud object storage, eliminating unnecessary I/O and dramatically reducing data movement and overall runtime.

### Seamless access to cloud object storage

While some open-source projects provide a POSIX interface over cloud storage, they require developers to install and configure additional software and add packages to containers or VMs.

Unlike third-party solutions, Fusion is optimized for Nextflow and handles these tasks automatically. Fusion delivers fast, seamless access to cloud object storage.

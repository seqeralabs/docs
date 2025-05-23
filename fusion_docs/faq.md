---
title: Frequently asked questions
---

### Which cloud object stores does Fusion support?

Fusion supports AWS S3, Azure Blob, and Google Cloud Storage. Fusion can also be used with local storage solutions that support the AWS S3 API. 

### How does Fusion work?

Fusion implements a FUSE driver that mounts the cloud storage bucket in the job execution context as
a POSIX file system. This allows the job script to read and write data files in cloud object storage as if they were local files.

### Why is Fusion faster than other FUSE drivers?

Fusion is not a general purpose file system. It has been designed to optimize the data transfer of bioinformatics pipelines by taking advantage of the Nextflow data model.

### Why do I need Wave containers to use Fusion?

Fusion is designed to work at the job execution level. This means it must run in a containerized job execution context.

Downloading and installing Fusion manually would require you to rebuild all the containers used by your data pipeline to include the Fusion client each time a new version of the client is released. You would also need to maintain a custom mirror or existing container
collections, such as [BioContainers](https://biocontainers.pro/).

Wave enables you to add the Fusion client to your pipeline containers at deploy time, without the need to rebuild them or
maintain a separate container image collection.

### Can Fusion mount more than one bucket in the job's file system?

Yes. Any access to cloud object storage is automatically detected by Fusion and the corresponding buckets are mounted
on demand.

### Can Fusion mount buckets of different vendors in the same execution?

No. Fusion can mount multiple buckets per execution, but all from the same vendor, such as AWS S3 or Google Cloud Storage.

### I tried Fusion, but I didn't notice any performance improvement. Why?

If you didn’t notice any performance improvement with Fusion, the bottleneck may lie in other factors, such as network latency or memory limitations. Fusion’s caching strategy relies heavily on NVMe SSD or similar storage technology, so ensure your computing nodes are using the recommended storage. Check your Platform compute environment page for optimal instance and storage configurations:

- [AWS Batch](https://docs.seqera.io/platform-cloud/compute-envs/aws-batch)
- [Azure Batch](https://docs.seqera.io/platform-cloud/compute-envs/azure-batch)
- [Google Cloud Batch](https://docs.seqera.io/platform-cloud/compute-envs/google-cloud-batch)
- [Amazon Elastic Kubernetes Service](https://docs.seqera.io/platform-cloud/compute-envs/eks)
- [Google Kubernetes Engine](https://docs.seqera.io/platform-cloud/compute-envs/gke)

### Can I pin a specific Fusion version to use with Nextflow?

Yes. Add the Fusion version's config URL using the `containerConfigUrl` option in the Fusion block of your Nextflow configuration (replace `v2.4.2` with the version of your choice):

```groovy
fusion {
  enabled = true
  containerConfigUrl = 'https://fusionfs.seqera.io/releases/v2.4.2-amd64.json' 
}
```

:::note
For ARM CPU architectures, use https://fusionfs.seqera.io/releases/v2.4.2-arm64.json. 
:::

### Can I use Fusion with MinIO?

Yes. [MinIO](https://min.io/) implements an S3-compatible API, therefore it can be used instead of AWS S3. See [Local execution](https://docs.seqera.io/fusion/guide/local/minio) for more information.

### Can I download Fusion?

No. Fusion can only be used directly in supported [Seqera Platform compute environments](https://docs.seqera.io/platform-cloud/compute-envs/overview), or by enabling [Wave containers](https://docs.seqera.io/wave) in your Nextflow configuration.

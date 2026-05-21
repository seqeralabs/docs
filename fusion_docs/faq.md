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

### Can I use Fusion without Seqera Platform?

Yes. Fusion can be enabled directly in a Nextflow pipeline that runs outside Seqera Platform, provided that you enable Wave and supply a Seqera Platform access token in your Nextflow configuration.

### I tried Fusion, but I didn't notice any performance improvement. Why?

If you didn’t notice any performance improvement with Fusion, the bottleneck may lie in other factors, such as network latency or memory limitations. Fusion’s caching strategy relies heavily on NVMe SSD or similar storage technology, so ensure your computing nodes are using the recommended storage. Check your Platform compute environment page for optimal instance and storage configurations:

- [AWS Batch](https://docs.seqera.io/platform-cloud/compute-envs/aws-batch)
- [Azure Batch](https://docs.seqera.io/platform-cloud/compute-envs/azure-batch)
- [Google Cloud Batch](https://docs.seqera.io/platform-cloud/compute-envs/google-cloud-batch)
- [Amazon Elastic Kubernetes Service](https://docs.seqera.io/platform-cloud/compute-envs/eks)
- [Google Kubernetes Engine](https://docs.seqera.io/platform-cloud/compute-envs/gke)

### How does the scratch process directive interact with Fusion?

The Nextflow [`scratch`](https://www.nextflow.io/docs/latest/reference/process.html#scratch) process directive controls where a task runs:

- `process.scratch = false`: Tasks read and write directly through the Fusion-mounted work directory in cloud object storage.
- `process.scratch = true`: Nextflow stages task inputs to a local scratch directory (the path set by `$TMPDIR`, or `/tmp` if unset), runs the task there, and copies outputs back to the work directory. This bypasses Fusion for the task body and runs the workload on local instance storage.

For most workloads, `process.scratch = false` is faster and is the recommended default. Consider `process.scratch = true` for tasks that perform heavy small-file I/O. For example, processes that read or write many thousands of small files.

Apply `scratch = true` selectively to the affected processes rather than globally:

```groovy
process {
    // Default: tasks run directly on the Fusion-mounted work directory
    scratch = false

    // Use local scratch for processes with heavy small-file I/O
    withName: 'PROCESS_NAME' {
        scratch = true
    }
}
```

Ensure the compute environment provides enough fast local storage for the staged inputs and outputs.

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

---
title: Google Cloud Batch
description: "Use Fusion with Google Cloud Batch and Google Cloud Storage"
date created: "2024-08-23"
last updated: "2026-09-01"
tags: [fusion, storage, compute, gcp batch, gcs, google cloud]
---

Fusion simplifies and improves the efficiency of Nextflow pipelines in [Google Cloud Batch](https://cloud.google.com/batch) in several ways:

- No need to use the gcloud CLI tool for copying data to and from Google Cloud storage.
- No need to create custom containers to include the gcloud CLI tool.
- Fusion uses an efficient data transfer and caching algorithm that provides much faster throughput compared to gcloud CLI and does not require a local copy of data files.
- Replacing the gcloud CLI with a native API client, the transfer is much more robust at scale.

### Platform Google Cloud Batch compute environments

Seqera Platform supports Fusion in Google Cloud Batch compute environments.

See [Google Cloud Batch](https://docs.seqera.io/platform-cloud/compute-envs/google-cloud-batch) for compute and storage recommendations and instructions to enable Fusion.

### Nextflow CLI

:::tip
When you enable Fusion v2, the following virtual machine settings apply:
  - Unless you specify an instance template, Nextflow requests a 375 GB scratch disk for all compute jobs. The disk type depends on the machine family. See [Scratch disk](#scratch-disk).
  - If you do not specify a machine type, a VM from the following families that support local SSDs is selected: `n1-*`, `n2-*`, `n2d-*`, `c2-*`, `c2d-*`, `m3-*`.
  - Use the `machineType` directive to specify a VM instance type, family, or custom machine type in a comma-separated list of patterns. For example, `c2-*`, `n1-standard-1`, `custom-2-4`, `n*`, `m?-standard-*`.
:::

1. Provide your Google credentials via the `GOOGLE_APPLICATION_CREDENTIALS` environment variable
or with the `gcloud` auth application-default login command. See [Credentials](https://docs.seqera.io/nextflow/google#credentials) for more information.

1. Add the following to your `nextflow.config` file:

    ```groovy
    process.scratch = false
    process.executor = 'google-batch'
    wave.enabled = true
    fusion.enabled = true
    tower.accessToken = '<PLATFORM_ACCESS_TOKEN>'
    google.location  = '<GOOGLE_LOCATION>'
    ```

    Replace the following:
    - `<PLATFORM_ACCESS_TOKEN>`: your Platform access token.
    - `<GOOGLE_LOCATION>`: your Google region.

1. Run the pipeline with the Nextflow run command:

    ```
    nextflow run <PIPELINE_SCRIPT> -w gs://<GCS_BUCKET>/work
    ```

    Replace the following:
    - `<PIPELINE_SCRIPT>`: your pipeline Git repository URI.
    - `<GCS_BUCKET>`: your Google Cloud Storage bucket to which you have read-write access.

### Scratch disk

Fusion caches data on a scratch disk mounted at `/tmp` on each task VM. When a process does not set the `disk` directive, Nextflow requests a 375 GB disk and selects the type from the machine family:

- Families that support local SSDs use `local-ssd`.
- The `e2-*` family, which does not support local SSDs, uses `pd-balanced`.
- Other families without local SSD support use `hyperdisk-balanced`.

Local SSDs are sold in fixed increments. The increment is 375 GB for most machine series. Request additional scratch space in multiples of that increment.

#### Set the disk type

Set the `disk` directive with a `type` option to choose the disk type yourself. In your Nextflow configuration, pass the request and the type as a map:

```groovy
process {
    // Two local SSDs for a process that does heavy I/O
    withName: 'ALIGN' {
        disk = [request: 750.GB, type: 'local-ssd']
    }
    // A smaller persistent disk for a process that does light I/O
    withName: 'INDEX' {
        disk = [request: 100.GB, type: 'pd-balanced']
    }
}
```

:::caution
Include the `type` option whenever you set the `disk` directive. Without it, `disk = 750.GB` sets the boot disk size and no dedicated Fusion scratch SSD is attached.
:::

An instance template overrides the `disk` directive, and Nextflow does not add a scratch disk to it. To use Fusion with an instance template, the template must include a `local-ssd` disk named `fusion` with 375 GB.

#### Choose between local SSD and persistent disk

Keep the `local-ssd` default for processes that do heavy random or streaming I/O. Fusion caching depends on local SSD throughput. A slower disk reduces the speedup that Fusion provides.

Use a persistent disk in two cases:

- Your local SSD quota constrains your runs. Google Cloud caps local SSD capacity per project, per region, and per machine family, and large or highly parallel workloads can exhaust that cap. A persistent disk draws on a separate quota. For runs that hit the cap, see [Jobs stay pending with `CODE_GCE_QUOTA_EXCEEDED`](../troubleshooting/general.md#jobs-stay-pending-with-code_gce_quota_exceeded).
- A process needs less than 375 GB of cache. Because local SSDs come in fixed increments, you pay for a full 375 GB disk that a light-I/O process never fills. Size a persistent disk to the cache the process needs.

Per GB, local SSD costs less than `pd-balanced`. A persistent disk saves money by being smaller, not by costing less per GB. See [Disk pricing](https://cloud.google.com/compute/disks-image-pricing) for current rates.

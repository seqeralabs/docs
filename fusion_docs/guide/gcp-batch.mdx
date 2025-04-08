---
title: Google Cloud Batch
description: "Use Fusion with Google Cloud Batch and Google Cloud Storage"
date: "23 Aug 2024"
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
When Fusion v2 is enabled, the following virtual machine settings are applied:
  - A 375 GB local NVMe SSD is selected for all compute jobs.
  - If you do not specify a machine type, a VM from the following families that support local SSDs will be selected: `n1-*`, `n2-*`, `n2d-*`, `c2-*`, `c2d-*`, `m3-*`.
  - Any machine types you specify in the Nextflow config must support local SSDs.
  - Local SSDs are only offered in multiples of 375 GB. You can increment the number of SSDs used per process with the `disk` directive to request multiples of 375 GB. 
  - Fusion v2 can also use persistent disks for caching. Override the disk requested by Fusion using the `disk` directive and the `type: pd-standard`.
  - The `machineType` directive can be used to specify a VM instance type, family, or custom machine type in a comma-separated list of patterns. For example, `c2-*`, `n1-standard-1`, `custom-2-4`, `n*`, `m?-standard-*`.
:::

1. Provide your Google credentials via the `GOOGLE_APPLICATION_CREDENTIALS` environment variable
or with the `gcloud` auth application-default login command. See [Credentials](https://www.nextflow.io/docs/latest/google.html#credentials) for more information.

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

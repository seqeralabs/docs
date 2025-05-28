---
title: Azure Blob Storage
description: "Use Fusion with the Nextflow local executor and Azure Blob Storage"
date: "13 Feb 2025"
tags: [fusion, storage, compute, local, azure blob]
---

With Fusion, you can run Nextflow pipelines using the local executor and Azure Blob Storage. This
is useful to scale your pipeline execution vertically with a large compute instance, without the need to allocate
a large storage volume for temporary pipeline data.

### Nextflow CLI

:::tip
This configuration requires Docker or a similar container engine to run pipeline tasks.
:::

1. Set `AZURE_STORAGE_ACCOUNT_NAME` and `AZURE_STORAGE_ACCOUNT_KEY` or `AZURE_STORAGE_SAS_TOKEN` environment variables to grant Nextflow and Fusion access to your storage credentials. See [Credentials](https://www.nextflow.io/docs/latest/google.html#credentials) for more information.

1. Add the following to your `nextflow.config` file:

   ```groovy
   wave.enabled = true
   docker.enabled = true
   tower.accessToken = '<PLATFORM_ACCESS_TOKEN>'
   fusion.enabled = true
   fusion.exportStorageCredentials = true
   ```

   Replace `<PLATFORM_ACCESS_TOKEN>` with your Platform access token.

1. Run the pipeline with the Nextflow run command:

   ```
   nextflow run <PIPELINE_SCRIPT> -w az://<BLOB_STORAGE>/scratch
   ```

   Replace the following:

   - `<PIPELINE_SCRIPT>`: your pipeline Git repository URI.
   - `<BLOB_STORAGE>`: your Azure Blob Storage.

:::tip
To achieve optimal performance, set up an SSD volume as the temporary directory.
:::

:::warning
The option `fusion.exportStorageCredentials` leaks credentials on the task launcher script created by Nextflow.
This option should only be used for testing and development purposes.
:::

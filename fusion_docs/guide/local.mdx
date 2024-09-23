---
title: Local execution
description: "Use Fusion with the Nextflow local executor and cloud storage"
date: "23 Aug 2024"
tags: [fusion, storage, compute, local, s3]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

With Fusion, you can run Nextflow pipelines using the local executor and a cloud storage bucket as the pipeline scratch directory. This
is useful to scale your pipeline execution vertically with a large compute instance, without the need to allocate
a large storage volume for temporary pipeline data.

:::note
This configuration requires the use of Docker (or a similar container engine) for the execution of your pipeline tasks.
:::

<Tabs>
<TabItem value="AWS S3" label="AWS S3" default>

  1. Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables to grant Nextflow and Fusion access to your storage credentials.

  1. Add the following to your `nextflow.conf` file:

      ```groovy
      wave.enabled = true
      docker.enabled = true
      fusion.enabled = true
      fusion.exportStorageCredentials = true
      ```

  1. Run the pipeline with the usual run command:

      ```
      nextflow run <YOUR PIPELINE SCRIPT> -w s3://<YOUR-BUCKET>/work
      ```

      Replace `YOUR PIPELINE SCRIPT` with your pipeline Git repository URI
      and `YOUR-BUCKET` with an S3 bucket of your choice.

  :::tip
  To achieve optimal performance, set up an SSD volume as the temporary directory.
  :::

</TabItem>
<TabItem value="Azure Blob Storage" label="Azure Blob Storage" default>

  1. Set `AZURE_STORAGE_ACCOUNT_NAME` and `AZURE_STORAGE_ACCOUNT_KEY` or `AZURE_STORAGE_SAS_TOKEN` environment variables to grant Nextflow and Fusion access to your storage credentials.

  1. Add the following to your `nextflow.conf` file:

      ```groovy
      wave.enabled = true
      docker.enabled = true
      fusion.enabled = true
      fusion.exportStorageCredentials = true
      ```

  1. Run the pipeline with the usual run command:

      ```
      nextflow run <YOUR PIPELINE SCRIPT> -w s3://<YOUR-BUCKET>/work
      ```

      Replace `YOUR PIPELINE SCRIPT` with your pipeline Git repository URI
      and `YOUR-BUCKET` with an S3 bucket of your choice.

  :::tip
  To achieve optimal performance, set up an SSD volume as the temporary directory.
  :::

</TabItem>
<TabItem value="Google Cloud Storage" label="Google Cloud Storage" default>

  1. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable with your service account JSON key to grant Nextflow and Fusion access to your storage credentials.

  1. Add the following to your `nextflow.conf` file:

      ```groovy
      wave.enabled = true
      docker.enabled = true
      fusion.enabled = true
      fusion.exportStorageCredentials = true
      ```

  1. Run the pipeline with the usual run command:

      ```
      nextflow run <YOUR PIPELINE SCRIPT> -w s3://<YOUR-BUCKET>/work
      ```

      Replace `YOUR PIPELINE SCRIPT` with your pipeline Git repository URI
      and `YOUR-BUCKET` with an S3 bucket of your choice.

  :::tip
  To achieve optimal performance, set up an SSD volume as the temporary directory.
  :::

</TabItem>
</Tabs>
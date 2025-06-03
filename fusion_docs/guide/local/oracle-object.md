---
title: Oracle Object Storage
description: "Use Fusion with the Nextflow local executor and Oracle Object Storage"
date: "13 Feb 2025"
tags: [fusion, storage, compute, local, oracle object storage]
---

With Fusion, you can run Nextflow pipelines using the local executor and [Oracle Object Storage](https://www.oracle.com/cloud/storage/object-storage/). This
is useful to scale your pipeline execution vertically with a large compute instance, without the need to allocate
a large storage volume for temporary pipeline data.

### Nextflow CLI

:::tip
This configuration requires Docker or a similar container engine to run pipeline tasks.
:::

:::note
[Oracle Object Storage](https://www.oracle.com/cloud/storage/object-storage/) relies on the S3-like API compatibility provided by Oracle storage and not by native Nextflow and Fusion support.
It may not support all Nextflow and Fusion features.
:::

1. Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables to grant Nextflow and Fusion access to your storage credentials.

1. Add the following to your `nextflow.config` file:

    ```groovy
    wave.enabled = true
    docker.enabled = true
    docker.containerOptions = '-e FUSION_AWS_REGION=<AWS_REGION>'
    tower.accessToken = '<PLATFORM_ACCESS_TOKEN>'
    fusion.enabled = true
    fusion.exportStorageCredentials = true
    aws.region = '<AWS_REGION>'
    aws.client.endpoint = 'https://<BUCKET_NAMESPACE>.compat.objectstorage.<AWS_REGION>.oraclecloud.com'
    aws.client.protocol = 'https'
    aws.client.signerOverride = 'AWSS3V4SignerType'
    aws.client.s3PathStyleAccess = true
    ```

    Replace the following:
    - `<PLATFORM_ACCESS_TOKEN>`: your Platform access token.
    - `<AWS_REGION>`: your AWS region.
    - `<BUCKET_NAMESPACE>`: your bucket name.

1. Run the pipeline with the Nextflow run command:

    ```
    nextflow run <PIPELINE_SCRIPT> -w s3://<BUCKET>/work
    ```

    Replace the following:
    - `PIPELINE_SCRIPT`: your pipeline Git repository URI.
    - `BUCKET`: your bucket.

:::tip
To achieve optimal performance, set up an SSD volume as the temporary directory.
:::

:::warning
The option `fusion.exportStorageCredentials` leaks credentials on the task launcher script created by Nextflow.
This option should only be used for testing and development purposes.
:::

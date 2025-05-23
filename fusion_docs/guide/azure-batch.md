---
title: Azure Batch
description: "Use Fusion with Azure Batch and Azure Blob storage"
date: "23 Aug 2024"
tags: [fusion, storage, compute, azure batch, blob storage]
---

Fusion simplifies and improves the efficiency of Nextflow pipelines in [Azure Batch](https://azure.microsoft.com/en-us/products/batch) in several ways:

- No need to use the Azure CLI tool for copying data to and from Azure Blob Storage.
- No need to install the Azure CLI tool to the node machine
- By replacing the Azure CLI with a native API client, the transfer is much more robust at scale.
- By streaming relevant data and monitoring the virtual machine storage, Fusion can use more data than the capacity of the attached storage drive

### Platform Azure Batch compute environments 

Seqera Platform supports Fusion in Batch Forge and manual Azure Batch compute environments. 

See [Azure Batch](https://docs.seqera.io/platform-cloud/compute-envs/azure-batch) for compute and storage recommendations and instructions to enable Fusion.

### Nextflow CLI

:::tip
We recommend selecting machine types with a local temp storage disk of at least 200 GB and a random read speed of 1000 MBps or more for large and long-lived production pipelines. The suffix `d` after the core number (e.g., `Standard_E16*d*_v5`) denotes a VM with a local temp disk. Select instances with Standard SSDs — Fusion does not support Azure network-attached storage (Premium SSDv2, Ultra Disk, etc.). Larger local storage increases Fusion's throughput and reduces the chance of overloading the machine. See [Sizes for virtual machines in Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview) for more information.
:::

1. Add the following to your `nextflow.config` file:

    ```groovy
    process.executor = 'azure-batch'
    wave.enabled = true
    fusion.enabled = true
    tower.accessToken = '<PLATFORM_ACCESS_TOKEN>'    
    ```

    Replace `<PLATFORM_ACCESS_TOKEN>` with your Platform access token.

1. Run the pipeline with the Nextflow run command:

    ```
    nextflow run <PIPELINE_SCRIPT> -w az://<BLOB_STORAGE>/scratch
    ```

    Replace the following:
    - `<PIPELINE_SCRIPT>`: your pipeline Git repository URI.
    - `<BLOB_STORAGE>`: your Azure Blob Storage.

---
title: Fusion licensing
description: "Understand how Fusion licensing works"
date: "20 Feb 2025"
tags: [fusion, storage, compute, file system, license, quotas]
---

:::info
Fusion licensing requirements and free tier quotas will be enforced starting June 30th, 2025. [Contact Seqera](https://seqera.io/contact-us) with any questions or licensing requests.
:::

A Fusion license sets a specific quota for Fusion use, measured by total throughput per month (defined by [Nextflow’s I/O metrics](https://www.nextflow.io/docs/latest/tutorials/metrics.html#i-o-usage)).

### For Seqera Cloud 

- Seqera Platform will automatically add and manage a Fusion license on your behalf, up to the allowed usage quota. Seqera will track Fusion use for all pipelines run in Platform.
- The default quota for free use within Seqera Cloud is 100TB.
- Once your quota is met or exceeded, you will be prevented from running additional Nextflow pipelines with Fusion.

### For Seqera Enterprise instances with connectivity to Seqera’s license server

- Seqera Platform will automatically add and manage a Fusion license on your behalf, up to the allowed usage quota. Seqera will track Fusion use for all pipelines run in Platform.
- Once your quota is met or exceeded, you will be prevented from running additional Nextflow pipelines with Fusion.

### For Seqera Enterprise instances without network connectivity, and direct Fusion use with Nextflow  

- Run Fusion by using a Cloud API via Nextflow’s `TOWER_ACCESS_TOKEN` environment variable in the `nextflow.config` file.
- This will count toward the Free/Paid usage associated with your Cloud organization.

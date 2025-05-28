---
title: "Azure"
description: "Azure troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, azure help, azure troubleshooting]
---

### Batch compute environments

**Use separate Batch pools for head and compute nodes**

The default Azure Batch implementation in Seqera Platform uses a single pool for head and compute nodes. This means that all jobs spawn dedicated/on-demand VMs by default. To save cloud costs by using low priority VMs for compute jobs, specify separate pools for head and compute jobs:

1. Create two Batch pools in Azure:
   - One Dedicated
   - One [Low priority](https://learn.microsoft.com/en-us/azure/batch/batch-spot-vms#differences-between-spot-and-low-priority-vms)

:::note
Both pools must meet the requirements of a pre-existing pool as detailed in the [Nextflow documentation](https://www.nextflow.io/docs/latest/azure.html#requirements-on-pre-existing-named-pools).
:::

2. Create a manual [Azure Batch](../compute-envs/azure-batch#manual) compute environment in Seqera Platform.
3. In **Compute pool name**, specify your dedicated Batch pool.
4. Specify the Low priority pool using the `process.queue` [directive](https://www.nextflow.io/docs/latest/process.html#queue) in your `nextflow.config` file either via the launch form, or your pipeline repository's `nextflow.config` file.

### Azure Kubernetes Service (AKS)

**... /.git/HEAD.lock: Operation not supported**

This error can occur if your Nextflow pod uses an Azure Files-type (SMB) persistent volume as its storage medium. By default, the `jgit` library used by Nextflow attempts a filesystem link operation which [is not supported](https://docs.microsoft.com/en-us/azure/storage/files/files-smb-protocol?tabs=azure-portal#limitations) by Azure Files (SMB).

To avoid this problem, add the following code snippet in your pipeline's [**Pre-run script**](../launch/advanced#pre-and-post-run-scripts) field:

```bash
cat <<EOT > ~/.gitconfig
[core]
	supportsatomicfilecreation = true
EOT
```

### SSL

**Problem with the SSL CA cert**

This can occur if a tool/library in your task container requires SSL certificates to validate the identity of an external data source. Mount SSL certificates into the container to resolve this issue. See [SSL/TLS](https://docs.seqera.io/platform-enterprise/latest/enterprise/configuration/ssl_tls#configure-tower-to-trust-your-private-certificate) for more information.

**Azure SQL database error: _Connections using insecure transport are prohibited while --require_secure_transport=ON_**

This error is due to Azure's default MySQL behavior which enforces the SSL connections between your server and client application, as detailed in [SSL/TLS connectivity in Azure Database for MySQL](https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-ssl-connection-security). To fix this, append `useSSL=true&enabledSslProtocolSuites=TLSv1.2&trustServerCertificate=true` to your `TOWER_DB_URL` connection string. For example:

`TOWER_DB_URL: jdbc:mysql://mysql:3306/tower?permitMysqlScheme=true/azuredatabase.com/tower?serverTimezone=UTC&useSSL=true&enabledSslProtocolSuites=TLSv1.2&trustServerCertificate=true`

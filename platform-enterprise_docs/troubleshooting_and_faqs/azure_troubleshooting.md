---
title: "Azure"
description: "Azure troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, azure, troubleshooting]
---

When running pipelines on Azure, you might encounter the following issues.

## Batch compute environments

#### Use separate Batch pools for head and compute nodes

The default Azure Batch implementation in Seqera Platform uses a single pool for head and compute nodes, and all jobs spawn dedicated (on-demand) VMs. To save costs by running compute jobs on low-priority VMs, use separate pools for head and compute jobs:

1. Create two Batch pools in Azure:
    - One dedicated pool
    - One [low-priority](https://learn.microsoft.com/en-us/azure/batch/batch-spot-vms#differences-between-spot-and-low-priority-vms) pool

:::note
Both pools must meet the requirements of a pre-existing pool, as detailed in the [Nextflow documentation](https://docs.seqera.io/nextflow/azure#requirements-on-pre-existing-named-pools).
:::

2. Create a manual [Azure Batch](../compute-envs/azure-batch#manual) compute environment in Seqera Platform.
3. In **Compute pool name**, specify your dedicated Batch pool.
4. Specify the low-priority pool with the `process.queue` [directive](https://docs.seqera.io/nextflow/process#queue) in your `nextflow.config` file, either through the launch form or your pipeline repository.

## Azure Kubernetes Service (AKS)

#### `.../.git/HEAD.lock: Operation not supported`

This error occurs when your Nextflow pod uses an Azure Files (SMB) persistent volume for storage. The `jgit` library that Nextflow uses attempts a filesystem link operation that Azure Files (SMB) [doesn't support](https://docs.microsoft.com/en-us/azure/storage/files/files-smb-protocol?tabs=azure-portal#limitations).

To resolve, add the following to your pipeline's [**Pre-run script**](../launch/advanced#pre-and-post-run-scripts) field:

```bash
cat <<EOT > ~/.gitconfig
[core]
	supportsatomicfilecreation = true
EOT
```

## SSL

#### SSL CA certificate errors

This can occur when a tool or library in your task container requires SSL certificates to validate an external data source. To resolve, mount the SSL certificates into the container. See [SSL/TLS](../enterprise/configuration/ssl_tls#configure-seqera-to-trust-your-private-certificate).

#### `Connections using insecure transport are prohibited while --require_secure_transport=ON`

This Azure SQL database error occurs because Azure's default MySQL configuration enforces SSL connections between the server and client, as described in [SSL/TLS connectivity in Azure Database for MySQL](https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-ssl-connection-security).

To resolve, append `useSSL=true&enabledSslProtocolSuites=TLSv1.2&trustServerCertificate=true` to your `TOWER_DB_URL` connection string:

```
TOWER_DB_URL: jdbc:mysql://mysql:3306/tower?permitMysqlScheme=true/azuredatabase.com/tower?serverTimezone=UTC&useSSL=true&enabledSslProtocolSuites=TLSv1.2&trustServerCertificate=true
```

## Azure Entra ID / OIDC

#### `No enum constant … SELF_SIGNED_TLS_CLIENT_AUTH`

On Seqera Platform v25.2.3 and earlier, Entra ID (Azure) authentication fails and the following error appears in the backend logs:

```
java.lang.IllegalArgumentException: No enum constant io.micronaut.security.oauth2.endpoint.AuthenticationMethod.SELF_SIGNED_TLS_CLIENT_AUTH**
```

This issue is caused by a change in Azure's supported authentication methods, which is incompatible with the OIDC library in older versions of Seqera Platform.

To resolve, force the authentication method to `client_secret_post` by adding the following environment variable to your `tower.env` file or Kubernetes ConfigMap:

```bash
MICRONAUT_SECURITY_OAUTH2_CLIENTS_OIDC_OPENID_TOKEN_AUTH_METHOD=client_secret_post
```

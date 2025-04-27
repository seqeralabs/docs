---
title: "Azure prerequisites"
description: Prerequisites for Azure deployments
date: "12 Apr 2023"
tags: [azure, prerequisites, configuration]
---

This page describes the infrastructure and other prerequisites for deploying Tower on Microsoft Azure.

## Tower container images

Nextflow Tower is distributed as a collection of Docker containers available through the Seqera Labs
container registry ([cr.seqera.io](https://cr.seqera.io)). Contact [support](https://support.seqera.io) to get your container access credentials. Once you have received your credentials, log in to the registry using these steps:

1. Retrieve the **username** and **password** you received from Seqera Labs support.

2. Run the following Docker command to authenticate to the registry (using the `username` and `password` values copied in step 1):

   ```bash
   docker login -u '/\<USERNAME\>/' -p '/\PASSWORD\>/' cr.seqera.io
   ```

3. Pull the Nextflow Tower container images with the following commands:

```bash
docker pull {{ images.tower_be_image }}

docker pull {{ images.tower_fe_image }}
```

:::caution
The Seqera Labs container registry `cr.seqera.io` is the default Tower container image registry from version 22.4. Use of the AWS, Azure, and Google Cloud Tower image registries in existing installations is still supported but will be deprecated for **new installations** starting June 2023. See [here](../advanced-topics/seqera-container-images.mdx) for steps to use the Seqera Labs private Azure registry.
:::

## Mandatory prerequisites

### Resource group and storage account

A [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal) and a [storage account](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview) are required to use Azure. See the [detailed instructions](#detailed-instructions) to provision these resources.

### SMTP server

If you do not have an email server, you can use [Microsoft 365](https://docs.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365) or a third party service such as [SendGrid](https://docs.sendgrid.com/for-developers/partners/microsoft-azure-2021) (recommended by Microsoft) for [sending emails](https://docs.microsoft.com/en-us/azure/virtual-network/troubleshoot-outbound-smtp-connectivity#recommended-method-of-sending-email) from Azure VMs.

### MySQL database

An external database (i.e. external to your Docker Compose or Kubernetes deployment) is _highly_ recommended for production deployments. If you don't have your own database service, you can use [Azure Database for MySQL](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal).

If you decide to use an external database, you must create a MySQL user and database manually. See [Configuration](../configuration/database_and_redis.mdx) for more details.

:::note
When creating a MySQL user, use the `USER@HOSTNAME` format for the `TOWER_DB_USER` environment variable.

    For Azure managed MySQL, it is [recommended](https://docs.microsoft.com/en-us/azure/mysql/connect-java#prepare-a-configuration-file-to-connect-to-azure-database-for-mysql) to pass an explicit `serverTimezone` to the `TOWER_DB_URL` environment variable, which (depending on your configuration) may be `UTC`. The connection string should therefore look like `jdbc:mysql://MYSQL_INSTANCE_NAME.mysql.database.azure.com/TOWER_DATABASE?serverTimezone=UTC`.

:::

### VM instance (Docker Compose)

A [Linux VM](https://azure.microsoft.com/en-us/services/virtual-machines/) instance is required to deploy Tower via Docker Compose. See the [detailed instructions](#detailed-instructions) to provision a VM instance for this purpose.

### AKS cluster (Kubernetes)

An [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough-portal) cluster is required to deploy Tower via Kubernetes. See the [AKS documentation](https://learn.microsoft.com/en-us/azure/architecture/aws-professional/eks-to-aks/) to provision your own cluster.

:::tip
To customize your cluster's Ingress Controller to support HTTPS redirects and TLS certificates, see [these instructions](https://azure.github.io/application-gateway-kubernetes-ingress/).
:::

## Optional prerequisites

### SSL certificate

An SSL certificate is required for your Tower instance to handle HTTPS traffic.

:::caution
From Tower 22.1.1, HTTP-only implementations **must** set the `TOWER_ENABLE_UNSAFE_MODE=true` environment variable in the Tower hosting infrastructure to enable user login.
:::

While there are many ways to implement DNS and TLS-termination, Seqera recommends using the specialized native services offered by your cloud provider. In the case of Azure:

- Use **Application Gateway** for TLS-termination and load-balancing.
- Use [**App Service Domains**](https://docs.microsoft.com/en-us/azure/dns/dns-overview) for domain acquisition.
- Use **Azure DNS** for domain record management.
- Use **Azure Vault** for PKI certificate storage.

These decisions should be made before you continue as they impact how Tower configuration files are updated.

<!-- To do: Write section on this. Use Application Gateway. Blurb about why  -->

<!-- ? Where to get from? [Free managed cert through App Service. Can generate own. Can buy from Azure (via GoDaddy). Store in Azure Key Vault](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate) -->
<!-- ### Option 1: Microsoft-Specific -->
<!-- ? This is? [Application Gateway with TLS](https://docs.microsoft.com/en-us/azure/application-gateway/create-ssl-portal), [Application Gateway DNS](https://docs.microsoft.com/en-us/azure/application-gateway/application-gateway-faq), route traffic via DNS system (Route53/Azure DNS) -->

<!-- App service seems to offer DNS and certs but appears to be a full deployment solution - no need for the VM. -->
<!-- URL xxxxx.azurewebsites.net -> seems to allow custom domains (can buy from Azure) -->

## Detailed instructions

This section provides step-by-step instructions for some commonly used Azure services for Tower deployment. See the [Azure documentation](https://docs.microsoft.com/en-us/azure/?product=popular) for up-to-date instructions and contact [Azure support](https://support.microsoft.com/en-us/topic/contact-microsoft-azure-support-2315e669-8b1f-493b-5fb1-d88a8736ffe4) if you have any issues with provisioning Azure resources.

### Azure Resource Group

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Resource groups**.

3. Select **Add**.

4. Enter the following values:

   - **Subscription**: Select your Azure subscription.

   - **Resource group**: Enter a new resource group name (e.g. `nftowerrg`).

   - **Region**: Select the Region where your assets will exist (e.g. `East US`).

5. Select **Review and Create**.

6. Select **Create**.

### Azure Storage Account

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Storage accounts**.

3. Select **Create**.

4. Enter the following values:

   - **Subscription**: Select your Azure subscription.

   - **Resource group**: Enter your resource group name.

   - **Storage account name**: Enter a new storage account name (e.g. `nftowerstorage`).

   - **Region**: Select the Region where your Resource Group exists (e.g. `East US`).

   - **Performance**: Select `Standard`.

   - **Redundancy**: Select `Geo-redundant storage (GRS)`

5. Select **Review + create**. Note that the default values are used in the other tabs. See the [Azure documentation](https://docs.microsoft.com/en-ca/azure/storage/common/storage-account-create?tabs=azure-portal#create-a-storage-account-1) for further details on each setting.

6. Select **Create**.

### Azure Linux VM

We recommend the following VM settings:

1. Use **default values** unless otherwise specified.
2. Provision at least **2 CPUS** and **8GB RAM**.
3. Use the **Ubuntu Server 24.04 - Gen2** image.
4. Ensure your VM is **accessible by SSH**.
5. Do not implement DNS or Load Balancing directly against the VM (do so via Azure Application Gateway instead).

To create a VM:

1. Configure the **Basics** tab:

   - Ensure your **Region** is the same as your **Resource group**.
   - Do not set the VM as an **Azure Spot instance**.
   - Ensure your Security Group allows ingress on **Port 8000**.

2. Configure the **Disks** tab:

   - Ensure your OS disk type is **Standard SSD**.

3. Configure the **Network** tab:

   - Ensure that a **Public IP** is assigned to the VM.
   - Do not place the VM in the backend pool of an existing load balancing solution.

4. Select **Review + create**.

5. Select **Create**.

To make the VM's IP address static:

1. Enter **Public IP addresses** in the search.

2. Under **Services**, select **Public IP addresses**.

3. On the **Public IP addresses** page, select the entry containing your VM name. A page opens with that IP's details.

4. Select **Configuration** from the left-hand navigation panel.

5. Ensure that your IP address assignment is **Static**.

6. Do not add a custom DNS name label to the VM.

To allow ingress on port 8000:

1. Enter **Virtual Machines** in the search bar.

2. Under **Services**, select **Virtual machines**.

3. On the **Virtual machines** page, select your VM name to navigate to the VM details.

4. Select **Networking** from the left-hand navigation panel.

5. **Add inbound port rule** for port 8000.

To install Docker:

1.  Complete the steps for the [Install using the apt repository][docker] instructions.
2.  Confirm that Docker Compose is installed:

    ```bash
    docker compose version
    Docker Compose version v2.24.1
    ```

[docker]: https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository

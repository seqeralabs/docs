---
title: "Azure"
description: Prerequisites for Azure deployments
date: "12 Apr 2023"
tags: [azure, prerequisites, configuration]
---

This page describes the infrastructure and other prerequisites for deploying Seqera Platform Enterprise on Microsoft Azure.

Run the Seqera container with [Docker](../docker-compose) on an Azure VM instance or with [Kubernetes](../kubernetes) on an Azure AKS cluster. You must satisfy the requirements for your installation target:

- A resource group and a storage account are required to use Azure. See [Azure setup](#azure-setup) below to provision these resources.
- **SMTP server**: If you don't have an email server, see [Azure's recommended method of sending email][azure-sendmail]. Microsoft recommends [Microsoft 365][msft-365] or the third party service [SendGrid][sendgrid].
- **MySQL database**: An external database such as [Azure Database for MySQL][azure-db-create-portal] is highly recommended for production deployments.
- **SSL certificate**: An SSL certificate is required for your Seqera instance to handle HTTPS traffic.

  :::caution
  HTTP-only implementations **must** set the `TOWER_ENABLE_UNSAFE_MODE=true` environment variable in the Seqera hosting infrastructure to enable user login. HTTP must not be used in production environments.
  :::

- **DNS**: (Optional) DNS is required to support human-readable domain names and load-balanced traffic. See [Azure DNS][azure-dns] to learn about domain aquisition and record management.

These decisions must be made before you continue as they impact how Seqera configuration files are updated.

### Prerequisites for Docker

A Linux VM instance is required to deploy Seqera Enterprise via Docker Compose. See the [detailed instructions](#azure-setup) to provision a VM instance for this purpose.

### Prerequisites for AKS

An [Azure Kubernetes Service (AKS)][aks-walkthrough] cluster is required to deploy Seqera Enterprise via Kubernetes.

## Azure setup

Set up commonly used Azure services for Seqera deployment.

### Azure resource group

Create a resource group:
- [Via the Azure portal][azure-rg-portal]
- [Via the Azure CLI][azure-rg-cli]

<details>
  <summary>Create a resource group via Azure portal</summary>

  1. Sign in to the [Azure portal](https://portal.azure.com).
  1. Select **Resource groups**.
  1. Select **Add**.
  1. Enter the following values:
      - **Subscription**: Select your Azure subscription.
      - **Resource group**: Enter a new resource group name (such as `towerrg`).
      - **Region**: Select the region where your assets will exist (such as `East US`).
  1. Select **Review and Create**.
  1. Select **Create**.

</details>
<details>
  <summary>Create a resource group via Azure CLI</summary>

  Run the `az group create` command:

  ```bash
  az group create --name $MY_RESOURCE_GROUP_NAME --location $REGION
  ```

</details>

### Azure storage account

Create a storage account:
- [Via the Azure portal][azure-storage-portal]
- [Via the Azure CLI][azure-storage-cli]

<details>
  <summary>Create a storage account via Azure portal</summary>

  1. Sign in to the [Azure portal](https://portal.azure.com).
  1. Select **Storage accounts**.
  1. Select **Create**.
  1. Enter the following values:
      - **Subscription**: Select your Azure subscription.
      - **Resource group**: Enter your resource group name.
      - **Storage account name**: Enter a new storage account name (such as `towerstorage`).
      - **Region**: Select the region where your Resource Group exists (such as `East US`).
      - **Performance**: Select `Standard`.
      - **Redundancy**: Select `Geo-redundant storage (GRS)`.
  1. Select **Review + create**. The default values are used in the other tabs. See [Create a storage account][azure-storage-portal] for further details on each setting.
  1. Select **Create**.

</details>
<details>
  <summary>Create a storage account via Azure CLI</summary>

  Run the `az storage account create` command:

  ```bash
  az storage account create -n towerstorage -g towerrg -l eastus --sku Standard_GRS
  ```

</details>

### Azure MySQL DB instance 

External databases for Seqera Enterprise deployments require:
- A **MySQL8 Community** DB instance.
- At least **2 vCPUs**, **8 GB memory**, and **30 GB** SSD storage.
- Manual MySQL user and database schema creation. See [Database configuration](../configuration/overview#seqera-and-redis-databases) for more details.

:::caution 
Recommended instance performance and storage requirements depend on the number of parallel pipelines you expect to run. 
:::

Create an Azure MySQL DB instance:
- [Via Azure portal][azure-db-create-portal]
- [Via Azure CLI][azure-db-create-cli]

<details>
  <summary>Create a MySQL DB instance via Azure portal</summary>

  1. In the Azure portal, search for and select **Azure Database for MySQL servers**.
  1. Select **Create**.
  1. On the **Select Azure Database for MySQL deployment option** pane, select **Flexible server** as the deployment option.
  1. On the **Basics** tab, enter or select the following:
      - Your **Subscription** name 
      - Your **Resource group** name 
      - A **Server name** such as `towerdbserver`
      - Your **Region**
      - The **Workload type**, based on your required `max_connections`
      - **High availability** — high availability is recommended for production deployments 
      - **Standby availability zone** — standby server zone location
      - **MySQL version** — 8.0 
      - An **Admin username** to access the server 
      - A **Password** to access the server 
      - Your **Compute + storage** requirements, considering the minimum performance requirements outlined above 
  1. Configure networking options. 
  1. Select **Review + create**, then **Create**. 

</details>
<details>
  <summary>Create a MySQL DB instance via Azure CLI</summary>

  1. Run `az mysql flexible-server create` to create your server:

      ```bash
      az mysql flexible-server create --location eastus --resource-group towerrg --name towerdbserver --admin-user username --admin-password password --sku-name Standard_B2ms --tier Burstable --public-access 0.0.0.0 --storage-size 30 --version 8.0 --high-availability ZoneRedundant --zone 1 --standby-zone 3 --storage-auto-grow Enabled --iops 500
      ```

      The `sku-name`, `tier`, `storage-size`, and `iops` values depend on your performance requirements.

  1. Run `az mysql flexible-server db create` to create a database on your server:

      ```bash 
      az mysql flexible-server db create --resource-group towerrg
                                      --server-name towerdbserver
                                      --database-name towerdb
      ```                                

</details>

After your database is created, update your Seqera [configuration](../configuration/overview#seqera-and-redis-databases) with the database hostname, Admin username, and password.

:::note
When creating a MySQL user, use the `USER@HOSTNAME` format for the `TOWER_DB_USER` environment variable. For Azure managed MySQL, it's [recommended][azure-db-config] to pass an explicit `serverTimezone` to the `TOWER_DB_URL` environment variable, which (depending on your configuration) may be `UTC`. The DB connection string should be similar to `jdbc:mysql://towerdbserver.mysql.database.azure.com/towerdb?serverTimezone=UTC`.
:::

### Azure Linux VM

Create a VM instance with these attributes:

- Use **default values** unless otherwise specified.
- At least **2 CPUS** and **8GB RAM**.
- **Ubuntu Server 22.04 LTS - Gen2** image.
- **Accessible by SSH**.

Create an Azure Linux VM:
- [Via the Azure portal][azure-linux-vm-portal]
- [Via the Azure CLI][azure-linux-vm-cli]

<details>
  <summary>Create a VM via Azure portal</summary>

  1. Under **Basics**, select your **Subscription** and **Resource group**.
  1. Under **Instance details**:
      - Enter a **VM name**
      - Select the same **Region** as your resource group.
      - Select the **Ubuntu Server 24.04 LTS - Gen2** image.
      - Do not set the VM as an **Azure Spot instance**.
      - Select the **Size** — B2ps v2 or higher is recommended.
  1. Under **Administrator account**:
      - Select **SSH public key**
      - Enter a **username**
      - Select **Generate new key pair**
      - Enter a **Key pair name**
  1. Under **Inbound port rules**:
      - Select **Allow selected ports**
      - Select **SSH (22)**, **HTTP (8000)**, **HTTP (80)**, and **HTTPS (443)** (required for SSL termination in production environments) from the dropdown
  1. Select **Review + create** at the bottom of the page.
  1. Review your VM details, then select **Create**.
  1. When the **Generate new key pair** window opens, select **Download private key and create resource**. Your key file will be download as `myKey.pem`. Note the path to which it was downloaded.
  1. On the page for your new VM, copy the **Public IP address**. 

  To make the VM's IP address static:

  1. Enter **Public IP addresses** in the search.
  1. Under **Services**, select **Public IP addresses**.
  1. On the **Public IP addresses** page, select the entry containing your VM name. A page opens with that IP's details.
  1. Select **Configuration** from the left-hand navigation panel.
  1. Confirm that your IP address assignment is **Static**.
  1. Do not add a custom DNS name label to the VM.

  To allow ingress on port 8000:

  1. Enter **Virtual Machines** in the search bar.
  1. Under **Services**, select **Virtual machines**.
  1. On the **Virtual machines** page, select your VM name to navigate to the VM details.
  1. Select **Networking** from the left-hand navigation panel.
  1. **Add inbound port rule** for port 8000.

  To allow ingress on port 443 (required for SSL/TLS termination in production environments):

  1. Enter **Virtual Machines** in the search bar.
  1. Under **Services**, select **Virtual machines**.
  1. On the **Virtual machines** page, select your VM name to navigate to the VM details.
  1. Select **Networking** from the left-hand navigation panel.
  1. **Add inbound port rule** for port 443.

  Connect to the VM via SSH:

  1. On a macOS or Linux machine, open a terminal and set read-only permission on the `myKey.pem` file with `chmod 400 ~/Downloads/myKey.pem`.
  1. Install Docker:
      1.  [Install Docker using the apt repository][docker].
      1.  Confirm that Docker Compose is installed:

          ```bash
          docker compose version
          Docker Compose version v2.24.1
          ```

</details>
<details>
  <summary>Create a VM via Azure CLI</summary>

  Run `az vm create`:

  ```bash 
  az vm create \
    --resource-group towerrg \
    --name towervm \
    --image Canonical:0001-com-ubuntu-minimal-jammy:minimal-22_04-lts-gen2:latest \
    --admin-username username \
    --assign-identity \
    --generate-ssh-keys \
    --public-ip-sku Standard
  ```

</details>

## Seqera container images

Seqera Platform Enterprise is distributed as a collection of Docker containers available through the Seqera
container registry ([cr.seqera.io](https://cr.seqera.io)). Contact [support](https://support.seqera.io) to get your container access credentials. After you've received your credentials, retrieve the Seqera container images on your Azure VM:

1. Retrieve the **username** and **password** you received from Seqera support.
1. Run the following Docker command to authenticate to the registry (using the `username` and `password` values copied in step 1):

    ```bash
    docker login -u '/\<USERNAME\>/' -p '/\PASSWORD\>/' cr.seqera.io
    ```

1. Pull the Seqera container images with the following commands:

    ```bash
    docker pull cr.seqera.io/private/nf-tower-enterprise/backend:v24.1.7

    docker pull cr.seqera.io/private/nf-tower-enterprise/frontend:v24.1.7
    ```

## Next steps 

See [Configuration](../configuration/overview). 

[docker]: https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository
[aks-walkthrough]: https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough-portal
[azure-db-create-cli]: https://learn.microsoft.com/en-us/azure/mysql/flexible-server/quickstart-create-server-cli
[azure-db-create-portal]: https://learn.microsoft.com/en-us/azure/mysql/flexible-server/quickstart-create-server-portal
[azure-db-config]: https://docs.microsoft.com/en-us/azure/mysql/connect-java#prepare-a-configuration-file-to-connect-to-azure-database-for-mysql
[azure-dns]: https://docs.microsoft.com/en-us/azure/dns/dns-overview
[azure-linux-vm-cli]: https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-cli#create-the-virtual-machine
[azure-linux-vm-portal]: https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu
[azure-rg-cli]: https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-cli#create-a-resource-group
[azure-rg-portal]: https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal
[azure-sendmail]: https://docs.microsoft.com/en-us/azure/virtual-network/troubleshoot-outbound-smtp-connectivity#recommended-method-of-sending-email 
[azure-storage-portal]: https://learn.microsoft.com/en-ca/azure/storage/common/storage-account-create?tabs=azure-portal#create-a-storage-account-1
[azure-storage-cli]: https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create
[msft-365]: https://docs.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365
[sendgrid]: https://docs.sendgrid.com/for-developers/partners/microsoft-azure-2021 
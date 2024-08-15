---
title: "GCP prerequisites"
description: Prerequisites for GCP deployments
date: "12 Apr 2023"
tags: [gcp, prerequisites, configuration]
---

This page describes the infrastructure and other prerequisites for deploying Tower on Google Cloud Platform (GCP).

## Tower container images

Nextflow Tower is distributed as a collection of Docker containers available through the Seqera Labs
container registry [`cr.seqera.io`](https://cr.seqera.io). Contact [support](https://support.seqera.io) to get your container access credentials. Once you have received your credentials, log in to the registry using these steps:

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
The Seqera Labs container registry `cr.seqera.io` is the default Tower container image registry from version 22.4. Use of the AWS, Azure, and Google Cloud Tower image registries in existing installations is still supported but will be deprecated for **new installations** starting June 2023. See [here](../advanced-topics/seqera-container-images.mdx) for steps to use the Seqera Labs private GCP Artifact Registry.
:::

## Mandatory prerequisites

### SMTP server

If you do not have an email server, Google Cloud provides several ways to [send emails](https://cloud.google.com/compute/docs/tutorials/sending-mail):

- Google Workspace:

  - [WorkSpace SMTP Relay](https://support.google.com/a/answer/2956491?hl=en)

- Third-party services from the Google Cloud marketplace, including:

  - [SendGrid](https://cloud.google.com/compute/docs/tutorials/sending-mail/using-sendgrid)
  - [Mailgun](https://cloud.google.com/compute/docs/tutorials/sending-mail/using-mailgun)
  - [Mailjet](https://cloud.google.com/compute/docs/tutorials/sending-mail/using-mailjet)

Work with your IT team to select the best solution for your organization.

### MySQL database

An external database (i.e. external to your Docker Compose or Kubernetes deployment) is _highly_ recommended for production deployments. If you don't have your own database service, you can use [Google CloudSQL](https://cloud.google.com/sql/docs/mysql/quickstart).

If you decide to use an external database, you must create a MySQL user and database manually. See [Configuration](../configuration/database_and_redis.mdx) for more details.

### VM instance (Docker Compose)

A [Google Compute Engine (GCE)](https://cloud.google.com/compute) instance is required to deploy Tower via Docker Compose. See the [detailed instructions](#detailed-instructions) to provision a VM instance for this purpose.

### GKE cluster (Kubernetes)

A [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) cluster is required to deploy Tower via Kubernetes. See the [GKE documentation](https://cloud.google.com/kubernetes-engine/docs) to provision your own cluster.

:::note
GKE Autopilot is not currently supported by Tower due to a privilege issue with the Redis deployment. However, you can achieve most of the same behavior with a Standard cluster by enabling autoscaling and node auto-provisioning.
:::

## Optional prerequisites

### SSL certificate

An SSL certificate is required for your Tower instance to handle HTTPS traffic.

:::caution
From Tower 22.1.1, HTTP-only implementations **must** set the `TOWER_ENABLE_UNSAFE_MODE=true` environment variable in the Tower hosting infrastructure to enable user login.
:::

### Public IP address

A public IP address can be reserved for the Tower ingress to keep the IP address constant across restarts. If you do not reserve an IP address, the ingress will create one for you automatically, but it will be different every time you deploy the ingress. See the [detailed instructions](#detailed-instructions) to reserve a public IP address.

1. Browse to **VPC network** → **External IP addresses** and select **Reserve Static Address**

2. Assign a name (e.g., `tower-ip`). This name will be used later to configure the ingress.

3. Select the region where your GKE cluster is deployed.

4. Select **Reserve**.

## Detailed instructions

This section provides step-by-step instructions for some commonly used GCP services for Tower deployment. See the [GCP documentation](https://cloud.google.com/docs) for up-to-date instructions and contact [GCP support](https://cloud.google.com/support-hub) if you have any issues with provisioning GCP resources.

### Google CloudSQL

1. Browse to **Cloud SQL** and select **Create Instance**.

2. Select **MySQL** (you may need to enable the API).

3. Change to **Single zone** availability, unless there is a need for high availability.

4. Update the **Region** and **Zone** to match the location of your Tower deployment.

5. Expand **Show configuration options** and update the **Machine type** and **Storage** settings. The recommended machine type and disk size depends on the number of parallel pipelines you expect to run. In this guide, we use the **Standard** machine type with **1 vCPU**, and **20 GB SSD** storage.

6. Expand **Connections**, disable **Public IP**, and enable **Private IP**.

7. Select the **Network** (usually **default**). You may need to set up a **Private services access connection** for this VPC if you have not done so already. Enable the API and select **Use an automatically allocated IP range**. Select **Continue**, then **Create Connection**.

8. Select **Create Instance**.

9. Once the database has been created, select the instance, then **Databases**. Create a new database named **tower**.

10. Note the Private IP address of the instance as it must be supplied to the `TOWER_DB_URL` environment variable.

### Google Compute Engine

1. From the Navigation menu of the Google Cloud console, select **Compute Engine** to create a new VM instance. Select the machine name, region/zone, and machine type. In this example we have used an `e2-standard-2` instance (2 vCPUs, 8 GB memory). We recommend using the [container-optimized OS](https://cloud.google.com/community/tutorials/docker-compose-on-container-optimized-os) for the VM.

2. Enable HTTP traffic. By default, the frontend is exposed to port 8000, so you will need to add a firewall rule to the underlying VPC network to allow port 8000 (after VM creation).

3. Connect to the machine using SSH. If you run into issues with SSH, or would like to set up IAP SSH, refer to the documentation for [TCP forward to IAP](https://cloud.google.com/iap/docs/using-tcp-forwarding).

4. Install [Docker](https://docs.docker.com/engine/install/debian/) if it is not already installed.

5. Test Docker by running the [Docker Compose](https://hub.docker.com/r/docker/compose/tags/) image. If Docker does not have sufficient permissions, use [these steps](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user) to run it without root, or use `sudo`.

   ```bash
   # test docker compose
   docker run docker/compose:1.24.0 version

   # check that docker/compose image was pulled
   docker images
   ```

6. Create an alias for `docker-compose`:

   ```bash
   echo alias docker-compose="'"'docker run --rm \
       -v /var/run/docker.sock:/var/run/docker.sock \
       -v "$PWD:$PWD" \
       -w="$PWD" \
       docker/compose:1.24.0'"'" >> ~/.bashrc

   source .bashrc
   ```

7. Configure `gcloud` and Docker as described in [Tower container images](#tower-container-images).

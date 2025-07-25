---
title: "On-prem"
description: Prerequisites for on-premises deployments
date: "12 Apr 2023"
tags: [on-prem, prerequisites, configuration]
---

This page details the prerequisites for deploying Seqera Platform Enterprise to your on-premises infrastructure.

See [Docker Compose](../docker-compose) for instructions to deploy via Docker Compose.

See [Kubernetes](../kubernetes) for instructions to deploy via Kubernetes.

## Prerequisites

You must satisfy the requirements for your installation:

- **SMTP server**: An SMTP server is required to send emails from your Seqera instance.

  If you don't have your own mail server, you can use an external service from a cloud provider. Visit the provider's corresponding **Prerequisites** page for more information and consult your IT team to select the most suitable solution for your organization.

- **MySQL database**: A database external to your Docker Compose or Kubernetes environment is highly recommended for production deployments. 

  If you don't have your own database service, use an external service from a cloud provider. Visit the provider's corresponding **Prerequisites** page for more information and consult your IT team to select the most suitable solution for your organization.

  To use an external database, you must create a MySQL user and database manually. See [Configuration](../configuration/overview#seqera-and-redis-databases) for more details.

- **(Optional) SSL certificate**: An SSL certificate is required for your Seqera instance to handle HTTPS traffic.

:::caution
HTTP-only implementations **must** set the `TOWER_ENABLE_UNSAFE_MODE=true` environment variable in the Seqera hosting infrastructure to enable user login. HTTP must not be used in production environments.
:::

## Seqera container images

Seqera Platform Enterprise is distributed as a collection of Docker containers available through the Seqera
container registry [`cr.seqera.io`](https://cr.seqera.io). Contact [support](https://support.seqera.io) to get your container access credentials. Once you've received your credentials, retrieve the Seqera container images:

1. Retrieve the **username** and **password** you received from Seqera support.

2. Authenticate to the registry:

   ```bash
   docker login -u '/\<USERNAME\>/' -p '/\PASSWORD\>/' cr.seqera.io
   ```

3. Pull the Seqera container images:

   ```bash
   docker pull cr.seqera.io/private/nf-tower-enterprise/backend:v24.1.8

   docker pull cr.seqera.io/private/nf-tower-enterprise/frontend:v24.1.8
   ```

## Next steps

See [Configuration](../configuration/overview).
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

- **Redis cache**: A Redis-compatible cache external to your Docker Compose or Kubernetes environment is highly recommended for production deployments.

  If you don't have your own Redis service, use an external service from a cloud provider. Visit the provider's corresponding **Prerequisites** page for more information and consult your IT team to select the most suitable solution for your organization.

  See [Configuration](../configuration/overview#seqera-and-redis-databases) for more details.

- **(Optional) SSL certificate**: An SSL certificate is required for your Seqera instance to handle HTTPS traffic.

:::caution
HTTP-only implementations **must** set the `TOWER_ENABLE_UNSAFE_MODE=true` environment variable in the Seqera hosting infrastructure to enable user login. HTTP must not be used in production environments.
:::

## Seqera container images

Seqera Enterprise is distributed as a collection of container images available through the Seqera container registry [`cr.seqera.io`](https://cr.seqera.io). Refer to the instructions in the [Common prerequisites](./common.md#vendoring-seqera-container-images-to-your-own-registry) page to replicate the required images to your internal container registry for High Availability or for air-gapped environments.

## Next steps

See [Configuration](../configuration/overview.mdx).

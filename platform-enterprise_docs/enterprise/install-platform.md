---
title: "Platform"
description: Install Seqera Platform Enterprise
date: "12 Apr 2023"
tags: [installation, deployment]
---

Seqera Platform Enterprise can be deployed using Docker Compose, Kubernetes, or Helm.

## Deployment options

| Method | Use case |
| :----- | :------- |
| [Docker Compose](./docker-compose) | Evaluation, development, small production workloads |
| [Kubernetes](./kubernetes) | Production workloads requiring high availability |
| [Helm](./helm) | Kubernetes deployments using Helm charts |

## Prerequisites

Before you begin, you need:
- A MySQL 8.0 database
- A Redis 7 instance

:::note
MySQL 8.0 is the only supported database version from Seqera Enterprise version 23.4 onwards. MySQL 5.6 and 5.7 are not supported.
:::

See each deployment guide for detailed requirements.

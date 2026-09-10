---
title: "Platform"
description: Install Seqera Platform Enterprise
date created: "2023-04-12"
last updated: "2026-09-02"
tags: [installation, deployment]
---

Seqera Platform Enterprise can be deployed using Docker Compose, Kubernetes, or Helm.

## Deployment options

| Method | Use case |
| :----- | :------- |
| [Helm](./platform-helm) | Kubernetes deployments using Helm charts |
| [Kubernetes](./platform-kubernetes) | Production workloads requiring high availability |
| [Docker Compose](./platform-docker-compose) | Evaluation, development, small production workloads |

See each deployment guide for detailed requirements.

## Prerequisites

:::info
Before you begin, you need:

- A MySQL 8.4 (LTS) database. MySQL 5.7 and 8.0 have reached upstream end-of-life and are no longer tested or supported.
- A Redis 7.2 or 7.4 instance, or Valkey 7.x (from Platform 26.1).

:::

:::note
See each deployment guide for full version requirements and supported managed-service options for MySQL and Redis/Valkey.
:::

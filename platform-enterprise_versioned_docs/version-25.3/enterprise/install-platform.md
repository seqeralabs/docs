---
title: "Platform"
description: Install Seqera Platform Enterprise
date created: "2023-04-12"
last updated: "2026-01-30"
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
- A MySQL 8 database
- A Redis 7 instance

Supported production Redis options include a self-managed Redis 7 deployment or one of the managed Redis services documented in the platform deployment guides: Amazon ElastiCache, Azure Cache for Redis, or Google Memorystore. If you plan to use another Redis-compatible service, confirm support with Seqera before deploying to production.

:::note
MySQL 8 is the only supported database version from Seqera Enterprise version 23.4 onwards. MySQL 5.6 and 5.7 are not supported.
:::

See each deployment guide for detailed requirements.

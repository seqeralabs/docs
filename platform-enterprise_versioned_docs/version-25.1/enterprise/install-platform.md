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
| [Docker Compose](./platform-docker-compose) | Evaluation, development, small production workloads |
| [Kubernetes](./platform-kubernetes) | Production workloads requiring high availability |
| [Helm](./platform-helm) | Kubernetes deployments using Helm charts |

## Prerequisites

Before you begin, you need:
- A MySQL 8 database. MySQL v5.x is not supported.
- A Redis 7 instance

See each deployment guide for detailed requirements.

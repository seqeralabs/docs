---
title: "Pipeline optimization"
description: Install pipeline resource optimization for Seqera Platform Enterprise
date: "12 Apr 2023"
tags: [groundswell, pipeline, optimization, installation, deployment]
---

Pipeline resource optimization (Groundswell) uses resource usage data from previous workflow runs to optimize subsequent runs. Deploy after your Platform installation is complete.

## Deployment options

| Method | Guide |
| :----- | :---- |
| Helm | [Pipeline optimization: Helm](./groundswell-helm) |
| Kubernetes | [Pipeline optimization: Kubernetes](./groundswell-kubernetes) |
| Docker Compose | [Pipeline optimization: Docker Compose](./groundswell-docker-compose) |

See each deployment guide for detailed requirements.

## Prerequisites

Before you begin, you need:
- A running Seqera Platform Enterprise deployment
- A MySQL 8 database separate from the one used by Seqera Platform
- Access to the Seqera Enterprise MySQL database (Pipeline Optimization requires direct access to the Seqera database to read workflow execution data)
  * Read-only access is sufficient

## Configuration

See [Pipeline optimization](./configuration/pipeline_optimization) for additional configuration options.

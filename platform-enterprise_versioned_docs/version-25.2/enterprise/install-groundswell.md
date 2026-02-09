---
title: "Pipeline optimization"
description: Install pipeline optimization for Seqera Platform Enterprise
date: "12 Apr 2023"
tags: [groundswell, pipeline, optimization, installation, deployment]
---

Pipeline optimization (Groundswell) uses resource usage data from previous workflow runs to optimize subsequent runs. Deploy after your Platform installation is complete.

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
  * For example, to create a new database schema `pipeline_optimization` and user called `pipeline_optimization_admin`, you can run the following SQL commands:

    ```sql
    CREATE DATABASE IF NOT EXISTS `pipeline_optimization`;
    CREATE USER 'pipeline_optimization_admin'@'%' IDENTIFIED BY 'set_a_secure_password_here';
    GRANT ALL PRIVILEGES ON `pipeline_optimization`.* TO 'pipeline_optimization_admin'@'%';
    FLUSH PRIVILEGES;
    ```

- Access to the Seqera Enterprise MySQL database (Pipeline Optimization requires direct access to the Seqera database to read workflow execution data)
  * Read-only access is sufficient
  * For example, to create a read-only user called `pipeline_optimization_ro` and let it access your Seqera Enterprise database called `seqera_enterprise`, you can run the following SQL commands:

    ```sql
    CREATE USER 'pipeline_optimization_ro'@'%' IDENTIFIED BY 'set_a_secure_password_here';
    GRANT SELECT ON `seqera_enterprise`.* TO 'pipeline_optimization_ro'@'%';
    FLUSH PRIVILEGES;
    ```

## Configuration

See [Pipeline optimization](./configuration/pipeline_optimization) for additional configuration options.

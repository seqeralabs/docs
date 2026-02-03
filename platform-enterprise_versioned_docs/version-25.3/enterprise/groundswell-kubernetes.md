---
title: "Pipeline optimization: Kubernetes"
description: Deploy pipeline resource optimization on Kubernetes
date: "12 Apr 2023"
tags: [kubernetes, groundswell, deployment]
---

This guide describes how to deploy the pipeline resource optimization service (Groundswell) for Seqera Platform Enterprise on Kubernetes.

## Prerequisites

Other than the basic requirements [already listed in the Pipeline Optimization installation overview](./install-groundswell#prerequisites), you will need:
- A Kubernetes cluster
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally

## Procedure

1. Download the [groundswell manifest](./_templates/k8s/groundswell.yml).

2. Set `TOWER_ENABLE_GROUNDSWELL=true` in your `configmap.yml`.

    To use a custom URL, set `GROUNDSWELL_SERVER_URL` instead.

3. Create the Groundswell database schema:

    ```sql
    CREATE DATABASE IF NOT EXISTS `swell`;
    CREATE USER 'swell'@'%' IDENTIFIED BY 'swell';
    GRANT ALL PRIVILEGES ON *.* TO 'swell'@'%';
    FLUSH PRIVILEGES;
    ```

    For managed database services (RDS, Cloud SQL, etc.):

    ```sql
    CREATE DATABASE IF NOT EXISTS `swell`;
    CREATE USER 'swell'@'%' IDENTIFIED BY 'swell';
    GRANT ALL PRIVILEGES ON `%`.* TO 'swell'@'%';
    FLUSH PRIVILEGES;
    ```

4. Update the Groundswell ConfigMap (`tower-groundswell-cfg`) with your database credentials.

5. Apply the manifests:

    ```bash
    kubectl apply -f configmap.yml
    kubectl apply -f groundswell.yml
    ```

6. Restart the backend:

    ```bash
    kubectl rollout restart deployment/backend
    ```

The initContainers process waits for both databases to be ready before starting the migration and optimization service.

## Verify

When pipeline optimization is active, pipelines with at least one successful run display a lightbulb icon in the Launchpad.

## Configuration

See [Pipeline resource optimization](./configuration/pipeline_optimization) for additional configuration options.

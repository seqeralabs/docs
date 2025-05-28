---
title: "Pipeline resource optimization"
description: "Configure pipeline resource optimization in your Seqera Enterprise deployment."
date: "12 Feb 2024"
tags: [compute, resource, optimization, configuration]
---

[Pipeline resource optimization](../../pipeline-optimization/overview) takes the resource usage information from previous workflow runs to optimize subsequent runs.

The pipeline resource optimization service requires a separate database schema to store its internal data, but also requires access to the Seqera schema. The Seqera and optimization service schemas can coexist on the same database instance.

## Docker Compose deployment

Docker Compose makes use of a separate container to set up the pipeline resource optimization service during initialization. Configuration steps differ for new and existing deployments.

### New installation

To use the pipeline resource optimization service in a new Docker Compose installation of Seqera Enterprise, use the following steps:

1. To run the service from a custom URL, declare the URL with the `GROUNDSWELL_SERVER_URL` environment variable in `tower.env`. A non-zero value for this environment variable activates the optimization service automatically, so `TOWER_ENABLE_GROUNDSWELL` does not need to be set when you declare a custom URL.

2. Set the `TOWER_ENABLE_GROUNDSWELL` environment variable in `tower.env` to `true`. This enables the service at the default service URL `http://groundswell:8090`.

3. In your [docker-compose.yml](../_templates/docker/docker-compose.yml) file, uncomment the `groundswell` section at the bottom.

   - To create a schema for the optimization service on the same local MySQL container, uncomment the `init.sql` script in the `volumes` section.

4. Download the [init.sql](../_templates/docker/init.sql) file. Store this file in the mount path of your `docker-compose.yml` file, else update the `source: ./init.sql` line in your `docker-compose.yml` with the file path.

5. When the pipeline resource optimization service is active, pipelines that can be optimized display a lightbulb icon in your Launchpad. Any pipeline with at least one successful run can be optimized.

### Existing installation

To use the pipeline resource optimization service in an existing Docker Compose installation of Seqera Enterprise, use the following steps:

1. To run the service from a custom URL, declare the URL with the `GROUNDSWELL_SERVER_URL` environment variable. A non-zero value for this environment variable activates the optimization service automatically, so `TOWER_ENABLE_GROUNDSWELL` does not need to be set when you declare a custom URL.

2. Set the `TOWER_ENABLE_GROUNDSWELL` environment variable to `true`. This enables the service at the default service URL `http://groundswell:8090`.

3. In your [docker-compose.yml](../_templates/docker/docker-compose.yml) file, uncomment the `groundswell` section at the bottom. If you use a `docker-compose.yml` file older than version 23.3, download a newer version of the file to extract the `groundswell` section.

4. Log in to your database server and run the following commands:

   ```sql
   CREATE DATABASE IF NOT EXISTS `swell`;
   CREATE USER 'swell'@'%' IDENTIFIED BY 'swell';
   GRANT ALL PRIVILEGES ON *.* TO 'swell'@'%';
   FLUSH PRIVILEGES;
   ```

5. If you use Amazon RDS or other managed database services, run the following commands in your database instance:

   ```sql
   CREATE DATABASE IF NOT EXISTS `swell`;
   CREATE USER 'swell'@'%' IDENTIFIED BY 'swell';
   GRANT ALL PRIVILEGES ON `%`.* TO 'swell'@'%';
   FLUSH PRIVILEGES;
   ```

6. Download the [groundswell.env](../_templates/docker/groundswell.env) file. Store this file in the mount path of your `docker-compose.yml` file. Update the `TOWER_DB_URL` and `SWELL_DB_URL` values:

   ```env
   # Uncomment for container DB instances
   # TOWER_DB_URL=mysql://db:3306/tower
   # SWELL_DB_URL=mysql://db:3306/swell

   # Uncomment for managed DB instances (Example URL shows an Amazon RDS instance URL)
   # TOWER_DB_URL=mysql://db1.abcdefghijkl.us-east-1.rds.amazonaws.com:3306/tower
   # SWELL_DB_URL=mysql://db1.abcdefghijkl.us-east-1.rds.amazonaws.com:3306/swell
   ```

7. When the pipeline resource optimization service is active, pipelines that can be optimized display a lightbulb icon in your Launchpad. Any pipeline with at least one successful run can be optimized.

## Kubernetes deployment

Kubernetes deployments use an [initContainer](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) that runs during pod initialization to set up the pipeline resource optimization service. To use the service in new or existing Kubernetes installations of Seqera Enterprise, do the following:

1. Download the [groundswell manifest](../_templates/k8s/groundswell.yml):

   ```yaml file=../_templates/k8s/groundswell.yml

   ```

1. To run the service from a custom URL, declare the URL with the `GROUNDSWELL_SERVER_URL` environment variable in the `configmap.yml` file that you downloaded for your [Platform installation][platform-k8s]. A non-zero value for this environment variable activates the optimization service automatically, so `TOWER_ENABLE_GROUNDSWELL` does not need to be set when you declare a custom URL.

1. Define a set of credentials for the optimization database. This can be the same database used for Seqera, but in a different schema.

1. Log in to your database server and run the following commands:

   - If you use Amazon RDS or other managed database services, run the following commands in your database instance:

     ```sql
     CREATE DATABASE IF NOT EXISTS `swell`;
     CREATE USER 'swell'@'%' IDENTIFIED BY 'swell';
     GRANT ALL PRIVILEGES ON `%`.* TO 'swell'@'%';
     FLUSH PRIVILEGES;
     ```

   - If you do not use a managed database service, run the following commands in your database instance:

     ```sql
     CREATE DATABASE IF NOT EXISTS `swell`;
     CREATE USER 'swell'@'%' IDENTIFIED BY 'swell';
     GRANT ALL PRIVILEGES ON *.* TO 'swell'@'%';
     FLUSH PRIVILEGES;
     ```

The initContainers process will wait until both the Seqera and pipeline resource optimization service databases are ready before starting the migration in the Seqera database and finally starting the optimization container.

When the pipeline resource optimization service is active, pipelines that can be optimized display a lightbulb icon in your Launchpad. Any pipeline with at least one successful run can be optimized.

[platform-k8s]: ../kubernetes

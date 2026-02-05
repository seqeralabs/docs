---
title: "Pipeline optimization: Docker Compose"
description: Deploy pipeline optimization with Docker Compose
date: "12 Apr 2023"
tags: [docker, compose, groundswell, pipeline optimization, deployment]
---

This guide describes how to deploy the pipeline optimization service (internally referred to as Groundswell) for Seqera Platform Enterprise with Docker Compose.

## Prerequisites

Before you begin, you need:
- A running Seqera Platform Enterprise Docker Compose deployment
- Access to your MySQL database

## New installation

1. Set the `TOWER_ENABLE_GROUNDSWELL` environment variable in `tower.env` to `true`. This enables the service at the default URL `http://groundswell:8090`.

    To use a custom URL, set `GROUNDSWELL_SERVER_URL` instead.

2. In your [docker-compose.yml](./_templates/docker/docker-compose.yml) file, uncomment the `groundswell` section.

3. To create a schema on the local MySQL container, uncomment the `init.sql` script in the `volumes` section.

4. Download the [init.sql](./_templates/docker/init.sql) file and store it in the mount path of your `docker-compose.yml`.

5. Start your Platform instance:

    ```bash
    docker compose up -d
    ```

## Existing installation

1. Set the `TOWER_ENABLE_GROUNDSWELL` environment variable in `tower.env` to `true`.

    To use a custom URL, set `GROUNDSWELL_SERVER_URL` instead.

2. In your [docker-compose.yml](./_templates/docker/docker-compose.yml) file, uncomment the `groundswell` section.

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

4. Download the [groundswell.env](./_templates/docker/groundswell.env) file and update the database URLs:

    ```env
    TOWER_DB_URL=mysql://db:3306/tower
    SWELL_DB_URL=mysql://db:3306/swell
    ```

5. Restart your Platform instance:

    ```bash
    docker compose up -d
    ```

## Verify

When pipeline optimization is active, pipelines with at least one successful run display a lightbulb icon in the Launchpad.

## Configuration

See [Pipeline optimization](./configuration/pipeline_optimization) for additional configuration options.

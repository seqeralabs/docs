---
title: "Upgrade deployment"
description: "Guidance for upgrading to Platform Enterprise version 25.2"
date: "21 Aug 2024"
tags: [enterprise, update, install]
---

This page outlines the steps to upgrade your database instance and Platform Enterprise installation to version 25.2, including special considerations for upgrading from versions prior to 25.1. 

### Considerations for versions prior to 24.1

- If you are upgrading from a version older than 23.4.1, update your installation to [version 23.4.4](../../version-23.4/enterprise/overview.md) **first**, before updating to version 25.2 with the steps on this page. 

### Considersations for versions 24.1 - 25.1

- **OIDC Secrets injection modifications**

  The `auth-oidc-secrets` Micronaut environment has been replaced with `oidc-token-import`. If you use this configuration, you must change the `MICRONAUT_ENV` environment variable in the manifest during the migration process. If you activate the feature with the `TOWER_OIDC_TOKEN_IMPORT` environment variable, no changes are needed.

- **MariaDB driver: New MySQL connection parameter required**

  MariaDB driver 3.x requires the `permitMysqlScheme=true` parameter in the connection URL to connect to a MySQL database:

  `jdbc:mysql://<domain>:<port>/tower?permitMysqlScheme=true`

  All deployments using a MySQL database (regardless of version) must be updated when upgrading to Platform version 24.1 or later.

- **Redis version change and property deprecation**

  - From Seqera Enterprise version 24.2, Redis version 6.2 or greater is required, and the stable and generally available version 7.4.5 is strongly recommended.
  - From Seqera Enterprise version 24.2, `redisson.*` configuration properties are deprecated. If you have set `redisson.*` properties directly previously, do the following:
    •	Replace `/redisson/*` references in AWS Parameter Store entries with TOWER_REDIS_*.
    •	Replace `redisson.*` references in tower.yml with `TOWER_REDIS_*`.
    :::note
    Set TOWER_REDIS_* values directly in the tower.yml or AWS Parameter Store entry (for example, TOWER_REDIS_URL: redis://...).
    :::

- **Micronaut property key changes**

  In version 24.1, the property that determines the expiration time of the JWT access token (used for authenticating web sessions and Nextflow-Platform interactions) has changed:

  | Previous                                                         | New                                                          |
  | ---------------------------------------------------------------- | ------------------------------------------------------------ |
  | `micronaut.security.token.jwt.generator.access-token.expiration` | `micronaut.security.token.generator.access-token.expiration` |
    
  Enterprise deployments that have customized this value previously will need to adopt the new format.

### Version 25.2 upgrade considerations 

**Secret key rotation requires backup and careful configuration**

To configure [secret key rotation](../enterprise/configuration/overview.mdx#secret-key-rotation):
- To prevent data loss, perform a backup of your Platform database and securely back up your current crypto secret key before enabling and performing key rotation.
- All backend pods or containers for your Enterprise deployment must contain the same previous and new secret key values in their configuration.
- All backend pods or containers must be in a ready/running state before starting the Platform cron service. 

### General upgrade steps 

:::caution
The database volume is persistent on the local machine by default if you use the `volumes` key in the `db` or `redis` section of your `docker-compose.yml` file to specify a local path to the DB or Redis instance. If your database is not persistent, you must back up your database before performing any application or database upgrades.
:::

1. Make a backup of the Seqera database. If you use the pipeline optimization service and your `groundswell` database resides in a database instance separate from your Seqera database, make a backup of your `groundswell` database as well.
1. Download the latest versions of your deployment templates and update your Seqera container versions:
    - [docker-compose.yml](./_templates/docker/docker-compose.yml) for Docker Compose deployments
    - [tower-cron.yml](./_templates/k8s/tower-cron.yml) and [tower-svc.yml](./_templates/k8s/tower-svc.yml) for Kubernetes deployments
1. Restart the application.
1. If you're using a containerized database as part of your implementation:
    1. Stop the application.
    1. Upgrade the MySQL image.
    1. Restart the application.
1. If you're using Amazon RDS or other managed database services:
    1. Stop the application.
    1. Upgrade your database instance.
    1. Restart the application.
1. If you're using the pipeline optimization service (`groundswell` database) in a database separate from your Seqera database, update the MySQL image for your `groundswell` database instance while the application is down (during step 4 or 5 above). If you're using the same database instance for both, the `groundswell` update will happen automatically during the Seqera database update.

### Custom deployments

- Run the `/migrate-db.sh` script provided in the `migrate-db` container. This will migrate the database schema.
- Deploy Seqera following your usual procedures.

### Nextflow launcher image

If you must host your nf-launcher container image on a private image registry, copy the [nf-launcher image](https://quay.io/seqeralabs/nf-launcher:j17-24.04.4) to your private registry. Then update your `tower.env` with the launch container environment variable:

    `TOWER_LAUNCH_CONTAINER=<FULL_PATH_TO_YOUR_PRIVATE_IMAGE>`

:::caution
If you're using AWS Batch, you will need to [configure a custom job definition](./advanced-topics/custom-launch-container) and populate the `TOWER_LAUNCH_CONTAINER` with the job definition name instead.
:::

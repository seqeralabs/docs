---
title: "Upgrade deployment"
description: "Guidance for upgrading to Platform Enterprise version 26.1"
date created: "2025-11-11"
last updated: "2026-05-06"
tags: [enterprise, update, install]
---

This page outlines the steps to upgrade your database instance and Platform Enterprise installation to version 26.1, including special considerations for upgrading from earlier versions.

:::note
- Make a backup of your Platform database prior to upgrade.
- If you are upgrading from a version prior to 25.1, complete all intermediate major version upgrades before upgrading to 26.1, for example from 23.1 upgrade to 24.1, then 25.1, and finally 26.1. More specific requirements are detailed below for each major version.
- Ensure that no pipelines are in a running state during this upgrade as active run data may be lost.
:::

## Considerations for versions prior to 24.1

- If you are upgrading from a version older than 23.4.1, update your installation to version 23.4.4 **first**, before updating to version 26.1 with the steps on this page.
- **MySQL 8 required**

  From Seqera Enterprise version 23.4, MySQL 8 was the only supported database version. If you are running MySQL 5.6 or 5.7, you must upgrade your database to a supported MySQL version (see the [26.1 database considerations below](#database-changes) for the new baseline) before upgrading.

## Considerations for versions 24.1 – 25.1

- **OIDC Secrets injection modifications**

  The `auth-oidc-secrets` Micronaut environment has been replaced with `oidc-token-import`. If you use this configuration, you must change the `MICRONAUT_ENV` environment variable in the manifest during the migration process. If you activate the feature with the `TOWER_OIDC_TOKEN_IMPORT` environment variable, no changes are needed.

- **MariaDB driver: New MySQL connection parameter required**

  MariaDB driver 3.x requires the `permitMysqlScheme=true` parameter in the connection URL to connect to a MySQL database:

  `jdbc:mysql://<domain>:<port>/tower?permitMysqlScheme=true`

  All deployments using a MySQL database (regardless of version) must be updated when upgrading to Platform version 24.1 or later.

- **Redis version change and property deprecation**

  - From Seqera Enterprise version 24.2, Redis version 6.2 or greater was required. **In 26.1, Redis 6.x is no longer supported — see the [26.1 cache considerations](#cache-layer-changes-redis-eol-and-valkey-support) below.**
  - From Seqera Enterprise version 24.2, `redisson.*` configuration properties are deprecated. If you previously set `redisson.*` properties directly:
    - Replace `/redisson/*` references in AWS Parameter Store entries with `TOWER_REDIS_*` environment variables.
    - Replace `redisson.*` references in `tower.yml` with `TOWER_REDIS_*` environment variables.

  :::note
  Set `TOWER_REDIS_*` values directly in the `tower.yml` or AWS Parameter Store entry (for example, `TOWER_REDIS_URL: redis://...`).
  :::

- **Micronaut property key changes**

  In version 24.1, the property that determines the expiration time of the JWT access token (used for authenticating web sessions and Nextflow-Platform interactions) changed:

  | Previous | New |
  | --- | --- |
  | `micronaut.security.token.jwt.generator.access-token.expiration` | `micronaut.security.token.generator.access-token.expiration` |

  Enterprise deployments that have customized this value previously will need to adopt the new format.

## Considerations for version 25.3

- **Secret key rotation requires backup and careful configuration**

  To configure [secret key rotation](https://docs.seqera.io/platform-enterprise/enterprise/configuration/overview#secret-key-rotation):

  - To prevent data loss, perform a backup of your Platform database and securely back up your current crypto secret key before enabling and performing key rotation.
  - All backend pods or containers for your Enterprise deployment must contain the same previous and new secret key values in their configuration.
  - All backend pods or containers must be in a ready/running state before starting the Platform cron service.

## Version 26.1 upgrade considerations

### Database changes

26.1 changes the supported database baseline. Review your current database against the table below **before upgrading**.

| Database / version | 26.1 status | Action |
| --- | --- | --- |
| MySQL 5.7 | No longer tested or supported (upstream EoL) | Upgrade to MySQL 8.4 before upgrading to 26.1 |
| MySQL 8.0 | No longer tested or supported (upstream EoL April 2026) | Upgrade to MySQL 8.4 |
| MySQL 8.4 (LTS) | Recommended default | No action |
| MariaDB | No longer tested or supported | Contact Seqera Professional Services for migration support |
| AWS Aurora MySQL (provisioned) | Supported | No action |
| AWS Aurora Serverless | Not supported (existing guidance) | Migrate to a supported configuration |

If you are running on MySQL 5.7, MySQL 8.0, or MariaDB, complete your database migration **before** running the 26.1 application upgrade. The Seqera-supplied `migrate-db` container will not run against an unsupported database version.

### Cache layer changes: Redis EoL and Valkey support

26.1 introduces Valkey support and tightens Redis version requirements.

| Cache / version | 26.1 status | Action |
| --- | --- | --- |
| Redis 6.x | EoL upstream — no longer supported | Upgrade to Redis 7.2+ or migrate to Valkey 7+ |
| Redis 7.2 | Supported | No action |
| Redis 8.x | Supported | No action |
| Redis 9.x | Not supported | Do not upgrade Redis to version 9 |
| Valkey 7.x | Newly supported in 26.1 | Optional migration path from Redis |
| Valkey 8.x | Supported | Optional migration path from Redis |

#### Migrating from Redis to Valkey

To migrate from Redis to Valkey, update the `TOWER_REDIS_URL` connection scheme to use `valkey://` (or `valkeyss://` for TLS). The Redisson client embedded in Platform 26.1 has been upgraded to support Valkey 7 and 8 dial schemes; no further configuration is required.

:::note
Redis password and ACL configuration carry over unchanged when migrating to Valkey.
:::

### Frontend image — root user deprecation

The frontend image running as root user is removed in 26.1. The unprivileged ("rootless") image is now the only supported frontend image. If you have not already migrated, update your `tower-svc.yml` (Kubernetes) or `docker-compose.yml` (Docker Compose) to reference the unprivileged image when downloading the new templates in the General upgrade steps below.

See the [unprivileged frontend image documentation](https://docs.seqera.io/platform-enterprise/enterprise/platform-kubernetes#seqera-frontend-unprivileged) for security context, file system, and port differences.

### Studios — enabled on all workspaces by default

In 26.1, Studios is enabled on every workspace in your instance by default. This is a behavior change from earlier versions where Studios required explicit per-workspace enablement.

The [`TOWER_DATA_STUDIO_ALLOWED_WORKSPACES`](./configuration/overview#data-features) environment variable controls Studios availability:

| Value | Behaviour |
| --- | --- |
| Unset (default) | Studios enabled on **all workspaces** |
| `""` (empty string) | Studios disabled on all workspaces |
| Comma-separated workspace IDs | Studios enabled only on the listed workspaces |

To preserve previous opt-in behaviour after upgrading, set `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES=""` before the upgrade, or set it to a comma-separated list of workspace IDs to allow.

#### Studios container template version

The recommended Studios container template version for 26.1 is **0.9**. If you have customized your Studios container templates, update them to the 0.9 base images during this upgrade. Templates pinned to earlier Connect versions may no longer be supported. See the [Studios migration documentation](https://docs.seqera.io/platform-enterprise/studios/managing#migrate-a-studio-from-an-earlier-container-image-template).

### AWS data lineage tracking via SQS (preview, AWS only)

26.1 introduces a preview of AWS data lineage tracking that depends on an Amazon SQS queue. This feature is AWS-only and disabled by default. If you plan to enable it, ensure your IAM policies grant the Seqera role the relevant SQS permissions in addition to the existing [Seqera IAM permissions](../compute-envs/aws-batch#iam-user-creation).

### General upgrade steps

:::caution
The database volume is persistent on the local machine by default if you use the `volumes` key in the `db` or `redis` section of your `docker-compose.yml` file to specify a local path to the DB or Redis instance. If your database is not persistent, you must back up your database before performing any application or database upgrades.
:::

1. Make a backup of the Seqera database. If you use the pipeline optimization service and your `groundswell` database resides in a database instance separate from your Seqera database, make a backup of your `groundswell` database as well.
1. Download the latest versions of your deployment templates and update your Seqera container versions:
    - [docker-compose.yml](./_templates/docker/docker-compose.yml) for Docker Compose deployments
    - [tower-cron.yml](./_templates/k8s/tower-cron.yml) and [tower-svc.yml](./_templates/k8s/tower-svc.yml) for Kubernetes deployments
1. If you're using Studios, download and apply the latest versions of the Kubernetes manifests:
    - [proxy.yml](./_templates/k8s/data_studios/proxy.yml)
    - [server.yml](./_templates/k8s/data_studios/server.yml)

    :::warning
    If you have customized the default Studios container template images, you must ensure that you update to latest recommended versions. Templates using earlier versions of Connect (than defined in the latest `proxy.yml` and `server.yml`) may no longer be supported in your existing Studios environments. Refer to the [Studios migration documentation](../studios/managing#migrate-a-studio-from-an-earlier-container-image-template) for guidance on migrating to the most recent versions of Connect server and clients.
    :::

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

## Nextflow launcher image

If you host your nf-launcher container image on a private image registry, copy the [nf-launcher image](https://quay.io/seqeralabs/nf-launcher:j17-25.10.x) *(confirm exact tag at release cut)* to your private registry. Then update your `tower.env` with the launch container environment variable:

```
TOWER_LAUNCH_CONTAINER=<FULL_PATH_TO_YOUR_PRIVATE_IMAGE>
```

:::caution
If you're using AWS Batch, you will need to [configure a custom job definition](https://docs.seqera.io/platform-enterprise/enterprise/advanced-topics/custom-launch-container) and populate the `TOWER_LAUNCH_CONTAINER` with the job definition name instead.
:::

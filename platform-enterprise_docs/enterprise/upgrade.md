---
title: "Upgrade deployment"
description: "Upgrade Seqera Platform Enterprise and its database to version 26.2."
date created: "2025-11-11"
last updated: "2026-09-30"
tags: [enterprise, update, installation]
---

Upgrade your Seqera Platform Enterprise installation and database to version 26.2. The sections for earlier versions list the extra changes each upgrade path needs.

:::info[**Prerequisites**]

- Make a backup of your Platform database.
- Complete each intermediate major version upgrade if you're upgrading from a version earlier than 25.1. For example, upgrade from 24.1 to 25.1, then to 26.1, then to 26.2. The sections below list the requirements for each version.
- Make sure no pipelines are running during the upgrade. Data from active runs can be lost.
- Make sure no Studios are running. Active Studios with mounted data can be irreparably damaged.
:::

## Upgrade from versions earlier than 24.1

- If you're upgrading from a version earlier than 23.4.1, upgrade your installation to version 23.4.4 **first**, before you upgrade to version 26.2 with the steps on this page.
- **MySQL 8 required**

  From version 23.4, Seqera Enterprise supports only MySQL 8. If you run MySQL 5.6 or 5.7, upgrade your database to a supported MySQL version before you upgrade Seqera. See [Database changes](#database-changes) for the current baseline.

## Upgrade from versions 24.1–25.1

- **OIDC secrets injection changes**

  The `oidc-token-import` Micronaut environment replaces `auth-oidc-secrets`. If you use `auth-oidc-secrets`, change the `MICRONAUT_ENV` environment variable in your manifest during the upgrade. If you turn on the feature with the `TOWER_OIDC_TOKEN_IMPORT` environment variable, no change is needed.

- **MariaDB driver: new MySQL connection parameter required**

  MariaDB driver 3.x requires the `permitMysqlScheme=true` parameter in the connection URL to connect to a MySQL database:

  `jdbc:mysql://<domain>:<port>/tower?permitMysqlScheme=true`

  Update every deployment that uses a MySQL database, whatever the MySQL version, when you upgrade to version 24.1 or later.

- **Redis version change and property deprecation**

  - From version 24.2, Seqera Enterprise requires Redis 6.2 or later. **From 26.1, Redis 6.x is not supported. See [Cache layer changes](#cache-layer-changes-redis-eol-and-valkey-support).**
  - From version 24.2, the `redisson.*` configuration properties are deprecated. If you set `redisson.*` properties directly:
    - Replace `/redisson/*` references in AWS Parameter Store entries with `TOWER_REDIS_*` environment variables.
    - Replace `redisson.*` references in `tower.yml` with `TOWER_REDIS_*` environment variables.

- **Micronaut property key changes**

  In version 24.1, the property that sets the expiration time of the JWT access token changed. This token authenticates web sessions and the requests Nextflow sends to Seqera Platform.

  | Previous | New |
  | --- | --- |
  | `micronaut.security.token.jwt.generator.access-token.expiration` | `micronaut.security.token.generator.access-token.expiration` |

  If you customized this value, use the new property name.

## Upgrade from version 25.3.x to 26.1

You can upgrade directly from 25.3.x to 26.1. Review the following change, then follow the [general upgrade steps](#general-upgrade-steps).

- **Secret key rotation**

  To configure [secret key rotation](https://docs.seqera.io/platform-enterprise/enterprise/configuration/overview#secret-key-rotation):

  - Before you turn on key rotation, back up your Platform database and your current crypto secret key to prevent data loss.
  - Configure the same previous and new secret key values on every backend pod or container in your deployment.
  - Start the Platform cron service only after every backend pod or container is ready and running.

## Upgrade from version 26.1.x to 26.2

You can upgrade directly from 26.1.x to 26.2. Before you upgrade, review the breaking changes and default changes later on this page, then follow the [general upgrade steps](#general-upgrade-steps).

## 26.2 breaking changes

### Audit log v1 writes removed

Seqera Platform Enterprise 26.2 writes audit events only to the v2 schema. This is a **breaking change** for direct database consumers and custom ETL jobs that still read new events from the legacy v1 schema (`tw_audit_log` table).

- The `TOWER_AUDIT_LOG_V2_WRITE_MODE` setting is removed and has no effect. Remove it from your configuration.
- Platform writes no new rows to the v1 schema. Existing rows remain until the audit log retention period deletes them. While the table has records, they stay visible in the **Table v1** tab of the Admin panel **Audit logs** page.

## Database changes

Seqera Platform Enterprise 26.1 changed the supported database versions. Before you upgrade, check your database against the following table.

| Database / version | 26.x status | Action |
| --- | --- | --- |
| MySQL 5.7 | No longer tested or supported (upstream end of life) | Upgrade to MySQL 8.4 before upgrading to 26.1 |
| MySQL 8.0 | No longer tested or supported (upstream end of life April 2026) | Upgrade to MySQL 8.4 |
| MySQL 8.4 (LTS) | Recommended default | No action |
| MariaDB | MariaDB driver 3.x | No action |
| AWS Aurora MySQL (provisioned) | Supported | No action |
| AWS Aurora Serverless | Not supported (existing guidance) | Migrate to a supported configuration |

If you run MySQL 5.7 or 8.0, migrate your database **before** you upgrade the application to 26.1. The `migrate-db` container that Seqera supplies does not run against an unsupported database version.

## Cache layer changes: Redis EoL and Valkey support

Seqera Platform Enterprise 26.1 added support for Valkey and raised the minimum Redis version.

| Cache / version | 26.x status | Action |
| --- | --- | --- |
| Redis 6.x | Not supported from 26.1 | Upgrade to Redis 7.x or migrate to Valkey 7.x |
| Redis 7.2 | Supported | No action |
| Redis 7.4 | Supported | No action |
| Valkey 7.x | Newly supported in 26.1 upwards | Optional migration path from Redis |

:::note
Redis 6.2 remains an upstream extended-support release until 1 April 2027, and Amazon ElastiCache supports Redis OSS 6 until 31 January 2027, with paid extended support until 31 January 2030. These upstream dates do not extend Seqera support. Seqera Platform 26.1 is not tested against Redis 6.x. Upgrade your cache before you upgrade Seqera Platform.

Use Redis 7.2 or 7.4, or Valkey 7.x. Seqera does not test or support newer major versions.
:::

### Migrate from Redis to Valkey

To migrate from Redis to Valkey, point `TOWER_REDIS_URL` at your Valkey 7.x installation. No other configuration is needed because Valkey 7.x supports the same schema as Redis.

:::note
Redis password and ACL configuration carry over unchanged when you migrate to Valkey.
:::

## Single unprivileged frontend image

From 26.2, Seqera publishes one frontend image. It runs as a non-root user and was previously tagged `-unprivileged`. Seqera no longer publishes the `-root` tag variant or the `-unprivileged` tag alias. A manifest that references either tag fails to pull.

Before you upgrade, update your [Kubernetes](../enterprise/platform-kubernetes) or [Docker Compose](../enterprise/platform-docker-compose) manifests:

- Remove the `-unprivileged` or `-root` suffix from every frontend image reference.
- Change the port. The image listens on `8000`, not `80`. In Kubernetes, set the container port and the frontend service `targetPort` to `8000`, and leave the service `port` at `80`. In Docker Compose, map the host port to container port `8000`.

The templates you download in the [general upgrade steps](#general-upgrade-steps) already use these settings.

See the [frontend image documentation](../enterprise/platform-kubernetes#seqera-frontend-unprivileged) for the security context, file system, and port differences. The [Helm chart](../enterprise/platform-helm) also requires this image.

## Studios container template version

For 26.2, the default Studios container template version is **0.14**. The minimum supported version is **0.12**. If you customized your Studios container templates, update them to the 0.14 base images during the upgrade. Templates on a Connect version earlier than 0.12 are not supported. See the [Studios migration documentation](../studios/managing#migrate-a-studio-from-an-earlier-container-image-template).

## Data lineage available in all workspaces by default

In 26.2, data lineage is available in every organization workspace by default. In 26.1, lineage was available only if you set `TOWER_LINEAGE_ALLOWED_WORKSPACES`.

Availability does not change which runs generate lineage. Runs in a workspace generate lineage by default only after you configure the workspace lineage settings in **Settings > Workspace settings > Lineage** and turn on **Enable lineage by default**. The **Enable lineage** launch toggle overrides that setting for a single run. See [Enable data lineage](../data/data-lineage#enable-data-lineage).

The [`TOWER_LINEAGE_ALLOWED_WORKSPACES`](./configuration/overview#data-features) environment variable controls lineage availability:

| Value | Behavior |
| --- | --- |
| Unset (new default) | Lineage available in **all workspaces** |
| `""` (empty string) | Lineage available in **all workspaces** |
| Comma-separated workspace IDs | Lineage available only in the listed workspaces |

To limit lineage to specific workspaces, set the variable to a comma-separated list of their IDs before you upgrade.

## Data lineage event ingestion moves from SQS to SNS

Data lineage remains a preview feature and AWS-only. From 26.2, Platform no longer polls an Amazon Simple Queue Service (SQS) queue in your AWS account for lineage record notifications. Instead, the lineage bucket publishes object-created events to an Amazon Simple Notification Service (SNS) topic, which pushes them to a Platform webhook over HTTPS. No `sqs:*` grant remains in the documented permission set.

If you plan to turn on lineage, grant the [lineage IAM permissions](../data/data-lineage#additional-iam-permissions-required) in addition to the existing [Seqera IAM permissions](../compute-envs/aws-batch#iam-user-creation).

### If lineage is already configured

On the first startup after the upgrade, a one-off migration converts each lineage-enabled workspace that still uses the SQS transport. For an automatically provisioned workspace, the migration creates and configures the SNS topic, subscribes the Platform webhook, points the bucket notification rule to the topic, and then attempts to decommission the legacy SQS queue.

While it runs, the migration needs the new SNS permissions, plus `sqs:DeleteQueue` on the legacy queue so that it can delete the queue. It needs no other SQS permission. After the migration completes, remove the SQS permissions from your IAM policies.

Platform deletes the queue only after the workspace's SNS delivery is set up, so lineage events keep arriving through one channel or the other. Queue deletion is best effort. If Platform cannot delete the queue, for example because the credentials lack `sqs:DeleteQueue`, the only effect is a stale queue left in your AWS account. The queue no longer receives events, and Platform logs a warning with its URL so that you can delete it manually. A queue left behind does not count as a failed migration.

The migration runs on the `cron` instance. After it processes the workspaces still on SQS, the `cron` log shows:

```console
Lineage transport migration complete: migrated=X flagged=Y failed=Z
```

`migrated` counts automatically provisioned workspaces moved to SNS, `flagged` counts **Manual** workspaces left for you to reconfigure, and `failed` counts workspaces that could not be moved. When `failed` is `0`, every workspace has either moved to SNS or been flagged for you. A failed workspace keeps its queue and is retried on the next `cron` restart, or you can retry it from its lineage settings. See [If the migration reports an error](#if-the-migration-reports-an-error).

If the installation is not reachable over public HTTPS, the migration logs an error, migrates nothing, and does not log the completion line. Set `TOWER_SERVER_URL` to a publicly resolvable HTTPS URL and restart.

The migration is on by default. To turn it off, set `TOWER_LINEAGE_MIGRATE_SQS_TRANSPORT=false`. See [Configuration options](./configuration/overview#data-features).

Platform cannot migrate customer-managed (**Manual**) workspaces, because it holds no permission over resources you own. The lineage settings of those workspaces show instructions to create an SNS topic, subscribe the Platform lineage webhook to it, and enter the topic ARN.

:::note
The migration does not modify the lineage records in your bucket, and no lineage is lost. The bucket is the source of truth for lineage records. In rare cases, such as a delay during setup, the lineage index can fall out of sync with the bucket. Platform can rebuild the index from the bucket.
:::

### If the migration reports an error

If a workspace's credentials lack the required permissions, the migration leaves that workspace in an errored state and records the cause on its lineage settings page. Your bucket and the lineage data in it are not affected. To resolve:

1. Update the IAM role or user behind the workspace's lineage credentials to grant the [permissions listed on the data lineage page](../data/data-lineage#additional-iam-permissions-required).
1. Open **Settings > Workspace settings > Lineage** and select **Update** to retry provisioning.
1. If provisioning still does not complete, select **Disable lineage** and configure lineage again. This removes only the configuration and the automatically provisioned notification infrastructure.

Platform re-indexes records already written to the bucket once event delivery is established. Retrying loses no lineage.

## General upgrade steps

:::caution
The database volume is persistent on the local machine by default if you use the `volumes` key in the `db` or `redis` section of your `docker-compose.yml` file to specify a local path to the DB or Redis instance. If your database is not persistent, back it up before you upgrade the application or the database.
:::

1. Back up the Seqera database. If you use the pipeline optimization service and its `groundswell` database is in a separate database instance, back up the `groundswell` database too.
1. Download the latest versions of your deployment templates and update your Seqera container versions:
    - [docker-compose.yml](./_templates/docker/docker-compose.yml) for Docker Compose deployments
    - [tower-cron.yml](./_templates/k8s/tower-cron.yml) and [tower-svc.yml](./_templates/k8s/tower-svc.yml) for Kubernetes deployments
1. **JVM memory defaults (recommended)**: The deployment templates you downloaded in the previous step include the following `JAVA_OPTS` environment variable to tune JVM memory settings:

    ```bash
    JAVA_OPTS="-Xms1000M -Xmx2000M -XX:MaxDirectMemorySize=800m -Dio.netty.maxDirectMemory=0 -Djdk.nio.maxCachedBufferSize=262144"
    ```

    These baseline values suit most deployments with a moderate number of concurrent runs.

    :::tip
    You may need to tune these starting values for your workload. See [Backend memory requirements](./configuration/overview.mdx#backend-memory-requirements) for when and how to adjust them.
    :::
1. If you use Studios, download and apply the latest versions of the Kubernetes manifests:
    - [proxy.yml](./_templates/k8s/data_studios/proxy.yml)
    - [server.yml](./_templates/k8s/data_studios/server.yml)

    :::warning
    If you customized the default Studios container template images, update them to the latest recommended versions. Seqera may not support templates that use a Connect version earlier than the one in the latest `proxy.yml` and `server.yml`. See the [Studios migration documentation](../studios/managing#migrate-a-studio-from-an-earlier-container-image-template) to migrate to the latest Connect server and client versions.
    :::

1. Restart the application.
1. If you use a containerized database as part of your implementation:
    1. Stop the application.
    1. Upgrade the MySQL image.
    1. Restart the application.
1. If you use Amazon RDS or another managed database service:
    1. Stop the application.
    1. Upgrade your database instance.
    1. Restart the application.
1. If you use the pipeline optimization service and its `groundswell` database is separate from your Seqera database, update the MySQL image for the `groundswell` database instance while the application is down (during step 6 or 7). If both use the same database instance, the `groundswell` update happens automatically during the Seqera database update.

### Database migrations

Database migrations run automatically during the upgrade. No manual steps are needed.

### Custom deployments

- Run the `/migrate-db.sh` script in the `migrate-db` container to migrate the database schema.
- Deploy Seqera with your usual procedure.

## Nextflow launcher image

If you host your nf-launcher container image on a private image registry, copy the [nf-launcher image](https://quay.io/seqeralabs/nf-launcher:j21-26.04.x) to your private registry. Then set the launch container environment variable in your backend environment:

```
TOWER_LAUNCH_CONTAINER=<FULL_PATH_TO_YOUR_PRIVATE_IMAGE>
```

:::caution
If you use AWS Batch, [configure a custom job definition](../enterprise/advanced-topics/custom-launch-container) and set `TOWER_LAUNCH_CONTAINER` to the job definition name instead.
:::

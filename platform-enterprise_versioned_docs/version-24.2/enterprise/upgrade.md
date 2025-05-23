---
title: "Upgrade deployment"
description: "Platform Enterprise update guidance"
date: "21 Aug 2024"
tags: [enterprise, update, install]
---

Follow these steps to upgrade your database instance and Platform Enterprise installation:

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

# Enterprise 23.4.x

Seqera Platform Enterprise version 23.4 introduces a redesigned UI, VM instance template support for Google Cloud Batch, and database deployment improvements. A number of bug fixes and performance enhancements have also been included in this major release.

:::note
Version 23.4.6 is the baseline for the 23.4 major release cycle.
:::

## New features

### Form redesign

Seqera Platform 23.4 features refreshed forms and UI elements aimed at enhancing user experience and streamlining form navigation. This redesign encompasses all application interface forms, including pipelines, compute environments, Data Explorer, and administrative pages to create a more intuitive user journey.

### Google Cloud Batch: VM instance template support

Seqera now supports VM instance templates for head and compute jobs in Google Cloud Batch compute environments. [VM instance templates][gcp-vm-instance-template] provide a convenient way to save a VM configuration, thereby allowing you to define the resources allocated to Batch jobs.

## Other improvements

- Forms UI copy improvements
- Update docker-compose in deployment files
- Improved database migration via new migrate-db container
- Changed default Azure Batch image to ubuntu-server
- Set private address for head job configuration in Google Batch
- Nextflow output file preview in Data Explorer

### Enterprise licensing update

Platform Enterprise 23.4 includes an update to the Enterprise licensing model. While Seqera support will contact affected customers to update licenses, the license manager remains backward compatible with existing licenses. For standard Enterprise licenses, no customer action is required. License limits are enforced remotely — if your Enterprise license includes custom limits, contact Seqera support to ensure a seamless transition.

### MySQL version in deployment manifests bumped to version 8

Seqera Platform Enterprise version 23.4 officially supports MySQL 8.0. The default MySQL version in the `docker-compose.yml` and `tower-cron.yml` deployment templates for Docker Compose and Kubernetes deployments has been updated from 5.7 to 8.0 in the Seqera version 23.4 documentation. See [Upgrade steps](#upgrade-steps) below for instructions to update your Seqera databases from older versions to MySQL 8.

Previous versions of the deployment template files are still available in Platform docs versions 23.3 and older.

## Breaking changes

**New migrate-db container for database migration**

In version 23.4, database migration logic has moved to a new container separate from the backend cron container. This generates a better separation of responsibility across various components of the Platform infrastructure. The change is trivial for Kubernetes installations. For Docker Compose, the startup lifecycle of the containers is improved, with better dependency handling among them. See [Upgrade steps](#upgrade-steps) below for more information to update and migrate your Seqera databases.

**Docker Compose V2 supersedes standalone docker-compose for Docker installs**

The Docker Compose CLI plugin replaces the standalone `docker-compose` binary, which was deprecated by DockerHub in July 2023 by [Compose V2](https://www.docker.com/blog/announcing-compose-v2-general-availability/). The installation documentation now uses the `docker compose` subcommand for the Docker CLI when using compose files.

**Cloud compute environments use cloud cache by default**

When a cloud storage location is provided as the pipeline work directory in a cloud compute environment, a scratch folder is created in that location to be used for the Nextflow process cache by default. This can be overridden with an alternate cache entry in your [Nextflow configuration](https://www.nextflow.io/docs/latest/process.html#process-cache).

**Login redirection logic update**

Login redirection logic has changed in version 23.4. Seqera now prepends the [`TOWER_SERVER_URL`](../configuration/overview.mdx#basic-configuration) (or `tower.serverUrl` in `tower.yml` configuration) to the authentication redirect URL during the login flow. This is useful when your server URL contains a contextual path.

If you specify a DNS name as your `TOWER_SERVER_URL`, but access your Seqera instance using a different address (such as using an IP address that resolves to the server URL asynchronously), user login will not resolve.

**Revert default Tower name changes in documentation**

A previous iteration of the rebranded Seqera documentation noted `seqera` as the default and example value for certain variables (such as default database names). The rebranding from Nextflow Tower to Seqera Platform is an ongoing, incremental process and as such, legacy `tower` values and naming conventions used by the Seqera backend will remain in place until a future release. Updates to configuration variables and values will be communicated well in advance to prepare users for any breaking changes.

**ARM64 CPU architecture support enabled by default**

The **Use Graviton CPU architecture** option is now available by default during AWS Batch compute environment creation. The `TOWER_ENABLE_ARM64` configuration environment variable is no longer needed to enable ARM64 CPU architecture support. 

## Upgrade steps

This version requires a database schema update. Follow these steps to update your DB instance and the Seqera installation.

:::caution
The database volume is persistent on the local machine by default if you use the `volumes` key in the `db` or `redis` section of your `docker-compose.yml` file to specify a local path to the DB or Redis instance. If your database is not persistent, you must back up your database before performing any application or database upgrades.
:::

To upgrade your database schema:

1. Make a backup of the Seqera Platform database. If you use the pipeline optimization service and your `groundswell` database resides in a database instance separate from your Seqera database, make a backup of your `groundswell` database as well.
2. Download the 23.4 versions of your deployment templates and update your Seqera container versions:
    - [docker-compose.yml](../_templates/docker/docker-compose.yml) for Docker Compose deployments
    - [tower-cron.yml](../_templates/k8s/tower-cron.yml) and [tower-svc.yml](../_templates/k8s/tower-svc.yml) for Kubernetes deployments
3. Restart the application.
4. If you're using a containerized database as part of your implementation:
    1. Stop the application.
    2. Upgrade the MySQL image.
    3. Restart the application.
5. If you're using Amazon RDS or other managed database services:
    1. Stop the application
    2. Upgrade your database instance.
    3. Restart the application.
6. If you're using the pipeline optimization service (`groundswell` database) in a database separate from your Seqera database, update the MySQL image for your `groundswell` database instance while the application is down (during step 4 or 5 above). If you're using the same database instance for both, the `groundswell` update will happen automatically during the Seqera database update.

**Custom deployment**:

- Run the `/migrate-db.sh` script provided in the `migrate-db` container. This will migrate the database schema.
- Deploy Seqera following your usual procedures.

## Nextflow launcher image

If you must host your nf-launcher container image on a private image registry, copy the [nf-launcher image](https://quay.io/seqeralabs/nf-launcher:j17-23.04.1) to your private registry. Then update your `tower.env` with the launch container environment variable:

    `TOWER_LAUNCH_CONTAINER=<FULL_PATH_TO_YOUR_PRIVATE_IMAGE>`

:::caution
If you're using AWS Batch, you will need to [configure a custom job definition](../advanced-topics/custom-launch-container.mdx) and populate the `TOWER_LAUNCH_CONTAINER` with the job definition name instead.
:::

## Changelog

For a detailed list of all changes, see the Seqera [changelog](./changelog.mdx).

[gcp-vm-instance-template]: https://cloud.google.com/compute/docs/instance-templates

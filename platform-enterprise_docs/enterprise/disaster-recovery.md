---
title: "Platform disaster recovery"
description: Plan backup, restore, and recovery steps for Seqera Platform Enterprise deployments
date created: "2026-04-07"
tags: [installation, deployment, disaster recovery, backup, restore]
---

Use this guide to define a disaster recovery (DR) plan for Seqera Platform Enterprise before you need to restore service after an infrastructure loss or a region-level incident.

Seqera Platform does not create a DR plan for you. Your recovery procedure depends on the infrastructure that hosts Platform, your database and Redis services, your container registry access, and the backup capabilities offered by your cloud provider or platform team.

## What to protect

Back up and document the parts of your deployment that you will need to rebuild Platform:

- The Platform SQL database and its restore procedure.
- Your Platform configuration, including `tower.env`, `tower.yml`, Helm values, Kubernetes manifests, or `docker-compose.yml`.
- Your `TOWER_CRYPTO_SECRETKEY` value and any rotation-related keys. Existing encrypted secrets in the Platform database cannot be decrypted without the correct key material.
- TLS certificates, identity provider settings, registry credentials, and any other secrets required to start Platform.
- The storage locations and infrastructure dependencies referenced by your Platform deployment, such as load balancers, DNS records, persistent volumes, and mirrored container images.

:::warning
Back up your Platform database before changing the crypto secret key or running key rotation. For more information, see [Configuration overview](./configuration/overview#secret-key-rotation).
:::

## Define recovery targets

Document the following targets with your operations team:

- Recovery point objective (RPO): how much recent Platform state you can afford to lose.
- Recovery time objective (RTO): how long Platform can remain unavailable.
- Recovery owner: who can restore the database, recreate infrastructure, and validate the application.

Your deployment model directly affects these targets:

- Kubernetes and Helm deployments can be rebuilt on new infrastructure more easily, especially when Platform runs with external managed database and Redis services.
- Docker Compose deployments are single-instance by design. Restoring them normally requires application downtime while the host, configuration, and backing services are rebuilt.

## Recommended backup strategy

At minimum, maintain:

1.  Regular database backups or snapshots for the SQL database used by Platform.
2.  Version-controlled copies of your deployment manifests and configuration overrides.
3.  A secure copy of the active crypto secret key and any required supporting secrets.
4.  A written restore runbook that includes DNS, ingress, load balancer, and certificate steps.

For production environments, use the backup and replication features provided by your infrastructure:

- Managed SQL backups, snapshots, and cross-region replicas where required by your RPO and RTO.
- Backups for any persistent volumes or host-attached storage used by your deployment.
- Registry mirroring for Platform images if your environment cannot rely on direct access to `cr.seqera.io` during recovery.

## Recovery workflow

### Kubernetes or Helm deployments

1.  Recreate or fail over the Kubernetes cluster and its supporting infrastructure.
2.  Restore access to the SQL database, Redis service, secrets, ingress, and DNS records.
3.  Reapply your Helm values or Kubernetes manifests.
4.  Restore the SQL database from the selected backup or snapshot.
5.  Confirm that Platform starts with the same crypto secret key used to encrypt the existing database contents.
6.  Validate login, workspace access, and workflow launch behavior.

### Docker Compose deployments

1.  Provision a replacement host or recover the existing host.
2.  Restore `tower.env`, `tower.yml`, `docker-compose.yml`, certificates, and secret material.
3.  Restore or recreate the external SQL database and Redis service used by Platform.
4.  Start Platform with `docker compose up` and allow migrations and startup checks to finish.
5.  Validate login, workspace access, and workflow launch behavior before switching traffic back.

## Validation checklist

Test your DR plan on a schedule that matches your organization's risk requirements. During each exercise, confirm that you can:

- Restore the database from a recent backup.
- Start Platform with the correct crypto secret key and configuration.
- Reach the frontend through the expected DNS and TLS path.
- Log in and access organizations, workspaces, and compute environments.
- Launch a small workflow to verify end-to-end operation.

The [Test deployment](./testing) guide provides a simple post-recovery smoke test you can adapt for DR exercises.

## Related guides

- [Platform installation overview](./install-platform)
- [Platform: Helm](./platform-helm)
- [Platform: Kubernetes](./platform-kubernetes)
- [Platform: Docker Compose](./platform-docker-compose)
- [Test deployment](./testing)

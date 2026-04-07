---
title: "Disaster recovery"
description: "Plan disaster recovery for self-hosted Seqera Platform deployments"
date created: "2026-04-07"
last updated: "2026-04-07"
tags: [enterprise, disaster recovery, backup, restore, operations]
---

This guide outlines a practical disaster recovery (DR) approach for self-hosted Seqera Platform deployments. Use it to define what must be restored, which parts of the environment should be rebuilt from infrastructure-as-code, and how to validate that the restored platform is ready for users.

The exact recovery procedure depends on your deployment model, your cloud architecture, and your recovery time objective (RTO) and recovery point objective (RPO). Seqera does not provide a single turnkey DR template for every environment, but the guidance on this page covers the minimum state and validation steps that most teams need.

## Define your recovery target

Before you write a DR runbook, decide what a successful recovery means for your deployment:

- Whether you are recovering the existing environment or recreating the account, subscription, or project that hosts Platform.
- How much data loss is acceptable between the last good backup and the restored system.
- How long Platform can remain unavailable before users must switch to another workflow.
- Which services must return first: Platform login, pipeline launches, Studios, or pipeline optimization.

Your deployment model affects the recovery shape:

- [Docker Compose](./platform-docker-compose) is best treated as a single-instance recovery path with a longer outage window.
- [Kubernetes](./platform-kubernetes) is better suited to production environments that need higher availability and faster infrastructure replacement.

:::note
Running multiple backend replicas improves availability during normal operations, but it is not a substitute for database backups, configuration backups, or a tested restore procedure.
:::

## Back up the required state

At minimum, your DR plan should cover the following components.

### SQL database

The SQL database is the primary persistent state for Seqera Platform. Back up the database before upgrades and on a schedule that matches your RPO. If you use a managed service such as Amazon RDS, document both the snapshot schedule and the exact restore procedure.

If you use the pipeline optimization service and its `groundswell` database is hosted separately, include that database in the same backup and restore plan.

### Configuration and secrets

Back up the configuration that is required to recreate the deployment:

- `tower.env`
- `tower.yml`
- Helm values files, Kubernetes manifests, or Docker Compose files
- Kubernetes ConfigMaps and Secrets, if used
- Reverse proxy, ingress, DNS, and TLS certificate configuration
- Registry credentials, license configuration, and any custom image mirror settings

For AWS deployments that use [AWS Parameter Store](./configuration/aws_parameter_store), include the parameter hierarchy and IAM policies required for Seqera to read those values.

### Redis

Redis is used for caching and coordination, not as the system of record. In most environments, the priority is to recreate a working Redis service before Platform starts rather than to restore Redis from backup. Document which Redis service you use and how to rebuild it.

### External dependencies

Platform recovery also depends on services outside the application itself. Document how to recreate or reconnect:

- Container registries and image mirrors
- Object storage buckets used by pipelines
- Compute environment credentials and IAM roles
- SMTP configuration
- Identity provider integration
- Studios prerequisites and custom container images

If your recovery scenario includes recreating the full cloud account, verify that these external dependencies are either reproducible or owned by another team with a compatible DR plan.

## Choose a deployment-specific DR posture

### Docker Compose deployments

Docker Compose deployments are suitable for evaluation, development, and smaller production environments. For DR, plan around full environment replacement rather than in-place failover:

- Keep infrastructure definitions for the VM, storage volumes, DNS, and network rules outside the instance itself.
- Take scheduled database snapshots and, if you host supporting services locally, snapshot the attached volumes as well.
- Expect service downtime during recovery and during many maintenance operations.
- Validate whether your acceptable outage window matches this model before using Docker Compose for production.

### Kubernetes deployments

Kubernetes deployments are the preferred option when you need a more repeatable production recovery path:

- Store manifests, Helm values, ingress settings, and secret material in a controlled source of truth.
- Use managed database and Redis services where possible so the cluster can be rebuilt independently of the data layer.
- Document the order for restoring cluster resources, shared secrets, and external DNS or load balancer configuration.
- If you rely on multiple backend replicas for availability, make sure the cron service remains a single instance after restoration.

## Restore in a controlled order

The restore order matters more than the individual commands. A typical recovery sequence is:

1.  Recreate the base infrastructure: network, DNS, load balancer, Kubernetes cluster or VM, database service, and Redis service.
2.  Restore the Seqera SQL database from the most recent acceptable snapshot.
3.  Recreate or restore Platform configuration, secrets, TLS certificates, registry access, and any parameter-store entries.
4.  Deploy the Platform services. Ensure the cron service completes its startup tasks before relying on the backend.
5.  Restore optional components such as Studios or pipeline optimization if your environment uses them.
6.  Reconnect external integrations such as SMTP, identity providers, and container registries.

:::warning
Do not treat application deployment alone as a DR test. A successful recovery must prove that the restored deployment can authenticate users, launch workflows, and access its required external services.
:::

## Validate the recovered platform

After restoration, run a short validation sequence before declaring the environment ready:

1.  Confirm that users can log in.
2.  Confirm that your organization and workspace configuration is present.
3.  Confirm that credentials, compute environments, and secrets are available where expected.
4.  Launch a small validation workflow, such as the [deployment test workflow](./testing), and verify that logs and outputs are produced normally.
5.  If you use Studios, launch a test Studio session.
6.  If you use pipeline optimization, verify that the service starts and can read its database.

Record the actual recovery duration and any manual fixes required so you can refine the runbook after each exercise.

## Practice the plan

A DR plan is only useful if it is exercised. As part of production readiness:

- Run a scheduled recovery drill in a non-production environment.
- Verify that your backups can actually be restored.
- Measure the real RTO and RPO you achieved.
- Update the runbook when your deployment topology, secrets, integrations, or ownership changes.

For broader production readiness checks, see the [production checklist](../getting-started/production-checklist).

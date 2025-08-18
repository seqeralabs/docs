---
title: "Production checklist"
description: "A pre-production checklist for Seqera Platform."
date created: "2025-07-03"
last updated: "2025-07-21"
tags: [production, checklist, deployment, limitations, retry]
---

This page provides guidance and best practices for your Seqera Platform deployment, and areas you should consider before you begin. We recommend working with your sales team for additional guidance around your particular infrastructure before going into production.

## Organizations and workspaces

Organizations are the top-level structure and contain workspaces, members, and teams.

You can create multiple organizations within Seqera Platform, each of which can contain multiple workspaces with shared users and resources. This means you can customize and organize the use of resources while maintaining an access control layer for users associated with a workspace.

Before you create your organizations and workspaces, consider the various roles and work streams that you’d like to start with and scale to. See [Organizations](https://docs.seqera.io/platform-cloud/orgs-and-teams/organizations) for more information.

## Users and roles

Once an organization is created, the user who created the organization is the default owner of that organization. Additional users can be assigned as organization owners. Owners have full read/write access to modify members, teams, collaborators, and settings within an organization.
Organization members have specific roles and permissions that define their access and capabilities:

- A member is a user who is internal to the organization.
- Members have an organization role and can operate in one or more organization workspaces.
- In each workspace, members have a participant role that defines the permissions granted to them within that workspace.
- Members can create their own workspaces within an organization and be part of a team.

All users can be assigned roles that grant the type of access and permissions they have to resources within Platform. 

It’s a good idea to map out the expected users and their roles to ensure your plans are scalable. See [User roles](https://docs.seqera.io/platform-enterprise/25.1/orgs-and-teams/roles) for more information.

## Infrastructure

Infrastructural requirements vary widely depending on the workload you expect. See [Enterprise installation](https://docs.seqera.io/platform-enterprise/latest/enterprise/overview) for an outline of Platform components.

To begin, build out a proof of concept using the below recommendations and create a baseline of your capacity requirements. When you are ready to move to production, consider the increased workload.

### Kubernetes

When deploying Seqera Platform in a generic Kubernetes cluster we recommend starting with: 

- 4 vCPU
- 7 GB nodes 

This sizing recommendation is a basic starting point. Your requirements may vary significantly based on the number of pipelines and concurrent processes you anticipate. See [Configure Pods and Containers](https://kubernetes.io/docs/tasks/configure-pod-container/) for information about increasing your resources.

### Docker

When deploying Seqera Platform using Docker compose we recommend starting with: 

- Instance size - `c5.2xlarge`
- External DB Aurora V3 provisioned - `db.t3.medium`
- External Redis - `cache.t2.micro`

This sizing recommendation is a basic starting point. Your requirements may vary significantly based on the number of pipelines and concurrent processes you anticipate. See [Docker Resource constraints](https://docs.docker.com/engine/containers/resource_constraints/) for information about resource management in Docker.

### AWS

When deploying Seqera Platform using AWS we recommend starting with: 

- Amazon Machine Image (AMI): Amazon Linux 2023 Optimized
- Instance type: `c5a.2xlarge` with 8 CPUs and 16 GB RAM
- A MySQL8 Community DB instance with minimum 2 vCPUs, 8 GB memory, and 30 GB SSD storage

This sizing recommendation is a basic starting point. Your requirements may vary significantly based on the number of pipelines and concurrent processes you anticipate. See [AWS Autoscaling documentation](https://aws.amazon.com/autoscaling/) for information about resource management in AWS.

### Azure

When deploying Seqera Platform using Azure we recommend starting with: 

- Azure Linux VM with default values
- At least 2 CPUS and 8 GB RAM
- Ubuntu Server 22.04 LTS - Gen2 image
- A MySQL8 Community DB instance with minimum 2 vCPUs, 8 GB memory, and 30 GB SSD storage

These autoscale for pipeline runs, but the sizing recommendation will be based on the workload and can vary significantly based on the number of pipelines and concurrent processes you anticipate. See [Azure autoscaling documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-get-started) for information about scaling in Azure.

## Spot instance retry strategy

One way to mitigate issues with Spot reclamation and the resulting interruptions is by having a robust retry and resume strategy. The are multiple options available to you:

- [Handle retries in Nextflow by setting `errorStrategy` and `maxRetries`](https://docs.seqera.io/platform-cloud/tutorials/retry-strategy#handle-retries-in-nextflow-by-setting-errorstrategy-and-maxretries)
- [Handle retries in AWS by setting `aws.batch.maxSpotAttempts`](https://docs.seqera.io/platform-cloud/tutorials/retry-strategy#handle-retries-in-aws-by-setting-awsbatchmaxspotattempts)
- [Implement Spot to On-Demand fallback logic](https://docs.seqera.io/platform-cloud/tutorials/retry-strategy#implement-spot-to-on-demand-fallback-logic)

Refer to [our retry strategy tutorial](https://docs.seqera.io/platform-cloud/tutorials/retry-strategy) for more information.

## Cost management and alerts

Managing your compute spend upfront is a critical part of your production deployment. We recommend the following practices:

- Utilize AWS Batch job tagging. This is facilitated by Nextflow's configuration and can be crucial in tracing costs back to specific pipelines. They can include dynamic variables and can be a valuable tool for helping diagnose and identify unexpected fees. This is especially helpful if you’re using Nextflow outside of Seqera Platform.
- Note that CloudWatch fees are not included in your run cost estimates.

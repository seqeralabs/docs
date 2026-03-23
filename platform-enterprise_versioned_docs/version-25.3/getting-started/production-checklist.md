---
title: "Production checklist"
description: "A pre-production checklist for Seqera Platform."
date created: "2025-07-03"
last updated: "2026-03-20"
tags: [production, checklist, deployment, limitations, retry]
---

This page describes Seqera Platform-specific configuration decisions that commonly arise when transitioning from evaluation to production environments. Cloud infrastructure setup (e.g., networking, IAM, and compute configuration) is the responsibility of your cloud team and is not covered in this guide. 

For environment-specific production reviews, architecture guidance, or upgrade planning, contact your Seqera account team.

## Organizations and workspaces

Organizations are the top-level structure and contain workspaces, members, and teams.

You can create multiple organizations within Seqera Platform, each of which can contain multiple workspaces with shared users and resources. This means you can customize and organize the use of resources while maintaining an access control layer for users associated with a workspace.

Before you create your organizations and workspaces, consider the various roles and work streams that you'd like to start with and scale to. See [Organizations](../orgs-and-teams/organizations) for more information.

## Users and roles

Once an organization is created, the user who created the organization is the default owner of that organization. Additional users can be assigned as organization owners. Owners have full read/write access to modify members, teams, collaborators, and settings within an organization.
Organization members have specific roles and permissions that define their access and capabilities:

- A member is a user who is internal to the organization.
- Members have an organization role and can operate in one or more organization workspaces.
- In each workspace, members have a participant role that defines the permissions granted to them within that workspace.
- Members can create their own workspaces within an organization and be part of a team.

All users can be assigned roles that grant the type of access and permissions they have to resources within Platform.

It's a good idea to map out the expected users and their roles to ensure your plans are scalable. See [User roles](../orgs-and-teams/roles) for more information.

## Version pinning and compatibility

Incompatibilities between Nextflow and Platform versions are a leading cause of production failures, and often only surface during pipeline resumption after an interruption — not during normal runs.

Best practices for version pinning and compatibility include:

- Pin a specific Nextflow version for all production pipelines and document it alongside your Seqera Platform version. 
- Do not upgrade Nextflow and Seqera Platform at the same time.
- Validate any version change in a non-production environment before promoting to production.
- After any version change, test pipeline resumption explicitly: launch a representative pipeline, interrupt it, and confirm it resumes from the last successful task.

:::warning
If you cannot resume a pipeline after a version upgrade, roll back to your last documented working version combination before investigating further.
:::

## Credentials and token lifecycle

Credentials in Seqera Platform require active management. Expired or rotated credentials that are not updated in Platform are a common cause of silent pipeline failures.

**Before go-live:**

- Identify all credentials used by production pipelines: cloud provider credentials, Git tokens, container registry credentials, and API tokens.
- Record when each credential was created and when it expires.
- Assign a named owner responsible for rotating each credential.

**When rotating credentials:**

1. Add the new credential to the correct Seqera organization and workspaces.
2. Launch a test pipeline using the new credential and confirm it runs successfully.
3. Remove or deactivate the old credential only after step 2 is confirmed.

:::warning
Do not rotate credentials during active pipeline runs. Schedule rotations during maintenance windows.
:::

Use [Pipeline Secrets](../secrets/overview.mdx) to manage sensitive values such as API keys for third-party services. Secrets are injected at runtime and are not exposed in pipeline logs or configuration files.

## Compute environment permissions

Permissions within shared compute environments are a frequent source of unexpected behavior, particularly when multiple teams use the same workspace.

- Use dedicated compute environments for production. Avoid sharing production compute environments with development or test workloads.
- Assign workspace roles at the level of access each user actually requires. The **Launch** role is appropriate for most researchers running established pipelines; **Maintain** is for users who need to configure compute environments and pipelines.
- Users in the same workspace can see and cancel each other's pipeline runs. If your organization requires run isolation between teams or projects, use separate workspaces.

:::note
Admin-level workspace access grants the ability to modify compute environments and credentials, which can affect all pipelines in the workspace. Assign Admin only to users who are responsible for workspace configuration.
:::

For teams sharing pipelines across workspaces, use a [shared workspace](../orgs-and-teams/workspace-management#shared-workspaces) to centralize pipeline definitions and compute environments without duplicating configuration.

## Cost tagging

Without resource labels, cloud billing reports cannot attribute compute costs to specific teams, projects, or pipelines.

Define a tagging strategy before running production workloads. At minimum, tag by `environment`, `team`, and `pipeline`. Add `project` or `cost_center` tags if you need chargeback reporting.

Use [dynamic resource labels](../resource-labels/overview) to apply pipeline-specific tags to AWS Batch jobs automatically at run time. This enables cost attribution at the individual run level without manual configuration.

:::warning
Cancelling a pipeline run in Seqera Platform does not guarantee immediate termination of the underlying cloud compute jobs. In some cases — particularly on AWS Batch — child jobs can continue running after Platform reports the run as cancelled or complete. Configure spend alerts in your cloud provider's billing tools independently of Platform, so that runaway compute costs are detected even if Platform does not surface them.
:::

:::note
The cost estimator in Seqera Platform is for indicative purposes only. For billing, budgeting, or chargeback, use your cloud provider's native cost reporting tools: AWS Cost Explorer, GCP Billing, or Azure Cost Management.
:::

## Cost management and alerts

Managing your compute spend upfront is a critical part of your production deployment. We recommend the following practices:

- Utilize AWS Batch job tagging. This is facilitated by Nextflow's configuration and can be crucial in tracing costs back to specific pipelines. They can include dynamic variables and can be a valuable tool for helping diagnose and identify unexpected fees. This is especially helpful if you're using Nextflow outside of Seqera Platform.
- Note that CloudWatch fees are not included in your run cost estimates.

## Spot instance retry strategy

One way to mitigate issues with Spot reclamation and the resulting interruptions is by having a robust retry and resume strategy. The are multiple options available to you:


- [Handle retries in Nextflow by setting `errorStrategy` and `maxRetries`](../tutorials/retry-strategy#handle-retries-in-nextflow-by-setting-errorstrategy-and-maxretries)
- [Handle retries in AWS by setting `aws.batch.maxSpotAttempts`](../tutorials/retry-strategy#handle-retries-in-aws-by-setting-awsbatchmaxspotattempts)
- [Implement Spot to On-Demand fallback logic](../tutorials/retry-strategy#implement-spot-to-on-demand-fallback-logic)

Refer to [our retry strategy tutorial](../tutorials/retry-strategy) for more information.

## Connectivity requirements

Seqera Platform requires outbound connectivity from compute worker nodes to specific endpoints. Blocked connections are a common cause of pipelines failing to start or stalling mid-run.

Worker nodes must be able to reach:

- Seqera Platform API and web endpoints — see [IP addresses and endpoints](../reference/endpoints.mdx) for the current list
- Your cloud provider's service endpoints — Batch, EC2 or Compute Engine, object storage, container registry
- Any container registries used by your pipelines (ECR, Artifact Registry, Docker Hub, or private registries)
- Any external data sources accessed at runtime

If your environment uses SSL inspection or a corporate proxy, verify that it does not interfere with connections to Seqera Platform, object storage, or container registries.

:::note
If pipelines fail to start or tasks cannot pull container images, connectivity to one of the above endpoints is the most common cause. Check worker node outbound access before investigating other causes.
:::

## Before go-live

- [ ] Nextflow version pinned and version combination documented
- [ ] Pipeline resumption tested after version validation
- [ ] All credentials inventoried with expiry dates and named owners
- [ ] New credentials tested before cutover; rotation procedure documented
- [ ] Production compute environments isolated from dev/test
- [ ] Workspace roles reviewed; Admin not granted broadly
- [ ] Resource labels defined and applied before first production run
- [ ] Cloud billing exports configured and spend alerts set
- [ ] Worker node outbound connectivity verified to all required endpoints


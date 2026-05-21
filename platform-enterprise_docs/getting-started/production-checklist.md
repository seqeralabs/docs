---
title: "Production checklist"
description: "A pre-production checklist for Seqera Platform."
date created: "2025-07-03"
last updated: "2026-03-25"
tags: [production, checklist, deployment, limitations, retry]
---

This guide is for Platform administrators preparing a Seqera deployment for production use by scientific teams. It covers common configuration decisions, policies, and checks to consider before you run production workloads. Because every deployment is different, your Seqera account team can help you tailor these recommendations to your environment and workloads. Cloud infrastructure setup, such as networking, IAM, and compute provisioning, is the responsibility of your infrastructure team and is not covered here.

## Organizations and workspaces

Organizations are the top-level structure in Seqera Platform and contain workspaces, members, and teams. You can create multiple organizations, each with multiple workspaces, to customize resource use and maintain access control across teams.

Best practices for organizations and workspaces include:

- Plan your organization and workspace structure, considering the roles and work streams you expect to start with and scale to.
- Use separate workspaces to isolate production from development and test environments.

See [Organizations](../orgs-and-teams/organizations) for more information.

## Users and roles

Roles define an organization member's access and permissions within Platform. Each member has an organization role and can operate in one or more workspaces, where a participant role governs what they can do within that workspace.

Best practices for users and roles include:

- Map out expected users and their roles before go-live to ensure your access model is scalable.
- Assign roles at the level of access each user actually requires rather than granting broad permissions by default.
- Limit organization owner assignment to users responsible for managing members, teams, and organization-level settings.

See [User roles](../orgs-and-teams/roles) for more information.

## Version pinning and compatibility

Incompatibilities between Nextflow and Platform versions are a leading cause of production failures, and often only surface during pipeline resumption after an interruption.

Best practices for version pinning and compatibility include:

- Set the Nextflow version in the compute environment configuration before handing workspaces to scientific teams, and document it alongside the Seqera Platform version in use.
- Avoid performing Nextflow and Platform upgrades simultaneously, and validate all version changes in a non-production environment first.
- Coordinate with pipeline developers to confirm the current working version combination and agree on a rollback plan before you schedule any upgrades.
- Before promoting a version change to production, ask pipeline teams to test resumption explicitly: launch a representative pipeline, interrupt it, and confirm it resumes from the last successful task.

:::warning
Resumption failure after an upgrade typically indicates a version incompatibility issue. If pipeline teams cannot resume after a version upgrade, roll back to the last documented working version combination before investigating further.
:::

## Cache management

Nextflow uses content-addressed caching to resume pipelines from the last successful task. Cache misconfiguration can lead to unexpected behavior during pipeline resumption. The administrator's role is to configure the storage environment that cache depends on, and to coordinate with pipeline teams to validate cache behavior before go-live.

Best practices for cache management include:

- Configure storage lifecycle policies to ensure that intermediate work directory objects are not removed while pipelines are still running or may need to resume. Coordinate these policies with your cloud team before go-live.
- Ask pipeline teams to validate cache integrity before go-live: run a representative pipeline, run it again, and confirm that cache hits occur and outputs match a clean run.
- Schedule Platform or Nextflow upgrades with pipeline teams in advance, and plan for the first post-upgrade production runs to take longer and cost more if cache is invalidated by a hash algorithm change.

Your Seqera account team can help assess cache configuration for your specific workloads and storage setup.

:::warning
After a Nextflow or Platform version upgrade, hash algorithms or cache key generation may change, causing all previously cached tasks to re-run. Inform pipeline teams before any upgrade so they can plan capacity and schedule accordingly; this is an expected behavior, but it may cause alarm if it happens unexpectedly.
:::

## Credentials and token lifecycle

Credentials in Seqera Platform require active management. Expired or rotated credentials that are not updated in Platform are a common cause of silent pipeline failures. Before you go live:

- Identify all credentials used by production pipelines: cloud provider credentials, Git tokens, container registry credentials, and API tokens.
- Record when each credential was created and when it expires.
- Assign a named owner responsible for rotating each credential.

**When rotating credentials**

1. Add the new credential to the correct Seqera organization and workspaces.
2. Launch a test pipeline using the new credential and confirm it runs successfully.
3. Remove or deactivate the old credential only after step 2 is confirmed.

:::warning
Do not rotate credentials during active pipeline runs. Schedule rotations during maintenance windows.
:::

Use [Pipeline Secrets](../secrets/overview) to manage sensitive values such as API keys for third-party services. Secrets are injected at runtime and are not exposed in pipeline logs or configuration files.

## Compute environment permissions

Permissions within shared compute environments can cause unexpected behavior, particularly when multiple teams use the same workspace.

Best practices for compute environment permissions include:

- Use dedicated compute environments for production and avoid sharing production compute environments with development or test workloads.
- Assign workspace roles at the level of access each user actually requires. The **Launch** role is appropriate for most researchers running established pipelines; **Maintain** is for users who need to configure compute environments and pipelines.
- Use separate workspaces if your organization requires run isolation between teams or projects. Users in the same workspace can see and cancel each other's pipeline runs.

:::note
Admin-level workspace access grants the ability to modify compute environments and credentials, which can affect all pipelines in the workspace. Assign Admin only to users who are responsible for workspace configuration.
:::


## Compute environment sizing

Correctly sizing compute environments before go-live prevents resource contention, job failures, and unexpected costs in production.

Best practices for compute environment sizing include:

- A typical starting range for max CPUs is 2000 to 5000, depending on your workload volume and concurrency needs. Your Seqera account team can advise on the best sizing for your environment.
- Consider enabling Fusion v2 with fast instance storage (NVMe) for I/O-intensive workloads on AWS. In tested benchmarks, this showed a 34% reduction in total pipeline runtime and up to 49% reduction in CPU hours compared to plain S3 storage. See [RNA-Seq performance benchmarks](../getting-started/rnaseq#nf-corernaseq-performance-in-platform) for details.
- Use the [pipeline optimization feature](../pipeline-optimization/overview) to right-size resource allocations based on actual usage data. After a successful run, select the lightbulb icon next to the pipeline in the Launchpad to view and apply an optimized configuration profile.
- For GPU workloads such as protein structure prediction, use GPU-enabled instance families (`g4dn`, `g5`, or `p3` on AWS) and ensure the GPU ECS AMI is enabled in the compute environment configuration.

:::warning
Studios do not support AWS Fargate. If you share a compute environment between pipelines and Studios, do not enable **Use Fargate for head job**. Enabling Fargate on a shared compute environment will prevent Studios sessions from starting.
:::

:::note
Studio sessions compete for compute resources with pipeline runs in the same compute environment. For production workloads, use a dedicated compute environment for pipelines, or ensure the shared environment has sufficient capacity to accommodate both concurrently.
:::

See [RNA-Seq](../getting-started/rnaseq) and [Protein structure prediction](../getting-started/proteinfold) for workload-specific compute environment recommendations.

## Cost tagging

Without resource labels, cloud billing reports cannot attribute compute costs to specific teams, projects, or pipelines.

Best practices for cost tagging include:

- Define a tagging strategy before running production workloads. At minimum, tag by `environment`, `team`, and `pipeline`. Add `project` or `cost_center` tags if you need chargeback reporting.
- Use [dynamic resource labels](../resource-labels/overview) to apply pipeline-specific tags to AWS Batch jobs automatically at run time. This enables cost attribution at the individual run level without manual configuration.

:::warning
Cancelling a pipeline run in Seqera Platform does not guarantee immediate termination of the underlying cloud compute jobs. Configure spend alerts in your cloud provider's billing tools independently of Platform, so that runaway compute costs are detected even if Platform does not surface them.
:::

:::note
The cost estimator in Seqera Platform is for estimation purposes and doesn't account for inefficiencies in how cloud batch executors provision instances. For billing, budgeting, or chargeback, use your cloud provider's native cost reporting tools: AWS Cost Explorer, GCP Billing, or Azure Cost Management.
:::

## Cost management and alerts

Managing compute spend before your workloads go live reduces the risk of unexpected charges in production.

Best practices for cost management and alerts include:

- Enable billing exports to your cloud provider's analytics tooling before running production workloads: AWS Cost Explorer or S3 export, GCP billing export to BigQuery, or Azure Cost Management. These give you the raw data needed to investigate unexpected charges.
- Set budget alerts in your cloud provider's billing tools to detect unexpected daily or weekly spend changes. On AWS, configure CloudWatch billing alarms; on GCP, use Cloud Monitoring budget alerts; on Azure, use Cost Management alert rules.
- On AWS, use [dynamic resource labels](../resource-labels/overview) to tag Batch jobs with pipeline-specific values at run time. Dynamic labels do not appear in AWS Cost Explorer's graphical UI. Costs are tracked via AWS split cost allocation data in Cost and Usage Reports (CUR). Enable split cost allocation in the AWS billing console before expecting to see per-pipeline costs. See the [Seqera blog post on AWS labels cost tracking](https://seqera.io/blog/aws-labels-cost-tracking/) for setup guidance.
- On GCP, apply labels to Cloud Storage buckets, Filestore instances, and Compute Engine VMs in addition to Cloud Batch jobs. Label all resources consistently so BigQuery billing exports can attribute costs at the workload level.
- Account for CloudWatch fees separately on AWS as these are not included in Seqera Platform run cost estimates.

## Spot instance retry strategy

Spot reclamation interrupts pipeline execution when cloud providers reclaim capacity. The administrator configures the compute environment and Platform settings that make Spot workloads resilient; pipeline developers are responsible for the Nextflow-level retry configuration in their pipelines. Both should be in place before production runs begin.

**Administrator configuration**

- Decide on the Spot vs On-Demand provisioning model for each production compute environment and configure the retry logic accordingly.
- Enable [Fusion Snapshots](https://docs.seqera.io/fusion/guide/snapshots) in the compute environment for Spot workloads. When a Spot instance is reclaimed, Fusion Snapshots allows the interrupted task to resume automatically from a checkpoint rather than restart from scratch.

**Pipeline developer configuration**

- `aws.batch.maxSpotAttempts` controls how many times a task is retried at the AWS Batch level before Nextflow sees it as a failure. See [Handle retries in AWS](../tutorials/retry-strategy#handle-retries-in-aws-by-setting-awsbatchmaxspotattempts).
- `errorStrategy` and `maxRetries` in Nextflow handle failures that survive all AWS-native retries. See [Handle retries in Nextflow](../tutorials/retry-strategy#handle-retries-in-nextflow-by-setting-errorstrategy-and-maxretries).
- Spot to On-Demand fallback logic should be implemented for tasks where interruption is unacceptable. See [Spot to On-Demand fallback](../tutorials/retry-strategy#implement-spot-to-on-demand-fallback-logic).

:::note
`aws.batch.maxSpotAttempts` and Nextflow's `maxRetries` operate at independent layers. AWS-native Spot retries happen silently — Nextflow only sees the task as failed after all AWS retries are exhausted. Pipeline developers must set both values intentionally; neither is configured by Platform automatically.
:::

:::note
On GCP, Spot preemption notices can be as short as 6 seconds (compared to 120 seconds on AWS), making Fusion Snapshots especially important. Add the following to your Nextflow configuration:

```groovy
fusion {
  enabled = true
  snapshots = true
}
```
:::

## Connectivity requirements

Seqera Platform requires outbound connectivity from compute worker nodes to specific endpoints. Blocked connections cause pipelines to fail to start or stall mid-run. Worker nodes must be able to reach your cloud provider's service endpoints (Batch, EC2, or Compute Engine, object storage, container registry), any container registries used by your pipelines, and any external data sources accessed at runtime.

In addition, the following Seqera-operated domains must be reachable from your worker nodes. If your firewall supports DNS wildcards, add `*.seqera.io.cdn.cloudflare.net`. Otherwise, add each domain individually:

- `wave.seqera.io` and `community.wave.seqera.io`
- `fusionfs.seqera.io`
- `nf-xpack.seqera.io`
- `cr.seqera.io`, `public.cr.seqera.io`, and `auth.cr.seqera.io`
- `hub.seqera.io`
- `licenses.seqera.io`
- `registry.nextflow.io` — required from Nextflow 25.10 onwards
- `api.multiqc.info`
- For Seqera Cloud deployments: `cloud.seqera.io` and `api.cloud.seqera.io`.
- For Enterprise (self-hosted) deployments: your Platform instance hostname.

If your allowlist is based on IP addresses rather than DNS names, allow all Cloudflare IP ranges listed at [https://www.cloudflare.com/ips/](https://www.cloudflare.com/ips/). For a dynamic list of Seqera Platform egress IPs, query `https://meta.seqera.io`.

If your environment uses SSL inspection or a corporate proxy, verify that it does not interfere with connections to Seqera Platform endpoints, object storage, or container registries. For Enterprise deployments in restricted or air-gapped environments, configure proxy settings on both the Platform instance and worker nodes, and provision an internal plugin registry to replace `registry.nextflow.io`.

:::warning
From Nextflow 25.10, `registry.nextflow.io` is required for plugin resolution and is not included in older firewall allowlists. Pipelines will fail to start after upgrading to 25.10 if this domain is blocked. If your organization requires an internal plugin registry instead, see the [Nextflow 25.10 migration guide](https://www.nextflow.io/docs/latest/migrations/25-10.html).
:::

:::note
If pipelines fail to start or tasks cannot pull container images, connectivity to one of the above endpoints is the most common cause. Check worker node outbound access before investigating other causes.

See [Firewall configuration](../enterprise/advanced-topics/firewall-configuration) for the full allowlist reference.
:::

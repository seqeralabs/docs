---
title: "Billing and credit management"
description: "Manage Seqera Compute credits and billing in Seqera Platform"
date: "21 Apr 2025"
tags: [seqera compute, compute environment]
---

Seqera Compute environments consume credits when running pipelines or Studio sessions. Credits are deducted in real time at task completion to provide visibility into compute spend and prevent credit overuse.

One Seqera Compute credit equals $1 USD. Resources are charged at AWS on-demand rates for the selected region, with transparent pass-through pricing.

## How billing works

### Real-time credit deduction

Credits are deducted throughout pipeline execution rather than only at workflow completion:

- **Task-level billing**: Credits are deducted as each pipeline task completes, providing real-time visibility into run costs
- **Immediate updates**: Credit balance and workflow costs update immediately in the Platform UI
- **Cost aggregation**: The billing report CSV file shows aggregated compute and memory costs per workflow

### What is billed

Seqera Compute bills for four resource types:

| Resource | Rate (credits) | Billing unit | Based on | Billing frequency | Details |
|----------|---------------|--------------|----------|-------------------|---------|
| **CPU time** | 0.1 | vCPU-hour | Requested vCPUs × runtime | At task completion | Charged based on requested vCPUs |
| **Memory** | 0.025 | GiB-hour | Requested memory × runtime | At task completion | Minimum 2GiB per task |
| **Storage** | 0.025 | GB-month | Actual usage | Daily reconciliation | S3 storage costs at AWS rates, varies by region |
| **Network transfer** | Varies by region | GB | Actual data transfer | Daily reconciliation | Data egress charges at AWS rates |

:::info
CPU and memory are billed based on **requested** resources in your pipeline configuration, not actual usage. Storage and network costs are billed based on actual consumption.
:::

## Credit management

### View credit balance

Credit information is available at two levels:

- **Organization level**: Shows total available credits and aggregate spending across all workspaces
  - Navigate to **Organization > Settings > Credits**
- **Workspace level**: Shows credits consumed within that specific workspace
  - Navigate to **Workspace > Settings > Credits**

### Credit limits and run and Studio suspension

When your organization's credit balance is exhausted:

1. **Running pipelines pause** - All active pipeline runs and Studio sessions are automatically suspended
1. **Notifications sent** - You receive an alert about credit exhaustion
1. **New launches blocked** - No new pipeline runs or Studios can be started
1. **Manual resumption** - After purchasing additional credits, manually resume paused pipelines from where they stopped

:::warning
Long-running tasks are periodically monitored. If a single task's estimated cost would exceed remaining credits, the workflow is preemptively paused.
:::

### Requesting additional credits

To request more credits:
1. Select **Contact us to upgrade** in the organization or workspace **Credits** view.
1. Provide your organization details and credit requirements.
1. Credits are typically allocated within one business day.

## Monitoring costs

### Pipeline run costs

View real-time cost information for each pipeline run:

1. Navigate to the **Runs** page
2. Click on a specific run
3. The **Run details** page displays:
   - **Total cost**: Aggregated cost of all completed tasks
   - **Running cost**: Updates as tasks complete
   - **Task costs**: Individual task compute and memory costs

### Billing CSV export

Download detailed billing records:

1. Go to **Organization > Settings > Credits**
2. Click **Download billing CSV**
3. The CSV includes:
   - Separate line items for compute and memory per workflow
   - Aggregated costs (not individual task breakdowns)
   - Timestamps for billing events

### Cost estimation

The Platform provides cost estimates for:
- Completed tasks (actual billed amount)
- Running tasks (estimated based on current runtime)
- Cached tasks (included in resumed run estimates)

> **Note**: Cost estimates are for reference only. For accurate accounting, use the billing CSV or resource labels with your cloud provider's cost management tools.

## Best practices

### Optimize credit usage

1. **Set appropriate resource requests**: Request only the CPU and memory your tasks actually need
2. **Use spot instances**: When available, spot instances can reduce costs by up to 90%
3. **Enable task retry limits**: Prevent runaway costs from repeatedly failing tasks
4. **Monitor long-running tasks**: Tasks running for extended periods consume credits continuously

### Cost allocation

Use resource labels to track costs by project, team, or experiment:

1. Configure resource labels in your compute environment
2. Labels are applied to all AWS resources created for your pipelines
3. Use AWS Cost Explorer to analyze spending by label

### Credit planning

- **Estimate pipeline costs**: Use historical run data to predict credit requirements
- **Set workspace budgets**: Allocate credits to different teams or projects
- **Monitor trends**: Review the billing CSV regularly to identify cost patterns

## Default limits

Seqera Compute has the following default limits:

| Resource | Default limit | Scope |
|----------|--------------|-------|
| Initial credits | $100 | Organization |
| Compute environments | 10 | Workspace |
| Storage | 10 TB | Organization |
| CPU cores | 5,000 vCPUs | Organization |

Contact support to request increased limits for production workloads.

## Frequently asked questions

**Q: When are credits deducted?**
A: Credits are deducted when each task completes, not when the entire workflow finishes. This provides real-time visibility into costs.

**Q: What happens if I run out of credits mid-pipeline?**
A: The pipeline automatically pauses, preserving completed work. After adding credits, you can resume from where it stopped without losing progress.

**Q: Why is memory billed at minimum 2GB per task?**
A: This ensures sustainable operation of the service and reflects the minimum viable container size in AWS.

**Q: How accurate are cost estimates?**
A: Cost estimates are typically within 10% of actual AWS charges. For precise accounting, use the billing CSV or AWS Cost Explorer with resource labels.

**Q: Can I set spending limits per workspace?**
A: Not currently. Credits are managed at the organization level. Use monitoring and alerts to track workspace-specific spending.

## Example: Understanding your bill

Consider a pipeline run with the following task:
- Requested: 4 vCPUs, 8 GB memory  
- Runtime: 2 hours
- Region: us-east-1

**Cost calculation:**
```
CPU cost:    4 vCPUs × 2 hours × $0.096/vCPU-hour = $0.768
Memory cost: 8 GB × 2 hours × $0.0128/GB-hour = $0.205
Task total:  $0.973
```

This cost appears in:
- Run details page (immediately after task completion)
- Organization/workspace credits view (real-time)
- Billing CSV (aggregated per workflow)
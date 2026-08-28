---
title: "Resource labels"
description: "Troubleshooting resource labels in Seqera Platform"
date: "24 Apr 2023"
tags: [troubleshooting, help]
---

When working with resource labels on AWS, Azure, and Google Cloud, you might encounter the following issues.

## Common issues

#### Tags not appearing in cost reports

Resource labels are applied to your cloud resources but don't appear in your provider's cost reporting tools. This is usually a propagation delay or a cost-reporting configuration gap. To resolve:

- Allow up to 24 hours for tags to appear in the AWS cost allocation console.
- For Azure, enable tag inheritance and allow 24 hours for processing.
- Verify that resources are actively running and generating usage data.

#### Permission errors

Tagging fails, or cost data is inaccessible, when the credentials associated with the compute environment lack tagging or billing permissions. To resolve:

- Ensure the compute environment credentials have the permissions required to tag resources.
- For Google Cloud, verify billing account administrator access.
- For Azure, confirm billing profile contributor permissions and permissions to view Cost Management reports.

#### Missing tag values in cloud provider resources

Resources launch without the expected tags, or dynamic label values are empty. This usually means the labels aren't attached to the compute environment the workflow ran on. To resolve:

- Verify that resource labels are applied to the correct compute environment.
- Check that workflows use the tagged compute environment.
- For dynamic resource labels, ensure variables use the correct syntax: `${sessionId}`, `${userName}`, or `${workflowId}`.

#### Costs missing for manually created AWS Batch queues

Costs for some AWS Batch runs never appear in Cost Explorer or your data exports, even though resource labels are applied. This happens when the compute environment or job queue was created manually, outside of Batch Forge, and so doesn't inherit Seqera's cost-allocation tags. To resolve:

- Add the relevant cost-allocation tag (for example, `project=<value>`) to the manually created compute environments, job queues, and related resources in the AWS console.
- Prefer Batch Forge-created compute environments where possible, so tags propagate automatically.

#### Cost data missing from the AWS data export

Resource labels are applied and cost-allocation tags are activated, but split or unblended cost fields are missing or show zero in your data export. To resolve:

- Confirm that the cost-allocation tag keys are activated in the **AWS Billing and Cost Management console** of the payer (billing) account.
- Enable [split cost allocation data](https://docs.aws.amazon.com/cur/latest/userguide/enabling-split-cost-allocation-data.html) in your Cost and Usage Report preferences — without it, downstream reporting returns blended-only or zero values.
- Allow a 24–48 hour delay for cost data to appear, then inspect the export (for example, query the Parquet files with Amazon Athena) to confirm the tag keys and their costs are present.

#### Resource label tag keys look different in the AWS Cost and Usage Report

Tag keys or values in the AWS Cost and Usage Report (CUR) don't match the resource labels you applied, breaking Athena or QuickSight queries. This is expected CUR normalization: in CUR (version 2), colons (`:`) are rewritten as underscores (`_`), and mixed- or upper-case characters are lowercased and separated with underscores (for example, `costCenter` becomes `cost_center`). To resolve:

- Design resource-label keys and values that remain unambiguous after normalization.
- Reference the normalized key names in your downstream Athena or QuickSight queries.

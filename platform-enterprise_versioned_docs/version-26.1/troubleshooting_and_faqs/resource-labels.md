---
title: "Resource labels"
description: "Troubleshooting resource labels in Seqera Platform"
date: "24 Apr 2023"
tags: [troubleshooting, help]
---

Common issues experienced with resource labels in AWS, Azure, and GCP:

**Tags not appearing in cost reports**:
- Allow up to 24 hours for tags to appear in AWS cost allocation console
- For Azure, enable tag inheritance and allow 24 hours for processing
- Verify that resources are actively running and generating usage data

**Permission errors**:
- Ensure compute environment credentials have the permissions required to tag resources
- For Google Cloud, verify billing account administrator access
- For Azure, confirm billing profile contributor permissions and appropriate permissions to view Cost Management reports

**Missing tag values in cloud provider resources**:
- Verify that resource labels are applied to the correct compute environment
- Check that workflows are using the tagged compute environment
- For dynamic resource labels, ensure variables use correct syntax: `${sessionId}`, `${userName}`, or `${workflowId}`,

**Costs missing for manually created AWS Batch queues**:
- Compute environments or job queues created manually, outside of Batch Forge, don't inherit Seqera's cost-allocation tags, so their costs don't appear in Cost Explorer or your data exports
- Add the relevant cost-allocation tag (for example, `project=<value>`) to the manually created compute environments, job queues, and related resources in the AWS console
- Prefer Batch Forge-created compute environments where possible, so tags propagate automatically

**Cost data missing from the AWS data export**:
- Confirm that the cost-allocation tag keys are activated in the AWS Billing and Cost Management console of the payer (billing) account
- Enable [split cost allocation data](https://docs.aws.amazon.com/cur/latest/userguide/enabling-split-cost-allocation-data.html) in your Cost and Usage Report preferences — without it, downstream reporting returns blended-only or zero values
- Allow a 24–48 hour delay for cost data to appear, then inspect the export (for example, query the Parquet files with Amazon Athena) to confirm the tag keys and their costs are present

**Resource label tag keys look different in the AWS Cost and Usage Report**:
- AWS Cost and Usage Reports (version 2) normalize tag characters: colons (`:`) are rewritten as underscores (`_`), and mixed- or upper-case characters are lowercased and separated with underscores (for example, `costCenter` becomes `cost_center`)
- Design resource-label keys and values that remain unambiguous after normalization, and reference the normalized key names in downstream Athena or QuickSight queries

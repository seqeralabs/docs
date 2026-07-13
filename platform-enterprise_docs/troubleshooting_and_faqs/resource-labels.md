---
title: "Resource labels"
description: "Troubleshooting resource labels in Seqera Platform"
date created: "2023-04-24"
last updated: "2026-07-06"
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

---
title: "Resource labels"
description: "Troubleshooting resource labels in Seqera Platform"
date: "24 Apr 2023"
tags: [troubleshooting, help]
---

Common issues with resource labels on AWS, Azure, and Google Cloud:

## Tags not appearing in cost reports

- Allow up to 24 hours for tags to appear in the AWS cost allocation console.
- For Azure, enable tag inheritance and allow 24 hours for processing.
- Verify that resources are actively running and generating usage data.

## Permission errors

- Ensure the compute environment credentials have the permissions required to tag resources.
- For Google Cloud, verify billing account administrator access.
- For Azure, confirm billing profile contributor permissions and permissions to view Cost Management reports.

## Missing tag values in cloud provider resources

- Verify that resource labels are applied to the correct compute environment.
- Check that workflows use the tagged compute environment.
- For dynamic resource labels, ensure variables use the correct syntax: `${sessionId}`, `${userName}`, or `${workflowId}`.

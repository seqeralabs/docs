---
title: "Resource labels"
description: "Troubleshooting resource labels in Seqera Platform"
date: "24 Apr 2023"
tags: [troubleshooting, help]
---

Common issues experienced with resource labels in AWS, Azure, and GCP:

**AWS Batch rejects a resource label defined in Nextflow configuration**:
- Seqera Platform validates the resource labels you create in a workspace, but resource labels defined with the Nextflow [`resourceLabels`](https://docs.seqera.io/nextflow/reference/process#resourcelabels) directive bypass that validation and reach AWS Batch unchanged
- AWS documents the [allowed characters for Batch tags](https://docs.aws.amazon.com/batch/latest/userguide/tag-restrictions.html) as letters, numbers, spaces, and `_ . : / = + - @`. AWS Batch rejects a job submission whose tag value contains any other character, and the run fails:

  ```text
  Error executing process > 'NFCORE_RNASEQ:RNASEQ:SORTMERNA_INDEX ([])'
  Caused by:
    Tags can only contain letters, numbers, spaces, and the following special characters: _ . : / = + - @ (Service: Batch, Status Code: 400)
  ```

- This affects any resource label whose value comes from a process or workflow property, such as `task.tag`. Square brackets are a common cause. In a process that declares the Nextflow `tag` directive as `tag "$meta.id"`, an empty `meta` input resolves `$meta.id` to an empty list, and the directive becomes the literal string `[]`
- To resolve, convert each resource label value to a string, replace the disallowed characters, and truncate to the AWS tag value limit of 256 characters. Replace the example keys and values below with your own:

  ```groovy title="nextflow.config"
  def sanitizeLabel(value) {
      // The character class is negated: it matches everything AWS Batch disallows
      "${value}".replaceAll(/[^A-Za-z0-9 _.:\/=+@-]/, '_').take(256)
  }

  process {
      // The closure is evaluated per task, so task and workflow properties resolve at submission
      resourceLabels = { [
          pipelineTag: sanitizeLabel(task.tag),
          pipelineContainer: sanitizeLabel(task.container),
          pipelineRevision: sanitizeLabel(workflow.revision),
          pipelineCommitId: sanitizeLabel(workflow.commitId),
      ] }
  }
  ```

- Converting each value to a string also protects against unset properties. `task.tag` and `task.container` are `null` when the process omits the matching directive, `workflow.revision` and `workflow.commitId` are `null` when the run has no Git revision, and string operations on `null` fail. A label that comes out as `__` or `null` records an empty or unset property rather than a usable value

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

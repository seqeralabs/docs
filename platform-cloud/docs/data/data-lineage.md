---
title: "Data Lineage"
description: "Using data lineage in Seqera Platform."
date created: "2026-05-04"
last updated: "2026-05-04"
tags: [data lineage, provenance, governance, reproducibility, lineage id, lid, label]
---

:::info
Data lineage in Platform is in public preview. It requires Nextflow v25.04 or later, and AWS S3 object storage.
:::

:::warning
The feature is experimental and subject to change. See this guide for the latest configuration recommendations and limitations.
:::

Data lineage tracks the full provenance of every pipeline run at both the task and workflow level, including what executed, what data it consumed, and what outputs it produced. Use it to audit results, verify reproducibility, and trace file provenance.

## Overview

Production pipelines generate results that teams need to trust, audit, and reproduce. Data lineage provides a precise, immutable record of how each result was produced.

- **Reproducibility**: Every run, task, and output file receives a unique lineage ID (LID), a traversable URI that points to a structured record of what ran. Verify that two runs produced identical results, or identify where they diverged.
- **Auditing and compliance**: For teams in regulated industries such as pharma, clinical genomics, and CROs, lineage provides the audit trail needed for regulatory compliance. Each record captures inputs, outputs, parameters, compute environment, and the user who launched the run.
- **Debugging**: When a cached task unexpectedly re-executes, or a pipeline produces an unexpected result, lineage traces backward from any output to all contributing tasks and parameters. Compare two task runs to isolate what changed.
- **Broader team access**: Exploring Nextflow lineage previously required CLI access and comfort reading raw JSON. Platform now surfaces lineage data in pipeline run detail pages and Data Explorer. Users can inspect provenance directly.
- **Cross-workflow discoverability**: [Workflow output labels][workflow-labels] make output files discoverable across runs. Navigate lineage records by label to find all matching outputs workspace-wide, without knowing which specific run produced a file.

## How data lineage works

Nextflow creates a structured JSON record for each entity in your pipeline when lineage is enabled:

| Record type | Description |
|---|---|
| **WorkflowRun** | Full pipeline execution: repository, commit ID, parameters, compute environment, session ID, and Platform context (user, workspace, pipeline) |
| **TaskRun** | Individual task execution: script, code checksum, inputs, outputs, container, and dependencies |
| **FileOutput** | Output file: path, checksum, size, timestamp, and links back to the task and workflow that produced it |

Each record gets a lineage ID (LID), a `lid://` URI that uniquely identifies the entity. Every LID and lineage label renders as a clickable link, and you can navigate to all related entities across your organization.

## Enable data lineage

To start collecting data lineage for all pipeline runs in your workspace, go to **Settings > Workspace Settings**. Select **Lineage** and define the credentials, region, and (optionally) storage bucket and path where lineage data is stored and indexed. Toggle the **Enable lineage by default** on to collect data lineage for all pipeline runs in the workspace or toggle off to require per pipeline launch configuration.

:::tip
If the storage bucket field is empty, a default bucket is generated for storing lineage data.
:::

Once set, all pipeline runs in the workspace generate data lineage. See [Lineage][workspace-lineage] for more information about the settings.

:::danger
Changing the lineage storage bucket path after lineage data is generated will result in historic data loss. The lineage index is tied to the lineage storage bucket. Changing it makes existing records inaccessible. To move the storage location, first copy all existing lineage data to the new bucket and path (for example, `aws s3 cp --recursive s3://old-bucket/path s3://new-bucket/path`), then update the workspace setting.
:::

When launching a pipeline in a data-lineage enabled workspace, the **Enable lineage** toggle in the pipeline **Run setup** reflects the **Enable lineage by default** workspace setting. This can be turned off to _explicitly exclude_ data lineage creation for the pipeline run.

### Additional IAM permissions required

If using existing AWS Batch or AWS Cloud compute environments with custom IAM roles, the following service role policies are required:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ListObjectsInBucket",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::seqera-lineage-<workspace-id>"
        },
        {
            "Sid": "AllObjectActions",
            "Effect": "Allow",
            "Action": "s3:*Object",
            "Resource": "arn:aws:s3:::seqera-lineage-<workspace-id>/*"
        },
        {
            "Sid": "AllowObjectTagging",
            "Effect": "Allow",
            "Action": [
                "s3:PutObjectTagging",
                "s3:GetObjectTagging"
            ],
            "Resource": "arn:aws:s3:::seqera-lineage-<workspace-id>/*"
        }
    ]
}
```

Platform integration credentials require the following additional permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sqs:CreateQueue",
                "sqs:GetQueueAttributes",
                "sqs:SetQueueAttributes",
                "sqs:GetQueueUrl",
                "sqs:ReceiveMessage",
                "sqs:DeleteMessage"
            ],
            "Resource": "arn:aws:sqs:*:*:seqera-lineage-*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:CreateBucket",
                "s3:GetBucketNotificationConfiguration",
                "s3:PutBucketNotificationConfiguration",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::seqera-lineage-*"
        }
    ]
}
```

### Advanced: Experimenting with data lineage

To test or troubleshoot data lineage for a _specific pipeline_, add the following to your **Nextflow config file** under **Advanced options** when _adding_ a pipeline to the launchpad.

```groovy
lineage.enabled = true
lineage.store.location = '<PATH_TO_STORAGE>'
```

To test for a _single pipeline run_, add the same code to your **Nextflow config file** under **Advanced options** when _launching_ the pipeline run.

:::warning
If data lineage is defined for a workspace, only that data is displayed in Platform. Any unique _specific pipeline_ or _single pipeline run_ lineage data is only accessible via the AWS S3 console and other related services (such as Amazon Athena).
:::

## Data lineage displayed in Platform

### Workflow run details

When a run was executed with lineage enabled, the [run details page][run-details] displays lineage data across the following tabs:

- **Run Info**: Shows the lineage ID, lineage labels, and the full Platform context captured at execution time: user, workspace, compute environment, pipeline name, revision, and commit ID.
- **Tasks**: Displays the lineage ID and lineage labels for each `TaskRun` alongside existing task data, so you can trace any task back to its lineage record. All task file inputs and outputs, and upstream and downstream tasks linked by lineage records, are displayed.
- **Inputs**: Lists all input datasets and parameters with file paths, types, and lineage IDs and lineage labels where available.
- **Outputs**: Lists all `FileOutput` records linked to the workflow run: output name, file path, type, lineage ID, and lineage labels. Files link directly to [Data Explorer][data-explorer].

:::tip
All LIDs and lineage labels are clickable links. Click any LID to open the organization-level lineage search pre-filled with that identifier.
:::

### Data Explorer

Output objects from a lineage-enabled run display their LID and any lineage labels when you preview the object in Data Explorer. You can trace any file back to the pipeline run that produced it.

## Lineage labels

Assign lineage labels to output files using the `label` directive in your Nextflow process definitions. Labels appear in lineage records and are searchable across your workspace.

Both Seqera Platform labels and Nextflow lineage labels propagate to lineage records. Seqera Platform excludes resource labels as they relate to underlying compute resources, not the data itself.

:::info
Nextflow lineage labels are immutable. They are set at execution time and cannot be changed. Seqera Platform labels are mutable. Updating Platform labels after a run completes can produce a mismatch between Platform run labels and lineage labels. This is expected behavior.
:::

{/* links */}
[workflow-labels]: https://docs.seqera.io/nextflow/workflow#labels
[workspace-lineage]: ../orgs-and-teams/workspace-management#lineage
[run-details]: ../monitoring/run-details
[data-explorer]: data-explorer

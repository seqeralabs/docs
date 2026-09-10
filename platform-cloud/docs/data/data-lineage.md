---
title: "Data lineage"
description: "Track and search the provenance of pipeline runs, tasks, and output files in Seqera Platform."
date created: "2026-05-04"
last updated: "2026-08-11"
tags: [data lineage, provenance, governance, reproducibility, lineage id, lid, labels, search]
---

:::info
Data lineage in Platform is in public preview. It requires Nextflow 25.04 or later, AWS S3 object storage, and Amazon Simple Notification Service (SNS). For best results, use Nextflow 26.04 or later.
:::

:::warning
The feature is experimental and subject to change. This page provides the latest configuration recommendations and limitations.
:::

Data lineage tracks the full provenance of every pipeline run at both the task and workflow level, including what executed, what data it consumed, and what outputs it produced. Use it to audit results, verify reproducibility, and trace file provenance.

## Why use data lineage

Production pipelines generate results that teams need to trust, audit, and reproduce. Data lineage provides a precise, immutable record of how each result was produced.

- **Reproducibility**: Every run, task, and output file receives a unique lineage ID (LID), a traversable URI that points to a structured record of what ran. Verify that two runs produced identical results, or identify where they diverged.
- **Auditing and compliance**: For teams in regulated industries such as pharma, clinical genomics, and contract research organizations (CROs), lineage provides the audit trail needed for regulatory compliance. Each record captures inputs, outputs, parameters, compute environment, and the user who launched the run.
- **Debugging**: When a cached task unexpectedly re-executes, or a pipeline produces an unexpected result, lineage traces backward from any output to all contributing tasks and parameters. Compare two task runs to isolate what changed.
- **Broader team access**: Exploring Nextflow lineage previously required CLI access and comfort reading raw JSON. Platform now surfaces lineage data in pipeline run detail pages and Data Explorer. Users can inspect provenance directly.
- **Cross-workflow discoverability**: [Workflow output labels][workflow-labels] make output files discoverable across runs. Navigate lineage records by label to find all matching outputs workspace-wide, without knowing which specific run produced a file.

## How data lineage works

When lineage is enabled, Nextflow generates a structured JSON record for each entity in your pipeline during workflow execution:

| Record type | Description |
|---|---|
| **WorkflowRun** | Full pipeline execution: repository, commit ID, parameters, compute environment, session ID, and Platform context (user, workspace, pipeline) |
| **TaskRun** | Individual task execution: script, code checksum, inputs, outputs, container, and dependencies |
| **FileOutput** | Output file: path, checksum, size, timestamp, and links back to the task and workflow that produced it |

Each record gets a lineage ID (LID), a `lid://` URI that uniquely identifies the entity. Every LID and lineage label renders as a clickable link, and you can navigate to all related entities across your organization.

### Functional flow

1. Nextflow appends lineage record objects (`*.data.json`) to the defined object storage bucket.
1. The bucket is configured to filter for objects matching `.data.json` and publishes `s3:ObjectCreated:*` events to an SNS topic.
1. The SNS topic pushes each event to a per-workspace Platform webhook over HTTPS. Platform never reads a queue in your account — your bucket only sends events outward.
1. Platform verifies each delivery, buffers it, then reads the lineage object from the bucket and indexes it in the database.
1. The index enriches the [run details][run-details].
1. The index enriches the display of workflow-generated objects in Data Explorer with links to the origin pipeline run and task, sources of the object, and any lineage labels associated with the object.

The webhook URL is unique to the workspace and is shown on the workspace lineage settings page once the configuration is saved. The settings page also reports an **Event delivery** status, so you can tell whether events are actually arriving.

## Enable data lineage

To start collecting data lineage for all pipeline runs in your workspace:

1. Open **Settings > Workspace settings**.
2. Select **Lineage**. If you don't see **Lineage** listed, contact your system administrator.
3. Toggle the **Enable lineage by default** on to collect data lineage for all pipeline runs in the workspace or toggle off to require per pipeline launch configuration. Choose either a **Manual** or an **Automatic** configuration for lineage resources:
    - **Manual**: Use your own pre-provisioned bucket and SNS topic. Define the credentials, region, bucket name, and SNS topic ARN. After saving, subscribe the webhook URL shown on the settings page to your topic. See [Manual configuration](#manual-configuration).
    - **Automatic**: Define the credentials and region. Platform creates the bucket, the SNS topic, the topic policies, the webhook subscription, and the bucket notification rule. This is the default setting.
4. Once set and enabled, all pipeline runs in the workspace generate data lineage. See [Lineage][workspace-lineage] for more information about the settings.

:::danger
Updating the lineage settings after pipelines have generated lineage data will result in historic data loss. The lineage index is tied to the lineage storage bucket and path. Changing it makes existing records inaccessible. To avoid data loss when updating the storage location, first copy all existing lineage data to the new bucket and path (for example, `aws s3 cp --recursive s3://old-bucket/path s3://new-bucket/path`), then update the workspace setting.
:::

When launching a pipeline in a data-lineage enabled workspace, the **Enable lineage** toggle in the pipeline **Run setup** reflects the **Enable lineage by default** workspace setting. Turn it off to _explicitly exclude_ data lineage for the pipeline run.

:::tip
Maintain role users and above can toggle lineage on or off when launching a specific pipeline run.
:::

### IAM permissions required

Data lineage requires additional AWS IAM permissions. The permissions required depend on the role:

- **Platform integration credentials** (IAM user): see [AWS Batch — Data lineage](../compute-envs/aws-batch#data-lineage-optional) or [AWS Cloud — Data lineage](../compute-envs/aws-cloud#data-lineage-optional)
- **EC2 instance role / head job role** (manually managed): see [Manual AWS Batch configuration](../enterprise/advanced-topics/manual-aws-batch-setup#create-an-ec2-instance-role)

Lineage credentials grant no queue permissions. Platform never reads messaging infrastructure in your account — your bucket publishes events outward to an SNS topic, which pushes them to Platform.

In **Manual** mode, Platform makes no control-plane calls other than confirming its own webhook subscription, so the credentials need only:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ReadLineageBucket",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::<your-lineage-bucket>",
                "arn:aws:s3:::<your-lineage-bucket>/*"
            ]
        },
        {
            "Sid": "ConfirmLineageWebhook",
            "Effect": "Allow",
            "Action": [
                "sns:ConfirmSubscription"
            ],
            "Resource": "arn:aws:sns:<region>:<account>:<your-lineage-topic>"
        }
    ]
}
```

### Manual configuration

In **Manual** mode you own the bucket, the topic, and the subscription. Before saving the workspace settings:

1. Create the S3 bucket and the SNS topic.
1. Attach a topic access policy that allows the bucket to publish to the topic:

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowBucketToPublishEvents",
          "Effect": "Allow",
          "Principal": { "Service": "s3.amazonaws.com" },
          "Action": "sns:Publish",
          "Resource": "arn:aws:sns:<region>:<account>:<your-lineage-topic>",
          "Condition": {
            "ArnEquals": {
              "aws:SourceArn": "arn:aws:s3:::<your-lineage-bucket>"
            }
          }
        }
      ]
    }
    ```

1. Configure a bucket notification rule that sends `s3:ObjectCreated:*` events for the `.data.json` suffix to the topic:

    ```json
    {
      "TopicConfigurations": [
        {
          "Id": "LineageRecordCreated",
          "TopicArn": "arn:aws:sns:<region>:<account>:<your-lineage-topic>",
          "Events": ["s3:ObjectCreated:*"],
          "Filter": {
            "Key": {
              "FilterRules": [
                { "Name": "suffix", "Value": ".data.json" }
              ]
            }
          }
        }
      ]
    }
    ```

1. Grant the compute environment's IAM role read/write access to the bucket. See [Manual AWS Batch configuration](../enterprise/advanced-topics/manual-aws-batch-setup#create-an-ec2-instance-role).

Then save the workspace lineage settings, copy the **Webhook URL** shown on the settings page, and subscribe it to your topic:

```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:<region>:<account>:<your-lineage-topic> \
  --protocol https \
  --notification-endpoint '<webhook URL from the lineage settings page>'
```

SNS immediately posts a subscription confirmation to the endpoint, which Platform verifies and confirms with the workspace's lineage credentials. The **Event delivery** badge on the settings page moves from **Awaiting confirmation** to **Active**.


:::note
The `.data.json` suffix filter is recommended to reduce cost and delivery volume, but it is not required — Platform discards any event whose object key does not end in `.data.json`.
:::

### Lineage labels

Assign lineage labels to output files using the `label` directive in your Nextflow process definitions. Labels appear in lineage records.

Both Platform labels and Nextflow lineage labels propagate to lineage records. Platform excludes resource labels because they relate to underlying compute resources, not the data itself.

:::info
Nextflow lineage labels are **immutable**. They are set at execution time and cannot be changed. Platform labels are _mutable_ by design and can change after a run launches. Changing Platform labels after launch produces a mismatch between Platform run labels and Nextflow lineage labels.
:::

### Changing or disabling data lineage

If data lineage is **changed** from automatically-provisioned to manually-provisioned:

- **New object storage bucket**: The bucket notification rule is cleared, and the Platform-managed SNS topic and its subscription are deleted. Some events may be missed. The bucket and its data are preserved.
- **Same object storage bucket, different SNS topic**: The bucket notification rule is redirected to the new topic ARN, and the old Platform-managed topic and subscription are deleted. Some events may be missed. The bucket and its data are preserved.
- **Same object storage bucket, same SNS topic**: No cloud provider resources change. All events, the bucket, and its data are preserved.

If data lineage is **changed** from manually provisioned to automatically provisioned, Platform creates a new object storage bucket, SNS topic, subscription, and bucket notification rule. Your previously defined bucket and data, topic, and notification rule are preserved.

If data lineage is **deactivated** with **Disable lineage**:

- **Automatically provisioned**: The notification rule is cleared on the bucket, and the Platform-managed topic and subscription are deleted. Bucket and data are preserved.
- **Manually provisioned**: No change to cloud resources. Bucket, topic, and data are preserved.

In both cases you can configure lineage again at any time. Records already written to the bucket are re-indexed once delivery is restored.

## Data lineage displayed in Platform

### Workflow run details

When a run was executed with lineage enabled, the [run details page][run-details] displays lineage data across the following tabs:

- **Run Info**: Shows the lineage ID, lineage labels, and the full Platform context captured at execution time: user, workspace, compute environment, pipeline name, revision, and commit ID.
- **Tasks**: Displays the lineage ID and lineage labels for each `TaskRun` alongside existing task data. You can trace any task back to its lineage record. All task file inputs and outputs, and upstream and downstream tasks linked by lineage records, are displayed.
- **Inputs**: Lists all input datasets and parameters with file paths, types, and lineage IDs and lineage labels where available.
- **Outputs**: Lists all `FileOutput` records linked to the workflow run: output name, file path, type, lineage ID, and lineage labels. Files link directly to [Data Explorer][data-explorer].

:::tip
All LIDs and lineage labels are clickable links. Click any LID to open [lineage search](#search-lineage-records) pre-filled with that identifier.
:::

:::note
If more than one Nextflow run publishes a file to the same destination, there are **two** lineage records. The `FileOutput` records for published files are saved under the lineage ID of the workflow run and can be used to differentiate them.
:::

### Data Explorer

Output objects from a lineage-enabled run display their LID and any lineage labels when you preview the object in Data Explorer. You can trace any file back to the pipeline run that produced it.

## Search lineage records

Use the search bar in the top navigation to find workflow runs, tasks, and output files across every workspace you can access. Search covers only workspaces that have lineage enabled and in which you are a participant.

Results are ordered by most recently indexed. An empty query returns the most recent records across all accessible workspaces. As you type, the field suggests keywords and, where supported, values.

### Search syntax

A query is a series of space-separated tokens. Each token is either a `qualifier:value` pair or free text. Three rules apply to every qualifier:

- A space between tokens is **AND**: `type:file label:qc` returns output files that carry the `qc` label.
- A comma inside a value is **OR**: `type:workflow,task` returns workflow runs and tasks.
- Repeating a qualifier is **AND**: `label:qc label:validated` returns records carrying both labels.

Qualifier names and free text are case-insensitive. Free text matches any substring of the record value. For example, `salmon` matches any record whose value contains `salmon`.

:::caution
A record has exactly one type and lives in exactly one workspace. Repeating `type:` or `workspace:` returns an empty list because no record can match both values. For example, `type:workflow type:file` requires a record to be both a workflow run and a file. Use the comma form `type:workflow,file` to match either type.
:::

### Qualifiers

| Qualifier | Accepts | Description |
| --- | --- | --- |
| `type:` | `workflow`, `task`, `file` | Restrict results to a record type. Also accepts the internal names `WorkflowRun`, `TaskRun`, and `FileOutput`. |
| `label:` | Any label | Records tagged with the label. Covers both Platform labels and Nextflow lineage labels. |
| `workspace:` | `organization/workspace` | Scope the search to one or more workspaces by fully qualified name. |
| `workspaceId:` | Numeric workspace ID | Numeric alias for `workspace:`. |
| `workflow:` | A `WorkflowRun` LID | Scope the search to a single run. Results include the run itself, its tasks, and its published output files. |
| `task:` | A `TaskRun` LID | Scope the search to a single task. Results include the task itself and the output files in its work directory. |
| Free text | Any string | Case-insensitive substring match on the record value. |

The field suggests `workspace:`, `type:`, and `label:` as you type. Enter the remaining qualifiers manually.

`workspace:` and `workspaceId:` set the scope of a search rather than filter its results. A query that contains only a workspace still returns that workspace's most recent records. Omit both to search every workspace available to you. Referencing a workspace you do not participate in returns an error rather than an empty list.

### Examples

| Query | Returns |
| --- | --- |
| `type:workflow,task` | Workflow run or task records |
| `label:qc,validated` | Records labeled `qc` or `validated` |
| `label:qc label:validated` | Records labeled both `qc` and `validated` |
| `label:qc,draft label:validated` | Records labeled `validated` and either `qc` or `draft` |
| `type:file salmon` | Output files whose value contains `salmon` |
| `workspace:acme/dev label:qc` | Records labeled `qc` in the `acme/dev` workspace |
| `workspace:acme/dev,acme/prod` | Records in the `acme/dev` or `acme/prod` workspace |
| `workspace:acme/dev workspace:acme/prod` | Nothing, because a record lives in one workspace. Use the comma form instead. |
| `workflow:lid://abc123` | The run `lid://abc123`, its tasks, and its published output files |
| `workflow:lid://abc123 type:task` | The tasks of run `lid://abc123` |
| `task:lid://abc123 type:file` | The output files of task `lid://abc123` |

:::tip
Lineage search is also available through the Platform API. The `GET /lineage/search` endpoint accepts the same query syntax in its `q` parameter and returns paginated results. See the [Platform API reference][platform-api] for the full set of lineage endpoints.
:::

## Advanced: Experimenting with data lineage

To test or troubleshoot data lineage for a _specific pipeline_, add the following to your **Nextflow config file** under **Advanced options** when _adding_ a pipeline to the launchpad.

```groovy
lineage.enabled = true
lineage.store.location = '<PATH_TO_STORAGE>'
```

To test for a _single pipeline run_, add the same code to your **Nextflow config file** under **Advanced options** when _launching_ the pipeline run.

:::warning
If data lineage is defined for a workspace, only that data is displayed in Platform. Any unique _specific pipeline_ or _single pipeline run_ lineage data is only accessible via the AWS S3 console and other related services (such as Amazon Athena).
:::

## Costs associated with data lineage

Monthly S3 object storage and SNS notification costs scale based on the number of pipeline runs launched with lineage enabled. Each lineage record written to the bucket produces one SNS notification delivery.

Filtering bucket notifications to the `.data.json` suffix keeps delivery volume — and therefore cost — proportional to the lineage records themselves rather than to all bucket activity.

{/* links */}
[workflow-labels]: https://docs.seqera.io/nextflow/workflow#labels
[workspace-lineage]: ../orgs-and-teams/workspace-management#lineage
[run-details]: ../monitoring/run-details
[data-explorer]: data-explorer
[platform-api]: https://docs.seqera.io/platform-api

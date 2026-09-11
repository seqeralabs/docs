---
title: "Data lineage"
description: "Track and search the provenance of pipeline runs, tasks, and output files in Seqera Platform."
date created: "2026-05-11"
last updated: "2026-08-11"
tags: [data lineage, provenance, governance, reproducibility, lineage id, lid, labels, search]
---

:::info
Data lineage in Platform is in public preview. It is supported in AWS compute environments. It requires Nextflow v25.04 or later, AWS S3 object storage, and Amazon Simple Notification Service (SNS).
:::

:::warning
The feature is experimental and subject to change.
:::

Data lineage tracks the full provenance of every pipeline run at both the task and workflow level, including what executed, what data it consumed, and what outputs it produced. Use it to audit results, verify reproducibility, and trace file provenance.

## Why use data lineage

Production pipelines generate results that teams need to trust, audit, and reproduce. Data lineage provides a precise, immutable record of how each result was produced.

- **Reproducibility**: Every run, task, and output file receives a unique lineage ID (LID), a traversable URI that points to a structured record of what ran. Verify that two runs produced identical results, or identify where they diverged.
- **Auditing and compliance**: For teams in regulated industries such as pharma, clinical genomics, and contract research organizations (CROs), lineage provides the audit trail needed for regulatory compliance. Each record captures inputs, outputs, parameters, compute environment, and the user who launched the run.
- **Debugging**: When a cached task re-executes, or a pipeline produces an unexpected result, lineage traces backward from any output to all contributing tasks and parameters. Compare two task runs to isolate what changed.
- **Broader team access**: Exploring Nextflow lineage previously required CLI access and the ability to read raw JSON. Platform now surfaces lineage data on pipeline run detail pages and in Data Explorer.
- **Discovery across runs**: [Workflow output labels][workflow-labels] make output files discoverable across runs. Navigate lineage records by label to find all matching outputs workspace-wide, without knowing which specific run produced a file.

## Lineage records and event delivery

Nextflow creates a structured JSON record for each entity in your pipeline when lineage is enabled:

| Record type | Description |
|---|---|
| **WorkflowRun** | Full pipeline execution: repository, commit ID, parameters, compute environment, session ID, and Platform context (user, workspace, pipeline) |
| **TaskRun** | Individual task execution: script, code checksum, inputs, outputs, container, and dependencies |
| **FileOutput** | Output file: path, checksum, size, timestamp, and links back to the task and workflow that produced it |

Each record gets a lineage ID (LID), a `lid://` URI that uniquely identifies the entity.

### Functional flow

1. Nextflow appends lineage record objects (`*.data.json`) to the configured object storage bucket.
1. The bucket filters for objects matching `.data.json` and publishes `s3:ObjectCreated:*` events to an SNS topic.
1. The SNS topic pushes each event to a per-workspace Platform webhook over HTTPS.
1. Platform verifies each delivery, buffers it, then reads the lineage object from the bucket and indexes it in the database.
1. The index enriches the [run details][run-details] and the display of workflow-generated objects in Data Explorer.

:::info
Because delivery is a push over HTTPS, `TOWER_SERVER_URL` must resolve to an **HTTPS** endpoint that AWS can reach from the public internet. SNS refuses plain HTTP and cannot resolve a private address. An installation AWS cannot reach receives no lineage events. The records are still written to your bucket, and Platform indexes them once delivery is established.
:::

:::note
Lineage event ingestion moved from polling an Amazon SQS queue to SNS notifications pushed to Platform. If you are upgrading an installation that already has lineage configured, see [Data lineage event ingestion moves from SQS to SNS](../enterprise/upgrade#data-lineage-event-ingestion-moves-from-sqs-to-sns) for the permissions needed during the upgrade.
:::

## Enable data lineage

To start collecting data lineage for all pipeline runs in your workspace:

1. Open **Settings > Workspace settings**.
2. Select **Lineage**. If you don't see **Lineage** listed, contact your system administrator.
3. Toggle **Enable lineage by default** on to collect data lineage for all pipeline runs in the workspace, or off to require per-pipeline launch configuration. Choose either a **Manual** or an **Automatic** configuration for lineage resources:
    - **Manual**: Use your own pre-provisioned bucket and SNS topic. Define the credentials, region, bucket name, and SNS topic ARN. After saving, subscribe the webhook URL shown on the settings page to your topic. See [Configure lineage manually](#configure-lineage-manually).
    - **Automatic**: Define the credentials and region. Platform creates the bucket, the SNS topic, the topic policies, the webhook subscription, and the bucket notification rule. This is the default setting.
4. Once set and enabled, all pipeline runs in the workspace generate data lineage. See [Lineage][workspace-lineage] for more information about the settings.

:::danger
Updating the lineage settings after pipelines have generated lineage data will result in historical data loss. The lineage index is tied to the lineage storage bucket and path. Changing it makes existing records inaccessible. To avoid data loss when updating the storage location, first copy all existing lineage data to the new bucket and path (for example, `aws s3 cp --recursive s3://old-bucket/path s3://new-bucket/path`), then update the workspace setting.
:::

When launching a pipeline in a data-lineage enabled workspace, the **Enable lineage** toggle in the pipeline **Run setup** reflects the **Enable lineage by default** workspace setting. Turn it off to _explicitly exclude_ data lineage for the pipeline run.

:::tip
Maintain role users and above can toggle lineage on or off when launching a specific pipeline run.
:::

### Additional IAM permissions required

If you use existing AWS Batch or AWS Cloud compute environments with custom IAM roles, the following service role policies are required:

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

Platform integration credentials require the following additional permissions for **Automatic** provisioning, which creates the bucket, the notification topic, and the webhook subscription:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ManageNotificationTopics",
            "Effect": "Allow",
            "Action": [
                "sns:CreateTopic",
                "sns:SetTopicAttributes",
                "sns:Subscribe",
                "sns:ConfirmSubscription",
                "sns:Unsubscribe",
                "sns:DeleteTopic"
            ],
            "Resource": "arn:aws:sns:*:*:seqera-lineage-*"
        },
        {
            "Sid": "ManageLineageBuckets",
            "Effect": "Allow",
            "Action": [
                "s3:CreateBucket",
                "s3:GetBucketNotification",
                "s3:PutBucketNotification",
                "s3:GetBucketLocation",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::seqera-lineage-*",
                "arn:aws:s3:::seqera-lineage-*/*"
            ]
        }
    ]
}
```

No `sqs:*` permission is required. Platform holds no permission over messaging infrastructure in your account.

:::note
`sns:ConfirmSubscription` and `s3:ListBucket` are both required, and both fail quietly if omitted:

- Without `sns:ConfirmSubscription`, provisioning completes and the workspace reports as configured, but **Event delivery** shows **Failed** and nothing is indexed. Platform completes the SNS handshake through the API. The permission is required even though a subscription can also be confirmed by hand in a browser.
- Without `s3:ListBucket`, rebuilding a workspace's lineage index from its bucket fails with `AccessDenied`. Reindexing pages the store with `ListObjectsV2`.
:::

In **Manual** mode, Platform makes no control-plane calls other than confirming its own webhook subscription. The credentials need only:

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

### Configure lineage manually

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

1. Grant the compute environment's IAM role read/write access to the bucket, using the service role policy shown earlier.

Then save the workspace lineage settings, copy the **Webhook URL** shown on the settings page, and subscribe it to your topic:

```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:<region>:<account>:<your-lineage-topic> \
  --protocol https \
  --notification-endpoint '<webhook URL from the lineage settings page>'
```

SNS immediately posts a subscription confirmation to the endpoint, which Platform verifies and confirms with the workspace's lineage credentials. The **Event delivery** badge on the settings page moves from **Awaiting confirmation** to **Active**.

:::tip
Set a delivery policy on your topic or subscription to widen the retry schedule. The AWS default of three attempts over roughly a minute drops events across an ordinary Platform restart. Automatically provisioned topics use a wider schedule for this reason. Tune it with `TOWER_LINEAGE_SNS_MAX_RETRIES` and `TOWER_LINEAGE_SNS_MAX_DELAY_SECONDS`.
:::

:::note
The `.data.json` suffix filter is recommended to reduce cost and delivery volume, but it is not required. Platform discards any event whose object key does not end in `.data.json`.
:::

### Event delivery status

Once the settings are saved, the lineage settings page reports **Event delivery** — **Active**, **Awaiting confirmation**, **Failed**, or **Not configured** — alongside the workspace's **Webhook URL**. Delivery status is independent of the configuration status. A workspace can be configured and writable while Platform receives nothing.

If delivery does not become **Active**, confirm that AWS can reach the installation over public HTTPS and that the lineage credentials grant `sns:ConfirmSubscription`. Records already written to the bucket are intact and are re-indexed once delivery resumes.

### Test lineage for a single pipeline or run

To test or troubleshoot data lineage for a _specific pipeline_, add the following to your **Nextflow config file** under **Advanced options** when _adding_ a pipeline to the Launchpad.

```groovy
lineage.enabled = true
lineage.store.location = '<PATH_TO_STORAGE>'
```

To test for a _single pipeline run_, add the same code to your **Nextflow config file** under **Advanced options** when _launching_ the pipeline run.

:::warning
If data lineage is defined for a workspace, only that data is displayed in Platform. Any unique _specific pipeline_ or _single pipeline run_ lineage data is only accessible via the AWS S3 console and other related services (such as Amazon Athena).
:::

## Lineage in the Platform UI

Platform surfaces lineage data on the run details page and in Data Explorer.

### Workflow run details

For a run executed with lineage enabled, the [run details page][run-details] displays lineage data across the following tabs:

- **Run Info**: Shows the lineage ID, lineage labels, and the full Platform context captured at execution time, including user, workspace, compute environment, pipeline name, revision, and commit ID.
- **Tasks**: Displays the lineage ID and lineage labels for each `TaskRun` alongside existing task data. You can trace any task back to its lineage record. All task file inputs and outputs, and upstream and downstream tasks linked by lineage records, are displayed.
- **Inputs**: Lists all input datasets and parameters with file paths, types, and lineage IDs and lineage labels where available.
- **Outputs**: Lists all `FileOutput` records linked to the workflow run, including output name, file path, type, lineage ID, and lineage labels. Files link directly to [Data Explorer][data-explorer].

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

## Lineage labels

Assign lineage labels to output files using the `label` directive in your Nextflow process definitions. Both Seqera Platform labels and Nextflow lineage labels propagate to lineage records. Seqera Platform excludes resource labels because they relate to underlying compute resources, not the data itself.

:::info
Nextflow sets lineage labels at execution time, and they cannot be changed. Seqera Platform labels are mutable. Updating Platform labels after a run completes can produce a mismatch between Platform run labels and lineage labels. This is expected behavior.
:::

{/* links */}
[workflow-labels]: https://docs.seqera.io/nextflow/workflow#labels
[workspace-lineage]: ../orgs-and-teams/workspace-management#lineage
[run-details]: ../monitoring/run-details
[data-explorer]: data-explorer
[platform-api]: https://docs.seqera.io/platform-api

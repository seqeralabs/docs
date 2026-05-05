---
title: "Data Lineage"
description: "Using data lineage in Seqera Platform."
date created: "2026-05-04"
last updated: "2026-05-04"
tags: [data lineage, provenance, governance, reproducibility, lineage id, lid, label]
---

:::info
Data lineage in Platform is in public preview. It requires Nextflow v25.04 or later. Enable it per-pipeline (`lineage.enabled = true` in your Nextflow config) or workspace-wide via the **Lineage** workspace setting.

The feature is experimental and subject to change. See this guide for the latest configuration recommendations and limitations.
:::

Data lineage tracks the full provenance of every pipeline run at both the task and workflow level, including what executed, what data it consumed, and what outputs it produced. Use it to audit results, verify reproducibility, and trace file provenance.

## Why data lineage matters

Production pipelines generate results that teams need to trust, audit, and reproduce. Data lineage provides a precise, immutable record of how each result was produced.

- **Reproducibility**: Every run, task, and output file receives a unique lineage ID (LID), a traversable URI that points to a structured record of what ran. Verify that two runs produced identical results, or identify where they diverged.
- **Auditing and compliance**: For teams in regulated industries such as pharma, clinical genomics, and CROs, lineage provides the audit trail needed for regulatory compliance. Each record captures inputs, outputs, parameters, compute environment, and the user who launched the run.
- **Debugging**: When a cached task unexpectedly re-executes, or a pipeline produces an unexpected result, lineage traces backward from any output to all contributing tasks and parameters. Compare two task runs to isolate what changed.
- **Broader team access**: Exploring Nextflow lineage previously required CLI access and comfort reading raw JSON. Platform now surfaces lineage data in pipeline run detail pages and Data Explorer. Users can inspect provenance directly.
- **Cross-workflow discoverability**: [Workflow output labels][workflow-labels] make output files discoverable across runs. Query lineage records by label to find all matching outputs workspace-wide, without knowing which specific run produced a file.

## How data lineage works

Nextflow creates a structured JSON record for each entity in your pipeline when lineage is enabled:

| Record type | Description |
|---|---|
| **WorkflowRun** | Full pipeline execution: repository, commit ID, parameters, compute environment, session ID, and Platform context (user, workspace, pipeline) |
| **TaskRun** | Individual task execution: script, code checksum, inputs, outputs, container, and dependencies |
| **FileOutput** | Output file: path, checksum, size, timestamp, and links back to the task and workflow that produced it |

Each record gets a lineage ID (LID), a `lid://` URI that uniquely identifies the entity. Every LID and lineage label renders as a clickable link, letting you navigate to all related entities across your organization.

### Configure workspace settings

Before collecting lineage data, configure the lineage storage location for your workspace. Go to **Workspace Settings** and open the [**Lineage** settings][workspace-lineage] to set the storage bucket and path where lineage data is stored and indexed. This applies to all pipeline runs in the workspace.

:::danger
Changing the lineage storage bucket path after lineage data is generated results in historic data loss. The lineage index is tied to this location. Changing it makes existing records inaccessible. To move the storage location, first copy all existing lineage data to the new bucket and path (for example, `aws s3 cp --recursive s3://old-bucket/path s3://new-bucket/path`), then update the workspace setting.
:::

### Enable per pipeline lineage in Nextflow

To test lineage within a single pipeline, add the following to your Nextflow config file before running your pipeline:

```groovy
lineage.enabled = true
lineage.store.location = '<PATH_TO_STORAGE>'
```

Only runs executed with this setting generate lineage data. Runs without it display a note on the **Run Info** tab:

> *Lineage tracking was not enabled for this run. Add `lineage.enabled = true` to your Nextflow config to capture lineage data.*

## Data lineage displayed in Seqera Platform

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

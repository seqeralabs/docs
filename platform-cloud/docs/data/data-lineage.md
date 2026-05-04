---
title: "Data Lineage"
description: "Using data lineage in Seqera Platform."
date created: "2026-05-04"
last updated: "2026-05-04"
tags: [data lineage data-lineage provenance governance reproducibility lineage-id lid label]
---

:::info
Data lineage in Platform is in public preview. It requires Nextflow v25.04 or later. Enable it per-pipeline (`lineage.enabled = true` in your Nextflow config) or workspace-wide via the **Lineage** workspace setting.

The feature is experimental and subject to change. See this guide for the latest configuration recommendations and limitations.
:::

Data lineage tracks the full provenance of every pipeline run at both the task and workflow level, including what executed, what data it consumed, and what outputs it produced. Use it to audit results, verify reproducibility, and trace file provenance.

## Why data lineage matters

Production pipelines generate results that teams need to trust, audit, and reproduce. Data lineage answers the question "how exactly was this result produced?" with a precise, immutable record.

- **Reproducibility**: Every run, task, and output file receives a unique **lineage ID (LID)** — a traversable URI pointing to a structured record of exactly what ran. You can verify that two runs produced identical results, or identify precisely where they diverged.
- **Auditing and compliance**: For teams in regulated industries (pharma, clinical genomics, CROs), lineage provides the audit trail needed for regulatory compliance. Each record captures inputs, outputs, parameters, compute environment, and the user who launched the run.
- **Debugging**: When a cached task unexpectedly re-executes or a pipeline produces an unexpected result, lineage lets you trace backward from any output to all contributing tasks and parameters. You can compare two task runs to isolate exactly what changed.
- **Broader team access**: Previously, exploring Nextflow lineage required CLI access and comfort reading raw JSON. Lineage data is surfaced in both pipeline run details pages and Data Explorer, so users can inspect provenance directly.
- **Cross-workflow discoverability**: [Workflow output labels][workflow-labels] make output files discoverable across runs. Rather than knowing which specific run produced a file, query lineage records by label to find all matching outputs workspace-wide.

## How data lineage works

Nextflow creates a structured JSON record for each entity in your pipeline when lineage is enabled:

| Record type | Description |
|---|---|
| **WorkflowRun** | Full pipeline execution: repository, commit ID, parameters, compute environment, session ID, and Platform context (user, workspace, pipeline) |
| **TaskRun** | Individual task execution: script, code checksum, inputs, outputs, container, and dependencies |
| **FileOutput** | Output file: path, checksum, size, timestamp, and links back to the task and workflow that produced it |

Each record gets a **lineage ID (LID)** — a `lid://` URI that uniquely identifies the entity. LIDs are navigable: every LID and lineage label is a clickable link that queries all related entities across your organization.

### Configure workspace settings

Before collecting lineage data, configure the lineage storage location for your workspace. Go to **Workspace Settings** and open the [**Lineage** settings][workspace-lineage] to set the storage bucket and path where the lineage data is stored and indexed. This applies to **all** pipeline runs in the workspace.

:::danger
Changing the lineage storage bucket path after runs have generated lineage data will result in historic data loss. The lineage index is tied to this location — changing it makes existing records inaccessible. If you need to move the lineage data storage location, first copy all existing lineage data to the new bucket and path (for example, `aws s3 cp --recursive s3://old-bucket/path s3://new-bucket/path`), then update the workspace setting.
:::

### Enable per pipeline lineage in Nextflow

To test lineage within a single pipeline, add the following to your Nextflow configuration file before running your pipeline:

```groovy
lineage.enabled = true
lineage.store.location = '<PATH_TO_STORAGE>'
```

Only runs executed with this setting generate lineage data. Runs without it display a note on the Run Info tab:

> *Lineage tracking was not enabled for this run. Add `lineage.enabled = true` to your Nextflow config to capture lineage data.*

## Data lineage displayed in Seqera Platform

### Workflow run details

When a run was executed with lineage enabled, the [run details page][run-details] displays lineage data across the following tabs:

**Run Info** — shows the lineage ID, lineage labels, and the full Platform context captured at execution time: user, workspace, compute environment, pipeline name, revision, and commit ID.

**Tasks** — displays the lineage ID and lineage labels for each `TaskRun` alongside existing task data, so you can trace any task back to its lineage record. All task file inputs and outputs, and upstream and downstream tasks linked by lineage records are displayed.

**Inputs** — lists all input datasets and parameters with file paths, types, and lineage IDs and lineage labels where available.

**Outputs** — lists all `FileOutput` records linked to the workflow run: output name, file path, type, lineage ID, and lineage labels. Files link directly to [Data Explorer][data-explorer].

:::tip
All LIDs and lineage labels are clickable links. Clicking any LID opens the organization-level lineage search pre-filled with that identifier.
:::

### Data Explorer

Output objects generated by a lineage-enabled run display the **LID** and any **lineage labels** when you preview the object in Data Explorer. This lets you trace any file back to the pipeline run that produced it.

## Lineage labels

Assign lineage labels to output files using the `label` directive in your Nextflow process definitions. Labels appear in lineage records and are searchable across your workspace.

Both Seqera Platform labels and Nextflow lineage labels propagate to lineage records. Seqera Platform excludes **resource labels** — they relate to underlying compute resources, not the data itself.

:::info
Nextflow lineage labels are **immutable** — they are set at execution time and cannot be changed. Seqera Platform labels are **mutable**. If you update Platform labels after a run completes, a mismatch between Platform run labels and lineage labels is possible. This is expected behavior.
:::

{/* links */}
[workflow-labels]: https://docs.seqera.io/nextflow/workflow#labels
[workspace-lineage]: ../orgs-and-teams/workspace-management#lineage
[run-details]: ../monitoring/run-details
[data-explorer]: data-explorer

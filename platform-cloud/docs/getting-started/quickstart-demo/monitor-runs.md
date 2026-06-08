---
title: "Monitor runs"
description: "Monitor pipeline runs from the Runs page, All runs page, and Dashboard in Seqera Platform"
date created: "2024-07-08"
last updated: "2026-06-08"
tags: [platform, runs, monitoring]
---

After you [launch a pipeline](./launch-pipelines), Seqera Platform provides three views to monitor the progress and status of your runs:

- The [**Runs** page](#runs) lists the runs in a single workspace.
- The [**All runs** page](#all-runs) lists runs across all your organizations and workspaces.
- The [**Dashboard**](#dashboard) summarizes run status totals across all your organizations and workspaces.

## Runs

Select **Runs** in the left-hand navigation to view the full run history of a workspace. Each row corresponds to one run and displays its status. Select a run to view its [run details](../../monitoring/run-details), including the tasks, jobs, metrics, configuration, inputs, outputs, containers, and run info.

## All runs

Access the **All runs** page from the user menu. This page lists runs across the entire Platform instance. The default view includes all organizations and workspaces you can access. To limit the view to specific workspaces, select the dropdown next to **View**.

Filter the list with free text and one or more `keyword:value` terms in the search field:

- `status`: Runs with a given status: `submitted`, `running`, `succeeded`, `failed`, `cancelled`, or `unknown`.
- `label`: Runs with a given label. Repeat the keyword to filter by multiple labels.
- `workflowId`: The run with a given workflow ID.
- `runName`: Runs with a given run name.
- `username`: Runs launched by a given user.
- `projectName`: Runs of a given pipeline project.
- `after`: Runs submitted on or after a date, in `YYYY-MM-DD` format.
- `before`: Runs submitted on or before a date, in `YYYY-MM-DD` format.
- `sessionId`: Runs with a given Nextflow session ID.
- `is:starred`: Runs you have starred.

Keyword terms use exact matches and combine with AND logic. Free text matches partially against the run name, project name, session ID, and manifest name. For example, to list the successful runs launched by `johndoe` after January 1, 2024 that match `rnaseq`:

```console
rnaseq username:johndoe status:succeeded after:2024-01-01
```

See [All runs view](../../monitoring/overview#all-runs-view) for the full search syntax.

## Dashboard

Access the **Dashboard** from the user menu. This page displays run totals across the Platform instance, grouped by run status. The default view includes all organizations and workspaces you can access:

- To limit the view to specific workspaces, select the dropdown next to **View**.
- To filter by time, select a preset period or a custom date range of up to 12 months. Times are displayed in the local timezone defined in your device's system settings.
- To download the displayed data as a CSV file, select **Export data**.

See [Dashboard](../../monitoring/dashboard) for the Studios, Fusion, and resource usage views.

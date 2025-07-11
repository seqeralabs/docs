---
title: "Dashboard"
description: "View pipeline run status overview in Seqera Platform."
date: "21 Apr 2023"
tags: [dashboard, pipeline runs, monitoring]
---

The Seqera Platform **Dashboard** is accessed from the user menu and provides an overview of:

- Pipeline runs in your personal and organization workspaces.
- Studio sessions in your organization workspaces only.
- Fusion usage in your organization workspaces.

## Pipelines

You can explore the status of pipelines in your personal and in organizational workspaces. On the **Dashboard** page, select **Pipelines**.

### Filters and summary

The **Dashboard** view defaults to all organizations and workspaces you can access. Select the **View** dropdown menu to filter by specific organizations and workspaces, or to view statistics for your personal workspace only. You can filter by time, including a custom date range of up to 12 months. To filter the set of pipelines, select **Filter**. When a filter is applied, the button icon and color changes.

### Export data

Select **Export data** in the filter panel near the top of the page to export dashboard data, based on the filters you have applied, in a CSV file.

### Pipelines per organization

The pipeline totals for your selected filters are displayed for each organization that you have access to. Depending on the filter selected, each card details a separate workspace or organization. Total pipelines for each organization are arranged by workspace and status.

For a detailed view, you can do one of the following:

- Select a pipeline integer value in the table to navigate to a list filtered by the status and time range selected.
- Select a workspace name in the table to navigate to a list filtered by the workspace selected.

## Studios

You can explore the status of Studio sessions in your organizational workspaces. On the **Dashboard** page, select **Studios**. The following statuses are listed with the number of Studio sessions in each status:

- `Building`
- `Build-failed`
- `Starting`
- `Running`
- `Stopping`
- `Stopped`
- `Errored`

### Filters and summary

The **Dashboard** view defaults to all organizations and workspaces you can access. Select the **View** dropdown menu to filter by organizations and workspaces. Select a status in the table to navigate to a list filtered by the status selected.

### Export data

Select **Export data** in the view panel near the top of the page to export a CSV of the dashboard data for the selected organizations and workspaces.

## Fusion

Select a workspace from the drop-down menu to view a Fusion usage comparison between the current month and the previous month. The usage value is displayed in GB with a percentage comparison against usage in the previous month).

<!-- links -->
[ds]: ../studios/overview

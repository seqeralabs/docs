---
title: "Overview"
description: "Monitoring pipeline runs in Seqera Platform."
date: "11 Apr 2024"
tags: [runs, monitoring]
---

Workflow executions submitted in Seqera Platform can be monitored wherever you have an internet connection.

The **Runs** tab contains all previous runs in the workspace. Each new or resumed run is given a random name such as _grave_williams_. Each row corresponds to a specific run. As a run executes, it can transition through the following states:

- `submitted`: Pending execution
- `running`: Running
- `succeeded`: Completed successfully
- `failed`: Successfully executed, where at least one task failed with a `terminate` [error strategy](https://www.nextflow.io/docs/latest/process.html#errorstrategy)
- `cancelled`: Stopped manually during execution
- `unknown`: Indeterminate status

Select the name of a run from the list to display that run's [execution details](./run-details).

## Save run as pipeline

_Available from version 23.1_

From the **Runs** list, any run can be saved as a new pipeline for future use, regardless of run status. Select the item menu next to any run in the list, then select **Save as pipeline**. In the dialog box shown, you can edit the pipeline name, add labels, and **Save**.

You can **Review and edit** any run details prior to saving the pipeline. After you've saved the pipeline, it is listed on the **Launchpad** and can be run from the same workspace where it was created.

## All runs view

The **All runs** page, accessed from the user menu, provides a comprehensive overview of the runs accessible to a user across the entire Seqera instance. This facilitates overall status monitoring and early detection of execution issues from a single view, split across organizations and workspaces.

The **All runs** view defaults to all organizations and workspaces you can access. Select the dropdown next to **View** to filter by specific organizations and workspaces, or to view runs from your personal workspace only.

### Search

The **Search workflow** bar allows you to filter by one or more `<keyword>:<value>` entries:

- `status`
- `label`
- `workflowId`
- `runName`
- `username`
- `projectName`
- `after`: YYYY-MM-DD
- `before`: YYYY-MM-DD
- `sessionId`
- `is:starred`

The search field populates with available suggestions when entering valid keywords. Suggested results for `label:` include available labels from all workspaces. Labels present in multiple workspaces are only suggested once.

Search covers all workflow runs inside a workspace, enabling easy retrieval of complex queries. Enter a search query in the **Search workflow** field to search and filter the runs in a workspace. The search text is interpreted by identifying all valid substrings formatted by `keyword:value`, combining all the rest in a single freeform text string, and then using all these search criteria to filter the runs.

For example:

`rnaseq username:john_doe status:succeeded after:2024-01-01`

will retrieve all runs from the workspace that meet the following criteria:

- Ended successfully (`status:succeeded`)
- Launched by user john_doe (`username:john_doe`)
- Include `rnaseq` in the data fields covered by the free text search
- Submitted after January 1, 2024

The freetext search uses a _partial_ match to find runs, so it will search for `*freetext*`. The `keyword:value` item uses an _exact_ match to filter runs, so `username:john` will not retrieve runs launched by `john_doe`.

:::caution
Filtering elements are combined with **AND** logic. This means that queries like `status:succeeded, status:submitted` are formally valid but return an empty list because a workflow can only have one status.

The freeform text result of all the `keyword:value` pairs is merged into a unique string that includes spaces. This may result in an empty list of results if the search query contains typos.
:::

:::note
Keywords corresponding to dates (`after` or `before`) are automatically converted to valid ISO-8601, taking your timezone into account. Partial dates are also supported: `before:2022-5` is automatically converted to `before:2022-05-01T00:00:00.000Z`.
:::

Seqera will suggest matching keywords while you type. Valid values are also suggested for some keywords, when supported.

### Search keywords

- **Freeform text**

  The search box allows you to search for partial matches with `project name`, `run name`, `session id`, or `manifest name`. Use wildcards (`*`) before or after keywords to filter results.

- **Exact match keywords**

  - `workflowId:3b7ToXeH9GvESr`: Search workflows with a specific workflow ID.
  - `runName:happy_einstein`: Search workflows with a specific run name.
  - `sessionId:85d35eae-21ea-4294-bc92-xxxxxxxxxxxx`: Search workflows with a specific session ID.
  - `projectName:nextflow-io/hello`: Search workflows with a specific project name.
  - `userName:john_doe`: Search workflows by a specific user.
  - `status:succeeded`: Search workflows with a specific status (`submitted`, `running`, `succeeded`, `failed`, `cancelled`, `unknown`).
  - `before:2024-01-01`: Search workflows submitted on or before the given date in YYYY-MM-DD format.
  - `after:2024-01-01`: Search workflows submitted on or after the given date in YYYY-MM-DD format.
  - `label:label1 label:label2`: Search workflows with specific labels.
  - `is:starred`: Search workflows that have been starred by the user.

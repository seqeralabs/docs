---
title: "Labels"
description: "Instructions for using labels in Seqera Platform."
date created: "2023-04-21"
last updated: "2025-08-01"
tags: [labels]
---

Labels are workspace-specific free-text annotations that can be applied to pipelines, actions, or workflow runs, either during or after creation. Use labels to organize your work and filter key information.

Labels aren't propagated to Nextflow during workflow execution.

### Limits

:::caution
Label names must contain a minimum of 2 and a maximum of 39 alphanumeric characters, separated by dashes or underscores, and must be unique in each workspace.
:::

- Label names cannot begin or end with dashes `-` or underscores `_`.
- Label names cannot contain a consecutive combination of `-` or `_` characters (`--`, `__`, `-_`, etc.)
- A maximum of 25 labels can be applied to each resource.
- A maximum of 1000 labels can be used in each workspace.

### Create and apply labels

Labels can be created, applied, and edited by a workspace owner, admin, or maintainer. When applying a label, users can select from existing labels or add new ones on the fly.

### Labels applied to a pipeline

:::caution
Labels are applied to elements in a workspace-specific context. This means that labels applied to a shared pipeline in `workspace A` will not be shown when viewing the pipeline from `workspace B`.
:::

The labels applied to each pipeline are displayed in both list and card views on the **Launchpad**. Select a pipeline to view all applied labels.

Apply a label when adding a new pipeline or editing an existing pipeline.

If a label is applied to a pipeline, all workflow runs of that pipeline will inherit the label. If the labels applied to the pipeline are changed, this change will only be applied to future runs, not past runs.

### Labels applied to an action

Apply a label when adding a new action or editing an existing action. Labels applied to an action are displayed in the action card on the **Actions** screen. Hover over labels with **+** to see all labels.

If a label is applied to an action, all workflow runs triggered by this action inherit the label. If the labels applied to the action are changed, this change will only be applied to future runs, not past runs.

### Labels applied to a workflow run

Labels applied to a workflow run are displayed on the **Runs** list screen and on the workflow run detail screen. Hover over labels with **+** to see all labels. Apply a label to a workflow run during launch, on the workflow runs list screen, or on the run detail screen.

### Search and filter with labels

You can search and filter pipelines and workflow runs using one or more labels — filter and search are complementary.

### Overview of labels in a workspace

All labels used in a workspace can be viewed, added, edited, and deleted by a workspace owner, admin, or maintainer in the workspace **Settings** tab. If a label is edited or deleted on this screen, the change is propagated to all items where the label was used.

:::caution
You cannot undo editing or deleting a label.
:::

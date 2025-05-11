---
title: Labels Overview
headline: "Labels"
description: "Step-by-step instructions to set-up and use Labels in Tower."
---

## Overview

Use labels to organize your work and filter key information. Labels are free-text annotations that can be applied to pipelines, actions, or workflow runs either during creation or afterward.

Labels are workspace specific,each workspace has an independent set of labels), and are not propagated to Nextflow during the workflow execution.

### Create and apply labels

Labels can be created, applied and edited by a workspace maintainer, admin or owner. When applying a label, users can select from existing labels or add new ones on the fly.

![](./_images/new_label.png)

### Labels applied to a pipeline

:::caution
Labels are applied to elements in a workspace-specific context. This means that labels applied to a shared pipeline in workspace A will not be shown when viewing the pipeline from workspace B.
:::

Labels applied to a pipeline are displayed on the bottom of the pipeline card on the Launchpad screen. To see all labels, hover over a label with the "+" character.

![](./_images/pipeline_labels.png)

Apply label to a pipeline when adding a new pipeline or editing existing pipeline.

If a label was applied to a pipeline, all workflow runs of this pipeline will inherit the label. If the label applied to the pipeline changes, this change will not be reflected on previously executed workflow runs, it will affect only future workflow runs.

![](./_images/launchpad_labels.png)

### Labels applied to an action

Labels applied to an action are displayed in the action card on the Actions screen. To see all labels, hover over a label with the "+" character.

Apply label to action when adding a new action or editing an existing action.

If a label was applied to an action, all workflow runs of this pipeline will inherit the label. If the label is applied to the action changes, this change will not be reflected on previously executed workflow runs, it will affect only future workflow runs.

### Labels applied to a workflow run

Labels applied to a workflow run are displayed in the card on the Workflow runs list screen as well as in the Workflow run detail screen. To see all labels, hover over a label with the "+" character.
Apply a label to workflow run at any moment, when launching a workflow run, as well as in the Workflow runs list screen or Workflow run detail screen.

![](./_images/launch_labels.png)

### Search and filter with labels
Search and filter pipelines and workflow runs using one or more labels.
Filter and search are complementary.

![](./_images/filter_labels.png)

### Overview of labels in a workspace

All labels used in a workspace can be viewed, added, edited, and deleted by a maintainer, admin, or workspace owner in the workspace's Setting screen.
If a label is edited or deleted in this screen, the change is propagated to all items where the label was used. Such a change is irreversible

![](./_images/label_management.png)

### Limits

:::caution
Label names must contain a minimum of 2 and a maximum of 39 alphanumeric characters, separated by dashes or underscores, and must be unique in each workspace
:::

- Label names cannot begin or end with dashes `-` or underscores `_`.
- Label names cannot contain a consecutive combination of `-` or `_` characters (`--`, `__`, `-_`, etc.)
- A maximum of 25 labels can be applied to each resource.
- A maximum of 100 labels can be used in each workspace.

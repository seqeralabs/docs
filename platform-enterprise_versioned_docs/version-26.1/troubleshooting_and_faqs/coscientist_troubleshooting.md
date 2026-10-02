---
title: "Co-Scientist"
description: "Co-Scientist troubleshooting."
date created: "2026-08-26"
last updated: "2026-08-26"
tags: [faq, help, co-scientist, troubleshooting]
---

When working with projects in the Co-Scientist web interface, you might encounter the following issues.

## Projects

### Dataset uploads do not auto-attach the project label

When you upload a dataset into a project, the project's `project_*` label is not attached automatically.

This issue occurs when a pipeline carries a `project_*` label that was not created in workspace settings. Co-Scientist still surfaces the project, inferred from the pipeline, but the project has no Platform-assigned label ID. Auto-attach requires that ID.

To avoid this issue, create `project_*` labels in workspace settings before applying them to resources. See [Projects](../co-scientist/projects.md).

### The Projects page shows **No projects configured yet**

The **Projects** page shows a **No projects configured yet** empty state, the project selector is hidden in the chat header, and the workspace view shows a header-only empty state.

This occurs when the workspace has no `project_*` labels.

To resolve, ask a workspace admin to create the first `project_*` label for the workspace. See [Create a project](../co-scientist/projects.md#create-a-project).

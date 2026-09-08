---
title: "Projects"
description: "Organize workspace resources into projects using Seqera Platform labels"
date created: "2026-04-22"
last updated: "2026-08-26"
tags: [co-scientist, projects, labels]
---

Projects in Co-Scientist group the pipelines, datasets, and workflow runs that belong to a single piece of work. View and chat about them without the noise of the rest of the workspace.

Projects are not created inside Co-Scientist. They are derived from **workspace labels in Seqera Platform** whose names start with `project_`. Each matching label surfaces in Co-Scientist as a separate project scope, with the Platform label acting as the source of truth for membership.

## How projects are derived

When you open a workspace in Co-Scientist:

1. Co-Scientist reads the list of workspace labels from the Seqera Platform API.
2. Any label whose name starts with `project_` becomes a project.
3. An **Entire workspace** view is always included alongside your projects so you can see every resource in the workspace.
4. Pipelines, datasets, and workflow runs are scoped to a project by matching on its `project_*` label.

Because membership lives on the Platform label, adding or removing a resource from a project is the same action as applying or removing the label in Platform.

## Create a project

1. In **Seqera Platform**, open the workspace where the project should live.
2. Go to **Labels** in workspace settings and create a new label with the `project_` prefix. For example:
    - `project_rnaseq`
    - `project_variant_calling`
    - `project_chip_seq`
3. Apply the label to the pipelines and datasets that belong to the project.
4. Open Co-Scientist. The new project appears on the **Projects** page and in the project selector on the next page load.

:::tip
Create the label in workspace settings **before** applying it to resources. This ensures the label has a Platform-assigned ID, which Co-Scientist needs to auto-attach the label when you upload new datasets into the project.
:::

## Display names

Co-Scientist strips the `project_` prefix to produce the display name:

| Platform label        | Co-Scientist display name  |
|-----------------------|-------------------------|
| `project_rnaseq`      | Project rnaseq          |
| `project_wgs`         | Project wgs             |
| `project_single_cell` | Project single_cell     |

Choose descriptive names after the prefix so projects are easy to identify.

## Where projects appear

Once a `project_*` label exists in the workspace and is applied to at least one resource, the project is used in the following places:

- **Projects page**: one row per project, plus the **Entire workspace** row.
- **Project details page**: the pipelines, datasets, and workflow runs filtered to that project's label.
- **Project selector**: scopes the resources Co-Scientist can see and act on during a conversation.
- **Dataset upload**: when you upload a dataset from inside a project, the project's label is auto-attached.

For problems with project labels and empty states, see [Co-Scientist troubleshooting](../troubleshooting_and_faqs/seqera-ai.md).

## Learn more

- [Seqera Platform labels](https://docs.seqera.io/platform-cloud/labels/overview): Create and manage workspace labels
- [Quickstart](./quickstart.md): Run your first Co-Scientist session
- [Credits](./credits.md): Co-Scientist credits and how to request more
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits

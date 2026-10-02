---
title: "Projects"
description: "Organize workspace resources into projects using Seqera Platform labels"
date created: "2026-04-22"
last updated: "2026-09-22"
tags: [co-scientist, platform, projects, labels]
---

Projects group the pipelines, datasets, and runs that belong to a single piece of work. Use a project to view and work with them without the noise of the rest of the workspace.

A project is not a separate Platform resource. It is a **workspace label whose name starts with `proj_`**. The label is the source of truth for membership. A pipeline, dataset, or run belongs to a project when it carries the project's label.

:::note
Earlier releases used the `project_` prefix. Seqera Platform Enterprise 26.2 recognizes only `proj_` labels. Rename existing `project_*` labels to `proj_*` in workspace settings to keep them as projects.
:::

## Enable projects

Projects are enabled by default in every organization workspace. They do not depend on the Co-Scientist agent backend.

To restrict projects to specific workspaces, set `TOWER_SCIENTIST_VIEW_ALLOWED_WORKSPACES` to a comma-separated list of workspace IDs, or list the IDs in `tower.yml`:

```yaml
tower:
  scientist-view:
    allowed-workspaces:
      - 1234567890
      - 9876543210
```

To turn projects off in every workspace, set `TOWER_SCIENTIST_VIEW_ALLOWED_WORKSPACES` to `0`. See [Co-Scientist configuration](../enterprise/configuration/overview#co-scientist).

Projects are never available in personal workspaces. Restart Seqera Platform after changing either setting.

## Permissions

Viewing projects requires the `project_view:read` permission. Every predefined workspace role includes it. Custom roles include it only when an organization owner selects it in the **Projects** permission category. Existing custom roles do not gain it when you upgrade to 26.2.

The predefined **Project** workspace role grants access to projects without the broader workspace resource permissions. Users with this role see only the **Projects** view and cannot create or rename projects.

Creating a project requires permission to create labels, and editing a project requires permission to update labels.

## Open projects

When projects are enabled for a workspace and your role includes `project_view:read`, the side navigation shows a **Workspace**/**Projects** switcher. Select **Projects** to open the projects list. A role with `project_view:read` but without `workspace_resources:read`, such as the **Project** role, shows only the **Projects** view, with no switcher.

If the workspace has no projects yet, the page shows a **Get started with projects** empty state with an **Add project** button. Otherwise, the list shows one row per project, plus a **\<workspace name\> overview** row that covers every resource in the workspace. Use **Search projects** to filter the list.

Select a project to open its details page, which has **Runs**, **Datasets**, and **Reports** tabs filtered to the project's label. You can launch and relaunch pipelines from inside a project.

## Create a project

1.  Select **Projects** in the side navigation.
1.  Select **Add project**.
1.  Enter a **Project name**. Names can contain only letters, numbers, dashes, and underscores, and must be unique in the workspace, ignoring case.
1.  Optional: In the **Resources** card, select **Add** to choose the pipelines and datasets that belong to the project.
1.  Select **Add**.

Seqera Platform creates a workspace label named `proj_<name>` and applies it to the resources you selected.

You can also create a project from workspace settings. Go to **Labels**, create a label with the `proj_` prefix, and apply it to the pipelines and datasets that belong to the project. For example:

- `proj_rnaseq`
- `proj_variant_calling`
- `proj_chip_seq`

:::tip
Create the label in workspace settings **before** applying it to resources. This ensures the label has a Platform-assigned ID, which Seqera Platform needs to auto-attach the label when you upload new datasets into the project.
:::

## Display names

Seqera Platform strips the `proj_` prefix to produce the display name:

| Platform label | Display name in the projects list | Browser tab title |
| --- | --- | --- |
| `proj_rnaseq` | rnaseq | Project rnaseq |
| `proj_wgs` | wgs | Project wgs |
| `proj_single_cell` | single_cell | Project single_cell |

Choose descriptive names after the prefix so projects are easy to identify.

## Add resources to a project

Because membership lives on the label, adding a resource to a project is the same action as applying the project's label to it:

- **Pipelines and datasets**: Select them when you create or edit the project, or apply the `proj_*` label in Seqera Platform.
- **Datasets uploaded inside a project**: Seqera Platform attaches the project's label automatically.
- **Runs**: Runs launched from inside a project carry the project's label.

The pipeline and dataset forms hide `proj_*` labels from their **Labels** field and refuse to create one there. Manage project membership from the project itself.

## Edit or delete a project

Open the project's actions menu in the projects list:

- **Edit**: Rename the project or change which pipelines and datasets belong to it, then select **Save**. Renaming a project renames its label.
- **Delete**: Remove the project's label and its resource associations. Deleting a project does not delete the pipelines, datasets, and runs themselves.

You cannot edit or delete the **\<workspace name\> overview** row.

## Projects and Co-Scientist

You can trigger background agents from a project's **Runs** tab. The Co-Scientist panel works with the page you are viewing and the current workspace. It does not have a separate project selector. See [Co-Scientist in Seqera Platform](./platform.md).

For problems with project labels and empty states, see [Co-Scientist troubleshooting](../troubleshooting_and_faqs/coscientist_troubleshooting.md).

## Learn more

- [Seqera Platform labels](../labels/overview.md): Create and manage workspace labels
- [Co-Scientist in Seqera Platform](./platform.md): Use the Co-Scientist panel in Seqera Platform
- [Custom roles](../orgs-and-teams/custom-roles.md): Configure role permissions

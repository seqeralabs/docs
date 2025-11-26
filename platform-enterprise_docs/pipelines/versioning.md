---
title: "Pipeline versioning (preview)"
description: "Introduction to pipeline versioning in Seqera Platform."
date created: "2025-11-14"
tags: [pipelines, versioning, nextflow, parameters]
---

Seqera's pipeline versioning system captures configuration changes as new draft versions of the pipeline, ensuring configuration traceability and execution reproducibility. Users with appropriate permissions can edit and publish draft versions, creating published versions that teams can reference and launch consistently.

When you add a new pipeline to Seqera, the first default version of that pipeline is automatically published.

New draft versions are automatically generated when you modify the following:
- All pipeline schema parameters, unless the `track_changes` schema configuration for a given property is set to `false`.
  :::info
  Changes to all pipeline schema parameters trigger a new version by default (`"track_changes": true`). To alter this behavior for specific parameters, add `"track_changes": false` to the parameter definition:
  ```json
  "my_parameter": {
    "type": "string",
    "description": "Changes to this parameter will not trigger a new pipeline version to be created",
    "track_changes": false
  }
  ```
  :::
- Fields in the pipeline **Edit** form, excluding:
  - **Name**
  - **Image**
  - **Description**
  - **Labels**

Published versions provide a stable reference for team-wide pipeline launches. Users with Maintain or higher permissions can publish a draft version, giving it a name and optionally setting it as the default version. This makes important configurations easy to identify, share, and promote across your team.

:::info
A pipeline's default version is shown in the Launchpad and automatically selected during launch.
:::

Seqera maintains a history of all draft and published versions, providing an audit trail of pipeline evolution.

#### Manage pipeline versions

![](./_images/pipeline-version-detail.jpg)

Select a pipeline from the workspace Launchpad to open the pipeline's details page. From here, users with Maintain or higher permissions can:

- **View version history**: See a chronological list of all draft and published versions with creator, date, and checksum.
  - Use the dropdown next to **Show:** to show all versions, or filter by draft or published versions.
  - **Search** for specific version names (freetext search), or use keywords to search by `pipelineVersionId:` ([version checksum](#version-checksums)).
- **Manage draft versions**:
  - Select **Publish** from the options menu of a draft version to name this version and optionally make it the default version to launch from the Launchpad.
  - Select **Edit** to open the pipeline edit form and either save a new draft or publish the current draft version.
- **Manage published versions**:
  - Select **Make default** from the options menu of a published version to use this version for every pipeline launch.
  - Select **Edit** to open the pipeline edit form and either save a new draft or update the current published version.
  - Select **Unpublish** to turn this version back into a draft. Draft versions are still visible to launch users.

Individual versions cannot be deleted. This ensures that the pipeline configuration audit trail is immutable. However, published versions can be unpublished or have their names reassigned to different versions.

:::note
A shared pipeline's versions can only be edited from its original workspace.
:::

#### Version checksums

Seqera calculates a checksum for each draft version based on its version-triggering parameters. This provides:

- **Provenance tracking** for audit and compliance requirements.
- **Cryptographic verification** that a workflow run's configuration matches its associated pipeline version.

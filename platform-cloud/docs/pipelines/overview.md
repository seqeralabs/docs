---
title: "Pipelines overview"
description: "Introduction to pipelines in Seqera Platform."
date: "16 Oct 2025"
tags: [pipelines, versioning, nextflow, parameters]
---

Seqera Platform provides version-controlled, access-controlled, reproducible execution of Nextflow pipelines. Seqera tracks configuration changes, enables deterministic execution through pipeline versioning, and allows teams to collaborate and iterate on pipeline development while maintaining execution integrity.

When you add a pipeline to Seqera, you define:

- The pipeline Git repository and revision (branch, tag, or commit)
- [Compute environment](../compute-envs/overview.md) for execution
- Pipeline parameters and [configuration profiles](https://www.nextflow.io/docs/latest/config.html#config-profiles)
- (Optional) [Resource labels](../resource-labels/overview.md) and [secrets](../secrets/overview.md)
- (Optional) [Pre-run and post-run](../launch/advanced.md#pre-and-post-run-scripts) bash scripts that execute in your compute environment

### Pipeline versioning

Seqera's pipeline versioning system captures configuration changes as new **draft versions** of the pipeline, ensuring configuration traceability and execution reproducibility. Users with appropriate permissions can edit and publish draft versions, creating **published versions** that teams can reference and launch consistently. When you add a new pipeline to Seqera, the first default version of that pipeline is automatically published.

**Draft versions** are automatically generated whenever you:
- Edit a pipeline's [restricted](#restricted-and-non-restricted-parameters) parameters
- Launch a pipeline with modified restricted parameters

**Published versions** can be set as default, are visible to all users, and provide a stable reference for team-wide pipeline launches. Users with Maintain or higher permissions can publish a draft version, giving it a name (e.g., "production-v1.2", "cloud-ce-test-config") and optionally set it as the default version for Launch users to use. This makes important configurations easy to identify, share, and promote.

Seqera maintains a history of all draft and published versions, providing an audit trail of pipeline evolution.

### Manage pipeline versions

![](./_images/pipeline-version-detail.jpg)

Select a pipeline from the workspace Launchpad to open the pipeline's details page. From here, users with Maintain or higher permissions can:

- **Publish draft version**: From the options menu of a draft version, select **Publish** to name this version and make it visible to all users
- **Set default version**: From the options menu of a published version, select **Make default** to use this version for every pipeline launch
- **Control visibility**: From the options menu of a published version, select **Unpublish** to turn this version back into a draft and hide it from users with less than Maintain permissions
- **View version history**: See a chronological list of all draft and published versions with creator, date, and checksum.

:::note
Individual versions cannot be deleted - the pipeline configuration audit trail is immutable.
:::

#### Version checksums

Seqera calculates a checksum for each draft version based on its restricted parameters, providing cryptographic verification of the exact configuration. This provides:

- **Cryptographic verification** that a workflow run's configuration matches its associated pipeline version
- **Duplicate detection** when an edited configuration is identical to a previous draft version
- **Provenance tracking** for audit and compliance requirements

### Restricted and non-restricted parameters

Pipeline parameters are classified as **restricted** or **non-restricted** to control who can modify them and whether changes trigger new draft version creation.

**Restricted parameters** require Maintain or higher permissions to edit and include:
- Workflow repository, revision, and commit ID
- Compute environment
- Configuration profiles
- Work directory and resource labels
- Pipeline secrets
- Nextflow config files
- Pre/post-run scripts
- Parameters marked as hidden in the pipeline schema

**Non-restricted parameters** can be modified by Launch users and include:
- Pipeline name, description, and labels
- Parameters explicitly exposed in the pipeline schema

Users with Maintain or higher permissions can customize the pipeline schema to control which parameters are exposed to Launch users. This enables controlled pipeline customization while maintaining version integrity.

### Pin commit ID

Workflow repositories are mutable - branches can be updated, tags can be moved (though rarely), and the "latest" code changes over time. This creates a reproducibility challenge: launching the same pipeline configuration at different times could execute different workflow code.

**Commit ID pinning** solves this by tracking the specific Git commit ID alongside the branch or tag revision. When you pin a commit ID, Seqera ensures that exact version of the workflow code is executed for every launch, regardless of upstream repository changes.

:::info
Commit ID pinning requires a valid pipeline and **Revision number** (commit ID, tag, or branch name) to be specified. The **Commit ID** field and pin icon is disabled if the **Revision number** field is left empty. 
:::

The **Pull latest** toggle controls whether Nextflow fetches the most recent HEAD commit of the pipeline revision at execution time. Enabling **Pull latest** unpins any pinned commit ID.

#### Pin commit ID versus Pull latest behavior

The **Commit ID** and **Pull latest** fields appear on pipeline add, edit, and launch forms. Their interaction and behavior depend on compute environment type:

**Cloud compute environments**

| Revision | Commit ID | Pull latest | Launch behavior |
|----------|-----------|-------------|-------------------|
| Branch/tag | Empty (unpinned) - default | OFF - default | Fetches current HEAD commit at execution time (non-deterministic). |
| Branch/tag | Pinned | OFF - automatically set when pinned | Uses the pinned commit ID for deterministic execution. |
| Branch/tag | Empty (unpinned) | ON | Fetches current HEAD commit at execution time (non-deterministic). |
| Commit ID | Automatically populated and pinned | OFF - default | Uses the specified commit ID (deterministic by definition). |

**HPC compute environments**

| Revision | Commit ID | Pull latest | Launch behavior |
|----------|-----------|-------------|-------------------|
| Branch/tag | Empty (unpinned) - default | OFF - default | Runs locally cached pipeline version. No update or network fetch is performed. |
| Branch/tag | Pinned | OFF - automatically set when pinned | Uses the pinned commit ID for deterministic execution. |
| Branch/tag | Empty (unpinned) | ON | Fetches and caches current HEAD commit before execution (non-deterministic). |
| Commit ID | Automatically populated and pinned | OFF - default | Uses the specified commit ID (deterministic by definition). |

This relationship ensures commit ID pinning provides deterministic execution across both Cloud and HPC environments. Once pinned, the same commit ID is used for each launch, regardless of compute environment type.

:::note
If you enter a commit ID in the **Revision number** field, the **Commit ID** field, pin icon, and **Pull latest** toggle are disabled.
:::

### Role-based access control

Pipeline operations require specific workspace roles:

| Operation | Required role |
|-----------|---------------|
| View pipeline details | Launch or higher |
| Launch default or published versions | Launch or higher |
| Edit non-restricted parameters at launch | Launch or higher |
| Add new pipelines | Maintain or higher |
| Edit pipeline configuration | Maintain or higher |
| Edit restricted parameters at launch | Maintain or higher |
| Publish versions | Maintain or higher |
| Set default versions | Maintain or higher |
| Delete pipelines | Maintain or higher |

Launch-level users can only modify parameters explicitly exposed through the pipeline schema. All restricted parameters remain locked unless you have Maintain or higher permissions.

### Manage pipelines

- [Add pipelines](../getting-started/quickstart-demo/add-pipelines.md)
- [Edit pipelines](../launch/launchpad.md#edit-pipeline)
- [Launch pipelines](../launch/launchpad.md)
---
title: "Git revision management"
description: "Introduction to pipeline repository revision management in Seqera Platform."
date created: "2025-11-14"
tags: [pipelines, versioning, nextflow, parameters]
---

Workflow repositories are mutable - branches can be updated, tags can be moved (though rarely), and the "latest" code changes over time. This creates a reproducibility challenge: launching the same pipeline configuration at different times could execute different workflow code.

**Commit ID pinning** solves this by tracking the specific Git commit ID alongside the branch or tag revision. When you pin a commit ID, Seqera ensures that exact version of the workflow code is executed for every launch, regardless of future changes to the repository branch or tag.

:::info
Commit ID pinning requires a valid pipeline and **Revision** (tag or branch name) to be specified. The **Commit ID** field and pin icon is disabled if the **Revision** field is left empty. 
:::

The **Pull latest** toggle controls whether Nextflow fetches the most recent HEAD commit of the pipeline revision at execution time. This is equivalent to the `nextflow run -latest` flag. If **Pull latest** is **disabled** in HPC compute environments, the Nextflow cache is used (if available). Cloud compute environments always pull the latest HEAD commit of the revision at execution time, unless a specific commit ID revision is set or pinned. Enabling **Pull latest** unpins any pinned commit ID.

### Pin commit ID versus Pull latest behavior

The **Commit ID** and **Pull latest** fields appear on pipeline add, edit, and launch forms. Their interaction and behavior depend on compute environment type:

**Cloud compute environments**

| Revision | Commit ID | Pull latest | Launch behavior |
|----------|-----------|-------------|-----------------|
| Branch/tag | Empty (unpinned) - default | OFF - default | Fetches current HEAD commit at execution time (non-deterministic). |
| Branch/tag | Pinned | OFF - automatically set when pinned | Uses the pinned commit ID for deterministic execution. |
| Branch/tag | Empty (unpinned) | ON | Fetches current HEAD commit at execution time (non-deterministic). Equivalent to `nextflow run -latest`. |
| Commit ID | Automatically populated and pinned | OFF - default | Uses the specified commit ID (deterministic by definition). |

**HPC compute environments**

| Revision | Commit ID | Pull latest | Launch behavior |
|----------|-----------|-------------|-------------------|
| Branch/tag | Empty (unpinned) - default | OFF - default | Runs locally cached pipeline version. No update or network fetch is performed. |
| Branch/tag | Pinned | OFF - automatically set when pinned | Uses the pinned commit ID for deterministic execution. |
| Branch/tag | Empty (unpinned) | ON | Fetches and caches current HEAD commit before execution (non-deterministic). Equivalent to `nextflow run -latest`. |
| Commit ID | Automatically populated and pinned | OFF - default | Uses the specified commit ID (deterministic by definition). |

This relationship ensures commit ID pinning provides deterministic execution across both Cloud and HPC environments. Once pinned, the same commit ID is used for each launch, regardless of compute environment type.

:::note
If you enter a commit ID in the **Revision** field, the **Commit ID** field, pin icon, and **Pull latest** toggle are disabled.
:::

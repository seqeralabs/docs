---
title: "Data Explorer"
description: "Data Explorer troubleshooting with Seqera Platform."
date created: "2026-08-28"
last updated: "2026-08-28"
tags: [faq, help, data explorer, troubleshooting]
---

When working with Data Explorer, you might encounter the following issues.

## Work directories

### Work directory cannot be viewed in Data Explorer

The **Data Explorer** tab of the **Task details** dialog reports the following:

```
This work directory can't be viewed in Data Explorer.
```

The **View** button beside **Work directory** on the **Run Info** tab is disabled.

This issue occurs when the workspace has no visible data-link at the root of the bucket or container that holds the work directory. Seqera Platform matches a run's work directory against bucket-root data-links only. A data-link registered at a prefix such as `s3://my-bucket/work` never matches, and a hidden bucket-root data-link is excluded from the match.

To resolve, add a data-link at the bucket or container root, such as `s3://my-bucket`, and leave it visible. Your existing prefix-scoped data-links continue to work unchanged.

A visible bucket-root data-link lets every workspace member browse and download the whole bucket. See [Isolate view, read, and write permissions to specific data repository paths](../data/data-explorer#isolate-view-read-and-write-permissions-to-specific-data-repository-paths).

If the work directory is not in cloud storage, such as a path on a high-performance computing (HPC) or local filesystem, Data Explorer cannot display it.

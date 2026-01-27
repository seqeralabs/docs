---
title: General
description: "Troubleshooting for general Fusion issues"
date created: "2025-11-29"
last updated: "2025-01-12"
tags: [troubleshooting, fusion, fusion-snapshots, configuration]
---

When working with Fusion, you might encounter the following issues.

## Too many open files

Tasks fail with an error about too many open files.

This issue occurs when the default file descriptor limit is too low for the container workload.

To resolve this issue, increase the `ulimit` for the container. Append the following to your Nextflow configuration:

```groovy
process.containerOptions = '--ulimit nofile=1048576:1048576'
```

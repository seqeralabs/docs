---
title: General
description: "Troubleshooting for general Fusion issues"
date created: "2025-11-29"
last updated: "2026-08-28"
tags: [troubleshooting, fusion, fusion snapshots, configuration]
---

When working with Fusion, you might encounter the following issues.

## Common issues

#### Too many open files

Tasks fail with an error about too many open files.

This issue occurs when the default file descriptor limit is too low for the container workload.

To resolve, increase the `ulimit` for the container. Append the following to your Nextflow configuration:

```groovy
process.containerOptions = '--ulimit nofile=1048576:1048576'
```

#### Exit code `143` on Kubernetes

When a task fails with exit code `143`, pipelines halt instead of retrying the affected task.

Exit code `143` indicates the container received `SIGTERM` and shut down gracefully. On Kubernetes this most commonly signals Spot instance reclamation.

To retry tasks that exit with `143`, configure an `errorStrategy` in your Nextflow configuration:

```groovy
process {
    maxRetries = 3
    errorStrategy = { task.exitStatus == 143 ? 'retry' : 'terminate' }
}
```

See [`errorStrategy`](https://docs.seqera.io/nextflow/reference/process#errorstrategy) for more configuration options.

#### A task reads incomplete data written by a Studio session

A task fails when it reads a Fusion-mounted path that a running Studio session wrote to. The files exist but are 0 bytes, or the directory appears empty.

This issue occurs because Fusion uploads data to object storage in chunks and consolidates those chunks into a complete object only when the Fusion instance that wrote them shuts down. For a Studio session, that happens when the session stops. Separate Fusion instances also do not share a live view of each other's in-progress writes.

To resolve, [stop the Studio session](https://docs.seqera.io/platform-cloud/studios/managing#stop-a-studio-session) and wait for its status to change to **stopped** before you launch the run. To avoid the problem, upload data for a pipeline with **Data Explorer** or the Seqera Platform CLI (`tw`) instead of writing it from a running session.

See [Data written by a running session is not visible to pipeline runs](https://docs.seqera.io/platform-cloud/troubleshooting_and_faqs/studios_troubleshooting#studio-write-not-visible) for the Studios troubleshooting entry.

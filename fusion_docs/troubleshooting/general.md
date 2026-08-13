---
title: General
description: "Troubleshooting for general Fusion issues"
date created: "2025-11-29"
last updated: "2026-08-13"
tags: [troubleshooting, fusion, fusion snapshots, configuration]
---

When working with Fusion, you might encounter the following issues.

## Common issues

#### Rootless containers fail on Seqera Intelligent Compute

Tasks that use rootless container images fail to start on compute environments with Seqera Intelligent Compute enabled.

On Intelligent Compute, Fusion mounts the pipeline work directory over NFS from inside each task container, and the mount requires root privileges. The `fusion.privileged` configuration option does not apply.

To resolve, use container images that run as the root user. See [Intelligent Compute](https://docs.seqera.io/platform-cloud/compute-envs/intelligent-compute).

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

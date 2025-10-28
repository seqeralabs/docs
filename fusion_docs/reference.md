---
title: Reference
tags: [fusion, storage, compute, file system, posix, client]
---

# Reference

Fusion is configured through your Nextflow configuration file. All Fusion configuration options are specified in the `fusion` scope and can be set in your Nextflow configuration file (e.g., `nextflow.config`).

## Configuration options

The following options are available:

| Method                            | Description                                                                                                                                                                                         |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fusion.enabled`                  | Whether to enable Fusion file system (default: `false`).                                                                                                                                            |
| `fusion.cacheSize`                | _New in version 23.11.0-edge_. Local cache size limit for the Fusion client.                                                                                                                        |
| `fusion.containerConfigUrl`       | URL for the container layer that provisions the Fusion client.                                                                                                                                      |
| `fusion.exportStorageCredentials` | _New in version 23.05.0-edge_. Whether to export access to credentials for the underlying object storage to the task environment (default: `false`). Previously named `fusion.exportAwsAccessKeys`. |
| `fusion.logLevel`                 | Log level for the Fusion client.                                                                                                                                                                    |
| `fusion.logOutput`                | Location for log output.                                                                                                                                                                            |
| `fusion.privileged`               | _New in version 23.10.0_. Whether to use privileged containers (default: `true`). Non-privileged use is supported only on Kubernetes with the `k8s-fuse-plugin` or a similar FUSE device plugin.    |
| `fusion.snapshots`                | _New in version 25.03.0-edge_. Whether to enable Fusion Snapshots (preview; default: `false`). AWS Batch only.                                                                                      |
| `fusion.tags`                     | Pattern for tagging files created via the Fusion client (default: `[.command.*\|.exitcode\|.fusion.*](nextflow.io/metadata=true),[*](nextflow.io/temporary=true)`). Set to `false` to disable.      |

:::note
See [Configuration options](https://www.nextflow.io/docs/latest/reference/config.html#configuration-options) for a full list of Nextflow configuration options.
:::

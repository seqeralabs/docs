---
title: Reference
tags: [fusion, storage, compute, file system, posix, client]
---

# Reference

## Configuration options

The following Fusion configuration options are available:

| Method                            | Description                                                                                                                                                                                             |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fusion.enabled`                  | Enable/disable Fusion file system (default: `false`).                                                                                                                                                   |
| `fusion.cacheSize`                | _New in version 23.11.0-edge_. Fusion client local cache size limit.                                                                                                                                    |
| `fusion.containerConfigUrl`       | URL for downloading the container layer provisioning the Fusion client.                                                                                                                                 |                                    
| `fusion.exportStorageCredentials` | _New in version 23.05.0-edge_. Enable access to credentials for the underlying object storage are exported to the task environment (default: `false`). Previously named `fusion.exportAwsAccessKeys`.   |
| `fusion.logLevel`                 | Fusion client log level.                                                                                                                                                                                |
| `fusion.logOutput`                | Log output location.                                                                                                                                                                                    |
| `fusion.privileged`               | _New in version 23.10.0_. Enable privileged containers for Fusion (default: `true`). Non-privileged use is supported only on Kubernetes with the k8s-fuse-plugin or a similar FUSE device plugin.       |
| `fusion.snapshots`                | _New in version 25.03.0-edge_. Enable Fusion snapshotting (preview, default: `false`). Currently only supported for AWS Batch.                                                                           |
| `fusion.tags`                     | Pattern for applying tags to files created via the Fusion client (default: `[.command.*\|.exitcode\|.fusion.*](nextflow.io/metadata=true),[*](nextflow.io/temporary=true)`). Set to `false` to disable. |

:::note
See [Configuration options](https://www.nextflow.io/docs/latest/reference/config.html#configuration-options) for a full list of Nextflow configuration options.
:::
---
title: Reference
tags: [fusion, storage, compute, file system, posix, client]
---

# Reference

Fusion is configured through your Nextflow configuration file. All Fusion configuration options are specified in the `fusion` scope and can be set in your Nextflow configuration file (e.g., `nextflow.config`).

## Configuration options

The following options are available:

| Method                            | Description                                                                                                                                                                                             |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fusion.enabled`                  | If `true`, Fusion file system is enabled. Default: `false`.                                                                                                                                             |
| `fusion.cacheSize`                | _New in version 23.11.0-edge_.<br /> Local cache size limit for the Fusion client.                                                                                                                            |
| `fusion.containerConfigUrl`       | URL for the container layer that provisions the Fusion client.                                                                                                                                          |
| `fusion.exportStorageCredentials` | _New in version 23.05.0-edge_.<br /> If `true`, credentials for the underlying object storage to the task environment are exported. Previously named `fusion.exportAwsAccessKeys`. Default: `false`.          |
| `fusion.logLevel`                 | Log level for the Fusion client.                                                                                                                                                                        |
| `fusion.logOutput`                | Location for log output.                                                                                                                                                                                |
| `fusion.privileged`               | _New in version 23.10.0_.<br /> If `true`, privileged containers are enabled. Non-privileged use is supported only on Kubernetes with the `k8s-fuse-plugin` or a similar FUSE device plugin. Default: `true`. |
| `fusion.snapshots`                | _New in version 25.03.0-edge_.<br /> If `true`, Fusion Snapshots are enabled. AWS Batch only. Preview feature. Default: `false`.                                                                              |
| `fusion.tags`                     | Pattern for tagging files created via the Fusion client. Set to `false` to disable. Default: `[.command.*\|.exitcode\|.fusion.*](nextflow.io/metadata=true),[*](nextflow.io/temporary=true)`.           |

:::note
See [Configuration options](https://www.nextflow.io/docs/latest/reference/config.html#configuration-options) for a full list of Nextflow configuration options.
:::

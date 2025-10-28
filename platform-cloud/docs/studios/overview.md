---
title: "Overview"
description: "Seqera Studios overview"
date created: "2025-02-06"
last updated: "2025-07-22"
tags: [studios, connect, xpra, ride, vscode, containers, docker]
---

Studios is a unified platform where you can host a combination of container images and compute environments for interactive analysis using your preferred tools, like JupyterLab notebooks, an [R-IDE](https://github.com/seqeralabs/r-ide), Visual Studio Code IDEs, or Xpra remote desktops. Each Studio session is an individual interactive environment that encapsulates the live environment for dynamic data analysis.

On Seqera Cloud, the free tier permits only one running Studio session at a time. To run simultaneous sessions, [contact Seqera][contact] for a Seqera Cloud Pro license.

:::note
Currently, Studios supports [AWS Cloud][aws-cloud] and [AWS Batch][aws-batch] compute environments that **do not** have Fargate enabled.
:::

#### Docker-in-docker

A primary use case for VS Code in Studios is to develop new, and troubleshoot existing, Nextflow pipelines. This commonly requires running Docker in the Dockerized container. The recommended method is to:

**1. Create an [AWS Cloud][aws-cloud] compute environment:** By default, this type of compute environment is optimized for running Nextflow pipelines.

:::tip
Many standard nf-core pipelines such as [*nf-core/rnaseq*](https://nf-co.re/rnaseq) require at least 4 CPUs and 16 GB memory. In **Advanced options**, specify an instance type with at least this amount of resources (e.g., `m5d.xlarge`).
:::

**2. Only have one running Studio session per compute environment:** This allows the Studio session, and Nextflow, to maximize the available CPU and memory.

:::tip
The template for nf-core pipelines has recently been updated, and many existing pipelines don't yet use the new multi-line shell command defined in `nextflow.config`. To ensure maximum compatibility with the latest version of Nextflow (that ships with the VS Code container template image), include the following in your pipeline `nextflow.config` file.

```bash
// Set bash options
process.shell = [
    "bash",
    "-C",         // No clobber - prevent output redirection from overwriting files.
    "-e",         // Exit if a tool returns a non-zero status/exit code
    "-u",         // Treat unset variables and parameters as an error
    "-o",         // Returns the status of the last command to exit..
    "pipefail"    //   ..with a non-zero status or zero if all successfully execute
]
```
:::

## EFS file systems

If you configured your compute environment to include an EFS file system with **EFS file system > EFS mount path**, the mount path must be explicitly specified. The mount path cannot be the same as your compute environment work directory. If the EFS file system is mounted as your compute environment work directory, snapshots cannot be saved and sessions fail.

To mount an EFS volume in a Studio session (for example, if your organization has a custom, managed, and standardized software stack in an EFS volume), add the EFS volume to the compute environment (system ID and mount path). The volume will be available at the specified mount path in the session.

For more information on AWS Batch configuration, see [AWS Batch][aws-batch].

{/* links */}
[contact]: https://support.seqera.io/
[aws-cloud]: ../compute-envs/aws-cloud
[aws-batch]: ../compute-envs/aws-batch
[custom-envs]: ./custom-envs
[build-status]: ./custom-envs#build-status
[cloud-bucket-subdirectory]: ./managing#cloud-bucket-subdirectory
[ds-jupyter]: https://public.cr.seqera.io/repo/platform/data-studio-jupyter
[ds-rstudio]: https://public.cr.seqera.io/repo/platform/data-studio-rstudio
[def-vsc]: https://code.visualstudio.com/
[Nextflow]: https://nextflow.io/
[nf-lang-server]: https://marketplace.visualstudio.com/items?itemName=nextflow.nextflow
[ds-vscode]: https://public.cr.seqera.io/repo/platform/data-studio-vscode
[def-xpra]: https://github.com/Xpra-org/xpra
[ds-xpra]: https://public.cr.seqera.io/repo/platform/data-studio-xpra
[Wave]: https://seqera.io/wave/
[build-status]: ./custom-envs#build-status

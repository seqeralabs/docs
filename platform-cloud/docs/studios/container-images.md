---
title: "Container image templates"
description: "Use container images with Studios."
date created: "2025-10-16"
last updated: "2025-10-21"
tags: [container, container-images, session, studios]
---

There are four container image templates provided: JupyterLab, R-IDE, Visual Studio Code, and Xpra. The image templates install a very limited number of packages when the Studio session container is built. You can install additional packages as needed during a Studio session.

The image template tag includes the version of the analysis application, an optional incompatibility flag, and the Seqera Connect version. Connect is the proprietary Seqera web server client that manages communication with the container. Tag strings use the following format:

```ignore title="Image template tag"
<TOOL_VERSION>-[<UPDATE_VERSION>]-<CONNECT_VERSION>
```

- `<TOOL_VERSION>`: Third-party analysis application that follows its own semantic versioning `<MAJOR>.<MINOR>.<PATCH>`, such as `4.2.5` for JupyterLab.
- `<UPDATED_VERSION>`: Optional analysis application update version, such as `u1`, for instances where a backwards incompatible change is introduced.
- `<CONNECT_VERSION>`: Seqera Connect client version, such as `0.8` or `0.8.0`.

Additionally, the Seqera Connect client version string has the format:

```ignore title="Seqera version tag subset"
<major>.<minor>.<patch>
```

- `<MAJOR>`: Signifies major version changes in the underlying Seqera Connect client.
- `<MINOR>`: Signifies breaking changes in the underlying Seqera Connect client.
- `<PATCH>`: Signifies patch (non-breaking) changes in the underlying Seqera Connect client.

When pushed to the container registry, an image template is tagged with the following tags:

- `<TOOL_VERSION>-<MAJOR>.<MINOR>`, such as `4.2.3-0.8`. Seqera Platform displays this tag when adding a new container template image.
- `<TOOL_VERSION>-<MAJOR>.<MINOR>.<PATCH>`, such as `4.2.3-0.8.4`.

To view the latest versions of the images, see [public.cr.seqera.io](https://public.cr.seqera.io/). You can also augment the Seqera-provided image templates or use your own custom container image templates. This approach is recommended for managing reproducible analysis environments. For more information, see [Custom environments][custom-envs].

### JupyterLab 4.2.5

The default user is the `root` account. The following [conda-forge](https://conda-forge.org/) packages are available by default:

- `python=3.13.0`
- `pip=24.2`
- `jedi-language-server=0.41.4`
- `jupyterlab=4.2.5`
- `jupyter-collaboration=1.2.0`
- `jupyterlab-git=0.50.1`
- `jupytext=1.16.4`
- `jupyter-dash=0.4.2`
- `ipywidgets=7.8.4`
- `pandas[all]=2.2.3`
- `scikit-learn=1.5.2`
- `statsmodels=0.14.4`
- `itables=2.2.2`
- `seaborn[stats]=0.13.2`
- `altair=5.4.1`
- `plotly=5.24.1`
- `r-ggplot2=3.5.1`
- `nb_black=1.0.7`
- `qgrid=1.3.1`

To install additional Python packages during a running Studio session, run `!pip install <PACKAGE_NAME>` commands in your notebook environment. To install additional system-level packages, run `apt install <PACKAGE_NAME>` in your terminal window.

To view the list of all JupyterLab image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/repo/platform/data-studio-jupyter][ds-jupyter].

### R-IDE 4.4.1

The default user is the `root` account. To install R packages during a running Studio session, run `install.packages("<PACKAGE_NAME>")` commands in your notebook environment. To install system-level packages, run `apt install <PACKAGE_NAME>` in your terminal window.

To view the list of all R-IDE image templates available, including security scan results or to inspect the container specification, see [https://public.cr.seqera.io/repo/platform/data-studio-ride][ds-ride].

### Visual Studio Code 1.93.1

[Visual Studio Code][def-vsc] is an integrated development environment (IDE) that supports many programming languages. The default user is the `root` account. The container template image ships with the latest stable version of [Nextflow] and the [VS Code extension for Nextflow][nf-lang-server] to make troubleshooting Nextflow workflows easier. To install additional extensions during a running Studio session, select **Extensions**. To install additional system-level packages, run `apt install <PACKAGE_NAME>` in your terminal window.

To view the list of all Visual Studio Code image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/platform/data-studio-vscode][ds-vscode].

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

### Xpra 6.2.0

[Xpra][def-xpra], known as _screen for X_, allows you to run X11 programs by giving you remote access to individual graphical applications. The container template image also installs NVIDIA Linux x64 (AMD64/EM64T) drivers for Ubuntu 22.04 for running GPU-enabled applications. To use these GPU drivers, your compute environment must specify GPU instance families.

The default user is the `root` account. The image is based on `ubuntu:jammy`. To install system-level packages during a running Studio session, run `apt install <PACKAGE_NAME>`.

To see the list of all Xpra image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/repo/platform/data-studio-xpra][ds-xpra].

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
[ds-vscode]: https://public.cr.seqera.io/repo/platform/data-studio-vscode
[ds-xpra]: https://public.cr.seqera.io/repo/platform/data-studio-xpra
[ds-ride]: https://public.cr.seqera.io/repo/platform/data-studio-ride
[ds-rstudio]: https://public.cr.seqera.io/repo/platform/data-studio-rstudio
[def-vsc]: https://code.visualstudio.com/
[Nextflow]: https://nextflow.io/
[nf-lang-server]: https://marketplace.visualstudio.com/items?itemName=nextflow.nextflow
[def-xpra]: https://github.com/Xpra-org/xpra
[Wave]: https://seqera.io/wave/
[build-status]: ./custom-envs#build-status


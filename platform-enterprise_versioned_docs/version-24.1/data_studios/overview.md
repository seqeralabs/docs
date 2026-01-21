---
title: "Overview"
description: "Data Studios public preview."
date: "1 Oct 2024"
tags: [data, studios]
---

Data Studios is a unified platform where you can host a combination of container images and compute environments for interactive analysis using your preferred tools, like JupyterLab and an R-IDE, Visual Studio Code IDEs, or Xpra remote desktops. Each data studio session is an individual interactive environment that encapsulates the live environment for dynamic data analysis.

On Seqera Cloud, the free tier permits only one running data studio session at a time. To run simultaneous sessions, [contact Seqera][contact] for a Seqera Cloud Pro license.

:::note
Data Studios is currently in **public preview** and is available from Seqera Platform v24.1. [Contact Seqera support](https://support.seqera.io) if you experience any problems during the deployment process. Data Studios in Enterprise is not enabled by default. You can enable Data Studios in the [environment variables configuration](../enterprise/data-studios).
:::

## Requirements

Before you get started, you need the following:

- Valid credentials to access your cloud storage data resources.
- At least the **Maintain** role set of permissions.
- A compute environment with sufficient resources. This is highly dependent on the volume of data you wish to process, but we recommended at least 2 CPUs allocated with 8192 MB of memory. See [AWS Batch](../compute-envs/aws-batch) for more information about compute environment configuration.
- [Data Explorer](../data/data-explorer) is enabled.

:::note
Currently, Data Studios only supports AWS Batch compute environments that **do not** have Fargate enabled.
:::

## Limitations

If you configured your AWS Batch compute environment to include an EFS file system with **EFS file system > EFS mount path**, the mount path must be explicitly specified. The mount path cannot be the same as your compute environment work directory. If the EFS file system is mounted as your compute environment work directory, Data Studios snapshots cannot be saved and studios sessions fail.

For more information on AWS Batch configuration, see [AWS Batch][aws-batch].

## Container image templates

Data Studios provides four container image templates: JupyterLab, R-IDE, Visual Studio Code, and Xpra. The image templates install a very limited number of packages when the session container is built. You can install additional packages as needed during a session.

You can also create your own container image templates. For more information, see [Custom environments][custom-envs].

**JupyterLab 4.2.5**

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

To install additional Python packages, execute `!pip install <packagename>` commands in your notebook environment. Additional system-level packages can be installed in a terminal window using `apt install <packagename>`.

**R-IDE 4.4.1**

The default user is the `root` account. To install R packages, execute `install.packages("<packagename>")` commands in your notebook environment. Additional system-level packages can be installed in a terminal window using `apt install <packagename>`.

**Visual Studio Code 1.93.1**

[Visual Studio Code][vsc] is an integrated development environment (IDE) that supports many programming languages. The default user is the `root` account. To install extensions, select **Extensions**. Additional system-level packages can be installed in a terminal window using `apt install <packagename>`.

**Xpra 6.2.0**

[Xpra](https://github.com/Xpra-org/xpra), known as _screen for X_, allows you to run X11 programs by giving you remote access to individual graphical applications. The container template image also installs NVIDIA Linux x64 (AMD64/EM64T) drivers for Ubuntu 22.04 for running GPU-enabled applications. To use these GPU drivers, your compute environment must specify GPU instance families.

The default user is the `root` account. The image is based on `ubuntu:jammy`. Additional system-level packages can be installed in a terminal window using `apt install <package_name>`.

## Session statuses

Data studios have the following possible statuses:

- **building**: When a custom environment is building the template image for a new data studio session. The [Wave] service performs the build action. For more information on this status, see [Inspect custom container template build status][build-status].
- **build-failed**:  When a custom environment build has failed. This is a non-recoverable error. Logs are provided to assist with troubleshooting. For more information on this status, see [Inspect custom container template build status][build-status].
- **starting**: The data studio is initializing.
- **running**: When a data studio session is **running**, you can connect to it, copy the data studio URL, or stop it. In addition, the session can continue to process requests/run computations in the absence of an ongoing connection.
- **stopping**: The recently-running session is in the process of being stopped.
- **stopped**: When a session is stopped, the associated compute resources are deallocated. You can start or delete the data studio when it's in this state.
- **errored**: This state most often indicates that there has been an error starting the data studio session but it is in a **stopped** state. There might be errors reported by the session itself but these will be overwritten with a **running** status if the data studio session is still running.

  :::tip
  If you encounter an error with the public preview release of Data Studios, [contact Seqera support][contact].
  :::

## Session checkpoints

When you start a session, it automatically creates a *checkpoint*. A checkpoint saves changes that you make to the root filesystem and stores it in the compute environment's pipeline work directory in the `.studios/checkpoints` folder with a unique name. The checkpoint is updated every five minutes.

:::warning
Checkpoints vary in size depending on libraries installed in your session environment. This can potentially result in many large files stored in the compute environment's pipeline work directory and saved to cloud storage. This storage will incur costs based on the cloud provider. Due to the architecture of Studios, you cannot delete any checkpoint files to save on storage costs. Deleting a Studio session's checkpoints will result in a corrupted Studio session that cannot be started nor recovered.
:::

When you stop and start a data studio session, or start a new data studio session from a previously created checkpoint, changes such as installed software packages and configuration files are restored and made available in the data studio session. Changes made to mounted data are not included in a checkpoint.

Checkpoints can be renamed and the name has to be unique per data studio. Spaces in checkpoint names are converted to underscores automatically.

Checkpoint files in the compute environment work directory may be shared by multiple data studios. Each checkpoint file is cleaned up asynchronously after the last data studio referencing the checkpoint is deleted.

:::note
The cleanup process is a best effort and not guaranteed. Seqera attempts to remove the checkpoint, but it can fail if, for example, the compute environment credentials used do not have sufficient permissions to delete objects from storage buckets.
:::


{/* links */}
[contact]: https://support.seqera.io/
[vsc]: https://code.visualstudio.com/
[Wave]: https://seqera.io/wave/
[aws-batch]: ../compute-envs/aws-batch
[custom-envs]: ./custom-envs
[build-status]: ./custom-envs#build-status

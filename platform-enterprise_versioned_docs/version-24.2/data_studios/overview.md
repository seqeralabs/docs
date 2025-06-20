---
title: "Overview"
description: "Studios public preview."
date: "6 February 2025"
tags: [studios]
---

Studios is a unified platform where you can host a combination of container images and compute environments for interactive analysis using your preferred tools, like JupyterLab and an R-IDE, Visual Studio Code IDEs, or Xpra remote desktops. Each Data Studio session is an individual interactive environment that encapsulates the live environment for dynamic data analysis.

On Seqera Cloud, the free tier permits only one running session at a time. To run simultaneous sessions, [contact Seqera][contact] for a Seqera Cloud Pro license.

:::note
Studios is currently in **public preview** and is available from Seqera Platform v24.1. [Contact Seqera support](https://support.seqera.io) if you experience any problems during the deployment process. Studios in Enterprise is not enabled by default. You can enable it  in the [environment variables configuration](../enterprise/studios).
:::

## Requirements

Before you get started, you need the following:

- Valid credentials to access your cloud storage data resources.
- At least the **Maintain** role set of permissions.
- A compute environment with sufficient resources. This is highly dependent on the volume of data you wish to process, but we recommended at least 2 CPUs allocated with 8192 MB of memory. See [AWS Batch](../compute-envs/aws-batch) for more information about compute environment configuration.
- [Data Explorer](../data/data-explorer) is enabled.

:::note
Currently, Studios only supports AWS Batch compute environments that **do not** have Fargate enabled.
:::

## Limitations

If you configured your AWS Batch compute environment to include an EFS file system with **EFS file system > EFS mount path**, the mount path must be explicitly specified. The mount path cannot be the same as your compute environment work directory. If the EFS file system is mounted as your compute environment work directory, snapshots cannot be saved and sessions fail. To mount an EFS volume in a studio session (for example, if your organization has a custom, managed, and standardized software stack in an EFS volume), add the EFS volume to the compute environment (system ID and mount path). The volume will be available at the specified mount path in the session.

For more information on AWS Batch configuration, see [AWS Batch][aws-batch].

## Container image templates

Studios provides four container image templates: JupyterLab, R-IDE, Visual Studio Code, and Xpra. The image templates install a very limited number of packages when the session container is built. You can install additional packages as needed during a session.

The image template tag includes the version of the analysis application, an optional incompatibility flag, and the Seqera Connect version. Connect is the proprietary Seqera web server client that manages communication with the container. The tag string looks like this:

```ignore title="Image template tag"
<tool_version>-[u<update_version>]-<connect_version>
```

- `<tool_version>`: Third-party analysis application that follows its own semantic versioning `<major>.<minor>.<patch>`, such as `4.2.5` for JupyterLab.
- `<update_version>`: Optional analysis application update version, such as `u1`, for instances where a backwards incompatible change is introduced.
- `<connect_version>`: Seqera Connect client version, such as `0.7` or `0.7.0`.

Additionally, the Seqera Connect client version string has the format:

```ignore title="Seqera version tag subset"
<major>.<minor>.<patch>
```

- `<major>`: Signifies major version changes in the underlying Seqera Connect client.
- `<minor>`: Signifies breaking changes in the underlying Seqera Connect client.
- `<patch>`: Signifies patch (non-breaking) changes in the underlying Seqera Connect client.

When pushed to the container registry, an image template is tagged with the following tags:

- `<tool_version>-<major>.<minor>`, such as `4.2.3-0.7`. When adding a new data studio container template image this is the tag displayed in Seqera Platform.
- `<tool_version>-<major>.<minor>.<patch>`, such as `4.2.3-0.7.1`.

To view the latest versions of the images, see [public.cr.seqera.io](https://public.cr.seqera.io/). You can also augment the Seqera-provided image templates or use your own custom container image templates. This approach is recommended for managing reproducible analysis environments. For more information, see [Custom environments][custom-envs].

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

To install additional Python packages during a running session, execute `!pip install <packagename>` commands in your notebook environment. Additional system-level packages can be installed in a terminal window using `apt install <packagename>`.

To see the list of all JupyterLab image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/repo/platform/data-studio-jupyter][ds-jupyter].

**R-IDE**

The default user is the `root` account. To install R packages during a running session, execute `install.packages("<packagename>")` commands in your notebook environment. Additional system-level packages can be installed in a terminal window using `apt install <packagename>`.

To see the list of all R-IDE image templates available, including security scan results or to inspect the container specification, see [https://public.cr.seqera.io/repo/platform/data-studio-ride][ds-ride].

**Visual Studio Code 1.93.1**

[Visual Studio Code][def-vsc] is an integrated development environment (IDE) that supports many programming languages. The default user is the `root` account. The container template image ships with the latest stable version of [Nextflow] and the [VSCode extension for Nextflow][nf-lang-server] to make troubleshooting Nextflow workflows easier. To install additional extensions during a running session, select **Extensions**. Additional system-level packages can be installed in a terminal window using `apt install <packagename>`.

To see the list of all Visual Studio Code image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/platform/data-studio-vscode][ds-vscode].

**Xpra 6.2.0**

[Xpra][def-xpra], known as _screen for X_, allows you to run X11 programs by giving you remote access to individual graphical applications. The container template image also installs NVIDIA Linux x64 (AMD64/EM64T) drivers for Ubuntu 22.04 for running GPU-enabled applications. To use these GPU drivers, your compute environment must specify GPU instance families.

The default user is the `root` account. The image is based on `ubuntu:jammy`. Additional system-level packages can be installed during a running session in a terminal window using `apt install <package_name>`.

To see the list of all Xpra image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/repo/platform/data-studio-xpra][ds-xpra].

## Studios statuses

Studios can have the following possible statuses:

- **building**: When a custom environment is building the template image for a new Studio session. The [Wave] service performs the build action. For more information on this status, see [Inspect custom container template build status][build-status].
- **build-failed**: When a custom environment build has failed. This is a non-recoverable error. Logs are provided to assist with troubleshooting. For more information on this status, see [Inspect custom container template build status][build-status].
- **starting**: The Studio session is initializing.
- **running**: When a Studio session is **running**, you can connect to it, copy the URL, or stop it. In addition, it can continue to process requests/run computations in the absence of an ongoing connection.
- **stopping**: The Studio session is in the process of being stopped.
- **stopped**: When a Studio session is stopped, the associated compute resources are deallocated. You can start or delete the session when it's in this state.
- **errored**: This state most often indicates that there has been an error starting the Studio session but it is in a **stopped** state. There might be errors reported by the session itself but these will be overwritten with a **running** status if the session is still running.


## Collaboration

By default a Studios session is collaborative. All workspace members can connect to a running session with the exception of those with only the **View** role. If a session is configured to run in private mode, only the user who created the session can connect to it.

:::tip
R-IDE sessions do not currently support user collaboration.
:::

## Session management

You can set a session lifespan for a Studio. Upon expiration, a snapshot is taken and the session is automatically shut down. Prior to expiry, a session's lifespan can be extended multiple times before it is shut down.

Workspace-level settings to studio lifespan are only applied to newly started studio sessions. Studios that are already running will have the lifespan that was originally set applied to them.

## Session data links

You can configure a Studio session to mount one or more data links, where cloud buckets that you have configured in your compute environment are read-only, or read-write available.

If your compute environment includes a cloud bucket in the **Allowed S3 bucket** list, the bucket is writeable from within a session when that bucket is included as a data link.

You can limit write access to just a subdirectory of a bucket by creating a custom data link for only that subdirectory in Data Explorer, and then mount the data link to the Studio session. For example, if you have the following S3 buckets:

- `s3://biopharmaXs`: Entire bucket
- `s3://biopharmaX/experiments/project-A/experiment-1/data`: Subdirectory to mount in a Studio session

Mounted data links are exposed at the `/workspace/data/` directory path inside a Studio session. For example, the bucket subdirectory `s3://biopharmaX/experiments/project-A/experiment-1/data`, when mounted as a data link, is exposed at `/workspace/data/biopharmaxs-project-a-experiment-1-data`.

For more information, see [Limit Studio access to a specific cloud bucket subdirectory][cloud-bucket-subdirectory].

## Session checkpoints

When starting a Studio session, a *checkpoint* is automatically created. A checkpoint saves all changes made to the root filesystem and stores it in the attached compute environment's pipeline work directory in the `.studios/checkpoints` folder with a unique name. The current checkpoint is updated every five minutes during a session.

:::warning
Checkpoints vary in size depending on libraries installed in your session environment. This can potentially result in many large files stored in the compute environment's pipeline work directory and saved to cloud storage. This storage will incur costs based on the cloud provider. Due to the architecture of Studios, you cannot delete any checkpoint files to save on storage costs. Deleting a Studio session's checkpoints will result in a corrupted Studio session that cannot be started nor recovered.
:::

When you stop and start a Studio session, or start a new Studio session from a previously created checkpoint, changes such as installed software packages and configuration files are restored and made available in the session. Changes made to mounted data are not included in a checkpoint.

Checkpoints can be renamed and the name has to be unique per Studio session. Spaces in checkpoint names are converted to underscores automatically.

Checkpoint files in the compute environment work directory may be shared by multiple Studio sessions. Each checkpoint file is cleaned up asynchronously after the session that referenced the checkpoint is deleted.

:::note
The cleanup process is a best effort and not guaranteed. Seqera attempts to remove the checkpoint, but it can fail if, for example, the compute environment credentials used do not have sufficient permissions to delete objects from storage buckets.
:::

## Session volume automatic resizing

By default, a session allocates an initial 2 GB of storage. Available disk space is continually monitored and if the available space drops below a 1 GB threshold, the file system is dynamically-resized to include an additional 2 GB of available disk space.

This approach ensures that a session doesn't initially include unnecessary free disk space, while providing the flexibility to accommodate installation of large software packages required for data analysis.

The maximum storage allocation for a session is limited by the compute environment disk boot size. By default, this is 30 GB. This limit is shared by all sessions running in the same compute environment.

If the maximum allocation size is reached, it is possible to reclaim storage space using a snapshot. 

Stop the active Studios session to trigger a snapshot from the active volume. The snapshot is uploaded to cloud storage with Fusion. When you start from the newly-saved snapshot, all previous data is loaded and the newly-started Studios session will have 2 GB of available space.

{/* links */}
[contact]: https://support.seqera.io/
[aws-batch]: ../compute-envs/aws-batch
[custom-envs]: ./custom-envs
[build-status]: ./custom-envs#build-status
[cloud-bucket-subdirectory]: ./managing#cloud-bucket-subdirectory
[ds-jupyter]: https://public.cr.seqera.io/repo/platform/data-studio-jupyter
[ds-ride]: https://public.cr.seqera.io/repo/platform/data-studio-ride
[def-vsc]: https://code.visualstudio.com/
[Nextflow]: https://nextflow.io/
[nf-lang-server]: https://marketplace.visualstudio.com/items?itemName=nextflow.nextflow
[ds-vscode]: https://public.cr.seqera.io/repo/platform/data-studio-vscode
[def-xpra]: https://github.com/Xpra-org/xpra
[ds-xpra]: https://public.cr.seqera.io/repo/platform/data-studio-xpra
[Wave]: https://seqera.io/wave/
[build-status]: ./custom-envs#build-status

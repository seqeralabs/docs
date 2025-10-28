---
title: "Manage Studio sessions"
description: "Manage Studio sessions."
date created: "2025-02-06"
last updated: "2025-09-04"
tags: [data, session, studios]
---

Select the **Studios** tab in Platform to:

- Start, stop, or connect to an existing session. 
- Dynamically filter the list of Studios using the search bar.
- Open a detailed view that displays configuration information.

:::note
- If you're not able to see the Studios tab, contact your Platform adminstrator.
- Review the user roles documentation for details about role permissions.
:::

## Start a Studio session

Select the three dots next to the status message for the Studio you want to start, then select **Start**. You can optionally change the configuration of the Studio, then select **Start in new tab**. Once the session is running, you can connect to it. A session will run until it is stopped manually or it encounters a technical issue.

:::note
A session consumes resources until it's **stopped**.
:::

Once a Studio session is in a **running** state, you can connect to it, obtain a public link to the session to share with collaborators inside your workspace, and stop it.

## Start an existing Studio as a new session

You can use any existing Studio as the foundation for adding a new session. This functionality creates a clone of the session, including its checkpoint history, preserving any modifications made to the original Studio. When you create a session in this way, future changes are isolated from the original session.

When adding a new session from an existing session or checkpoint, the following fields cannot be changed:

- **Studio template**
- **Original Studio session and checkpoint**
- **Compute environment**
- **Installed Conda packages**
- **Session duration**

To add a new session from an existing **stopped** session, complete the steps described in [Add a Studio][add-s].

Additionally, you can add a new session from any existing Studio checkpoint except the currently running checkpoint. From the detail page, select the **Checkpoints** tab and in the **Actions** column, select **Add as new Studio**. This is useful for interactive analysis experimentation without impacting the state of the original Studio.

## Start a new session from a checkpoint

You can start a new session from an existing stopped session. This will inherit the history of the parent checkpoint state. From the list of **stopped** Studios in your workspace, select the three dots next to the status message for the Studio you want to start and select **Add as new**. Alternatively, select the **Checkpoints** tab on the detail page, select the three dots in the **Actions** column, and then select **Add as new Studio** to start a new session.

## Stop a Studio session

To stop a running session, select the three dots next to the status message and then select **Stop**. The status will change from **running** to **stopped**. When a session is stopped, the compute resources it's using are deallocated. You can stop a session at any time, except when it is **starting**.

Stopping a running session creates a new checkpoint.

## Restart a stopped session

When you restart a stopped session, the session uses the most recent checkpoint.

## Delete a Studio

:::note
This functionality is available to all user roles excluding the **View** role.
:::

You can only delete a Studio when it's **stopped**. Select the three dots next to the status message and then select **Delete**. The Studio is deleted immediately and can't be recovered.

## Connect to a Studio

To connect to a running session, select the three dots next to the status message and choose **Connect**.

:::warning
An active connection to a session will not prevent administrative actions that might disrupt that connection. For example, a session can be stopped by another workspace user while you are active in the session, the underlying credentials can be changed, or the compute environment can be deleted. These are independent actions and the user in the session won't be alerted to any changes - the only alert will be a server connection error in the active session browser tab.
:::

Once connected, the session will display the status of **running** in the list, and any connected user's avatar will be displayed under the status in both the list of Studios and in each Studio's detail page.

## Collaborate in a Studio session

:::note
Collaborators need valid workspace permissions to connect to the running Studio.
:::

To share a link to a running session with collaborators inside your workspace, select the three dots next to the status message for the session you want to share, then select **Copy Studio URL**. Using this link, other authenticated users can access the session directly.

## Limit Studio access to a specific cloud bucket subdirectory {#cloud-bucket-subdirectory}

For a cloud bucket that is writeable, as enabled by including the bucket in a compute environment's **Allowed S3 bucket** list, you can limit write access to that bucket from within a Studio session.

To limit read-write access to a specific subdirectory, complete the following steps:

1. From your Seqera instance, select the **Data Explorer** tab.
1. Select **Add Cloud Bucket**.
1. Complete the following fields:
   - **Provider**: Select your cloud provider.
   - **Bucket path**: Enter the full path to the subdirectory of the bucket that you want to use with your Studio, such as `s3://1000genomes/data`.
   - **Name**: Enter a name for this cloud bucket, such as *1000-genomes-data-dir*, to indicate the bucket name and subdirectory path.
   - **Credentials**: Select your provider credentials.
   - Optional: **Description**: Enter a description for this cloud bucket.
1. Select **Add** to create a custom data-link to a subdirectory in the cloud bucket.

When defining a new Studio, you can configure the **Mounted data** by selecting the custom data-link created by the previous steps.

## Migrate a Studio from an earlier container image template

:::warning
Due to the nature of fully customizable, containerized applications, users can modify environments leading to a variety of configurations and outcomes. This is therefore a best effort to support Studio migrations and a successful outcome is not guaranteed.
:::

As Studios matures and new versions of JupyterLab, R-IDE, Visual Studio Code, and Xpra are released, new Seqera-provided image templates will be periodically released including updated versions of Seqera Connect. The most recent container template images will be tagged `recommended` and earlier template images will be tagged `deprecated`. Temporary container templates tagged with `experimental` are not supported and should not be used in production environments.

:::tip
Always use the `recommended` tagged template image for new Studios. Only two earlier minor versions of [Seqera Connect][connect] are supported by Seqera.
:::

To migrate a Studio to a more recent container version and Seqera Connect:

1. Select the Studio to migrate.
1. Select **Add as new**. By default this selects the latest session checkpoint.
1. In the **General config** section, change the image template selection in the dropdown list to use the `latest` tagged version of the same interactive environment.
1. For the **Summary** section, ensure that the specified configuration is correct.
1. Immediately start the new, duplicated Studio session by selecting **Add and start**.
1. **Connect** to the new running Studio session.
   1. Make a note of any package or environment errors displayed.
1. **Stop** the running Studio session.
1. Go back to the original Studio:
   1. **Start** the session.
   1. **Connect** to the session.
   1. Uninstall any packages related to the errors:
      1. JupyterLab: Execute `!pip uninstall <packagename>` or `apt remove <packagename>` to uninstall system-level packages.
      1. R-IDE: Execute `uninstall.packages("<packagename>")` to uninstall R packages or `apt remove <packagename>` to uninstall system-level packages.
      1. Visual Studio Code: Select the **Manage** gear button at the right of an extension entry and then choose **Uninstall** from the dropdown menu.
      1. Xpra: Use `apt remove <packagename>` to uninstall system-level packages.
   1. **Stop** the running Studio session. A new checkpoint is created.
1. Repeat Step 1 **Add as new** using the new, most recent created checkpoint from the steps above.

## Studio session statuses

Sessions have the following possible statuses:

- **building**: When a custom environment is building the template image for a new session. The [Wave] service performs the build action. For more information on this status, see [Inspect custom container template build status][build-status].
- **build-failed**:  When a custom environment build has failed. This is a non-recoverable error. Logs are provided to assist with troubleshooting. For more information on this status, see [Inspect custom container template build status][build-status].
- **starting**: The Studio is initializing.
- **running**: When a session is **running**, you can connect to it, copy the URL, or stop it. In addition, the session can continue to process requests/run computations in the absence of an ongoing connection.
- **stopping**: The recently-running session is in the process of being stopped.
- **stopped**: When a session is stopped, the associated compute resources are deallocated. You can start or delete the session when it's in this state.
- **errored**: This state most often indicates that there has been an error starting the session but it is in a **stopped** state.

:::note
There might be errors reported by the session itself but these will be overwritten with a **running** status if the session is still running.
:::

## Studio session data-links

You can configure a Studio session to mount one or more data-links, where cloud buckets that you have configured in your compute environment are read-only, or read-write available to the session.

If your compute environment includes a cloud bucket in the **Allowed S3 bucket** list, the bucket is writeable from within a session when that bucket is included as a data-link.

You can limit write access to just a subdirectory of a bucket by creating a custom data-link for only that subdirectory in Data Explorer, and then mount the data-link to the Studio session. For example, if you have the following S3 buckets:

- `s3://biopharmaXs`: Entire bucket
- `s3://biopharmaX/experiments/project-A/experiment-1/data`: Subdirectory to mount in a Studio session

Mounted data-links are exposed at the `/workspace/data/` directory path inside a Studio session. For example, the bucket subdirectory `s3://biopharmaX/experiments/project-A/experiment-1/data`, when mounted as a data-link, is exposed at `/workspace/data/biopharmaxs-project-a-experiment-1-data`.

For more information, see [Limit Studio access to a specific cloud bucket subdirectory][cloud-bucket-subdirectory].

## Studio session checkpoints

When starting a Studio session, a *checkpoint* is automatically created. A checkpoint saves all changes made to the root filesystem and stores it in the attached compute environment's work directory in the `.studios/checkpoints` folder with a unique name. The current checkpoint is updated every five minutes during a session.

:::warning
Checkpoints vary in size depending on libraries installed in your session environment. This can potentially result in many large files stored in the compute environment's work directory and saved to cloud storage. This storage will incur costs based on the cloud provider. Due to the architecture of Studios, you cannot delete any checkpoint files to save on storage costs. Deleting a Studio session's checkpoints will result in a corrupted Studio session that cannot be started nor recovered.
:::

When you stop and start a session, or start a new session from a previously created checkpoint, changes such as installed software packages and configuration files are restored and made available. Changes made to mounted data are not included in a checkpoint.

Checkpoints can be renamed and the name has to be unique per Studio. Spaces in checkpoint names are converted to underscores automatically.

Checkpoint files in the compute environment work directory may be shared by multiple Studios. Each checkpoint file is cleaned up asynchronously after the last Studio referencing the checkpoint is deleted.

:::note
The cleanup process is a best effort and not guaranteed. Seqera attempts to remove the checkpoint, but it can fail if, for example, the compute environment credentials used do not have sufficient permissions to delete objects from storage buckets.
:::

## Session volume automatic resizing

By default, a session allocates an initial 2 GB of storage. Available disk space is continually monitored and if the available space drops below a 1 GB threshold, the file system is dynamically-resized to include an additional 2 GB of available disk space.

This approach ensures that a session doesn't initially include unnecessary free disk space, while providing the flexibility to accommodate installation of large software packages required for data analysis. The maximum storage allocation for a session is limited by the compute environment disk boot size. By default, this is 30 GB. This limit is shared by all sessions running in the same compute environment.

If the maximum allocation size is reached, it is possible to reclaim storage space using a snapshot.

Stop the active session to trigger a snapshot from the active volume. The snapshot is uploaded to cloud storage with Fusion. When you start from the newly saved snapshot, all previous data is loaded, and the newly started session will have 2 GB of available space.

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
[add-s]: ./add-studio
[aws-gpu]: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html
[conda-syntax]: ./custom-envs#conda-package-syntax
[custom-image]: ./custom-envs#custom-containers
[connect]: ./overview#container-image-templates

---
title: "Data Studios"
description: "Data Studios private preview."
date: "20 December 2023"
tags: [unpublished]
---

Data Studios is a unified platform where you can host a combination of images and compute environments for interactive analysis using your preferred tools, like Jupyter notebooks, RStudio, and Visual Studio Code IDEs. Each data studio session is an individual interactive environment that encapsulates the live environment for dynamic data analysis.

:::note
Data Studios is currently in **private preview** and is not yet generally available. To request access, please contact your Seqera account executive.
:::

**Requirements**

Before you get started, ensure you have the following:

- Valid credentials to access your cloud storage data resources.
- At least the **Maintainer** role set of permissions.
- A compute environment with sufficient resources. This is highly dependent on the volume of data you wish to process, but it's recommended to have at least 2 CPUs allocated with 8192 MB of memory. See [AWS Batch](https://docs.seqera.io/platform/23.3.0/compute-envs/aws-batch) for more information about compute environment configuration.

:::note
Currently, Data Studios only supports AWS Batch compute environments that **do not** have Fargate enabled.
:::

### Overview

Select the **Data Studios** tab to view all data studios. The list includes the name, cloud provider, analysis template, region, creator, creation date, and the status of each session. In this view, you can add a new data studio, as well as start, stop, and connect to an existing data studio. You can dynamically filter the list of data studio sessions using the search bar.

### Add a data studio

1. Select **Add data studio**.
2. Select a template from the three options provided (JupyterLab, RStudio Server, or Visual Studio Code).
3. Select a compute environment. Currently, only AWS Batch is supported.
4. Mount data using Data explorer: Select one or more datasets to mount. Mounted data doesn't need to match the compute environment or region of the cloud provider of the data studio. However, this might cause increased costs or errors.
5. Optional: Enter CPU and memory allocations. The default values are 2 CPUs and 8192 MB memory (RAM).
6. Select **Add**.

You'll be returned to the Data Studios landing page that displays the list of data studios in your workspace. The data studio you created will be listed with the status **stopped**.

:::note
By default, Data Studios has read and write permissions to any dataset mounted to a session. This means that data can be written from the data studio session back to the cloud storage bucket mounted. To stop potential data loss, only one data studio session per workspace can mount a dataset. When adding a new data studio, datasets already mounted to other running data studios are unavailable.
:::

### Start a data studio

A data studio needs to be started before you can connect to it. From the list in your workspace, select the three dots next to the status message for the data studio you want to start, then select **Start**. A new browser tab will open that displays the startup state of the data studio. Once the data studio has successfully started running, you can connect to it. A data studio will run until it is stopped manually or it encounters a technical issue.

:::note
A data studio session uses resources until it's **stopped**.
:::

Once a data studio session is in a **running** state, you can connect to it, obtain the public link to the session to share with collaborators inside your workspace, and stop it.

### Connect to a data studio

To connect to a running data studio session, select the three dots next to the status message and choose **Connect**. A new browser tab will open, displaying the status of the data studio session. Select **Connect**.

:::caution
An active connection to a data studio session will not prevent administrative actions that might disrupt that connection. For example, a data studio can be stopped by another workspace user while you are in the session, the underlying credentials can be changed, or the compute environment can be deleted. These are independent actions and the user in the session won't be alerted to any changes - the only alert will be a server connection error in the session browser tab.
:::

### Collaborate in a data studio

To share a link to a running data studio with collaborators inside your workspace, select the three dots next to the status message for the data studio you want to share, then select **Copy data studio URL**. Using this link other authenticated users can access the session directly.

:::note
Collaborators will need valid permissions to connect to the running data studio (at least the **Connect** role for the workspace).
:::

### Stop a data studio

To stop a running session, select the three dots next to the status message and then select **Stop**. The status will change from **running** to **stopped**. When a data studio session is stopped, the compute resources it's using are deallocated and any unsaved state is lost. You can stop a session at any time.

:::note
Make sure you save before you stop a data studio.
:::

### Restart a stopped data studio

When you restart a stopped session, a new session with the same configuration is created. Note that none of the data from previous sessions is preserved unless saved to the mounted data.

### Delete a data studio

You can only delete a data studio when it's **stopped**. Select the three dots next to the status message and then select **Delete**. The data studio is deleted immediately and can't be recovered.

### Data studio statuses

Data studios have the following possible statuses:

- **starting**: The data studio is initializing.
- **running**: When a data studio session is **running**, you can connect to it, copy the data studio URL, or stop it. In addition, the session can continue to process requests/run computations in the absence of an ongoing connection.
- **stopping**: The recently-running session is in the process of being stopped.
- **stopped**: When a session is stopped, the associated compute resources are deallocated and any unsaved state is lost. You can start a session or delete the data studio when it's in this state.
- **errored**: This state most often indicates that there has been an error starting the data studio but it is in a **stopped** state. There might be errors reported by the data studio session itself but these currently will be overwritten with a **running** status if the studio is still running. If you encounter an error with the private preview release of Data Studios, please reach out to your Seqera account executive.

## Troubleshooting

### My data studio is stuck in **starting** status

If your data studio doesn't advance from **starting** status to **running** status within 30 minutes, and you have access to the AWS Console for your organization, check that the AWS Batch compute environment associated with the session is in the **ENABLED** state with a **VALID** status. You can also check the **Compute resources** settings. Contact your organization's AWS administrator if you don't have access to the AWS Console.

If sufficient resources are not available, **Stop** your data studio and any others that may be running before trying again.

### My data studio status is **errored**

The **errored** status is generally related to issues encountered when creating the data studio resources in the compute environment (e.g., invalid credentials, insufficient permissions, network issues). It can also be related to insufficient compute resources, which are set in your compute environment configuration. Contact your organization's AWS administrator if you don't have access to the AWS Console. Please also reach out to your account executive so we can investigate the issue.

### My data studio can't be stopped

If you're not able to stop a data studio, it's usually because the job running the studio failed for some reason. In this case, and if you have access to the AWS Console for your organization, you can stop the data studio from the compute environment screen. Contact your organization's AWS administrator if you don't have access to the AWS Console. Also contact your Seqera account executive so we can investigate the issue.

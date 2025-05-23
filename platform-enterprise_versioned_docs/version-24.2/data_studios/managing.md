---
title: "Manage data studio sessions"
description: "Manage data studio sessions."
date: "6 February 2025"
tags: [data, studios]
---

Select the **Data Studios** tab in Platform to view all data studio sessions. The list includes the name, cloud provider, analysis template, region, author, creation date, and status of each session. In this view, you can add a new data studio and start, stop, or connect to an existing session. Dynamically filter the list of data studios using the search bar to search by name (default), author username, or compute environment name. Select the data studio to open a detailed view that displays configuration information.

## Add a data studio

This functionality is available to users with the **Maintain** role and above.

To add a new data studio, complete the following steps:

1. In a workspace, select **Data Studios**, and then select **Add data studio**.
1. For the **Compute & Data** section, complete the following steps:

   1. Customize the following fields:
      - **Select compute environment**: Only AWS Batch is supported.
      - **CPUs allocated**: The default allocation is 2 CPUs.
      - **GPUs allocated**: Available only if the selected compute environment has GPU support enabled. For more information about GPUs on AWS, see [Amazon ECS task definitions for GPU workloads][aws-gpu]. The default allocation is 0 GPUs.
      - **Maximum memory allocated**: The default allocation is 8192 MiB of memory.
   1. Select **Mount data**, and then from the **Mount data** modal, select data to mount. Select **Mount data** to confirm your selection.

        :::tip
        Datasets are mounted using the [Fusion file system](https://docs.seqera.io/fusion) and are available at `/workspace/data/<dataset>`. Mounted data doesn't need to match the compute environment or region of the cloud provider of the data studio. However, this might cause increased costs or errors.
        :::

   1. Select **Next**.

1. For the **General config** section, complete the following steps:

   - To use one of the Seqera-provided container templates, complete the following steps:

     1. Customize the following fields:
        - **Container template**: Select a data studio template from the dropdown list.
        - **Session name**
        - Optional: **Description**
     1. Optional: Select **Install Conda packages** to enter or upload a list of Conda packages to include with the data studio. For more information on the syntax for specifying Conda packages, see [Conda package syntax][conda-syntax].
     1. Optional: Select **Private** to enable private mode.
     1. For **Session lifespan**, select either:
        - **Automatically stop the session after a predefined lifespan** and input a **Lifespan** if the default is not appropriate.
        - **Always keep the session running**
     1. Select **Next**.

   - To use a custom container template image that you supply, complete the following steps:

     1. Customize the following fields:
        - **Container template**: Select **Prebuilt container image** from the list. For information about providing your own template, see [Custom container template image][custom-image].

          :::tip
          If you select the **Prebuilt container image** template, you cannot select **Install Conda packages** as these options are mutually exclusive.
          :::

        - **Session name**
        - Optional: **Description**
     1. Optional: Select **Private** to enable private mode.
     1. For **Session lifespan**, select either:
        - **Automatically stop the session after a predefined lifespan** and input a **Lifespan** if the default is not appropriate.
        - **Always keep the session running**
     1. Select **Next**.

1. For the **Summary** section, complete the following steps:
   1. Ensure that the specified configuration is correct.
   1. Save your configuration:
      - If you want to save the data studio for future use, select **Add only**.
      - If you want to save and immediately start the data studio, select **Add and start**.

You'll be returned to the Data Studios landing page that displays the list of data studio sessions in your workspace. You can inspect the configuration details of the session that you created by selecting the session name. The data studio that you created will be listed with a status of either **stopped** or **starting**, depending on whether you elected to only add the data studio or to start a session as well.

:::note
By default, data studio sessions only have read permissions to mounted data paths. Write permissions can be added for specific cloud storage buckets during the compute environment configuration by defining additional **Allowed S3 Buckets**. This means that data can be written from the session back to the cloud storage path(s) mounted. To stop potential data loss, only one session per workspace can mount a unique data path. When adding a new session, data paths already mounted to other running sessions are unavailable. If a new file is uploaded to the cloud storage bucket path while a session is running, the file may not be available to the session immediately.
:::

## Start a data studio session

This functionality is available to users with the **Maintain** role and above.

A data studio needs to be started before you can connect to it. From the list in your workspace, select the three dots next to the status message for the data studio you want to start, then select **Start**. You can optionally change the configuration of the data studio, then select **Start in new tab**. A new browser tab will open that displays the startup state of the data studio session. Once the session is running, you can connect to it. A session will run until it is stopped manually or it encounters a technical issue.

:::note
A data studio session consumes resources until it's **stopped**.
:::

Once a session is in a **running** state, you can connect to it, obtain the public link to the session to share with collaborators inside your workspace, and stop it.

## Start an existing data studio as a new session

This functionality is available to users with the **Maintain** role and above.

You can use any existing data studio as the foundation for adding a new data studio. This functionality creates a clone of the data studio, including its checkpoint history, preserving any modifications made to the original data studio. When you create a session in this way, future changes are isolated from the original session.

When adding a new session from an existing session or checkpoint, the following fields cannot be changed:

- **Data Studio Template**
- **Original data studio session and checkpoint**
- **Compute environment**
- **Installed Conda packages**

To add a new session from an existing **stopped** session, complete the steps described in [Add a data studio](#add-a-data-studio).

Additionally, you can add a new session from any existing data studio checkpoint except the currently running checkpoint. From the data studio detail page, select the **Checkpoints** tab and in the **Actions** column, select **Start as new data studio**. This is useful for interactive analysis experimentation without impacting the state of the original data studio.

## Connect to a data studio

This functionality is available to all user roles excluding the **View** role.

To connect to a running session, select the three dots next to the status message and choose **Connect**. A new browser tab will open containing the data studio session.

:::warning
An active connection to a session will not prevent administrative actions that might disrupt that connection. For example, a session can be stopped by another workspace user while you are active in the session, the underlying credentials can be changed, or the compute environment can be deleted. These are independent actions and the user in the session won't be alerted to any changes - the only alert will be a server connection error in the active session browser tab.
:::

Once connected, the data studio session will display the status of **running** in the list, and any connected user's avatar will be displayed under the status in both the list of data studios and in each data studio session detail page.

## Collaborate in a data studio

This functionality is available to all user roles excluding the **View** role.

To share a link to a running session with collaborators inside your workspace, select the three dots next to the status message for the session you want to share, then select **Copy data studio URL**. Using this link, other authenticated users can access the session directly.

![](../data/_images/data_studios_collaboration.png)

:::note
Collaborators need valid workspace permissions to connect to the running data studio.
:::

## Stop a data studio

This functionality is available to users with the **Maintain** role and above.

To stop a running session, select the three dots next to the status message and then select **Stop**. The status will change from **running** to **stopped**. When a session is stopped, the compute resources it's using are deallocated. You can stop a session at any time, except when it is **starting**.

Stopping a running session creates a new checkpoint.

## Restart a stopped data studio

This functionality is available to users with the **Maintain** role and above.

When you restart a stopped session, the session uses the most recent checkpoint.

## Start a new session from a checkpoint

This functionality is available to users with the **Maintain** role and above.

You can start a new session from an existing stopped session. This will inherit the history of the parent checkpoint state. From the list of **stopped** data studios in your workspace, select the three dots next to the status message for the data studio and select **Start as new**. Alternatively, select the **Checkpoints** tab on the data studio detail page, select the three dots in the **Actions** column, and then select **Start as new** to start a new session.

## Delete a data studio session

This functionality is available to users with the **Maintain** role and above.

You can only delete a Studio when it's **stopped**. Select the three dots next to the status message and then select **Delete**. The Studio is deleted immediately and can't be recovered.

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

When defining a new Studio session, you can configure the **Mounted data** by selecting the custom data-link created by the previous steps.

## Modify session lifespan for all Studios

For users with the **Admin** role, the lifespan for all newly launched studio sessions is configurable for a workspace.

1. Select **Settings**, and then for the Studios card select **Edit settings**.
1. Specify the session lifespan:
   - If you want to allow sessions to run indefinitely (the default), select **Always keep the session running**
   - If you want to sessions to automatically shut down after a specific lifetime, select **Automatically stop the session after a predefined lifespan**, and then input a **Lifespan** in hours between 1-120 hours.
1. Select **Update** to commit your changes.


<!-- links -->
[aws-gpu]: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html

[conda-syntax]: ./custom-envs#conda-package-syntax
[custom-image]: ./custom-envs#custom-containers

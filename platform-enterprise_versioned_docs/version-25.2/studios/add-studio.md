---
title: "Add a Studio"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-09-04"
tags: [data, session, studios]
---

Select the **Studios** tab in Platform to add a new Studio.

:::note
- If you're not able to see the Studios tab, contact your Platform adminstrator.
- Review the user roles documentation for details about role permissions.
- The following functionality is available to users with the **Maintain** role and above.
:::

Users with the **Maintain** role and above can add Studios via the **Studios** tab in your workspace. Select **Add Studio** to get started.

## Compute and Data

- **Resource labels**: Any [resource label](../labels/overview) already defined for the compute environment is added by default. adfdAdditional custom resource labels can be added or removed as needed.
- **CPUs allocated**: The default allocation is 2 CPUs.
- **GPUs allocated**: Available only if the selected compute environment has GPU support enabled. For more information about GPUs on AWS, see [Amazon ECS task definitions for GPU workloads][aws-gpu]. The default allocation is 0 GPUs.
- **Maximum memory allocated**: The default allocation is 8192 MiB of memory.
   
### Mount data

Select **Mount data**, and then from the **Mount data** modal, select data to mount. Select **Mount data** to confirm your selection.

Data repositories are mounted using the [Fusion file system](https://docs.seqera.io/fusion) and are available at `/workspace/data/<data_repository>`. Mounted data doesn't need to match the compute environment or region of the cloud provider of the Studio. However, this might cause increased costs or errors.

By default, sessions only have read permissions to mounted data paths. Write permissions can be added for specific cloud storage buckets during the compute environment configuration by defining additional **Allowed S3 Buckets**. This means that data can be written from the session back to the cloud storage path(s) mounted. If a new file is uploaded to the cloud storage bucket path while a session is running, the file may not be available to the session immediately.

## General config

### Seqera-provided container templates

You can customize the following fields:
- **Container template**: Select a template from the dropdown list.
- **Studio name**
- Optional: **Description**

Select **Install Conda packages** to enter or upload a list of Conda packages to include with the Studio. For more information on the syntax for specifying Conda packages, see [Conda package syntax][conda-syntax].

**Collaboration**: By default, all Studios are collaborative. This means all workspace users with the launch role and above can connect to the session. You can toggle **Private** on which means that only the workspace user who created the Studio can connect to it. When **Private** is on, workspace administrators can still start, stop, and delete sessions but cannot connect to them.

**Session lifespan**: Depending on your workspace settings, you may be able to choose between the following options.
**Stop the session automatically after a predefined period of time.**
If there is an existing defined session lifespan workspace setting, you won't be able to edit this. If no workspace setting is defined, you can edit this field. The minimum value is 1 hour and the maximum is 120 hours. The default value is 8 hours. If you change the default value, the change applies only to that session. Once you've stopped the session, the value returns to default.
**Keep the session running until it's manually stopped or encounters an error which ends the session.**

#### Environment variables

For the selected compute environment, all existing environment variable key-value pairs are displayed and automatically inherited by the studio session. Additional per-session environment variables can be defined for the Studio.
     
Session-level environment variables take precedence. You can overwrite an existing compute environment-defined environment variable key-value pair by defining the same key and a different value.

### Custom container template image (BYOC)

Customize the following fields:
 **Container template**: Select **Prebuilt container image** from the list. For information about providing your own template, see [Custom container template image][custom-image].
 If you select the **Prebuilt container image** template, you cannot select **Install Conda packages** as these options are mutually exclusive.
 - **Studio name**
- Optional: **Description**

## Save and start

   1. Ensure that the specified configuration is correct.
   1. Save your configuration:
      - To not immediately start the session, select **Add only**.
      - If you want to save and immediately start the Studio, select **Add and start**.

You'll be returned to the Studios landing page that displays the list of Studio sessions (and status) in your workspace. Select a Studio to inspect its configuration details. The Studio you created will be listed with a status of either **stopped** or **starting**, based on whether you elected to **Add** it or to **Add and start** a session as well.

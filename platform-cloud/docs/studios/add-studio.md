---
title: "Add a Studio"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-09-04"
tags: [data, session, studios]
---

Select the **Studios** tab, and then select **Add Studio**.

:::info[**Prerequisites**]
Before you get started, you need:

- Valid credentials for accessing cloud storage resources
- **Maintain** role permissions (minimum)
- A compute environment with sufficient resources (scale based on data volume):
    - **CPUs**: 2 (minimum)
    - **Memory**: 8192 MB  (minimum)
- [Data Explorer](../data/data-explorer) enabled
:::

:::info[**Access and permissions**]
- If you're not able to see the Studios tab, contact your Platform adminstrator.
- Review the user roles documentation for details about role permissions.
- The following functionality is available to users with the **Maintain** role and above.
:::

## Compute and Data

- **Resource labels**: Any [resource label](../labels/overview) already defined for the compute environment is added by default. adfdAdditional custom resource labels can be added or removed as needed.
- **CPUs allocated**: The default allocation is 2 CPUs.
- **GPUs allocated**: Available only if the selected compute environment has GPU support enabled. For more information about GPUs on AWS, see [Amazon ECS task definitions for GPU workloads][aws-gpu]. The default allocation is 0 GPUs.
- **Maximum memory allocated**: The default allocation is 8192 MiB.
   
### Mount data

Mount data repositories to make them accessible in your session:

1. Select **Mount data** to open the data selection modal.
1. Choose the data repositories to mount.
1. Select **Mount data** to confirm.

Mounted repositories are accessible at /workspace/data/<DATA_REPOSITORY> using the [Fusion file system](https://docs.seqera.io/fusion). Data doesn't need to match the compute environment region, though cross-region access may increase costs or cause errors.

Sessions have read-only access to mounted data by default. Enable write permissions by adding AWS S3 buckets as **Allowed S3 Buckets** in your compute environment configuration.

Files uploaded to a mounted bucket during an active session may not be immediately available within that session.

## General config

### Seqera-managed container template images

You can customize the following fields:
- **Container template**: Select a template from the dropdown list.
- **Studio name**
- Optional: **Description**

Select **Install Conda packages** to define or upload a list of Conda packages to include with the Studio. For more information on the syntax for specifying Conda packages, see [Conda package syntax][conda-syntax].

**Collaboration**: By default, all Studios are collaborative. This means all workspace users with the launch role and above can connect to the session. You can toggle **Private** on which means that only the workspace user who created the Studio can connect to it. When **Private** is on, workspace administrators can still start, stop, and delete sessions but cannot connect to them.

**Session lifespan**: Depending on your workspace settings, you may be able to choose between the following options:

- **Stop the session automatically after a predefined period of time:** If there is an existing defined session lifespan workspace setting, you won't be able to edit this. If no workspace setting is defined, you can edit this field. The minimum value is 1 hour and the maximum is 120 hours. The default value is 8 hours. If you change the default value, the change applies only to that session. Once you've stopped the session, the value returns to default.
- **Keep the session running:** The session will stay active (and consuming compute resources) until it's manually stopped or encounters an error which ends the session.**


## Save and start

   1. Review the configuration to ensure all settings are correct.
   1. Save your configuration:
      - To not immediately start the session, select **Add only**.
      - If you want to save and immediately start the Studio, select **Add and start**.

The Studio you created will be listed on the Studios landing page with a status of either **stopped** or **starting**, based on whether you elected to **Add** it or to **Add and start** a session as well. Select a Studio to inspect its configuration details. 

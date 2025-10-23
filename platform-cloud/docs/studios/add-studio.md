---
title: "Add a Studio"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-10-21"
tags: [data, session, studios]
---

Select the **Studios** tab, and then select **Add Studio**.

:::info[**Prerequisites**]
You will need the following to get started:

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

Configure the following resource settings:

- **Resource labels**: Any [resource label](../labels/overview) already defined for the compute environment is added by default. adfdAdditional custom resource labels can be added or removed as needed.
- **CPUs allocated**: The default allocation is 2 CPUs.
- **GPUs allocated**: Available only if the selected compute environment has GPU support enabled. For more information about GPUs on AWS, see [Amazon ECS task definitions for GPU workloads][aws-gpu]. The default allocation is 0 GPUs.
- **Maximum memory allocated**: The default allocation is 8192 MiB.
   
### Mount data

Mount data repositories to make them accessible in your session:

1. Select **Mount data** to open the data selection modal.
1. Choose the data repositories to mount.
1. Select **Mount data** to confirm.

Mounted repositories are accessible at `/workspace/data/<DATA_REPOSITORY>` using the [Fusion file system](https://docs.seqera.io/fusion). Data doesn't need to match the compute environment region, though cross-region access may increase costs or cause errors.

Sessions have read-only access to mounted data by default. Enable write permissions by adding AWS S3 buckets as **Allowed S3 Buckets** in your compute environment configuration.

Files uploaded to a mounted bucket during an active session may not be immediately available within that session.

## General config

### Seqera-managed container template images

Configure the following fields:

- **Container template**: The template for the container. Select a provided container template or select **Prebuilt container image** and provide your own template (see [Custom container template image][custom-image]). If you select **Prebuilt container image**, the **Install Conda packages** option is unavailable.
- **Studio name**: The name for the Studio.
- **Description** (optional): A description for the Studio.
- **Install Conda packages**: A list of conda packages to include with the Studio. For more information on package syntax, see [conda package syntax][conda-syntax].
- **Collaboration**: Session access permissions. By default, all workspace users with the launch role and above can connect to the session. Toggle **Private** on to restrict connections to the session creator only.
    :::note
    When private, workspace administrators can still start, stop, and delete sessions, but cannot connect to them.
    :::
- **Session lifespan**: Determines how long the session remains active. Available options depend on your workspace settings:
    - **Stop the session automatically after a predefined period of time**: Sets an automatic timeout for the session (minimum: 1 hour; maximum: 120 hours; default: 8 hours). If a workspace-level session lifespan is configured, this field cannot be edited. Changes apply only to the current session and revert to default values after the session stops.
    - **Keep the session running:** Keeps the session active until manually stopped or an error terminates it. The session continues consuming compute resources until stopped.
- **Environment variable**: Defines environment variables for the session. All variables from the selected compute environment are automatically inherited and displayed. Additional session-specific variables can be added. Session-level variables take precedence — to override an inherited variable, define the same key with a different value.

## Save and start

   1. Review the configuration to ensure all settings are correct.
   1. Save your configuration:
      - To save and immediately start your Studio, select **Add and start**. 
      - To save but not immediately start your Studio, select **Add only**.

Studios you create will be listed on the Studios landing page with a status of either **stopped** or **starting**. Select a Studio to inspect its configuration details. 

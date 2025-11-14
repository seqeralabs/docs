---
title: "Custom container"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-11-14"
tags: [studio-custom, git-repository, session, studios]
---

## Custom container template

Select **Prebuilt container image** and provide your own template (see [Custom container template image][custom-image]). If you select **Prebuilt container image**, the **Install Conda packages** option is unavailable.

Configure the following fields:

- **Container template**: The template for the container. Select a provided container template.
- **Studio name**: The name for the Studio.
- **Description** (optional): A description for the Studio.
- **Install Conda packages**: A list of conda packages to include with the Studio. For more information on package syntax, see [conda package syntax][conda-syntax].
- **Collaboration**: Session access permissions. By default, all workspace users with the launch role and above can connect to the session. Toggle **Private** on to restrict connections to the session creator only.
    :::note
    When private, workspace administrators can still start, stop, and delete sessions, but cannot connect to them.
    :::
- **Session lifespan**: The duration the session remains active. Available options depend on your workspace settings:
    - **Stop the session automatically after a predefined period of time**: An automatic timeout for the session (minimum: 1 hour; maximum: 120 hours; default: 8 hours). If a workspace-level session lifespan is configured, this field cannot be edited. Changes apply only to the current session and revert to default values after the session stops.
    - **Keep the session running:** Continuous session operation until manually stopped or an error terminates it. The session continues consuming compute resources until stopped.
- **Environment variable**: Environment variables for the session. All variables from the selected compute environment are automatically inherited and displayed. Additional session-specific variables can be added. Session-level variables take precedence — to override an inherited variable, define the same key with a different value.
- **Resource labels**: Any [resource label](../labels/overview) already defined for the compute environment is added by default. Additional custom resource labels can be added or removed as needed.

### Mount data

Mount data repositories to make them accessible in your session:

1. Select **Mount data** to open the data selection modal.
1. Choose the data repositories to mount.
1. Select **Mount data** to confirm.

Mounted repositories are accessible at `/workspace/data/<DATA_REPOSITORY>` using the [Fusion file system](https://docs.seqera.io/fusion). Data doesn't need to match the compute environment region, though cross-region access may increase costs or cause errors.

Sessions have read-only access to mounted data by default. Enable write permissions by adding AWS S3 buckets as **Allowed S3 Buckets** in your compute environment configuration.

Files uploaded to a mounted bucket during an active session may not be immediately available within that session.

## Save and start

   1. Review the configuration to ensure all settings are correct.
   1. Save your configuration:
      - To save and immediately start your Studio, select **Add and start**. 
      - To save but not immediately start your Studio, select **Add only**.

Studios you create will be listed on the Studios landing page with a status of either **stopped** or **starting**. Select a Studio to inspect its configuration details. 

{/* links */}
[contact]: https://support.seqera.io/
[aws-cloud]: ../compute-envs/aws-cloud
[aws-gpu]: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html
[aws-batch]: ../compute-envs/aws-batch
[custom-envs]: ./custom-envs
[conda-syntax]: ./custom-envs#conda-package-syntax
[custom-image]: ./custom-envs#custom-containers
[containers]: ./container-images

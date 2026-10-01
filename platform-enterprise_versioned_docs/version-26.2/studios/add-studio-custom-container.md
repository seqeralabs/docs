---
title: "Custom container template"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2026-09-30"
tags: [studio custom, git repository, sessions, studios]
---

:::info[**Prerequisites**]
You will need the following to get started:

- Valid credentials for accessing cloud storage resources
- **Maintain** role permissions (minimum)
- A compute environment with sufficient resources (scale based on data volume)
- [Data Explorer](../data/data-explorer) enabled
- If your container image is in a private registry, [container registry credentials][registry-creds] for that registry in the workspace. Wave uses them to pull the image. They are separate from your compute environment and cloud storage credentials.
:::

{/* doc-skills: PRE-IMPLEMENTATION — reviewed: no — brief: .docs-operating-model/briefs/PLAT-6576.md — verify against shipped behavior before publishing */}

For ready-to-use examples, see [Example custom Studios][example-studios]. Select **Custom container template** and provide your own template (see [Custom container template image][custom-image]). From version 26.2, you can also **Install Conda packages** on top of a custom container template. See [Conda augmentation of custom images][custom-image-conda].

Configure the following fields in each section of the form:

- **Studio environment**
  - **Container identifier**: The template for the container.
  - **More settings**:
    - **Install Conda packages** (optional): A list of Conda packages to include with the Studio. For more information on package syntax, see [Conda package syntax][conda-syntax].

      :::note
      A target container repository must be set, either for the Seqera Platform instance with the `TOWER_DATA_STUDIO_WAVE_CUSTOM_IMAGE_REGISTRY` environment variable, or per workspace by the workspace Admin in **Settings** > **Studios** > **Container repository**. If no repository is set, the build fails. The workspace must have credentials with push access to the repository.
      :::

- **Compute**
  - **Compute environment**: The compute environment to launch the Studio session in.
  - **CPUs allocated**: The number of CPUs allocated to the Studio session.
  - **Maximum memory allocated**: The maximum memory allocated to the Studio session.
  - **More settings** (optional):
    - **Resource labels**: Any [resource label](../labels/overview) already defined for the compute environment is added by default. Additional custom resource labels can be added or removed as needed.
    - **Environment variables**: Environment variables for the session. All variables from the selected compute environment are automatically inherited and displayed. Additional session-specific variables can be added. Session-level variables take precedence. To override an inherited variable, define the same key with a different value.
- **Details**
  - **Name**: The name for the Studio.
  - **More settings**:
    - **Description** (optional): A description for the Studio.
    - **Collaboration mode**: Session access permissions. By default, all workspace users with the launch role and above can connect to the session. Select **Private** to restrict connections to the session creator only.

      :::note
      When private, workspace administrators can still start, stop, and delete sessions, but cannot connect to them.
      :::

    - **SSH Connection (public preview)**: From Enterprise v25.3.3, you can enable direct connections to running Studio sessions using standard SSH clients, VS Code Remote SSH, or terminal access. Enable the toggle to allow SSH connections to this Studio session. See [Studios SSH configuration](../enterprise/studios-ssh) for configuration details.
    - **Session lifespan**: The duration the session remains active. Available options depend on your workspace settings:
      - **Stop the session automatically after a predefined period of time**: An automatic timeout for the session (minimum: 1 hour; maximum: 120 hours; default: 8 hours). If a workspace-level session lifespan is configured, this field cannot be edited. Changes apply only to the current session and revert to default values after the session stops.
      - **Keep the session running:** Continuous session operation until manually stopped or an error terminates it. The session continues consuming compute resources until stopped.

### Data

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
[custom-image-conda]: ./custom-envs#custom-image-conda
[containers]: ./container-images
[example-studios]: ./example-studios
[registry-creds]: ../credentials/overview

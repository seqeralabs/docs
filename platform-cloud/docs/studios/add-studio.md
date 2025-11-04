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
- If you're adding a Studio from a Git repository:
  - Git credentials configured in your workspace
  - A Git repository containing `.seqera/studio-config.yaml` and at least one of `.seqera/conda-environment.yaml` or `.seqera/Dockerfile`
:::

## Add a Studio from Git repository

You can add a Studio by referencing a Git repository containing Studio configuration files.

**Limitations**

- **Compute environments**: Compute environments are workspace-specific and cannot be defined in Git repositories. Select the compute environment when adding a Studio.
- **Data links**: Data links cannot be referenced in Git repositories. Select data links when adding a Studio.
- **Mono-repos**: Git repositories containing multiple Studio configurations are not supported.

### Create a `.seqera/studio-config.yaml` configuration file

The following fields can be defined:

**Required:**
- Maximum memory in MiB allocated

**Optional:**
- Resource labels
- CPUs allocated
- GPUs allocated
- Name (if undefined, auto-generated name will be used)
- Description (if undefined, will remain NULL)
- Base template image (valid path to Seqera-managed template or full path to Dockerfile)
- Environment (reference to conda-environment.yaml file)
- Collaboration mode ("Private") (if True, session is private to creator)
- Session lifespan (hours session will run; defaults to workspace setting, can be overridden with Maintain+ role)
- Environment variables (list of key:value pairs)

### Create a `.seqera/conda-environment.yaml` configuration file 

YAML object defining the list of packages (and optionally pinned versions) to install. Uses standard Conda environment file syntax. See [Conda package syntax](/platform-cloud/studios/custom-envs#conda-package-syntax).

### Create a `.seqera/Dockerfile` configuration file

Customer-generated container definition. See [Custom container template image](/platform-cloud/studios/custom-envs#custom-containers) for requirements.

### Add a Studio

1. From the **Studios** tab, select **Add Studio**.
2. Add Git repository information:
   - **Repository URL**: Enter the full URL to your Git repository (e.g., `https://github.com/your-org/studio-config.git`)
   - **Revision**: Select a branch, tag, or commit from the dropdown. The dropdown is dynamically populated based on the repository URL. If no revision is selected, the default branch is used.
:::note
When the Git URL or Revision fields are changed, form field values dynamically update.
:::
3. **Select compute environment** (required): This must be selected manually as compute environments cannot be defined in Git repositories.
4. **Mount data** (optional): Select data-links to mount. Data links cannot be defined in Git repositories.
5. Review the auto-populated configuration. All form fields remain editable.
6. Select **Add and start** or **Add only**.

### Repository cloning

When a Studio session starts from a Git repository, the repository contents are cloned into the session:
- **JupyterLab, R-IDE, VS Code**: `/workspace/<repository-name>/`
- **Xpra**: `/root/`

**Example:** Repository `https://github.com/seqeralabs/studio-templates.git` clones to `/workspace/studio-templates/` with README.md at `/workspace/studio-templates/README.md`.

## Compute and Data

Configure the following resource settings:

- **Resource labels**: Any [resource label](../labels/overview) already defined for the compute environment is added by default. Additional custom resource labels can be added or removed as needed.
  
For AWS Batch compute environments:

   - **CPUs allocated**: The default allocation is 2 CPUs.
   - **GPUs allocated**: Available only if the selected compute environment has GPU support enabled. For more information about GPUs on AWS, see [Amazon ECS task definitions for GPU workloads][aws-gpu]. The default allocation is 0 GPUs.
   - **Maximum memory allocated**: The default allocation is 8192 MiB of memory.
   
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
- **Session lifespan**: The duration the session remains active. Available options depend on your workspace settings:
    - **Stop the session automatically after a predefined period of time**: An automatic timeout for the session (minimum: 1 hour; maximum: 120 hours; default: 8 hours). If a workspace-level session lifespan is configured, this field cannot be edited. Changes apply only to the current session and revert to default values after the session stops.
    - **Keep the session running:** Continuous session operation until manually stopped or an error terminates it. The session continues consuming compute resources until stopped.
- **Environment variable**: Environment variables for the session. All variables from the selected compute environment are automatically inherited and displayed. Additional session-specific variables can be added. Session-level variables take precedence — to override an inherited variable, define the same key with a different value.

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

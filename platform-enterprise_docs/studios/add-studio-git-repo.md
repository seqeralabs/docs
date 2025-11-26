---
title: "Import from Git repository"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-11-14"
tags: [studio-git, git-repository, session, studios]
---

:::info[**Prerequisites**]
You will need the following to get started:

- **Maintain** role permissions (minimum)
- A compute environment with sufficient resources (scale based on data volume)
- [Data Explorer](../data/data-explorer) enabled
- Git credentials configured in your workspace
- A Git repository containing `seqera/studio-config.yaml`.
:::

**Limitations**

- Compute environments are workspace-specific and cannot be defined in Git repositories. Select the compute environment when adding a Studio.
- Data links cannot be referenced in Git repositories. Select data links when adding a Studio.
- Git repositories containing multiple Studio configurations are not supported.

### Create the required configuration files 

**`.seqera/studio-config.yaml` configuration file**

The following fields can be defined:

**Required**
- Maximum memory in MiB allocated

**Optional**
- Resource labels
- CPUs allocated
- GPUs allocated
- Name (if undefined, an auto-generated name will be used)
- Description
- Base template image (valid path to Seqera-managed template or full path to Dockerfile)
- Environment (reference to `conda-environment.yaml` file)
- Collaboration mode (**Private**) 
- Session lifespan (hours session will run; defaults to workspace setting)
- Environment variables (list of `key:value` pairs)


**`.seqera/conda-environment.yaml` configuration file**

This is a YAML object defining the list of packages (and optionally pinned versions) to install. It uses standard conda environment file syntax. See [Conda package syntax][conda-syntax]. 

The only required field is `session.template.kind`. All other fields are optional.

Example: 

```yaml
schemaVersion: "0.0.1"
kind: "studio-config"
session:
    name: "studio-name"
    description: "desc"
    template:
        kind: "registry"|"dockerfile"|"none"
        registry: "cr.seqera.io/image:latest"    # Ignored for `dockerfile` nad `none`
        dockerfile: "Dockerfile"                 # Ignored for `registry` and `none`
    clone:
        enabled: true                            # Defaults to `true`
        path: "/workspace"                # Defaults to `/workspace`
    dependencies:
        condaEnvironmentFile: "environment.yaml" # Ignored for `dockerfile`
    computeRequirements:
        awsBatch: # Ignored for non-batch CE
            cpu: 2
            gpu: 0
            memory: 8192
    environmentVariables:
        -   name: "var1"
            value: "value1"
        -   name: "var2"
            value: "value2"
    management:
        lifespanHours: 1 # Ignored if workspace lifespan is set
        isPrivate: false # Defaults to false
```

**`.seqera/Dockerfile` configuration file**

Customer-generated container definition. See [Custom container template image][custom-image] for requirements.

You can add a Studio by referencing a Git repository containing Studio configuration files. You can also configure the following fields:

- **Repository URL**: Enter the full URL to your Git repository (e.g., `https://github.com/your-org/your-repo`)
- **Revision**: Select a branch, tag, or commit from the dropdown. The dropdown is dynamically populated based on the repository URL. If no revision is selected, the main or master branch is used.
- **Resource labels**: Any [resource label](../labels/overview) already defined for the compute environment is added by default. Additional custom resource labels can be added or removed as needed.
- **Environment variable**: Environment variables for the session. All variables from the selected compute environment are automatically inherited and displayed. Additional session-specific variables can be added. Session-level variables take precedence — to override an inherited variable, define the same key with a different value.
- **Collaboration**: Session access permissions. By default, all workspace users with the launch role and above can connect to the session. Toggle **Private** on to restrict connections to the session creator only.
    :::note
    When private, workspace administrators can still start, stop, and delete sessions, but cannot connect to them.
    :::
- **Session lifespan**: The duration the session remains active. Available options depend on your workspace settings:
    - **Stop the session automatically after a predefined period of time**: An automatic timeout for the session (minimum: 1 hour; maximum: 120 hours; default: 8 hours). If a workspace-level session lifespan is configured, this field cannot be edited. Changes apply only to the current session and revert to default values after the session stops.
    - **Keep the session running:** Continuous session operation until manually stopped or an error terminates it. The session continues consuming compute resources until stopped.

 :::note
 When the **Git URL** or **Revision** fields are changed, form field values dynamically update.
 :::

### Mount data

Mount data repositories to make them accessible in your session:

1. Select **Mount data** to open the data selection modal.
1. Choose the data repositories to mount.
1. Select **Mount data** to confirm.

Mounted repositories are accessible at `/workspace/data/<DATA_REPOSITORY>` using the [Fusion file system](https://docs.seqera.io/fusion). Data doesn't need to match the compute environment region, though cross-region access may increase costs or cause errors.

Sessions have read-only access to mounted data by default. Enable write permissions by adding AWS S3 buckets as **Allowed S3 Buckets** in your compute environment configuration.

Files uploaded to a mounted bucket during an active session may not be immediately available within that session.

### Repository cloning

When a Studio session starts from a Git repository, the repository contents are cloned into the session. For example, repository `https://github.com/seqeralabs/studio-templates.git` clones to `/workspace/studio-templates/` with README.md at `/workspace/studio-templates/README.md`.

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

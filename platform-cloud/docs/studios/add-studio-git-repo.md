---
title: "Import from Git repository"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-11-14"
tags: [studio-git, git-repository, session, studios, git, version-control]
---

:::info[**Prerequisites**]
You will need the following to get started:

- **Maintain** role permissions (minimum)
- A compute environment with sufficient resources (scale based on data volume)
- [Data Explorer](../data/data-explorer) enabled
- Git credentials configured in your workspace
- A Git repository containing a `seqera` folder
:::

**Limitations**

- Compute environments are workspace-specific and cannot be defined in Git repositories. Select the compute environment when adding a Studio.
- Data links cannot be referenced in Git repositories. Select data links when adding a Studio.
- Git repositories with multiple Studio configurations are not supported. However, it is possible to use a Git repository with multiple branches and different configurations in each branch.

### Create the required configuration files 

**.seqera/studio-config.yaml configuration file**

Create a `.seqera/studio-config.yaml` file in the `.seqera/ ` directory of your repository. The only required field is `session.template.kind`. All other fields are optional.

```yaml
schemaVersion: "0.0.1"
kind: "studio-config"
session:
    name: "studio-name"
    description: "desc"
    template:
        kind: "registry"|"dockerfile"|"none"
        registry: "cr.seqera.io/image:latest"    # Ignored for `dockerfile` and `none`
        dockerfile: "Dockerfile"                 # Ignored for `registry` and `none`
    clone:
        enabled: true                            # Defaults to `true`
        path: "/workspace"                       # Defaults to `/workspace`. If you want to clone to `/workspace/repository` then you need to specify this.
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

The schema can define a Dockerfile, which has to be inside the `.seqera` folder. The following limitations apply:

- You need to configure a target repository for the registry using the `TOWER_DATA_STUDIO_WAVE_CUSTOM_IMAGE_REGISTRY` and `TOWER_DATA_STUDIO_WAVE_CUSTOM_IMAGE_REPOSITORY` environment variables.
- Each workspace needs to have credentials available in the workspace to push to the defined registry.
- The only supported registry and compute environment combination for a fully private Dockerfile-based Studio is ECR and AWS.

Dockerfile-based Studios cannot be pushed to the Wave community registry. If no registry configuration is specified, it defaults to the Wave default.

### Add a Studio

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
1. Choose the data to mount.
1. Select **Mount data** to confirm.

Mounted repositories are accessible at `/workspace/data/<DATA_REPOSITORY>` using the [Fusion file system](https://docs.seqera.io/fusion). Data doesn't need to match the compute environment region, though cross-region access may increase costs or cause errors.

Sessions have read-only access to mounted data by default. Enable write permissions by adding AWS S3 buckets as **Allowed S3 Buckets** in your compute environment configuration.

Files uploaded to a mounted bucket during an active session may not be immediately available within that session. [More information](../troubleshooting_and_faqs/studios_troubleshooting#running-session-does-not-show-new-data-in-object-storage).

### Repository cloning

When a Studio session starts from a Git repository, the repository contents are cloned into the session, using the same commit that was selected, or resolved, when the Studio was first created. For example, repository `https://github.com/seqeralabs/studio-templates.git` clones to `/workspace/studio-templates/` with `README.md` at `/workspace/studio-templates/README.md`.

You can disable cloning, which allows you to share a public/private template. You can define the clone path configuration in the schema without the need to build a different Docker image.

#### Limitations

- Platform credentials are not shared with the Studio.
- The `.git` folder is not synced and you cannot push/pull from the configured repository after initial Studio creation.
- There are no preprovisioned Git credentials available to use in the Studio.

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

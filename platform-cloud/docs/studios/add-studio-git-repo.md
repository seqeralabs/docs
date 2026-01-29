---
title: "Import from Git repository"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-12-12"
tags: [studio-git, git-repository, session, studios, git, version-control]
---

:::info[**Prerequisites**]
You will need the following to get started:

- **Maintain** role permissions or above
- A compute environment with sufficient resources (scale based on data volume)
- [Data Explorer](../data/data-explorer) enabled
- Git credentials configured in your workspace
- A Git repository containing a `.seqera` folder
:::

**Limitations**

- Compute environments are Platform-specific and cannot be defined in external Git repositories. Select the compute environment when you add a Studio.
- Data-links currently cannot be referenced in Git repositories. Mount data manually when adding a Studio.
- Git repositories with multiple Studio configurations are not supported. However, it is possible to use a Git repository with multiple branches and a single configuration per branch.

### Create the required configuration files

Create a `studio-config.yaml` file in the the `.seqera` directory in your repository. Your `studio-config.yaml` should contain at least `schemaVersion `, `kind` and `session.template.kind`. All other fields are optional.

```yaml
schemaVersion: "0.0.1"
kind: "studio-config"
session:
  name: "studio-name"                          # Must be unique to a workspace. If undefined, an auto-generated name is used
  description: "desc"                          # Short description of what the Studio is for
  template:
    kind: "registry"|"dockerfile"|"none"       # Required
    registry: "cr.seqera.io/image:latest"      # Ignored for `dockerfile` and `none`
    dockerfile: "Dockerfile"                   # Ignored for `registry` and `none`
  clone:
    enabled: true                              # Clone the contents of the repository to the Studio. Defaults to `true`
    path: "/workspace"                         # Defaults to `/workspace`. If you want to clone to `/workspace/repository` then you need to specify this
  dependencies:
    condaEnvironmentFile: "environment.yaml"   # Define additional libraries (and versions). Ignored for `dockerfile`
  computeRequirements:
    awsBatch:                                  # Ignored for non-AWS batch CE
      cpu: 2                                   # Number of CPUs to use. Defaults to 2
      gpu: 0                                   # Number of GPUs to use (if the CE supports GPUs). Defaults to 0
      memory: 8192                             # Memory allocated in MiB. Defaults to 8192
  environmentVariables:                        # Ordered sequence of elements that are objects (or mappings) of key-value pairs
    - name: "var1"
      value: "value1"
    - name: "var2"
      value: "value2"
  management:                                  # Session management settings
    lifespanHours: 1                           # Ignored if workspace lifespan is set
    isPrivate: false                           # Defaults to `false`
```

The schema can define a custom `Dockerfile` or an `environment.yaml` file, which must be in the `.seqera` folder. The following limitations apply:

- The workspace Admin needs to set a target repository per workspace, in **Settings > Studios > Container repository**. If no repository configuration is specified, the build will fail.
- Each workspace needs to have credentials available in the workspace to push to the repository you've specified.
- The only supported repository and compute environment combination for a fully private Dockerfile-based Studio is ECR and AWS.
- The files pulled for Dockerbuild context have individual and total file size limits:
  - Individual files cannot be larger than 5 MB.
  - Total file size cannot be more than 10 MB.

:::tip
To help you get started, a [GitHub repository][github-examples] with multiple branches for various use cases is publicly available. Each branch offers different configuration options.
:::

### Add a Studio

You can add a Studio by referencing a Git repository containing Studio configuration files. You can also configure the following fields:

- **Git repository**: Enter the full URL to your Git repository (e.g., `https://github.com/your-org/your-repo`).
- **Revision**: Select a branch, tag, or commit from the dropdown. The dropdown is dynamically populated based on the repository URL. If no revision is selected, the default branch is used.
- **Install Conda packages**: A list of conda packages to include with the Studio. For more information on package syntax, see [conda package syntax][conda-syntax].
- **Resource labels**: Any [resource label](../labels/overview) already defined for the compute environment is added by default, but can be removed. Additional custom resource labels can be added or removed as needed.
- **Environment variables**: Environment variables for the session. All variables from the selected compute environment are automatically inherited and displayed. Additional session-specific variables can be added. Session-level variables take precedence. To override an inherited variable, define the same key with a different value.
- **Studio name**: The name for the Studio.
- **Description** (optional): A description for the Studio.
- **Collaboration**: Session access permissions. By default, all workspace users with the launch role and above can connect to the session. Toggle **Private** on to restrict connections to the session creator only.
    :::note
    When private, workspace administrators can still start, stop, and delete sessions, but cannot connect to them.
    :::
- **Session lifespan**: The duration the session remains active. Available options depend on your workspace settings:
    - **Stop the session automatically after a predefined period of time**: An automatic timeout for the session (minimum: 1 hour; maximum: 120 hours; default: 8 hours). If a workspace-level session lifespan is configured, this field cannot be edited. Changes apply only to the current session and revert to default values after the session stops.
    - **Keep the session running**: Continuous session operation until manually stopped or an error terminates it. The session continues consuming compute resources until stopped.

 :::note
 When the **Git URL** or **Revision** fields are changed, form field values dynamically update.
 :::

### Mount data

Mount data to make them accessible in your session:

1. Select **Mount data** to open the data selection modal.
1. Choose the data to mount.
1. Select **Mount data** to confirm.

Once the Studio session is running, mounted data are accessible at `/workspace/data/<DATA_LINK_NAME>` using the [Fusion file system](https://docs.seqera.io/fusion). Data doesn't need to match the compute environment region, though cross-region data transfer (ingress and egress) may increase costs.

Sessions have read-only access to mounted data by default. Enable write permissions by adding AWS S3 buckets as **Allowed S3 Buckets** in your compute environment configuration.

Files uploaded to a mounted bucket during an active session may not be immediately available within that session. See [Running session does not show new data in object storage](../troubleshooting_and_faqs/studios_troubleshooting#running-session-does-not-show-new-data-in-object-storage) for more information.

### Repository cloning

When a Studio session starts from a Git repository, the repository contents are cloned into the session, using the same commit that was selected, or resolved, when the Studio was first created. For example, repository `https://github.com/seqeralabs/studio-templates.git` clones to `/workspace/` with `README.md` at `/workspace/README.md`.

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
[github-examples]: https://github.com/seqeralabs/studio-schema-examples
[contact]: https://support.seqera.io/
[aws-cloud]: ../compute-envs/aws-cloud
[aws-gpu]: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html
[aws-batch]: ../compute-envs/aws-batch
[custom-envs]: ./custom-envs
[conda-syntax]: ./custom-envs#conda-package-syntax
[custom-image]: ./custom-envs#custom-containers
[containers]: ./container-images

---
title: "Add pipelines"
description: "An introduction to adding pipelines to Seqera Platform workspaces"
date created: "2024-07-12"
last updated: "2026-06-19"
tags: [platform, launch, pipelines, launchpad]
---

The Launchpad lists the preconfigured Nextflow pipelines that you can run on the [compute environments](../../compute-envs/overview) in your workspace.

You can import pipelines to your workspace Launchpad in two ways: directly from Seqera Pipelines, or manually with **Add pipeline** in Seqera Platform.

## Import from Seqera Pipelines

[Seqera Pipelines](https://seqera.io/pipelines) is a curated collection of open-source pipelines that you can import directly to your workspace Launchpad. Each pipeline includes a dataset for a test run that confirms compute environment compatibility.

To import a pipeline:
1. Select **Launch** next to the pipeline name in the list. In the **Add pipeline** tab, select **Cloud** or **Enterprise** depending on your Platform account type, then provide the information needed for Seqera Pipelines to access your Platform instance:
    - **Seqera Cloud**: Paste your Platform **Access token** and select **Next**.
    - **Seqera Enterprise**: Specify the **Seqera Platform URL** (hostname) and **Base API URL** for your Enterprise instance, then paste your Platform **Access token** and select **Next**.
    :::note
    If you do not have a Platform access token, select **Get your access token from Seqera Platform** to open the Access tokens page in a new browser window.
    :::
1. Select the Platform **Organization**, **Workspace**, and **Compute environment** for the imported pipeline.
1. (Optional) Customize the **Pipeline Name** and **Pipeline Description**.
    :::note
    Pipeline names must be unique per workspace.
    :::
1. Select **Add Pipeline**.

## Add from the Launchpad

From your workspace Launchpad, select **Add Pipeline** and specify the following pipeline details:

- (Optional) **Image**: Select the **Edit** icon on the pipeline image to open the **Edit image** window. From here, select **Upload file** to browse for an image file, or drag and drop the image file directly. Images must be in JPG or PNG format, with a maximum file size of 200 KB.
    :::note
    You can upload custom icons when adding or updating a pipeline. If no user-uploaded icon is defined, Platform retrieves and attaches a pipeline icon in the following order of precedence:
      1. A valid `icon` key:value pair defined in the `manifest` object of the `nextflow.config` file.
      2. The GitHub organization avatar (if the repository is hosted on GitHub).
    3. If none of the above are defined, Platform auto-generates and attaches a pipeline icon.
    :::
- **Name**: A custom name of your choice. Pipeline names must be unique per workspace.
- (Optional) **Description**: A summary of the pipeline, or any information useful to workspace participants when they select a pipeline to launch.
- (Optional) **Labels**: Categorize the pipeline by criteria such as research group or reference genome version to help workspace participants select the right pipeline for their analysis.
- **Compute environment**: Select an existing workspace [compute environment](../../compute-envs/overview).
- **Pipeline to launch**: The URL of any public or private Git repository that contains Nextflow source code.
- **Revision**: A valid repository commit ID, tag, or branch name. Determines the version of the pipeline to launch.
    :::tip
    Selecting a specific pipeline version is important for reproducibility. Each run with the same input data then generates the same results.
    :::
- **Commit ID**: Pin pipeline revision to the most recent HEAD commit ID. If no commit ID is pinned, the latest revision of the repository branch or tag is used.
- **Pull latest**: Fetch the most recent HEAD commit ID of the pipeline revision at launch time. Unpins the **Commit ID**, if set.
    :::info
    See [Git revision management](../../pipelines/revision.md) for more information on **Commit ID**, **Pull latest**, and **Revision** behavior.
    :::
- (Optional) **Config profiles**: Select a predefined profile for the Nextflow pipeline.
    :::info
    nf-core pipelines include a `test` profile that is associated with a minimal test dataset. This profile runs the pipeline with heavily sub-sampled input data for the purposes of [CI/CD](https://resources.github.com/devops/ci-cd/) and to quickly confirm that the pipeline runs on your infrastructure.
    :::
- (Optional) **Pipeline parameters**: Set custom pipeline parameters that are prepopulated when users launch the pipeline from the Launchpad. For example, set the path to local reference genomes so users don't need to locate these files at launch.
- (Optional) **Pre-run script**: Define Bash code that executes before the pipeline launches in the same environment where Nextflow runs.
    :::info
    Pre-run scripts are useful for defining executor settings, troubleshooting, and defining a specific version of Nextflow with the `NXF_VER` environment variable.
    :::

After you fill in the fields, select **Add**. Your pipeline is now available for workspace participants to launch in the preconfigured compute environment.

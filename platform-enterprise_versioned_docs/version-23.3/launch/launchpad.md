---
title: "Launch pipelines"
description: "Curate and launch workflows"
date: "21 Apr 2023"
tags: [launchpad]
---

Seqera Platform Launch makes it easy for users without Nextflow expertise to configure pipeline parameters and launch workflows. View, configure, and launch pipelines on the **Launch Pipeline** page, accessed from your workspace **Launchpad**.

## Launchpad

The **Launchpad** enables workspace users to launch pre-configured pipelines, add new pipelines, or perform a quick launch of unsaved pipelines. Use the **Sort by:** drop-down to sort pipelines, either by name or most-recently updated.

:::note
A pipeline is a repository containing a Nextflow workflow, a compute environment, and pipeline parameters.
:::

The list layout is the default **Launchpad** view. Use the toggle to the right of the **Search** field to switch between the list and tile views. Both views display the compute environment of each pipeline for easy reference.

## Launch form

The **Launch form** is used to launch pipelines and to add pipelines to the Launchpad. Select **Launch** next to a saved pipeline in the Launchpad list, or select **launch a run without configuration** below the Launchpad heading to perform a quick launch of an unsaved pipeline.

**Launch a saved pipeline**

Select **Launch** next to the pipeline of your choice to open the pipeline launch form.

Seqera uses a `nextflow_schema.json` file in the root of the pipeline repository to dynamically create a form with the necessary pipeline parameters.

All pipelines contain at least these parameters:

**Workflow run name**: A unique identifier for the run, pre-filled with a random name. This can be customized.
**Labels**: Assign new or existing [labels](../labels/overview) to the run.
**Input/output options**: Specify paths to pipeline input [datasets](../data/datasets), output directories, and other pipeline-specific I/O options. _input_ and _outdir_ are required fields common to all pipelines:

- **input**
Specify compatible input datasets manually or from the drop-down menu. Select **Browse** to view the available datasets or browse for [Data Explorer](../data/data-explorer) files in a popup window. The Data Explorer tab allows you to select input datasets that match your [pipeline schema](../pipeline-schema/overview) `mimetype` criteria (`text/csv` for CSV files, or `text/tsv` for TSV files).

- **outdir**
Specify the output directory where run results will be saved. Specify the directory path manually, or select **Browse** to specify a cloud storage directory using [Data Explorer](../data/data-explorer).

The remaining fields of the pipeline parameters form will vary for each pipeline, dependent on the parameters specified in the pipeline schema. When you have filled the necessary launch form details, select **Launch**. The **Runs** tab shows your new run in a **submitted** status at the top of the list. Select the run name to navigate to the [**View Workflow Run**](../monitoring/run-details) page and view the configuration, parameters, status of individual tasks, and run report.

:::note
For more information on relaunch and resume, see [Cache and resume](./cache-resume).
:::

**Quick launch an unconfigured pipeline**

1. Select **launch a run without configuration** below the Launchpad heading.
2. On the **Launch** form, enter an optional **Workflow run name** (or keep the randomly assigned default) and assign optional labels to the run.
3. Select a **Compute environment** from the available options. See [Compute environments](../compute-envs/overview) to learn how to create an environment for your preferred execution platform.
4. Enter a repository URL for the **Pipeline to launch** (e.g., `https://github.com/nf-core/rnaseq.git`).

:::note
Nextflow pipelines are Git repositories that can reside on any public or private Git-hosting platform. See [Git integration](../git/overview) in the Seqera docs and [Pipeline sharing](https://www.nextflow.io/docs/latest/sharing.html) in the Nextflow docs for more details.
:::

5. Select a **Revision number** to use a specific version of the pipeline (optional). The Git default branch (e.g. main or master) or `manifest.defaultBranch` in the Nextflow configuration will be used by default.
6. Enter the **Work directory**, which corresponds to the Nextflow work directory. You can also **Browse** for a cloud storage directory with Data Explorer. The default work directory of the compute environment will be used by default.

:::note
The credentials associated with the compute environment must have access to the work directory (e.g., an S3 bucket).
:::

7. Select any **Config profiles** you wish to use. See [Nextflow Config profiles](https://www.nextflow.io/docs/latest/config.html#config-profiles) for more details.
8. Enter any **Pipeline parameters** in YAML or JSON format:

```
reads: 's3://nf-bucket/exome-data/ERR013140_{1,2}.fastq.bz2'
paired_end: true
```

:::note
In YAML, quotes should be used for paths but not for numbers or Boolean values.
:::

9. Once you have filled the necessary launch form details, select **Launch**. The **Runs** tab shows your new run in a **submitted** status on the top of the list. Select the run name to navigate to the run detail page and view the configuration, parameters, status of individual tasks, and run report.

:::note
For more information on relaunch and resume, see [Cache and resume](./cache-resume).
:::

## Add new pipeline

From the Launchpad, select **Add pipeline** to add a new pipeline with pre-saved parameters to your workspace. The fields on the new pipeline form are similar to the pipeline launch form.

:::tip
To create your own customized Nextflow schema for your pipeline, see [Pipeline schema](../pipeline-schema/overview) and the `nf-core` workflows that have adopted this. [nf-core/eager](https://github.com/nf-core/eager/blob/2.3.3/nextflow_schema.json) and [nf-core/rnaseq](https://github.com/nf-core/rnaseq/blob/3.0/nextflow_schema.json) are excellent examples.
:::

## Email notifications

You can receive email notifications upon completion or failure of a workflow execution.

Select **Your profile** from the user menu, then toggle **Send notification email on workflow completion** at the bottom of the page.

## Edit pipeline

Workspace mainainers can edit existing pipeline details. Select the options menu to the right of your the pipeline in the Launchpad list, then select **Edit** to load the pipeline parameters form with pre-filled existing pipeline details to be edited.

Select **Update** when you are ready to save the updated pipeline.

:::note
Workspace maintainers can edit pipeline names from the **Edit pipeline** page.
:::

---
title: "Launchpad"
description: "Curate and launch workflows"
date: "21 Apr 2023"
tags: [launchpad]
---

The **Launchpad** makes it easy for any workspace user to launch a pre-configured pipeline. Use the **Sort by:** drop-down to sort pipelines, either by name or most-recently updated.

The list layout is the default Launchpad view. Use the toggle next to the Add pipeline button to switch between the list and tile views. Both views display the compute environment of each pipeline for easy reference.

![](../_images/overview_image.jpg)

A pipeline is a repository containing a Nextflow workflow, a compute environment, and pipeline parameters.

### Pipeline parameters form

Launchpad detects the presence of a `nextflow_schema.json` in the root of the repository and dynamically creates a form where users can update the pipeline parameters. All pipelines contain at least these pipeline parameters:

- **Workflow run name**: A unique name to identify the run. Pre-filled with a random run name, this can be customized.
- **Labels**: Assign new or existing [labels](../labels/overview) to the workflow run.
- **Input/output options**: Specify paths to pipeline input datasets and output directories. Note that the input field drop-down menu only displays [datasets](../datasets/overview) of the file type specified in the `mimetype` field of your [pipeline schema](../pipeline-schema/overview) (either `text/csv` for CSV files, or `text/tsv` for TSV files).

The remaining fields of the pipeline parameters form will vary for each pipeline, dependent on the parameters specified in the pipeline schema.

This makes it trivial for users without Nextflow expertise to enter their pipeline parameters and launch.

![](./_images/launch_rnaseq_nextflow_schema.png)

### Add new pipeline

Select **Add pipeline** to add a new pipeline with pre-saved parameters to your workspace. The fields on the new pipeline form are similar to the [pipeline launch form](../launch/launch).

:::tip
To create your own customized Nextflow schema for your pipeline, see the `nf-core` workflows that have adopted this. [nf-core/eager](https://github.com/nf-core/eager/blob/2.3.3/nextflow_schema.json) and [nf-core/rnaseq](https://github.com/nf-core/rnaseq/blob/3.0/nextflow_schema.json) are excellent examples.
:::

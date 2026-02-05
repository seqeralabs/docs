---
title: "Launchpad"
headline: "Launchpad"
description: "Curate and launch workflows"
---

## Overview

**Launchpad** makes it easy for any workspace user to launch a pre-configured pipeline.

![](../_images/overview_image.png)

A pipeline is a repository containing a Nextflow workflow, a compute environment, and pipeline parameters.

### Pipeline Parameters Form

Launchpad automatically detects the presence of a `nextflow_schema.json` in the root of the repository and dynamically creates a form where users can easily update the parameters.

:::tip
The parameter forms view will appear if the workflow has a Nextflow schema file for the parameters. Please refer to the [**Nextflow Schema guide**](../pipeline-schema/overview) to learn more about the use cases and how to create them.
:::

This makes it trivial for users without any expertise in Nextflow to enter their pipeline parameters and launch.

![](./_images/launch_rnaseq_nextflow_schema.png)

### Adding a New Pipeline

Adding a pipeline to the workspace launchpad is similar to the [Launch](../launch/launch-form) except, instead of launching the pipeline, it gets added to the list of pipelines with the pre-saved values of fields, such as the pipeline parameters and the revision number.

:::tip
To create your own customized Nextflow Schema for your pipeline, see the `nf-core` workflows that have adopted this. [nf-core/eager](https://github.com/nf-core/eager/blob/2.3.3/nextflow_schema.json) and [nf-core/rnaseq](https://github.com/nf-core/rnaseq/blob/3.0/nextflow_schema.json) are excellent examples.
:::

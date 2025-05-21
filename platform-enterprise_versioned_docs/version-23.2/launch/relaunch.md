---
title: "Relaunch"
description: "Guide for resuming pipeline executions in Tower."
date: "21 Apr 2023"
tags: [launch, resume]
---

Relaunching pipelines is a great way to quickly troubleshoot or make use of Nextflow's resume functionality and relaunch the same pipeline with different parameters.

The **Resume** option is selected by default when relaunching a new pipeline from the **Runs** monitoring screen. In short, This option allows for the continuation of a workflow execution using Nextflow resume.

:::tip
For a detailed explanation of how the resume option works, please visit [Part 1](https://www.nextflow.io/blog/2019/demystifying-nextflow-resume.html) and [Part 2](https://www.nextflow.io/blog/2019/troubleshooting-nextflow-resume.html) of the _Demystifying Nextflow resume_ description in the [Nextflow blog](https://www.nextflow.io/blog.html).
:::

### Change compute environment when resuming a run

**Available from Tower 22.4.0**

Users with appropriate permissions can change the compute environment when resuming a run. The new compute environment must have access to the original run work directory. This means that the new compute environment must have a work directory that matches the root path of the original pipeline work directory, e.g. if the original pipeline work directory is `s3://foo/work/12345`, the new compute environment must have access to `s3://foo/work`.

---
title: "Pipeline optimization"
description: "An introduction to pipeline optimization in Seqera Platform"
date: "8 Jul 2024"
tags: [platform, runs, pipeline optimization]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Seqera Platform's task-level resource usage metrics allow you to determine the resources requested for a task and what was actually used. This information helps you fine-tune your configuration more accurately.

However, manually adjusting resources for every task in your pipeline is impractical. Instead, you can leverage the pipeline optimization feature available on the Launchpad.

Pipeline optimization analyzes resource usage data from previous runs to optimize the resource allocation for future runs. After a successful run, optimization becomes available, indicated by the lightbulb icon next to the pipeline turning black.

### Optimize nf-core/rnaseq

Navigate back to the Launchpad and select the lightbulb icon next to the *nf-core/rnaseq* pipeline to view the optimized profile. You have the flexibility to tailor the optimization's target settings and incorporate a retry strategy as needed.

### View optimized configuration

When you select the lightbulb, you can access an optimized configuration profile in the second tab of the **Customize optimization profile** window.

This profile consists of Nextflow configuration settings for each process and each resource directive (where applicable):  **cpus**, **memory**, and **time**. The optimized setting for a given process and resource directive is based on the maximum use of that resource across all tasks in that process.

Once optimization is selected, subsequent runs of that pipeline will inherit the optimized configuration profile, indicated by the black lightbulb icon with a checkmark. 

:::note 
Optimization profiles are generated from one run at a time, defaulting to the most recent run, and _not_ an aggregation of previous runs.
:::

![Optimized configuration](assets/optimize-configuration.gif)

Verify the optimized configuration of a given run by inspecting the resource usage plots for that run and these fields in the run's task table:

| Description  | Key                    |
| ------------ | ---------------------- |
| CPU usage    | `pcpu`                 |
| Memory usage | `peakRss`              |
| Runtime      | `start` and `complete` |

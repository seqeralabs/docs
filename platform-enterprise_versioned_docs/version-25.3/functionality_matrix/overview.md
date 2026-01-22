---
title: "Version compatibility"
description: "Platform / nf-launcher / Nextflow / Fusion version compatibility"
date created: "2025-12-05"
last updated: "2025-01-22"
tags: [compatibility, nextflow, nf-launcher]
---

The two most recent major Seqera Platform versions (25.3.x, 25.2.x, etc) are supported at any given time.

Each version makes use of `nf-launcher` to determine the Nextflow version used as its baseline. You can override this version during pipeline launch, but note that Seqera may not work reliably with Nextflow versions other than the baseline version. To use a Nextflow version other than the baseline in your pipeline run, use a [pre-run script](../launch/advanced#pre-and-post-run-scripts) during launch.

If no Nextflow version is specified in your configuration, Seqera defaults to the baseline version outlined below:

| Platform version | nf-launcher version | Nextflow version | Fusion version |Connect version|
| ---------------- | ------------------- | ---------------- | -------------- |-------------- |
| 25.3.1           | j21-25.10.2         | 25.10.2          | 2.4            |               |
| 25.3.0           | j21-25.04.8         | 25.04.8          | 2.4            |               |
| 25.2.4           | j21-25.04.3         | 25.04.3          | 2.4            |               |
| 25.2.3           | j21-25.04.3         | 25.04.3          | 2.4            |               | 
| 25.2.2           | j21-25.04.3         | 25.04.3          | 2.4            |               |
| 25.2.3           | j21-25.04.3         | 25.04.3          | 2.4            |               |
| 25.2.1           | j21-25.04.3         | 25.04.3          | 2.4            |               |
| 25.1.3           | j17-24.10.9-b1      | 24.10.9          | 2.4            |               |
| 25.2.0           | j21-25.04.3         | 25.04.3          | 2.4            |               |
| 25.1.5           | j17-24.10.9-b1      | 24.10.9          | 2.4            |               |
| 25.1.4           | j17-24.10.9-b1      | 24.10.9          | 2.4            |               |
| 25.1.3           | j17-24.10.9-b1      | 24.10.9          | 2.4            |               | 
| 25.2.3           | j21-25.04.3         | 25.04.3          | 2.4            |               |
| 25.2.1           | j21-25.04.3         | 25.04.3          | 2.4            |               |
| 25.1.3           | j17-24.10.9-b1      | 24.10.9          | 2.4            |               |
| 25.1.1           | j17-24.10.5         | 24.10.5          | 2.4            |               |
| 25.1.0           | j17-24.10.5         | 24.10.5          | 2.4            |               |
| 24.2.7           | j17-24.10.9-a1      | 24.10.9          | 2.4            |               |
| 24.2.4           | j17-24.10.4         | 24.10.4          | 2.4            |               |
| 24.2.1           | j17-24.10.2         | 24.10.2          | 2.4            |               |
| 25.1.0           | j17-24.10.5         | 24.10.5          | 2.4            |               | 
| 24.2.7           | j17-24.10.9-a1      | 24.10.9          | 2.4            |               | 
| 24.2.6           | j17-24.10.9-a1      | 24.10.9          | 2.4            |               |
| 24.2.5           | j17-24.10.4         | 24.10.4          | 2.4            |               |
| 24.2.4           | j17-24.10.4         | 24.10.4          | 2.4            |               | 
| 24.2.3           | j17-24.10.4         | 24.10.4          | 2.4            |               |
| 24.2.2           | j17-24.10.0         | 24.10.0          | 2.4            |               |
| 24.2.1           | j17-24.10.2         | 24.10.2          | 2.4            |               | 
| 24.2.0           | j17-24.10.0         | 24.10.0          | 2.4            |               |

nf-launcher versions prefixed with j21 refer to Java version 21; j17 refers to Java version 17.

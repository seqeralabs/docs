---
title: "Version compatibility"
description: "Platform / nf-launcher / Nextflow / Fusion version compatibility"
date: "20 Jun 2024"
tags: [compatibility, nextflow, nf-launcher]
---

The two most recent major Seqera Platform versions (24.1.x, 23.4.x, etc) are supported at any given time.

Each version makes use of `nf-launcher` to determine the Nextflow version used as its baseline. You can override this version during pipeline launch, but note that Seqera may not work reliably with Nextflow versions other than the baseline version. To use a Nextflow version other than the baseline in your pipeline run, use a [pre-run script](../launch/advanced#pre-and-post-run-scripts) during launch.

If no Nextflow version is specified in your configuration, Seqera defaults to the baseline version outlined below:

| Platform version | nf-launcher version | Nextflow version | Fusion version |
| ---------------- | ------------------- | ---------------- | -------------- |
| 24.1.5           | j17-24.04.4         | 24.04.4          | 2.3            |
| 24.1.4           | j17-24.04.4         | 24.04.4          | 2.3            |
| 24.1.3           | j17-24.04.4         | 24.04.4          | 2.3            |
| 24.1.1           | j17-23.10.1-up1     | 23.10.1          | 2.2            |
| 23.4.4           | j17-23.10.1         | 23.10.1          | 2.2            |
| 23.4.3           | j17-23.10.1         | 23.10.1          | 2.2            |
| 23.4.2           | j17-23.10.1         | 23.10.1          | 2.2            |
| 23.4.1           | j17-23.10.1         | 23.10.1          | 2.2            |
| 23.4.0           | j17-23.04.3         | 23.04.3          | 2.1            |
| 23.3.0           | j17-23.04.3         | 23.04.3          | 2.1            |
| 23.3.0           | j17-23.04.3         | 23.04.3          | 2.1            |
| 23.2.0           | j17.23.04.2-up3     | 23.04.2          | 2.1            |
| 23.1.3           | j17-23.04.1         | 23.04.1          | 2.1            |

nf-launcher versions prefixed with j17 refer to Java version 17; j11 refers to Java 11.

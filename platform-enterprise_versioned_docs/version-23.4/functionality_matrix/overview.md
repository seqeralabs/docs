---
title: "Version compatibility"
description: "Platform / nf-launcher / Nextflow / Fusion version compatibility"
date: "21 Apr 2023"
tags: [compatibility, nextflow, nf-launcher]
---

The two most recent major Seqera Platform versions (23.4.x, 23.3.x, etc.) are supported at any given time.

Each version makes use of `nf-launcher` to determine the Nextflow version used as its baseline. You can override this version during pipeline launch, but note that Seqera may not work reliably with Nextflow versions other than the baseline version. To use a Nextflow version other than the baseline in your pipeline run, use a [pre-run script](./launch/advanced#pre-and-post-run-scripts) during launch.

If no Nextflow version is specified in your configuration, Seqera defaults to the baseline version outlined below:

| Platform version | nf-launcher version | Nextflow version | Fusion version |
| ---------------- | ------------------- | ---------------- | -------------- |
| \*               |                     | 24.04.2          | 2.3            |
| 23.4.4           | j17-23.10.1         | 23.10.1          | 2.2            |
| 23.4.3           | j17-23.10.1         | 23.10.1          | 2.2            |
| 23.4.2           | j17-23.10.1         | 23.10.1          | 2.2            |
| 23.4.1           | j17-23.10.1         | 23.10.1          | 2.2            |
| 23.3.0           | j17-23.10.0         | 23.10.0          | 2.1            |
| 23.2.0           | j17.23.04.2-up3     | 23.04.2          | 2.1            |
| 23.1.3           | j17-23.04.1         | 23.04.1          | 2.1            |

:::note
Nextflow edge versions after 24.04.2 use Fusion 2.4 by default.
:::

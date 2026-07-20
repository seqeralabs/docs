---
title: "Default version compatibility"
description: "Version compatibility for Seqera Platform, nf-launcher, Nextflow, Fusion, and the Connect client"
date created: "2024-06-20"
last updated: "2026-07-06"
tags: [compatibility, nextflow, nf-launcher]
---

Seqera supports the two most recent major Seqera Platform versions (for example, 25.3.x and 26.1.x) at any given time.

Each Seqera Platform version uses `nf-launcher` to set its baseline Nextflow version. To use a different Nextflow version in your pipeline runs, add a [pre-run script](../launch/advanced#pre-and-post-run-scripts) during launch. Seqera Platform may not work reliably with Nextflow versions other than the baseline.

If you do not specify a Nextflow version in your configuration, Seqera Platform uses the baseline version listed in the following table:

| Platform version | nf-launcher version | Nextflow version | Fusion version | Connect client version |
| ---------------- | ------------------- | ---------------- | -------------- | ---------------------- |
| 26.1.3           | j21-26.04           | 26.04            | 2.4            | 0.12.0        |
| 26.1.2           | j21-26.04           | 26.04            | 2.4            | 0.12.0        |
| 26.1.0           | j21-26.04           | 26.04            | 2.4            | 0.12.0        |
| 25.3.6           | j21-25.10.2         | 25.10.2          | 2.4            | 0.11.0        |
| 25.3.4           | j21-25.10.2         | 25.10.2          | 2.4            | 0.9.0         |
| 25.3.1           | j21-25.10.2         | 25.10.2          | 2.4            | 0.9.0         |
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
| 25.1.0           | j17-24.10.5         | 24.10.5          | 2.4            |               |
| 24.2.7           | j17-24.10.9-a1      | 24.10.9          | 2.4            |               |
| 24.2.4           | j17-24.10.4         | 24.10.4          | 2.4            |               |
| 24.2.1           | j17-24.10.2         | 24.10.2          | 2.4            |               |
| 24.2.4           | j17-24.10.4         | 24.10.4          | 2.4            |               |
| 24.2.3           | j17-24.10.4         | 24.10.4          | 2.4            |               |
| 24.2.2           | j17-24.10.0         | 24.10.0          | 2.4            |               |
| 24.2.1           | j17-24.10.2         | 24.10.2          | 2.4            |               |
| 24.2.0           | j17-24.10.0         | 24.10.0          | 2.4            |               |

`nf-launcher` versions prefixed with `j21` use Java 21, and versions prefixed with `j17` use Java 17.

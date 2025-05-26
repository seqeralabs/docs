---
title: "Platform / Nextflow compatibility"
description: "Platform / nf-launcher / Nextflow version compatibility matrix"
date: "21 Apr 2023"
tags: [compatibility, nextflow, nf-launcher]
---

Each Seqera Platform version makes use of `nf-launcher` to determine the Nextflow version used as its baseline. This Nextflow version can be overridden with the `NXF_VER` environment variable in your `nextflow.conf` file, but note that Seqera may not work reliably with Nextflow versions other than the baseline version.

We officially support the two latest major releases (22.3.x, 22.4.x, etc) at any given time.

nf-launcher versions prefixed with j17 refer to Java version 17; j11 refers to Java 11.

| Platform version | nf-launcher version | Nextflow version |
| ------------- | ------------------- | ---------------- |
| 23.3.0        | j17-23.04.3         | 23.04.3          |
| 23.2.0        | j17.23.04.2-up3     | 23.04.2          |
| 23.1.3        | j17-23.04.1         | 23.04.1          |
| 22.4.1        | j17-22.10.6         | 22.10.6          |
| 22.4.0        | j17-22.10.6         | 22.10.6          |
| 22.3.1        | j17-22.10.4         | 22.10.4          |

---

If no Nextflow version is specified in your configuration, Seqera defaults to the baseline version outlined above.

<!-- revisit this page for latest release, add Agent interoperability for HPCs, etc. in future PR-->

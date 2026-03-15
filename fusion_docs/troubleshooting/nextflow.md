---
title: Nextflow interactions
description: "Troubleshoot Fusion behaviors specific to Nextflow task execution."
date created: "2026-03-12"
last updated: "2026-03-12"
tags: [troubleshooting, fusion, nextflow, symlinks, compaction]
---

Fusion integrates with the Nextflow task lifecycle to manage file staging and output handling. This page covers behaviors that arise from how Fusion interprets Nextflow's task definitions.

## Unexpected file copies in the work directory

You may notice that large input files are fully copied into the task work directory, even though Nextflow staged them as symlinks. This is caused by Fusion's symlink compaction feature.

### How symlink compaction works

When a Nextflow task completes, Fusion scans the task work directory for symbolic links. If a symlink's filename matches any of the task's declared output patterns, Fusion **materializes** the symlink — it replaces the symlink with a full copy of the target file. For files on object storage, this is a server-side copy operation.

Symlink compaction ensures that output files are self-contained. Without compaction, output symlinks would become dangling references if the original input files are later cleaned up by Nextflow's work directory cleanup or manual deletion.

:::caution
Compaction applies to all symlinks that match output patterns, regardless of whether the symlinked file is an input staged by Nextflow or a file the script produced. If a broad output glob accidentally matches an input symlink, Fusion copies the entire input file — which can be costly for large files.
:::

### How output patterns are derived

Nextflow generates a `.command.run` script for each task. This script includes an `outputs:` YAML block at the top that lists glob patterns derived from the process `output` block.

For example, consider a process that takes a BAM file as input and produces a filtered version. We emit both bam files into the output channel:

```groovy
process FILTER_READS {
    input:
    path(bam)

    output:
    path("${bam.baseName}*.bam")

    script:
    """
    filter_tool ${bam} --out ${bam.baseName}_filtered.bam
    """
}
```

When Nextflow runs this process with an input file called `sample.bam`, it generates a `.command.run` that includes the following output pattern:

```yaml
outputs:
  - "sample*.bam"
```

Fusion reads these patterns and uses them to decide which symlinks to compact at task shutdown.

### Diagnosing compaction in .command.run

To determine whether compaction is causing unexpected file copies in a task:

1.  Open the `.command.run` file in the task work directory.
2.  Check the `outputs:` YAML block at the top of the file. These are the glob patterns Fusion uses to select symlinks for compaction.
3.  Check the `nxf_stage()` function for `ln -s` commands. These show which input files Nextflow staged as symlinks. For example:

    ```bash
    ln -s /fusion/s3/bucket/work/.../sample.bam sample.bam
    ```

4.  Compare the two: if an input symlink's filename matches an output glob, Fusion materializes it at task shutdown.

In the example above, the output pattern `sample*.bam` matches both:

- `sample_filtered.bam` — the intended output, produced by the script
- `sample.bam` — the input, staged as a symlink by Nextflow

Because `sample.bam` matches the output glob `sample*.bam`, Fusion copies the full input file into the work directory at task shutdown.

:::tip
Check the `nxf_unstage_outputs()` function in `.command.run`. If it contains only `true` (a no-op), Nextflow itself is not copying outputs — Fusion handles output staging entirely through compaction.
:::

### Avoiding unintended compaction

To prevent Fusion from materializing input symlinks, narrow your output declarations so they only match files your script actually produces.

In the example above, the process declares `path("${bam.baseName}*.bam")` as its output. This expands to `sample*.bam`, which matches both the input and the output. To fix this, use a more specific pattern that only matches the filtered output:

```groovy
output:
path("${bam.baseName}_filtered*.bam")
```

This produces the output pattern `sample_filtered*.bam`, which no longer matches the input symlink `sample.bam`.

:::tip
As a general rule, avoid output globs that overlap with input filenames. If your script adds a suffix (such as `_filtered`, `_sorted`, or `_dedup`), include that suffix in the output declaration.
:::

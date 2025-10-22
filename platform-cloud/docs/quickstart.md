---
title: "Explore Seqera Cloud"
description: "Explore your free workspace resources and launch your first pipelines in Seqera Cloud."
date created: "2025-10-16"
toc_max_heading_level: 4
tags: [pipelines, versioning, nextflow, parameters]
---

When you create a new Seqera Cloud account with a verified work email, Seqera automatically provisions starter resources on your first login. These resources give you everything you need to start running bioinformatics pipelines immediately, including a Seqera compute environment and $100 in free credits to launch pipelines and Studios.

This guide shows you how to launch your first pipelines with the starter resources provided.

:::note
Generic email domains like Gmail are not eligible for the free resources detailed in this guide.
:::

## Your free resources

When you first log in after verifying your email, Seqera automatically creates an organization and workspace for you. You can **Explore Platform** and look around your workspace while starter resources are provisioned in the background, or wait for the setup to complete. Resource provisioning typically takes under a minute. Once setup is complete, you'll see a banner confirming that starter resources are ready for you to start launching pipelines.

Seqera provisions four types of resources to get you started: 
- A [Seqera Compute environment](./compute-envs/seqera-compute.md) with $100 in free credits
- [Credentials](./credentials/overview.md) used by your compute environment to create and manage cloud resources on your behalf
- A cloud storage bucket in [Data Explorer](./data/data-explorer.md)
- Pre-configured nf-core pipelines, ready to launch

### Seqera Compute environment

Your organization workspace includes a pre-configured [Seqera Compute](https://docs.seqera.io/platform-cloud/compute-envs/seqera-compute) environment that requires no cloud account setup or configuration. This environment includes $100 in free credits that can be used to run pipelines or Studios.

Credits are consumed based on the computational resources your pipeline runs and Studio session use, calculated from CPU-hours, GB-hours, and network and storage costs. You can monitor your credit balance in the **Usage overview** dropdown in the top navigation bar, or view detailed usage in your organization or workspace **Settings** tab.

See [Credit management](./administration/credit-management) for more information on monitoring usage and requesting additional credits.

### Data Explorer

Your workspace includes an automatically provisioned cloud storage bucket in [Data Explorer](https://docs.seqera.io/platform-cloud/data/data-explorer), linked to your Seqera Compute environment. This bucket provides storage for pipeline outputs, intermediate files, and any data you want to browse or manage through the Seqera interface. Your organization includes 25 GB of free cloud storage.

### Launchpad

Your workspace Launchpad includes six pre-configured [nf-core](https://nf-co.re) pipelines, all set up with a `test` profile so you can launch them immediately with test data.

#### nextflow-io/hello

Nextflow's [Hello World](https://github.com/nextflow-io/hello) — a simple example pipeline that demonstrates basic Nextflow functionality. This pipeline is ideal for verifying that your compute setup is working correctly and for understanding how pipeline execution works in Seqera.

**To launch this pipeline**:

1. From the **Launchpad** in the left navigation menu, select **Launch** next to the **nextflow-io/hello** pipeline.
1. While this pipeline requires no inputs to run, you can optionally explore the parameters in the launch form. For example, note the **Work directory** is pre-populated with your compute environment work directory path. 
1. Select **Launch**.

#### nf-core/demultiplex

The [nf-core/demultiplex](https://nf-co.re/demultiplex) pipeline separates pooled sequencing reads into individual samples based on barcode sequences. It supports Illumina sequencing data and can handle both single and dual indexing strategies.

**Use case**: Sequencing facilities often pool multiple samples into a single sequencing run to reduce costs. This pipeline is used to separate the pooled data back into individual sample files based on the unique barcode assigned to each sample during library preparation.

**To launch this pipeline**:

1. From the **Launchpad** in the left navigation menu, select **Launch** next to the **nf-core/demultiplex** pipeline.
1. From the **General config** tab, scroll down and copy your **Work directory** path. You can optionally enter a custom **Workflow run name** or create and add **Labels** to the run.
1. From the **Run parameters** tab, scroll to the **outdir** field and paste your work directory path. It is recommended to add `/demultiplex/outdir` to the end, to keep your cloud storage organized.
1. If the **input** field is not automatically populated, fetch and paste the example samplesheet URL from the [nf-core/demultiplex documentation](https://nf-co.re/demultiplex/latest/docs/usage#example-pipeline-samplesheet).
1. Select **Launch**.

#### nf-core/molkart

The [nf-core/molkart](https://nf-co.re/molkart) pipeline performs spatial analysis of highly multiplexed tissue imaging data. It processes images from technologies like CODEX, CycIF, or IMC to segment cells, quantify marker expression, and analyze spatial relationships between cells.

This pipeline is used in spatial biology and pathology research to understand how different cell types are organized in tissue and how they interact. For example, researchers studying tumor immunology use it to map where immune cells are located relative to cancer cells and analyze their spatial relationships.

**To launch this pipeline**:

1. From the **Launchpad** in the left navigation menu, select **Launch** next to the **nf-core/molkart** pipeline.
1. From the **General config** tab, scroll down and copy your **Work directory** path. You can also optionally enter a custom **Workflow run name** or create and add **Labels** to the run.
1. From the **Run parameters** tab, scroll to the **outdir** field and paste your work directory path. It is recommended to add `/molkart/outdir` to the end, to keep your cloud storage organized.
1. If the **input** field is not automatically populated, fetch and paste the example samplesheet URL from the [nf-core/molkart documentation](https://nf-co.re/molkart/latest/docs/usage#full-samplesheet).
1. Select **Launch**.

#### nf-core/rnaseq

RNA-seq is one of the most common applications in genomics research. Scientists use this pipeline to measure gene expression levels across different conditions, time points, or tissues. For example, researchers studying disease mechanisms might compare gene expression between healthy and diseased tissue to identify which genes are turned on or off.

The [nf-core/rnaseq](https://nf-co.re/rnaseq) pipeline performs RNA sequencing analysis, from raw reads to gene expression quantification. It includes quality control, read alignment, transcript quantification, and quality metrics reporting.

**To launch this pipeline**:

1. From the **Launchpad** in the left navigation menu, select **Launch** next to the **nf-core/rnaseq** pipeline.
1. From the **General config** tab, scroll down and copy your **Work directory** path. You can also optionally enter a custom **Workflow run name** or create and add **Labels** to the run.
1. From the **Run parameters** tab, scroll to the **outdir** field and paste your work directory path. It is recommended to add `/rnaseq/outdir` to the end, to keep your cloud storage organized.
1. If the **input** field is not automatically populated, fetch and paste the example samplesheet URL from the [nf-core/rnaseq documentation](https://nf-co.re/rnaseq/latest/docs/usage#full-samplesheet).
1. Select **Launch**.

#### nf-core/sarek

The [nf-core/sarek](https://nf-co.re/sarek) pipeline performs variant calling and annotation from whole genome or targeted sequencing data. It detects germline and somatic variants, including SNVs, indels, and structural variants, and provides comprehensive annotation.

This pipeline is widely used in cancer genomics and rare disease research. Clinical researchers use Sarek to identify disease-causing mutations in patient genomes, while cancer researchers use it to detect somatic mutations in tumor samples and compare them to normal tissue.

**To launch this pipeline**:

1. From the **Launchpad** in the left navigation menu, select **Launch** next to the **nf-core/sarek** pipeline.
1. From the **General config** tab, scroll down and copy your **Work directory** path. You can also optionally enter a custom **Workflow run name** or create and add **Labels** to the run.
1. From the **Run parameters** tab, scroll to the **outdir** field and paste your work directory path. It is recommended to add `/sarek/outdir` to the end, to keep your cloud storage organized.
1. If the **input** field is not automatically populated, fetch and paste the example samplesheet URL from the [nf-core/sarek documentation](https://nf-co.re/sarek/latest/docs/usage#overview-samplesheet-columns).
1. Select **Launch**.

#### nf-core/scrnaseq

The [nf-core/scrnaseq](https://nf-co.re/scrnaseq) pipeline processes single-cell RNA sequencing data. It performs read alignment, cell barcode and UMI quantification, quality control, and generates count matrices for downstream analysis.

Single-cell RNA-seq allows researchers to measure gene expression in individual cells rather than bulk tissue. This pipeline is used to study cellular heterogeneity, identify rare cell populations, and understand how individual cells respond differently to treatments or disease states. For example, immunologists use it to characterize the diverse cell types within the immune system.

**To launch this pipeline**:

1. From the **Launchpad** in the left navigation menu, select **Launch** next to the **nf-core/scrnaseq** pipeline.
1. From the **General config** tab, scroll down and copy your **Work directory** path. You can also optionally enter a custom **Workflow run name** or create and add **Labels** to the run.
1. From the **Run parameters** tab, scroll to the **outdir** field and paste your work directory path. It is recommended to add `/scrnaseq/outdir` to the end, to keep your cloud storage organized.
1. If the **input** field is not automatically populated, fetch and paste the example samplesheet URL from the [nf-core/scrnaseq documentation](https://nf-co.re/scrnaseq/latest/docs/usage#full-samplesheet).
1. Select **Launch**.

### Studios

Seqera Studios provides cloud-based, on-demand development environments for interactive bioinformatics work. Studios are fully integrated with Seqera Platform and offer VS Code or JupyterLab interfaces with access to your pipeline data and compute resources.

While your free workspace does not include an existing Studio, see [Studios for interactive analysis](https://docs.seqera.io/platform-cloud/studios/overview) to learn how to configure and run Studios on your Seqera Compute environment. The guide includes instructions for adding publicly available data to analyze in your Studios. 

## Next steps

After launching your first pipelines, you can:
- [Monitor run progress](./monitoring/run-details.mdx)
- [Explore output data](./data/data-explorer.md)

When you're ready to run pipelines and Studios with your own data, you can:
- [Add data](./getting-started/quickstart-demo/add-data.md)
- [Add new pipelines](./getting-started/quickstart-demo/add-pipelines.md)
- [Add participants](./getting-started/workspace-setup.md) to collaborate with your team
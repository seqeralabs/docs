---
title: "Datasets"
description: "Using datasets in Nextflow Tower."
date: "21 Apr 2023"
tags: [datasets]
---

:::note
This feature is only available in organization workspaces.
:::

Datasets in Nextflow Tower are CSV (comma-separated values) and TSV (tab-separated values) formatted files stored in a workspace. They are designed to be used as inputs to pipelines to simplify data management, minimize user data-input errors, and facilitate reproducible workflows.

The most commonly used datasets for Nextflow pipelines are samplesheets, where each row consists of a sample, the location of files for that sample (such as fastq files), and other sample details. For example, [nf-core/rnaseq](https://github.com/nf-core/rnaseq) works with input datasets (samplesheets) containing sample names, fastq file locations, and indications of strandedness. The Tower community showcase sample dataset for nf-core/rnaseq looks like this:

???+ example "rnaseq dataset"
|sample |fastq_1 |fastq_2 |strandedness|
|-------------------|------------------------------------|---------------------------------------------|------------|
|WT_REP1 |s3://nf-core-awsmegatests/rnaseq/...|s3://nf-core-awsmegatests/rnaseq/... |reverse |
|WT_REP1 |s3://nf-core-awsmegatests/rnaseq/...|s3://nf-core-awsmegatests/rnaseq/... |reverse |
|WT_REP2 |s3://nf-core-awsmegatests/rnaseq/...|s3://nf-core-awsmegatests/rnaseq/... |reverse |
|RAP1_UNINDUCED_REP1|s3://nf-core-awsmegatests/rnaseq/...| |reverse |
|RAP1_UNINDUCED_REP2|s3://nf-core-awsmegatests/rnaseq/...| |reverse |
|RAP1_UNINDUCED_REP2|s3://nf-core-awsmegatests/rnaseq/...| |reverse |
|RAP1_IAA_30M_REP1 |s3://nf-core-awsmegatests/rnaseq/...|s3://nf-core-awsmegatests/rnaseq/... |reverse |

The combination of datasets, [pipeline secrets](../secrets/overview), and [pipeline actions](../pipeline-actions/overview) in Tower allows you to automate workflows to curate your data and maintain and launch pipelines based on specific events. See [here](https://seqera.io/blog/workflow-automation/) for an example of pipeline workflow automation using Tower.

- Using datasets reduces errors that occur due to manual data entry when launching pipelines.

- Datasets can be generated automatically in response to events (such as S3 storage new file notifications).

- Datasets can streamline differential data analysis when using the same pipeline to launch a run for each dataset as it becomes available.

For your pipeline to use your dataset as input during runtime, information about the dataset and file format must be included in the relevant parameters of your [pipeline schema](../pipeline-schema/overview). The pipeline schema specifies the accepted dataset file type in the `mimetype` attribute (either `text/csv` or `text/tsv`).

### Dataset validation and file content requirements

Tower does not validate your dataset file contents. While datasets can contain static file links, you are responsible for maintaining the access to that data.

Datasets can point to files stored in various locations, such as Amazon S3 or GitHub. To stage the file paths defined in the dataset, Nextflow requires access to the infrastructure where the files reside, whether on Cloud or HPC systems. Add the access keys for data sources that require authentication to your [pipeline secrets](../secrets/overview).

### Dataset permissions

All Tower users have access to the datasets feature in organization workspaces.

### Creating a new dataset

To create a new dataset, follow these steps:

1. Open the **Datasets** tab in your organization workspace.
2. Select **New dataset**.
3. Complete the **Name** and **Description** fields using information relevant to your dataset.
4. Add the dataset file to your workspace with drag-and-drop or the system file explorer dialog.
5. For dataset files that use the first row for column names, customize the dataset view with the **First row as header** option.

:::note
The size of the dataset file cannot exceed 10MB.
:::

### Dataset versions

Tower can accommodate multiple versions of a dataset. To add a new version for an existing dataset, follow these steps:

1. Select **Edit** next to the dataset you wish to update.
2. Select **Add a new version**.
3. Upload the newer version of the dataset and select **Update**.

:::caution
All subsequent versions of a dataset must be the same format (.csv or .tsv) as the initial version.
:::

### Using a dataset

To use a dataset with the saved pipelines in your workspace, follow these steps:

1. Open any pipeline that contains a pipeline-schema from the Launchpad.
2. Select the input field for the pipeline, removing any default values.
3. Pick the dataset to use as input to your pipeline.

:::note
The input field drop-down menu will only display datasets that match the file type specified in the `nextflow_schema.json` of the chosen pipeline. If the schema specifies `"mimetype": "text/csv"`, no TSV datasets will be available for use with that pipeline, and vice versa.
:::

---
title: "Datasets"
description: "Using datasets in Seqera Platform."
date created: "2023-04-23"
last updated: "2026-03-27"
tags: [datasets]
---

Datasets are CSV (comma-separated values) and TSV (tab-separated values) files stored in, or linked to, a workspace. They are used as inputs to pipelines to simplify data management, minimize user data-input errors, and facilitate reproducible workflows.

On the datasets screen, you can:

- Upload directly or link to an externally hosted dataset 
- View the count of pipeline runs in the workspace that have used a specific dataset input.
- Apply multiple labels to datasets for easier searching and grouping.
- Sort datasets by name, most recently updated, and most recently used.
- Hide datasets that are not used in the workspace.
- View dataset metadata (created by, last updated, last used).
- Edit dataset details (name, description, and labels).
- Create new versions of a uploaded dataset.

## Benefits

- Datasets reduce errors that occur due to manual data entry when you launch pipelines.
- Datasets can be generated automatically in response to events (such as S3 storage new file notifications).
- Datasets can streamline differential data analysis when using the same pipeline to launch a run for each dataset as it becomes available.

## Format

The most commonly used datasets for Nextflow pipelines are samplesheets, where each row consists of a sample, the location of files for that sample (such as FASTQ files), and other sample details. For example, [*nf-core/rnaseq*](https://github.com/nf-core/rnaseq) works with input datasets (samplesheets) containing sample names, FASTQ file locations, and indications of strandedness. The Seqera Community Showcase sample dataset for *nf-core/rnaseq* looks like this:

**Example rnaseq dataset**

|sample |fastq_1 |fastq_2 |strandedness|
|-------------------|------------------------------------|---------------------------------------------|------------|
|WT_REP1            |s3://nf-core-awsmegatests/rnaseq/...|s3://nf-core-awsmegatests/rnaseq/...         |reverse     |
|WT_REP1            |s3://nf-core-awsmegatests/rnaseq/...|s3://nf-core-awsmegatests/rnaseq/...         |reverse     |
|WT_REP2            |s3://nf-core-awsmegatests/rnaseq/...|s3://nf-core-awsmegatests/rnaseq/...         |reverse     |
|RAP1_UNINDUCED_REP1|s3://nf-core-awsmegatests/rnaseq/...|                                             |reverse     |
|RAP1_UNINDUCED_REP2|s3://nf-core-awsmegatests/rnaseq/...|                                             |reverse     |
|RAP1_UNINDUCED_REP2|s3://nf-core-awsmegatests/rnaseq/...|                                             |reverse     |
|RAP1_IAA_30M_REP1  |s3://nf-core-awsmegatests/rnaseq/...|s3://nf-core-awsmegatests/rnaseq/...         |reverse     |

:::note
Use [Data Explorer](../data/data-explorer) to browse for cloud storage objects directly and copy the object paths to be used in your datasets.
:::

### Automation and pipeline schemas

The combination of datasets, [secrets](../secrets/overview), and [actions](../pipeline-actions/overview) allows you to automate workflows to curate your data and maintain and launch pipelines based on specific events. See [workflow-automation](https://seqera.io/blog/workflow-automation/) for an example of pipeline workflow automation.

For your pipeline to use your dataset as input during runtime, information about the dataset and file format must be included in the relevant parameters of your [pipeline schema](../pipeline-schema/overview). The pipeline schema specifies the accepted dataset file type in the `mimetype` attribute (either `text/csv` or `text/tsv`).

## Dataset file content requirements and validation

Datasets can point to files stored in various locations, such as Amazon S3, GitHub, or Hugging Face. To stage the file paths defined in the dataset, Nextflow requires access to the infrastructure where the files reside, whether on cloud or HPC systems. Add the access keys for data sources that require authentication to your [secrets](../secrets/overview).


:::note
Seqera doesn't validate your dataset file contents. While datasets can contain static file links, you're responsible for maintaining the access to that data.
:::

## Adding a dataset

All Seqera user roles have access to the datasets feature in organization workspaces. There are two ways to add a dataset:

1. Direct upload: the best option if immutability is a requirement but size cannot exceed 10 MB
1. Link to an externally hosted file: best option for very large size files but you rely on the external hosting service for availability and immutability 

### Direct upload

1. In the sidebar navigation, select the **Datasets** link under the Data heading in your organization workspace.
1. Select **Add Dataset** and choose **Upload file**.
1. Complete the **Name** and **Description** fields using information relevant to your dataset.
1. Optionally add one or more **Labels** to your dataset. You can use labels as a search filter but they don't apply to other resources in Seqera.
1. Upload a dataset to your workspace with drag-and-drop or use the **Upload file** file explorer dialog.
1. For datasets that use their first row for column names, customize the dataset view using the **Set first row as header** option.
1. Select **Add**.

:::warning
The size of the uploaded dataset file cannot exceed 10 MB.
:::

### Link to an externally hosted file

1. In the sidebar navigation, select the **Datasets** link under the Data heading in your organization workspace.
1. Select **Add Dataset** and choose **Link to URL**.
1. Complete the **Name** and **Description** fields using information relevant to your dataset.
1. Optionally add one or more **Labels** to your dataset. You can use labels as a search filter but they don't apply to other resources in Seqera.
1. Copy and paste the dataset URL into the **Dataset URL** field
1. For datasets that use their first row for column names, customize the dataset view using the **Set first row as header** option.
1. Select **Add**.
1. The dataset will be displayed with a `Linked` badge for easy identification.

## Manage dataset versions

For directly uploaded datasets, Seqera can manage multiple versions.

:::note
For linked datasets, versioning is unavailable.
:::

### Adding a dataset version

1. Select the three dots next to the dataset you want to add a new version for.
2. Select **Add version**.
3. Upload a dataset to your workspace with drag-and-drop or use the system "Upload file" file explorer dialog.
4. For datasets that use their first row for column names, customize the dataset view using the **Set first row as header** option.
5. Select **Add**.

:::caution
All subsequent versions of a dataset must be the same format (CSV or TSV) as the initial version.
:::

### Viewing dataset versions

To see all versions of a dataset, use the **Show** drop-down menu in the **Preview** tab. A preview of the most recent version of the dataset is automatically displayed and the version flagged as **(latest)**, provided it is not disabled.

To preview previous dataset versions, change the version from the **Show** drop-down menu. The **Created by** and **Created on** values will also change.

To download a dataset version, select the **Download** icon.

To copy a permalink to the dataset, select the **Copy** icon.

### Disabling a dataset version

One or more dataset versions can be **disabled** by selecting the **Disable version** option. Disabling a dataset version means that it cannot be selected as an input to a pipeline run. If the most recent version of a dataset is disabled, the most recent previous non-disabled version is flagged as **(latest)**.

:::note
For compliance reasons, datasets or dataset versions cannot be deleted, they can only be **hidden** or **disabled**, respectively.

Once disabled, a dataset version cannot be re-enabled.
:::

## Using a dataset

To use a dataset with pipelines added to your workspace:

1. Open any pipeline that contains a pipeline schema from the [Launchpad](../launch/launchpad).
2. Select the input field for the pipeline, removing any default values.
3. Pick the dataset to use as input to your pipeline.

:::note
The input field drop-down menu will only display datasets that match the file type specified in the `nextflow_schema.json` of the chosen pipeline. If the schema specifies `"mimetype": "text/csv"`, no TSV datasets will be available for use with that pipeline, and vice-versa. If multiple dataset versions exist, the pipeline input will always default to the **latest** version.
:::

## Managing datasets

**View runs**

To view a list of all pipeline runs in a workspace that have used a specific dataset input either:

- Select the three dots next to a dataset and select **View runs**.
- Click the number displayed in the **Runs** column.

**Toggle dataset visibility**

Select the three dots next to a dataset and select **Mark dataset as hidden** to hide a dataset no longer used in your workspace. To show a hidden dataset, select "Mark dataset as visible" to make it visible. This filter applies to all workspace users. 

You can toggle between **Visible**, **Hidden**, and **All** datasets in the **Show** drop-down on the main datasets page.

:::note
Hidden datasets do not count toward your per workspace quota.
:::

**Filter datasets**

Filter the list of datasets to only display datasets that match one or more filters defined in the **Search datasets** field. Select the info icon to see the list of available filters.

**Edit dataset details**

Select the three dots next to a dataset to edit the name, description, and labels associated with a dataset.

---
title: "Launch pipelines"
description: "Curate and launch workflows"
date: "21 Apr 2023"
tags: [launchpad]
---

View, configure, and launch pipelines from your workspace **Launchpad**.

## Launchpad

The **Launchpad** enables workspace users to launch pre-configured pipelines, add new pipelines, or perform a quick launch of unsaved pipelines. Use the **Sort by:** dropdown to sort pipelines, either by name or most-recently updated.

:::note
A pipeline is a repository containing a Nextflow workflow, a compute environment, and pipeline parameters.
:::

The list layout is the default **Launchpad** view. Use the toggle next to the **Search** field to switch between the list and tile views. Both views display the compute environment of each pipeline for easy reference.

## Launch form

The launch form is used to launch pipelines and to add pipelines to the **Launchpad**. Select **Launch** next to a saved pipeline in the list, or select **launch a run without configuration** to perform a quick launch of an unsaved pipeline.

The launch form consists of [General config](#general-config), [Run parameters](#run-parameters), and [Advanced options](#advanced-options) sections to specify your run parameters before execution, and an execution summary. Use section headings or select the **Previous** and **Next** buttons at the bottom of the page to navigate between sections. 

For saved pipelines, **General config** and **Run parameters** fields are prefilled and can be edited before launch. 

:::info
The launch form accepts URL query parameters. See [Populate launch form with URL query parameters](#populate-launch-form-with-url-query-parameters) for more information. 
:::

### General config 

- **Pipeline to launch**: A Git repository name or URL. For saved pipelines, this is prefilled and cannot be edited. Private repositories require [access credentials](../credentials/overview).
  :::note
  Nextflow pipelines are Git repositories that can reside on any public or private Git-hosting platform. See [Git integration](../git/overview) in the Seqera docs and [Pipeline sharing](https://www.nextflow.io/docs/latest/sharing.html) in the Nextflow docs for more details.
  :::
- **Revision number**: A valid repository commit ID, tag, or branch name. For saved pipelines, this is prefilled and cannot be edited.
- **Config profiles**: One or more [configuration profile](https://www.nextflow.io/docs/latest/config.html#config-profiles) names to use for the execution. Config profiles must be defined in the `nextflow.config` file in the pipeline repository.
- **Workflow run name**: A unique identifier for the run, pre-filled with a random name. This can be customized.
- **Labels**: Assign new or existing [labels](../labels/overview) to the run.
- **Compute environment**: The [compute environment](../compute-envs/overview) where the run will be launched.
- **Work directory**: The cloud storage or file system path where pipeline scratch data is stored. Seqera will create a scratch sub-folder if only a cloud bucket location is specified. Use file system paths for local or HPC compute environments.
  :::note
  The credentials associated with the compute environment must have access to the work directory.
  :::

#### Config profiles

The dropdown of available config profiles is populated by inspecting the Nextflow configuration in the pipeline repository. A limited form of static analysis is used to detect profiles in the main configuration and included configurations that match any of the following patterns:

- Includes with a static string:
  ```groovy
  includeConfig 'conf/profiles.config'
  includeConfig 'http://...'
  ```

- Includes with dynamic string that depends on parameters defined in the config:
  ```groovy
  includeConfig params.custom_config
  includeConfig "${params.custom_config_base}/nfcore_custom.config"
  ```

- Includes with a ternary expression:
  ```groovy
  includeConfig params.custom_config_base ? "${params.custom_config_base}/nfcore_custom.config" : "/dev/null"
  ```
  
  :::note
  Only the "true" branch is inspected.
  :::

- Includes within a try-catch statement:
  ```groovy
  try {
      includeConfig "${params.custom_config_base}/nfcore_custom.config"
  } catch (Exception e) {
      // ...
  }
  ```

### Run parameters 

There are four ways to enter **Run parameters** prior to launch:

- The **Input form view** displays form fields to enter text, select attributes from dropdowns, and browse input and output locations with [Data Explorer](../data/data-explorer).
- The **Config view** displays a raw schema that you can edit directly. Select JSON or YAML format from the **View as** dropdown.
- **Upload params file** allows you to upload a JSON or YAML file with run parameters.
- Specify run parameters with query parameters in the launch URL. See [Populate launch form with URL query parameters](#populate-launch-form-with-url-query-parameters) for more information. 

Seqera uses a `nextflow_schema.json` file in the root of the pipeline repository to dynamically create a form with the necessary pipeline parameters. Most pipelines contain at least input and output parameters:

- **input**
Specify compatible input [datasets](../data/datasets)  manually or from the dropdown menu. Select **Browse** to view the available datasets or browse for files in [Data Explorer](../data/data-explorer). The Data Explorer tab allows you to select input datasets that match your [pipeline schema](../pipeline-schema/overview) `mimetype` criteria (`text/csv` for CSV files, or `text/tsv` for TSV files).

- **outdir**
Specify the output directory where run results will be saved manually, or select **Browse** to choose a cloud storage directory using [Data Explorer](../data/data-explorer).

The remaining fields will vary for each pipeline, dependent on the parameters specified in the pipeline schema. 

### Advanced settings 

Enter [resource labels](../resource-labels/overview), [pipeline secrets](../secrets/overview), and [advanced options](../launch/advanced) before launch. 

#### Resource labels

Use resource labels to tag the computing resources created during the workflow execution. While resource labels for the run are inherited from the compute environment and pipeline, admins can override them from the launch form. Applied resource label names must be unique. 

#### Pipeline secrets 

Secrets are used to store keys and tokens used by workflow tasks to interact with external systems. Enter the names of any stored user or workspace secrets required for the workflow execution.

:::note 
In AWS Batch compute environments, Seqera passes stored secrets to jobs as part of the Seqera-created job definition. Seqera secrets cannot be used in Nextflow processes that use a [custom job definition](https://www.nextflow.io/docs/latest/aws.html#custom-job-definition). 
:::

#### Advanced options

See [Advanced options](../launch/advanced).

After you have filled the necessary launch details, select **Launch**. The **Runs** tab shows your new run in a **submitted** status at the top of the list. Select the run name to navigate to the [**View Workflow Run**](../monitoring/overview) page and view the configuration, parameters, status of individual tasks, and run report.

:::note
For more information on relaunch and resume, see [Nextflow cache and resume](./cache-resume.mdx).
:::

## Add new pipeline

From the **Launchpad**, select **Add pipeline** to add a new pipeline with pre-saved parameters to your workspace. The fields on the new pipeline form are similar to the pipeline launch form.

See [Add pipelines](../getting-started/quickstart-demo/add-pipelines) for instructions to add pipelines to your workspace via [Seqera Pipelines](https://seqera.io/pipelines) or the Launchpad.

:::note
Pipeline names must be unique per workspace.
:::
:::tip
To create your own customized Nextflow schema for your pipeline, see [Pipeline schema](../pipeline-schema/overview) and the `nf-core` workflows that have adopted this. [nf-core/eager](https://github.com/nf-core/eager/blob/master/nextflow_schema.json) and [nf-core/rnaseq](https://github.com/nf-core/rnaseq/blob/master/nextflow_schema.json) are good examples.
:::

## Email notifications

You can receive email notifications upon completion or failure of a workflow execution.

Select **Your profile** from the user menu, then toggle **Send notification email on workflow completion** at the bottom of the page.

## Edit pipeline

Workspace maintainers can edit existing pipeline details. Select the options menu next to the pipeline in the **Launchpad** list, then select **Edit** to load the pipeline parameters form with pre-filled existing pipeline details to be edited. See [Add from the Launchpad](../getting-started/quickstart-demo/add-pipelines#add-from-the-launchpad) for more information on the pipeline parameters form fields.

Select **Update** when you are ready to save the updated pipeline.

:::note
Pipeline names must be unique per workspace.
:::

## Populate launch form with URL query parameters

The launch form can populate fields with values passed as URL query parameters. For example, append `?revision=master` to your launch URL to prefill the **Revision** field with `master`. This feature is useful for Platform administrators to provide custom pipeline launch URLs to users in order to hard-code required run and pipeline parameters for every run.

Platform validates run parameters passed via the launch URL in the following way:
- Parameter names are **not** validated. You must provide valid and supported parameters for launch form fields to be populated without error. See supported parameter names in the following section.
- Parameter values are validated and warnings are shown for any invalid supplied values.
- Disabled launch form fields, such as the `pipeline` field when launching a presaved pipeline, cannot be populated by URL.

Parameters that accept arrays (multiple values) as input must be specified with the parameter name for each individual value. For example:

```
?labelIds=<label_1_id>&labelIds=<label_2_id>
```

Pipeline-specific run parameters can be passed with the `paramsText` query parameter. Pass both the name and value for any parameter defined in your [pipeline schema](../pipeline-schema/overview.md) in JSON format:

```
?paramsText={"key1": "value1", "key2": "value2"}
```

:::note
When submitted, JSON-formatted paramsText input will be formatted with percent-encoding for spaces, brackets and other non-standard URL characters. For example:

```
?paramsText={"key1": "value1", "key2": "value2"}
```

will be formatted and added to relevant launch form fields with this syntax:

```
%7B"key1":%20"value1",%20"key2":%20"value2"%7D
```

Platform will ignore added percent-encoding characters in form fields, so you do not need to remove them manually before submitting your pipeline launch. 
:::

### Supported URL query parameters and corresponding launch form fields

| **Launch form field**                          | **Query parameter name**    |
|------------------------------------------------|-----------------------------|
| **General config**                             |                             |
| Pipeline to launch                             | `pipeline`                  |
| Revision number                                | `revision`                  |
| Config profiles                                | `configProfiles`            |
| Workflow run name                              | `runName`                   |
| Labels                                         | `labelIds`                  |
| Compute environment                            | `computeEnvId`              |
| Work directory                                 | `workDir`                   |
| **Run parameters**                             |                             |
| Pipeline-specific run parameters               | `paramsText`                |
| **Advanced settings**                          |                             |
| Resource labels                                | `resourceLabelIds`          |
| Nextflow config file                           | `configText`                |
| Seqera Cloud config file                       | `towerConfig`               |
| Pull latest                                    | `pullLatest`                |
| Stub run                                       | `stubRun`                   |
| Main script                                    | `mainScript`                |
| Workflow entry name                            | `entryName`                 |
| Schema name                                    | `schemaName`                |
| Head job CPUs                                  | `headJobCpus`               |
| Head job memory                                | `headJobMemoryMb`           |
| Workspace's pipeline secrets                   | `workspaceSecrets`          |
| User's pipeline secrets                        | `userSecrets`               |
| Pre-run script                                 | `preRunScript`              |
| Post-run script                                | `postRunScript`             |

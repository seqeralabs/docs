---
title: "Launch pipelines"
description: "Curate and launch workflows in Seqera Platform"
date created: "2023-04-21"
last updated: "2026-05-18"
tags: [launchpad, launch, configure, pipeline, schema, configuration, nextflow, parameters, input, output]
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

- **Pipeline to launch**: A Git repository name or URL. For saved pipelines, this is prefilled and cannot be edited. Private repositories require [access credentials][credentials].
  :::note
  Nextflow pipelines are Git repositories that can reside on any public or private Git-hosting platform. See [Git integration][git] in the Seqera docs and [Pipeline sharing][pipeline-sharing] in the Nextflow docs for more details.
  :::
- **Version name**: The pipeline version name that will be selected as default for this pipeline run. See [Pipeline versioning][pipeline-version] for details.
- **Version ID**: The pipeline version id that will be selected as default for this pipeline run. See [Pipeline versioning][pipeline-versioning] for details.
- **Revision**: A valid repository commit ID, tag, or branch name. Determines the version of the pipeline to launch.
- **Commit ID**: Pin pipeline revision to the most recent HEAD commit ID. If no commit ID is pinned, the latest revision of the repository branch or tag is used.
- **Pull latest**: Fetch the most recent HEAD commit ID of the pipeline revision at launch time. Unpins the **Commit ID**, if set.
  :::info
  See [Git revision management][pipeline-revision] for more information on **Revision**, **Commit ID**, and **Pull latest**, behavior.
  :::
- **Work directory**: The cloud storage or file system path where pipeline scratch data is stored. Seqera will create a scratch sub-folder if only a cloud bucket location is specified. Use file system paths for local or HPC compute environments.
  :::note
  The credentials associated with the compute environment must have access to the work directory.
  :::
- **Main script**: The script file to execute (default: `main.nf`). Config profiles suggestions may update when this field changes.
- **Config profiles**: One or more [configuration profile][nextflow-config-profile] names to use for the execution. Config profiles must be defined in the `nextflow.config` file in the pipeline repository. See below for additional details.
- **Workflow run name**: A unique identifier for the run, pre-filled with a random name. This can be customized.
- **Labels**: Assign new or existing [labels][labels] to the run.
- **Compute environment**: The [compute environment][compute-envs] where the run will be launched.
- **Work directory**: The bucket path where the pipeline scratch data is stored.
- **Schema**: Select the [pipeline schema][pipeline-schema] to validate pipeline parameters and prevent runtime failures.
- **Enable lineage**: Track the [provenance][data-lineage] of files produced by pipeline runs. Defaults to the [workspace setting][workspace-settings-lineage].

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

- The **Input form view** displays form fields to enter text, select attributes from dropdowns, and browse input and output locations with [Data Explorer][data-explorer].
- The **Params file view** displays a raw schema that you can edit directly. Select JSON or YAML format from the **View as** dropdown.
- **Upload params file** allows you to upload a JSON or YAML file with run parameters.
- Specify run parameters with query parameters in the launch URL. See [Populate launch form with URL query parameters](#populate-launch-form-with-url-query-parameters) for more information.

Seqera uses a `nextflow_schema.json` file in the root of the pipeline repository to dynamically create a form with the necessary pipeline parameters. Most pipelines contain at least input and output parameters:

- **input**
Specify compatible input [datasets][datasets]  manually or from the dropdown menu. Select **Browse** to view the available datasets or browse for files in [Data Explorer][data-explorer]. The Data Explorer tab allows you to select input datasets that match your [pipeline schema][pipeline-schema] `mimetype` criteria (`text/csv` for CSV files, or `text/tsv` for TSV files).

- **outdir**
Specify the output directory where run results will be saved manually, or select **Browse** to choose a cloud storage directory using [Data Explorer][data-explorer].

The remaining fields will vary for each pipeline, dependent on the parameters specified in the pipeline schema.

### Advanced settings

Enter [resource labels][resource-labels], [pipeline secrets][pipeline-secrets], and [advanced options][advanced-options] before launch.

#### Resource labels

Use resource labels to tag the computing resources created during the workflow execution. While resource labels for the run are inherited from the compute environment and pipeline, admins can override them from the launch form. Applied resource label names must be unique.

#### Pipeline secrets

Secrets are used to store keys and tokens used by workflow tasks to interact with external systems. Enter the names of any stored user or workspace secrets required for the workflow execution.

:::note
In AWS Batch compute environments, Seqera passes stored secrets to jobs as part of the Seqera-created job definition. Seqera secrets cannot be used in Nextflow processes that use a [custom job definition][custom-job-definition].
:::

#### Advanced options

See [Advanced options](../launch/advanced).

After you have filled the necessary launch details, select **Launch**. The **Runs** tab shows your new run in a **submitted** status at the top of the list. Select the run name to navigate to the [**View Workflow Run**][monitoring-overview] page and view the configuration, parameters, status of individual tasks, and run report.

:::note
For more information on relaunch and resume, see [Nextflow cache and resume][cache-resume].
:::

## Add new pipeline

From the **Launchpad**, select **Add pipeline** to add a new pipeline with pre-saved parameters to your workspace. The fields on the new pipeline form are similar to the pipeline launch form.

See [Add pipelines][add-pipelines] for instructions to add pipelines to your workspace via [Seqera Pipelines][seqera-pipelines] or the Launchpad.

:::note
Pipeline names must be unique per workspace.
:::
:::tip
To create your own customized Nextflow schema for your pipeline, see [Pipeline schema][pipeline-schema] and the `nf-core` workflows that have adopted this. [nf-core/eager](https://github.com/nf-core/eager/blob/master/nextflow_schema.json) and [nf-core/rnaseq](https://github.com/nf-core/rnaseq/blob/master/nextflow_schema.json) are good examples.
:::

## Email notifications

You can receive email notifications upon completion or failure of a workflow execution.

Select **Your profile** from the user menu, then toggle **Send notification email on workflow completion** at the bottom of the page.

## Edit pipeline

Workspace maintainers can edit existing pipeline details. Select the options menu next to the pipeline in the **Launchpad** list, then select **Edit** to load the pipeline parameters form with pre-filled existing pipeline details to be edited. See [Add from the Launchpad][add-from-launchpad] for more information on the pipeline parameters form fields.

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

Pipeline-specific run parameters can be passed with the `paramsText` query parameter. Pass both the name and value for any parameter defined in your [pipeline schema][pipeline-schema] in JSON format:

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

{/* links */}
[credentials]: ../credentials/overview
[pipeline-sharing]: https://docs.seqera.io/nextflow/sharing
[git]: ../git/overview
[pipeline-versioning]: ../pipelines/versioning
[pipeline-revision]: ../pipelines/revision
[nextflow-config-profile]: https://docs.seqera.io/nextflow/config#config-profiles
[labels]: ../labels/overview
[compute-envs]: ../compute-envs/overview
[pipeline-schema]: ../pipeline-schema/overview
[data-lineage]: ../data/data-lineage
[workspace-settings-lineage]: ../orgs-and-teams/workspace-management#lineage
[data-explorer]: ../data/data-explorer
[datasets]: ../data/datasets
[resource-labels]: ../resource-labels/overview
[pipeline-secrets]: ../secrets/overview
[advanced-options]: ../launch/advanced
[custom-job-definition]: https://docs.seqera.io/nextflow/aws#custom-job-definition
[monitoring-overview]: ../monitoring/overview
[cache-resume]: ./cache-resume.mdx
[add-pipelines]: ../getting-started/quickstart-demo/add-pipelines
[seqera-pipelines]: https://seqera.io/pipelines
[add-from-launchpad]: ../getting-started/quickstart-demo/add-pipelines#add-from-the-launchpad

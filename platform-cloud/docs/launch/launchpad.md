---
title: "Launch pipelines"
description: "Curate and launch pipelines in Seqera Platform"
date created: "2023-04-21"
last updated: "2026-05-18"
tags: [launchpad, launch, configure, pipelines, schema, configuration, nextflow, parameters, input, output]
---

Use the Seqera Platform **Launchpad** to launch pre-configured pipelines, add new pipelines, or quick-launch unsaved pipelines.

## Sort and filter pipelines

Select the **Sort by:** dropdown to sort pipelines by name or by most-recently updated. Select the filter icon to filter by workspace and labels.

The list layout is the default **Launchpad** view. Select the tiles icon to switch between the list and tile layout. Both views display the compute environment of each pipeline.

:::note
A pipeline is a repository containing a Nextflow workflow, a compute environment, and pipeline parameters.
:::

## Launch pipelines

Use the launch form to launch pipelines and add pipelines to the **Launchpad**. Select **Launch** next to a saved pipeline in the list, or select **Quick launch** to quick-launch an unsaved pipeline.

The launch form consists of [General config](#general-config), [Run parameters](#run-parameters), [Advanced settings](#advanced-settings), and [Summary](#summary) tabs to configure and view your run before execution. Use section headings or select **Previous** or **Next** at the bottom of the page to navigate between sections.

For saved pipelines, **General config** and **Run parameters** fields are prefilled and can be edited before launch.

:::info
The launch form accepts URL query parameters. See [URL query parameters](#url-query-parameters) for more information.
:::

### General config

Configure the core settings for your run, including the pipeline source, compute environment, and work directory:

#### Run setup

- **Pipeline to launch**: A Git repository name or URL. For saved pipelines, this is prefilled and cannot be edited. Private repositories require [access credentials][credentials].
  :::note
  Nextflow pipelines are Git repositories that can reside on any public or private Git-hosting platform. See [Git integration][git] in the Seqera docs and [Pipeline sharing][pipeline-sharing] in the Nextflow docs for more details.
  :::
- **Version name**: The pipeline version name selected as the default for this run. See [Pipeline versioning][pipeline-version] for details.
- **Version ID**: The pipeline version ID selected as the default for this run. See [Pipeline versioning][pipeline-versioning] for details.
- **Revision**: A valid repository commit ID, tag, or branch name. Determines the version of the pipeline to launch.
- **Commit ID**: The pipeline revision commit ID. If no commit ID is pinned, the latest revision of the repository branch or tag is used.
- **Pull latest**: Pull the most recent HEAD commit ID of the pipeline revision at launch time. Unpins the **Commit ID**, if set.
  :::info
  See [Git revision management][pipeline-revision] for more information on **Revision**, **Commit ID**, and **Pull latest**, behavior.
  :::
- **Main script**: The script file to execute (default: `main.nf`). Config profile suggestions may update when this field changes. See [Main script](./advanced#main-script) for custom script paths.
- **Config profiles**: One or more [configuration profile][nextflow-config-profile] names to use for the execution. Config profiles must be defined in the `nextflow.config` file in the pipeline repository.

    <details>
    <summary>How config profiles are detected</summary>

    Seqera Platform populates the **Config profiles** dropdown by statically analyzing the pipeline's Nextflow configuration. The analysis detects profiles in the main configuration and in `includeConfig` statements that match any of these patterns:

    - A static string:
      ```groovy
      includeConfig 'conf/profiles.config'
      includeConfig 'http://...'
      ```

    - A dynamic string that depends on parameters defined in the config:
      ```groovy
      includeConfig params.custom_config
      includeConfig "${params.custom_config_base}/nfcore_custom.config"
      ```

    - A ternary expression (only the `true` branch is inspected):
      ```groovy
      includeConfig params.custom_config_base ? "${params.custom_config_base}/nfcore_custom.config" : "/dev/null"
      ```

    - An include within a try-catch statement:
      ```groovy
      try {
          includeConfig "${params.custom_config_base}/nfcore_custom.config"
      } catch (Exception e) {
          // ...
      }
      ```

    </details>

- **Workflow run name**: A unique identifier for the run, pre-filled with a random name that you can customize.
- **Labels**: Assign new or existing [labels][labels] to the run.
- **Compute environment**: The [compute environment][compute-envs] where the run launches.
- **Work directory**: The cloud storage or file system path where pipeline scratch data is stored. Seqera Platform creates a scratch sub-folder if you specify only a cloud bucket location. Use file system paths for local or high-performance computing (HPC) compute environments.
  :::note
  The credentials associated with the compute environment must have access to the work directory.
  :::
- **Schema**: The [pipeline schema][pipeline-schema] to validate pipeline parameters and prevent runtime failures. Options include **Repository default**, **Repository path**, and **Seqera Platform schema**.

### Run parameters

Enter **Run parameters** in one of four ways before launch:

- The **Input form view** displays form fields to enter text, select attributes from dropdowns, and browse input and output locations with [Data Explorer][data-explorer].
- The **Params file view** displays a raw schema that you can edit directly. Select JSON or YAML format from the **View as** dropdown.
- Use **Upload params file** to upload a JSON or YAML file with run parameters.
- Specify run parameters with query parameters in the launch URL. See [URL query parameters](#url-query-parameters) for more information.

If the pipeline includes a `nextflow_schema.json` file in its repository root, Seqera Platform uses it to dynamically generate a form with that pipeline's parameters. The fields shown vary by pipeline, depending on the parameters defined in the schema.

Common parameters include:

- **Input data**: If the pipeline defines an input parameter, specify compatible [datasets][datasets] manually or from the dropdown menu. Select **Browse** to view the available datasets or browse for files in [Data Explorer][data-explorer]. Use the Data Explorer tab to select input datasets that match your [pipeline schema][pipeline-schema] `mimetype` criteria (`text/csv` for CSV files, or `text/tsv` for TSV files).
- **Output directory**: If the pipeline defines an output directory parameter, specify it manually or select **Browse** to choose a cloud storage directory using [Data Explorer][data-explorer].

### Advanced settings

Configure platform resources, pipeline secrets, and advanced Nextflow options before launch.

#### Platform config

- **Resource labels**: [Resource labels][resource-labels] to tag the computing resources created during a run. The run inherits resource labels from the compute environment and pipeline, but admins can override them from the launch form. Applied resource label names must be unique.

#### Pipeline secrets

- **Workspace's pipeline secrets**: [Secrets][pipeline-secrets] defined in the current workspace, available to all members.
- **User's pipeline secrets**: [Secrets][pipeline-secrets] defined in your personal account.

:::note
In AWS Batch compute environments, Seqera Platform passes stored secrets to jobs as part of the job definition it creates. You cannot use Seqera secrets in Nextflow processes that use a [custom job definition][custom-job-definition].
:::

#### Advanced options

- **Nextflow config file**: Additional Nextflow configuration settings.
- **Seqera Cloud config file**: Additional Seqera Cloud configuration settings to override the `tower.yml` file.
- **Pre-run scripts**: Custom shell commands to run before the execution.
- **Post-run scripts**: Custom shell commands to run after the execution.
- **Stub run**: Replace process commands with [stubs](https://docs.seqera.io/nextflow/process#stub), where defined, before execution.
- **Enable Nextflow syntax parser v2**: Run the pipeline with the v2 Nextflow language parser.
- **Workflow entry name**: A named DSL2 workflow other than the default.
- **Schema name**: The name of a pipeline schema file in the workflow repository root folder to override the default `nextflow_schema.json`.
- **Head job CPUs**: The number of CPUs for the Nextflow head job. Fields are only displayed for runs executing on [AWS Batch](../compute-envs/aws-batch) and [Azure Batch](../compute-envs/azure-batch) compute environments.
- **Head job memory**: The memory for the Nextflow head job, in MiB. Fields are only displayed for runs executing on [AWS Batch](../compute-envs/aws-batch) and [Azure Batch](../compute-envs/azure-batch) compute environments.

See [Advanced options][advanced-options] for detailed guidance.

### Summary

Review your [General config](#general-config) and [Run parameters](#run-parameters) settings, then select **Launch**.

The **Runs** tab shows your new run in a **submitted** status at the top of the list. Select the run name to open the [View Workflow Run][monitoring-overview] page and view the configuration, parameters, status of individual tasks, and run report.

:::tip
You can receive email notifications when a run completes or fails. Select **Manage your account** from the user menu, then toggle **Send notification email on workflow completion** at the bottom of the page.
:::

## Add new pipelines

From the **Launchpad**, select **Add pipeline** to add a new pipeline with pre-saved parameters to your workspace. The fields on the new pipeline form are similar to the pipeline launch form.

See [Add pipelines][add-pipelines] for instructions to add pipelines to your workspace via [Seqera Pipelines][seqera-pipelines] or the Launchpad.

:::note
Pipeline names must be unique per workspace.
:::

## Edit pipelines

Workspace maintainers can edit existing pipeline details. Select the options menu next to the pipeline in the **Launchpad** list, then select **Edit** to open the pipeline parameters form, pre-filled with the pipeline's existing details. See [Add from the Launchpad][add-from-launchpad] for more information on the pipeline parameters form fields.

Select **Update** to save the updated pipeline.

## URL query parameters

The launch form can populate fields with values passed as URL query parameters. For example, append `?revision=master` to your launch URL to prefill the **Revision** field with `master`. Platform administrators can use custom launch URLs to hard-code required run and pipeline parameters for every run.

Seqera Platform validates run parameters passed in the launch URL as follows:
- Parameter names are **not** validated. You must provide valid and supported parameters to populate launch form fields without error. See supported parameter names in the following section.
- Seqera Platform validates parameter values and shows warnings for any invalid values.
- Disabled launch form fields, such as the `pipeline` field when launching a pre-saved pipeline, cannot be populated by URL.

For parameters that accept arrays (multiple values), specify the parameter name for each value. For example:

```
?labelIds=<label_1_id>&labelIds=<label_2_id>
```

Pass pipeline-specific run parameters with the `paramsText` query parameter. Include the name and value for any parameter defined in your [pipeline schema][pipeline-schema], in JSON format:

```
?paramsText={"key1": "value1", "key2": "value2"}
```

:::note
When you submit JSON-formatted `paramsText` input, Seqera Platform percent-encodes spaces, brackets, and other non-standard URL characters. For example:

```
?paramsText={"key1": "value1", "key2": "value2"}
```

is formatted and added to the relevant launch form fields with this syntax:

```
%7B"key1":%20"value1",%20"key2":%20"value2"%7D
```

Seqera Platform ignores the added percent-encoding characters in form fields. You do not need to remove them manually before submitting your pipeline launch.
:::

The following table lists the supported URL query parameters and their corresponding launch form fields:

| **Launch form field**                          | **Query parameter name**    |
|------------------------------------------------|-----------------------------|
| **Run setup**                                  |                             |
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

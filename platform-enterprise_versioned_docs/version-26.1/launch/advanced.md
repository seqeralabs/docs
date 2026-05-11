---
title: "Advanced options"
description: "Advanced guide to launching Nextflow pipelines in Seqera Platform."
date created: "2023-04-21"
last updated: "2026-04-02"
tags: [advanced, launch]
---

You can modify the configuration and execution of a pipeline with advanced launch options.

## Nextflow config file

Add additional or modified Nextflow configuration settings. Use the same syntax as the [Nextflow configuration file](https://docs.seqera.io/nextflow/config#config-syntax).

### Nextflow configuration order of priority

When launching pipelines in Platform, Nextflow configuration is resolved from four sources. If the same parameter is defined in more than one source, the highest-priority source is used:

| Priority | Nextflow configuration                                   | Source                                                                                             |
|----------|----------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Highest  | The pipeline launch form **Nextflow config file** field  | User-defined at launch                                                                             |
|          | Platform-managed compute settings                        | Derived from CE definition (see [Platform-managed configuration](#platform-managed-configuration)) |
|          | The compute environment **Global Nextflow config** field | User-defined during CE creation                                                                    |
| Lowest   | The pipeline repository `nextflow.config` file           | Pipeline Git repository                                                                            |

:::note
**Global Nextflow config** values are pre-filled in the launch form's **Nextflow config file** field, but also apply independently at the priority level shown above. Clearing the launch form field does not remove the **Global Nextflow config** values.
:::

For example, if:

1. The pipeline repository `nextflow.config` file contains this manifest:

    ```ini title="Pipeline repository nextflow.config"
    manifest {
        name = 'A'
        description = 'Pipeline description A'
    }
    ```

2. Your compute environment **Global Nextflow config** field contains this manifest:

    ```ini title="Compute environment Global Nextflow config field"
    manifest {
        name = 'B'
        description = 'Pipeline description B'
    }
    ```

3. You specify this manifest in the **Nextflow config file** field on the pipeline launch form:

    ```ini title="Pipeline launch form Nextflow config file field"
    manifest {
        name = 'C'
        description = 'Pipeline description C'
    }
    ```

The resolved configuration will contain the **Nextflow config file** field's manifest:

```ini title="Resolved configuration"
manifest {
    name = 'C'
    description = 'Pipeline description C'
}
```

### Platform-managed configuration

Platform generates a configuration file from the compute environment definition. For any property defined in both this file and the pipeline repository `nextflow.config`, the Platform-generated value takes precedence. There is no warning repository config values are replaced.

### Pre-launch configuration preview

The configuration preview shown on the launch form reflects the **Nextflow config file** field and the compute environment's **Global Nextflow config** field only. Platform-managed compute settings and the pipeline repository `nextflow.config` are not visible in the preview. Both are resolved at launch time.

:::tip{title="Best practices"}
To ensure compute-specific settings are applied consistently:

- Define compute-specific settings in the compute environment's **Global Nextflow config** field or the launch form's **Nextflow config file** field to make settings visible in the pre-launch preview and ensure they apply regardless of what the repository config contains.
- Use the launch form's **Nextflow config file** field for settings that must take precedence over everything else.
:::

## Seqera Cloud config file

Configure per-pipeline Seqera reporting behavior. Settings specified here override the same settings in the `tower.yml` [configuration file](../enterprise/configuration/overview) for this execution. Use the `reports` key to specify report paths, titles, and MIME types:

```yml
reports:
  reports/multiqc/index.html:
    display: "MultiQC Reports"
    mimeType: "text/html"
```

## Pre and post-run scripts

Run custom code either before or after the execution of the Nextflow script. These fields allow you to enter shell commands.

Pre-run scripts are executed in the nf-launch script prior to invoking Nextflow processes. Pre-run scripts are useful for:
- Specifying an alternate Nextflow version to use for the run:

    ```bash
    nextflow self-update
    export NXF_VER=24.10.0
    ```
    :::info
    `nextflow self-update` is only required when updating a pre-24.10.0 version of Nextflow to version 24.10.0 or later.
    :::
- Executor setup, such as loading a private CA certificate.
- Troubleshooting. For example, add `sleep 3600` to your pre-run script to instruct Nextflow to wait 3600 seconds (60 minutes) before process execution after the nf-launcher container is started, to create a window in which to test connectivity and other issues before your Nextflow processes execute.

Post-run scripts are executed after all Nextflow processes have completed. The scripts have access to the following environment variables:

| Environment variable | Description                                  |
|----------------------|----------------------------------------------|
| `TOWER_WORKFLOW_ID`  | The unique workflow run identifier           |
| `TOWER_WORKSPACE_ID` | The workspace identifier                     |
| `NXF_UUID`           | The Nextflow session ID                      |
| `NXF_OUT_FILE`       | Path to the Nextflow console output file     |
| `NXF_LOG_FILE`       | Path to the Nextflow log file                |
| `NXF_TML_FILE`       | Path to the timeline report HTML file        |
| `NXF_EXIT_STATUS`    | The exit code of the workflow execution      |
| `TOWER_ACCESS_TOKEN` | Platform API access token for authentication |
| `TOWER_REFRESH_TOKEN`| Platform API refresh token                   |
| `NXF_WORK`           | The work directory path used by the workflow |
| `TOWER_CONFIG_FILE`  | Path to the Tower configuration file         |

Post-run scripts are also useful for triggering a third party service via API request.

:::note
Post-run script failures do not affect the workflow exit status. Post-run scripts have a maximum size limit of 1 KB.
:::

## Pull latest

Instruct Nextflow to pull the latest pipeline version from the pipeline repository. This is equivalent to using the `-latest` flag.

## Stub run

Replace Nextflow process commands with command [stubs](https://docs.seqera.io/nextflow/process#stub), where defined, before execution.

## Main script

Nextflow will attempt to run the script named `main.nf` in the root of the project repository by default. You can configure a custom script path and/or filename in `manifest.mainScript`, or you can provide the script path and filename in this field.

In a pipeline repository set up with subdirectories containing multiple main script files, enter the path name to your desired custom script in **Main script**. For example: `/custom-pipeline/custom-script.nf`

If you point to a custom script using this field, Platform also looks for a `nextflow.config` in the same directory as the custom script, and if none exists, it defaults to the `nextflow.config` in the repository root.

:::note
If you specify a custom script filename, the root of the default branch in your pipeline repository must still contain a `main.nf` file, even if blank. See [Nextflow configuration](../troubleshooting_and_faqs/nextflow) for more information on this known Nextflow behavior.
:::

## Workflow entry name

Nextflow DSL2 provides the ability to launch workflows with specific names. Enter the name of the workflow to be executed in this field.

## Schema name

Specify the name of a pipeline schema file in the workflow repository root folder to override the default `nextflow_schema.json`.

## Head job CPUs and memory

Specify the compute resources allocated to the Nextflow head job. These fields are only displayed for runs executing on [AWS Batch](../compute-envs/aws-batch) and [Azure Batch](../compute-envs/azure-batch) compute environments.

---
title: "Advanced options"
description: "Advanced guide to launching Nextflow pipelines in Seqera Platform"
date: "21 Apr 2023"
tags: [advanced, launch]
---

You can modify the configuration and execution of a pipeline with advanced launch options.

### Nextflow config file

Add settings to the Nextflow configuration file. This must follow the same syntax as the [Nextflow configuration file](https://www.nextflow.io/docs/latest/config.html#config-syntax).

For example, modify the **manifest** section to give the pipeline a name and description that will show up in the Seqera monitoring section:

```ini
    manifest {
        name = 'My_RNASeq_Pipeline'
        description = 'Generates RNASeq results using a test profile'
    }
```

#### Nextflow configuration order of priority

When launching pipelines in Platform, Nextflow configuration values can be supplied from the `nextflow.config` file in the pipeline repository and the **Nextflow config file** field in the pipeline launch form. If different values of the same configuration parameter are defined, Nextflow parameters defined in the launch form **Nextflow config file** field override the same parameters in your `nextflow.config` file.

Configuration values set in the **Global Nextflow config** field during compute environment creation are pre-filled in the **Nextflow config file** field during pipeline launch. These pre-filled values from the compute environment can be overridden manually during launch.

| Priority | Nextflow configuration                               |
|----------|------------------------------------------------------|
| Highest  | Pipeline launch form **Nextflow config file** field  |
|                | Compute environment **Global Nextflow config** field |
| Lowest   | Pipeline repository `nextflow.config` file           |

For example, if:

1. The `nextflow.config` file in your pipeline repository contains this manifest:

    ```ini title="Pipeline repository config file"
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

    ```ini title="Pipeline launch form Nextflow config file field"
    manifest {
        name = 'C'
        description = 'Pipeline description C'
    }
    ```

### Seqera Cloud config file

Configure per-pipeline Seqera reporting behavior. Settings specified here override the same settings in the `tower.yml` [configuration file](../enterprise/configuration/overview) for this execution. Use the `reports` key to specify report paths, titles, and MIME types:

```yml
reports:
  reports/multiqc/index.html:
    display: "MultiQC Reports"
    mimeType: "text/html"
```

### Pre and post-run scripts

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

Post-run scripts are executed after all Nextflow processes have completed. Post-run scripts are useful for triggering a third party service via API request.

### Pull latest

Instruct Nextflow to pull the latest pipeline version from the Git repository. This is equivalent to using the `-latest` flag.

### Stub run

Replace Nextflow process commands with command [stubs](https://www.nextflow.io/docs/latest/process.html#stub), where defined, before execution.

### Main script

Nextflow will attempt to run the script named `main.nf` in the project repository by default. You can configure a custom script filename in `manifest.mainScript` or you can provide the script filename in this field.

:::note
If you specify a custom script filename, the root of the default branch in your pipeline repository must still contain blank `main.nf` and `nextflow.config` files. See [Nextflow configuration](../troubleshooting_and_faqs/nextflow) for more information on this known Nextflow behavior.
:::

### Workflow entry name

Nextflow DSL2 provides the ability to launch workflows with specific names. Enter the name of the workflow to be executed in this field.

### Schema name

Specify the name of a pipeline schema file in the workflow repository root folder to override the default `nextflow_schema.json`.

### Head job CPUs and memory

Specify the compute resources allocated to the Nextflow head job. These fields are only displayed for runs executing on [AWS Batch](../compute-envs/aws-batch) and [Azure Batch](../compute-envs/azure-batch) compute environments.


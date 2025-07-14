---
title: "Advanced options"
description: "Advanced guide to launching Nextflow pipelines in Tower"
date: "21 Apr 2023"
tags: [advanced, launch]
---

Advanced launch options allow users to modify the configuration and execution of the pipeline.

### Nextflow config file

The _Nextflow config_ field allows the addition of settings to the Nextflow configuration file.

This text should follow the same syntax as the [Nextflow configuration file](https://www.nextflow.io/docs/latest/config.html#config-syntax).

In the example below, we can modify the **manifest** section to give the pipeline a name and description which will show up in the Tower monitoring section.

![](./_images/launch_manifest.png)

### Pre & post-run scripts

It is possible to run custom code either before or after the execution of the Nextflow script. These fields allow users to enter shell commands.

### Pull latest

Enabling this option ensures Nextflow pulls the latest version from the Git repository. This is equivalent to using the `-latest` flag.

![](./_images/launch_advanced.png)

### Main script

Nextflow will attempt to run the script named `main.nf` in the project repository by default. This can be changed via either the `manifest.mainScript` option or by providing the script filename to run in this field.

### Workflow entry name

Nextflow DSL2 provides the ability to launch specific-named workflows. Enter the name of the workflow to be executed in this field.

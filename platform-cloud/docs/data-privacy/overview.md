---
title: "Data privacy"
description: "The data Seqera Platform collects and stores"
date: "21 Apr 2023"
tags: [data, privacy]
---

Seqera Platform orchestrates pipeline execution in your own infrastructure and stores only a limited set of metadata about your runs and tasks.

## Your data

Your data stays within your infrastructure.

To launch a pipeline with Seqera Platform, you create credentials and a compute environment in a workspace to connect your own infrastructure, such as high-performance computing (HPC) clusters, virtual machines (VMs), or Kubernetes. Seqera Platform uses this configuration to run the pipeline in your infrastructure, the same way the Nextflow CLI does. Seqera Platform does not manipulate your data, and your data is not transferred to the infrastructure where Seqera Platform runs.

You can view some data in your storage from the Seqera Platform interface, such as logs and reports generated in a pipeline run. This data is never stored in Seqera Platform infrastructure.

## User deletion

When a Seqera Platform user account is deleted:

- The user account email is changed to `none@your-domain`. Runs and run metadata associated with the user account display that email address.
- The username is changed to `username-<timestamp of deletion>`.
- All of the user's organization, workspace, and team memberships are deleted.
- All of the user's access tokens are deleted from their personal workspace.

Enterprise installations also delete the following from the user's personal workspace:

- All credentials
- All compute environments
- All actions created by the user

### Studios connectivity

Studios is a stateless application that uses access tokens to manage connections. By default, access tokens expire after one hour, and a deleted user account can retain access to a running Studio session until its token expires. To revoke access sooner, a workspace user with the Maintain role can stop and start all Studio sessions in the workspace where the account was deleted.

## Metadata stored by Seqera Platform

The Nextflow runtime sends workflow execution metadata to Seqera Platform when:

- You launch a pipeline from Seqera Platform.
- You run a pipeline with the `-with-tower` command-line option.
- You set `tower.enabled` in your Nextflow configuration.

### Workflow metadata

Seqera Platform collects and stores the following metadata fields during a workflow execution:

| Name                        | Description                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `command_line`              | The command line used to launch the workflow execution                                                                                      |
| `commit_id`                 | The workflow project commit ID at the time of the execution                                                                                 |
| `complete`                  | The workflow execution completion timestamp                                                                                                 |
| `config_files`              | The Nextflow config file path(s) involved in the workflow execution                                                                         |
| `config_text`               | The Nextflow config content used for the workflow execution. Note: secrets, such as AWS keys, are stripped and _not_ included in this field |
| `container`                 | The container image name(s) used for the pipeline execution                                                                                 |
| `container_engine`          | The container engine name used for the pipeline execution                                                                                   |
| `duration`                  | The workflow execution overall duration (wall time)                                                                                         |
| `error_message`             | The error message reported when the Nextflow execution fails                                                                              |
| `error_report`              | The extended error message reported when the workflow execution fails                                                                       |
| `exit_status`               | The workflow execution (POSIX) exit code                                                                                                    |
| `home_dir`                  | The launching user home directory path                                                                                                      |
| `launch_dir`                | The workflow launching directory path                                                                                                       |
| `manifest_author`           | The workflow project author as defined in the Nextflow config manifest file                                                                 |
| `manifest_default_branch`   | The workflow project default Git branch as defined in the Nextflow config manifest file                                                     |
| `manifest_description`      | The workflow project description as defined in the Nextflow config manifest file                                                            |
| `manifest_gitmodules`       | The workflow project Git submodule flag in the Nextflow config manifest file                                                                |
| `manifest_home_page`        | The workflow project Git home page as defined in the Nextflow config manifest file                                                          |
| `manifest_main_script`      | The workflow project main script file name as defined in the Nextflow config manifest file                                                  |
| `manifest_name`             | The workflow project name as defined in the Nextflow config manifest file                                                                   |
| `manifest_nextflow_version` | The workflow project required Nextflow version defined in the Nextflow config manifest file                                                 |
| `manifest_version`          | The workflow project version string as defined in the Nextflow config manifest file                                                         |
| `nextflow_build`            | The build number of the Nextflow runtime used to launch the workflow execution                                                              |
| `nextflow_timestamp`        | The build timestamp of the Nextflow runtime used to launch the workflow execution                                                           |
| `nextflow_version`          | The version string of the Nextflow runtime used to launch the workflow execution                                                            |
| `params`                    | The workflow params used to launch the pipeline execution                                                                                   |
| `profile`                   | The workflow config profile string used for the pipeline execution                                                                          |
| `project_dir`               | The directory path where the workflow scripts are stored                                                                                    |
| `project_name`              | The workflow project name                                                                                                                   |
| `repository`                | The workflow project repository                                                                                                             |
| `resume`                    | The flag set when a resume execution was submitted                                                                                          |
| `revision`                  | The workflow project revision number                                                                                                        |
| `run_name`                  | The workflow run name as given by the Nextflow runtime                                                                                      |
| `script_file`               | The workflow script file path                                                                                                               |
| `script_id`                 | The workflow script checksum number                                                                                                         |
| `script_name`               | The workflow script filename                                                                                                                |
| `session_id`                | The workflow execution unique UUID as assigned by the Nextflow runtime                                                                      |
| `start`                     | The workflow execution start timestamp                                                                                                      |
| `stats_cached_count`        | The number of cached tasks upon completion                                                                                                  |
| `stats_cached_duration`     | The aggregate time of cached tasks upon completion                                                                                          |
| `stats_cached_pct`          | The percentage of cached tasks upon completion                                                                                              |
| `stats_compute_time_fmt`    | The overall compute time as a formatted string                                                                                              |
| `stats_failed_count`        | The number of failed tasks upon completion                                                                                                  |
| `stats_failed_count_fmt`    | The number of failed tasks upon completion as a formatted string                                                                            |
| `stats_failed_duration`     | The aggregate time of failed tasks upon completion                                                                                          |
| `stats_failed_pct`          | The percentage of failed tasks upon completion                                                                                              |
| `stats_ignored_count`       | The number of ignored tasks upon completion                                                                                                 |
| `stats_ignored_count_fmt`   | The number of ignored tasks upon completion as a formatted string                                                                           |
| `stats_ignored_pct`         | The percentage of ignored tasks upon completion                                                                                             |
| `stats_succeed_count`       | The number of succeeded tasks upon completion                                                                                               |
| `stats_succeed_count_fmt`   | The number of succeeded tasks upon completion as a formatted string                                                                         |
| `stats_succeed_duration`    | The aggregate time of succeeded tasks upon completion                                                                                       |
| `stats_succeed_pct`         | The percentage of succeeded tasks upon completion                                                                                           |
| `status`                    | The workflow execution status                                                                                                               |
| `submit`                    | The workflow execution submission timestamp                                                                                                 |
| `success`                   | The flag reporting whether the execution completed successfully                                                                             |
| `user_name`                 | The POSIX user name that launched the workflow execution                                                                                    |
| `work_dir`                  | The workflow execution scratch directory path                                                                                               |

### Task metadata

Seqera Platform collects and stores the following metadata fields for each task:

| Name           | Description                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `attempt`      | Number of Nextflow execution attempts of the task                                              |
| `cloud_zone`   | Cloud zone where the task execution was allocated                                              |
| `complete`     | Task execution completion timestamp                                                            |
| `container`    | Container image name used to execute the task                                                  |
| `cost`         | Estimated task compute cost                                                                    |
| `cpus`         | Number of CPUs requested                                                                       |
| `disk`         | Amount of disk storage requested                                                               |
| `duration`     | Amount of time for the task to complete                                                        |
| `env`          | Task execution environment variables                                                           |
| `error_action` | Action applied on task failure                                                                 |
| `executor`     | Executor requested for the task execution                                                      |
| `exit_status`  | Task POSIX exit code on completion                                                             |
| `hash`         | Task unique hash code                                                                          |
| `inv_ctxt`     | Number of involuntary context switches                                                         |
| `machine_type` | Cloud virtual machine type                                                                     |
| `memory`       | Amount of memory requested                                                                     |
| `module`       | Environment module requested                                                                   |
| `name`         | Task unique name                                                                               |
| `native_id`    | Task unique ID as assigned by the underlying execution platform                                |
| `pcpu`         | Percentage of CPU used to compute the task                                                     |
| `peak_rss`     | Peak of real memory during the task execution                                                  |
| `peak_vmem`    | Peak of virtual memory during the task execution                                               |
| `pmem`         | Percentage of memory used to compute the task                                                  |
| `price_model`  | Cloud price model applied for the task                                                         |
| `process`      | Nextflow process name                                                                          |
| `queue`        | Compute queue name requested                                                                   |
| `rchar`        | Number of bytes the process read, using any read-like system call from files, pipes, and terminals |
| `read_bytes`   | Number of bytes the process directly read from disk                                            |
| `realtime`     | Time required to compute the task                                                              |
| `rss`          | Real memory (resident set) size of the process                                                 |
| `scratch`      | Flag reporting the task was executed in a local scratch path                                   |
| `script`       | Task command script                                                                            |
| `start`        | Task execution start timestamp                                                                 |
| `status`       | Task execution status                                                                          |
| `submit`       | Task submission timestamp                                                                      |
| `syscr`        | Number of read-like system call invocations that the process performed                         |
| `syscw`        | Number of write-like system call invocations that the process performed                        |
| `tag`          | Nextflow tag associated with the task execution                                                 |
| `task_id`      | Nextflow task ID                                                                               |
| `time`         | Task execution timeout requested                                                               |
| `vmem`         | Virtual memory size used by the task execution                                                 |
| `vol_ctxt`     | Number of voluntary context switches                                                           |
| `wchar`        | Number of bytes the process wrote, using any write-like system call                            |
| `workdir`      | Task execution work directory                                                                  |
| `write_bytes`  | Number of bytes the process wrote to disk                                                       |

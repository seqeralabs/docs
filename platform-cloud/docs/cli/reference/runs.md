---
title: tw runs
description: Manage pipeline runs
---

# `tw runs`

Manage pipeline runs

## `tw runs view`

View pipeline run details

### Synopsis

```bash
tw runs view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline run identifier. The unique workflow ID to display details for. Use additional flags to control which sections are shown. | ✓ |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--config` | Display Nextflow configuration used for this workflow execution. |  |  |
| `--params` | Display pipeline parameters provided at launch time in JSON or YAML format. |  |  |
| `--command` | Display the Nextflow run command used to execute this workflow. |  |  |
| `--status` | Display current workflow execution status (SUBMITTED, RUNNING, SUCCEEDED, FAILED, CANCELLED). |  |  |
| `--processes` | Display per-process execution progress showing pending, running, succeeded, failed, and cached task counts. |  |  |
| `--stats` | Display workflow execution statistics including compute time, task counts, success/failure percentages, and cached task efficiency. |  |  |
| `--load` | Display real-time resource usage including active tasks, CPU cores, memory consumption, and I/O metrics. |  |  |
| `--utilization` | Display resource efficiency metrics showing CPU and memory utilization percentages across workflow execution. |  |  |
| `--metrics-memory` | Display memory usage statistics per process including mean, min, max, and quartile distributions (RSS, virtual memory). |  |  |
| `--metrics-cpu` | Display CPU usage statistics per process including mean, min, max, and quartile distributions (CPU time, CPU percentage). |  |  |
| `--metrics-time` | Display task execution time statistics per process including mean, min, max, and quartile distributions (duration, realtime). |  |  |
| `--metrics-io` | Display I/O statistics per process including mean, min, max, and quartile distributions (read bytes, write bytes, syscalls). |  |  |

### `tw runs view download`

Download pipeline run files

### Synopsis

```bash
tw runs view download [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--type` | Type of file to download. Options: 'stdout' (standard output), 'log' (Nextflow log), 'stderr' (standard error, tasks only), 'timeline' (execution timeline HTML, workflow only). Default: stdout. |  | `stdout` |
| `-t` | Task numeric identifier. When specified, downloads task-specific files (.command.out, .command.err, .command.log). When omitted, downloads workflow-level files (nextflow.log, timeline.html). |  |  |

### `tw runs view metrics`

Display pipeline run metrics

### Synopsis

```bash
tw runs view metrics [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Filter metrics by process name. Shows statistics only for processes matching the specified name. |  |  |
| `-t`, `--type` | Metric types to display: cpu, mem, time, io. Comma-separated list. Default: all types. |  |  |
| `-c`, `--columns` | Statistical columns to display: min, q1, q2, q3, max, mean. Shows quartile distribution of resource usage. Default: all columns. |  |  |
| `-v`, `--view` | Table view format. Options: condensed (compact), extended (detailed). Default: condensed. |  |  |

### `tw runs view tasks`

Display pipeline run tasks

### Synopsis

```bash
tw runs view tasks [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--columns` | Additional task columns to display beyond the default set. Available columns: taskId, process, tag, status, hash, exit, container, nativeId, submit, duration, realtime, pcpu, pmem, peakRss, peakVmem, rchar, wchar, volCtxt, invCtxt. Comma-separated list. |  |  |
| `-f`, `--filter` | Filter tasks by name prefix. Shows only tasks with names starting with the specified string. |  |  |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

### `tw runs view task`

Display pipeline run task details

### Synopsis

```bash
tw runs view task [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-t` | Task numeric identifier. Unique identifier for the specific task execution within the workflow run. | ✓ |  |
| `--execution-time` | Display task execution timing details including submit time, start time, completion time, duration, and realtime. |  |  |
| `--resources-requested` | Display resources requested by the task including CPUs, memory, disk space, and time allocation. |  |  |
| `--resources-usage` | Display actual resource consumption including CPU percentage, memory usage (RSS, peak RSS, virtual memory), and I/O statistics. |  |  |

## `tw runs list`

List pipeline runs

### Synopsis

```bash
tw runs list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Filter pipeline runs by run name. Performs case-insensitive substring matching on the runName field. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

## `tw runs relaunch`

Relaunch a pipeline run

### Synopsis

```bash
tw runs relaunch [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline run identifier to relaunch | ✓ |  |
| `--pipeline` | Override the pipeline to launch. Allows relaunching with a different pipeline repository URL while keeping other launch configuration settings. |  |  |
| `--no-resume` | Start workflow execution from scratch instead of resuming from the last successful process. Use this to rerun the entire workflow without using cached results. |  |  |
| `-n`, `--name` | Custom workflow run name. Overrides the automatically generated run name with a user-defined identifier. |  |  |
| `--launch-container` | Container image for the Nextflow head job. Overrides the default launcher container. (BETA) |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. |  |  |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. |  |  |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. |  |  |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. |  |  |
| `--revision` | Git revision, branch, or tag to use. |  |  |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. |  |  |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. |  |  |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. |  |  |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. |  |  |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). |  |  |
| `--main-script` | Alternative main script filename. Default: `main.nf`. |  |  |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. |  |  |
| `--schema-name` | Name of the pipeline schema to use. |  |  |
| `--user-secrets` | Array of user secrets to make available to the pipeline. |  |  |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. |  |  |

## `tw runs cancel`

Cancel a pipeline run

### Synopsis

```bash
tw runs cancel [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline run identifier. The unique workflow ID to cancel. Running tasks will be terminated. | ✓ |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw runs labels`

Manage pipeline run labels

### Synopsis

```bash
tw runs labels [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `-id` | Pipeline run identifier. The unique workflow ID to manage labels for. Labels help organize and filter pipeline runs. | ✓ |  |
| `--no-create` | Assign labels without creating the ones which were not found. |  |  |
| `--operations`, `-o` | Type of operation (set, append, delete) [default: set]. |  | `set` |

## `tw runs delete`

Delete a pipeline run

### Synopsis

```bash
tw runs delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `-id` | Pipeline run identifier. The unique workflow ID to delete. Deletes the run record and associated metadata from Seqera Platform. | ✓ |  |
| `--force` | Force deletion of active workflows. By default, only completed workflows can be deleted. Use this flag to delete running or pending workflows. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw runs dump`

Dump all logs and details of a run into a compressed tarball file for troubleshooting.

### Synopsis

```bash
tw runs dump [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `-id` | Pipeline run identifier | ✓ |  |
| `-o`, `--output` | Output file path for the compressed archive. Supported formats: .tar.xz (smaller, slower) and .tar.gz (faster, larger). | ✓ |  |
| `--add-task-logs` | Include individual task log files (stdout, stderr, .command.log) in the archive. Useful for detailed task-level troubleshooting. |  |  |
| `--add-fusion-logs` | Include Fusion file system logs for tasks. Only applicable when workflow uses Fusion for cloud storage access. |  |  |
| `--only-failed` | Include only failed tasks in the dump. Reduces archive size by excluding successful task logs. |  |  |
| `--silent` | Suppress download progress indicators. Useful for scripting or logging to files. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

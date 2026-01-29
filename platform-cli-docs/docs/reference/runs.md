---
title: tw runs
description: Manage pipeline runs
---

# tw runs

Manage pipeline runs

Run `tw runs -h` to view supported runs operations.

Runs display all the current and previous pipeline runs in the specified workspace. Each new or resumed run is given a random name such as _grave_williams_ by default, which can be overridden with a custom value at launch. See [Run details](/platform-cloud/monitoring/run-details) for more information. As a run executes, it can transition through the following states:

- `submitted`: Pending execution
- `running`: Running
- `succeeded`: Completed successfully
- `failed`: Successfully executed, where at least one task failed with a terminate [error strategy](https://www.nextflow.io/docs/latest/process.html#errorstrategy)
- `cancelled`: Stopped manually during execution
- `unknown`: Indeterminate status


## tw runs view

View pipeline run details.

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

Run `tw runs view -h` to view all the required and optional fields for viewing a pipeline's runs.

```bash
tw runs view -i 2vFUbBx63cfsBY -w seqeralabs/showcase

  Run at [seqeralabs / showcase] workspace:


    General
    ---------------------+-------------------------------------------------
    ID                  | 2vFUbBx63cfsBY
    Operation ID        | b5d55384-734e-4af0-8e47-0d3abec71264
    Run name            | adoring_brown
    Status              | SUCCEEDED
    Starting date       | Fri, 31 May 2024 10:38:30 GMT
    Commit ID           | b89fac32650aacc86fcda9ee77e00612a1d77066
    Session ID          | 9365c6f4-6d79-4ca9-b6e1-2425f4d957fe
    Username            | user1
    Workdir             | s3://seqeralabs-showcase/scratch/2vFUbBx63cfsBY
    Container           | No container was reported
    Executors           | awsbatch
    Compute Environment | seqera_aws_ireland_fusionv2_nvme
    Nextflow Version    | 23.10.1
    Labels              | star_salmon,yeast
```


### tw runs view download

Download pipeline run files.

```bash
tw runs view download [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--type` | Type of file to download. Options: 'stdout' (standard output), 'log' (Nextflow log), 'stderr' (standard error, tasks only), 'timeline' (execution timeline HTML, workflow only). Default: stdout. |  | `stdout` |
| `-t` | Task numeric identifier. When specified, downloads task-specific files (.command.out, .command.err, .command.log). When omitted, downloads workflow-level files (nextflow.log, timeline.html). |  |  |

### tw runs view metrics

Display pipeline run metrics.

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

### tw runs view tasks

Display pipeline run tasks.

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

### tw runs view task

Display pipeline run task details.

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

## tw runs list

List pipeline runs.

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

Run `tw runs list -h` to view all the required and optional fields for listing runs in a workspace.

```bash
tw runs list

  Pipeline runs at [seqeralabs / testing] workspace:

    ID             | Status    | Project Name               | Run Name                        | Username              | Submit Date
    ----------------+-----------+----------------------------+---------------------------------+-----------------------+-------------------------------
    49Gb5XVMud2e7H | FAILED    | seqeralabs/nf-aggregate    | distraught_archimedes           | user1 | Fri, 31 May 2024 16:22:10 GMT
    4anNFvTUwRFDp  | SUCCEEDED | nextflow-io/rnaseq-nf      | nasty_kilby                     | user1   | Fri, 31 May 2024 15:23:12 GMT
    3wo3Kfni6Kl3hO | SUCCEEDED | nf-core/proteinfold        | reverent_linnaeus               | user2   | Fri, 31 May 2024 15:22:38 GMT

<snip>

    4fIRrFgZV3eDb1 | FAILED    | nextflow-io/hello          | gigantic_lichterman             | user1          | Mon, 29 Apr 2024 08:44:47 GMT
    cHEdKBXmdoQQM  | FAILED    | mathysgrapotte/stimulus    | mighty_poitras                  | user3            | Mon, 29 Apr 2024 08:08:52 GMT
```

Use the optional `--filter` flag to filter the list of runs returned by one or more `keyword:value` entries:

- `status`
- `label`
- `workflowId`
- `runName`
- `username`
- `projectName`
- `after`
- `before`
- `sessionId`
- `is:starred`

If no `keyword` is defined, the filtering is applied to the `runName`, `projectName` (the pipeline name), and `username`.

:::note
The `after` and `before` flags require an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp with UTC timezone (`YYYY-MM-DDThh:mm:ss.sssZ`).
:::

```bash
tw runs list --filter hello_slurm_20240530

  Pipeline runs at [seqeralabs / showcase] workspace:

    ID            | Status    | Project Name      | Run Name                             | Username   | Submit Date
    ---------------+-----------+-------------------+--------------------------------------+------------+-------------------------------
    pZeJBOLtIvP7R | SUCCEEDED | nextflow-io/hello | hello_slurm_20240530_e75584566f774e7 | user1 | Thu, 30 May 2024 09:12:51 GMT
```

Multiple filter criteria can be defined:

```bash
tw runs list --filter="after:2024-05-29T00:00:00.000Z before:2024-05-30T00:00:00.000Z username:user1"

  Pipeline runs at [seqeralabs / testing] workspace:

    ID             | Status    | Project Name          | Run Name           | Username    | Submit Date
    ----------------+-----------+-----------------------+--------------------+-------------+-------------------------------
    xJvK95W6YUmEz  | SUCCEEDED | nextflow-io/rnaseq-nf | ondemand2          | user1       | Wed, 29 May 2024 20:35:28 GMT
    1c1ckn9a3j0xF0 | SUCCEEDED | nextflow-io/rnaseq-nf | fargate            | user1       | Wed, 29 May 2024 20:28:02 GMT
    3sYX1acJ01T7rL | SUCCEEDED | nextflow-io/rnaseq-nf | min1vpcu-spot      | user1       | Wed, 29 May 2024 20:27:47 GMT
    4ZYJGWJCttXqXq | SUCCEEDED | nextflow-io/rnaseq-nf | min1cpu-ondemand   | user1       | Wed, 29 May 2024 20:25:21 GMT
    4LCxsffTqf3ysT | SUCCEEDED | nextflow-io/rnaseq-nf | lonely_northcutt   | user1       | Wed, 29 May 2024 20:09:51 GMT
    4Y8EcyopNiYBlJ | SUCCEEDED | nextflow-io/rnaseq-nf | fargate            | user1       | Wed, 29 May 2024 18:53:47 GMT
    dyKevNwxK50XX  | SUCCEEDED | mark814/nr-test       | cheeky_cuvier      | user1       | Wed, 29 May 2024 12:21:10 GMT
    eS6sVB5A387aR  | SUCCEEDED | mark814/nr-test       | evil_murdock       | user1       | Wed, 29 May 2024 12:11:08 GMT
```

A leading and trailing `*` wildcard character is supported:

```bash
tw runs list --filter="*man/rnaseq-*"

  Pipeline runs at [seqeralabs / testing] workspace:

    ID             | Status    | Project Name        | Run Name            | Username       | Submit Date
    ----------------+-----------+---------------------+---------------------+----------------+-------------------------------
    5z4AMshti4g0GK | SUCCEEDED | robnewman/rnaseq-nf | admiring_darwin     | user1     | Tue, 16 Jan 2024 19:56:29 GMT
    62LqiS4O4FatSy | SUCCEEDED | robnewman/rnaseq-nf | cheeky_yonath       | user1 | Wed, 3 Jan 2024 12:36:09 GMT
    3k2nu8ZmcBFSGv | SUCCEEDED | robnewman/rnaseq-nf | compassionate_jones | user3   | Tue, 2 Jan 2024 16:22:26 GMT
    3zG2ggf5JsniNW | SUCCEEDED | robnewman/rnaseq-nf | fervent_payne       | user1     | Wed, 20 Dec 2023 23:55:17 GMT
    1SNIcSXRuJMSNZ | SUCCEEDED | robnewman/rnaseq-nf | curious_babbage     | user3     | Thu, 28 Sep 2023 17:48:04 GMT
    5lI2fZUZfiokBI | SUCCEEDED | robnewman/rnaseq-nf | boring_heisenberg   | user2     | Thu, 28 Sep 2023 12:29:27 GMT
    5I4lsRXIHVEjNB | SUCCEEDED | robnewman/rnaseq-nf | ecstatic_ptolemy    | user2     | Wed, 27 Sep 2023 22:06:19 GMT
```


## tw runs relaunch

Relaunch a pipeline run.

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

Run `tw runs relaunch -h` to view all the required and optional fields for relaunching a run in a workspace.

### Example

```bash
tw runs relaunch -i 6p7q8r9s0t1u2

# Output:
  Workflow 8r9s0t1u2v3w4 submitted at [my-organization-updated / my-workspace] workspace.

    https://cloud.seqera.io/orgs/my-organization-updated/workspaces/my-workspace/watch/8r9s0t1u2v3w4/watch/8r9s0t1u2v3w4
```

## tw runs cancel

Cancel a pipeline run.

```bash
tw runs cancel [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Pipeline run identifier. The unique workflow ID to cancel. Running tasks will be terminated. | ✓ |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

Run `tw runs cancel -h` to view all the required and optional fields for canceling a run in a workspace.

### Example

```bash
tw runs cancel -i 6p7q8r9s0t1u2 -w 123456789012345

# Output:
  Pipeline run '6p7q8r9s0t1u2' canceled at [my-organization-updated / my-workspace] workspace
```

## tw runs labels

Manage pipeline run labels.

```bash
tw runs labels [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `-id` | Pipeline run identifier. The unique workflow ID to manage labels for. Labels help organize and filter pipeline runs. | ✓ |  |
| `--no-create` | Assign labels without creating the ones which were not found. |  |  |
| `--operations`, `-o` | Type of operation (set, append, delete) [default: set]. |  | `set` |

### Example

```bash
tw runs labels -i 6p7q8r9s0t1u2 newlabel

# Output:
 'set' labels on 'run' with id '6p7q8r9s0t1u2' at 123456789012345 workspace
```

## tw runs delete

Delete a pipeline run.

```bash
tw runs delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `-id` | Pipeline run identifier. The unique workflow ID to delete. Deletes the run record and associated metadata from Seqera Platform. | ✓ |  |
| `--force` | Force deletion of active workflows. By default, only completed workflows can be deleted. Use this flag to delete running or pending workflows. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

Run `tw runs delete -h` to view all the required and optional fields for deleting a run in a workspace.

### Example

```bash
tw runs delete -i 7q8r9s0t1u2v3 -w 123456789012345

# Output:
  Pipeline run '7q8r9s0t1u2v3' deleted at [my-organization-updated / my-workspace] workspace
```

## tw runs dump


Dump all logs and details of a run into a compressed tarball file for troubleshooting.

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

Run `tw runs dump -h` to view all the required and optional fields for dumping all logs and details of a run in a workspace. The supported formats are `.tar.xz` and `.tar.gz`. In the example below, we dump all the logs and details for the run with ID `5z4AMshti4g0GK` to the output file `file.tar.gz`.

```bash
tw runs dump -i 5z4AMshti4g0GK -o file.tar.gz
- Tower info
- Workflow details
- Task details

  Pipeline run '5z4AMshti4g0GK' at [seqeralabs / testing] workspace details dump at 'file.tar.gz'
```

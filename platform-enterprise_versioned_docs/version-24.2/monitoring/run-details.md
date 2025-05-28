---
title: "Run details"
description: "Monitoring a Nextflow pipeline executed through Seqera Platform."
date: "21 Apr 2023"
tags: [logging, monitoring, execution]
---

Select a workflow run from the **Runs** list to view execution details. This view contains:

- [Run information](#run-information) with real-time Nextflow execution details
- [General summary](#general-summary) and [task status](#task-status)
- List of pipeline [processes](#processes)
- [Aggregated stats](#aggregate-stats), [load](#load), and [utilization](#utilization)
- [Tasks](#tasks) and [metrics](#metrics)

### Run information

This section contains details about the Nextflow execution:

- The Nextflow **Command line** executed.
- The pipeline **Parameters** (taken from the configuration `params` scope).
- The **Configuration** files and the final resolved configuration.
- The **Execution log** from the main Nextflow process, updated in real-time.
- Available **Reports**, if any are [configured](../reports/overview).

### General summary

The **General** panel displays top-level information about a pipeline run:

- Unique workflow run ID
- Run name
- Timestamp of run start
- Project revision and Git commit ID
- Nextflow session ID
- Username of the launcher
- Work directory path

  :::tip
  If your work directory resides in cloud storage, select the work directory path in the **General** panel to browse its contents in [Data Explorer](../data/data-explorer).
  :::

- Container image
- Executor
- Compute environment name
- Resource labels
- Nextflow version

Hover over each item with the cursor to view a description. Hover over the compute environment name for more compute environment details.

### Task status

The **Status** panel provides a real-time status of all tasks in the pipeline run:

- **pending**: The task has been created, but not yet submitted to an executor
- **submitted**: The task has been submitted to an executor, but is not yet running
- **running**: The task has been launched by an executor (the precise definition of "running" may vary for each executor)
- **cached**: A previous (and valid) execution of the task was found and used instead of executing the task again (See [Cache and resume](../launch/cache-resume))
- **completed**: The task completed successfully
- **failed**: The task failed

### Processes

The **Processes** panel displays the status of each process in a pipeline run. In Nextflow, a process is an individual step in a pipeline, while a task is a particular invocation of a process for given input data. In the panel, each process is shown with a progress bar indicating how many tasks have been completed for that process.

The progress bar is color-coded based on task status (**created**, **submitted**, **completed**, **failed**).

Select a process to navigate to the [Tasks](#tasks) panel and filter the table contents by the selected process.

### Aggregate stats

The **Aggregate stats** panel displays a real-time summary of the resources used by a pipeline run.

#### Wall time

The _wall time_ is the duration of the entire workflow run, from submission to completion.

#### CPU time

The _CPU time_ is the total CPU time used by all tasks. It is based on the CPUs _requested_, not the actual CPU usage. The CPU time of an individual task is computed as follows:

$$
\text{CPU time (CPU-hours)} = \text{Task CPUs} \times \text{Task runtime}
$$

The runtime of an individual task is computed as follows:

$$
\text{Task runtime} = \text{Task complete} - \text{Task start}
$$

See also: **cpus**, **start**, and **complete** in the task table.

#### Total memory

The _total memory_ is the total memory used by all tasks. It is based on the memory _requested_, not the actual memory usage.

See also: **peakRss** in the task table.

#### Read and write

The _read_ and _write_ are the total amount of data read from and written to storage.

See also: **readBytes** and **writeBytes** in the task table.

#### Estimated cost

See [Cloud costs](../monitoring/cloud-costs#seqera-cost-estimate).

### Load

The **Load** panel displays the current number of running tasks and CPU cores vs the maximum number of tasks and CPU cores for the entire pipeline run.

These metrics measure the level of parallelism achieved by the pipeline. Use these metrics to determine whether your pipeline runs are fully utilizing the capacity of your compute environment.

### Utilization

The **Utilization** panel displays the average resource utilization of all tasks that have completed successfully in a pipeline run. The CPU and memory efficiency of a task are computed as follows:

$$
\text{CPU efficiency (\%)} = \text{CPU usage (\%)} \times \text{Task CPUs}
$$

$$
\text{Memory efficiency (\%)} = \frac{ \text{Peak memory usage} }{ \text{Task memory} } \times \text{100 \%}
$$

See also: **pcpu**, **cpus**, **peakRss**, and **memory** in the task table.

These metrics measure how efficiently the pipeline is using its compute resources. Low utilization indicates that the pipeline may be over-requesting resources for some tasks.

### Tasks

The **Tasks** panel shows all the tasks that were executed in a pipeline run.

#### Search and filter tasks

Use the search bar to filter tasks with substrings in the table columns such as **process**, **tag**, **hash**, and **status**. For example, if you enter `succeeded` in the **Search task** field, the table displays only tasks that succeeded.

#### Task details

Select a task in the task table to open the **Task details** dialog. The dialog has three tabs:

- **About**

  - **Name**: Process name and tag
  - **Command**: Task script, defined in the pipeline process
  - **Status**: Exit code, task status, attempts
  - **Work directory**: Directory where the task was executed
  - **Environment**: Environment variables supplied to the task
  - **Execution time**: Metrics for task submission, start, and completion time
  - **Resources requested**: Metrics for the resources requested by the task
  - **Resources used**: Metrics for the resources used by the task

- **Execution log**

  The **Execution log** tab provides a real-time log of the selected task's execution. Task execution and other logs (such as `stdout` and `stderr`) are available for download from here, if still available in your compute environment.

- **Data Explorer**

  If the pipeline work directory is in cloud storage, this tab shows a [Data Explorer](../data/data-explorer) view of the task's work directory location with the files associated with the task.

### Metrics

The **Metrics** panel displays interactive plots for CPU usage, memory usage, task duration, and I/O usage, grouped by process. These metrics include succeeded and failed tasks. Use these plots to quickly inspect a pipeline run to determine the resources requested and consumed by each process.

:::tip
Hover the cursor over each box plot to show more details.
:::

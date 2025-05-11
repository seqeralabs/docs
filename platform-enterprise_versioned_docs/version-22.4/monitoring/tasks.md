---
title: Tasks & metrics
headline: "Task table and metrics"
description: "Monitoring tasks and metrics of Nextflow pipeline executed through Tower."
---

## Task table

The **Tasks** section shows all the tasks from an execution.

You can use the `Search` bar to filter tasks by process name, tag, hash, status, etc.

Selecting a status in **status** section filters the task table. E.g. clicking in the _CACHED_ card in the **status** column.

![](./_images/monitoring_cached.png)

Selecting a `process` in the **Processes** section above will filter all tasks for that specific process.

![](./_images/monitoring_star.png)

Selecting a task in the task table provides specific information about the task in the **Task details** dialog.

![](./_images/monitoring_task_command.png)

The task details dialog has the task information tab and the task **Execution log** tab.

### Task information

The task information tab contains the process name and task tag in the title. The tab includes:

- Command
- Status
- Work directory
- Environment
- Execution time
- Resources requested
- Resources used

![](./_images/monitoring_task_resources.png)

### Execution log

The **Execution log** provides a realtime log of the individual task of a Nextflow execution.

This can be very helpful for troubleshooting. It is possible to download the log files including `stdout` and `stderr` from your compute environment.

![](./_images/monitoring_task_exec_log.png)

### Resource metrics

This section displays plots with CPU, memory, task duration and I/O usage, grouped by process.

These metrics can be used to profile an execution to ensure that the correct amount or resources are being requested for each process.

![](./_images/monitoring_metrics.png)

:::tip
Hover the mouse over the box plots to display more details.
:::

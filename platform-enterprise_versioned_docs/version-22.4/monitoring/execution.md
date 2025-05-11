---
title: Execution details & logs
headline: "Monitoring & Logs"
description: "Monitoring a Nextflow pipeline executed through Tower."
---

### Run execution details

Selecting a workflow run from the **Runs** tab will display the workflow details. This view contains:

- [Run information](#run-information) with command-line, parameters, configuration, and execution logs in real-time.
- [Summary and status](./summary) section.
- List of pipeline [processes](./processes).
- [Aggregated stats](./aggregate_stats) and [load](./aggregate_stats#load-and-utilization).
- Detailed list of [individual tasks](./tasks#task-table) and [metrics](./tasks#resource-metrics).

### Run information

This section is composed of several tabs containing details about the Nextflow execution:

- The Nextflow **Command line** that was executed.

- The **Parameters** that were provided to the pipeline (taken from the configuration `params` scope).

- The **Configuration** files as well as the final resolved configuration.

- The **Execution log** from the main Nextflow process, which is updated in real time.

  ![](./_images/monitoring_exec_log.png)

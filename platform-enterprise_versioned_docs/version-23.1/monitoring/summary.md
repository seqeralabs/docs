---
title: "General summary and run status"
description: "Monitoring run and job status of pipelines in Tower."
date: "21 Apr 2023"
tags: [run, status, monitoring]
---

## General

The General summary displays information on the environment and the job being executed:

- Unique workflow run ID
- Workflow run name
- Date and time of job submission timestamp
- Project revision and Git commit ID
- Nextflow session ID
- Username of the launcher
- Work directory path
- Container image
- Executor
- Compute environment details
- Nextflow version

:::tip
Hover over with the mouse to get full details on the compute environment.
:::

![](./_images/monitoring_general.png)

### Task status

The **Task status** section shows in real time the statuses of your workflow tasks. The panel uses the same colour code as the pipelines in the navigation bar.

The exact meaning of each status is dependant on the execution platform.

![](./_images/monitoring_status.png)

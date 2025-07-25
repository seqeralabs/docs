---
title: "slurm"
description: "Step-by-step instructions to set up Slurm for Nextflow Tower."
---

## Overview

[Slurm](https://slurm.schedmd.com/overview.html) is an open source, fault-tolerant, and highly scalable cluster management and job scheduling system for large and small Linux clusters.

Tower streamlines the deployment of Nextflow pipelines into both cloud-based and on-prem Slurm clusters.

### Requirements

To launch pipelines into a **Slurm** cluster from Tower, the following requirements must be satisfied:

- The cluster should allow outbound connections to the Tower web service.
- The cluster queue used to run the Nextflow head job must be able to submit cluster jobs.
- The Nextflow runtime version **21.02.0-edge** (or later) must be [installed on the cluster](https://nextflow.io/docs/latest/install.html).

### Compute Environment

To create a new compute environment for **Slurm** in Tower:

1.  In a workspace, select **Compute Environments** and then **New Environment**.

2.  Enter a descriptive name for this environment, e.g. "Slurm cluster".

3.  Select **Slurm Workload Manager** as the target platform.

4.  Select your credentials, or select **+** and **SSH** or **Tower Agent** to add new credentials.

5.  Enter a name for the credentials.

6.  Enter the absolute path of the **Work directory** to be used on the cluster.

7.  Enter the absolute path of the **Launch directory** to be used on the cluster. If omitted, it will be the same as the work directory.

8.  Enter the **Login hostname**, which is usually the hostname or public IP address of the cluster's login node.

9.  Enter the **Head queue name**, the cluster queue to which the Nextflow job will be submitted.

10. Enter the **Compute queue name**, the cluster queue to which the Nextflow job will submit tasks.

    :::tip
    The compute queue can be overridden by the Nextflow pipeline configuration. See the Nextflow [docs](https://www.nextflow.io/docs/latest/process.html#queue) for more details.
    :::

11. You can use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

12. Configure any advanced options described below, as needed.

13. Select **Create** to finalize the creation of the compute environment.

Jump to the documentation for [Launching Pipelines](../launch/launchpad).

### Advanced options

- You can use the **Nextflow queue size** to limit the number of jobs that Nextflow can submit to the scheduler at the same time.

- You can use the **Head job submit options** to specify Slurm options for the head job. You can optionally apply these options to compute jobs as well:

  ![](./_images/head_job_propagation.png)

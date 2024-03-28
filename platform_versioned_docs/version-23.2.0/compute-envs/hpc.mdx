---
title: "HPC compute environments"
description: "Instructions to set up HPC compute environments in Nextflow Tower"
date: "11 May 2023"
tags: [slurm, lsf, pbs, grid, altair, ibm, moab, slurm, compute environment]
---

Tower streamlines the deployment of Nextflow pipelines into both cloud-based and on-prem HPC clusters and supports compute environment creation for the following management and scheduling solutions:

- [Altair PBS Pro](https://www.altair.com/pbs-professional/)
- [Altair Grid Engine](https://www.altair.com/grid-engine/)
- [IBM Spectrum LSF](https://www.ibm.com/products/hpc-workload-management/details) (Load Sharing Facility)
- [Moab](http://docs.adaptivecomputing.com/suite/8-0/basic/help.htm#topics/moabWorkloadManager/topics/intro/productOverview.htm)
- [Slurm](https://slurm.schedmd.com/overview.html)

## Requirements

To launch pipelines into an **HPC** cluster from Tower, the following requirements must be satisfied:

- The cluster should allow outbound connections to the Tower web service.
- The cluster queue used to run the Nextflow head job must be able to submit cluster jobs.
- The Nextflow runtime version **21.02.0-edge** (or later) must be installed on the cluster.

## Compute environment

To create a new **HPC** compute environment in Tower:

1. In a workspace, select **Compute environments** and then **New environment**.

2. Enter a descriptive name for this environment.

3. Select your HPC environment from the **Platform** dropdown menu.

4. Select your credentials, or select **+** and **SSH** or **Tower Agent** to add new credentials.

5. Enter a name for the credentials.

6. Enter the absolute path of the **Work directory** to be used on the cluster.

7. Enter the absolute path of the **Launch directory** to be used on the cluster. If omitted, it will be the same as the work directory.

8. Enter the **Login hostname**. This is usually the hostname or public IP address of the cluster's login node.

9. Enter the **Head queue name**. This is the [default](https://www.nextflow.io/docs/latest/process.html#queue) cluster queue to which the Nextflow job will be submitted.

10. Enter the **Compute queue name**. This is the [default](https://www.nextflow.io/docs/latest/process.html#queue) cluster queue to which the Nextflow job will submit tasks.

11. Expand **Staging options** to include optional pre- or post-run Bash scripts that execute before or after the Nextflow pipeline execution in your environment.

12. Use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

13. Configure any advanced options described below, as needed.

14. Select **Create** to finalize the creation of the compute environment.

Jump to the documentation for [launching pipelines](../launch/launchpad.mdx).

### Advanced options

- Use the **Nextflow queue size** to limit the number of jobs that Nextflow can submit to the scheduler at the same time.

- Use the **Head job submit options** to specify platform-specific submit options for the head job. You can optionally apply these options to compute jobs as well:

  ![](./_images/head_job_propagation.png)

:::note
Once set during compute environment creation, these options cannot be overridden at pipeline launch time.
:::

#### IBM LSF additional advanced options

- Use **Unit for memory limits**, **Per job memory limits**, and **Per task reserve** to control how memory is requested for Nextflow jobs.

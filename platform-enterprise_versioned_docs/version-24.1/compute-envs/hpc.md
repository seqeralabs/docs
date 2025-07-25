---
title: "HPC compute environments"
description: "Instructions to set up HPC compute environments in Seqera Platform"
date: "11 May 2023"
tags: [slurm, lsf, pbs, grid, altair, ibm, moab, slurm, compute environment]
---

Seqera Platform streamlines the deployment of Nextflow pipelines into both cloud-based and on-prem HPC clusters and supports compute environment creation for the following management and scheduling solutions:

- [Altair PBS Pro](https://www.altair.com/pbs-professional/)
- [Grid Engine](https://www.altair.com/grid-engine/)
- [IBM Spectrum LSF](https://www.ibm.com/products/hpc-workload-management/details) (Load Sharing Facility)
- [Moab](http://docs.adaptivecomputing.com/suite/8-0/basic/help.htm#topics/moabWorkloadManager/topics/intro/productOverview.htm)
- [Slurm](https://slurm.schedmd.com/overview.html)

## Requirements

To launch pipelines into an **HPC** cluster from Seqera, the following requirements must be satisfied:

- The cluster should allow outbound connections to the Seqera web service.
- The cluster queue used to run the Nextflow head job must be able to submit cluster jobs.
- The Nextflow runtime version **21.02.0-edge** (or later) must be [installed on the cluster](https://nextflow.io/docs/latest/install.html).

## Credentials

Seqera requires SSH access to your HPC cluster to run pipelines. Use [managed identities](../credentials/managed_identities) to enable granular access control and preserve individual cluster user identities. 

You can also use workspace [SSH credentials](../credentials/ssh_credentials) for cluster login, but this provides service account access to your HPC to all Platform users. This means that all users will be granted the same file system access, and all activity is logged under the same user account on your HPC cluster. 

For HPC clusters that do not allow direct access through an SSH client, a secure connection can be authenticated with [Tower Agent](../supported_software/agent/overview).

## Work and launch directories

For instances where the work directory or launch directory must be set dynamically at runtime, you can use variable expansion. This works in conjunction with Tower Agent. The path that results from variable expansion must exist before workflow execution as the agent does not create directories.

For example, if the HPC cluster file system has a `/workspace` directory with subdirectories for each user that can run jobs, the value for the work directory can be the following: `/workspace/$TW_AGENT_USER`. For a user `user1`, the work directory resolves to the `/workspace/user1` directory.

The following variables are supported:

- `TW_AGENT_WORKDIR`: Resolves to the work directory for Tower Agent. By default, this directory resolves to the `${HOME}/work` path, where `HOME` is the home directory of the user that the agent runs as. The work directory can be overridden by specifying the `--work-dir` argument when configuring Tower Agent. For more information, see the [Tower Agent][agent] documentation.
- `TW_AGENT_USER`: Resolves to the username that the agent is running as. By default, this is the Unix username that the agent runs as. On systems where the agent cannot determine which user it runs as, it falls back to the value of the `USER` environment variable.

## HPC compute environment

To create a new **HPC** compute environment:

1.  In a Seqera workspace, select **Compute environments > New environment**.
1.  Enter a descriptive name for this environment. Use only alphanumeric characters, dashes, and underscores.
1.  Select your HPC environment from the **Platform** dropdown menu.
1.  Select your existing managed identity, SSH, or Tower Agent credentials, or select **+** and **SSH** or **Tower Agent** to add new credentials.
1.  Enter the absolute path of the **Work directory** to be used on the cluster. You can use the `TW_AGENT_WORKDIR` and `TW_AGENT_USER` variables in the file system path.

    :::caution
    All managed identity users must be a part of the same Linux user group. The group must have access to the HPC compute environment work directory. Set group permissions for the work directory as follows (replace `sharedgroupname` and `<WORKDIR>` with your group name and work directory):

    ```bash
    chgrp -R sharedgroupname <WORKDIR>
    chmod -R g+wxs <WORKDIR>
    setfacl -Rdm g::rwX <WORKDIR>
    ```

    These commands change the group ownership of all files and directories in the work directory to `sharedgroupname`, ensure new files inherit the directory's group, and apply default ACL entries to allow the group read, write, and execute permissions for new files and directories. This setup facilitates shared access and consistent permissions management in the directory.
    :::

1.  Enter the absolute path of the **Launch directory** to be used on the cluster. If omitted, it will be the same as the work directory.
1.  Enter the **Login hostname**. This is usually the hostname or public IP address of the cluster's login node.
1.  Enter the **Head queue name**. This is the [default](https://www.nextflow.io/docs/latest/process.html#queue) cluster queue to which the Nextflow job will be submitted.
1. Enter the **Compute queue name**. This is the [default](https://www.nextflow.io/docs/latest/process.html#queue) cluster queue to which the Nextflow job will submit tasks.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch. 
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced#nextflow-config-file) for more information on configuration priority. 
    :::
1. Specify custom **Environment variables** for the head job and/or compute jobs.
1. Configure any advanced options needed:
    - Use the **Nextflow queue size** to limit the number of jobs that Nextflow can submit to the scheduler at the same time.
    - Use the **Head job submit options** to add platform-specific submit options for the head job. You can optionally apply these options to compute jobs as well:

    :::note
    Once set during compute environment creation, these options can't be overridden at pipeline launch time.
    :::

    :::note
    In IBM LSF compute environments, use **Unit for memory limits**, **Per job memory limits**, and **Per task reserve** to control how memory is requested for Nextflow jobs.
    :::

1. Select **Create** to finalize the creation of the compute environment.

See [Launch pipelines](../launch/launchpad) to start executing workflows in your HPC compute environment.


<!-- links -->
[agent]: ../supported_software/agent/overview

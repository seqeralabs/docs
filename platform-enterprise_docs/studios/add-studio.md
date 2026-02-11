---
title: "Add a Studio"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-10-21"
tags: [data, session, studios]
---

Select the **Studios** tab, and then select **Add Studio**. The options available are:

- [Provided container template][containers]
- [Custom container template][custom-container]
- [Import from a Git repository][github]

### Compute environment requirements

For AWS Batch compute environments:

   - **CPUs allocated**: The default allocation is 2 CPUs.
   - **GPUs allocated**: Available only if the selected compute environment has GPU support enabled. For more information about GPUs on AWS, see [Amazon ECS task definitions for GPU workloads][aws-gpu]. The default allocation is 0 GPUs.
   - **Maximum memory allocated**: The default allocation is 8192 MiB of memory.

### EFS file systems

If you configured your compute environment to include an EFS file system with **EFS file system > EFS mount path**, the mount path must be explicitly specified. The mount path cannot be the same as your compute environment work directory. If the EFS file system is mounted as your compute environment work directory, snapshots cannot be saved and sessions fail.

To mount an EFS volume in a Studio session (for example, if your organization has a custom, managed, and standardized software stack in an EFS volume), add the EFS volume to the compute environment (system ID and mount path). The volume will be available at the specified mount path in the session.

For more information on AWS Batch configuration, see [AWS Batch][aws-batch].

### SSH connection (public preview)

From Enterprise v25.3.3, direct SSH connections to running Studio sessions are available using standard SSH clients, VS Code Remote SSH, or terminal access. To use this feature:

1. Enable SSH access for your workspace by setting the `TOWER_DATA_STUDIO_SSH_ALLOWED_WORKSPACES` [environment variable](../enterprise/configuration/overview#data-features) during deployment.
2. Add your SSH public key to your Seqera Platform user profile.
3. Enable the **SSH Connection** toggle when adding a Studio.

For connection instructions and VS Code setup, see [Connect to a Studio via SSH][ssh-connect].

{/* links */}
[contact]: https://support.seqera.io/
[aws-cloud]: ../compute-envs/aws-cloud
[aws-gpu]: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html
[aws-batch]: ../compute-envs/aws-batch
[github]: ./add-studio-git-repo
[custom-container]: ./add-studio-custom-container
[conda-syntax]: ./custom-envs#conda-package-syntax
[custom-image]: ./custom-envs#custom-containers
[containers]: ./add-studio-custom-container

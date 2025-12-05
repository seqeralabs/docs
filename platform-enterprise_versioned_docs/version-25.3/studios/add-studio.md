---
title: "Add a Studio"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-10-21"
tags: [data, session, studios]
---

Select the **Studios** tab, and then select **Add Studio**. The options available are:

- [Provided container template][provided-template]
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

{/* links */}
[contact]: https://support.seqera.io/
[aws-cloud]: ../compute-envs/aws-cloud
[aws-gpu]: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html
[aws-batch]: ../compute-envs/aws-batch
[github]: ./add-studio-git-repo
[conda-syntax]: ./custom-envs#conda-package-syntax
[custom-image]: ./custom-envs#custom-containers
[custom-container]: ./add-studio-custom-container
[provided-template]: ./add-studio-provided-template


---
title: "Add a Studio"
description: "Add a Studio in Platform."
date created: "2025-09-04"
last updated: "2025-10-21"
tags: [data, session, studios]
---

Select the **Studios** tab, and then select **Add Studio**. The options available are:

- [Provided container template][containers]
- [Import from a Git repository][github]
- [Custom container template][custom-container]

### Compute environment requirements

For AWS Batch compute environments:

   - **CPUs allocated**: The default allocation is 2 CPUs.
   - **GPUs allocated**: Available only if the selected compute environment has GPU support enabled. For more information about GPUs on AWS, see [Amazon ECS task definitions for GPU workloads][aws-gpu]. The default allocation is 0 GPUs.
   - **Maximum memory allocated**: The default allocation is 8192 MiB of memory.



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


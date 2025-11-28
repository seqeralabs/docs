---
title: "Overview"
description: "Overview of Studios"
date created: "2025-02-06"
last updated: "2025-07-17"
tags: [studios, container, image, session, interactive, analysis]
---

Studios is a unified platform where you can host a combination of container images and compute environments for interactive analysis using your preferred tools, like JupyterLab, an R-IDE, Visual Studio Code IDEs, or Xpra remote desktops. Each Studio session is an individual interactive environment that encapsulates the live environment for dynamic data analysis.

:::note
Studios in Enterprise is not enabled by default. You can enable Studios in the [environment variables configuration](../enterprise/studios).
:::

- [Deploy Studios in Seqera Platform](../enterprise/studios): Enable Studios as part of your Seqera Platform Enterprise instance.
- [Add a Studios](./add-studio): Understand the configuration options for creating, running, and customizing Studio sessions.
- [Container image templates](./container-images): Learn about the container image templates provided: JupyterLab, R-IDE, Visual Studio Code, and Xpra.
- [Custom environments](./custom-envs): Augument the Seqera-provided images with a list of Conda packages or by providing your own base container template image.
- [Manage Studios](./managing): Manage your Studios and how collaborators use them.

:::note
Currently, Studios supports [AWS Cloud][aws-cloud], [Google Cloud][google-cloud], [Azure Cloud][azure-cloud] and [AWS Batch][aws-batch] compute environments that **do not** have Fargate enabled.
:::

{/* links */}
[aws-cloud]: ../compute-envs/aws-cloud
[aws-batch]: ../compute-envs/aws-batch
[azure-cloud]: ../compute-envs/azure-cloud
[google-cloud]: ../compute-envs/google-cloud
[contact]: https://support.seqera.io/
---
title: "Overview"
description: "Seqera Studios overview"
date created: "2025-02-06"
last updated: "2025-07-22"
tags: [studios, connect, xpra, ride, vscode, containers, docker]
---

Studios is a unified platform where you can host a combination of container images and compute environments for interactive analysis using your preferred tools, like JupyterLab notebooks, an [R-IDE](https://github.com/seqeralabs/r-ide), Visual Studio Code IDEs, or Xpra remote desktops. Each Studio session is an individual interactive environment that encapsulates the live environment for dynamic data analysis.

On Seqera Cloud, the free tier permits only one running Studio session at a time. To run simultaneous sessions, [contact Seqera][contact] for a Seqera Cloud Pro license.

- [Add Studios](./add-studio): Understand the configuration options for creating, running, and customizing Studio sessions.
- [Manage Studios](./managing): Manage your Studios and how collaborators use them.
- [Container images](./container-images): Learn about the container image templates provided: JupyterLab, R-IDE, Visual Studio Code, and Xpra.
- [Custom environments](./custom-envs): Augument the Seqera-provided images with a list of Conda packages or by providing your own base container template image.

:::note
Currently, Studios supports [AWS Cloud][aws-cloud], [Google Cloud][google-cloud], and [AWS Batch][aws-batch] compute environments that **do not** have Fargate enabled.
:::

{/* links */}
[aws-cloud]: ../compute-envs/aws-cloud
[aws-batch]: ../compute-envs/aws-batch
[google-cloud]: ../compute-envs/google-cloud
[contact]: https://support.seqera.io/
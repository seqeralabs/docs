---
title: "Overview"
description: "Interactive analysis environments in Seqera Platform"
date created: "2025-02-06"
last updated: "2026-06-22"
tags: [studios, connect, xpra, ride, vscode, containers, docker]
---

Studios provides interactive analysis environments that pair a container image with a compute environment and your preferred tools, such as JupyterLab notebooks, an [R-IDE](https://github.com/seqeralabs/r-ide), Visual Studio Code, or Xpra remote desktops. Each Studio session runs as an individual interactive environment for live data analysis.

On Seqera Cloud, the free tier permits only one running Studio session at a time. To run simultaneous sessions, [contact Seqera][contact] for a Seqera Cloud Pro license.

- [Container image templates](./container-images): Provided templates for JupyterLab, R-IDE, Visual Studio Code, and Xpra.
- [Custom environments](./custom-envs): Augment the Seqera-provided images with Conda packages or your own base container template image.
- [Add a Studio](./add-studio): Configuration options for creating, running, and customizing Studio sessions.
- [Manage Studios](./managing): Manage Studios and collaborator access.
- [Connect changelog](./connect): Release notes for the Seqera Connect client.

:::note
Studios supports [AWS Cloud][aws-cloud], [Azure Cloud][azure-cloud], [Google Cloud][google-cloud], and [AWS Batch][aws-batch] compute environments that **do not** have Fargate enabled.
:::

{/* links */}
[aws-cloud]: ../compute-envs/aws-cloud
[azure-cloud]: ../compute-envs/azure-cloud
[aws-batch]: ../compute-envs/aws-batch
[google-cloud]: ../compute-envs/google-cloud
[contact]: https://support.seqera.io/

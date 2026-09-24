---
title: "Overview"
description: "Interactive analysis environments in Seqera Platform"
date created: "2025-02-06"
last updated: "2025-07-17"
tags: [studios, containers, image, sessions, interactive, analysis]
---

Studios provides interactive analysis environments that pair a container image with a compute environment and your preferred tools, such as JupyterLab, an R-IDE, Visual Studio Code, or Xpra remote desktops. Each Studio session runs as an individual interactive environment for live data analysis.

:::note
Studios in Enterprise is not enabled by default. To enable it, see [Deploy Studios in Seqera Platform](../enterprise/install-studios).
:::

- [Container image templates](./container-images): Provided templates for JupyterLab, R-IDE, Visual Studio Code, and Xpra.
- [Custom environments](./custom-envs): Augment the Seqera-provided images with Conda packages or your own base container template image.
- [Add a Studio](./add-studio): Configuration options for creating, running, and customizing Studio sessions.
- [Manage Studios](./managing): Manage Studios and collaborator access.
- [Connect changelog](./connect): Release notes for the Seqera Connect client.

:::note
Studios supports [AWS Cloud][aws-cloud], [Azure Cloud][azure-cloud], [Google Cloud][google-cloud], and [AWS Batch][aws-batch] compute environments that **do not** have Fargate enabled.
:::

## Networking

The Seqera Connect client inside a Studio session opens a tunnel outward to the Connect server and registers the session over it. All session traffic, including SSH when enabled, travels over that outbound connection. **No inbound path to the session VM is required.** Users reach a Studio through the Connect proxy rather than by connecting to the VM, so you do not need inbound rules or source-IP allow-lists for dynamically launched Studio VMs.

This applies to every compute environment that supports Studios. If you run Studios inside a private network, see the networking guidance on your compute environment page for the outbound connectivity to allow: [AWS Cloud][aws-cloud-networking], [Azure Cloud][azure-cloud-networking], [Google Cloud][google-cloud-networking], or [AWS Batch][aws-batch-networking]. For the ports and directions to configure on your firewall, see [Firewall configuration](../enterprise/advanced-topics/firewall-configuration).

{/* links */}
[aws-cloud]: ../compute-envs/aws-cloud
[aws-cloud-networking]: ../compute-envs/aws-cloud#networking
[azure-cloud]: ../compute-envs/azure-cloud
[azure-cloud-networking]: ../compute-envs/azure-cloud#networking
[aws-batch]: ../compute-envs/aws-batch
[aws-batch-networking]: ../compute-envs/aws-batch#networking
[google-cloud]: ../compute-envs/google-cloud
[google-cloud-networking]: ../compute-envs/google-cloud#networking
[contact]: https://support.seqera.io/

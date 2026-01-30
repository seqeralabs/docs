---
title: "Studios: Helm"
description: Deploy Studios Enterprise on Kubernetes with Helm
date created: "2026-01-30"
tags: [helm, deployment, installation, kubernetes, studios]
---

[Helm](https://helm.sh) is an open-source command line tool used for managing Kubernetes applications. Seqera offers a [Helm chart](https://github.com/seqeralabs/helm-charts/tree/studios-1.1.3/platform/charts/studios) to deploy Studios Enterprise on a Kubernetes cluster.

Refer to the [Studios installation overview](./install-studios) for prerequisites and configuration options.

For generic instructions on how to install Seqera Helm charts, refer to the Seqera Platform Enterprise installation guide [using Helm](./platform-helm).

## Installation as part of Seqera Platform Enterprise

The Studios Helm chart has been designed as a sub-chart of the main Seqera Platform Enterprise Helm
chart, but can optionally be installed independently like the Platform chart.

To install Studios as part of your Seqera Platform Enterprise deployment, make sure the
`studios.enabled` value in your custom Platform's `values.yaml` file is set to `true`:

```yaml
studios:
  enabled: true
```

At the same time, configure the desired Studios options as described in the [Studios Helm chart documentation](https://github.com/seqeralabs/helm-charts/tree/studios-1.1.3/platform/charts/studios), in particular the Studios service domain and the subdomains that it will use for incoming connections. Also refer to the [example](https://github.com/seqeralabs/helm-charts/tree/studios-1.1.3/platform/examples/studios) provided in the Helm charts repository.

Then, follow the instructions in the Seqera Platform Enterprise installation guide [using Helm](./platform-helm) to install or upgrade your Platform deployment with Studios.

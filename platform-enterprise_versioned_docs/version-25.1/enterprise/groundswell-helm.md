---
title: "Pipeline Optimization: Helm"
description: Deploy Pipeline Optimization Enterprise on Kubernetes with Helm
date created: "2026-01-30"
tags: [helm, deployment, installation, kubernetes, pipeline-optimization]
---

[Helm](https://helm.sh) is an open-source command line tool used for managing Kubernetes applications. Seqera offers a [Helm chart](https://github.com/seqeralabs/helm-charts/tree/pipeline-optimization-0.2.4/platform/charts/pipeline-optimization) to deploy Pipeline Optimization Enterprise on a Kubernetes cluster.

## Prerequisites

Other than the basic requirements [already listed in the Pipeline Optimization installation overview](./install-groundswell#prerequisites), you will need:
- A Kubernetes cluster
- [Helm v3](https://helm.sh/docs/intro/install) and [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally

## Installation as part of Seqera Platform Enterprise

The Pipeline Optimization Helm chart has been designed as a sub-chart of the main Seqera Platform Enterprise Helm
chart, but can optionally be installed independently like the Platform chart.

To install Pipeline Optimization as part of your Seqera Platform Enterprise deployment, make sure the
`pipeline-optimization.enabled` value in your custom Platform's `values.yaml` file is set to `true`:

```yaml
pipeline-optimization:
  enabled: true
```

At the same time, configure the desired Pipeline Optimization options as described in the [Pipeline Optimization Helm chart documentation](https://github.com/seqeralabs/helm-charts/tree/pipeline-optimization-0.2.4/platform/charts/pipeline-optimization), in particular the Pipeline Optimization and Platform databases. Also refer to the [example](https://github.com/seqeralabs/helm-charts/tree/pipeline-optimization-0.2.4/platform/examples/pipeline-optimization) provided in the Helm charts repository.

Then, follow the instructions in the Seqera Platform Enterprise installation guide [using Helm](./platform-helm) to install or upgrade your Platform deployment with Pipeline Optimization.

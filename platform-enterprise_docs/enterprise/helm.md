---
title: "Helm"
description: Deploy Seqera Platform Enterprise on Kubernetes with Helm
date: "21 Nov 2025"
tags: [helm, deployment, installation, kubernetes]
---

[Helm](https://helm.sh) is an open-source command line tool used for managing Kubernetes applications.
Seqera offers a [Helm chart](https://github.com/seqeralabs/helm-charts/tree/0.16.1/platform) to deploy Seqera Platform Enterprise on a Kubernetes cluster.

## Prerequisites

This guide assumes that all prerequisites have been met. Visit the corresponding Prerequisites page for your infrastructure provider for more information.
On top of the general prerequisites, ensure you have the following:

- A Kubernetes cluster running a supported version;
- [Helm v3](https://helm.sh/docs/intro/install) and [kubectl](https://kubernetes.io/docs/tasks/tools/) installed on your local machine.

## Installing the Helm Chart

Helm bundles resource definitions into templates for repeatable deployments: inputs can be passed to the Helm chart either via a YAML file or inline to replace the default values.

The `values.yaml` file defines a chart's settings: examples include container image tags, CPU/memory limits, ingress definition to expose the service, environment variables, etc.
Each Helm chart generally comes with its own `values.yaml` file containing default settings, which can be overridden by providing a custom values file. More details about values customization can be found in the [Helm documentation](https://helm.sh/docs/topics/charts#values-files).

1. Fetch the default `values.yaml` file to customize the installation with your specific configuration:

   ```bash
   helm show values oci://public.cr.seqera.io/charts/platform --version 0.16.1 > my-values.yaml
   ```

   Now edit the `my-values.yaml` file to set your options, such as internal container image registry, database connection details, license information, and other settings.

   You can drop lines that you don't want to customize to keep the file concise and only include the settings you want to change: this will make it easier to maintain your configuration in the future. The values you don't specify will fall back to the defaults defined in the chart in the `values.yaml` file. For an example of a minimal configuration file, see the [example values file](https://github.com/seqeralabs/helm-charts/blob/0.16.1/platform/examples/kustomize/values.yaml).

   You can browse all the available configuration options in a tabular format in the [Readme](https://github.com/seqeralabs/helm-charts/tree/0.16.1/platform) file.

1. Install the chart from the public OCI registry in your desired namespace and with the values file customized in the previous step:

   ```bash
   helm install my-release oci://public.cr.seqera.io/charts/platform \
       --version 0.16.1 \
       --namespace my-namespace \
       --create-namespace \
       --values my-values.yaml
   ```

   The chart will fail to install if mandatory values are not provided.

### Installing a Helm chart with Kustomize

Kustomize can be used to manage Helm chart installations as well and provides further customization options.
To install the Seqera Platform Enterprise Helm chart using Kustomize, check out the [Kustomize example directory](https://github.com/seqeralabs/helm-charts/tree/0.16.1/platform/examples/kustomize).

## Upgrading the Helm Chart

To upgrade an existing Seqera Platform Enterprise Helm chart installation to a new version, run the following command, replacing `my-release` and `my-namespace` with your release name and namespace:

```bash
helm upgrade my-release oci://public.cr.seqera.io/charts/platform \
    --version NEW_VERSION \
    --namespace my-namespace \
    --values my-values.yaml
```

## Uninstalling the Helm Chart

To uninstall the Seqera Platform Enterprise Helm chart, run the following command, replacing `my-release` and `my-namespace` with your release name and namespace:

```bash
helm uninstall my-release -n my-namespace
```

---
title: "Custom environments"
description: "Custom environments for Data Studios"
date: "1 Oct 2024"
tags: [data, studios]
---

In addition to the Seqera-provided container template images, you can provide your own custom container environments by augmenting the Seqera-provided images with a list of Conda packages or by providing your own base container template image.

Data Studios uses the [Wave][wave-home] service to build custom container template images.

## Conda packages

### Prerequisites

- Wave must be configured. For more information, see [Wave containers][wave].
 
 :::note
 To augment Seqera-provided images, Enterprise deployments must either allow access to the public Wave server, or self-host their own Wave server.
 :::

### Conda package syntax {#conda-package-syntax}

When adding a new data studio session, you can customize its configuration to install a list of Conda packages to the template image. The supported schema is identical to that used by the Conda `environment.yml` file. For more information on the Conda environment file, see [Creating an environment file manually][env-manually].

```yaml title="Example environment.yml file"
channels:
  - conda-forge
dependencies:
  - numpy
  - pip:
    - matplotlib
    - seaborn
```

To create a data studio with custom Conda packages, see [Add a data studio][add-ds].

## Custom container template image {#custom-containers}

For advanced use cases, you can build your own container template image.

:::note
Public container registries are supported by default. Amazon Elastic Container Registry (ECR) is the only supported private container registry.
:::

### Prerequisites

- Access to a container image repository, either a public container registry or a private Amazon ECR repository
- A container template image

### Dockerfile configuration {#dockerfile}

For your custom template container image, you must use a Seqera-provided base image and include several additional build steps for compatibility with Data Studios.

To create a data studio with a custom template image, see [Add a data studio][add-ds].

#### Ports

The container must use the value of the `CONNECT_TOOL_PORT` environment variable as the listening port for any interactive software you include in your custom container.

#### Signals

Upon termination, the container's main process must handle the `SIGTERM` signal and perform any necessary cleanup. After a 30-second grace period, the container receives the `SIGKILL` signal.

#### Minimal Dockerfile

The minimal Dockerfile includes directives to accomplish the following:

- Pull a Seqera-provided base image with prerequisite binaries
- Copy the `connect` binary into the build
- Set the container entry point

Customize the following Dockerfile to include any additional software that you require:

```docker title="Minimal Dockerfile"
# Seqera base image
FROM public.cr.seqera.io/platform/connect-client:0.7 AS connect

# 1. Add connect binary
COPY --from=connect /usr/bin/connect-client /usr/bin/connect-client

# 2. Install connect dependencies
RUN /usr/bin/connect-client --install

# 3. Configure connect as the entrypoint
ENTRYPOINT ["/usr/bin/connect-client", "--entrypoint"]
```

For example, to run a basic Python-based HTTP server, build a container from the following Dockerfile. When a data studio runs the custom template environment, the value for the `CONNECT_TOOL_PORT` environment variable is provided dynamically.

```docker title="Example Dockerfile with Python HTTP server"
FROM public.cr.seqera.io/platform/connect-client:0.7 AS connect

FROM ubuntu:20.04
RUN apt-get update --yes && apt-get install --yes --no-install-recommends python3

COPY --from=connect /usr/bin/connect-client /usr/bin/connect-client
RUN /usr/bin/connect-client --install
ENTRYPOINT ["/usr/bin/connect-client", "--entrypoint"]

CMD ["/usr/bin/bash", "-c", "python3 -m http.server $CONNECT_TOOL_PORT"]
```

### Inspect container augmentation build status {#build-status}

You can inspect the progress of a custom container template image build, including any errors if the build fails. A link to the [Wave service][wave-home] container build report is always available for builds.

If the custom container template image build fails, the data studio session has the **build-failed** status. The details about build failures are available when inspecting the session details in the **Error report** tab.

To inspect the status of an ongoing build, or a successful or failed build, complete the following steps:

1. Select the **Data Studios** tab in Seqera Platform.
1. From the list of data studio sessions, select the name of the session with **building** or **build-failed** status that you want to inspect, and then select **View**.
1. In the **Details** tab, scroll to **Build reports** and select **Summary** to open the Wave service container build report for your build.
1. Optional: If the build failed, select the **Error report** tab to view the errors associated with the build failure.

[add-ds]: ./managing.mdx#add-a-data-studio
[wave]: ../enterprise/configuration/wave.mdx
[wave-home]: https://seqera.io/wave/
[env-manually]: https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-file-manually

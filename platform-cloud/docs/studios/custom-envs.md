---
title: "Custom environments"
description: "Custom environments for Studios"
date created: "2024-10-01"
last updated: "2026-06-22"
tags: [environments, custom, studios]
---

In addition to the Seqera-provided container images, you can build custom container environments by augmenting the Seqera-provided images with Conda packages or by supplying your own base container image. Studios uses the [Wave][wave-home] service to build custom container images.

For ready-to-use examples, see [Example custom Studios][example-studios].

## Conda packages

Augment a Seqera-provided image with Conda packages to add the tools you need to a Studio session.

:::info[**Prerequisites**]

You need the following:

- Wave configured. See [Wave containers][wave].
- A target repository set per workspace by the workspace Admin, in **Settings** > **Studios** > **Container repository**.
- Workspace credentials with push access to the target repository.

:::

### Conda package syntax {#conda-package-syntax}

When adding a new Studio, you can install Conda packages in the container image. The supported schema is identical to the Conda `environment.yml` file. For more information, see [Creating an environment file manually][env-manually].

```yaml title="Example environment.yml"
channels:
  - conda-forge
dependencies:
  - numpy
  - pip:
    - matplotlib
    - seaborn
```

To create a Studio with custom Conda packages, see [Add a Studio][add-s].

## Custom container image {#custom-containers}

For advanced use cases, you can build your own container image.

Public container registries are supported by default. Amazon Elastic Container Registry (ECR) is the only supported private container registry.

:::info[**Prerequisites**]

You need the following:

- A container image.
- Access to a container image repository, either a public container registry or a private Amazon ECR repository.

:::

### Dockerfile configuration {#dockerfile}

For your custom container image, you must use a Seqera-provided base image and include several additional build steps for compatibility with Studios. To create a Studio with a custom image, see [Add a Studio][add-s]. Custom images must include an `io.seqera.connect.version` label specifying the `connect-client` version used. Seqera Platform uses this label to determine available functionality when configuring and launching the Studio.

:::note
Studios starts without this label, but certain features (such as SSH connectivity) are unavailable.
:::

#### Ports

The container must use the value of the `CONNECT_TOOL_PORT` environment variable as the listening port for any interactive software you include in your custom container.

#### Signals

Upon termination, the container's main process must handle the `SIGTERM` signal and perform any necessary cleanup. After a 30-second grace period, the container receives the `SIGKILL` signal.

#### Minimal Dockerfile

The minimal Dockerfile includes directives to:

- Pull a Seqera-provided base image with prerequisite binaries.
- Set an image label indicating the version used.
- Copy the `connect` binary into the build.
- Set the container entry point.

Customize the following Dockerfile to include any additional software you require:

```docker title="Minimal Dockerfile"
# Add a default Connect client version. Can be overridden by build arg
ARG CONNECT_CLIENT_VERSION="0.12"

# Seqera base image
# highlight-next-line
FROM public.cr.seqera.io/platform/connect-client:${CONNECT_CLIENT_VERSION} AS connect

# highlight-start
# 1. Add connect version label to image metadata
ARG CONNECT_CLIENT_VERSION
LABEL io.seqera.connect.version="${CONNECT_CLIENT_VERSION}"

# 2. Add connect binary
COPY --from=connect /usr/bin/connect-client /usr/bin/connect-client

# 3. Install connect dependencies
RUN /usr/bin/connect-client --install

# 4. Configure connect as the entrypoint
ENTRYPOINT ["/usr/bin/connect-client", "--entrypoint"]
# highlight-end
```

For example, to run a Python-based HTTP server, build a container from the following Dockerfile. When a Studio runs the custom template environment, the value for the `CONNECT_TOOL_PORT` environment variable is provided dynamically.

```docker title="Example Dockerfile with Python HTTP server"
# Add a default Connect client version. Can be overridden by build arg
ARG CONNECT_CLIENT_VERSION="0.12"

# Seqera base image
# highlight-next-line
FROM public.cr.seqera.io/platform/connect-client:${CONNECT_CLIENT_VERSION} AS connect

FROM ubuntu:20.04
RUN apt-get update --yes && apt-get install --yes --no-install-recommends python3

# highlight-start
ARG CONNECT_CLIENT_VERSION
LABEL io.seqera.connect.version="${CONNECT_CLIENT_VERSION}"
COPY --from=connect /usr/bin/connect-client /usr/bin/connect-client
RUN /usr/bin/connect-client --install
ENTRYPOINT ["/usr/bin/connect-client", "--entrypoint"]
# highlight-end

# highlight-next-line
CMD ["/usr/bin/bash", "-c", "python3 -m http.server $CONNECT_TOOL_PORT"]
```
### Custom container image examples

For example custom Studio environment container images, see the [custom Studios examples repository][custom-studios-examples].

### Inspect container augmentation build status {#build-status}

You can inspect the progress of a custom container image build, including any errors if the build fails. A link to the [Wave service][wave-home] container build report is available for every build. If the build fails, the Studio session has the **build-failed** status, and the build error details are available in the session's **Error report** tab.

To inspect the status of a build, complete the following:

1. Select the **Studios** tab in Seqera Platform.
1. From the list of sessions, select the name of the session with `building` or `build-failed` status, then select **View**.
1. In the **Details** tab, scroll to **Build reports** and select **Summary** to open the Wave service container build report for your build.
1. Optional: If the build failed, select the **Error report** tab to view the build errors.



{/* links */}
[add-s]: ./add-studio
[aws-batch]: ../compute-envs/aws-batch
[wave]: https://docs.seqera.io/platform-enterprise/enterprise/configuration/wave
[custom-studios-examples]: https://github.com/seqeralabs/custom-studios-examples
[wave-home]: https://seqera.io/wave/
[env-manually]: https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-file-manually
[example-studios]: ./example-studios

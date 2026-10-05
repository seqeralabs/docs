---
title: "Custom environments"
description: "Custom environments for Studios"
date created: "2024-10-01"
last updated: "2026-09-30"
tags: [environments, custom, studios]
---

In addition to the Seqera-provided container images, you can build custom container environments by augmenting the Seqera-provided images with Conda packages or by supplying your own base container image. Studios uses the [Wave][wave-home] service to build custom container images.

For ready-to-use examples, see [Example custom Studios][example-studios].

## Conda packages

Augment a Seqera-provided image with Conda packages to add the tools you need to a Studio session. From version 26.2, you can also [augment a custom container image](#custom-image-conda).

:::info[**Prerequisites**]

You need the following:

- Wave configured. See [Wave containers][wave].
- A target container repository, set in one of these ways:
  - For the whole Seqera Platform instance, with the `TOWER_DATA_STUDIO_WAVE_CUSTOM_IMAGE_REGISTRY` and, optionally, `TOWER_DATA_STUDIO_WAVE_CUSTOM_IMAGE_REPOSITORY` [environment variables][studio-env-vars].
  - Per workspace, by the workspace Admin, in **Settings** > **Studios** > **Container repository**. The workspace setting takes precedence over the environment variables.
- Workspace credentials with push access to the target container repository.

:::

The workspace Admin can also set how built images are named, in **Settings** > **Studios** > **Container image naming strategy**: **Tag prefix**, **Image suffix**, or **None**. **Platform default** uses the `TOWER_DATA_STUDIO_WAVE_CUSTOM_IMAGE_NAME_STRATEGY` environment variable, which defaults to `tagPrefix`.

### Conda package syntax {#conda-package-syntax}

When adding a new Studio, you can install Conda packages in the container image. The supported schema is identical to the Conda `environment.yml` file. For more information, see [Creating an environment file manually][env-manually].

```yaml title="Example environment.yml file"
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

:::note
Public container registries are supported by default. Amazon Elastic Container Registry (ECR) is the only supported private container registry.
:::

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
ARG CONNECT_CLIENT_VERSION="0.14"

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
ARG CONNECT_CLIENT_VERSION="0.14"

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

### Conda augmentation of custom images {#custom-image-conda}

From version 26.2, you can augment a custom container image with Conda packages, in the same way as a Seqera-provided image template. Your image doesn't need its own Conda installation: Wave builds the Conda environment in a separate stage and copies it into your image.

:::warning
Conda augmentation hasn't been validated across custom images. Before you share an augmented custom image, start a test Studio from it and check that both your own tools and the added Conda packages work.
:::

The prerequisites for [Conda packages](#conda-packages) also apply: Wave must be configured, a target container repository must be set for the Seqera Platform instance or the workspace, and the workspace credentials must have push access to it.

#### How the augmented image is built

Studios builds the augmented image with Wave, using the `conda/micromamba:v2` multi-stage build template:

1. Wave resolves the packages in your environment file into a Conda environment in a build stage based on `mambaorg/micromamba`.
1. Wave then uses your custom image as the base of the final stage, copies the resolved environment into it at `MAMBA_ROOT_PREFIX` (`/opt/conda`), and prepends `/opt/conda/bin` to `PATH`.

Wave doesn't add micromamba to the final image, only the resolved environment.

The build pushes a new image to the workspace container repository or, if none is set, to the repository set by `TOWER_DATA_STUDIO_WAVE_CUSTOM_IMAGE_REGISTRY`. The image is named according to the container image naming strategy. Your source image in its own registry is not modified.

#### Image compatibility

:::caution

- The resolved environment is copied to `/opt/conda`. If your image already has content at that path, the copied environment is written over it.
- If your image installs its analysis tooling outside `/opt/conda`, through `apt` or a system Python for example, the augmented packages are installed against the Conda environment's own interpreter.
- Binaries in `/opt/conda/bin` take precedence on `PATH`, which can shadow the equivalents in your image.

:::

:::note
Studios builds the environment with [micromamba][micromamba-guide], currently the only supported package manager for augmenting custom images.
:::

When you add the Studio, Seqera Platform rejects the request with a 400 error, before any Wave build starts, if:

- The Conda environment isn't valid.
- The destination container repository is invalid, or uses a registry blocked by `TOWER_DATA_STUDIO_WAVE_DISALLOWED_REGISTRIES`.

If an augmented build fails, the Studio session has the **build-failed** status. See [Inspect container augmentation build status](#build-status) for the build report and error details.

### Custom container image examples

For example custom Studio environment container images, see the [custom Studios examples repository][custom-studios-examples].

### Inspect container augmentation build status {#build-status}

You can inspect the progress of a custom container image build, including any errors if the build fails. A link to the [Wave service][wave-home] container build report is available for every build. If the build fails, the Studio session has the **build-failed** status, and the build error details are available in the session's **Error report** tab.

To inspect the status of a build, complete the following steps:

1. Select the **Studios** tab in Seqera Platform.
1. From the list of sessions, select the name of the session with `building` or `build-failed` status, then select **View**.
1. In the **Details** tab, scroll to **Build reports** and select **Summary** to open the Wave service container build report for your build.
1. Optional: If the build failed, select the **Error report** tab to view the build errors.



{/* links */}
[add-s]: ./add-studio
[aws-batch]: ../compute-envs/aws-batch
[wave]: https://docs.seqera.io/platform-enterprise/enterprise/configuration/wave
[studio-env-vars]: ../enterprise/configuration/overview#data-features
[custom-studios-examples]: https://github.com/seqeralabs/custom-studios-examples
[wave-home]: https://seqera.io/wave/
[env-manually]: https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-file-manually
[micromamba-guide]: https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html
[example-studios]: ./example-studios

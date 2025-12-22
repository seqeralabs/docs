---
title: "Common prerequisites"
description: Prerequisites common to all Enterprise deployments
date: "5 Dec 2025"
tags: [prerequisites, configuration, deployment, enterprise]
---

Before installing Seqera Enterprise, ensure that the following prerequisites are met, as well as any additional prerequisites specified for your chosen infrastructure provider, such as [AWS](./aws), [GCP](./gcp), [Azure](./azure) or [on-premises installations](./on-prem).

## Vendoring Seqera container images to your own registry

Seqera Enterprise is distributed as a collection of container images available through the Seqera container registry [`cr.seqera.io`](https://cr.seqera.io). Contact [support](https://support.seqera.io) to get your container access credentials.

Vendoring images to your own container registry ensures that your deployments are not impacted by the potential unavailability of the Seqera container registry due to network issues, or to deploy Seqera in air-gapped environments. We recommend vendoring images to your own container registry, such as Amazon Elastic Container Registry (ECR), Google Container Registry (GCR), Docker Hub, among others.

Three options are available to vendor images:
1. Automated replication using Container Registry native functionality (**recommended**): Use your container registry's native replication features to automatically replicate images from the Seqera container registry to your own registry. This option is only available if your container registry supports replication from external registries.
1. Automated replication using Skopeo: Use a tool like [Skopeo](https://github.com/containers/skopeo) to automate the process of copying container images between registries.
1. Manual replication: Pull images from the Seqera container registry, re-tag them, and push them to your preferred container registry. This process is described in detail below.

### Automated replication using Container Registries

Several container registries offer native replication features that can be used to automatically replicate images from external registries like the Seqera container registry `cr.seqera.io` to your own registry. This is the recommended approach as it simplifies the management of image replication and ensures that your registry stays up-to-date with the latest Seqera images.

As a reference, here are links to the documentation for setting up replication in some popular container registries:
- [Amazon Elastic Container Registry (ECR) Replication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/replication.html)
- [Azure Container Registry (ACR) Artifact caching](https://learn.microsoft.com/en-us/azure/container-registry/artifact-cache-overview)
- [Harbor Replication](https://goharbor.io/docs/latest/administration/configuring-replication/)

### Automated replication with Skopeo

[Skopeo](https://github.com/containers/skopeo) is a command-line utility that performs various operations on container images and image repositories. It can sync external image repositories like the Seqera container registry `cr.seqera.io` to an internal registry. Refer to the Skopeo documentation for installation instructions.
If possible, always replicate images using your internal container registry native functionality as described in the previous section. Use Skopeo only if your container registry does not support replication from external registries. Note that Skopeo does not continuously monitor for new images, so you will need to set up a periodic job (for example, using a CI/CD pipeline) to keep your internal registry up-to-date with the latest Seqera images.
We recommend installing the latest version of Skopeo (or at least v1.15+ to work with the `images-by-semver` option in the `sync` command).

1. Configure `skopeo` with the credentials to access the Seqera container registry, and your internal registry if needed.

   ```console
   skopeo login --username 'robot$private+YOUR_ROBOT_USERNAME' -p 'YOUR_PASSWORD' cr.seqera.io
   ```

   Make sure to use single quotes around the username of the Seqera container registry robot account since it contains a dollar sign (`$`).

1. Listing the available tags for a given image can be done with the `list-tags` command:

   ```console
   skopeo list-tags docker://cr.seqera.io/private/nf-tower-enterprise
   ```

1. Syncing images can be done with the `sync` command. For example, to sync all images stored in the `cr.seqera.io/private/nf-tower-enterprise/data-studio/connect-server` repository to your internal registry, run:

   ```console
   skopeo sync --scoped --src docker --dest docker cr.seqera.io/private/nf-tower-enterprise/data-studio/connect-server YOUR_INTERNAL_REGISTRY
   ```

   Note that `--scoped` will populate your internal registry with images like `YOUR_INTERNAL_REGISTRY/cr.seqera.io/private/nf-tower-enterprise/data-studio/connect-server`.
   More advanced usage examples are available in the Skopeo documentation: https://github.com/containers/skopeo/blob/main/docs/skopeo-sync.1.md#examples

To avoid duplicating several years of Seqera images, we recommend using the `images-by-semver` option in the `sync` command. This option allows you to specify semantic versioning constraints for each image to be synced. For example, to sync all images with tags greater than or equal to a certain version, create a YAML file (for example, `seqera-container-registry.yaml`) with content similar to the following (adapt it to the versions you want to sync and the images you need):

```yaml
cr.seqera.io:
    images-by-semver:
        private/nf-tower-enterprise/backend: ">= v25.3.0"
        private/nf-tower-enterprise/frontend: ">= v25.3.0"
        private/nf-tower-enterprise/migrate-db: ">= v25.3.0"
        private/nf-tower-enterprise/data-studio/connect-server: ">= 0.8.0"
        private/nf-tower-enterprise/data-studio/connect-proxy: ">= 0.8.0"
        private/nf-tower-enterprise/wave: ">= v1.23.0"
        private/nf-tower-enterprise/groundswell: ">= 0.4.0"
```

Note that some image tags are prefixed with `v` while others are not.
Then run the following command to sync all specified images to your internal registry:

```console
skopeo sync --scoped --src yaml --dest docker seqera-container-registry.yaml YOUR_INTERNAL_REGISTRY
```

The above command can be automated with a scheduled job or a CI/CD pipeline to periodically update your internal registry with the latest Seqera images.

An alternative to using Skopeo is to use [`gcrane`](https://docs.cloud.google.com/artifact-registry/docs/docker/copy-images), a tool from Google that can copy container images between registries. However, GCrane only supports copying one image at a time, so it may require more scripting to automate the replication of multiple images.

### Manual replication

The general process to manually replicate images involves:

1. Login to the Seqera container registry, and your internal registry if needed (instructions for [AWS ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html), [GCP GCR](https://docs.cloud.google.com/artifact-registry/docs/docker/authentication), [Azure ACR](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-authentication?tabs=azure-cli)).

   ```console
   docker login cr.seqera.io -u 'robot$private+YOUR_ROBOT_USERNAME' -p 'YOUR_PASSWORD'
   ```

   Make sure to use single quotes around the username of the Seqera container registry robot account since it contains a dollar sign (`$`).

1. Downloading the image from the Seqera container registry.

   ```console
   docker pull cr.seqera.io/private/nf-tower-enterprise/backend:v25.3.1
   ```

1. Re-tagging the image.

   ```console
   docker tag cr.seqera.io/private/nf-tower-enterprise/backend:v25.3.1 YOUR_INTERNAL_REGISTRY/your-repo/backend:v25.3.1
   ```

1. Pushing the image to your preferred container registry (for example, ECR, GCR, Docker Hub).

   ```console
   docker push YOUR_INTERNAL_REGISTRY/your-repo/backend:v25.3.1
   ```

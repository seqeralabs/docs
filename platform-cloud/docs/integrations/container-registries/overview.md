---
title: "Container registry credentials"
description: "Configure container registry credentials for the Wave container service in Seqera Platform."
date created: "2025-10-21"
last updated: "2025-10-21"
tags: [credentials, container-registry, wave, docker, authentication]
---

Seqera Platform supports the configuration of credentials for the Wave container service to authenticate to private and public container registries. For more information about Wave, see [Wave containers](https://docs.seqera.io/wave).

:::note
Container registry credentials are only used by Wave containers. Enable Wave when you create a [compute environment](/platform-cloud/compute-envs/overview) in Seqera, or add `wave { enabled=true }` to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

## Supported container registries

Seqera supports credential configuration for the following container registries. Select a registry below for detailed instructions on how to create and configure credentials for that provider:

- [AWS ECR credentials](./aws.md)
- [Azure container registry credentials](./azure.md)
- [Docker Hub credentials](./docker-hub.md)
- [Gitea container registry credentials](./gitea.md)
- [GitHub container registry credentials](./github.md)
- [GitLab container registry credentials](./gitlab.md)
- [Google registry credentials](./google.md)
- [Quay container registry credentials](./quay.md)

## Next steps

- Learn more about [Wave containers](https://docs.seqera.io/wave/provisioning).
- Configure [compute environment credentials](/platform-cloud/compute-envs/overview) for your pipeline infrastructure.
- Set up [data repository credentials](/platform-cloud/integrations/data-sources/overview) to access cloud storage.

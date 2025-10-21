---
title: "Container registry credentials"
description: "Configure container registry credentials for the Wave container service in Seqera Platform."
date: "2025-10-21"
last updated: "2025-10-21"
tags: [credentials, container-registry, wave, docker, authentication]
---

From version 22.3, Seqera Platform supports the configuration of credentials for the Nextflow Wave container service to authenticate to private and public container registries. For more information about Wave container service, see [Wave containers](https://docs.seqera.io/wave).

:::note
Container registry credentials are only used by the Wave container service. Add `wave { enabled=true }` to the **Nextflow config** field on the launch page, or to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

## Supported container registries

Seqera Platform supports credential configuration for the following container registries. Select a registry below for detailed instructions on how to create and configure credentials for that provider:

- [AWS ECR credentials](./aws_registry_credentials.md)
- [Azure container registry credentials](./azure_registry_credentials.md)
- [Docker Hub credentials](./docker_hub_registry_credentials.md)
- [Gitea container registry credentials](./gitea_registry_credentials.md)
- [GitHub container registry credentials](./github_registry_credentials.md)
- [GitLab container registry credentials](./gitlab_registry_credentials.md)
- [Google registry credentials](./google_registry_credentials.md)
- [Quay container registry credentials](./quay_registry_credentials.md)

## Next steps

- Learn more about [Wave containers](https://docs.seqera.io/wave/provisioning).
- Configure [compute environment credentials](../compute-envs/overview.md) for your pipeline infrastructure.
- Set up [data repository credentials](./data_repositories.md) to access cloud storage.

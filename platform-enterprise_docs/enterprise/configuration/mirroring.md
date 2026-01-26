---
title: "Mirroring container images"
description: Mirror Seqera container images to your own registry
date: "12 Apr 2023"
tags: [containers, registry, configuration]
---

Mirroring Seqera container images to your own registry is recommended for production deployments. This ensures your deployments are not impacted by external registry availability and supports air-gapped environments.

## Registry-native replication

Use your container registry's built-in replication features to automatically sync images from `cr.seqera.io`:

- [Amazon ECR replication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/replication.html)
- [Azure ACR artifact caching](https://learn.microsoft.com/en-us/azure/container-registry/artifact-cache-overview)
- [Harbor replication](https://goharbor.io/docs/latest/administration/configuring-replication/)

## Skopeo

Use [Skopeo](https://github.com/containers/skopeo) (v1.15+) when your registry doesn't support native replication.

Authenticate with the Seqera registry:

```bash
skopeo login --username 'robot$private+YOUR_ROBOT_USERNAME' -p 'YOUR_PASSWORD' cr.seqera.io
```

Create a YAML file (`seqera-images.yaml`) to specify which images to sync:

```yaml
cr.seqera.io:
    images-by-semver:
        private/nf-tower-enterprise/backend: ">= v25.3.1"
        private/nf-tower-enterprise/frontend: ">= v25.2.0"
        private/nf-tower-enterprise/migrate-db: ">= v25.3.1"
```

Run the sync:

```bash
skopeo sync --scoped --src yaml --dest docker seqera-images.yaml YOUR_REGISTRY
```

Schedule periodic sync jobs to keep images current. See the [Skopeo sync documentation](https://github.com/containers/skopeo/blob/main/docs/skopeo-sync.1.md) for advanced usage.

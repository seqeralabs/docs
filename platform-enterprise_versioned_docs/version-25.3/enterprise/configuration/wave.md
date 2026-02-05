---
title: "Wave containers"
description: "Configuring the Wave container service"
date: "12 Apr 2023"
tags: [wave, containers, configuration]
---

Wave is Seqera's container provisioning service that enables on-demand container image management for Nextflow pipelines. Wave can provision containers dynamically during pipeline execution, removing the need to manually build and upload images to a container registry.

## Deployment options

Wave can be integrated with Seqera Platform in two ways:

- **Seqera Wave service**: Use the hosted Wave service at `https://wave.seqera.io` (default for Seqera Cloud)
- **Self-hosted Wave**: Deploy Wave in your own infrastructure for full control over container builds and caching

## Requirements

### Network connectivity

| Source | Destination | Purpose |
| :----- | :---------- | :------ |
| Seqera Platform | Wave server | API communication |
| Container registry | Wave server | Allow ingress for container operations |
| Compute environments | Wave server | Container image access during pipeline execution |

### Container registry credentials

Container registry credentials must be configured in the Seqera UI to authenticate with your private or public registries. See [container registry credentials](../../credentials/overview) for provider-specific instructions.

## Configuration

### Connect to Wave service

Configure Seqera Platform to use the Seqera-hosted Wave service or your self-hosted Wave deployment:

| Variable | Description |
| :------- | :---------- |
| `TOWER_ENABLE_WAVE` | Set to `true` to enable Wave integration |
| `WAVE_SERVER_URL` | Wave server endpoint (default: `https://wave.seqera.io`) |

### Verify connectivity

Test connectivity to your Wave server:

```bash
curl https://wave.seqera.io/service-info
```

Replace `wave.seqera.io` with your self-hosted Wave endpoint if applicable.

## Features enabled by Wave

After Wave is enabled, the following features become available:

- **Private container registries**: Access containers from private repositories using credentials stored in Seqera
- **Fusion file system**: High-performance cloud-native file system for pipeline execution
- **Container augmentation**: Dynamically extend existing containers with additional layers
- **Conda-based containers**: Provision containers from Conda or Bioconda packages on demand
- **Singularity support**: Build and provision Singularity/Apptainer format containers
- **Security scanning**: Automatic vulnerability scanning of built container images

Wave features are available on the compute environment creation page after integration is configured.

## Limitations

- Wave does not support container repositories with private CA SSL certificates

## Self-hosted Wave deployment

For enterprises requiring full control over container builds, caching, and security scanning, Wave can be deployed in your own infrastructure.

Self-hosted Wave supports:
- **Wave Lite**: Container augmentation and inspection capabilities (AWS, Azure, GCP)
- **Full Wave**: Complete build capabilities including Conda-based containers and security scanning (requires AWS EKS with EFS storage)

See the [Wave documentation](https://docs.seqera.io/wave) for installation and configuration guidance.

## Additional resources

- [Wave documentation](https://docs.seqera.io/wave)
- [Nextflow Wave integration](https://www.nextflow.io/docs/latest/wave.html)
- [Seqera Containers](https://seqera.io/containers/) - Free community container registry

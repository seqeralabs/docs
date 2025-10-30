---
title: "Studio Configuration"
description: "Configure Studio sessions with self-hosted Wave for custom container builds."
date: "6 February 2025"
tags: [data, session, studios]
---

By default, Seqera Platform Enterprise uses the Seqera-hosted Wave service for simplicity and ease of adoption. This guide covers two main configuration scenarios for Studio sessions.

For complete Seqera Platform Enterprise configuration options, see the [Configuration](../enterprise/configuration/overview.mdx) documentation.

## Self-hosted Wave

To use your own Wave instance for data studio management, you must configure both the Wave instance and the custom image registry settings to point to your infrastructure.

### Container Registry Configuration

Enterprise customers using custom container builds must configure a registry to push images to. This can be configured using either:

- Environment variable: `TOWER_DATA_STUDIO_WAVE_CUSTOM_IMAGE_REGISTRY`
- Configuration file: `tower.config.yml`

### Configuration File Example

```yaml
tower:
  data-studio:
    wave:
      custom-image-registry: 'registry.example.com'
```

#### Registry Structure

By default, registries are created using the following convention:

```
$REGISTRY_NAME/data-studio/$TOOL_NAME
```

#### Required Repositories

For self-hosted Wave, ensure the following repositories exist in your registry. For registries that cannot create repositories on-demand (such as ECR), please pre-create these repositories:

- `data-studio/jupyter`
- `data-studio/rstudio`
- `data-studio/vscode`
- `data-studio/xpra`
- `data-studio/custom`

**Note**: Some cloud providers (like AWS) may not support dynamic registry creation, requiring manual pre-creation of these repositories.

## Self-hosting Images

Enterprise customers can configure the list of images shown to end users along with their locations. This allows you to build and manage internal base images with additional resources for your organization's needs.

For information about available Seqera-provided images and their versions, see [Available Studio environment images](../enterprise/studios.md#available-studio-environment-images).

### Configuration Example



```yaml
tower:
  data-studio:
    connect:
      url: https://connect.example.com
    templates:
      jupyter:
        repository: "registry.example.com/data-studio/jupyter:<TAG>"
        icon: "jupyter"
        tool: "jupyter"
      rstudio:
        repository: "registry.example.com/data-studio/rstudio:<TAG>"
        icon: "rstudio"
        tool: "rstudio"
      vscode:
        repository: "registry.example.com/data-studio/vscode:<TAG>"
        icon: "vscode"
        tool: "vscode"
      xpra:
        repository: "registry.example.com/data-studio/xpra:<TAG>"
        icon: "xpra"
        tool: "xpra"
    wave:
      custom-image-registry: 'registry.example.com'
```

### Available Tools

The following tools are available for Studio sessions:

- **jupyter**: Jupyter notebook environment
- **rstudio**: RStudio IDE environment
- **vscode**: Visual Studio Code environment
- **xpra**: X11 remote desktop environment
- **custom**: Custom tool configurations

## Workspace Availability

You can configure which organizational workspaces have access to Studios. This configuration is set in the `tower.yml` file. The `tower.data-studio.allowed-workspaces` field supports the following options:

- `allowed-workspaces: []`: Disables Studios. This is the default if the `allowed-workspaces` field is not specified.
- `allowed-workspaces: [ <WORKSPACE_ID>,<WORKSPACE_ID> ]`: Enables Studios for the comma-separated list of organizational workspace IDs.
- `allowed-workspaces: null`: Enables Studios for all organizational workspaces.

---
title: "Studios"
description: Install Studios for Seqera Platform Enterprise
date: "12 Apr 2023"
tags: [studios, installation, deployment]
---

Studios provides interactive analysis environments within Seqera Platform. Deploy Studios after your Platform installation is complete.

## Deployment options

| Method | Guide |
| :----- | :---- |
| Helm | [Studios: Helm](./studios-helm) |
| Kubernetes | [Studios: Kubernetes](./studios-kubernetes) |
| Docker Compose | [Studios: Docker Compose](./studios-docker-compose) |

See each deployment guide for detailed requirements.

## Prerequisites

Before you begin, you need:
- A running Seqera Platform Enterprise deployment at hostname `example.com` or `platform.example.com`
- A Redis 7 instance separate from the one used by Seqera Platform
- TLS certificates for the Studios subdomains `*.connect.example.com`
  * A single certificate covering both Platform and Studios subdomains can be used; if preferring to use separate certificates, you may need to configure a separate ingress when working with plain Kubernetes manifests (the Studios Helm chart already uses separate ingresses)
  * The studios subdomain must share the same "root domain" with the Platform installation, for example with platform installed at `example.com` or `platform.example.com`, Studios can be installed at:
    - `connect.example.com` or using another name such as `studios.example.com`
    - `connect.platform.example.com`
    - `connect.another.subdomain.example.com`
- A wildcard DNS record covering the Studios subdomains, e.g., `*.connect.example.com`
- Data Explorer enabled in your Seqera Platform instance (automatic with Helm deployments)

## DNS Configuration

Each Studio is reachable at a unique URL that includes a randomly generated subdomain name. For example: `https://abcd.connect.example.com/`, where `connect.example.com` is the Studios service domain.

Provide a wildcard TLS certificate to allow for uniquely generated subdomains. A wildcard certificate common name includes `*.` in the domain name, such as `*.connect.example.com`, thereby securing any subdomain name at this level.

Studios uses the following set of domains and subdomains:

- The Platform domain that you set for `TOWER_SERVER_URL`, such as `example.com`.
- A wildcard subdomain that you must configure specifically for Studios. This wildcard subdomain is the parent for each unique session URL, such as `abcd.connect.example.com`.
- The connection proxy, defined by `CONNECT_PROXY_URL`. This URL is a first-level subdomain of your `TOWER_SERVER_URL`. For example, `https://connect.example.com`.

## Studios workspace availability

You can configure which organizational workspaces have access to Studios. This configuration is set in the `tower.yml` file. The `tower.data-studio.allowed-workspaces` field supports the following options:

- `allowed-workspaces: []`: Disables Studios. This is the default if the `allowed-workspaces` field is not specified.
- `allowed-workspaces: [ <WORKSPACE_ID>,<WORKSPACE_ID> ]`: Enables Studios for the comma-separated list of organizational workspace IDs.
- `allowed-workspaces: null`: Enables Studios for all organizational workspaces.

In the Platform Helm chart, set the desired configuration in the `platform.YAMLConfigFileContent` field. For example, to enable Studios for workspaces 12345 and 67890:

```yaml
platform:
  YAMLConfigFileContent: |-
    tower:
      data-studio:
        allowed-workspaces: [12345,67890]
```

## Available Studios environment images

Each of the provided environments includes a particular version of the underlying software package and the version of Seqera Connect, an integrated web- and file-server.

To quickly identify which version of the software an image includes, the version string for each container is in the form of `<software_version>-<seqera_connect_version>`. For example, if the version string for the R-IDE is `2025.04.1-0.9`, version `2025.04.01` is the R-IDE version and `0.9` is the Connect version of this Seqera-built container image. Learn more about Studios [environment versioning](../studios/overview#container-image-templates).

- To see the list of all JupyterLab image templates available, including security scan results or to inspect the container specification (including container specifications, configuration, and manifest), see [public.cr.seqera.io/repo/platform/data-studio-jupyter][ds-jupyter].
- To see the list of all R-IDE image templates available, including security scan results or to inspect the container specification (including container specifications, configuration, and manifest), see [https://public.cr.seqera.io/repo/platform/data-studio-ride][ds-ride].
- To see the list of all Visual Studio Code image templates available, including security scan results or to inspect the container specification (including container specifications, configuration, and manifest), see [public.cr.seqera.io/platform/data-studio-vscode][ds-vscode].
- To see the list of all Xpra image templates available, including security scan results or to inspect the container specification (including container specifications, configuration, and manifest), see [public.cr.seqera.io/repo/platform/data-studio-xpra][ds-xpra].

{/* links */}
[ds-jupyter]: https://public.cr.seqera.io/repo/platform/data-studio-jupyter
[ds-ride]: https://public.cr.seqera.io/repo/platform/data-studio-ride
[ds-vscode]: https://public.cr.seqera.io/repo/platform/data-studio-vscode
[ds-xpra]: https://public.cr.seqera.io/repo/platform/data-studio-xpra

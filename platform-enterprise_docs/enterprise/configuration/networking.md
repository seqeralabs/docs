---
title: "Networking"
description: Seqera configuration options for networking
date: "27 Jan 2026"
tags: [networking, configuration]
---

Seqera Platform Enterprise requires inbound and outbound connections to external services. This page details the ingress and egress networking considerations required for your Seqera Enterprise deployment.

## Introduction

Seqera hosts Platform services on AWS infrastructure. For the most up-to-date list of IP addresses used by Seqera-hosted services, see the `ingress` and `egress` sections at [https://meta.seqera.io/v3](https://meta.seqera.io/v3).

Seqera services such as Wave and plugin distribution use Cloudflare as a CDN for content delivery and caching. If you use these services and your firewall requires IP-based allowlists, you must allow Cloudflare IP addresses in addition to Seqera-specific IPs. For the complete list of Cloudflare IP addresses, see [https://www.cloudflare.com/ips-v4/](https://www.cloudflare.com/ips-v4/).

:::note
The following list is non-exhaustive and covers core networking connectivity requirements for operating Seqera Platform. Compute environment networking requirements will vary depending on pipeline configuration and specific dependencies for your use case.
:::

## Platform vs Compute environment requirements

Understanding the distinction between Platform and Compute environment networking requirements is essential for configuring your firewall rules:

**Platform requirements** refer to network connectivity needed by your Seqera Platform instance itself. This includes connections for license validation, user authentication, accessing platform resources, and managing pipeline definitions. These connections originate from the server or infrastructure where your Seqera Platform application is installed.

**Compute environment requirements** refer to network connectivity needed by the infrastructure where Nextflow pipeline jobs execute. This includes connections for pulling pipeline code, downloading container images, accessing data sources, and utilizing Seqera enterprise features like Fusion or Wave. These connections originate from your compute resources (e.g., Kubernetes clusters, AWS Batch, Azure Batch, HPC clusters).

In many deployments, Platform and Compute environments are isolated from each other with different network security policies. Ensure you configure firewall rules for both environments according to their respective requirements.

## Networking requirements

### Platform requirements

Your Seqera Platform instance requires network connectivity to only two core services: `licenses.seqera.io` for license validation and `cloudinfo.seqera.io` for cloud resource price prediction. All other services listed below are optional and depend on your specific configuration and feature usage.

To simplify firewall configuration, add `*.seqera.io` and `*.seqera.io.cdn.cloudflare.net` to your allowlist. If DNS wildcards aren't supported, allowlist the specific domains listed in each section below.

#### License server (required)

Your Platform instance must communicate with `licenses.seqera.io` on port 443 for license validation. For the most up-to-date list of IP addresses that your firewall must allow, see the `ingress` section at [https://meta.seqera.io/v3](https://meta.seqera.io/v3).

#### Cloud resource pricing (required)

Your Platform instance must communicate with `cloudinfo.seqera.io` on port 443 for cloud resource price prediction and optimization. For the most up-to-date list of IP addresses that your firewall must allow, see the `ingress` section at [https://meta.seqera.io/v3](https://meta.seqera.io/v3).

#### Source code hosting providers

The Platform must access source code hosting providers to pull pipeline definitions and validate credentials (e.g., GitHub, GitLab, Bitbucket, Gitea). Consult your source code hosting provider's documentation for specific networking requirements and IP allowlists.

#### Container registries

The Platform must access container registries to validate credentials and pull container metadata (e.g., Docker Hub, Quay.io, AWS ECR, Azure ACR, Google GCR, or private registries). Consult your container registry provider's documentation for specific networking requirements and IP allowlists.

#### Wave container services (optional)

Required only if using Seqera Cloud-hosted [Wave](https://docs.seqera.io/wave). Specific networking requirements will vary depending on pipeline configuration and use of Wave feature set.

- `wave.seqera.io`
- `public.cr.seqera.io`
- `private.cr.seqera.io`
- `community.cr.seqera.io`
- `auth.cr.seqera.io`
- `cr.seqera.io`

#### Seqera AI (optional)

Required if using Seqera AI features.

- `ai.seqera.io`

#### Cloud provider APIs and services

Seqera Platform integrations may require access to data stored within your cloud environment, such as access logs and S3 buckets. If you have restricted access to these API endpoints, ensure that you allow connectivity from your Platform instance.

#### Reports and analytics (optional)

Required if using MultiQC report integration.

- `api.multiqc.info`

### Compute environment requirements

Your compute environments (where Nextflow jobs execute) require network connectivity to the following services. To simplify firewall configuration, add `*.seqera.io` and `*.seqera.io.cdn.cloudflare.net` to your allowlist. If DNS wildcards aren't supported, allowlist the specific domains listed in each section below.

:::note
If your allowlist is based on IP addresses, allow all Cloudflare IP addresses. For the complete list, see [https://www.cloudflare.com/ips-v4/](https://www.cloudflare.com/ips-v4/).
:::

#### Source code hosting providers

Compute environments must access source code hosting providers to pull pipeline code (e.g., GitHub, GitLab, Bitbucket, Gitea). Consult your source code hosting provider's documentation for specific networking requirements and IP allowlists.

#### Container registries

Compute environments must access container registries to pull container images used by pipelines (e.g., Docker Hub, Quay.io, AWS ECR, Azure ACR, Google GCR, or private registries). Consult your container registry provider's documentation for specific networking requirements and IP allowlists.

#### License server (if using Fusion or Enterprise plugins)

[Fusion file system](../../supported_software/fusion/overview.md) and other Seqera Enterprise plugins have built-in license checking. Compute environments must communicate with `licenses.seqera.io` on port 443. For the most up-to-date list of IP addresses that your firewall must allow from compute environments, see the `ingress` section at [https://meta.seqera.io/v3](https://meta.seqera.io/v3).

- `licenses.seqera.io`
- `cerbero.seqera.io`

#### Fusion and nf-xpack

Required if using [Fusion file system](../../supported_software/fusion/overview.md) or other Seqera Enterprise plugins.

- `fusionfs.seqera.io`
- `fusionfs.seqera.io.cdn.cloudflare.net`
- `nf-xpack.seqera.io`
- `nf-xpack.seqera.io.cdn.cloudflare.net`

#### Wave container services

Required if using [Wave](https://docs.seqera.io/wave). Compute environments must access `wave.seqera.io` on port 443. If using Wave with the Mirror or Freeze functionality, your container registry must allow the Seqera-hosted Wave service to push images. For the IP addresses from which Wave will push images, see the `egress` section at [https://meta.seqera.io/v3](https://meta.seqera.io/v3).

- `wave.seqera.io`
- `community.wave.seqera.io`
- `wave-cache-prod-cloudflare.seqera.io`
- `wave-cache-prod-cloudflare.seqera.io.cdn.cloudflare.net`

#### Seqera-hosted container registries

Required if using Seqera-hosted container registries from compute environments.

- `community-cr-prod.seqera.io`
- `community-cr-prod.seqera.io.cdn.cloudflare.net`
- `public-cr-prod.seqera.io`
- `public-cr-prod.seqera.io.cdn.cloudflare.net`

### Restricting outbound traffic

If you need to restrict outbound traffic from your Enterprise installation using allowlist-based firewall rules, ensure the services listed in the [Platform requirements](#platform-requirements) and [Compute environment requirements](#compute-environment-requirements) sections remain accessible. Additional services to consider:

- **Nextflow**: Allow access to `github.com` and GitHub artifacts for Nextflow downloads and updates
- **Third-party services**: Allow access to any third-party APIs or services your pipelines depend on (consult vendor documentation for specific requirements)

## Network requirements summary

### Quick reference: Wildcard domains

For simplified firewall configuration, allowlist the following wildcard domains:

- `*.seqera.io`
- `*.seqera.io.cdn.cloudflare.net`

For IP-based allowlists, see [https://www.cloudflare.com/ips-v4/](https://www.cloudflare.com/ips-v4/) for Cloudflare IP addresses.

### Platform instance domains

| Domain                      | Port | Required | Purpose                        |
| --------------------------- | ---- | -------- | ------------------------------ |
| `licenses.seqera.io`        | 443  | Yes      | License validation             |
| `cloudinfo.seqera.io`       | 443  | Yes      | Cloud resource price prediction |
| `wave.seqera.io`            | 443  | Optional | Wave container services        |
| `cerbero.seqera.io`         | 443  | Optional | Wave authentication     |
| `public.wave.seqera.io`     | 443  | Optional | Wave public services    |
| `private.wave.seqera.io`    | 443  | Optional | Wave private services   |
| `community.wave.seqera.io`  | 443  | Optional | Wave community services |
| `public.cr.seqera.io`       | 443  | Optional | Container registry      |
| `private.cr.seqera.io`      | 443  | Optional | Container registry      |
| `community.cr.seqera.io`    | 443  | Optional | Container registry      |
| `auth.cr.seqera.io`         | 443  | Optional | Container registry auth |
| `cr.seqera.io`              | 443  | Optional | Container registry      |
| `ai.seqera.io`              | 443  | Optional | Seqera AI               |
| `api.multiqc.info`          | 443  | Optional | MultiQC reports         |

### Compute environment domains

| Domain                                                    | Port | Required    | Purpose                                        |
| --------------------------------------------------------- | ---- | ----------- | ---------------------------------------------- |
| `licenses.seqera.io`                                      | 443  | Conditional | License validation (Fusion/Enterprise plugins) |
| `cerbero.seqera.io`                                       | 443  | Conditional | License validation                             |
| `fusionfs.seqera.io`                                      | 443  | Conditional | Fusion file system                             |
| `fusionfs.seqera.io.cdn.cloudflare.net`                   | 443  | Conditional | Fusion file system (CDN)                       |
| `nf-xpack.seqera.io`                                      | 443  | Conditional | Enterprise plugins                             |
| `nf-xpack.seqera.io.cdn.cloudflare.net`                   | 443  | Conditional | Enterprise plugins (CDN)                       |
| `wave.seqera.io`                                          | 443  | Conditional | Wave container services                        |
| `community.wave.seqera.io`                                | 443  | Conditional | Wave community services                        |
| `wave-cache-prod-cloudflare.seqera.io`                    | 443  | Conditional | Wave cache                                     |
| `wave-cache-prod-cloudflare.seqera.io.cdn.cloudflare.net` | 443  | Conditional | Wave cache (CDN)                               |
| `community-cr-prod.seqera.io`                             | 443  | Conditional | Container registry                             |
| `community-cr-prod.seqera.io.cdn.cloudflare.net`          | 443  | Conditional | Container registry (CDN)                       |
| `public-cr-prod.seqera.io`                                | 443  | Conditional | Container registry                             |
| `public-cr-prod.seqera.io.cdn.cloudflare.net`             | 443  | Conditional | Container registry (CDN)                       |

### External service requirements

Both Platform and Compute environments require access to:

- **Source code hosting providers**: GitHub, GitLab, Bitbucket, Gitea (as configured). Consult your provider's documentation for specific networking requirements and IP allowlists.
- **Container registries**: Docker Hub, Quay.io, AWS ECR, Azure ACR, Google GCR, or private registries (as configured). Consult your provider's documentation for specific networking requirements and IP allowlists.
- **Cloud provider APIs**: AWS, Azure, GCP API endpoints (if using cloud compute environments). Consult your cloud provider's documentation for specific networking requirements and service endpoint URLs.

## HTTP proxy environment variables

:::caution
Proxies that require passwords aren't supported.
:::

If your Seqera Platform Enterprise instance must access the internet via a proxy server, configure the following case-insensitive environment variables:

- `http_proxy`: The proxy server for HTTP connections.
- `https_proxy`: The proxy server for HTTPS connections.
- `no_proxy`: One or more host names that bypass the proxy server.

In the following example, `alice.example.com:8080` is configured as a proxy for all HTTP and HTTPS traffic, except for traffic to the `internal.example.com` and `internal2.example.com` hosts.

```env
export http_proxy='alice.example.com:8080'
export https_proxy='alice.example.com:8080'
export no_proxy=internal.example.com,internal2.example.com
```

## Isolated environments

If you're deploying Seqera in an environment that has no external internet access, ensure that no pipeline assets or parameters in your configuration contain external links, as this will lead to connection failures.

## Mail proxy server

Mail proxy server configuration details must be set either in `tower.yml` or AWS Parameter Store.

**tower.yml**

::table{file=configtables/mail_server_proxy_yml.yml}

**AWS Parameter Store**

::table{file=configtables/mail_server_proxy_aws.yml}

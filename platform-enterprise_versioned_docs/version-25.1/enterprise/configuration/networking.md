---
title: "Networking"
description: Seqera configuration options for networking
date: "21 Apr 2023"
tags: [networking, configuration]
---

To self-host your installation of Seqera Platform Enterprise, a number of inbound and outbound connections must be allowed within and external to your environment. This page details the ingress and egress networking considerations required for your Seqera Enterprise deployment. 

## Firewall configuration

Your Seqera Enterprise must be allowed to communicate with licences.seqera.io on port 443. The IP addresses for this service are:
- 35.179.197.5/32
- 18.175.79.222/32
- 3.11.38.17/32

### Fusion and other Enterprise plugins

[Fusion file system](../../supported_software/fusion/overview.md) and other Seqera Enterprise plugins have built-in licence checking built-in. As such, you must also allow network traffic from the your Seqera compute environment executing Nextflow jobs. 

### Studios

See [Studios deployment](../studios.md) for details on the Seqera-hosted URLs, and internal subdomains of your Platform instance host domain, that must be allowed for ingress and egress traffic. 

### Wave

To use Seqera Cloud-hosted [Wave](https://docs.seqera.io/wave) with the Mirror or Freeze functionality, which requires Wave to store built containers within your container registry, you must to ensure that the wave-build VPC is allowed to push to your container registry. For most cloud providers, this requires additional configuration to lock down, but is generally allowed by default.

Ensure your Enterprise instance can communicate with the following Seqera-hosted Wave service IP addresses on port 443:

- 18.135.7.45/32
- 18.169.21.18/32
- 18.171.4.252/32

### Restricting outbound traffic

To restrict outbound traffic from your Enterprise installation, you must allow access to Seqera assets hosted on Cloudflare, Nextflow assets hosted on Github artifacts, and any code hosting solutions or third party dependancies you require, such as Github, Gitlab, or Artifactory.

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

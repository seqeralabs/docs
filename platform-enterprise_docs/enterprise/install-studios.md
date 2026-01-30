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

## Prerequisites

Before you begin, you need:
- A running Seqera Platform Enterprise deployment
- A Redis 7 instance separate from the one used by Seqera Platform
- TLS certificates for the Studios service and Studios subdomains (you can use a single certificate covering both or separate certificates)
- A wildcard DNS record

## Configuration

See [Studios](./studios) for DNS configuration, workspace availability, and environment image options.

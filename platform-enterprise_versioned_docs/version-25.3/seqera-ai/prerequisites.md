---
title: "Seqera AI prerequisites"
description: "Prerequisites for Seqera AI"
date created: "2026-04-20"
tags: [seqera-ai, prerequisites]
---

## Overview

Everything you need to have in place before installing Seqera AI. Complete these requirements, then proceed to the Bedrock Setup Guide to configure your AWS account.

Seqera AI enables users to interact with Seqera Platform through a conversational AI interface, available through both the web (portal) and the CLI. The following components are deployed in sequence:

| Order | Component            | Purpose                                                                                                                                                               |
| ----- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | MCP server           | Model Context Protocol server providing Platform-aware tools (workflows, datasets, compute environments). Deploy first — the agent backend connects to it at startup. |
| 2     | MySQL database       | Dedicated database for session state and conversation history.                                                                                                        |
| 3     | Redis                | Caching and session management layer for the agent backend.                                                                                                           |
| 4     | Agent backend        | FastAPI service that orchestrates AI interactions between the CLI/web, Bedrock, and MCP.                                                                              |
| 5     | Portal web interface | Browser-based interface for Seqera AI.                                                                                                                                |


## Platform

- Seqera AI is in Early Access for Platform Enterprise and may require an Enterprise version upgrade. [Contact Seqera support](support.seqera.io) for more infromation.
- **OIDC** configured in Platform for authentication

## AWS Account

Seqera AI uses Claude models via [Amazon Bedrock](https://aws.amazon.com/bedrock/). You need an AWS account with Bedrock available in your chosen region.

### Models

The following Bedrock model access must be enabled in your account:

| Role    | Model ID                    | Used for                        |
| ------- | --------------------------- | ------------------------------- |
| Primary | `anthropic.claude-sonnet-4-6`         | General AI interactions         |
| Fast    | `anthropic.claude-haiku-4-5-20251001-v1:0` | Quick tasks (search, summaries) |
| Deep    | `anthropic.claude-opus-4-6-v1`        | Complex planning tasks          |

## Database

- **MySQL 8.0+** — for Seqera AI session state and conversation history
- A dedicated schema, separate from the Seqera Platform schema
- A dedicated database host is **recommended**. Co-locating the Seqera AI schema on the Platform's MySQL host is technically supported, but a separate host isolates resource usage, maintenance windows, and backups across Seqera products
- You will need the hostname, database name, username, and password ready for Helm configuration

## Redis

- **Redis 7.2+ or Valkey 7.2+** for caching, session state, and the automations task queue
  - Redis 8.x is supported (the search/JSON/bloom modules moved into core in Redis 8.0)
  - Valkey 7.2+ and 8.x are supported for the default caching and task-queue workload. If you enable the optional Redis-backed knowledge index (off by default), Redis Stack 7.x or Redis 8+ is required — Valkey does not ship the `RediSearch` module
- Accessible from your cluster
- You will need the hostname and port ready for Helm configuration

## Networking and DNS

Three domains are required, each serving a different component:

| Component            | Example domain                | Purpose                             |
| -------------------- | ----------------------------- | ----------------------------------- |
| Agent backend        | `ai-api.platform.example.com` | API endpoint for the CLI and portal |
| MCP server           | `mcp.platform.example.com`    | Model Context Protocol server       |
| Portal web interface | `ai.platform.example.com`     | Browser-based UI                    |

- TLS certificates for all three domains
- Ingress controller configured in your cluster

## Encryption key

Generate a Fernet encryption key for encrypting sensitive tokens at rest:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Store this as a Kubernetes secret. It will be referenced as `AGENT_BACKEND_TOKEN_ENCRYPTION_KEY` in the Helm values (this is the default key the `agent-backend` chart reads from `tokenEncryptionKeyExistingSecretName`).

## Kubernetes secrets

Store the following values as Kubernetes Secrets before installing the chart. Do not inline them in `values.yaml`.

| Secret                          | Contains                                                                 | Used by        |
| ------------------------------- | ------------------------------------------------------------------------ | -------------- |
| Database password               | `AGENT_BACKEND_DB_PASSWORD`                                              | Agent backend  |
| Redis password (if applicable)  | `AGENT_BACKEND_REDIS_PASSWORD`                                           | Agent backend  |
| Token encryption key            | `AGENT_BACKEND_TOKEN_ENCRYPTION_KEY`                                     | Agent backend  |
| Anthropic API key               | `ANTHROPIC_API_KEY` (direct Anthropic path only)                         | Agent backend  |
| MCP JWT seed                    | `MCP_OAUTH_JWT_SECRET` — 32+ char random string, `openssl rand -base64 32` | MCP server     |
| MCP initial access token        | `MCP_OAUTH_INITIAL_ACCESS_TOKEN` (standalone MCP deploys only)           | MCP server     |

When MCP is deployed as a subchart of the Platform parent chart, the initial access token is wired automatically from the Platform backend secret — you do not need to create it separately. When deploying MCP standalone, copy the value out of the Platform backend secret (typically named `<platform-release>-backend`, e.g. `platform-backend`, under the data key `OIDC_CLIENT_REGISTRATION_TOKEN`) into a new secret and reference it via `oidcToken.existingSecretName`. The MCP container loads this value as `MCP_OAUTH_INITIAL_ACCESS_TOKEN` at runtime.

Bedrock authentication uses AWS IAM credentials — no API key secret is needed for the Bedrock path. On EKS, **EKS Pod Identity is the recommended approach** but IRSA or static AWS credentials on the pod are also supported.

## Local tooling

- [Helm v3](https://helm.sh/docs/intro/install)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [AWS CLI v2.34.1+](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## Container images

Seqera AI container images are hosted at `cr.seqera.io`. The exact repository paths are defined by each component's Helm chart — see the chart READMEs for the authoritative `image.registry` / `image.repository` defaults and for [vendoring the Seqera container images to your own registry](https://docs.seqera.io/platform-enterprise/enterprise/prerequisites/common#vendoring-seqera-container-images-to-your-own-registry):

| Image                | Chart                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Agent backend        | [agent-backend chart](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/charts/agent-backend) |
| MCP server           | [mcp chart](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/charts/mcp)                  |
| Portal web interface | [portal-web chart](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/charts/portal-web)    |

Ensure your cluster can pull from `cr.seqera.io`, or if your cluster runs in a restricted network, mirror these images to your own registry.

---

## Checklist

- [ ] Seqera Platform Enterprise 25.3.6 or above
- [ ] OIDC identity provider configured
- [ ] AWS Bedrock setup complete
- [ ] MySQL 8.0+ database provisioned (dedicated schema; dedicated host recommended)
- [ ] Redis 7.2+ or Valkey 7.2+ instance provisioned
- [ ] Three DNS records and TLS certificates ready
- [ ] Ingress controller configured
- [ ] Fernet encryption key generated and stored as a K8s secret
- [ ] Database password stored as a K8s secret
- [ ] AWS IAM credentials configured for Bedrock access (EKS Pod Identity recommended; IRSA or static credentials also supported) (Bedrock path only)
- [ ] Helm v3 and kubectl installed
- [ ] Cluster can pull images from `cr.seqera.io`
- [ ] MCP JWT seed generated and stored as a K8s secret
- [ ] OIDC client registration token available (standalone MCP only)
- [ ] MCP initial access token available (standalone MCP only)
- [ ] Anthropic API key stored as a K8s secret (direct Anthropic path only)

---
title: "Prerequisites"
description: "Prerequisites for Co-Scientist"
date created: "2026-04-20"
last updated: "2026-09-30"
tags: [prerequisites]
---

## Overview

Everything you need to have in place before installing Co-Scientist. Complete these requirements, then follow [Bedrock setup](./bedrock-setup.md) to configure your AWS account.

:::caution
Co-Scientist requires Seqera Platform Enterprise 25.3.6 or later. The Co-Scientist panel in Seqera Platform requires Enterprise 26.2 or later. Co-Scientist is available only on AWS.
:::

Co-Scientist is a conversational AI interface for Seqera Platform, available in the [Co-Scientist panel](./platform.md) in Seqera Platform and in the Seqera CLI. Seqera Platform serves the panel itself. You do not deploy a separate web interface. Deploy the following components in sequence:

| Order | Component | Purpose |
| --- | --- | --- |
| 1 | MCP server | Model Context Protocol server providing Platform-aware tools (workflows, datasets, compute environments). Deploy first — the agent backend connects to it at startup. |
| 2 | MySQL database | Dedicated database for session state and conversation history. |
| 3 | Redis | Caching and session management layer for the agent backend. |
| 4 | Agent backend | FastAPI service that orchestrates AI interactions between the CLI, the Co-Scientist panel in Seqera Platform, Bedrock, and MCP. |

## Platform

- Co-Scientist is in Early Access for Platform Enterprise and may require an Enterprise version upgrade. [Contact Seqera support](https://support.seqera.io) for more information.
- **OIDC** configured in Platform for authentication.

## AWS account

Co-Scientist can use Claude models via [Amazon Bedrock](https://aws.amazon.com/bedrock/) or via an Anthropic API key. You need an AWS account with Bedrock available in your chosen region.

### Models

The following Bedrock model access must be enabled in your account:

| Purpose | Model ID | Required |
| --- | --- | --- |
| Text inference | `anthropic.claude-opus-4-8` | Always |
| Text embeddings | `amazon.titan-embed-text-v2:0` | Only when documentation semantic search is enabled |

Co-Scientist uses a single model for all text inference. Agent backend versions up to and including `1.14.1` route requests across separate primary, fast, and deep models and need access to each. See the 26.1 documentation if your deployment pins an earlier version of the agent-backend images.

If you use a recent Anthropic model through AWS Bedrock, such as `anthropic.claude-opus-5-5`, make sure your account has access to it through the Bedrock service in your chosen region.
Some AWS accounts have additional account-level eligibility requirements for certain models and can return errors like `anthropic.claude-opus-5-5 is not available for this account`. These requirements aren't visible in the Service Quotas console. To test them, use the AWS Bedrock Playground in the console. If your account has these requirements, contact AWS Support to get access to the required models, as explained in [this AWS blog post](https://repost.aws/knowledge-center/bedrock-serverless-models-access-denied).

For the IAM permissions these models require, see [Bedrock setup](./bedrock-setup.md).

## Database

- **MySQL 8.0+** for Co-Scientist session state and conversation history.
- A dedicated schema, separate from the Seqera Platform schema.
- A dedicated database host is **recommended**. Co-locating the Co-Scientist schema on the Platform's MySQL host is technically supported, but a separate host isolates resource usage, maintenance windows, and backups across Seqera products.
- You will need the hostname, database name, username, and password ready for Helm configuration.

## Redis

- **Redis 7.2+ or Valkey 7.2+** for caching, session state, and the automations task queue.
  - Redis 8.x is supported (the search/JSON/bloom modules moved into core in Redis 8.0).
  - Valkey 7.2+ and 8.x are supported for the default caching and task-queue workload. If you enable the optional Redis-backed knowledge index (off by default), Redis Stack 7.x or Redis 8+ is required — Valkey does not ship the `RediSearch` module.
- Accessible from your cluster.
- Either a dedicated instance or the instance Platform already uses. To share one instance, give Co-Scientist a different Redis database number with `agent-backend.redis.database` (Platform defaults to database `0`).
- You will need the hostname and port ready for Helm configuration.

## Networking and DNS

Two domains are required in addition to your Platform domain, each serving a different component:

| Component | Example domain | Purpose |
| --- | --- | --- |
| Agent backend | `ai-api.platform.example.com` | API endpoint for the CLI and the Co-Scientist panel |
| MCP server | `mcp.platform.example.com` | Model Context Protocol server |

- TLS certificates for both domains.
- Both domains must be subdomains of a domain shared with Platform, such as `platform.example.com`. The Co-Scientist panel authenticates to the agent backend with the Platform session cookie. `TOWER_AUTH_COOKIE_DOMAIN` scopes that cookie to the shared parent domain. The Platform Helm chart sets `TOWER_AUTH_COOKIE_DOMAIN` automatically when the agent-backend subchart is enabled.
- Ingress controller configured in your cluster.

## Encryption key

Generate a Fernet encryption key for encrypting sensitive tokens at rest:

```bash
# using uv Python package manager (installed if not available)
uv --version >/dev/null 2>&1 || curl -LsSf https://astral.sh/uv/install.sh | sh
uv run --with cryptography python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# using Python directly, cryptography dependency module must be installed in environment
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Store this as a Kubernetes secret. It will be referenced as `AGENT_BACKEND_TOKEN_ENCRYPTION_KEY` in the Helm values (this is the default key the `agent-backend` chart reads from `tokenEncryptionKeyExistingSecretName`).

## Kubernetes secrets

Store the following values as Kubernetes secrets before installing the chart. Do not inline them in `values.yaml`.

| Secret | Contains | Used by |
| --- | --- | --- |
| Database password | `AGENT_BACKEND_DB_PASSWORD` | Agent backend |
| Redis password (if applicable) | `AGENT_BACKEND_REDIS_PASSWORD` | Agent backend |
| Token encryption key | `AGENT_BACKEND_TOKEN_ENCRYPTION_KEY` | Agent backend |
| Anthropic API key | `ANTHROPIC_API_KEY` (direct Anthropic path only) | Agent backend |
| MCP JWT seed | `MCP_OAUTH_JWT_SECRET` 32+ char random string, `openssl rand -base64 32` | MCP server |
| MCP initial access token | `MCP_OAUTH_INITIAL_ACCESS_TOKEN` (standalone MCP deploys only) | MCP server |

When MCP is deployed as a subchart of the Platform parent chart, the initial access token is wired automatically from the Platform backend secret - you do not need to create it separately. When deploying MCP standalone, copy the value out of the Platform backend secret (typically named `<platform-release>-backend`, e.g. `platform-backend`, under the data key `OIDC_CLIENT_REGISTRATION_TOKEN`) into a new secret and reference it via `oidcToken.existingSecretName`. The MCP container loads this value as `MCP_OAUTH_INITIAL_ACCESS_TOKEN` at runtime.

Bedrock authentication uses AWS IAM credentials and no API key secret is needed for the Bedrock path. On EKS, **EKS Pod Identity is the recommended approach** but IRSA or static AWS credentials on the pod are also supported.

## Local tooling

- [Helm v3](https://helm.sh/docs/intro/install)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [AWS CLI v2.34.1+](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## Container images

Co-Scientist container images are hosted at `cr.seqera.io`. The Helm charts define each image's repository path but set no default registry, so that you copy the images into your own registry. Set `global.imageRegistry` in your Platform values to that registry, or to `cr.seqera.io` if your cluster pulls directly. See the chart READMEs for the authoritative `image.registry` / `image.repository` defaults and for vendoring guidance:

| Image | Source image | Chart |
| --- | --- | --- |
| Agent backend | `cr.seqera.io/ai/agent-backend/backend` | [agent-backend chart](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/charts/agent-backend) |
| MCP server | `cr.seqera.io/enterprise/mcp/server` | [mcp chart](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/charts/mcp) |

:::info
From MCP 1.4.3, Seqera publishes MCP server images only to `cr.seqera.io/enterprise/mcp/server`. Earlier releases (up to 1.4.2) remain available at `cr.seqera.io/ai/mcp/server`, but Seqera publishes no new releases there.
:::

Ensure your cluster can pull from `cr.seqera.io`, or if your cluster runs in a restricted network, mirror these images to your own registry.

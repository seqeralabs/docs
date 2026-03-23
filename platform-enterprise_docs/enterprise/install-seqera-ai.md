---
title: "Seqera AI"
description: Install and configure Seqera AI for Seqera Platform Enterprise
date: "2026-02-03"
tags: [seqera-ai, installation, deployment, aws, helm]
---

:::caution
Seqera AI requires Seqera Platform Enterprise 26.1 or later for the agent backend, MCP server, portal web interface, and CLI integration.
:::

Seqera AI is an intelligent command-line assistant that helps you build, run, and manage bioinformatics workflows. This guide describes how to deploy Seqera AI in a Seqera Enterprise deployment.

## Prerequisites

Before you begin, you need:

- **Seqera Enterprise 25.3+** deployed via [Helm](./platform-helm.md)
- **MySQL 8.0+ database**
- **API key** from a supported inference provider (see below)
- **MCP server** deployed and accessible from your cluster
- **OIDC-compatible identity provider** for the portal web interface, MCP server, and CLI login flow
- **Token encryption key** for encrypting sensitive tokens at rest. Generate with:

    ```bash
    python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
    ```
- [Helm v3](https://helm.sh/docs/intro/install) and [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally

## Supported inference providers

Seqera AI uses Claude models from Anthropic. The following inference providers are supported for Enterprise deployments:

| Inference provider | Description |
|--------------------|-------------|
| **Anthropic API** | Direct access to Claude models via Anthropic's API ([console.anthropic.com](https://console.anthropic.com/)) |
| **AWS Bedrock** | Access Claude models through [AWS Bedrock](https://aws.amazon.com/bedrock/) in your AWS account |

## Architecture

Seqera AI connects your local CLI environment to your Platform resources through a secure backend service:

![Seqera AI infrastructure architecture](./_images/seqera-ai-infrastructure.png)

**Components:**

| Component | Description |
|-----------|-------------|
| **Agent backend** | FastAPI service that orchestrates AI interactions. Deployed as a Helm subchart alongside Platform. |
| **MCP server** | Model Context Protocol server providing Platform-aware tools (workflows, datasets, compute environments). |
| **Portal web interface** | Browser-based interface for Seqera AI and related Platform features. |
| **MySQL database** | Dedicated database for session state and conversation history. **Separate from Platform database**. |

**Flow:**

1. Users authenticate via `seqera login`, which initiates OIDC authentication with Platform.
1. The CLI creates a session with the agent backend, passing the Platform access token.
1. The agent backend validates tokens against Platform's `/user-info` endpoint.
1. User prompts are processed by the inference provider, which can invoke Platform tools via MCP.
1. MCP tools execute Platform operations using the user's credentials.
1. Results stream back to the CLI via Server-Sent Events (SSE).

## Configure Helm values

The Seqera AI components can be installed using the [Seqera Helm charts](https://github.com/seqeralabs/helm-charts). Refer to the examples in the repository for sample configurations.
Some values (like database passwords, API keys, sensitive OIDC settings, cryptographic keys) are recommended to be stored as Kubernetes secrets and referenced in the Helm values in production installations, rather than be specified as plain text.

The Seqera AI components can be installed alongside Platform and other subcharts in a single Helm release, or can be installed individually as separate releases.

Documentation for the individual charts is available at:
- [Agent backend](https://github.com/seqeralabs/helm-charts/tree/master/platform/charts/agent-backend)
- [MCP server](https://github.com/seqeralabs/helm-charts/tree/master/platform/charts/mcp)
- [Portal web interface](https://github.com/seqeralabs/helm-charts/tree/master/platform/charts/portal-web)

### Additional configuration

The following optional environment variables are not covered by the Helm chart values. Set them in the `.extraEnvVars` section of each chart as needed.

#### Agent backend

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_MODEL` | Primary model for AI interactions | `claude-sonnet-4-6` |
| `FAST_MODEL` | Model for quick tasks (search, summaries) | `claude-haiku-4-5-20251001` |
| `DEEP_MODEL` | Model for complex planning tasks | `claude-opus-4-5-20251101` |
| `SEQERA_PLATFORM_URL` | Platform UI URL for constructing links to runs and pipelines | Automatically derived from platform domain |
| `SESSION_TIMEOUT_SECONDS` | Session timeout | `86400` (24 hours) |
| `MAX_SESSIONS_PER_USER` | Max concurrent sessions per user | `10` |
| `SESSION_RETENTION_DAYS` | Days to retain session data | `14` |
| `CORS_ORIGINS` | Allowed CORS origins (JSON array) | `["*"]` |

#### MCP

TBD

#### Portal web

TBD

## Verify the installation

1. Check the health endpoint of the agent backend and mcp to verify connectivity:

    ```bash
    curl -i https://ai-api.platform.example.com/health
    curl -i https://mcp.platform.example.com/health
    curl -i https://mcp.platform.example.com/service-info
    ```

## Connect the CLI to Seqera AI

Set `SEQERA_AI_BACKEND_URL` before running `seqera ai` so the CLI connects to the correct backend.

Install the CLI first by following [Seqera AI CLI installation](../seqera-ai/installation.mdx), or install it directly with:

```bash
npm install -g seqera
```

Use your Enterprise deployment:

```bash
export SEQERA_AUTH_DOMAIN=https://platform.example.com/api
export SEQERA_AUTH_CLI_CLIENT_ID=seqera_ai_cli
export SEQERA_AI_BACKEND_URL=https://ai.platform.example.com
seqera login
seqera ai
```

If your Enterprise deployment uses a different OAuth client ID for the CLI, replace `seqera_ai_cli` with the value configured for your installation.

If you are testing a development build of the CLI against the hosted production Seqera AI service, use the following settings instead:

| Variable | Purpose | Example value |
| --- | --- | --- |
| `SEQERA_AI_BACKEND_URL` | Seqera AI backend endpoint used by the CLI | `https://ai-api.seqera.io` |
| `SEQERA_AUTH_DOMAIN` | Platform API base URL used for browser-based login | `https://cloud.seqera.io/api` |
| `SEQERA_AUTH_CLI_CLIENT_ID` | OAuth client ID for the Seqera AI CLI | `seqera_ai_cli` |
| `SEQERA_ACCESS_TOKEN` | Platform personal access token used instead of browser login (`TOWER_ACCESS_TOKEN` also supported) | `<PLATFORM_ACCESS_TOKEN>` |

Use the OAuth login flow:

```bash
export SEQERA_AUTH_DOMAIN=https://cloud.seqera.io/api
export SEQERA_AUTH_CLI_CLIENT_ID=seqera_ai_cli
export SEQERA_AI_BACKEND_URL=https://ai-api.seqera.io
seqera ai
```

Use a Platform personal access token instead of browser login:

```bash
export SEQERA_ACCESS_TOKEN=<PLATFORM_ACCESS_TOKEN>
export SEQERA_AI_BACKEND_URL=https://ai-api.seqera.io
seqera ai
```

You only need `SEQERA_AUTH_DOMAIN` and `SEQERA_AUTH_CLI_CLIENT_ID` when using the OAuth login flow. `SEQERA_ACCESS_TOKEN` (`TOWER_ACCESS_TOKEN`) is also supported.

## Environment variables reference

### Required

| Variable | Description |
|----------|-------------|
| `SEQERA_PLATFORM_API_URL` | Platform API URL (e.g., `https://platform.example.com/api`) |
| `SEQERA_MCP_URL` | MCP server URL (e.g., `https://mcp.example.com/mcp`) |
| `ANTHROPIC_API_KEY` | API key for inference provider |
| `AGENT_BACKEND_DB_HOST` | MySQL database hostname |
| `AGENT_BACKEND_DB_NAME` | MySQL database name |
| `AGENT_BACKEND_DB_USER` | MySQL database username |
| `AGENT_BACKEND_DB_PASSWORD` | MySQL database password |
| `TOKEN_ENCRYPTION_KEY` | Fernet encryption key for encrypting sensitive tokens at rest. Also accepted as `AGENT_BACKEND_TOKEN_ENCRYPTION_KEY`. |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `SEQERA_PLATFORM_URL` | Platform UI URL for constructing links to runs and pipelines | Derived from platform domain |
| `AGENT_BACKEND_DB_PORT` | MySQL port | `3306` |
| `SESSION_TIMEOUT_SECONDS` | Session timeout | `86400` (24 hours) |
| `MAX_SESSIONS_PER_USER` | Max concurrent sessions per user | `10` |
| `SESSION_RETENTION_DAYS` | Days to retain session data | `14` |
| `LOG_LEVEL` | Application log level (`CRITICAL`, `ERROR`, `WARNING`, `INFO`, `DEBUG`) | `INFO` |
| `CORS_ORIGINS` | Allowed CORS origins (JSON array) | `["*"]` |

## Helm values reference

For the full list of configuration options, see the [agent-backend chart documentation](https://github.com/seqeralabs/helm-charts/tree/master/platform/charts/agent-backend).

### Global

| Value | Description | Default |
|-------|-------------|---------|
| `global.platformExternalDomain` | Domain where Seqera Platform listens | `example.com` |
| `global.agentBackendDomain` | Domain where the agent backend listens | `""` |
| `global.mcpDomain` | Domain where MCP server listens | `""` |

### Agent backend

| Value | Description | Default |
|-------|-------------|---------|
| `agentBackend.replicaCount` | Number of replicas | `1` |
| `agentBackend.image.registry` | Image registry | `cr.seqera.io` |
| `agentBackend.image.repository` | Image repository | `private/nf-tower-enterprise/agent-backend` |
| `anthropicApiKeyExistingSecretName` | Existing secret containing `ANTHROPIC_API_KEY` | `""` |
| `tokenEncryptionKeyExistingSecretName` | Existing secret containing `TOKEN_ENCRYPTION_KEY` | `""` |

### Database

| Value | Description | Default |
|-------|-------------|---------|
| `database.host` | MySQL hostname | `""` |
| `database.port` | MySQL port | `3306` |
| `database.name` | MySQL database name | `""` |
| `database.username` | MySQL username | `""` |
| `database.existingSecretName` | Existing secret with DB password | `""` |
| `database.existingSecretKey` | Key in the secret | `DB_PASSWORD` |

### Ingress

| Value | Description | Default |
|-------|-------------|---------|
| `ingress.enabled` | Enable ingress | `false` |
| `ingress.path` | Ingress path (use `/*` for AWS ALB) | `/` |
| `ingress.ingressClassName` | Ingress class name | `""` |
| `ingress.annotations` | Ingress annotations | `{}` |
| `ingress.tls` | TLS configuration | `[]` |

## Security considerations

- **Token validation**: Every request validates the user's Platform token
- **User isolation**: Sessions are isolated by user ID
- **Credential passthrough**: MCP tools use the user's credentials for Platform operations
- **Token encryption**: Sensitive tokens (e.g., GitHub PATs) are encrypted at rest using Fernet symmetric encryption before storage in the database
- **No credential storage**: The agent backend does not store user credentials
- **TLS required**: All communication should use HTTPS

## Next steps

- See [Use cases](../seqera-ai/use-cases.md) for CLI usage.

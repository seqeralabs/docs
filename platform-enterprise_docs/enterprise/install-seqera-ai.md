---
title: "Seqera AI"
description: Install and configure Seqera AI for Seqera Platform Enterprise
date: "2026-02-03"
tags: [seqera-ai, installation, deployment, aws, helm]
---

:::caution
Seqera AI requires Seqera Platform Enterprise 25.3 or later.
:::

Seqera AI is an intelligent command-line assistant that helps you build, run, and manage bioinformatics workflows. This guide describes how to deploy Seqera AI in Seqera Enterprise deployments on AWS.

## Prerequisites

Before you begin, you need:

- **Seqera Enterprise 25.3+** deployed via [Helm](./platform-helm.md)
- **MySQL 8.0+ database**
- **API key** from a supported inference provider (see below)
- **MCP server** deployed and accessible from your cluster
- [Helm v3](https://helm.sh/docs/intro/install) and [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally

### AWS requirements

- **AWS EKS cluster** with Seqera Platform deployed
- **Amazon RDS** for the MySQL database
- **AWS ALB Ingress Controller** installed in your cluster
- **TLS certificate** in AWS Certificate Manager
- **DNS** configured for the Seqera AI subdomain (e.g., `ai.platform.example.com`)

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
| **MySQL database** | Dedicated database for session state and conversation history. **Separate from Platform database**. |

**Flow:**

1. Users authenticate via `seqera login`, which initiates OIDC authentication with Platform.
1. The CLI creates a session with the agent backend, passing the Platform access token.
1. The agent backend validates tokens against Platform's `/user-info` endpoint.
1. User prompts are processed by the inference provider, which can invoke Platform tools via MCP.
1. MCP tools execute Platform operations using the user's credentials.
1. Results stream back to the CLI via Server-Sent Events (SSE).

## Provision the database

Seqera AI requires a dedicated MySQL database separate from the Platform database.

1. Create a MySQL 8.0+ instance in Amazon RDS:

    - **Engine**: MySQL 8.0
    - **Instance class**: `db.t3.medium` or larger
    - **Storage**: 20 GB minimum with autoscaling enabled
    - **Security group**: Allow inbound MySQL (port 3306) from EKS cluster

1. Connect to the database and create the Seqera AI database and user:

    ```sql
    CREATE DATABASE seqera_ai;
    CREATE USER 'seqera_ai'@'%' IDENTIFIED BY '<secure-password>';
    GRANT ALL PRIVILEGES ON seqera_ai.* TO 'seqera_ai'@'%';
    FLUSH PRIVILEGES;
    ```

## Create Kubernetes secrets

1. Create a secret for the inference provider API key:

    ```bash
    kubectl create secret generic anthropic-secret \
        --namespace <namespace> \
        --from-literal=ANTHROPIC_API_KEY=<your-api-key>
    ```

1. Create a secret for the database credentials:

    ```bash
    kubectl create secret generic seqera-ai-db-credentials \
        --namespace <namespace> \
        --from-literal=DB_PASSWORD=<your-database-password>
    ```

## Configure Helm values

Add the following configuration to your Platform Helm values file:

```yaml
# Global configuration
global:
  platformExternalDomain: platform.example.com
  mcpExternalDomain: mcp.example.com

# Enable Seqera AI agent backend
agent-backend:
  enabled: true

  agentBackend:
    replicaCount: 1

    # Anthropic API key
    anthropicApiKey:
      existingSecretName: "anthropic-secret"
      existingSecretKey: "ANTHROPIC_API_KEY"

  # Database configuration
  database:
    host: "seqera-ai-db.xxxxx.us-east-1.rds.amazonaws.com"
    port: 3306
    name: "seqera_ai"
    username: "seqera_ai"
    existingSecretName: "seqera-ai-db-credentials"
    existingSecretKey: "DB_PASSWORD"
    dialect: mysql

  # AWS ALB ingress
  ingress:
    enabled: true
    ingressClassName: "alb"
    path: "/*"
    annotations:
      alb.ingress.kubernetes.io/scheme: internet-facing
      alb.ingress.kubernetes.io/target-type: ip
      alb.ingress.kubernetes.io/certificate-arn: "arn:aws:acm:<region>:<account>:certificate/<certificate-id>"
      alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
      alb.ingress.kubernetes.io/ssl-redirect: "443"
      alb.ingress.kubernetes.io/healthcheck-path: /health
    tls:
      - hosts:
          - 'ai.{{ .Values.global.platformExternalDomain }}'
```

## Deploy

1. Upgrade your Platform Helm release:

    ```bash
    helm upgrade my-release oci://public.cr.seqera.io/charts/platform \
        --version <version> \
        --namespace <namespace> \
        --values my-values.yaml
    ```

1. Wait for the agent-backend pod to be ready:

    ```bash
    kubectl get pods -n <namespace> -l app.kubernetes.io/component=agent-backend -w
    ```

1. Verify the deployment:

    ```bash
    kubectl logs -n <namespace> -l app.kubernetes.io/component=agent-backend --tail=50
    ```

## Configure DNS

Create a DNS record pointing to the ALB for the Seqera AI endpoint:

- **Record**: `ai.platform.example.com`
- **Type**: CNAME (or Alias for Route 53)
- **Value**: ALB DNS name (find with `kubectl get ingress -n <namespace>`)

## Verify the installation

1. Check the health endpoint:

    ```bash
    curl -I https://ai.platform.example.com/health
    ```

    You should receive a `200 OK` response.

1. Test CLI connectivity:

    ```bash
    export SEQERA_AI_BACKEND_URL=https://ai.platform.example.com
    seqera login
    seqera ai
    ```

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

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_MODEL` | Model to use | `claude-sonnet-4-20250514` |
| `AGENT_BACKEND_DB_PORT` | MySQL port | `3306` |
| `SESSION_TIMEOUT_SECONDS` | Session timeout | `86400` (24 hours) |
| `MAX_SESSIONS_PER_USER` | Max concurrent sessions per user | `10` |
| `SESSION_RETENTION_DAYS` | Days to retain session data | `14` |

## Helm values reference

For the full list of configuration options, see the [agent-backend chart documentation](https://github.com/seqeralabs/helm-charts/tree/master/platform/charts/agent-backend).

### Global

| Value | Description | Default |
|-------|-------------|---------|
| `global.platformExternalDomain` | Domain where Seqera Platform listens | `example.com` |
| `global.mcpExternalDomain` | Domain where MCP server listens | `mcp.example.com` |

### Agent backend

| Value | Description | Default |
|-------|-------------|---------|
| `agentBackend.replicaCount` | Number of replicas | `1` |
| `agentBackend.image.registry` | Image registry | `cr.seqera.io` |
| `agentBackend.image.repository` | Image repository | `private/nf-tower-enterprise/agent-backend` |
| `agentBackend.anthropicApiKey.existingSecretName` | Existing secret with API key | `""` |
| `agentBackend.anthropicApiKey.existingSecretKey` | Key in the secret | `ANTHROPIC_API_KEY` |

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
- **No credential storage**: The agent backend does not store user credentials
- **TLS required**: All communication should use HTTPS

## Next steps

- See [Use cases](../seqera-ai/use-cases.md) for CLI usage.

---
title: "Co-Scientist"
description: Install and configure Co-Scientist for Seqera Platform Enterprise
date: "2026-05-04"
tags: [seqera-ai, installation, deployment, aws, helm]
---

:::caution
Co-Scientist requires Seqera Platform Enterprise 25.3.6 or later. This guide covers the Enterprise 26.1 deployment path for the agent backend, MCP server, web interface, and Seqera CLI.
:::

Deploy the agent backend, Seqera MCP server, and web interface alongside Platform to provide Co-Scientist assistance for workflows, data, projects, and Platform resources in the Seqera CLI and browser. The MCP, agent backend, and portal web Helm charts provide the option to define Kubernetes ingresses. Other methods to expose the services can be used, e.g. via the `extraDeploy` resource.

## Prerequisites

Before you begin, make sure you have:

- Seqera Platform Enterprise 25.3.6 or later deployed with the [Seqera Platform Helm chart](./platform-helm.md).
- Helm v3 and `kubectl` installed locally.
- DNS names and TLS certificates for the Platform, agent backend, MCP server, and portal web interface hosts. By default, the Helm charts derive `mcp.<platformExternalDomain>`, `ai-api.<platformExternalDomain>`, and `ai.<platformExternalDomain>`. Override `global.mcpDomain`, `global.agentBackendDomain`, and `global.portalWebDomain` if you use different hostnames.
- Access to pull the images required by the Helm charts from the configured container registry, or mirrored copies in your internal registry. See [Seqera container images](./advanced-topics/seqera-container-images.md) and [Mirroring container images](./configuration/mirroring.md).
- A MySQL 8.4 LTS-compatible database for the agent backend. You can use the same MySQL instance as Platform with a separate database and user, or a separate instance.
- A Redis 7.2-compatible or Valkey 7.2-compatible instance for agent backend task coordination.
- A stable Fernet token encryption key for the agent backend if you use Kustomize. Helm-only installs can let the chart generate this key, but explicitly setting it avoids accidental regeneration.
- Access to a supported Claude inference provider. AWS Bedrock is recommended for Enterprise deployments; direct Anthropic API access is also supported.
- If you use AWS Bedrock, access to the required Claude model or inference profile and the Amazon Titan embedding model. See AWS documentation to [add or remove access to Amazon Bedrock foundation models](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html).
- If you use direct Anthropic API access, an Anthropic API key stored in a Kubernetes Secret.

Generate a Fernet token encryption key when you set the key manually:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Store database passwords, Redis or Valkey passwords, OIDC token values, image pull credentials, and encryption keys in Kubernetes Secrets. Reference those Secrets from Helm values instead of committing plaintext values.

## Inference providers

Co-Scientist supports two Claude inference providers. AWS Bedrock is recommended for Enterprise deployments, especially when inference must run in your AWS account or your organization wants to avoid direct egress to Anthropic. Direct Anthropic API access remains supported when your organization has approved that integration.

| Inference provider | Description |
| --- | --- |
| AWS Bedrock | Recommended. Runs Claude inference in your AWS account through Bedrock. |
| Anthropic API | Uses Anthropic-hosted Claude models through an Anthropic API key. |

Documentation semantic search is configured separately from chat inference. Use Amazon Titan embeddings through Bedrock when you enable improved documentation search.

## Components

| Component | Description |
| --- | --- |
| Agent backend | FastAPI and LangGraph service that orchestrates Co-Scientist sessions, validates Platform tokens, calls the configured inference provider, connects to MCP, and streams Server-Sent Events (SSE) to clients. |
| Seqera MCP server | Model Context Protocol server that exposes Platform-aware tools for workflows, datasets, compute environments, Wave, Hub, and nf-core. |
| Portal web interface | Browser interface for Co-Scientist chat, projects, thread history, report viewing, and related Platform workflows. |
| MySQL | Agent backend database for sessions, threads, token usage records, and conversation history. |
| Redis or Valkey | Agent backend queue and coordination store. |

## Deployment topology

The recommended Enterprise topology is using the `platform` Seqera Helm chart with the `mcp`, `agent-backend`, and `portal-web` subcharts enabled. The Platform Helm chart automatically wires the MCP OIDC client registration token from the Platform backend Secret, reducing the number of manual steps required.

Use separate Helm releases when you cannot convert your existing Platform installation to using the Helm chart or your environment requires separate lifecycle ownership. If you deploy the charts separately, you must manually configure:

- `global.platformServiceAddress` and `global.platformServicePort` on each AI chart so they can reach the Platform backend service using the cluster-internal endpoint.
- `oidcToken.existingSecretName` and `oidcToken.existingSecretKey` with the same OIDC client registration token configured for the Platform backend.
- Matching external DNS and TLS for `global.mcpDomain`, `global.agentBackendDomain`, and `global.portalWebDomain`.

## Configure Helm values

Enable the three Co-Scientist subcharts in your Platform values file. This example uses the Platform parent chart, so the same Helm release also deploys or upgrades Platform. Include the required Platform values from your existing installation in addition to these Co-Scientist values.

```yaml
global:
  platformExternalDomain: platform.example.com
  mcpDomain: mcp.platform.example.com
  agentBackendDomain: ai-api.platform.example.com
  portalWebDomain: ai.platform.example.com

mcp:
  enabled: true

agent-backend:
  enabled: true

portal-web:
  enabled: true
```

For a complete example, see the [Co-Scientist Helm example](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/examples/seqera-ai).

## Configure MCP

When MCP runs under the Platform parent chart, leave `mcp.oidcToken` unset unless you need to override the default wiring. The parent chart sets it to the Platform backend Secret key `OIDC_CLIENT_REGISTRATION_TOKEN`.


## Configure the agent backend

The agent backend needs MySQL, Redis or Valkey, inference provider access, MCP connectivity, and a stable token encryption key. In this example sensitive values (db and redis passwords, token encryption key, etc) are stored in a kubernetes secret named `seqera-ai-secrets`, which needs to already exist before the chart installation, either created manually or with automated secret extraction tools (like External Secrets, not covered in this tutorial).

```yaml
agent-backend:
  enabled: true

  database:
    host: mysql.example.com
    name: agent_backend
    username: agent_backend
    existingSecretName: seqera-ai-secrets
    existingSecretKey: AGENT_BACKEND_DB_PASSWORD

  redis:
    host: redis.example.com
    db: 0
    existingSecretName: seqera-ai-secrets
    existingSecretKey: AGENT_BACKEND_REDIS_PASSWORD

  tokenEncryptionKeyExistingSecretName: seqera-ai-secrets
```

Use the `redis` values block for Redis-compatible services, including Valkey.

### Configure inference and embeddings providers

Declare which provider serves each capability using the `inference.provider`, `embeddings.provider`, and `sandbox.provider` values. `inference.provider` is required. `embeddings.provider` and `sandbox.provider` are optional; leave them empty to disable those features.

### Configure AWS Bedrock

Configure Bedrock so Claude inference and Titan embeddings run in your AWS account. Bedrock is the recommended Enterprise configuration.

```yaml
agent-backend:
  inference:
    provider: bedrock

  embeddings:
    provider: bedrock

  bedrock:
    # Default credentials applied to all Bedrock-backed services unless overridden per-service.
    default:
      assumeRoleArn: arn:aws:iam::<account-id>:role/<bedrock-access-role>
      region: <region>

    inference:
      # Anthropic inference profile ARN on Bedrock.
      anthropicModel: arn:aws:bedrock:<region>:<account-id>:inference-profile/<profile-name>

    embeddings:
      model: amazon.titan-embed-text-v2:0
```

Use `bedrock.default.assumeRoleArn` when the agent backend pod must assume a role for Bedrock inference, Bedrock embeddings, or AgentCore access. Leave it empty when the pod already has direct AWS credentials for the target account. Per-service overrides (`bedrock.inference.assumeRoleArn`, `bedrock.embeddings.assumeRoleArn`) can be set when different roles are required per capability.

### Configure direct Anthropic API access

Use direct Anthropic API access only when your organization has approved Anthropic-hosted Claude models. Set `inference.provider` to `anthropic` and reference the Anthropic API key from a Kubernetes Secret:

```yaml
agent-backend:
  inference:
    provider: anthropic

  anthropic:
    existingSecretName: seqera-ai-secrets

  # Optionally enable Bedrock embeddings alongside Anthropic inference.
  embeddings:
    provider: bedrock

  bedrock:
    default:
      assumeRoleArn: arn:aws:iam::<account-id>:role/<bedrock-access-role>
      region: <region>
    embeddings:
      model: amazon.titan-embed-text-v2:0
```

Documentation search embeddings are configured separately from chat inference. Enable Bedrock embeddings alongside Anthropic inference when you want improved documentation search.

### Configure AgentCore sandbox sessions

If your deployment uses AWS Bedrock AgentCore for sandboxed execution, set `sandbox.provider` to `bedrock` and provide the AgentCore runtime ARN:

```yaml
agent-backend:
  sandbox:
    provider: bedrock

  bedrock:
    sandbox:
      runtimeArn: arn:aws:bedrock-agentcore:<region>:<account-id>:runtime/<runtime-id>
```

If `bedrock.default.assumeRoleArn` is defined, the agent backend assumes that role before interacting with the AgentCore runtime. Use `bedrock.sandbox.assumeRoleArn` to override the role for sandbox access specifically.

## Configure the portal web interface

The portal web chart serves the browser interface and proxies requests to the agent backend. It authenticates users through Seqera Platform.

```yaml
portal-web:
  enabled: true
```

## Install or upgrade

Run Helm with your Platform values and Co-Scientist overrides:

```bash
helm upgrade --install seqera oci://public.cr.seqera.io/charts/platform \
  --namespace seqera \
  --values values.yaml
```

After installation, verify the pods are ready:

```bash
kubectl get pods -n seqera -l app.kubernetes.io/component=mcp
kubectl get pods -n seqera -l app.kubernetes.io/component=agent-backend
kubectl get pods -n seqera -l app.kubernetes.io/component=portal-web
```

## Verify the installation

Check the public endpoints:

```bash
curl -i https://ai-api.platform.example.com/health
curl -i https://mcp.platform.example.com/health
curl -i https://mcp.platform.example.com/service-info
curl -I https://ai.platform.example.com
```

The agent backend `/health` endpoint returns `200 OK` when the service starts and required dependencies are reachable. The MCP server exposes `/health` for reachability and `/service-info` for server and protocol information. The portal web interface does not expose a matching `/service-info` endpoint; use the HTTP response and browser sign-in test to confirm it is reachable.

Open the portal web interface, for example `https://ai.platform.example.com`, and sign in with your Platform account. A successful login confirms that Platform OIDC, portal web, and the agent backend are connected. Start a chat in the interface to test the inference provider configuration; if sandboxing was configured, try asking a specific question that would trigger a sandbox execution, e.g. `What's the accurate square root of 98723516236?`, which should prompt the model to write a small Python script that should run in the sandbox.

## Connect the Seqera CLI to Co-Scientist

Install the CLI from the official [`seqera` npm package](https://www.npmjs.com/package/seqera):

```bash
npm install -g seqera
```

Point the CLI at your Enterprise deployment:

```bash
export SEQERA_AUTH_DOMAIN=https://platform.example.com/api
export SEQERA_AI_BACKEND_URL=https://ai-api.platform.example.com
seqera ai
```

Set `SEQERA_AUTH_CLI_CLIENT_ID` only if your deployment uses a CLI OAuth client ID other than the default `seqera_ai_cli`.

For automated environments, use a Platform access token instead of browser login. Current CLI builds still require `SEQERA_AUTH_DOMAIN` so the CLI can target the correct Enterprise Platform authority.

```bash
export SEQERA_AUTH_DOMAIN=https://platform.example.com/api
export TOWER_ACCESS_TOKEN=<PLATFORM_ACCESS_TOKEN>
export SEQERA_AI_BACKEND_URL=https://ai-api.platform.example.com
seqera ai
```

Set `SEQERA_AUTH_CLI_CLIENT_ID` only for OAuth deployments that use a non-default CLI client ID. `SEQERA_ACCESS_TOKEN` and `TOWER_ACCESS_TOKEN` are supported for token-based authentication.

## Usage and cost

Usage and inference costs are managed by your organization through the configured inference provider, such as AWS Bedrock or Anthropic API.

## Security considerations

- Use HTTPS for every exposed hostname.
- Store all sensitive values in Kubernetes Secrets.
- Keep the agent backend Fernet token encryption key stable across upgrades. Changing it prevents the backend from decrypting existing encrypted values.
- For user-scoped operations, MCP uses the signed-in user's Platform token to call Platform APIs. Do not configure a shared administrator token for these calls.
- Use a separate MySQL database and user for the agent backend, even if they are hosted on the same MySQL instance as Platform.
- Enable Redis or Valkey TLS and MySQL TLS when your managed services require encrypted connections.

## Learn more

- [Co-Scientist in the Seqera CLI](../seqera-ai/index.md): Co-Scientist documentation.
- [Co-Scientist Helm example](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/examples/seqera-ai): Example Platform values for the Co-Scientist subcharts.
- [Agent backend chart](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/charts/agent-backend): Full agent backend values reference.
- [MCP chart](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/charts/mcp): Full MCP values reference.
- [Portal web chart](https://github.com/seqeralabs/helm-charts/tree/master/charts/platform/charts/portal-web): Full portal web values reference.

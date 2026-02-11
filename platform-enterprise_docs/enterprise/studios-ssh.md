---
title: "Studios SSH configuration"
description: Configure SSH access for Studios
date created: "2026-02-10"
tags: [studios, ssh, kubernetes, advanced]
---

:::warning[Advanced configuration]
SSH configuration requires careful consideration of security and networking. This feature requires network-level changes to your infrastructure that may need coordination with your infrastructure or networking team. Improperly configured SSH access may introduce security vulnerabilities.
:::

SSH access enables direct terminal connections to running Studio containers using standard SSH clients, supporting VS Code Remote SSH and terminal access.

## Version requirements

To use SSH access for Studios, you need:

- **Seqera Platform**: Version 25.3.3 or later
- **Connect server and proxy**: Version 0.10.0 or later
- **Connect client**: Version 0.10.0 or later

If you have pinned Studio container images to specific versions, you may need to update them to include the required Connect client version.

## Prerequisites

- Studios deployed (see [Studios installation](./install-studios))
- Access to Platform configuration
- Administrative access to modify your deployment infrastructure
- Ability to configure network routing and firewall rules
## Requirements overview

To enable SSH access for Studios you need:

1. **SSH key pair**: A key pair for the connect-proxy to authenticate to a Studio
2. **Platform configuration**: Environment variables to enable and configure SSH on the Platform backend pods
3. **Proxy configuration**: Environment variables to enable SSH on the connect-proxy
4. **Network configuration**: Layer 4 (TCP) access to the SSH port on the connect-proxy, typically via a dedicated service that separates SSH traffic from HTTPS traffic

:::note
Configuration variables are prefixed by service: `TOWER_` for Platform backend, `CONNECT_` for connect-proxy.
:::

## Step 1: Generate SSH key pair

SSH access to Studios requires a dedicated SSH key pair that establishes trust between the connect-proxy and Studio containers. This key pair serves two purposes:

1. **Authentication**: The connect-proxy uses the private key to authenticate to SSH servers running in Studio containers
2. **Security validation**: Platform can verify that SSH connections originate from your authorized connect-proxy rather than external sources

Generate an SSH key pair for the connect-proxy.

```bash
# Generate key
ssh-keygen -t ed25519 -C "connect-proxy" -f /path/to/connect-proxy-key

# Generate fingerprint
ssh-keygen -lf /path/to/connect-proxy-key
```

Platform uses the fingerprint output (SHA256 hash) in configuration to enable an additional security layer. After you configure this fingerprint, Studio SSH servers only accept connections from clients presenting this specific key, preventing unauthorized SSH access.

:::warning[Key consistency]
All proxy instances must use a **shared SSH key** to prevent host key verification errors. In high availability deployments, ensure all replicas access the shared key.
:::

### Key distribution

The SSH private key must be securely stored and accessible to all connect-proxy service instances. The method for distributing and mounting the key depends on your deployment platform's secrets management capabilities.

## Step 2: Configure Platform

Add the following environment variables to your Platform backend configuration. All Platform configuration variables use the `TOWER_` prefix:

```yaml
TOWER_DATA_STUDIO_CONNECT_SSH_KEY_FINGERPRINT: "SHA256:NEu6MAPGJpImFJ3raQzv6+NubCPy/92hqR+CVyMjKvM"
TOWER_DATA_STUDIO_SSH_ALLOWED_WORKSPACES: "12345,67890" # Comma-separated workspace IDs, or leave empty to disable
TOWER_SSH_KEYS_MANAGEMENT_ENABLED: "true"
TOWER_DATA_STUDIO_CONNECT_SSH_PORT: "2222"
TOWER_DATA_STUDIO_CONNECT_SSH_ADDRESS: ""
```

**Configuration details:**

- `TOWER_DATA_STUDIO_CONNECT_SSH_KEY_FINGERPRINT`: SSH key fingerprint from Step 1. After you configure this fingerprint, Studio SSH servers only accept connections using this key. This rejects connections not originating from your connect-proxy (recommended for security).
- `TOWER_DATA_STUDIO_SSH_ALLOWED_WORKSPACES`: Comma-separated workspace IDs allowed to use SSH. Set to an empty string to enable for all Platform Workspaces. Don't set the environment variable to disable the feature entirely.
- `TOWER_SSH_KEYS_MANAGEMENT_ENABLED`: Set to `true` to enable SSH key management in Platform.
- `TOWER_DATA_STUDIO_CONNECT_SSH_PORT`: SSH port (must match proxy configuration).
- `TOWER_DATA_STUDIO_CONNECT_SSH_ADDRESS`: Set this when SSH traffic uses a different DNS address than the regular connect URL. Use this when SSH traffic needs to bypass Layer 7 load balancers used for HTTPS traffic. If not set, the regular connect URL is used for SSH.

## Step 3: Configure proxy

Add the following configuration to the connect-proxy service. All connect-proxy configuration variables use the `CONNECT_` prefix:

**Environment variables:**
- `CONNECT_SSH_ENABLED`: Set to `true`
- `CONNECT_SSH_ADDR`: Set to `:2222` (or your chosen SSH port)
- `CONNECT_SSH_KEY_PATH`: Path to the SSH private key file (e.g., `/secrets/ssh-key`)

**Volume mounts:**
- Mount the SSH private key at the path specified in `CONNECT_SSH_KEY_PATH`
- Ensure the key is mounted read-only for security

The specific implementation depends on your deployment method (Kubernetes manifests, Helm values, Docker Compose, etc.).

## Step 4: Network access requirements

SSH access requires the following networking configuration in your infrastructure:

**Required:**
- Layer 4 (TCP) network access to the connect-proxy on the configured SSH port (default: 2222)
- DNS resolution to the connect-proxy SSH endpoint
- Firewall rules permitting SSH traffic on the configured port

**Recommended:**
- Separate network routing for SSH traffic from HTTP/HTTPS traffic for security
- If your existing load balancers operate at Layer 7 (HTTP/HTTPS), configure a separate endpoint for Layer 4 (TCP) SSH traffic and set `TOWER_DATA_STUDIO_CONNECT_SSH_ADDRESS` to this endpoint

:::note
Network configuration is specific to your infrastructure and deployment environment. This may require coordination with your infrastructure or networking team to ensure proper routing and security controls are in place.
:::

## Step 5: Apply configuration

After configuring all required settings:

1. Apply the updated Platform configuration and restart the Platform backend and cron services to load the new settings
2. Apply the updated connect-proxy configuration and restart the proxy service
3. Implement the network access requirements from Step 4

Verify that all services restart successfully and the configuration changes are active.

## Verify SSH access

1. Ensure Studios is enabled for your workspace.
2. Add a Studio with **SSH Connection** enabled.
3. Start the Studio.
4. Test SSH connection:

```bash
ssh <username>@<sessionId>@<connect-domain> -p 2222
```

For detailed usage instructions and VS Code setup, see [Connect to a Studio via SSH](../studios/managing#connect-to-a-studio-via-ssh).

## Troubleshooting

For SSH connection issues, see [Studios troubleshooting](../troubleshooting_and_faqs/studios_troubleshooting#ssh-connections).

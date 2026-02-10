---
title: "Studios: Kubernetes"
description: Deploy Studios on Kubernetes
date: "12 Apr 2023"
tags: [kubernetes, studios, deployment]
---

This guide describes how to deploy Studios for Seqera Platform Enterprise on Kubernetes.

## Prerequisites

Other than the basic requirements [already listed in the Studios installation overview](./install-studios#prerequisites), you will need:
- A Kubernetes cluster
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally

## Tool configuration

This procedure describes how to configure Studios for Seqera Enterprise deployments in Kubernetes. If you were using Studios prior to GA (v25.1) please review the `configmap.yaml` file and make sure you are using the latest version which includes a new variable `TOWER_DATA_STUDIO_TEMPLATES_<TEMPLATE_NAME>_TOOL`. This variable needs to be added to the default/Seqera-provided Studio templates:

`TOWER_DATA_STUDIO_TEMPLATES_<TEMPLATE_KEY>_TOOL: '<TOOL_NAME>'`

The `TEMPLATE_KEY` can be any string, but the `TOOL_NAME` has to be the template name (`jupyter`/`vscode`/`rstudio`/`xpra`).

You can also check the current template configuration using `https://towerurl/api/studios/templates?workspaceId=<WORKSPACE_ID>`. The response should include the `TOOL` configuration and template name (`jupyter`/`vscode`/`rstudio`/`xpra`) - not `custom`.

## Procedure

1. Download the Kubernetes manifests for the Studios service:

    - [Proxy](./_templates/k8s/data_studios/proxy.yml)
    - [Server](./_templates/k8s/data_studios/server.yml)

1. Change your Kubernetes context to the namespace where your Platform instance runs:

    ```bash
    kubectl config set-context --current --namespace=<namespace>
    ```

1. Edit the `server.yml` file and set the `CONNECT_REDIS_ADDRESS` environment variable to the hostname or IP address of the Redis server configured for Platform.

1. Create an initial OIDC registration token, which can be any secure random string. For example, using openssl:

    ```bash
    oidc_registration_token=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
    ```

1. Edit the `proxy.yml` file and set the following variables:

    - `CONNECT_REDIS_ADDRESS`: The hostname or IP address of the Redis server configured for Seqera.
    - `CONNECT_PROXY_URL`: A URL for the connect proxy subdomain (e.g., `https://connect.example.com`).
    - `PLATFORM_URL`: The base URL for your installation (e.g., `https://platform.example.com/` or `https://example.com/`).
    - `CONNECT_OIDC_CLIENT_REGISTRATION_TOKEN`: The same value as the `oidc_registration_token` value created previously.

1. Edit the `ingress.<YOUR-INGRESS-FILE>.yml` file appropriate for your Kubernetes environment:

    - Uncomment the `host` section at the bottom of the file.
    - Replace `<YOUR-TOWER-HOST-NAME>` with the base domain of your installation.

    :::note
    In the case you're using AWS EKS, this assumes that you have an existing Seqera ingress already configured with the following fields:

    - `alb.ingress.kubernetes.io/certificate-arn`: The ARN of a wildcard TLS certificate that secures the Platform URL and connect proxy URL. For example, if `TOWER_SERVER_URL=https://example.com` and `CONNECT_PROXY_URL=https://connect.example.com`, the certificate must secure `example.com`, and `*.example.com` at the same time; otherwise, you may need to create a second ingress resource specifically for Studios.
    :::

1. Generate an RSA public/private key pair. A key size of at least 2048 bits is recommended. In the following example, the `openssl` command is used to generate the key pair:

    ```bash
    openssl genrsa -out private.pem 2048
    openssl rsa -pubout -in private.pem -out public.pem
    ```

1. Download the [data-studios-rsa.pem](./_templates/docker/data-studios-rsa.pem) file and replace its contents with the content of your private and public key files created in the previous step, in the same order (private key on top, public key directly beneath it).

1. Apply a base64 encoding to the PEM file:

    ```bash
    base64_pem=$(cat data-studios-rsa.pem | base64 -w0)
    ```

1. Create a secret file named `secret.yml`:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: platform-oidc-certs
      namespace: platform-stage
    data:
      oidc.pem: <BASE64_ENCODED_PEM_FILE>
    ```

1. Create the secret:

    ```bash
    kubectl apply -f secret.yml
    ```

1. Edit the `tower-svc.yml` file and uncomment the `volumes.cert-volume`, `volumeMounts.cert-volume`, and `env.TOWER_OIDC_PEM_PATH` fields.

1. Edit the ConfigMap named `platform-backend-cfg` in the `configmap.yml` by changing the following environment variables:

   - `TOWER_DATA_STUDIO_CONNECT_URL`: The URL of the Studios connect proxy, such as `https://connect.example.com/`.
   - `TOWER_OIDC_REGISTRATION_INITIAL_ACCESS_TOKEN`: The same value as the `oidc_registration_token` value created previously.

1. From Platform v26.1, Studios is enabled by default on all workspaces. To enable Studios on specific workspaces only, set the `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES` environment variable (e.g., `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES="12345,67890"`) on the Platform backend containers. To disable Studios for all workspaces, set `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES=""` (an empty string).

1. Apply the updated configuration:

    ```bash
    kubectl apply -f configmap.yml
    ```

1. Apply the configuration change to Platform:

    ```bash
    kubectl apply -f tower-svc.yml
    ```

1. Restart the cron service of your deployment to load the updated configuration. For example:

    ```bash
    kubectl rollout restart deployment/cron
    ```

1. Restart the Platform backend service of your deployment to load the updated configuration. For example:

    ```bash
    kubectl rollout restart deployment/backend
    ```

1. Apply the updated ingress file and the Studios manifests:

    ```bash
    kubectl apply -f ingress.<YOUR-INGRESS-FILE>.yml proxy.yml server.yml
    ```

1. To confirm that Studios is available, log into Seqera and navigate to an organizational workspace that has Studios enabled. The **Studios** tab should be displayed in the sidebar.

### SSH connection

SSH access enables direct terminal connections to running Studio containers using standard SSH clients, supporting VS Code Remote SSH and terminal access.

:::info[**Version Requirements**]
| Seqera Platform | connect-server/proxy | connect-client |
|-----------------|----------------------|----------------|
| 25.3.3+         | 0.10.0+              | 0.10.0+        |
:::

#### Step 1: Generate SSH key pair

Generate an SSH key pair for the proxy:

```bash
# Generate key
ssh-keygen -t ed25519 -C "connect-proxy" -f /path/to/connect-proxy-key

# Generate fingerprint
ssh-keygen -lf /path/to/connect-proxy-key
```

:::warning
All proxy pods must use the **same SSH key** to prevent host key verification errors.
:::

**Deployment options:**

- Create Kubernetes secret and mount as file
- Mount key files directly as volumes

**Example Kubernetes secret:**

```bash
kubectl create secret generic connect-ssh-key \
  --from-file=ssh-key=/path/to/connect-proxy-key \
  --namespace=<namespace>
```

#### Step 2: Configure Platform

Set the SSH key fingerprint in Platform (recommended for enhanced security):

```bash
TOWER_DATA_STUDIO_CONNECT_SSH_KEY_FINGERPRINT=SHA256:NEu6MAPGJpImFJ3raQzv6+NubCPy/92hqR+CVyMjKvM
```

Add to the `configmap.yml` under `platform-backend-cfg`:

```yaml
TOWER_DATA_STUDIO_CONNECT_SSH_KEY_FINGERPRINT: "SHA256:NEu6MAPGJpImFJ3raQzv6+NubCPy/92hqR+CVyMjKvM"
TOWER_DATA_STUDIO_SSH_ALLOWED_WORKSPACES: "12345,67890"  # Comma-separated workspace IDs, or leave empty to disable
TOWER_SSH_KEYS_MANAGEMENT_ENABLED: "true"
TOWER_DATA_STUDIO_CONNECT_SSH_PORT: "2222"  # Default: 22, set to match your SSH service port
TOWER_DATA_STUDIO_CONNECT_SSH_ADDRESS: ""  # Optional: Set only if SSH runs on different domain
```

:::tip[Enhanced security]
When `TOWER_DATA_STUDIO_CONNECT_SSH_KEY_FINGERPRINT` is configured, studio SSH servers only accept connections from clients using this key, effectively rejecting any connection not originating from your connect-proxy.
:::

#### Step 3: Configure proxy

Edit the `proxy.yml` file and add SSH configuration:

```yaml
env:
  - name: CONNECT_SSH_ENABLED
    value: "true"
  - name: CONNECT_SSH_ADDR
    value: ":2222"
  - name: CONNECT_SSH_KEY_PATH
    value: "/secrets/ssh-key"
volumeMounts:
  - name: ssh-key
    mountPath: /secrets
    readOnly: true
volumes:
  - name: ssh-key
    secret:
      secretName: connect-ssh-key
```

#### Step 4: Expose SSH service

Your infrastructure setup depends on whether you want SSH on the same domain as connect-proxy or a separate domain.

**Option A: Same domain as proxy** (requires infrastructure setup)

Create a dedicated NodePort service for SSH traffic on port 2222. Configure your load balancer or ingress to route SSH traffic to this NodePort.

Example NodePort service (`proxy-ssh-nodeport.yml`):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: proxy-ssh
  namespace: <namespace>
spec:
  type: NodePort
  selector:
    app: proxy
  ports:
    - port: 2222
      targetPort: 2222
      nodePort: 30222  # Choose an available NodePort
      protocol: TCP
```

**Option B: Separate SSH domain**

Define a separate LoadBalancer service for SSH:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: proxy-ssh
  namespace: <namespace>
spec:
  type: LoadBalancer
  selector:
    app: proxy
  ports:
    - port: 2222
      targetPort: 2222
      protocol: TCP
```

Point DNS to the SSH service load balancer.

#### Step 5: Apply configuration

```bash
# Apply updated configmap
kubectl apply -f configmap.yml

# Restart Platform services
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/cron

# Apply proxy configuration
kubectl apply -f proxy.yml

# Apply SSH service
kubectl apply -f proxy-ssh-nodeport.yml  # or proxy-ssh-loadbalancer.yml
```

#### Verify SSH access

1. Ensure Studios is enabled for your workspace.
2. Add a Studio with **SSH Connection** enabled.
3. Start the Studio.
4. Test SSH connection:

```bash
ssh <username>@<sessionId>@<connect-domain> -p 2222
```

For detailed usage instructions and VS Code setup, see [Connect to a Studio via SSH](../studios/managing#connect-to-a-studio-via-ssh).

#### Troubleshooting

For SSH connection issues, see [Studios troubleshooting](../troubleshooting_and_faqs/studios_troubleshooting#ssh-connections).

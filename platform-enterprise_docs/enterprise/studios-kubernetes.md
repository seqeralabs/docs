---
title: "Studios: Kubernetes"
description: Deploy Studios on Kubernetes
date: "12 Apr 2023"
tags: [kubernetes, studios, deployment]
---

This guide describes how to deploy Studios for Seqera Platform Enterprise on Kubernetes.

Refer to the [Studios installation overview](./install-studios) for prerequisites and configuration options.

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

1. Edit your `ingress.eks.yml` file:

    - Uncomment the `host` section at the bottom of the file.
    - Replace `<YOUR-TOWER-HOST-NAME>` with the base domain of your installation.

    :::note
    This assumes that you have an existing Seqera ingress already configured with the following fields:

    - `alb.ingress.kubernetes.io/certificate-arn`: The ARN of a wildcard TLS certificate that secures your URL and connect proxy URL. For example, if `TOWER_SERVER_URL=https://example.com` and `CONNECT_PROXY_URL=https://connect.example.com`, the certificate must secure both `example.com` and `*.example.com`.
    - `alb.ingress.kubernetes.io/load-balancer-attributes`: The attributes of the ALB Load Balancer used in your installation.
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

1. Edit the ConfigMap named `tower-yml` in the `configmap.yml` and include the following snippet:

    ```yaml
    data:
      tower.yml: |-
        tower:
          data-studio:
            allowed-workspaces: null
    ```

    Alternatively, you can specify a comma-separated list of workspace IDs to enable Studios only on those workspaces.

    ```yaml
    tower:
      data-studio:
        allowed-workspaces: [12345,67890]
    ```

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

1. Apply the Studios manifests:

    ```bash
    kubectl apply -f ingress.eks.yml proxy.yml server.yml
    ```

    It can take several minutes for Kubernetes to apply your changes, during which new pods are rolled out.

1. To confirm that Studios is available, log into Seqera and navigate to an organizational workspace that has Studios enabled. The **Studios** tab should be displayed in the sidebar.

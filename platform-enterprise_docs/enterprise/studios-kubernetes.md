---
title: "Studios: Kubernetes"
description: Deploy Studios on Kubernetes
date: "12 Apr 2023"
tags: [kubernetes, studios, deployment]
---

This guide describes how to deploy Studios for Seqera Platform Enterprise on Kubernetes.

Refer to the [Studios installation overview](./install-studios) for prerequisites and configuration options.

## Procedure

1. Download the Kubernetes manifests for the Studios service:

    - [Proxy](./_templates/k8s/data_studios/proxy.yml)
    - [Server](./_templates/k8s/data_studios/server.yml)

1. Change your Kubernetes context to the namespace where your Platform instance runs:

    ```bash
    kubectl config set-context --current --namespace=<namespace>
    ```

1. Edit the `server.yml` file and set the `CONNECT_REDIS_ADDRESS` environment variable to the hostname or IP address of the Redis server configured for Platform.

1. Create an initial OIDC registration token:

    ```bash
    oidc_registration_token=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
    ```

1. Edit the `proxy.yml` file and set the following variables:

    - `CONNECT_REDIS_ADDRESS`: The hostname or IP address of the Redis server configured for Seqera.
    - `CONNECT_PROXY_URL`: A URL for the connect proxy subdomain (e.g., `https://connect.example.com`).
    - `PLATFORM_URL`: The base URL for your installation (e.g., `https://example.com/`).
    - `CONNECT_OIDC_CLIENT_REGISTRATION_TOKEN`: The same value as the `oidc_registration_token` value created previously.

1. Edit your `ingress.eks.yml` file:

    - Uncomment the `host` section at the bottom of the file.
    - Replace `<YOUR-TOWER-HOST-NAME>` with the base domain of your installation.

1. Generate an RSA public/private key pair:

    ```bash
    openssl genrsa -out private.pem 2048
    openssl rsa -pubout -in private.pem -out public.pem
    ```

1. Download the [data-studios-rsa.pem](./_templates/docker/data-studios-rsa.pem) file and replace its contents with the content of your private and public key files (private key on top, public key directly beneath it).

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

1. Edit the ConfigMap named `platform-backend-cfg` in the `configmap.yml`:

   - `TOWER_DATA_STUDIO_CONNECT_URL`: The URL of the Studios connect proxy (e.g., `https://connect.example.com/`).
   - `TOWER_OIDC_REGISTRATION_INITIAL_ACCESS_TOKEN`: The same value as the `oidc_registration_token` value created previously.

1. Edit the ConfigMap named `tower-yml` in the `configmap.yml`:

    ```yaml
    data:
      tower.yml: |-
        tower:
          data-studio:
            allowed-workspaces: null
    ```

1. Apply the updated configuration:

    ```bash
    kubectl apply -f configmap.yml
    kubectl apply -f tower-svc.yml
    ```

1. Restart the cron and backend services:

    ```bash
    kubectl rollout restart deployment/backend deployment/cron
    ```

1. Apply the Studios manifests:

    ```bash
    kubectl apply -f ingress.aks.yml proxy.yml server.yml
    ```

1. Verify Studios is available by logging into Seqera and navigating to an organizational workspace. The **Studios** tab should be displayed.

## Configuration

See [Studios deployment](./studios) for DNS configuration, workspace availability, and environment image options.

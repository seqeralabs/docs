---
title: "Data Studios deployment"
description: Deploy Seqera Platform Enterprise with Data studios
date: "12 Jun 2024"
tags: [docker, compose, kubernetes, data, studios, deployment]
---

Enable Data Studios as part of your Seqera Platform Enterprise instance. You must have Data Explorer enabled to use Data Studios. Only the AWS public cloud is currently supported.

:::caution
You must complete the upgrade of your Seqera Enterprise installation to version 24.1.4 before enabling and configuring Data Studios.
:::

## DNS configuration

Each data studio is reachable at a unique URL that includes a randomly generated subdomain name. For example: `https://abcd.example.com/`, where `example.com` is your Seqera base domain name.

Provide a wildcard TLS certificate to allow for uniquely generated subdomains. A wildcard certificate common name includes `*.` in the domain name, such as `*.example.com`, thereby securing any subdomain name at this level.

Data Studios uses the following set of domains and subdomains:

- The domain that you set for `TOWER_SERVER_URL`, such as `example.com`.
- A wildcard subdomain that you must configure specifically for Data Studios. This wildcard subdomain is the parent for each unique data studios session URL, such as `abcd.example.com`.
- The connection proxy, defined by `CONNECT_PROXY_URL`. This URL is a first-level subdomain of your `TOWER_SERVER_URL`. For example, `https://connect.example.com`.

## Data Studios workspace availability

You can configure which organizational workspaces have access to Data Studios. This configuration is set in the `tower.yml` file. The `tower.data-studio.allowed-workspaces` field supports the following options:

- `allowed-workspaces: []`: Disables Data Studios. This is the default if the `allowed-workspaces` field is not specified.
- `allowed-workspaces: [ <WORKSPACE_ID>,<WORKSPACE_ID> ]`: Enables Data Studios for the comma-separated list of organizational workspace IDs.
- `allowed-workspaces: null`: Enables Data Studios for all organizational workspaces.

## Available data studio environment images

Each of the provided Data Studios environments includes a particular version of the underlying data analytics software package.

To quickly identify which version of the software an image includes, the version string for each container is in the form of `<software_version>-<seqera_version>`. For example, if the version string for the RStudio Server is `4.4.1-0.7.4`, version `4.4.1` is the RStudio version and `0.7.4` is the version of this Seqera-built container image.

The latest environment versions are listed below:

- JupyterLab: `public.cr.seqera.io/platform/data-studio-jupyter:4.1.5-0.7.4`
- RStudio Server: `public.cr.seqera.io/platform/data-studio-rstudio:4.4.1-0.7.4`
- Visual Studio Code: `public.cr.seqera.io/platform/data-studio-vscode:1.83.0-0.7.4`
- Xpra: `public.cr.seqera.io/platform/data-studio-xpra:6.0-r0-1-0.7.4`

## Docker Compose

This guide assumes that all services will be run in the same container as the rest of your Seqera Platform services.

### Prerequisites

- Allow inbound traffic to port 9090 on the EC2 instance
- Allow traffic on port 9090 through the AWS LB (Load Balancer)
- An AWS Route53 wildcard DNS record, such as `*.<seqera_platform_domain>`

### Procedure

1. Download the Data Studios [environment configuration file](./_templates/docker/data-studios.env).

1. Create an initial OIDC registration token, which can be any secure random string. For example, using openssl:

   ```
   oidc_registration_token=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
   ```

1. Generate an RSA public/private key pair. A key size of at least 2048 bits is recommended. For example, use `openssl` to generate the key pair:

   ```shell
   openssl genrsa -out private.pem 2048
   openssl rsa -pubout -in private.pem -out public.pem
   ```

1. Download the [data-studios-rsa.pem](./_templates/docker/data-studios-rsa.pem) file and replace its contents with the content of your private and public key files, in the same order (private key on top, public key directly beneath it). Save the file as `data-studios-rsa.pem`, in the same directory as your `docker-compose.yml` file.

1. Open the `docker-compose.yml` and uncomment the volume mount for the PEM key file for the `backend` and `cron` services in the `volumes` list. Your PEM file must be named `data-studios-rsa.pem`.

   ```yaml
   volumes:
     - $PWD/tower.yml:/tower.yml
     # An RSA key is required for Data Studios functionality. Uncomment the line below to mount the key.
     #- $PWD/data-studios-rsa.pem:/data-studios-rsa.pem
   ```

1. Open `data-studios.env` in an editor, and make the following changes:

   1. Uncomment the `connect-proxy` and `connect-server` services.
   1. Set the following environment variables:
      - `PLATFORM_URL`: The same value assigned to `TOWER_SERVER_URL`. For example, `https://example.com`.
      - `CONNECT_PROXY_URL`: A URL for the connect proxy subdomain. We recommend you set a first-level subdomain of your `PLATFORM_URL` for your connect proxy. For example, `https://connect.example.com`.
      - `CONNECT_OIDC_CLIENT_REGISTRATION_TOKEN`: The same value set in the `oidc_registration_token` environment variable.

1. Open `tower.env` in an editor and set the following variables:

   - `TOWER_DATA_EXPLORER_ENABLED`: Set `true` to enable Data Explorer. You must enable Data Explorer to mount data inside a data studio instance.
   - `TOWER_DATA_STUDIO_CONNECT_URL`: The URL of the Data Studios connect proxy, such as `https://connect.example.com/`.
   - `TOWER_OIDC_REGISTRATION_INITIAL_ACCESS_TOKEN`: The same value set in the `oidc_registration_token` environment variable.
   - `TOWER_OIDC_PEM_PATH`: The file path to a PEM certificate used for signing the OIDC tokens for the OpenID connect provider, mounted as a volume inside the container.

1. Edit the `tower.yml` file and include the following snippet to enable Data Studios in all organization workspaces:

   ```yaml
   tower:
     data-studio:
       allowed-workspaces: null
   ```

1. Start your Platform instance: `docker compose -d up`.

1. Confirm that the Platform containers are running:

   ```
   docker ps
   ```

1. To confirm that Data Studios is available, log in to your Platform instance and navigate to an organizational workspace that has Data Studios enabled. The **Data Studios** tab is included with the available tabs.

## Kubernetes

This procedure describes how to configure Data Studios for Kubernetes deployments of Seqera Platform.

### Procedure

1. Download the Kubernetes manifests for the Data Studios service:

   - [Proxy](./_templates/k8s/data_studios/proxy.yml)
   - [Server](./_templates/k8s/data_studios/server.yml)

1. Change your Kubernetes context to the namespace where your Platform instance runs:

   ```
   kubectl config set-context --current --namespace=<namespace>
   ```

1. Edit the `server.yml` file and set the `CONNECT_REDIS_ADDRESS` environment variable to the hostname or IP address of the Redis server configured for Platform.

1. Create an initial OIDC registration token, which can be any secure random string. For example, using openssl:

   ```
   oidc_registration_token=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
   ```

1. Edit the `proxy.yml` file and set the following variables:

   - `CONNECT_REDIS_ADDRESS`: The hostname or IP address of the Redis server configured for Platform.
   - `CONNECT_PROXY_URL`: A URL for the connect proxy subdomain. We recommend you set a first-level subdomain of your Platform installation domain (`PLATFORM_URL` below) for your connect proxy, to be able to use the same wildcard TLS certificate for all data studio instance URLs and avoid additional domain nesting. For example, `https://connect.example.com`.
   - `PLATFORM_URL`: The base URL for your Platform installation, such as `https://example.com/`.
   - `CONNECT_OIDC_CLIENT_REGISTRATION_TOKEN`: The same value as the `oidc_registration_token` value created previously.

1. Edit your Platform installation's `ingress.eks.yml` file:

   - Uncomment the `host` section at the bottom of the file.
   - Replace `<YOUR-TOWER-HOST-NAME>` with the base domain of your Platform installation. For example, `example.com`.

   :::note
   This assumes that you have an existing Platform installation Ingress already configured with the following fields:

   - `alb.ingress.kubernetes.io/certificate-arn`: The ARN of a wildcard TLS certificate that secures your Platform URL and connect proxy URL. For example, if `CONNECT_PROXY_URL=https://example.com`, the certificate must secure both `example.com` and `*.example.com`.
   - `alb.ingress.kubernetes.io/load-balancer-attributes`: The attributes of the ALB Load Balancer used in your Platform installation.
     :::

1. Generate an RSA public/private key pair. A key size of at least 2048 bits is recommended. In the following example, the `openssl` command is used to generate the key pair:

   ```shell
     openssl genrsa -out private.pem 2048
     openssl rsa -pubout -in private.pem -out public.pem
   ```

1. Download the [data-studios-rsa.pem](./_templates/docker/data-studios-rsa.pem) file and replace its contents with the content of your private and public key files created in the previous step, in the same order (private key on top, public key directly beneath it).

1. Apply a base64 encoding to the PEM file that you created in the previous step:

   ```
   base64_pem=$(cat data-studios-rsa.pem | base64)
   ```

1. Create a Secret file named `secret.yml` and set the `oidc.pem` key by pasting the contents of the base64-encoded public/private key pair:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: platform-oidc-certs
     namespace: platform-stage
   data:
     oidc.pem: <BASE64_ENCODED_PEM_FILE>
   ```

1. Create the Secret:

   ```
   kubectl apply -f secret.yml
   ```

1. Edit the `tower-svc.yml` file and uncomment the `volumes.cert-volume`, `volumeMounts.cert-volume`, and `env.TOWER_OIDC_PEM_PATH` fields so that the public/private key pair is available to Platform.

1. Edit the ConfigMap named `platform-backend-cfg` in the `configmap.yml` for Platform by editing the following environment variables:

   - `TOWER_DATA_STUDIO_CONNECT_URL`: The URL of the Data Studios connect proxy, such as `https://connect.example.com/`.
   - `TOWER_OIDC_REGISTRATION_INITIAL_ACCESS_TOKEN`: The same value as the `oidc_registration_token` value created previously.

1. Edit the ConfigMap named `tower-yml` in the `configmap.yml` and include the following snippet:

   ```yaml
   data:
     tower.yml: |-
       tower:
         data-studio:
           allowed-workspaces: null
   ```

1. Apply the updated configuration:

   ```
   kubectl apply -f configmap.yml
   ```

1. Apply the configuration change to Platform:

   ```
   kubectl apply -f tower-svc.yml
   ```

1. Restart the cron service of your Platform deployment to load the updated configuration. For example:

   ```
   kubectl delete -f tower-cron.yml
   kubectl apply -f tower-cron.yml
   ```

1. Restart the backend service of your Platform deployment to load the updated configuration. For example:

   ```
   kubectl scale --replicas=0 deployment/backend
   kubectl scale --replicas=1 deployment/backend
   ```

1. Apply the Data Studios manifests:

   ```
   kubectl apply -f ingress.aks.yml proxy.yml server.yml
   ```

   It can take several minutes for Kubernetes to apply your changes, during which new pods are rolled out.

1. To confirm that Data Studios is available, log in to your Platform instance and navigate to an organizational workspace that has Data Studios enabled. The **Data Studios** tab is included with the available tabs.

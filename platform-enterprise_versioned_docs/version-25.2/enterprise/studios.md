---
title: "Studios deployment"
description: Deploy Seqera Platform with Studios
date: "17 Mar 2025"
tags: [docker, compose, kubernetes, studios, deployment]
---

Enable Studios as part of your Seqera Platform Enterprise instance. You must have Data Explorer enabled to use Studios. Only the AWS public cloud is currently supported.

:::caution 
You must upgrade your Seqera Enterprise installation to version 25.1 before you enable and configure Studios.
:::

## DNS configuration

Each Studio is reachable at a unique URL that includes a randomly generated subdomain name. For example: `https://abcd.example.com/`, where `example.com` is your Seqera base domain name.

Provide a wildcard TLS certificate to allow for uniquely generated subdomains. A wildcard certificate common name includes `*.` in the domain name, such as `*.example.com`, thereby securing any subdomain name at this level.

:::info
If your Enterprise deployment requires non-wildcard SSL certificates, enable path-based routing for Studios. This changes the dynamic subdomain used for each Studio session to a fixed subdomain with path-based routing.

- When `TOWER_DATA_STUDIO_ENABLE_PATH_ROUTING` is omitted, empty, or `false`:
    - https://a1234abc.connect.cloud.seqera.io/
    - https://a5678abcd.connect.cloud.seqera.io/

- When `TOWER_DATA_STUDIO_ENABLE_PATH_ROUTING=true`:
    - https://connect.connect.cloud.seqera.io/_studio/a1234abc
    - https://connect.connect.cloud.seqera.io/_studio/a5678abcd

Path routing is only available from Seqera Platform version 25.2 and the latest Connect server and clients. It is supported for VS Code, Jupyter, and R-IDE. It is not supported for Xpra.
:::

Studios uses the following set of domains and subdomains:

- The domain that you set for `TOWER_SERVER_URL`, such as `example.com`.
- A wildcard subdomain that you must configure specifically for Studios. This wildcard subdomain is the parent for each unique session URL, such as `abcd.example.com`.
- The connection proxy, defined by `CONNECT_PROXY_URL`. This URL is a first-level subdomain of your `TOWER_SERVER_URL`. For example, `https://connect.example.com`.

## Studios workspace availability

You can configure which organizational workspaces have access to Studios. This configuration is set in the `tower.yml` file. The `tower.data-studio.allowed-workspaces` field supports the following options:

- `allowed-workspaces: []`: Disables Studios. This is the default if the `allowed-workspaces` field is not specified.
- `allowed-workspaces: [ <WORKSPACE_ID>,<WORKSPACE_ID> ]`: Enables Studios for the comma-separated list of organizational workspace IDs.
- `allowed-workspaces: null`: Enables Studios for all organizational workspaces.

## Available Studio environment images

Each of the provided environments includes a particular version of the underlying software package and the version of Seqera Connect, an integrated web- and file-server.

To quickly identify which version of the software an image includes, the version string for each container is in the form of `<software_version>-<seqera_connect_version>`. For example, if the version string for the R-IDE is `2025.04.1-0.8`, version `2025.04.01` is the R-IDE version and `0.8` is the Connect version of this Seqera-built container image. Learn more about Studios [environment versioning](../studios/overview#container-image-templates).

- To see the list of all JupyterLab image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/repo/platform/data-studio-jupyter][ds-jupyter].
- To see the list of all R-IDE image templates available, including security scan results or to inspect the container specification, see [https://public.cr.seqera.io/repo/platform/data-studio-ride][ds-ride].
- To see the list of all Visual Studio Code image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/platform/data-studio-vscode][ds-vscode].
- To see the list of all Xpra image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/repo/platform/data-studio-xpra][ds-xpra].

Security scans and container inspection reports (including container specifications, configuration, and manifest) are available on-demand at public.cr.seqera.io/platform for each environment images by selecting the `Scan` and `Inspect` icons respectively. When adding a new Studio in Platform, the latest environment versions are tagged `recommended`, and earlier compatible versions are tagged `deprecated`.

## Docker Compose

This guide assumes that all services will be run in the same container as the rest of your Seqera Platform services.

If you were using Studios prior to GA (v25.1) please review the `tower.env` file and make sure you are using the latest version which includes a new variable `TOWER_DATA_STUDIO_TEMPLATES_<TEMPLATE_KEY>_TOOL`. This variable needs to be added to the default/Seqera-provided Studio templates:

`TOWER_DATA_STUDIO_TEMPLATES_<TEMPLATE_KEY>_TOOL: '<TOOL_NAME>'`

The `TEMPLATE_KEY` can be any string, but the `TOOL_NAME` has to be the template name (`jupyter`/`vscode`/`rstudio`/`xpra`).

You can also check the current template configuration using `https://towerurl/api/studios/templates?workspaceId=<WORKSPACE_ID>`. The response should include the `TOOL` configuration and template name (`jupyter`/`vscode`/`rstudio`/`xpra`) - not `custom`.

### Prerequisites

- Allow inbound traffic to port 9090 on the EC2 instance
- Allow traffic on port 9090 through the AWS LB (Load Balancer)
- An AWS Route53 wildcard DNS record, such as `*.<seqera_platform_domain>`

### Procedure

1. Download the Studios [environment configuration file](./_templates/docker/data-studios.env).
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
      # An RSA key is required for Studios functionality. Uncomment the line below to mount the key.
      #- $PWD/data-studios-rsa.pem:/data-studios-rsa.pem
    ```

1. Open `data-studios.env` in an editor, and make the following changes:

    1. Uncomment the `connect-proxy` and `connect-server` services.
    1. Set the following environment variables:
        - `PLATFORM_URL`: The same value assigned to `TOWER_SERVER_URL`. For example, `https://example.com`.
        - `CONNECT_PROXY_URL`: A URL for the connect proxy subdomain. We recommend you set a first-level subdomain of your `PLATFORM_URL` for your connect proxy. For example, `https://connect.example.com`.
        - `CONNECT_OIDC_CLIENT_REGISTRATION_TOKEN`: The same value set in the `oidc_registration_token` environment variable.

1. Open `tower.env` in an editor and set the following variables:

    - `TOWER_DATA_EXPLORER_ENABLED`: Set `true` to enable Data Explorer. You must enable Data Explorer to mount data inside a Studio.
    - `TOWER_DATA_STUDIO_CONNECT_URL`: The URL of the Studios connect proxy, such as `https://connect.example.com/`.
    - `TOWER_OIDC_REGISTRATION_INITIAL_ACCESS_TOKEN`: The same value set in the `oidc_registration_token` environment variable.
    - `TOWER_OIDC_PEM_PATH`: The file path to a PEM certificate used for signing the OIDC tokens for the OpenID connect provider, mounted as a volume inside the container.

1. Edit the `tower.yml` file and include the following snippet to enable Studios in all organization workspaces:

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

1. To confirm that Studios is available, log in to your Platform instance and navigate to an organizational workspace that has Studios enabled. The **Studios** tab is included with the available tabs.

## Kubernetes

This procedure describes how to configure Studios for Seqera Enterprise deployments in Kubernetes. If you were using Studios prior to GA (v25.1) please review the `configmap.yaml` file and make sure you are using the latest version which includes a new variable `TOWER_DATA_STUDIO_TEMPLATES_<TEMPLATE_NAME>_TOOL` which needs to be added to the default/Seqera-provided Studio templates:

`TOWER_DATA_STUDIO_TEMPLATES_<TEMPLATE_KEY>_TOOL: '<TOOL_NAME>'`

The `TEMPLATE_KEY` can be any string, but the `TOOL_NAME` has to be the template name (`jupyter`/`vscode`/`rstudio`/`xpra`).

You can also check the current template configuration using `https://towerurl/api/studios/templates?workspaceId=<WORKSPACE_ID>`. The response should include the `TOOL` configuration and template name (`jupyter`/`vscode`/`rstudio`/`xpra`) - not `custom`.

### Procedure

1. Download the Kubernetes manifests for the Studios service:

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
    - `CONNECT_PROXY_URL`: A URL for the connect proxy subdomain. We recommend you set a first-level subdomain of your Platform installation domain (`PLATFORM_URL` below) for your connect proxy, to be able to use the same wildcard TLS certificate for all session URLs and avoid additional domain nesting. For example, `https://connect.example.com`.
    - `PLATFORM_URL`: The base URL for your Platform installation, such as `https://example.com/`.
    - `CONNECT_OIDC_CLIENT_REGISTRATION_TOKEN`: The same value as the `oidc_registration_token` value created previously.

1. Edit your Platform installation's `ingress.eks.yml` file:

    - Uncomment the `host` section at the bottom of the file.
    - Replace `<YOUR-TOWER-HOST-NAME>` with the base domain of your Platform installation. For example, `example.com`.

    :::note
    This assumes that you have an existing Platform installation Ingress already configured with the following fields:

    - `alb.ingress.kubernetes.io/certificate-arn`: The ARN of a wildcard TLS certificate that secures your Platform URL and connect proxy URL. For example, if `TOWER_SERVER_URL=https://example.com` and `CONNECT_PROXY_URL=https://connect.example.com`, the certificate must secure both `example.com` and `*.example.com`.
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

1. Create a secret file named `secret.yml` and set the `oidc.pem` key by pasting the contents of the base64-encoded public/private key pair:

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

    ```
    kubectl apply -f secret.yml
    ```

1. Edit the `tower-svc.yml` file and uncomment the `volumes.cert-volume`, `volumeMounts.cert-volume`, and `env.TOWER_OIDC_PEM_PATH` fields so that the public/private key pair is available to Platform.
1. Edit the ConfigMap named `platform-backend-cfg` in the `configmap.yml` for Platform by editing the following environment variables:

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

1. Apply the Studios manifests:

    ```
    kubectl apply -f ingress.aks.yml proxy.yml server.yml
    ```

    It can take several minutes for Kubernetes to apply your changes, during which new pods are rolled out.

1. To confirm that Studios is available, log in to your Platform instance and navigate to an organizational workspace that has Studios enabled. The **Studios** tab is included with the available tabs.

---
title: "Studios: Docker Compose"
description: Deploy Studios with Docker Compose
date: "12 Apr 2023"
tags: [docker, compose, studios, deployment]
---

This guide describes how to deploy Studios for Seqera Platform Enterprise with Docker Compose.

## Prerequisites

Other than the basic requirements [already listed in the Studios installation overview](./install-studios#prerequisites), you will need:
- Docker Engine and Docker Compose

## Procedure

1. Create a folder for Connect metadata:

    ```bash
    mkdir -p $HOME/.tower/connect
    chmod 777 $HOME/.tower/connect
    ```

1. Download the Studios [environment configuration file](./_templates/docker/data-studios.env).

1. Create an initial OIDC registration token:

    ```bash
    oidc_registration_token=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
    ```

1. Generate an RSA public/private key pair:

    ```bash
    openssl genrsa -out private.pem 2048
    openssl rsa -pubout -in private.pem -out public.pem
    ```

1. Download the [data-studios-rsa.pem](./_templates/docker/data-studios-rsa.pem) file and replace its contents with the content of your private and public key files (private key on top, public key directly beneath it). Save as `data-studios-rsa.pem` in the same directory as your `docker-compose.yml`.

1. Open `docker-compose.yml` and uncomment the volume mount for the PEM key file for the `backend` and `cron` services:

    ```yaml
    volumes:
      - $PWD/tower.yml:/tower.yml
      - $PWD/data-studios-rsa.pem:/data-studios-rsa.pem
    ```

1. Open `data-studios.env` and set the following:

    - Uncomment the `connect-proxy` and `connect-server` services.
    - `PLATFORM_URL`: The same value as `TOWER_SERVER_URL` (e.g., `https://platform.example.com/` or `https://example.com/`).
    - `CONNECT_PROXY_URL`: A URL for the connect proxy subdomain (e.g., `https://connect.example.com`).
    - `CONNECT_OIDC_CLIENT_REGISTRATION_TOKEN`: The same value as `oidc_registration_token`.

1. Open `tower.env` and set the following:

    - `TOWER_DATA_EXPLORER_ENABLED`: Set to `true`.
    - `TOWER_DATA_STUDIO_CONNECT_URL`: The URL of the Studios connect proxy (e.g., `https://connect.example.com/`).
    - `TOWER_OIDC_REGISTRATION_INITIAL_ACCESS_TOKEN`: The same value as `oidc_registration_token`.
    - `TOWER_OIDC_PEM_PATH`: The file path to the PEM certificate (e.g., `/data-studios-rsa.pem`).

1. From Platform v26.1, Studios is enabled by default on all workspaces. To enable Studios on specific workspaces only, set the `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES` environment variable (e.g., `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES="12345,67890"`) on the backend containers or edit the `tower-yml` file to provide a comma-separated list of workspace IDs.

    ```yaml
    tower:
      data-studio:
        allowed-workspaces: [12345,67890]
    ```

    Alternatively, you can specify a comma-separated list of workspace IDs to enable Studios only on those workspaces.

    ```yaml
    tower:
      data-studio:
        allowed-workspaces: [12345,67890]
    ```

1. Start your Platform instance:

    ```bash
    docker compose up -d
    ```

1. To confirm that Studios is available, log in to your Platform instance and navigate to an organizational workspace that has Studios enabled. The **Studios** tab is included with the available tabs.

## Tool Configuration

This guide assumes that all services will be run in the same container as the rest of your Seqera Platform services.

If you were using Studios prior to GA (v25.1) please review the `tower.env` file and make sure you are using the latest version which includes a new variable `TOWER_DATA_STUDIO_TEMPLATES_<TEMPLATE_KEY>_TOOL`. This variable needs to be added to the default/Seqera-provided Studio templates:

`TOWER_DATA_STUDIO_TEMPLATES_<TEMPLATE_KEY>_TOOL: '<TOOL_NAME>'`

The `TEMPLATE_KEY` can be any string, but the `TOOL_NAME` has to be the template name (`jupyter`/`vscode`/`rstudio`/`xpra`).

You can also check the current template configuration using `https://towerurl/api/studios/templates?workspaceId=<WORKSPACE_ID>`. The response should include the `TOOL` configuration and template name (`jupyter`/`vscode`/`rstudio`/`xpra`) - not `custom`.

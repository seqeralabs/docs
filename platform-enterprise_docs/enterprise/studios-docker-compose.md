---
title: "Studios Docker Compose deployment"
description: Deploy Studios with Docker Compose
date: "12 Apr 2023"
tags: [docker, compose, studios, deployment]
---

This guide describes how to deploy Studios for Seqera Platform Enterprise with Docker Compose.

## Prerequisites

Before you begin, you need:
- A running Seqera Platform Enterprise Docker Compose deployment
- A wildcard TLS certificate for your domain (e.g., `*.example.com`)
- A wildcard DNS record (e.g., `*.example.com`)
- Inbound traffic allowed on port 9090
- Traffic on port 9090 through your load balancer

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
    - `PLATFORM_URL`: The same value as `TOWER_SERVER_URL` (e.g., `https://example.com`).
    - `CONNECT_PROXY_URL`: A URL for the connect proxy subdomain (e.g., `https://connect.example.com`).
    - `CONNECT_OIDC_CLIENT_REGISTRATION_TOKEN`: The same value as `oidc_registration_token`.

1. Open `tower.env` and set the following:

    - `TOWER_DATA_EXPLORER_ENABLED`: Set to `true`.
    - `TOWER_DATA_STUDIO_CONNECT_URL`: The URL of the Studios connect proxy (e.g., `https://connect.example.com/`).
    - `TOWER_OIDC_REGISTRATION_INITIAL_ACCESS_TOKEN`: The same value as `oidc_registration_token`.
    - `TOWER_OIDC_PEM_PATH`: The file path to the PEM certificate (e.g., `/data-studios-rsa.pem`).

1. Edit `tower.yml` to enable Studios:

    ```yaml
    tower:
      data-studio:
        allowed-workspaces: null
    ```

1. Start your Platform instance:

    ```bash
    docker compose up -d
    ```

1. Verify Studios is available by logging into Seqera and navigating to an organizational workspace. The **Studios** tab should be displayed.

## Configuration

See [Studios deployment](./studios) for DNS configuration, workspace availability, and environment image options.

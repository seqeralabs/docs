---
title: "Docker Compose"
description: Deploy Seqera Platform Enterprise with Docker Compose
date: "12 Feb 2024"
tags: [docker, compose, deployment]
---

This guide assumes that all prerequisites have been met. Visit the corresponding **Prerequisites** page for your infrastructure provider.

Seqera recommends configuring your database or Redis details in either `tower.yml` or `docker-compose.yml`, but not both.

:::note
The DB or Redis volume is persistent after a Docker restart by default. Use the `volumes` key in the `db` or `redis` section of your `docker-compose.yml` file to specify a local path to the DB or Redis instance. For your database or Redis volume to be ephemeral, remove the `volumes` key altogether.
:::

## Deploy Seqera Enterprise

1. Download and configure [tower.env](_templates/docker/tower.env). See [Configuration](./configuration/overview.mdx#basic-configuration) for detailed instructions.

2. Download and configure [tower.yml](_templates/docker/tower.yml). See [Configuration](./configuration/overview.mdx#basic-configuration) for detailed instructions.

3. Download and configure the [docker-compose.yml](_templates/docker/docker-compose.yml) file:

      - The `db` container should be used only for local testing. If you have configured this service elsewhere, you can remove this container.

      - To configure the Seqera pipeline resource optimization service (`groundswell`), see [Pipeline resource optimization](./configuration/pipeline_optimization).

      - To deploy with Studios, see [Studios deployment](./studios).

4. Deploy the application and wait for it to initialize (this process takes a few minutes):

      ```bash
      docker compose up
      ```

5. [Test](./testing) the application by running an nf-core pipeline with a test profile.

6. After you've confirmed that Seqera Enterprise is correctly configured and you can launch workflows, run `docker compose up -d` to deploy the application as a background process. You can then disconnect from the VM instance.

:::note
For more information on configuration, see [Configuration options](./configuration/overview.mdx).
:::

#### Seqera frontend unprivileged

An unprivileged version of the Seqera frontend image is also available. This image listens on an unprivileged port and therefore doesn't need to be run as the root user.

Replace the tag of the frontend image `cr.seqera.io/private/nf-tower-enterprise/frontend:v24.x.x` with `cr.seqera.io/private/nf-tower-enterprise/frontend:v24.x.x-unprivileged`. Then update the `frontend` section of the `docker-compose.yml` file as follows, replacing the port mappings as needed:

```yaml
  frontend:
    image: cr.seqera.io/private/nf-tower-enterprise/frontend:v24.x.x-unprivileged
    platform: linux/amd64
    environment:
      NGINX_LISTEN_PORT: 8001  # If not defined, defaults to 8000
    networks:
      - frontend
    ports:
      - 8081:8001  # Map host port 8081 to container port 8001
    restart: always
    depends_on:
      - backend
```

The unprivileged Seqera image will soon deprecate the current image that requires root. The unprivileged image can be easily customized using environment variables:

- `NGINX_LISTEN_PORT` (default `8000`): The port the NGINX process will listen on inside the container.
- `NGINX_LISTEN_PORT_IPV6` (default `8000`): The NGINX listening port to open on the IPv6 address.
- `NGINX_UPSTREAM_HOST` (default `backend`): The hostname of the backend service to which the NGINX process will route requests.
- `NGINX_UPSTREAM_PORT` (default `8080`): The port where the backend service is exposed.

If further customization of the config file is needed, mount a config map/secret over the templated NGINX configuration file at `/etc/nginx/templates/tower.conf.template`. See [SSL/TLS](./configuration/ssl_tls#configure-seqera-to-present-a-ssltls-certificate) for an example.

## Optional features

### Studios

[Studios](../studios/overview) is an interactive analysis environment available in organizational workspaces. To enable Studios, see [Studios deployment](./studios).

:::note
Studios is available from Seqera Platform v24.1. If you experience any problems during the deployment process please contact your account executive. Studios in Enterprise is not installed by default.
:::

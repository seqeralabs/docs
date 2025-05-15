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

1. Download and configure [tower.env](_templates/docker/tower.env). See [Configuration](../configuration/overview#basic-configuration) for detailed instructions.

2. Download and configure [tower.yml](_templates/docker/tower.yml). See [Configuration](../configuration/overview#basic-configuration) for detailed instructions.

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
For more information on configuration, see [Configuration options](../configuration/overview).
:::

## Optional features

### Studios

[Studios](../studios/overview) is an interactive analysis environment available in organizational workspaces. To enable Studios, see [Studios deployment](./studios).

:::note
Studios is available from Seqera Platform v24.1. If you experience any problems during the deployment process please contact your account executive. Studios in Enterprise is not installed by default.
:::

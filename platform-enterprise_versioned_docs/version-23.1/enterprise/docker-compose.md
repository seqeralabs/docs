---
title: "Docker Compose deployment"
description: Deploy Tower with Docker Compose
date: "21 Apr 2023"
tags: [docker, compose, deployment]
---

This guide assumes that all prerequisites have been met. Please visit the corresponding **Prerequisites** page for your infrastructure provider.

We recommend configuring your database or Redis details in either the `tower.yml` or the `docker-compose.yml`, but not both.

!!! note Database persistence
In order for your DB or Redis volume to persist after a `docker restart`, uncomment the `volumes` key in the `db` or `redis` section of your docker-compose.yml file. Use this section to specify a local path to the DB or Redis instance.

## Deploy Tower

<details>
  <summary>Environment variables</summary>
    ```bash
      "docs/enterprise/_templates/docker/tower.env"
    ```
</details>

<details>
  <summary>tower.yml</summary>
    ```yaml
      "docs/enterprise/_templates/docker/tower.yml"
    ```
</details>

<details>
  <summary>docker-compose.yml</summary>
    ```yaml
      "docs/enterprise/_templates/docker/docker-compose.yml"
    ```
</details>

1. Download and configure [tower.env](_templates/docker/tower.env).

2. Download and configure [tower.yml](_templates/docker/tower.yml), update values for allowed emails.

3. Download and configure [docker-compose.yml](_templates/docker/docker-compose.yml).

   The `db` and `mail` containers should only be used for local testing; you may remove them if you have configured these services elsewhere.

   Make sure to customize the `TOWER_ENABLE_PLATFORMS` variable to include the execution platform(s) you will use.

4. Deploy Tower and wait for it to initialize (takes a few minutes):

   ```bash
   docker-compose up
   ```

:::note
For more information on configuration, see [Configuration options](./configuration/overview.mdx).
:::

## Test the application

To make sure that Tower is properly configured, follow these steps:

1. Login to Tower.

2. Create an **organization**.

3. Create a **workspace** within that organization.

4. Create a new **Compute Environment**. Refer to [Compute Environments](https://help.tower.nf/compute-envs/overview/) for detailed instructions.

5. Select **Quick Launch** from the **Launchpad** tab in your workspace.

6. Enter the repository URL for the `nf-core/rnaseq` pipeline (`https://github.com/nf-core/rnaseq`).

7. In the **Config profiles** dropdown, select the `test` profile.

8. In the **Pipeline parameters** text area, change the output directory to a sensible location based on your Compute Environment:

   ```yaml
   # save to S3 bucket
   outdir: s3://<your-bucket>/results

   # save to scratch directory (Kubernetes)
   outdir: /scratch/results
   ```

9. Select **Launch**.

   You'll be transitioned to the **Runs** tab for the workflow. After a few minutes, you'll see the progress logs in the **Execution log** tab for that workflow.

:::tip
Once you've made sure that Tower is configured correctly and you can launch workflows, you can run `docker-compose up -d` to deploy Tower as a background process. You can then disconnect from the VM instance.
:::

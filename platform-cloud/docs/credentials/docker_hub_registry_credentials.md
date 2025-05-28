---
title: "Docker Hub credentials"
description: "Instructions to create Docker Hub credentials in Seqera Platform."
date: "21 Apr 2023"
tags: [docker, registry, credentials]
---

From version 22.3, Seqera Platform supports the configuration of credentials for the Nextflow Wave container service to authenticate to private and public container registries. For more information on Wave containers, see the [Nextflow documentation](https://www.nextflow.io/docs/latest/wave.html).

:::note
Container registry credentials are only used by the Wave container service. Add `wave { enabled=true }` to the **Nextflow config** field on the launch page, or to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

## Docker Hub registry access

You must use Docker Hub credentials with **Read-only** access to authenticate Seqera to your registry. Docker Hub uses personal access tokens (PATs) for authentication. We don't currently support Docker Hub authentication with 2FA (two-factor authentication).

**Create a Docker Hub PAT**

1. Log in to [Docker Hub](https://hub.docker.com/).
2. Select your username in the top right corner and select **Account Settings**.
3. Select **Security > New Access Token**.
4. Enter a token description and select **Read-only** from the Access permissions drop-down menu, then select **Generate**.
5. Copy and save the generated access token (this is only displayed once).

## Add credentials to Seqera

1.  Add your credentials to your organization or personal workspace:

    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: Specify a unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `my-registry-creds`.
    - **Provider**: Select **Container registry**.
    - **User name**: Specify your Docker username. For example, `user1`.
    - **Password**: Specify your personal access token (PAT). For example, `1fcd02dc-...215bc3f3`.
    - **Registry server**: Specify the container registry hostname, excluding the protocol. For example, `docker.io`.

3.  After you've completed all the form fields, select **Add**. The new credential is now listed under the **Credentials** tab.

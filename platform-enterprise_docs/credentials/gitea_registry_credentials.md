---
title: "Gitea container registry credentials"
description: "Instructions to create GitHub container registry credentials in Seqera Platform."
date: "15 Dec 2023"
tags: [gitea, registry, credentials]
---

From version 22.3, Seqera Platform supports the configuration of credentials for the Nextflow Wave container service to authenticate to private and public container registries. For more information on Wave containers, see the [Nextflow documentation](https://www.nextflow.io/docs/latest/wave.html).

Gitea container registries support [authentication][gitea-auth] using a personal access token. Use your personal access token as your password when you create your Gitea container registry credentials in Seqera.

:::note
Container registry credentials are only used by the Wave container service. Add `wave { enabled=true }` to the **Nextflow config** field on the launch page, or to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

## Create a personal access token (PAT)

You must create a PAT to access your Gitea container registry from Wave. For more information, see [Create a personal access token][gitea-create].

## Add credentials to Seqera

1.  Add your credentials to your organization or personal workspace:
    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: Specify a unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `my-registry-creds`.
    - **Provider**: Select **Container registry**.
    - **User name**: Specify your Gitea username. For example, `gitlab_user1`.
    - **Password**: Specify your Gitea personal access token (PAT). For example, `1fcd02dc-...215bc3f3`.
    - **Registry server**: Specify your Gitea container registry URL. For example, `gitea.example.com`.

3.  After you've completed all the form fields, select **Add**. The new credential is now listed under the **Credentials** tab.

[gitea-auth]: https://docs.gitea.com/usage/packages/container#login-to-the-container-registry
[gitea-create]: https://docs.gitea.com/development/api-usage#authentication

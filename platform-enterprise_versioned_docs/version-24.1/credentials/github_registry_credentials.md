---
title: "GitHub container registry credentials"
description: "Instructions to create GitHub container registry credentials in Seqera Platform."
date: "15 Dec 2023"
tags: [github, registry, credentials]
---

From version 22.3, Seqera Platform supports the configuration of credentials for the Nextflow Wave container service to authenticate to private and public container registries. For more information on Wave containers, see the [Nextflow documentation](https://www.nextflow.io/docs/latest/wave.html).

GitHub Packages only supports [authentication][github-pat] using a personal access token (classic). Use your personal access token as your password when you create your GitHub container registry credentials in Seqera.

:::note
Container registry credentials are only used by the Wave container service. Add `wave { enabled=true }` to the **Nextflow config** field on the launch page, or to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

## Create a personal access token (PAT)

You must create a PAT to access your GitHub container registry from Wave. For more information, see [Create a personal access token][github-create].

## Add credentials to Seqera

1.  Add your credentials to your organization or personal workspace:

    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: Specify a unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `my-registry-creds`.
    - **Provider**: Select **Container registry**.
    - **User name**: Specify your GitHub username. For example, `github_user1`.
    - **Password**: Specify your personal access token (PAT) classic. For example, `1fcd02dc-...215bc3f3`.
    - **Registry server**: Specify your GitHub container registry URL. For example, `ghcr.io`.

3.  After you've completed all the form fields, select **Add**. The new credential is now listed under the **Credentials** tab.

[github-pat]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic
[github-create]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic

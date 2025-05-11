---
title: "GitLab container registry credentials"
description: "Instructions to create GitLab container registry credentials in Seqera Platform."
date: "15 Dec 2023"
tags: [gitlab, registry, credentials]
---

From version 22.3, Seqera Platform supports the configuration of credentials for the Nextflow Wave container service to authenticate to private and public container registries. For more information on Wave containers, see the [Nextflow documentation](https://www.nextflow.io/docs/latest/wave.html).

If your organization enabled two-factor authentication (2FA) for your GitLab organization or project, you must use your [personal access token][gitlab-pat] as your password when you create your [GitLab container registry credentials][gitlab-cr].

:::note
Container registry credentials are only used by the Wave container service. Add `wave { enabled=true }` to the **Nextflow config** field on the launch page, or to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

## Create a personal access token (PAT)

If your organization enabled 2FA for your organization or project, you must create a PAT to access your GitLab container registry from Wave. For more information, see [Create a personal access token][gitlab-create]. If your organization created a [project access token][gitlab-project] or a [group access token][gitlab-group], ask your GitLab administrator for access.

## Add credentials to Seqera

1.  Add your credentials to your organization or personal workspace:
    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: Specify a unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `my-registry-creds`.
    - **Provider**: Select **Container registry**.
    - **User name**: Specify your GitLab username.
    - **Password**: Specify your personal access token (PAT), group access token, or project access token if 2FA is enabled by your GitLab organization. Otherwise specify your GitLab password.
    - **Registry server**: Specify your GitLab container registry URL. For example, `gitlab.example.com`.

3.  After you've completed all the form fields, select **Add**. The new credential is now listed under the **Credentials** tab.

[gitlab-cr]: https://docs.gitlab.com/ee/user/packages/container_registry/authenticate_with_container_registry.html
[gitlab-pat]: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html
[gitlab-create]: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token
[gitlab-project]: https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html
[gitlab-group]: https://docs.gitlab.com/ee/user/group/settings/group_access_tokens.html

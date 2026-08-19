---
title: "GitLab"
description: "Connect Seqera Platform to private GitLab repositories."
tags: [git, gitlab, integration]
---

GitLab supports [Personal](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html), [Group](https://docs.gitlab.com/ee/user/group/settings/group_access_tokens.html#group-access-tokens), and [Project](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) access tokens for authentication. Your access token must have the `api`, `read_api`, and `read_repository` scopes. For all three token types, use the token value in both the **Password** and **Access token** fields.

## Create GitLab credentials

1. From an organization workspace: Select **Credentials** > **Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials** > **Add credentials**.
1. Enter a **Name** for the new credentials.
1. Select **GitLab** as the **Provider**.
1. Enter your **Username**. For Group and Project access tokens, the username can be any non-empty value.
1. Enter your token value in both the **Password** and **Access token** fields.
1. (Recommended) Enter the **Repository base URL** to scope the credentials to a specific repository (e.g., `https://gitlab.com/seqeralabs`).

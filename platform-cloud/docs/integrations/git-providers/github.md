---
title: "GitHub"
description: "Connect Seqera Platform to private GitHub repositories."
tags: [git, github, integration]
---

Use an access token to connect Seqera Platform to a private [GitHub](https://github.com/) repository. Personal (classic) or fine-grained access tokens can be used.

:::info
A user's personal access token (classic) can access every repository the user has access to. GitHub recommends using fine-grained personal access tokens (currently in beta), which can be restricted to specific repositories with granular permissions instead of broad scopes.
:::

For personal (classic) tokens, grant access to the private repository by selecting the main `repo` scope when the token is created. See [Creating a personal access token (classic)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic).

For fine-grained tokens, the repository's organization must [opt in](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization) to fine-grained tokens. See [Creating a fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token).

## Create GitHub credentials

After you've created and copied your access token, create a new credential in Seqera:

1. From an organization workspace: Select **Credentials** > **Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials** > **Add credentials**.
1. Enter a **Name** for the new credentials.
1. Select **GitHub** as the **Provider**.
1. Enter your **Username** and **Access token**.
1. (Recommended) Enter the **Repository base URL** for which the credentials should be applied (e.g., `https://github.com/seqeralabs`).

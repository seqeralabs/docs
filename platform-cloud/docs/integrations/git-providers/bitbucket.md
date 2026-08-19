---
title: "Bitbucket"
description: "Connect Seqera Platform to private Bitbucket repositories."
tags: [git, bitbucket, integration]
---

To connect to a private Bitbucket repository, see [API tokens](https://support.atlassian.com/bitbucket-cloud/docs/api-tokens/) to create a Bitbucket API token. The API token must have at least `read:repository:bitbucket` scope.

:::warning
API tokens are tied to users. This differs from access tokens, which are tied to a specific resource. While Seqera supports API tokens, access tokens are not supported for accessing Bitbucket repositories.

API tokens replace [app passwords](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/), which can no longer be created after September 9, 2025 and will be phased out June 9, 2026. While app passwords are still supported, they are not recommended. See [Bitbucket Cloud transitions to API tokens](https://www.atlassian.com/blog/bitbucket/bitbucket-cloud-transitions-to-api-tokens-enhancing-security-with-app-password-deprecation) for more information.
:::

## Create Bitbucket credentials

1. From an organization workspace: Select **Credentials** > **Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials** > **Add credentials**.
1. Enter a **Name** for the new credentials.
1. Select **BitBucket** as the **Provider**.
1. Enter your **Username** (account email) and **Token**.
1. (Recommended) Enter the **Repository base URL** to scope the credentials to a specific repository (e.g., `https://bitbucket.org/seqeralabs`).

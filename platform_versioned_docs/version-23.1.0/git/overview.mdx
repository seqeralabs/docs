---
title: "Git integration"
description: "Connecting to Git repositories in Nextflow Tower."
date: "21 Apr 2023"
tags: [git]
---

## Overview

Data pipelines can be composed of many assets (pipeline scripts, configuration files, dependency descriptors such as for Conda or Docker, documentation, etc). By managing complex data pipelines as Git repositories, all assets can be versioned and deployed with a specific tag, release or commit id. Version control, combined with containerization, is crucial for **enabling reproducible pipeline executions**, and it provides the ability to continuously test and validate pipelines as the code evolves over time.

Nextflow has built-in support for [Git](https://git-scm.com) and several Git-hosting platforms. Nextflow pipelines can be pulled remotely from both public and private Git-hosting providers, including the most popular platforms: GitHub, GitLab, and BitBucket.

### Public repositories

You can use a publicly hosted Nextflow pipeline by specifying the Git repository URL in the **Pipeline to launch** field.

When specifying the **Revision number**, the list of available revisions are automatically pulled using the Git provider's API. By default, the default branch (usually `main` or `master`) will be used.

![](./_images/git_public_repo.png)

:::tip
[nf-core](https://nf-co.re/pipelines) is a great resource for public Nextflow pipelines.
:::

:::caution
The GitHub API imposes [rate limits](https://docs.github.com/en/developers/apps/building-github-apps/rate-limits-for-github-apps) on API requests. You can increase your rate limit by adding [GitHub credentials](#github) to your workspace as shown below.
:::

### Private repositories

In order to access private Nextflow pipelines, you must add credentials for your private Git hosting provider.

:::note
All credentials are (AES-256) encrypted before secure storage and are not exposed in an unencrypted way by any Tower API.
:::

### Multiple credential filtering

When your Tower instance has multiple stored credentials, selection of the most relevant credential for your repository takes precedence in the following order:

1. Tower evaluates all the stored credentials available to the current Workspace.

2. Credentials are filtered by Git provider (GitHub, GitLab, Bitbucket, etc.)

3. Tower selects the credential with a **Repository base URL** most similar to the target repository.

4. If no **Repository base URL** values are specified in the Workspace credentials, the most long-lived credential is selected.

**Example**:

Workspace A contains 4 credentials:

**Credential A**

    Type: GitHub

    Repository base URL:

**Credential B**

    Type: GitHub

    Repository base URL: https://github.com/

**Credential C**

    Type: GitHub

    Repository base URL: https://github.com/pipeline-repo

**Credential D**

    Type: GitLab

    Repository base URL: https://gitlab.com/repo-a

If you launch a pipeline with a Nextflow workflow residing in https://github.com/pipeline-repo, Tower will use **Credential C**.

To ensure automatic selection of the most appropriate credential for your repository, we recommend that you:

- Specify **Repository base URL** values as precisely as possible for each Git credential used in the Workspace.

- Favor the use of service account type credentials where possible (such as GitLab group access tokens).

- Avoid the use of multiple user-based tokens with similar permissions.

### Azure DevOps repositories

You can authenticate to Azure Devops repositories using a [personal access token (PAT)](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows#about-pats).

Once you have created and copied your access token, create a new credential in Tower using these steps:

1. Navigate to the **Credentials** tab. If you are using your personal workspace, select **Your credentials** from the user icon menu (top right).

2. Select **Add Credentials**.

3. Enter a **Name** for the new credentials.

4. Select "Azure DevOps" as the **Provider**.

5. Enter your **Username** and **Access token**.

6. Enter the **Repository base URL** for which the credentials should be applied (recommended). This option can be used to apply the provided credentials to a specific repository, e.g. `https://dev.azure.com/{your organization}/{your project}`.

### GitHub

To connect a private [GitHub](https://github.com/) repository, personal (classic) or fine-grained access tokens can be used.

:::note
A personal access token (classic) can access every repository that the user it belongs to can access. GitHub recommends that you use fine-grained personal access tokens (currently in beta) instead, which you can restrict to specific repositories. Fine-grained personal access tokens also enable you to specify granular permissions instead of broad scopes.
:::

For **personal (classic)** tokens, you must grant access to the private repository by selecting the main `repo` scope when the token is created. See [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic) for instructions to create your personal access token (classic).

For **fine-grained** tokens, the repository's organization must [opt in](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization) to the use of fine-grained tokens. Tokens can be restricted by **Resource owner (organization)**, **Repository access**, and **Permissions**. See [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token) for instructions to create your fine-grained access token.

Once you have created and copied your access token, create a new credential in Tower using these steps:

1. Navigate to the **Credentials** tab. If you are using your personal workspace, select **Your credentials** from the user icon menu (top right).

2. Select **Add Credentials**.

3. Enter a **Name** for the new credentials.

4. Select "GitHub" as the **Provider**.

5. Enter your **Username** and **Access token**.

6. Enter the **Repository base URL** for which the credentials should be applied (recommended). This option can be used to apply the provided credentials to a specific repository, e.g. `https://github.com/seqeralabs`.

### GitLab

GitLab supports [Personal](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html), [Group](https://docs.gitlab.com/ee/user/group/settings/group_access_tokens.html#group-access-tokens), and [Project](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) access tokens for authentication. Your access token should have the `api`, `read_api`, and `read_repository` scopes in order to work with Tower. For all three token types, the token value is used for both the **Password** and **Access token** fields in the Tower credential creation form.

To connect Tower to a private [GitLab](https://gitlab.com/) repository:

1. Navigate to the **Credentials** tab. If you are using your personal workspace, select **Your credentials** from the user icon menu (top right).

2. Select **Add Credentials**.

3. Enter a **Name** for the new credentials.

4. Select "GitLab" as the **Provider**.

5. Enter your **Username**. For Group and Project access tokens, the username can be any non-empty value.

6. Enter your token value in the **Password** and **Access token** fields.

7. Enter the **Repository base URL** (recommended). This option is used to apply the credentials to a specific repository, e.g. `https://gitlab.com/seqeralabs`.

### Gitea

**Available from Tower 22.4.X**

To connect to a private [Gitea](https://gitea.io/) repository, supply your Gitea user credentials to create a new credential in Tower with these steps:

1. Navigate to the **Credentials** tab. If you are using your personal workspace, select **Your credentials** from the user icon menu (top right).

2. Select **Add Credentials**.

3. Enter a **Name** for the new credentials.

4. Select "Gitea" as the **Provider**.

5. Enter your **Username**.

6. Enter your **Password**.

7. Enter your **Repository base URL** (required).

### Bitbucket

To connect to a private BitBucket repository, refer to the [BitBucket documentation](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/) to learn how to create a BitBucket App password. Then, create a new credential in Tower using these steps:

1. Navigate to the **Credentials** tab. If you are using your personal workspace, select **Your credentials** from the user icon menu (top right).

2. Select **Add Credentials**.

3. Enter a **Name** for the new credentials.

4. Select "BitBucket" as the **Provider**.

5. Enter your **Username** and **Password**.

6. Enter the **Repository base URL** (recommended). This option can be used to apply the provided credentials to a specific repository, e.g. `https://bitbucket.org/seqeralabs`.

### AWS CodeCommit

To connect to a private AWS CodeCommit repository, refer to the [AWS documentation](https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-iam-identity-based-access-control.html) to learn more about IAM permissions for CodeCommit. Then, supply the IAM account access key and secret key to create a credential in Tower using these steps:

1. Navigate to the **Credentials** tab. If you are using your personal workspace, select **Your credentials** from the user icon menu (top right).

2. Select **Add Credentials**.

3. Enter a **Name** for the new credentials.

4. Select "CodeCommit" as the **Provider**.

5. Enter the **Access key** and **Secret key** of the AWS IAM account that will be used to access the desired CodeCommit repository.

6. Enter the **Repository base URL** for which the credentials should be applied (recommended). This option can be used to apply the provided credentials to a specific region, e.g. `https://git-codecommit.eu-west-1.amazonaws.com`.

### Self-hosted Git

It is also possible to specify Git server endpoints for Tower Enterprise. For more information, refer to the [Tower Install Documentation](https://install.tower.nf/latest/configuration/git_integration/).

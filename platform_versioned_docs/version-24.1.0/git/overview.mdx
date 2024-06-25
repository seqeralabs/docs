---
title: "Git integration"
description: "Connecting to Git repositories in Seqera Platform."
date: "24 Jun 2024"
tags: [git]
---

Data pipelines are composed of many assets, including pipeline scripts, configuration files, dependency descriptors (such as for Conda or Docker), documentation, etc. When you manage complex data pipelines as Git repositories, all assets can be versioned and deployed with a specific tag, release, or commit ID. Version control and containerization are crucial to enable reproducible pipeline executions, and provide the ability to continuously test and validate pipelines as the code evolves over time.

Seqera Platform has built-in support for [Git](https://git-scm.com) and several Git-hosting platforms. Pipelines can be pulled remotely from both public and private Git providers, including the most popular platforms: GitHub, GitLab, and BitBucket.

## Public repositories

Launch a public Nextflow pipeline by entering its Git repository URL in the **Pipeline to launch** field.

When you specify the **Revision number**, the list of available revisions are automatically pulled using the Git provider's API. By default, the default branch (usually `main` or `master`) will be used.

:::tip
[nf-core](https://nf-co.re/pipelines) is a great resource for public Nextflow pipelines.
:::

:::note
The GitHub API imposes [rate limits](https://docs.github.com/en/developers/apps/building-github-apps/rate-limits-for-github-apps) on API requests. You can increase your rate limit by adding [GitHub credentials](#github) to your workspace as shown below.
:::

## Private repositories

To access private Nextflow pipelines, add the credentials for your private Git hosting provider to Seqera.

:::note
Credentials are encrypted with the AES-256 cypher before secure storage and are never exposed in an unencrypted way by any Seqera API.
:::

### Multiple credential filtering

When you have multiple stored credentials, Seqera selects the most relevant credential for your repository in the following order:

1. Seqera evaluates all the stored credentials available to the current workspace.

2. Credentials are filtered by Git provider (GitHub, GitLab, Bitbucket, etc.)

3. Seqera selects the credential with a **Repository base URL** most similar to the target repository.

4. If no **Repository base URL** values are specified in the workspace credentials, the most long-lived credential is selected.

**Credential filtering example**

Workspace A contains four credentials:

_Credential A_

    Type: GitHub

    Repository base URL:

_Credential B_

    Type: GitHub

    Repository base URL: https://github.com/

_Credential C_

    Type: GitHub

    Repository base URL: https://github.com/pipeline-repo

_Credential D_

    Type: GitLab

    Repository base URL: https://gitlab.com/repo-a

If you launch a pipeline with a Nextflow workflow in the https://github.com/pipeline-repo, Seqera will use **Credential C**.

For the application to select the most appropriate credential for your repository, we recommend that you:

- Specify the **Repository base URL** values as completely as possible for each Git credential used in the workspace.

- Favor the use of service account type credentials where possible (such as GitLab group access tokens).

- Avoid storing multiple user-based tokens with similar permissions.

### Azure DevOps repositories

You can authenticate to Azure Devops repositories using a [personal access token (PAT)](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows#about-pats).

Once you have created and copied your access token, create a new credential in Seqera using these steps:

**Create AzureDevOps credentials**

1. From an organization workspace: Select **Credentials > Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials > Add credentials**.

3. Enter a **Name** for the new credentials.

4. Select _Azure DevOps_ as the **Provider**.

5. Enter your **Username** and **Access token**.

6. (Recommended) Enter the **Repository base URL** for which the credentials should be applied. This option is used to apply the provided credentials to a specific repository, e.g., `https://dev.azure.com/<your organization>/<your project>`.

### GitHub

Use an access token to connect Seqera to a private [GitHub](https://github.com/) repository. Personal (classic) or fine-grained access tokens can be used.

:::note
A user's personal access token (classic) can access every repository that the user has access to. GitHub recommends using fine-grained personal access tokens (currently in beta) instead, which you can restrict to specific repositories. Fine-grained personal access tokens also enable you to specify granular permissions instead of broad scopes.
:::

For **personal (classic)** tokens, you must grant access to the private repository by selecting the main `repo` scope when the token is created. See [Creating a personal access token (classic)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic) for instructions to create your personal access token (classic).

For **fine-grained** tokens, the repository's organization must [opt in](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization) to the use of fine-grained tokens. Tokens can be restricted by _resource owner (organization)_, _repository access_, and _permissions_. See [Creating a fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) for instructions to create your fine-grained access token.

After you've created and copied your access token, create a new credential in Seqera:

**Create GitHub credentials**

1. From an organization workspace: Select **Credentials > Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials > Add credentials**.

2. Enter a **Name** for the new credentials.

3. Select _GitHub_ as the **Provider**.

4. Enter your **Username** and **Access token**.

5. (Recommended) Enter the **Repository base URL** for which the credentials should be applied. This option is used to apply the provided credentials to a specific repository, e.g., `https://github.com/seqeralabs`.

### GitLab

GitLab supports [Personal](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html), [Group](https://docs.gitlab.com/ee/user/group/settings/group_access_tokens.html#group-access-tokens), and [Project](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) access tokens for authentication. Your access token must have the `api`, `read_api`, and `read_repository` scopes to work with Seqera. For all three token types, use the token value in both the **Password** and **Access token** fields in the Seqera credential creation form.

After you have created and copied your access token, create a new credential in Seqera with these steps:

**Create GitLab credentials**

1. From an organization workspace: Select **Credentials > Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials > Add credentials**.

2. Enter a **Name** for the new credentials.

3. Select _GitLab_ as the **Provider**.

4. Enter your **Username**. For Group and Project access tokens, the username can be any non-empty value.

5. Enter your token value in both the **Password** and **Access token** fields.

6. Enter the **Repository base URL** (recommended). This option is used to apply the credentials to a specific repository, e.g. `https://gitlab.com/seqeralabs`.

### Gitea

To connect to a private [Gitea](https://gitea.io/) repository, use your Gitea user credentials to create a new credential in Seqera with these steps:

**Create Gitea credentials**

1. From an organization workspace, go to the **Credentials** tab and select **Add Credentials**. From your personal workspace, select **Your credentials** from the user menu, then select **Add credentials**.

2. Enter a **Name** for the new credentials.

3. Select _Gitea_ as the **Provider**.

4. Enter your **Username**.

5. Enter your **Password**.

6. Enter your **Repository base URL** (required).

### Bitbucket

To connect to a private BitBucket repository, see the [BitBucket documentation](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/) to learn how to create a BitBucket App password. Then, create a new credential in Seqera with these steps:

**Create BitBucket credentials**

1. From an organization workspace: Select **Credentials > Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials > Add credentials**.

2. Enter a **Name** for the new credentials.

3. Select _BitBucket_ as the **Provider**.

4. Enter your **Username** and **Password**.

5. Enter the **Repository base URL** (recommended). This option can be used to apply the credentials to a specific repository, e.g., `https://bitbucket.org/seqeralabs`.

### AWS CodeCommit

To connect to a private AWS CodeCommit repository, see the [AWS documentation](https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-iam-identity-based-access-control.html) to learn more about IAM permissions for CodeCommit. Then, use your IAM account access key and secret key to create a credential in Seqera with these steps:

**Create AWS CodeCommit credentials**

1. From an organization workspace: Select **Credentials > Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials > Add credentials**.

2. Enter a **Name** for the new credentials.

3. Select _CodeCommit_ as the **Provider**.

4. Enter the **Access key** and **Secret key** of the AWS IAM account that will be used to access the target CodeCommit repository.

5. Enter the **Repository base URL** for which the credentials should be applied (recommended). This option can be used to apply the credentials to a specific region, e.g., `https://git-codecommit.eu-west-1.amazonaws.com`.

### Self-hosted Git

Seqera Platform Enterprise supports Git server endpoints. For more information, see [Git configuration](../enterprise/configuration/overview.mdx#git-integration) in the Enterprise installation guide.

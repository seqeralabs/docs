---
title: "Git providers"
description: "Connect Seqera Platform to GitHub, GitLab, Bitbucket, Gitea, Azure DevOps, and AWS CodeCommit."
tags: [git, integration]
---

Data pipelines are composed of many assets — pipeline scripts, configuration files, dependency descriptors (Conda, Docker), documentation, etc. When you manage these as Git repositories, all assets can be versioned and deployed with a specific tag, release, or commit ID. Version control and containerization are crucial for reproducible pipeline executions and continuous validation as the code evolves.

Seqera Platform has built-in support for [Git](https://git-scm.com) and the most popular Git-hosting platforms.

## Public repositories

Launch a public Nextflow pipeline by entering its Git repository URL in the **Pipeline to launch** field.

When you specify the **Revision** number, the available revisions are pulled using the Git provider's API. By default, the default branch (usually `main` or `master`) is used.

:::tip
[nf-core](https://nf-co.re/pipelines) is a great resource for public Nextflow pipelines.
:::

:::info
The GitHub API imposes [rate limits](https://docs.github.com/en/developers/apps/building-github-apps/rate-limits-for-github-apps) on API requests. Increase your rate limit by adding [GitHub credentials](./github) to your workspace.
:::

## Private repositories

To access private Nextflow pipelines, add credentials for your private Git hosting provider:

- [GitHub](./github)
- [GitLab](./gitlab)
- [Bitbucket](./bitbucket)
- [Gitea](./gitea)
- [Azure DevOps](./azure-devops)
- [AWS CodeCommit](./codecommit)

If you use multiple Git credentials in the same workspace, see [Multiple credential filtering](./multiple-credentials) for the credential selection rules.

:::info
Credentials are encrypted with AES-256 before secure storage and are never exposed in an unencrypted way by any Seqera API.
:::

## Seqera AI Git access

Seqera AI's GitHub integration is set up separately. See [Seqera AI Git access](./seqera-ai).

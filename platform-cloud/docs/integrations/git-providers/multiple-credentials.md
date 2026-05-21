---
title: "Multiple credentials"
description: "How Seqera Platform selects the right Git credential when multiple are configured."
tags: [git, credentials, integration]
---

When you have multiple stored Git credentials, Seqera selects the most relevant credential for your repository in the following order:

1. Seqera evaluates all stored credentials available to the current workspace.
1. Credentials are filtered by Git provider (GitHub, GitLab, Bitbucket, etc.)
1. Seqera selects the credential with a Repository base URL most similar to the target repository.
1. If no Repository base URL values are specified in the workspace credentials, the most long-lived credential is selected.

## Credential filtering example

Workspace A contains four credentials:

**Credential A**
- Type: GitHub
- Repository base URL:

**Credential B**
- Type: GitHub
- Repository base URL: `https://github.com/`

**Credential C**
- Type: GitHub
- Repository base URL: `https://github.com/pipeline-repo`

**Credential D**
- Type: GitLab
- Repository base URL: `https://gitlab.com/repo-a`

If you launch a pipeline with a Nextflow workflow in `https://github.com/pipeline-repo`, Seqera uses Credential C.

## Recommendations

For Seqera to select the most appropriate credential for your repository:

- Specify the Repository base URL values as completely as possible for each Git credential used in the workspace.
- Favor service account-type credentials where possible (such as GitLab group access tokens).
- Avoid storing multiple user-based tokens with similar permissions.

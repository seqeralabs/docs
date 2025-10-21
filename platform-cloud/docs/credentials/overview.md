---
title: "Credentials Overview"
description: "Overview of credentials in Seqera Platform."
date: "21 Apr 2023"
tags: [credentials]
---

Seqera Platform supports secure credential management for all your infrastructure and service integrations. Configure credentials to authenticate with:

- **[Git hosting services][git]**: Access private repositories from GitHub, GitLab, Bitbucket, and other Git providers
- **[Container registries][registry]**: Authenticate the Wave container service with private registries like Docker Hub, AWS ECR, Azure Container Registry, and Google Artifact Registry
- **[Data repositories][data]**: Connect to cloud storage services like AWS S3, Azure Blob Storage, and Google Cloud Storage
- **[Managed identities][managed]**: Use cloud provider managed identities for secure, credential-free authentication
- **[SSH credentials][ssh]**: Connect to HPC and on-premises compute environments
- **[Agent credentials][agent]**: Authenticate Seqera Agents for hybrid and on-premises deployments

:::note
Seqera Platform encrypts all credentials with AES-256 encryption before storing them. No Seqera API exposes credentials in an unencrypted way.
:::

[git]: ../git/overview
[registry]: ./container_registry_credentials
[data]: ./data_repositories
[managed]: ./managed_identities
[ssh]: ./ssh_credentials
[agent]: ./agent_credentials


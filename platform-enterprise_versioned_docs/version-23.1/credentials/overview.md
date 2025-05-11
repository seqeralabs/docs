---
title: "Credentials Overview"
description: "Overview of credentials in Nextflow Tower."
date: "21 Apr 2023"
tags: [credentials]
---

## Credentials

In Tower, you can configure **workspace credentials** to store the access keys and tokens for your [compute environments](../compute-envs/overview) and [Git hosting services](../git/overview).

From Tower 22.3, you can configure **container registry credentials** to be used by the Wave containers service to authenticate to private and public container registries such as Docker Hub, Google Artifact Registry, Quay, etc.

See the **Container registry credentials** section for registry-specific instructions.

![](./_images/credentials_overview.png)

:::note
All credentials are (AES-256) encrypted before secure storage and not exposed in an unencrypted way by any Tower API.
:::

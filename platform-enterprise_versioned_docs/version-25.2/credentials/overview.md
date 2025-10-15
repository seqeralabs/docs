---
title: "Credentials Overview"
description: "Overview of credentials in Seqera Platform."
date: "21 Apr 2023"
tags: [credentials]
---

Configure **workspace credentials** in Seqera Platform to store the access keys and tokens for your [compute environments][compute], [data repositories][data], and [Git hosting services][git].

From version 22.3, you can configure **container registry credentials** to be used by the [Wave container service][wave] to authenticate to private and public container registries like Docker Hub, Google Artifact Registry, Quay, etc.

See the **Container registry credentials** section for registry-specific instructions.

:::note
All credentials are (AES-256) encrypted before secure storage and not exposed in an unencrypted way by any Seqera API.
:::

{/* links */}

[compute]: ../compute-envs/overview
[data]: ../data/data-explorer
[git]: ../git/overview
[wave]: ../../../wave_docs/


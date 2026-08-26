---
title: "Credentials overview"
description: "Overview of credentials in Seqera Platform."
date created: "2023-04-21"
last updated: "2026-08-26"
tags: [credentials]
---

Configure workspace credentials in Seqera Platform to store the access keys and tokens for your [compute environments][compute], [data repositories][data], and [Git hosting services][git].

From version 22.3, you can configure container registry credentials that the [Wave container service][wave] uses to authenticate to private and public container registries, such as Docker Hub, Google Artifact Registry, and Quay.

For registry-specific instructions, see the Container registry credentials pages.

:::note
Seqera Platform encrypts all credentials with AES-256 encryption before storing them. No Seqera API exposes credentials in an unencrypted way.
:::

{/* links */}

[compute]: ../compute-envs/overview
[data]: ../data/data-explorer
[git]: ../git/overview
[wave]: https://docs.seqera.io/wave/provisioning

---
title: "Wave containers"
description: "Configuring Wave containers service"
date: "12 Apr 2023"
tags: [wave, containers, configuration]
---

From version 22.4, Tower supports Seqera Labs' Wave containers service for on-premise installations.

Learn more about Wave's features [here](https://wave.seqera.io), and about Wave integration with Nextflow [here](https://www.nextflow.io/docs/latest/wave.html).

## Pairing Tower with Wave

Pairing Tower with Wave requires the following:

- Credentials to authenticate to your (private or public) container registry must be added to Tower. Follow the [container registry credentials](https://help.tower.nf/latest/credentials/overview/) instructions for your provider.

- Your container registry must allow ingress from the Wave service (`https://wave.seqera.io`).

- The Wave service (`https://wave.seqera.io`) must be accessible from the network where Tower is installed (i.e. the domain should be whitelisted in protected Tower installations).

- The `TOWER_ENABLE_WAVE=true` environment variable must be added to the Tower configuration environment.

- The `WAVE_SERVER_URL="https://wave.seqera.io"` environment variable must be added to the Tower configuration environment.

:::note
Wave does not currently support container repositories that have private CA SSL certificates applied.
:::

You can test connectivity with the Wave service by accessing https://wave.seqera.io/service-info, either from the browser or with cURL:

```curl
$ curl https://wave.seqera.io/service-info
```

When these conditions are met, the Wave feature is available on the Tower compute environment creation page (currently only available for AWS compute environments).

Once Wave is enabled, it will be possible to use private container repositories and the Fusion file system in your Nextflow pipelines.

Wave can also be enabled in the Nextflow pipeline config file. See [here](https://www.nextflow.io/docs/latest/wave.html) for more information.

---
title: "Networking configuration"
description: Configuration options for networking
date: "21 Apr 2023"
tags: [networking, configuration]
---

## HTTP proxy environment variables

:::caution
Proxies which require passwords are not supported.
:::

If your Tower instance must access the internet via a proxy server, the settings can be configured using:

- `http_proxy`: Defines the proxy server to be used for HTTP connections.
- `https_proxy`: Defines the proxy server to be used for HTTPS connections.
- `no_proxy`: Defines one or more host names that should _not_ use the proxy server.

**Example:**

```env
# syntax
export http_proxy='alice.example.com:8080'
export https_proxy='alice.example.com:8080'
export no_proxy=internal.example.com,internal2.example.com
```

:::tip
The above environment variables can be either lowercase or uppercase.
:::

## Isolated environments

If you are deploying Tower in an environment that has no external internet access, ensure that no pipeline assets or parameters in your configuration contain external links, as this will lead to connection failures.

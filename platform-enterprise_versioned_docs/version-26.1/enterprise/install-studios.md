---
title: "Studios"
description: Install Studios for Seqera Platform Enterprise
date created: "2023-04-12"
last updated: "2026-05-27"
tags: [studios, installation, deployment]
---

Studios provides interactive analysis environments within Seqera Platform. Deploy Studios after your Platform installation is complete.

## Deployment options

| Method | Guide |
| :----- | :---- |
| Helm | [Studios: Helm](./studios-helm) |
| Kubernetes | [Studios: Kubernetes](./studios-kubernetes) |
| Docker Compose | [Studios: Docker Compose](./studios-docker-compose) |

See each deployment guide for detailed requirements.

## Prerequisites

:::info
Before you begin, you need:
- A running Seqera Platform Enterprise deployment at hostname `example.com` or `platform.example.com`
- A Redis 7 instance separate from the one used by Seqera Platform
- TLS certificates for the Studios subdomains `*.connect.example.com`
  * A single certificate covering both Platform and Studios subdomains can be used; if preferring to use separate certificates, you may need to configure a separate ingress when working with plain Kubernetes manifests (the Studios Helm chart already uses separate ingresses)
  * The Studios subdomain must share the same "root domain" with the Platform installation, for example with Platform installed at `example.com` or `platform.example.com`, Studios can be installed at:
    - `connect.example.com` or using another name such as `studios.example.com`
    - `connect.platform.example.com`
    - `connect.another.subdomain.example.com`
- A wildcard DNS record covering the Studios subdomains, e.g., `*.connect.example.com`
- Data Explorer enabled in your Seqera Platform instance (automatic with Helm deployments)
:::

## Connect environment variables

These are the environment variables used to configure the components of Connect.

| Environment variable                     | Default                     | Required   |   Used by    | Description                                                                                       |
|------------------------------------------|-----------------------------|------------|--------------|---------------------------------------------------------------------------------------------------|
| `CONNECT_REDIS_ADDRESS`                  | `redis:6379`                  | yes      | server,proxy | The address of the Redis server. Default applies to the server; the proxy requires it explicitly. |
| `CONNECT_REDIS_USER`                     |                               | no       | server,proxy | The username to authenticate with Redis.                                                          |
| `CONNECT_REDIS_PASSWORD`                 |                               | no       | server,proxy | The password to authenticate with Redis.                                                          |
| `CONNECT_REDIS_DB`                       | `0`                           | no       | server,proxy | The Redis database to use.                                                                        |
| `CONNECT_REDIS_PREFIX`                   | `connect:session`             | no       | server,proxy | A prefix to use for tunnel keys in Redis.                                                         |
| `CONNECT_REDIS_TLS_ENABLE`               | `false`                       | no       | server,proxy | Enable TLS connection.                                                                            |
| `CONNECT_REDIS_TLS_SKIP_VERIFY`          | `false`                       | no       | server,proxy | Sets the insecure skip verify TLS option.                                                         |
| `CONNECT_REDIS_TLS_KEY_FILE`             |                               | no       | server,proxy | The path to a certificate key file for TLS connection.                                            |
| `CONNECT_REDIS_TLS_CERT_FILE`            |                               | no       | server,proxy | The path to a certificate file for TLS connection.                                                |
| `CONNECT_LISTENER_PORT`                  | `7777`                        | no       | server       | The port where the server listens for connections.                                                |
| `CONNECT_TUNNEL_PORT`                    | `7070`                        | no       | server       | The port to open a new tunnel.                                                                    |
| `CONNECT_MANAGEMENT_PORT`                |                               | no       | server,proxy | The port where the server listens for metrics, readiness, and shutdown.                           |
| `CONNECT_MANAGEMENT_AUTH_KEY`            |                               | no       | server       | Auth key protecting the management service endpoints.                                             |
| `CONNECT_HOST_DOMAIN`                    |                               | no       | server       | The host domain suffix for the server.                                                            |
| `CONNECT_HTTP_PORT`                      | `80`                          | no       | proxy        | The port where the proxy listens for incoming connections.                                        |
| `CONNECT_PROXY_URL`                      |                               | yes      | proxy        | The base domain name of Connect.                                                                  |
| `CONNECT_TUNNEL_URL`                     |                               | yes      | proxy        | The address of the connect server. Format: `<service-name>:<port>`.                               |
| `PLATFORM_URL`                           |                               | yes      | proxy        | The base URL of Seqera Platform.                                                                  |
| `CONNECT_STORAGE_ROOT`                   | `/data`                       | no       | proxy        | The root directory to store the proxy data.                                                       |
| `CONNECT_LOG_LEVEL`                      | `INFO`                        | no       | server,proxy | Log level for the server and proxy.                                                               |
| `CONNECT_CLIENT_NAME`                    | `tower-connect-proxy-client`  | no       | proxy        | OIDC client name used by the proxy's Studio provider.                                             |
| `CONNECT_GRANT_TYPE`                     | `authorization_code`          | no       | proxy        | OAuth grant type used by the proxy's Studio provider.                                             |
| `CONNECT_OIDC_CLIENT_REGISTRATION_TOKEN` |                               | no       | proxy        | OIDC initial access token used by the proxy.                                                      |
| `LOCAL_CACHE_TTL`                        | `2m`                          | no       | proxy        | TTL for the proxy's local session cache before syncing with redis.                                |
| `CONNECT_SSH_ENABLED`                    | `false`                       | no       | proxy        | Enable the SSH proxy server.                                                                      |
| `CONNECT_SSH_ADDR`                       | `:2222`                       | no       | proxy        | The address the SSH proxy server listens on.                                                      |
| `CONNECT_SSH_KEY_PATH`                   |                               | no       | proxy        | Path to SSH host key file. Takes precedence over `CONNECT_SSH_KEY_VALUE_BASE64` when set.         |
| `CONNECT_SSH_KEY_VALUE_BASE64`           |                               | no       | proxy        | Base64-encoded PEM SSH host key. Used as fallback when `CONNECT_SSH_KEY_PATH` is not set.         |
| `CONNECT_SSH_MAX_CONNECTIONS`            | `2000`                        | no       | proxy        | Max number of concurrent ssh connections that the server will handle before start rejecting them. |
| `CONNECT_SSH_MAX_CONN_CHANNELS`          | `30`                          | no       | proxy        | Max number of concurrent channels that a client can open per connection.                          |
| `CONNECT_SSH_HANDSHAKE_TIMEOUT`          | `1m`                          | no       | proxy        | SSH handshake timeout.                                                                            |

## DNS configuration

Each Studio is reachable at a unique URL that includes a randomly generated subdomain name. For example: `https://abcd.connect.example.com/`, where `connect.example.com` is the Studios service domain.

Provide a wildcard TLS certificate to allow for uniquely generated subdomains. A wildcard certificate common name includes `*.` in the domain name, such as `*.connect.example.com`, thereby securing any subdomain name at this level.

Studios uses the following set of domains and subdomains:

- The Platform domain that you set for `TOWER_SERVER_URL`, such as `example.com`.
- A wildcard subdomain that you must configure specifically for Studios. This wildcard subdomain is the parent for each unique session URL, such as `abcd.connect.example.com`.
- The connection proxy, defined by `CONNECT_PROXY_URL`. This URL is a first-level subdomain of your `TOWER_SERVER_URL`. For example, `https://connect.example.com`.

## Studios workspace availability

You can configure which organizational workspaces have access to Studios by setting the `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES` environment variable on the backend containers. By default, all workspaces have access to Studios. To restrict access to specific workspaces, set `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES` to a comma-separated list of workspace names. For example, `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES="12345,67890"` allows only the workspaces named `12345` and `67890` to access Studios. To disable access to Studios for all workspaces, set `TOWER_DATA_STUDIO_ALLOWED_WORKSPACES=""` (an empty string).

## Available Studios environment images

Each of the provided environments includes a particular version of the underlying software package and the version of Seqera Connect, an integrated web- and file-server.

To quickly identify which version of the software an image includes, the version string for each container is in the form of `<software_version>-<seqera_connect_version>`. For example, if the version string for the R-IDE is `2025.04.1-0.12`, version `2025.04.01` is the R-IDE version and `0.12` is the Connect version of this Seqera-built container image. Learn more about Studios [environment versioning](../studios/container-images).

- To see the list of all JupyterLab image templates available, including security scan results or to inspect the container specification (including container specifications, configuration, and manifest), see [public.cr.seqera.io/repo/platform/data-studio-jupyter][ds-jupyter].
- To see the list of all R-IDE image templates available, including security scan results or to inspect the container specification (including container specifications, configuration, and manifest), see [https://public.cr.seqera.io/repo/platform/data-studio-ride][ds-ride].
- To see the list of all Visual Studio Code image templates available, including security scan results or to inspect the container specification (including container specifications, configuration, and manifest), see [public.cr.seqera.io/platform/data-studio-vscode][ds-vscode].
- To see the list of all Xpra image templates available, including security scan results or to inspect the container specification (including container specifications, configuration, and manifest), see [public.cr.seqera.io/repo/platform/data-studio-xpra][ds-xpra].

## Path-based routing configuration

If your Enterprise deployment requires non-wildcard SSL certificates, enable path-based routing for Studios. This changes the dynamic subdomain used for each Studios session to a fixed subdomain with path-based routing.

- When `TOWER_DATA_STUDIO_ENABLE_PATH_ROUTING` is omitted, empty, or `false`, the Studios session URLs use unique subdomains:
    - https://a1234abc.connect.cloud.seqera.io/
    - https://a5678abcd.connect.cloud.seqera.io/

- When `TOWER_DATA_STUDIO_ENABLE_PATH_ROUTING=true`, the Studios session URLs use path-based routing:
    - https://connect.connect.cloud.seqera.io/_studio/a1234abc
    - https://connect.connect.cloud.seqera.io/_studio/a5678abcd

Path-based routing is only available from Seqera Platform version 25.2 and the latest Connect server and clients. It is supported for Visual Studio Code, JupyterLab, and R-IDE container template images. It is not supported for the Xpra container template image.

{/* links */}
[ds-jupyter]: https://public.cr.seqera.io/repo/platform/data-studio-jupyter
[ds-ride]: https://public.cr.seqera.io/repo/platform/data-studio-ride
[ds-vscode]: https://public.cr.seqera.io/repo/platform/data-studio-vscode
[ds-xpra]: https://public.cr.seqera.io/repo/platform/data-studio-xpra

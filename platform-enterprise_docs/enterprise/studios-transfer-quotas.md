---
title: "Configure Studios data transfer quotas"
description: Limit and monitor the data transferred to and from Studio sessions in Seqera Platform Enterprise.
date created: "2026-07-27"
last updated: "2026-07-27"
tags: [studios, connect, quotas, enterprise, administration]
---

Studio sessions stream data between users and their interactive environments through the Connect proxy. Apply _data transfer quotas_ to cap how many bytes a user or client IP transfers over a set time window. Data transfer quotas are available in Seqera Platform Enterprise only.

The Connect proxy (`connect-proxy`) enforces quotas. Quotas are opt-in. If you do not define a policy, the proxy does no counting or enforcement and adds no overhead.

:::warning[Advanced configuration]
You configure data transfer quotas through deployment settings that depend on your Redis backend and load-balancer networking. The `ip` bucket requires network-level changes that you might need to coordinate with your infrastructure or networking team.
:::

<span id="prerequisites" />

:::info[**Prerequisites**]

You need the following:

- Connect server and proxy version `0.12.0` or later. Earlier versions cannot resolve the real client IP behind a load balancer.
- Studios enabled. See [Studios installation](./install-studios).
- Access to the Connect proxy deployment configuration.
- A Redis 7.0 or later backend with server-side scripting enabled. See [Redis requirements](#redis-requirements).
- For the `ip` bucket, the ability to configure client-IP resolution on your load balancer.

:::

## Quota enforcement

You define a _policy_ that groups traffic into _buckets_. A bucket is a logical counter keyed by an identity, such as a user ID or a client IP. Each bucket has one or more _quotas_, and each quota sets a byte limit over a time window.

The proxy counts the bytes transferred in each direction (client to Studio and Studio to client) and totals them against the applicable buckets. When a bucket exceeds a quota, the proxy denies further traffic for that bucket until the window resets.

Proxy pods reconcile their counts in a shared Redis instance. Quotas apply consistently regardless of which pod serves a request.

### Fixed time windows

Each quota window is _fixed_. It starts on the first byte counted and expires a set duration later, regardless of activity in between. When a window expires, the counter resets, and the next transfer opens a fresh window.

:::caution
Because windows are independent, a user can transfer close to a full quota immediately before a window resets and another full quota immediately after. A single boundary therefore allows up to roughly twice the cap. Averaged over time, usage converges to the configured rate. Use shorter windows to tighten this bound.
:::

### Behavior when a bucket exceeds a quota

When a bucket is over quota, the proxy stops the transfer. On a standard HTTP request, the user receives an `HTTP 429` (Too Many Requests) response. On an active streaming connection (WebSocket or SSH), the proxy tears down the connection.

:::note
Some interactive clients, including VS Code, might not recover cleanly after a denied transfer and require the user to reconnect.
:::

## Redis requirements

Data transfer quotas require a Redis backend that exposes the `incrby`, `expire`, `ttl`, `mget`, `hincrby`, `hset`, `hsetnx`, `eval`, and `evalsha` commands. If you configure a policy and any of these commands is missing, renamed, or blocked by access control lists (ACLs), the proxy fails to start rather than enforce quotas incorrectly.

:::caution
Enforcement relies on server-side Lua scripting (`eval`/`evalsha`). A managed Redis service with scripting disabled cannot enforce quotas. Redis 7.0 or later is recommended for correct time-to-live (TTL) handling on quota counters.
:::

## Define a policy

A policy is a JSON document that lists the buckets to track. Each bucket has a `name`, one or more `quotas`, and one or more `extractors` that bind a protocol to the value that identifies the bucket.

```json
{
  "buckets": [
    {
      "name": "user_id",
      "quotas": [
        { "bytes": "1TB", "window": "720h", "on_exceed": "deny" }
      ],
      "extractors": [
        { "protocol": "http", "source": { "type": "header", "name": "X-Connect-Sub" } },
        { "protocol": "ssh", "source": { "type": "permissions", "field": "userId" } }
      ]
    },
    {
      "name": "ip",
      "quotas": [
        { "bytes": "50GB", "window": "24h", "on_exceed": "deny" },
        { "bytes": "3GB", "window": "1h", "on_exceed": "deny" }
      ],
      "extractors": [
        { "protocol": "any", "source": { "type": "client_ip" } }
      ]
    }
  ]
}
```

### Quota fields

Each entry in a bucket's `quotas` array defines one limit:

- `bytes` — The transfer limit. Use binary multipliers, where `KB` is 2^10 bytes, `MB` is 2^20, `GB` is 2^30, and `TB` is 2^40. The proxy reads a bare integer as bytes.
- `window` — The time window, in Go duration syntax (for example, `1h`, `24h`, `720h`).
- `on_exceed` — The action to take on breach. The proxy supports only `deny`.

Quotas in the same bucket share the same byte counters. For example, you can combine a long-window fair-use ceiling with a short-window burst cap.

### Extractor source types

Each extractor's `source.type` determines how the proxy identifies the bucket. The proxy supports only the following values:

| `type` | Fields | Protocol | Identifies by |
|--------|--------|----------|---------------|
| `header` | `name` | HTTP | The value of the named HTTP header |
| `permissions` | `field` | SSH | An entry from the SSH permissions data set at authentication |
| `jwt` | `token`, `claim` | HTTP | A claim from the validated JSON Web Token (JWT) |
| `client_ip` | _(none)_ | `any` | The proxy-resolved client IP |

:::caution
Use a `header` source only with a header that the proxy sets itself. The identity header `X-Connect-Sub` is safe because the proxy overwrites or strips any client-supplied value during authentication. Pointing a `header` source at a header the proxy does not control lets a user forge it and charge their traffic to another user's quota.
:::

The proxy validates the policy at startup. Unknown source types, duplicate bucket names, two bindings for the same protocol in one bucket, or mixing `any` with a specific protocol all prevent startup.

## Apply the policy

Configure quotas with the following environment variables. Set either `CONNECT_POLICY_B64` or `CONNECT_POLICY_FILE`, not both.

| Environment variable | Default | Description |
|----------------------|---------|-------------|
| `CONNECT_POLICY_B64` | _(empty)_ | Base64-encoded JSON traffic policy. Empty or unset disables telemetry and quota enforcement. Mutually exclusive with `CONNECT_POLICY_FILE`. |
| `CONNECT_POLICY_FILE` | _(empty)_ | Path to a JSON traffic policy file. Mutually exclusive with `CONNECT_POLICY_B64`. |
| `CONNECT_TELEMETRY_FLUSH_INTERVAL` | `30s` | How often the proxy writes in-memory byte counters to Redis. |
| `CONNECT_TELEMETRY_TTL` | `168h` | TTL for cumulative per-bucket telemetry keys in Redis (7 days). |
| `CONNECT_TELEMETRY_STREAM_EMIT_INTERVAL` | `1s` | How often long-lived streams (WebSocket and SSH) report transferred bytes. |

In a Kubernetes deployment, store the policy in a `ConfigMap` and inject it into the proxy configuration as base64.

:::info
The proxy reads the policy once at startup and does not reload it at runtime. To change a quota, update the policy `ConfigMap`, then perform a rolling restart of the proxy Deployment. Editing the `ConfigMap` alone has no effect on running pods.
:::

## Resolve the client IP for the `ip` bucket

The `ip` bucket keys on the client IP as the proxy resolves it. Behind a load balancer, that resolution needs explicit configuration. If you skip this step, the proxy counts traffic against Kubernetes node IPs instead of client IPs. Because many users share the same nodes, one busy node can exceed the limit and deny traffic to unrelated users. A single user's traffic also fragments across nodes.

:::note
This section applies only to policies that use the `ip` bucket. A policy that uses only `user_id` quotas needs no load-balancer configuration.
:::

The proxy resolves the client IP differently for HTTP and SSH traffic. Configure each separately.

### Trust `X-Forwarded-For` for HTTP traffic

An HTTP(S) load balancer, for example an AWS Application Load Balancer, terminates the connection and appends the real client IP to `X-Forwarded-For`. Set `CONNECT_TRUSTED_PROXY_CIDRS` to the CIDR ranges of the hops between your load balancer and the proxy:

```bash
CONNECT_TRUSTED_PROXY_CIDRS="10.0.0.0/8 172.16.0.0/12 192.168.0.0/16"
```

The proxy walks `X-Forwarded-For` from the right, skips trusted hops, and takes the first untrusted address as the client.

- Set the CIDRs to the node or virtual private cloud (VPC) ranges between your load balancer and the proxy. Use whichever address the proxy sees as its immediate peer.
- The default `127.0.0.1/32` is a deliberate no-op. If you leave it unset, the proxy trusts nothing and falls back to the socket peer.
- Trust only as narrow a range as necessary. Any client whose address falls inside a trusted CIDR can forge `X-Forwarded-For` and charge its traffic to another IP's bucket.

### Preserve the source IP for SSH traffic

SSH runs at Layer 4, through a network load balancer. Layer 4 carries no `X-Forwarded-For` header, and `CONNECT_TRUSTED_PROXY_CIDRS` has no effect. The real client IP must survive the network path instead. For a `NodePort` SSH service, set the following:

```yaml
externalTrafficPolicy: Local
```

`Local` skips the kube-proxy source network address translation (NAT) and gives the pod the real client IP. As a trade-off, only nodes running a proxy pod stay healthy in the load balancer's target group. Configure the load balancer health check to probe the `NodePort` so that nodes without a proxy pod drop out of rotation. Alternatively, enable the PROXY protocol on the load balancer. Without one of these two options, SSH sessions bucket on node IPs.

### Confirm client-IP resolution

Generate traffic and confirm the resolved address is a real client IP, not a node IP:

- **HTTP** — At `debug` log level, the `telemetry http` log line shows `keys: ["ip:<addr>", ...]`, and the reverse-proxy log shows `client_ip`. Both should be the public client address.
- **SSH** — The proxy logs each connection's `remote address`. The value should be the client IP, not a `172.x` address.

If the `ip:` key (or `client_ip` / `remote address`) shows a private or node range (`10.x`, `172.16`–`172.31.x`, or `192.168.x`), resolution is not configured correctly. Revisit [Trust `X-Forwarded-For` for HTTP traffic](#trust-x-forwarded-for-for-http-traffic) and [Preserve the source IP for SSH traffic](#preserve-the-source-ip-for-ssh-traffic).

:::note
The proxy emits the per-request `telemetry http` lines at `debug` level only. They do not appear at the default `INFO` level. Set `CONNECT_LOG_LEVEL=debug` temporarily while you verify, then revert it.
:::

## Monitor data transfer

### Prometheus metrics

When you load a policy, the proxy registers three metrics, labeled by bucket _name_ only (for example, `user_id` or `ip`) and never by the extracted value. Metric cardinality therefore stays bounded by your policy rather than by the number of users or IP addresses. Each configured bucket also gets a zero-valued series so that dashboards show a baseline before the first breach.

| Metric | Type | Meaning |
|--------|------|---------|
| `connect_proxy_quota_exceeded_total{bucket}` | Counter | Number of times a bucket crossed a quota and the proxy denied traffic |
| `connect_proxy_quota_cleared_total{bucket}` | Counter | Number of times a bucket returned under quota and the proxy resumed traffic |
| `connect_proxy_quota_breached_keys{bucket}` | Gauge | Number of bucket keys currently over quota |

:::note
Metric scraping and dashboards are available in Seqera Platform Cloud only. For self-managed Enterprise deployments, use the Redis and log-based checks described later on this page to observe quotas.
:::

### Inspect counters in Redis

The proxy stores quota data in Redis under the `connect:telemetry` prefix. For each bucket value, the proxy maintains a cumulative record for analytics and a separate counter per quota window for enforcement. The enforcement counters carry a `q<window>` suffix, for example `:q60` for a 60-second window.

Use the following commands to inspect a user's counters during troubleshooting:

```bash
# List telemetry keys. Use SCAN, not KEYS — KEYS blocks the whole Redis server.
SCAN 0 MATCH connect:telemetry:* COUNT 100

# A user's quota counter and time remaining in the window
GET connect:telemetry:user_id:42:q60
TTL connect:telemetry:user_id:42:q60

# A user's cumulative transfer totals
HGETALL connect:telemetry:user_id:42
```

Interpret the quota counter as follows:

- Value below the cap — the bucket is within quota.
- Value at or above the cap — the bucket is breached, and the proxy denies traffic until the window expires.
- Key absent (`TTL` returns `-2`, `GET` returns nil) — the window has expired, and the next transfer opens a new one.

### Log messages

Watch for these proxy log lines:

- `telemetry flushed {entries: N}` — a healthy flush to Redis.
- `telemetry flush failed, will retry next tick` — a Redis write error. The proxy retains the counters and retries them.
- `quota exceeded, denying traffic for bucket` / `quota cleared, resuming traffic` — enforcement transitions.

## Troubleshooting

For quota enforcement and client-IP issues, see [Studios troubleshooting](../troubleshooting_and_faqs/studios_troubleshooting#data-transfer-quotas).

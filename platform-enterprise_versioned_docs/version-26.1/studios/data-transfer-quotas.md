---
title: Data transfer quotas
description: Limit and monitor the data transferred to and from Studio sessions in Seqera Platform Enterprise.
date created: "2026-07-07"
tags: [studios, connect, quotas, enterprise, administration]
---

Studio sessions stream data between users and their interactive environments through the Connect proxy. In Seqera Platform Enterprise, you can apply _data transfer quotas_ to cap how many bytes a given user or client IP can transfer over a defined time window, and monitor transfer volume through Prometheus metrics.

Quotas are enforced by the Connect proxy (`connect-proxy`) and are configured entirely through deployment settings. They are opt-in: if you don't define a policy, no counting or enforcement occurs and there is no additional overhead.

:::note
Data transfer quotas apply to Studios in Seqera Platform Enterprise only. They are configured by platform administrators as part of the deployment and are not exposed in the Platform UI.
:::

## How quotas work

You define a _policy_ that groups traffic into _buckets_. A bucket is a logical counter keyed by an identity, such as a user ID or a client IP. Each bucket has one or more _quotas_, and each quota sets a byte limit over a time window.

The proxy counts the bytes transferred in each direction — client to Studio and Studio to client — and totals them against the applicable buckets. When a bucket exceeds a quota, the proxy denies further traffic for that bucket until the window resets.

Counting is distributed across proxy pods and reconciled in a shared Redis instance, so quotas apply consistently regardless of which pod serves a request.

### Fixed time windows

Each quota window is _fixed_: it starts on the first byte counted and expires a set duration later, regardless of activity in between. When a window expires, the counter resets and the next transfer opens a fresh window.

:::caution
Because windows are independent, a user can transfer close to a full quota just before a window resets and another full quota just after — up to roughly twice the cap across a single boundary. Averaged over time, usage still converges to the configured rate. Use shorter windows to tighten this bound.
:::

### What users experience when a quota is exceeded

When a bucket is over quota, the proxy stops the transfer. On a standard HTTP request, the user receives an **HTTP 429 (Too Many Requests)** response. On an active streaming connection (WebSocket or SSH), the connection is torn down.

:::note
Some interactive clients — for example, VS Code and similar IDE-style tools — may not recover cleanly after a transfer is denied mid-session and can require the user to reconnect. A Studio that stalls after a large upload or download is the expected symptom of a breached quota, not a fault in the session itself.
:::

## Prerequisites

Data transfer quotas require a Redis backend that exposes the following commands: `incrby`, `expire`, `ttl`, `mget`, `hincrby`, `hset`, `hsetnx`, `eval`, and `evalsha`. If a policy is configured and any of these commands is missing, renamed, or blocked by ACLs, the proxy fails to start rather than enforce quotas incorrectly.

:::caution
Enforcement relies on server-side Lua scripting (`eval`/`evalsha`). A managed Redis service with scripting disabled cannot enforce quotas. Redis 7.0 or later is recommended for correct time-to-live handling on quota counters.
:::

## Define a policy

A policy is a JSON document listing the buckets to track. Each bucket has a `name`, one or more `quotas`, and one or more `extractors` that bind a protocol to the value used to identify the bucket.

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

- `bytes` — The transfer limit. Use binary multipliers (`KB` = 2¹⁰, `MB` = 2²⁰, `GB` = 2³⁰, `TB` = 2⁴⁰); a bare integer is interpreted as bytes.
- `window` — The time window, using Go duration syntax (for example, `1h`, `24h`, `720h`).
- `on_exceed` — The action to take on breach. Only `deny` is supported.

A bucket can have multiple quotas that share the same byte counters — for example, a long-window fair-use ceiling alongside a short-window burst cap.

### Extractor source types

Each extractor's `source.type` determines how the proxy identifies the bucket. These are the only supported values:

| `type` | Fields | Protocol | Identifies by |
|--------|--------|----------|---------------|
| `header` | `name` | HTTP | The value of the named HTTP header |
| `permissions` | `field` | SSH | An entry from the SSH permissions data set at authentication |
| `jwt` | `token`, `claim` | HTTP | A claim from the validated JWT |
| `client_ip` | _(none)_ | any | The proxy-resolved client IP |

:::caution
Only use a `header` source with a header that the proxy sets itself. The identity header `X-Connect-Sub` is safe because the proxy overwrites or strips any client-supplied value during authentication. Pointing a `header` source at a header the proxy does not control would let a user forge it and attribute their traffic to another user's quota.
:::

The policy is validated when the proxy starts. Unknown source types, duplicate bucket names, two bindings for the same protocol in one bucket, or mixing `any` with a specific protocol all prevent startup.

## Apply the policy

Provide the policy to the proxy through one of two mutually exclusive environment variables:

| Setting | Environment variable | Default | Notes |
|---------|----------------------|---------|-------|
| Policy (base64 JSON) | `CONNECT_POLICY_B64` | _(empty)_ | Base64-encoded policy JSON. Empty or unset disables quotas. Mutually exclusive with `CONNECT_POLICY_FILE`. |
| Policy (file path) | `CONNECT_POLICY_FILE` | _(empty)_ | Path to a JSON policy file. Mutually exclusive with `CONNECT_POLICY_B64`. |
| Flush interval | `CONNECT_TELEMETRY_FLUSH_INTERVAL` | `30s` | How often in-memory byte counters are written to Redis. |
| Telemetry key TTL | `CONNECT_TELEMETRY_TTL` | `168h` | Time-to-live for the cumulative per-bucket telemetry data in Redis (7 days). |
| Stream emit interval | `CONNECT_TELEMETRY_STREAM_EMIT_INTERVAL` | `1s` | How often long-lived streams (WebSocket and SSH) report transferred bytes. |

In a Kubernetes deployment, the policy is typically stored in a `ConfigMap` and injected into the proxy configuration as base64.

:::info
The policy is read once when the proxy starts and is not reloaded at runtime. **To change a quota, update the policy `ConfigMap` and redeploy the proxy.**
:::

## Monitor data transfer

### Prometheus metrics

When a policy is loaded, the proxy registers three metrics. Each is labeled by bucket _name_ only (for example, `user_id` or `ip`) and never by the extracted value, so metric cardinality stays bounded by your policy rather than by the number of users or IPs. A zero-valued series is created for each configured bucket so dashboards show a baseline before the first breach.

| Metric | Type | Meaning |
|--------|------|---------|
| `connect_proxy_quota_exceeded_total{bucket}` | Counter | Number of times a bucket crossed a quota and traffic was denied |
| `connect_proxy_quota_cleared_total{bucket}` | Counter | Number of times a bucket returned under quota and traffic resumed |
| `connect_proxy_quota_breached_keys{bucket}` | Gauge | Number of bucket keys currently over quota |

These metrics are the data source for the Grafana data transfer dashboard.

### Inspect counters in Redis

Quota data is stored in Redis under the `connect:telemetry` prefix. For each bucket value, the proxy maintains a cumulative record for analytics and a separate counter per quota window for enforcement. The enforcement counters carry a `q<window>` suffix — for example, `:q60` for a 60-second window.

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
- Value at or above the cap — the bucket is breached and traffic is denied until the window expires.
- Key absent (`TTL` returns `-2`, `GET` returns nil) — the window has expired; the next transfer opens a new one.

### Log messages

Watch for these proxy log lines:

- `telemetry flushed {entries: N}` — a healthy flush to Redis.
- `telemetry flush failed, will retry next tick` — a Redis write error; counters are retained and retried.
- `quota exceeded, denying traffic for bucket` / `quota cleared, resuming traffic` — enforcement transitions.

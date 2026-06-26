---
title: "Tower Agent"
description: "Instructions to use Tower Agent."
date created: "2023-04-24"
last updated: "2026-06-26"
tags: [agent]
---

Tower Agent enables Seqera Platform to launch pipelines on high-performance computing (HPC) clusters that do not allow inbound SSH connections from external systems.

## How Tower Agent works

Many HPC clusters sit behind strict firewalls that block all inbound connections to login nodes. Tower Agent solves this by reversing the connection direction: the agent runs on a node that can submit jobs to the cluster (typically the login node) and establishes an outbound authenticated WebSocket connection to Seqera. Seqera then sends pipeline execution commands through this open channel, which the agent carries out locally on the cluster.

Because the agent initiates all connections, no inbound ports need to be opened on the cluster firewall.

## Prerequisites

Before installing Tower Agent, confirm the following:

- You have access to a login node (or any node that can submit jobs to the cluster scheduler).
- The login node can make outbound HTTPS connections to `api.cloud.seqera.io`.
- You have a Seqera [personal access token](https://docs.seqera.io/platform-api/create-token).

## Installation

Tower Agent is distributed as a single executable binary file.

1. Download the latest release from [GitHub](https://github.com/seqeralabs/tower-agent) and make the file executable:

   ```bash
   curl -fSL https://github.com/seqeralabs/tower-agent/releases/latest/download/tw-agent-linux-x86_64 > tw-agent
   chmod +x ./tw-agent
   ```

2. (Optional) Move it to a directory in your `$PATH`.

## Configuration

Before running the agent, create credentials in Seqera Platform to associate a connection ID with your workspace.

1. Create a [**personal access token**](https://docs.seqera.io/platform-api/create-token).

2. Create [Tower Agent credentials](../../credentials/agent_credentials) in a Seqera Platform workspace.

:::note
To share a single Tower Agent instance with all members of a workspace, create a Tower Agent credential with **Shared agent** enabled.
:::

When you create the credentials, Seqera generates an _Agent Connection ID_. You can use the generated ID or enter a custom one. The connection ID in the workspace credentials must match the ID you pass when starting the agent.

## Running the agent

Set your access token and start the agent with your connection ID:

```bash
export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
./tw-agent <YOUR CONNECTION ID>
```

### Keeping the agent running

The agent must run continuously to accept incoming requests from Seqera. On HPC login nodes, the recommended approach is a terminal multiplexer or a systemd user service.

**Using tmux or GNU Screen:**

```bash
tmux new-session -s tower-agent
export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
./tw-agent <YOUR CONNECTION ID>
# Detach with Ctrl+B, D
```

**Using a systemd user service:**

Create the service unit file at `~/.config/systemd/user/tower-agent.service`:

```ini
[Unit]
Description=Tower Agent
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/path/to/tw-agent <YOUR CONNECTION ID>
Restart=on-failure
RestartSec=10
Environment=TOWER_ACCESS_TOKEN=<YOUR TOKEN>

[Install]
WantedBy=default.target
```

Enable and start the service:

```bash
systemctl --user enable tower-agent
systemctl --user start tower-agent
# Check status
systemctl --user status tower-agent
```

:::note
For systemd user services to run after logout, the cluster administrator must enable lingering for your user account: `loginctl enable-linger <username>`.
:::

## Configuration reference

### CLI options

```
Usage: tw-agent [OPTIONS] AGENT_CONNECTION_ID

Nextflow Tower Agent

Parameters:
*     AGENT_CONNECTION_ID    Agent connection ID to identify this agent.

Options:
* -t, --access-token=<token> Tower personal access token. If not provided, the TOWER_ACCESS_TOKEN variable will be used.
  -u, --url=<url>            Tower server API endpoint URL. If not provided TOWER_API_ENDPOINT variable will be used [default: https://api.cloud.seqera.io].
  -w, --work-dir=<workDir>   Default path where the pipeline scratch data is stored. It can be changed when launching a pipeline from Tower [default: ~/work].
  -h, --help                 Show this help message and exit.
  -V, --version              Print version information and exit.
```

### Environment variables

| Variable | Description |
|---|---|
| `TOWER_ACCESS_TOKEN` | Seqera personal access token. Required if `--access-token` is not set. |
| `TOWER_API_ENDPOINT` | Seqera API endpoint URL. Defaults to `https://api.cloud.seqera.io`. |
| `TOWER_AGENT_HEARTBEAT` | Heartbeat interval in seconds. Defaults to `45`. Increase this value if your network drops idle connections. |

### Notes

- By default, the agent uses `${HOME}/work` as the Nextflow work directory. Override this with `--work-dir` or by setting the work directory when creating a compute environment in Seqera.
- The work directory must exist before you start the agent. The agent does not create it.

## Troubleshooting

### Enable trace logging

To diagnose connection or execution issues, enable trace-level logging using the `LOGGER_LEVELS_IO_SEQERA_TOWER_AGENT` environment variable:

```bash
export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
export LOGGER_LEVELS_IO_SEQERA_TOWER_AGENT=TRACE
./tw-agent <YOUR CONNECTION ID>
```

Or as a one-liner:

```bash
LOGGER_LEVELS_IO_SEQERA_TOWER_AGENT=TRACE ./tw-agent <YOUR CONNECTION ID>
```

Trace logging shows:

- WebSocket connection establishment and handshake details
- All message exchanges (command requests, responses, heartbeats)
- Session expiration and reconnection attempts
- Command execution details and exit codes
- Full stack traces for errors

### Common issues

**The agent connects but pipelines fail to launch**

Confirm that the work directory exists on the login node and is writable by the user running the agent:

```bash
mkdir -p ~/work
```

**The agent disconnects after idle periods**

Some networks close idle connections. Reduce `TOWER_AGENT_HEARTBEAT` to a shorter interval (for example, `30`) to send more frequent keep-alive messages:

```bash
export TOWER_AGENT_HEARTBEAT=30
```

**Connection ID mismatch**

The connection ID used when starting the agent must exactly match the **Agent connection ID** field in your Seqera workspace credentials. Check both values if pipelines fail to route to the agent.

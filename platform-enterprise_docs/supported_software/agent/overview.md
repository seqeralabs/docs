---
title: "Tower Agent"
description: "Use Tower Agent to connect Seqera Platform to HPC clusters that do not allow inbound SSH connections."
date created: "2023-04-24"
last updated: "2026-07-13"
tags: [agent]
---

Tower Agent connects Seqera Platform to high-performance computing (HPC) clusters that do not accept inbound SSH connections.

## When to use the agent

Use Tower Agent if your HPC cluster has any of these constraints:

- **No public-facing login node.** The cluster is behind a bastion host, VPN, or jump server, with login nodes that have no routable public IP.
- **Strict inbound firewall rules.** Security teams allow outbound traffic but block unsolicited inbound connections, including SSH from third parties.
- **Multi-factor authentication.** Login requires a hardware token or TOTP. Automated SSH from an external service is impractical.
- **Air-gapped or regulated environments.** Clinical, pharmaceutical, and regulated research clusters are often isolated for compliance.
- **No shared service accounts.** Some institutions require every job to run under an individual user identity rather than a shared account.

If your cluster accepts inbound SSH from Seqera Platform, the standard SSH-based or managed-identity compute environment is simpler to operate (no persistent process to manage). Use Tower Agent when SSH is not an option.

## Connection model

The default Seqera Platform HPC model opens an SSH connection to the cluster login node, submits the Nextflow head job, and monitors execution from there. That model requires the cluster to be reachable from the internet.

Tower Agent reverses the connection direction. The agent runs on a node that can submit jobs to the scheduler (typically the login node) and opens a persistent outbound authenticated WebSocket connection to Seqera. Seqera sends pipeline commands (submit jobs, check status, stream logs) through that channel. The agent executes them locally as the user who started it.

This approach has three properties:

- **Jobs run as you.** The agent submits to the scheduler as the Linux user who launched it. Job accounting, quotas, and audit logs reflect the correct identity, with no shared service account.
- **No new firewall rules required.** The cluster only needs outbound HTTPS, the same traffic any browser already makes.
- **Credentials stay on the cluster.** SSH keys, Kerberos tickets, and scheduler credentials never leave the cluster. Seqera does not authenticate to your HPC. The agent authenticates locally.

Seqera Platform handles pipeline launch, monitoring, logs, resource metrics, and run reports. The agent forwards commands and returns results.

## Connect an HPC cluster

Connecting your cluster to Seqera Platform takes six steps: generate an access token, create credentials, install the agent on a login node, start it under tmux, create an HPC compute environment, and launch a pipeline. Complete them in order.

:::info[**Prerequisites**]

You need the following:

- SSH access to a login node, or any node that can submit jobs to your scheduler.
- Outbound HTTPS access from that node to your Seqera Platform API endpoint.
- A Seqera Platform account with a workspace you can add credentials to.

:::

### Generate a personal access token

The agent authenticates to Seqera Platform with a personal access token (PAT) tied to your user account.

1. Log in to Seqera Platform.
2. Open your user menu and select **Your tokens**.
3. Select **Add token**, give it a descriptive name (for example, `hpc-agent-token`), and create it.
4. Copy the token immediately. You cannot view it again after leaving the page.

### Create Tower Agent credentials

Create a Tower Agent credential in the workspace where you run pipelines. The agent uses the credential's connection ID to identify itself to Seqera Platform.

1. In your workspace, go to **Credentials** and select **Add credentials**.
2. Select **Tower Agent** as the provider.
3. Enter a name for the credential.
4. Accept the auto-generated **Agent Connection ID** or enter a custom one. Note it down. The ID in the credential must exactly match the ID you pass when starting the agent.
5. To let a single agent serve all workspace members, enable **Shared agent**. For per-user identity on submitted jobs, leave this disabled and ask each user to run their own agent.
6. Select **Add**.

### Install the agent on the login node

The agent is a single self-contained binary with no other dependencies to install.

1. SSH into the login node and download the latest agent binary:

    ```bash
    curl -fSL https://github.com/seqeralabs/tower-agent/releases/latest/download/tw-agent-linux-x86_64 > tw-agent
    chmod +x ./tw-agent
    ```

2. Optionally, move it to a directory in your `$PATH`:

    ```bash
    mkdir -p ~/bin
    mv tw-agent ~/bin/
    ```

3. Create the default work directory if it does not already exist:

    ```bash
    mkdir -p ~/work
    ```

:::note
On most HPC clusters, home directories have small quotas. Use `--work-dir` to point the agent at a scratch filesystem (for example, `/scratch/$USER/nextflow-work`).
:::

### Start the agent inside tmux

The agent must run continuously to accept incoming requests from Seqera. If you run it directly in an SSH session and disconnect, the process exits when the session closes.

The standard solution on HPC is a terminal multiplexer. Both [tmux](https://github.com/tmux/tmux) and [GNU Screen](https://www.gnu.org/software/screen/) decouple processes from the terminal that started them. Your session runs inside a background server on the login node, and your terminal attaches to that server. If you detach or get disconnected, the session keeps running. SSH back in later and reattach to resume.

Start a new tmux session:

```bash
tmux new -s tower-agent
```

Inside tmux, export your access token and start the agent with your connection ID:

```bash
export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
./tw-agent <YOUR CONNECTION ID>
```

For Seqera Platform Enterprise, also set your API endpoint:

```bash
export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
export TOWER_API_ENDPOINT=https://platform.yourcompany.com/api
./tw-agent <YOUR CONNECTION ID>
```

When the agent logs that it has connected to Seqera Platform, detach from tmux with **Ctrl-b**, then **d**. You return to the login shell, and the agent keeps running in the background.

Verify the session is still active:

```bash
tmux ls
# tower-agent: 1 windows (created ...) [detached]
```

You can now log out. The agent keeps running.

:::tip[tmux quick reference]

| Action | Command |
|---|---|
| Start a new named session | `tmux new -s agent` |
| Detach from current session | Ctrl-b then d |
| List existing sessions | `tmux ls` |
| Reattach to a session | `tmux attach -t agent` |
| Kill a session | `tmux kill-session -t agent` |

:::

:::note
If your site reboots login nodes on a schedule, restart the agent afterwards. Some clusters support systemd user services for persistent processes. Check with your HPC administrators if tmux is not sufficient for your site.
:::

### Create an HPC compute environment

Create an HPC compute environment that uses your Tower Agent credential. Seqera routes every pipeline launch in this environment through the agent.

In Seqera Platform:

1. Go to **Compute environments** and select **Add compute environment**.
2. Select your HPC scheduler (Slurm, LSF, PBS Pro, or Grid Engine).
3. Under **Credentials**, select the Tower Agent credential you created earlier.
4. Set the work directory to a path the agent can access on the login node.
5. Complete the remaining fields: head queue, compute queue, and any environment variables or run scripts your site requires.
6. Select **Create**. Seqera validates the environment by running a test command through the agent.

See [HPC compute environments](../../compute-envs/hpc) for full field descriptions.

### Launch a pipeline

Select a pipeline from your workspace **Launchpad**, select your new HPC compute environment, and launch. Seqera sends the launch request to the agent. The agent submits the Nextflow head job to your scheduler, and the head job dispatches tasks to compute nodes. You get the same monitoring, logs, and metrics as any other compute environment.

## Configuration reference

### CLI options

Run the agent with a connection ID and any options:

```bash
tw-agent [OPTIONS] AGENT_CONNECTION_ID
```

**Parameters**

| Parameter | Description |
|---|---|
| `AGENT_CONNECTION_ID` | Agent connection ID that identifies this agent. Must match the **Agent Connection ID** in the credential. |

**Options**

| Option | Default | Description |
|---|---|---|
| `-t`, `--access-token=<token>` | — | Seqera personal access token. Required unless `TOWER_ACCESS_TOKEN` is set. |
| `-u`, `--url=<url>` | — | Seqera API endpoint URL. If not set, `TOWER_API_ENDPOINT` is used. |
| `-w`, `--work-dir=<workDir>` | `~/work` | Path where pipeline scratch data is stored. You can change it when launching a pipeline. |
| `-h`, `--help` | — | Show the help message and exit. |
| `-V`, `--version` | — | Print version information and exit. |

### Environment variables

The agent reads the following environment variables:

| Variable | Description |
|---|---|
| `TOWER_ACCESS_TOKEN` | Seqera personal access token. Required if `--access-token` is not set. |
| `TOWER_API_ENDPOINT` | Seqera API endpoint URL. Required for Enterprise deployments if `--url` is not set. |
| `TOWER_AGENT_HEARTBEAT` | Heartbeat interval in seconds. Defaults to `45`. Reduce this value if your network drops idle connections. |

## Troubleshooting

For agent and connection issues, see [Tower Agent troubleshooting](../../troubleshooting_and_faqs/troubleshooting#tower-agent).

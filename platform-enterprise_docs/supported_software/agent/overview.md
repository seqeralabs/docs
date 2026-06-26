---
title: "Tower Agent"
description: "Use Tower Agent to connect Seqera Platform to HPC clusters that do not allow inbound SSH connections."
date created: "2023-04-24"
last updated: "2026-06-26"
tags: [agent]
---

Tower Agent enables Seqera Platform to launch pipelines on high-performance computing (HPC) clusters that do not allow inbound SSH connections from external systems.

## When to use Tower Agent

Use Tower Agent when your HPC cluster falls into one of these categories:

- **No public-facing login node.** The cluster sits behind a bastion host, VPN, or jump server, with login nodes that have no routable public IP.
- **Strict inbound firewall rules.** Security teams allow outbound traffic but block unsolicited inbound connections, including SSH from third parties.
- **Multi-factor authentication.** Logging in requires a hardware token or TOTP, making automated SSH from an external service impractical.
- **Air-gapped or regulated environments.** Clinical, pharmaceutical, and regulated research clusters are often deliberately isolated for compliance.
- **No shared service accounts.** Some institutions require every job to run under an individual user identity rather than a shared account.

If your cluster accepts inbound SSH from Seqera Platform, the standard SSH-based or managed-identity compute environment is simpler to operate — no persistent process to manage. Tower Agent fills the gap when SSH is not an option.

## How Tower Agent works

Seqera Platform's default HPC model opens an SSH connection to the cluster login node, submits the Nextflow head job, and monitors execution from there. That model requires the cluster to be reachable from the internet.

Tower Agent reverses the connection direction. The agent runs on a node that can submit jobs to the scheduler (typically the login node) and opens a persistent outbound authenticated WebSocket connection to Seqera. Seqera sends pipeline commands — submit this job, check status, stream logs — through that established channel. The agent executes them locally as the user who started it.

```
┌──────────────────┐                     ┌──────────────────────┐
│                  │                     │                      │
│ Seqera Platform  │ ◄──── outbound ──── │  Login node          │
│ (cloud or        │      secure         │  ┌────────────────┐  │
│  enterprise)     │     channel         │  │   tw-agent     │  │
│                  │                     │  └────────────────┘  │
└──────────────────┘                     │           │          │
                                         │           │ submits  │
                                         │           ▼          │
                                         │  ┌────────────────┐  │
                                         │  │ Slurm / LSF /  │  │
                                         │  │ PBS / SGE      │  │
                                         │  └────────────────┘  │
                                         │           │          │
                                         │           ▼          │
                                         │     Worker nodes     │
                                         └──────────────────────┘
```

This gives you several useful properties:

- **Jobs run as you.** The agent submits to the scheduler as the Linux user who launched it. No shared service account — job accounting, quotas, and audit logs all reflect the correct identity.
- **No new firewall rules required.** The cluster only needs outbound HTTPS — the same traffic any user with a browser already makes.
- **Credentials stay on the cluster.** SSH keys, Kerberos tickets, and scheduler credentials never leave the cluster. Seqera does not authenticate to your HPC; the agent does, locally.

Seqera Platform still handles pipeline launch, monitoring, logs, resource metrics, and run reports. The agent is the bridge that makes this possible without exposing your cluster.

## Setup

### Prerequisites

- SSH access to a login node (or any node that can submit jobs to your scheduler).
- Outbound HTTPS access from that node to your Seqera Platform API endpoint.
- A Seqera Platform account with a workspace you can add credentials to.

### Step 1: Generate a personal access token

The agent authenticates to Seqera Platform with a personal access token tied to your user account.

1. Log in to Seqera Platform.
2. Open your user menu and select **Your tokens**.
3. Select **Add token**, give it a descriptive name (for example, `hpc-agent-token`), and create it.
4. Copy the token immediately — you cannot view it again after leaving the page.

### Step 2: Create Tower Agent credentials in your workspace

1. In your workspace, go to **Credentials** and select **Add credentials**.
2. Select **Tower Agent** as the provider.
3. Enter a name for the credential.
4. Accept the auto-generated **Agent Connection ID** or enter a custom one. Note it down — the ID in the credential must exactly match the ID you pass when starting the agent.
5. To let a single agent serve all workspace members, enable **Shared agent**. For per-user identity on submitted jobs, leave this disabled and have each user run their own agent.
6. Select **Add**.

### Step 3: Install the agent on the login node

SSH into the login node and download the latest agent binary:

```bash
curl -fSL https://github.com/seqeralabs/tower-agent/releases/latest/download/tw-agent-linux-x86_64 > tw-agent
chmod +x ./tw-agent
```

Optionally move it to a directory in your `$PATH`:

```bash
mkdir -p ~/bin
mv tw-agent ~/bin/
```

Create the default work directory if it does not already exist:

```bash
mkdir -p ~/work
```

:::note
On most HPC clusters, home directories have small quotas. Use `--work-dir` to point the agent at a scratch filesystem instead (for example, `/scratch/$USER/nextflow-work`).
:::

### Step 4: Start the agent inside tmux

The agent must run continuously to accept incoming requests from Seqera. If you run it directly in an SSH session and then disconnect, the process exits when the session closes.

The standard solution on HPC is a terminal multiplexer. [tmux](https://github.com/tmux/tmux) and [GNU Screen](https://www.gnu.org/software/screen/) both decouple processes from the terminal that started them: your session runs inside a background server on the login node, and your terminal attaches to it rather than owning it. Detach (or get disconnected) and the session keeps running. SSH back in later and attach to pick up exactly where you left off.

Start a new tmux session:

```bash
tmux new -s tower-agent
```

Inside tmux, export your access token and start the agent with your connection ID:

```bash
export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
./tw-agent <YOUR CONNECTION ID>
```

For Seqera Platform Enterprise (on-prem), also set your API endpoint:

```bash
export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
export TOWER_API_ENDPOINT=https://platform.yourcompany.com/api
./tw-agent <YOUR CONNECTION ID>
```

When the agent logs that it has connected to Platform, detach from tmux with **Ctrl-b**, then **d**. You return to the regular login shell while the agent continues running in the background.

Verify the session is still active:

```bash
tmux ls
# tower-agent: 1 windows (created ...) [detached]
```

You can now log out. The agent keeps running.

**tmux quick reference:**

| Action | Command |
|---|---|
| Start a new named session | `tmux new -s agent` |
| Detach from current session | Ctrl-b then d |
| List existing sessions | `tmux ls` |
| Reattach to a session | `tmux attach -t agent` |
| Kill a session | `tmux kill-session -t agent` |

:::note
If your site reboots login nodes on a schedule, you need to restart the agent afterwards. Some clusters support systemd user services for genuinely persistent processes — check with your HPC administrators if tmux is not sufficient for your site.
:::

### Step 5: Create an HPC compute environment in Seqera

In Seqera Platform:

1. Go to **Compute environments** and select **Add compute environment**.
2. Choose your HPC scheduler (Slurm, LSF, PBS Pro, Grid Engine, and so on).
3. Under **Credentials**, select the Tower Agent credential you created in step 2.
4. Set the work directory to the path accessible to the agent on the login node.
5. Complete the remaining fields (head queue, compute queue, and any environment variables or run scripts your site requires).
6. Select **Create**. Seqera validates the environment by running a test command through the agent.

See [HPC compute environments](../../compute-envs/hpc) for full field descriptions.

### Step 6: Launch a pipeline

Select a pipeline from your workspace launchpad, choose your new HPC compute environment, and launch. Seqera sends the launch request to the agent, the agent submits the Nextflow head job to your scheduler, and the head job dispatches tasks to compute nodes. You get the same monitoring, logs, and metrics as any other compute environment.

## Configuration reference

### CLI options

```
Usage: tw-agent [OPTIONS] AGENT_CONNECTION_ID

Nextflow Tower Agent

Parameters:
*     AGENT_CONNECTION_ID    Agent connection ID to identify this agent.

Options:
* -t, --access-token=<token> Tower personal access token. If not provided, the TOWER_ACCESS_TOKEN variable will be used.
  -u, --url=<url>            Tower server API endpoint URL. If not provided TOWER_API_ENDPOINT variable will be used.
  -w, --work-dir=<workDir>   Default path where the pipeline scratch data is stored. It can be changed when launching a pipeline from Tower [default: ~/work].
  -h, --help                 Show this help message and exit.
  -V, --version              Print version information and exit.
```

### Environment variables

| Variable | Description |
|---|---|
| `TOWER_ACCESS_TOKEN` | Seqera personal access token. Required if `--access-token` is not set. |
| `TOWER_API_ENDPOINT` | Seqera API endpoint URL. Required for Enterprise deployments if `--url` is not set. |
| `TOWER_AGENT_HEARTBEAT` | Heartbeat interval in seconds. Defaults to `45`. Reduce this value if your network drops idle connections. |

## Troubleshooting

### Reattaching to a running agent

When you SSH back into the login node, attach to the agent session at any time:

```bash
tmux attach -t tower-agent
```

You can see the current log output. Detach again with Ctrl-b, then d to leave it running.

### The agent stopped

If `tmux ls` shows no sessions, or attaching reveals the agent has exited, restart it as in step 4. Common causes: login node reboot, the process killed for exceeding login-node resource limits, or the access token revoked.

### Connection ID mismatch

If Seqera Platform shows the agent as disconnected while it is running on the cluster, verify that the **Agent Connection ID** in your workspace credential exactly matches the argument you passed to `tw-agent`.

### Token errors

Personal access tokens can be revoked or expire. If the agent logs authentication errors, generate a new token in Platform and restart the agent with the updated `TOWER_ACCESS_TOKEN` value.

### Work directory errors

The agent needs read and write access to the work directory. If launches fail with permission errors, confirm that the directory exists and is owned by the user running the agent:

```bash
mkdir -p ~/work
```

### Enable trace logging

To diagnose connection or execution issues in detail, enable trace-level logging:

```bash
export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
export LOGGER_LEVELS_IO_SEQERA_TOWER_AGENT=TRACE
./tw-agent <YOUR CONNECTION ID>
```

Trace logging shows WebSocket connection details, all message exchanges, reconnection attempts, command execution details and exit codes, and full stack traces for errors.

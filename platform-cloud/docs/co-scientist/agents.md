---
title: "Agents"
description: "Create reusable background agents in a workspace and run them against your pipelines"
date created: "2026-08-28"
tags: [co-scientist, platform, agent, ai]
---

An agent is a reusable, named set of instructions that Co-Scientist runs on your behalf in a Seqera Platform workspace. Where a Co-Scientist conversation is interactive and starts empty each time, an agent captures a task you repeat — investigating failed runs, summarizing results — so anyone in the workspace can run it without rewriting the prompt.

Agents are workspace-scoped. Every agent in a workspace is visible to everyone with permission to read agents, not only the person who created it. An agent acts as the [service account](#agent-identity-and-permissions) bound to it rather than as the person who starts it, and reaches private repositories through the [Git credentials](#access-to-private-git-repositories) in its workspace.

:::info
Agents are being rolled out to Seqera Platform Cloud. If you do not see **Agents** under **AI** in the workspace navigation, contact Seqera to enable it for your organization.
:::

## Agents, chat, and coding agents

Seqera uses "agent" for three different things. This page covers the first:

- **Agents** — reusable instruction sets you create in a workspace and run against your pipelines, described here.
- **[Co-Scientist chat](./index.md)** — the interactive assistant, in the Seqera CLI and in the Co-Scientist panel in Seqera Platform.
- **[Coding agents](./coding-agents.md)** — third-party tools such as Claude Code or Codex, which you connect to Seqera through a skill.

Agents are also unrelated to Tower Agent, the component that connects Seqera Platform to an HPC cluster.

### Agents compared with Co-Scientist chat

Agents and Co-Scientist chat are the same assistant reached two ways. Both work inside a Seqera Platform workspace and can read your runs and act on them. They differ in who they act as, who sees them, and what starts them.

| | Agent | Co-Scientist chat |
|---|---|---|
| Where it runs | In the background, once started | In the Co-Scientist panel in Seqera Platform, while you watch |
| Instructions | Written once and saved, reused on every run | Written fresh in each conversation |
| Acts as | The service account bound to the agent | You, with your own permissions |
| Who sees it | Everyone in the workspace who can read agents | Only you, in your own session |
| What starts it | You, from a run — or an event, where automated actions are enabled | You, by typing in the panel |

## Permissions

Two things control agents: the workspace grants that decide who can see and manage them, and the service account that decides what an agent can do when it runs.

### Who can manage agents

Access to agents is controlled by three workspace grants:

| Grant | Allows |
|---|---|
| `Agent_Read` | View and search the workspace's agents |
| `Agent_Write` | Create and edit agents, and enable or disable them |
| `Agent_Delete` | Remove an agent |

**Agents** appears in the navigation only for users with `Agent_Read`.

### Agent identity and permissions

An agent acts as a service account, not as the person who starts it. Bind one under **Agent permissions** when you create or edit the agent: every run of that agent then uses that account's roles, so the agent can only reach what the service account is allowed to reach, whoever runs it.

- Only service accounts assigned to the agent's workspace can be bound. An account with no role in the workspace cannot act there.
- You cannot bind a service account that holds permissions you do not hold in the workspace yourself.
- Service accounts belong to the organization. If none is assigned to your workspace, ask an organization owner to create one and assign it before you create the agent.
- If the bound service account is later disabled or removed, the agent's runs fail rather than fall back to the permissions of whoever started them.

:::caution
Scope the service account to what the agent's instructions need. Every run of the agent carries those permissions, started by anyone in the workspace who can read the agent.
:::

If you do not see an **Agent permissions** section on the agent form, service accounts are not enabled for your organization and the agent's runs act as the user who starts them.

## Access to private Git repositories

An agent reads pipeline code through the Git credentials in the workspace it runs in. To let an agent work with a private repository, add credentials for that repository to that workspace.

For GitHub, add a [GitHub App credential](../git/overview.md#github): the app is installed against the repositories you choose, so the agent's access is scoped per repository and does not depend on any one person's account remaining active. Personal access tokens also work, with the access of the user who issued them.

Because the agent acts as its service account, that account needs permission to use the credentials in the workspace.

## Create an agent

1. In your workspace, select **AI** > **Agents**.
1. Select **Add agent**.
1. Choose a starting point:
    - **Fix failed runs**, **Summarize successful runs**, or **Summarize failed runs** — a template that prefills the name, description, and instructions.
    - **Blank** — write your own instructions.
1. Complete the details:
    - **Name** (required). Letters, numbers, dashes, and underscores only.
    - **Description** (optional).
    - **Agent instructions** (required). What the agent should do when it runs.
1. Under **Agent permissions**, select the **Service account** the agent runs as. Only accounts assigned to this workspace are listed. See [Agent identity and permissions](#agent-identity-and-permissions).
1. Save the agent.

Templates prefill text only. They do not set a trigger, a schedule, or anything about where the agent runs — review and edit the instructions before saving.

## Manage agents

The **Agents** page lists every agent in the workspace that you can read, with its status. From there you can:

- **Search** for an agent by name.
- **Edit** an agent's name, description, instructions, and service account. The template picker is not shown when editing.
- **Disable** an agent to keep its definition but stop it being selectable, and **enable** it again later.
- **Remove** an agent. You are asked to confirm.

Disabled and removed agents do not appear when selecting an agent to run. Removing an agent does not delete the sessions it already produced.

## Run an agent

You start an agent from a run, so it works with that run's context:

1. Open the run.
1. Select **Trigger agent**.
1. Choose an agent from the list. Search by name if the workspace has many.

The agent's conversation opens in the Co-Scientist panel, where you can follow what it does and continue in chat.

Only enabled agents appear in the list. If the workspace has none, the list offers **Add agent** to users with `Agent_Write`.

## What an agent does not define

An agent holds a name, a description, its instructions, and the service account it acts as. It does not carry a trigger, a schedule, a compute environment, or a sandbox configuration. Those are properties of how the agent is run, not of the agent itself — an agent that runs on an event is an agent selected as the target of an action, not a different kind of agent.

## Learn more

- [Co-Scientist](./index.md): The Co-Scientist assistant
- [Coding agents](./coding-agents.md): Connect Claude Code, Codex, and other agents to Seqera
- [Git integration](../git/overview.md): Connect Seqera to public and private Git repositories
- [Credits](./credits.md): Co-Scientist credits and how to request more

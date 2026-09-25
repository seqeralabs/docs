---
title: "Agents"
description: "Create reusable background agents in a workspace and run them against pipeline runs"
date created: "2026-08-28"
tags: [co-scientist, platform, agent, ai]
---

An agent is a named, reusable set of instructions that Co-Scientist runs on your behalf in a Seqera Platform workspace. A Co-Scientist conversation is interactive and starts empty each time. An agent captures a task you repeat, such as investigating failed runs or summarizing results, and anyone in the workspace can run it without rewriting the prompt.

Agents are workspace-scoped. Every agent in a workspace is visible to everyone with permission to read agents, not only the person who created it. An agent acts as the [service account](#agent-identity-and-permissions) bound to it rather than as the person who starts it, and reaches private repositories through a [GitHub App credential](#access-to-private-git-repositories) in its workspace.

:::info
Seqera is rolling out agents to Seqera Platform Cloud organizations. If you do not see **Agents** under **AI** in the workspace navigation, contact Seqera to enable it for your organization.
:::

## Agents, chat, and coding agents

Seqera uses the word "agent" for three different things:

- **Agents** (this page): Reusable instruction sets you create in a workspace and run against pipeline runs.
- **[Co-Scientist chat](./platform.md)**: The interactive assistant panel in Seqera Platform.
- **[Coding agents](./coding-agents.md)**: Third-party tools such as Claude Code or Codex that you connect to Seqera through a skill.

Agents are also unrelated to Tower Agent, the component that connects Seqera Platform to a high-performance computing (HPC) cluster.

### Agents compared with Co-Scientist chat

Agents and Co-Scientist chat are the same assistant reached two ways. Both work inside a Seqera Platform workspace and can read your runs and act on them. They differ in who they act as, who sees them, and what starts them.

| | Agent | Co-Scientist chat |
|---|---|---|
| Where it runs | In the background, once started | In the Co-Scientist panel in Seqera Platform, while you watch |
| Instructions | Written once and saved, reused on every run | Written fresh in each conversation |
| Acts as | The service account bound to the agent | You, with your own permissions |
| Who sees it | Everyone in the workspace who can read agents | Only you, in your own session |
| What starts it | You, from a run, or an event where automated actions are enabled | You, by typing in the panel |

## Permissions

Workspace grants decide who can see and manage agents. The service account bound to an agent decides what the agent can do when it runs.

### Workspace grants

Four workspace grants control access to agents:

| Grant | Allows |
|---|---|
| `Agent_Read` | View and search the workspace's agents |
| `Agent_Write` | Create and edit agents, and enable or disable them |
| `Agent_Execute` | Run an agent |
| `Agent_Delete` | Remove an agent |

**Agents** appears in the navigation only for users with `Agent_Read`.

### Agent identity and permissions

An agent acts as a service account, not as the person who starts it. You must bind one. Select it under **Agent permissions** when you create or edit the agent. Every run of that agent uses that account's roles. Whoever starts the run, the agent reaches only what the service account can reach.

- Only service accounts assigned to the agent's workspace can be bound. An account with no role in the workspace cannot act there.
- You cannot bind a service account that holds permissions you do not hold in the workspace yourself.
- Service accounts belong to the organization. If none is assigned to your workspace, ask an organization owner to create one and assign it before you create the agent.
- If the bound service account is later disabled or removed, the agent's runs fail rather than fall back to the permissions of whoever started them.

:::caution
Scope the service account to what the agent's instructions need. Every run of the agent carries those permissions, whoever in the workspace starts it.
:::

If the agent form has no **Agent permissions** section, service accounts are not enabled for your organization. The agent's runs then act as the user who starts them.

## Access to private Git repositories

An agent reaches a private repository only through a [GitHub App credential](../git/overview.md#github). No other Git credential type works for an agent. A personal access token works elsewhere in Seqera Platform but not here.

Bind the credential to the agent under **Agent permissions**, alongside the service account. The credential is optional. An agent without one still runs but cannot clone, commit, or push. An agent with one can do all three, as that credential.

Before you can bind a credential:

- A GitHub organization admin must install the GitHub App in the GitHub organization and grant it access to the repositories the agent needs.
- The credential must exist in the workspace the agent runs in. Because credentials are workspace-scoped, an agent cannot use one from another workspace or from a user's personal credentials.

If a bound credential is later removed from the workspace or marked invalid, the agent form warns you and blocks saving until you select a different credential or clear it with **None**.

## Create an agent

To create an agent, you need `Agent_Write`.

1. In your workspace, select **AI** > **Agents**.
1. Select **Add agent**.
1. Choose a starting point:
    - **Fix failed runs**, **Summarize successful runs**, or **Summarize failed runs**: A template that prefills the name, description, and instructions.
    - **New agent**: Write your own instructions.
1. Complete the details:
    - **Name** (required): Letters, numbers, dashes, and underscores only.
    - **Description** (optional).
    - **Agent instructions** (required): What the agent does when it runs.
1. Under **Agent permissions**:
    - **Service account** (required): The identity the agent runs as. Only accounts assigned to this workspace are listed. See [Agent identity and permissions](#agent-identity-and-permissions).
    - **GitHub App credential** (optional): Needed only if the agent works with private Git repositories. See [Access to private Git repositories](#access-to-private-git-repositories).
1. Save the agent.

Templates prefill text only. They do not set a trigger, a schedule, or where the agent runs. Review and edit the instructions before saving.

## Manage agents

The **Agents** page lists every agent in the workspace that you can read, with its status. From there you can:

- **Search** for an agent by name.
- **Edit** an agent's name, description, instructions, service account, and GitHub App credential. The template picker does not appear when you edit.
- **Disable** an agent to keep its definition but remove it from the list of agents to run, and **enable** it again later.
- **Remove** an agent. Seqera Platform asks you to confirm.

Disabled and removed agents do not appear when you select an agent to run. Removing an agent does not delete the sessions it already produced.

## Run an agent

Start an agent from a run. The agent works with that run's context. To run an agent, you need `Agent_Read` and `Agent_Execute`:

1. Open the run, or find it in a project's **Runs** tab.
1. Select **Trigger agent**.
1. Choose an agent from the list. Search by name if the workspace has many.

The agent's conversation opens in the Co-Scientist panel, where you can follow what it does and continue in chat.

Only enabled agents appear in the list. If the workspace has none, the list offers **Add agent** to users with `Agent_Write`.

## Agent definition

An agent holds a name, a description, its instructions, the service account it acts as, and an optional GitHub App credential. It does not carry a trigger, a schedule, a compute environment, or a sandbox configuration. Those are properties of how the agent is run, not of the agent itself. An agent that runs on an event is an agent selected as the target of an action, not a different kind of agent.

## Learn more

- [Co-Scientist in Seqera Platform](./platform.md): The Co-Scientist panel in Seqera Platform
- [Coding agents](./coding-agents.md): Connect Claude Code, Codex, and other agents to Seqera
- [Git integration](../git/overview.md): Connect Seqera to public and private Git repositories
- [Credits](./credits.md): Co-Scientist credits and how to request more

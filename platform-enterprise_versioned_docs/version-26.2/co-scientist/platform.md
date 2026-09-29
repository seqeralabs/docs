---
title: "Co-Scientist in Seqera Platform"
description: "Use the Co-Scientist panel in Seqera Platform Enterprise to ask about the run, pipeline, or dataset you are viewing"
date created: "2026-09-22"
tags: [co-scientist, platform, ai, enterprise]
---

The Co-Scientist panel is an assistant docked inside Seqera Platform. It opens beside the page you are working on and reads that page as context. Ask about a run, pipeline, dataset, or data-link without describing it first.

:::info[**Prerequisites**]{#prerequisites}
You will need the following to get started:

- Co-Scientist deployed for your Seqera Platform Enterprise installation. See [Install Co-Scientist](../enterprise/install-seqera-coscientist.mdx).
- An organization workspace. The panel is not available in personal workspaces.
- A workspace role that includes the `chat:execute` permission. The predefined Owner, Admin, Maintain, Launch, Connect, and Project roles include it; the View role does not. Custom roles must be granted it explicitly. See [Custom roles](../orgs-and-teams/custom-roles.md#ai).

:::

Once Co-Scientist is deployed, the panel is enabled for every organization in the installation unless your administrator restricts it with `TOWER_AI_CHAT_ALLOWED_ORGANIZATIONS`. If you do not see **Co-Scientist** in the navigation bar, contact your Seqera Platform administrator.

## Open the panel

1.  Sign in to Seqera Platform and open an organization workspace.
1.  Select **Co-Scientist** in the top navigation bar.

Your work stays on screen beside the panel. Close the panel to return to where you were, or keep navigating Seqera Platform while the conversation stays open.

## Page context

Co-Scientist reads the page you are viewing and sends that context with each message. The panel shows the current page in a **Viewing:** line above the message box. The context includes:

- The organization and workspace you are working in.
- The primary resource in view, such as a run, pipeline, dataset, data-link, compute environment, or Studio.
- A screenshot of the page content area.

Co-Scientist scopes its Platform requests to the current organization and workspace, and acts within that workspace unless you ask it to look elsewhere.

Because the panel already has this context, you can ask questions that refer to the page directly:

- "Why did this run fail?"
- "What does this pipeline do?"
- "Summarize the results in this dataset."

### Screenshots

The screenshot captures the main content area of the page. It excludes the navigation, the side menu, and the Co-Scientist panel itself. It includes everything else on the page, such as run logs, parameter values, and resource names.

The current page's screenshot appears as a chip above the message box. Select the chip to preview it. Remove the chip before sending if you do not want the screenshot attached to that message.

:::note
Page context and screenshots are sent to the agent backend and to the inference provider your administrator configured for Co-Scientist.
:::

## Reference resources with `@`

Type `@` in the message box to reference a Platform resource by name and attach it to your message. You can reference pipelines, runs, data-links, datasets, compute environments, and Studios. Recently used resources appear first. Use this to bring in a resource other than the one on screen.

## Conversations and history

Each conversation is a separate thread. Open the conversation history to search past conversations by title and return to earlier work. The history separates your own chats from agent sessions.

When you delete a conversation from the history, it is removed from your account.

Seqera Platform keeps Co-Scientist conversations for 180 days by default. See [Sessions](./sessions.md#session-retention-and-limits).

## Background work

A request keeps running after you close the panel, navigate away, or switch workspaces. Reopen the conversation to see the result. A response still in progress resumes streaming when you reopen it.

Conversations started by background agents are owned by the workspace and are read-only in the panel. To continue one, fork it into your own conversation.

## Work with GitHub repositories

Co-Scientist can clone GitHub repositories, create branches, push commits, and open pull requests. It reaches private repositories through a GitHub App that your administrator configures for your installation. You connect your own GitHub account to the app the first time Co-Scientist needs access to a private repository.

GitHub access is available only when your administrator configures it, together with a sandbox provider. See [GitHub access](../enterprise/install-seqera-coscientist.mdx#github-access). This connection is separate from the [GitHub App credentials](../git/overview.md#github-app) that Seqera Platform uses to launch pipelines.

To connect GitHub:

1.  Ask Co-Scientist to work with a private repository. If you have not connected GitHub, Co-Scientist replies with a link to authorize the GitHub App.
1.  Open the link and approve the authorization on GitHub. The page that opens shows a connection ID.
1.  Copy the connection ID and paste it into the conversation to finish connecting.
1.  If the repository belongs to a GitHub organization where the app is not installed, Co-Scientist returns an install link for the app. Ask an organization admin to install the app and grant it access to the repository, then ask Co-Scientist to retry.

The authorization link and the connection ID expire after a short time. If either expires, ask Co-Scientist to start again.

:::note
If your GitHub organization enforces SAML single sign-on (SSO), GitHub rejects access until you authorize the connection for that organization. Co-Scientist tells you when this happens. Open the authorization link from GitHub, approve access for the organization, and retry.
:::

## Download session files

Some requests produce files in the Co-Scientist sandbox, such as a generated configuration or a converted pipeline. When a session has produced files, select **Download sandbox contents** above the message box to download them as a compressed archive.

The sandbox is available only when your administrator configures a sandbox provider for Co-Scientist.

## Learn more

- [Co-Scientist](./index.md): Overview and where Co-Scientist is available
- [Projects](./projects.md): Group workspace resources with Platform labels
- [Usage and cost](./usage-and-cost.md): Co-Scientist usage in Enterprise deployments
- [Install Co-Scientist](../enterprise/install-seqera-coscientist.mdx): Deploy the agent backend and MCP server
- [Troubleshooting](../troubleshooting_and_faqs/coscientist_troubleshooting.md): Troubleshoot common errors

---
title: "Co-Scientist in Seqera Platform"
description: "Use the Co-Scientist panel in Seqera Platform to ask about the run, pipeline, or dataset you are viewing"
date created: "2026-08-25"
tags: [co-scientist, platform, ai]
---

The Co-Scientist panel is an assistant docked inside Seqera Platform. It opens over the page you are working on and reads that page as context. Ask about a run, pipeline, dataset, or data-link without describing it first.

:::info
Seqera is rolling out the Co-Scientist panel to Seqera Platform Cloud organizations. If you do not see **Co-Scientist** in the navigation, contact Seqera to enable it for your organization.
:::

## Open the panel

1. Sign in to [Seqera Platform](https://cloud.seqera.io) and open a workspace.
1. Select **Co-Scientist** in the navigation.

Your work stays on screen behind the panel. Close the panel to return to where you were, or keep navigating Seqera Platform while the conversation stays open.

## Page context

Co-Scientist reads the page you are viewing and sends that context with each message. The context includes:

- The organization and workspace you are working in.
- The primary resource in view, such as a run, pipeline, dataset, or data-link.
- A screenshot of the page content area.

Co-Scientist scopes its Platform requests to the current organization and workspace, and acts within that workspace unless you ask it to look elsewhere.

Because the panel already has this context, you can ask questions that refer to the page directly:

- "Why did this run fail?"
- "What does this pipeline do?"
- "Summarize the results in this dataset."

### Screenshots

The screenshot captures the main content area of the page. It excludes the navigation, the side menu, and the Co-Scientist panel itself. It includes everything else on the page, such as run logs, parameter values, and resource names.

The current page's screenshot appears as a chip above the message box. Remove the chip before sending if you do not want the screenshot attached to that message.

## Conversations and history

Each conversation is a separate thread. Past conversations are grouped by recency, and you can search them by title to return to earlier work.

When you delete a conversation from the conversation list, it is removed from your account.

## Reference resources with `@`

Type `@` in the message box to reference a Platform resource by name (a pipeline, run, or dataset) and attach it to your message. Use this to bring in a resource other than the one on screen.

## Background work

A request keeps running after you navigate away or switch workspaces. Reopen the panel to see the result. Long-running work draws on the same credits as any other Co-Scientist usage. Check your active conversations before you leave requests running.

## Download session files

Some requests produce files, such as a generated configuration or a converted pipeline. When a session has produced files, use the sandbox chip above the message box to download the session contents as a `.tar.gz` archive.

## Learn more

- [Co-Scientist](./index.md): Overview and where Co-Scientist is available
- [Credits](./credits.md): Co-Scientist credits and how to request more
- [Projects](./projects.md): Group workspace resources with Platform labels
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

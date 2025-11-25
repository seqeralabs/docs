---
title: "Seqera AI"
description: "Use Seqera AI to troubleshoot pipelines"
date created: "2025-11-11"
last updated: "2025-11-11"
tags: [seqera-ai, ai, pipelines]
---

Seqera AI is an AI-powered assistant for pipeline development, debugging, and optimization, which has read and write access to Seqera Platform. This enables Seqera AI to directly interact with Seqera Platform primitives to debug pipelines, modify parameters, and launch runs, all without switching context between different tools and interfaces.

## Seqera AI

[Seqera AI](https://seqera.io/ask-ai/chat-v2) integrates with your pipeline GitHub repositories to provide intelligent assistance with pipeline development and modification. To fully utilize the power of Seqera AI, it needs access to your pipeline codebase to analyze, suggest changes, and even create pull requests on your behalf.

### Set up GitHub access

To enable Seqera AI to interact with your pipeline GitHub repositories:

1. **Generate a personal access token**
   - Navigate to [GitHub Personal Access Tokens](https://github.com/settings/personal-access-tokens)
   - Create a new token with the following permissions:
     - **Pull Requests**: Read & Write
     - **Contents**: Read & Write
   - Your token value will be displayed only once. Copy it before navigating away from the tokens page.

2. **Add the token to Seqera AI**
   - Open [Seqera AI](https://seqera.io/ask-ai/chat-v2).
   - In the bottom-left user menu, select **Add token**.
   - Enter your personal access token in the field provided, then select **Set token**.

### Capabilities

With proper GitHub access configured, Seqera AI can:
- Access and analyze your pipeline codebase
- Create feature branches for proposed changes
- Generate pull requests for your review
- Suggest improvements based on your existing code patterns

:::tip
Seqera AI respects your repository's branch protection rules and will create pull requests for review rather than directly modifying protected branches.
:::

## Use Seqera AI with Platform

From the Seqera AI interface, select **Ask Seqera AI**, then log into Seqera Platform.

- Debug failed runs
- Modify pipeline parameters and relaunch
- Launch pipelines from the Launchpad
- Browse S3 bucket structures

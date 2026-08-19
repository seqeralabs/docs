---
title: "Seqera AI Git access"
description: "Configure GitHub access for Seqera AI."
tags: [git, github, seqera-ai, integration]
---

[Seqera AI](https://seqera.io/ask-ai/chat-v2) integrates with your pipeline GitHub repositories to provide intelligent assistance with pipeline development and modification. To fully utilize Seqera AI, it needs access to your pipeline codebase to analyze, suggest changes, and create pull requests on your behalf.

This integration is **separate** from Seqera Platform Git credentials — they are configured independently in different products.

## Set up GitHub access

To enable Seqera AI to interact with your pipeline GitHub repositories:

1. **Generate a personal access token**
   - Navigate to [GitHub Personal Access Tokens](https://github.com/settings/personal-access-tokens).
   - Create a new token with the following permissions:
     - **Pull Requests**: Read & Write
     - **Contents**: Read & Write
   - Your token value is displayed only once. Copy it before navigating away from the tokens page.

1. **Add the token to Seqera AI**
   - Open [Seqera AI](https://seqera.io/ask-ai/chat-v2).
   - In the bottom-left user menu, select **Add token**.
   - Enter your personal access token, then select **Set token**.

## Capabilities

With proper GitHub access configured, Seqera AI can:

- Access and analyze your pipeline codebase
- Create feature branches for proposed changes
- Generate pull requests for your review
- Suggest improvements based on your existing code patterns

:::tip
Seqera AI respects your repository's branch protection rules and creates pull requests for review rather than directly modifying protected branches.
:::

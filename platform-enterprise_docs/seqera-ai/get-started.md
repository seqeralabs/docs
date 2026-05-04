---
title: "Get started"
description: "AI-powered assistant for bioinformatics workflows and Seqera Platform"
date created: "2026-03-11"
tags: [seqera-ai, co-scientist, cli, ai]
---

## Get started

To get started with Co-Scientist:

1. Install the Seqera CLI:

    ```bash
    npm install -g seqera
    ```

    See [Installation](./installation.mdx) for a comprehensive installation guide.

1. Log in to your Seqera account:

    ```bash
    seqera login
    ```

    See [Authentication](./authentication.md) for a comprehensive authentication guide.

    For Enterprise deployments, set `SEQERA_AI_BACKEND_URL` to your organization's agent backend before you start Co-Scientist. Your administrator should provide this URL; it maps to `global.agentBackendDomain` in the [Co-Scientist install guide](../enterprise/install-seqera-ai.md). See [Authentication](./authentication.md#connect-to-an-enterprise-backend) for the full environment variable reference.

1. Start Co-Scientist:

    ```bash
    seqera ai
    ```

1. Open the command palette and review the available built-in commands and skills:

    ```
    /help
    ```

    You can also type `/` to open command autocomplete.

1. Try build mode and plan mode:

    - Press `Shift+Tab` to switch between **build** and **plan**
    - Check the current mode in the composer footer
    - Run `/status` if you want a full status readout

    Example plan-mode prompt:

    ```
    Compare whether I should add FastQC or fastp as the first QC step in this RNA-seq pipeline, including the workflow changes each option would require
    ```

1. Run your first workflow-focused prompt:

    ```
    /debug-last-run-on-seqera
    ```

1. Try goal mode for a longer task:

    ```
    /goal update this pipeline for AWS Batch and add nf-tests
    ```

    See [Use cases](./use-cases.md) for more examples.

## Learn more

- [Installation](./installation.mdx): Detailed installation instructions
- [Authentication](./authentication.md): Log in, log out, and session management
- [Skills](./skills.md): Discover, create, and install skills
- [Modes](./modes.md): Work in build mode, plan mode, and goal mode
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Usage and cost](./usage-and-cost.md): Co-Scientist usage in Enterprise deployments
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

---
title: "Get started"
description: "AI-powered assistant for bioinformatics workflows and Seqera Platform"
date created: "2026-03-11"
tags: [seqera-ai, cli, ai]
---

:::note
Seqera Cloud users receive $20 in free credits to get started with Co-Scientist. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

## Get started

To get started with Co-Scientist:

1. Install the Co-Scientist CLI:

    ```bash
    npm install -g seqera
    ```

    See [Installation](./installation.md) for a comprehensive installation guide.

1. Log in to your Seqera account:

    ```bash
    seqera login
    ```

    See [Authentication](./authentication.md) for a comprehensive authentication guide.

    If you are testing a development build of the CLI against the hosted production Co-Scientist service, set `SEQERA_AI_BACKEND_URL=https://ai-api.seqera.io` first. See [Authentication](./authentication.md#point-a-development-build-at-the-hosted-co-scientist-backend) for the full environment variable reference.


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

- [Installation](./installation.md): Detailed installation instructions
- [Authentication](./authentication.md): Log in, log out, and session management
- [Skills](./skills.md): Discover, create, and install skills
- [Modes](./modes.md): Work in build mode, plan mode, and goal mode
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Co-Scientist CLI use cases
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors

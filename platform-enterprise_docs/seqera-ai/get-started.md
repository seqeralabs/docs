---
title: "Get started"
description: "AI-powered assistant for bioinformatics workflows and Seqera Platform"
date created: "2026-03-11"
tags: [seqera-ai, co-scientist, cli, ai]
---

Co-Scientist is an interactive CLI for building, running, and debugging Nextflow pipelines on Seqera Platform.

This page covers how to log in, start a session, switch between build mode and plan mode, debug a Platform run with a built-in skill, and set a long-running goal.

:::info[**Prerequisites**]{#prerequisites}
You will need the following to get started:

- [Co-Scientist CLI](./installation.mdx)
- A user account on your Seqera Platform Enterprise deployment
- `SEQERA_AI_BACKEND_URL` set to your organization's agent backend (see [Installation](./installation.mdx#configure-the-enterprise-backend))
:::

## Quickstart

1. Log in to Seqera Platform:

    ```bash
    seqera login
    ```

    The CLI opens a browser window. After you authorize, the terminal confirms the login and stores a session token locally. For headless environments, token-based login, or session management, see [Authentication](./authentication.md).

1. Start an interactive session:

    ```bash
    seqera ai
    ```

    The Co-Scientist prompt appears, with a footer showing the active mode (**build** by default).

1. List the available commands and skills:

    ```
    /help
    ```

    Type `/` to open command autocomplete.

1. Switch between build and plan modes:

    - **Build mode** (default): Executes commands, edits files, and launches workflows
    - **Plan mode**: Read-only analysis and planning, for exploring options before making changes

    Press `Shift+Tab` to switch between modes. The active mode appears in the composer footer, and `/status` prints a full readout.

    Try plan mode with a comparison prompt:

    ```
    Compare whether I should add FastQC or fastp as the first QC step in this RNA-seq pipeline, including the workflow changes each option would require
    ```

1. Debug a Seqera Platform run with a built-in skill:

    ```
    /debug-last-run-on-seqera
    ```

    Co-Scientist fetches your most recent workspace run, inspects logs and exit codes, and walks through likely causes and fixes. You need at least one workflow run in the workspace for this skill to find something to debug.

1. Set a long-running goal:

    ```
    /goal update this pipeline for AWS Batch and add nf-tests
    ```

    Co-Scientist works across model turns until the goal completes or the attempt limit is reached. See [Use cases](./use-cases.md) for more example prompts.

## Next steps

- [Skills](./skills.md): Discover, create, and install skills
- [Modes](./modes.md): Build, plan, and goal modes in depth
- [Use cases](./use-cases.md): Co-Scientist CLI use cases
- [Usage and cost](./usage-and-cost.md): Co-Scientist usage in Enterprise deployments

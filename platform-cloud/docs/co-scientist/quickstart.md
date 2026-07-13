---
title: "Quickstart"
description: "Run your first Co-Scientist session in the Seqera CLI"
date created: "2026-03-11"
last updated: "2026-07-06"
tags: [co-scientist, cli, ai]
---

This page walks you through your first Co-Scientist session: log in, start a session, switch between build mode and plan mode, debug a Platform run with a built-in skill, and set a long-running goal.

:::info[**Prerequisites**]{#prerequisites}
You will need the following to get started:

- [Seqera CLI](./installation.mdx)
- A Seqera Platform account ([sign up for free](https://cloud.seqera.io))
:::

## Step 1: Log in to Seqera Platform

Authenticate the CLI against your Seqera Platform account:

```bash
seqera login
```

This will:

1. Open your default browser to the Seqera login page.
1. Prompt you to sign in with your Seqera Platform credentials.
1. Automatically capture the authentication token.
1. Display a success message in your terminal:

   ```console
   [Login] Starting Seqera CLI authentication...
   [Login] ✓ Authentication successful!
   [Login] ✓ Organization set: <org_name>
   ```

:::tip
See [Authentication](./authentication.md) for more information about how to log in and out, authenticate in automated environments, and manage your organization.
:::

## Step 2: Start an interactive session

Launch an interactive Co-Scientist session:

```bash
seqera ai
```

The Co-Scientist prompt appears, with a footer showing the active mode (**build** by default). See [Modes](./modes.md) for more information.

## Step 3: List commands and skills

Show the built-in commands and available skills:

```
/help
```

:::tip
Type `/` to open command autocomplete.
:::

## Step 4: Switch between build and plan modes

Co-Scientist runs in two modes that control what it can do:

- **Build mode** (default): Executes commands, edits files, and launches workflows
- **Plan mode**: Read-only analysis and planning, for exploring options before making changes

Press `Shift+Tab` to switch between modes. The active mode appears in the composer footer, and `/status` prints a full readout.

Try plan mode with a comparison prompt:

```
Compare whether I should add FastQC or fastp as the first QC step in this RNA-seq pipeline, including the workflow changes each option would require
```

## Step 5: Debug a Seqera Platform run

Run the built-in debugging skill against your most recent workspace run:

```
/debug-last-run-on-seqera
```

Co-Scientist fetches your most recent workspace run, inspects logs and exit codes, and walks through likely causes and fixes. You need at least one workflow run in the workspace for this skill to find something to debug.

## Step 6: Set a long-running goal

Give Co-Scientist a goal to work toward across multiple turns:

```
/goal update this pipeline for AWS Batch and add nf-tests
```

Co-Scientist works across model turns until the goal completes or the attempt limit is reached. See [Use cases](./use-cases.md) for more example prompts.

## Learn more

- [Skills configuration](./skills.md): Discover, create, and install skills
- [Modes](./modes.md): Build, plan, and goal modes in depth
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Skills](./reference/skills-reference.md): Built-in skills, slash commands, and session limits

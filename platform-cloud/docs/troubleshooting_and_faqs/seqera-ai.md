---
title: "Co-Scientist"
description: "Co-Scientist troubleshooting."
date created: "2024-12-15"
last updated: "2026-08-26"
tags: [faq, help, seqera ai, troubleshooting]
---

When installing or authenticating the Seqera CLI, or working with projects, you might encounter the following issues.

## Installation

#### `seqera: command not found`

If you see `seqera: command not found` after installation:

1. Verify the Seqera CLI installation location:

   ```bash
   which seqera
   ```

1. Ensure the npm global `bin` directory is on your PATH. Find it with `npm config get prefix` or `npm bin -g`:

   ```bash
   # Check the npm global bin directory
   npm bin -g

   # Restart your terminal or run
   source ~/.bashrc  # or ~/.zshrc
   ```

1. If you installed the standalone binary, verify it is in a directory on your PATH:

   ```bash
   echo $PATH
   ```

#### npm permission errors

If you encounter permission errors during installation:

1. Use the npm prefix option to install to a user-writable directory:

   ```bash
   npm install -g seqera --prefix ~/.npm-global
   ```

1. Add the directory to your PATH:

   ```bash
   export PATH="$HOME/.npm-global/bin:$PATH"
   ```

#### `EACCES` permission errors on global install

Avoid running `sudo npm install`. Either [fix npm permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) or install Node through a version manager such as [nvm](https://github.com/nvm-sh/nvm).

## Authentication

#### Browser doesn't open

If the browser doesn't open automatically:

1. Check the terminal output for a URL.
1. Copy and paste the URL into your browser.
1. Complete authentication in the browser.

#### Login timeout

If authentication times out:

1. Ensure you have internet connectivity.
1. Check that `https://seqera.io` is accessible.
1. Log out and log in again.

#### Token storage errors

If you see errors related to credential storage:

1. Check that you have write permissions to `~/.config/seqera-ai/`:

   ```bash
   ls -la ~/.config/seqera-ai/
   ```

1. If the directory doesn't exist, create it:

   ```bash
   mkdir -p ~/.config/seqera-ai
   ```

#### Session expired

If your session has expired, log out and log in again:

```bash
seqera logout
seqera login
```

## Projects

#### Dataset uploads do not auto-attach the project label

When you upload a dataset into a project, the project's `project_*` label is not attached automatically.

This issue occurs when a pipeline carries a `project_*` label that was not created in workspace settings. Co-Scientist still surfaces the project, inferred from the pipeline, but the project has no Platform-assigned label ID. Auto-attach requires that ID.

To avoid this issue, create `project_*` labels in workspace settings before applying them to resources. See [Projects](../co-scientist/projects.md).

#### The Projects page shows **No projects configured yet**

The **Projects** page shows a **No projects configured yet** empty state, the project selector is hidden, and the workspace view shows a header-only empty state.

This occurs when the workspace has no `project_*` labels.

To resolve, ask a workspace admin to create the first `project_*` label for the workspace. See [Create a project](../co-scientist/projects.md#create-a-project).

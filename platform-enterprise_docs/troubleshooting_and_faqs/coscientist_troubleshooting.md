---
title: "Co-Scientist"
description: "Co-Scientist troubleshooting."
date created: "2026-08-26"
last updated: "2026-09-22"
tags: [faq, help, co-scientist, troubleshooting]
---

When deploying Co-Scientist, installing or authenticating the Seqera CLI, using the Co-Scientist panel, or working with projects, you might encounter the following issues.

## Deployment

### Check deployment health

Run the `/doctor` skill from the Co-Scientist panel or a CLI session. It tests the agent's tools, MCP and Platform connectivity, and code execution, and reports PASS, FAIL, or SKIP per subsystem with remediation steps.

For a non-interactive check, enable `SERVICE_INFO_ENABLED` on the agent backend and query `https://<agent-backend-domain>/v1/service-info`. Add `?deep=1` with a Platform access token as a bearer token to run live inference and sandbox checks. See [Run deployment diagnostics](../enterprise/install-seqera-coscientist.mdx#run-deployment-diagnostics).

### Co-Scientist does not appear in the navigation bar

The Co-Scientist panel appears only when all of the following are true:

1.  `TOWER_AGENT_BACKEND_URL` is set on the Platform backend. The Platform Helm chart sets it when the `agent-backend` subchart is enabled.
1.  You are in an organization workspace. The panel is not available in personal workspaces.
1.  Your organization is included in `TOWER_AI_CHAT_ALLOWED_ORGANIZATIONS`, or the variable is unset.
1.  Your workspace role includes the `chat:execute` permission. The View role and custom roles do not include it unless an administrator adds it. See [Custom roles](../orgs-and-teams/custom-roles.md#ai).

### The Co-Scientist panel opens but requests fail to authenticate

The panel authenticates to the agent backend with the Platform session cookie. Check that the agent backend domain is a subdomain of a domain shared with Platform, and that `TOWER_AUTH_COOKIE_DOMAIN` is set to that parent domain with a leading dot, for example `.platform.example.com`. The Platform Helm chart sets it when the `agent-backend` subchart is enabled.

### Approval prompts time out

The agent backend waits 15 minutes for a local command result. If you leave an approval prompt open longer than that, the request times out. Send your request again and respond to the prompt within 15 minutes.

### A session can no longer be resumed

The agent backend deletes CLI sessions after 14 days and Co-Scientist panel conversations after 180 days. Start a new session. Administrators can change the retention periods. See [Sessions](../co-scientist/sessions.md#session-retention-and-limits).

## Installation

### `seqera: command not found`

If you see `seqera: command not found` after installation:

1.  Verify the Seqera CLI installation location:

    ```bash
    which seqera
    ```

1.  Ensure the npm global `bin` directory is on your PATH. Find it with `npm config get prefix` or `npm bin -g`:

    ```bash
    # Check the npm global bin directory
    npm bin -g

    # Restart your terminal or run
    source ~/.bashrc  # or ~/.zshrc
    ```

### npm permission errors

If you encounter permission errors during installation:

1.  Use the npm prefix option to install to a user-writable directory:

    ```bash
    npm install -g seqera --prefix ~/.npm-global
    ```

1.  Add the directory to your PATH:

    ```bash
    export PATH="$HOME/.npm-global/bin:$PATH"
    ```

### `EACCES` permission errors on global install

Avoid running `sudo npm install`. Either [fix npm permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) or install Node through a version manager such as [nvm](https://github.com/nvm-sh/nvm).

## Authentication

### Browser doesn't open

If the browser doesn't open automatically:

1.  Check the terminal output for a URL.
1.  Copy and paste the URL into your browser.
1.  Complete authentication in the browser.

### Login timeout

If authentication times out:

1.  Check that your Seqera Platform URL is reachable from your machine.
1.  Confirm that `SEQERA_AUTH_DOMAIN`, or `authDomain` in `~/.config/seqera-ai/config.json`, points at your Enterprise deployment, for example `https://platform.example.com/api`. Run `seqera info` to see the values the CLI resolved.
1.  If you are on a remote host, set `SEQERA_BROWSER_AUTO_OPEN=false` and open the printed URL in a browser on a machine that can reach the callback port (`53682` by default, set with `SEQERA_AUTH_REDIRECT_PORT`).
1.  Log out and log in again.

### Token storage errors

If you see errors related to credential storage:

1.  Check that you have write permissions to `~/.config/seqera-ai/`:

    ```bash
    ls -la ~/.config/seqera-ai/
    ```

1.  If the directory doesn't exist, create it:

    ```bash
    mkdir -p ~/.config/seqera-ai
    ```

### Session expired

If your session has expired, log out and log in again:

```bash
seqera logout
seqera login
```

## Projects

### The Projects view does not appear

The Projects view appears only when all of the following are true:

1.  You are in an organization workspace. Projects are not available in personal workspaces.
1.  `TOWER_SCIENTIST_VIEW_ALLOWED_WORKSPACES` is unset or empty, or lists the workspace ID. Projects are enabled in every organization workspace by default. See [Enable projects](../co-scientist/projects.md#enable-projects).
1.  Your workspace role includes the `project_view:read` permission. Every predefined role includes it. Custom roles do not unless an organization owner adds it from the **Projects** permission category, and existing custom roles do not gain it on upgrade. See [Permissions](../co-scientist/projects.md#permissions).

### Existing `project_*` labels do not appear as projects

Seqera Platform recognizes only labels with the `proj_` prefix. Rename `project_*` labels to `proj_*` in workspace settings.

### Dataset uploads do not auto-attach the project label

When you upload a dataset into a project, the project's `proj_*` label is not attached automatically.

This issue occurs when a resource carries a `proj_*` label that was not created in workspace settings, so the label has no Platform-assigned ID. Auto-attach requires that ID.

To avoid this issue, create `proj_*` labels in workspace settings, or with **Add project**, before applying them to resources. See [Projects](../co-scientist/projects.md).

### The Projects page shows **Get started with projects**

This occurs when the workspace has no `proj_*` labels.

To resolve, select **Add project**, or ask a workspace admin to create the first `proj_*` label for the workspace. Creating a project requires permission to create labels. See [Create a project](../co-scientist/projects.md#create-a-project).

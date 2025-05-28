---
title: "Workspaces"
description: "Workspaces troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, workspaces help, workspaces troubleshooting]
---

**Seqera-invoked pipeline contacting a workspace other than the launch workspace**

You may encounter this entry in your Nextflow log:

_Unexpected response for request `http://TOWER_SERVER_URL/api/trace/TRACE_ID/begin?workspaceId=WORKSPACE_ID`_

If the workspace ID in this message differs from your launch workspace, Seqera retrieved an incorrect Seqera access token from a Nextflow configuration file:

- A Seqera access token may be hardcoded in the `tower.accessToken` block of your `nextflow.config` (either from the Git repository or an override value in the Seqera launch form).
- In an HPC cluster compute environment, the credential user's home directory may contain a stateful `nextflow.config` with a hardcoded access token (e.g., `~/.nextflow/config`).

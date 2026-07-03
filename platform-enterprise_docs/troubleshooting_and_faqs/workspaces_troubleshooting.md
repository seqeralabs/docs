---
title: "Workspaces"
description: "Workspaces troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, workspaces, troubleshooting]
---

When working with workspaces, you might encounter the following issues.

## Common issues

#### Seqera-invoked pipeline contacts a workspace other than the launch workspace

You might see this entry in your Nextflow log:

```
Unexpected response for request http://TOWER_SERVER_URL/api/trace/TRACE_ID/begin?workspaceId=WORKSPACE_ID
```

If the workspace ID in this message differs from your launch workspace, Seqera retrieved an incorrect access token from a Nextflow configuration file. Check these locations for a hardcoded token:

- The `tower.accessToken` block of your `nextflow.config`, either from the Git repository or an override in the launch form.
- In an HPC cluster compute environment, a stateful `nextflow.config` in the credential user's home directory, for example `~/.nextflow/config`.

To resolve, remove the hardcoded access token so that Seqera uses the launch workspace's token.

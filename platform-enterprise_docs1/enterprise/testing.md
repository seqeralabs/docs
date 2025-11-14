---
title: "Test deployment"
description: Test your Seqera Platform Enterprise deployment after installation
date: "12 Feb 2024"
tags: [testing, deployment]
---

After your [Docker Compose](./docker-compose) or [Kubernetes](./kubernetes) installation is complete, follow these steps to test whether the application is running as expected:

1. Log in to the application.

2. Create an [organization](../orgs-and-teams/organizations).

3. Create a [workspace](../orgs-and-teams/workspace-management) within the organization.

4. Create a new [compute environment](../compute-envs/overview).

5. Add your [GitHub credentials](../git/overview).

6. Select **Quick Launch** from the **Launchpad** tab in your workspace.

7. Enter the repository URL for the `nf-core/rnaseq` pipeline (`https://github.com/nf-core/rnaseq`).

8. In the **Config profiles** drop-down menu, select the `test` profile.

9. In **Pipeline parameters**, change the output directory to a location based on your compute environment:

    ```yaml
    # Uncomment to save to an S3 bucket
    # outdir: s3://<your-bucket>/results

    # Uncomment to save to a scratch directory (Kubernetes)
    # outdir: /scratch/results
    ```

10. Select **Launch**. You'll be redirected to the **Runs** tab for the workflow. After a few minutes, progress logs will be listed in that workflow's **Execution log** tab.

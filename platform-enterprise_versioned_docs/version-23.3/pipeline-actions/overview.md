---
title: "Pipeline actions"
description: "Automate executions with pipeline actions and webhooks in Seqera Platform."
date: "24 Apr 2023"
tags: [actions, webhooks, automation]
---

Actions enable event-based pipeline execution, such as triggering a pipeline launch with a GitHub webhook whenever the pipeline repository is updated. Seqera Platform currently offers support for native **GitHub webhooks** and a general **Tower webhook** that can be invoked programmatically.

### GitHub webhooks

A **GitHub webhook** listens for any changes made in the pipeline repository. When a change occurs it triggers the launch of the pipeline automatically.

:::note
You must sign in to Seqera using GitHub authentication to create a GitHub webhook action. If you're signed in via Google the **Add** button in step 6 below will be inactive.
:::

To create a new action, select the **Actions** tab and select **Add Action**.

1. Enter a **Name** for your action.
2. Select **GitHub webhook** as the **Event source**.
3. Select the **Compute environment** where the pipeline will be executed.
4. Select the **Pipeline to launch** and (optionally) the **Revision number**.
5. Enter the **Work directory**, the **Config profiles**, and the **Pipeline parameters**.
6. Select **Add**.

The pipeline action is now set up. When a new commit occurs for the selected repository and revision, an event is triggered and the pipeline is launched.

Workspace maintainers can edit pipeline actions. Select **Edit** from the options menu to the right of the action on the **Actions** list to load the action details.

Select **Update** to save the updated pipeline action.

:::note
Workspace maintainers can edit the names of existing pipeline actions from the **Edit Action** page.
:::

### Tower launch hooks

A **Tower launch hook** creates a custom endpoint URL which can be used to trigger the execution of your pipeline programmatically from a script or web service.

To create a new action, select the **Actions** tab and select **Add Action**.

1. Enter a **Name** for your action.
2. Select **Tower launch hook** as the event source.
3. Select the **Compute environment** to execute your pipeline.
4. Enter the **Pipeline to launch** and (optionally) the **Revision number**.
5. Enter the **Work directory**, the **Config profiles**, and the **Pipeline parameters**.
6. Select **Add**.

The pipeline action is now set up and the new endpoint can be used to launch the corresponding pipeline programmatically.

When you create a **Tower launch hook**, you also create an **access token** for launching pipelines. Access tokens can be managed on the [tokens page](https://tower.nf/tokens), which is also accessible from the navigation menu.

---
title: "Pipeline actions"
description: "Automate executions with pipeline actions and webhooks in Seqera Platform."
date: "24 Apr 2023"
tags: [actions, webhooks, automation]
---

Actions launch a pipeline, or hand the event to an AI agent, in response to something happening: a push to the pipeline repository, a file arriving in cloud storage, a clock reaching a time, or a pipeline run finishing. Seqera Platform supports five event sources:

- **GitHub webhook**: a native webhook that fires on a change to the pipeline repository.
- **Tower launch hook**: an endpoint URL that you call programmatically.
- **Bucket event**: a marker file arriving in cloud storage.
- **Schedule**: a recurring cadence.
- **Pipeline run event**: a run reaching a terminal state.

Every action also has a **target**: what it does when its event arrives. See [Targets](#targets).

### When to use actions

Actions fit when the next step is a pipeline or an agent that should live alongside the analysis in Seqera Platform: chaining pipelines, loading a run's output once a marker file lands, or running on a schedule. An action launches a pipeline or an agent, not an arbitrary script. For a small post-processing step, use the pipeline's [post-run script](../launch/advanced#pre-and-post-run-scripts) instead. For heavy or continuous data replication, cloud-native tooling, such as S3 event notifications with AWS Lambda, AWS Glue, or AWS DMS, is a better fit.

Nothing from the trigger reaches the launched run, whatever the event source: not the marker file name or the finished run's ID. You cannot use it for a dynamic run name or as a pipeline parameter. The run holds the configuration saved on the action. The exception is a [Tower launch hook](#tower-launch-hooks), whose request can pass pipeline parameters that override the ones saved on the action.

<!-- doc-skills: DRAFT — reviewed: no — Targets section from platform@9e43e1b4af (PLAT-6622) -->

### Targets

An action either launches a pipeline or hands the event to an AI agent.

| Event source | Pipeline target | Agent target |
|---|---|---|
| GitHub webhook | Yes | No |
| Tower launch hook | Yes | No |
| Bucket event | Yes | Yes |
| Schedule | Yes | Yes |
| Pipeline run event | Yes | Yes |

For the three newer sources, select **Launch a pipeline** or **Launch agent** under **Target** while you create the action. The choice is fixed once the action exists: to change it, delete the action and create it again.

The rest of the per-source sections on this page describe a pipeline target.

#### Agent targets

An agent target differs from a pipeline target in two ways:

- **The agent receives the event.** It is told what fired the action — which object arrived, which tick came due, or which run finished, and when. A pipeline launch receives none of the event detail: it runs the configuration saved on the action and nothing else.
- **The agent must already exist.** The action form chooses between the agents the workspace holds; it does not create one. Create the agent on the workspace's **Agents** page first. The **+** beside the picker opens the **Add agent** form in a new tab, but the picker reads its list once, so an agent created that way appears only after you reload the action form.

To target an agent, at the **Target** step of any of the three sources:

1. Select **Launch agent**.
1. Select the **Agent**. Only active agents are listed. A workspace whose agents are all inactive shows an empty picker.
1. Select **Add**.

There is no compute environment, pipeline, work directory, or pipeline parameters to set. Those fields belong to a pipeline launch, and the form hides them for an agent target: the agent acts on its own saved instructions.

An agent target is available in every organization workspace once the Co-Scientist agent backend is configured (`TOWER_AGENT_BACKEND_URL`), and never in a personal workspace. Administrators restrict agents to named organizations with [`TOWER_AGENT_CONFIGURATION_ALLOWED_ORGANIZATIONS`](../enterprise/configuration/overview#co-scientist). If **Launch agent** is missing from **Target**, agents are not enabled for your organization.

You can edit an agent action's name, labels, and trigger — the marker file for a bucket event action, the schedule for a scheduled action, the watched pipeline and run state for a pipeline run event action. You cannot change which agent responds, or switch the action to a pipeline target.

Disabling or deleting the agent pauses every action that targets it, with the reason `Target agent '<name>' was disabled` or `Target agent '<name>' was deleted`. Seqera Platform refuses to resume the action while the agent is inactive. Enable the agent, then resume the action. An action whose agent was deleted cannot be resumed: delete the action and create a new one.

### GitHub webhooks

A **GitHub webhook** listens for any changes made in the pipeline repository. When a change occurs it triggers the launch of the pipeline automatically.

:::note
You must sign in to Seqera using GitHub authentication to create a GitHub webhook action. If you're signed in via Google the **Add** button in step 6 below will be inactive.
:::

To create a new action, select the **Actions** tab and select **Add action**.

1. Enter a **Name** for your action.
1. Select **GitHub webhook** as the **Event source**.
1. Select the **Compute environment** where the pipeline will be executed.
1. Select the **Pipeline to launch** and (optionally) the **Revision**.
1. Enter the **Work directory**, the **Config profiles**, and the **Pipeline parameters**.
1. Select **Add**.

The pipeline action is now set up. When a new commit occurs for the selected repository and revision, an event is triggered and the pipeline is launched.

Workspace maintainers can edit pipeline actions. Select **Edit** from the options menu to the right of the action on the **Actions** list to load the action details.

Select **Update** to save the updated pipeline action.

:::note
Workspace maintainers can edit the names of existing pipeline actions from the **Edit action** page.
:::

### Tower launch hooks

A **Tower launch hook** creates a custom endpoint URL which can be used to trigger the execution of your pipeline programmatically from a script or web service.

To create a new action, select the **Actions** tab and select **Add action**.

1. Enter a **Name** for your action.
1. Select **Tower launch hook** as the event source.
1. Select the **Compute environment** to execute your pipeline.
1. Enter the **Pipeline to launch** and (optionally) the **Revision**.
1. Enter the **Work directory**, the **Config profiles**, and the **Pipeline parameters**.
1. Select **Add**.

The pipeline action is now set up and the new endpoint can be used to launch the corresponding pipeline programmatically.

When you create a **Tower launch hook**, you also create an **access token** for launching pipelines. Access tokens can be managed on the [tokens page](https://cloud.seqera.io/tokens), which is also accessible from the user menu.

<!-- doc-skills: DRAFT — reviewed: no — from platform#10650, platform#10653; re-grounded 2026-09-22 against platform@9e43e1b4af — brief: .docs-operating-model/briefs/evidence/pr-10650.md -->

### Bucket events

A **Bucket event** action launches a pipeline or an agent when a marker file arrives in an AWS S3 bucket. Seqera Platform watches the bucket for the event types you select and fires the action when an object whose key matches the marker arrives. Objects that do not match the marker are discarded.

The pipeline runs with the parameters saved on the action. The marker controls when the pipeline or agent launches and is recorded in the action's trigger history, but it is not passed to the run. Set the pipeline's input location in the action's **Pipeline parameters**.

The run belongs to the action's owner, not to the user who uploaded the marker file.

Bucket events are available in every workspace by default. Administrators restrict them to named workspaces with [`TOWER_ACTIONS_BUCKET_TRIGGER_ALLOWED_WORKSPACES`](../enterprise/configuration/overview#core-features). If **Bucket event** is missing from the **Event source** drop-down, your workspace is not on that list.

:::info[**Prerequisites**]

You need the following:

- An AWS S3 data link in the workspace, with credentials attached. Auto-discovered cloud data links cannot be watched. Create an explicit data link instead.
- A Seqera Platform installation reachable over HTTPS. AWS SNS does not deliver notifications to a plain HTTP endpoint, and Seqera Platform does not check this itself. Over plain HTTP, AWS rejects the subscription and the action moves to **Error**.
- Data link credentials with the `s3:GetBucketNotificationConfiguration`, `s3:PutBucketNotificationConfiguration`, `sns:CreateTopic`, `sns:Subscribe`, `sns:SetTopicAttributes`, and `sns:DeleteTopic` permissions. Seqera Platform uses them to provision the bucket notification and its SNS topic when you create the action, and to release them when the action is no longer active.

:::

To create a new action, select the **Actions** tab and select **Add action**.

1. Enter a **Name** for your action. **Labels** are optional.
1. Select **Bucket event** as the **Event source**.
1. Select the **Data repository** whose bucket you want to watch. **Resource** shows the full path the action watches.
1. Under **Triggers**, select **Object created**, **Object deleted**, or both.
1. Enter the **Marker file** whose arrival fires the action, such as `*.done`. Use `*` to match any characters and `?` to match a single character.
1. Under **Target**, select **Launch a pipeline** or **Launch agent**. For **Launch agent**, continue from [Agent targets](#agent-targets) — the steps below apply to a pipeline target only.
1. Select the **Compute environment** where the pipeline runs.
1. Select the **Pipeline repository** and, optionally, the **Revision**. To launch a pipeline saved in the Launchpad, select it under **Pipeline** instead. If the pipeline has more than one version, **Version** selects the version whose launch settings the action copies. A pipeline run event action can watch the runs this action creates only when the action names a Launchpad pipeline.
1. Enter the **Work directory**, the **Config profiles**, and the **Pipeline parameters**. **Main script** is optional.
1. Select **Add**.

#### Marker file matching

Seqera Platform prepends the data link's path to the marker you enter and matches the result against the whole object key. When the data repository points at a folder, a marker of `*.done` fires only for objects under that folder. The bucket notification is scoped to the same folder, and AWS never sends objects elsewhere in the bucket to Seqera Platform.

A data repository that points at the top of a bucket has no folder to scope to, and Seqera Platform writes no prefix filter. AWS sends every object created anywhere in the bucket, and Seqera Platform discards the ones that do not match. The action still fires only on the marker, but the notification traffic and its cost cover the whole bucket. The third row of the following table shows this case.

Because `*` matches `/` as well as any other character, a marker can match a key several folders deep.

| Data repository | Marker file | Fires | Does not fire |
|---|---|---|---|
| `s3://my-bucket/incoming` | `*.done` | `incoming/run.done`, `incoming/batch7/run.done` | `archive/run.done` |
| `s3://my-bucket/incoming` | `.done` | `incoming/.done` | `incoming/batch7/.done` |
| `s3://my-bucket` | `runs/*.done` | `runs/a.done`, `runs/a/b.done` | `other/a.done` |

A marker with no wildcard is an exact key match.

#### Repeat uploads and redeliveries

Uploading the marker file again fires the action again. Amazon S3 reports an overwrite as an object-created event, the same as a first upload. Replacing a marker file therefore starts another run.

A redelivery does not start a second run. Amazon SNS can deliver the same notification more than once, and Seqera Platform deduplicates notifications by event identity. The exception is a notification whose first delivery failed to launch. Seqera Platform processes the redelivery and tries the launch again.

#### Trigger rate limit

An action fires at most 20 times per hour by default. When a trigger reaches the limit, Seqera Platform records it as suppressed and pauses the action. The action keeps its configuration and shows the reason it was paused. Resume it from the **Actions** list. Suppressed triggers count toward the limit. An action resumed while its window is still full pauses again on its next event.

The limit stops an action from feeding itself, most often a bucket action that watches the folder its own pipeline writes to. It applies to bucket event, schedule, and pipeline run event actions. GitHub webhook and Tower launch hook actions are exempt, because a pipeline can neither push a commit nor call a launch hook.

Administrators change the limit with [`TOWER_ACTIONS_TRIGGER_RATE_MAX_PER_WINDOW`](../enterprise/configuration/overview#core-features) and `TOWER_ACTIONS_TRIGGER_RATE_WINDOW`.

#### Paused actions

If a launch fails, Seqera Platform pauses the action rather than retrying on every marker that lands, because the cause is usually a configuration problem. Pausing also removes the bucket notification. A paused action receives no events and incurs no notification cost. Resuming the action attaches the notification again. The SNS topic and subscription remain until you delete the action or its data repository.

Seqera Platform can refuse a resume. A paused action holds no bucket notification, and another action can claim the same event types over the same folder while it is paused. If one has, Seqera Platform refuses the resume and names the conflicting action.

Deleting the data repository pauses every bucket action that uses it and removes the SNS topic and its subscription. The reason recorded on the action reads `Referenced Data Link was deleted`. Data link is the older term for what the form calls a **Data repository**.

Failed triggers are recorded in the action's trigger history with their reason. To retry a bucket action, fix the cause, resume the action, and upload the marker file again.

#### Notification provisioning

Seqera Platform provisions the bucket notification and its SNS topic after you add the action. The action shows **Creating** until provisioning completes. If provisioning fails, the action moves to **Error** and shows the reason the cloud provider returned. The most common cause is data link credentials that lack the permissions listed in the prerequisites. Correct the credentials, then resume the action to provision it again.

:::note
AWS S3 rejects overlapping notification configurations on a bucket. Seqera Platform rejects a new bucket action that would watch an overlapping prefix with the same event types as an existing action. Use data repositories with non-overlapping folders, select different event types, or use separate buckets.
:::

#### Pipeline output in the watched folder

Seqera Platform rejects a bucket event action whose pipeline writes into the location the action watches, because each run would publish output that fires the action again. When you add or edit the action, it compares the watched location — the data repository folder plus the marker file up to its first wildcard — with the pipeline's output directory and **Work directory**. If either falls inside the watched location, the save fails with a `400` naming both paths. Set a different output or work directory to save the action.

The check compares whole folder names, so a pipeline writing to `incoming-old/` does not overlap an action watching `incoming/`. It cannot see a path that the pipeline sets in its own Nextflow code, and it does not apply to an agent target. The [trigger rate limit](#trigger-rate-limit) stops those loops instead.

### Scheduled actions

A **Schedule** action launches a pipeline or agent on a recurring schedule.

Scheduled actions are available in every workspace by default. Administrators restrict them to named workspaces with [`TOWER_ACTIONS_CRON_TRIGGER_ALLOWED_WORKSPACES`](../enterprise/configuration/overview#core-features). If **Schedule** is missing from the **Event source** drop-down, your workspace is not on that list.

To create a new action, select the **Actions** tab and select **Add action**.

1. Enter a **Name** for your action. **Labels** are optional.
1. Select **Schedule** as the **Event source**.
1. Under **Scheduled**, select **Daily**, **Weekly**, or **Custom cron expression**.
1. For **Daily**, enter a **Time** in 24-hour format, such as `09:00`. For **Weekly**, also select the **Day**. For **Custom cron expression**, enter a five-field cron expression, such as `0 2 * * *` for 02:00 every day or `*/15 * * * *` for every 15 minutes.

    :::note
    See [Cron](https://docs.gitlab.com/topics/cron/) for more information about the cron syntax.
    :::
1. Under **Target**, select **Launch a pipeline** or **Launch agent**. For **Launch agent**, continue from [Agent targets](#agent-targets) — the steps below apply to a pipeline target only.
1. Select the **Compute environment** where the pipeline runs.
1. Select the **Pipeline repository** and, optionally, the **Revision**. To launch a pipeline saved in the Launchpad, select it under **Pipeline** instead. If the pipeline has more than one version, **Version** selects the version whose launch settings the action copies.
1. Enter the **Work directory**, the **Config profiles**, and the **Pipeline parameters**. **Main script** is optional.
1. Select **Add**.

The time zone is shown beside **Time** and cannot be chosen in the form. A new action uses your browser's time zone, and a saved action shows the time zone it runs in. Through the API, `timezone` takes an IANA time zone ID such as `Europe/Madrid` and defaults to `UTC`.

#### Tick timing

- The finest schedule is one minute. Five-field cron syntax has no seconds field.
- A tick usually fires within about 20 seconds of its scheduled time. Seqera Platform checks for due schedules every 20 seconds rather than waking exactly on the tick, and a busy cycle can delay a tick further.
- Ticks do not wait for each other. A tick that comes due while the previous run is still going launches anyway, and both runs appear in the history. Seqera Platform neither skips nor queues a tick.
- A missed tick leaves no record. A tick that could not fire because Seqera Platform was unavailable is not replayed, and nothing reports it.
- A scheduled launch carries no schedule data. The run holds the action's saved launch configuration and nothing else. A pipeline cannot read its scheduled time from its own parameters.

Seqera Platform evaluates a schedule in its own time zone. Across a daylight saving change, the local clock time holds:

- When the clocks go forward and the scheduled hour is skipped, the action does not fire that day.
- When the clocks go back and the scheduled hour occurs twice, the action fires on the first occurrence only.
- An hourly schedule fires 23 times on the day the clocks go forward and 25 times on the day they go back, because each is a different local time.

#### Failed ticks

A failed launch does not stop a scheduled action. Seqera Platform records the trigger with its reason, arms the next tick, and keeps the action active. A transient failure costs one run rather than the whole schedule. A bucket event action behaves differently because its events would otherwise keep arriving and failing.

The [trigger rate limit](#trigger-rate-limit) does pause a scheduled action. The default limit is 20 triggers per hour, and a schedule that ticks more often than that is paused, however deliberate it is. Every preset stays inside the limit, but a custom expression can reach it.

:::caution
`*/3 * * * *` fires 20 times an hour, the most the default limit allows. A single late tick is enough to pause the action. Treat three minutes as the edge rather than a safe value, and choose a wider interval for a schedule you depend on. To schedule more often, ask your administrator to raise `TOWER_ACTIONS_TRIGGER_RATE_MAX_PER_WINDOW`.
:::

#### Schedule presets

When you create a scheduled action through the API, supply either an `expression` or a named `preset`, not both:

| Preset | Schedule | Cron expression | Opens in the form as |
| --- | --- | --- | --- |
| `every_5_minutes` | Every 5 minutes | `*/5 * * * *` | Custom cron expression |
| `every_15_minutes` | Every 15 minutes | `*/15 * * * *` | Custom cron expression |
| `hourly` | Every hour | `0 * * * *` | Custom cron expression |
| `daily_midnight` | Daily at midnight | `0 0 * * *` | Daily |
| `daily_noon` | Daily at noon | `0 12 * * *` | Daily |
| `weekly_monday` | Weekly on Monday at midnight | `0 0 * * 1` | Weekly |
| `monthly_first` | First day of each month | `0 0 1 * *` | Custom cron expression |

The form offers **Daily**, **Weekly**, and **Custom cron expression** only, and chooses between them by matching the saved expression. An action created from `daily_midnight`, `daily_noon`, or `weekly_monday` opens as a named schedule. The other four open as **Custom cron expression** and show the raw expression.

<!-- doc-skills: DRAFT — reviewed: no — from platform@9e43e1b4af: docs/event-driven-actions.md, ActionServiceImpl, RunStateEventDrainerJob, action-form.component.{ts,html}, run-state-options.ts -->

### Pipeline run events

A **Pipeline run event** action launches a pipeline when a run of a watched pipeline reaches a terminal state. It is how one pipeline is chained to another: when a run of pipeline A succeeds, launch pipeline B.

Pipeline run events are available in every workspace by default. Administrators restrict them to named workspaces with [`TOWER_ACTIONS_PIPELINE_TRIGGER_ALLOWED_WORKSPACES`](../enterprise/configuration/overview#core-features). If **Pipeline run event** is missing from the **Event source** drop-down, your workspace is not on that list.

:::info[**Prerequisites**]

You need the following:

- The pipeline to watch saved in the workspace's Launchpad. An action watches a Launchpad pipeline, not a repository URL.
- The pipeline to launch, and a compute environment to run it in, as for any other action.

:::

To create a new action, select the **Actions** tab and select **Add action**.

1. Enter a **Name** for your action. **Labels** are optional.
1. Select **Pipeline run event** as the **Event source**.
1. Select the **Pipeline to watch**. The list shows the workspace's Launchpad pipelines with their repositories, and is searched as you type.
1. Select the **Run state** that fires the action: **Succeeded**, **Failed**, or **Cancelled**.
1. Under **Target**, select **Launch a pipeline** or **Launch agent**. For **Launch agent**, continue from [Agent targets](#agent-targets) — the steps below apply to a pipeline target only.
1. Select the **Compute environment** where the pipeline runs.
1. Select the **Pipeline repository** and, optionally, the **Revision**. To launch a pipeline saved in the Launchpad, select it under **Pipeline** instead. If the pipeline has more than one version, **Version** selects the version whose launch settings the action copies. Another pipeline run event action can watch the runs this action creates only when the action names a Launchpad pipeline.
1. Enter the **Work directory**, the **Config profiles**, and the **Pipeline parameters**. **Main script** is optional.
1. Select **Add**.

The action is active as soon as you save it. Nothing is registered with a cloud provider, so there is no provisioning step to wait through.

#### One action, one run state

An action watches a single run state. To act on both failures and cancellations, create two actions. Each keeps its own trigger history and its own [trigger rate limit](#trigger-rate-limit).

**Submitted**, **Running**, and **Unknown** are not offered, and the API refuses them. The first two are states a run passes through before it has a result, and a run reported as unknown returns to running if it reconnects. There is no state for a run starting.

#### Which runs match

The action watches a Launchpad pipeline by its identity, not by its repository URL:

- Two Launchpad pipelines that point at the same repository are told apart. An action watching one does not fire on runs of the other.
- Changing a pipeline's repository does not stop the action firing.
- A run launched outside the Launchpad fires no action, because there is no Launchpad pipeline to attribute it to.

A run started with the API fires the action only when it is attributed to the Launchpad pipeline. Call `POST /workflow/launch` and set `launch.id` to the pipeline's launch ID, from `GET /pipelines/{pipelineId}/launch`. A quick launch with no `launch.id`, or a run started from the Nextflow CLI, is not attributed to any Launchpad pipeline and never fires the action.

An action sees only the runs in its own workspace. A personal action watches its owner's runs. A watched or target pipeline outside the action's workspace is refused.

#### Chaining actions together

Any action that names a Launchpad pipeline under **Pipeline** produces runs another action can watch, whatever its event source. A nightly schedule that runs pipeline B, and a pipeline run event action that runs pipeline C when B succeeds, is a two-step chain headed by a clock.

An action whose target is an agent launches no pipeline, so nothing can chain from it.

#### Loops

Seqera Platform refuses an event that would close a loop. Before the action fires, it traces the run back through the triggers that led to it. If the action itself started the run, or started something that led to it, the event is recorded as suppressed with the reason naming how many steps back the loop closed, and nothing launches. A chain longer than 20 steps is suppressed for the same reason. Administrators change the limit with [`TOWER_ACTION_CYCLE_MAX_CHAIN_DEPTH`](../enterprise/configuration/overview#core-features).

Only the event is refused. The action stays active and still fires on a run someone launches by hand.

#### Deleted pipelines

Deleting the watched pipeline or the target pipeline pauses every action that names it, with the reason recorded on the action: `Watched pipeline '<name>' was deleted` or `Target pipeline '<name>' was deleted`. An action already paused for another reason keeps its own reason.

Edit the action onto a live pipeline to lift the pause. An action that someone paused by hand stays paused whatever you edit.

Unlike the launch repository, the trigger can be changed after the action is saved. Moving an action onto a different pipeline or a different run state keeps its trigger history.

#### No event data reaches the launch

The run that finished decides only whether to launch. Its identifier does not become a pipeline parameter, and neither does anything else about the event. The launched run holds the configuration saved on the action and nothing else. The event is recorded on the action and in its trigger history. The same holds for every event source except Tower launch hooks. See [When to use actions](#when-to-use-actions).

<!-- doc-skills: DRAFT — reviewed: no — from platform v26.2.0-RC18-enterprise: action-trigger-list.component.{ts,html}, action-detail-page.component.{ts,html}, action-form.component.ts, action-list.component.{ts,html}, ActionServiceImpl, TriggerAvailability, DeactivatedAgentReason, BucketOutputOverlapValidator, ActionDispatcher -->

### Trigger history

An action's page opens on the **Trigger history** tab, which lists each time the action fired, newest first. Every action records its triggers, whatever its event source.

| Column | Shows |
| --- | --- |
| **Trigger** | The event that fired the action. |
| **Trigger status** | **Succeeded**, **Failed**, or **Suppressed**. Hover over a **Failed** or **Suppressed** badge to see the reason. |
| **Triggered at** | The date and time the action fired. |
| **Payload** | **View payload** opens the event data captured when the action fired. |
| **Target** | **View target** opens the run that a pipeline target started, or the agent's conversation in the Co-Scientist panel. |

**Trigger status** reports whether the target launched, not how the run ended. A **Succeeded** trigger can start a run that later fails. Seqera Platform suppresses a trigger that would close a [loop](#loops) or exceed the [trigger rate limit](#trigger-rate-limit), and launches nothing.

**Launches**, the default view, shows succeeded and failed triggers. Select **All triggers** to include suppressed ones.

For an agent target, **View target** appears only when Co-Scientist chat is available to you. Otherwise, the column shows the agent run ID.

### Edit an action

Select **Edit** from the options menu beside the action on the **Actions** list, or from the header of the action's page. The form has **Details**, **Trigger**, and **Target** cards.

You can change:

- The name and labels.
- The trigger:
  - The **Marker file** of a bucket event action, and its **Triggers** when the target is a pipeline.
  - The schedule of a scheduled action.
  - The **Pipeline to watch** and **Run state** of a pipeline run event action.
- The **Pipeline** and **Version** the action launches, and its other launch settings.

You cannot change the event source, the target type, the agent, the pipeline repository, or a bucket event action's data repository. To change one of these, delete the action and create it again.

### Pause and resume actions

Select **Pause** or **Resume** on the **Actions** list or in the header of the action's page.

Seqera Platform also pauses an action itself, and records why. The reason appears under the action's status on the **Actions** list, and above the tabs on the action's page. An action pauses when:

- Its trigger is no longer enabled for the workspace.
- The pipeline, data repository, or agent it names is deleted, or its agent is disabled. See [Deleted pipelines](#deleted-pipelines) and [Agent targets](#agent-targets).
- A bucket event launch fails. See [Paused actions](#paused-actions).
- It reaches the [trigger rate limit](#trigger-rate-limit).

Seqera Platform refuses a resume that cannot succeed, with a `400` that says what to fix.

When an administrator removes a workspace from a trigger's allow-list, such as `TOWER_ACTIONS_BUCKET_TRIGGER_ALLOWED_WORKSPACES`, each active action of that type in the workspace pauses at its next event. The reason reads `Bucket event trigger is not enabled for this workspace`, `Schedule trigger is not enabled for this workspace`, or `Pipeline run event trigger is not enabled for this workspace`. The action cannot be edited or resumed until the workspace is back on the list.

The **Actions** list also shows who created each action under **Created by**.

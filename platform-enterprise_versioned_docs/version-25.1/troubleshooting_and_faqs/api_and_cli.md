---
title: "Developer tools"
description: "API and CLI troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, aws help, aws troubleshooting]
---

## API

### Maximum results returned

Use pagination to fetch the results in smaller chunks through multiple API calls with `max` and `offset` parameters. The error below indicates that you have run into the maximum result limit:

`{object} length parameter cannot be greater than 100 (current value={value_sent})`

To remedy this, see the example requests below:

```
curl -X GET "https://$TOWER_SERVER_URL/workflow/$WORKFLOW_ID/tasks? workspaceId=$WORKSPACE_ID&max=100" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOWER_ACCESS_TOKEN"
curl -X GET "https://$TOWER_SERVER_URL/workflow/$WORKFLOW_ID/tasks? workspaceId=$WORKSPACE_ID&max=100&offset=100" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOWER_ACCESS_TOKEN"
```

## tw CLI

**Connection errors when creating or viewing AWS Batch compute environments with `tw compute-envs` commands**

Versions of tw CLI earlier than v0.8 do not support the `SPOT_PRICE_CAPACITY_OPTIMIZED` [allocation strategy](../compute-envs/aws-batch#advanced-options) in AWS Batch. Creating or viewing AWS Batch compute environments with this allocation strategy will lead to errors. This issue was [addressed in CLI v0.9](https://github.com/seqeralabs/tower-cli/issues/332).

**Segfault errors**

Users of legacy tw CLI versions may experience segmentation faults in older operating systems.

To resolve segfault errors, first upgrade your tw CLI to the latest available version. If errors persist, use our alternative Java [JAR-based solution](https://github.com/seqeralabs/tower-cli/releases/download/v0.8.0/tw.jar).

**Insecure HTTP errors**

The error _ERROR: You are trying to connect to an insecure server: `http://hostname:port/api` if you want to force the connection use '--insecure'. NOT RECOMMENDED!_ indicates that your Seqera host accepts connections using insecure HTTP instead of HTTPS. If your host cannot be configured to accept HTTPS connections, add the `--insecure` flag **before** your CLI command:

```
tw --insecure info
```

:::caution
HTTP must not be used in production environments.
:::

**Resume/relaunch runs with tw CLI**

Runs can be [relaunched](../launch/cache-resume#relaunch-a-workflow-run) with `tw runs relaunch` command.

```
tw runs relaunch -i 3adMwRdD75ah6P -w 161372824019700

  Workflow 5fUvqUMB89zr2W submitted at [org / private] workspace.


tw runs list -w 161372824019700

  Pipeline runs at [org / private] workspace:

     ID             | Status    | Project Name   | Run Name        | Username    | Submit Date
    ----------------+-----------+----------------+-----------------+-------------+-------------------------------
     5fUvqUMB89zr2W | SUBMITTED | nf/hello       | magical_darwin  | seqera-user | Tue, 10 Sep 2022 14:40:52 GMT
     3adMwRdD75ah6P | SUCCEEDED | nf/hello       | high_hodgkin    | seqera-user | Tue, 10 Sep 2022 13:10:50 GMT

```

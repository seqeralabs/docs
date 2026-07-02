---
title: "Developer tools"
description: "API and CLI troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, aws, troubleshooting]
---

## API

### Maximum results returned

`{object} length parameter cannot be greater than 100 (current value={value_sent})`

This error occurs when a request returns more results than the maximum page size of 100.

To resolve, paginate the results across multiple API calls with the `max` and `offset` parameters:

```
curl -X GET "https://$TOWER_SERVER_URL/workflow/$WORKFLOW_ID/tasks? workspaceId=$WORKSPACE_ID&max=100" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOWER_ACCESS_TOKEN"
curl -X GET "https://$TOWER_SERVER_URL/workflow/$WORKFLOW_ID/tasks? workspaceId=$WORKSPACE_ID&max=100&offset=100" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOWER_ACCESS_TOKEN"
```

## tw CLI

### Connection errors with AWS Batch compute environments

Creating or viewing an AWS Batch compute environment that uses the `SPOT_PRICE_CAPACITY_OPTIMIZED` [allocation strategy](../compute-envs/aws-batch#advanced-options) fails on tw CLI versions earlier than v0.8, which don't support it.

To resolve, upgrade to CLI v0.9 or later, where this was [addressed](https://github.com/seqeralabs/tower-cli/issues/332).

### Segmentation faults

Legacy tw CLI versions can produce segmentation faults on older operating systems.

To resolve, upgrade the tw CLI to the latest version. If the fault persists, use the Java [JAR-based build](https://github.com/seqeralabs/tower-cli/releases/download/v0.8.0/tw.jar).

### Error: `You are trying to connect to an insecure server…`

```
ERROR: You are trying to connect to an insecure server: http://hostname:port/api if you want to force the connection use '--insecure'. NOT RECOMMENDED!
```

This error occurs when your Seqera host accepts connections over insecure HTTP instead of HTTPS.

To resolve, configure the host to accept HTTPS connections. If it can't, add the `--insecure` flag **before** the CLI command:

```
tw --insecure info
```

:::caution
HTTP must not be used in production environments.
:::

### Relaunch a run

Relaunch a run with the [`tw runs relaunch`](../launch/cache-resume#relaunch-a-workflow-run) command:

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

---
title: "Audit logs"
description: An overview of application event audit logs in the Admin panel
date: "08 Apr 2024"
tags: [logging, audit logs, admin panel]
---

Root users can view application event audit logs from the [Admin panel](../administration/overview) **Audit logs** tab.

:::info
Application event audit logs are retained for 365 days by default. In Platform Enterprise, this retention period can be [customized](../../version-24.2/enterprise/configuration/overview#logging).
:::

### Audit log event format

Audit log entries record the following event details:

- **Type**: A brief event description, such as `user_sign_in`, `credentials_created`, etc.
- **Target**: ID of the resource associated with the event, such as ID of created credentials, etc.
- **Principal**: ID of the user that performed the action. User IDs for user-initiated events, `system` for Seqera-initiated events.
- **Status**: Additional event information, such as workflow completion status, user sign-in method, etc.
- **Organization ID**
- **Organization name**
- **Workspace ID**
- **Workspace name**
- **Client IP**: IP address of user/client initiating the event. Empty for Seqera-initiated events.
- **Creation date**: Event timestamp in `YYYY-MM-DD-HH-MM-SS` format.

### Audit log events

Audit logs include administration, security, and application resource events.

::table{file=configtables/log_events.yml}

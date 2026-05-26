---
title: "Audit logs"
description: An overview of application event audit logs in the Admin panel
date created: "2024-04-08"
last updated: "2026-05-11"
tags: [logging, audit logs, admin panel]
---

Root users can view application event audit logs from the [Admin panel](../administration/overview) **Audit logs** tab.

:::info
Application event audit logs are retained for 365 days by default. In Platform Enterprise, this retention period can be [customized](../enterprise/configuration/overview#logging). You can also disable automatic audit log deletion with `TOWER_CRON_AUDIT_LOG_CLEAN_UP_ENABLED`.
:::

## Audit log versions in 26.1

Seqera Platform Enterprise 26.1 introduces the audit log v2 schema as a **breaking change** for direct database consumers and custom ETL jobs.

- The legacy audit log schema remains in the `tw_audit_log` table.
- The new audit log v2 schema is written to a separate table.
- The v2 schema is not backward-compatible with the legacy schema. Field names, structure, and pagination behavior differ.
- The v2 Admin panel view and CSV export are available when `TOWER_AUDIT_LOG_V2_WRITE_MODE` is set to `dual` or `v2`.

Use `TOWER_AUDIT_LOG_V2_WRITE_MODE` to control how new audit events are written:

- `dual`: Write new events to both `v1` schema and `v2` schema. This is the recommended 26.1 migration mode if you need to validate the v2 schema while keeping existing v1 integrations unchanged.
- `v2`: Write new events to `v2` schema only.

## Upgrade path for existing integrations

If you have existing scripts, exports, or ETL processes that read from the legacy audit log schema, plan the 26.1 upgrade in two stages:

1. Upgrade to 26.1.
2. Validate your integrations against the v2 schema while your existing v1 readers continue to work from the legacy table.

In the 26.1 migration plan, dual-write is transitional. Plan for 26.2 to make v2 the only write-side schema, while the legacy v1 data remains available for reads as long as your retention policy still covers the required historical period.

## Audit log event format

When audit log v2 is enabled, the Admin panel shows the following event details:

- **Timestamp**: Event timestamp in ISO 8601 format.
- **Event**: The audit event name, such as `user_sign_in` or `credentials_created`.
- **Actor**: Whether the event was triggered by a user or by the system, including point-in-time user details for user-initiated events.
- **Client**: Client IP address, user agent, and access token ID when available. Client details are empty for system-initiated events.
- **Target**: The resource type, ID, and resource name associated with the event.
- **Organization**: The organization ID and name for organization-scoped or workspace-scoped resources.
- **Workspace**: The workspace ID and name for workspace-scoped resources.
- **Correlation ID**: An identifier that links all audit events emitted as part of the same cascade action.

For organization-scoped, personal workspace-scoped, or system-wide targets, the organization and workspace columns display `N/A` labels to indicate when a field does not apply to that resource scope.

CSV exports use the same v2 schema and date filters as the Admin panel view. You can control the maximum export size with `TOWER_AUDIT_LOG_V2_CSV_EXPORT_MAX_LOGS`.

### Audit log events

Audit logs include administration, security, and application resource events.

::table{file=configtables/log_events.yml}

### Pre and post state change capture

When enabled, audit log v2 captures full resource state snapshots or images immediately before and after each change event in JSON format. This provides a complete record of what changed and satisfies regulatory requirements (such as GxP/21 CFR Part 11). Fields that are large or that may contain sensitive values are hashed.

:::info
State snapshots increase database storage requirements. For a deployment with 2 million audit log records, the snapshots can consume between 3 GB and 40 GB depending on the events and the size and complexity of the tracked resources. Plan your database capacity and retention policy accordingly before enabling this feature.
:::

This feature is enabled once the GxP add-on is attached to your Seqera license. [Contact us](https://seqera.io/contact-us/) to obtain the GxP add-on.

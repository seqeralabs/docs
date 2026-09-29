---
title: "Audit logs"
description: An overview of application event audit logs in the Admin panel
date created: "2024-04-08"
last updated: "2026-09-18"
tags: [logging, audit logs, admin panel]
---

Root users can view application event audit logs from the [Admin panel](../administration/overview) **Audit logs** tab.

:::info
Application event audit logs are retained for 365 days by default. In Platform Enterprise, this retention period can be [customized](../enterprise/configuration/overview#logging). You can also disable automatic audit log deletion with `TOWER_CRON_AUDIT_LOG_CLEAN_UP_ENABLED`.
:::

## Audit log versions

Seqera Platform Enterprise 26.1 introduced the audit log v2 schema as a **breaking change** for direct database consumers and custom ETL jobs. From 26.2, v2 is the only schema that receives new events.

- The `TOWER_AUDIT_LOG_V2_WRITE_MODE` setting is removed. Setting the variable has no effect, so remove it from your configuration.
- No new rows are written to the legacy v1 schema (`tw_audit_log` table). Existing rows remain until the audit log retention period deletes them. As long as the table has records, they stay visible in the legacy table view of the Admin panel **Audit logs** tab.

## Upgrade path for existing integrations

If you have existing scripts, exports, or ETL processes that read from the legacy audit log schema, switch them to the v2 schema before upgrading to 26.2:

1. On 26.1, validate your integrations against the v2 schema while your existing v1 readers continue to work from the legacy v1 schema. Audit log v2 entries are available through the public API at `/admin/audit-logs-v2`, with a CSV export at `/admin/audit-logs-v2/export-csv`.
2. Point every reader at the v2 schema.
3. Upgrade to 26.2.

## Audit log event format

The Admin panel shows the following event details:

- **Timestamp**: Event timestamp in ISO 8601 format.
- **Event**: The audit event name, such as `user_sign_in` or `credentials_created`.
- **Actor**: Whether the event was triggered by a user, a service account, or the system, including point-in-time identity details for user- and service-account-initiated events. Where an agent acted under a service account, the actor also carries an **Agent ID**, which is the agent's raw identifier rather than a name.
- **Client**: Client IP address, user agent, and access token ID when available. Client details are empty for system-initiated events.
- **Target**: The resource type, ID, and resource name associated with the event.
- **Organization**: The organization ID and name for organization-scoped or workspace-scoped resources.
- **Workspace**: The workspace ID and name for workspace-scoped resources.
- **Correlation ID**: An identifier that links all audit events emitted as part of the same cascade action.

For organization-scoped, personal workspace-scoped, or system-wide targets, the organization and workspace columns display `N/A` labels to indicate when a field does not apply to that resource scope.

{/* doc-skills: DRAFT — reviewed: no — from EDU-1442, 2026-09-10 — brief: .docs-operating-model/briefs/evidence/PLAT-5551.md — availability: unconfirmed (SERVICE_ACCOUNTS feature flag, org allow-list, not GA) */}

:::note
Service account authentication is not audited. Service accounts cannot sign in, and bearer-token validation does not raise a `user_sign_in` event. No service account appears in sign-in events or sign-in metrics. The audit log records what a service account did, not that it authenticated.
:::

If you parse the **Actor** field, update your integration to handle the `service_account` actor type before upgrading.

CSV exports use the same v2 schema and date filters as the Admin panel view. You can control the maximum export size with `TOWER_AUDIT_LOG_V2_CSV_EXPORT_MAX_LOGS`.

### Audit log v2 events

Audit log v2 emits the following event names.

::table{file=configtables/audit_events_v2.yml}

### Deprecated audit events

The following legacy event names are deprecated. Use the replacement event when one is available.

::table{file=configtables/audit_events_deprecated.yml}

### Pre and post state change capture

When enabled, audit log v2 captures full resource state snapshots or images immediately before and after each change event in JSON format. This provides a complete record of what changed and satisfies regulatory requirements (such as GxP/21 CFR Part 11). Fields that are large or that may contain sensitive values are hashed.

:::info
State snapshots increase database storage requirements. For a deployment with 2 million audit log records, the snapshots can consume between 3 GB and 40 GB depending on the events and the size and complexity of the tracked resources. Plan your database capacity and retention policy accordingly before enabling this feature.
:::

This feature is enabled once the GxP add-on is attached to your Seqera license. [Contact us](https://seqera.io/contact-us/) to obtain the GxP add-on.

I'll generate the OpenAPI overlay files for version 1.181.0, organized by controller/tag. Given the extensive changes, I'll create overlay files for the major new features and modifications.

## Actions Overlays

```yaml
# actions-operations-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Actions operations overlay
  version: 0.0.0
actions:
  # ===== ACTIONS - OPERATIONS =====

  # ---- RESOLVE CRON EXPRESSION ----

  - target: "$.paths['/actions/cron/resolve'].post.summary"
    update: "Resolve cron expression"

  - target: "$.paths['/actions/cron/resolve'].post.description"
    update: "Resolves a schedule description to a cron expression. Accepts human-readable schedule presets and returns the equivalent cron expression and timezone information."
```

```yaml
# actions-parameters-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Actions parameters overlay
  version: 0.0.0
actions:
  # ===== ACTIONS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====

  # ---- QUERY PARAMETERS ----

  - target: "$.paths['/actions/cron/resolve'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  # ---- REQUEST BODY DESCRIPTIONS ----

  - target: "$.paths['/actions/cron/resolve'].post.requestBody.description"
    update: "Schedule description request"
```

```yaml
# actions-schemas-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Actions schemas overlay
  version: 0.0.0
actions:
  # ===== ACTIONS SCHEMAS - REQUEST/RESPONSE OBJECTS =====

  # ---- CRON ACTION CONFIG ----

  - target: "$.components.schemas.CronActionConfig.properties.discriminator"
    update:
      type: string
      description: "Type discriminator for action configuration polymorphism."

  - target: "$.components.schemas.CronActionConfig.properties.expression"
    update:
      type: string
      description: "Standard cron expression defining the schedule (e.g., `0 0 * * *` for daily at midnight)."

  - target: "$.components.schemas.CronActionConfig.properties.preset"
    update:
      type: string
      description: "Human-readable schedule preset (e.g., `daily`, `weekly`, `monthly`)."

  - target: "$.components.schemas.CronActionConfig.properties.timezone"
    update:
      type: string
      description: "IANA timezone identifier for schedule evaluation (e.g., `America/New_York`, `UTC`)."

  # ---- CRON ACTION EVENT ----

  - target: "$.components.schemas.CronActionEvent.properties.discriminator"
    update:
      type: string
      description: "Type discriminator for action event polymorphism."

  - target: "$.components.schemas.CronActionEvent.properties.scheduledTime"
    update:
      type: string
      format: date-time
      description: "Scheduled execution time for this event instance."

  - target: "$.components.schemas.CronActionEvent.properties.timestamp"
    update:
      type: string
      format: date-time
      description: "Actual timestamp when this event was triggered."

  - target: "$.components.schemas.CronActionEvent.properties.workflowId"
    update:
      type: string
      description: "Workflow identifier associated with this event."

  # ---- CRON ACTION REQUEST ----

  - target: "$.components.schemas.CronActionRequest.properties.expression"
    update:
      type: string
      description: "Standard cron expression to validate or convert."

  - target: "$.components.schemas.CronActionRequest.properties.preset"
    update:
      type: string
      description: "Human-readable schedule preset to convert to cron expression."

  - target: "$.components.schemas.CronActionRequest.properties.timezone"
    update:
      type: string
      description: "IANA timezone identifier for the schedule."

  # ---- ACTION IMAGE ----

  - target: "$.components.schemas.ActionImage.properties.auditImageType"
    update:
      description: "Audit image type discriminator. Always `action` for action resources."

  - target: "$.components.schemas.ActionImage.properties.config"
    update:
      description: "Action configuration details including schedule settings and execution parameters."

  - target: "$.components.schemas.ActionImage.properties.error"
    update:
      type: string
      description: "Error message if the action encountered a failure during execution."

  - target: "$.components.schemas.ActionImage.properties.event"
    update:
      description: "Event details that triggered this action instance."

  - target: "$.components.schemas.ActionImage.properties.hookId"
    update:
      type: string
      description: "Webhook identifier associated with this action."

  - target: "$.components.schemas.ActionImage.properties.hookUrl"
    update:
      type: string
      description: "Webhook URL endpoint for action notifications."

  - target: "$.components.schemas.ActionImage.properties.lastSeen"
    update:
      type: string
      format: date-time
      description: "Timestamp of the most recent action execution or update."

  - target: "$.components.schemas.ActionImage.properties.launch"
    update:
      description: "Launch configuration details for workflows triggered by this action."

  - target: "$.components.schemas.ActionImage.properties.name"
    update:
      type: string
      description: "Action name."

  - target: "$.components.schemas.ActionImage.properties.source"
    update:
      type: string
      description: "Action trigger source type (e.g., `cron`, `webhook`, `github`)."

  - target: "$.components.schemas.ActionImage.properties.status"
    update:
      type: string
      description: "Current action status (e.g., `active`, `paused`, `errored`)."
```

## Admin Overlays (Audit Logs V2)

```yaml
# admin-operations-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Admin operations overlay
  version: 0.0.0
actions:
  # ===== ADMIN - OPERATIONS =====

  # ---- LIST AUDIT LOGS V2 ----

  - target: "$.paths['/admin/audit-logs-v2'].get.summary"
    update: "List audit logs"

  - target: "$.paths['/admin/audit-logs-v2'].get.description"
    update: "Lists audit logs with token-based pagination, ordered by timestamp descending. Supports filtering by timestamp range and optional inclusion of pre/post change state images."

  # ---- EXPORT AUDIT LOGS V2 CSV ----

  - target: "$.paths['/admin/audit-logs-v2/export-csv'].get.summary"
    update: "Export audit logs as CSV"

  - target: "$.paths['/admin/audit-logs-v2/export-csv'].get.description"
    update: "Exports audit log entries as a CSV file. Supports filtering by timestamp range. Fails if the number of matching logs exceeds the maximum export limit."

  # ---- DESCRIBE AUDIT LOG V2 ----

  - target: "$.paths['/admin/audit-logs-v2/{auditLogId}'].get.summary"
    update: "Get audit log details"

  - target: "$.paths['/admin/audit-logs-v2/{auditLogId}'].get.description"
    update: "Retrieves detailed information for the specified audit log including pre/post change images when requested via the `attributes` parameter."
```

```yaml
# admin-parameters-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Admin parameters overlay
  version: 0.0.0
actions:
  # ===== ADMIN PARAMETERS - PATH, QUERY, AND REQUEST BODY =====

  # ---- PATH PARAMETERS ----

  - target: "$.paths['/admin/audit-logs-v2/{auditLogId}'].get.parameters[?(@.name=='auditLogId')].description"
    update: "Audit log numeric identifier."

  # ---- QUERY PARAMETERS (LIST) ----

  - target: "$.paths['/admin/audit-logs-v2'].get.parameters[?(@.name=='attributes')].description"
    update: "Additional attribute values to include in the response. Accepts `state` to include pre/post change image payloads."

  - target: "$.paths['/admin/audit-logs-v2'].get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token for retrieving the next page of results. Obtained from the previous response."

  - target: "$.paths['/admin/audit-logs-v2'].get.parameters[?(@.name=='max')].description"
    update: "Maximum number of results to return per page. Default: `50`."

  - target: "$.paths['/admin/audit-logs-v2'].get.parameters[?(@.name=='timestampAfterOrEqual')].description"
    update: "Filter logs with timestamp on or after this date in ISO 8601 format."

  - target: "$.paths['/admin/audit-logs-v2'].get.parameters[?(@.name=='timestampBeforeOrEqual')].description"
    update: "Filter logs with timestamp on or before this date in ISO 8601 format."

  # ---- QUERY PARAMETERS (EXPORT CSV) ----

  - target: "$.paths['/admin/audit-logs-v2/export-csv'].get.parameters[?(@.name=='attributes')].description"
    update: "Additional attribute values to include in the export. Accepts `state` to include pre/post change image columns."

  - target: "$.paths['/admin/audit-logs-v2/export-csv'].get.parameters[?(@.name=='timestampAfterOrEqual')].description"
    update: "Filter logs with timestamp on or after this date in ISO 8601 format."

  - target: "$.paths['/admin/audit-logs-v2/export-csv'].get.parameters[?(@.name=='timestampBeforeOrEqual')].description"
    update: "Filter logs with timestamp on or before this date in ISO 8601 format."

  # ---- QUERY PARAMETERS (DESCRIBE) ----

  - target: "$.paths['/admin/audit-logs-v2/{auditLogId}'].get.parameters[?(@.name=='attributes')].description"
    update: "Additional attribute values to include in the response. Accepts `state` to include pre/post change images. Returns empty values if omitted."
```

```yaml
# admin-schemas-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Admin schemas overlay
  version: 0.0.0
actions:
  # ===== ADMIN SCHEMAS - REQUEST/RESPONSE OBJECTS =====

  # ---- AUDIT LOG V2 RESPONSE ----

  - target: "$.components.schemas.AuditLogV2ResponseDto.properties.actor"
    update:
      description: "Details about the entity that performed the audited action (user or system)."

  - target: "$.components.schemas.AuditLogV2ResponseDto.properties.client"
    update:
      description: "Client information including IP address, user agent, and access token details."

  - target: "$.components.schemas.AuditLogV2ResponseDto.properties.correlationId"
    update:
      type: string
      description: "Correlation identifier linking related audit events across distributed operations."

  - target: "$.components.schemas.AuditLogV2ResponseDto.properties.event"
    update:
      description: "Type of event that was audited (e.g., `workflow_launched`, `credentials_created`)."

  - target: "$.components.schemas.AuditLogV2ResponseDto.properties.id"
    update:
      type: string
      description: "Audit log unique identifier."

  - target: "$.components.schemas.AuditLogV2ResponseDto.properties.target"
    update:
      description: "Details about the resource that was targeted by the audited action."

  - target: "$.components.schemas.AuditLogV2ResponseDto.properties.timestamp"
    update:
      type: string
      format: date-time
      description: "Timestamp when the audited event occurred."

  # ---- AUDIT LOG V2 ACTOR ----

  - target: "$.components.schemas['AuditLogV2ResponseDto.Actor'].properties.email"
    update:
      type: string
      description: "Actor email address. Populated for user actors."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Actor'].properties.firstName"
    update:
      type: string
      description: "Actor first name. Populated for user actors."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Actor'].properties.isRoot"
    update:
      type: boolean
      description: "Whether the actor has root/system administrator privileges."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Actor'].properties.lastName"
    update:
      type: string
      description: "Actor last name. Populated for user actors."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Actor'].properties.type"
    update:
      description: "Actor type. Accepts `user` or `system`."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Actor'].properties.userId"
    update:
      type: integer
      format: int64
      description: "User numeric identifier. Populated for user actors."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Actor'].properties.userName"
    update:
      type: string
      description: "Actor username. Populated for user actors."

  # ---- AUDIT LOG V2 CLIENT ----

  - target: "$.components.schemas['AuditLogV2ResponseDto.Client'].properties.accessTokenId"
    update:
      type: integer
      format: int64
      description: "Access token numeric identifier used for authentication."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Client'].properties.ip"
    update:
      type: string
      description: "Client IP address from which the request originated."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Client'].properties.userAgent"
    update:
      type: string
      description: "Client user agent string identifying the browser or API client."

  # ---- AUDIT LOG V2 TARGET ----

  - target: "$.components.schemas['AuditLogV2ResponseDto.Target'].properties.context"
    update:
      description: "Execution context for the audited action (e.g., `User`, `Organization`, `Workspace`, `System`)."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Target'].properties.id"
    update:
      type: string
      description: "Target resource unique identifier."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Target'].properties.name"
    update:
      type: string
      description: "Target resource name."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Target'].properties.organization"
    update:
      description: "Organization associated with the target resource."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Target'].properties.state"
    update:
      description: "Pre and post change state images for the target resource. Populated when `state` is included in the `attributes` parameter."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Target'].properties.type"
    update:
      type: string
      description: "Target resource type (e.g., `workflow`, `credentials`, `compute_env`)."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Target'].properties.user"
    update:
      description: "User associated with the target resource."

  - target: "$.components.schemas['AuditLogV2ResponseDto.Target'].properties.workspace"
    update:
      description: "Workspace associated with the target resource."

  # ---- AUDIT LOG V2 RESOURCE ORGANIZATION ----

  - target: "$.components.schemas['AuditLogV2ResponseDto.ResourceOrganization'].properties.id"
    update:
      type: integer
      format: int64
      description: "Organization numeric identifier."

  - target: "$.components.schemas['AuditLogV2ResponseDto.ResourceOrganization'].properties.name"
    update:
      type: string
      description: "Organization name."

  # ---- AUDIT LOG V2 RESOURCE USER ----

  - target: "$.components.schemas['AuditLogV2ResponseDto.ResourceUser'].properties.id"
    update:
      type: integer
      format: int64
      description: "User numeric identifier."

  - target: "$.components.schemas['AuditLogV2ResponseDto.ResourceUser'].properties.name"
    update:
      type: string
      description: "Username."

  # ---- AUDIT LOG V2 RESOURCE WORKSPACE ----

  - target: "$.components.schemas['AuditLogV2ResponseDto.ResourceWorkspace'].properties.id"
    update:
      type: integer
      format: int64
      description: "Workspace numeric identifier."

  - target: "$.components.schemas['AuditLogV2ResponseDto.ResourceWorkspace'].properties.name"
    update:
      type: string
      description: "Workspace name."

  # ---- LIST AUDIT LOG V2 RESPONSE ----

  - target: "$.components.schemas.ListAuditLogV2Response.properties.auditLogs"
    update:
      type: array
      description: "Array of audit log entries for the current page."

  - target: "$.components.schemas.ListAuditLogV2Response.properties.nextPageToken"
    update:
      type: string
      description: "Token for retrieving the next page of results. Absent when no more pages are available."

  # ---- AUDIT LOG TARGET STATE ----

  - target: "$.components.schemas.AuditLogTargetState.properties.metadata"
    update:
      description: "Metadata about the state capture including availability status for pre/post images."

  - target: "$.components.schemas.AuditLogTargetState.properties.newState"
    update:
      description: "Resource state after the audited change. Can be `null` if the resource was deleted or state capture was unavailable."

  - target: "$.components.schemas.AuditLogTargetState.properties.previousState"
    update:
      description: "Resource state before the audited change. Can be `null` if the resource was newly created or state capture was unavailable."

  # ---- AUDIT LOG TARGET STATE METADATA ----

  - target: "$.components.schemas.AuditLogTargetStateMetadata.properties.contentRequested"
    update:
      type: boolean
      description: "Whether state content was requested via the `attributes` parameter."

  - target: "$.components.schemas.AuditLogTargetStateMetadata.properties.postStateStatus"
    update:
      description: "Availability status of the post-change state image."

  - target: "$.components.schemas.AuditLogTargetStateMetadata.properties.preStateStatus"
    update:
      description: "Availability status of the pre-change state image."

  # ---- AUDIT LOG V2 QUERY ATTRIBUTE ----

  - target: "$.components.schemas.AuditLogV2QueryAttribute"
    update:
      type: string
      enum: ["state"]
      description: "Query attribute for including additional data. Accepts `state` to include pre/post change images."

  # ---- ENTITY CONTEXT ----

  - target: "$.components.schemas.EntityContext"
    update:
      type: string
      enum: ["User", "Organization", "Workspace", "System"]
      description: "Execution context for operations. Accepts `User`, `Organization`, `Workspace`, or `System`."

  # ---- AUDIT EVENT TYPE ----

  - target: "$.components.schemas.AuditEventType"
    update:
      type: string
      description: "Type of audited event. See Platform documentation for the complete list of event types and their meanings."
```

## Agents Overlays

```yaml
# agents-operations-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Agents operations overlay
  version: 0.0.0
actions:
  # ===== AGENTS - OPERATIONS =====

  # ---- LIST AGENTS ----

  - target: "$.paths['/agents'].get.summary"
    update: "List agents"

  - target: "$.paths['/agents'].get.description"
    update: "Lists all non-deleted agents in a workspace context. Returns agent metadata including status, template configuration, and usage details."

  # ---- CREATE AGENT ----

  - target: "$.paths['/agents'].post.summary"
    update: "Create agent"

  - target: "$.paths['/agents'].post.description"
    update: "Creates a new agent in the specified workspace. Agents provide AI-powered assistance for workflow development and optimization."

  # ---- DESCRIBE AGENT ----

  - target: "$.paths['/agents/{agentId}'].get.summary"
    update: "Get agent details"

  - target: "$.paths['/agents/{agentId}'].get.description"
    update: "Retrieves detailed information for the specified agent including configuration, status, and associated templates."

  # ---- UPDATE AGENT ----

  - target: "$.paths['/agents/{agentId}'].put.summary"
    update: "Update agent"

  - target: "$.paths['/agents/{agentId}'].put.description"
    update: "Updates the specified agent with the provided values. Only supplied fields are modified."

  # ---- DELETE AGENT ----

  - target: "$.paths['/agents/{agentId}'].delete.summary"
    update: "Delete agent"

  - target: "$.paths['/agents/{agentId}'].delete.description"
    update: "Tombstones the specified agent. The agent is marked as deleted but not permanently removed from the database."

  # ---- ENABLE AGENT ----

  - target: "$.paths['/agents/{agentId}/enable'].post.summary"
    update: "Enable agent"

  - target: "$.paths['/agents/{agentId}/enable'].post.description"
    update: "Marks an inactive agent as active, allowing it to be used for AI-powered assistance."

  # ---- DISABLE AGENT ----

  - target: "$.paths['/agents/{agentId}/disable'].post.summary"
    update: "Disable agent"

  - target: "$.paths['/agents/{agentId}/disable'].post.description"
    update: "Marks an active agent as inactive, preventing it from being used until re-enabled."
```

```yaml
# agents-parameters-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Agents parameters overlay
  version: 0.0.0
actions:
  # ===== AGENTS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====

  # ---- PATH PARAMETERS ----

  - target: "$.paths['/agents/{agentId}'].get.parameters[?(@.name=='agentId')].description"
    update: "Agent string identifier."

  - target: "$.paths['/agents/{agentId}'].put.parameters[?(@.name=='agentId')].description"
    update: "Agent string identifier."

  - target: "$.paths['/agents/{agentId}'].delete.parameters[?(@.name=='agentId')].description"
    update: "Agent string identifier."

  - target: "$.paths['/agents/{agentId}/enable'].post.parameters[?(@.name=='agentId')].description"
    update: "Agent string identifier."

  - target: "$.paths['/agents/{agentId}/disable'].post.parameters[?(@.name=='agentId')].description"
    update: "Agent string identifier."

  # ---- QUERY PARAMETERS ----

  - target: "$.paths['/agents'].get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths['/agents'].get.parameters[?(@.name=='search')].description"
    update: "Free-text search filter to match against agent name."

  - target: "$.paths['/agents'].get.parameters[?(@.name=='max')].description"
    update: "Maximum number of results to return. Default: `20`."

  - target: "$.paths['/agents'].get.parameters[?(@.name=='offset')].description"
    update: "Number of results to skip for pagination. Default: `0`."

  - target: "$.paths['/agents'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths['/agents/{agentId}'].get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths['/agents/{agentId}'].put.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths['/agents/{agentId}'].delete.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths['/agents/{agentId}/enable'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths['/agents/{agentId}/disable'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  # ---- REQUEST BODY DESCRIPTIONS ----

  - target: "$.paths['/agents'].post.requestBody.description"
    update: "Agent create request"

  - target: "$.paths['/agents/{agentId}'].put.requestBody.description"
    update: "Agent update request"
```

```yaml
# agents-schemas-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Agents schemas overlay
  version: 0.0.0
actions:
  # ===== AGENTS SCHEMAS - REQUEST/RESPONSE OBJECTS =====

  # ---- AGENT DB DTO ----

  - target: "$.components.schemas.AgentDbDto.properties.createdBy"
    update:
      type: integer
      format: int64
      description: "User numeric identifier who created this agent."

  - target: "$.components.schemas.AgentDbDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the agent was created."

  - target: "$.components.schemas.AgentDbDto.properties.description"
    update:
      type: string
      nullable: true
      description: "Optional agent description. Can be `null`."

  - target: "$.components.schemas.AgentDbDto.properties.id"
    update:
      type: string
      description: "Agent unique identifier."

  - target: "$.components.schemas.AgentDbDto.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the agent was last modified."

  - target: "$.components.schemas.AgentDbDto.properties.name"
    update:
      type: string
      description: "Agent name. Maximum 255 characters."

  - target: "$.components.schemas.AgentDbDto.properties.status"
    update:
      description: "Agent status. Accepts `active`, `inactive`, or `deleted`."

  - target: "$.components.schemas.AgentDbDto.properties.systemPrompt"
    update:
      type: string
      description: "System prompt that defines the agent's behavior and personality."

  - target: "$.components.schemas.AgentDbDto.properties.templateId"
    update:
      type: string
      nullable: true
      description: "Template identifier this agent is based on. Can be `null` for custom agents."

  - target: "$.components.schemas.AgentDbDto.properties.updatedBy"
    update:
      type: integer
      format: int64
      description: "User numeric identifier who last modified this agent."

  - target: "$.components.schemas.AgentDbDto.properties.workspaceId"
    update:
      type: integer
      format: int64
      description: "Workspace numeric identifier where this agent exists."

  # ---- AGENT STATUS ENUM ----

  - target: "$.components.schemas['Agent.Status']"
    update:
      type: string
      enum: ["active", "inactive", "deleted"]
      description: "Agent status. Accepts `active` (available for use), `inactive` (temporarily disabled), or `deleted` (tombstoned)."

  # ---- CREATE AGENT REQUEST ----

  - target: "$.components.schemas.CreateAgentRequest.properties.description"
    update:
      type: string
      nullable: true
      description: "Optional agent description. Can be `null`."

  - target: "$.components.schemas.CreateAgentRequest.properties.name"
    update:
      type: string
      description: "Agent name. Maximum 255 characters."

  - target: "$.components.schemas.CreateAgentRequest.properties.systemPrompt"
    update:
      type: string
      description: "System prompt defining the agent's behavior and personality. Maximum 4096 characters."

  - target: "$.components.schemas.CreateAgentRequest.properties.templateId"
    update:
      type: string
      nullable: true
      description: "Optional template identifier to base this agent on. Can be `null` for custom agents."

  # ---- CREATE AGENT RESPONSE ----

  - target: "$.components.schemas.CreateAgentResponse.properties.agent"
    update:
      description: "Created agent details including assigned identifier and timestamps."

  # ---- UPDATE AGENT REQUEST ----

  - target: "$.components.schemas.UpdateAgentRequest.properties.description"
    update:
      type: string
      nullable: true
      description: "Optional agent description. Can be `null`."

  - target: "$.components.schemas.UpdateAgentRequest.properties.name"
    update:
      type: string
      description: "Agent name. Maximum 255 characters."

  - target: "$.components.schemas.UpdateAgentRequest.properties.systemPrompt"
    update:
      type: string
      description: "System prompt defining the agent's behavior and personality. Maximum 4096 characters."

  - target: "$.components.schemas.UpdateAgentRequest.properties.templateId"
    update:
      type: string
      nullable: true
      description: "Optional template identifier to base this agent on. Can be `null` for custom agents."

  # ---- UPDATE AGENT RESPONSE ----

  - target: "$.components.schemas.UpdateAgentResponse.properties.agent"
    update:
      description: "Updated agent details including modified fields and new timestamps."

  # ---- DESCRIBE AGENT RESPONSE ----

  - target: "$.components.schemas.DescribeAgentResponse.properties.agent"
    update:
      description: "Agent details including configuration, status, and metadata."

  # ---- LIST AGENTS RESPONSE ----

  - target: "$.components.schemas.ListAgentsResponse.properties.agents"
    update:
      type: array
      description: "Array of agent objects matching the query criteria."

  - target: "$.components.schemas.ListAgentsResponse.properties.totalSize"
    update:
      type: integer
      format: int64
      description: "Total number of agents matching the query, ignoring pagination."
```

## Organizations Overlays (IdP Groups & SCIM)

```yaml
# orgs-operations-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Organizations operations overlay
  version: 0.0.0
actions:
  # ===== ORGANIZATIONS - OPERATIONS =====

  # ---- LIST IDP GROUPS ----

  - target: "$.paths['/orgs/{orgId}/idp-groups'].get.summary"
    update: "List IdP groups"

  - target: "$.paths['/orgs/{orgId}/idp-groups'].get.description"
    update: "Lists all identity provider (IdP) groups in the organization catalog. Includes both SCIM-pushed groups and manually-entered groups. Requires SSO or SCIM to be enabled for the organization."

  # ---- CREATE IDP GROUP ----

  - target: "$.paths['/orgs/{orgId}/idp-groups'].post.summary"
    update: "Create IdP group"

  - target: "$.paths['/orgs/{orgId}/idp-groups'].post.description"
    update: "Manually adds an identity provider group to the organization catalog. The group display name must exactly match the claim value sent by the IdP in the groups claim."

  # ---- DELETE IDP GROUP ----

  - target: "$.paths['/orgs/{orgId}/idp-groups/{groupId}'].delete.summary"
    update: "Delete IdP group"

  - target: "$.paths['/orgs/{orgId}/idp-groups/{groupId}'].delete.description"
    update: "Removes a manually-entered IdP group from the organization catalog. SCIM-managed groups cannot be deleted via this endpoint and must be removed through the SCIM provider."

  # ---- DESCRIBE SCIM CONFIG ----

  - target: "$.paths['/orgs/{orgId}/scim/config'].get.summary"
    update: "Get SCIM configuration"

  - target: "$.paths['/orgs/{orgId}/scim/config'].get.description"
    update: "Retrieves the SCIM configuration for the organization including endpoint URL, active token status, and group synchronization statistics. Accessible to all organization members with read permissions."

  # ---- CREATE SCIM TOKEN ----

  - target: "$.paths['/orgs/{orgId}/scim/token'].post.summary"
    update: "Generate SCIM token"

  - target: "$.paths['/orgs/{orgId}/scim/token'].post.description"
    update: "Generates a new SCIM bearer token for the organization. If an active token already exists it is automatically revoked first. The plaintext token value is returned only once in the response."

  # ---- REVOKE SCIM TOKEN ----

  - target: "$.paths['/orgs/{orgId}/scim/token'].delete.summary"
    update: "Revoke SCIM token"

  - target: "$.paths['/orgs/{orgId}/scim/token'].delete.description"
    update: "Revokes the currently active SCIM bearer token for the organization. This immediately disables SCIM synchronization until a new token is generated."

  # ---- ROTATE SCIM TOKEN ----

  - target: "$.paths['/orgs/{orgId}/scim/token/rotate'].post.summary"
    update: "Rotate SCIM token"

  - target: "$.paths['/orgs/{orgId}/scim/token/rotate'].post.description"
    update: "Revokes the current SCIM token and generates a new one in a single operation. The new plaintext token value is returned only once in the response."
```

```yaml
# orgs-parameters-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Organizations parameters overlay
  version: 0.0.0
actions:
  # ===== ORGANIZATIONS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====

  # ---- PATH PARAMETERS ----

  - target: "$.paths['/orgs/{orgId}/idp-groups'].get.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."

  - target: "$.paths['/orgs/{orgId}/idp-groups'].post.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."

  - target: "$.paths['/orgs/{orgId}/idp-groups/{groupId}'].delete.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."

  - target: "$.paths['/orgs/{orgId}/idp-groups/{groupId}'].delete.parameters[?(@.name=='groupId')].description"
    update: "IdP group numeric identifier."

  - target: "$.paths['/orgs/{orgId}/scim/config'].get.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."

  - target: "$.paths['/orgs/{orgId}/scim/token'].post.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."

  - target: "$.paths['/orgs/{orgId}/scim/token'].delete.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."

  - target: "$.paths['/orgs/{orgId}/scim/token/rotate'].post.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."

  # ---- REQUEST BODY DESCRIPTIONS ----

  - target: "$.paths['/orgs/{orgId}/idp-groups'].post.requestBody.description"
    update: "IdP group create request"
```

```yaml
# orgs-schemas-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Organizations schemas overlay
  version: 0.0.0
actions:
  # ===== ORGANIZATIONS SCHEMAS - REQUEST/RESPONSE OBJECTS =====

  # ---- IDP GROUP ENTRY ----

  - target: "$.components.schemas.IdpGroupEntry.properties.displayName"
    update:
      type: string
      description: "IdP group display name as it appears in the identity provider."

  - target: "$.components.schemas.IdpGroupEntry.properties.id"
    update:
      type: integer
      format: int64
      description: "IdP group numeric identifier."

  - target: "$.components.schemas.IdpGroupEntry.properties.source"
    update:
      description: "Source of the IdP group entry. Accepts `SCIM` for groups pushed via SCIM API or `MANUAL` for manually-entered groups."

  # ---- CREATE IDP GROUP REQUEST ----

  - target: "$.components.schemas.CreateIdpGroupRequest.properties.displayName"
    update:
      type: string
      description: "IdP group display name. Must exactly match the claim value sent by the IdP in the groups claim."

  # ---- LIST IDP GROUPS RESPONSE ----

  - target: "$.components.schemas.ListIdpGroupsResponse.properties.groups"
    update:
      type: array
      description: "Array of IdP group entries in the organization catalog."

  # ---- ORG IDP GROUP SOURCE ENUM ----

  - target: "$.components.schemas.OrgIdpGroupSource"
    update:
      type: string
      enum: ["SCIM", "MANUAL"]
      description: "Source of the IdP group entry. Accepts `SCIM` for groups synchronized via SCIM API or `MANUAL` for groups added manually by administrators."

  # ---- DESCRIBE SCIM CONFIG RESPONSE ----

  - target: "$.components.schemas.DescribeScimConfigResponse.properties.endpointUrl"
    update:
      type: string
      description: "SCIM endpoint URL to configure in the identity provider."

  - target: "$.components.schemas.DescribeScimConfigResponse.properties.groupCount"
    update:
      type: integer
      format: int32
      description: "Number of IdP groups currently synchronized via SCIM."

  - target: "$.components.schemas.DescribeScimConfigResponse.properties.hasActiveToken"
    update:
      type: boolean
      description: "Whether an active SCIM bearer token exists for this organization."

  - target: "$.components.schemas.DescribeScimConfigResponse.properties.maskedToken"
    update:
      type: string
      nullable: true
      description: "Masked SCIM token value showing only the last four characters. Can be `null` if no active token exists."

  - target: "$.components.schemas.DescribeScimConfigResponse.properties.ssoActive"
    update:
      type: boolean
      description: "Whether SSO is currently enabled for this organization."

  - target: "$.components.schemas.DescribeScimConfigResponse.properties.tokenCreatedAt"
    update:
      type: string
      format: date-time
      nullable: true
      description: "Timestamp when the current SCIM token was created. Can be `null` if no active token exists."

  - target: "$.components.schemas.DescribeScimConfigResponse.properties.tokenLastUsed"
    update:
      type: string
      format: date-time
      nullable: true
      description: "Timestamp when the SCIM token was last used for synchronization. Can be `null` if never used or no active token exists."

  # ---- CREATE SCIM TOKEN RESPONSE ----

  - target: "$.components.schemas.CreateScimTokenResponse.properties.endpointUrl"
    update:
      type: string
      description: "SCIM endpoint URL to configure in the identity provider."

  - target: "$.components.schemas.CreateScimTokenResponse.properties.maskedToken"
    update:
      type: string
      description: "Masked token value showing only the last four characters for display purposes."

  - target: "$.components.schemas.CreateScimTokenResponse.properties.token"
    update:
      type: string
      description: "Plaintext SCIM bearer token. This value is only returned once and cannot be retrieved again. Store securely in the identity provider."

  # ---- IDP GROUP IMAGE ----

  - target: "$.components.schemas.IdpGroupImage.properties.auditImageType"
    update:
      description: "Audit image type discriminator. Always `idp_group` for IdP group resources."

  - target: "$.components.schemas.IdpGroupImage.properties.displayName"
    update:
      type: string
      description: "IdP group display name."

  - target: "$.components.schemas.IdpGroupImage.properties.scimExternalId"
    update:
      type: string
      description: "External identifier assigned by the SCIM provider."

  - target: "$.components.schemas.IdpGroupImage.properties.source"
    update:
      description: "Source of this IdP group entry."

  # ---- ORGANIZATION IMAGE ----

  - target: "$.components.schemas.OrganizationImage.properties.auditImageType"
    update:
      description: "Audit image type discriminator. Always `organization` for organization resources."

  - target: "$.components.schemas.OrganizationImage.properties.description"
    update:
      type: string
      description: "Organization description."

  - target: "$.components.schemas.OrganizationImage.properties.fullName"
    update:
      type: string
      description: "Organization full name."

  - target: "$.components.schemas.OrganizationImage.properties.location"
    update:
      type: string
      description: "Organization location or headquarters."

  - target: "$.components.schemas.OrganizationImage.properties.logoId"
    update:
      type: string
      description: "Organization logo image identifier."

  - target: "$.components.schemas.OrganizationImage.properties.name"
    update:
      type: string
      description: "Organization short name."

  - target: "$.components.schemas.OrganizationImage.properties.type"
    update:
      description: "Organization type."

  - target: "$.components.schemas.OrganizationImage.properties.website"
    update:
      type: string
      description: "Organization website URL."

  # ---- ORG SSO CONNECTION IMAGE ----

  - target: "$.components.schemas.OrgSsoConnectionImage.properties.auditImageType"
    update:
      description: "Audit image type discriminator. Always `org_sso_connection` for SSO connection resources."

  - target: "$.components.schemas.OrgSsoConnectionImage.properties.auth0OrgId"
    update:
      type: string
      description: "Auth0 organization identifier."

  - target: "$.components.schemas.OrgSsoConnectionImage.properties.connectionId"
    update:
      type: string
      description: "SSO connection unique identifier."

  - target: "$.components.schemas.OrgSsoConnectionImage.properties.connectionName"
    update:
      type: string
      description: "SSO connection name."

  - target: "$.components.schemas.OrgSsoConnectionImage.properties.createdAt"
    update:
      type: string
      format: date-time
      description: "Timestamp when the SSO connection was created."

  - target: "$.components.schemas.OrgSsoConnectionImage.properties.createdById"
    update:
      type: integer
      format: int64
      description: "User numeric identifier who created this SSO connection."

  - target: "$.components.schemas.OrgSsoConnectionImage.properties.domain"
    update:
      type: string
      description: "Domain associated with this SSO connection."

  - target: "$.components.schemas.OrgSsoConnectionImage.properties.status"
    update:
      type: string
      description: "SSO connection status."

  - target: "$.components.schemas.OrgSsoConnectionImage.properties.ticketUrl"
    update:
      type: string
      description: "Support ticket URL for SSO connection issues."
```

## Compute Environments Overlays

```yaml
# compute-envs-operations-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Compute environments operations overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS - OPERATIONS =====

  # ---- VALIDATE COMPUTE ENVIRONMENT ----

  - target: "$.paths['/compute-envs/{computeEnvId}/validate'].post.summary"
    update: "Validate compute environment"

  - target: "$.paths['/compute-envs/{computeEnvId}/validate'].post.description"
    update: "Re-runs pre-flight validation checks for the specified compute environment including credential validation and work directory accessibility. Updates the compute environment status based on the validation outcome. Use `force=true` to override INVALID status without running checks (requires associated credential to be AVAILABLE)."
```

```yaml
# compute-envs-parameters-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Compute environments parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====

  # ---- PATH PARAMETERS ----

  - target: "$.paths['/compute-envs/{computeEnvId}/validate'].post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."

  # ---- QUERY PARAMETERS ----

  - target: "$.paths['/compute-envs/{computeEnvId}/validate'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths['/compute-envs/{computeEnvId}/validate'].post.parameters[?(@.name=='force')].description"
    update: "When `true`, skip validation checks and force the compute environment from INVALID to AVAILABLE status. Only allowed when the associated credential status is AVAILABLE. Default: `false`."

  # ---- DELETE FORCE PARAMETER ----

  - target: "$.paths['/compute-envs/{computeEnvId}'].delete.parameters[?(@.name=='force')].description"
    update: "When `true`, force-delete a stuck compute environment bypassing active-job checks. Only allowed for compute environments in ERRORED, INVALID, or DELETING status. Default: `false`."
```

```yaml
# compute-envs-schemas-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS - REQUEST/RESPONSE OBJECTS =====

  # ---- VALIDATE COMPUTE ENV RESPONSE ----

  - target: "$.components.schemas.ValidateComputeEnvResponse.properties.message"
    update:
      type: string
      nullable: true
      description: "Human-readable explanation of the validation outcome. Contains the failure reason when status is INVALID, provider-unreachable details on transient errors, or `null` when status is AVAILABLE."

  - target: "$.components.schemas.ValidateComputeEnvResponse.properties.status"
    update:
      description: "Compute environment status after validation. Accepts `AVAILABLE` when all checks passed or `INVALID` when a check failed. On transient errors this reflects the unchanged prior status."

  - target: "$.components.schemas.ValidateComputeEnvResponse.properties.transientError"
    update:
      type: boolean
      description: "Whether the validation encountered a transient error (network timeout, throttling, or 5xx response). When `true`, the persisted status remains unchanged and validation should be retried later."

  # ---- COMPUTE ENV IMAGE ----

  - target: "$.components.schemas.ComputeEnvImage.properties.auditImageType"
    update:
      description: "Audit image type discriminator. Always `compute_env` for compute environment resources."

  - target: "$.components.schemas.ComputeEnvImage.properties.config"
    update:
      description: "Platform-specific compute configuration details."

  - target: "$.components.schemas.ComputeEnvImage.properties.credentialsId"
    update:
      type: string
      description: "Credentials identifier associated with this compute environment."

  - target: "$.components.schemas.ComputeEnvImage.properties.description"
    update:
      type: string
      description: "Compute environment description."

  - target: "$.components.schemas.ComputeEnvImage.properties.fusionMetricsCollectionEnabled"
    update:
      type: boolean
      description: "Whether Fusion metrics collection is enabled for this compute environment."

  - target: "$.components.schemas.ComputeEnvImage.properties.lastUsed"
    update:
      type: string
      format: date-time
      description: "Timestamp when this compute environment was last used to launch a workflow."

  - target: "$.components.schemas.ComputeEnvImage.properties.managedIdentityId"
    update:
      type: integer
      format: int64
      description: "Managed identity numeric identifier associated with this compute environment."

  - target: "$.components.schemas.ComputeEnvImage.properties.message"
    update:
      type: string
      description: "Status message providing additional context about the compute environment state."

  - target: "$.components.schemas.ComputeEnvImage.properties.name"
    update:
      type: string
      description: "Compute environment name."

  - target: "$.components.schemas.ComputeEnvImage.properties.platform"
    update:
      type: string
      description: "Cloud platform for this compute environment (e.g., `aws-batch`, `azure-batch`, `google-batch`)."

  - target: "$.components.schemas.ComputeEnvImage.properties.primary"
    update:
      type: boolean
      description: "Whether this is the primary compute environment for the workspace."

  - target: "$.components.schemas.ComputeEnvImage.properties.status"
    update:
      type: string
      description: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `DISABLED`, `DELETING`, `ERRORED`, `INVALID`, or `DELETED`."
```

## Credentials Overlays

```yaml
# credentials-operations-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Credentials operations overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS - OPERATIONS =====

  # ---- VALIDATE CREDENTIALS ----

  - target: "$.paths['/credentials/{credentialsId}/validate'].post.summary"
    update: "Validate credentials"

  - target: "$.paths['/credentials/{credentialsId}/validate'].post.description"
    update: "Validates credentials against their cloud provider and updates the credential status based on the outcome. Returns validation results including status, error messages, and whether the error was transient. Use `force=true` to override INVALID status without running provider validation."
```

```yaml
# credentials-parameters-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Credentials parameters overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====

  # ---- PATH PARAMETERS ----

  - target: "$.paths['/credentials/{credentialsId}/validate'].post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."

  # ---- QUERY PARAMETERS ----

  - target: "$.paths['/credentials/{credentialsId}/validate'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths['/credentials/{credentialsId}/validate'].post.parameters[?(@.name=='force')].description"
    update: "When `true`, skip provider validation and force the credential from INVALID to AVAILABLE status. Only allowed for credentials currently in INVALID status. Default: `false`."
```

```yaml
# credentials-schemas-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS SCHEMAS - REQUEST/RESPONSE OBJECTS =====

  # ---- CREDENTIALS STATUS ENUM ----

  - target: "$.components.schemas['Credentials.Status']"
    update:
      type: string
      enum: ["AVAILABLE", "INVALID"]
      description: "Credential validation status. Accepts `AVAILABLE` when the last validation succeeded or `INVALID` when authoritatively rejected by the provider."

  # ---- VALIDATE CREDENTIALS RESPONSE ----

  - target: "$.components.schemas.ValidateCredentialsResponse.properties.message"
    update:
      type: string
      nullable: true
      description: "Provider-supplied error detail. Contains failure reason when status is INVALID or `null` when credentials are valid."

  - target: "$.components.schemas.ValidateCredentialsResponse.properties.status"
    update:
      description: "Credential status after validation. Accepts `AVAILABLE` when validation succeeded or `INVALID` when authoritatively rejected. On transient errors this reflects the unchanged persisted status."

  - target: "$.components.schemas.ValidateCredentialsResponse.properties.transientError"
    update:
      type: boolean
      description: "Whether validation could not reach the provider (network error or 5xx response). When `true`, the persisted status is unchanged and must not be interpreted as authoritative rejection."

  # ---- CREDENTIALS IMAGE ----

  - target: "$.components.schemas.CredentialsImage.properties.auditImageType"
    update:
      description: "Audit image type discriminator. Always `credentials` for credential resources."

  - target: "$.components.schemas.CredentialsImage.properties.baseUrl"
    update:
      type: string
      description: "Base URL for the credentials endpoint."

  - target: "$.components.schemas.CredentialsImage.properties.category"
    update:
      type: string
      description: "Credentials category (e.g., `cloud`, `git`, `container`)."

  - target: "$.components.schemas.CredentialsImage.properties.description"
    update:
      type: string
      description: "Credentials description."

  - target: "$.components.schemas.CredentialsImage.properties.keys"
    update:
      description: "Security keys and authentication details for these credentials."

  - target: "$.components.schemas.CredentialsImage.properties.lastUsed"
    update:
      type: string
      format: date-time
      description: "Timestamp when these credentials were last used."

  - target: "$.components.schemas.CredentialsImage.properties.message"
    update:
      type: string
      description: "Provider error message captured when status is INVALID. Cleared when status returns to AVAILABLE."

  - target: "$.components.schemas.CredentialsImage.properties.name"
    update:
      type: string
      description: "Credentials name."

  - target: "$.components.schemas.CredentialsImage.properties.provider"
    update:
      type: string
      description: "Cloud provider or service for these credentials (e.g., `aws`, `azure`, `google`, `github`)."

  - target: "$.components.schemas.CredentialsImage.properties.status"
    update:
      type: string
      description: "Credential validation status. Accepts `AVAILABLE` or `INVALID`."

  # ---- MANAGED CREDENTIALS IMAGE ----

  - target: "$.components.schemas.ManagedCredentialsImage.properties.auditImageType"
    update:
      description: "Audit image type discriminator. Always `managed_credentials` for managed credential resources."

  - target: "$.components.schemas.ManagedCredentialsImage.properties.credentialsId"
    update:
      type: string
      description: "Associated credentials identifier."

  - target: "$.components.schemas.ManagedCredentialsImage.properties.managedIdentityId"
    update:
      type: integer
      format: int64
      description: "Associated managed identity numeric identifier."

  - target: "$.components.schemas.ManagedCredentialsImage.properties.memberId"
    update:
      type: integer
      format: int64
      description: "Organization member numeric identifier."

  - target: "$.components.schemas.ManagedCredentialsImage.properties.metadata"
    update:
      description: "Additional metadata for managed credentials configuration."
```

## Data Studios Overlays

```yaml
# studios-operations-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Data Studios operations overlay
  version: 0.0.0
actions:
  # ===== DATA STUDIOS - OPERATIONS =====

  # ---- LIST COMPATIBLE COMPUTE ENVIRONMENTS ----

  - target: "$.paths['/studios/{sessionId}/compatible-ce'].get.summary"
    update: "List compatible compute environments"

  - target: "$.paths['/studios/{sessionId}/compatible-ce'].get.description"
    update: "Lists compute environments in the same workspace that are compatible with the specified Studio session. Compatible compute environments share the same platform type and configuration as the Studio's current compute environment."
```

```yaml
# studios-parameters-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Data Studios parameters overlay
  version: 0.0.0
actions:
  # ===== DATA STUDIOS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====

  # ---- PATH PARAMETERS ----

  - target: "$.paths['/studios/{sessionId}/compatible-ce'].get.parameters[?(@.name=='sessionId')].description"
    update: "Studio session string identifier."

  # ---- QUERY PARAMETERS ----

  - target: "$.paths['/studios/{sessionId}/compatible-ce'].get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths['/studios/{sessionId}/compatible-ce'].get.parameters[?(@.name=='attributes')].description"
    update: "Additional attribute values to include in the response. Accepts `labels` for label assignments and `resources` for resource allocation details."
```

```yaml
# studios-schemas-overlay-1.181.0.yaml
overlay: 1.0.0
info:
  title: Data Studios schemas overlay
  version: 0.0.0
actions:
  # ===== DATA STUDIOS SCHEMAS - REQUEST/RESPONSE OBJECTS =====

  # ---- DATA STUDIO IMAGE ----

  - target: "$.components.schemas.DataStudioImage.properties.auditImageType"
    update:
      description: "Audit image type discriminator. Always `data_studio` for Data Studio resources."

  - target: "$.components.schemas.DataStudioImage.properties.appliedLifespanHours"
    update:
      type: integer
      format: int32
      description: "Lifespan hours actually applied to this Studio session."

  - target: "$.components.schemas.DataStudioImage.properties.baseImage"
    update:
      type: string
      description: "Base container image for this Studio session."

  - target: "$.components.schemas.DataStudioImage.properties.computeEnvId"
    update:
      type: string
      description: "Compute environment identifier associated with this Studio."

  - target: "$.components.schemas.DataStudioImage.properties.condaEnvironment"
    update:
      type: string
      description: "Conda environment configuration for this Studio."

  - target: "$.components.schemas.DataStudioImage.properties.connectVersion"
    update:
      type: string
      description: "Version of the Studio Connect server."

  - target: "$.components.schemas.DataStudioImage.properties.description"
    update:
      type: string
      description: "Studio session description."

  - target: "$.components.schemas.DataStudioImage.properties.effectiveLifespanHours"
    update:
      type: integer
      format: int32
      description: "Effective lifespan hours for this session including any extensions."

  - target: "$.components.schemas.DataStudioImage.properties.environment"
    update:
      type: string
      description: "Environment variables configuration for this Studio."

  - target: "$.components.schemas.DataStudioImage.properties.initialCheckpointId"
    update:
      type: integer
      format: int64
      description: "Checkpoint numeric identifier used to initialize this session."

  - target: "$.components.schemas.DataStudioImage.properties.initialSessionId"
    update:
      type: string
      description: "Session identifier this Studio was forked from."

  - target: "$.components.schemas.DataStudioImage.properties.isPrivate"
    update:
      type: boolean
      description: "Whether this Studio session is private to the creator."

  - target: "$.components.schemas.DataStudioImage.properties.lastHeartbeat"
    update:
      type: string
      format: date-time
      description: "Timestamp of the last heartbeat received from this Studio."

  - target: "$.components.schemas.DataStudioImage.properties.lastStarted"
    update:
      type: string
      format: date-time
      description: "Timestamp when this Studio was last started."

  - target: "$.components.schemas.DataStudioImage.properties.name"
    update:
      type: string
      description: "Studio session name."

  - target: "$.components.schemas.DataStudioImage.properties.remoteConfigCloneEnabled"
    update:
      type: boolean
      description: "Whether remote configuration cloning is enabled."

  - target: "$.components.schemas.DataStudioImage.properties.remoteConfigClonePath"
    update:
      type: string
      description: "Path where remote configuration is cloned."

  - target: "$.components.schemas.DataStudioImage.properties.remoteConfigCommitHash"
    update:
      type: string
      description: "Git commit hash of the cloned remote configuration."

  - target: "$.components.schemas.DataStudioImage.properties.remoteConfigRepository"
    update:
      type: string
      description: "Git repository URL for remote configuration."

  - target: "$.components.schemas.DataStudioImage.properties.remoteConfigRevision"
    update:
      type: string
      description: "Git revision/branch of the remote configuration."

  - target
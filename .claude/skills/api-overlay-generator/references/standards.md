# Seqera API Documentation Standards

This document contains the complete style guide and conventions for Seqera Platform API documentation overlays.

## Core Principles

1. **Consistency is king**: Use identical descriptions for identical parameters across all endpoints
2. **Sentence case for summaries**: "List datasets" not "List Datasets"
3. **Full sentences for descriptions**: Always end with periods
4. **Verb-entity pattern for operations**: "Create workspace", "Update pipeline", "Delete credentials"

## Terminology Standards

### Required Terms

Use these exact terms consistently:

| Term | Use | Do NOT Use |
|------|-----|------------|
| data-links | ✅ | datalinks, data links |
| resource path | ✅ (for bucket URLs) | bucket path, bucket URL, URI |
| Array of | ✅ | List of |
| Workspace numeric identifier | ✅ (for workspaceId) | Workspace ID, workspace identifier |
| Organization numeric identifier | ✅ (for orgId) | Organization ID, org identifier |

### Cloud Provider Specific

- **Azure**: "Azure Blob Storage containers" (not just "containers")
- **Labels**: Distinguish between "simple labels" and "resource labels"

## Standard Parameter Descriptions

**CRITICAL**: These descriptions must be used EXACTLY as shown for consistency across all endpoints.

### Common Query Parameters

```yaml
# Workspace ID (query parameter)
workspaceId:
  description: "Workspace numeric identifier."

# Organization ID (query parameter)
orgId:
  description: "Organization numeric identifier."

# Maximum results
max:
  description: "Maximum number of results to return. Default: `20`."
  # Note: Adjust default value as appropriate

# Pagination offset
offset:
  description: "Number of results to skip for pagination. Default: `0`."

# Search filter
search:
  description: "Free-text search filter to match against {field names}."
  # Note: Specify which fields are searched

# Sort by
sortBy:
  description: "Field to sort results by. Accepts `{value1}`, `{value2}`, or `{value3}`. Default: `{value}`."
  # Note: List actual accepted values

# Sort direction
sortDir:
  description: "Sort direction for results. Accepts `asc` (ascending) or `desc` (descending). Default: `desc`."
```

### Common Path Parameters

```yaml
# Workspace ID (path parameter)
workspaceId:
  description: "Workspace numeric identifier."

# Resource IDs
{resource}Id:
  description: "{Resource} numeric identifier."
  # Examples: datasetId, pipelineId, credentialsId
```

## Operation Summary Standards

### Format

**Pattern**: `[Verb] [entity]`

**Rules**:
- Sentence case (first word capitalized)
- No period at end
- Use present tense verbs

### Common Verbs

- **List**: For GET endpoints returning multiple items
  - Example: "List datasets", "List workflows"

- **Get/Describe**: For GET endpoints returning single item
  - Example: "Get dataset details", "Describe workspace"

- **Create**: For POST endpoints creating resources
  - Example: "Create pipeline", "Create credentials"

- **Update**: For PUT/PATCH endpoints modifying resources
  - Example: "Update workflow", "Update team members"

- **Delete**: For DELETE endpoints removing resources
  - Example: "Delete dataset", "Delete credentials"

- **Add**: For POST endpoints adding to collections
  - Example: "Add labels to actions", "Add team member"

- **Remove**: For POST/DELETE endpoints removing from collections
  - Example: "Remove labels from pipelines", "Remove team member"

- **Validate**: For validation operations
  - Example: "Validate credential name"

- **Execute/Launch/Run**: For triggering operations
  - Example: "Launch workflow", "Execute pipeline"

- **Cancel/Stop**: For terminating operations
  - Example: "Cancel workflow", "Stop execution"

## Operation Description Standards

### Format

- Full sentences with periods
- Include context about scope (user vs workspace)
- Mention key constraints or requirements
- Reference related Platform documentation when helpful

### Patterns

```yaml
# List operations
description: "Lists all {resources} in a {scope} context. Append `?workspaceId` to list {resources} in a workspace context."

# Get operations
description: "Retrieves detailed information for the specified {resource}."

# Create operations
description: "Creates a new {resource}. Append `?workspaceId` to associate the {resource} with the given workspace."

# Update operations
description: "Updates the specified {resource} with the provided values. Only supplied fields are modified."

# Delete operations
description: "Permanently deletes the specified {resource}. This action cannot be undone."
```

### Deprecated Operations

For deprecated endpoints:

**Summary**:
```yaml
summary: "(Deprecated) {Original summary}"
```

**Description**:
```yaml
description: "**This endpoint is deprecated. See [New operation name](https://docs.seqera.io/platform-api/new-operation-slug) for the current endpoint.**\n\n{Original description of what this endpoint does.}"
```

## Schema Property Standards

### Format

- Full sentences with periods
- Include validation rules (max length, format, etc.)
- Note nullability explicitly
- Describe enum values clearly
- For nested objects, use "Array of" prefix

### Examples

```yaml
# String property with validation
name:
  type: string
  description: "Resource name. Maximum 255 characters."

# String property with format
email:
  type: string
  description: "User email address in valid email format."

# Enum property
status:
  type: string
  enum: ["active", "inactive", "pending"]
  description: "Resource status. Accepts `active`, `inactive`, or `pending`."

# Array property
labels:
  type: array
  items:
    type: string
  description: "Array of label identifiers associated with the resource."

# Nullable property
description:
  type: string
  nullable: true
  description: "Optional description of the resource. Can be `null`."

# Boolean with default
enabled:
  type: boolean
  description: "If true, the feature is enabled. Default: `false`."

# Integer with range
maxRetries:
  type: integer
  description: "Maximum number of retry attempts. Must be between 0 and 10. Default: `3`."
```

## Formatting Rules

### Backticks

Use backticks for:
- Code values: `workspaceId`, `true`, `false`, `null`
- Default values: "Default: `0`"
- Enum values: "Accepts `value1`, `value2`, or `value3`"
- Field names: `maxRetries`, `sortBy`

### Lists

For listing accepted values:
- Use "Accepts X, Y, or Z" (with Oxford comma)
- Example: "Accepts `asc`, `desc`, or `none`."

### Capitalization

- **Sentence case** for summaries (first word only)
- **US English** spelling throughout
- Proper nouns capitalized: Kubernetes, Nextflow, Docker

### Line Breaks

- Single period at end of sentences
- No multiple newlines in overlay descriptions
- For multi-paragraph descriptions, use `\n\n` sparingly

## Special Cases

### HPC Compute Configurations

Properties previously inherited from `AbstractGridConfig` now require explicit descriptions on each scheduler type:
- LSF
- Slurm
- Altair PBS
- Moab
- Univa

**Solution**: Duplicate property descriptions across all five scheduler configs in overlays.

### Discriminator Properties

When cleaning up schemas:
- Remove incorrect `readOnly` flags from discriminator properties
- Remove unnecessary `description` fields from discriminators
- Preserve the discriminator properties themselves (don't remove entirely)

### Request Body Descriptions

Keep concise and descriptive:

```yaml
requestBody:
  description: "{Resource} {action} request"
  # Examples:
  # - "Dataset create request"
  # - "Workflow launch request"
  # - "Credentials update request"
```

## Quality Checklist

Before finalizing overlays, verify:

- ✅ All summaries are sentence case (not title case)
- ✅ All summaries do NOT end with periods
- ✅ All descriptions END with periods
- ✅ Standard parameter descriptions match exactly
- ✅ Terminology is consistent (data-links, resource path, Array of)
- ✅ All defaults are specified in backticks
- ✅ All enum values are listed with backticks
- ✅ Deprecated endpoints have proper notices with links
- ✅ No "datalink", "bucket path", or "List of" terms used
- ✅ Workspace/org IDs use "numeric identifier" phrasing

## Reference Links

- **Google Developer Style Guide**: https://developers.google.com/style
- **OpenAPI Specification**: https://spec.openapis.org/oas/v3.1.0
- **US English** spelling conventions

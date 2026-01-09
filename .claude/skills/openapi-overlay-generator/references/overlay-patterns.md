# OpenAPI Overlay Patterns

This document provides templates and patterns for creating the three types of overlay files: operations, parameters, and schemas.

## Operations Overlay Template

**Filename**: `{feature}-operations-overlay-{version}.yaml`

```yaml
overlay: 1.0.0
info:
  title: {Feature} operations overlay
  version: 0.0.0
actions:
  # ===== {FEATURE} - OPERATIONS =====
  
  # ---- {OPERATION NAME} ----
  
  - target: "$.paths./{endpoint}.{method}.summary"
    update: "{Verb} {entity}"
  
  - target: "$.paths./{endpoint}.{method}.description"
    update: "{Full description with context and usage guidance.}"
```

### Common Operations Patterns

#### List Endpoint
```yaml
- target: "$.paths./datasets.get.summary"
  update: "List datasets"

- target: "$.paths./datasets.get.description"
  update: "Lists all datasets in a user context, enriched by `attributes`. Append `?workspaceId` to list datasets in a workspace context."
```

#### Get/Describe Endpoint
```yaml
- target: "$.paths./datasets/{datasetId}.get.summary"
  update: "Get dataset details"

- target: "$.paths./datasets/{datasetId}.get.description"
  update: "Retrieves detailed information for the specified dataset including metadata, contents, and associated resources."
```

#### Create Endpoint
```yaml
- target: "$.paths./datasets.post.summary"
  update: "Create dataset"

- target: "$.paths./datasets.post.description"
  update: "Creates a new dataset. Append `?workspaceId` to associate the dataset with the given workspace."
```

#### Update Endpoint
```yaml
- target: "$.paths./datasets/{datasetId}.put.summary"
  update: "Update dataset"

- target: "$.paths./datasets/{datasetId}.put.description"
  update: "Updates the specified dataset with the provided values. Only supplied fields are modified."
```

#### Delete Endpoint
```yaml
- target: "$.paths./datasets/{datasetId}.delete.summary"
  update: "Delete dataset"

- target: "$.paths./datasets/{datasetId}.delete.description"
  update: "Permanently deletes the specified dataset. This action cannot be undone."
```

#### Deprecated Endpoint
```yaml
- target: "$.paths./old-endpoint.get.summary"
  update: "(Deprecated) List items"

- target: "$.paths./old-endpoint.get.description"
  update: "**This endpoint is deprecated. See [New operation name](https://docs.seqera.io/platform-api/new-operation-slug) for the current endpoint.**\n\nOriginal description of what this endpoint does."
```

---

## Parameters Overlay Template

**Filename**: `{feature}-parameters-overlay-{version}.yaml`

```yaml
overlay: 1.0.0
info:
  title: {Feature} parameters overlay
  version: 0.0.0
actions:
  # ===== {FEATURE} PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- PATH PARAMETERS ----
  
  - target: "$.paths./{endpoint}.{method}.parameters[?(@.name=='{paramName}')].description"
    update: "{Parameter description.}"
  
  # ---- QUERY PARAMETERS ----
  
  - target: "$.paths./{endpoint}.{method}.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- REQUEST BODY DESCRIPTIONS ----
  
  - target: "$.paths./{endpoint}.{method}.requestBody.description"
    update: "{Request body description.}"
```

### Common Parameters Patterns

#### Standard Query Parameters
```yaml
# Workspace ID
- target: "$.paths./datasets.get.parameters[?(@.name=='workspaceId')].description"
  update: "Workspace numeric identifier."

# Max results
- target: "$.paths./datasets.get.parameters[?(@.name=='max')].description"
  update: "Maximum number of results to return. Default: `20`."

# Pagination offset
- target: "$.paths./datasets.get.parameters[?(@.name=='offset')].description"
  update: "Number of results to skip for pagination. Default: `0`."

# Search filter
- target: "$.paths./datasets.get.parameters[?(@.name=='search')].description"
  update: "Free-text search filter to match against dataset name and description."

# Sort field
- target: "$.paths./datasets.get.parameters[?(@.name=='sortBy')].description"
  update: "Field to sort results by. Accepts `name`, `createdAt`, or `lastModified`. Default: `createdAt`."

# Sort direction
- target: "$.paths./datasets.get.parameters[?(@.name=='sortDir')].description"
  update: "Sort direction for results. Accepts `asc` (ascending) or `desc` (descending). Default: `desc`."
```

#### Path Parameters
```yaml
# Resource ID
- target: "$.paths./datasets/{datasetId}.get.parameters[?(@.name=='datasetId')].description"
  update: "Dataset numeric identifier."

# Workspace ID (path)
- target: "$.paths./workspaces/{workspaceId}/datasets.get.parameters[?(@.name=='workspaceId')].description"
  update: "Workspace numeric identifier."
```

#### Request Body Descriptions
```yaml
# Create request
- target: "$.paths./datasets.post.requestBody.description"
  update: "Dataset create request"

# Update request
- target: "$.paths./datasets/{datasetId}.put.requestBody.description"
  update: "Dataset update request"
```

---

## Schemas Overlay Template

**Filename**: `{feature}-schemas-overlay-{version}.yaml`

```yaml
overlay: 1.0.0
info:
  title: {Feature} schemas overlay
  version: 0.0.0
actions:
  # ===== {FEATURE} SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- REQUEST SCHEMAS ----
  
  - target: "$.components.schemas.{SchemaName}.properties.{propertyName}"
    update:
      type: string
      description: "{Property description with validation rules.}"
  
  # ---- RESPONSE SCHEMAS ----
  
  - target: "$.components.schemas.{SchemaName}.properties.{propertyName}"
    update:
      description: "{Property description.}"
```

### Common Schema Patterns

#### String Property (with validation)
```yaml
- target: "$.components.schemas.DatasetRequest.properties.name"
  update:
    type: string
    description: "Dataset name. Maximum 255 characters."
```

#### String Property (with format)
```yaml
- target: "$.components.schemas.UserProfile.properties.email"
  update:
    type: string
    description: "User email address in valid email format."
```

#### String Property (with pattern)
```yaml
- target: "$.components.schemas.ComputeEnvRequest.properties.credentialsId"
  update:
    type: string
    description: "Credentials identifier in UUID format."
```

#### Enum Property
```yaml
- target: "$.components.schemas.WorkflowStatus.properties.status"
  update:
    type: string
    enum: ["SUBMITTED", "RUNNING", "SUCCEEDED", "FAILED", "CANCELLED"]
    description: "Workflow execution status. Accepts `SUBMITTED`, `RUNNING`, `SUCCEEDED`, `FAILED`, or `CANCELLED`."
```

#### Boolean Property (with default)
```yaml
- target: "$.components.schemas.PipelineConfig.properties.enabled"
  update:
    type: boolean
    description: "Whether the pipeline is enabled for execution. Default: `false`."
```

#### Integer Property (with range/default)
```yaml
- target: "$.components.schemas.RetryConfig.properties.maxRetries"
  update:
    type: integer
    description: "Maximum number of retry attempts. Must be between 0 and 10. Default: `3`."
```

#### Array Property
```yaml
- target: "$.components.schemas.DatasetResponse.properties.labels"
  update:
    type: array
    items:
      type: string
    description: "Array of label identifiers associated with the dataset."
```

#### Object Property
```yaml
- target: "$.components.schemas.WorkflowLaunchRequest.properties.params"
  update:
    type: object
    additionalProperties: true
    description: "Pipeline parameters as key-value pairs in JSON format."
```

#### Nullable Property
```yaml
- target: "$.components.schemas.DatasetRequest.properties.description"
  update:
    type: string
    nullable: true
    description: "Optional dataset description. Can be `null`."
```

#### Reference Property
```yaml
- target: "$.components.schemas.WorkflowResponse.properties.manifest"
  update:
    $ref: "#/components/schemas/WfManifest"
    description: "Workflow manifest containing metadata about the workflow execution."
```

---

## JSONPath Targeting Patterns

### Path Operations

```yaml
# Target specific endpoint method
$.paths./datasets.get.summary

# Target with path parameter
$.paths./datasets/{datasetId}.get.summary

# Target nested path
$.paths./workspaces/{workspaceId}/datasets.get.summary
```

### Parameters

```yaml
# Path parameters by name
$.paths./datasets/{datasetId}.get.parameters[?(@.name=='datasetId')].description

# Query parameters by name
$.paths./datasets.get.parameters[?(@.name=='workspaceId')].description

# All parameters at path level (shared across methods)
$.paths./datasets.parameters[?(@.name=='workspaceId')].description
```

### Request Bodies

```yaml
# Request body description
$.paths./datasets.post.requestBody.description

# Request body schema reference
$.paths./datasets.post.requestBody.content['application/json'].schema
```

### Response Objects

```yaml
# Response description
$.paths./datasets.get.responses['200'].description

# Response schema
$.paths./datasets.get.responses['200'].content['application/json'].schema
```

### Component Schemas

```yaml
# Schema property
$.components.schemas.DatasetRequest.properties.name

# Nested schema property
$.components.schemas.ComputeEnvConfig.properties.workDir

# Schema required array
$.components.schemas.DatasetRequest.required
```

---

## Overlay Organization Best Practices

1. **Group by feature**: Keep related endpoints together
2. **Separate by type**: Create distinct operations/parameters/schemas files
3. **Use clear comments**: Mark sections with `===== FEATURE =====` and operations with `---- NAME ----`
4. **Maintain order**: Follow the spec's natural order (operations → parameters → schemas)
5. **Test incrementally**: Apply overlays one at a time during development

---

## Array Replacement Pattern

**CRITICAL**: When replacing array values (enums, required fields, etc.), the `update` action will APPEND to existing arrays instead of replacing them. This creates invalid YAML and duplicate values.

### The Problem

❌ **WRONG - Direct update appends to array**
```yaml
# This will APPEND to the existing array, creating duplicates!
- target: "$.components.schemas.AwsBatchConfig.required"
  update:
    - region
    - workDir
```

Result: `required: ["region", "workDir", "region", "workDir", region, workDir]` (INVALID!)

### The Solution

✅ **CORRECT - Remove then update**
```yaml
# Step 1: Remove the existing array
- target: "$.components.schemas.AwsBatchConfig.required"
  remove: true

# Step 2: Add back the corrected array
- target: "$.components.schemas.AwsBatchConfig"
  update:
    required:
      - region
      - workDir
```

Result: `required: ["region", "workDir"]` (VALID!)

### When to Use This Pattern

Use the remove-then-update pattern for:
- **Required field arrays**: Fixing duplicate entries in schema required fields
- **Enum arrays**: Correcting duplicate enum values
- **Any array that needs complete replacement**: When you need to change the entire array content

### Example: Fixing Duplicate Enums

```yaml
# Remove duplicate enum values
- target: "$.components.schemas.WorkflowStatus.properties.status.enum"
  remove: true

- target: "$.components.schemas.WorkflowStatus.properties.status"
  update:
    enum:
      - SUBMITTED
      - RUNNING
      - SUCCEEDED
      - FAILED
      - CANCELLED
```

---

## Common Mistakes to Avoid

❌ **Summaries with periods**
```yaml
update: "List datasets."  # WRONG - no period
```

✅ **Correct**
```yaml
update: "List datasets"  # RIGHT
```

❌ **Descriptions without periods**
```yaml
update: "Lists all datasets in the workspace"  # WRONG - needs period
```

✅ **Correct**
```yaml
update: "Lists all datasets in the workspace."  # RIGHT
```

❌ **Inconsistent parameter descriptions**
```yaml
update: "Workspace ID"  # WRONG - not standard
```

✅ **Correct**
```yaml
update: "Workspace numeric identifier."  # RIGHT - matches standard
```

❌ **Title case summaries**
```yaml
update: "List All Datasets"  # WRONG - title case
```

✅ **Correct**
```yaml
update: "List datasets"  # RIGHT - sentence case
```

Based on the analysis, I need to create overlay files for the `compute-envs` controller. Here are the three overlay files:

---

## compute-envs-operations-overlay-1.96.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments operations overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS - OPERATIONS =====
  
  # ---- DISABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.summary"
    update: "Disable compute environment"
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.description"
    update: "Disables the specified compute environment. A disabled compute environment cannot be used to launch workflows. If the compute environment is primary, it will be automatically unset as primary."
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.summary"
    update: "Enable compute environment"
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.description"
    update: "Enables the specified compute environment. An enabled compute environment can be used to launch workflows."
```

---

## compute-envs-parameters-overlay-1.96.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- DISABLE COMPUTE ENVIRONMENT PARAMETERS ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.requestBody.description"
    update: "Compute environment disable request"
  
  # ---- ENABLE COMPUTE ENVIRONMENT PARAMETERS ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.requestBody.description"
    update: "Compute environment enable request"
```

---

## compute-envs-schemas-overlay-1.96.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- COMPUTE ENVIRONMENT STATUS ENUM ----
  
  - target: "$.components.schemas.ComputeEnv.Status"
    update:
      type: string
      enum: ["AVAILABLE", "CREATING", "ERRORED", "INVALID", "DISABLED"]
      description: "Compute environment status. Accepts `AVAILABLE` (ready for use), `CREATING` (being provisioned), `ERRORED` (failed to create), `INVALID` (configuration error), or `DISABLED` (manually disabled and unavailable for workflow launches)."
```

---

## workflows-schemas-overlay-1.96.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay - spot interruption metrics
  version: 0.0.0
actions:
  # ===== WORKFLOWS SCHEMAS - SPOT INTERRUPTION METRICS =====
  
  # ---- TASK SCHEMA ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of times this task was interrupted due to spot instance termination."
  
  # ---- TRACE PROGRESS DATA SCHEMA ----
  
  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Total number of spot instance interruptions across all tasks in the workflow."
  
  # ---- WORKFLOW LOAD SCHEMA ----
  
  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Cumulative count of spot instance interruptions for the workflow execution."
```

---

## Summary

I've generated **4 overlay files** for version 1.96:

### Compute Environments (3 files):
1. **compute-envs-operations-overlay-1.96.yaml** - Summaries and descriptions for the new disable/enable endpoints
2. **compute-envs-parameters-overlay-1.96.yaml** - Parameter descriptions for path, query, and request body parameters
3. **compute-envs-schemas-overlay-1.96.yaml** - Updated `ComputeEnv.Status` enum to include the new `DISABLED` state

### Workflows (1 file):
4. **workflows-schemas-overlay-1.96.yaml** - New `numSpotInterruptions` property descriptions for Task, TraceProgressData, and WorkflowLoad schemas

### Key Standards Applied:
- ✅ Sentence case summaries without periods
- ✅ Full sentence descriptions with periods
- ✅ Standard parameter descriptions (workspace numeric identifier, compute environment string identifier)
- ✅ Verb-entity pattern for operations (Disable/Enable compute environment)
- ✅ Consistent enum value formatting with backticks
- ✅ Clear, concise property descriptions with type information
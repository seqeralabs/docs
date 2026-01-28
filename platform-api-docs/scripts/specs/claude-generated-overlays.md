# Seqera Platform API v1.105.0 Overlay Files

I'll generate the overlay files for the affected controllers/tags based on the changes analysis. I'll organize them by feature area.

---

## 1. Compute Environments Overlays

### compute-envs-operations-overlay-1.105.0.yaml

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
    update: "Disables the specified compute environment. A disabled compute environment cannot be used to launch workflows. If the compute environment is set as primary, it will be automatically unset as primary."
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.summary"
    update: "Enable compute environment"
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.description"
    update: "Enables the specified compute environment. An enabled compute environment can be used to launch workflows."
```

### compute-envs-parameters-overlay-1.105.0.yaml

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

### compute-envs-schemas-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- COMPUTE ENV STATUS ENUM ----
  
  - target: "$.components.schemas.ComputeEnv.Status"
    update:
      type: string
      enum: ["CREATING", "AVAILABLE", "ERRORED", "INVALID", "DISABLED"]
      description: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `ERRORED`, `INVALID`, or `DISABLED`."
```

---

## 2. Data Links Overlays

### data-links-operations-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links operations overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS - OPERATIONS =====
  
  # ---- EXPLORE DATA-LINK (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.summary"
    update: "Explore data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.description"
    update: "Retrieves the root content of the data-link associated with the specified data-link. Returns a paginated list of files and directories."
  
  # ---- EXPLORE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.summary"
    update: "Explore data-link at path"
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.description"
    update: "Retrieves the content at the specified path within the data-link. Returns a paginated list of files and directories at the given path."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the file at the specified path within the data-link. Returns the file contents as binary data."
  
  # ---- GENERATE UPLOAD URL (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Generates a pre-signed URL for uploading files to the root of the data-link. For AWS S3 data-links, a follow-up request to the `/upload/finish` endpoint is required after upload completion."
  
  # ---- GENERATE UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link upload URL at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Generates a pre-signed URL for uploading files to the specified directory path within the data-link. For AWS S3 data-links, a follow-up request to the `/upload/finish/{dirPath}` endpoint is required after upload completion."
  
  # ---- FINISH UPLOAD (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finalizes a file upload to the root of an AWS S3 data-link. Must be called after successfully uploading a file using an upload URL from the `/upload` endpoint, or to abort a failed upload."
  
  # ---- FINISH UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link upload at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finalizes a file upload to the specified directory path within an AWS S3 data-link. Must be called after successfully uploading a file using an upload URL from the `/upload/{dirPath}` endpoint, or to abort a failed upload."
  
  # ---- DEPRECATED ENDPOINT ----
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.summary"
    update: "(Deprecated) Download data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.description"
    update: "**This endpoint is deprecated. See [Download data-link file](https://docs.seqera.io/platform-api/download-data-link-file) for the current endpoint.**\n\nDownloads files from the specified data-link."
```

### data-links-parameters-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- EXPLORE DATA-LINK (ROOT) PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='search')].description"
    update: "Free-text search filter to match against data-link content names."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to retrieve the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of items to return per page. If omitted, a default maximum value is used."
  
  # ---- EXPLORE DATA-LINK WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='path')].description"
    update: "Directory path within the data-link to explore."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='search')].description"
    update: "Free-text search filter to match against data-link content names."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to retrieve the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of items to return per page. If omitted, a default maximum value is used."
  
  # ---- DOWNLOAD DATA-LINK FILE PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='filePath')].description"
    update: "File path within the data-link to download."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- GENERATE UPLOAD URL (ROOT) PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS support."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.requestBody.description"
    update: "Data-link upload request"
  
  # ---- GENERATE UPLOAD URL WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS support."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.requestBody.description"
    update: "Data-link upload request"
  
  # ---- FINISH UPLOAD (ROOT) PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.requestBody.description"
    update: "Data-link upload finish request"
  
  # ---- FINISH UPLOAD WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for upload finalization."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link upload finish request"
```

---

## 3. Workspaces Overlays

### workspaces-operations-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workspaces operations overlay
  version: 0.0.0
actions:
  # ===== WORKSPACES - OPERATIONS =====
  
  # ---- DELETE WORKSPACE USER ----
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.summary"
    update: "Delete workspace user"
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.description"
    update: "Removes the specified user from the workspace. This applies to both members and collaborators. This action cannot be undone."
```

### workspaces-parameters-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workspaces parameters overlay
  version: 0.0.0
actions:
  # ===== WORKSPACES PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- DELETE WORKSPACE USER PARAMETERS ----
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='userId')].description"
    update: "User numeric identifier."
```

---

## 4. Workflows Overlays

### workflows-parameters-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows parameters overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- LIST WORKFLOWS PARAMETERS ----
  
  - target: "$.paths./workflow.get.parameters[?(@.name=='includeTotalSize')].description"
    update: "If true, includes the total count of workflows in the response. Default: `false`."
```

### workflows-schemas-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- WORKFLOW MAX DB DTO ----
  
  - target: "$.components.schemas.WorkflowMaxDbDto.description"
    update: "Extended workflow details including fusion, wave, and operation metadata."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.fusion"
    update:
      description: "Fusion filesystem metadata for the workflow execution."
      allOf:
        - $ref: "#/components/schemas/WfFusionMeta"
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.wave"
    update:
      description: "Wave container build metadata for the workflow execution."
      allOf:
        - $ref: "#/components/schemas/WfWaveMeta"
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.logFile"
    update:
      type: string
      description: "Path to the workflow execution log file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.outFile"
    update:
      type: string
      description: "Path to the workflow execution output file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.operationId"
    update:
      type: string
      description: "Unique operation identifier for the workflow execution."
  
  # ---- WORKFLOW DB DTO ----
  
  - target: "$.components.schemas.WorkflowDbDto.properties.messages"
    description: "Removed messages property from WorkflowDbDto in favor of WorkflowMaxDbDto."
  
  # ---- LIST WORKFLOWS RESPONSE ----
  
  - target: "$.components.schemas.ListWorkflowsResponse.properties.hasMore"
    update:
      type: boolean
      description: "If true, indicates additional workflow results are available for pagination."
  
  # ---- WORKFLOW QUERY ATTRIBUTE ----
  
  - target: "$.components.schemas.WorkflowQueryAttribute"
    update:
      type: string
      enum: ["optimized", "labels", "messages", "minimal"]
      description: "Workflow query attributes for enriching response data. Accepts `optimized`, `labels`, `messages`, or `minimal`."
      x-enum-varnames: ["optimized", "labels", "messages", "minimal"]
  
  # ---- TASK ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of times the task was interrupted due to spot instance termination."
  
  # ---- TRACE PROGRESS DATA ----
  
  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Total number of spot instance interruptions across all tasks."
  
  # ---- WORKFLOW LOAD ----
  
  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions for this workflow execution."
```

---

## 5. Launch Overlays

### launch-schemas-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Launch schemas overlay
  version: 0.0.0
actions:
  # ===== LAUNCH SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- LAUNCH DB DTO ----
  
  - target: "$.components.schemas.LaunchDbDto.description"
    update: "Launch configuration details including pipeline, compute environment, and execution parameters."
  
  - target: "$.components.schemas.LaunchDbDto.properties.id"
    update:
      type: string
      description: "Launch unique string identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workspaceId"
    update:
      type: integer
      format: int64
      description: "Workspace numeric identifier associated with the launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.computeEnv"
    update:
      description: "Compute environment configuration for the launch."
      allOf:
        - $ref: "#/components/schemas/ComputeEnv_ComputeConfig_"
  
  - target: "$.components.schemas.LaunchDbDto.properties.pipeline"
    update:
      type: string
      description: "Pipeline repository URL or identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workDir"
    update:
      type: string
      description: "Working directory for pipeline execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.revision"
    update:
      type: string
      description: "Pipeline revision, branch, or tag to execute."
  
  - target: "$.components.schemas.LaunchDbDto.properties.commitId"
    update:
      type: string
      description: "Git commit identifier for the pipeline revision."
  
  - target: "$.components.schemas.LaunchDbDto.properties.configText"
    update:
      type: string
      description: "Nextflow configuration content in plain text."
  
  - target: "$.components.schemas.LaunchDbDto.properties.towerConfig"
    update:
      type: string
      description: "Tower-specific configuration content."
  
  - target: "$.components.schemas.LaunchDbDto.properties.paramsText"
    update:
      type: string
      description: "Pipeline parameters in YAML or JSON format."
  
  - target: "$.components.schemas.LaunchDbDto.properties.preRunScript"
    update:
      type: string
      description: "Script to execute before the pipeline run."
  
  - target: "$.components.schemas.LaunchDbDto.properties.postRunScript"
    update:
      type: string
      description: "Script to execute after the pipeline run."
  
  - target: "$.components.schemas.LaunchDbDto.properties.mainScript"
    update:
      type: string
      description: "Main script file name for the pipeline."
  
  - target: "$.components.schemas.LaunchDbDto.properties.entryName"
    update:
      type: string
      description: "Named workflow entry point to execute."
  
  - target: "$.components.schemas.LaunchDbDto.properties.schemaName"
    update:
      type: string
      description: "Schema name for parameter validation."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resume"
    update:
      type: boolean
      description: "If true, enables resume mode for the launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resumeLaunchId"
    update:
      type: string
      description: "Launch identifier to resume from."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pullLatest"
    update:
      type: boolean
      description: "If true, pulls the latest pipeline revision before execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.stubRun"
    update:
      type: boolean
      description: "If true, executes the pipeline in stub-run mode for testing."
  
  - target: "$.components.schemas.LaunchDbDto.properties.sessionId"
    update:
      type: string
      description: "Unique session identifier for the launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.runName"
    update:
      type: string
      description: "Custom name for the workflow run."
  
  - target: "$.components.schemas.LaunchDbDto.properties.configProfiles"
    update:
      type: array
      items:
        type: string
      description: "Array of Nextflow configuration profiles to activate."
  
  - target: "$.components.schemas.LaunchDbDto.properties.userSecrets"
    update:
      type: array
      items:
        type: string
      description: "Array of user secret identifiers to make available during execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workspaceSecrets"
    update:
      type: array
      items:
        type: string
      description: "Array of workspace secret identifiers to make available during execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationId"
    update:
      type: string
      description: "Optimization profile identifier for resource optimization."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationTargets"
    update:
      type: string
      description: "Comma-separated list of optimization targets."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobCpus"
    update:
      type: integer
      format: int32
      description: "Number of CPUs allocated to the head job."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobMemoryMb"
    update:
      type: integer
      format: int32
      description: "Memory allocated to the head job in megabytes."
  
  - target: "$.components.schemas.LaunchDbDto.properties.launchContainer"
    update:
      type: string
      description: "Container image to use for the launch environment."
  
  - target: "$.components.schemas.LaunchDbDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the launch was created."
  
  - target: "$.components.schemas.LaunchDbDto.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the launch was last updated."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier for parameter validation."
  
  # ---- ACTION RESPONSE DTO ----
  
  - target: "$.components.schemas.ActionResponseDto.properties.launch"
    update:
      description: "Launch configuration associated with the action."
      allOf:
        - $ref: "#/components/schemas/LaunchDbDto"
  
  # ---- DESCRIBE LAUNCH RESPONSE ----
  
  - target: "$.components.schemas.DescribeLaunchResponse.properties.launch"
    update:
      description: "Detailed launch configuration information."
      allOf:
        - $ref: "#/components/schemas/LaunchDbDto"
  
  # ---- WORKFLOW LAUNCH REQUEST ----
  
  - target: "$.components.schemas.WorkflowLaunchRequest.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier for parameter validation."
  
  # ---- WORKFLOW LAUNCH RESPONSE ----
  
  - target: "$.components.schemas.WorkflowLaunchResponse.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier used for parameter validation."
```

---

## 6. Credentials/Security Keys Overlays

### credentials-schemas-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- SECURITY KEYS BASE ----
  
  - target: "$.components.schemas.SecurityKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the credentials provider type."
  
  # ---- GIT KEYS ----
  
  - target: "$.components.schemas.GitKeys.description"
    update: "Generic Git repository credentials."
  
  - target: "$.components.schemas.GitKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the credentials provider type."
  
  - target: "$.components.schemas.GitKeys.properties.username"
    update:
      type: string
      description: "Git username for repository authentication."
  
  - target: "$.components.schemas.GitKeys.properties.password"
    update:
      type: string
      description: "Git password for repository authentication."
  
  - target: "$.components.schemas.GitKeys.properties.token"
    update:
      type: string
      description: "Git personal access token for repository authentication."
  
  # ---- AWS SECURITY KEYS ----
  
  - target: "$.components.schemas.AwsSecurityKeys.description"
    update: "AWS access credentials for compute and storage resources."
  
  # ---- AZURE CLOUD KEYS ----
  
  - target: "$.components.schemas.AzureCloudKeys.description"
    update: "Azure Cloud credentials using shared access keys."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the credentials provider type."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.batchName"
    update:
      type: string
      description: "Azure Batch account name."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.storageName"
    update:
      type: string
      description: "Azure Storage account name."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.batchKey"
    update:
      type: string
      writeOnly: true
      description: "Azure Batch account access key. Write-only."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.storageKey"
    update:
      type: string
      writeOnly: true
      description: "Azure Storage account access key. Write-only."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.subscriptionId"
    update:
      type: string
      description: "Azure subscription identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.tenantId"
    update:
      type: string
      description: "Azure Active Directory tenant identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.clientId"
    update:
      type: string
      description: "Azure service principal client identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.clientSecret"
    update:
      type: string
      writeOnly: true
      description: "Azure service principal client secret. Write-only."
  
  # ---- AZURE ENTRA KEYS ----
  
  - target: "$.components.schemas.AzureEntraKeys.description"
    update: "Azure Entra (formerly Active Directory) credentials."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the credentials provider type."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.batchName"
    update:
      type: string
      description: "Azure Batch account name."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.storageName"
    update:
      type: string
      description: "Azure Storage account name."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.batchKey"
    update:
      type: string
      writeOnly: true
      description: "Azure Batch account access key. Write-only."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.storageKey"
    update:
      type: string
      writeOnly: true
      description: "Azure Storage account access key. Write-only."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.tenantId"
    update:
      type: string
      description: "Azure Entra tenant identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientId"
    update:
      type: string
      description: "Azure Entra application client identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientSecret"
    update:
      type: string
      writeOnly: true
      description: "Azure Entra application client secret. Write-only."
  
  # ---- GOOGLE SECURITY KEYS ----
  
  - target: "$.components.schemas.GoogleSecurityKeys.description"
    update: "Google Cloud Platform service account credentials."
  
  # ---- SEQERA COMPUTE SECURITY KEYS ----
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.description"
    update: "Seqera Compute platform credentials."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the credentials provider type."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.accessKey"
    update:
      type: string
      description: "Seqera Compute access key identifier."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.secretKey"
    update:
      type: string
      writeOnly: true
      description: "Seqera Compute secret access key. Write-only."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.assumeRoleArn"
    update:
      type: string
      description: "AWS IAM role ARN to assume for Seqera Compute operations."
  
  # ---- KUBERNETES SECURITY KEYS ----
  
  - target: "$.components.schemas.K8sSecurityKeys.description"
    update: "Kubernetes cluster credentials."
  
  # ---- GITHUB SECURITY KEYS ----
  
  - target: "$.components.schemas.GitHubSecurityKeys.description"
    update: "GitHub repository access credentials."
  
  # ---- GITLAB SECURITY KEYS ----
  
  - target: "$.components.schemas.GitLabSecurityKeys.description"
    update: "GitLab repository access credentials."
  
  # ---- GITEA SECURITY KEYS ----
  
  - target: "$.components.schemas.GiteaSecurityKeys.description"
    update: "Gitea repository access credentials."
  
  # ---- BITBUCKET SECURITY KEYS ----
  
  - target: "$.components.schemas.BitBucketSecurityKeys.description"
    update: "Bitbucket repository access credentials."
  
  # ---- AZURE REPOS SECURITY KEYS ----
  
  - target: "$.components.schemas.AzureReposSecurityKeys.description"
    update: "Azure Repos repository access credentials."
  
  # ---- AZURE SECURITY KEYS ----
  
  - target: "$.components.schemas.AzureSecurityKeys.description"
    update: "Azure platform credentials."
  
  # ---- CODE COMMIT SECURITY KEYS ----
  
  - target: "$.components.schemas.CodeCommitSecurityKeys.description"
    update: "AWS CodeCommit repository access credentials."
  
  # ---- AGENT SECURITY KEYS ----
  
  - target: "$.components.schemas.AgentSecurityKeys.description"
    update: "Tower Agent credentials for secure communication."
  
  # ---- CONTAINER REGISTRY KEYS ----
  
  - target: "$.components.schemas.ContainerRegistryKeys.description"
    update: "Container registry authentication credentials."
  
  # ---- S3 SECURITY KEYS ----
  
  - target: "$.components.schemas.S3SecurityKeys.description"
    update: "S3-compatible storage credentials."
  
  # ---- SSH SECURITY KEYS ----
  
  - target: "$.components.schemas.SSHSecurityKeys.description"
    update: "SSH key-based authentication credentials."
```

---

## 7. Compute Config Schemas Overlays

### compute-config-schemas-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute config schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE CONFIG SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- COMPUTE CONFIG BASE ----
  
  - target: "$.components.schemas.ComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute platform type."
  
  # ---- ABSTRACT GRID CONFIG ----
  
  - target: "$.components.schemas.AbstractGridConfig.description"
    update: "Base configuration for HPC grid scheduler compute environments."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.workDir"
    update:
      type: string
      description: "Working directory resource path for pipeline execution."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.preRunScript"
    update:
      type: string
      description: "Script content that executes before the Nextflow pipeline run. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.postRunScript"
    update:
      type: string
      description: "Script content that executes after all Nextflow processes complete. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute platform type."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.launchDir"
    update:
      type: string
      description: "Directory from which the pipeline execution is launched."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.userName"
    update:
      type: string
      description: "Username for HPC cluster authentication."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.hostName"
    update:
      type: string
      description: "HPC cluster hostname or IP address."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "Port number for HPC cluster connection."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for the head job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs to queue simultaneously."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional scheduler options for the head job."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, applies head job options to all compute jobs."
  
  # ---- LSF COMPUTE CONFIG ----
  
  - target: "$.components.schemas.LsfComputeConfig.description"
    update: "IBM Spectrum LSF compute environment configuration."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir"
    update:
      type: string
      description: "Working directory resource path for pipeline execution."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script content that executes before the Nextflow pipeline run. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script content that executes after all Nextflow processes complete. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute platform type."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Directory from which the pipeline execution is launched."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for LSF cluster authentication."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.hostName"
    update:
      type: string
      description: "LSF cluster hostname or IP address."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "Port number for LSF cluster connection."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for the head job submission."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs to queue simultaneously."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional LSF options for the head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, applies head job options to all compute jobs."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits"
    update:
      type: string
      description: "Unit type for LSF resource limits."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit"
    update:
      type: boolean
      description: "If true, applies memory limits per job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve"
    update:
      type: boolean
      description: "If true, reserves resources per task."
  
  # ---- SLURM COMPUTE CONFIG ----
  
  - target: "$.components.schemas.SlurmComputeConfig.description"
    update: "Slurm Workload Manager compute environment configuration."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.workDir"
    update:
      type: string
      description: "Working directory resource path for pipeline execution."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script content that executes before the Nextflow pipeline run. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script content that executes after all Nextflow processes complete. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute platform type."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Directory from which the pipeline execution is launched."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for Slurm cluster authentication."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.hostName"
    update:
      type: string
      description: "Slurm cluster hostname or IP address."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "Port number for Slurm cluster connection."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Partition name for the head job submission."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Partition name for compute job submissions."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs to queue simultaneously."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional Slurm options for the head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, applies head job options to all compute jobs."
  
  # ---- ALTAIR PBS COMPUTE CONFIG ----
  
  - target: "$.components.schemas.AltairPbsComputeConfig.description"
    update: "Altair PBS Professional compute environment configuration."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.workDir"
    update:
      type: string
      description: "Working directory resource path for pipeline execution."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script content that executes before the Nextflow pipeline run. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script content that executes after all Nextflow processes complete. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute platform type."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Directory from which the pipeline execution is launched."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for PBS cluster authentication."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.hostName"
    update:
      type: string
      description: "PBS cluster hostname or IP address."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "Port number for PBS cluster connection."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for the head job submission."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs to queue simultaneously."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional PBS options for the head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, applies head job options to all compute jobs."
  
  # ---- MOAB COMPUTE CONFIG ----
  
  - target: "$.components.schemas.MoabComputeConfig.description"
    update: "Moab Workload Manager compute environment configuration."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.workDir"
    update:
      type: string
      description: "Working directory resource path for pipeline execution."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script content that executes before the Nextflow pipeline run. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script content that executes after all Nextflow processes complete. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute platform type."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Directory from which the pipeline execution is launched."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for Moab cluster authentication."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.hostName"
    update:
      type: string
      description: "Moab cluster hostname or IP address."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "Port number for Moab cluster connection."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for the head job submission."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs to queue simultaneously."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional Moab options for the head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, applies head job options to all compute jobs."
  
  # ---- UNIVA COMPUTE CONFIG ----
  
  - target: "$.components.schemas.UnivaComputeConfig.description"
    update: "Univa Grid Engine compute environment configuration."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.workDir"
    update:
      type: string
      description: "Working directory resource path for pipeline execution."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script content that executes before the Nextflow pipeline run. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script content that executes after all Nextflow processes complete. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute platform type."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Directory from which the pipeline execution is launched."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for Univa cluster authentication."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.hostName"
    update:
      type: string
      description: "Univa cluster hostname or IP address."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "Port number for Univa cluster connection."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for the head job submission."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs to queue simultaneously."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional Univa options for the head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, applies head job options to all compute jobs."
```

---

## 8. Cloud Compute Config Schemas Overlays

### cloud-compute-schemas-overlay-1.105.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Cloud compute schemas overlay
  version: 0.0.0
actions:
  # ===== CLOUD COMPUTE SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- AWS BATCH CONFIG ----
  
  - target: "$.components.schemas.AwsBatchConfig.properties.workDir"
    update:
      type: string
      description: "Working directory resource path for pipeline execution."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.preRunScript"
    update:
      type: string
      description: "Script content that executes before the Nextflow pipeline run. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.postRunScript"
    update:
      type: string
      description: "Script content that executes after all Nextflow processes complete. See [Pre and post-run scripts](https://docs.seqera.io/platform/launch/advanced#pre-and-post-run-scripts)."
  
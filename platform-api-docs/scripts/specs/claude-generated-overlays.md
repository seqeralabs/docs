I'll generate the overlay files for version 1.104.0, organized by controller/tag. Based on the analysis, we have changes affecting: compute-envs, data-links, and workspaces.

## Compute Environments Overlays

### compute-envs-operations-overlay-1.104.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments operations overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS - OPERATIONS =====
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.summary"
    update: "Enable compute environment"
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.description"
    update: "Enables the specified compute environment. An enabled compute environment can be used to launch workflows."
  
  # ---- DISABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.summary"
    update: "Disable compute environment"
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.description"
    update: "Disables the specified compute environment. A disabled compute environment cannot be used to launch workflows. If the compute environment is currently set as primary, it will be automatically unset."
```

### compute-envs-parameters-overlay-1.104.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- ENABLE COMPUTE ENVIRONMENT PARAMETERS ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.requestBody.description"
    update: "Compute environment enable request"
  
  # ---- DISABLE COMPUTE ENVIRONMENT PARAMETERS ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.requestBody.description"
    update: "Compute environment disable request"
```

### compute-envs-schemas-overlay-1.104.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- COMPUTE ENVIRONMENT STATUS ENUM ----
  
  - target: "$.components.schemas.ComputeEnv.Status.enum"
    update:
      description: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `ERRORED`, `INVALID`, or `DISABLED`."
```

---

## Data Links Overlays

### data-links-operations-overlay-1.104.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links operations overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS - OPERATIONS =====
  
  # ---- EXPLORE DATA-LINK ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.summary"
    update: "Explore data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.description"
    update: "Retrieves the content of the data-link associated with the specified data-link identifier. Returns a paginated list of files and directories at the root level of the data-link resource path."
  
  # ---- EXPLORE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.summary"
    update: "Explore data-link with path"
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.description"
    update: "Retrieves the content of the data-link at the specified path. Returns a paginated list of files and directories at the given path within the data-link resource path."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the file at the specified path within the data-link. Returns the file content as binary data."
  
  # ---- GENERATE DATA-LINK UPLOAD URL ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Creates a presigned URL to upload files to the data-link associated with the specified data-link identifier. For AWS S3 data-links, an additional finalize request must be sent after file upload completion or error using the `/upload/finish` endpoint."
  
  # ---- GENERATE DATA-LINK UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link upload URL with path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Creates a presigned URL to upload files to the specified directory path within the data-link. For AWS S3 data-links, an additional finalize request must be sent after file upload completion or error using the `/upload/finish/{dirPath}` endpoint."
  
  # ---- FINISH DATA-LINK UPLOAD ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finalizes the upload of a file to a data-link. This endpoint is required for AWS S3 data-links to complete a successful file upload or abort an upload if an error was encountered while using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH DATA-LINK UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link upload with path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finalizes the upload of a file to the specified directory path within a data-link. This endpoint is required for AWS S3 data-links to complete a successful file upload or abort an upload if an error was encountered while using an upload URL from the `/upload/{dirPath}` endpoint."
  
  # ---- DEPRECATED: DOWNLOAD DATA-LINK ----
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.summary"
    update: "(Deprecated) Download data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.description"
    update: "**This endpoint is deprecated. See [Download data-link file](https://docs.seqera.io/platform-api/download-data-link-file) for the current endpoint.**\n\nDownloads the content at the root of the data-link associated with the specified data-link identifier."
```

### data-links-parameters-overlay-1.104.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- EXPLORE DATA-LINK PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='search')].description"
    update: "Prefix search filter to match against data-link file and directory names."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to fetch the next page of results. Obtained from the previous response."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of items to return per page. If omitted, a default maximum value is returned."
  
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
    update: "Prefix search filter to match against data-link file and directory names."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to fetch the next page of results. Obtained from the previous response."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of items to return per page. If omitted, a default maximum value is returned."
  
  # ---- DOWNLOAD DATA-LINK FILE PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='filePath')].description"
    update: "File path within the data-link to download."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- GENERATE DATA-LINK UPLOAD URL PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS validation."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.requestBody.description"
    update: "Data-link upload URL request"
  
  # ---- GENERATE DATA-LINK UPLOAD URL WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for file upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS validation."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.requestBody.description"
    update: "Data-link upload URL request with path"
  
  # ---- FINISH DATA-LINK UPLOAD PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.requestBody.description"
    update: "Data-link upload finalize request"
  
  # ---- FINISH DATA-LINK UPLOAD WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link where file was uploaded."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link upload finalize request with path"
```

---

## Workspaces Overlays

### workspaces-operations-overlay-1.104.0.yaml

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
    update: "Removes the specified user from the workspace. This applies to both workspace members and collaborators. The user will no longer have access to workspace resources."
```

### workspaces-parameters-overlay-1.104.0.yaml

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

## Workflows Overlays

### workflows-parameters-overlay-1.104.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows parameters overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS PARAMETERS - QUERY PARAMETERS =====
  
  # ---- LIST WORKFLOWS PARAMETERS ----
  
  - target: "$.paths./workflow.get.parameters[?(@.name=='includeTotalSize')].description"
    update: "Whether to include the total count of workflows in the response. Default: `false`."
```

---

## Launch Overlays

### launch-parameters-overlay-1.104.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Launch parameters overlay
  version: 0.0.0
actions:
  # ===== LAUNCH PARAMETERS - RESPONSE MODIFICATIONS =====
  
  # ---- LIST LAUNCH DATASETS RESPONSE ----
  
  - target: "$.paths./launch/{launchId}/datasets.get.responses['200'].description"
    update: "Successful response containing the list of datasets associated with the launch."
```

---

## Schemas Overlays (Comprehensive)

### schemas-overlay-1.104.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Schemas overlay
  version: 0.0.0
actions:
  # ===== SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- NEW SCHEMAS ----
  
  # GitKeys Schema
  - target: "$.components.schemas.GitKeys"
    update:
      type: object
      description: "Git credentials for repository access."
      properties:
        discriminator:
          type: string
          description: "Property to select the credentials type."
        username:
          type: string
          description: "Git username for authentication."
        password:
          type: string
          description: "Git password or personal access token for authentication."
          writeOnly: true
        token:
          type: string
          description: "Git access token for authentication."
          writeOnly: true
  
  # LaunchDbDto Schema
  - target: "$.components.schemas.LaunchDbDto"
    update:
      type: object
      description: "Database representation of a workflow launch configuration."
      properties:
        id:
          type: string
          description: "Launch string identifier."
        workspaceId:
          type: integer
          format: int64
          description: "Workspace numeric identifier."
        computeEnv:
          $ref: "#/components/schemas/ComputeEnv_ComputeConfig_"
          description: "Compute environment configuration for the launch."
        pipeline:
          type: string
          description: "Pipeline repository URL or identifier."
        workDir:
          type: string
          description: "Working directory for workflow execution."
        revision:
          type: string
          description: "Pipeline revision or branch name."
        commitId:
          type: string
          description: "Git commit identifier for the pipeline."
        configText:
          type: string
          description: "Pipeline configuration as text."
        towerConfig:
          type: string
          description: "Seqera Platform configuration as text."
        paramsText:
          type: string
          description: "Pipeline parameters as text."
        preRunScript:
          type: string
          description: "Script to execute before workflow launch."
        postRunScript:
          type: string
          description: "Script to execute after workflow completion."
        mainScript:
          type: string
          description: "Main workflow script name."
        entryName:
          type: string
          description: "Workflow entry point name."
        schemaName:
          type: string
          description: "Pipeline schema name."
        resume:
          type: boolean
          description: "Whether to resume a previous workflow execution."
        resumeLaunchId:
          type: string
          description: "Launch identifier to resume from."
        pullLatest:
          type: boolean
          description: "Whether to pull the latest pipeline version."
        stubRun:
          type: boolean
          description: "Whether to run in stub mode for testing."
        sessionId:
          type: string
          description: "Workflow session identifier."
        runName:
          type: string
          description: "Custom name for the workflow run."
        configProfiles:
          type: array
          items:
            type: string
          description: "Array of Nextflow configuration profiles to apply."
        userSecrets:
          type: array
          items:
            type: string
          description: "Array of user secret identifiers to make available."
        workspaceSecrets:
          type: array
          items:
            type: string
          description: "Array of workspace secret identifiers to make available."
        optimizationId:
          type: string
          description: "Resource optimization configuration identifier."
        optimizationTargets:
          type: string
          description: "Resource optimization targets."
        headJobCpus:
          type: integer
          format: int32
          description: "Number of CPUs allocated to the head job."
        headJobMemoryMb:
          type: integer
          format: int32
          description: "Memory in MB allocated to the head job."
        launchContainer:
          type: string
          description: "Container image for the launch environment."
        dateCreated:
          type: string
          format: date-time
          description: "Timestamp when the launch was created."
        lastUpdated:
          type: string
          format: date-time
          description: "Timestamp when the launch was last updated."
        pipelineSchemaId:
          type: integer
          format: int64
          description: "Pipeline schema numeric identifier."
  
  # SeqeraComputeCloudInstanceTypeSize Schema
  - target: "$.components.schemas.SeqeraComputeCloudInstanceTypeSize"
    update:
      type: string
      description: "Data Studios instance size. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
      enum:
        - SMALL
        - MEDIUM
        - LARGE
  
  # ---- MODIFIED SCHEMAS ----
  
  # AbstractGridConfig
  - target: "$.components.schemas.AbstractGridConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration as text."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.launchDir.description"
    update: "Launch directory resource path for the head job."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.userName.description"
    update: "SSH username for compute environment connection."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.hostName.description"
    update: "SSH hostname for compute environment connection."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.port.description"
    update: "SSH port for compute environment connection."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headQueue.description"
    update: "HPC queue name for the head job."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.computeQueue.description"
    update: "HPC queue name for compute jobs."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at one time."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to compute jobs."
  
  # Altair PBS Compute Config
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration as text."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.launchDir.description"
    update: "Launch directory resource path for the head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.userName.description"
    update: "SSH username for compute environment connection."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.hostName.description"
    update: "SSH hostname for compute environment connection."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.port.description"
    update: "SSH port for compute environment connection."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headQueue.description"
    update: "PBS queue name for the head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.computeQueue.description"
    update: "PBS queue name for compute jobs."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at one time."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to compute jobs."
  
  # LSF Compute Config
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration as text."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir.description"
    update: "Launch directory resource path for the head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName.description"
    update: "SSH username for compute environment connection."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.hostName.description"
    update: "SSH hostname for compute environment connection."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.port.description"
    update: "SSH port for compute environment connection."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headQueue.description"
    update: "LSF queue name for the head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.computeQueue.description"
    update: "LSF queue name for compute jobs."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at one time."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to compute jobs."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits.description"
    update: "Unit for resource limits. Accepts `KB`, `MB`, or `GB`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit.description"
    update: "Whether to apply memory limits per job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve.description"
    update: "Whether to reserve resources per task."
  
  # Slurm Compute Config
  - target: "$.components.schemas.SlurmComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration as text."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.launchDir.description"
    update: "Launch directory resource path for the head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.userName.description"
    update: "SSH username for compute environment connection."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.hostName.description"
    update: "SSH hostname for compute environment connection."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.port.description"
    update: "SSH port for compute environment connection."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headQueue.description"
    update: "Slurm partition name for the head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.computeQueue.description"
    update: "Slurm partition name for compute jobs."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at one time."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to compute jobs."
  
  # Moab Compute Config
  - target: "$.components.schemas.MoabComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration as text."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.launchDir.description"
    update: "Launch directory resource path for the head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.userName.description"
    update: "SSH username for compute environment connection."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.hostName.description"
    update: "SSH hostname for compute environment connection."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.port.description"
    update: "SSH port for compute environment connection."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headQueue.description"
    update: "Moab queue name for the head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.computeQueue.description"
    update: "Moab queue name for compute jobs."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at one time."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to compute jobs."
  
  # Univa Compute Config
  - target: "$.components.schemas.UnivaComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration as text."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.launchDir.description"
    update: "Launch directory resource path for the head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.userName.description"
    update: "SSH username for compute environment connection."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.hostName.description"
    update: "SSH hostname for compute environment connection."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.port.description"
    update: "SSH port for compute environment connection."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headQueue.description"
    update: "Univa Grid Engine queue name for the head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.computeQueue.description"
    update: "Univa Grid Engine queue name for compute jobs."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at one time."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to compute jobs."
  
  # AWS Batch Config
  - target: "$.components.schemas.AwsBatchConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # AWS Cloud Config
  - target: "$.components.schemas.AwsCloudConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Azure Batch Config
  - target: "$.components.schemas.AzBatchConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.AzBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Azure Cloud Config
  - target: "$.components.schemas.AzCloudConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.AzCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Google Batch Config
  - target: "$.components.schemas.GoogleBatchConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Google Cloud Config
  - target: "$.components.schemas.GoogleCloudConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Google Life Sciences Config
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # K8s Compute Config
  - target: "$.components.schemas.K8sComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # EKS Compute Config
  - target: "$.components.schemas.EksComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.EksComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.EksComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration as text."
  
  - target: "$.components.schemas.EksComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.EksComputeConfig.properties.region.description"
    update: "AWS region where the EKS cluster is located."
  
  - target: "$.components.schemas.EksComputeConfig.properties.clusterName.description"
    update: "Amazon EKS cluster name."
  
  # GKE Compute Config
  - target: "$.components.schemas.GkeComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration as text."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.region.description"
    update: "Google Cloud region or zone where the GKE cluster is located."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.clusterName.description"
    update: "Google GKE cluster name."
  
  # Local Compute Config
  - target: "$.components.schemas.LocalComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Seqera Compute Config
  - target: "$.components.schemas.SeqeraComputeConfig.properties.workDir.description"
    update: "Compute environment working directory resource path."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.instanceTypeSize.description"
    update: "Data Studios instance type size. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
  
  # Platform Metainfo Schemas
  - target: "$.components.schemas.AwsBatchPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.AwsCloudPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.AzBatchPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.AzCloudPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.EksPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.GkePlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.GoogleBatchPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.GoogleCloudPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.GoogleLifeSciencesPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.GridPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.K8sPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.LocalPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.SeqeraComputePlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # Security Keys Schemas
  - target: "$.components.schemas.AgentSecurityKeys.description"
    update: "Seqera Agent credentials for compute environment connection."
  
  - target: "$.components.schemas.AwsSecurityKeys.description"
    update: "Amazon Web Services credentials for cloud resource access."
  
  - target: "$.components.schemas.AzureCloudKeys.description"
    update: "Azure Cloud credentials for Azure Batch and Storage access."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.discriminator.description"
    update: "Property to select the credentials type."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.batchName.description"
    update: "Azure Batch account name."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.storageName.description"
    update: "Azure Storage account name."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.batchKey.description"
    update: "Azure Batch account key. Write-only."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.storageKey.description"
    update: "Azure Storage account key. Write-only."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.subscriptionId.description"
    update: "Azure subscription identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.tenantId.description"
    update: "Azure tenant identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.clientId.description"
    update: "Azure service principal client identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.clientSecret.description"
    update: "Azure service principal client secret. Write-only."
  
  - target: "$.components.schemas.AzureEntraKeys.description"
    update: "Azure Entra ID credentials for Azure Batch and Storage access with Entra authentication."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.discriminator.description"
    update: "Property to select the credentials type."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.batchName.description"
    update: "Azure Batch account name."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.storageName.description"
    update: "Azure Storage account name."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.batchKey.description"
    update: "Azure Batch account key. Write-only."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.storageKey.description"
    update: "Azure Storage account key. Write-only."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.tenantId.description"
    update: "Azure tenant identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientId.description"
    update: "Azure Entra service principal client identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientSecret.description"
    update: "Azure Entra service principal client secret. Write-only."
  
  - target: "$.components.schemas.AzureReposSecurityKeys.description"
    update: "Azure Repos credentials for repository access."
  
  - target: "$.components.schemas.AzureSecurityKeys.description"
    update: "Azure credentials for cloud resource access."
  
  - target: "$.components.schemas.BitBucketSecurityKeys.description"
    update: "Bitbucket credentials for repository access."
  
  - target: "$.components.schemas.CodeCommitSecurityKeys.description"
    update: "AWS CodeCommit credentials for repository access."
  
  - target: "$.components.schemas.ContainerRegistryKeys.description"
    update: "Container registry credentials for image access."
  
  - target: "$.components.schemas.GitHubSecurityKeys.description"
    update: "GitHub credentials for repository access."
  
  - target: "$.components.schemas.GitLabSecurityKeys.description"
    update: "GitLab credentials for repository access."
  
  - target: "$.components.schemas.GiteaSecurityKeys.description"
    update: "Gitea credentials for repository access."
  
  - target: "$.components.schemas.GoogleSecurityKeys.description"
    update: "Google Cloud credentials for cloud resource access."
  
  - target: "$.components.schemas.K8sSecurityKeys.description"
    update: "Kubernetes credentials for cluster access."
  
  
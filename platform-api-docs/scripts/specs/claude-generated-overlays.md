I'll generate the overlay files organized by controller/tag. Based on the analysis, I need to create overlays for:

1. compute-envs
2. data-links  
3. workspaces
4. pipeline-schemas
5. pipeline-versions
6. pipelines (schemas only)
7. workflows (schemas only)

---

## Compute Envs Overlays

### compute-envs-operations-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute envs operations overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVS - OPERATIONS =====
  
  # ---- DISABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.summary"
    update: "Disable compute environment"
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.description"
    update: "Disables the compute environment identified by the given `computeEnvId`. A disabled compute environment cannot be used to launch workflows. If the compute environment is primary, it will be automatically unset as primary."
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.summary"
    update: "Enable compute environment"
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.description"
    update: "Enables the compute environment identified by the given `computeEnvId`. An enabled compute environment can be used to launch workflows."
```

### compute-envs-parameters-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute envs parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
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

## Data Links Overlays

### data-links-operations-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data links operations overlay
  version: 0.0.0
actions:
  # ===== DATA LINKS - OPERATIONS =====
  
  # ---- EXPLORE DATA-LINK ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.summary"
    update: "Explore data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.description"
    update: "Retrieves the content of the data-link associated with the given `dataLinkId`."
  
  # ---- EXPLORE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.summary"
    update: "Explore data-link with path"
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.description"
    update: "Retrieves the content at the given `path` in the data-link associated with the given `dataLinkId`."
  
  # ---- DOWNLOAD DATA-LINK FILE AT PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file at path"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the content at the given `filePath` in the data-link associated with the given `dataLinkId`."
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link file upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Creates a URL to upload files to the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed or encountered an error to finalize the upload. See the `/upload/finish` endpoint."
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link file upload URL with path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Creates a URL to upload files to the given `dirPath` in the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed or encountered an error to finalize the upload. See the `/upload/finish` endpoint."
  
  # ---- FINISH DATA-LINK FILE UPLOAD ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link file upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finalizes upload of a data-link file. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to complete a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH DATA-LINK FILE UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link file upload with path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finalizes upload of a data-link file to the given `dirPath`. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to complete a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
```

### data-links-parameters-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA LINKS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- EXPLORE DATA-LINK PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='search')].description"
    update: "Prefix search filter to match against data-link content."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to retrieve the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of results to return per page. If omitted, a default maximum value is returned."
  
  # ---- EXPLORE DATA-LINK WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='path')].description"
    update: "Resource path within the data-link to explore."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='search')].description"
    update: "Prefix search filter to match against data-link content."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to retrieve the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of results to return per page. If omitted, a default maximum value is returned."
  
  # ---- DOWNLOAD DATA-LINK FILE AT PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='filePath')].description"
    update: "File path within the data-link to download."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS requests."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.requestBody.description"
    update: "Data-link file upload request"
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for file upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS requests."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.requestBody.description"
    update: "Data-link file upload request"
  
  # ---- FINISH DATA-LINK FILE UPLOAD PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.requestBody.description"
    update: "Data-link file upload finalization request"
  
  # ---- FINISH DATA-LINK FILE UPLOAD WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link where file was uploaded."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link file upload finalization request"
```

---

## Workspaces Overlays

### workspaces-operations-overlay-1.106.0.yaml

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
    update: "Deletes the given user (member or collaborator) from the given workspace."
```

### workspaces-parameters-overlay-1.106.0.yaml

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

## Pipeline Schemas Overlays

### pipeline-schemas-operations-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas operations overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS - OPERATIONS =====
  
  # ---- CREATE PIPELINE SCHEMA ----
  
  - target: "$.paths./pipeline-schemas.post.summary"
    update: "Create pipeline schema"
  
  - target: "$.paths./pipeline-schemas.post.description"
    update: "Creates a new pipeline schema in a user context. Append `?workspaceId` to create the schema in a workspace context."
```

### pipeline-schemas-parameters-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- CREATE PIPELINE SCHEMA PARAMETERS ----
  
  - target: "$.paths./pipeline-schemas.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipeline-schemas.post.requestBody.description"
    update: "Pipeline schema create request"
```

### pipeline-schemas-schemas-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CREATE PIPELINE SCHEMA REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineSchemaRequest.properties.content"
    update:
      type: string
      description: "Pipeline schema content in JSON format."
  
  # ---- CREATE PIPELINE SCHEMA RESPONSE ----
  
  - target: "$.components.schemas.CreatePipelineSchemaResponse.properties.pipelineSchema"
    update:
      $ref: "#/components/schemas/PipelineSchemaDbDto"
      description: "Created pipeline schema object."
  
  # ---- PIPELINE SCHEMA DB DTO ----
  
  - target: "$.components.schemas.PipelineSchemaDbDto.properties.id"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier."
  
  - target: "$.components.schemas.PipelineSchemaDbDto.properties.content"
    update:
      type: string
      description: "Pipeline schema content in JSON format."
```

---

## Pipeline Versions Overlays

### pipeline-versions-operations-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions operations overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS - OPERATIONS =====
  
  # ---- LIST PIPELINE VERSIONS ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.summary"
    update: "List pipeline versions"
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.description"
    update: "Lists all available pipeline versions in a user context. Append `?workspaceId` to list pipeline versions in a workspace context."
  
  # ---- VALIDATE PIPELINE VERSION NAME ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.summary"
    update: "Validate pipeline version name"
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.description"
    update: "Confirms the validity of the given pipeline version `name` in a user context. Append `?workspaceId` to validate in a workspace context."
  
  # ---- UPDATE PIPELINE VERSION ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.summary"
    update: "Update pipeline version"
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.description"
    update: "Updates the details of the pipeline version identified by the given `pipelineId` and `versionId`. **Note**: If `labelIds` is `null`, empty, or omitted, existing pipeline labels are removed. Include `labelIds: [<label-id-1>,<label-id-2>]` to override existing labels. Labels to be preserved must be included. To append a list of labels to multiple pipelines, use `/pipelines/labels/add`."
  
  # ---- MANAGE PIPELINE VERSION ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.summary"
    update: "Manage pipeline version"
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.description"
    update: "Updates a pipeline version's name and/or marks it as the default version. When setting a version as default, any previously default version is automatically unset. Version names cannot be changed if the version is already referenced by workflow runs."
```

### pipeline-versions-parameters-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- LIST PIPELINE VERSIONS PARAMETERS ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='max')].description"
    update: "Maximum number of results to return. Default: `20`."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='offset')].description"
    update: "Number of results to skip for pagination. Default: `0`."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='search')].description"
    update: "Free-text search filter to match against pipeline version name."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='isPublished')].description"
    update: "If true, retrieves published versions. If false, retrieves draft versions."
  
  # ---- VALIDATE PIPELINE VERSION NAME PARAMETERS ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.parameters[?(@.name=='name')].description"
    update: "Pipeline version name to validate."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- UPDATE PIPELINE VERSION PARAMETERS ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.requestBody.description"
    update: "Pipeline version update request"
  
  # ---- MANAGE PIPELINE VERSION PARAMETERS ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier (Launch ID)."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.requestBody.description"
    update: "Pipeline version manage request"
```

---

## Pipelines Overlays (Schemas Only)

### pipelines-operations-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines operations overlay
  version: 0.0.0
actions:
  # ===== PIPELINES - OPERATIONS =====
  
  # ---- UPDATE PIPELINE (DEFAULT VERSION) ----
  
  - target: "$.paths./pipelines/{pipelineId}.put.summary"
    update: "Update pipeline (default version)"
  
  - target: "$.paths./pipelines/{pipelineId}.put.description"
    update: "Updates the default version of the pipeline identified by the given `pipelineId`. Only supplied fields are modified."
```

### pipelines-parameters-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINES PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- GET PIPELINE LAUNCH PARAMETERS ----
  
  - target: "$.paths./pipelines/{pipelineId}/launch.get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier. If omitted, retrieves launch information for the default version."
  
  # ---- GET PIPELINE SCHEMA PARAMETERS ----
  
  - target: "$.paths./pipelines/{pipelineId}/schema.get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier. If omitted, retrieves schema for the default version."
```

### pipelines-schemas-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINES SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CREATE PIPELINE REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineRequest.properties.version"
    update:
      $ref: "#/components/schemas/CreatePipelineVersionRequest"
      description: "Initial pipeline version details."
  
  # ---- CREATE PIPELINE VERSION REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineVersionRequest.properties.name"
    update:
      type: string
      description: "Pipeline version name. Maximum 255 characters."
  
  # ---- LIST PIPELINE VERSIONS RESPONSE ----
  
  - target: "$.components.schemas.ListPipelineVersionsResponse.properties.versions"
    update:
      type: array
      items:
        $ref: "#/components/schemas/PipelineDbDto"
      description: "Array of pipeline version objects."
  
  - target: "$.components.schemas.ListPipelineVersionsResponse.properties.totalSize"
    update:
      type: integer
      format: int64
      description: "Total number of pipeline versions available."
  
  # ---- PIPELINE DB DTO ----
  
  - target: "$.components.schemas.PipelineDbDto.properties.version"
    update:
      $ref: "#/components/schemas/PipelineVersionFullInfoDto"
      description: "Pipeline version details."
  
  # ---- PIPELINE MIN INFO RESPONSE ----
  
  - target: "$.components.schemas.PipelineMinInfoResponse.properties.id"
    update:
      type: integer
      format: int64
      description: "Pipeline numeric identifier."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.properties.workspaceId"
    update:
      type: integer
      format: int64
      description: "Workspace numeric identifier."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.properties.version"
    update:
      $ref: "#/components/schemas/PipelineMinInfoResponse.PipelineVersionMinInfoResponse"
      description: "Minimal pipeline version information."
  
  # ---- PIPELINE VERSION MIN INFO RESPONSE ----
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.id"
    update:
      type: string
      description: "Pipeline version string identifier."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.name"
    update:
      type: string
      description: "Pipeline version name."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the pipeline version was created."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the pipeline version was last updated."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.hash"
    update:
      type: string
      description: "Pipeline version content hash."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.isDefault"
    update:
      type: boolean
      description: "If true, this version is the default version for the pipeline."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.isDraftVersion"
    update:
      type: boolean
      description: "If true, this version is a draft and not yet published."
  
  # ---- PIPELINE VERSION FULL INFO DTO ----
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.id"
    update:
      type: string
      description: "Pipeline version string identifier."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorUserId"
    update:
      type: integer
      format: int64
      description: "User numeric identifier of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorUserName"
    update:
      type: string
      description: "Username of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorFirstName"
    update:
      type: string
      description: "First name of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorLastName"
    update:
      type: string
      description: "Last name of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorAvatarUrl"
    update:
      type: string
      description: "Avatar URL of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.name"
    update:
      type: string
      description: "Pipeline version name."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the pipeline version was created."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the pipeline version was last updated."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.hash"
    update:
      type: string
      description: "Pipeline version content hash."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.isDefault"
    update:
      type: boolean
      description: "If true, this version is the default version for the pipeline."
  
  # ---- PIPELINE VERSION MANAGE REQUEST ----
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.name"
    update:
      type: string
      description: "New pipeline version name. Maximum 255 characters."
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.isDefault"
    update:
      type: boolean
      description: "If true, marks this version as the default version for the pipeline."
```

---

## Workflows Overlays (Schemas Only)

### workflows-parameters-overlay-1.106.0.yaml

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

### workflows-schemas-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- DESCRIBE WORKFLOW RESPONSE ----
  
  - target: "$.components.schemas.DescribeWorkflowResponse.properties.workflow"
    update:
      $ref: "#/components/schemas/WorkflowMaxDbDto"
      description: "Complete workflow execution details."
  
  - target: "$.components.schemas.DescribeWorkflowResponse.properties.pipelineInfo"
    update:
      $ref: "#/components/schemas/PipelineMinInfoResponse"
      description: "Minimal pipeline information associated with the workflow."
  
  # ---- LIST WORKFLOWS RESPONSE ----
  
  - target: "$.components.schemas.ListWorkflowsResponse.properties.hasMore"
    update:
      type: boolean
      description: "If true, additional workflow results are available beyond the current page."
  
  # ---- LIST WORKFLOWS ELEMENT ----
  
  - target: "$.components.schemas.ListWorkflowsResponse.ListWorkflowsElement.properties.pipelineInfo"
    update:
      $ref: "#/components/schemas/PipelineMinInfoResponse"
      description: "Minimal pipeline information associated with the workflow."
  
  # ---- WORKFLOW MAX DB DTO ----
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.fusion"
    update:
      $ref: "#/components/schemas/WfFusionMeta"
      description: "Fusion metadata for the workflow execution."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.wave"
    update:
      $ref: "#/components/schemas/WfWaveMeta"
      description: "Wave metadata for the workflow execution."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.logFile"
    update:
      type: string
      description: "Resource path to the workflow log file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.outFile"
    update:
      type: string
      description: "Resource path to the workflow output file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.operationId"
    update:
      type: string
      description: "Unique identifier for the workflow operation."
  
  # ---- WORKFLOW LAUNCH REQUEST ----
  
  - target: "$.components.schemas.WorkflowLaunchRequest.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier to use for validation."
  
  # ---- WORKFLOW LAUNCH RESPONSE ----
  
  - target: "$.components.schemas.WorkflowLaunchResponse.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier used for the launched workflow."
  
  # ---- WORKFLOW LOAD ----
  
  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions during workflow execution."
  
  # ---- TASK ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions during task execution."
  
  # ---- TRACE PROGRESS DATA ----
  
  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Total number of spot instance interruptions across all tasks."
```

---

## Launch Overlays

### launch-parameters-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Launch parameters overlay
  version: 0.0.0
actions:
  # ===== LAUNCH PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- GET LAUNCH DATASETS RESPONSE SCHEMA FIX ----
  
  # Note: This fixes the response schema reference
```

### launch-schemas-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Launch schemas overlay
  version: 0.0.0
actions:
  # ===== LAUNCH SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- ACTION RESPONSE DTO ----
  
  - target: "$.components.schemas.ActionResponseDto.properties.launch"
    update:
      $ref: "#/components/schemas/LaunchDbDto"
      description: "Launch configuration details."
  
  # ---- DESCRIBE LAUNCH RESPONSE ----
  
  - target: "$.components.schemas.DescribeLaunchResponse.properties.launch"
    update:
      $ref: "#/components/schemas/LaunchDbDto"
      description: "Complete launch configuration details."
  
  # ---- LAUNCH DB DTO ----
  
  - target: "$.components.schemas.LaunchDbDto.properties.id"
    update:
      type: string
      description: "Launch string identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workspaceId"
    update:
      type: integer
      format: int64
      description: "Workspace numeric identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.computeEnv"
    update:
      $ref: "#/components/schemas/ComputeEnv_ComputeConfig_"
      description: "Compute environment configuration."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pipeline"
    update:
      type: string
      description: "Pipeline repository URL or path."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workDir"
    update:
      type: string
      description: "Working directory resource path."
  
  - target: "$.components.schemas.LaunchDbDto.properties.revision"
    update:
      type: string
      description: "Pipeline revision (branch, tag, or commit SHA)."
  
  - target: "$.components.schemas.LaunchDbDto.properties.commitId"
    update:
      type: string
      description: "Git commit identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.configText"
    update:
      type: string
      description: "Nextflow configuration text."
  
  - target: "$.components.schemas.LaunchDbDto.properties.towerConfig"
    update:
      type: string
      description: "Tower-specific configuration."
  
  - target: "$.components.schemas.LaunchDbDto.properties.paramsText"
    update:
      type: string
      description: "Pipeline parameters in YAML or JSON format."
  
  - target: "$.components.schemas.LaunchDbDto.properties.preRunScript"
    update:
      type: string
      description: "Script to execute before pipeline execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.postRunScript"
    update:
      type: string
      description: "Script to execute after pipeline execution completes."
  
  - target: "$.components.schemas.LaunchDbDto.properties.mainScript"
    update:
      type: string
      description: "Main Nextflow script filename."
  
  - target: "$.components.schemas.LaunchDbDto.properties.entryName"
    update:
      type: string
      description: "Workflow entry point name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.schemaName"
    update:
      type: string
      description: "Pipeline schema filename."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resume"
    update:
      type: boolean
      description: "If true, enables workflow resume functionality."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resumeLaunchId"
    update:
      type: string
      description: "Launch identifier to resume from."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pullLatest"
    update:
      type: boolean
      description: "If true, pulls the latest pipeline version before execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.stubRun"
    update:
      type: boolean
      description: "If true, executes pipeline in stub mode for testing."
  
  - target: "$.components.schemas.LaunchDbDto.properties.sessionId"
    update:
      type: string
      description: "Unique session identifier for the workflow execution."
  
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
      description: "Array of user secret identifiers to make available."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workspaceSecrets"
    update:
      type: array
      items:
        type: string
      description: "Array of workspace secret identifiers to make available."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationId"
    update:
      type: string
      description: "Optimization identifier for resource optimization."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationTargets"
    update:
      type: string
      description: "Optimization targets for resource optimization."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobCpus"
    update:
      type: integer
      format: int32
      description: "Number of CPUs allocated for the head job."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobMemoryMb"
    update:
      type: integer
      format: int32
      description: "Memory in megabytes allocated for the head job."
  
  - target: "$.components.schemas.LaunchDbDto.properties.launchContainer"
    update:
      type: string
      description: "Container image to use for pipeline execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the launch configuration was created."
  
  - target: "$.components.schemas.LaunchDbDto.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the launch configuration was last updated."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier for parameter validation."
```

---

## Credentials Overlays (for SecurityKeys schemas)

### credentials-schemas-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS SCHEMAS - SECURITY KEYS =====
  
  # ---- GIT KEYS ----
  
  - target: "$.components.schemas.GitKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the credentials type."
  
  - target: "$.components.schemas.GitKeys.properties.username"
    update:
      type: string
      description: "Git username."
  
  - target: "$.components.schemas.GitKeys.properties.password"
    update:
      type: string
      writeOnly: true
      description: "Git password or personal access token."
  
  - target: "$.components.schemas.GitKeys.properties.token"
    update:
      type: string
      writeOnly: true
      description: "Git access token."
  
  # ---- AZURE CLOUD KEYS ----
  
  - target: "$.components.schemas.AzureCloudKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the credentials type."
  
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
      description: "Azure Batch account access key."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.storageKey"
    update:
      type: string
      writeOnly: true
      description: "Azure Storage account access key."
  
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
      description: "Azure service principal client secret."
  
  # ---- AZURE ENTRA KEYS ----
  
  - target: "$.components.schemas.AzureEntraKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the credentials type."
  
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
      description: "Azure Batch account access key."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.storageKey"
    update:
      type: string
      writeOnly: true
      description: "Azure Storage account access key."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.tenantId"
    update:
      type: string
      description: "Azure Active Directory tenant identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientId"
    update:
      type: string
      description: "Azure service principal client identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientSecret"
    update:
      type: string
      writeOnly: true
      description: "Azure service principal client secret."
  
  # ---- SEQERA COMPUTE SECURITY KEYS ----
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the credentials type."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.accessKey"
    update:
      type: string
      description: "Seqera Compute access key identifier."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.secretKey"
    update:
      type: string
      writeOnly: true
      description: "Seqera Compute secret key."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.assumeRoleArn"
    update:
      type: string
      description: "AWS IAM role ARN to assume for Seqera Compute operations."
```

---

## Compute Configs Overlays

### compute-configs-schemas-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute configs schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE CONFIGS SCHEMAS - SEQERA COMPUTE =====
  
  # ---- SEQERA COMPUTE CLOUD INSTANCE TYPE SIZE ----
  
  - target: "$.components.schemas.SeqeraComputeCloudInstanceTypeSize"
    update:
      type: string
      enum:
        - SMALL
        - MEDIUM
        - LARGE
      description: "Seqera Compute cloud instance type size. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
  
  # ---- SEQERA COMPUTE CONFIG ----
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.instanceTypeSize"
    update:
      description: "Size of the Data Studios instance. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
      allOf:
        - $ref: "#/components/schemas/SeqeraComputeCloudInstanceTypeSize"
```

---

## Organizations Overlays

### organizations-schemas-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Organizations schemas overlay
  version: 0.0.0
actions:
  # ===== ORGANIZATIONS SCHEMAS - QUOTAS =====
  
  # ---- ORGANIZATION QUOTAS ----
  
  - target: "$.components.schemas.OrganizationQuotas.properties.maxCustomRolesPerOrg"
    update:
      type: integer
      format: int64
      description: "Maximum number of custom roles allowed per organization."
```

---

## Compute Envs Status Update

### compute-envs-schemas-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute envs schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVS SCHEMAS - STATUS ENUM =====
  
  # ---- COMPUTE ENV STATUS ----
  
  - target: "$.components.schemas.ComputeEnv.Status"
    update:
      type: string
      enum:
        - CREATING
        - AVAILABLE
        - ERRORED
        - INVALID
        - DISABLED
      description: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `ERRORED`, `INVALID`, or `DISABLED`."
```

---

## Data Studios Overlays

### data-studios-schemas-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data studios schemas overlay
  version: 0.0.0
actions:
  # ===== DATA STUDIOS SCHEMAS - STOP REASON =====
  
  # ---- DATA STUDIO STOP REASON ----
  
  - target: "$.components.schemas.DataStudioStopReason"
    update:
      type: string
      enum:
        - USER_REQUEST
        - IDLE_TIMEOUT
        - ERROR
        - NO_STATS_AVAIL
      description: "Reason for Data Studio session termination. Accepts `USER_REQUEST`, `IDLE_TIMEOUT`, `ERROR`, or `NO_STATS_AVAIL`."
```

---

## Workflow Query Attribute Update

### workflows-enums-overlay-1.106.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows enums overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS ENUMS - QUERY ATTRIBUTES =====
  
  # ---- WORKFLOW QUERY ATTRIBUTE ----
  
  - target: "$.components.schemas.WorkflowQueryAttribute"
    update:
      type: string
      enum:
        - labels
        - optimizationId
        - optimizationStatus
        - cost
        - pipelineInfo
      x-enum-varnames:
        - labels
        - optimizationId
        - optimizationStatus
        - cost
        - pipelineInfo
      description: "Workflow query attribute. Accepts `labels`, `optimizationId`, `optimizationStatus`, `cost`, or `pipelineInfo`."
```

These overlay files provide complete documentation coverage for all changes in version 1.106.0, following the Seqera API documentation standards exactly.
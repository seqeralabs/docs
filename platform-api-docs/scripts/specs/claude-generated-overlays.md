I'll generate comprehensive overlay files for version 1.107.0, organized by feature/controller. Let me create these systematically.

# Compute Environments Overlays

## compute-envs-operations-overlay-1.107.0.yaml

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
    update: "Disables the compute environment identified by the given `computeEnvId`. A disabled compute environment cannot be used to launch workflows. If the compute environment is primary, it will be automatically unset as primary."
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.summary"
    update: "Enable compute environment"
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.description"
    update: "Enables the compute environment identified by the given `computeEnvId`. An enabled compute environment can be used to launch workflows."
```

## compute-envs-parameters-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS - PARAMETERS =====
  
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

## compute-envs-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS - SCHEMAS =====
  
  # ---- COMPUTE ENVIRONMENT STATUS ENUM ----
  
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

# Data Links Overlays

## data-links-operations-overlay-1.107.0.yaml

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
    update: "Retrieves the content of the data-link associated with the given `dataLinkId`."
  
  # ---- EXPLORE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.summary"
    update: "Explore data-link at path"
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.description"
    update: "Retrieves the content at the given `path` in the data-link associated with the given `dataLinkId`."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file at path"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the content at the given `filePath` in the data-link associated with the given `dataLinkId`."
  
  # ---- GENERATE UPLOAD URL ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link file upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Creates a URL to upload files to the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload - see the `/upload/finish` endpoint."
  
  # ---- GENERATE UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link file upload URL at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Creates a URL to upload files to the specified `dirPath` in the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload - see the `/upload/finish` endpoint."
  
  # ---- FINISH UPLOAD ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link file upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finalizes upload of a data-link file. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link file upload at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finalizes upload of a data-link file to the specified `dirPath`. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
```

## data-links-parameters-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS - PARAMETERS =====
  
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
    update: "Token used to fetch the next page of items."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='pageSize')].description"
    update: "Number of items to return per page. If omitted, a default maximum value is returned."
  
  # ---- EXPLORE DATA-LINK WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='path')].description"
    update: "Resource path within the data-link."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='search')].description"
    update: "Prefix search filter to match against data-link content."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to fetch the next page of items."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='pageSize')].description"
    update: "Number of items to return per page. If omitted, a default maximum value is returned."
  
  # ---- DOWNLOAD DATA-LINK FILE PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='filePath')].description"
    update: "File path to download from the data-link."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- UPLOAD PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS validation."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.requestBody.description"
    update: "Data-link upload request"
  
  # ---- UPLOAD WITH PATH PARAMETERS ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS validation."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.requestBody.description"
    update: "Data-link upload request"
  
  # ---- FINISH UPLOAD PARAMETERS ----
  
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
    update: "Directory path within the data-link."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link upload finish request"
```

---

# Workspaces Overlays

## workspaces-operations-overlay-1.107.0.yaml

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

## workspaces-parameters-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workspaces parameters overlay
  version: 0.0.0
actions:
  # ===== WORKSPACES - PARAMETERS =====
  
  # ---- DELETE WORKSPACE USER PARAMETERS ----
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='userId')].description"
    update: "User numeric identifier."
```

---

# Pipeline Schemas Overlays

## pipeline-schemas-operations-overlay-1.107.0.yaml

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

## pipeline-schemas-parameters-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS - PARAMETERS =====
  
  # ---- CREATE PIPELINE SCHEMA PARAMETERS ----
  
  - target: "$.paths./pipeline-schemas.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipeline-schemas.post.requestBody.description"
    update: "Pipeline schema create request"
```

## pipeline-schemas-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS - SCHEMAS =====
  
  # ---- CREATE PIPELINE SCHEMA REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineSchemaRequest.properties.content"
    update:
      type: string
      description: "Pipeline schema content in JSON format."
  
  # ---- CREATE PIPELINE SCHEMA RESPONSE ----
  
  - target: "$.components.schemas.CreatePipelineSchemaResponse.properties.pipelineSchema"
    update:
      $ref: "#/components/schemas/PipelineSchemaDbDto"
      description: "Created pipeline schema details."
  
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

# Pipeline Versions Overlays

## pipeline-versions-operations-overlay-1.107.0.yaml

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
    update: "Confirms the validity of the given pipeline version `name` in a user context."
  
  # ---- UPDATE PIPELINE VERSION ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.summary"
    update: "Update pipeline version"
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.description"
    update: "Updates the details of the pipeline version identified by the given `pipelineId` and `versionId`. **Note**: If `labelIds` is `null`, empty, or omitted, existing pipeline labels are removed. Include `labelIds: [<label-id-1>,<label-id-2>]` to override existing labels. Labels to be preserved must be included. To append a list of labels to multiple pipelines, use `/pipelines/labels/add`."
  
  # ---- MANAGE PIPELINE VERSION ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.summary"
    update: "Update pipeline version name and default flag"
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.description"
    update: "Updates a pipeline version's name and/or marks it as the default version. When setting a version as default, any previously default version is automatically unset. Version names cannot be changed if the version is already referenced by workflow runs."
```

## pipeline-versions-parameters-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS - PARAMETERS =====
  
  # ---- LIST PIPELINE VERSIONS PARAMETERS ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='max')].description"
    update: "Maximum number of results to return."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='offset')].description"
    update: "Number of results to skip for pagination. Default: `0`."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='search')].description"
    update: "Free-text search filter to match against pipeline version names."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='isPublished')].description"
    update: "If `true`, retrieve published versions. If `false`, retrieve draft versions."
  
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

## pipeline-versions-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS - SCHEMAS =====
  
  # ---- CREATE PIPELINE VERSION REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineVersionRequest.properties.name"
    update:
      type: string
      description: "Pipeline version name."
  
  # ---- LIST PIPELINE VERSIONS RESPONSE ----
  
  - target: "$.components.schemas.ListPipelineVersionsResponse.properties.versions"
    update:
      type: array
      items:
        $ref: "#/components/schemas/PipelineDbDto"
      description: "Array of pipeline versions."
  
  - target: "$.components.schemas.ListPipelineVersionsResponse.properties.totalSize"
    update:
      type: integer
      format: int64
      description: "Total number of pipeline versions available."
  
  # ---- PIPELINE VERSION MANAGE REQUEST ----
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.name"
    update:
      type: string
      description: "New name for the pipeline version. Can be `null`."
      nullable: true
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.isDefault"
    update:
      type: boolean
      description: "If `true`, marks this version as the default pipeline version. Default: `false`."
  
  # ---- PIPELINE VERSION FULL INFO DTO ----
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.id"
    update:
      type: string
      description: "Pipeline version string identifier (Launch ID)."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorUserId"
    update:
      type: integer
      format: int64
      description: "Creator user numeric identifier."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorUserName"
    update:
      type: string
      description: "Creator username."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorFirstName"
    update:
      type: string
      description: "Creator first name."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorLastName"
    update:
      type: string
      description: "Creator last name."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorAvatarUrl"
    update:
      type: string
      description: "Creator avatar URL."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.name"
    update:
      type: string
      description: "Pipeline version name."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Version creation timestamp."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Version last update timestamp."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.hash"
    update:
      type: string
      description: "Version content hash."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.isDefault"
    update:
      type: boolean
      description: "If `true`, this is the default pipeline version."
  
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
      description: "Pipeline version minimal information."
  
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
      description: "Version creation timestamp."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Version last update timestamp."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.hash"
    update:
      type: string
      description: "Version content hash."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.isDefault"
    update:
      type: boolean
      description: "If `true`, this is the default pipeline version."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.isDraftVersion"
    update:
      type: boolean
      description: "If `true`, this is a draft version."
```

---

# SSH Keys Overlays

## ssh-keys-operations-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys operations overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS - OPERATIONS =====
  
  # ---- LIST SSH KEYS ----
  
  - target: "$.paths./ssh-keys.get.summary"
    update: "List SSH keys"
  
  - target: "$.paths./ssh-keys.get.description"
    update: "Retrieves the list of all SSH public keys for the authenticated user."
  
  # ---- CREATE SSH KEY ----
  
  - target: "$.paths./ssh-keys.post.summary"
    update: "Create SSH key"
  
  - target: "$.paths./ssh-keys.post.description"
    update: "Creates a new SSH public key with the details in the given request body."
  
  # ---- VALIDATE SSH KEY ----
  
  - target: "$.paths./ssh-keys/validate/key.get.summary"
    update: "Validate SSH key"
  
  - target: "$.paths./ssh-keys/validate/key.get.description"
    update: "Confirms the availability of the given key for an SSH key in the user context."
  
  # ---- VALIDATE SSH KEY NAME ----
  
  - target: "$.paths./ssh-keys/validate/name.get.summary"
    update: "Validate SSH key name"
  
  - target: "$.paths./ssh-keys/validate/name.get.description"
    update: "Confirms the availability of the given name for an SSH key in the user context."
  
  # ---- DESCRIBE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.get.summary"
    update: "Get SSH key details"
  
  - target: "$.paths./ssh-keys/{keyId}.get.description"
    update: "Retrieves the details of an SSH public key by its ID."
  
  # ---- DELETE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.delete.summary"
    update: "Delete SSH key"
  
  - target: "$.paths./ssh-keys/{keyId}.delete.description"
    update: "Permanently deletes the given SSH public key by its ID. This action cannot be undone."
```

## ssh-keys-parameters-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys parameters overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS - PARAMETERS =====
  
  # ---- CREATE SSH KEY PARAMETERS ----
  
  - target: "$.paths./ssh-keys.post.requestBody.description"
    update: "SSH key create request"
  
  # ---- VALIDATE SSH KEY PARAMETERS ----
  
  - target: "$.paths./ssh-keys/validate/key.get.parameters[?(@.name=='key')].description"
    update: "SSH public key to validate."
  
  # ---- VALIDATE SSH KEY NAME PARAMETERS ----
  
  - target: "$.paths./ssh-keys/validate/name.get.parameters[?(@.name=='name')].description"
    update: "SSH key name to validate."
  
  # ---- DESCRIBE SSH KEY PARAMETERS ----
  
  - target: "$.paths./ssh-keys/{keyId}.get.parameters[?(@.name=='keyId')].description"
    update: "SSH key numeric identifier."
  
  # ---- DELETE SSH KEY PARAMETERS ----
  
  - target: "$.paths./ssh-keys/{keyId}.delete.parameters[?(@.name=='keyId')].description"
    update: "SSH key numeric identifier."
```

## ssh-keys-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys schemas overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS - SCHEMAS =====
  
  # ---- CREATE SSH KEY REQUEST ----
  
  - target: "$.components.schemas.CreateSshKeyRequest.properties.name"
    update:
      type: string
      description: "SSH key name. Maximum 255 characters."
  
  - target: "$.components.schemas.CreateSshKeyRequest.properties.publicKey"
    update:
      type: string
      description: "SSH public key content."
  
  # ---- CREATE SSH KEY RESPONSE ----
  
  - target: "$.components.schemas.CreateSshKeyResponse.properties.sshKey"
    update:
      $ref: "#/components/schemas/UserSshPublicKeyDto"
      description: "Created SSH key details."
  
  # ---- DESCRIBE SSH KEY RESPONSE ----
  
  - target: "$.components.schemas.DescribeSshKeyResponse.properties.sshKey"
    update:
      $ref: "#/components/schemas/UserSshPublicKeyDto"
      description: "SSH key details."
  
  # ---- LIST SSH KEYS RESPONSE ----
  
  - target: "$.components.schemas.ListSshKeysResponse.properties.sshKeys"
    update:
      type: array
      items:
        $ref: "#/components/schemas/UserSshPublicKeyDto"
      description: "Array of SSH keys for the authenticated user."
  
  # ---- USER SSH PUBLIC KEY DTO ----
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.id"
    update:
      type: integer
      format: int64
      description: "SSH key numeric identifier."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.name"
    update:
      type: string
      description: "SSH key name."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.publicKey"
    update:
      type: string
      description: "SSH public key content."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "SSH key creation timestamp."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.lastUsed"
    update:
      type: string
      format: date-time
      description: "SSH key last used timestamp. Can be `null`."
      nullable: true
```

---

# Pipelines Overlays (Additional)

## pipelines-operations-overlay-1.107.0.yaml

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
    update: "Updates the default version of the pipeline identified by the given `pipelineId` with the provided values. Only supplied fields are modified. **Note**: If `labelIds` is `null`, empty, or omitted, existing pipeline labels are removed. Include `labelIds: [<label-id-1>,<label-id-2>]` to override existing labels. Labels to be preserved must be included. To append a list of labels to multiple pipelines, use `/pipelines/labels/add`."
```

## pipelines-parameters-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINES - PARAMETERS =====
  
  # ---- PIPELINE LAUNCH PARAMETERS ----
  
  - target: "$.paths./pipelines/{pipelineId}/launch.get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier. If omitted, uses the default version."
  
  # ---- PIPELINE SCHEMA PARAMETERS ----
  
  - target: "$.paths./pipelines/{pipelineId}/schema.get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier. If omitted, uses the default version."
```

## pipelines-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINES - SCHEMAS =====
  
  # ---- CREATE PIPELINE REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineRequest.properties.version"
    update:
      $ref: "#/components/schemas/CreatePipelineVersionRequest"
      description: "Initial pipeline version details."
  
  # ---- PIPELINE DB DTO ----
  
  - target: "$.components.schemas.PipelineDbDto.properties.version"
    update:
      $ref: "#/components/schemas/PipelineVersionFullInfoDto"
      description: "Pipeline version details."
```

---

# Workflows Overlays

## workflows-operations-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows operations overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS - OPERATIONS =====
  
  # (No new operations, only modified schemas)
```

## workflows-parameters-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows parameters overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS - PARAMETERS =====
  
  # ---- LIST WORKFLOWS PARAMETERS ----
  
  - target: "$.paths./workflow.get.parameters[?(@.name=='includeTotalSize')].description"
    update: "If `true`, include total workflow count in the response."
```

## workflows-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS - SCHEMAS =====
  
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
      description: "Pipeline repository URL."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workDir"
    update:
      type: string
      description: "Pipeline working directory."
  
  - target: "$.components.schemas.LaunchDbDto.properties.revision"
    update:
      type: string
      description: "Pipeline revision (branch, tag, or commit)."
  
  - target: "$.components.schemas.LaunchDbDto.properties.commitId"
    update:
      type: string
      description: "Pipeline commit ID."
  
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
      description: "Script executed before pipeline launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.postRunScript"
    update:
      type: string
      description: "Script executed after pipeline completion."
  
  - target: "$.components.schemas.LaunchDbDto.properties.mainScript"
    update:
      type: string
      description: "Main pipeline script name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.entryName"
    update:
      type: string
      description: "Pipeline workflow entry name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.schemaName"
    update:
      type: string
      description: "Pipeline schema name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resume"
    update:
      type: boolean
      description: "If `true`, resume previous workflow execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resumeLaunchId"
    update:
      type: string
      description: "Launch ID of workflow to resume."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pullLatest"
    update:
      type: boolean
      description: "If `true`, pull latest pipeline revision."
  
  - target: "$.components.schemas.LaunchDbDto.properties.stubRun"
    update:
      type: boolean
      description: "If `true`, execute pipeline in stub mode."
  
  - target: "$.components.schemas.LaunchDbDto.properties.sessionId"
    update:
      type: string
      description: "Workflow session identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.runName"
    update:
      type: string
      description: "Workflow run name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.configProfiles"
    update:
      type: array
      items:
        type: string
      description: "Array of Nextflow configuration profiles."
  
  - target: "$.components.schemas.LaunchDbDto.properties.userSecrets"
    update:
      type: array
      items:
        type: string
      description: "Array of user secret identifiers."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workspaceSecrets"
    update:
      type: array
      items:
        type: string
      description: "Array of workspace secret identifiers."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationId"
    update:
      type: string
      description: "Optimization configuration identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationTargets"
    update:
      type: string
      description: "Optimization targets configuration."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobCpus"
    update:
      type: integer
      format: int32
      description: "Number of CPUs allocated to head job."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobMemoryMb"
    update:
      type: integer
      format: int32
      description: "Memory allocated to head job in megabytes."
  
  - target: "$.components.schemas.LaunchDbDto.properties.launchContainer"
    update:
      type: string
      description: "Container image for pipeline launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Launch configuration creation timestamp."
  
  - target: "$.components.schemas.LaunchDbDto.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Launch configuration last update timestamp."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier."
  
  # ---- WORKFLOW MAX DB DTO ----
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.fusion"
    update:
      $ref: "#/components/schemas/WfFusionMeta"
      description: "Fusion metadata for the workflow."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.wave"
    update:
      $ref: "#/components/schemas/WfWaveMeta"
      description: "Wave metadata for the workflow."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.logFile"
    update:
      type: string
      description: "Workflow log file path."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.outFile"
    update:
      type: string
      description: "Workflow output file path."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.operationId"
    update:
      type: string
      description: "Operation identifier for the workflow."
  
  # ---- DESCRIBE WORKFLOW RESPONSE ----
  
  - target: "$.components.schemas.DescribeWorkflowResponse.properties.pipelineInfo"
    update:
      $ref: "#/components/schemas/PipelineMinInfoResponse"
      description: "Minimal pipeline information for the workflow."
  
  # ---- LIST WORKFLOWS RESPONSE ----
  
  - target: "$.components.schemas.ListWorkflowsResponse.properties.hasMore"
    update:
      type: boolean
      description: "If `true`, more workflows are available beyond the current page."
  
  - target: "$.components.schemas.ListWorkflowsResponse.ListWorkflowsElement.properties.pipelineInfo"
    update:
      $ref: "#/components/schemas/PipelineMinInfoResponse"
      description: "Minimal pipeline information for the workflow."
  
  # ---- WORKFLOW LAUNCH REQUEST ----
  
  - target: "$.components.schemas.WorkflowLaunchRequest.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier."
      nullable: true
  
  # ---- WORKFLOW LAUNCH RESPONSE ----
  
  - target: "$.components.schemas.WorkflowLaunchResponse.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier."
      nullable: true
  
  # ---- WORKFLOW QUERY ATTRIBUTE ----
  
  - target: "$.components.schemas.WorkflowQueryAttribute"
    update:
      type: string
      enum:
        - labels
        - optimizationId
        - optimizationStatus
        - processesCpuMem
        - pipelineInfo
      x-enum-varnames:
        - labels
        - optimizationId
        - optimizationStatus
        - processesCpuMem
        - pipelineInfo
      description: "Workflow query attributes for filtering. Accepts `labels`, `optimizationId`, `optimizationStatus`, `processesCpuMem`, or `pipelineInfo`."
  
  # ---- TASK ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered."
  
  # ---- TRACE PROGRESS DATA ----
  
  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Total number of spot instance interruptions."
  
  # ---- WORKFLOW LOAD ----
  
  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions during workflow execution."
```

---

# Launch Overlays

## launch-parameters-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Launch parameters overlay
  version: 0.0.0
actions:
  # ===== LAUNCH - PARAMETERS =====
  
  # ---- DESCRIBE LAUNCH RESPONSE ----
  
  - target: "$.paths./launch/{launchId}/datasets.get.responses.200.description"
    update: "OK"
```

---

# Studios Overlays

## studios-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Studios schemas overlay
  version: 0.0.0
actions:
  # ===== STUDIOS - SCHEMAS =====
  
  # ---- STUDIO SSH DETAILS DTO ----
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.host"
    update:
      type: string
      description: "SSH hostname to connect to the Studio session."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.port"
    update:
      type: integer
      format: int32
      description: "SSH port number for the Studio session."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.user"
    update:
      type: string
      description: "SSH user in the format `username@sessionId`."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.command"
    update:
      type: string
      description: "Complete SSH command to connect to the Studio session."
  
  # ---- DATA STUDIO CONFIGURATION ----
  
  - target: "$.components.schemas.DataStudioConfiguration.properties.sshEnabled"
    update:
      type: boolean
      nullable: true
      description: "If `true`, SSH access is enabled for the Studio session. Can be `null`."
  
  # ---- DATA STUDIO DTO ----
  
  - target: "$.components.schemas.DataStudioDto.properties.sshDetails"
    update:
      nullable: true
      allOf:
        - $ref: "#/components/schemas/StudioSshDetailsDto"
      description: "SSH connection details for the Studio session. Can be `null`."
  
  # ---- DATA STUDIO STOP REASON ----
  
  - target: "$.components.schemas.DataStudioStopReason"
    update:
      type: string
      enum:
        - USER_REQUESTED
        - TIMEOUT
        - ERROR
        - NO_STATS_AVAIL
      description: "Reason for Data Studio session termination. Accepts `USER_REQUESTED`, `TIMEOUT`, `ERROR`, or `NO_STATS_AVAIL`."
```

---

# Organization Quotas Schemas Overlay

## organization-quotas-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Organization quotas schemas overlay
  version: 0.0.0
actions:
  # ===== ORGANIZATION QUOTAS - SCHEMAS =====
  
  # ---- ORGANIZATION QUOTAS ----
  
  - target: "$.components.schemas.OrganizationQuotas.properties.maxCustomRolesPerOrg"
    update:
      type: integer
      format: int64
      description: "Maximum number of custom roles allowed per organization."
```

---

# Credentials Schemas Overlay (Git Keys)

## credentials-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS - SCHEMAS =====
  
  # ---- GIT KEYS ----
  
  - target: "$.components.schemas.GitKeys.properties.discriminator"
    update:
      type: string
      description: "Credential type discriminator."
  
  - target: "$.components.schemas.GitKeys.properties.username"
    update:
      type: string
      description: "Git username."
  
  - target: "$.components.schemas.GitKeys.properties.password"
    update:
      type: string
      description: "Git password. Write-only."
      writeOnly: true
  
  - target: "$.components.schemas.GitKeys.properties.token"
    update:
      type: string
      description: "Git access token. Write-only."
      writeOnly: true
```

---

# Compute Configurations Schemas Overlay

## compute-configs-schemas-overlay-1.107.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute configurations schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE CONFIGURATIONS - COMMON PROPERTIES =====
  
  # ---- ABSTRACT GRID CONFIG ----
  
  - target: "$.components.schemas.AbstractGridConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.preRunScript"
    update:
      type: string
      description: "Script executed in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.postRunScript"
    update:
      type: string
      description: "Script executed after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables for the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute configuration platform type."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.launchDir"
    update:
      type: string
      description: "Launch directory for workflow execution."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.userName"
    update:
      type: string
      description: "Username for SSH connection to HPC cluster."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.hostName"
    update:
      type: string
      description: "Hostname for SSH connection to HPC cluster."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "Port number for SSH connection to HPC cluster."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for head job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for compute job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs that can be queued."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional options for head job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If `true`, propagate head job options to compute jobs."
  
  # ---- LSF COMPUTE CONFIG ----
  
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script executed in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script executed after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables for the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute configuration platform type."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Launch directory for workflow execution."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for SSH connection to LSF cluster."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.hostName"
    update:
      type: string
      description: "Hostname for SSH
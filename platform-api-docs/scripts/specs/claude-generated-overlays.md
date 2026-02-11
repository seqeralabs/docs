I'll generate the overlay files for Seqera Platform API version 1.108.0, organized by feature/controller.

## Compute Environments

### compute-envs-operations-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments operations overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS - OPERATIONS =====
  
  # ---- DISABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths['/compute-envs/{computeEnvId}/disable'].post.summary"
    update: "Disable compute environment"
  
  - target: "$.paths['/compute-envs/{computeEnvId}/disable'].post.description"
    update: "Disables the compute environment identified by the given `computeEnvId`. A disabled compute environment cannot be used to launch workflows. If the compute environment is primary, it is automatically unset as primary."
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths['/compute-envs/{computeEnvId}/enable'].post.summary"
    update: "Enable compute environment"
  
  - target: "$.paths['/compute-envs/{computeEnvId}/enable'].post.description"
    update: "Enables the compute environment identified by the given `computeEnvId`. An enabled compute environment can be used to launch workflows."
```

### compute-envs-parameters-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- PATH PARAMETERS ----
  
  - target: "$.paths['/compute-envs/{computeEnvId}/disable'].post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths['/compute-envs/{computeEnvId}/enable'].post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  # ---- QUERY PARAMETERS ----
  
  - target: "$.paths['/compute-envs/{computeEnvId}/disable'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/compute-envs/{computeEnvId}/enable'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- REQUEST BODY DESCRIPTIONS ----
  
  - target: "$.paths['/compute-envs/{computeEnvId}/disable'].post.requestBody.description"
    update: "Compute environment disable request"
  
  - target: "$.paths['/compute-envs/{computeEnvId}/enable'].post.requestBody.description"
    update: "Compute environment enable request"
```

## Credentials

### credentials-operations-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials operations overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS - OPERATIONS =====
  
  # ---- GET ENCRYPTED CREDENTIALS ----
  
  - target: "$.paths['/credentials/{credentialsId}/keys'].get.summary"
    update: "Get encrypted credentials"
  
  - target: "$.paths['/credentials/{credentialsId}/keys'].get.description"
    update: "Retrieves the encrypted keys for the credentials identified by the given `credentialsId`."
```

### credentials-parameters-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials parameters overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- PATH PARAMETERS ----
  
  - target: "$.paths['/credentials/{credentialsId}/keys'].get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  # ---- QUERY PARAMETERS ----
  
  - target: "$.paths['/credentials/{credentialsId}/keys'].get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/credentials/{credentialsId}/keys'].get.parameters[?(@.name=='pairingId')].description"
    update: "Encryption key string identifier."
```

### credentials-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- GetCredentialsKeysResponse ----
  
  - target: "$.components.schemas.GetCredentialsKeysResponse.properties.keys"
    update:
      type: string
      description: "Encrypted credentials keys in string format."
```

## Data Links

### data-links-operations-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links operations overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS - OPERATIONS =====
  
  # ---- EXPLORE DATA-LINK ----
  
  - target: "$.paths['/data-links/{dataLinkId}/browse'].get.summary"
    update: "Explore data-link"
  
  - target: "$.paths['/data-links/{dataLinkId}/browse'].get.description"
    update: "Retrieves the content of the data-link associated with the given `dataLinkId`."
  
  # ---- EXPLORE DATA-LINK WITH PATH ----
  
  - target: "$.paths['/data-links/{dataLinkId}/browse/{path}'].get.summary"
    update: "Explore data-link at path"
  
  - target: "$.paths['/data-links/{dataLinkId}/browse/{path}'].get.description"
    update: "Retrieves the content at the given `path` in the data-link associated with the given `dataLinkId`."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths['/data-links/{dataLinkId}/download/{filePath}'].get.summary"
    update: "Download data-link file at path"
  
  - target: "$.paths['/data-links/{dataLinkId}/download/{filePath}'].get.description"
    update: "Downloads the content at the given `filePath` in the data-link associated with the given `dataLinkId`."
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL ----
  
  - target: "$.paths['/data-links/{dataLinkId}/upload'].post.summary"
    update: "Generate data-link file upload URL"
  
  - target: "$.paths['/data-links/{dataLinkId}/upload'].post.description"
    update: "Creates a URL to upload files to the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload. See the `/upload/finish` endpoint."
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL WITH PATH ----
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/{dirPath}'].post.summary"
    update: "Generate data-link file upload URL at path"
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/{dirPath}'].post.description"
    update: "Creates a URL to upload files to the given `dirPath` in the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload. See the `/upload/finish/{dirPath}` endpoint."
  
  # ---- FINISH DATA-LINK FILE UPLOAD ----
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish'].post.summary"
    update: "Finish data-link file upload"
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish'].post.description"
    update: "Finalizes upload of a data-link file. This is required for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH DATA-LINK FILE UPLOAD WITH PATH ----
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish/{dirPath}'].post.summary"
    update: "Finish data-link file upload at path"
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish/{dirPath}'].post.description"
    update: "Finalizes upload of a data-link file at the given `dirPath`. This is required for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload/{dirPath}` endpoint."
  
  # ---- DEPRECATED ENDPOINT ----
  
  - target: "$.paths['/data-links/{dataLinkId}/download'].get.summary"
    update: "(Deprecated) Download data-link file"
  
  - target: "$.paths['/data-links/{dataLinkId}/download'].get.description"
    update: "**This endpoint is deprecated. See [Download data-link file at path](https://docs.seqera.io/platform-api/data-links#download-data-link-file-at-path) for the current endpoint.**\n\nDownloads the content of the data-link associated with the given `dataLinkId`."
```

### data-links-parameters-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- PATH PARAMETERS ----
  
  - target: "$.paths['/data-links/{dataLinkId}/browse'].get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse/{path}'].get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse/{path}'].get.parameters[?(@.name=='path')].description"
    update: "Directory path in the data-link to explore."
  
  - target: "$.paths['/data-links/{dataLinkId}/download/{filePath}'].get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/download/{filePath}'].get.parameters[?(@.name=='filePath')].description"
    update: "File path in the data-link to download."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload'].post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/{dirPath}'].post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/{dirPath}'].post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path in the data-link for upload."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish'].post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish/{dirPath}'].post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish/{dirPath}'].post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path in the data-link where upload was initiated."
  
  # ---- QUERY PARAMETERS ----
  
  - target: "$.paths['/data-links/{dataLinkId}/browse'].get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse'].get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse'].get.parameters[?(@.name=='search')].description"
    update: "Prefix search of data-link content."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse'].get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to fetch the next page of items."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse'].get.parameters[?(@.name=='pageSize')].description"
    update: "Number of items to return per page. If omitted, a default maximum value is returned."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse/{path}'].get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse/{path}'].get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse/{path}'].get.parameters[?(@.name=='search')].description"
    update: "Prefix search of data-link content."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse/{path}'].get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to fetch the next page of items."
  
  - target: "$.paths['/data-links/{dataLinkId}/browse/{path}'].get.parameters[?(@.name=='pageSize')].description"
    update: "Number of items to return per page. If omitted, a default maximum value is returned."
  
  - target: "$.paths['/data-links/{dataLinkId}/download/{filePath}'].get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/download/{filePath}'].get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload'].post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/{dirPath}'].post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/{dirPath}'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish'].post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish/{dirPath}'].post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish/{dirPath}'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- REQUEST BODY DESCRIPTIONS ----
  
  - target: "$.paths['/data-links/{dataLinkId}/upload'].post.requestBody.description"
    update: "Data-link file upload request"
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/{dirPath}'].post.requestBody.description"
    update: "Data-link file upload request"
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish'].post.requestBody.description"
    update: "Data-link file upload finalization request"
  
  - target: "$.paths['/data-links/{dataLinkId}/upload/finish/{dirPath}'].post.requestBody.description"
    update: "Data-link file upload finalization request"
```

## Workspaces

### workspaces-operations-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workspaces operations overlay
  version: 0.0.0
actions:
  # ===== WORKSPACES - OPERATIONS =====
  
  # ---- DELETE WORKSPACE USER ----
  
  - target: "$.paths['/orgs/{orgId}/workspaces/{workspaceId}/users/{userId}'].delete.summary"
    update: "Delete workspace user"
  
  - target: "$.paths['/orgs/{orgId}/workspaces/{workspaceId}/users/{userId}'].delete.description"
    update: "Deletes the given user (member or collaborator) from the given workspace."
```

### workspaces-parameters-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workspaces parameters overlay
  version: 0.0.0
actions:
  # ===== WORKSPACES PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- PATH PARAMETERS ----
  
  - target: "$.paths['/orgs/{orgId}/workspaces/{workspaceId}/users/{userId}'].delete.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."
  
  - target: "$.paths['/orgs/{orgId}/workspaces/{workspaceId}/users/{userId}'].delete.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/orgs/{orgId}/workspaces/{workspaceId}/users/{userId}'].delete.parameters[?(@.name=='userId')].description"
    update: "User numeric identifier."
```

## Pipeline Schemas

### pipeline-schemas-operations-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas operations overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS - OPERATIONS =====
  
  # ---- CREATE PIPELINE SCHEMA ----
  
  - target: "$.paths['/pipeline-schemas'].post.summary"
    update: "Create pipeline schema"
  
  - target: "$.paths['/pipeline-schemas'].post.description"
    update: "Creates a new pipeline schema in a user context. Append `?workspaceId` to create the schema in a workspace context."
```

### pipeline-schemas-parameters-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- QUERY PARAMETERS ----
  
  - target: "$.paths['/pipeline-schemas'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- REQUEST BODY DESCRIPTIONS ----
  
  - target: "$.paths['/pipeline-schemas'].post.requestBody.description"
    update: "Pipeline schema create request"
```

### pipeline-schemas-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CreatePipelineSchemaRequest ----
  
  - target: "$.components.schemas.CreatePipelineSchemaRequest.properties.content"
    update:
      type: string
      description: "Pipeline schema content in JSON format."
  
  # ---- CreatePipelineSchemaResponse ----
  
  - target: "$.components.schemas.CreatePipelineSchemaResponse.properties.pipelineSchema"
    update:
      $ref: "#/components/schemas/PipelineSchemaDbDto"
      description: "Pipeline schema details."
  
  # ---- PipelineSchemaDbDto ----
  
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

## Pipeline Versions

### pipeline-versions-operations-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions operations overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS - OPERATIONS =====
  
  # ---- LIST PIPELINE VERSIONS ----
  
  - target: "$.paths['/pipelines/{pipelineId}/versions'].get.summary"
    update: "List pipeline versions"
  
  - target: "$.paths['/pipelines/{pipelineId}/versions'].get.description"
    update: "Lists all available pipeline versions in a user context. Append `?workspaceId` to list pipeline versions in a workspace context."
  
  # ---- VALIDATE PIPELINE VERSION NAME ----
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/validate'].get.summary"
    update: "Validate pipeline version name"
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/validate'].get.description"
    update: "Confirms the validity of the given pipeline version `name` in a user context."
  
  # ---- UPDATE PIPELINE VERSION ----
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}'].post.summary"
    update: "Update pipeline version"
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}'].post.description"
    update: "Updates the details of the pipeline version identified by the given `pipelineId` and `versionId`. If `labelIds` is `null`, empty, or omitted, existing pipeline labels are removed. Include `labelIds: [<label-id-1>,<label-id-2>]` to override existing labels. Labels to be preserved must be included. To append a list of labels to multiple pipelines, use `/pipelines/labels/add`."
  
  # ---- MANAGE PIPELINE VERSION ----
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}/manage'].put.summary"
    update: "Update pipeline version name and default flag"
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}/manage'].put.description"
    update: "Updates a pipeline version's name and marks it as the default version. When setting a version as default, any previously default version is automatically unset. Version names cannot be changed if the version is already referenced by workflow runs."
```

### pipeline-versions-parameters-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- PATH PARAMETERS ----
  
  - target: "$.paths['/pipelines/{pipelineId}/versions'].get.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/validate'].get.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}'].post.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}'].post.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}/manage'].put.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}/manage'].put.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version identifier (Launch ID)."
  
  # ---- QUERY PARAMETERS ----
  
  - target: "$.paths['/pipelines/{pipelineId}/versions'].get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions'].get.parameters[?(@.name=='max')].description"
    update: "Maximum number of results to return. Default: `20`."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions'].get.parameters[?(@.name=='offset')].description"
    update: "Number of results to skip for pagination. Default: `0`."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions'].get.parameters[?(@.name=='search')].description"
    update: "Free-text search filter to match against pipeline version name."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions'].get.parameters[?(@.name=='isPublished')].description"
    update: "If `true`, retrieves published versions. If `false`, fetches draft versions."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/validate'].get.parameters[?(@.name=='name')].description"
    update: "Pipeline version name to validate."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/validate'].get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}'].post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}/manage'].put.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- REQUEST BODY DESCRIPTIONS ----
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}'].post.requestBody.description"
    update: "Pipeline version update request"
  
  - target: "$.paths['/pipelines/{pipelineId}/versions/{versionId}/manage'].put.requestBody.description"
    update: "Pipeline version manage request"
```

### pipeline-versions-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CreatePipelineVersionRequest ----
  
  - target: "$.components.schemas.CreatePipelineVersionRequest.properties.name"
    update:
      type: string
      description: "Pipeline version name. Maximum 255 characters."
  
  # ---- ListPipelineVersionsResponse ----
  
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
  
  # ---- PipelineVersionFullInfoDto ----
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.id"
    update:
      type: string
      description: "Pipeline version string identifier."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorUserId"
    update:
      type: integer
      format: int64
      description: "User numeric identifier of the pipeline version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorUserName"
    update:
      type: string
      description: "Username of the pipeline version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorFirstName"
    update:
      type: string
      description: "First name of the pipeline version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorLastName"
    update:
      type: string
      description: "Last name of the pipeline version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorAvatarUrl"
    update:
      type: string
      description: "Avatar URL of the pipeline version creator."
  
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
      description: "Pipeline version hash identifier."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.isDefault"
    update:
      type: boolean
      description: "If `true`, this is the default pipeline version."
  
  # ---- PipelineVersionManageRequest ----
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.name"
    update:
      type: string
      description: "New name for the pipeline version. Maximum 255 characters."
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.isDefault"
    update:
      type: boolean
      description: "If `true`, sets this version as the default pipeline version."
  
  # ---- PipelineMinInfoResponse ----
  
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
  
  # ---- PipelineMinInfoResponse.PipelineVersionMinInfoResponse ----
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.id"
    update:
      type: string
      description: "Pipeline version string identifier."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.name"
    update:
      type: string
      description: "Pipeline version name."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the pipeline version was created."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the pipeline version was last updated."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.hash"
    update:
      type: string
      description: "Pipeline version hash identifier."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.isDefault"
    update:
      type: boolean
      description: "If `true`, this is the default pipeline version."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.isDraftVersion"
    update:
      type: boolean
      description: "If `true`, this is a draft pipeline version."
```

## SSH Keys

### ssh-keys-operations-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys operations overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS - OPERATIONS =====
  
  # ---- LIST SSH KEYS ----
  
  - target: "$.paths['/ssh-keys'].get.summary"
    update: "List SSH keys"
  
  - target: "$.paths['/ssh-keys'].get.description"
    update: "Retrieves the list of all SSH public keys for the authenticated user."
  
  # ---- CREATE SSH KEY ----
  
  - target: "$.paths['/ssh-keys'].post.summary"
    update: "Create SSH key"
  
  - target: "$.paths['/ssh-keys'].post.description"
    update: "Creates a new SSH public key with the details in the given request body."
  
  # ---- VALIDATE SSH KEY ----
  
  - target: "$.paths['/ssh-keys/validate/key'].get.summary"
    update: "Validate SSH key"
  
  - target: "$.paths['/ssh-keys/validate/key'].get.description"
    update: "Confirms the availability of the given key for an SSH key in the user context."
  
  # ---- VALIDATE SSH KEY NAME ----
  
  - target: "$.paths['/ssh-keys/validate/name'].get.summary"
    update: "Validate SSH key name"
  
  - target: "$.paths['/ssh-keys/validate/name'].get.description"
    update: "Confirms the availability of the given name for an SSH key in the user context."
  
  # ---- DESCRIBE SSH KEY ----
  
  - target: "$.paths['/ssh-keys/{keyId}'].get.summary"
    update: "Describe SSH key"
  
  - target: "$.paths['/ssh-keys/{keyId}'].get.description"
    update: "Retrieves the details of an SSH public key by its ID."
  
  # ---- DELETE SSH KEY ----
  
  - target: "$.paths['/ssh-keys/{keyId}'].delete.summary"
    update: "Delete SSH key"
  
  - target: "$.paths['/ssh-keys/{keyId}'].delete.description"
    update: "Deletes the given SSH public key by its ID."
```

### ssh-keys-parameters-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys parameters overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- PATH PARAMETERS ----
  
  - target: "$.paths['/ssh-keys/{keyId}'].get.parameters[?(@.name=='keyId')].description"
    update: "SSH key numeric identifier."
  
  - target: "$.paths['/ssh-keys/{keyId}'].delete.parameters[?(@.name=='keyId')].description"
    update: "SSH key numeric identifier."
  
  # ---- QUERY PARAMETERS ----
  
  - target: "$.paths['/ssh-keys/validate/key'].get.parameters[?(@.name=='key')].description"
    update: "SSH public key to validate."
  
  - target: "$.paths['/ssh-keys/validate/name'].get.parameters[?(@.name=='name')].description"
    update: "SSH key name to validate."
  
  # ---- REQUEST BODY DESCRIPTIONS ----
  
  - target: "$.paths['/ssh-keys'].post.requestBody.description"
    update: "SSH key create request"
```

### ssh-keys-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys schemas overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CreateSshKeyRequest ----
  
  - target: "$.components.schemas.CreateSshKeyRequest.properties.name"
    update:
      type: string
      description: "SSH key name. Maximum 255 characters."
  
  - target: "$.components.schemas.CreateSshKeyRequest.properties.publicKey"
    update:
      type: string
      description: "SSH public key in OpenSSH format."
  
  # ---- CreateSshKeyResponse ----
  
  - target: "$.components.schemas.CreateSshKeyResponse.properties.sshKey"
    update:
      $ref: "#/components/schemas/UserSshPublicKeyDto"
      description: "SSH key details."
  
  # ---- DescribeSshKeyResponse ----
  
  - target: "$.components.schemas.DescribeSshKeyResponse.properties.sshKey"
    update:
      $ref: "#/components/schemas/UserSshPublicKeyDto"
      description: "SSH key details."
  
  # ---- ListSshKeysResponse ----
  
  - target: "$.components.schemas.ListSshKeysResponse.properties.sshKeys"
    update:
      type: array
      items:
        $ref: "#/components/schemas/UserSshPublicKeyDto"
      description: "Array of SSH keys."
  
  # ---- UserSshPublicKeyDto ----
  
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
      description: "SSH public key in OpenSSH format."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Timestamp when the SSH key was created."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.lastUsed"
    update:
      type: string
      format: date-time
      description: "Timestamp when the SSH key was last used. Can be `null`."
```

## Pipelines (Updates)

### pipelines-operations-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines operations overlay
  version: 0.0.0
actions:
  # ===== PIPELINES - OPERATIONS =====
  
  # ---- UPDATE PIPELINE (DEFAULT VERSION) ----
  
  - target: "$.paths['/pipelines/{pipelineId}'].put.summary"
    update: "Update pipeline (default version)"
  
  - target: "$.paths['/pipelines/{pipelineId}'].put.description"
    update: "Updates the default version of the pipeline identified by the given `pipelineId` with the provided values. Only supplied fields are modified."
```

### pipelines-parameters-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINES PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- QUERY PARAMETERS (NEW) ----
  
  - target: "$.paths['/pipelines/{pipelineId}/launch'].get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version identifier."
  
  - target: "$.paths['/pipelines/{pipelineId}/schema'].get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version identifier."
```

### pipelines-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINES SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CreatePipelineRequest ----
  
  - target: "$.components.schemas.CreatePipelineRequest.properties.version"
    update:
      $ref: "#/components/schemas/CreatePipelineVersionRequest"
      description: "Pipeline version details for creation."
  
  # ---- PipelineDbDto ----
  
  - target: "$.components.schemas.PipelineDbDto.properties.version"
    update:
      $ref: "#/components/schemas/PipelineVersionFullInfoDto"
      description: "Pipeline version full information."
```

## Workflows (Updates)

### workflows-operations-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows operations overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS - OPERATIONS =====
  
  # Note: No new operations, only parameter and schema changes
```

### workflows-parameters-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows parameters overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- QUERY PARAMETERS (NEW) ----
  
  - target: "$.paths['/workflow'].get.parameters[?(@.name=='includeTotalSize')].description"
    update: "If `true`, includes the total size in the response. Default: `false`."
```

### workflows-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- WorkflowMaxDbDto ----
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[0]"
    update:
      $ref: "#/components/schemas/WorkflowDbDto"
  
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
      description: "Path to the workflow log file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.outFile"
    update:
      type: string
      description: "Path to the workflow output file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.operationId"
    update:
      type: string
      description: "Operation identifier for the workflow."
  
  # ---- DescribeWorkflowResponse ----
  
  - target: "$.components.schemas.DescribeWorkflowResponse.properties.workflow"
    update:
      $ref: "#/components/schemas/WorkflowMaxDbDto"
      description: "Workflow details with extended metadata."
  
  - target: "$.components.schemas.DescribeWorkflowResponse.properties.pipelineInfo"
    update:
      $ref: "#/components/schemas/PipelineMinInfoResponse"
      description: "Pipeline minimal information associated with the workflow."
  
  # ---- ListWorkflowsResponse ----
  
  - target: "$.components.schemas.ListWorkflowsResponse.properties.hasMore"
    update:
      type: boolean
      description: "If `true`, additional workflows are available beyond the current page."
  
  # ---- ListWorkflowsResponse.ListWorkflowsElement ----
  
  - target: "$.components.schemas['ListWorkflowsResponse.ListWorkflowsElement'].properties.pipelineInfo"
    update:
      $ref: "#/components/schemas/PipelineMinInfoResponse"
      description: "Pipeline minimal information associated with the workflow."
  
  # ---- WorkflowLaunchRequest ----
  
  - target: "$.components.schemas.WorkflowLaunchRequest.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier."
  
  # ---- WorkflowLaunchResponse ----
  
  - target: "$.components.schemas.WorkflowLaunchResponse.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier."
  
  # ---- WorkflowLoad ----
  
  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered during workflow execution."
```

## Launch (Updates)

### launch-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Launch schemas overlay
  version: 0.0.0
actions:
  # ===== LAUNCH SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- LaunchDbDto ----
  
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
      description: "Pipeline repository path or URL."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workDir"
    update:
      type: string
      description: "Workflow working directory path."
  
  - target: "$.components.schemas.LaunchDbDto.properties.revision"
    update:
      type: string
      description: "Pipeline revision (branch, tag, or commit)."
  
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
      description: "Platform configuration text."
  
  - target: "$.components.schemas.LaunchDbDto.properties.paramsText"
    update:
      type: string
      description: "Pipeline parameters in YAML or JSON format."
  
  - target: "$.components.schemas.LaunchDbDto.properties.preRunScript"
    update:
      type: string
      description: "Script executed before the workflow launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.postRunScript"
    update:
      type: string
      description: "Script executed after the workflow completes."
  
  - target: "$.components.schemas.LaunchDbDto.properties.mainScript"
    update:
      type: string
      description: "Main workflow script name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.entryName"
    update:
      type: string
      description: "Workflow entry point name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.schemaName"
    update:
      type: string
      description: "Pipeline schema name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resume"
    update:
      type: boolean
      description: "If `true`, resumes execution from the last successful step."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resumeLaunchId"
    update:
      type: string
      description: "Launch identifier to resume from."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pullLatest"
    update:
      type: boolean
      description: "If `true`, pulls the latest pipeline version before execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.stubRun"
    update:
      type: boolean
      description: "If `true`, executes the workflow in stub mode."
  
  - target: "$.components.schemas.LaunchDbDto.properties.sessionId"
    update:
      type: string
      description: "Nextflow session identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.runName"
    update:
      type: string
      description: "Custom workflow run name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.configProfiles"
    update:
      type: array
      items:
        type: string
      description: "Array of Nextflow configuration profiles to apply."
  
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
      description: "Number of CPUs allocated to the head job."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobMemoryMb"
    update:
      type: integer
      format: int32
      description: "Memory in MB allocated to the head job."
  
  - target: "$.components.schemas.LaunchDbDto.properties.launchContainer"
    update:
      type: string
      description: "Container image for workflow launch."
  
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
      description: "Pipeline schema numeric identifier."
  
  # ---- ActionResponseDto ----
  
  - target: "$.components.schemas.ActionResponseDto.properties.launch"
    update:
      $ref: "#/components/schemas/LaunchDbDto"
      description: "Launch configuration details."
  
  # ---- DescribeLaunchResponse ----
  
  - target: "$.components.schemas.DescribeLaunchResponse.properties.launch"
    update:
      $ref: "#/components/schemas/LaunchDbDto"
      description: "Launch configuration details."
```

## Studios (Updates)

### studios-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Studios schemas overlay
  version: 0.0.0
actions:
  # ===== STUDIOS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- StudioSshDetailsDto ----
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.host"
    update:
      type: string
      description: "Hostname for SSH connection."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.port"
    update:
      type: integer
      format: int32
      description: "Port number for SSH connection."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.user"
    update:
      type: string
      description: "Username for SSH connection in the format `username@sessionId`."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.command"
    update:
      type: string
      description: "Full SSH command to execute for connection."
  
  # ---- DataStudioConfiguration ----
  
  - target: "$.components.schemas.DataStudioConfiguration.properties.sshEnabled"
    update:
      type: boolean
      nullable: true
      description: "If `true`, SSH access is enabled for the Data Studio. Can be `null`."
  
  # ---- DataStudioDto ----
  
  - target: "$.components.schemas.DataStudioDto.properties.sshDetails"
    update:
      nullable: true
      allOf:
        - $ref: "#/components/schemas/StudioSshDetailsDto"
      description: "SSH connection details for the Data Studio. Can be `null`."
```

## Tasks (Updates)

### tasks-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Tasks schemas overlay
  version: 0.0.0
actions:
  # ===== TASKS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- Task ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered during task execution."
  
  # ---- TraceProgressData ----
  
  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered during workflow execution."
```

## Organizations (Updates)

### organizations-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Organizations schemas overlay
  version: 0.0.0
actions:
  # ===== ORGANIZATIONS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- OrganizationQuotas ----
  
  - target: "$.components.schemas.OrganizationQuotas.properties.maxCustomRolesPerOrg"
    update:
      type: integer
      format: int64
      description: "Maximum number of custom roles allowed per organization."
```

## Compute Environment Schemas (Updates)

### compute-envs-schemas-overlay-1.108.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS - CONFIGURATION OBJECTS =====
  
  # ---- ComputeEnv.Status (New Enum Value) ----
  
  - target: "$.components.schemas['ComputeEnv.Status']"
    update:
      type: string
      enum:
        - CREATING
        - AVAILABLE
        - ERRORED
        - INVALID
        - DISABLED
      description: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `ERRORED`, `INVALID`, or `DISABLED`."
  
  # ---- SeqeraComputeCloudInstanceTypeSize ----
  
  - target: "$.components.schemas.SeqeraComputeCloudInstanceTypeSize"
    update:
      type: string
      enum:
        - SMALL
        - MEDIUM
        - LARGE
      description: "Size of the Data Studios instance. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
  
  # ---- SeqeraComputeConfig ----
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.instanceTypeSize"
    update:
      description: "Size of the Data Studios instance. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
      allOf:
        - $ref: "#/components/schemas/SeqeraComputeCloudInstanceTypeSize"
  
  # ---- DataStudioStopReason (New Enum Value) ----
  
  - target: "$.components.schemas.DataStudioStopReason"
    update:
      type: string
      enum:
        - USER_REQUEST
        - TIMEOUT
        - ERROR
        - SYSTEM
        - NO_STATS_AVAIL
      description: "Reason for Data Studio stop. Accepts `USER_REQUEST`, `TIMEOUT`, `ERROR`, `SYSTEM`, or `NO_STATS_AVAIL`."
  
  # ---- WorkflowQueryAttribute (Updated Enum) ----
  
  - target: "$.components.schemas.WorkflowQueryAttribute"
    update:
      type: string
      enum:
        - labels
        - optimizationStatus
        - optimizationProgress
        - progressLength
        - pipelineInfo
      x-enum-varnames:
        - labels
        - optimizationStatus
        - optimizationProgress
        - progressLength
        - pipelineInfo
      description: "Workflow query attributes. Accepts `labels`, `optimizationStatus`, `optimizationProgress`, `progressLength`, or `pipelineInfo`."
```

---

These overlay files follow all the standards and patterns specified in the documentation guidelines. They are organized by feature/controller, use exact standard descriptions for common parameters, follow sentence case for summaries without periods, use full sentences with periods for descriptions, and follow the verb-entity pattern for operations.
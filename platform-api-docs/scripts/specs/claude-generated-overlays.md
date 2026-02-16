I'll generate the OpenAPI overlay files for version 1.110.0, organized by feature/controller. Let me create comprehensive overlays following the Seqera documentation standards.

# Compute Environments Overlays

## compute-envs-operations-overlay-1.110.0.yaml

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

## compute-envs-parameters-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS PARAMETERS =====
  
  # ---- DISABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.requestBody.description"
    update: "Empty request body"
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.requestBody.description"
    update: "Empty request body"
```

## compute-envs-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS =====
  
  # ---- COMPUTE ENVIRONMENT RESPONSE ----
  
  - target: "$.components.schemas.ComputeEnvResponseDto.properties.awsAccountId"
    update:
      type: string
      nullable: true
      description: "AWS account identifier associated with the compute environment. Can be `null`."
  
  # ---- COMPUTE ENVIRONMENT STATUS ENUM ----
  
  - target: "$.components.schemas['ComputeEnv.Status'].description"
    update: "Compute environment status. Accepts `AVAILABLE`, `CREATING`, `ERRORED`, `INVALID`, or `DISABLED`."
```

---

# Credentials Overlays

## credentials-operations-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials operations overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS - OPERATIONS =====
  
  # ---- CREATE CREDENTIALS (MODIFIED) ----
  
  - target: "$.paths./credentials.post.description"
    update: "Creates new credentials in a user context. Append `?workspaceId` to create the credentials in a workspace context. For AWS credentials with IAM Role ARN, append `?useExternalId=true` to generate a Platform-managed External ID."
  
  # ---- UPDATE CREDENTIALS (MODIFIED) ----
  
  - target: "$.paths./credentials/{credentialsId}.put.description"
    update: "Updates the details of the credentials identified by the given `credentialsId`. For AWS credentials with IAM Role ARN, append `?useExternalId=true` to generate a Platform-managed External ID."
  
  # ---- GET ENCRYPTED CREDENTIALS ----
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.summary"
    update: "Get encrypted credentials"
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.description"
    update: "Retrieves the encrypted keys for the credentials identified by the given `credentialsId`."
```

## credentials-parameters-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials parameters overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS PARAMETERS =====
  
  # ---- CREATE CREDENTIALS ----
  
  - target: "$.paths./credentials.post.parameters[?(@.name=='useExternalId')].description"
    update: "If `true`, generates a Platform-managed External ID for AWS credentials. Requires IAM Role ARN. Default: `false`."
  
  # ---- UPDATE CREDENTIALS ----
  
  - target: "$.paths./credentials/{credentialsId}.put.parameters[?(@.name=='useExternalId')].description"
    update: "If `true`, generates a Platform-managed External ID for AWS credentials. Requires IAM Role ARN. Default: `false`."
  
  # ---- GET ENCRYPTED CREDENTIALS ----
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.parameters[?(@.name=='pairingId')].description"
    update: "Encryption key string identifier."
```

## credentials-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS SCHEMAS =====
  
  # ---- GET CREDENTIALS KEYS RESPONSE ----
  
  - target: "$.components.schemas.GetCredentialsKeysResponse.properties.keys"
    update:
      type: string
      description: "Encrypted credentials keys in string format."
  
  # ---- AWS SECURITY KEYS ----
  
  - target: "$.components.schemas.AwsSecurityKeys.properties.externalId"
    update:
      type: string
      description: "Platform-managed External ID for AWS IAM Role ARN authentication. Generated when `useExternalId=true` is specified during credentials creation or update."
  
  # ---- GIT KEYS ----
  
  - target: "$.components.schemas.GitKeys.properties.discriminator"
    update:
      type: string
      description: "Property to select the Git credentials type."
  
  - target: "$.components.schemas.GitKeys.properties.username"
    update:
      type: string
      description: "Git username for authentication."
  
  - target: "$.components.schemas.GitKeys.properties.password"
    update:
      type: string
      description: "Git password for authentication."
  
  - target: "$.components.schemas.GitKeys.properties.token"
    update:
      type: string
      description: "Git personal access token for authentication."
```

---

# Data Links Overlays

## data-links-operations-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data links operations overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS - OPERATIONS =====
  
  # ---- EXPLORE DATA-LINK (MODIFIED) ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.summary"
    update: "Explore data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.description"
    update: "Retrieves the content of the data-link associated with the given `dataLinkId`."
  
  # ---- EXPLORE DATA-LINK WITH PATH (MODIFIED) ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.summary"
    update: "Explore data-link at path"
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.description"
    update: "Retrieves the content at the specified `path` within the data-link associated with the given `dataLinkId`."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the content at the given `filePath` in the data-link associated with the given `dataLinkId`."
  
  # ---- GENERATE UPLOAD URL (MODIFIED) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Creates a URL to upload files to the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload. See the `/upload/finish` endpoint."
  
  # ---- GENERATE UPLOAD URL WITH PATH (MODIFIED) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link upload URL with directory path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Creates a URL to upload files to the specified `dirPath` within the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload. See the `/upload/finish` endpoint."
  
  # ---- FINISH UPLOAD (MODIFIED) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finalizes upload of a data-link file. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH UPLOAD WITH PATH (MODIFIED) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link upload with directory path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finalizes upload of a data-link file at the specified `dirPath`. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered."
```

## data-links-parameters-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS PARAMETERS =====
  
  # ---- EXPLORE DATA-LINK ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='search')].description"
    update: "Prefix search filter to match against data-link content names."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to fetch the next page of results for pagination."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='pageSize')].description"
    update: "Number of items to return per page. If omitted, a default maximum value is returned."
  
  # ---- EXPLORE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='path')].description"
    update: "Resource path within the data-link to explore."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='search')].description"
    update: "Prefix search filter to match against data-link content names."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to fetch the next page of results for pagination."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='pageSize')].description"
    update: "Number of items to return per page. If omitted, a default maximum value is returned."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='filePath')].description"
    update: "Resource path within the data-link to the file to download."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- GENERATE UPLOAD URL ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS requests."
  
  # ---- GENERATE UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory resource path within the data-link where files will be uploaded."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS requests."
  
  # ---- FINISH UPLOAD ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.requestBody.description"
    update: "Upload completion request"
  
  # ---- FINISH UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory resource path within the data-link where files were uploaded."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Upload completion request"
```

---

# Pipeline Schemas Overlays

## pipeline-schemas-operations-overlay-1.110.0.yaml

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

## pipeline-schemas-parameters-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS PARAMETERS =====
  
  # ---- CREATE PIPELINE SCHEMA ----
  
  - target: "$.paths./pipeline-schemas.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipeline-schemas.post.requestBody.description"
    update: "Pipeline schema create request"
```

## pipeline-schemas-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS SCHEMAS =====
  
  # ---- CREATE PIPELINE SCHEMA REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineSchemaRequest.properties.content"
    update:
      type: string
      description: "Pipeline schema content in JSON format."
  
  # ---- CREATE PIPELINE SCHEMA RESPONSE ----
  
  - target: "$.components.schemas.CreatePipelineSchemaResponse.properties.pipelineSchema"
    update:
      $ref: "#/components/schemas/PipelineSchemaDbDto"
      description: "Created pipeline schema object with assigned identifier."
  
  # ---- PIPELINE SCHEMA DTO ----
  
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

## pipeline-versions-operations-overlay-1.110.0.yaml

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
    update: "Confirms the validity and availability of the given pipeline version `name` in a user context."
  
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

## pipeline-versions-parameters-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS PARAMETERS =====
  
  # ---- LIST PIPELINE VERSIONS ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='max')].description"
    update: "Maximum number of results to return. Default: `20`."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='offset')].description"
    update: "Number of results to skip for pagination. Default: `0`."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='search')].description"
    update: "Free-text search filter to match against pipeline version names."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='isPublished')].description"
    update: "If `true`, retrieves published versions. If `false`, retrieves draft versions. Omit to retrieve all versions."
  
  # ---- VALIDATE PIPELINE VERSION NAME ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.parameters[?(@.name=='name')].description"
    update: "Pipeline version name to validate for uniqueness and format."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- UPDATE PIPELINE VERSION ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}.post.requestBody.description"
    update: "Pipeline version update request"
  
  # ---- MANAGE PIPELINE VERSION ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier (Launch ID)."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.requestBody.description"
    update: "Pipeline version management request"
```

## pipeline-versions-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS SCHEMAS =====
  
  # ---- CREATE PIPELINE VERSION REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineVersionRequest.properties.name"
    update:
      type: string
      description: "Pipeline version name. Must be unique within the pipeline."
  
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
  
  # ---- PIPELINE VERSION FULL INFO ----
  
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
      description: "Pipeline version creation timestamp in ISO 8601 format."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Pipeline version last update timestamp in ISO 8601 format."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.hash"
    update:
      type: string
      description: "Pipeline version content hash."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.isDefault"
    update:
      type: boolean
      description: "If `true`, this is the default pipeline version."
  
  # ---- PIPELINE VERSION MANAGE REQUEST ----
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.name"
    update:
      type: string
      description: "New name for the pipeline version. Cannot be changed if the version is referenced by workflow runs."
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.isDefault"
    update:
      type: boolean
      description: "If `true`, sets this version as the default. Automatically unsets any previously default version."
  
  # ---- PIPELINE MIN INFO ----
  
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
  
  # ---- PIPELINE VERSION MIN INFO ----
  
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
      description: "Pipeline version creation timestamp in ISO 8601 format."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Pipeline version last update timestamp in ISO 8601 format."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.hash"
    update:
      type: string
      description: "Pipeline version content hash."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.isDefault"
    update:
      type: boolean
      description: "If `true`, this is the default pipeline version."
  
  - target: "$.components.schemas['PipelineMinInfoResponse.PipelineVersionMinInfoResponse'].properties.isDraftVersion"
    update:
      type: boolean
      description: "If `true`, this is a draft version not yet published."
```

---

# SSH Keys Overlays

## ssh-keys-operations-overlay-1.110.0.yaml

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
    update: "Confirms the validity and uniqueness of the given SSH key for the authenticated user."
  
  # ---- VALIDATE SSH KEY NAME ----
  
  - target: "$.paths./ssh-keys/validate/name.get.summary"
    update: "Validate SSH key name"
  
  - target: "$.paths./ssh-keys/validate/name.get.description"
    update: "Confirms the availability of the given SSH key name for the authenticated user."
  
  # ---- DESCRIBE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.get.summary"
    update: "Get SSH key details"
  
  - target: "$.paths./ssh-keys/{keyId}.get.description"
    update: "Retrieves the details of an SSH public key identified by the given `keyId`."
  
  # ---- DELETE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.delete.summary"
    update: "Delete SSH key"
  
  - target: "$.paths./ssh-keys/{keyId}.delete.description"
    update: "Permanently deletes the SSH public key identified by the given `keyId`. This action cannot be undone."
```

## ssh-keys-parameters-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys parameters overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS PARAMETERS =====
  
  # ---- CREATE SSH KEY ----
  
  - target: "$.paths./ssh-keys.post.requestBody.description"
    update: "SSH key create request"
  
  # ---- VALIDATE SSH KEY ----
  
  - target: "$.paths./ssh-keys/validate/key.get.parameters[?(@.name=='key')].description"
    update: "SSH public key string to validate for format and uniqueness."
  
  # ---- VALIDATE SSH KEY NAME ----
  
  - target: "$.paths./ssh-keys/validate/name.get.parameters[?(@.name=='name')].description"
    update: "SSH key name to validate for availability."
  
  # ---- DESCRIBE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.get.parameters[?(@.name=='keyId')].description"
    update: "SSH key numeric identifier."
  
  # ---- DELETE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.delete.parameters[?(@.name=='keyId')].description"
    update: "SSH key numeric identifier."
```

## ssh-keys-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys schemas overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS SCHEMAS =====
  
  # ---- CREATE SSH KEY REQUEST ----
  
  - target: "$.components.schemas.CreateSshKeyRequest.properties.name"
    update:
      type: string
      description: "SSH key name. Must be unique for the user."
  
  - target: "$.components.schemas.CreateSshKeyRequest.properties.publicKey"
    update:
      type: string
      description: "SSH public key in OpenSSH format."
  
  # ---- CREATE SSH KEY RESPONSE ----
  
  - target: "$.components.schemas.CreateSshKeyResponse.properties.sshKey"
    update:
      $ref: "#/components/schemas/UserSshPublicKeyDto"
      description: "Created SSH key object with assigned identifier."
  
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
      description: "Array of SSH key objects for the authenticated user."
  
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
      description: "SSH public key in OpenSSH format."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "SSH key creation timestamp in ISO 8601 format."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.lastUsed"
    update:
      type: string
      format: date-time
      description: "SSH key last usage timestamp in ISO 8601 format. Can be `null` if never used."
```

---

# Workspaces Overlays

## workspaces-operations-overlay-1.110.0.yaml

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
    update: "Removes the given user (member or collaborator) from the specified workspace. This action cannot be undone."
```

## workspaces-parameters-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workspaces parameters overlay
  version: 0.0.0
actions:
  # ===== WORKSPACES PARAMETERS =====
  
  # ---- DELETE WORKSPACE USER ----
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='userId')].description"
    update: "User numeric identifier."
```

## workspaces-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workspaces schemas overlay
  version: 0.0.0
actions:
  # ===== WORKSPACES SCHEMAS =====
  
  # ---- DATA STUDIO WORKSPACE SETTINGS REQUEST ----
  
  - target: "$.components.schemas.DataStudioWorkspaceSettingsRequest.properties.lifespanHours"
    update:
      type: integer
      format: int32
      minimum: 0
      description: "Maximum lifespan for Data Studios in hours. Must be a non-negative integer."
  
  - target: "$.components.schemas.DataStudioWorkspaceSettingsRequest.properties.containerRepository"
    update:
      type: string
      nullable: true
      description: "Container repository for Data Studio images. Can be `null`."
  
  - target: "$.components.schemas.DataStudioWorkspaceSettingsRequest.properties.privateStudioByDefault"
    update:
      type: boolean
      description: "If `true`, new Data Studios are private by default. Default: `false`."
  
  # ---- DATA STUDIO WORKSPACE SETTINGS RESPONSE ----
  
  - target: "$.components.schemas.DataStudioWorkspaceSettingsResponse.properties.privateStudioByDefault"
    update:
      type: boolean
      description: "If `true`, new Data Studios are private by default."
```

---

# Additional Modified Endpoints Overlays

## pipelines-operations-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines operations overlay
  version: 0.0.0
actions:
  # ===== PIPELINES - OPERATIONS =====
  
  # ---- UPDATE PIPELINE (MODIFIED) ----
  
  - target: "$.paths./pipelines/{pipelineId}.put.summary"
    update: "Update pipeline default version"
  
  - target: "$.paths./pipelines/{pipelineId}.put.description"
    update: "Updates the default version and other details of the pipeline identified by the given `pipelineId`. **Note**: If `labelIds` is `null`, empty, or omitted, existing pipeline labels are removed. Include `labelIds: [<label-id-1>,<label-id-2>]` to override existing labels. Labels to be preserved must be included."
```

## pipelines-parameters-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINES PARAMETERS =====
  
  # ---- PIPELINE LAUNCH (MODIFIED) ----
  
  - target: "$.paths./pipelines/{pipelineId}/launch.get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier. If omitted, uses the default pipeline version."
  
  # ---- PIPELINE SCHEMA (MODIFIED) ----
  
  - target: "$.paths./pipelines/{pipelineId}/schema.get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version string identifier. If omitted, retrieves schema for the default pipeline version."
```

## pipelines-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINES SCHEMAS =====
  
  # ---- CREATE PIPELINE REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineRequest.properties.version"
    update:
      $ref: "#/components/schemas/CreatePipelineVersionRequest"
      description: "Initial pipeline version details."
  
  # ---- PIPELINE DB DTO ----
  
  - target: "$.components.schemas.PipelineDbDto.properties.version"
    update:
      $ref: "#/components/schemas/PipelineVersionFullInfoDto"
      description: "Current pipeline version details."
```

---

# Workflows Overlays

## workflows-parameters-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows parameters overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS PARAMETERS =====
  
  # ---- LIST WORKFLOWS (MODIFIED) ----
  
  - target: "$.paths./workflow.get.parameters[?(@.name=='includeTotalSize')].description"
    update: "If `true`, includes the total count of workflows in the response. Default: `false`."
```

## workflows-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS SCHEMAS =====
  
  # ---- WORKFLOW MAX DB DTO ----
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.fusion"
    update:
      $ref: "#/components/schemas/WfFusionMeta"
      description: "Fusion file system metadata for the workflow."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.wave"
    update:
      $ref: "#/components/schemas/WfWaveMeta"
      description: "Wave container provisioning metadata for the workflow."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.logFile"
    update:
      type: string
      description: "Resource path to the workflow log file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.outFile"
    update:
      type: string
      description: "Resource path to the workflow output file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.allOf[1].properties.operationId"
    update:
      type: string
      description: "Operation identifier for the workflow execution."
  
  # ---- WORKFLOW LAUNCH REQUEST ----
  
  - target: "$.components.schemas.WorkflowLaunchRequest.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier to validate workflow parameters against."
  
  # ---- WORKFLOW LAUNCH RESPONSE ----
  
  - target: "$.components.schemas.WorkflowLaunchResponse.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier used for parameter validation."
  
  # ---- LIST WORKFLOWS RESPONSE ----
  
  - target: "$.components.schemas.ListWorkflowsResponse.properties.hasMore"
    update:
      type: boolean
      description: "If `true`, additional workflow results are available for pagination."
  
  - target: "$.components.schemas['ListWorkflowsResponse.ListWorkflowsElement'].properties.pipelineInfo"
    update:
      $ref: "#/components/schemas/PipelineMinInfoResponse"
      description: "Minimal pipeline information associated with the workflow."
  
  # ---- DESCRIBE WORKFLOW RESPONSE ----
  
  - target: "$.components.schemas.DescribeWorkflowResponse.properties.pipelineInfo"
    update:
      $ref: "#/components/schemas/PipelineMinInfoResponse"
      description: "Minimal pipeline information associated with the workflow."
  
  # ---- WORKFLOW LOAD ----
  
  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered during workflow execution."
  
  # ---- TRACE PROGRESS DATA ----
  
  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered."
  
  # ---- TASK ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered during task execution."
```

---

# Launch Overlays

## launch-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Launch schemas overlay
  version: 0.0.0
actions:
  # ===== LAUNCH SCHEMAS =====
  
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
      description: "Compute environment configuration for the launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pipeline"
    update:
      type: string
      description: "Pipeline repository URL or identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workDir"
    update:
      type: string
      description: "Working directory resource path for the launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.revision"
    update:
      type: string
      description: "Pipeline revision (branch, tag, or commit hash)."
  
  - target: "$.components.schemas.LaunchDbDto.properties.commitId"
    update:
      type: string
      description: "Git commit identifier for the pipeline revision."
  
  - target: "$.components.schemas.LaunchDbDto.properties.configText"
    update:
      type: string
      description: "Nextflow configuration text content."
  
  - target: "$.components.schemas.LaunchDbDto.properties.towerConfig"
    update:
      type: string
      description: "Platform-specific configuration content."
  
  - target: "$.components.schemas.LaunchDbDto.properties.paramsText"
    update:
      type: string
      description: "Pipeline parameters in YAML or JSON format."
  
  - target: "$.components.schemas.LaunchDbDto.properties.preRunScript"
    update:
      type: string
      description: "Script that executes before the pipeline launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after the pipeline completes."
  
  - target: "$.components.schemas.LaunchDbDto.properties.mainScript"
    update:
      type: string
      description: "Main pipeline script filename."
  
  - target: "$.components.schemas.LaunchDbDto.properties.entryName"
    update:
      type: string
      description: "Pipeline entry point name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.schemaName"
    update:
      type: string
      description: "Pipeline schema name for parameter validation."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resume"
    update:
      type: boolean
      description: "If `true`, enables Nextflow resume functionality."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resumeLaunchId"
    update:
      type: string
      description: "Launch identifier to resume from."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pullLatest"
    update:
      type: boolean
      description: "If `true`, pulls the latest pipeline version."
  
  - target: "$.components.schemas.LaunchDbDto.properties.stubRun"
    update:
      type: boolean
      description: "If `true`, executes pipeline in stub mode."
  
  - target: "$.components.schemas.LaunchDbDto.properties.sessionId"
    update:
      type: string
      description: "Nextflow session identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.runName"
    update:
      type: string
      description: "Custom name for the workflow run."
  
  - target: "$.components.schemas.LaunchDbDto.properties.configProfiles"
    update:
      type: array
      items:
        type: string
      description: "Array of Nextflow configuration profile names to activate."
  
  - target: "$.components.schemas.LaunchDbDto.properties.userSecrets"
    update:
      type: array
      items:
        type: string
      description: "Array of user secret names to make available to the workflow."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workspaceSecrets"
    update:
      type: array
      items:
        type: string
      description: "Array of workspace secret names to make available to the workflow."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationId"
    update:
      type: string
      description: "Resource optimization configuration identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationTargets"
    update:
      type: string
      description: "Resource optimization targets configuration."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobCpus"
    update:
      type: integer
      format: int32
      description: "Number of CPUs allocated for the head job."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobMemoryMb"
    update:
      type: integer
      format: int32
      description: "Memory allocated for the head job in megabytes."
  
  - target: "$.components.schemas.LaunchDbDto.properties.launchContainer"
    update:
      type: string
      description: "Container image for the launch environment."
  
  - target: "$.components.schemas.LaunchDbDto.properties.dateCreated"
    update:
      type: string
      format: date-time
      description: "Launch creation timestamp in ISO 8601 format."
  
  - target: "$.components.schemas.LaunchDbDto.properties.lastUpdated"
    update:
      type: string
      format: date-time
      description: "Launch last update timestamp in ISO 8601 format."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pipelineSchemaId"
    update:
      type: integer
      format: int64
      description: "Pipeline schema numeric identifier for parameter validation."
  
  # ---- ACTION RESPONSE DTO ----
  
  - target: "$.components.schemas.ActionResponseDto.properties.launch"
    update:
      $ref: "#/components/schemas/LaunchDbDto"
      description: "Launch configuration associated with the action."
  
  # ---- DESCRIBE LAUNCH RESPONSE ----
  
  - target: "$.components.schemas.DescribeLaunchResponse.properties.launch"
    update:
      $ref: "#/components/schemas/LaunchDbDto"
      description: "Launch configuration details."
```

---

# Data Studios Overlays

## studios-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data Studios schemas overlay
  version: 0.0.0
actions:
  # ===== DATA STUDIOS SCHEMAS =====
  
  # ---- STUDIO SSH DETAILS DTO ----
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.host"
    update:
      type: string
      description: "SSH hostname to connect to the Data Studio."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.port"
    update:
      type: integer
      format: int32
      description: "SSH port number for the Data Studio connection."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.user"
    update:
      type: string
      description: "SSH username in the format `username@sessionId`."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.command"
    update:
      type: string
      description: "Full SSH command to execute for connecting to the Data Studio."
  
  # ---- DATA STUDIO DTO ----
  
  - target: "$.components.schemas.DataStudioDto.properties.sshDetails"
    update:
      nullable: true
      allOf:
        - $ref: "#/components/schemas/StudioSshDetailsDto"
      description: "SSH connection details for the Data Studio. Can be `null` if SSH is not enabled."
  
  # ---- DATA STUDIO CONFIGURATION ----
  
  - target: "$.components.schemas.DataStudioConfiguration.properties.sshEnabled"
    update:
      type: boolean
      nullable: true
      description: "If `true`, SSH access is enabled for the Data Studio. Can be `null`."
  
  # ---- DATA STUDIO STOP REASON ----
  
  - target: "$.components.schemas.DataStudioStopReason.description"
    update: "Reason for Data Studio termination. Accepts `USER_STOPPED`, `TIMEOUT`, `ERROR`, `WORKSPACE_DELETED`, or `NO_STATS_AVAIL`."
```

---

# Compute Config Schemas Overlays

## compute-configs-schemas-overlay-1.110.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute configurations schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE CONFIGURATIONS SCHEMAS =====
  
  # ---- COMMON PROPERTIES (ALL CONFIGS) ----
  
  # LSF Compute Config
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Launch directory for the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName"
    update:
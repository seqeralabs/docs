I'll generate the OpenAPI overlay files for Seqera Platform API version 1.111.0, organized by feature/controller.

# Compute Environments Overlays

## compute-envs-operations-overlay-1.111.0.yaml

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

## compute-envs-parameters-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- DISABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.requestBody.description"
    update: "Compute environment disable request"
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.requestBody.description"
    update: "Compute environment enable request"
```

## compute-envs-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- COMPUTE ENVIRONMENT STATUS ENUM ----
  
  - target: "$.components.schemas.ComputeEnv.Status.description"
    update: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `ERRORED`, or `DISABLED`."
  
  # ---- COMPUTE ENVIRONMENT RESPONSE DTO ----
  
  - target: "$.components.schemas.ComputeEnvResponseDto.properties.awsAccountId.description"
    update: "AWS account identifier associated with the compute environment. Can be `null`."
```

---

# Credentials Overlays

## credentials-operations-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials operations overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS - OPERATIONS =====
  
  # ---- CREATE CREDENTIALS ----
  
  - target: "$.paths./credentials.post.description"
    update: "Creates new credentials in a user context. Append `?workspaceId` to create the credentials in a workspace context. For AWS credentials with IAM Role ARN, append `?useExternalId=true` to generate a Platform-managed External ID."
  
  # ---- UPDATE CREDENTIALS ----
  
  - target: "$.paths./credentials/{credentialsId}.put.description"
    update: "Updates the details of the credentials identified by the given `credentialsId`. For AWS credentials with IAM Role ARN, append `?useExternalId=true` to generate a Platform-managed External ID."
  
  # ---- GET ENCRYPTED CREDENTIALS ----
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.summary"
    update: "Get encrypted credentials"
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.description"
    update: "Retrieves the encrypted keys for the credentials identified by the given `credentialsId`."
```

## credentials-parameters-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials parameters overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- CREATE CREDENTIALS ----
  
  - target: "$.paths./credentials.post.parameters[?(@.name=='useExternalId')].description"
    update: "If true, generates a Platform-managed External ID for AWS credentials with IAM Role ARN. Default: `false`."
  
  # ---- UPDATE CREDENTIALS ----
  
  - target: "$.paths./credentials/{credentialsId}.put.parameters[?(@.name=='useExternalId')].description"
    update: "If true, generates a Platform-managed External ID for AWS credentials with IAM Role ARN. Default: `false`."
  
  # ---- GET ENCRYPTED CREDENTIALS ----
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./credentials/{credentialsId}/keys.get.parameters[?(@.name=='pairingId')].description"
    update: "Encryption key string identifier."
```

## credentials-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- AWS SECURITY KEYS ----
  
  - target: "$.components.schemas.AwsSecurityKeys.properties.externalId.description"
    update: "Platform-managed External ID for AWS IAM Role ARN authentication. Generated when `useExternalId=true` is specified during credential creation or update."
  
  # ---- GET CREDENTIALS KEYS RESPONSE ----
  
  - target: "$.components.schemas.GetCredentialsKeysResponse.properties.keys.description"
    update: "Encrypted credentials keys in string format."
  
  # ---- GIT KEYS ----
  
  - target: "$.components.schemas.GitKeys.properties.discriminator.description"
    update: "Property to select the credentials provider type."
  
  - target: "$.components.schemas.GitKeys.properties.username.description"
    update: "Git username for authentication."
  
  - target: "$.components.schemas.GitKeys.properties.password.description"
    update: "Git password for authentication."
  
  - target: "$.components.schemas.GitKeys.properties.token.description"
    update: "Git personal access token for authentication."
```

---

# Data Links Overlays

## data-links-operations-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data links operations overlay
  version: 0.0.0
actions:
  # ===== DATA LINKS - OPERATIONS =====
  
  # ---- EXPLORE DATA-LINK (BROWSE) ----
  
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
    update: "Creates a URL to upload files to the given `dirPath` in the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload."
  
  # ---- FINISH UPLOAD ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link file upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finish upload of a data-link file. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link file upload at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finish upload of a data-link file at the given `dirPath`. This is necessary for AWS S3 data-links to finalize a successful file upload, or abort an upload if an error was encountered."
```

## data-links-parameters-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA LINKS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- EXPLORE DATA-LINK (BROWSE) ----
  
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
  
  # ---- EXPLORE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='path')].description"
    update: "Path within the data-link to explore."
  
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
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='filePath')].description"
    update: "File path within the data-link to download."
  
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
    update: "Origin header for CORS validation. Can be `null`."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.requestBody.description"
    update: "Data-link upload URL generation request"
  
  # ---- GENERATE UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS validation. Can be `null`."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.requestBody.description"
    update: "Data-link upload URL generation request"
  
  # ---- FINISH UPLOAD ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.requestBody.description"
    update: "Data-link upload finish request"
  
  # ---- FINISH UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link upload finish request"
```

---

# Workspaces Overlays

## workspaces-operations-overlay-1.111.0.yaml

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

## workspaces-parameters-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workspaces parameters overlay
  version: 0.0.0
actions:
  # ===== WORKSPACES PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- DELETE WORKSPACE USER ----
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='orgId')].description"
    update: "Organization numeric identifier."
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./orgs/{orgId}/workspaces/{workspaceId}/users/{userId}.delete.parameters[?(@.name=='userId')].description"
    update: "User numeric identifier."
```

## workspaces-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workspaces schemas overlay
  version: 0.0.0
actions:
  # ===== WORKSPACES SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- DATA STUDIO WORKSPACE SETTINGS REQUEST ----
  
  - target: "$.components.schemas.DataStudioWorkspaceSettingsRequest.properties.lifespanHours.description"
    update: "Data Studio session lifespan in hours. Must be greater than or equal to 0."
  
  - target: "$.components.schemas.DataStudioWorkspaceSettingsRequest.properties.containerRepository.description"
    update: "Container repository for Data Studio images. Can be `null`."
  
  - target: "$.components.schemas.DataStudioWorkspaceSettingsRequest.properties.privateStudioByDefault.description"
    update: "If true, new Data Studio sessions are private by default."
  
  # ---- DATA STUDIO WORKSPACE SETTINGS RESPONSE ----
  
  - target: "$.components.schemas.DataStudioWorkspaceSettingsResponse.properties.privateStudioByDefault.description"
    update: "If true, new Data Studio sessions are private by default."
```

---

# Pipeline Schemas Overlays

## pipeline-schemas-operations-overlay-1.111.0.yaml

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

## pipeline-schemas-parameters-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- CREATE PIPELINE SCHEMA ----
  
  - target: "$.paths./pipeline-schemas.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipeline-schemas.post.requestBody.description"
    update: "Pipeline schema create request"
```

## pipeline-schemas-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline schemas schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SCHEMAS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CREATE PIPELINE SCHEMA REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineSchemaRequest.properties.content.description"
    update: "Pipeline schema content in JSON format."
  
  # ---- CREATE PIPELINE SCHEMA RESPONSE ----
  
  - target: "$.components.schemas.CreatePipelineSchemaResponse.properties.pipelineSchema.description"
    update: "Created pipeline schema details."
  
  # ---- PIPELINE SCHEMA DB DTO ----
  
  - target: "$.components.schemas.PipelineSchemaDbDto.properties.id.description"
    update: "Pipeline schema numeric identifier."
  
  - target: "$.components.schemas.PipelineSchemaDbDto.properties.content.description"
    update: "Pipeline schema content in JSON format."
```

---

# Pipeline Versions Overlays

## pipeline-versions-operations-overlay-1.111.0.yaml

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

## pipeline-versions-parameters-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
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
    update: "Free-text search filter to match against version name."
  
  - target: "$.paths./pipelines/{pipelineId}/versions.get.parameters[?(@.name=='isPublished')].description"
    update: "If true, retrieves published versions. If false, retrieves draft versions."
  
  # ---- VALIDATE PIPELINE VERSION NAME ----
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.parameters[?(@.name=='pipelineId')].description"
    update: "Pipeline numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/validate.get.parameters[?(@.name=='name')].description"
    update: "Pipeline version name to validate."
  
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
    update: "Pipeline version identifier (Launch ID)."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./pipelines/{pipelineId}/versions/{versionId}/manage.put.requestBody.description"
    update: "Pipeline version manage request"
```

## pipeline-versions-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipeline versions schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINE VERSIONS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CREATE PIPELINE VERSION REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineVersionRequest.properties.name.description"
    update: "Pipeline version name. Maximum 255 characters."
  
  # ---- LIST PIPELINE VERSIONS RESPONSE ----
  
  - target: "$.components.schemas.ListPipelineVersionsResponse.properties.versions.description"
    update: "Array of pipeline versions."
  
  - target: "$.components.schemas.ListPipelineVersionsResponse.properties.totalSize.description"
    update: "Total number of pipeline versions available."
  
  # ---- PIPELINE VERSION MANAGE REQUEST ----
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.name.description"
    update: "New pipeline version name. Maximum 255 characters."
  
  - target: "$.components.schemas.PipelineVersionManageRequest.properties.isDefault.description"
    update: "If true, marks this version as the default version for the pipeline."
  
  # ---- PIPELINE VERSION FULL INFO DTO ----
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.id.description"
    update: "Pipeline version string identifier."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorUserId.description"
    update: "User numeric identifier of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorUserName.description"
    update: "Username of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorFirstName.description"
    update: "First name of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorLastName.description"
    update: "Last name of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.creatorAvatarUrl.description"
    update: "Avatar URL of the version creator."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.name.description"
    update: "Pipeline version name."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.dateCreated.description"
    update: "Timestamp when the version was created."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.lastUpdated.description"
    update: "Timestamp when the version was last updated."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.hash.description"
    update: "Version content hash."
  
  - target: "$.components.schemas.PipelineVersionFullInfoDto.properties.isDefault.description"
    update: "If true, this is the default version for the pipeline."
  
  # ---- PIPELINE MIN INFO RESPONSE ----
  
  - target: "$.components.schemas.PipelineMinInfoResponse.properties.id.description"
    update: "Pipeline numeric identifier."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.properties.workspaceId.description"
    update: "Workspace numeric identifier."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.properties.version.description"
    update: "Pipeline version minimal information."
  
  # ---- PIPELINE VERSION MIN INFO RESPONSE ----
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.id.description"
    update: "Pipeline version string identifier."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.name.description"
    update: "Pipeline version name."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.dateCreated.description"
    update: "Timestamp when the version was created."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.lastUpdated.description"
    update: "Timestamp when the version was last updated."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.hash.description"
    update: "Version content hash."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.isDefault.description"
    update: "If true, this is the default version for the pipeline."
  
  - target: "$.components.schemas.PipelineMinInfoResponse.PipelineVersionMinInfoResponse.properties.isDraftVersion.description"
    update: "If true, this is a draft (unpublished) version."
```

---

# SSH Keys Overlays

## ssh-keys-operations-overlay-1.111.0.yaml

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
    update: "Confirms the validity of the given SSH public key for the authenticated user."
  
  # ---- VALIDATE SSH KEY NAME ----
  
  - target: "$.paths./ssh-keys/validate/name.get.summary"
    update: "Validate SSH key name"
  
  - target: "$.paths./ssh-keys/validate/name.get.description"
    update: "Confirms the availability of the given name for an SSH key in the user context."
  
  # ---- DESCRIBE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.get.summary"
    update: "Describe SSH key"
  
  - target: "$.paths./ssh-keys/{keyId}.get.description"
    update: "Retrieves the details of an SSH public key by its ID."
  
  # ---- DELETE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.delete.summary"
    update: "Delete SSH key"
  
  - target: "$.paths./ssh-keys/{keyId}.delete.description"
    update: "Permanently deletes the given SSH public key. This action cannot be undone."
```

## ssh-keys-parameters-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys parameters overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- CREATE SSH KEY ----
  
  - target: "$.paths./ssh-keys.post.requestBody.description"
    update: "SSH key create request"
  
  # ---- VALIDATE SSH KEY ----
  
  - target: "$.paths./ssh-keys/validate/key.get.parameters[?(@.name=='key')].description"
    update: "SSH public key to validate."
  
  # ---- VALIDATE SSH KEY NAME ----
  
  - target: "$.paths./ssh-keys/validate/name.get.parameters[?(@.name=='name')].description"
    update: "SSH key name to validate."
  
  # ---- DESCRIBE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.get.parameters[?(@.name=='keyId')].description"
    update: "SSH key numeric identifier."
  
  # ---- DELETE SSH KEY ----
  
  - target: "$.paths./ssh-keys/{keyId}.delete.parameters[?(@.name=='keyId')].description"
    update: "SSH key numeric identifier."
```

## ssh-keys-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: SSH keys schemas overlay
  version: 0.0.0
actions:
  # ===== SSH KEYS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CREATE SSH KEY REQUEST ----
  
  - target: "$.components.schemas.CreateSshKeyRequest.properties.name.description"
    update: "SSH key name. Maximum 255 characters."
  
  - target: "$.components.schemas.CreateSshKeyRequest.properties.publicKey.description"
    update: "SSH public key in OpenSSH format."
  
  # ---- CREATE SSH KEY RESPONSE ----
  
  - target: "$.components.schemas.CreateSshKeyResponse.properties.sshKey.description"
    update: "Created SSH key details."
  
  # ---- DESCRIBE SSH KEY RESPONSE ----
  
  - target: "$.components.schemas.DescribeSshKeyResponse.properties.sshKey.description"
    update: "SSH key details."
  
  # ---- LIST SSH KEYS RESPONSE ----
  
  - target: "$.components.schemas.ListSshKeysResponse.properties.sshKeys.description"
    update: "Array of SSH public keys for the authenticated user."
  
  # ---- USER SSH PUBLIC KEY DTO ----
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.id.description"
    update: "SSH key numeric identifier."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.name.description"
    update: "SSH key name."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.publicKey.description"
    update: "SSH public key in OpenSSH format."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.dateCreated.description"
    update: "Timestamp when the SSH key was created."
  
  - target: "$.components.schemas.UserSshPublicKeyDto.properties.lastUsed.description"
    update: "Timestamp when the SSH key was last used."
  
  # ---- STUDIO SSH DETAILS DTO ----
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.host.description"
    update: "Hostname to connect to."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.port.description"
    update: "SSH port number."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.user.description"
    update: "Username in the format `username@sessionId`."
  
  - target: "$.components.schemas.StudioSshDetailsDto.properties.command.description"
    update: "Full SSH command to execute."
```

---

# Pipelines Overlays (General)

## pipelines-operations-overlay-1.111.0.yaml

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
    update: "Updates the default version of the pipeline identified by the given `pipelineId`. **Note**: If `labelIds` is `null`, empty, or omitted, existing pipeline labels are removed. Include `labelIds: [<label-id-1>,<label-id-2>]` to override existing labels. Labels to be preserved must be included. To append a list of labels to multiple pipelines, use `/pipelines/labels/add`."
```

## pipelines-parameters-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines parameters overlay
  version: 0.0.0
actions:
  # ===== PIPELINES PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- GET PIPELINE LAUNCH DETAILS ----
  
  - target: "$.paths./pipelines/{pipelineId}/launch.get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version identifier. If omitted, uses the default version."
  
  # ---- GET PIPELINE SCHEMA ----
  
  - target: "$.paths./pipelines/{pipelineId}/schema.get.parameters[?(@.name=='versionId')].description"
    update: "Pipeline version identifier. If omitted, uses the default version."
```

## pipelines-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Pipelines schemas overlay
  version: 0.0.0
actions:
  # ===== PIPELINES SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- CREATE PIPELINE REQUEST ----
  
  - target: "$.components.schemas.CreatePipelineRequest.properties.version.description"
    update: "Initial version details for the pipeline."
  
  # ---- PIPELINE DB DTO ----
  
  - target: "$.components.schemas.PipelineDbDto.properties.version.description"
    update: "Full version information for the pipeline."
```

---

# Workflows Overlays

## workflows-operations-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows operations overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS - OPERATIONS =====
  
  # No new operations, but modified parameter behavior documented in parameters overlay
```

## workflows-parameters-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows parameters overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- LIST WORKFLOWS ----
  
  - target: "$.paths./workflow.get.parameters[?(@.name=='includeTotalSize')].description"
    update: "If true, includes the total count of workflows matching the query in the response."
```

## workflows-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- LAUNCH DB DTO ----
  
  - target: "$.components.schemas.LaunchDbDto.properties.id.description"
    update: "Launch string identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workspaceId.description"
    update: "Workspace numeric identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.computeEnv.description"
    update: "Compute environment configuration details."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pipeline.description"
    update: "Pipeline URL or repository path."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workDir.description"
    update: "Working directory for workflow execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.revision.description"
    update: "Pipeline revision (branch, tag, or commit)."
  
  - target: "$.components.schemas.LaunchDbDto.properties.commitId.description"
    update: "Git commit identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.configText.description"
    update: "Pipeline configuration text."
  
  - target: "$.components.schemas.LaunchDbDto.properties.towerConfig.description"
    update: "Platform-specific configuration text."
  
  - target: "$.components.schemas.LaunchDbDto.properties.paramsText.description"
    update: "Pipeline parameters in JSON or YAML format."
  
  - target: "$.components.schemas.LaunchDbDto.properties.preRunScript.description"
    update: "Script executed before workflow launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.postRunScript.description"
    update: "Script executed after workflow completion."
  
  - target: "$.components.schemas.LaunchDbDto.properties.mainScript.description"
    update: "Main workflow script name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.entryName.description"
    update: "Workflow entry point name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.schemaName.description"
    update: "Pipeline schema name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resume.description"
    update: "If true, resumes previous execution."
  
  - target: "$.components.schemas.LaunchDbDto.properties.resumeLaunchId.description"
    update: "Launch identifier to resume from."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pullLatest.description"
    update: "If true, pulls latest pipeline version."
  
  - target: "$.components.schemas.LaunchDbDto.properties.stubRun.description"
    update: "If true, performs a stub run."
  
  - target: "$.components.schemas.LaunchDbDto.properties.sessionId.description"
    update: "Workflow session identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.runName.description"
    update: "Workflow run name."
  
  - target: "$.components.schemas.LaunchDbDto.properties.configProfiles.description"
    update: "Array of configuration profiles to apply."
  
  - target: "$.components.schemas.LaunchDbDto.properties.userSecrets.description"
    update: "Array of user secret identifiers."
  
  - target: "$.components.schemas.LaunchDbDto.properties.workspaceSecrets.description"
    update: "Array of workspace secret identifiers."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationId.description"
    update: "Optimization configuration identifier."
  
  - target: "$.components.schemas.LaunchDbDto.properties.optimizationTargets.description"
    update: "Optimization targets in JSON format."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobCpus.description"
    update: "Number of CPUs allocated for the head job."
  
  - target: "$.components.schemas.LaunchDbDto.properties.headJobMemoryMb.description"
    update: "Memory allocated for the head job in megabytes."
  
  - target: "$.components.schemas.LaunchDbDto.properties.launchContainer.description"
    update: "Container image used for workflow launch."
  
  - target: "$.components.schemas.LaunchDbDto.properties.dateCreated.description"
    update: "Timestamp when the launch was created."
  
  - target: "$.components.schemas.LaunchDbDto.properties.lastUpdated.description"
    update: "Timestamp when the launch was last updated."
  
  - target: "$.components.schemas.LaunchDbDto.properties.pipelineSchemaId.description"
    update: "Pipeline schema numeric identifier."
  
  # ---- WORKFLOW MAX DB DTO ----
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.fusion.description"
    update: "Fusion metadata for the workflow."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.wave.description"
    update: "Wave metadata for the workflow."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.logFile.description"
    update: "Path to the workflow log file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.outFile.description"
    update: "Path to the workflow output file."
  
  - target: "$.components.schemas.WorkflowMaxDbDto.properties.operationId.description"
    update: "Operation identifier for the workflow."
  
  # ---- LIST WORKFLOWS RESPONSE ----
  
  - target: "$.components.schemas.ListWorkflowsResponse.properties.hasMore.description"
    update: "If true, more results are available for pagination."
  
  - target: "$.components.schemas.ListWorkflowsResponse.ListWorkflowsElement.properties.pipelineInfo.description"
    update: "Minimal pipeline information associated with the workflow."
  
  # ---- WORKFLOW LAUNCH REQUEST ----
  
  - target: "$.components.schemas.WorkflowLaunchRequest.properties.pipelineSchemaId.description"
    update: "Pipeline schema numeric identifier."
  
  # ---- WORKFLOW LAUNCH RESPONSE ----
  
  - target: "$.components.schemas.WorkflowLaunchResponse.properties.pipelineSchemaId.description"
    update: "Pipeline schema numeric identifier."
  
  # ---- DESCRIBE WORKFLOW RESPONSE ----
  
  - target: "$.components.schemas.DescribeWorkflowResponse.properties.pipelineInfo.description"
    update: "Minimal pipeline information associated with the workflow."
  
  # ---- WORKFLOW LOAD ----
  
  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions.description"
    update: "Number of spot instance interruptions encountered."
  
  # ---- TASK ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions.description"
    update: "Number of spot instance interruptions for this task."
  
  # ---- TRACE PROGRESS DATA ----
  
  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions.description"
    update: "Total number of spot instance interruptions."
```

---

# Data Studios Overlays

## data-studios-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data studios schemas overlay
  version: 0.0.0
actions:
  # ===== DATA STUDIOS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- DATA STUDIO CONFIGURATION ----
  
  - target: "$.components.schemas.DataStudioConfiguration.properties.sshEnabled.description"
    update: "If true, SSH access is enabled for the Data Studio session. Can be `null`."
  
  # ---- DATA STUDIO DTO ----
  
  - target: "$.components.schemas.DataStudioDto.properties.sshDetails.description"
    update: "SSH connection details for the Data Studio session. Can be `null`."
  
  # ---- DATA STUDIO STOP REASON ----
  
  - target: "$.components.schemas.DataStudioStopReason.description"
    update: "Reason for Data Studio session termination. Accepts `MANUAL`, `IDLE_TIMEOUT`, `MAX_DURATION`, `ERROR`, or `NO_STATS_AVAIL`."
```

---

# Compute Configurations Schemas Overlay

## compute-configs-schemas-overlay-1.111.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute configurations schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE CONFIGURATIONS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- ABSTRACT GRID CONFIG (BASE FOR HPC SCHEDULERS) ----
  
  - target: "$.components.schemas.AbstractGridConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced/#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced/#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.environment.description"
    update: "Array of environment variables for the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration text."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.discriminator.description"
    update: "Property to select the compute config platform type."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.launchDir.description"
    update: "Directory from which workflow execution is launched."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.port.description"
    update: "SSH port number for cluster connection."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headQueue.description"
    update: "Queue name for the head job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.computeQueue.description"
    update: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued simultaneously."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headJobOptions.description"
    update: "Additional options for head job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.propagateHeadJobOptions.description"
    update: "If true, applies head job options to all compute jobs."
  
  # ---- LSF COMPUTE CONFIG ----
  
  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits.description"
    update: "Unit for memory and CPU limits. Accepts `KB`, `MB`, `GB`, or `TB`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit.description"
    update: "If true, applies memory limits per job rather than per task."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve.description"
    update: "If true, reserves resources on a per-task basis."
  
  # ---- AWS BATCH CONFIG ----
  
  - target: "$.components.schemas.AwsBatchConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced/#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced/#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform type."
  
  # ---- AWS CLOUD CONFIG ----
  
  - target: "$.components.schemas.AwsCloudConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced/#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced/#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform type."
  
  # ---- AZURE BATCH CONFIG ----
  
  - target: "$.components.schemas.AzBatchConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AzBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced/#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced/#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform type."
  
  # ---- AZURE CLOUD CONFIG ----
  
  - target: "$.components.schemas.Az
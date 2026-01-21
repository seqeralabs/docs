I'll generate the overlay files for version 1.103.0, organizing them by controller/tag. Based on the analysis, we have changes affecting: compute-envs, data-links, and workspaces.

## Compute Environments Overlays

### compute-envs-operations-overlay-1.103.0.yaml

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
    update: "Disables the specified compute environment. A disabled compute environment cannot be used to launch workflows. If the compute environment is set as primary, it will be automatically unset."
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.summary"
    update: "Enable compute environment"
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.description"
    update: "Enables the specified compute environment. An enabled compute environment can be used to launch workflows."
```

### compute-envs-parameters-overlay-1.103.0.yaml

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

### compute-envs-schemas-overlay-1.103.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- COMPUTE ENVIRONMENT STATUS ----
  
  - target: "$.components.schemas.ComputeEnv.Status"
    update:
      type: string
      description: "Compute environment status. Accepts `AVAILABLE`, `CREATING`, `ERRORED`, or `DISABLED`."
      enum:
        - AVAILABLE
        - CREATING
        - ERRORED
        - DISABLED
```

---

## Data Links Overlays

### data-links-operations-overlay-1.103.0.yaml

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
    update: "Retrieves the content at the root of the specified data-link. Returns a paginated list of files and directories."
  
  # ---- EXPLORE DATA-LINK (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.summary"
    update: "Explore data-link at path"
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.description"
    update: "Retrieves the content at the specified path within the data-link. Returns a paginated list of files and directories."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the file at the specified path from the data-link. Returns the file content as binary data."
  
  # ---- GENERATE UPLOAD URL (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Generates a presigned URL for uploading files to the root of the specified data-link. For AWS S3 data-links, a follow-up request to the `/upload/finish` endpoint is required after the upload completes or encounters an error."
  
  # ---- GENERATE UPLOAD URL (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link upload URL at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Generates a presigned URL for uploading files to the specified path within the data-link. For AWS S3 data-links, a follow-up request to the `/upload/finish/{dirPath}` endpoint is required after the upload completes or encounters an error."
  
  # ---- FINISH UPLOAD (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finalizes a file upload to the root of an AWS S3 data-link. This endpoint must be called after successfully uploading a file using a URL from the `/upload` endpoint, or to abort an upload if an error was encountered."
  
  # ---- FINISH UPLOAD (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link upload at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finalizes a file upload to the specified path within an AWS S3 data-link. This endpoint must be called after successfully uploading a file using a URL from the `/upload/{dirPath}` endpoint, or to abort an upload if an error was encountered."
  
  # ---- DEPRECATED: DOWNLOAD DATA-LINK (OLD ENDPOINT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.summary"
    update: "(Deprecated) Download data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.description"
    update: "**This endpoint is deprecated. See [Download data-link file](https://docs.seqera.io/platform-api/download-data-link-file) for the current endpoint.**\n\nDownloads content from the specified data-link."
```

### data-links-parameters-overlay-1.103.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- EXPLORE DATA-LINK (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='search')].description"
    update: "Prefix search filter to match against data-link content."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to fetch the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='pageSize')].description"
    update: "Number of results to return per page. If omitted, a default maximum value is returned."
  
  # ---- EXPLORE DATA-LINK (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='path')].description"
    update: "Resource path within the data-link to browse."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='search')].description"
    update: "Prefix search filter to match against data-link content."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to fetch the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='pageSize')].description"
    update: "Number of results to return per page. If omitted, a default maximum value is returned."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='filePath')].description"
    update: "File path within the data-link to download."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- GENERATE UPLOAD URL (ROOT) ----
  
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
  
  # ---- GENERATE UPLOAD URL (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS validation."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.requestBody.description"
    update: "Data-link upload request"
  
  # ---- FINISH UPLOAD (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.requestBody.description"
    update: "Data-link upload finish request"
  
  # ---- FINISH UPLOAD (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link where the upload was performed."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link upload finish request"
```

---

## Workspaces Overlays

### workspaces-operations-overlay-1.103.0.yaml

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
    update: "Permanently removes the specified user from the workspace. This action removes both member and collaborator access. This action cannot be undone."
```

### workspaces-parameters-overlay-1.103.0.yaml

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

---

## Workflows Overlays

### workflows-parameters-overlay-1.103.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows parameters overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- LIST WORKFLOWS ----
  
  - target: "$.paths./workflow.get.parameters[?(@.name=='includeTotalSize')].description"
    update: "If true, includes the total count of workflows matching the query in the response. Default: `false`."
```

### workflows-schemas-overlay-1.103.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- LIST WORKFLOWS RESPONSE ----
  
  - target: "$.components.schemas.ListWorkflowsResponse.properties.hasMore"
    update:
      type: boolean
      description: "If true, indicates that more results are available beyond the current page."
  
  - target: "$.components.schemas.ListWorkflowsResponse.properties.totalSize"
    update:
      type: integer
      format: int64
      description: "Total count of workflows matching the query criteria. Only included when `includeTotalSize=true` is specified."
```

---

## Shared Schemas Overlays

### shared-schemas-overlay-1.103.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Shared schemas overlay
  version: 0.0.0
actions:
  # ===== SHARED SCHEMAS - COMPUTE CONFIGURATIONS =====
  
  # ---- COMPUTE CONFIG DISCRIMINATOR ----
  
  - target: "$.components.schemas.ComputeConfig.properties.discriminator.readOnly"
    remove: true
  
  - target: "$.components.schemas.ComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- AWS BATCH CONFIG ----
  
  - target: "$.components.schemas.AwsBatchConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- AWS CLOUD CONFIG ----
  
  - target: "$.components.schemas.AwsCloudConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- AZURE BATCH CONFIG ----
  
  - target: "$.components.schemas.AzBatchConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AzBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- AZURE CLOUD CONFIG ----
  
  - target: "$.components.schemas.AzCloudConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AzCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- GOOGLE BATCH CONFIG ----
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- GOOGLE CLOUD CONFIG ----
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- GOOGLE LIFE SCIENCES CONFIG ----
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- KUBERNETES CONFIG ----
  
  - target: "$.components.schemas.K8sComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- LOCAL COMPUTE CONFIG ----
  
  - target: "$.components.schemas.LocalComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- SEQERA COMPUTE CONFIG ----
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.instanceTypeSize.description"
    update: "Size of the Data Studios instance. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
  
  # ---- LSF COMPUTE CONFIG ----
  
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.hostName.description"
    update: "SSH hostname of the HPC cluster head node."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting compute tasks."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of tasks that can be queued simultaneously."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute tasks. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits.description"
    update: "Unit for memory limits in LSF."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit.description"
    update: "If true, applies memory limits per job rather than per task. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve.description"
    update: "If true, reserves resources per task. Default: `false`."
  
  # ---- SLURM COMPUTE CONFIG ----
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.hostName.description"
    update: "SSH hostname of the HPC cluster head node."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting compute tasks."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of tasks that can be queued simultaneously."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute tasks. Default: `false`."
  
  # ---- ALTAIR PBS COMPUTE CONFIG ----
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.hostName.description"
    update: "SSH hostname of the HPC cluster head node."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting compute tasks."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of tasks that can be queued simultaneously."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute tasks. Default: `false`."
  
  # ---- MOAB COMPUTE CONFIG ----
  
  - target: "$.components.schemas.MoabComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.hostName.description"
    update: "SSH hostname of the HPC cluster head node."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting compute tasks."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of tasks that can be queued simultaneously."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute tasks. Default: `false`."
  
  # ---- UNIVA COMPUTE CONFIG ----
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.hostName.description"
    update: "SSH hostname of the HPC cluster head node."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting compute tasks."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of tasks that can be queued simultaneously."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute tasks. Default: `false`."
  
  # ---- EKS COMPUTE CONFIG ----
  
  - target: "$.components.schemas.EksComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.EksComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.EksComputeConfig.properties.region.description"
    update: "AWS region where the EKS cluster is located."
  
  - target: "$.components.schemas.EksComputeConfig.properties.clusterName.description"
    update: "Name of the AWS EKS cluster."
  
  # ---- GKE COMPUTE CONFIG ----
  
  - target: "$.components.schemas.GkeComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/launch-advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.region.description"
    update: "Google Cloud region or zone where the GKE cluster is located."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.clusterName.description"
    update: "Name of the Google GKE cluster."
  
  # ===== PLATFORM METAINFO SCHEMAS =====
  
  # ---- PLATFORM METAINFO BASE ----
  
  - target: "$.components.schemas.PlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- AWS BATCH PLATFORM METAINFO ----
  
  - target: "$.components.schemas.AwsBatchPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- AWS CLOUD PLATFORM METAINFO ----
  
  - target: "$.components.schemas.AwsCloudPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- AZURE BATCH PLATFORM METAINFO ----
  
  - target: "$.components.schemas.AzBatchPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- AZURE CLOUD PLATFORM METAINFO ----
  
  - target: "$.components.schemas.AzCloudPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- GOOGLE BATCH PLATFORM METAINFO ----
  
  - target: "$.components.schemas.GooglePlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- GOOGLE CLOUD PLATFORM METAINFO ----
  
  - target: "$.components.schemas.GoogleCloudPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- EKS PLATFORM METAINFO ----
  
  - target: "$.components.schemas.EksPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- GKE PLATFORM METAINFO ----
  
  - target: "$.components.schemas.GkePlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- K8S PLATFORM METAINFO ----
  
  - target: "$.components.schemas.K8sPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- GRID PLATFORM METAINFO ----
  
  - target: "$.components.schemas.GridPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- LOCAL PLATFORM METAINFO ----
  
  - target: "$.components.schemas.LocalPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- SEQERA COMPUTE PLATFORM METAINFO ----
  
  - target: "$.components.schemas.SeqeraComputePlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ===== SECURITY KEYS SCHEMAS =====
  
  # ---- SECURITY KEYS BASE ----
  
  - target: "$.components.schemas.SecurityKeys.properties.discriminator.readOnly"
    remove: true
  
  - target: "$.components.schemas.SecurityKeys.properties.discriminator.description"
    update: "Property to select the credentials type."
  
  # ===== ACTION SCHEMAS =====
  
  # ---- ACTION CONFIG TYPE ----
  
  - target: "$.components.schemas.Action.ConfigType.properties.discriminator.readOnly"
    remove: true
  
  - target: "$.components.schemas.Action.ConfigType.properties.discriminator.description"
    update: "Property to select the action config type."
  
  # ---- ACTION EVENT TYPE ----
  
  - target: "$.components.schemas.Action.EventType.properties.discriminator.readOnly"
    remove: true
  
  - target: "$.components.schemas.Action.EventType.properties.discriminator.description"
    update: "Property to select the action event type."
  
  # ===== NEW SCHEMAS =====
  
  # ---- SEQERA COMPUTE CLOUD INSTANCE TYPE SIZE ----
  
  - target: "$.components.schemas.SeqeraComputeCloudInstanceTypeSize"
    update:
      type: string
      description: "Size of the Seqera Compute Data Studios instance. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
      enum:
        - SMALL
        - MEDIUM
        - LARGE
  
  # ---- GIT KEYS ----
  
  - target: "$.components.schemas.GitKeys"
    update:
      type: object
      description: "Generic Git credentials for repository access."
      properties:
        discriminator:
          type: string
          description: "Property to select the credentials type."
        username:
          type: string
          description: "Git username for authentication."
        password:
          type: string
          writeOnly: true
          description: "Git password or personal access token for authentication. Write-only for security."
        token:
          type: string
          writeOnly: true
          description: "Git personal access token for authentication. Write-only for security."
  
  # ===== TASK AND WORKFLOW SCHEMAS =====
  
  # ---- TASK ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of times this task was interrupted when running on spot instances."
  
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
      description: "Total number of spot instance interruptions for this workflow."
  
  # ===== ORGANIZATION SCHEMAS =====
  
  # ---- ORGANIZATION QUOTAS ----
  
  - target: "$.components.schemas.OrganizationQuotas.properties.maxCustomRolesPerOrg"
    update:
      type: integer
      format: int64
      description: "Maximum number of custom roles that can be created in the organization."
  
  # ===== DATA STUDIO SCHEMAS =====
  
  # ---- DATA STUDIO STOP REASON ----
  
  - target: "$.components.schemas.DataStudioStopReason"
    update:
      type: string
      description: "Reason for Data Studio termination. Accepts `MANUAL`, `TIMEOUT`, `ERROR`, or `NO_STATS_AVAIL`."
      enum:
        - MANUAL
        - TIMEOUT
        - ERROR
        - NO_STATS_AVAIL
```

---

## Summary

I've generated comprehensive overlay files for version 1.103.0 covering:

1. **Compute Environments** (3 files): New disable/enable endpoints
2. **Data Links** (2 files): Updated browse/upload/download operations with improved descriptions
3. **Workspaces** (2 files): New delete workspace user endpoint
4. **Workflows** (2 files): New includeTotalSize parameter
5. **Shared Schemas** (1 file): Comprehensive updates to all compute configs, platform metainfo, security keys, and new schemas

All overlays follow the established standards:
- ✅ Sentence case summaries without periods
- ✅ Full sentence descriptions with periods
- ✅ Exact standard parameter descriptions
- ✅ Consistent terminology (data-links, numeric identifier, Array of)
- ✅ Proper discriminator cleanup
- ✅ HPC config property descriptions duplicated across all scheduler types
- ✅ New schema documentation for GitKeys and SeqeraComputeCloudInstanceTypeSize
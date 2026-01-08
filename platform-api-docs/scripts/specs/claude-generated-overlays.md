I'll generate the OpenAPI overlay files for version 1.96.0, organized by controller/tag. Based on the analysis, we have changes affecting two main tags: `compute-envs` and `data-links`.

## Compute Environments Overlays

### compute-envs-operations-overlay-1.96.0.yaml

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

### compute-envs-parameters-overlay-1.96.0.yaml

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

### compute-envs-schemas-overlay-1.96.0.yaml

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
      enum:
        - CREATING
        - AVAILABLE
        - ERRORED
        - INVALID
        - DISABLED
      description: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `ERRORED`, `INVALID`, or `DISABLED`."
```

## Data Links Overlays

### data-links-operations-overlay-1.96.0.yaml

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
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file at path"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the content at the given `filePath` in the data-link associated with the given `dataLinkId`."
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link file upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Creates a URL to upload files to the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload. See the `/upload/finish` endpoint for details."
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link file upload URL with path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Creates a URL to upload files to the given `dirPath` in the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload. See the `/upload/finish/{dirPath}` endpoint for details."
  
  # ---- FINISH DATA-LINK FILE UPLOAD ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link file upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finishes upload of a data-link file. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH DATA-LINK FILE UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link file upload with path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finishes upload of a data-link file to the given `dirPath`. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload/{dirPath}` endpoint."
  
  # ---- DEPRECATED ENDPOINT ----
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.summary"
    update: "(Deprecated) Download data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.description"
    update: "**This endpoint is deprecated. See [Download data-link file at path](https://docs.seqera.io/platform-api/download-data-link-file) for the current endpoint.**\n\nDownloads the content of the data-link associated with the given `dataLinkId`."
```

### data-links-parameters-overlay-1.96.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA LINKS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- EXPLORE DATA-LINK ----
  
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
    update: "Path within the data-link to browse."
  
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
    update: "File path to download from the data-link."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS requests."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.requestBody.description"
    update: "Data-link file upload URL generation request"
  
  # ---- GENERATE DATA-LINK FILE UPLOAD URL WITH PATH ----
  
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
    update: "Data-link file upload URL generation request with path"
  
  # ---- FINISH DATA-LINK FILE UPLOAD ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.requestBody.description"
    update: "Data-link file upload finish request"
  
  # ---- FINISH DATA-LINK FILE UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for file upload completion."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link file upload finish request with path"
  
  # ---- DEPRECATED ENDPOINT ----
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
```

### data-links-schemas-overlay-1.96.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data links schemas overlay
  version: 0.0.0
actions:
  # ===== DATA LINKS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # Note: The data-links changes primarily affect operations and parameters.
  # No new schemas were introduced specifically for data-links in this version.
  # Schema changes are handled in the credentials and compute environment overlays.
```

## Credentials Schemas Overlay

### credentials-schemas-overlay-1.96.0.yaml

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
      description: "Property to select the credentials provider type."
  
  - target: "$.components.schemas.GitKeys.properties.username"
    update:
      type: string
      description: "Git username for authentication."
  
  - target: "$.components.schemas.GitKeys.properties.password"
    update:
      type: string
      description: "Git password for authentication. This field is write-only."
      writeOnly: true
  
  - target: "$.components.schemas.GitKeys.properties.token"
    update:
      type: string
      description: "Git personal access token for authentication. This field is write-only."
      writeOnly: true
  
  # ---- SECURITY KEYS BASE ----
  
  - target: "$.components.schemas.SecurityKeys.properties.discriminator.description"
    update: "Property to select the credentials provider type."
  
  # ---- AWS SECURITY KEYS ----
  
  - target: "$.components.schemas.AwsSecurityKeys.description"
    update: "AWS credentials for accessing AWS services."
  
  # ---- AZURE SECURITY KEYS ----
  
  - target: "$.components.schemas.AzureSecurityKeys.description"
    update: "Azure credentials for accessing Azure services."
  
  # ---- AZURE CLOUD KEYS ----
  
  - target: "$.components.schemas.AzureCloudKeys.description"
    update: "Azure Cloud credentials for accessing Azure Batch and Storage."
  
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
      description: "Azure Batch account key. This field is write-only."
      writeOnly: true
  
  - target: "$.components.schemas.AzureCloudKeys.properties.storageKey"
    update:
      type: string
      description: "Azure Storage account key. This field is write-only."
      writeOnly: true
  
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
      description: "Azure Active Directory client identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.clientSecret"
    update:
      type: string
      description: "Azure Active Directory client secret. This field is write-only."
      writeOnly: true
  
  # ---- AZURE ENTRA KEYS ----
  
  - target: "$.components.schemas.AzureEntraKeys.description"
    update: "Azure Entra credentials for accessing Azure services with managed identity."
  
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
      description: "Azure Batch account key. This field is write-only."
      writeOnly: true
  
  - target: "$.components.schemas.AzureEntraKeys.properties.storageKey"
    update:
      type: string
      description: "Azure Storage account key. This field is write-only."
      writeOnly: true
  
  - target: "$.components.schemas.AzureEntraKeys.properties.tenantId"
    update:
      type: string
      description: "Azure Active Directory tenant identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientId"
    update:
      type: string
      description: "Azure Active Directory client identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientSecret"
    update:
      type: string
      description: "Azure Active Directory client secret. This field is write-only."
      writeOnly: true
  
  # ---- SEQERA COMPUTE SECURITY KEYS ----
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.description"
    update: "Seqera Compute credentials for accessing Seqera Cloud resources."
  
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
      description: "Seqera Compute secret access key. This field is write-only."
      writeOnly: true
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.assumeRoleArn"
    update:
      type: string
      description: "AWS IAM role ARN to assume for cross-account access."
  
  # ---- GIT PROVIDER KEYS ----
  
  - target: "$.components.schemas.GitHubSecurityKeys.description"
    update: "GitHub credentials for accessing GitHub repositories."
  
  - target: "$.components.schemas.GitLabSecurityKeys.description"
    update: "GitLab credentials for accessing GitLab repositories."
  
  - target: "$.components.schemas.GiteaSecurityKeys.description"
    update: "Gitea credentials for accessing Gitea repositories."
  
  - target: "$.components.schemas.BitBucketSecurityKeys.description"
    update: "Bitbucket credentials for accessing Bitbucket repositories."
  
  - target: "$.components.schemas.AzureReposSecurityKeys.description"
    update: "Azure Repos credentials for accessing Azure DevOps repositories."
  
  - target: "$.components.schemas.CodeCommitSecurityKeys.description"
    update: "AWS CodeCommit credentials for accessing CodeCommit repositories."
  
  # ---- OTHER CREDENTIALS ----
  
  - target: "$.components.schemas.GoogleSecurityKeys.description"
    update: "Google Cloud credentials for accessing Google Cloud services."
  
  - target: "$.components.schemas.K8sSecurityKeys.description"
    update: "Kubernetes credentials for accessing Kubernetes clusters."
  
  - target: "$.components.schemas.SSHSecurityKeys.description"
    update: "SSH credentials for accessing remote systems via SSH."
  
  - target: "$.components.schemas.S3SecurityKeys.description"
    update: "S3-compatible storage credentials for accessing S3-compatible object storage."
  
  - target: "$.components.schemas.ContainerRegistryKeys.description"
    update: "Container registry credentials for accessing private container registries."
  
  - target: "$.components.schemas.AgentSecurityKeys.description"
    update: "Tower Agent credentials for connecting agents to Tower Platform."
```

## Compute Configurations Schemas Overlay

### compute-configs-schemas-overlay-1.96.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute configurations schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE CONFIGURATIONS SCHEMAS - CONFIG OBJECTS =====
  
  # ---- COMPUTE CONFIG BASE ----
  
  - target: "$.components.schemas.ComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- CLOUD PROVIDER CONFIGS ----
  
  # AWS Batch
  - target: "$.components.schemas.AwsBatchConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/aws-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/aws-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # AWS Cloud
  - target: "$.components.schemas.AwsCloudConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/aws-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/aws-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Azure Batch
  - target: "$.components.schemas.AzBatchConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/azure-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/azure-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Azure Cloud
  - target: "$.components.schemas.AzCloudConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/azure-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/azure-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Google Batch
  - target: "$.components.schemas.GoogleBatchConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/google-cloud-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/google-cloud-batch#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Google Cloud
  - target: "$.components.schemas.GoogleCloudConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/google-cloud#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/google-cloud#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Google Life Sciences
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/google-cloud-lifesciences#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/google-cloud-lifesciences#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Kubernetes
  - target: "$.components.schemas.K8sComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/kubernetes#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/kubernetes#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Amazon EKS
  - target: "$.components.schemas.EksComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/eks#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/eks#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.EksComputeConfig.properties.region.description"
    update: "AWS region where the EKS cluster is located."
  
  - target: "$.components.schemas.EksComputeConfig.properties.clusterName.description"
    update: "Amazon EKS cluster name."
  
  # Google GKE
  - target: "$.components.schemas.GkeComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/gke#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/gke#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.region.description"
    update: "Google Cloud region or zone where the GKE cluster is located."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.clusterName.description"
    update: "Google GKE cluster name."
  
  # Seqera Compute
  - target: "$.components.schemas.SeqeraComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/seqera-cloud#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/seqera-cloud#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # Local
  - target: "$.components.schemas.LocalComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- HPC/GRID CONFIGS ----
  
  # Abstract Grid Config (base for all HPC schedulers)
  - target: "$.components.schemas.AbstractGridConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.environment.description"
    update: "Array of environment variable definitions for the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration to append to the pipeline configuration."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.launchDir.description"
    update: "Launch directory where the Nextflow pipeline will be executed."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC system."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC login node."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.port.description"
    update: "SSH port for connection to the HPC system. Default: `22`."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.computeQueue.description"
    update: "Queue name for submitting pipeline task jobs."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headJobOptions.description"
    update: "Additional scheduler directives for the Nextflow head job."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to task jobs. Default: `false`."
  
  # LSF
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.environment.description"
    update: "Array of environment variable definitions for the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration to append to the pipeline configuration."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir.description"
    update: "Launch directory where the Nextflow pipeline will be executed."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC system."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC login node."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC system. Default: `22`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting pipeline task jobs."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headJobOptions.description"
    update: "Additional scheduler directives for the Nextflow head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to task jobs. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits.description"
    update: "Unit for memory and resource limits in LSF. Accepts `KB`, `MB`, `GB`, or `TB`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit.description"
    update: "Whether to apply memory limits per job. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve.description"
    update: "Whether to reserve resources per task. Default: `false`."
  
  # Slurm
  - target: "$.components.schemas.SlurmComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.environment.description"
    update: "Array of environment variable definitions for the compute environment."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration to append to the pipeline configuration."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.launchDir.description"
    update: "Launch directory where the Nextflow pipeline will be executed."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC system."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC login node."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC system. Default: `22`."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting pipeline task jobs."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headJobOptions.description"
    update: "Additional scheduler directives for the Nextflow head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to task jobs. Default: `false`."
  
  # Altair PBS
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.environment.description"
    update: "Array of environment variable definitions for the compute environment."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration to append to the pipeline configuration."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.launchDir.description"
    update: "Launch directory where the Nextflow pipeline will be executed."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC system."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC login node."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC system. Default: `22`."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting pipeline task jobs."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headJobOptions.description"
    update: "Additional scheduler directives for the Nextflow head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to task jobs. Default: `false`."
  
  # Moab
  - target: "$.components.schemas.MoabComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.environment.description"
    update: "Array of environment variable definitions for the compute environment."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration to append to the pipeline configuration."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.launchDir.description"
    update: "Launch directory where the Nextflow pipeline will be executed."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC system."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC login node."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC system. Default: `22`."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting pipeline task jobs."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headJobOptions.description"
    update: "Additional scheduler directives for the Nextflow head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to task jobs. Default: `false`."
  
  # Univa
  - target: "$.components.schemas.UnivaComputeConfig.properties.workDir.description"
    update: "Compute environment working directory (resource path)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the environment before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.postRunScript.description"
    update: "Script that executes in the environment after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/hpc#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.environment.description"
    update: "Array of environment variable definitions for the compute environment."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration to append to the pipeline configuration."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.launchDir.description"
    update: "Launch directory where the Nextflow pipeline will be executed."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC system."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC login node."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC system. Default: `22`."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting pipeline task jobs."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headJobOptions.description"
    update: "Additional scheduler directives for the Nextflow head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.propagateHeadJobOptions.description"
    update: "Whether to propagate head job options to task jobs. Default: `false`."
```

## Platform Metainfo Schemas Overlay

### platform-metainfo-schemas-overlay-1.96.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Platform metainfo schemas overlay
  version: 0.0.0
actions:
  # ===== PLATFORM METAINFO SCHEMAS =====
  
  # ---- BASE PLATFORM METAINFO ----
  
  - target: "$.components.schemas.PlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- CLOUD PROVIDER METAINFO ----
  
  - target: "$.components.schemas.AwsBatchPlatformMetainfo.description"
    update: "AWS Batch platform metadata containing available regions and instance types."
  
  - target: "$.components.schemas.AwsBatchPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.AwsCloudPlatformMetainfo.description"
    update: "AWS Cloud platform metadata containing available regions and resources."
  
  - target: "$.components.schemas.AwsCloudPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.AzBatchPlatformMetainfo.description"
    update: "Azure Batch platform metadata containing available regions and VM sizes."
  
  - target: "$.components.schemas.AzBatchPlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.AzCloudPlatformMetaInfo.description"
    update: "Azure Cloud platform metadata containing available regions and resources."
  
  - target: "$.components.schemas.AzCloudPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.GooglePlatformMetainfo.description"
    update: "Google Batch platform metadata containing available regions and machine types."
  
  - target: "$.components.schemas.GooglePlatformMetainfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.GoogleCloudPlatformMetaInfo.description"
    update: "Google Cloud platform metadata containing available regions and resources."
  
  - target: "$.components.schemas.GoogleCloudPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  # ---- KUBERNETES METAINFO ----
  
  - target: "$.components.schemas.K8sPlatformMetaInfo.description"
    update: "Kubernetes platform metadata containing cluster information and capabilities."
  
  - target: "$.components.schemas.K8sPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.EksPlatformMetaInfo.description"
    update: "Amazon EKS platform metadata containing cluster information and available resources."
  
  - target: "$.components.schemas.EksPlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.GkePlatformMetaInfo.description"
    update: "Google GKE platform metadata containing cluster information and available resources."
  
  - target: "$.components.schemas.GkePlatformMetaInfo.properties.discriminator.description"
    update: "Property to select the platform metainfo type."
I'll generate the OpenAPI overlay files for version 1.98.0. Based on the analysis, there are changes to two main features: **compute-envs** and **data-links**.

# Compute Environments Overlays

## compute-envs-operations-overlay-1.98.0.yaml

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
    update: "Disables the specified compute environment. A disabled compute environment cannot be used to launch workflows. If the compute environment is set as primary, it will be automatically unset."
```

## compute-envs-parameters-overlay-1.98.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.requestBody.description"
    update: "Compute environment enable request"
  
  # ---- DISABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/disable.post.requestBody.description"
    update: "Compute environment disable request"
```

## compute-envs-schemas-overlay-1.98.0.yaml

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
      enum:
        - AVAILABLE
        - CREATING
        - ERRORED
        - INVALID
        - DISABLED
      description: "Compute environment status. Accepts `AVAILABLE` (ready for use), `CREATING` (being provisioned), `ERRORED` (encountered an error), `INVALID` (configuration is invalid), or `DISABLED` (manually disabled)."
```

---

# Data Links Overlays

## data-links-operations-overlay-1.98.0.yaml

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
    update: "Retrieves the root-level content of the specified data-link. Use the `search` parameter to filter results by prefix."
  
  # ---- EXPLORE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.summary"
    update: "Explore data-link at path"
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.description"
    update: "Retrieves the content at the specified path within the data-link. Use the `search` parameter to filter results by prefix."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the file at the specified path within the data-link. Returns the file content as binary data."
  
  # ---- GENERATE UPLOAD URL (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Generates a presigned URL for uploading files to the root of the specified data-link. For AWS S3 data-links, a follow-up request to the `/upload/finish` endpoint is required after upload completion or failure."
  
  # ---- GENERATE UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link upload URL at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Generates a presigned URL for uploading files to the specified directory path within the data-link. For AWS S3 data-links, a follow-up request to the `/upload/finish/{dirPath}` endpoint is required after upload completion or failure."
  
  # ---- FINISH UPLOAD (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finalizes a file upload to the root of an AWS S3 data-link. This endpoint must be called after successfully uploading a file or encountering an error when using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link upload at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finalizes a file upload to the specified directory path within an AWS S3 data-link. This endpoint must be called after successfully uploading a file or encountering an error when using an upload URL from the `/upload/{dirPath}` endpoint."
```

## data-links-parameters-overlay-1.98.0.yaml

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
    update: "Free-text prefix search to filter data-link content."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Pagination token to fetch the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of results to return per page. If omitted, a default maximum value is used."
  
  # ---- EXPLORE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='path')].description"
    update: "Directory path within the data-link to explore."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='search')].description"
    update: "Free-text prefix search to filter data-link content."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Pagination token to fetch the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of results to return per page. If omitted, a default maximum value is used."
  
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
    update: "Origin header for CORS validation."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.requestBody.description"
    update: "Data-link upload URL generation request"
  
  # ---- FINISH UPLOAD (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.requestBody.description"
    update: "Data-link upload finalization request"
  
  # ---- FINISH UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link where upload was performed."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link upload finalization request"
```

## data-links-schemas-overlay-1.98.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links schemas overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # Note: The data-links changes in 1.98.0 primarily affect operations and parameters.
  # No specific schema property descriptions need to be updated for data-links in this version.
  # This file is included for completeness and future schema updates.
```

---

# Credentials/Security Keys Overlays

## credentials-schemas-overlay-1.98.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS SCHEMAS - SECURITY KEYS =====
  
  # ---- GIT CREDENTIALS ----
  
  - target: "$.components.schemas.GitKeys.properties.discriminator.description"
    update: "Credentials type discriminator. Always `git` for Git credentials."
  
  - target: "$.components.schemas.GitKeys.properties.username.description"
    update: "Git username for authentication."
  
  - target: "$.components.schemas.GitKeys.properties.password.description"
    update: "Git password for authentication. Write-only field."
  
  - target: "$.components.schemas.GitKeys.properties.token.description"
    update: "Git personal access token for authentication. Write-only field."
  
  # ---- GITHUB CREDENTIALS ----
  
  - target: "$.components.schemas.GitHubSecurityKeys.description"
    update: "GitHub credentials for repository access and authentication."
  
  # ---- GITLAB CREDENTIALS ----
  
  - target: "$.components.schemas.GitLabSecurityKeys.description"
    update: "GitLab credentials for repository access and authentication."
  
  # ---- GITEA CREDENTIALS ----
  
  - target: "$.components.schemas.GiteaSecurityKeys.description"
    update: "Gitea credentials for repository access and authentication."
  
  # ---- BITBUCKET CREDENTIALS ----
  
  - target: "$.components.schemas.BitBucketSecurityKeys.description"
    update: "Bitbucket credentials for repository access and authentication."
  
  # ---- AZURE REPOS CREDENTIALS ----
  
  - target: "$.components.schemas.AzureReposSecurityKeys.description"
    update: "Azure Repos credentials for repository access and authentication."
  
  # ---- AWS CODECOMMIT CREDENTIALS ----
  
  - target: "$.components.schemas.CodeCommitSecurityKeys.description"
    update: "AWS CodeCommit credentials for repository access and authentication."
  
  # ---- AWS CREDENTIALS ----
  
  - target: "$.components.schemas.AwsSecurityKeys.description"
    update: "AWS credentials for cloud resource access and authentication."
  
  # ---- AZURE CREDENTIALS ----
  
  - target: "$.components.schemas.AzureSecurityKeys.description"
    update: "Azure credentials for cloud resource access and authentication."
  
  # ---- AZURE CLOUD CREDENTIALS ----
  
  - target: "$.components.schemas.AzureCloudKeys.properties.discriminator.description"
    update: "Credentials type discriminator. Always `azure` for Azure Cloud credentials."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.batchName.description"
    update: "Azure Batch account name."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.storageName.description"
    update: "Azure Storage account name."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.batchKey.description"
    update: "Azure Batch account access key. Write-only field."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.storageKey.description"
    update: "Azure Storage account access key. Write-only field."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.subscriptionId.description"
    update: "Azure subscription identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.tenantId.description"
    update: "Azure Active Directory tenant identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.clientId.description"
    update: "Azure service principal client identifier."
  
  - target: "$.components.schemas.AzureCloudKeys.properties.clientSecret.description"
    update: "Azure service principal client secret. Write-only field."
  
  # ---- AZURE ENTRA CREDENTIALS ----
  
  - target: "$.components.schemas.AzureEntraKeys.properties.discriminator.description"
    update: "Credentials type discriminator. Always `azure-entra` for Azure Entra credentials."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.batchName.description"
    update: "Azure Batch account name."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.storageName.description"
    update: "Azure Storage account name."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.batchKey.description"
    update: "Azure Batch account access key. Write-only field."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.storageKey.description"
    update: "Azure Storage account access key. Write-only field."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.tenantId.description"
    update: "Azure Entra tenant identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientId.description"
    update: "Azure Entra application client identifier."
  
  - target: "$.components.schemas.AzureEntraKeys.properties.clientSecret.description"
    update: "Azure Entra application client secret. Write-only field."
  
  # ---- GOOGLE CREDENTIALS ----
  
  - target: "$.components.schemas.GoogleSecurityKeys.description"
    update: "Google Cloud credentials for cloud resource access and authentication."
  
  # ---- S3-COMPATIBLE CREDENTIALS ----
  
  - target: "$.components.schemas.S3SecurityKeys.description"
    update: "S3-compatible storage credentials for object storage access."
  
  # ---- KUBERNETES CREDENTIALS ----
  
  - target: "$.components.schemas.K8sSecurityKeys.description"
    update: "Kubernetes credentials for cluster access and authentication."
  
  # ---- SSH CREDENTIALS ----
  
  - target: "$.components.schemas.SSHSecurityKeys.description"
    update: "SSH credentials for secure shell access to remote systems."
  
  # ---- CONTAINER REGISTRY CREDENTIALS ----
  
  - target: "$.components.schemas.ContainerRegistryKeys.description"
    update: "Container registry credentials for Docker image repository access."
  
  # ---- TOWER AGENT CREDENTIALS ----
  
  - target: "$.components.schemas.AgentSecurityKeys.description"
    update: "Seqera Platform Agent credentials for agent-based compute environments."
  
  # ---- SEQERA COMPUTE CREDENTIALS ----
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.discriminator.description"
    update: "Credentials type discriminator. Always `seqera-compute` for Seqera Compute credentials."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.accessKey.description"
    update: "Seqera Compute access key identifier."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.secretKey.description"
    update: "Seqera Compute secret access key. Write-only field."
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.properties.assumeRoleArn.description"
    update: "AWS IAM role ARN to assume for Seqera Compute operations. Optional."
```

---

# Compute Configuration Schemas Overlays

## compute-config-schemas-overlay-1.98.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute configuration schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE CONFIGURATION SCHEMAS =====
  
  # ---- COMMON COMPUTE CONFIG PROPERTIES ----
  
  # AWS Batch Config
  - target: "$.components.schemas.AwsBatchConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid S3 bucket URL."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `aws-batch` for AWS Batch."
  
  # AWS Cloud (EC2) Config
  - target: "$.components.schemas.AwsCloudConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid S3 bucket URL."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `aws-cloud` for AWS Cloud."
  
  # Azure Batch Config
  - target: "$.components.schemas.AzBatchConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid Azure Blob Storage container URL."
  
  - target: "$.components.schemas.AzBatchConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `azure-batch` for Azure Batch."
  
  # Azure Cloud Config
  - target: "$.components.schemas.AzCloudConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid Azure Blob Storage container URL."
  
  - target: "$.components.schemas.AzCloudConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `azure-cloud` for Azure Cloud."
  
  # Google Batch Config
  - target: "$.components.schemas.GoogleBatchConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid Google Cloud Storage bucket URL."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `google-batch` for Google Batch."
  
  # Google Cloud Config
  - target: "$.components.schemas.GoogleCloudConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid Google Cloud Storage bucket URL."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `google-cloud` for Google Cloud."
  
  # Google Life Sciences Config
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid Google Cloud Storage bucket URL."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `google-lifesciences` for Google Life Sciences."
  
  # Kubernetes Config
  - target: "$.components.schemas.K8sComputeConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be accessible from the Kubernetes cluster."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `k8s` for Kubernetes."
  
  # Local Config
  - target: "$.components.schemas.LocalComputeConfig.properties.workDir.description"
    update: "Pipeline work directory path on the local filesystem."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `local` for local execution."
  
  # Seqera Compute Config
  - target: "$.components.schemas.SeqeraComputeConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid S3 bucket URL."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `seqera-compute` for Seqera Compute."
  
  # ---- HPC SCHEDULER CONFIGS ----
  
  # LSF Config
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir.description"
    update: "Pipeline work directory path accessible by the LSF scheduler."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `lsf` for IBM LSF."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir.description"
    update: "Launch directory path for the Nextflow head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.hostName.description"
    update: "SSH hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headQueue.description"
    update: "LSF queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.computeQueue.description"
    update: "LSF queue name for submitting pipeline compute jobs."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once. Default: `100`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headJobOptions.description"
    update: "Additional LSF options to pass to the head job submission command."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute jobs. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits.description"
    update: "Memory unit for LSF resource limits. Accepts `KB`, `MB`, `GB`, or `TB`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit.description"
    update: "If true, memory limits are applied per job rather than per task. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve.description"
    update: "If true, memory reservations are applied per task rather than per job. Default: `false`."
  
  # Slurm Config
  - target: "$.components.schemas.SlurmComputeConfig.properties.workDir.description"
    update: "Pipeline work directory path accessible by the Slurm scheduler."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `slurm` for Slurm."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.launchDir.description"
    update: "Launch directory path for the Nextflow head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.hostName.description"
    update: "SSH hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headQueue.description"
    update: "Slurm partition name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.computeQueue.description"
    update: "Slurm partition name for submitting pipeline compute jobs."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once. Default: `100`."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headJobOptions.description"
    update: "Additional Slurm options to pass to the head job submission command."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute jobs. Default: `false`."
  
  # Altair PBS Config
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.workDir.description"
    update: "Pipeline work directory path accessible by the Altair PBS scheduler."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `altair-pbs` for Altair PBS."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.launchDir.description"
    update: "Launch directory path for the Nextflow head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.hostName.description"
    update: "SSH hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headQueue.description"
    update: "PBS queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.computeQueue.description"
    update: "PBS queue name for submitting pipeline compute jobs."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once. Default: `100`."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headJobOptions.description"
    update: "Additional PBS options to pass to the head job submission command."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute jobs. Default: `false`."
  
  # Moab Config
  - target: "$.components.schemas.MoabComputeConfig.properties.workDir.description"
    update: "Pipeline work directory path accessible by the Moab scheduler."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `moab` for Moab."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.launchDir.description"
    update: "Launch directory path for the Nextflow head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.hostName.description"
    update: "SSH hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headQueue.description"
    update: "Moab queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.computeQueue.description"
    update: "Moab queue name for submitting pipeline compute jobs."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once. Default: `100`."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headJobOptions.description"
    update: "Additional Moab options to pass to the head job submission command."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute jobs. Default: `false`."
  
  # Univa Config
  - target: "$.components.schemas.UnivaComputeConfig.properties.workDir.description"
    update: "Pipeline work directory path accessible by the Univa Grid Engine scheduler."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `univa` for Univa Grid Engine."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.launchDir.description"
    update: "Launch directory path for the Nextflow head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.userName.description"
    update: "SSH username for connecting to the HPC cluster."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.hostName.description"
    update: "SSH hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headQueue.description"
    update: "Univa queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.computeQueue.description"
    update: "Univa queue name for submitting pipeline compute jobs."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once. Default: `100`."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headJobOptions.description"
    update: "Additional Univa options to pass to the head job submission command."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are also applied to compute jobs. Default: `false`."
  
  # ---- EKS COMPUTE CONFIG ----
  
  - target: "$.components.schemas.EksComputeConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid S3 bucket URL."
  
  - target: "$.components.schemas.EksComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `eks` for Amazon EKS."
  
  - target: "$.components.schemas.EksComputeConfig.properties.server.description"
    update: "Kubernetes API server URL for the EKS cluster."
  
  - target: "$.components.schemas.EksComputeConfig.properties.sslCert.description"
    update: "SSL certificate for authenticating with the Kubernetes API server."
  
  - target: "$.components.schemas.EksComputeConfig.properties.namespace.description"
    update: "Kubernetes namespace for running Nextflow jobs."
  
  - target: "$.components.schemas.EksComputeConfig.properties.computeServiceAccount.description"
    update: "Kubernetes service account name for compute job pods."
  
  - target: "$.components.schemas.EksComputeConfig.properties.headServiceAccount.description"
    update: "Kubernetes service account name for the Nextflow head job pod."
  
  - target: "$.components.schemas.EksComputeConfig.properties.storageClaimName.description"
    update: "Persistent volume claim name for shared storage."
  
  - target: "$.components.schemas.EksComputeConfig.properties.storageMountPath.description"
    update: "Mount path for the persistent volume in pods."
  
  - target: "$.components.schemas.EksComputeConfig.properties.headPodSpec.description"
    update: "Custom Kubernetes pod specification for the Nextflow head job in YAML format."
  
  - target: "$.components.schemas.EksComputeConfig.properties.servicePodSpec.description"
    update: "Custom Kubernetes pod specification for compute jobs in YAML format."
  
  - target: "$.components.schemas.EksComputeConfig.properties.headJobCpus.description"
    update: "Number of CPUs to allocate for the Nextflow head job."
  
  - target: "$.components.schemas.EksComputeConfig.properties.headJobMemoryMb.description"
    update: "Amount of memory in MB to allocate for the Nextflow head job."
  
  - target: "$.components.schemas.EksComputeConfig.properties.region.description"
    update: "AWS region where the EKS cluster is located."
  
  - target: "$.components.schemas.EksComputeConfig.properties.clusterName.description"
    update: "Name of the Amazon EKS cluster."
  
  - target: "$.components.schemas.EksComputeConfig.properties.waveEnabled.description"
    update: "If true, enables Wave container provisioning service. Default: `false`."
  
  - target: "$.components.schemas.EksComputeConfig.properties.fusion2Enabled.description"
    update: "If true, enables Fusion v2 virtual distributed file system. Default: `false`."
  
  # ---- GKE COMPUTE CONFIG ----
  
  - target: "$.components.schemas.GkeComputeConfig.properties.workDir.description"
    update: "Pipeline work directory resource path. Must be a valid Google Cloud Storage bucket URL."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.preRunScript.description"
    update: "Bash script that executes before the Nextflow pipeline runs. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.postRunScript.description"
    update: "Bash script that executes after the Nextflow pipeline completes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.discriminator.description"
    update: "Compute configuration platform discriminator. Always `gke` for Google GKE."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.server.description"
    update: "Kubernetes API server URL for the GKE cluster."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.sslCert.description"
    update: "SSL certificate for authenticating with the Kubernetes API server."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.namespace.description"
    update: "Kubernetes namespace for running Nextflow jobs."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.computeServiceAccount.description"
    update: "Kubernetes service account name for compute job pods."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.headServiceAccount.description"
    update: "Kubernetes service account name for the Nextflow head job pod."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.storageClaimName.description"
    update: "Persistent volume claim name for shared storage."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.storageMountPath.description"
    update: "Mount path for the persistent volume in pods."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.headPodSpec.description"
    update: "Custom Kubernetes pod specification for the Nextflow head job in YAML format."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.servicePodSpec.description"
    update: "Custom Kubernetes pod specification for compute jobs in YAML format."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.headJobCpus.description"
    update: "Number of CPUs to allocate for the Nextflow head job."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.headJobMemoryMb.description"
    update: "Amount of memory in MB to allocate for the Nextflow head job."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.region.description"
    update: "Google Cloud region or zone where the GKE cluster is located."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.clusterName.description"
    update: "Name of the Google GKE cluster."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.fusion2Enabled.description"
    update: "If true, enables Fusion v2 virtual distributed file system. Default: `false`."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.waveEnabled.description"
    update: "If true, enables Wave container provisioning service. Default: `false`."
```

---

# Additional Schemas Overlays

## additional-schemas-overlay-1.98.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Additional schemas overlay
  version: 0.0.0
actions:
  # ===== ADDITIONAL SCHEMAS =====
  
  # ---- PLATFORM METAINFO SCHEMAS ----
  
  - target: "$.components.schemas.PlatformMetainfo.properties.discriminator.description"
    update: "Platform type discriminator for identifying the compute platform."
  
  - target: "$.components.schemas.AwsBatchPlatformMetainfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `aws-batch` for AWS Batch."
  
  - target: "$.components.schemas.AwsCloudPlatformMetainfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `aws-cloud` for AWS Cloud."
  
  - target: "$.components.schemas.AzBatchPlatformMetainfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `azure-batch` for Azure Batch."
  
  - target: "$.components.schemas.AzCloudPlatformMetaInfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `azure-cloud` for Azure Cloud."
  
  - target: "$.components.schemas.GooglePlatformMetainfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `google-batch` for Google Batch."
  
  - target: "$.components.schemas.GoogleCloudPlatformMetaInfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `google-cloud` for Google Cloud."
  
  - target: "$.components.schemas.K8sPlatformMetaInfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `k8s` for Kubernetes."
  
  - target: "$.components.schemas.EksPlatformMetaInfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `eks` for Amazon EKS."
  
  - target: "$.components.schemas.GkePlatformMetaInfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `gke` for Google GKE."
  
  - target: "$.components.schemas.GridPlatformMetainfo.properties.discriminator.description"
    update: "Platform type discriminator for HPC grid schedulers."
  
  - target: "$.components.schemas.LocalPlatformMetainfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `local` for local execution."
  
  - target: "$.components.schemas.SeqeraComputePlatformMetainfo.properties.discriminator.description"
    update: "Platform type discriminator. Always `seqera-compute` for Seqera Compute."
  
  # ---- ORGANIZATION QUOTAS ----
  
  - target: "$.components.schemas.OrganizationQuotas.properties.maxCustomRolesPerOrg.description"
    update: "Maximum number of custom roles allowed per organization."
  
  # ---- TASK SCHEMA ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions.description"
    update: "Number of times the task was interrupted due to spot instance preemption."
  
  # ---- TRACE PROGRESS DATA ----
  
  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions.description"
    update: "Total number of spot instance interruptions across all tasks in the workflow."
  
  # ---- WORKFLOW LOAD ----
  
  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions.description"
    update: "Total number of spot instance interruptions for the workflow execution."
  
  # ---- ACTION SCHEMAS ----
  
  - target: "$.components.schemas.Action.TowerActionConfig.description"
    update: "Configuration for Seqera Platform action triggers and webhooks."
  
  - target: "$.components.schemas.Action.TowerActionEvent.description"
    update: "Event definition for Seqera Platform action triggers."
  
  - target: "$.components.schemas.GithubActionConfig.description"
    update: "Configuration for GitHub action integration and webhooks."
  
  - target: "$.components.schemas.GithubActionEvent.description"
    update: "Event definition for GitHub action triggers."
```

These overlay files provide comprehensive documentation improvements for version 1.98.0, following all the standards and conventions specified in the style guide. The overlays are organized by feature area and include proper descriptions for all new and modified endpoints, parameters, and schemas.
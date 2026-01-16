I'll generate the overlay files for version 1.100.0, organized by the affected tags: compute-envs and data-links.

# Compute Environments Overlays

## compute-envs-operations-overlay-1.100.0.yaml

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

## compute-envs-parameters-overlay-1.100.0.yaml

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

## compute-envs-schemas-overlay-1.100.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- COMPUTE ENVIRONMENT STATUS ----
  
  - target: "$.components.schemas.ComputeEnv.Status.properties.status"
    update:
      type: string
      enum: ["CREATING", "AVAILABLE", "ERRORED", "INVALID", "DISABLED"]
      description: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `ERRORED`, `INVALID`, or `DISABLED`."
```

# Data Links Overlays

## data-links-operations-overlay-1.100.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links operations overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS - OPERATIONS =====
  
  # ---- BROWSE DATA-LINK ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.summary"
    update: "Browse data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.description"
    update: "Retrieves the contents of the data-link associated with the given `dataLinkId`. Results can be filtered using the `search` parameter for prefix matching."
  
  # ---- BROWSE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.summary"
    update: "Browse data-link with path"
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.description"
    update: "Retrieves the contents at the specified path within the data-link associated with the given `dataLinkId`."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the file at the specified `filePath` within the data-link associated with the given `dataLinkId`. Returns the file content as binary data."
  
  # ---- GENERATE UPLOAD URL ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Generates a presigned URL for uploading files to the data-link associated with the given `dataLinkId`. For AWS S3 data-links, a follow-up request to the `/upload/finish` endpoint is required after upload completion or error to finalize the operation."
  
  # ---- GENERATE UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link upload URL with path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Generates a presigned URL for uploading files to the specified directory path within the data-link associated with the given `dataLinkId`. For AWS S3 data-links, a follow-up request to the `/upload/finish/{dirPath}` endpoint is required after upload completion or error."
  
  # ---- FINISH UPLOAD ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finalize data-link upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finalizes a file upload to an AWS S3 data-link. This endpoint must be called after using an upload URL from the `/upload` endpoint to complete a successful upload or abort an upload that encountered an error."
  
  # ---- FINISH UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finalize data-link upload with path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finalizes a file upload to the specified directory path within an AWS S3 data-link. This endpoint must be called after using an upload URL from the `/upload/{dirPath}` endpoint to complete a successful upload or abort an upload that encountered an error."
```

## data-links-parameters-overlay-1.100.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- BROWSE DATA-LINK ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='search')].description"
    update: "Free-text prefix search filter to match against data-link content names."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to retrieve the next page of results. Obtained from the previous response."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of items to return per page. If omitted, a default maximum value is used."
  
  # ---- BROWSE DATA-LINK WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='path')].description"
    update: "Directory path within the data-link to browse."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='search')].description"
    update: "Free-text prefix search filter to match against data-link content names."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to retrieve the next page of results. Obtained from the previous response."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of items to return per page. If omitted, a default maximum value is used."
  
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
    update: "Origin header for CORS requests. Can be `null`."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.requestBody.description"
    update: "Data-link upload URL generation request"
  
  # ---- GENERATE UPLOAD URL WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for the upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS requests. Can be `null`."
  
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
    update: "Data-link upload finalization request"
  
  # ---- FINISH UPLOAD WITH PATH ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link where the upload was performed."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link upload finalization request"
```

## data-links-schemas-overlay-1.100.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links schemas overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # Note: No new schemas were introduced specifically for data-links in this version.
  # All schema changes are covered in the shared schemas overlay.
```

# Shared Schemas Overlay

## shared-schemas-overlay-1.100.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Shared schemas overlay
  version: 0.0.0
actions:
  # ===== SHARED SCHEMAS - COMMON REQUEST/RESPONSE OBJECTS =====
  
  # ---- CREDENTIALS SCHEMAS ----
  
  - target: "$.components.schemas.AgentSecurityKeys.title"
    update: "Tower Agent credentials"
  
  - target: "$.components.schemas.AwsSecurityKeys.title"
    update: "AWS credentials"
  
  - target: "$.components.schemas.AzureCloudKeys.title"
    update: "Azure Cloud credentials"
  
  - target: "$.components.schemas.AzureEntraKeys.title"
    update: "Azure Entra credentials"
  
  - target: "$.components.schemas.AzureReposSecurityKeys.title"
    update: "Azure Repos credentials"
  
  - target: "$.components.schemas.AzureSecurityKeys.title"
    update: "Azure credentials"
  
  - target: "$.components.schemas.BitBucketSecurityKeys.title"
    update: "BitBucket credentials"
  
  - target: "$.components.schemas.CodeCommitSecurityKeys.title"
    update: "AWS CodeCommit credentials"
  
  - target: "$.components.schemas.ContainerRegistryKeys.title"
    update: "Container registry credentials"
  
  - target: "$.components.schemas.GitHubSecurityKeys.title"
    update: "GitHub credentials"
  
  - target: "$.components.schemas.GitLabSecurityKeys.title"
    update: "GitLab credentials"
  
  - target: "$.components.schemas.GiteaSecurityKeys.title"
    update: "Gitea credentials"
  
  - target: "$.components.schemas.GoogleSecurityKeys.title"
    update: "Google credentials"
  
  - target: "$.components.schemas.K8sSecurityKeys.title"
    update: "Kubernetes credentials"
  
  - target: "$.components.schemas.S3SecurityKeys.title"
    update: "S3-compatible credentials"
  
  - target: "$.components.schemas.SSHSecurityKeys.title"
    update: "SSH credentials"
  
  - target: "$.components.schemas.SeqeraComputeSecurityKeys.title"
    update: "Seqera Compute credentials"
  
  # ---- GIT CREDENTIALS SCHEMA ----
  
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
      description: "Git password. Write-only field."
      writeOnly: true
  
  - target: "$.components.schemas.GitKeys.properties.token"
    update:
      type: string
      description: "Git access token. Write-only field."
      writeOnly: true
  
  # ---- COMPUTE CONFIG SCHEMAS ----
  
  - target: "$.components.schemas.AbstractGridConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration to apply to the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.launchDir"
    update:
      type: string
      description: "Launch directory for workflow execution."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.userName"
    update:
      type: string
      description: "Username for HPC scheduler authentication."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.hostName"
    update:
      type: string
      description: "HPC cluster hostname or IP address."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "SSH port for HPC cluster connection."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for submitting the head job."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for submitting compute jobs."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs that can be queued simultaneously."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional options for the head job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, head job options are propagated to compute jobs."
  
  # ---- LSF COMPUTE CONFIG ----
  
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration to apply to the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Launch directory for workflow execution."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for LSF scheduler authentication."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.hostName"
    update:
      type: string
      description: "LSF cluster hostname or IP address."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "SSH port for LSF cluster connection."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for submitting the head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for submitting compute jobs."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs that can be queued simultaneously."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional options for the head job submission."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, head job options are propagated to compute jobs."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits"
    update:
      type: string
      description: "Unit specification for resource limits in LSF."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit"
    update:
      type: boolean
      description: "If true, memory limits are applied per job rather than per core."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve"
    update:
      type: boolean
      description: "If true, resources are reserved per task."
  
  # ---- SLURM COMPUTE CONFIG ----
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration to apply to the compute environment."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Launch directory for workflow execution."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for Slurm scheduler authentication."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.hostName"
    update:
      type: string
      description: "Slurm cluster hostname or IP address."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "SSH port for Slurm cluster connection."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Partition name for submitting the head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Partition name for submitting compute jobs."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs that can be queued simultaneously."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional options for the head job submission."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, head job options are propagated to compute jobs."
  
  # ---- ALTAIR PBS COMPUTE CONFIG ----
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration to apply to the compute environment."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Launch directory for workflow execution."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for Altair PBS scheduler authentication."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.hostName"
    update:
      type: string
      description: "Altair PBS cluster hostname or IP address."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "SSH port for Altair PBS cluster connection."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for submitting the head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for submitting compute jobs."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs that can be queued simultaneously."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional options for the head job submission."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, head job options are propagated to compute jobs."
  
  # ---- MOAB COMPUTE CONFIG ----
  
  - target: "$.components.schemas.MoabComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration to apply to the compute environment."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Launch directory for workflow execution."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for Moab scheduler authentication."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.hostName"
    update:
      type: string
      description: "Moab cluster hostname or IP address."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "SSH port for Moab cluster connection."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for submitting the head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for submitting compute jobs."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs that can be queued simultaneously."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional options for the head job submission."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, head job options are propagated to compute jobs."
  
  # ---- UNIVA COMPUTE CONFIG ----
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration to apply to the compute environment."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.launchDir"
    update:
      type: string
      description: "Launch directory for workflow execution."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.userName"
    update:
      type: string
      description: "Username for Univa Grid Engine scheduler authentication."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.hostName"
    update:
      type: string
      description: "Univa Grid Engine cluster hostname or IP address."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.port"
    update:
      type: integer
      format: int32
      description: "SSH port for Univa Grid Engine cluster connection."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headQueue"
    update:
      type: string
      description: "Queue name for submitting the head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.computeQueue"
    update:
      type: string
      description: "Queue name for submitting compute jobs."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.maxQueueSize"
    update:
      type: integer
      format: int32
      description: "Maximum number of jobs that can be queued simultaneously."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headJobOptions"
    update:
      type: string
      description: "Additional options for the head job submission."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.propagateHeadJobOptions"
    update:
      type: boolean
      description: "If true, head job options are propagated to compute jobs."
  
  # ---- CLOUD PLATFORM CONFIGS ----
  
  - target: "$.components.schemas.AwsBatchConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AzBatchConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.AzBatchConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AzCloudConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.AzCloudConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.instanceTypeSize"
    update:
      allOf:
        - $ref: "#/components/schemas/SeqeraComputeCloudInstanceTypeSize"
      description: "Size of the Data Studios instance. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
  
  # ---- KUBERNETES CONFIGS ----
  
  - target: "$.components.schemas.EksComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.EksComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.EksComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration to apply to the compute environment."
  
  - target: "$.components.schemas.EksComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.EksComputeConfig.properties.server"
    update:
      type: string
      description: "Kubernetes API server URL."
  
  - target: "$.components.schemas.EksComputeConfig.properties.sslCert"
    update:
      type: string
      description: "SSL certificate for Kubernetes API authentication."
  
  - target: "$.components.schemas.EksComputeConfig.properties.namespace"
    update:
      type: string
      description: "Kubernetes namespace for workflow execution."
  
  - target: "$.components.schemas.EksComputeConfig.properties.computeServiceAccount"
    update:
      type: string
      description: "Service account for compute pods."
  
  - target: "$.components.schemas.EksComputeConfig.properties.headServiceAccount"
    update:
      type: string
      description: "Service account for head job pods."
  
  - target: "$.components.schemas.EksComputeConfig.properties.storageClaimName"
    update:
      type: string
      description: "Persistent volume claim name for storage."
  
  - target: "$.components.schemas.EksComputeConfig.properties.storageMountPath"
    update:
      type: string
      description: "Mount path for persistent storage in pods."
  
  - target: "$.components.schemas.EksComputeConfig.properties.podCleanup"
    update:
      $ref: "#/components/schemas/PodCleanupPolicy"
      description: "Pod cleanup policy after workflow completion."
  
  - target: "$.components.schemas.EksComputeConfig.properties.headPodSpec"
    update:
      type: string
      description: "Custom pod specification for head job in YAML format."
  
  - target: "$.components.schemas.EksComputeConfig.properties.servicePodSpec"
    update:
      type: string
      description: "Custom pod specification for service pods in YAML format."
  
  - target: "$.components.schemas.EksComputeConfig.properties.headJobCpus"
    update:
      type: integer
      format: int32
      description: "Number of CPUs allocated to the head job pod."
  
  - target: "$.components.schemas.EksComputeConfig.properties.headJobMemoryMb"
    update:
      type: integer
      format: int32
      description: "Memory in MB allocated to the head job pod."
  
  - target: "$.components.schemas.EksComputeConfig.properties.region"
    update:
      type: string
      description: "AWS region where the EKS cluster is located."
  
  - target: "$.components.schemas.EksComputeConfig.properties.clusterName"
    update:
      type: string
      description: "Name of the AWS EKS cluster."
  
  - target: "$.components.schemas.EksComputeConfig.properties.waveEnabled"
    update:
      type: boolean
      description: "If true, Wave container provisioning is enabled."
  
  - target: "$.components.schemas.EksComputeConfig.properties.fusion2Enabled"
    update:
      type: boolean
      description: "If true, Fusion v2 file system is enabled."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.workDir"
    update:
      type: string
      description: "Compute environment working directory."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.preRunScript"
    update:
      type: string
      description: "Script that executes in the launch environment prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.postRunScript"
    update:
      type: string
      description: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/overview#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.environment"
    update:
      type: array
      items:
        $ref: "#/components/schemas/ConfigEnvVariable"
      description: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.nextflowConfig"
    update:
      type: string
      description: "Additional Nextflow configuration to apply to the compute environment."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.discriminator"
    update:
      type: string
      description: "Property to select the compute config platform."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.server"
    update:
      type: string
      description: "Kubernetes API server URL."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.sslCert"
    update:
      type: string
      description: "SSL certificate for Kubernetes API authentication."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.namespace"
    update:
      type: string
      description: "Kubernetes namespace for workflow execution."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.computeServiceAccount"
    update:
      type: string
      description: "Service account for compute pods."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.headServiceAccount"
    update:
      type: string
      description: "Service account for head job pods."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.storageClaimName"
    update:
      type: string
      description: "Persistent volume claim name for storage."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.storageMountPath"
    update:
      type: string
      description: "Mount path for persistent storage in pods."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.podCleanup"
    update:
      $ref: "#/components/schemas/PodCleanupPolicy"
      description: "Pod cleanup policy after workflow completion."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.headPodSpec"
    update:
      type: string
      description: "Custom pod specification for head job in YAML format."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.servicePodSpec"
    update:
      type: string
      description: "Custom pod specification for service pods in YAML format."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.headJobCpus"
    update:
      type: integer
      format: int32
      description: "Number of CPUs allocated to the head job pod."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.headJobMemoryMb"
    update:
      type: integer
      format: int32
      description: "Memory in MB allocated to the head job pod."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.region"
    update:
      type: string
      description: "Google Cloud region or zone where the GKE cluster is located."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.clusterName"
    update:
      type: string
      description: "Name of the Google GKE cluster."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.fusion2Enabled"
    update:
      type: boolean
      description: "If true, Fusion v2 file system is enabled."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.waveEnabled"
    update:
      type: boolean
      description: "If true, Wave container provisioning is enabled."
  
  # ---- PLATFORM METAINFO ----
  
  - target: "$.components.schemas.AwsBatchPlatformMetainfo.title"
    update: "AWS Batch platform metainfo"
  
  - target: "$.components.schemas.AwsBatchPlatformMetainfo.properties.discriminator"
    update:
      type: string
      description: "Property to select the platform metainfo type."
  
  - target: "$.components.schemas.AwsCloudPlatformMetainfo.title"
    
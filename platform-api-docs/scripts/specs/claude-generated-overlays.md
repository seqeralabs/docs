I'll generate the overlay files for version 1.99.0, organized by the two affected tags: compute-envs and data-links.

## compute-envs-operations-overlay-1.99.0.yaml

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

## compute-envs-parameters-overlay-1.99.0.yaml

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
    update: "Empty request body"
  
  # ---- ENABLE COMPUTE ENVIRONMENT ----
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='computeEnvId')].description"
    update: "Compute environment string identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.requestBody.description"
    update: "Empty request body"
```

## compute-envs-schemas-overlay-1.99.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- COMPUTE ENVIRONMENT STATUS ----
  
  - target: "$.components.schemas.ComputeEnv.Status.enum"
    update:
      description: "Compute environment status. Accepts `AVAILABLE`, `CREATING`, `ERRORED`, or `DISABLED`."
```

## data-links-operations-overlay-1.99.0.yaml

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
    update: "Retrieves the content of the data-link associated with the given `dataLinkId`."
  
  # ---- EXPLORE DATA-LINK (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.summary"
    update: "Explore data-link at path"
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.description"
    update: "Retrieves the content at the given `path` in the data-link associated with the given `dataLinkId`."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.summary"
    update: "Download data-link file at path"
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.description"
    update: "Downloads the content at the given `filePath` in the data-link associated with the given `dataLinkId`."
  
  # ---- GENERATE UPLOAD URL (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link file upload URL"
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Creates a URL to upload files to the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload. See the `/upload/finish` endpoint."
  
  # ---- GENERATE UPLOAD URL (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.summary"
    update: "Generate data-link file upload URL at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.description"
    update: "Creates a URL to upload files to the given `dirPath` in the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload. See the `/upload/finish` endpoint."
  
  # ---- FINISH UPLOAD (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link file upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finishes upload of a data-link file. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH UPLOAD (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link file upload at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finishes upload of a file to the given `dirPath` in the data-link. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
```

## data-links-parameters-overlay-1.99.0.yaml

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
    update: "Free-text prefix search filter to match against data-link content."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to retrieve the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of results to return per page. If omitted, a default maximum value is returned."
  
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
    update: "Free-text prefix search filter to match against data-link content."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='nextPageToken')].description"
    update: "Token used to retrieve the next page of results."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='pageSize')].description"
    update: "Maximum number of results to return per page. If omitted, a default maximum value is returned."
  
  # ---- DOWNLOAD DATA-LINK FILE ----
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='filePath')].description"
    update: "Resource path of the file to download from the data-link."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download/{filePath}.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  # ---- GENERATE UPLOAD URL (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS validation. Can be `null`."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.requestBody.description"
    update: "Data-link upload request"
  
  # ---- GENERATE UPLOAD URL (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory resource path within the data-link for file upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS validation. Can be `null`."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.requestBody.description"
    update: "Data-link upload request"
  
  # ---- FINISH UPLOAD (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.requestBody.description"
    update: "Data-link upload finish request"
  
  # ---- FINISH UPLOAD (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory resource path within the data-link where the upload was performed."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link upload finish request"
```

## data-links-schemas-overlay-1.99.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links schemas overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # Note: No new schemas specific to data-links were added in 1.99.0.
  # The data-links endpoints use existing schemas that are already documented.
  # This file is included for completeness but contains no actions.
```

## credentials-schemas-overlay-1.99.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- GIT KEYS ----
  
  - target: "$.components.schemas.GitKeys.description"
    update: "Git repository credentials for authentication."
  
  - target: "$.components.schemas.GitKeys.properties.discriminator.description"
    update: "Discriminator property to identify the credential type."
  
  - target: "$.components.schemas.GitKeys.properties.username.description"
    update: "Git username for authentication."
  
  - target: "$.components.schemas.GitKeys.properties.password.description"
    update: "Git password for authentication. Write-only."
  
  - target: "$.components.schemas.GitKeys.properties.token.description"
    update: "Git personal access token for authentication. Write-only."
```

## compute-envs-schemas-overlay-1.99.0-extended.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments schemas overlay (extended)
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENT SCHEMAS - CONFIGURATION OBJECTS =====
  
  # ---- ABSTRACT GRID CONFIG ----
  
  - target: "$.components.schemas.AbstractGridConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.discriminator.description"
    update: "Discriminator property to identify the compute config platform type."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.launchDir.description"
    update: "Launch directory for the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.port.description"
    update: "SSH port for connection to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headQueue.description"
    update: "Queue name for the head job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.computeQueue.description"
    update: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at once."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.propagateHeadJobOptions.description"
    update: "If true, propagate head job options to all compute jobs. Default: `false`."
  
  # ---- LSF COMPUTE CONFIG ----
  
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator.description"
    update: "Discriminator property to identify the compute config platform type."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir.description"
    update: "Launch directory for the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headQueue.description"
    update: "Queue name for the head job submission."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.computeQueue.description"
    update: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at once."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, propagate head job options to all compute jobs. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits.description"
    update: "Unit specification for LSF resource limits."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit.description"
    update: "If true, apply memory limits per job. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve.description"
    update: "If true, reserve resources per task. Default: `false`."
  
  # ---- SLURM COMPUTE CONFIG ----
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.discriminator.description"
    update: "Discriminator property to identify the compute config platform type."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.launchDir.description"
    update: "Launch directory for the compute environment."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headQueue.description"
    update: "Queue name for the head job submission."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.computeQueue.description"
    update: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at once."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, propagate head job options to all compute jobs. Default: `false`."
  
  # ---- ALTAIR PBS COMPUTE CONFIG ----
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.discriminator.description"
    update: "Discriminator property to identify the compute config platform type."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.launchDir.description"
    update: "Launch directory for the compute environment."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headQueue.description"
    update: "Queue name for the head job submission."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.computeQueue.description"
    update: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at once."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, propagate head job options to all compute jobs. Default: `false`."
  
  # ---- MOAB COMPUTE CONFIG ----
  
  - target: "$.components.schemas.MoabComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.discriminator.description"
    update: "Discriminator property to identify the compute config platform type."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.launchDir.description"
    update: "Launch directory for the compute environment."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headQueue.description"
    update: "Queue name for the head job submission."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.computeQueue.description"
    update: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at once."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, propagate head job options to all compute jobs. Default: `false`."
  
  # ---- UNIVA COMPUTE CONFIG ----
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/launch/advanced#pre-and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.discriminator.description"
    update: "Discriminator property to identify the compute config platform type."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.launchDir.description"
    update: "Launch directory for the compute environment."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.port.description"
    update: "SSH port for connection to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headQueue.description"
    update: "Queue name for the head job submission."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.computeQueue.description"
    update: "Queue name for compute job submissions."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs to queue at once."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, propagate head job options to all compute jobs. Default: `false`."
```

These overlay files provide complete documentation coverage for version 1.99.0, following all the established standards for terminology, formatting, and structure.
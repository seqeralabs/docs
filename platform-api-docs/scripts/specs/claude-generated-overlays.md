I'll generate the three overlay files for the changes in version 1.101.0. Based on the analysis, we have changes affecting the `compute-envs` and `data-links` controllers.

# Compute Environments Overlay Files

## compute-envs-operations-overlay-1.101.0.yaml

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

## compute-envs-parameters-overlay-1.101.0.yaml

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

## compute-envs-schemas-overlay-1.101.0.yaml

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
      enum: ["CREATING", "AVAILABLE", "ERRORED", "INVALID", "DISABLED"]
      description: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `ERRORED`, `INVALID`, or `DISABLED`."
```

---

# Data Links Overlay Files

## data-links-operations-overlay-1.101.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links operations overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS - OPERATIONS =====
  
  # ---- BROWSE DATA-LINK (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.summary"
    update: "Explore data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/browse.get.description"
    update: "Retrieves the content of the data-link associated with the given `dataLinkId`."
  
  # ---- BROWSE DATA-LINK (WITH PATH) ----
  
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
    update: "Creates a URL to upload files to the given `dirPath` in the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload. See the `/upload/finish/{dirPath}` endpoint."
  
  # ---- FINISH UPLOAD (ROOT) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link file upload"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finishes upload of a data-link file. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."
  
  # ---- FINISH UPLOAD (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.summary"
    update: "Finish data-link file upload at path"
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.description"
    update: "Finishes upload of a data-link file at the given `dirPath`. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload/{dirPath}` endpoint."
  
  # ---- DEPRECATED DOWNLOAD ENDPOINT ----
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.summary"
    update: "(Deprecated) Download data-link"
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.description"
    update: "**This endpoint is deprecated. See [Download data-link file at path](https://docs.seqera.io/platform-api/download-data-link-file-at-path) for the current endpoint.**\n\nDownloads the content of the data-link associated with the given `dataLinkId`."
```

## data-links-parameters-overlay-1.101.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links parameters overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- BROWSE DATA-LINK (ROOT) ----
  
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
  
  # ---- BROWSE DATA-LINK (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.parameters[?(@.name=='path')].description"
    update: "Directory path within the data-link to browse."
  
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
    update: "Origin header for CORS validation."
  
  - target: "$.paths./data-links/{dataLinkId}/upload.post.requestBody.description"
    update: "Data-link upload request"
  
  # ---- GENERATE UPLOAD URL (WITH PATH) ----
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='dirPath')].description"
    update: "Directory path within the data-link for file upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.parameters[?(@.name=='Origin')].description"
    update: "Origin header for CORS validation."
  
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
    update: "Directory path within the data-link for finishing upload."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.requestBody.description"
    update: "Data-link upload finish request"
  
  # ---- DEPRECATED DOWNLOAD ENDPOINT ----
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.parameters[?(@.name=='dataLinkId')].description"
    update: "Data-link string identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  - target: "$.paths./data-links/{dataLinkId}/download.get.parameters[?(@.name=='credentialsId')].description"
    update: "Credentials string identifier."
```

## data-links-schemas-overlay-1.101.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Data-links schemas overlay
  version: 0.0.0
actions:
  # ===== DATA-LINKS SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # Note: Most schema changes in this version are related to compute configs
  # and credentials, which are documented in the global schemas overlay.
  # Data-links primarily use existing schemas with no new data-link-specific
  # schema definitions in this version.
```

---

# Workflows Overlay Files

## workflows-parameters-overlay-1.101.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows parameters overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS PARAMETERS - QUERY PARAMETERS =====
  
  # ---- LIST WORKFLOWS ----
  
  - target: "$.paths./workflow.get.parameters[?(@.name=='includeTotalSize')].description"
    update: "If `true`, includes the total count of workflows in the response. Default: `false`."
```

## workflows-schemas-overlay-1.101.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS SCHEMAS - RESPONSE OBJECTS =====
  
  # ---- LIST WORKFLOWS RESPONSE ----
  
  - target: "$.components.schemas.ListWorkflowsResponse.properties.hasMore"
    update:
      type: boolean
      description: "If `true`, indicates there are more workflows available beyond the current page."
  
  # ---- WORKFLOW LOAD ----
  
  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered during workflow execution."
  
  # ---- TASK ----
  
  - target: "$.components.schemas.Task.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered during task execution."
  
  # ---- TRACE PROGRESS DATA ----
  
  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions"
    update:
      type: integer
      format: int32
      description: "Number of spot instance interruptions encountered during the traced execution."
```

---

# Global Schemas Overlay Files

## global-schemas-overlay-1.101.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Global schemas overlay
  version: 0.0.0
actions:
  # ===== GLOBAL SCHEMAS - COMPUTE CONFIGURATIONS AND CREDENTIALS =====
  
  # ---- COMPUTE CONFIG BASE ----
  
  - target: "$.components.schemas.ComputeConfig.properties.discriminator.readOnly"
    remove: true
  
  - target: "$.components.schemas.ComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- ABSTRACT GRID CONFIG ----
  
  - target: "$.components.schemas.AbstractGridConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration for the compute environment."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.launchDir.description"
    update: "Directory where the Nextflow launcher script will execute."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.AbstractGridConfig.properties.propagateHeadJobOptions.description"
    update: "If `true`, head job options are also applied to compute jobs. Default: `false`."
  
  # ---- LSF COMPUTE CONFIG ----
  
  - target: "$.components.schemas.LsfComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration for the compute environment."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir.description"
    update: "Directory where the Nextflow launcher script will execute."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If `true`, head job options are also applied to compute jobs. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits.description"
    update: "Unit for memory limits in LSF. Accepts `KB`, `MB`, or `GB`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit.description"
    update: "If `true`, sets memory limits per job. Default: `false`."
  
  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve.description"
    update: "If `true`, reserves resources per task. Default: `false`."
  
  # ---- SLURM COMPUTE CONFIG ----
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration for the compute environment."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.launchDir.description"
    update: "Directory where the Nextflow launcher script will execute."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.SlurmComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If `true`, head job options are also applied to compute jobs. Default: `false`."
  
  # ---- ALTAIR PBS COMPUTE CONFIG ----
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration for the compute environment."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.launchDir.description"
    update: "Directory where the Nextflow launcher script will execute."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.AltairPbsComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If `true`, head job options are also applied to compute jobs. Default: `false`."
  
  # ---- MOAB COMPUTE CONFIG ----
  
  - target: "$.components.schemas.MoabComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration for the compute environment."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.launchDir.description"
    update: "Directory where the Nextflow launcher script will execute."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.MoabComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If `true`, head job options are also applied to compute jobs. Default: `false`."
  
  # ---- UNIVA COMPUTE CONFIG ----
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.environment.description"
    update: "Array of environment variables to set in the compute environment."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.nextflowConfig.description"
    update: "Custom Nextflow configuration for the compute environment."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.launchDir.description"
    update: "Directory where the Nextflow launcher script will execute."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.userName.description"
    update: "Username for SSH connection to the HPC cluster."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.port.description"
    update: "SSH port number for connecting to the HPC cluster. Default: `22`."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at once."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.headJobOptions.description"
    update: "Additional options to pass to the head job submission command."
  
  - target: "$.components.schemas.UnivaComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If `true`, head job options are also applied to compute jobs. Default: `false`."
  
  # ---- AWS BATCH CONFIG ----
  
  - target: "$.components.schemas.AwsBatchConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- AWS CLOUD CONFIG ----
  
  - target: "$.components.schemas.AwsCloudConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AwsCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- AZURE BATCH CONFIG ----
  
  - target: "$.components.schemas.AzBatchConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AzBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AzBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- AZURE CLOUD CONFIG ----
  
  - target: "$.components.schemas.AzCloudConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.AzCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.AzCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- GOOGLE BATCH CONFIG ----
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleBatchConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- GOOGLE CLOUD CONFIG ----
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleCloudConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- GOOGLE LIFE SCIENCES CONFIG ----
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.GoogleLifeSciencesConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- KUBERNETES CONFIG ----
  
  - target: "$.components.schemas.K8sComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.K8sComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- EKS CONFIG ----
  
  - target: "$.components.schemas.EksComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.EksComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.EksComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.EksComputeConfig.properties.region.description"
    update: "AWS region where the EKS cluster is located."
  
  - target: "$.components.schemas.EksComputeConfig.properties.clusterName.description"
    update: "Name of the AWS EKS cluster."
  
  # ---- GKE CONFIG ----
  
  - target: "$.components.schemas.GkeComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.region.description"
    update: "Google Cloud region or zone where the GKE cluster is located."
  
  - target: "$.components.schemas.GkeComputeConfig.properties.clusterName.description"
    update: "Name of the Google GKE cluster."
  
  # ---- LOCAL CONFIG ----
  
  - target: "$.components.schemas.LocalComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.LocalComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  # ---- SEQERA COMPUTE CONFIG ----
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform/latest/compute-envs/advanced-options#pre--and-post-run-scripts)."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."
  
  - target: "$.components.schemas.SeqeraComputeConfig.properties.instanceTypeSize.description"
    update: "Size of the Data Studios instance. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
  
  # ---- SEQERA COMPUTE CLOUD INSTANCE TYPE SIZE ----
  
  - target: "$.components.schemas.SeqeraComputeCloudInstanceTypeSize"
    update:
      type: string
      enum: ["SMALL", "MEDIUM", "LARGE"]
      description: "Size of the Data Studios instance. Accepts `SMALL`, `MEDIUM`, or `LARGE`."
  
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
  
  # ---- KUBERNETES PLATFORM METAINFO ----
  
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
  
  # ---- SECURITY KEYS BASE ----
  
  - target: "$.components.schemas.SecurityKeys.properties.discriminator.readOnly"
    remove: true
  
  - target: "$.components.schemas.SecurityKeys.properties.discriminator.description"
    update: "Property to select the credentials type."
  
  # ---- GIT KEYS ----
  
  - target: "$.components.schemas.GitKeys"
    update:
      type: object
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
          description: "Git password for authentication. Write-only."
        token:
          type: string
          writeOnly: true
          description: "Git personal access token for authentication. Write-only."
      description: "Git credentials for version control system authentication."
  
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
  
  # ---- DATA STUDIO STOP REASON ----
  
  - target: "$.components.schemas.DataStudioStopReason"
    update:
      type: string
      enum: ["UNKNOWN", "USER_REQUESTED", "IDLE_TIMEOUT", "MAX_SESSION_TIMEOUT", "NO_STATS_AVAIL"]
      description: "Reason for Data Studio session termination. Accepts `UNKNOWN`, `USER_REQUESTED`, `IDLE_TIMEOUT`, `MAX_SESSION_TIMEOUT`, or `NO_STATS_AVAIL`."
  
  # ---- ORGANIZATION QUOTAS ----
  
  - target: "$.components.schemas.OrganizationQuotas.properties.maxCustomRolesPerOrg"
    update:
      type: integer
      format: int64
      description: "Maximum number of custom roles allowed per organization."
```

These overlay files provide comprehensive documentation updates for version 1.101.0, following all the standards and patterns from the style guide. The overlays cover:

1. **Compute Environments**: New disable/enable endpoints
2. **Data Links**: Updated browse, download, and upload operations with improved descriptions
3. **Workflows**: New `includeTotalSize` parameter and workflow execution tracking enhancements
4. **Global Schemas**: Extensive updates to compute configurations, credentials, and platform metainfo with consistent descriptions across all HPC schedulers and cloud platforms
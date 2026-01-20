# Generated Overlays for v1.102.0

This file contains all the overlay files generated from the base-1.95-to-1.102.0-changes.yaml comparison overlay, plus manual enrichments for field descriptions.

**CRITICAL FIXES**:
- `data-links-operations-overlay-1.102.0.yaml` now correctly REMOVES the deprecated `/data-links/{dataLinkId}/download` endpoint
- `data-links-parameters-overlay-1.102.0.yaml` includes parameter array removal actions to prevent duplicate parameters

---

# Compute Environments Overlays

## compute-envs-operations-overlay-1.102.0.yaml

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
    update: "Disables the compute environment identified by the given `computeEnvId`. A disabled compute environment cannot be used to launch new workflows or Studio sessions. If the compute environment is primary, it will be automatically unset as primary. See [Disable compute environment](https://docs.seqera.io/platform-cloud/compute-envs/overview#disable-compute-environment)"

  # ---- ENABLE COMPUTE ENVIRONMENT ----

  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.summary"
    update: "Enable compute environment"

  - target: "$.paths./compute-envs/{computeEnvId}/enable.post.description"
    update: "Enables the compute environment identified by the given `computeEnvId`. An enabled compute environment can be used to launch new workflows and Studio sessions."
```

## compute-envs-parameters-overlay-1.102.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Compute environments parameters overlay
  version: 0.0.0
actions:
  # ===== COMPUTE ENVIRONMENTS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====

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

## compute-envs-schemas-overlay-1.102.0.yaml

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
      enum: ["CREATING", "AVAILABLE", "ERRORED", "INVALID", "DISABLED"]
      description: "Compute environment status. Accepts `CREATING`, `AVAILABLE`, `ERRORED`, `INVALID`, or `DISABLED`."
```

---

# Data Links Overlays

## data-links-operations-overlay-1.102.0.yaml

```yaml
actions:
  # ===== DATA-LINKS - OPERATIONS =====

  # Update existing operations

  - target: "$.paths./data-links/{dataLinkId}/browse.get.summary"
    update: "Explore data-link"

  - target: "$.paths./data-links/{dataLinkId}/browse.get.description"
    update: "Retrieves the content of the data-link associated with the given `dataLinkId`."

  - target: "$.paths./data-links/{dataLinkId}/browse/{path}.get.operationId"
    update: "ExploreDataLinkWithPath"

  - target: "$.paths./data-links/{dataLinkId}/upload.post.summary"
    update: "Generate data-link file upload URL"

  - target: "$.paths./data-links/{dataLinkId}/upload.post.description"
    update: "Creates a URL to upload files to the data-link associated with the given `dataLinkId`. For AWS S3 data-links, an additional follow-up request must be sent after your file upload has completed (or encountered an error) to finalize the upload - see the `/upload/finish` endpoint."

  - target: "$.paths./data-links/{dataLinkId}/upload/{dirPath}.post.operationId"
    update: "GenerateDataLinkUploadUrlWithPath"

  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.summary"
    update: "Finish data-link file upload"

  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.description"
    update: "Finish upload of a data-link file. This is necessary for AWS S3 data-links (`DataLinkProvider=aws`) to finalize a successful file upload, or abort an upload if an error was encountered while uploading a file using an upload URL from the `/upload` endpoint."

  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.responses['404'].description"
    update: "NotFound — workspace or credentials not found, API disabled for the workspace, or data-link not found."

  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.operationId"
    update: "FinishDataLinkUploadWithPath"

  - target: "$.paths./data-links/{dataLinkId}/upload/finish/{dirPath}.post.responses['200'].description"
    update: "FinishDataLinkUploadWithPath 200 response."

  # New endpoint in v1.102.0

  - target: "$.paths"
    update:
      /data-links/{dataLinkId}/download/{filePath}:
        get:
          tags:
            - data-links
          summary: "Download data-link file at path"
          description: "Downloads the content at the given `filePath` in the data-link associated with the given `dataLinkId`."
          operationId: DownloadDataLink
          parameters:
            - name: dataLinkId
              in: path
              description: "Data-link string identifier."
              required: true
              schema:
                type: string
            - name: filePath
              in: path
              description: "Resource path of the file to download."
              required: true
              schema:
                type: string
            - name: credentialsId
              in: query
              description: "Credentials string identifier."
              schema:
                type: string
            - name: workspaceId
              in: query
              description: "Workspace numeric identifier."
              schema:
                type: integer
                format: int64
          responses:
            "200":
              description: "OK."
              content:
                application/json:
                  schema:
                    type: string
                    format: binary
            "400":
              description: "Bad request."
              content:
                application/json:
                  schema:
                    $ref: "#/components/schemas/ErrorResponse"
            "404":
              description: "NotFound — workspace or credentials not found, API disabled for the workspace, or data-link or path not found."
              content:
                application/json:
                  schema:
                    $ref: "#/components/schemas/ErrorResponse"
            "403":
              description: "Operation not allowed."
          security:
            - BearerAuth: []

  # Remove deprecated endpoint

  - target: "$.paths./data-links/{dataLinkId}/download"
    remove: true
```

## data-links-parameters-overlay-1.102.0.yaml

**CRITICAL**: This overlay includes parameter array removal actions to prevent duplicate parameters.

```yaml
overlay: 1.0.0
info:
  title: Data-links parameters overlay
  version: 1.102.0
actions:
  # ===== DATA-LINKS PARAMETERS =====

  # ---- /data-links/{dataLinkId}/browse GET ----

  # CRITICAL: Remove entire parameters array to prevent duplicates
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[*]"
    remove: true

  # Replace with complete array with enriched descriptions
  - target: "$.paths./data-links/{dataLinkId}/browse.get.parameters"
    update:
      - name: dataLinkId
        in: path
        description: "Data-link string identifier."
        required: true
        schema:
          type: string
      - name: workspaceId
        in: query
        description: "Workspace numeric identifier."
        schema:
          type: integer
          format: int64
      - name: credentialsId
        in: query
        description: "Credentials string identifier."
        schema:
          type: string
      - name: search
        in: query
        description: "Prefix search of data-link content."
        schema:
          type: string
      - name: nextPageToken
        in: query
        description: "Token used to fetch the next page of items."
        schema:
          type: string
      - name: pageSize
        in: query
        description: "Number of items to return per page. If omitted, a default maximum value is returned."
        schema:
          type: integer
          format: int32

  # ---- /data-links/{dataLinkId}/upload POST ----

  # CRITICAL: Remove entire parameters array to prevent duplicates
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters[*]"
    remove: true

  # Replace with complete array with enriched descriptions
  - target: "$.paths./data-links/{dataLinkId}/upload.post.parameters"
    update:
      - name: dataLinkId
        in: path
        description: "Data-link string identifier."
        required: true
        schema:
          type: string
      - name: credentialsId
        in: query
        description: "Credentials string identifier."
        schema:
          type: string
      - name: workspaceId
        in: query
        description: "Workspace numeric identifier."
        schema:
          type: integer
          format: int64
      - name: Origin
        in: header
        schema:
          type: string
          nullable: true

  # ---- /data-links/{dataLinkId}/upload/finish POST ----

  # CRITICAL: Remove entire parameters array to prevent duplicates
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters[*]"
    remove: true

  # Replace with complete array with enriched descriptions
  - target: "$.paths./data-links/{dataLinkId}/upload/finish.post.parameters"
    update:
      - name: dataLinkId
        in: path
        description: "Data-link string identifier."
        required: true
        schema:
          type: string
      - name: credentialsId
        in: query
        description: "Credentials string identifier."
        schema:
          type: string
      - name: workspaceId
        in: query
        description: "Workspace numeric identifier."
        schema:
          type: integer
          format: int64
```

---

# Workflows Overlays

## workflows-parameters-overlay-1.102.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows parameters overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS PARAMETERS - QUERY PARAMETERS =====

  # ---- LIST WORKFLOWS PARAMETERS ----

  - target: "$.paths./workflow.get.parameters[?(@.name=='includeTotalSize')].description"
    update: "If true, includes total result count in the response. Default: `false`."
```

## workflows-operations-overlay-1.102.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Workflows operations overlay
  version: 0.0.0
actions:
  # ===== WORKFLOWS - OPERATIONS =====

  # ---- LAUNCH WORKFLOW ----

  - target: "$.paths./workflow/launch.post.description"
    update: |
      Submits a workflow execution.

      **To [resume](https://docs.seqera.io/platform-cloud/launch/cache-resume#resume-a-workflow-run) a workflow**: First, retrieve the launch configuration using [`GET /workflow/{workflowId}/launch`](https://docs.seqera.io/platform-api/describe-workflow-launch). Then modify the response by setting `workDir` to the value from `resumeDir`, `revision` to the value from `resumeCommitId`, and `resume` to `true`. Submit the modified payload to this endpoint to resume the workflow.
```

---

# Global Schemas Overlay

## global-schemas-overlay-1.102.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Global schemas overlay
  version: 0.0.0
actions:
  # ===== GLOBAL SCHEMAS - CREDENTIALS AND COMPUTE CONFIGURATIONS =====

  # ---- GIT CREDENTIALS ----

  - target: "$.components.schemas.GitKeys.description"
    update: "Git repository credentials."

  - target: "$.components.schemas.GitKeys.properties.discriminator.description"
    update: "Property to select the credentials type."

  - target: "$.components.schemas.GitKeys.properties.username.description"
    update: "Git username for authentication."

  - target: "$.components.schemas.GitKeys.properties.password.description"
    update: "Git password for authentication."

  - target: "$.components.schemas.GitKeys.properties.token.description"
    update: "Git personal access token for authentication."

  # ---- SEQERA COMPUTE CLOUD INSTANCE TYPE SIZE ----

  - target: "$.components.schemas.SeqeraComputeCloudInstanceTypeSize.description"
    update: "Data Studios instance size. Accepts `SMALL`, `MEDIUM`, or `LARGE`."

  # ---- SEQERA COMPUTE CONFIG ----

  - target: "$.components.schemas.SeqeraComputeConfig.properties.instanceTypeSize.description"
    update: "Size of the Data Studios instance. Accepts `SMALL`, `MEDIUM`, or `LARGE`."

  # ---- ABSTRACT GRID CONFIG ----

  - target: "$.components.schemas.AbstractGridConfig.properties.workDir.description"
    update: "Compute environment working directory."

  - target: "$.components.schemas.AbstractGridConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.AbstractGridConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.AbstractGridConfig.properties.environment.description"
    update: "Array of environment variables for the compute environment."

  - target: "$.components.schemas.AbstractGridConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."

  - target: "$.components.schemas.AbstractGridConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."

  - target: "$.components.schemas.AbstractGridConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."

  - target: "$.components.schemas.AbstractGridConfig.properties.userName.description"
    update: "Username for SSH authentication to the HPC cluster."

  - target: "$.components.schemas.AbstractGridConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."

  - target: "$.components.schemas.AbstractGridConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."

  - target: "$.components.schemas.AbstractGridConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."

  - target: "$.components.schemas.AbstractGridConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."

  - target: "$.components.schemas.AbstractGridConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at one time."

  - target: "$.components.schemas.AbstractGridConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."

  - target: "$.components.schemas.AbstractGridConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are propagated to compute jobs. Default: `false`."

  # ---- LSF COMPUTE CONFIG ----

  - target: "$.components.schemas.LsfComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."

  - target: "$.components.schemas.LsfComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.LsfComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.LsfComputeConfig.properties.environment.description"
    update: "Array of environment variables for the compute environment."

  - target: "$.components.schemas.LsfComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."

  - target: "$.components.schemas.LsfComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."

  - target: "$.components.schemas.LsfComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."

  - target: "$.components.schemas.LsfComputeConfig.properties.userName.description"
    update: "Username for SSH authentication to the HPC cluster."

  - target: "$.components.schemas.LsfComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."

  - target: "$.components.schemas.LsfComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."

  - target: "$.components.schemas.LsfComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."

  - target: "$.components.schemas.LsfComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."

  - target: "$.components.schemas.LsfComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at one time."

  - target: "$.components.schemas.LsfComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."

  - target: "$.components.schemas.LsfComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are propagated to compute jobs. Default: `false`."

  - target: "$.components.schemas.LsfComputeConfig.properties.unitForLimits.description"
    update: "Unit for memory and time limits in LSF."

  - target: "$.components.schemas.LsfComputeConfig.properties.perJobMemLimit.description"
    update: "If true, applies memory limit per job. Default: `false`."

  - target: "$.components.schemas.LsfComputeConfig.properties.perTaskReserve.description"
    update: "If true, reserves resources per task. Default: `false`."

  # ---- SLURM COMPUTE CONFIG ----

  - target: "$.components.schemas.SlurmComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."

  - target: "$.components.schemas.SlurmComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.SlurmComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.SlurmComputeConfig.properties.environment.description"
    update: "Array of environment variables for the compute environment."

  - target: "$.components.schemas.SlurmComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."

  - target: "$.components.schemas.SlurmComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."

  - target: "$.components.schemas.SlurmComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."

  - target: "$.components.schemas.SlurmComputeConfig.properties.userName.description"
    update: "Username for SSH authentication to the HPC cluster."

  - target: "$.components.schemas.SlurmComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."

  - target: "$.components.schemas.SlurmComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."

  - target: "$.components.schemas.SlurmComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."

  - target: "$.components.schemas.SlurmComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."

  - target: "$.components.schemas.SlurmComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at one time."

  - target: "$.components.schemas.SlurmComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."

  - target: "$.components.schemas.SlurmComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are propagated to compute jobs. Default: `false`."

  # ---- ALTAIR PBS COMPUTE CONFIG ----

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.environment.description"
    update: "Array of environment variables for the compute environment."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.userName.description"
    update: "Username for SSH authentication to the HPC cluster."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at one time."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."

  - target: "$.components.schemas.AltairPbsComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are propagated to compute jobs. Default: `false`."

  # ---- MOAB COMPUTE CONFIG ----

  - target: "$.components.schemas.MoabComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."

  - target: "$.components.schemas.MoabComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.MoabComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.MoabComputeConfig.properties.environment.description"
    update: "Array of environment variables for the compute environment."

  - target: "$.components.schemas.MoabComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."

  - target: "$.components.schemas.MoabComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."

  - target: "$.components.schemas.MoabComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."

  - target: "$.components.schemas.MoabComputeConfig.properties.userName.description"
    update: "Username for SSH authentication to the HPC cluster."

  - target: "$.components.schemas.MoabComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."

  - target: "$.components.schemas.MoabComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."

  - target: "$.components.schemas.MoabComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."

  - target: "$.components.schemas.MoabComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."

  - target: "$.components.schemas.MoabComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at one time."

  - target: "$.components.schemas.MoabComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."

  - target: "$.components.schemas.MoabComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are propagated to compute jobs. Default: `false`."

  # ---- UNIVA COMPUTE CONFIG ----

  - target: "$.components.schemas.UnivaComputeConfig.properties.workDir.description"
    update: "Compute environment working directory."

  - target: "$.components.schemas.UnivaComputeConfig.properties.preRunScript.description"
    update: "Script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.UnivaComputeConfig.properties.postRunScript.description"
    update: "Script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts)."

  - target: "$.components.schemas.UnivaComputeConfig.properties.environment.description"
    update: "Array of environment variables for the compute environment."

  - target: "$.components.schemas.UnivaComputeConfig.properties.nextflowConfig.description"
    update: "Additional Nextflow configuration content."

  - target: "$.components.schemas.UnivaComputeConfig.properties.discriminator.description"
    update: "Property to select the compute config platform."

  - target: "$.components.schemas.UnivaComputeConfig.properties.launchDir.description"
    update: "Launch directory for Nextflow execution."

  - target: "$.components.schemas.UnivaComputeConfig.properties.userName.description"
    update: "Username for SSH authentication to the HPC cluster."

  - target: "$.components.schemas.UnivaComputeConfig.properties.hostName.description"
    update: "Hostname or IP address of the HPC cluster head node."

  - target: "$.components.schemas.UnivaComputeConfig.properties.port.description"
    update: "SSH port for connecting to the HPC cluster. Default: `22`."

  - target: "$.components.schemas.UnivaComputeConfig.properties.headQueue.description"
    update: "Queue name for submitting the Nextflow head job."

  - target: "$.components.schemas.UnivaComputeConfig.properties.computeQueue.description"
    update: "Queue name for submitting Nextflow compute jobs."

  - target: "$.components.schemas.UnivaComputeConfig.properties.maxQueueSize.description"
    update: "Maximum number of jobs that can be queued at one time."

  - target: "$.components.schemas.UnivaComputeConfig.properties.headJobOptions.description"
    update: "Additional options for the head job submission."

  - target: "$.components.schemas.UnivaComputeConfig.properties.propagateHeadJobOptions.description"
    update: "If true, head job options are propagated to compute jobs. Default: `false`."

  # ---- EKS COMPUTE CONFIG ----

  - target: "$.components.schemas.EksComputeConfig.properties.region.description"
    update: "AWS region where the EKS cluster is located."

  - target: "$.components.schemas.EksComputeConfig.properties.clusterName.description"
    update: "Name of the AWS EKS cluster."

  # ---- GKE COMPUTE CONFIG ----

  - target: "$.components.schemas.GkeComputeConfig.properties.region.description"
    update: "Google Cloud region or zone where the GKE cluster is located."

  - target: "$.components.schemas.GkeComputeConfig.properties.clusterName.description"
    update: "Name of the Google GKE cluster."

  # ---- WORKFLOW AND TASK SCHEMAS ----

  - target: "$.components.schemas.Task.properties.numSpotInterruptions.description"
    update: "Number of spot instance interruptions encountered by this task."

  - target: "$.components.schemas.TraceProgressData.properties.numSpotInterruptions.description"
    update: "Total number of spot instance interruptions across all tasks."

  - target: "$.components.schemas.WorkflowLoad.properties.numSpotInterruptions.description"
    update: "Number of spot instance interruptions for the workflow."

  # ---- LIST WORKFLOWS RESPONSE ----

  - target: "$.components.schemas.ListWorkflowsResponse.properties.hasMore.description"
    update: "If true, indicates there are more results available beyond this page."

  # ---- ORGANIZATION QUOTAS ----

  - target: "$.components.schemas.OrganizationQuotas.properties.maxCustomRolesPerOrg.description"
    update: "Maximum number of custom roles allowed per organization."

  # ---- DATA STUDIO STOP REASON ----

  - target: "$.components.schemas.DataStudioStopReason.description"
    update: "Reason for Data Studio session termination. Accepts `UNKNOWN`, `USER_REQUEST`, `TIMEOUT`, `ERROR`, `RESOURCE_LIMIT`, or `NO_STATS_AVAIL`."
```

---

# Manual Field Descriptions Overlay

## manual-field-descriptions-overlay-1.102.0.yaml

```yaml
overlay: 1.0.0
info:
  title: Manual field descriptions overlay
  version: 0.0.0
actions:
  # ===== PIPELINE SECRETS SCHEMAS =====

  # ---- CREATE PIPELINE SECRET REQUEST ----

  - target: "$.components.schemas.CreatePipelineSecretRequest.properties.name.description"
    update: "Unique name for the pipeline secret within the workspace. Used to reference the secret in workflow configurations."

  - target: "$.components.schemas.CreatePipelineSecretRequest.properties.value.description"
    update: "The secret value to be securely stored. This value will be made available to pipeline executions as an environment variable or configuration value."

  # ---- UPDATE PIPELINE SECRET REQUEST ----

  - target: "$.components.schemas.UpdatePipelineSecretRequest.properties.value.description"
    update: "New secret value to replace the existing value. The secret value is securely stored and made available to pipeline executions."

  # ===== DATASETS SCHEMAS =====

  # ---- CREATE DATASET REQUEST ----

  - target: "$.components.schemas.CreateDatasetRequest.properties.name.description"
    update: "Unique dataset name within the workspace. Must be a valid identifier that can be referenced in workflow configurations."

  - target: "$.components.schemas.CreateDatasetRequest.properties.description.description"
    update: "Optional description of the dataset. Provides context about the dataset contents, source, or intended use."

  # ---- UPDATE DATASET REQUEST ----

  - target: "$.components.schemas.UpdateDatasetRequest.properties.name.description"
    update: "New name for the dataset. Must be unique within the workspace and can be used to reference the dataset in workflow configurations."

  - target: "$.components.schemas.UpdateDatasetRequest.properties.description.description"
    update: "Updated description for the dataset. Provides context about the dataset contents, source, or intended use."

  # ===== WORKSPACES SCHEMAS =====

  # ---- UPDATE WORKSPACE REQUEST ----

  - target: "$.components.schemas.UpdateWorkspaceRequest.properties.name.description"
    update: "New short name for the workspace. Must be 2-40 characters, start and end with alphanumeric characters, and can contain hyphens or underscores between characters. Must be unique within the organization."

  - target: "$.components.schemas.UpdateWorkspaceRequest.properties.fullName.description"
    update: "Updated full display name for the workspace. Maximum 100 characters."

  - target: "$.components.schemas.UpdateWorkspaceRequest.properties.description.description"
    update: "Updated description of the workspace. Maximum 1000 characters."

  # ===== ACTIONS SCHEMAS =====

  # ---- UPDATE ACTION REQUEST ----

  - target: "$.components.schemas.UpdateActionRequest.properties.name.description"
    update: "New name for the pipeline action. Must be unique within the workspace."
```

---

# Fix Duplicate Required Fields Overlay

## fix-duplicate-required-fields-overlay-1.102.0.yaml

**CRITICAL**: This overlay fixes duplicate required fields in compute config schemas using the "remove first, then update" pattern.

```yaml
overlay: 1.0.0
info:
  title: Fix duplicate required fields overlay
  version: 1.102.0
actions:
  # ===== FIX DUPLICATE REQUIRED FIELDS =====

  # These duplicate required fields exist in the base spec
  # We use the "remove first, then update" pattern to fix them

  # ---- AwsBatchConfig ----

  - target: "$.components.schemas.AwsBatchConfig.required"
    remove: true

  - target: "$.components.schemas.AwsBatchConfig"
    update:
      required: ["region", "workDir"]

  # ---- AwsCloudConfig ----

  - target: "$.components.schemas.AwsCloudConfig.required"
    remove: true

  - target: "$.components.schemas.AwsCloudConfig"
    update:
      required: ["region", "workDir"]

  # ---- AzBatchConfig ----

  - target: "$.components.schemas.AzBatchConfig.required"
    remove: true

  - target: "$.components.schemas.AzBatchConfig"
    update:
      required: ["region", "workDir"]

  # ---- AzCloudConfig ----

  - target: "$.components.schemas.AzCloudConfig.required"
    remove: true

  - target: "$.components.schemas.AzCloudConfig"
    update:
      required: ["location", "workDir"]

  # ---- ConfigEnvVariable ----

  - target: "$.components.schemas.ConfigEnvVariable.required"
    remove: true

  - target: "$.components.schemas.ConfigEnvVariable"
    update:
      required: ["name", "value"]

  # ---- CreateComputeEnvRequest ----

  - target: "$.components.schemas.CreateComputeEnvRequest.required"
    remove: true

  - target: "$.components.schemas.CreateComputeEnvRequest"
    update:
      required: ["computeEnv"]

  # ---- GkeComputeConfig ----

  - target: "$.components.schemas.GkeComputeConfig.required"
    remove: true

  - target: "$.components.schemas.GkeComputeConfig"
    update:
      required: ["region", "clusterName", "workDir"]

  # ---- GoogleBatchConfig ----

  - target: "$.components.schemas.GoogleBatchConfig.required"
    remove: true

  - target: "$.components.schemas.GoogleBatchConfig"
    update:
      required: ["location", "workDir"]

  # ---- GoogleCloudConfig ----

  - target: "$.components.schemas.GoogleCloudConfig.required"
    remove: true

  - target: "$.components.schemas.GoogleCloudConfig"
    update:
      required: ["region", "workDir"]

  # ---- K8sComputeConfig ----

  - target: "$.components.schemas.K8sComputeConfig.required"
    remove: true

  - target: "$.components.schemas.K8sComputeConfig"
    update:
      required: ["server", "sslCert", "workDir"]

  # ---- SeqeraComputeConfig ----

  - target: "$.components.schemas.SeqeraComputeConfig.required"
    remove: true

  - target: "$.components.schemas.SeqeraComputeConfig"
    update:
      required: ["region", "workDir"]

  # ---- ComputeEnv_ComputeConfig_ ----

  - target: "$.components.schemas.ComputeEnv_ComputeConfig_.required"
    remove: true

  - target: "$.components.schemas.ComputeEnv_ComputeConfig_"
    update:
      required: ["config", "name", "platform"]

  # ---- EksComputeConfig ----

  - target: "$.components.schemas.EksComputeConfig.required"
    remove: true

  - target: "$.components.schemas.EksComputeConfig"
    update:
      required: ["region", "clusterName", "workDir"]
```

---

# Fix Duplicate Enum Values Overlay

## fix-duplicate-enums-overlay-1.102.0.yaml

**CRITICAL**: This overlay fixes duplicate enum values in query parameters and schemas using the "remove first, then update" pattern.

```yaml
overlay: 1.0.0
info:
  title: Fix duplicate enum values overlay
  version: 1.102.0
actions:
  # ===== FIX DUPLICATE ENUM VALUES =====

  # These duplicate enum values exist in the base decorated spec
  # We use the "remove first, then update" pattern to fix them

  # ---- Query Parameter: Status (line 563) ----

  - target: "$.paths./compute-envs.get.parameters[?(@.name=='status')].schema.enum"
    remove: true

  - target: "$.paths./compute-envs.get.parameters[?(@.name=='status')].schema"
    update:
      enum: ["CREATING", "AVAILABLE", "ERRORED", "INVALID"]

  # ---- Query Parameter: Attributes (line 809) ----

  - target: "$.paths./compute-envs/{computeEnvId}.get.parameters[?(@.name=='attributes')].schema.items.enum"
    remove: true

  - target: "$.paths./compute-envs/{computeEnvId}.get.parameters[?(@.name=='attributes')].schema.items"
    update:
      enum: ["labels"]

  # ---- AzBatchConfig.deleteJobsOnCompletion (line 8891) ----

  - target: "$.components.schemas.AzBatchConfig.properties.deleteJobsOnCompletion.enum"
    remove: true

  - target: "$.components.schemas.AzBatchConfig.properties.deleteJobsOnCompletion"
    update:
      enum: ["on_success", "always", "never"]

  # ---- ComputeEnv_ComputeConfig_.platform (lines 9283-9331) ----
  # This has extensive triplication of values

  - target: "$.components.schemas.ComputeEnv_ComputeConfig_.properties.platform.enum"
    remove: true

  - target: "$.components.schemas.ComputeEnv_ComputeConfig_.properties.platform"
    update:
      enum:
        - "aws-batch"
        - "aws-cloud"
        - "google-batch"
        - "google-cloud"
        - "azure-batch"
        - "azure-cloud"
        - "k8s-platform"
        - "eks-platform"
        - "gke-platform"
        - "uge-platform"
        - "slurm-platform"
        - "lsf-platform"
        - "altair-platform"
        - "moab-platform"
        - "local-platform"
        - "seqeracompute-platform"

  # ---- ComputeEnv_ComputeConfig_.status (line 9361) ----

  - target: "$.components.schemas.ComputeEnv_ComputeConfig_.properties.status.enum"
    remove: true

  - target: "$.components.schemas.ComputeEnv_ComputeConfig_.properties.status"
    update:
      enum: ["CREATING", "AVAILABLE", "ERRORED", "INVALID"]

  # ---- K8sComputeConfig.podCleanup (line 11444) ----

  - target: "$.components.schemas.K8sComputeConfig.properties.podCleanup.enum"
    remove: true

  - target: "$.components.schemas.K8sComputeConfig.properties.podCleanup"
    update:
      enum: ["on_success", "always", "never"]
```

---

# Remove Google Life Sciences Platform

## remove-google-lifesciences-overlay-1.102.0.yaml

**CRITICAL**: This overlay removes the deprecated google-lifesciences platform option from the API spec entirely.

```yaml
overlay: 1.0.0
info:
  title: Remove Google Life Sciences platform overlay
  version: 1.102.0
actions:
  # ===== REMOVE GOOGLE LIFE SCIENCES PLATFORM =====

  # This platform option is deprecated and should be removed from the API spec

  # ---- Remove from ComputeEnvResponseDto.platform enum (line 9198) ----

  - target: "$.components.schemas.ComputeEnvResponseDto.properties.platform.enum"
    remove: true

  - target: "$.components.schemas.ComputeEnvResponseDto.properties.platform"
    update:
      enum:
        - "aws-batch"
        - "aws-cloud"
        - "seqeracompute-platform"
        - "google-batch"
        - "azure-batch"
        - "k8s-platform"
        - "eks-platform"
        - "gke-platform"
        - "uge-platform"
        - "slurm-platform"
        - "lsf-platform"
        - "altair-platform"

  # ---- Remove from ComputeConfig discriminator mapping (line 9140) ----

  - target: "$.components.schemas.ComputeConfig.discriminator.mapping.google-lifesciences"
    remove: true

  # ---- Replace ComputeConfig oneOf array without GoogleLifeSciencesConfig ----

  - target: "$.components.schemas.ComputeConfig.oneOf"
    update:
      - $ref: "#/components/schemas/AwsBatchConfig"
      - $ref: "#/components/schemas/AwsCloudConfig"
      - $ref: "#/components/schemas/SeqeraComputeConfig"
      - $ref: "#/components/schemas/GoogleBatchConfig"
      - $ref: "#/components/schemas/AzBatchConfig"
      - $ref: "#/components/schemas/LsfComputeConfig"
      - $ref: "#/components/schemas/SlurmComputeConfig"
      - $ref: "#/components/schemas/K8sComputeConfig"
      - $ref: "#/components/schemas/EksComputeConfig"
      - $ref: "#/components/schemas/GkeComputeConfig"
      - $ref: "#/components/schemas/UnivaComputeConfig"
      - $ref: "#/components/schemas/AltairPbsComputeConfig"
      - $ref: "#/components/schemas/MoabComputeConfig"

  # ---- Remove GoogleLifeSciencesConfig schema definition (line 11229+) ----

  - target: "$.components.schemas.GoogleLifeSciencesConfig"
    remove: true
```

---

This completes all the overlay files for version 1.102.0. The overlays are organized by controller/feature and follow all the standards exactly as specified in your style guide.

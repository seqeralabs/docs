## platform-overlay-1.140.0.yaml

```yaml
overlay: 1.0.0
x-speakeasy-jsonpath: rfc9535
info:
  title: Platform API overlay for v1.140.0
  version: 0.0.0
actions:
  - target: $["components"]["schemas"]["Action.ConfigType"]["discriminator"]["mapping"]
    update:
      bucket: '#/components/schemas/BucketActionConfig'
  - target: $["components"]["schemas"]["Action.ConfigType"]["oneOf"]
    update:
      - $ref: '#/components/schemas/BucketActionConfig'
  - target: $["components"]["schemas"]["Action.EventType"]["discriminator"]["mapping"]
    update:
      bucket: '#/components/schemas/BucketActionEvent'
  - target: $["components"]["schemas"]["Action.EventType"]["oneOf"]
    update:
      - $ref: '#/components/schemas/BucketActionEvent'
  - target: $["components"]["schemas"]["Action.Source"]["enum"]
    update:
      - bucket
  - target: $["components"]["schemas"]["Action.Source"]["x-enum-varnames"]
    update:
      - bucket
  - target: $["components"]["schemas"]["ActionResponseDto"]["properties"]
    update:
      error:
        type: string
        description: Action error message, if action setup or execution failed. Can be `null`.
  - target: $["components"]["schemas"]["ActionResponseDto"]["properties"]["message"]
    remove: true
  - target: $["components"]["schemas"]["ActiveConnection"]["allOf"][1]
    update:
      type: object
  - target: $["components"]["schemas"]["AwsBatchConfig"]["properties"]["forgedResources"]["items"]["additionalProperties"]
    update:
      type: object
  - target: $["components"]["schemas"]["AwsCloudConfig"]["properties"]["forgedResources"]["items"]["additionalProperties"]
    update:
      type: object
  - target: $["components"]["schemas"]["AwsCloudConfig"]["properties"]
    update:
      schedConfig:
        $ref: '#/components/schemas/SchedConfig'
        description: Scheduler-specific settings for Seqera Scheduler execution.
  - target: $["components"]["schemas"]["AwsCloudConfig"]["properties"]
    update:
      schedEnabled:
        type: boolean
        description: When true, enables Seqera Scheduler execution for this compute environment. Defaults to `false`.
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]["deleteJobsOnCompletion"]
    update:
      allOf:
        - $ref: '#/components/schemas/JobCleanupPolicy'
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]["deleteJobsOnCompletion"]
    update:
      nullable: true
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]["deleteJobsOnCompletion"]
    update:
      readOnly: true
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]["deleteJobsOnCompletion"]["$ref"]
    remove: true
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      deleteJobsOnCompletionEnabled:
        nullable: true
        type: boolean
        description: When true, Azure Batch jobs are deleted after successful completion. Can be `null`.
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      deleteTasksOnCompletion:
        nullable: true
        type: boolean
        description: When true, Azure Batch tasks are deleted after completion. Can be `null`.
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      headJobCpus:
        description: Number of CPU slots reserved on the head pool VM for the Nextflow head job. Defaults to 1 so multiple
          head jobs can share a head pool VM; increase to dedicate more CPU and memory to each head job.
        example: 1
        format: int32
        nullable: true
        type: integer
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      headJobMemoryMb:
        description: Memory in MiB reserved for the Nextflow head job container. When omitted, the value is derived from the
          head pool VM size as the per-slot share (vmMemory / vmCpus) multiplied by the requested slot count.
        example: 4096
        format: int32
        nullable: true
        type: integer
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      jobMaxWallClockTime:
        description: Maximum wall clock time for Azure Batch jobs before automatic termination. Accepts human-readable duration syntax, for example `7d` or `1d1h1m`. Defaults to `7d` when not specified. Maximum is 180 days.
        example: 7d
        nullable: true
        type: string
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      managedIdentityHeadResourceId:
        nullable: true
        type: string
        description: Full Azure resource ID of the user-assigned managed identity attached to the head pool for the Nextflow
          launcher. Can be `null`.
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      managedIdentityPoolClientId:
        nullable: true
        type: string
        description: Managed identity client ID used by compute tasks running on Azure Batch pool nodes. Can be `null`.
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      managedIdentityPoolResourceId:
        nullable: true
        type: string
        description: Full Azure resource ID of the user-assigned managed identity attached to worker pool nodes. Requires
          Entra credentials for management-plane pool creation. Can be `null`.
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      subnetId:
        description: Azure VNet subnet resource ID for private network isolation. Requires Entra (service principal) credentials.
        example: /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRg/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet
        nullable: true
        type: string
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      terminateJobsOnCompletion:
        nullable: true
        type: boolean
        description: When true, Azure Batch jobs are terminated when the workflow completes. Can be `null`.
  - target: $["components"]["schemas"]["AzBatchConfig"]["properties"]
    update:
      workerPool:
        type: string
        description: Azure Batch worker pool name used for task execution when separate head and worker pools are configured.
  - target: $["components"]["schemas"]["AzBatchForgeConfig"]["properties"]
    update:
      dualPoolConfig:
        type: boolean
        description: When true, Forge uses separate Azure Batch head and worker pool configurations.
  - target: $["components"]["schemas"]["AzBatchForgeConfig"]["properties"]
    update:
      headPool:
        allOf:
          - $ref: '#/components/schemas/AzBatchPoolConfig'
        description: Head pool configuration for dual pool mode
  - target: $["components"]["schemas"]["AzBatchForgeConfig"]["properties"]
    update:
      workerPool:
        allOf:
          - $ref: '#/components/schemas/AzBatchPoolConfig'
        description: Worker pool configuration for dual pool mode
  - target: $["components"]["schemas"]
    update:
      AzBatchPoolConfig:
        description: Azure Batch pool configuration for head or worker pool
        properties:
          autoScale:
            type: boolean
            description: When true, enables auto-scaling for the Azure Batch pool.
          vmCount:
            format: int32
            type: integer
            description: Number of VMs in the Azure Batch pool. When auto-scaling is enabled, this is the maximum number of
              VMs the pool can scale to.
          vmType:
            type: string
            description: Azure VM type used by the Batch pool. Must be a valid Azure Batch VM type.
        type: object
  - target: $["components"]["schemas"]
    update:
      BucketActionConfig:
        properties:
          bucketName:
            type: string
            description: Bucket name resolved from the data-link when the action is created.
          dataLinkId:
            type: string
            description: Data-link string identifier that provides the bucket location and credentials.
          datasetId:
            type: string
            description: Dataset string identifier where bucket event changesets are stored as new versions.
          discriminator:
            type: string
            description: Provider discriminator for the bucket action configuration. Expected value is `bucket`.
          events:
            items:
              type: string
            type: array
            description: Array of bucket event types that trigger the action, for example `object:created`.
          filter:
            type: string
            description: Glob pattern used to match object keys. Supports `*` and `?` wildcards; when omitted, all objects
              in the bucket match.
          markerFile:
            type: string
            description: Marker file name that signals batch completion and triggers the pending bucket event batch to be
              flushed.
          subscriptionArn:
            type: string
            description: Amazon SNS subscription ARN provisioned for bucket notifications.
          topicArn:
            type: string
            description: Amazon SNS topic ARN provisioned for bucket notifications.
        title: Bucket action config
        type: object
  - target: $["components"]["schemas"]
    update:
      BucketActionEvent:
        properties:
          bucketName:
            type: string
            description: Bucket name associated with the received bucket event.
          discriminator:
            type: string
            description: Provider discriminator for the bucket action event. Expected value is `bucket`.
          eventName:
            type: string
            description: Bucket event type, for example `object:created`, `object:modified`, or `object:deleted`.
          provider:
            type: string
            description: Cloud provider that emitted the bucket event.
          recordCount:
            format: int32
            type: integer
            description: Number of event records included in the bucket notification.
          timestamp:
            format: date-time
            type: string
            description: Timestamp when the bucket event notification was emitted.
        title: Bucket action event
        type: object
  - target: $["components"]["schemas"]
    update:
      BucketActionRequest:
        properties:
          dataLinkId:
            type: string
            description: Data-link string identifier that provides the bucket location and credentials.
          datasetId:
            type: string
            description: Dataset string identifier where bucket event changesets are stored as new versions.
          events:
            items:
              type: string
            type: array
            description: Array of bucket event types that trigger the action, for example `object:created`.
          filter:
            type: string
            description: Glob pattern used to match object keys. Supports `*` and `?` wildcards; when omitted, all objects
              in the bucket match.
          markerFile:
            type: string
            description: Marker file name that signals batch completion and triggers the pending bucket event batch to be
              flushed.
        type: object
  - target: $["components"]["schemas"]
    update:
      ChangeStatus:
        enum:
          - UNCHANGED
          - CHANGED
          - UNKNOWN
          - UNAVAILABLE
        type: string
        description: Linked dataset source change detection status. Accepts `UNCHANGED`, `CHANGED`, `UNKNOWN`, or `UNAVAILABLE`.
  - target: $["components"]["schemas"]["ComputeConfig"]["oneOf"][*]
    remove: true
  - target: $["components"]["schemas"]["ComputeConfig"]["oneOf"]
    update:
      - $ref: '#/components/schemas/AwsBatchConfig'
      - $ref: '#/components/schemas/AwsCloudConfig'
      - $ref: '#/components/schemas/SeqeraComputeConfig'
      - $ref: '#/components/schemas/GoogleBatchConfig'
      - $ref: '#/components/schemas/GoogleCloudConfig'
      - $ref: '#/components/schemas/AzBatchConfig'
      - $ref: '#/components/schemas/AzCloudConfig'
      - $ref: '#/components/schemas/LsfComputeConfig'
      - $ref: '#/components/schemas/SlurmComputeConfig'
      - $ref: '#/components/schemas/K8sComputeConfig'
      - $ref: '#/components/schemas/EksComputeConfig'
      - $ref: '#/components/schemas/GkeComputeConfig'
      - $ref: '#/components/schemas/UnivaComputeConfig'
      - $ref: '#/components/schemas/AltairPbsComputeConfig'
      - $ref: '#/components/schemas/MoabComputeConfig'
      - $ref: '#/components/schemas/LocalComputeConfig'
      - $ref: '#/components/schemas/GoogleLifeSciencesConfig'
  - target: $["components"]["schemas"]["ComputeEnvResponseDto"]["properties"]["platform"]["enum"][*]
    remove: true
  - target: $["components"]["schemas"]["ComputeEnvResponseDto"]["properties"]["platform"]["enum"]
    update:
      - aws-batch
      - aws-cloud
      - seqeracompute-platform
      - google-batch
      - google-cloud
      - azure-batch
      - azure-cloud
      - k8s-platform
      - eks-platform
      - gke-platform
      - uge-platform
      - slurm-platform
      - lsf-platform
      - altair-platform
      - moab-platform
      - local-platform
      - google-lifesciences
  - target: $["components"]["schemas"]["ComputeEnvQueryAttribute"]["enum"][*]
    remove: true
  - target: $["components"]["schemas"]["ComputeEnvQueryAttribute"]["enum"]
    update:
      - labels
      - resources
  - target: $["components"]["schemas"]["ComputeEnvQueryAttribute"]["x-enum-varnames"][*]
    remove: true
  - target: $["components"]["schemas"]["ComputeEnvQueryAttribute"]["x-enum-varnames"]
    update:
      - labels
      - resources
  - target: $["components"]["schemas"]["ComputeEnv_ComputeConfig_"]["properties"]["platform"]["enum"][*]
    remove: true
  - target: $["components"]["schemas"]["ComputeEnv_ComputeConfig_"]["properties"]["platform"]["enum"]
    update:
      - aws-batch
      - aws-cloud
      - seqeracompute-platform
      - google-batch
      - google-cloud
      - azure-batch
      - azure-cloud
      - k8s-platform
      - eks-platform
      - gke-platform
      - uge-platform
      - slurm-platform
      - lsf-platform
      - altair-platform
      - moab-platform
      - local-platform
      - google-lifesciences
  - target: $["components"]["schemas"]["CreateActionRequest"]["properties"]
    update:
      bucket:
        $ref: '#/components/schemas/BucketActionRequest'
        description: Bucket action configuration for cloud storage event triggers.
  - target: $["components"]["schemas"]["CreateDatasetRequest"]["properties"]
    update:
      sourceType:
        $ref: '#/components/schemas/SourceType'
        description: Dataset source type. Accepts `UPLOADED` or `LINKED`.
  - target: $["components"]["schemas"]["Credentials"]["properties"]["provider"]["enum"][*]
    remove: true
  - target: $["components"]["schemas"]["Credentials"]["properties"]["provider"]["enum"]
    update:
      - aws
      - azure
      - azure_entra
      - google
      - github
      - github_app
      - gitlab
      - bitbucket
      - ssh
      - k8s
      - container-reg
      - tw-agent
      - codecommit
      - gitea
      - azurerepos
      - seqeracompute
      - azure-cloud
      - s3
  - target: $["components"]["schemas"]["DataLinkDownloadUrlResponse"]["properties"]
    update:
      resolvedMimeType:
        type: string
        description: MIME type of the resolved symlink target file. Can be `null` for normal downloads or when symlink resolution
          fails.
  - target: $["components"]["schemas"]["DataLinkDownloadUrlResponse"]["properties"]
    update:
      resolvedPath:
        type: string
        description: Cloud storage path of the resolved symlink target. Can be `null` for normal downloads or when symlink
          resolution fails.
  - target: $["components"]["schemas"]["DataLinkDownloadUrlResponse"]["properties"]
    update:
      warning:
        type: string
        description: Warning message returned when symlink resolution falls back to the symlink file itself. Can be `null`.
  - target: $["components"]["schemas"]["DataLinkItemType"]["enum"]
    update:
      - FUSION_SYMLINK_FILE
  - target: $["components"]["schemas"]["DataStudioComputeEnvDto"]["allOf"][1]
    update:
      type: object
  - target: $["components"]["schemas"]["DataStudioStartRequest"]["properties"]
    update:
      name:
        maxLength: 80
        minLength: 1
        nullable: true
        type: string
        description: Optional Studio session name. Must be between 1 and 80 characters when provided. Can be `null`.
  - target: $["components"]["schemas"]
    update:
      DataStudioUpdateRequest:
        properties:
          configuration:
            allOf:
              - $ref: '#/components/schemas/DataStudioConfiguration'
            nullable: true
            description: Updated Studio resource allocation and environment configuration. Can be `null`.
          description:
            maxLength: 2048
            nullable: true
            type: string
            description: Optional Studio description. Maximum length is 2048 characters. Can be `null`.
          labelIds:
            items:
              format: int64
              type: integer
            nullable: true
            type: array
            description: Array of label numeric identifiers to apply to the Studio. Can be `null`.
          name:
            maxLength: 80
            minLength: 1
            nullable: true
            type: string
            description: Optional Studio session name. Must be between 1 and 80 characters when provided. Can be `null`.
        type: object
  - target: $["components"]["schemas"]["DataStudioWorkspaceSettingsRequest"]["properties"]["containerRepository"]
    update:
      description: Container repository where Wave pushes images built for Studios in this workspace (e.g. 'cr.seqera.io/my-org/studios').
        When null, the platform default is used.
  - target: $["components"]["schemas"]["DataStudioWorkspaceSettingsRequest"]["properties"]["lifespanHours"]
    update:
      description: Maximum number of hours a Studio session may run before it is automatically stopped. Use 0 for unlimited
        lifespan.
  - target: $["components"]["schemas"]["DataStudioWorkspaceSettingsRequest"]["properties"]["lifespanHours"]["minimum"]
    remove: true
  - target: $["components"]["schemas"]["DataStudioWorkspaceSettingsRequest"]["properties"]
    update:
      nameStrategy:
        description: Wave image naming strategy applied to container images built for Studios in this workspace. When null,
          the platform default strategy is used.
        enum:
          - none
          - tagPrefix
          - imageSuffix
        nullable: true
        type: string
  - target: $["components"]["schemas"]["DataStudioWorkspaceSettingsRequest"]["properties"]["privateStudioByDefault"]
    update:
      description: When true, newly created Studio sessions are private by default and only accessible to their creator.
  - target: $["components"]["schemas"]["DataStudioWorkspaceSettingsResponse"]["properties"]
    update:
      nameStrategy:
        nullable: true
        type: string
        description: Wave image naming strategy applied to container images built for Studios in this workspace.
  - target: $["components"]["schemas"]["DatasetDto"]["properties"]
    update:
      sourceType:
        $ref: '#/components/schemas/SourceType'
        description: Dataset source type. Accepts `UPLOADED` or `LINKED`.
  - target: $["components"]["schemas"]
    update:
      DatasetPreviewResponse:
        properties:
          content:
            type: string
            description: Dataset content.
          fileTooLarge:
            type: boolean
            description: When true, the file is too large to return in the response.
          reachable:
            type: boolean
            description: When true, the dataset preview is reachable.
        type: object
  - target: $["components"]["schemas"]["DatasetVersionDto"]["properties"]
    update:
      linkedSource:
        $ref: '#/components/schemas/LinkedSourceDto'
        description: Linked external source details for a linked dataset version.
  - target: $["components"]["schemas"]
    update:
      GitHubAppSecurityKeys:
        properties:
          appId:
            type: string
            description: GitHub App identifier.
          clientId:
            type: string
            description: GitHub App client identifier.
          clientSecret:
            type: string
            writeOnly: true
            description: GitHub App client secret returned by the manifest flow. Write-only.
          discriminator:
            type: string
            description: Credentials provider discriminator. Expected value is `github_app`.
          privateKey:
            type: string
            writeOnly: true
            description: GitHub App private key in PEM format. Write-only.
          slug:
            type: string
            description: GitHub App URL slug returned by the manifest flow.
          webhookSecret:
            type: string
            writeOnly: true
            description: GitHub App webhook secret returned by the manifest flow. Write-only.
        type: object
  - target: $["components"]["schemas"]["GoogleBatchConfig"]["properties"]
    update:
      bootDiskImage:
        type: string
        description: Boot disk image used for Google Batch jobs.
  - target: $["components"]["schemas"]["GoogleBatchConfig"]["properties"]
    update:
      computeJobsMachineType:
        items:
          type: string
        type: array
        description: Array of Google Cloud machine types allowed for compute jobs.
  - target: $["components"]["schemas"]["GoogleBatchConfig"]["properties"]
    update:
      fusionSnapshots:
        type: boolean
        description: When true, enables [Fusion Snapshots](https://docs.seqera.io/fusion/guide/snapshots). Requires Fusion file system.
  - target: $["components"]["schemas"]["GoogleBatchConfig"]["properties"]
    update:
      networkTags:
        items:
          type: string
        type: array
        description: Array of Google Cloud network tags applied to Batch job resources.
  - target: $["components"]["schemas"]["GoogleCloudConfig"]["properties"]["forgedResources"]["items"]["additionalProperties"]
    update:
      type: object
  - target: $["components"]["schemas"]["GoogleImage"]["properties"]
    update:
      qualifiedName:
        type: string
        description: Fully qualified image path, for example `projects/{project}/global/images/{image}`, or a Google Batch
          short image name.
  - target: $["components"]["schemas"]["GooglePlatformMetainfo"]["properties"]
    update:
      images:
        items:
          $ref: '#/components/schemas/GoogleImage'
        type: array
        description: Array of Google Cloud images available for compute environments.
  - target: $["components"]["schemas"]["GooglePlatformMetainfo"]["properties"]
    update:
      instanceTypes:
        items:
          $ref: '#/components/schemas/GoogleInstanceType'
        type: array
        description: Array of Google Cloud instance types available for compute environments.
  - target: $["components"]["schemas"]["GoogleSecurityKeys"]["properties"]
    update:
      serviceAccountEmail:
        type: string
        description: Google service account email to impersonate when using Workload Identity Federation.
  - target: $["components"]["schemas"]["GoogleSecurityKeys"]["properties"]
    update:
      tokenAudience:
        type: string
        description: Optional custom audience for the Workload Identity Federation OIDC token exchange.
  - target: $["components"]["schemas"]["GoogleSecurityKeys"]["properties"]
    update:
      workloadIdentityProvider:
        type: string
        description: Full resource name of the Google Workload Identity Federation OIDC provider.
  - target: $["components"]["schemas"]["LaunchActionRequest"]["properties"]["params"]["additionalProperties"]
    update:
      type: object
  - target: $["components"]["schemas"]
    update:
      LinkVersionRequest:
        properties:
          hasHeader:
            type: boolean
            description: When true, treats the first row of the linked CSV or TSV file as a header row. Defaults to `true`.
          url:
            type: string
            description: HTTP or HTTPS URL pointing to a public CSV or TSV file. Maximum length is 2048 characters.
        type: object
  - target: $["components"]["schemas"]
    update:
      LinkedSourceDto:
        properties:
          changeStatus:
            $ref: '#/components/schemas/ChangeStatus'
            description: Computed change detection status for the linked dataset source.
          checkedAt:
            format: date-time
            type: string
            description: Timestamp of the last change detection check. Can be `null` if never checked.
          hasChangeIndicators:
            type: boolean
            description: When true, the remote source provides ETag or Content-Length headers for change detection.
          url:
            type: string
            description: External URL linked to this dataset version.
        type: object
  - target: $["components"]["schemas"]["ListActionsResponse.ActionInfo"]["properties"]
    update:
      error:
        type: string
        description: Action error message, if action setup or execution failed. Can be `null`.
  - target: $["components"]["schemas"]["ListActionsResponse.ActionInfo"]["properties"]
    update:
      hint:
        type: string
        description: Human-readable hint describing the bucket event trigger for bucket actions. Can be `null`.
  - target: $["components"]["schemas"]["LocalComputeConfig"]
    update:
      properties:
        discriminator:
          description: Property to select the compute config platform.
          type: string
        environment:
          items:
            $ref: '#/components/schemas/ConfigEnvVariable'
          type: array
          description: Array of environment variables for the compute environment.
        fusion2Enabled:
          type: boolean
          description: When true, enables [Fusion file system](https://docs.seqera.io/fusion). Requires Wave containers. Defaults to `false`.
        nextflowConfig:
          type: string
          description: Additional Nextflow configuration to apply. See [Nextflow config file](https://docs.seqera.io/platform-cloud/launch/advanced#nextflow-config-file).
        postRunScript:
          description: Add a script that executes after all Nextflow processes have completed. See [Pre and post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts).
          type: string
        preRunScript:
          description: Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See [Pre and
            post-run scripts](https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts).
          type: string
        schedConfig:
          $ref: '#/components/schemas/SchedConfig'
          description: Scheduler-specific settings for Seqera Scheduler execution.
        schedEnabled:
          type: boolean
          description: When true, enables Seqera Scheduler execution for this compute environment. Defaults to `false`.
        waveEnabled:
          type: boolean
          description: When true, enables [Wave containers](https://docs.seqera.io/wave). Defaults to `false`.
        workDir:
          description: Compute environment working directory.
          type: string
  - target: $["components"]["schemas"]["LocalComputeConfig"]["allOf"]
    remove: true
  - target: $["components"]["schemas"]
    update:
      ResourceAllocation:
        properties:
          acceleratorCount:
            format: int32
            type: integer
            description: Number of accelerator devices allocated to the task.
          acceleratorName:
            type: string
            description: Accelerator model name allocated to the task.
          acceleratorType:
            type: string
            description: Accelerator type allocated to the task.
          cpuShares:
            format: int32
            type: integer
            description: Number of CPU shares allocated to the task by the scheduler.
          memoryMiB:
            format: int32
            type: integer
            description: Memory allocated to the task by the scheduler, in MiB.
          time:
            type: string
            description: Wall clock time allocated to the task by the scheduler.
        type: object
  - target: $["components"]["schemas"]["RunLog"]["properties"]["outputs"]
    update:
      type: object
  - target: $["components"]["schemas"]
    update:
      SchedConfig:
        properties:
          provisioningModel:
            enum:
              - spot
              - spotFirst
              - ondemand
            type: string
            description: Seqera Scheduler provisioning model. Accepted values are `spot`, `spotFirst`, and `ondemand`. Defaults to `spotFirst`.
        type: object
  - target: $["components"]["schemas"]["SecurityKeys"]["discriminator"]["mapping"]
    update:
      github_app: '#/components/schemas/GitHubAppSecurityKeys'
  - target: $["components"]["schemas"]["SecurityKeys"]["oneOf"][*]
    remove: true
  - target: $["components"]["schemas"]["SecurityKeys"]["oneOf"]
    update:
      - $ref: '#/components/schemas/AwsSecurityKeys'
      - $ref: '#/components/schemas/GoogleSecurityKeys'
      - $ref: '#/components/schemas/GitHubSecurityKeys'
      - $ref: '#/components/schemas/GitHubAppSecurityKeys'
      - $ref: '#/components/schemas/GitLabSecurityKeys'
      - $ref: '#/components/schemas/BitBucketSecurityKeys'
      - $ref: '#/components/schemas/GiteaSecurityKeys'
      - $ref: '#/components/schemas/SSHSecurityKeys'
      - $ref: '#/components/schemas/K8sSecurityKeys'
      - $ref: '#/components/schemas/AzureSecurityKeys'
      - $ref: '#/components/schemas/AzureCloudKeys'
      - $ref: '#/components/schemas/AzureReposSecurityKeys'
      - $ref: '#/components/schemas/ContainerRegistryKeys'
      - $ref: '#/components/schemas/AgentSecurityKeys'
      - $ref: '#/components/schemas/CodeCommitSecurityKeys'
      - $ref: '#/components/schemas/AzureEntraKeys'
      - $ref: '#/components/schemas/SeqeraComputeSecurityKeys'
      - $ref: '#/components/schemas/S3SecurityKeys'
      - $ref: '#/components/schemas/LocalSecurityKeys'
  - target: $["components"]["schemas"]["ServiceInfo"]["properties"]
    update:
      launchParamsTextMaxSize:
        format: int32
        type: integer
        description: Maximum allowed size, in characters, for launch `paramsText` payloads.
  - target: $["components"]["schemas"]
    update:
      SourceType:
        enum:
          - UPLOADED
          - LINKED
        type: string
        description: Dataset source type. Accepts `UPLOADED` for uploaded dataset files or `LINKED` for externally linked
          dataset URLs.
  - target: $["components"]["schemas"]["Task"]["properties"]
    update:
      errorMessage:
        nullable: true
        type: string
        description: Human-readable message for platform-specific task exit codes. Can be `null`.
  - target: $["components"]["schemas"]["Task"]["properties"]
    update:
      logStreamId:
        type: string
        description: Provider log stream identifier associated with the task. Can be `null`.
  - target: $["components"]["schemas"]["Task"]["properties"]
    update:
      resourceAllocation:
        $ref: '#/components/schemas/ResourceAllocation'
        description: Resources allocated to the task by the scheduler.
  - target: $["components"]["schemas"]
    update:
      TraceCreateMetadata:
        properties:
          commitId:
            nullable: true
            type: string
            description: Git commit ID.
          computeEnvId:
            nullable: true
            type: string
            description: Compute environment ID.
          computeEnvName:
            nullable: true
            type: string
            description: Compute environment name.
          computeEnvPlatform:
            nullable: true
            type: string
            description: Compute environment platform used for the workflow run. Can be `null` for CLI-submitted runs.
          labels:
            items:
              type: string
            nullable: true
            type: array
            description: Array of resource labels attached to the workflow. Can be `null`.
          orgName:
            nullable: true
            type: string
            description: Organization name associated with the workspace. Can be `null`.
          pipelineId:
            format: int64
            nullable: true
            type: integer
            description: Pipeline numeric identifier associated with the workflow run. Can be `null` for CLI-submitted runs.
          pipelineName:
            nullable: true
            type: string
            description: Pipeline name associated with the workflow run. Can be `null` for CLI-submitted runs.
          revision:
            nullable: true
            type: string
            description: Source control revision, branch, or tag used for the workflow run. Can be `null`.
          userId:
            format: int64
            type: integer
            description: User numeric identifier for the workflow run owner.
          userName:
            type: string
            description: Username for the workflow run owner.
          userOrganization:
            nullable: true
            type: string
            description: Organization name associated with the workflow run owner. Can be `null`.
          workspaceFullName:
            nullable: true
            type: string
            description: Full workspace name including organization prefix. Can be `null` for personal context runs.
          workspaceId:
            format: int64
            nullable: true
            type: integer
            description: Workspace numeric identifier for the workflow run. Can be `null` for personal context runs.
          workspaceName:
            nullable: true
            type: string
            description: Workspace name for the workflow run. Can be `null` for personal context runs.
        type: object
  - target: $["components"]["schemas"]["TraceCreateResponse"]["properties"]
    update:
      metadata:
        allOf:
          - $ref: '#/components/schemas/TraceCreateMetadata'
        nullable: true
        description: Platform metadata returned so Nextflow can populate workflow metadata without additional API calls. Can
          be `null`.
  - target: $["components"]["schemas"]["UpdateActionRequest"]["properties"]
    update:
      bucket:
        $ref: '#/components/schemas/BucketActionRequest'
        description: Bucket action configuration updates for cloud storage event triggers.
  - target: $["components"]["schemas"]
    update:
      ValidateUrlRequest:
        properties:
          url:
            type: string
            description: HTTP or HTTPS URL to validate. Maximum length is 2048 characters.
        type: object
  - target: $["components"]["schemas"]
    update:
      ValidateUrlResponse:
        properties:
          contentLength:
            format: int64
            type: integer
            description: Content-Length header value reported by the server. Can be `null` if not provided.
          errorCode:
            type: string
            description: Machine-readable validation error code. Can be `null` on success.
          errorMessage:
            type: string
            description: User-facing validation error message. Can be `null` on success.
          hasEtag:
            type: boolean
            description: When true, the server provides an ETag header for change detection.
          mediaType:
            type: string
            description: Detected media type. Can be `null` on validation failure.
          valid:
            type: boolean
            description: When true, the URL is reachable and serves a supported CSV or TSV file.
        type: object
  - target: $["components"]["schemas"]["Workflow"]["properties"]["params"]["additionalProperties"]
    update:
      type: object
  - target: $["components"]["schemas"]["WorkflowDbDto"]["properties"]["params"]["additionalProperties"]
    update:
      type: object
  - target: $["components"]["schemas"]["WorkflowMaxDbDto"]["allOf"][1]
    update:
      type: object
  - target: $["info"]["version"]
    update: 1.140.0
  - target: $["tags"]
    update:
      - name: pipeline-schemas
        description: Pipeline schema definitions.
      - name: pipeline-versions
        description: Pipeline versions.
      - name: ssh-keys
        description: SSH keys for Studio access.
  - target: $["paths"]["/avatars"]["post"]["requestBody"]["content"]["multipart/form-data"]["encoding"]["image"]
    update:
      explode: false
  - target: $["paths"]["/data-links"]["get"]["description"]
    update: Retrieves all available data-links in a user context. Append `?workspaceId={your-workspace-id}` to retrieve data-links in a workspace context.
  - target: $["paths"]["/data-links/{dataLinkId}/upload/{dirPath}"]["post"]["description"]
    update: Creates a URL to upload files to the data-link associated with the given data-link identifier, specifying a file path (`dirPath`). For AWS S3 data-links, send a follow-up request to the `/upload/finish` endpoint after your file upload completes or fails to finalize the upload.
  - target: $["paths"]["/data-links/{dataLinkId}/generate-download-url"]["get"]["parameters"][*]
    remove: true
  - target: $["paths"]["/data-links/{dataLinkId}/generate-download-url"]["get"]["parameters"]
    update:
      - name: dataLinkId
        in: path
        description: Data-link string identifier.
        required: true
        schema:
          type: string
      - name: filePath
        in: query
        description: File path to download.
        schema:
          type: string
      - name: credentialsId
        in: query
        description: Credentials string identifier.
        schema:
          type: string
      - name: workspaceId
        in: query
        description: Workspace numeric identifier.
        schema:
          format: int64
          type: integer
      - name: preview
        in: query
        description: When true, generates the URL for preview instead of direct download. Defaults to `false`.
        schema:
          type: boolean
      - name: resolveSymlink
        in: query
        description: When true, treats the file as a Fusion symlink and resolves its target. Defaults to `false`.
        schema:
          type: boolean
  - target: $["paths"]
    update:
      /datasets/preview-url:
        post:
          description: Fetches a partial content preview from an arbitrary HTTP/HTTPS URL, without creating a dataset. Intended
            for the dataset form preview after URL validation.
          operationId: PreviewDatasetUrl
          parameters:
            - explode: false
              in: query
              name: workspaceId
              schema:
                format: int64
                nullable: true
                type: integer
          requestBody:
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/ValidateUrlRequest'
            description: URL preview request
            required: true
          responses:
            '200':
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/DatasetPreviewResponse'
              description: OK
            '400':
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/ErrorResponse'
              description: Bad request
            '403':
              description: Operation not allowed
          security:
            - BearerAuth: []
          summary: Preview content from a URL
          tags:
            - datasets
  - target: $["paths"]
    update:
      /datasets/validate-url:
        post:
          description: Validates that a remote dataset URL is accessible and returns a supported CSV/TSV format, without creating
            a dataset.
          operationId: ValidateDatasetUrl
          parameters:
            - explode: false
              in: query
              name: workspaceId
              schema:
                format: int64
                nullable: true
                type: integer
          requestBody:
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/ValidateUrlRequest'
            description: URL validation request
            required: true
          responses:
            '200':
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/ValidateUrlResponse'
              description: OK
            '400':
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/ErrorResponse'
              description: Bad request
            '403':
              description: Operation not allowed
          security:
            - BearerAuth: []
          summary: Validate URL for dataset linking
          tags:
            - datasets
  - target: $["paths"]
    update:
      /datasets/{datasetId}/link:
        post:
          description: Creates a new linked DatasetVersion for an existing LINKED dataset by supplying a public HTTP/HTTPS
            URL.
          operationId: LinkDatasetVersion
          parameters:
            - name: workspaceId
              in: query
              description: Workspace numeric identifier.
              schema:
                format: int64
                type: integer
            - name: datasetId
              in: path
              description: Dataset string identifier.
              required: true
              schema:
                type: string
          requestBody:
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/LinkVersionRequest'
            description: Link version request
            required: true
          responses:
            '200':
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/UploadDatasetVersionResponse'
              description: OK
            '400':
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/ErrorResponse'
              description: Bad request
            '403':
              description: Operation not allowed
            '404':
              description: Dataset not found
          security:
            - BearerAuth: []
          summary: Link external URL as dataset version
          tags:
            - datasets
  - target: $["paths"]["/datasets/{datasetId}/v/{version}/n/{fileName}"]["get"]["responses"]
    update:
      '307':
        description: Temporary redirect to linked source URL
  - target: $["paths"]
    update:
      /datasets/{datasetId}/v/{version}/preview:
        get:
          description: Fetches a partial preview of the content for a linked dataset version.
          operationId: PreviewDatasetVersion
          parameters:
            - name: workspaceId
              in: query
              description: Workspace numeric identifier.
              schema:
                format: int64
                type: integer
            - name: datasetId
              in: path
              description: Dataset string identifier.
              required: true
              schema:
                type: string
            - name: version
              in: path
              description: Dataset version number.
              required: true
              schema:
                format: int64
                type: integer
          responses:
            '200':
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/DatasetPreviewResponse'
              description: OK
            '400':
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/ErrorResponse'
              description: Bad request
            '403':
              description: Operation not allowed
            '404':
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/ErrorResponse'
              description: Dataset or version not found
          security:
            - BearerAuth: []
          summary: Preview linked dataset content
          tags:
            - datasets
  - target: $["paths"]["/orgs/{orgId}/teams/{teamId}/members"]["get"]["parameters"][4]
    update:
      explode: false
  - target: $["paths"]["/orgs/{orgId}/workspaces/{workspaceId}/participants/add"]["put"]["responses"]["409"]["description"]
    update: Duplicate element or collaborator not permitted for organization with active SSO
  - target: $["paths"]["/pipelines/{pipelineId}"]["put"]["description"]
    update: "Updates the details of the pipeline identified by the given `pipelineId`.\n            **Note**: If `labelIds`\
      \ is `null`, empty, or omitted, existing pipeline labels are removed.\n            Include `labelIds: [<label-id-1>,<label-id-2>]`\
      \ to override existing labels. Labels to be preserved must be included.\n            To append an array of labels to multiple\
      \ pipelines, use `/pipelines/labels/add`."
  - target: $["paths"]["/platforms/{platformId}"]["get"]["parameters"][2]
    update:
      explode: false
  - target: $["paths"]["/platforms/{platformId}"]["get"]["parameters"][3]
    update:
      explode: false
  - target: $["paths"]["/workflow/launch"]["post"]["description"]
    update: Submits a workflow execution. To resume a workflow, first retrieve the launch configuration using `GET /workflow/{workflowId}/launch`. Then set `workDir` to the value from `resumeDir`, `revision` to the value from `resumeCommitId`, and `resume` to `true`, then submit the modified payload to this endpoint.
  - target: $["paths"]["/workspaces/{workspaceId}/datasets"]["get"]["description"]
    update: Deprecated. See [List datasets](https://docs.seqera.io/platform-api/list-datasets-v-2) for the current endpoint. Lists all available datasets in the workspace context identified by the given `workspaceId`.
  - target: $["paths"]["/workspaces/{workspaceId}/datasets"]["post"]["description"]
    update: Deprecated. See [Create dataset](https://docs.seqera.io/platform-api/create-dataset-v-2) for the current endpoint. Creates a new dataset in the given workspace context. Include the dataset file and details in your request body.
  - target: $["paths"]["/workspaces/{workspaceId}/datasets/versions"]["get"]["description"]
    update: Deprecated. See [List latest dataset versions](https://docs.seqera.io/platform-api/list-latest-dataset-versions-v-2) for the current endpoint. Lists the latest version of each dataset associated with the given `workspaceId`.
  - target: $["paths"]["/workspaces/{workspaceId}/datasets/{datasetId}"]["put"]["description"]
    update: Deprecated. See [Update dataset](https://docs.seqera.io/platform-api/update-dataset-v-2) for the current endpoint. Updates the details of the dataset identified by the given `datasetId`.
  - target: $["paths"]["/workspaces/{workspaceId}/datasets/{datasetId}"]["delete"]["description"]
    update: Deprecated. See [Delete dataset](https://docs.seqera.io/platform-api/delete-dataset-v-2) for the current endpoint. Deletes the dataset identified by the given `datasetId`.
  - target: $["paths"]["/workspaces/{workspaceId}/datasets/{datasetId}/metadata"]["get"]["description"]
    update: Deprecated. See [Describe dataset](https://docs.seqera.io/platform-api/describe-dataset-v-2) for the current endpoint. Retrieves the metadata of the dataset identified by the given `datasetId`.
  - target: $["paths"]["/workspaces/{workspaceId}/datasets/{datasetId}/upload"]["post"]["description"]
    update: Deprecated. See [Upload new dataset version](https://docs.seqera.io/platform-api/upload-dataset-v-2) for the current endpoint. Uploads the CSV or TSV content to create a new version of the dataset identified by the given `datasetId`.
  - target: $["paths"]["/workspaces/{workspaceId}/datasets/{datasetId}/versions"]["get"]["description"]
    update: Deprecated. See [List all dataset versions](https://docs.seqera.io/platform-api/list-dataset-versions-v-2) for the current endpoint. Lists all versions of the given `datasetId`.
  - target: $["paths"]["/studios/{sessionId}"]
    update:
      put:
        description: Updates the given Studio session ID. Can only update non-running Studios.
        operationId: UpdateDataStudio
        parameters:
          - name: sessionId
            in: path
            description: Studio session numeric identifier.
            required: true
            schema:
              type: string
          - name: workspaceId
            in: query
            description: Workspace numeric identifier.
            schema:
              format: int64
              type: integer
        requestBody:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DataStudioUpdateRequest'
          description: Fields to update on the studio.
          required: true
        responses:
          '200':
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/DataStudioDto'
            description: OK
          '400':
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/ErrorResponse'
            description: BadRequest
          '403':
            description: Operation not allowed.
          '404':
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/ErrorResponse'
            description: NotFound, when the Studio is not found or when the API is disabled for the workspace.
          '409':
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/ErrorResponse'
            description: Conflict - duplicated name
        security:
          - BearerAuth: []
        summary: Update a Studio
        tags:
          - studios
  - target: $["paths"]["/workspaces/{workspaceId}/datasets/versions"]["get"]["parameters"][1]
    update:
      explode: false
  - target: $["paths"]["/workspaces/{workspaceId}/datasets/{datasetId}/v/{version}/n/{fileName}"]
    remove: true
  - target: $["components"]["schemas"]["TeamType"]
    update:
      description: Team type. Accepts `regular` or `system_owners`.
  - target: $["components"]["schemas"]["WspRoleSourceType"]
    update:
      description: Source of a workspace role assignment. Accepts `individual` or `team`.
  - target: $["components"]["schemas"]["CreateRoleRequest"]["properties"]
    update:
      name:
        description: Custom role name. Must be unique in the organization and meet role name length and format requirements.
      description:
        description: Custom role description. Must be between 1 and 120 characters.
      permissions:
        description: Array of permission names assigned to the custom role.
  - target: $["components"]["schemas"]["CreateRoleResponse"]["properties"]
    update:
      name:
        description: Created role name.
      description:
        description: Created role description.
      permissions:
        description: Array of permission names assigned to the created role.
  - target: $["components"]["schemas"]["UpdateRoleRequest"]["properties"]
    update:
      name:
        description: Updated custom role name. Must be unique in the organization and meet role name length and format requirements.
      description:
        description: Updated custom role description. Must be between 1 and 120 characters.
      permissions:
        description: Array of permission names assigned to the custom role.
  - target: $["components"]["schemas"]["RoleDto"]["properties"]
    update:
      name:
        description: Role name.
      description:
        description: Role description.
      isPredefined:
        description: When true, the role is predefined by the system.
      permissions:
        description: Array of permission names assigned to the role.
  - target: $["components"]["schemas"]["ListRolesResponse"]["properties"]
    update:
      roles:
        description: Array of roles matching the query.
      totalSize:
        description: Total number of roles matching the query.
  - target: $["components"]["schemas"]["ListRolesResponse.RoleInfo"]["properties"]
    update:
      name:
        description: Role name.
      description:
        description: Role description.
      isPredefined:
        description: When true, the role is predefined by the system.
  - target: $["components"]["schemas"]["ListRolePermissionsResponse"]["properties"]
    update:
      permissions:
        description: Array of permission definitions available for assignment to roles.
  - target: $["components"]["schemas"]["RolePermissionResponseDto"]["properties"]
    update:
      name:
        description: Permission name.
      category:
        description: Permission category.
  - target: $["components"]["schemas"]["DescribeRoleResponse"]["properties"]
    update:
      role:
        description: Role details and assigned permissions.
  - target: $["components"]["schemas"]["ListUserRolesResponse"]["properties"]
    update:
      user:
        description: Organization member details for the selected user.
      userWorkspaces:
        description: Array of workspace-specific roles and permissions for the selected user.
  - target: $["components"]["schemas"]["UserWorkspacePermissionDto"]["properties"]
    update:
      permission:
        description: Permission name granted to the user in the workspace.
      roles:
        description: Array of role names that grant the permission.
  - target: $["components"]["schemas"]["UserWorkspaceRoleDto"]["properties"]
    update:
      role:
        description: Workspace role name assigned to the user.
      roleSourceType:
        description: Source of the workspace role assignment.
      sourceTeamId:
        description: Source team numeric identifier when the role is inherited from a team. Can be `null`.
      sourceTeamName:
        description: Source team name when the role is inherited from a team. Can be `null`.
      sourceTeamType:
        description: Source team type when the role is inherited from a team. Can be `null`.
  - target: $["components"]["schemas"]["UserWorkspaceRolesDto"]["properties"]
    update:
      permissions:
        description: Array of effective permissions granted to the user in this workspace.
      roles:
        description: Array of roles held by the user in this workspace.
      workspaceId:
        description: Workspace numeric identifier.
      workspaceName:
        description: Workspace name.
  - target: $["components"]["schemas"]["CreateSshKeyRequest"]["properties"]["name"]["required"]
    remove: true
  - target: $["components"]["schemas"]["CreateSshKeyRequest"]["properties"]["publicKey"]["required"]
    remove: true
  - target: $["components"]["schemas"]["StudioSshDetailsDto"]["properties"]["host"]["required"]
    remove: true
  - target: $["components"]["schemas"]["StudioSshDetailsDto"]["properties"]["port"]["required"]
    remove: true
  - target: $["components"]["schemas"]["StudioSshDetailsDto"]["properties"]["user"]["required"]
    remove: true
  - target: $["components"]["schemas"]["StudioSshDetailsDto"]["properties"]["command"]["required"]
    remove: true
```

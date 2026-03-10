**credentials-operations-overlay-1.115.0.yaml**
```yaml
overlay: 1.0.0
info:
  title: Credentials operations overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS - OPERATIONS =====

  - target: $.paths./credentials.post.description
    update: Creates new credentials in a user context. Append `?workspaceId` to create the credentials in a workspace context. For AWS credentials with IAM role ARN, append `?useExternalId=true` to generate a Platform-managed External ID.

  - target: $.paths./credentials/{credentialsId}.put.description
    update: Updates the details of the credentials identified by the given `credentialsId`. For AWS credentials with IAM role ARN, append `?useExternalId=true` to generate a Platform-managed External ID.

  - target: $.paths./ga4gh/wes/v1/service-info.get.summary
    update: Get GA4GH WES service info

  - target: $.paths./ga4gh/wes/v1/service-info.get.description
    update: Returns GA4GH Workflow Execution Service metadata for this Platform deployment, including supported workflow types, WES versions, filesystem protocols, and workflow engine defaults.
```

**credentials-parameters-overlay-1.115.0.yaml**
```yaml
overlay: 1.0.0
info:
  title: Credentials parameters overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS PARAMETERS - PATH, QUERY, AND REQUEST BODY =====

  - target: $.paths./credentials.post.parameters[*]
    remove: true

  - target: $.paths./credentials.post.parameters
    update:
      - name: workspaceId
        in: query
        description: Workspace numeric identifier.
        schema:
          type: integer
          format: int64
      - name: useExternalId
        in: query
        description: If `true`, generates a Platform-managed External ID for AWS credentials configured with an IAM role ARN.
        schema:
          type: boolean

  - target: $.paths./credentials/{credentialsId}.put.parameters[*]
    remove: true

  - target: $.paths./credentials/{credentialsId}.put.parameters
    update:
      - name: credentialsId
        in: path
        description: Credentials string identifier.
        required: true
        schema:
          type: string
      - name: workspaceId
        in: query
        description: Workspace numeric identifier.
        schema:
          type: integer
          format: int64
      - name: useExternalId
        in: query
        description: If `true`, generates a Platform-managed External ID for AWS credentials configured with an IAM role ARN.
        schema:
          type: boolean

  - target: $.paths./orgs/{orgId}/workspaces/{workspaceId}/settings/studios.put.requestBody.description
    update: Workspace Studios settings update request.
```

**credentials-schemas-overlay-1.115.0.yaml**
```yaml
overlay: 1.0.0
info:
  title: Credentials schemas overlay
  version: 0.0.0
actions:
  # ===== CREDENTIALS SCHEMAS =====

  - target: $.components.schemas
    update:
      AwsCredentialsMode:
        type: string
        description: AWS credentials authentication mode. Accepts `keys` or `role`.
        enum:
          - keys
          - role
        x-enum-varnames:
          - keys
          - role
        x-type: String

  - target: $.components.schemas.AwsSecurityKeys.properties
    update:
      mode:
        allOf:
          - $ref: '#/components/schemas/AwsCredentialsMode'
        description: AWS credentials authentication mode. Accepts `keys` for IAM access key authentication or `role` for IAM role authentication.
      externalId:
        type: string
        description: Platform-managed External ID used when assuming an IAM role. Present when generated or stored for role-based AWS credentials.

  - target: $.components.schemas.SeqeraComputeSecurityKeys.properties
    update:
      mode:
        allOf:
          - $ref: '#/components/schemas/AwsCredentialsMode'
        description: AWS credentials authentication mode for Seqera Compute. Accepts `keys` for IAM access key authentication or `role` for IAM role authentication.
      externalId:
        type: string
        description: Platform-managed External ID used when assuming an IAM role for Seqera Compute credentials. Present when generated or stored for role-based credentials.
```

**studios-schemas-overlay-1.115.0.yaml**
```yaml
overlay: 1.0.0
info:
  title: Studios schemas overlay
  version: 0.0.0
actions:
  # ===== STUDIOS AND WORKSPACES SCHEMAS =====

  - target: $.paths./orgs/{orgId}/workspaces/{workspaceId}/settings/studios.put.requestBody.content.application/json.schema.$ref
    update: '#/components/schemas/DataStudioWorkspaceSettingsRequest'

  - target: $.components.schemas
    update:
      DataStudioWorkspaceSettingsRequest:
        type: object
        description: Workspace-level default settings for newly created Studios.
        properties:
          lifespanHours:
            minimum: 0
            type: integer
            format: int32
            description: Default lifespan for new Studio sessions in hours. Set to `0` for unlimited lifespan.
          containerRepository:
            type: string
            nullable: true
            description: Custom container repository used for new Studios in the workspace. Can be `null`.
          privateStudioByDefault:
            type: boolean
            description: If `true`, new Studios in the workspace default to private visibility.
      MountData:
        type: object
        description: Studio data-link mount with an optional path prefix.
        properties:
          dataLinkId:
            type: string
            description: Data-link string identifier to mount in the Studio session.
          path:
            type: string
            nullable: true
            description: Optional relative path within the data-link root to mount. Can be `null` to mount the data-link root.

  - target: $.components.schemas.DataStudioWorkspaceSettingsResponse.properties
    update:
      orgId:
        type: integer
        format: int64
        description: Organization numeric identifier.
      wspId:
        type: integer
        format: int64
        description: Workspace numeric identifier.
      lifespanHours:
        type: integer
        format: int32
        description: Default lifespan for new Studio sessions in hours. Set to `0` for unlimited lifespan.
      containerRepository:
        type: string
        nullable: true
        description: Custom container repository used for new Studios in the workspace. Can be `null`.
      privateStudioByDefault:
        type: boolean
        description: If `true`, new Studios in the workspace default to private visibility.

  - target: $.components.schemas.DataStudioConfiguration.properties.mountData
    update:
      type: array
      nullable: true
      deprecated: true
      items:
        type: string
      description: Deprecated array of data-link IDs mounted in the Studio session. This field only supports data-link IDs without path prefixes. Can be `null` to preserve existing mounts.

  - target: $.components.schemas.DataStudioConfiguration.properties.mountDataV2
    update:
      type: array
      nullable: true
      items:
        $ref: '#/components/schemas/MountData'
      description: Array of data-link mounts with optional path prefixes. Can be `null` to preserve existing mounts, or an empty array to remove all mounts.
```

**ga4gh-schemas-overlay-1.115.0.yaml**
```yaml
overlay: 1.0.0
info:
  title: GA4GH schemas overlay
  version: 0.0.0
actions:
  # ===== GA4GH AND WORKFLOW ENGINE SCHEMAS =====

  - target: $.paths./ga4gh/wes/v1/service-info.get.responses.200.content.application/json.schema.$ref
    update: '#/components/schemas/WesServiceInfo'

  - target: $.components.schemas
    update:
      DefaultWorkflowEngineParameter:
        type: object
        description: Default workflow engine parameter exposed by the GA4GH WES service.
        properties:
          name:
            type: string
            description: Parameter name.
          type:
            type: string
            description: Parameter type, for example `float`.
          default_value:
            type: string
            description: Stringified default parameter value.
      WorkflowTypeVersion:
        type: object
        description: Supported version information for a specific workflow type.
        properties:
          workflow_type_version:
            type: array
            items:
              type: string
            description: Array of supported version strings for the workflow type.
      WesServiceInfo:
        type: object
        description: GA4GH Workflow Execution Service capability metadata for this Platform deployment.
        properties:
          workflow_type_versions:
            type: object
            additionalProperties:
              $ref: '#/components/schemas/WorkflowTypeVersion'
            description: Map of supported workflow type names to their supported version lists.
          supported_wes_versions:
            type: array
            items:
              type: string
            description: Array of supported GA4GH WES specification versions.
          supported_filesystem_protocols:
            type: array
            items:
              type: string
            description: Array of supported filesystem protocols such as `http`, `https`, `sftp`, `s3`, `gs`, `file`, or `synapse`.
          workflow_engine_versions:
            type: object
            additionalProperties:
              type: string
            description: Map of workflow engine names to engine version strings.
          default_workflow_engine_parameters:
            type: array
            items:
              $ref: '#/components/schemas/DefaultWorkflowEngineParameter'
            description: Array of default workflow engine parameters exposed by the WES service.
          system_state_counts:
            type: object
            additionalProperties:
              type: integer
              format: int64
            description: Map of workflow run states to the number of runs currently in each state.
          auth_instructions_url:
            type: string
            description: URL containing human-readable instructions for obtaining an authorization token for this WES endpoint.
          contact_info_url:
            type: string
            description: URL or `mailto:` contact for reporting problems or security issues with this WES endpoint.
          tags:
            type: object
            additionalProperties:
              type: string
            description: Key-value map of extended metadata returned by the WES service.
```

**compute-schemas-overlay-1.115.0.yaml**
```yaml
overlay: 1.0.0
info:
  title: Compute schemas overlay
  version: 0.0.0
actions:
  # ===== COMPUTE AND PLATFORM SCHEMAS =====

  - target: $.components.schemas.ComputeConfig.discriminator.mapping
    update:
      moab-platform: '#/components/schemas/MoabComputeConfig'
      aws-batch: '#/components/schemas/AwsBatchConfig'
      google-cloud: '#/components/schemas/GoogleCloudConfig'
      local-platform: '#/components/schemas/LocalComputeConfig'
      azure-cloud: '#/components/schemas/AzCloudConfig'
      gke-platform: '#/components/schemas/GkeComputeConfig'
      google-batch: '#/components/schemas/GoogleBatchConfig'
      aws-cloud: '#/components/schemas/AwsCloudConfig'
      slurm-platform: '#/components/schemas/SlurmComputeConfig'
      k8s-platform: '#/components/schemas/K8sComputeConfig'
      altair-platform: '#/components/schemas/AltairPbsComputeConfig'
      lsf-platform: '#/components/schemas/LsfComputeConfig'
      azure-batch: '#/components/schemas/AzBatchConfig'
      seqeracompute-platform: '#/components/schemas/SeqeraComputeConfig'
      eks-platform: '#/components/schemas/EksComputeConfig'
      uge-platform: '#/components/schemas/UnivaComputeConfig'

  - target: $.components.schemas.ComputeConfig.oneOf[*]
    remove: true

  - target: $.components.schemas.ComputeConfig.oneOf
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

  - target: $.components.schemas.ComputeEnvResponseDto.properties.platform.enum[*]
    remove: true

  - target: $.components.schemas.ComputeEnvResponseDto.properties.platform.enum
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

  - target: $.components.schemas.ComputeEnv_ComputeConfig_.properties.platform.enum[*]
    remove: true

  - target: $.components.schemas.ComputeEnv_ComputeConfig_.properties.platform.enum
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

  - target: $.components.schemas.ComputeEnv_ComputeConfig_.properties.status.type
    remove: true

  - target: $.components.schemas.DataLinkDto.properties.status.type
    remove: true

  - target: $.components.schemas
    update:
      LocalComputeConfig:
        title: Local execution configuration
        type: object
        description: Local execution configuration retained for non-public local deployments and test environments.
        allOf:
          - $ref: '#/components/schemas/ComputeConfig'
          - properties:
              waveEnabled:
                type: boolean
                description: If `true`, Wave integration is enabled for local execution.
              fusion2Enabled:
                type: boolean
                description: If `true`, Fusion v2 integration is enabled for local execution.

  - target: $.components.schemas.GoogleLifeSciencesConfig
    remove: true
```

**workflows-schemas-overlay-1.115.0.yaml**
```yaml
overlay: 1.0.0
info:
  title: Workflows schemas overlay
  version: 0.0.0
actions:
  # ===== WORKFLOW RESPONSE SCHEMAS =====

  - target: $.components.schemas.TraceCreateResponse.properties.watchUrl
    update:
      type: string
      description: Workflow watch URL for monitoring the workflow run in Seqera Platform.
```

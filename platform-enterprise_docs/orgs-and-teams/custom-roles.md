---
title: "Custom roles"
description: "Introduction to custom roles in Seqera Platform."
date created: "2025-11-17"
last updated: "2025-11-17"
tags: [roles, user-roles, custom roles, rbac, permissions]
---

Seqera Platform supports custom roles to define permissions-based access control at a more granular level than the six default [workspace participant roles](./roles.md#workspace-participant-roles). 

### Create custom roles

Organization owners can add custom roles and assign read, write, execute, admin, and delete permissions for every Seqera resource type:

1. Select your organization name from the organization and workspace switcher in the top navigation.
1. Select **Access control** to view the list of default and custom roles available in your organization.
1. Select **Add role**.
1. Enter a role **Name** and optional **Description**. 
1. From the **Permissions** list, select the **Read**, **Write**, **Execute**, **Admin**, and **Delete** permissions your custom role requires for each resource type. 
1. Select **Add** to create the custom role and return to the **Access control** roles list. 

Select **Edit** or **Delete** to manage existing custom roles in the list. 

### Permissions

Individual permissions grant read, write, execute, admin, or delete access for each Seqera entity. Individual read and write permissions may grant access for multiple operations via the Platform UI, API, and other programmatic tools such as Platform CLI. For example, the `action:read` permission allows a user to view the list of actions in a workspace, view the details of a specific action, and view available action types. 

#### Compute

| Permission | Description | API endpoint |
|------------|-------------|--------------|
| **compute_environment:read** | List all compute environments | `GET /compute-envs` |
| | View compute environment details | `GET /compute-envs/{computeEnvId}` |
| **compute_environment:write** | Create a new compute environment | `POST /compute-envs` |
| | Edit an existing compute environment | `PUT /compute-envs/{computeEnvId}` |
| | Set a compute environment as primary | `POST /compute-envs/{computeEnvId}/primary` |
| | Validate compute environment name availability | `GET /compute-envs/validate` |
| **compute_environment:delete** | Delete a compute environment | `DELETE /compute-envs/{computeEnvId}` |
| **credentials:read** | List all credentials in workspace | `GET /credentials` |
| | View credential details | `GET /credentials/{credentialsId}` |
| **credentials:write** | Add new credentials | `POST /credentials` |
| | Edit existing credentials | `PUT /credentials/{credentialsId}` |
| | Validate credentials | _(Used by Platform)_ |
| | Validate credential name availability | `GET /credentials/validate` |
| **credentials:delete** | Delete credentials | `DELETE /credentials/{credentialsId}` |
| **credentials_encrypted:read** | Get encrypted credentials | _(Used by Platform)_ |
| **pipeline_secrets:read** | List all pipeline secrets | `GET /pipeline-secrets` |
| | View pipeline secret details | `GET /pipeline-secrets/{secretId}` |
| **pipeline_secrets:write** | Create a new pipeline secret | `POST /pipeline-secrets` |
| | Validate secret name availability | `GET /pipeline-secrets/validate` |
| | Edit an existing pipeline secret | `PUT /pipeline-secrets/{secretId}` |
| **pipeline_secrets:delete** | Delete a pipeline secret | `DELETE /pipeline-secrets/{secretId}` |
| **platform:read** | List available platforms | `GET /platforms` |
| | List platform regions | `GET /platforms/{platformId}/regions` |
| | View platform details | `GET /platforms/{platformId}` |
| **essential:read** | List available features | _(Used by Platform)_ |

#### Data

| Permission | Description | API endpoint |
|------------|-------------|--------------|
| **data_link:read** | List all data-links (cloud buckets) | `GET /data-links` |
| | Browse data-link contents | `GET /data-links/{dataLinkId}/browse` |
| | View data-link details | `GET /data-links/{dataLinkId}` |
| **data_link:write** | Refresh data-link cache | `GET /data-links/cache/refresh` |
| | Browse data-link directory tree | `GET /data-links/{dataLinkId}/browse-tree` |
| | Download files from data-link | `GET /data-links/{dataLinkId}/download` |
| | Generate download URL for data-link files | `GET /data-links/{dataLinkId}/generate-download-url` |
| | Generate download script | `GET /data-links/{dataLinkId}/script/download` |
| | Upload files to data-link | `POST /data-links/{dataLinkId}/upload` |
| | Complete file upload to data-link | `POST /data-links/{dataLinkId}/upload/finish` |
| | Create a custom data-link | `POST /data-links` |
| | Edit data-link metadata | `PUT /data-links/{dataLinkId}` |
| **data_link:delete** | Delete files from data-link | `DELETE /data-links/{dataLinkId}/content` |
| | Remove a data-link from workspace | `DELETE /data-links/{dataLinkId}` |
| **data_link:admin** | Hide data-links | _(Used by Platform)_ |
| | Show data-links | _(Used by Platform)_ |
| **dataset:read** | List datasets (legacy endpoint) | `GET /workspaces/{workspaceId}/datasets` |
| | List workspace dataset versions (legacy endpoint) | `GET /workspaces/{workspaceId}/datasets/versions` |
| | List dataset versions (legacy endpoint) | `GET /workspaces/{workspaceId}/datasets/{datasetId}/versions` |
| | View dataset metadata (legacy endpoint) | `GET /workspaces/{workspaceId}/datasets/{datasetId}/metadata` |
| | Download dataset files (legacy endpoint) | `GET /workspaces/{workspaceId}/datasets/{datasetId}/v/{version}/n/{fileName}` |
| | List all datasets | `GET /datasets` |
| | List latest dataset versions | `GET /datasets/versions` |
| | List versions for a specific dataset | `GET /datasets/{datasetId}/versions` |
| | List datasets used in a pipeline launch | `GET /launch/{launchId}/datasets` |
| | View dataset metadata | `GET /datasets/{datasetId}/metadata` |
| | Download dataset files | `GET /datasets/{datasetId}/v/{version}/n/{fileName}` |
| **dataset:write** | Create dataset (legacy endpoint) | `POST /workspaces/{workspaceId}/datasets` |
| | Edit dataset (legacy endpoint) | `PUT /workspaces/{workspaceId}/datasets/{datasetId}` |
| | Upload dataset (legacy endpoint) | `POST /workspaces/{workspaceId}/datasets/{datasetId}/upload` |
| | Create a new dataset | `POST /datasets` |
| | Edit dataset metadata | `PUT /datasets/{datasetId}` |
| | Upload files to dataset | `POST /datasets/{datasetId}/upload` |
| **dataset:delete** | Delete dataset (legacy endpoint) | `DELETE /workspaces/{workspaceId}/datasets/{datasetId}` |
| | Delete a single dataset | `DELETE /datasets/{datasetId}` |
| | Delete multiple datasets | `DELETE /datasets` |
| **dataset:admin** | Hide datasets | `POST /datasets/hide` |
| | Show datasets | `POST /datasets/show` |
| | Disable dataset version | `POST /datasets/{datasetId}/versions/{version}/disable` |
| **dataset_label:write** | Add labels to datasets | `POST /datasets/labels/add` |
| | Remove labels from datasets | `POST /datasets/labels/remove` |
| | Apply label sets to datasets | `POST /datasets/labels/apply` |

#### Pipelines

| Permission | Description | API endpoint |
|------------|-------------|--------------|
| **action:read** | View action details | `GET /actions/{actionId}` |
| | View available action types | `GET /actions/types` |
| | List all actions in workspace | `GET /actions` |
| **action:execute** | Trigger an action to run | `POST /actions/{actionId}/launch` |
| **action:write** | Create a new action | `POST /actions` |
| | Edit an existing action | `PUT /actions/{actionId}` |
| | Test action configuration | _(Used by Platform)_ |
| | Pause a running action | `POST /actions/{actionId}/pause` |
| | Validate action name availability | `GET /actions/validate` |
| **action:delete** | Delete an action | `DELETE /actions/{actionId}` |
| **action_label:write** | Apply resource labels when creating actions | Sub-operation on `POST /actions` |
| | Apply resource labels when updating actions | Sub-operation on `PUT /actions/{actionId}` |
| | Add labels to actions | `POST /actions/labels/add` |
| | Remove labels from actions | `POST /actions/labels/remove` |
| | Apply label sets to actions | `POST /actions/labels/apply` |
| **container:read** | View container details | _(Used by Platform)_ |
| | List containers | _(Used by Platform)_ |
| | List workflow containers | _(Used by Platform)_ |
| **launch:read** | View launch details | `GET /launch/{launchId}` |
| **pipeline:read** | View pipeline repository information | `GET /pipelines/info` |
| | View pipeline schema and parameters | `GET /pipelines/{pipelineId}/schema` |
| | View pipeline schema from repository URL | _(Used by Platform)_ |
| | View pipeline launch configuration | `GET /pipelines/{pipelineId}/launch` |
| | List available pipeline repositories | `GET /pipelines/repositories` |
| | List all pipelines in workspace | `GET /pipelines` |
| | View pipeline details | `GET /pipelines/{pipelineId}` |
| | Fetch pipeline optimization | _(Used by Platform)_ |
| | List pipeline versions | _(Used by Platform)_ |
| **pipeline:write** | Overwrite fields when creating workflow launch | Sub-operation on `POST /workflow/launch` |
| | Add a new pipeline to workspace | `POST /pipelines` |
| | Edit pipeline configuration | `PUT /pipelines/{pipelineId}` |
| | Configure pipeline | _(Used by Platform)_ |
| | Validate pipeline name availability | `GET /pipelines/validate` |
| | Validate pipeline version name | _(Used by Platform)_ |
| | Manage pipeline version | _(Used by Platform)_ |
| **pipeline:delete** | Delete a pipeline | `DELETE /pipelines/{pipelineId}` |
| **pipeline_label:write** | Apply resource labels when launching workflows | Sub-operation on `POST /workflow/launch` |
| | Add labels to pipelines | `POST /pipelines/labels/add` |
| | Apply resource labels when creating pipelines | Sub-operation on `POST /pipelines` |
| | Apply resource labels when updating pipelines | Sub-operation on `PUT /pipelines/{pipelineId}` |
| | Remove labels from pipelines | `POST /pipelines/labels/remove` |
| | Apply label sets to pipelines | `POST /pipelines/labels/apply` |
| **workflow:read** | View run details | `GET /workflow/{workflowId}` |
| | View run progress | `GET /workflow/{workflowId}/progress` |
| | List tasks in a run | `GET /workflow/{workflowId}/tasks` |
| | View individual task details | `GET /workflow/{workflowId}/task/{taskId}` |
| | View run metrics | `GET /workflow/{workflowId}/metrics` |
| | List all runs in workspace | `GET /workflow` |
| | View run launch configuration | `GET /workflow/{workflowId}/launch` |
| | View run execution logs | `GET /workflow/{workflowId}/log` |
| | View task-specific logs | `GET /workflow/{workflowId}/log/{taskId}` |
| | Download run logs | `GET /workflow/{workflowId}/download` |
| | Download workflow workspace content | _(Used by Platform)_ |
| | Download task logs | `GET /workflow/{workflowId}/download/{taskId}` |
| | View workflow reports | _(Used by Platform)_ |
| | Download workflow report | _(Used by Platform)_ |
| | Fetch workflow optimization | _(Used by Platform)_ |
| | Check optimized workflow list | _(Used by Platform)_ |
| **workflow:execute** | Launch a pipeline run | `POST /workflow/launch` |
| | Cancel a running pipeline | `POST /workflow/{workflowId}/cancel` |
| | Launch pipeline | _(Used by Platform)_ |
| **workflow:write** | Create execution trace | `POST /trace/create` |
| | Update trace heartbeat | `PUT /trace/{workflowId}/heartbeat` |
| | Mark trace begin | `PUT /trace/{workflowId}/begin` |
| | Mark trace complete | `PUT /trace/{workflowId}/complete` |
| | Update trace progress | `PUT /trace/{workflowId}/progress` |
| **workflow:delete** | Delete a single run | `DELETE /workflow/{workflowId}` |
| | Delete multiple runs | `POST /workflow/delete` |
| **workflow_label:write** | Add labels to runs | `POST /workflow/labels/add` |
| | Remove labels from runs | `POST /workflow/labels/remove` |
| | Apply label sets to runs | `POST /workflow/labels/apply` |
| **workflow_quick:execute** | Create quick launch when creating workflow launch | Sub-operation on `POST /workflow/launch` |
| | Launch quick pipeline | _(Used by Platform)_ |
| | Create GA4GH workflow run | `POST /ga4gh/wes/v1/runs` |
| **workflow_star:read** | Check if run is starred (favourited) | `GET /workflow/{workflowId}/star` |
| **workflow_star:write** | Star (favourite) a run | `POST /workflow/{workflowId}/star` |
| **workflow_star:delete** | Unstar (unfavourite) a run | `DELETE /workflow/{workflowId}/star` |

#### Settings

| Permission | Description | API endpoint |
|------------|-------------|--------------|
| **label:read** | List all workspace labels | `GET /labels` |
| **label:write** | Create a new label | `POST /labels` |
| | Edit an existing label | `PUT /labels/{labelId}` |
| **label:delete** | Delete a label | `DELETE /labels/{labelId}` |
| **workspace:read** | View workspace details | `GET /orgs/{orgId}/workspaces/{workspaceId}` |
| | List workspace participants | `GET /orgs/{orgId}/workspaces/{workspaceId}/participants` |
| **workspace:write** | Edit workspace settings | `PUT /orgs/{orgId}/workspaces/{workspaceId}` |
| | Add a workspace participant | `PUT /orgs/{orgId}/workspaces/{workspaceId}/participants/add` |
| | Find workspace participant candidates | _(Used by Platform)_ |
| | Change participant role | `PUT /orgs/{orgId}/workspaces/{workspaceId}/participants/{participantId}/role` |
| | Remove a workspace participant | `DELETE /orgs/{orgId}/workspaces/{workspaceId}/participants/{participantId}` |
| **workspace:delete** | Delete the workspace | `DELETE /orgs/{orgId}/workspaces/{workspaceId}` |
| **workspace:admin** | Modify workspace ownership when updating participant role | Sub-operation on `PUT /orgs/{orgId}/workspaces/{workspaceId}/participants/{participantId}/role` |
| | Delete workspace owner when deleting participant | Sub-operation on `DELETE /orgs/{orgId}/workspaces/{workspaceId}/participants/{participantId}` |
| **workspace_self:delete** | Leave workspace (remove self as participant) | `DELETE /orgs/{orgId}/workspaces/{workspaceId}/participants` |
| **workspace_studio:read** | View studio settings for workspace | `GET /orgs/{orgId}/workspaces/{workspaceId}/settings/studios` |
| **workspace_studio:write** | Edit studio session lifespan settings | `PUT /orgs/{orgId}/workspaces/{workspaceId}/settings/studios` |

#### Studios

| Permission | Description | API endpoint |
|------------|-------------|--------------|
| **studio:read** | View studio session details | `GET /studios/{sessionId}` |
| | View studio repository details | _(Used by Platform)_ |
| | List all studios in workspace | `GET /studios` |
| | List available studio templates | `GET /studios/templates` |
| | List checkpoints for a studio | `GET /studios/{sessionId}/checkpoints` |
| | View checkpoint details | `GET /studios/{sessionId}/checkpoints/{checkpointId}` |
| **studio:execute** | List mounted data-links for studios | `GET /studios/data-links` |
| | Start a studio session | `PUT /studios/{sessionId}/start` |
| | Stop a studio session | `PUT /studios/{sessionId}/stop` |
| **studio:write** | Create a new studio | `POST /studios` |
| | Edit checkpoint name | `PUT /studios/{sessionId}/checkpoints/{checkpointId}` |
| | Validate studio name availability | `GET /studios/validate` |
| **studio:delete** | Delete a studio | `DELETE /studios/{sessionId}` |
| **studio:admin** | Admin operations on other users' Studios | |
| | Delete studio | Sub-operation on `DELETE /studios/{sessionId}` |
| | Start studio | Sub-operation on `PUT /studios/{sessionId}/start` |
| | Stop studio | Sub-operation on `PUT /studios/{sessionId}/stop` |
| | Extend studio lifespan (iframe) | _(Used by Platform)_ |
| | Extend studio lifespan | Sub-operation on `POST /studios/{sessionId}/lifespan` |
| | Admin access to studio | _(Used by Platform)_ |
| **studio_label:write** | Apply resource labels when starting studios | Sub-operation on `PUT /studios/{sessionId}/start` |
| | Edit studio resource labels | _(Used by Platform)_ |
| **studio_session:read** | Open studio | _(Used by Platform)_ |
| **studio_session:execute** | Extend studio lifespan (iframe) | _(Used by Platform)_ |
| | Extend studio session lifespan | `POST /studios/{sessionId}/lifespan` |
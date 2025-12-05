---
title: "Resource labels"
description: "Instructions to use resource labels in Seqera Platform."
date: "24 Apr 2023"
tags: [resource labels, labels]
---

Platform supports resource labels in compute environments, pipelines, actions, runs, and Studios. This provides a flexible tagging system for annotating and tracking the cloud resources consumed by a run or Studio. Resource labels are sent to the cloud service provider in `key=value` format.

Resource labels enable:

- Cloud resource attribution across projects and teams
- Granular cloud cost tracking
- Resource organization and management
- Compliance and governance enforcement

## How resource labels work

Resource labels can be applied to compute environments, pipelines, actions, runs, and Studios. Resource labels are propagated to cloud resources during:

- Compute environment creation
- Workflow submission
- Workflow execution
- The start of a Studio's first session

:::info
Seqera applies resource labels to cloud resources in one direction only. Any tags changed or deleted directly in your cloud environment will not be reflected in Seqera.
:::

### Resource labels applied to compute environments

Resource labels can be applied to all cloud compute environments. Cloud resources are tagged when a pipeline run is launched or a Studio is started with those resource labels applied.

:::info
If a compute environment is created with Batch Forge, it propagates resource labels to all cloud resources during the compute environment creation process. See [AWS](#aws) for the list of resources tagged during Batch Forge creation time.
:::

### Resource labels applied to a pipeline run

A run inherits resource labels applied at the compute environment, pipeline, and action level. Resource labels can also be added or overridden during pipeline launch. 

When a run is executed with resource labels attached:

- Seqera propagates the labels to the set of resources [listed for each provider](#resource-label-propagation-to-cloud-environments).
- Nextflow distributes the labels for the resources spawned at runtime.

### Resource labels applied to a Studio

A Studio inherits resource labels applied at the compute environment level. Resource labels can also be added or overridden when you add a Studio. 

When a Studio starts with resource labels attached:

- Seqera propagates the labels to the set of resources [listed for each provider](#resource-label-propagation-to-cloud-environments).

## Prerequisites and limitations

- Resource labels are only available for cloud environments that use a resource tagging system. AWS, Azure, Google, and Kubernetes are supported. HPC compute environments do not support resource labels.
- Cloud provider credentials must have the appropriate roles or permissions to tag resources in your environment.
- You can't assign multiple resource labels, using the same key, to the same resource, regardless of whether this option is supported by the destination cloud provider.

## Create resource labels

**Workspace-level labels**: Create resource labels at the workspace level for consistent use across compute environments, pipelines, actions, runs, and Studios:

1. In your workspace,  select **Settings** > **Edit labels**.
1. Select **Add label**.
1. Under **Type**, select **Resource label**.
1. Enter a **Name** such as `owner`, `team`, or `platform-run`.
1. Enter a **Value**: 
    - **Standard resource labels**: `<USERNAME>`, `TEAM_NAME`
    - **[Dynamic resource labels](#dynamic-resource-labels)**: Use variable syntax — `${workflowId}` or `${sessionId}`
1. Optionally, enable **Use as default in compute environment form** to automatically apply this label to all new compute environments in this workspace.
1. Select **Save**.

**Create labels during compute environment, pipeline, action, run, and Studio creation**: Resource labels can also be created and added to new Platform entities on the fly.

The deletion of a resource label from a workspace has no influence on the cloud environment.

:::info
 All users can add resource labels, but only maintainers (or higher) can edit or delete them, provided they're not already associated with **any** resource.
:::

## Apply resource labels

Once created at the workspace level, resource labels can be applied to:

- **Compute environments**: In the **Resource labels** field when creating a new compute environment. Once the compute environment has been created, its resource labels cannot be edited.
- **Pipelines**: In the **Resource labels** field when adding or editing a pipeline.  
- **Actions**: In the **Resource labels** field when creating or editing an action.
- **Pipeline runs**: In the **Resource labels** field when launching a pipeline. 
- **Studios**: In the **Resource labels** field when adding a Studio. 

Resource labels from the compute environment or pipeline are prefilled in the pipeline launch form, and compute environment resource labels are prefilled in the Studio add form. You can apply or override these labels when you launch a pipeline or add a Studio. Workspace maintainers can override default resource labels inherited from the compute environment when they create or edit pipelines, actions, runs, and Studios. Custom resource labels associated with each element propagate to resources in your cloud provider account. They don't alter the default resource labels on the compute environment.

When you add or edit resource labels associated with a pipeline, action, run, or Studio, the **submission and execution time** resource labels are altered. This does not affect the resource labels for resources spawned at compute environment **creation time**.

For example, the resource label `name=ce1` is set during AWS Batch compute environment creation. If you create the resource label `pipeline=pipeline1` while launching a pipeline with the same AWS Batch compute environment, the EC2 instances associated with that compute environment will still contain only the `name=ce1` label. Job Definitions associated with the pipeline run will inherit the `pipeline=pipeline1` resource label.

If a maintainer changes the compute environment associated with a pipeline, the **Resource labels** field is updated with the resource labels from the new compute environment.

## Dynamic resource labels 

Dynamic resource labels extend the standard resource labels functionality by allowing variable values that are populated with unique workflow identifiers at runtime. This enables precise cost tracking and resource attribution for individual pipeline runs across cloud compute environments.

Standard resource labels use static key-value pairs, such as `project=research` or `environment=production`. Dynamic resource labels use variable placeholders. Seqera and Nextflow resolve these placeholders when a workflow runs:

| Value           | Description         |
|-----------------|---------------------|
| `${workflowId}` | Platform run ID     |
| `${sessionId}`  | Nextflow session ID |

For example, a dynamic resource label `platformRun=${workflowId}` becomes `platformRun=12345abcde` when applied to the cloud resources consumed by run `12345abcde`.

Additional dynamic values, such as the user or team that launched a run, will be supported in a future release.

:::info
**Dynamic resource labels** tag resources with unique values for each pipeline run. Nextflow applies these labels at workflow submission and execution time, not during compute environment creation. See the **Submission time** and **Execution time** resources listed for each cloud provider in the [Resource label propagation](#resource-label-propagation-to-cloud-environments) section.
:::

### Benefits of dynamic resource labels

Dynamic resource labels provide several key advantages:

- **Granular cost tracking**: Associate cloud costs with specific workflow runs rather than entire compute environments or projects.
- **Automated attribution**: Apply labels automatically at execution time - no manual tagging of individual runs.
- **Enhanced reporting**: Filter and group costs by individual workflow runs in your cloud provider's cost management tools.
- **Audit trails**: Track resource usage patterns for specific workflows over time.

## Search and filter with resource labels

Search and filter pipelines on the Launchpad, and runs on the **Runs** tab, using one or more resource labels. The resource label search uses a `label:key=value` format.

## Resource label propagation to cloud environments

### AWS

The following resources are tagged using the labels associated with the compute environment (either [Batch](../compute-envs/aws-batch.md) or [Cloud](../compute-envs/aws-cloud.md)):

**Batch**:

- **Batch Forge creation time**
  - FSX Filesystems (does not cascade to files)
  - EFS Filesystems (does not cascade to files)
  - Batch Compute Environment
  - Batch Queue(s)
  - ComputeResource (EC2 instances, including EBS volumes)
  - Service role
  - Spot Fleet role
  - Execution role
  - Instance Profile role
  - Launch template

- **Submission time**
  - Jobs and Job Definitions
  - Tasks (via the `propagateTags` parameter on Job Definitions)

- **Execution time**
  - Work Tasks (via the `propagateTags` parameter on Job Definitions)

**Cloud**:

- **Submission and execution time**
  - ComputeResource (EC2 instances, including EBS volumes)

At execution time, when jobs are submitted to Batch, the requests are set up to propagate tags to all the instances and volumes created by the head job.

The [`forge-policy.json` file](https://github.com/seqeralabs/nf-tower-aws/blob/master/forge/forge-policy.json) contains the roles needed for Batch Forge-created AWS Batch compute environments to tag AWS resources. Specifically, the required roles are `iam:TagRole`, `iam:TagInstanceProfile`, and `batch:TagResource`.

To view and manage the resource labels applied to AWS resources by Seqera and Nextflow, go to the [AWS Tag Editor](https://docs.aws.amazon.com/tag-editor/latest/userguide/find-resources-to-tag.html) (as an administrative user) and follow these steps:

1. Under **Find resources to tag**, search for the resource label key and value in the relevant search fields under **Tags**. Your search can be further refined by AWS region and resource type. 
1. Select **Search resources**. **Resource search results** display all the resources tagged with your given resource label key and/or value.

### Include Seqera resource labels in AWS billing reports

To include the cost information associated with your resource labels in your AWS billing reports, you need to activate cost allocation tags. The method for viewing costs differs between static and dynamic resource labels:

**For static resource labels**: Because static resource labels have fixed values at compute environment creation time or workflow submission time, they are applied to static resources including Batch compute environments and EC2 instances. Static resource label costs can be viewed in AWS Cost Explorer, [Data Exports](https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html), and QuickSight dashboards.

**For dynamic resource labels**: Dynamic resource labels are only propagated at workflow submission and execution time. This means only jobs and job definitions (for AWS Batch compute environments), and EC2 instances (for AWS Cloud compute environments) spawned at runtime are tagged with the unique workflow identifiers. You must [enable split cost allocation data](https://docs.aws.amazon.com/cur/latest/userguide/enabling-split-cost-allocation-data.html) and view costs in [AWS Data Exports](https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html) and Cost and Usage Reports (CUR). Dynamic resource label costs are not visible in AWS Cost Explorer, which does not support split cost allocation data.

**Steps to activate cost allocation tags**:

1. **Wait for tag creation**: After creating resources with resource labels, wait up to 24 hours for the tag keys to appear in your cost allocation tags page

2. **Activate cost allocation tags**: [Activate](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/activating-tags.html) the associated tags in the **AWS Billing and Cost Management console**. Newly-applied tags may take up to 24 hours to appear on your cost allocation tags page.
   - In the navigation pane, choose **Cost allocation tags**
   - Select the tag keys you want to activate
   - Choose **Activate**
   - Allow up to 24 hours for tags to activate

3. **For static resource labels - View in Cost Explorer or Data Exports**: 
   - Navigate to AWS Cost Explorer and use **Group by** filters to organize costs by your activated tag keys
   - Create [cost allocation reports](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/configurecostallocreport.html#allocation-viewing) including your resource label tags
   - Alternatively, view in Data Exports and QuickSight dashboards for more detailed analysis

4. **For dynamic resource labels - Enable split cost allocation and view in Data Exports**: 
   - [Enable split cost allocation data](https://docs.aws.amazon.com/cur/latest/userguide/enabling-split-cost-allocation-data.html) in your Cost and Usage Reports preferences
   - View costs in your [Data Exports](https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html) and Cost and Usage Reports (CUR)
   - Query reports using Amazon Athena or visualize in Amazon QuickSight dashboards (requires a QuickSight subscription)
   - For a complete walkthrough, see our [guide to AWS cost tracking with resource labels](https://seqera.io/blog/aws-labels-cost-tracking/)

#### AWS limitations

- Resource label keys and values must contain a minimum of 2 and a maximum of 39 alphanumeric characters (each), separated by dashes or underscores.
- The key and value cannot begin or end with dashes `-` or underscores `_`.
- The key and value cannot contain a consecutive combination of `-` or `_` characters (`--`, `__`, `-_`, etc.)
- A maximum of 25 resource labels can be applied to each resource.
- A maximum of 1000 resource labels can be used in each workspace.
- Keys and values cannot start with `aws` or `user`, as these are reserved prefixes appended to tags by AWS.
- Keys and values are case-sensitive in AWS.

See [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html#tag-restrictions) for more information on AWS resource tagging.

### Google Cloud

The following resources are tagged using the labels associated with the compute environment (either [Batch](../compute-envs/google-cloud-batch.md) or [Cloud](../compute-envs/google-cloud.md)):

**Submission time**
- Job (Batch)

**Execution time**
- AllocationPolicy (Batch)
- VirtualMachine (Cloud)

#### View costs by resource labels in Google Cloud

Google Cloud includes resource labels in billing data for cost analysis and reporting:

1. **Access Billing Console**: Go to [Google Cloud Billing](https://console.cloud.google.com/billing) and navigate to **Reports** in the Cost management section.
2. **Configure Reports**: Use the **Labels** filter to select specific label keys and set **Group by** to organize costs by your label values.
3. **Export for Analysis**:
   - [Enable Cloud Billing export to BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery) for detailed analysis and custom reporting.
   - Use tools like [Looker Studio](https://cloud.google.com/looker-studio/docs/overview) to visualize your labeled cost data.

#### Google Cloud limitations

- Resource label keys and values must contain a minimum of 2 and a maximum of 39 alphanumeric characters (each), separated by dashes or underscores.
- The key and value cannot begin or end with dashes `-` or underscores `_`.
- The key and value cannot contain a consecutive combination of `-` or `_` characters (`--`, `__`, `-_`, etc.)
- A maximum of 25 resource labels can be applied to each resource.
- A maximum of 1000 resource labels can be used in each workspace.
- Keys and values in Google Cloud Resource Manager may contain **only lowercase letters**. Resource labels created with uppercase characters are **automatically converted to lowercase** in Platform before being propagated to Google Cloud.

See [here](https://cloud.google.com/resource-manager/docs/creating-managing-labels#requirements) for more information on Google Cloud Resource Manager labeling.

### Azure

The system used for labeling resources in Azure differs depending on your compute environment type: 
- In an **Azure Batch** compute environment created with Batch Forge, resource labels are added to the Pool parameters — this adds set of `key=value` **metadata** pairs to the Azure Batch Pool.
- In an **Azure Cloud** (single instance) compute environment, resource labels are propagated to VMs and related resources as **tags**.

:::warning
In Azure Batch compute environments, the [Azure Batch node pool](https://learn.microsoft.com/en-us/azure/batch/nodes-and-pools) is managed by the compute environment and **resource labels are fixed at the time of creation**.
:::

#### View costs by resource labels in Azure

Azure supports cost analysis by tags. However, you must configure tag inheritance and cost allocation.

:::note
Dynamic resource labels create tags in the form of metadata pairs on Azure Batch resources. However, Azure's cost reporting integration has some limitations. Azure tags may not always appear immediately in **Cost Management**.
:::

**Prerequisites**: Billing profile contributor/owner permissions for billing profile tags, and Contributor role or Tag Contributor role for resource tagging.

**Steps to enable cost tracking**:

1. **Enable Tag Inheritance** (recommended): Navigate to Cost Management in the Azure portal, select a billing account or subscription scope, and under **Settings** > **Configuration** > **Tag inheritance**, enable **Automatically apply subscription and resource group tags to new data**. See [Azure tag inheritance documentation](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/enable-tag-inheritance) for detailed steps.
2. **View Tagged Costs**: Navigate to **Cost Management + Billing** > **Cost Management** > **Cost analysis** and select **Group by** for your tag key.
3. **Create Budgets with Tag Filters**: [Create budgets with filters](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets) on the inherited tags, available 24 hours after enabling tag inheritance.

#### Azure limitations

- Resource label keys and values must contain a minimum of 2 and a maximum of 39 alphanumeric characters (each), separated by dashes or underscores.
- The key and value cannot begin or end with dashes `-` or underscores `_`.
- The key and value cannot contain a consecutive combination of `-` or `_` characters (`--`, `__`, `-_`, etc.)
- A maximum of 25 resource labels can be applied to each resource.
- A maximum of 1000 resource labels can be used in each workspace.
- Keys are case-insensitive, but values are case-sensitive.
- Microsoft advises against using a non-English language in your resource labels, as this can lead to decoding progress failure while loading your VM's metadata.

Tags are not available for tenant resources not associated with subscriptions, classic resources, or some resource types that don't support tags in usage data.

See [here](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources?tabs=json) for more information on Azure Resource Manager tagging.

### Kubernetes

Both the Head pod and Work pod specs will contain the set of labels associated with the compute environment in addition to the standard labels applied by Seqera Platform and Nextflow.

:::caution
Currently, tagging with resource labels is not available for the files created during a workflow execution. The cloud instances are the elements being tagged.
:::

The following resources will be tagged using the labels associated with the compute environment:

**Compute environment creation time**
- Deployment
- PodTemplate

**Submission time**
- Head Pod Metadata

**Execution time**
- Run Pod Metadata

#### Kubernetes limits

- Resource label keys and values must contain a minimum of 2 and a maximum of 39 alphanumeric characters (each), separated by dashes or underscores.
- The key and value cannot begin or end with dashes `-` or underscores `_`.
- The key and value cannot contain a consecutive combination of `-` or `_` characters (`--`, `__`, `-_`, etc.)
- A maximum of 25 resource labels can be applied to each resource.
- A maximum of 1000 resource labels can be used in each workspace.

See [Syntax and character set](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set) for more information on Kubernetes object labeling.

## Best Practices

- **Use descriptive keys**: Choose tag keys that clearly indicate their purpose (e.g., `workflow-id`, `pipeline-run`, `session-id`).
- **Plan for cost analysis**: Consider how you'll group and filter costs in your cloud provider's tools when designing your tag schema.
- **Combine static and dynamic labels**: Use dynamic resource labels alongside static labels for comprehensive cost attribution (e.g., static `project=genomics` with dynamic `platformRun=${workflowId}`).
- **Monitor tag limits**: Stay within cloud provider tag limits (25 tags per resource for AWS/GCP/Azure).
- **Document your schema**: Maintain documentation of your tagging strategy for team members who will analyze costs.





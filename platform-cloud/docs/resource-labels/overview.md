---
title: "Resource labels"
description: "Instructions to use resource labels in Seqera Platform."
date: "24 Apr 2023"
tags: [resource labels, labels]
---

Platform supports resource labels in runs, compute environments, pipelines, and actions. This offers a flexible tagging system for annotation and tracking of the cloud services consumed by a run. Resource labels are sent to the cloud service provider in `key=value` format.

Resource labels are applied to elements during:

- Compute environment creation
- Workflow submission
- Workflow execution

### Dynamic resource labels 

Use dynamic resource labels to tag cloud resources with Platform run and Nextflow session identifiers at workflow submission and execution time. When you provide a variable value (either `${workflowId}` or `${sessionId}`) in the standard `key=value` resource label format, the unique run or session ID for each pipeline run will be propagated to your cloud provider for all the resources spawned by that particular run.

For example, to apply labels containing the unique Platform run ID to all the resources spawned by a run, add a dynamic label such as `alex=run-${workflowId}` to your compute environment, pipeline, or manually in the pipeline launch form. 

Dynamic resource labels applied at the compute environment or pipeline level are prefilled in the pipeline launch form, and they can be applied or overridden during pipeline launch.

:::info
Because dynamic resource labels are used to tag the resources spawned with the Platform run ID or Nextflow session ID, they are only applied during workflow submission and execution time, and not at compute environment creation. As a result, only the **Submission time** and **Execution time** resources listed for each cloud provider on this page can be tagged with a dynamic resource label.
:::

### Create and apply resource labels

Resource labels can be created, applied, and edited by a workspace admin or owner. When applying a label, users can select from existing labels or add new labels on the fly.

#### Resource labels applied to a compute environment

Admins can assign a set of resource labels when creating a compute environment. All runs executed using the compute environment will be tagged with its resource labels. Resource labels applied to a compute environment are displayed on the compute environment details page.

Apply resource labels when you create a new compute environment.

:::caution
Once the compute environment has been created, its resource labels cannot be edited.
:::

If a resource label is applied to a compute environment, all runs in that compute environment will inherit it. Likewise, all cloud resources generated during the workflow execution will be tagged with the same resource label.

#### Resource labels applied to runs, pipelines, and actions

Admins can override the default resource labels inherited from the compute environment when creating and editing pipelines, actions, and runs on the fly. The custom resource labels associated with each element will propagate to the associated resources in the cloud environment without altering the default resource labels associated with the compute environment.

When an admin adds or edits the resource labels associated with a pipeline, action, or run, the **submission and execution time** resource labels are altered. This does not affect the resource labels for resources spawned at compute environment **creation time**.

For example, the resource label `name=ce1` is set during AWS Batch compute environment creation. If you create the resource label `pipeline=pipeline1` while creating a pipeline which uses the same AWS Batch compute environment, the EC2 instances associated with that compute environment will still contain only the `name=ce1` label, while the Job Definitions associated with the pipeline will inherit the `pipeline=pipeline1` resource label.

If a maintainer changes the compute environment associated with a pipeline or run, the **Resource labels** field is updated with the resource labels from the new compute environment.

### Search and filter with labels

Search and filter pipelines and runs using one or more resource labels. The resource label search uses a `label:key=value` format.

### Manage workspace resource labels

Select a workspace's **Settings** tab to view all the resource labels used in that workspace. All users can add resource labels, but only admins can edit or delete them, provided they're not already associated with **any** resource. This applies to resource labels associated with compute environments and runs. 

When you add or edit a resource label, you can optionally set **Use as default in compute environment form**. Workspace default resource labels are prefilled in the **Resource labels** field when you create a new compute environment in that workspace.

The deletion of a resource label from a workspace has no influence on the cloud environment.

### Resource label propagation to cloud environments

:::note
- Cloud provider credentials must have the appropriate roles or permissions to tag resources in your environment.
- You can't assign multiple resource labels, using the same key, to the same resource, regardless of whether this option is supported by the destination cloud provider.
:::

Resource labels are only available for cloud environments that use a resource tagging system. AWS, Azure, Google Cloud, and Kubernetes are supported. HPC compute environments do not support resource labels.

When a run is executed in a compute environment with associated resource labels:
- Seqera propagates the labels to the set of resources listed for each provider below 
- Nextflow distributes the labels for the resources spawned at runtime.

If the compute environment is created with Batch Forge, the compute environment will propagate the tags to the resources generated by the Forge execution.

:::caution
Resource label propagation is one-way and not synchronized with the cloud environment. This means that Seqera attaches tags to cloud resources, but isn't aware if those tags are changed or deleted directly in the cloud environment.
:::

### AWS

When the compute environment is created with Forge, the following resources will be tagged using the labels associated with the compute environment:

**Forge creation time**

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

**Submission time**

- Jobs and Job Definitions
- Tasks (via the `propagateTags` parameter on Job Definitions)

**Execution time**

- Work Tasks (via the `propagateTags` parameter on Job Definitions)

At execution time, when the jobs are submitted to Batch, the requests are set up to propagate tags to all the instances and volumes created by the head job.

The [`forge-policy.json`](https://github.com/seqeralabs/nf-tower-aws/blob/master/forge/forge-policy.json) file contains the roles needed for Batch Forge-created AWS compute environments to tag AWS resources. Specifically, the required roles are `iam:TagRole`, `iam:TagInstanceProfile`, and `batch:TagResource`.

To view and manage the resource labels applied to AWS resources by Seqera and Nextflow, go to the [AWS Tag Editor](https://docs.aws.amazon.com/tag-editor/latest/userguide/find-resources-to-tag.html) (as an administrative user) and follow these steps:

Under **Find resources to tag**, search for the resource label key and value in the relevant search fields under **Tags**. Your search can be further refined by AWS region and resource type. Then select **Search resources**. **Resource search results** display all the resources tagged with your given resource label key and/or value.

**Include Seqera resource labels in AWS billing reports**

To include the cost information associated with your resource labels in your AWS billing reports:

1. [Activate](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/activating-tags.html) the associated tags in the **AWS Billing and Cost Management console**. Newly-applied tags may take up to 24 hours to appear on your cost allocation tags page.
2. When your tags are activated and displayed in **Billing and Cost Management > Cost allocation tags**, you can apply them when you create [cost allocation reports](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/configurecostallocreport.html#allocation-viewing).

#### AWS limits

- Resource label keys and values must contain a minimum of 2 and a maximum of 39 alphanumeric characters (each), separated by dashes or underscores.
- The key and value cannot begin or end with dashes `-` or underscores `_`.
- The key and value cannot contain a consecutive combination of `-` or `_` characters (`--`, `__`, `-_`, etc.)
- A maximum of 25 resource labels can be applied to each resource.
- A maximum of 1000 resource labels can be used in each workspace.
- Keys and values cannot start with `aws` or `user`, as these are reserved prefixes appended to tags by AWS.
- Keys and values are case-sensitive in AWS.

See [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html#tag-restrictions) for more information on AWS resource tagging.

### Google Batch and Google Life Sciences

When the compute environment is created with Forge, the following resources will be tagged using the labels associated with the compute environment:

**Submission time**

- Job (Batch)
- RunPipeline (Life Sciences)

**Execution time**

- AllocationPolicy (Batch)
- VirtualMachine (Life Sciences)
- RunPipeline (Life Sciences)

#### GCP limits

- Resource label keys and values must contain a minimum of 2 and a maximum of 39 alphanumeric characters (each), separated by dashes or underscores.
- The key and value cannot begin or end with dashes `-` or underscores `_`.
- The key and value cannot contain a consecutive combination of `-` or `_` characters (`--`, `__`, `-_`, etc.)
- A maximum of 25 resource labels can be applied to each resource.
- A maximum of 1000 resource labels can be used in each workspace.
- Keys and values in Google Cloud Resource Manager may contain only lowercase letters. Resource labels created with uppercase characters are changed to lowercase before propagating to Google Cloud.

See [here](https://cloud.google.com/resource-manager/docs/creating-managing-labels#requirements) for more information on Google Cloud Resource Manager labeling.

### Azure

:::note
The labeling system on Azure Cloud uses the term metadata to refer to resource and other labels
:::

When creating an Azure Batch compute environment with Forge, resource labels are added to the Pool parameters — this adds set of `key=value` metadata pairs to the Azure Batch Pool.

#### Azure limits

- Resource label keys and values must contain a minimum of 2 and a maximum of 39 alphanumeric characters (each), separated by dashes or underscores.
- The key and value cannot begin or end with dashes `-` or underscores `_`.
- The key and value cannot contain a consecutive combination of `-` or `_` characters (`--`, `__`, `-_`, etc.)
- A maximum of 25 resource labels can be applied to each resource.
- A maximum of 1000 resource labels can be used in each workspace.
- Keys are case-insensitive, but values are case-sensitive.
- Microsoft advises against using a non-English language in your resource labels, as this can lead to decoding progress failure while loading your VM's metadata.

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

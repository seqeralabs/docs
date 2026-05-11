---
title: "AWS"
description: "AWS troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, aws help, aws troubleshooting]
---

### Elastic Block Store (EBS)

**EBS Autoscaling: EBS volumes remain active after job completion**

The EBS autoscaling solution relies on an AWS-provided script which runs on each container host. This script performs AWS EC2 API requests to delete EBS volumes when the jobs using those volumes have been completed.

When running large Batch clusters (hundreds of compute nodes or more), EC2 API rate limits may cause the deletion of unattached EBS volumes to fail. Volumes that remain active after Nextflow jobs have been completed will incur additional costs and should therefore be manually deleted. You can monitor your AWS account for any orphaned EBS volumes via the EC2 console or with a Lambda function. See [Controlling your AWS costs by deleting unused Amazon EBS volumes](https://aws.amazon.com/blogs/mt/controlling-your-aws-costs-by-deleting-unused-amazon-ebs-volumes/) for more information.

### Elastic Container Service (ECS)

**ECS Agent Docker image pull frequency**

As part of the AWS Batch creation process, Batch Forge will set ECS Agent parameters in the EC2 launch template that is created for your cluster's EC2 instances:

- For clients using Seqera Enterprise v22.01 or later:
  - Any AWS Batch environment created by Batch Forge will set the ECS Agent's `ECS_IMAGE_PULL_BEHAVIOUR` to `once`.
- For clients using Seqera Enterprise v21.12 or earlier:
  - Any AWS Batch environment created by Batch Forge will set the ECS Agent's `ECS_IMAGE_PULL_BEHAVIOUR` to `default`.

See the [AWS ECS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) for an in-depth explanation of this difference.

:::note
This behaviour can't be changed within Seqera Platform.
:::

### Container errors

**CannotPullContainerError: Error response from daemon: error parsing HTTP 429 response body: invalid character 'T' looking for beginning of value: "Too Many Requests (HAP429)"**

Docker Hub imposes a rate limit of 100 anonymous pulls per 6 hours. Add the following to your launch template to avoid this issue:

`echo ECS_IMAGE_PULL_BEHAVIOR=once >> /etc/ecs/ecs.config`

**CannotInspectContainerError**

If your run fails with an _Essential container in task exited - CannotInspectContainerError: Could not transition to inspecting; timed out after waiting 30s_ error, try the following:

1. Upgrade your [ECS Agent](https://github.com/aws/amazon-ecs-agent/releases) to [1.54.1](https://github.com/aws/amazon-ecs-agent/pull/2940) or newer. See [Check for ECS Container Instance Agent Version](https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ECS/latest-agent-version.html) for instructions to check your ECS Agent version.
2. Provision more storage for your EC2 instance (preferably via EBS-autoscaling to ensure scalability).
3. If the error is accompanied by _command exit status: 123_ and a _permissions denied_ error tied to a system command, ensure that the ECS Agent binary is set to be executable (`chmod u+x`).

## Queues

**Multiple AWS Batch queues for a single job execution**

Although you can only create/identify a single work queue during the definition of your AWS Batch compute environment in Seqera, you can spread tasks across multiple queues when your job is sent to Batch for execution via your pipeline configuration. Add the following snippet to your `nextflow.config`, or the **Advanced Features > Nextflow config file** field of the Seqera Launch UI, for processes to be distributed across two AWS Batch queues, depending on the assigned name.

```bash
# nextflow.config

process {
  withName: foo {
    queue: `TowerForge-1jJRSZmHyrrCvCVEOhmL3c-work`
  }
}

process {
  withName: bar {
    queue: `custom-second-queue`
  }
}
```

## Storage

**Enable pipelines to write to S3 buckets that enforces AES256 server-side encryption**

:::note
This solution requires Seqera v21.10.4 and Nextflow [22.04.0](https://github.com/nextflow-io/nextflow/releases/tag/v22.04.0) or later.
:::

If you need to save files to an S3 bucket with a policy that [enforces AES256 server-side encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html), the [nf-launcher](https://quay.io/repository/seqeralabs/nf-launcher?tab=tags) script which invokes the Nextflow head job requires additional configuration:

1. Add the following configuration to the **Advanced options > Nextflow config file** textbox of the **Launch Pipeline** screen:

   ```
   aws {
     client {
       storageEncryption = 'AES256'
     }
   }
   ```

2. Add the following configuration to the **Advanced options > Pre-run script** textbox of the **Launch Pipeline** screen:

   ```bash
   export TOWER_AWS_SSE=AES256
   ```

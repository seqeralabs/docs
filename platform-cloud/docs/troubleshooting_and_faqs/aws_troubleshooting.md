---
title: "AWS"
description: "AWS troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, aws, troubleshooting]
---

When running pipelines on AWS, you might encounter the following issues.

## Elastic Block Store (EBS)

#### Volumes remain active after job completion

On large AWS Batch clusters (hundreds of compute nodes or more), EC2 API rate limits can cause the automatic deletion of unattached EBS volumes to fail. Orphaned volumes that remain after jobs complete incur additional costs.

EBS autoscaling relies on an AWS-provided script on each container host that calls the EC2 API to delete each volume when its job finishes. When deletion fails, find orphaned volumes in the EC2 console or with a Lambda function and delete them manually. See [Controlling your AWS costs by deleting unused Amazon EBS volumes](https://aws.amazon.com/blogs/mt/controlling-your-aws-costs-by-deleting-unused-amazon-ebs-volumes/).

## Elastic Container Service (ECS)

#### ECS agent Docker image pull frequency

When Batch Forge creates an AWS Batch environment, it sets the ECS agent's `ECS_IMAGE_PULL_BEHAVIOUR` in the EC2 launch template:

- Seqera Enterprise v22.01 or later: `once`
- Seqera Enterprise v21.12 or earlier: `default`

See the [AWS ECS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) for the difference between these values.

:::note
This behavior can't be changed within Seqera Platform.
:::

## Container errors

#### `CannotPullContainerError … "Too Many Requests (HAP429)"`

```
CannotPullContainerError: Error response from daemon: error parsing HTTP 429 response body: invalid character 'T' looking for beginning of value: "Too Many Requests (HAP429)"
```

This error occurs when you exceed Docker Hub's rate limit of 100 anonymous pulls per 6 hours.

To resolve, add the following to your launch template:

```bash
echo ECS_IMAGE_PULL_BEHAVIOR=once >> /etc/ecs/ecs.config
```

#### `CannotInspectContainerError`

```
Essential container in task exited - CannotInspectContainerError: Could not transition to inspecting; timed out after waiting 30s
```

To resolve:

1. Upgrade your [ECS agent](https://github.com/aws/amazon-ecs-agent/releases) to [1.54.1](https://github.com/aws/amazon-ecs-agent/pull/2940) or later. See [Check for ECS Container Instance Agent Version](https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ECS/latest-agent-version.html) to check your version.
2. Provision more storage for your EC2 instance, preferably with EBS autoscaling for scalability.
3. If the error includes `command exit status: 123` and a permissions-denied error on a system command, make the ECS agent binary executable (`chmod u+x`).

## Queues

#### Distribute tasks across multiple AWS Batch queues

You can identify only a single work queue when you define an AWS Batch compute environment, but you can distribute tasks across multiple queues in your pipeline configuration. Add a snippet like the following to your `nextflow.config`, or the **Advanced options > Nextflow config file** field of the launch form, to distribute processes across two queues by name:

```groovy
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

## Spot instances

**Tasks fail with exit code `143`, or no exit code, and the log contains `Host EC2 (instance i-xxxxxxxxx) terminated`**

AWS reclaimed the Spot instance running the task. See [Manage AWS Spot interruptions](../compute-envs/aws-spot-interruptions) for retry and fallback strategies.

## Storage

#### Write to S3 buckets that enforce AES256 server-side encryption

:::note
Requires Seqera v21.10.4 and Nextflow [22.04.0](https://github.com/nextflow-io/nextflow/releases/tag/v22.04.0) or later.
:::

To save files to an S3 bucket with a policy that [enforces AES256 server-side encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html), configure the [nf-launcher](https://quay.io/repository/seqeralabs/nf-launcher?tab=tags) script that invokes the Nextflow head job:

1. Add the following to the **Advanced options > Nextflow config file** field of the **Launch Pipeline** screen:

   ```groovy
   aws {
     client {
       storageEncryption = 'AES256'
     }
   }
   ```

2. Add the following to the **Advanced options > Pre-run script** field:

   ```bash
   export TOWER_AWS_SSE=AES256
   ```

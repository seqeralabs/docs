---
title: "CloudFormation deployment (deprecated)"
description: Deploy Tower to ECS using CloudFormation
date: "12 Apr 2023"
tags: [ecs, cloudformation, deployment]
---

!!! danger "Deprecated"
This deployment option is deprecated, and will be removed in the future. We strongly recommend against using this option unless you are sufficiently experienced with CloudFormation to customize this template for your own infrastructure.

Tower can be deployed via AWS CloudFormation, using the included configuration.

This guide assumes that all [prerequisites](../prerequisites/aws.mdx) have been met.

## Setup ECS cluster

1. Navigate to the ECS console in AWS.

2. Select **Create cluster**.

3. Select **Amazon ECS** -> **Clusters** -> **EC2 Linux + Networking**.

### ECS Cluster Configuration

- Name: nf-tower

**Instance Configuration**

- Provisioning Model: On-Demand
- EC2 instance type: c4.2xlarge
- Number of instances: 1
- EC2 AMI id: Amazon Linux 2
- Root EBS Volume Size (GiB): none
- Key pair: none

### Networking Configuration

- Create new VPC

Container instance IAM role

- Create new role (if `ecsInstance` role doesn't exist)

Obtain Instance `ServerURL`

- Record the Public IP of the instance in the ECS cluster e.g. `3.122.246.202`

## Deploy Tower

<details>
  <summary>Click to view aws-ecs-cloudformation.json</summary>

```json file=../_templates/cloudformation/aws-ecs-cloudformation.json

```

</details>

<details>
    <summary>Click to view params.json.template </summary>

```json file=../_templates/cloudformation/params.json.template

```

</details>

1. Download [aws-ecs-cloudformation.json](../_templates/cloudformation/aws-ecs-cloudformation.json) and [params.json.template](../_templates/cloudformation/params.json.template).

2. Rename `params.template.json` to `params.json` and configure for your environment.

   For more information on configuration, visit the [Configuration](../configuration/overview.mdx) section.

3. Deploy the Tower stack to your ECS cluster:

   ```bash
   aws cloudformation create-stack \
       --stack-name Tower \
       --template-body file://aws-ecs-cloudformation.json \
       --parameters file://params.json
   ```

   You can delete the stack at any time, to uninstall Tower or update any parameters:

   ```bash
   aws cloudformation delete-stack \
       --stack-name Tower
   ```

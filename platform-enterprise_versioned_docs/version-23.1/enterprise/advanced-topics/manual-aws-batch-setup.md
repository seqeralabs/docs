---
title: "Manual AWS Batch configuration"
description: "Manual AWS Batch configuration"
date: "12 Apr 2023"
tags: [aws, batch, configuration]
---

This document describes how to set up AWS roles and Batch queues manually for the deployment of Nextflow workloads using Tower Enterprise.

:::tip
These steps are only needed if you want to create the AWS Batch resources _manually_. If you use the **Batch Forge** option, these steps are not needed, because Tower will _automatically_ create the required Batch queues.
:::

### Create a user policy

Create the policy for the user launching Nextflow jobs:

- Go to the [IAM Console](https://console.aws.amazon.com/iam/home)
- Go to the Policy page
- Create a new policy with the following content:

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "Stmt1530313170000",
        "Effect": "Allow",
        "Action": [
          "batch:CancelJob",
          "batch:RegisterJobDefinition",
          "batch:DescribeComputeEnvironments",
          "batch:DescribeJobDefinitions",
          "batch:DescribeJobQueues",
          "batch:DescribeJobs",
          "batch:ListJobs",
          "batch:SubmitJob",
          "batch:TerminateJob"
        ],
        "Resource": ["*"]
      }
    ]
  }
  ```

- Save with it the name **`nf-tower-user`**.

### Create the instance role policy

- Go to the [IAM Console](https://console.aws.amazon.com/iam/home)
- Go to the Policy page
- Create a new policy with the following content:

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "VisualEditor0",
        "Effect": "Allow",
        "Action": [
          "batch:DescribeJobQueues",
          "batch:CancelJob",
          "batch:SubmitJob",
          "batch:ListJobs",
          "batch:DescribeComputeEnvironments",
          "batch:TerminateJob",
          "batch:DescribeJobs",
          "batch:RegisterJobDefinition",
          "batch:DescribeJobDefinitions",
          "ecs:DescribeTasks",
          "ec2:DescribeInstances",
          "ec2:DescribeInstanceTypes",
          "ec2:DescribeInstanceAttribute",
          "ecs:DescribeContainerInstances",
          "ec2:DescribeInstanceStatus",
          "logs:Describe*",
          "logs:Get*",
          "logs:List*",
          "logs:StartQuery",
          "logs:StopQuery",
          "logs:TestMetricFilter",
          "logs:FilterLogEvents"
        ],
        "Resource": "*"
      }
    ]
  }
  ```

- Finally, save it with the name **`nf-tower-batchjob`**.

### Create the Batch Service Role

This is a role used by AWS Batch to launch EC2 instances on your behalf.

- Go to the [IAM Console](https://console.aws.amazon.com/iam/home)
- Click on "Roles"
- Click on "Create role"
- Select "AWS service" as the trusted entity
- Choose "Batch" as the service to use the role
- Click "Next: Permissions"
- In Attached permissions policies, the `AWSBatchServiceRole` will already be attached
- Click "Next: Tags" (adding tags is optional)
- Click "Next: Review"
- Set the Role Name to **`nf-tower-servicerole`**
- Finally, Click "Create role"

### Create an EC2 Instance Role

This is a role that controls which AWS Resources EC2 instances launched by AWS Batch have access to.
In this case, you will limit S3 access to just the bucket you created earlier.

- Go to the [IAM Console](https://console.aws.amazon.com/iam/home)
- Click on "Roles"
- Click on "Create role"
- Select "AWS service" as the trusted entity
- Choose EC2 from the larger services list
- Choose "EC2 - Allows EC2 instances to call AWS services on your behalf" as the use case.
- Click "Next: Permissions"

  - Type "ContainerService" in the search field for policies
  - Click the checkbox next to `AmazonEC2ContainerServiceforEC2Role` to attach the policy
  - Type "S3" in the search field for policies
  - Click the checkbox next to `AmazonS3FullAccess` to attach the policy (you may want to use to use a custom policy to allow the access only on specific S3 buckets)

- Search and attach the custom policy **`nf-tower-batchjob`**
- Click "Next: Tags". (adding tags is optional)
- Click "Next: Review"
- Set the Role Name to **`nf-tower-instancerole`**
- Finally, Click "Create role"

### Create an EC2 SpotFleet Role

This is a role that allows creation and launch of Spot fleets - Spot instances with similar compute capabilities
(i.e. vCPUs and RAM). This is for using Spot instances when running jobs in AWS Batch.

- Go to the [IAM Console](https://console.aws.amazon.com/iam/home)
- Click on "Roles"
- Click on "Create role"
- Select "AWS service" as the trusted entity
- Choose EC2 from the larger services list
- Choose "EC2 - Spot Fleet Tagging" as the use case
  - In Attached permissions policies, the `AmazonEC2SpotFleetTaggingRole` will already be attached.
- Click "Next: Tags". (adding tags is optional)
- Click "Next: Review"
- Set the Role Name to **`nf-tower-fleetrole`**
- Click "Create role".

### Create a launch template

Required to configure the EC2 instance deployed by the Batch jobs.

- Go to the [EC2 Console](https://console.aws.amazon.com/ec2/v2/home)
- Click Launch template
- Create a new launch template which uses the `User Data` (in the Advanced details section) shown below:

  ```bash
  MIME-Version: 1.0
  Content-Type: multipart/mixed; boundary="//"

  --//
  Content-Type: text/x-shellscript; charset="us-ascii"

  #!/bin/sh
  su - root << 'EOF'
  (
  set -x
  ## install awscli
  USER=/home/ec2-user
  export PATH=/usr/local/bin:$PATH
  yum install -y jq python27-pip sed wget bzip2
  pip install -U boto3
  wget -q https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
  bash Miniconda3-latest-Linux-x86_64.sh -b -f -p $USER/miniconda
  $USER/miniconda/bin/conda install -c conda-forge -y awscli
  rm Miniconda3-latest-Linux-x86_64.sh
  chown -R ec2-user:ec2-user $USER/miniconda
  ) &>> ~/boot.log
  EOF
  cp ~/boot.log ~ec2-user/boot.log

  --//--
  ```

- Finally, save it with name **`nf-tower-launchtemplate`**.

### Create the Batch compute environments

- Go to the [Batch Console](https://eu-west-1.console.aws.amazon.com/batch/home)
- Create a new compute environment specifying the Instance profile, Service role, Fleet role and
  Launch template created previously.
- Save it with a name of your choice.

### Create the Batch Queue

- Go to the [Batch Console](https://eu-west-1.console.aws.amazon.com/batch/home)
- Create a new queue
- Associate to the compute environment created in the previous step.
- Finally, save it with a name of your choice.

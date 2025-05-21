---
title: "Custom AWS Batch launch container"
description: Use a custom AWS Batch launch container
date: "12 Apr 2023"
tags: [aws, batch, launch, container]
---

:::note
This feature requires Tower 20.10.2 or later.
:::

Tower automatically registers an AWS Batch [job definition](https://docs.aws.amazon.com/batch/latest/userguide/job_definitions.html) to launch pipelines with the required Nextflow runtime.

If you need to manage this manually, create a job definition in your AWS Batch environment using the following settings:

- name: any of your choice
- image: a custom image based on the Seqera Labs [nf-launcher image](https://quay.io/repository/seqeralabs/nf-launcher)
- vcpus: at least 1
- memory: at least 1000
- command: `true`

Once the job definition is registered, update your Tower Enterprise configuration with the following (replace `YOUR_JOB_DEFINITION_NAME` with the name of the job definition):

```env
TOWER_LAUNCH_CONTAINER=job-definition://YOUR_JOB_DEFINITION_NAME
```

**Note:** The repository where your launch container resides must be accessible to the Batch cluster's [ECS Agent](https://aws.amazon.com/blogs/compute/how-to-authenticate-private-container-registries-using-aws-batch/).

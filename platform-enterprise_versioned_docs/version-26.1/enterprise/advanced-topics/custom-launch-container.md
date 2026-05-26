---
title: "Custom AWS Batch launch container"
description: Use a custom AWS Batch launch container
date: "12 Apr 2023"
tags: [aws, batch, launch, container]
---

You can customize your Seqera instance's Nextflow launch container, e.g., to include private CA certificates or compliance software in your Nextflow environment.

:::caution
Seqera recommends using the default Nextflow launch container wherever possible. Custom launch containers can complicate your Seqera configuration and upgrade process.
:::

Specify the path to your custom launch container image with an environment variable:

```env
TOWER_LAUNCH_CONTAINER=quay.io/seqeralabs/nf-launcher:j17-23.04.3
```

**Use an AWS Batch job definition as a Seqera custom launch container**

Seqera Platform automatically registers an AWS Batch [job definition](https://docs.aws.amazon.com/batch/latest/userguide/job_definitions.html) to launch pipelines with the required Nextflow runtime.

If you need to manage this manually, create a job definition in your AWS Batch environment with the following settings:

- `name`: any of your choice
- `image`: a custom image based on the Seqera [nf-launcher image](https://quay.io/repository/seqeralabs/nf-launcher)
- `vcpus`: at least `1`
- `memory`: at least `1000`
- `command`: `true`

After the job definition is registered, update your Seqera Enterprise configuration with the following (replace `<YOUR_JOB_DEFINITION_NAME>` with the name of the job definition):

:::caution
The custom launch container is set at the root level, so all executions in your Seqera instance will use this container. If you set an AWS Batch job definition as your custom launch container, launching workflow executions in other cloud provider compute environments will fail.
:::

```env
TOWER_LAUNCH_CONTAINER=job-definition://<YOUR_JOB_DEFINITION_NAME>
```

:::note
The repository where your launch container resides must be accessible to the Batch cluster's [ECS Agent](https://aws.amazon.com/blogs/compute/how-to-authenticate-private-container-registries-using-aws-batch/).
:::

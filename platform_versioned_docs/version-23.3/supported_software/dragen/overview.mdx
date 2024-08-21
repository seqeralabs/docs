---
title: "Illumina DRAGEN"
description: "Instructions to integrate Illumina DRAGEN with Seqera Platform."
date: "24 Apr 2023"
tags: [dragen, integration]
---

DRAGEN is a platform provided by Illumina that offers accurate, comprehensive, and efficient secondary analysis of next-generation sequencing (NGS) data with a significant speed increase over tools that are commonly used for such tasks.

The improved performance offered by DRAGEN is possible due to the use of Illumina proprietary algorithms in conjunction with a special type of hardware accelerator called field programmable gate arrays (FPGAs). For example, when using AWS, FPGAs are available via the [F1 instance type](https://aws.amazon.com/ec2/instance-types/f1/).

## Run DRAGEN on Seqera Platform

We have extended the [Batch Forge](../../compute-envs/aws-batch.mdx?h=forge#tower-forge) feature for AWS Batch to support DRAGEN. Batch Forge ensures that all of the appropriate components and settings are automatically provisioned when creating an AWS Batch [compute environment](../../compute-envs/aws-batch.mdx#tower-forge).

When deploying data analysis workflows, some tasks will need to use normal instance types (e.g., for non-DRAGEN processing of samples) and others will need to be executed on F1 instances. If the DRAGEN feature is enabled, Batch Forge will create an additional AWS Batch compute queue which only uses F1 instances, to which DRAGEN tasks will be dispatched.

## Getting started

To showcase the capability of this integration, we have implemented a proof of concept pipeline called [nf-dragen](https://github.com/seqeralabs/nf-dragen). To run it, sign into Seqera Platform, navigate to the [Community Showcase](https://cloud.seqera.io/orgs/community/workspaces/showcase/launchpad) and select the "nf-dragen" pipeline.

You can run this pipeline at your convenience without any extra setup. Note however that it will be deployed in the compute environment owned by the Community Showcase.

To deploy the pipeline on your own AWS cloud infrastructure, follow the instructions in the next section.

## Deploy DRAGEN in your own workspace

DRAGEN is a commercial technology provided by Illumina, so you will need to purchase a license from them. To run on Seqera, you will need to obtain the following information from Illumina:

1. DRAGEN AWS private AMI ID
2. DRAGEN license username
3. DRAGEN license password

Batch Forge automates most of the tasks required to set up an AWS Batch compute environment. See [AWS Batch](../../compute-envs/aws-batch.mdx) for more details.

In order to enable support for DRAGEN acceleration, simply toggle the **Enable DRAGEN (beta)** option when setting up the compute environment via Batch Forge.

In the **DRAGEN AMI ID** field, enter the AWS AMI ID provided by Illumina. Then select the instance type from the drop-down menu.

:::note
The Region you select must contain DRAGEN F1 instances.
:::

## Pipeline implementation and deployment

See the [dragen.nf](https://github.com/seqeralabs/nf-dragen/blob/master/modules/local/dragen.nf) module implemented in the [nf-dragen](https://github.com/seqeralabs/nf-dragen) pipeline for reference. Any Nextflow processes that run DRAGEN must:

1. Define the `dragen` label in your Nextflow process:

   The `label` directive allows you to annotate a process with mnemonic identifiers of your choice. Seqera will use the `dragen` label to determine which processes need to be executed on DRAGEN F1 instances.

   ```
   process DRAGEN {
       label 'dragen'

       <truncated>
   }
   ```

   See the [Nextflow label docs](https://www.nextflow.io/docs/latest/process.html?highlight=label#label) for more information.

2. Define secrets in Seqera:

   At Seqera, we use secrets to safely encrypt sensitive information when running licensed software via Nextflow. This enables our team to use the DRAGEN software safely via the `nf-dragen` pipeline without the need to configure the license key. These secrets will be provided securely to the `--lic-server` option when running DRAGEN on the CLI to validate the license.

   In the nf-dragen pipeline, we have defined two secrets called `DRAGEN_USERNAME` and `DRAGEN_PASSWORD`, which you can add to Seqera from the [Secrets](../../secrets/overview.mdx) tab.

## Limitations

DRAGEN integration with Seqera Platform is currently only available for use on AWS, however, we plan to extend the functionality to other supported platforms like Azure in the future.

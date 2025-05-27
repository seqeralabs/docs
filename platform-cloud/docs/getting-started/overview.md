---
title: "Run a pipeline"
description: "An overview of Seqera Platform deployment versions and ways to run Seqera."
date: "15 September 2023"
tags: [overview]
---

On this page, learn how to run a pipeline with sample data and get started running your own pipelines.

:::tip
[**Sign up**](https://cloud.seqera.io/login "Seqera Platform") to try Seqera for free, or request a [**demo**](https://seqera.io/demo/ "Seqera Platform Demo") for deployments in your own on-premises or cloud environment.
:::

The Community Showcase [Launchpad](../launch/launchpad) is an example workspace provided by Seqera. The showcase is pre-configured with compute environments, credentials, and pipelines to start running Nextflow workflows immediately. A pipeline consists of a pre-configured workflow repository, compute environment (with 100 free CPU hours), and launch parameters. The Community Showcase comes pre-loaded with two AWS Batch compute environments to run showcase pipelines.

### Components

- [Datasets](../data/datasets) are collections of versioned, structured data (usually in the form of a samplesheet) in CSV or TSV format. A dataset is used as the input for a pipeline run. Sample datasets are used in pipelines with the same name, e.g., the `nf-core-rnaseq-test` dataset is used as input when you run the `nf-core-rnaseq` pipeline.
- [Compute environments](../compute-envs/overview) are the platforms where workflows are executed. A compute environment consists of access credentials, configuration settings, and storage options for the environment.
- [Credentials](../credentials/overview) are the authentication keys Seqera uses to access compute environments, private code repositories, and external services. Credentials are SHA-256 encrypted before secure storage. The Community Showcase includes all the credentials you need to run pipelines in the included AWS Batch compute environments.
- [Secrets](../secrets/overview) are retrieved and used during pipeline execution. In your private or organization workspace, you can store the access keys, licenses, or passwords required for your pipeline execution to interact with third-party services. The secrets included in the Community Showcase contain license keys to run `nf-dragen` and `nf-sentieon` pipelines in the showcase compute environments.

## Run a pipeline with sample data

1. From the [Launchpad](../launch/launchpad), select a pipeline to view the pipeline detail page. `nf-core-rnaseq` is a good first pipeline example.
2. Optional: Select the URL under **Workflow repository** to view the pipeline code repository in another tab.
3. Select **Launch** from the pipeline detail page.
4. On the **Launch pipeline** page, enter a unique **Workflow run name** or use the pre-filled random name.
5. Optional: Enter labels to be assigned to the run in the **Labels** field.
6. Under **Input/output options**, select the dataset named after your chosen pipeline from the drop-down menu under **input**.
7. Under **outdir**, specify an output directory where run results will be saved. This must be an absolute path to storage on cloud infrastructure and defaults to `./results`.
8. Under **email**, enter an email address where you wish to receive the run completion summary.
9. Under **multiqc_title**, enter a title for the MultiQC report. This is used as both the report page header and filename.

The remaining launch form fields will vary depending on the pipeline you have selected. Parameters required for the pipeline to run are pre-filled by default, and empty fields are optional.

Once you've filled the necessary launch form details, select **Launch**. Your new run will be displayed at the top of the list in the **Runs** tab with a **submitted** status. Select the run name to navigate to the run detail page and view the configuration, parameters, status of individual tasks, and run report.

## Run your own pipelines

To run pipelines on your own infrastructure, you first need to create your own organization.

* [Organizations](../orgs-and-teams/organizations) are the top-level structure in Seqera. They contain the building blocks of your organizational infrastructure.
* [Workspaces](../orgs-and-teams/workspace-management) are where resources are managed. All team members can access the organization workspace. In addition to this, each user has a unique personal workspace to manage resources such as pipelines, compute environments, and credentials.
* [Teams](../orgs-and-teams/organizations) are collections of members.
* [Members](../orgs-and-teams/organizations#members) belong to an organization and can have different levels of access across workspaces.

You can create multiple workspaces within an organization context and associate each of these workspaces with dedicated teams of users, while providing fine-grained access control for each of the teams. See [Workspaces](../orgs-and-teams/workspace-management) for more information.

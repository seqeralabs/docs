---
title: "Seqera Platform overview"
description: "An overview of Seqera Platform deployment versions and ways to run Seqera."
date: "15 September 2023"
tags: [overview]
---

Seqera Platform is available in two [deployment editions](../getting-started/deployment-options) and can be accessed via web user interface (UI), [API](../api/overview), [CLI](../cli/overview), or directly in your Nextflow command using a flag.

## Community Showcase

When you first log in to Seqera Platform, you land on the [Community Showcase](https://docs.seqera.io/platform-cloud/getting-started/quickstart-demo/comm-showcase) Launchpad. This is an example workspace provided by Seqera. It's pre-configured with pipelines, compute environments, and credentials to get you running Nextflow pipelines immediately. The pre-built community AWS Batch environments include 100 free hours of compute.

The Community Showcase consists of:

### Launchpad

A pipeline consists of a pre-configured workflow repository, compute environment, and launch parameters. The [Launchpad](../launch/launchpad) contains a list of pre-built community pipelines.

### Datasets

A [dataset](../data/datasets) is a collection of versioned, structured data (usually in the form of a samplesheet) in CSV or TSV format. A dataset is used as the input for a pipeline run. Sample datasets are used in pipelines with the same name, e.g., the _nf-core-rnaseq-test_ dataset is used as input when you run the _nf-core-rnaseq_ pipeline. You can find a list of sample datasets under the **Datasets** tab.

### Compute environments

A compute environment is the platform where workflows are executed. It is composed of access credentials, configuration settings, and storage options for the environment. As of version 23.1.3, the Community Showcase comes pre-loaded with two AWS Batch compute environments to run the showcase pipelines. These environments come with 100 free CPU hours.

### Credentials

[Credentials](../credentials/overview) are the authentication keys Seqera uses to access compute environments, private code repositories, and external services. Credentials are SHA-256 encrypted before secure storage. The Community Showcase includes all the credentials you need to run pipelines in the included AWS Batch compute environments.

### Secrets

[Secrets](../secrets/overview) are retrieved and used during pipeline execution. In your own private or organization workspace, you can store the access keys, licenses, or passwords required for your pipeline execution to interact with third-party services. The secrets included in the Community Showcase include license keys to run _nf-dragen_ and _nf-sentieon_ pipelines in the included compute environments.

## Your infrastucture

To run pipelines on your own infrastructure, you first need to create your own [organization](../orgs-and-teams/organizations). Organizations are the top-level structure in Seqera. They contain [workspaces](../orgs-and-teams/workspace-management), members, teams, and collaborators, which are the building blocks of your organizational infrastructure. You can also create multiple workspaces within an organization context and associate each of these workspaces with dedicated teams of users, while providing fine-grained access control for each of the teams. See [Administration](../orgs-and-teams/overview).

Each user has a unique personal workspace to manage resources such as pipelines, compute environments, and credentials.

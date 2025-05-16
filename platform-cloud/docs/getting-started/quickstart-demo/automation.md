---
title: "Automation"
description: "An introduction to automation with APIs and CLI tools in Seqera Platform"
date: "21 Jul 2024"
tags: [platform, automation, api, cli, seqerakit]
---

Seqera Platform provides multiple methods of programmatic interaction to automate the execution of pipelines, chain pipelines together, and integrate Platform with third-party services.

### Platform API

The Seqera Platform public API is the lowest-level method of programmatic interaction. All operations available in the user interface can be achieved through the API. 

The API can be used to trigger the launch of pipelines based on a file event (such as the upload of a file to a bucket) or completion of a previous run.

The API can be accessed from `https://api.cloud.seqera.io`.

The full list of endpoints is available in Seqera's [OpenAPI schema](https://cloud.seqera.io/openapi/index.html). The API requires an authentication token to be specified in every API request. This can be created in your user menu under **Your tokens**.

![Platform access token](./assets/generate-access-token.gif)

The token is only displayed once. Store your token in a secure place. Use this token to authenticate requests to the API.
  
<details>
  <summary>**Example pipeline launch API request**</summary>
    ```
    curl -X POST "https://api.cloud.seqera.io/workflow/launch?workspaceId=38659136604200" \
        -H "Accept: application/json" \
        -H "Authorization: Bearer <your_access_token>" \
        -H "Content-Type: application/json" \
        -H "Accept-Version:1" \
        -d '{
        "launch": {
            "computeEnvId": "hjE97A8TvD9PklUb0hwEJ",
            "runName": "first-time-pipeline-api-byname",
            "pipeline": "first-time-pipeline",
            "workDir": "s3://nf-ireland",
            "revision": "master"
        }
    }'
    ```

</details>


### Platform CLI

For bioinformaticians and scientists more comfortable with the CLI, Platform uses a command line utility called `tw` to manage resources. 

The CLI provides an interface to launch pipelines, manage compute environments, retrieve run metadata, and monitor runs on Platform. It provides a Nextflow-like experience for bioinformaticians who prefer the CLI and allows you store Seqera resource configuration (pipelines, compute environments, etc.) as code. The CLI is built on top of the [Seqera Platform API](#platform-api) but is simpler to use. For example, you can refer to resources by name instead of their unique identifier.

![Seqera Platform CLI](./assets/platform-cli.png)

See [CLI](../../cli/overview) for installation and usage details.   

:::info
**Example pipeline launch CLI command**

```bash
tw launch hello --workspace community/showcase
```
:::

### seqerakit

`seqerakit` is a Python wrapper for the Platform CLI which can be leveraged to automate the creation of all Platform entities via a YAML format configuration file. It can be used to automate the creation of entities, from organizations and workspaces to pipelines and compute environments, and the execution of workflows with one YAML file.

The key features are:

- **Simple configuration**: All of the command-line options available in the Platform CLI can be defined in simple YAML format.
- **Infrastructure as Code**: Enable users to manage and provision their infrastructure specifications.
- **Automation**: End-to-end creation of entities within Platform, from adding an organization to launching pipeline(s) within that organization.

See the [seqerakit GitHub repository](https://github.com/seqeralabs/seqera-kit/) for installation and usage details.

<details>
  <summary>**Example pipeline launch seqerakit configuration and command**</summary>

  Create a YAML file called `hello.yaml`:

      ```yaml
      launch:
      - name: "hello-world"
          url: "https://github.com/nextflow-io/hello"
          workspace: "seqeralabs/showcase"
      ```

  Then run seqerakit:

    ```bash
    $ seqerakit hello.yaml
    ```

</details>

## Resources
Common use cases for the automation methods above include automatically executing a pipeline as data arrives from a sequencer, or integrating Platform into a broader user-facing application. For a step-by-step guide to set up these automation methods, see [Workflow automation for Nextflow pipelines](https://seqera.io/blog/workflow-automation/).

For examples of how to use automation methods, see [Automating pipeline execution with Nextflow and Tower](https://seqera.io/blog/automating-workflows-with-nextflow-and-tower/).
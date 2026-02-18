---
title: "Example custom Studios"
description: "Example Dockerfiles and pre-built container images for running custom applications in Studios."
date created: "2026-02-18"
tags: [environments, custom, studio, examples]
---

# Example custom Studios

Seqera provides a collection of example custom Studio environments for common bioinformatics and data science applications. Each example includes a Dockerfile and a pre-built container image you can deploy immediately or use as the basis for your own custom Studio.

Any application that serves its interface over HTTP can run in Studios. All example Dockerfiles and pre-built images are available in the [custom-studios-examples](https://github.com/seqeralabs/custom-studios-examples) GitHub repository. For instructions on building your own custom container image from scratch, see [Custom environments](/platform-enterprise/studios/custom-envs).

## Available examples

| Example | Description | Pre-built image |
|---|---|---|
| [Marimo](https://github.com/seqeralabs/custom-studios-examples/tree/master/marimo) | Reactive Python notebook | `ghcr.io/seqeralabs/custom-studios-examples/marimo` |
| [Streamlit](https://github.com/seqeralabs/custom-studios-examples/tree/master/streamlit) | Interactive web apps (MultiQC demo) | `ghcr.io/seqeralabs/custom-studios-examples/streamlit` |
| [CELLxGENE](https://github.com/seqeralabs/custom-studios-examples/tree/master/cellxgene) | Single-cell data visualization | `ghcr.io/seqeralabs/custom-studios-examples/cellxgene` |
| [Shiny](https://github.com/seqeralabs/custom-studios-examples/tree/master/shiny-simple-example) | R-based interactive web apps | `ghcr.io/seqeralabs/custom-studios-examples/shiny` |
| [TTYD](https://github.com/seqeralabs/custom-studios-examples/tree/master/ttyd) | Web-based terminal with Samtools | `ghcr.io/seqeralabs/custom-studios-examples/ttyd` |

:::note
Pre-built images may not reflect the latest version. See the [GitHub repository releases](https://github.com/seqeralabs/custom-studios-examples/releases) for current image tags.
:::

## Deploy an example Studio {#deploy}

To deploy any example, follow the [Add a Studio](./add-studio) workflow, select **Custom container template**, and enter the image URI from the table above. For environment variables and detailed setup instructions, see the `README.md` in each example's directory.

For more information about managing Studios, see [Manage Studios](./managing).

### Provide files to Studios {#provide-files}

Studios uses [Fusion](https://docs.seqera.io/fusion/) to mount cloud storage as a local filesystem inside the Studio container. When you mount a cloud bucket, its contents are available at `/workspace/data/<bucket_name>/`.

There are two approaches to make files available to your custom Studio:

#### Environment variables {#env-vars}

Some examples define environment variables that accept cloud storage paths (such as `s3://bucket/path/to/file.csv`). When you create a Studio, set the value of these variables in the **Environment variables** section of the **Compute and Data** tab. The container translates the cloud path to the corresponding local path at `/workspace/data/` automatically.

#### Data-links {#data-links}

Data-links point to specific cloud storage paths. When you create a data-link, the linked directory appears in the running Studio at `/workspace/data/<data_link_name>/`. To create a data-link:

1. Go to the **Data Explorer** tab.
2. Select **Add data repository**.
3. Select a provider.
4. In **Data repository path**, enter the path to the directory you want to use in your Studio.
5. Add a name in the **Name** field.
6. Select **Add**.

Applications that support a file browser or path input can then access data at `/workspace/data/<data_link_name>/`.

## Marimo

[Marimo](https://marimo.io/) is an open-source reactive Python notebook. Unlike traditional notebooks, Marimo automatically re-executes cells when their dependencies change, which makes it well-suited to iterative analysis where inputs change frequently. It also supports SQL natively and can publish notebooks as standalone shareable apps.

The Marimo Studio uses the [uv](https://github.com/astral-sh/uv) package manager and comes pre-installed with common data science packages including scikit-learn, pandas, and altair. Access your pipeline outputs by mounting the relevant S3 buckets when you create the Studio, located at `/workspace/data/` inside the session.

## Streamlit

[Streamlit](https://streamlit.io/) is an open-source Python framework for building interactive web applications. Hosting a Streamlit app in Studios gives it direct access to your S3 data through Fusion. This means no credentials to configure, no data to move or copy.

The example Studio ships with a [MultiQC](https://multiqc.info/) demo app that illustrates a typical bioinformatics use case: interactive quality control reports served directly from pipeline output stored in S3. The same pattern applies to any Streamlit app you want to host within your Seqera workspace.

## CELLxGENE

[CELLxGENE](https://chanzuckerberg.github.io/cellxgene/) is an interactive visualization tool for single-cell and spatial omics data. It supports exploration, analysis, and annotation of single-cell datasets in `.h5ad` format.

The CELLxGENE Studio loads a dataset directly from S3 on startup using environment variables you set when creating the Studio. A default public dataset (PBMCs 3k) is pre-configured so you can verify the Studio is working before connecting your own data.

## Shiny

[Shiny](https://shiny.posit.co/) is a popular framework for building interactive web applications from R or Python. The example Studio runs a demonstration R Shiny app that generates plots and output tables from CSV input data stored in S3.

Running Shiny in Studios means your app runs inside your own cloud infrastructure, with access to pipeline outputs through Fusion. Each user who connects to the Studio gets their own private session, making it suitable for sharing results with colleagues who need to interact with the data directly rather than view a static report.

## TTYD

[TTYD](https://tsl0922.github.io/ttyd/) is a web-based terminal emulator. The example Studio provides browser-based terminal access to a container with [Samtools](http://www.htslib.org/) pre-installed — useful when you need command-line access to a specific bioinformatics tool without the overhead of a full IDE.

This pattern is straightforward to adapt: replace the Samtools base image with any containerized tool that supports `apt-get` or `yum`, then add the TTYD and Connect client layers. It's a practical option for giving colleagues access to a tool in a controlled, reproducible environment without requiring them to configure anything locally.

## Build an example image locally {#build-locally}

To build any example image locally, clone the repository and run the Docker build command from the example directory:

```bash
git clone https://github.com/seqeralabs/custom-studios-examples.git
cd custom-studios-examples/<example-directory>
docker build --platform linux/amd64 --build-arg CONNECT_CLIENT_VERSION=0.8 -t <your-tag> .
```

Replace `<example-directory>` with the example folder name (such as `marimo` or `streamlit`) and `<your-tag>` with your preferred image tag. Push the built image to your container registry, then use the image URI when you [deploy the Studio](#deploy).

## Extend or contribute examples {#extend}

You can use these examples as a starting point for your own custom Studios. Any application that serves its graphical interface over an HTTP port can run in Studios. For detailed instructions on building custom container images, see [Custom environments](./custom-envs.md).

To contribute new examples to the repository, see the [contributing guidelines](https://github.com/seqeralabs/custom-studios-examples#contributing) in the GitHub repository.

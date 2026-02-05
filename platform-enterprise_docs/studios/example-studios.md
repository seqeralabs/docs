---
title: "Example custom Studios"
description: "Example Dockerfiles and pre-built container images for running custom applications in Studios."
tags: [environments, custom, studio, examples]
---

# Example custom Studios

Seqera provides a collection of example custom Studio environments that demonstrate how to run different interactive applications in Studios. Each example includes a Dockerfile and a pre-built container image that you can use directly or adapt for your own needs.

All example Dockerfiles and pre-built images are available in the [custom-studios-examples](https://github.com/seqeralabs/custom-studios-examples) GitHub repository. For instructions on building your own custom container image from scratch, see [Custom environments](./custom-envs.md).

## Prerequisites {#prerequisites}

- [Docker](https://www.docker.com/) installed locally (to build or test images).
- [Wave](https://docs.seqera.io/wave) configured in your Seqera Platform workspace.
- Access to a container registry (public or private Amazon ECR) for storing your images.
- An AWS Batch compute environment (without Fargate) with at least 2 CPUs and 8192 MB of RAM.

## Common features {#common-features}

All examples in the repository share the following characteristics:

- Built for **linux/amd64** platform compatibility. If you build on an ARM-based machine (such as Apple Silicon), you must specify the platform explicitly: `docker build --platform linux/amd64 ...`.
- Use multi-stage builds to include the Seqera [Connect client](./custom-envs.md#dockerfile), which mediates communication between the application and Seqera Platform.
- Include [Fusion](/fusion) support for POSIX-like access to cloud storage files.
- Support data mounting via [data-links](#data-links) in Studios.
- Compatibility with both local Docker testing and deployment in Studios.
- Follow consistent container best practices, including detailed setup and usage instructions in each example's README.

## Deploy an example Studio {#deploy}

To deploy any of the example custom Studios:

1. Select the **Studios** tab in your workspace.
2. Select **Add Studio**.
3. In the **Compute and Data** tab:
   - Select your compute environment.
   - Adjust CPU, GPU, and memory allocations as needed.
   - Mount any required data using the **Mount data** option.
4. In the **General config** tab:
   - Select **Prebuilt container image** as the container template.
   - Enter the container image URI from the example (listed in the [Available examples](#available-examples) table).
   - Set a Studio name and optional description.
   - Set any environment variables supported by the example.
5. Review the configuration in the **Summary** section.
6. Select **Add and start** to create and launch the Studio.

For more information about adding and managing Studios, see [Add a Studio](./add-studio.md) and [Manage Studios](./managing.md).

### Provide files to Studios {#provide-files}

Studios uses [Fusion](/fusion) to mount cloud storage as a local filesystem inside the Studio container. When you mount a cloud bucket, its contents are available at `/workspace/data/<bucket_name>/`.

There are two approaches to make files available to your custom Studio:

#### Environment variables {#env-vars}

Some examples define environment variables that accept cloud storage paths (such as `s3://bucket/path/to/file.csv`). When you create a Studio, set the value of these variables in the **Environment variables** section of the **Compute and Data** tab. The container translates the cloud path to the corresponding local path at `/workspace/data/` automatically.

#### Data-links {#data-links}

Data links point to specific cloud storage paths. When you create a data-link, the linked directory appears in the running Studio at `/workspace/data/<data_link_name>/`. To create a data-link:

1. Go to the **Data Explorer** tab.
2. Select **Add cloud bucket**.
3. In **Bucket path**, enter the path to the directory you want to use in your Studio.
4. Add a name in the **Name** field.
5. Select **Add**.

Applications that support a file browser or path input can then access data at `/workspace/data/<data_link_name>/`.

## Available examples {#available-examples}

| Example | Description | Pre-built image | Environment variables |
|---------|-------------|-----------------|----------------------|
| [Marimo](#marimo) | Reactive Python notebook | `ghcr.io/seqeralabs/custom-studios-examples/marimo` | None |
| [Streamlit](#streamlit) | Interactive web apps (MultiQC demo) | `ghcr.io/seqeralabs/custom-studios-examples/streamlit` | None |
| [CELLxGENE](#cellxgene) | Single-cell data visualization | `ghcr.io/seqeralabs/custom-studios-examples/cellxgene` | `DATASET_FILE`, `DATASET_TITLE` |
| [Shiny](#shiny) | R-based interactive web apps | `ghcr.io/seqeralabs/custom-studios-examples/shiny` | `DATA_PATH` |
| [TTYD](#ttyd) | Web-based terminal | `ghcr.io/seqeralabs/custom-studios-examples/ttyd` | None |
| [IGV](#igv) | Genomic data browser | See [IGV example](#igv) | None |

:::note
The pre-built images listed above may not reflect the latest version. See the [GitHub repository releases](https://github.com/seqeralabs/custom-studios-examples/releases) for current image tags.
:::

### Marimo {#marimo}

[Marimo](https://marimo.io/) is an open-source reactive Python notebook. Cells automatically re-execute when their dependencies change, which provides a more intuitive workflow than sequential execution in traditional notebooks. Marimo includes built-in SQL support, script execution, and app sharing.

- **Dockerfile**: [marimo/Dockerfile](https://github.com/seqeralabs/custom-studios-examples/tree/master/marimo)
- **Pre-built image**: `ghcr.io/seqeralabs/custom-studios-examples/marimo`

The Marimo Studio uses the [uv](https://github.com/astral-sh/uv) package manager for fast dependency resolution and installs Marimo with common data science packages (scikit-learn, pandas, altair). The `--no-token` flag disables additional authentication when accessing Marimo through Studios.

To access workflow results, create [data links](#data-links) pointing to your S3 buckets and access them in Marimo notebooks through the `/workspace/data/` path.

:::note
Marimo does not support opening the same notebook in multiple browser tabs. Work with one notebook at a time in your Studio session.
:::

### Streamlit {#streamlit}

[Streamlit](https://streamlit.io/) is an open-source Python framework for building interactive web applications. The example Studio runs a [MultiQC](https://multiqc.info/) demo within Streamlit, which provides interactive quality control reports for omics data.

- **Dockerfile**: [streamlit/Dockerfile](https://github.com/seqeralabs/custom-studios-examples/tree/master/streamlit)
- **Pre-built image**: `ghcr.io/seqeralabs/custom-studios-examples/streamlit`

Hosting Streamlit in Studios gives your app direct access to S3 storage through Fusion without additional configuration. The MultiQC Streamlit app supports three data loading methods: URL, local files, and server paths. To load data from S3 via Fusion:

1. Upload your MultiQC data to an S3 bucket.
2. Create a [data link](#data-links) pointing to that S3 path.
3. Enter the mounted path (for example, `/workspace/data/<data_link_name>/data.zip`) in the Streamlit app's **Server Path** input field.

### CELLxGENE {#cellxgene}

[CELLxGENE](https://chanzuckerberg.github.io/cellxgene/) is an interactive visualization tool for single-cell and spatial omics data. It supports exploration, analysis, and annotation of single-cell datasets.

- **Dockerfile**: [cellxgene/Dockerfile](https://github.com/seqeralabs/custom-studios-examples/tree/master/cellxgene)
- **Pre-built image**: `ghcr.io/seqeralabs/custom-studios-examples/cellxgene`

The CELLxGENE example supports the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATASET_FILE` | S3 path to an `.h5ad` dataset file | `s3://cellxgene_datasets/pbmc3k.h5ad` |
| `DATASET_TITLE` | Display title for the dataset | `PBMCs 3k test dataset` |

To use your own data, mount the S3 bucket containing your `.h5ad` file and set the `DATASET_FILE` variable to its S3 URI when you create the Studio. The container automatically converts S3 paths to the corresponding local mount path.

### Shiny {#shiny}

[Shiny](https://shiny.posit.co/) is a popular framework for building interactive web applications from R or Python. The example Studio runs a demonstration R Shiny app that generates plots and output tables from input data.

- **Dockerfile**: [shiny-simple-example/Dockerfile](https://github.com/seqeralabs/custom-studios-examples/tree/master/shiny-simple-example)
- **Pre-built image**: `ghcr.io/seqeralabs/custom-studios-examples/shiny`

The Shiny example supports the following environment variable:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATA_PATH` | S3 path to a CSV data file | `s3://shiny-inputs/data.csv` |

The example installs R and Shiny with [micromamba](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html) for faster, more reliable package management than R's internal system. Each user who connects to the Studio has their own private session.

### TTYD {#ttyd}

[TTYD](https://tsl0922.github.io/ttyd/) is a web-based terminal emulator. The example Studio provides browser-based terminal access to a container with [Samtools](http://www.htslib.org/) pre-installed, which is useful when you need command-line access to bioinformatics tools without a full IDE.

- **Dockerfile**: [ttyd/Dockerfile](https://github.com/seqeralabs/custom-studios-examples/tree/master/ttyd)
- **Pre-built image**: `ghcr.io/seqeralabs/custom-studios-examples/ttyd`

This approach can be adapted for any containerized tool. Replace the Samtools base image with any container that provides package management through `apt-get` or `yum`, then add the TTYD and Connect client layers.

### IGV {#igv}

[IGV (Integrative Genomics Viewer)](https://igv.org/) is a genomic data visualization tool. The example Studio runs a self-hosted [igv.js](https://github.com/igvteam/igv.js) web application that automatically discovers and loads genomic files from mounted cloud storage.

- **Dockerfile**: [igv/Dockerfile](https://github.com/lpantano/custom-studios-examples/tree/master/igv)

:::note
The IGV example is available in a [community fork](https://github.com/lpantano/custom-studios-examples) of the examples repository. It has not yet been merged into the main repository.
:::

The IGV Studio works as follows:

1. **Cloud storage**: Your BAM, VCF, and BED files are stored in S3 or another cloud bucket.
2. **Fusion**: Mounts cloud storage as a local filesystem at `/workspace/data/` inside the Studio.
3. **Auto-discovery scripts**: `discover-data-links.sh` scans mounted data links for genomic files, and `generate-igv-config.sh` creates an IGV session configuration.
4. **IGV web app**: A self-hosted igv.js instance loads the generated configuration on startup.
5. **User access**: You access the IGV interface through your browser via Studios' HTTP endpoint.

You can also upload files from your local computer to the IGV session directly.

To use the IGV Studio, mount the S3 buckets that contain your genomic data when you create the Studio. The auto-discovery scripts detect supported file types and configure IGV tracks automatically.

## Build an example image locally {#build-locally}

To build any example image locally, clone the repository and run the Docker build command from the example directory:

```bash
git clone https://github.com/seqeralabs/custom-studios-examples.git
cd custom-studios-examples/<example-directory>
docker build --platform linux/amd64 --build-arg CONNECT_CLIENT_VERSION=0.8 -t <your-tag> .
```

Replace `<example-directory>` with the example folder name (such as `marimo` or `streamlit`) and `<your-tag>` with your preferred image tag.

Push the built image to your container registry, then use the image URI when you [deploy the Studio](#deploy).

## Extend or contribute examples {#extend}

You can use these examples as a starting point for your own custom Studios. Any application that serves its graphical interface over an HTTP port can run in Studios. For detailed instructions on building custom container images, see [Custom environments](./custom-envs.md).

To contribute new examples to the repository, see the [contributing guidelines](https://github.com/seqeralabs/custom-studios-examples#contributing) in the GitHub repository.

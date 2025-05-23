---
title: "Installation"
description: "Seqerakit installation options"
date: "21 Oct 2024"
tags: [seqerakit, cli, automation, installation]
---


Seqerakit is a Python wrapper that sets [Platform CLI](../cli/overview) command options using YAML configuration files. Individual commands and configuration parameters can be chained together to automate the end-to-end creation of all Seqera Platform entities.

As an extension of the Platform CLI, Seqerakit enables:

- **Infrastructure as code**: Users manage and provision their infrastructure from the command line.
- **Simple configuration**: All Platform CLI command-line options can be defined in simple YAML format.
- **Automation**: End-to-end creation of Seqera entities, from adding an organization to launching pipelines.

### Installation 

Seqerakit has three dependencies:

1. [Seqera Platform CLI (`>=0.10.1`)](https://github.com/seqeralabs/tower-cli/releases)
2. [Python (`>=3.8`)](https://www.python.org/downloads/)
3. [PyYAML](https://pypi.org/project/PyYAML/)

#### Pip

If you already have [Platform CLI](../cli/installation) and Python installed on your system, install Seqerakit directly from [PyPI](https://pypi.org/project/seqerakit/):

```bash
pip install seqerakit
```

Overwrite an existing installation to use the latest version:

```bash
pip install --upgrade --force-reinstall seqerakit
```

#### Conda

To install `seqerakit` and its dependencies via Conda, first configure the correct channels:

```bash
conda config --add channels bioconda
conda config --add channels conda-forge
conda config --set channel_priority strict
```

Then create a conda environment with `seqerakit` installed:

```bash
conda env create -n seqerakit seqerakit
conda activate seqerakit
```

#### Local development installation

Install the development branch of `seqerakit` on your local machine to test the latest features and updates:

1. You must have [Python](https://www.python.org/downloads/) and [Git](https://git-scm.com/downloads) installed on your system.
1. To install directly from pip:
    ```shell-session
    pip install git+https://github.com/seqeralabs/seqera-kit.git@dev
    ```
1. Alternatively, clone the repository locally and install manually:
    ```shell-session
    git clone https://github.com/seqeralabs/seqera-kit.git
    cd seqera-kit
    git checkout dev
    pip install .
    ```
1. Verify your installation:
    ```shell-session
    pip show seqerakit
    ```

### Configuration

Create a [Seqera](https://cloud.seqera.io/tokens) access token via **Your Tokens** in the user menu.

Seqerakit reads your access token from the `TOWER_ACCESS_TOKEN` environment variable:

```shell-session
export TOWER_ACCESS_TOKEN=<Your Seqera access token>
```

For Enterprise installations, specify the custom API endpoint used to connect to Seqera. Export the API endpoint environment variable:

```shell-session
export TOWER_API_ENDPOINT=<Seqera Enterprise API URL>
```

By default, this is set to `https://api.cloud.seqera.io` to connect to Seqera Cloud.

### Usage

To confirm the installation of `seqerakit`, configuration of the Platform CLI, and connection to Seqera is working as expected, run this command: 

```shell-session
seqerakit --info
```

This runs the `tw info` command under the hood.

Use `--version` or `-v` to retrieve the current version of your `seqerakit` installation:

```shell-session
seqerakit --version
```

Use the `--help` or `-h` option to list the available commands and their associated options:

```shell-session
seqerakit --help
```

See [Commands](./commands) for detailed instructions to use Seqerakit.
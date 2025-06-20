---
title: "YAML configuration"
description: "seqerakit YAML configuration file options"
date: "21 Oct 2024"
tags: [seqerakit, cli, automation, yaml, configuration]
---

Seqerakit supports the creation and deletion of the following Seqera Platform resources, listed here with their respective Platform CLI resource names:

- Pipeline actions: `actions`
- Compute environments: `compute-envs`
- Credentials: `credentials`
- Datasets: `datasets`
- Labels (including resource labels): `labels`
- Pipeline launch: `launch`
- Organization members: `members`
- Organizations: `organizations`
- Workspace and team participants: `participants`
- Pipelines: `pipelines`
- Pipeline secrets: `secrets`
- Teams: `teams`
- Workspaces: `workspaces`

To determine the options to provide as definitions in your YAML file, run the Platform CLI help command for the resource you want to create.

1. Retrieve CLI options:

    Obtain a list of available CLI options for defining your YAML file with the Platform CLI `help` command. For example, to add a pipeline to your workspace, view the options for adding a pipeline:

    ```shell-session
    tw pipelines add -h
    ```

    ```shell-session
    Usage: tw pipelines add [OPTIONS] PIPELINE_URL

    Add a workspace pipeline.

    Parameters:
    *     PIPELINE_URL                         Nextflow pipeline URL.

    Options:
    * -n, --name=<name>                        Pipeline name.
      -w, --workspace=<workspace>              Workspace numeric identifier (TOWER_WORKSPACE_ID as default) or workspace reference as OrganizationName/WorkspaceName
      -d, --description=<description>          Pipeline description.
          --labels=<labels>[,<labels>...]      List of labels seperated by coma.
      -c, --compute-env=<computeEnv>           Compute environment name.
          --work-dir=<workDir>                 Path where the pipeline scratch data is stored.
      -p, --profile=<profile>[,<profile>...]   Comma-separated list of one or more configuration profile names you want to use for this pipeline execution.
          --params-file=<paramsFile>           Pipeline parameters in either JSON or YML format.
          --revision=<revision>                A valid repository commit Id, tag or branch name.
      ...
    ```

1. Define key-value pairs in YAML:

    Translate each CLI option into a key-value pair in the YAML file. The structure of your YAML file should reflect the hierarchy and format of the CLI options. For example:

    ```yaml
    pipelines:
      - name: 'my_first_pipeline'
        url: 'https://github.com/username/my_pipeline'
        workspace: 'my_organization/my_workspace'
        description: 'My test pipeline'
        labels: 'yeast,test_data'
        compute-env: 'my_compute_environment'
        work-dir: 's3://my_bucket'
        profile: 'test'
        params-file: '/path/to/params.yaml'
        revision: '1.0'
    ```

    In this example:

    - The keys (`name`, `url`, `workspace`, and so forth) are the keys derived from the CLI options.
    - The corresponding values are user-defined.

#### Best practices
 
- The indentation and structure of the YAML file must be correct — YAML is sensitive to formatting.
- Use quotes around strings that contain special characters or spaces.
- To list multiple values (such as multiple `labels`, `instance-types`, or `allow-buckets`), separate values with commas. This is shown with `labels` in the preceding example.
- For complex configurations, see [Templates](./templates).

### Templates

See [Templates](./templates) for YAML file templates for each of the entities that can be created in Seqera.

### YAML Configuration Options

Some options handled specially by `seqerakit` or not exposed as `tw` CLI options can be provided in your YAML configuration file.

#### Pipeline parameters using `params` and `params-file`

To specify pipeline parameters, use `params:` to specify a list of parameters or `params-file:` to point to a parameters file.

For example, to specify pipeline parameters within your YAML:

```yaml
params:
  outdir: 's3://path/to/outdir'
  fasta: 's3://path/to/reference.fasta'
```

To specify a file containing pipeline parameters:

```yaml
params-file: '/path/to/my/parameters.yaml'
```

Or provide both:

```yaml
params-file: '/path/to/my/parameters.yaml'
params:
  outdir: 's3://path/to/outdir'
  fasta: 's3://path/to/reference.fasta'
```

:::note 
If duplicate parameters are provided, the parameters provided as key-value pairs inside the `params` nested dictionary of the YAML file will take precedence **over** values in the `params-file`.
:::

#### Overwrite

For every entity defined in your YAML file, specify `overwrite: True` to overwrite any existing Seqera entities of the same name.

Seqerakit will first check to see if the name of the entity exists. If so, it will invoke a `tw <resource> delete` command before attempting to create it based on the options defined in the YAML file.

```shell-session
DEBUG:root: Overwrite is set to 'True' for organizations

DEBUG:root: Running command: tw -o json organizations list
DEBUG:root: The attempted organizations resource already exists. Overwriting.

DEBUG:root: Running command: tw organizations delete --name $SEQERA_ORGANIZATION_NAME
DEBUG:root: Running command: tw organizations add --name $SEQERA_ORGANIZATION_NAME --full-name $SEQERA_ORGANIZATION_NAME --description 'Example of an organization'
```

#### Specify JSON configuration files with `file-path`

The Platform CLI allows the export and import of entities through JSON configuration files for pipelines and compute environments. To use these files to add a pipeline or compute environment to a workspace, use the `file-path` key to specify a path to a JSON configuration file.

An example of the `file-path` option is provided in the [compute-envs.yaml](./templates/compute-envs.yaml) template:

```yaml
compute-envs:
  - name: 'my_aws_compute_environment'                              # required
    workspace: 'my_organization/my_workspace'                       # required
    credentials: 'my_aws_credentials'                               # required
    wait: 'AVAILABLE'                                               # optional
    file-path: './compute-envs/my_aws_compute_environment.json'     # required
    overwrite: True
```

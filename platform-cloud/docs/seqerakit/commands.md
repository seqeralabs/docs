---
title: "Commands"
description: "Seqerakit command options"
date: "21 Oct 2024"
tags: [seqerakit, cli, automation, commands]
---

Use the `--help` or `-h` option to list available commands and options:

```shell-session
seqerakit --help
```

### Input

Seqerakit supports input through paths to YAML configuration files or directly from standard input (`stdin`).

- Using file path:

    ```shell-session
    seqerakit file.yaml
    ```

- Using `stdin`:

    ```shell-session
    cat file.yaml | seqerakit -
    ```

See [YAML configuration options](./yaml-configuration#yaml-configuration-options) for guidance on formatting your input YAML files.

### Dryrun

Confirm that your configuration and command are correct before creating resources in your Seqera account, particularly when automating the end-to-end creation of multiple entities at once. To print the commands that would be executed with Platform CLI when using a YAML file, run your `seqerakit` command with the `--dryrun` option:

```shell-session
seqerakit file.yaml --dryrun
```

### Specify targets

When using a YAML file as an input that defines multiple resources, use the `--targets` option to specify which resources to create. This option accepts a comma-separated list of resource names. 

Supported resource names include:

- `actions`
- `compute-envs`
- `credentials`
- `datasets`
- `labels`
- `launch`
- `members`
- `organizations`
- `participants`
- `pipelines`
- `secrets`
- `teams`
- `workspaces`

For example, given a `test.yaml` file that defines the following resources:

```yaml
workspaces:
  - name: 'workspace-1'
    organization: 'seqerakit'
...
compute-envs:
  - name: 'compute-env'
    type: 'aws-batch forge'
    workspace: 'seqerakit/workspace-1'
...
pipelines:
  - name: 'hello-world'
    url: 'https://github.com/nextflow-io/hello'
    workspace: 'seqerakit/workspace-1'
    compute-env: 'compute-env'
...
```

You can target the creation of `pipelines` only by running:

```shell-session
seqerakit test.yaml --targets pipelines
```

This command will create only the pipelines defined in the YAML file and ignore `workspaces` and `compute-envs`.

To create both workspaces and pipelines, run:

```shell-session
seqerakit test.yaml --targets workspaces,pipelines
```

### Delete resources

Instead of adding or creating resources, specify the `--delete` option to recursively delete resources in your YAML file:

```shell-session
seqerakit file.yaml --delete
```

For example, if you have a `file.yaml` that defines an organization, workspace, team, credentials, and compute environment that have already been created, run `seqerakit file.yaml --delete` to recursively delete the same resources.

### Use `tw`-specific CLI options

Specify `tw`-specific CLI options with the `--cli=` option:

```shell-session
seqerakit file.yaml --cli="--arg1 --arg2"
```

See [CLI commands](../cli/commands) or run `tw -h` for the full list of options.

:::note
The `--verbose` option for `tw` CLI is currently not supported in `seqerakit` commands.
:::

#### Example: HTTP-only connections

The Platform CLI expects to connect to a Seqera instance that is secured by a TLS certificate. If your Seqera Enterprise instance does not present a certificate, you must run your `tw` commands with the `--insecure` option.

To use `tw`-specific CLI options such as `--insecure`, use the `--cli=` option, followed by the options to use enclosed in double quotes:

```shell-session
seqerakit file.yaml --cli="--insecure"
```

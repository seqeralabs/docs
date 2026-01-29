---
title: tw credentials
description: Manage workspace credentials
---

# tw credentials

To launch pipelines in a Platform workspace, you need [credentials](/platform-cloud/credentials/overview) for:

1. Compute environments
2. Pipeline repository Git providers
3. (Optional) [Tower agent](/platform-cloud/supported_software/agent/overview) — used with HPC clusters
4. (Optional) Container registries, such as docker.io

## tw credentials add

Add workspace credentials.

Command:

```bash
tw credentials add [OPTIONS]
```

Run `tw credentials add -h` to view a list of providers.

Run `tw credentials add <provider> -h` to view the required fields for your provider.

:::note
You can add multiple credentials from the same provider in the same workspace.
:::

### Compute environment credentials

Platform requires credentials to access your cloud compute environments. See the [compute environment page](/platform-cloud/compute-envs/overview) for your cloud provider for more information.

Command:

```bash
tw credentials add aws --name=my_aws_creds --access-key=<aws access key> --secret-key=<aws secret key>
```

Example output:

```bash
New AWS credentials 'my_aws_creds (1sxCxvxfx8xnxdxGxQxqxH)' added at user workspace
```

### Git credentials

Platform requires access credentials to interact with pipeline Git repositories. See [Git integration](/platform-cloud/git/overview) for more information.

Command:

```bash
tw credentials add github -n=my_GH_creds -u=<GitHub username> -p=<GitHub access token>
```

Example output:

```bash
New GITHUB credentials 'my_GH_creds (xxxxx3prfGlpxxxvR2xxxxo7ow)' added at user workspace
```

### Container registry credentials

Configure credentials for the Nextflow Wave container service to authenticate to private and public container registries. See [Container registry credentials](/platform-cloud/credentials/container_registry_credentials) for more information.

:::note
Container registry credentials are only used by the Wave container service. See [Wave containers](https://docs.seqera.io/wave) for more information.
:::

Command:

```bash
tw credentials add container-reg --name=my_registry_creds --username=<registry username> --password=<registry password> --registry=docker.io
```

Example output:

```bash
New CONTAINER-REG credentials 'my_registry_creds (2tyCywygy9yoyeyHyRyryI)' added at user workspace
```

## tw credentials update

Update workspace credentials.

Command:

```bash
tw credentials update [OPTIONS]
```

Run `tw credentials update -h` to view a list of providers.

Run `tw credentials update <provider> -h` to view the required fields for your provider.

### Example

Command:

```bash
tw credentials update aws -n aws-credentials -a AKIAIOSFODNN7EXAMPLE -w 123456789012345
```

Example output:

```bash
AWS credentials 'aws-credentials' updated at [my-organization / my-workspace] workspace
```

## tw credentials delete

Delete workspace credentials.

```bash
tw credentials delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | No | `null` |
| `-n`, `--name` | Credentials name | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

Command:

```bash
tw credentials delete --name=my_aws_creds
```

Example output:

```bash
Credentials '1sxCxvxfx8xnxdxGxQxqxH' deleted at user workspace
```


## tw credentials list

List workspace credentials.

Command:

```bash
tw credentials list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

Command:

```bash
tw credentials list


Credentials at user workspace:

    ID                     | Provider  | Name                               | Last activity
    ------------------------+-----------+------------------------------------+-------------------------------
    1x1HxFxzxNxptxlx4xO7Gx | aws       | my_aws_creds_1                     | Wed, 6 Apr 2022 08:40:49 GMT
    1sxCxvxfx8xnxdxGxQxqxH | aws       | my_aws_creds_2                     | Wed, 9 Apr 2022 08:40:49 GMT
    2x7xNsf2xkxxUIxXKxsTCx | ssh       | my_ssh_key                         | Thu, 8 Jul 2021 07:09:46 GMT
    4xxxIeUx7xex1xqx1xxesk | github    | my_github_cred                     | Wed, 22 Jun 2022 09:18:05 GMT
```

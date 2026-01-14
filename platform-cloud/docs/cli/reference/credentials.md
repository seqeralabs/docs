---
title: tw credentials
description: Manage workspace credentials
---

# `tw credentials`

To launch pipelines in a Platform workspace, you need [credentials](../../credentials/overview.md) for:

1. Compute environments
2. Pipeline repository Git providers
3. (Optional) [Tower agent](../../supported_software/agent/overview.md) — used with HPC clusters
4. (Optional) Container registries, such as docker.io

## `tw credentials add`

Add workspace credentials.

```bash
tw credentials add [OPTIONS]
```

Run `tw credentials add -h` to view a list of providers.

Run `tw credentials add <provider> -h` to view the required fields for your provider.

:::note
You can add multiple credentials from the same provider in the same workspace.
:::

### Compute environment credentials

Platform requires credentials to access your cloud compute environments. See the [compute environment page][compute-envs] for your cloud provider for more information.

```bash
tw credentials add aws --name=my_aws_creds --access-key=<aws access key> --secret-key=<aws secret key>

  New AWS credentials 'my_aws_creds (1sxCxvxfx8xnxdxGxQxqxH)' added at user workspace
```

### Git credentials

Platform requires access credentials to interact with pipeline Git repositories. See [Git integration][git-integration] for more information.

```bash
tw credentials add github -n=my_GH_creds -u=<GitHub username> -p=<GitHub access token>

  New GITHUB credentials 'my_GH_creds (xxxxx3prfGlpxxxvR2xxxxo7ow)' added at user workspace
```

### Container registry credentials

Configure credentials for the Nextflow Wave container service to authenticate to private and public container registries. See [Container registry credentials](../../credentials/container_registry_credentials.md) for more information.

:::note
Container registry credentials are only used by the Wave container service. See [Wave containers](https://docs.seqera.io/wave) for more information.
:::

### `tw credentials add aws`

Add AWS credentials.

```bash
tw credentials add aws [OPTIONS]
```

### `tw credentials add codecommit`

Add CodeCommit credentials.

```bash
tw credentials add codecommit [OPTIONS]
```

### `tw credentials add google`

Add Google credentials.

```bash
tw credentials add google [OPTIONS]
```

### `tw credentials add github`

Add Github credentials.

```bash
tw credentials add github [OPTIONS]
```

### `tw credentials add gitlab`

Add Gitlab credentials.

```bash
tw credentials add gitlab [OPTIONS]
```

### `tw credentials add gitea`

Add Gitea credentials.

```bash
tw credentials add gitea [OPTIONS]
```

### `tw credentials add bitbucket`

Add Bitbucket credentials.

```bash
tw credentials add bitbucket [OPTIONS]
```

### `tw credentials add ssh`

Add SSH credentials.

```bash
tw credentials add ssh [OPTIONS]
```

### `tw credentials add k8s`

Add Kubernetes credentials.

```bash
tw credentials add k8s [OPTIONS]
```

### `tw credentials add azure`

Add Azure credentials.

```bash
tw credentials add azure [OPTIONS]
```

### `tw credentials add agent`

Add Tower Agent credentials.

```bash
tw credentials add agent [OPTIONS]
```

### `tw credentials add container-reg`

Add Container Registry credentials.

```bash
tw credentials add container-reg [OPTIONS]
```

## `tw credentials update`

Update workspace credentials.

```bash
tw credentials update [OPTIONS]
```

### `tw credentials update aws`

Update AWS credentials.

```bash
tw credentials update aws [OPTIONS]
```

### `tw credentials update codecommit`

Update CodeCommit credentials.

```bash
tw credentials update codecommit [OPTIONS]
```

### `tw credentials update google`

Update Google credentials.

```bash
tw credentials update google [OPTIONS]
```

### `tw credentials update github`

Update Github credentials.

```bash
tw credentials update github [OPTIONS]
```

### `tw credentials update gitlab`

Update Gitlab credentials.

```bash
tw credentials update gitlab [OPTIONS]
```

### `tw credentials update bitbucket`

Update Bitbucket credentials.

```bash
tw credentials update bitbucket [OPTIONS]
```

### `tw credentials update ssh`

Update SSH credentials.

```bash
tw credentials update ssh [OPTIONS]
```

### `tw credentials update k8s`

Update Kubernetes credentials.

```bash
tw credentials update k8s [OPTIONS]
```

### `tw credentials update azure`

Update Azure credentials.

```bash
tw credentials update azure [OPTIONS]
```

### `tw credentials update container-reg`

Update Container Registry credentials.

```bash
tw credentials update container-reg [OPTIONS]
```

### `tw credentials update agent`

Update new Tower Agent credentials.

```bash
tw credentials update agent [OPTIONS]
```

## `tw credentials delete`

Delete workspace credentials.

```bash
tw credentials delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Credentials unique identifier |  |  |
| `-n`, `--name` | Credentials name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

```bash
tw credentials delete --name=my_aws_creds

  Credentials '1sxCxvxfx8xnxdxGxQxqxH' deleted at user workspace
```


## `tw credentials list`

List workspace credentials.

```bash
tw credentials list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

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

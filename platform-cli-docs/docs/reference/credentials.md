---
title: "tw credentials"
description: "Manage workspace credentials"
---

# `tw credentials`

Manage workspace credentials

To launch pipelines in a Platform workspace, you need [credentials][credentials] for:

1. Compute environments
2. Pipeline repository Git providers
3. (Optional) [Tower agent][tower-agent] — used with HPC clusters
4. (Optional) Container registries, such as docker.io

## `tw credentials add`

Add workspace credentials

```bash
tw credentials add
```

Run `tw credentials add -h` to view a list of providers.

Run `tw credentials add <provider> -h` to view the required fields for your provider.

:::note
You can add multiple credentials from the same provider in the same workspace.
:::

### Compute environment credentials

Platform requires credentials to access your cloud compute environments. See the [compute environment page][compute-envs] for your cloud provider for more information.

Command:

```bash
tw credentials add aws --name=my_aws_creds --access-key=<aws access key> --secret-key=<aws secret key>
```

Example output:

```bash
New AWS credentials 'my_aws_creds (1sxCxvxfx8xnxdxGxQxqxH)' added at user workspace
```

### Git credentials

Platform requires access credentials to interact with pipeline Git repositories. See [Git integration][git-integration] for more information.

Command:

```bash
tw credentials add github -n=my_GH_creds -u=<GitHub username> -p=<GitHub access token>
```

Example output:

```bash
New GITHUB credentials 'my_GH_creds (xxxxx3prfGlpxxxvR2xxxxo7ow)' added at user workspace
```

### Container registry credentials

Configure credentials for the Nextflow Wave container service to authenticate to private and public container registries. See the **Container registry credentials** section under [Credentials][credentials] for registry-specific instructions.

:::note
Container registry credentials are only used by the Wave container service. See [Wave containers][wave-docs] for more information.
:::

### `tw credentials add aws`

Add AWS credentials

```bash
tw credentials add aws [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `-a`, `--access-key` | AWS access key identifier. Part of AWS IAM credentials used for programmatic access to AWS services. | No |  |
| `-s`, `--secret-key` | AWS secret access key. Part of AWS IAM credentials used for programmatic access to AWS services. Keep this value secure. | No |  |
| `-r`, `--assume-role-arn` | IAM role ARN to assume for accessing AWS resources. Allows cross-account access or privilege elevation. Must be a fully qualified ARN (e.g., arn:aws:iam::123456789012:role/RoleName). | No |  |
| `--mode` | AWS credential mode: 'keys' (access key + secret key) or 'role' (IAM role only). Default: keys. | No |  |
| `--generate-external-id` | Generate a platform-managed External ID for the credential (used with IAM role ARN). | No | `false` |

### `tw credentials add codecommit`

Add CodeCommit credentials

```bash
tw credentials add codecommit [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `--base-url` | Repository base URL. | No |  |
| `--access-key` | AWS access key identifier for CodeCommit authentication. Part of AWS IAM user credentials with CodeCommit permissions. | Yes |  |
| `--secret-key` | AWS secret access key for CodeCommit authentication. Part of AWS IAM user credentials with CodeCommit permissions. Keep this value secure. | Yes |  |

### `tw credentials add google`

Add Google credentials

```bash
tw credentials add google [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `-k`, `--key` | Path to JSON file containing Google Cloud service account key. Download from Google Cloud Console IAM & Admin &gt; Service Accounts. | No |  |
| `--mode` | Google credential mode: 'service-account-key' (JSON key file) or 'workload-identity' (WIF with OIDC tokens). Default: service-account-key. | No |  |
| `--service-account-email` | The email address of the Google Cloud service account to impersonate (required for workload-identity mode). | No |  |
| `--workload-identity-provider` | The full resource name of the Workload Identity Pool provider. Format: projects/&#123;PROJECT&#125;/locations/global/workloadIdentityPools/&#123;POOL&#125;/providers/&#123;PROVIDER&#125; | No |  |
| `--token-audience` | Optional. The intended audience for the OIDC token. If not specified, defaults to the Workload Identity Provider resource name. | No |  |

### `tw credentials add github`

Add Github credentials

```bash
tw credentials add github [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `--base-url` | Repository base URL. | No |  |
| `-u`, `--username` | GitHub username for repository authentication. | Yes |  |
| `-p`, `--password` | GitHub password or personal access token. Use of personal access tokens is recommended for security. Generate tokens at Settings &gt; Developer settings &gt; Personal access tokens. | Yes |  |

### `tw credentials add gitlab`

Add Gitlab credentials

```bash
tw credentials add gitlab [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `--base-url` | Repository base URL. | No |  |
| `-u`, `--username` | GitLab username for repository authentication. | Yes |  |
| `-p`, `--password` | GitLab account password. Use of personal access tokens (--token) is recommended for security. | Yes |  |
| `-t`, `--token` | GitLab personal access token. Recommended authentication method. Generate tokens at User Settings &gt; Access Tokens with appropriate scopes (api, read_repository, write_repository). | Yes |  |

### `tw credentials add gitea`

Add Gitea credentials

```bash
tw credentials add gitea [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `--base-url` | Repository base URL. | No |  |
| `-u`, `--username` | Gitea username for repository authentication. | Yes |  |
| `-p`, `--password` | Gitea account password or access token. For security, consider using access tokens. Generate tokens in Gitea Settings &gt; Applications. | Yes |  |

### `tw credentials add bitbucket`

Add Bitbucket credentials

```bash
tw credentials add bitbucket [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `--base-url` | Repository base URL. | No |  |
| `-u`, `--username` | Bitbucket username for repository authentication. | Yes |  |
| `-p`, `--password` | Bitbucket app password or access token. App passwords are recommended for API access. Create app passwords in Bitbucket Settings &gt; Personal settings &gt; App passwords. | Yes |  |

### `tw credentials add ssh`

Add SSH credentials

```bash
tw credentials add ssh [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `-k`, `--key` | Path to SSH private key file for authentication. Supports RSA, DSA, ECDSA, and Ed25519 key formats. | Yes |  |
| `-p`, `--passphrase` | Passphrase for encrypted SSH private key. Leave empty if the private key is not encrypted. | No |  |

### `tw credentials add k8s`

Add Kubernetes credentials

```bash
tw credentials add k8s [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `-t`, `--token` | Kubernetes service account token for authentication. Alternative to certificate-based authentication. | Yes |  |
| `-c`, `--certificate` | Path to Kubernetes client certificate file (PEM format). Used with private key for certificate-based authentication. | No |  |
| `-k`, `--private-key` | Path to Kubernetes client private key file (PEM format). Used with certificate for certificate-based authentication. | No |  |

### `tw credentials add azure`

Add Azure credentials

```bash
tw credentials add azure [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `--batch-key` | Azure Batch account access key. Used for authentication to Azure Batch service for compute resource management. | Yes |  |
| `--batch-name` | Azure Batch account name. The name of the Azure Batch account used for workflow execution. | Yes |  |
| `--storage-key` | Azure Storage account access key. Used for authentication to Azure Blob Storage for workflow data storage. | Yes |  |
| `--storage-name` | Azure Storage account name. The name of the Azure Storage account used for workflow data and logs. | Yes |  |

### `tw credentials add azure-entra`

Add Azure Entra service principal credentials

```bash
tw credentials add azure-entra [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `--batch-name` | Azure Batch account name. The name of the Azure Batch account used for workflow execution. | Yes |  |
| `--storage-name` | Azure Storage account name. The name of the Azure Storage account used for workflow data and logs. | Yes |  |
| `--tenant-id` | Azure Entra tenant ID. The directory (tenant) ID of the Entra application. | Yes |  |
| `--client-id` | Azure Entra client ID. The application (client) ID of the Entra service principal. | Yes |  |
| `--client-secret` | Azure Entra client secret. The secret value of the Entra service principal. | Yes |  |

### `tw credentials add agent`

Add Tower Agent credentials

```bash
tw credentials add agent [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `--connection-id` | Seqera Platform Agent connection identifier. Unique identifier for the agent connection used to execute workflows. | Yes |  |
| `--work-dir` | Default work directory path for workflow execution on the agent. Must be accessible to the agent process. Default: $TW_AGENT_WORK. | No | `$TW_AGENT_WORK` |

### `tw credentials add container-reg`

Add Container Registry credentials

```bash
tw credentials add container-reg [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Credentials name. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--overwrite` | Overwrite the credentials if it already exists. | No | `false` |
| `-u`, `--username` | Username for container registry authentication. Used to access private container images. | Yes |  |
| `-p`, `--password` | Password or access token for container registry authentication. For enhanced security, use registry-specific access tokens where available. | Yes |  |
| `-r`, `--registry` | Container registry server hostname. Examples: docker.io (Docker Hub), quay.io (Quay), ghcr.io (GitHub Container Registry). Default: docker.io. | No | `docker.io` |

## `tw credentials update`

Update workspace credentials

```bash
tw credentials update
```

### `tw credentials update aws`

Update AWS credentials

```bash
tw credentials update aws [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-a`, `--access-key` | AWS access key identifier. Part of AWS IAM credentials used for programmatic access to AWS services. | No |  |
| `-s`, `--secret-key` | AWS secret access key. Part of AWS IAM credentials used for programmatic access to AWS services. Keep this value secure. | No |  |
| `-r`, `--assume-role-arn` | IAM role ARN to assume for accessing AWS resources. Allows cross-account access or privilege elevation. Must be a fully qualified ARN (e.g., arn:aws:iam::123456789012:role/RoleName). | No |  |
| `--mode` | AWS credential mode: 'keys' (access key + secret key) or 'role' (IAM role only). Default: keys. | No |  |
| `--generate-external-id` | Generate a platform-managed External ID for the credential (used with IAM role ARN). | No | `false` |

### `tw credentials update codecommit`

Update CodeCommit credentials

```bash
tw credentials update codecommit [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--base-url` | Repository base URL. | No |  |
| `--access-key` | AWS access key identifier for CodeCommit authentication. Part of AWS IAM user credentials with CodeCommit permissions. | Yes |  |
| `--secret-key` | AWS secret access key for CodeCommit authentication. Part of AWS IAM user credentials with CodeCommit permissions. Keep this value secure. | Yes |  |

### `tw credentials update google`

Update Google credentials

```bash
tw credentials update google [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-k`, `--key` | Path to JSON file containing Google Cloud service account key. Download from Google Cloud Console IAM & Admin &gt; Service Accounts. | No |  |
| `--mode` | Google credential mode: 'service-account-key' (JSON key file) or 'workload-identity' (WIF with OIDC tokens). Default: service-account-key. | No |  |
| `--service-account-email` | The email address of the Google Cloud service account to impersonate (required for workload-identity mode). | No |  |
| `--workload-identity-provider` | The full resource name of the Workload Identity Pool provider. Format: projects/&#123;PROJECT&#125;/locations/global/workloadIdentityPools/&#123;POOL&#125;/providers/&#123;PROVIDER&#125; | No |  |
| `--token-audience` | Optional. The intended audience for the OIDC token. If not specified, defaults to the Workload Identity Provider resource name. | No |  |

### `tw credentials update github`

Update Github credentials

```bash
tw credentials update github [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--base-url` | Repository base URL. | No |  |
| `-u`, `--username` | GitHub username for repository authentication. | Yes |  |
| `-p`, `--password` | GitHub password or personal access token. Use of personal access tokens is recommended for security. Generate tokens at Settings &gt; Developer settings &gt; Personal access tokens. | Yes |  |

### `tw credentials update gitlab`

Update Gitlab credentials

```bash
tw credentials update gitlab [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--base-url` | Repository base URL. | No |  |
| `-u`, `--username` | GitLab username for repository authentication. | Yes |  |
| `-p`, `--password` | GitLab account password. Use of personal access tokens (--token) is recommended for security. | Yes |  |
| `-t`, `--token` | GitLab personal access token. Recommended authentication method. Generate tokens at User Settings &gt; Access Tokens with appropriate scopes (api, read_repository, write_repository). | Yes |  |

### `tw credentials update bitbucket`

Update Bitbucket credentials

```bash
tw credentials update bitbucket [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--base-url` | Repository base URL. | No |  |
| `-u`, `--username` | Bitbucket username for repository authentication. | Yes |  |
| `-p`, `--password` | Bitbucket app password or access token. App passwords are recommended for API access. Create app passwords in Bitbucket Settings &gt; Personal settings &gt; App passwords. | Yes |  |

### `tw credentials update ssh`

Update SSH credentials

```bash
tw credentials update ssh [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-k`, `--key` | Path to SSH private key file for authentication. Supports RSA, DSA, ECDSA, and Ed25519 key formats. | Yes |  |
| `-p`, `--passphrase` | Passphrase for encrypted SSH private key. Leave empty if the private key is not encrypted. | No |  |

### `tw credentials update k8s`

Update Kubernetes credentials

```bash
tw credentials update k8s [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-t`, `--token` | Kubernetes service account token for authentication. Alternative to certificate-based authentication. | Yes |  |
| `-c`, `--certificate` | Path to Kubernetes client certificate file (PEM format). Used with private key for certificate-based authentication. | No |  |
| `-k`, `--private-key` | Path to Kubernetes client private key file (PEM format). Used with certificate for certificate-based authentication. | No |  |

### `tw credentials update azure`

Update Azure credentials

```bash
tw credentials update azure [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--batch-key` | Azure Batch account access key. Used for authentication to Azure Batch service for compute resource management. | Yes |  |
| `--batch-name` | Azure Batch account name. The name of the Azure Batch account used for workflow execution. | Yes |  |
| `--storage-key` | Azure Storage account access key. Used for authentication to Azure Blob Storage for workflow data storage. | Yes |  |
| `--storage-name` | Azure Storage account name. The name of the Azure Storage account used for workflow data and logs. | Yes |  |

### `tw credentials update azure-entra`

Update Azure Entra service principal credentials

```bash
tw credentials update azure-entra [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--batch-name` | Azure Batch account name. The name of the Azure Batch account used for workflow execution. | Yes |  |
| `--storage-name` | Azure Storage account name. The name of the Azure Storage account used for workflow data and logs. | Yes |  |
| `--tenant-id` | Azure Entra tenant ID. The directory (tenant) ID of the Entra application. | Yes |  |
| `--client-id` | Azure Entra client ID. The application (client) ID of the Entra service principal. | Yes |  |
| `--client-secret` | Azure Entra client secret. The secret value of the Entra service principal. | Yes |  |

### `tw credentials update container-reg`

Update Container Registry credentials

```bash
tw credentials update container-reg [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-u`, `--username` | Username for container registry authentication. Used to access private container images. | Yes |  |
| `-p`, `--password` | Password or access token for container registry authentication. For enhanced security, use registry-specific access tokens where available. | Yes |  |
| `-r`, `--registry` | Container registry server hostname. Examples: docker.io (Docker Hub), quay.io (Quay), ghcr.io (GitHub Container Registry). Default: docker.io. | No | `docker.io` |

### `tw credentials update agent`

Update new Tower Agent credentials

```bash
tw credentials update agent [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--connection-id` | Seqera Platform Agent connection identifier. Unique identifier for the agent connection used to execute workflows. | Yes |  |
| `--work-dir` | Default work directory path for workflow execution on the agent. Must be accessible to the agent process. Default: $TW_AGENT_WORK. | No | `$TW_AGENT_WORK` |

## `tw credentials delete`

Delete workspace credentials

```bash
tw credentials delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

Command:

Command:

```bash
tw credentials delete --name=my_aws_creds
```

Example output:

```bash
Credentials '1sxCxvxfx8xnxdxGxQxqxH' deleted at user workspace
```

## `tw credentials list`

List workspace credentials

```bash
tw credentials list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |

Command:

Command:

```bash
tw credentials list
```

Example output:

```bash
Credentials at user workspace:

    ID                     | Provider  | Name                               | Last activity
    ------------------------+-----------+------------------------------------+-------------------------------
    1x1HxFxzxNxptxlx4xO7Gx | aws       | my_aws_creds_1                     | Wed, 6 Apr 2022 08:40:49 GMT
    1sxCxvxfx8xnxdxGxQxqxH | aws       | my_aws_creds_2                     | Wed, 9 Apr 2022 08:40:49 GMT
    2x7xNsf2xkxxUIxXKxsTCx | ssh       | my_ssh_key                         | Thu, 8 Jul 2021 07:09:46 GMT
    4xxxIeUx7xex1xqx1xxesk | github    | my_github_cred                     | Wed, 22 Jun 2022 09:18:05 GMT
```

## `tw credentials validate`

Validate workspace credentials against their cloud provider

```bash
tw credentials validate [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Credentials unique identifier | Yes |  |
| `-n`, `--name` | Credentials name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--force` | Skip the provider probe and force an INVALID credential to AVAILABLE. Rejected if the credential is not INVALID. | No |  |

[actions]: /platform-cloud/pipeline-actions/overview
[compute-envs]: /platform-cloud/compute-envs/overview
[credentials]: /platform-cloud/credentials/overview
[data-explorer]: /platform-cloud/data/data-explorer
[datasets]: /platform-cloud/data/datasets
[git-integration]: /platform-cloud/git/overview
[labels]: /platform-cloud/labels/overview
[nextflow-config]: https://docs.seqera.io/nextflow/config#config-syntax
[organizations]: /platform-cloud/orgs-and-teams/organizations
[participant-roles]: /platform-cloud/orgs-and-teams/roles
[resource-labels]: /platform-cloud/resource-labels/overview
[run-details]: /platform-cloud/monitoring/run-details
[secrets]: /platform-cloud/secrets/overview
[shared-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[studio-checkpoints]: /platform-cloud/studios/managing#studio-session-checkpoints
[studios]: /platform-cloud/studios/overview
[tower-agent]: /platform-cloud/supported_software/agent/overview
[user-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave

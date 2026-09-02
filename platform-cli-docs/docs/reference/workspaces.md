---
title: "tw workspaces"
description: "Manage workspaces"
---

# `tw workspaces`

Manage workspaces

Run `tw workspaces -h` to view supported workspace operations.

Workspaces provide the context in which a user launches workflow executions, defines the available resources, and manages who can access those resources. Workspaces contain pipelines, runs, actions, datasets, compute environments, credentials, and secrets. Access permissions are controlled with participants, collaborators, and teams.

See [User workspaces][user-workspaces] for more information.

## `tw workspaces list`

List workspaces

```bash
tw workspaces list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--org`, `--organization` | Workspace organization name | No |  |

List all the workspaces in which you are a participant:

Command:

```bash
tw workspaces list
```

Example output:

```bash
Workspaces for default user:

    Workspace ID    | Workspace Name   | Organization Name | Organization ID
    -----------------+------------------+-------------------+-----------------
    26002603030407  | shared-workspace | my-tower-org      | 04303000612070
```

## `tw workspaces delete`

Delete a workspace

```bash
tw workspaces delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Workspace identifier | Yes |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format | Yes |  |

## `tw workspaces add`

Add a workspace

```bash
tw workspaces add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-o`, `--org`, `--organization` | Workspace organization name | Yes |  |
| `-n`, `--name` | Unique workspace name within the organization. Must be 2-40 characters, start and end with alphanumeric characters, and can contain hyphens or underscores between characters. | Yes |  |
| `-f`, `--full-name` | Full display name for the workspace. Maximum 100 characters. | Yes |  |
| `-d`, `--description` | Optional description of the workspace. Maximum 1000 characters. | No |  |
| `-v`, `--visibility` | Workspace visibility setting. Accepts `PRIVATE` (only participants can access) or `SHARED` (all organization members can view). | No |  |
| `--overwrite` | Overwrite the workspace if it already exists | No | `false` |

:::note
Workspace management operations require organization `OWNER` permissions.
:::

Run `tw workspaces add -h` to view the required and optional fields for adding your workspace.

In the example below, we create a shared workspace to be used for sharing pipelines with other private workspaces. See [Shared workspaces][shared-workspaces] for more information.

Command:

```bash
tw workspaces add --name=shared-workspace --full-name=shared-workspace-for-all  --org=my-tower-org --visibility=SHARED
```

Example output:

```bash
A 'SHARED' workspace 'shared-workspace' added for 'my-tower-org' organization
```

:::note
By default, a workspace is set to private when created.
:::

## `tw workspaces update`

Update a workspace

```bash
tw workspaces update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Workspace identifier | Yes |  |
| `--new-name` | Updated workspace name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. Must be 2-40 characters. | No |  |
| `-f`, `--fullName` | Updated full display name for the workspace. Maximum 100 characters. | No |  |
| `-d`, `--description` | Updated workspace description. Maximum 1000 characters. | No |  |

## `tw workspaces view`

View workspace details

```bash
tw workspaces view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Workspace identifier | Yes |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format | Yes |  |

## `tw workspaces leave`

Leave a workspace

```bash
tw workspaces leave [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Workspace identifier | Yes |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format | Yes |  |

## `tw workspaces settings`

Manage workspace settings.

```bash
tw workspaces settings
```

### `tw workspaces settings studios`

Manage Studios settings for a workspace.

```bash
tw workspaces settings studios
```

#### `tw workspaces settings studios view`

View the Studios settings of a workspace.

```bash
tw workspaces settings studios view [OPTIONS]
```

##### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Workspace identifier | Yes |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format | Yes |  |

#### `tw workspaces settings studios update`

Update the Studios settings of a workspace. Only the provided options are changed; the rest are left untouched.

```bash
tw workspaces settings studios update [OPTIONS]
```

##### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Workspace identifier | Yes |  |
| `-n`, `--name` | Workspace namespace in OrganizationName/WorkspaceName format | Yes |  |
| `--container-repository` | Default container repository used to store Studios container images built or augmented with Wave. | No |  |
| `--reset-container-repository` | Clear the default container repository. | No |  |
| `--name-strategy` | Wave strategy used to name Studios container images. Valid values: none, tagPrefix, imageSuffix. | No |  |
| `--reset-name-strategy` | Clear the container image naming strategy. | No |  |
| `--lifespan-hours` | Maximum lifespan, in hours, of a Studio session before it is automatically stopped. Set to 0 for unlimited lifespan. | No |  |
| `--private-by-default` | Whether new Studios are private by default (use --no-private-by-default to disable). | No |  |

[actions]: /platform-cloud/pipeline-actions/overview
[aws-batch-pipeline-secrets]: /platform-cloud/compute-envs/aws-batch#pipeline-secrets-optional
[aws-cloud-advanced-options]: /platform-cloud/compute-envs/aws-cloud#advanced-options
[compute-envs]: /platform-cloud/compute-envs/overview
[credentials]: /platform-cloud/credentials/overview
[data-explorer]: /platform-cloud/data/data-explorer
[datasets]: /platform-cloud/data/datasets
[git-integration]: /platform-cloud/git/overview
[google-cloud-advanced-options]: /platform-cloud/compute-envs/google-cloud#advanced-options
[labels]: /platform-cloud/labels/overview
[nextflow-config]: https://docs.seqera.io/nextflow/config#config-syntax
[nextflow-version]: /platform-cloud/launch/advanced#nextflow-version
[organizations]: /platform-cloud/orgs-and-teams/organizations
[output-directory]: /platform-cloud/launch/launchpad#output-directory
[participant-roles]: /platform-cloud/orgs-and-teams/roles
[resource-labels]: /platform-cloud/resource-labels/overview
[run-details]: /platform-cloud/monitoring/run-details
[secrets]: /platform-cloud/secrets/overview
[shared-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[studio-checkpoints]: /platform-cloud/studios/managing#studio-session-checkpoints
[studios]: /platform-cloud/studios/overview
[syntax-parser-v2]: /platform-cloud/launch/advanced#enable-nextflow-syntax-parser-v2
[tower-agent]: /platform-cloud/supported_software/agent/overview
[user-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave

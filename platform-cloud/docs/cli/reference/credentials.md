---
title: tw credentials
description: Manage workspace credentials
---

# `tw credentials`

Manage workspace credentials

## `tw credentials add`

Add workspace credentials

### Synopsis

```bash
tw credentials add [OPTIONS]
```

### `tw credentials add aws`

Add AWS credentials

### Synopsis

```bash
tw credentials add aws [OPTIONS]
```

### `tw credentials add codecommit`

Add CodeCommit credentials

### Synopsis

```bash
tw credentials add codecommit [OPTIONS]
```

### `tw credentials add google`

Add Google credentials

### Synopsis

```bash
tw credentials add google [OPTIONS]
```

### `tw credentials add github`

Add Github credentials

### Synopsis

```bash
tw credentials add github [OPTIONS]
```

### `tw credentials add gitlab`

Add Gitlab credentials

### Synopsis

```bash
tw credentials add gitlab [OPTIONS]
```

### `tw credentials add gitea`

Add Gitea credentials

### Synopsis

```bash
tw credentials add gitea [OPTIONS]
```

### `tw credentials add bitbucket`

Add Bitbucket credentials

### Synopsis

```bash
tw credentials add bitbucket [OPTIONS]
```

### `tw credentials add ssh`

Add SSH credentials

### Synopsis

```bash
tw credentials add ssh [OPTIONS]
```

### `tw credentials add k8s`

Add Kubernetes credentials

### Synopsis

```bash
tw credentials add k8s [OPTIONS]
```

### `tw credentials add azure`

Add Azure credentials

### Synopsis

```bash
tw credentials add azure [OPTIONS]
```

### `tw credentials add agent`

Add Tower Agent credentials

### Synopsis

```bash
tw credentials add agent [OPTIONS]
```

### `tw credentials add container-reg`

Add Container Registry credentials

### Synopsis

```bash
tw credentials add container-reg [OPTIONS]
```

## `tw credentials update`

Update workspace credentials

### Synopsis

```bash
tw credentials update [OPTIONS]
```

### `tw credentials update aws`

Update AWS credentials

### Synopsis

```bash
tw credentials update aws [OPTIONS]
```

### `tw credentials update codecommit`

Update CodeCommit credentials

### Synopsis

```bash
tw credentials update codecommit [OPTIONS]
```

### `tw credentials update google`

Update Google credentials

### Synopsis

```bash
tw credentials update google [OPTIONS]
```

### `tw credentials update github`

Update Github credentials

### Synopsis

```bash
tw credentials update github [OPTIONS]
```

### `tw credentials update gitlab`

Update Gitlab credentials

### Synopsis

```bash
tw credentials update gitlab [OPTIONS]
```

### `tw credentials update bitbucket`

Update Bitbucket credentials

### Synopsis

```bash
tw credentials update bitbucket [OPTIONS]
```

### `tw credentials update ssh`

Update SSH credentials

### Synopsis

```bash
tw credentials update ssh [OPTIONS]
```

### `tw credentials update k8s`

Update Kubernetes credentials

### Synopsis

```bash
tw credentials update k8s [OPTIONS]
```

### `tw credentials update azure`

Update Azure credentials

### Synopsis

```bash
tw credentials update azure [OPTIONS]
```

### `tw credentials update container-reg`

Update Container Registry credentials

### Synopsis

```bash
tw credentials update container-reg [OPTIONS]
```

### `tw credentials update agent`

Update new Tower Agent credentials

### Synopsis

```bash
tw credentials update agent [OPTIONS]
```

## `tw credentials delete`

Delete workspace credentials

### Synopsis

```bash
tw credentials delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Credentials unique identifier |  |  |
| `-n`, `--name` | Credentials name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

## `tw credentials list`

List workspace credentials

### Synopsis

```bash
tw credentials list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

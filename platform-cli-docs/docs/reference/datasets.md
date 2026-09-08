---
title: "tw datasets"
description: "Manage datasets"
---

# `tw datasets`

Manage datasets

Run `tw datasets -h` to view the list of supported operations.

[Datasets][datasets] are CSV (comma-separated values) and TSV (tab-separated values) files stored in a workspace, used as inputs during pipeline execution. The most commonly used datasets for Nextflow pipelines are samplesheets, where each row consists of a sample, the location of files for that sample (such as FASTQ files), and other sample details.

## `tw datasets add`

Add a dataset

```bash
tw datasets add [OPTIONS] <FILENAME>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `FILENAME` | Data file to upload | Yes |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-n`, `--name` | Dataset name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. | Yes |  |
| `-d`, `--description` | Optional dataset description. | No |  |
| `--header` | Treat first row as header. Default: false. | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |
| `--overwrite` | Overwrite the dataset if it already exists | No | `false` |

Run `tw datasets add -h` to view the required and optional fields for adding a dataset.

Add a preconfigured dataset file to a workspace (include the `--header` flag if the first row of your samplesheet file is a header):

```bash
tw datasets add --name=samplesheet1 --header samplesheet_test.csv

Dataset 'samplesheet1' added at user workspace with id '60gGrD4I2Gk0TUpEGOj5Td'
```

:::note
The maximum supported dataset file size is 10 MB.
:::

## `tw datasets delete`

Delete a dataset

```bash
tw datasets delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Dataset unique identifier | Yes |  |
| `-n`, `--name` | Dataset name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

To delete a workspace dataset, specify either the dataset name (`-n` flag) or ID (`-i` flag):

```bash
tw datasets delete -i 6tYMjGqCUJy6dEXNK9y8kh

Dataset '6tYMjGqCUJy6dEXNK9y8kh' deleted at 97652229034604 workspace
```

## `tw datasets download`

Download a dataset

```bash
tw datasets download [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Dataset unique identifier | Yes |  |
| `-n`, `--name` | Dataset name | Yes |  |
| `--dataset-version` | Dataset version to download | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

View a stored dataset's contents:

```bash
tw datasets download -n samplesheet1

sample,fastq_1,fastq_2,strandedness
WT_REP1,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357070_1.fastq.gz,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357070_2.fastq.gz,auto
WT_REP1,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357071_1.fastq.gz,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357071_2.fastq.gz,auto
WT_REP2,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357072_1.fastq.gz,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357072_2.fastq.gz,reverse
RAP1_UNINDUCED_REP1,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357073_1.fastq.gz,,reverse
RAP1_UNINDUCED_REP2,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357074_1.fastq.gz,,reverse
RAP1_UNINDUCED_REP2,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357075_1.fastq.gz,,reverse
RAP1_IAA_30M_REP1,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357076_1.fastq.gz,https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357076_2.fastq.gz,reverse
```

## `tw datasets hide`

Hide one or more datasets

```bash
tw datasets hide [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Dataset unique identifier(s). May be combined with --name. | Yes |  |
| `-n`, `--name` | Dataset name(s). May be combined with --id. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

## `tw datasets labels`

Manage dataset labels

```bash
tw datasets labels [OPTIONS] [labels]
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `&lt;labels&gt;` | Comma-separated list of labels. | No |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Dataset unique identifier | Yes |  |
| `-n`, `--name` | Dataset name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--no-create` | Assign labels without creating the ones which were not found. | No |  |
| `--operations`, `-o` | Type of operation (set, append, delete) [default: set]. | No | `set` |

## `tw datasets list`

List datasets

```bash
tw datasets list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |
| `-f`, `--filter` | Optional filter criteria, allowing free text search on name or ID and keywords: `username`, `label`, `visibility`, `createdAfter`, `createdBefore`, `usedAfter`, `usedBefore`. Example keyword usage: -f label:custom-label. | No |  |
| `--show-hidden` | Include datasets marked as hidden in the results. | No | `false` |
| `-l`, `--labels` | Show labels. | No | `false` |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |

Run `tw datasets list -h` to view the optional fields for listing and filtering datasets.

Command:

```bash
tw datasets list -f data

Datasets at 97652229034604 workspace:
```

Example output:

```bash
ID                     | Name     | Created
  ------------------------+----------+-------------------------------
    6vBGj6aWWpBuLpGKjJDpZy | dataset2 | Tue, 27 Aug 2024 14:49:32 GMT
```

## `tw datasets show`

Make one or more hidden datasets visible

```bash
tw datasets show [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Dataset unique identifier(s). May be combined with --name. | Yes |  |
| `-n`, `--name` | Dataset name(s). May be combined with --id. | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

## `tw datasets view`

View dataset details

```bash
tw datasets view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Dataset unique identifier | Yes |  |
| `-n`, `--name` | Dataset name | Yes |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

Run `tw datasets view -h` to view the required and optional fields for viewing a stored dataset's details.

Command:

```bash
tw datasets view -n samplesheet1

Dataset at 97652229034604 workspace:
```

Example output:

```bash
-------------+-------------------------------
    ID          | 60gGrD4I2Gk0TUpEGOj5Td
    Name        | samplesheet1
    Description |
    Media Type  | text/csv
    Created     | Mon, 19 Aug 2024 07:59:16 GMT
    Updated     | Mon, 19 Aug 2024 07:59:17 GMT
```

### `tw datasets view versions`

Display dataset versions.

```bash
tw datasets view versions
```

## `tw datasets update`

Update a dataset

```bash
tw datasets update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Dataset unique identifier | Yes |  |
| `-n`, `--name` | Dataset name | Yes |  |
| `--new-name` | Updated dataset name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. | No |  |
| `-d`, `--description` | Updated dataset description. | No |  |
| `--header` | Treat first row as header | No |  |
| `-f`, `--file` | Data file to upload | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

Run `tw datasets update -h` to view the required and optional fields for updating a dataset.

```bash
tw datasets update -n dataset1 --new-name=dataset2 -f samplesheet_test.csv

Dataset 'dataset1' updated at 97652229034604 workspace with id '6vBGj6aWWpBuLpGKjJDpZy'
```

## `tw datasets url`

Get dataset URL

```bash
tw datasets url [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-i`, `--id` | Dataset unique identifier | Yes |  |
| `-n`, `--name` | Dataset name | Yes |  |
| `--dataset-version` | Dataset version for URL | No |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | Yes |  |

Run `tw datasets url -h` to view the required and optional fields for obtaining a dataset URL.

```console
$ tw datasets url -n dataset2

Dataset URL

-----------

https://api.cloud.seqera.io/workspaces/97652229034xxx/datasets/6vBGj6aWWpBuLpGKjJDxxx/v/2/n/samplesheet_test.csv
```

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

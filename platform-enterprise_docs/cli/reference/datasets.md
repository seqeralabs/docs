---
title: tw datasets
description: Manage datasets
---

# `tw datasets`

Run `tw datasets -h` to view the list of supported operations.

[Datasets](../../data/datasets) are CSV (comma-separated values) and TSV (tab-separated values) files stored in a workspace, used as inputs during pipeline execution. The most commonly used datasets for Nextflow pipelines are samplesheets, where each row consists of a sample, the location of files for that sample (such as FASTQ files), and other sample details.

## `tw datasets add`

Add a dataset.

```bash
tw datasets add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Dataset name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. | ✓ |  |
| `-d`, `--description` | Optional dataset description. |  |  |
| `--header` | Treat first row as header |  |  |
| `--overwrite` | Overwrite the dataset if it already exists |  | `false` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

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

Delete a dataset.

```bash
tw datasets delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

To delete a workspace dataset, specify either the dataset name (`-n` flag) or ID (`-i` flag):

```bash
tw datasets delete -i 6tYMjGqCUJy6dEXNK9y8kh

Dataset '6tYMjGqCUJy6dEXNK9y8kh' deleted at 97652229034604 workspace
```

## `tw datasets download`

Download a dataset.

```bash
tw datasets download [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--dataset-version` | Dataset version to download |  |  |
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

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

## `tw datasets list`

List datasets.

```bash
tw datasets list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-f`, `--filter` | Filter datasets by name substring |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

Run `tw datasets list -h` to view the optional fields for listing and filtering datasets.

```bash
tw datasets list -f data

Datasets at 97652229034604 workspace:

    ID                     | Name     | Created
  ------------------------+----------+-------------------------------
    6vBGj6aWWpBuLpGKjJDpZy | dataset2 | Tue, 27 Aug 2024 14:49:32 GMT
```

## `tw datasets view`

View dataset details.

```bash
tw datasets view [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

Run `tw datasets view -h` to view the required and optional fields for viewing a stored dataset's details.

```bash
tw datasets view -n samplesheet1

Dataset at 97652229034604 workspace:

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
tw datasets view versions [OPTIONS]
```

## `tw datasets update`

Update a dataset.

```bash
tw datasets update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--new-name` | Updated dataset name. Must be unique per workspace. Names consist of alphanumeric, hyphen, and underscore characters. |  |  |
| `-d`, `--description` | Updated dataset description. |  |  |
| `--header` | Treat first row as header |  |  |
| `-f`, `--file` | Data file to upload |  |  |
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

Run `tw datasets update -h` to view the required and optional fields for updating a dataset.

```bash
tw datasets update -n dataset1 --new-name=dataset2 -f samplesheet_test.csv

Dataset 'dataset1' updated at 97652229034604 workspace with id '6vBGj6aWWpBuLpGKjJDpZy'
```

## `tw datasets url`

Get dataset URL.

```bash
tw datasets url [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--dataset-version` | Dataset version for URL |  |  |
| `-i`, `--id` | Dataset unique identifier |  |  |
| `-n`, `--name` | Dataset name |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | ✓ | `${TOWER_WORKSPACE_ID}` |

### Example

```bash
tw datasets url -i 3m4n5o6p7q8r9s0t1u2v3w -w 123456789012345

# Output:
  Dataset URL

  -----------

  https://api.cloud.seqera.io/workspaces/123456789012345/datasets/3m4n5o6p7q8r9s0t1u2v3w/v/1/n/samplesheet.csv
```

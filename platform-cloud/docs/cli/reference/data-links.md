---
title: tw data-links
description: Manage data links
---

# `tw data-links`

Data-links allow you to work with public and private cloud storage buckets in [Data Explorer](../../data/data-explorer) in the specified workspace. AWS S3, Azure Blob Storage, and Google Cloud Storage are supported. The full list of operations are:

- `list`: List data-links in a workspace
- `add`: Add a custom data-link to a workspace
- `update`: Update a custom data-link in a workspace
- `delete`: Delete a custom data-link from a workspace
- `browse`: Browse the contents of a data-link in a workspace
- `upload`: Upload files and directories to a data-link in a workspace
- `download`: Download files and directories from a data-link in a workspace

## `tw data-links list`

List data links.

```bash
tw data-links list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--credentials` | Credentials identifier |  |  |
| `--wait` | Wait for all data links to be fetched to cache |  |  |
| `--visibility` | Filter by visibility: hidden, visible, or all |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `--page` | Page number for paginated results (default: 1) |  |  |
| `--offset` | Row offset for paginated results (default: 0) |  |  |
| `--max` | Maximum number of records to display (default: ) |  |  |

Run `tw data-links list -h` to view all the optional fields for listing data-links in a workspace.

If a workspace is not defined, the `TOWER_WORKSPACE_ID` workspace is used by default. data-links can be one of two types:

- `v1-cloud-<id>`: Cloud data-links auto-discovered using credentials attached to the workspace.
- `v1-user-<id>`: Custom data-links created by users.

```bash
tw data-links list -w seqeralabs/showcase

data-links at [seqeralabs / showcase] workspace:

ID                                        | Provider | Name                           | Resource ref                                                    | Region
-------------------------------------------+----------+--------------------------------+-----------------------------------------------------------------+-----------
v1-cloud-833bb845bd9ec1970c4a7b0bb7b8c4ad | aws      | e2e-data-explorer-tests-aws    | s3://e2e-data-explorer-tests-aws                                | eu-west-2
v1-cloud-60700a33ec3fae68d424cf948fa8d10c | aws      | nf-tower-bucket                | s3://nf-tower-bucket                                            | eu-west-1
v1-user-09705781697816b62f9454bc4b9434b4  | aws      | vscode-analysis-demo           | s3://seqera-development-permanent-bucket/studios-demo/vscode/   | eu-west-2
v1-user-0dede00fabbc4b9e2610261822a2d6ae  | aws      | seqeralabs-showcase            | s3://seqeralabs-showcase                                        | eu-west-1
v1-user-171aa8801cabe4af71500335f193d649  | aws      | projectA-rnaseq-analysis       | s3://seqeralabs-showcase/demo/nf-core-rnaseq/                   | eu-west-1

<snip>

v1-user-bb4fa9625a44721510c47ac1cb97905b  | aws      | genome-in-a-bottle             | s3://giab                                                       | us-east-1
v1-user-e7bf26921ba74032bd6ae1870df381fc  | aws      | NCBI_Sequence_Read_Archive_SRA | s3://sra-pub-src-1/                                             | us-east-1

Showing from 0 to 99 from a total of 16 entries.
```


## `tw data-links add`

Add a data link.

```bash
tw data-links add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-n`, `--name` | Data link name | ✓ |  |
| `-d`, `--description` | Data link description |  |  |
| `-u`, `--uri` | Data link URI | ✓ |  |
| `-p`, `--provider` | Cloud provider: aws, azure, or google | ✓ |  |
| `-c`, `--credentials` | Credentials identifier |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

Run `tw data-links add -h` to view all the required and optional fields for adding a custom data-link to a workspace.

Users with the workspace `MAINTAIN` role and above can add custom data-links. The data-link `name`, `uri`, and `provider` (`aws`, `azure`, or `google`) fields are required. If adding a custom data-link for a private bucket, the credentials identifier field is also required. Adding a custom data-link for a public bucket doesn't require credentials.

```bash
tw data-links add -w seqeralabs/showcase -n FOO -u az://seqeralabs.azure-benchmarking \
-p azure -c seqera_azure_credentials

data-link created:

ID                                       | Provider | Name | Resource ref                       | Region
------------------------------------------+----------+------+------------------------------------+--------
v1-user-152116183ee325463901430bb9efb8c9 | azure    | FOO  | az://seqeralabs.azure-benchmarking |
```

## `tw data-links delete`

Delete a data link.

```bash
tw data-links delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Data link identifier |  |  |
| `-n`, `--name` | Data link name |  |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) |  |  |

Run `tw data-links delete -h` to view all the required and optional fields for deleting a custom data-link from a workspace.

Users with the `MAINTAIN` role and above for a workspace can delete custom data-links.

```bash
tw data-links delete -w seqeralabs/showcase -i v1-user-152116183ee325463901430bb9efb8c9

data-link 'v1-user-152116183ee325463901430bb9efb8c9' deleted at '138659136604200' workspace.
```

## `tw data-links update`

Update a data link.

```bash
tw data-links update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-i`, `--id` | Data link identifier | ✓ |  |
| `-n`, `--name` | Data link name | ✓ |  |
| `-d`, `--description` | Data link description |  |  |
| `-c`, `--credentials` | Credentials identifier |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

Run `tw data-links update -h` to view all the required and optional fields for updating a custom data-link in a workspace. Users with the `MAINTAIN` role and above for a workspace can update custom data-links.

```bash
tw data-links update -w seqeralabs/showcase -i v1-user-152116183ee325463901430bb9efb8c9 -n BAR

data-link updated:

ID                                       | Provider | Name | Resource ref                       | Region
------------------------------------------+----------+------+------------------------------------+--------
v1-user-152116183ee325463901430bb9efb8c9 | azure    | BAR  | az://seqeralabs.azure-benchmarking |
```

## `tw data-links browse`

Browse data link contents.

```bash
tw data-links browse [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--credentials` | Credentials identifier. **Required for private cloud storage buckets** |  |  |
| `-p`, `--path` | Path to browse within the data link |  |  |
| `-f`, `--filter` | Filter results by prefix |  |  |
| `-t`, `--token` | Next page token for pagination |  |  |
| `--page` | Page number to display |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Data link identifier |  |  |
| `-n`, `--name` | Data link name |  |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) |  |  |

Run `tw data-links browse -h` to view all the required and optional fields for browsing a data-link in a workspace.

Define the data-link ID using the required `-i` or `--id` argument, which can be found by first using the list operation for a workspace. In the example below, a name is defined to only retrieve data-links with names that start with the given word:

```bash
tw data-links list -w seqeralabs/showcase -n 1000genomes

data-links at [seqeralabs / showcase] workspace:

ID                                       | Provider | Name        | Resource ref     | Region
------------------------------------------+----------+-------------+------------------+-----------
v1-user-6d8f44c239e2a098b3e02e918612452a | aws      | 1000genomes | s3://1000genomes | us-east-1

  Showing from 0 to 99 from a total of 1 entries.

tw data-links browse -w seqeralabs/showcase -i v1-user-6d8f44c239e2a098b3e02e918612452a

  Content of 's3://1000genomes' and path 'null':

Type   | Name                                       | Size
--------+--------------------------------------------+----------
FILE   | 20131219.populations.tsv                   | 1663
FILE   | 20131219.superpopulations.tsv              | 97
FILE   | CHANGELOG                                  | 257098
FILE   | README.alignment_data                      | 15977
FILE   | README.analysis_history                    | 5289
FILE   | README.complete_genomics_data              | 5967
FILE   | README.crams                               | 563
FILE   | README.ebi_aspera_info                     | 935
FILE   | README.ftp_structure                       | 8408
FILE   | README.pilot_data                          | 2082
FILE   | README.populations                         | 1938
FILE   | README.sequence_data                       | 7857
FILE   | README_missing_files_20150612              | 672
FILE   | README_phase3_alignments_sequence_20150526 | 136
FILE   | README_phase3_data_move_20150612           | 273
FILE   | alignment.index                            | 3579471
FILE   | analysis.sequence.index                    | 54743580
FILE   | exome.alignment.index                      | 3549051
FILE   | sequence.index                             | 67069489
FOLDER | 1000G_2504_high_coverage/                  | 0
FOLDER | alignment_indices/                         | 0
FOLDER | changelog_details/                         | 0
FOLDER | complete_genomics_indices/                 | 0
FOLDER | data/                                      | 0
FOLDER | hgsv_sv_discovery/                         | 0
FOLDER | phase1/                                    | 0
FOLDER | phase3/                                    | 0
FOLDER | pilot_data/                                | 0
FOLDER | release/                                   | 0
FOLDER | sequence_indices/                          | 0
FOLDER | technical/                                 | 0
```

## `tw data-links download`

Download data link contents.

```bash
tw data-links download [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--credentials` | Credentials identifier | ✓ |  |
| `-o`, `--output-dir` | Output directory for downloaded files |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Data link identifier |  |  |
| `-n`, `--name` | Data link name |  |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) |  |  |

Run `tw data-links download -h` to view all the required and optional fields for downloading files and directories from a data-link in a workspace.

### Download files

```bash
tw data-links download -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/file.txt

Downloading file: file.txt
....
 Progress: [========================================] 100% (269/269 KBs, ETA: 0.0s)

  Successfully downloaded files


     Type | File count | Path
    ------+------------+-----------------------------------
     FILE | 1          | file.txt
```

### Download directories

```bash
tw data-links download -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/my-directory/

Downloading file: my-directory/file.txt
....
 Progress: [========================================] 100% (5/5 bytes, ETA: 0.0s)

  Successfully downloaded files


     Type   | File count | Path
    --------+------------+---------------
     FOLDER | 1          | my-directory/
```

## `tw data-links upload`

Upload files to a data link.

```bash
tw data-links upload [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--credentials` | Credentials identifier. **Required for private cloud storage buckets** | ✓ |  |
| `-o`, `--output-dir` | Destination directory in the data link |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |
| `-i`, `--id` | Data link identifier |  |  |
| `-n`, `--name` | Data link name |  |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) |  |  |

Run `tw data-links upload -h` to view all the required and optional fields for uploading files and directories to a data-link in a workspace.

### Upload files

```bash
tw data-links upload -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/file.txt

Fetching data-links.
  Waiting DONE status....FETCHING.........DONE  [DONE]

Uploading file: file.txt
....
 Progress: [========================================] 100% (269/269 KBs, ETA: 0.0s)

  Successfully uploaded files


     Type | File count | Path
    ------+------------+-----------------------------------
     FILE | 1          | file.txt
```

### Upload directories

```bash
tw data-links upload -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/my-directory/

Uploading file: my-directory/file.txt
....
 Progress: [========================================] 100% (5/5 bytes, ETA: 0.0s)

  Successfully uploaded files


     Type   | File count | Path
    --------+------------+---------------
     FOLDER | 1          | my-directory/
```

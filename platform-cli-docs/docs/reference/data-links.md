---
title: "tw data-links"
description: "Manage data links"
---

# `tw data-links`

Manage data links

Run `tw data-links -h` to view supported data-link operations.

Data-links allow you to work with public and private cloud storage buckets in [Data Explorer][data-explorer] in the specified workspace. AWS S3, Azure Blob Storage, and Google Cloud Storage are supported. The full list of operations are:

- `list`: List data-links in a workspace
- `add`: Add a custom data-link to a workspace
- `update`: Update a custom data-link in a workspace
- `delete`: Delete a custom data-link from a workspace
- `browse`: Browse the contents of a data-link in a workspace
- `upload`: Upload files and directories to a data-link in a workspace
- `download`: Download files and directories from a data-link in a workspace

## `tw data-links list`

List data links

```bash
tw data-links list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--page` | Page number for paginated results (default: 1) | No |  |
| `--offset` | Row offset for paginated results (default: 0) | No |  |
| `--max` | Maximum number of records to display (default: 100) | No |  |
| `-c`, `--credentials` | Credentials identifier | No |  |
| `--wait` | Wait for all data links to be fetched to cache | No |  |
| `--visibility` | Filter by visibility: hidden, visible, or all | No |  |
| `-n`, `--name` | Show only data links with names that start with the given word. | No |  |
| `-r`, `--region` | Show only data links belonging to given region | No |  |
| `-p`, `--providers` | Show only data links belonging to given providers. [aws,azure,google] | No |  |
| `-u`, `--uri` | Show only data links with URI (resource reference) that start with the given URI. | No |  |

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

Add a data link

```bash
tw data-links add [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-n`, `--name` | Data link name | Yes |  |
| `-d`, `--description` | Data link description | No |  |
| `-u`, `--uri` | Data link URI | Yes |  |
| `-p`, `--provider` | Cloud provider: aws, azure, or google | Yes |  |
| `-c`, `--credentials` | Credentials identifier | No |  |

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

Delete a data link

```bash
tw data-links delete [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Data link identifier | Yes |  |
| `-n`, `--name` | Data link name | Yes |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) | Yes |  |

Run `tw data-links delete -h` to view all the required and optional fields for deleting a custom data-link from a workspace.

Users with the `MAINTAIN` role and above for a workspace can delete custom data-links.

:::note
`tw data-links delete` removes only the data-link record from Seqera Platform. It does not delete the files in cloud storage. To delete those files, use your cloud provider's tools.
:::

```bash
tw data-links delete -w seqeralabs/showcase -i v1-user-152116183ee325463901430bb9efb8c9

data-link 'v1-user-152116183ee325463901430bb9efb8c9' deleted at '138659136604200' workspace.
```

## `tw data-links update`

Update a data link

```bash
tw data-links update [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Data link identifier | Yes |  |
| `-n`, `--name` | Data link name | Yes |  |
| `-d`, `--description` | Data link description | No |  |
| `-c`, `--credentials` | Credentials identifier | No |  |

Run `tw data-links update -h` to view all the required and optional fields for updating a custom data-link in a workspace. Users with the `MAINTAIN` role and above for a workspace can update custom data-links.

```bash
tw data-links update -w seqeralabs/showcase -i v1-user-152116183ee325463901430bb9efb8c9 -n BAR

data-link updated:

ID                                       | Provider | Name | Resource ref                       | Region
------------------------------------------+----------+------+------------------------------------+--------
v1-user-152116183ee325463901430bb9efb8c9 | azure    | BAR  | az://seqeralabs.azure-benchmarking |
```

## `tw data-links browse`

Browse data link contents

```bash
tw data-links browse [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Data link identifier | Yes |  |
| `-n`, `--name` | Data link name | Yes |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) | Yes |  |
| `-c`, `--credentials` | Credentials identifier | No |  |
| `-p`, `--path` | Path to browse within the data link | No |  |
| `-f`, `--filter` | Filter results by prefix | No |  |
| `-t`, `--token` | Next page token for pagination | No |  |
| `--page` | Page number to display | No |  |

Run `tw data-links browse -h` to view all the required and optional fields for browsing a data-link in a workspace.

Define the data-link ID using the required `-i` or `--id` argument, which can be found by first using the list operation for a workspace. In the example below, a name is defined to only retrieve data-links with names that start with the given word:

Command:

```bash
tw data-links list -w seqeralabs/showcase -n 1000genomes

data-links at [seqeralabs / showcase] workspace:

ID                                       | Provider | Name        | Resource ref     | Region
------------------------------------------+----------+-------------+------------------+-----------
v1-user-6d8f44c239e2a098b3e02e918612452a | aws      | 1000genomes | s3://1000genomes | us-east-1
```

Example output:

```bash
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

Download data link contents

```bash
tw data-links download [OPTIONS] <paths>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `&lt;paths&gt;` | Paths to files or directories to download | Yes |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Data link identifier | Yes |  |
| `-n`, `--name` | Data link name | Yes |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) | Yes |  |
| `-c`, `--credentials` | Credentials identifier | Yes |  |
| `-o`, `--output-dir` | Output directory for downloaded files | No |  |
| `--silent` | Suppress download progress indicators. Useful for scripting or logging to files. | No |  |

Run `tw data-links download -h` to view all the required and optional fields for downloading files and directories from a data-link in a workspace.

### Download files

Command:

```bash
tw data-links download -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/file.txt
```

Example output:

```bash
Downloading file: file.txt
....
 Progress: [========================================] 100% (269/269 KBs, ETA: 0.0s)
```

Example output:

```bash
Successfully downloaded files


     Type | File count | Path
    ------+------------+-----------------------------------
     FILE | 1          | file.txt
```

### Download directories

Command:

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

Add `--silent` to suppress the per-file lines and the progress bar, for example in scripts or when logging to a file.

## `tw data-links upload`

Upload files to a data link

```bash
tw data-links upload [OPTIONS] <paths>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `&lt;paths&gt;` | Paths to files or directories to upload | Yes |

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `-i`, `--id` | Data link identifier | Yes |  |
| `-n`, `--name` | Data link name | Yes |  |
| `--uri` | Data link URI (e.g., s3://bucket-name) | Yes |  |
| `-c`, `--credentials` | Credentials identifier | Yes |  |
| `-o`, `--output-dir` | Destination directory in the data link | No |  |
| `--silent` | Suppress upload progress indicators. Useful for scripting or logging to files. | No |  |
| `--concurrency` | Number of file chunks to upload in parallel (default: 4). Each in-flight chunk buffers up to 250 MB in memory, so peak memory is roughly concurrency x 250 MB. | No | `4` |

Run `tw data-links upload -h` to view all the required and optional fields for uploading files and directories to a data-link in a workspace.

### Upload files

Command:

```bash
tw data-links upload -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/file.txt
```

Example output:

```bash
Fetching data-links.
  Waiting DONE status....FETCHING.........DONE  [DONE]

Uploading file: file.txt
....
 Progress: [========================================] 100% (269/269 KBs, ETA: 0.0s)
```

Example output:

```bash
Successfully uploaded files


     Type | File count | Path
    ------+------------+-----------------------------------
     FILE | 1          | file.txt
```

### Upload directories

Command:

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

### Upload options

Control progress output and parallelism for large uploads:

- `--silent` suppresses the per-file lines and the progress bar. Use it in scripts or when logging to a file.
- `--concurrency` sets how many file chunks upload in parallel. The default is 4. Each in-flight chunk buffers up to 250 MB, so peak memory use is roughly the concurrency value multiplied by 250 MB. Set `--concurrency=1` to upload chunks sequentially. Values below 1 are rejected.

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

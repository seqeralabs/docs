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

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

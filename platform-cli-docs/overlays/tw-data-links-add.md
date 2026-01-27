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

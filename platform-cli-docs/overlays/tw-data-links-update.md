Run `tw data-links update -h` to view all the required and optional fields for updating a custom data-link in a workspace. Users with the `MAINTAIN` role and above for a workspace can update custom data-links.

```bash
tw data-links update -w seqeralabs/showcase -i v1-user-152116183ee325463901430bb9efb8c9 -n BAR

data-link updated:

ID                                       | Provider | Name | Resource ref                       | Region
------------------------------------------+----------+------+------------------------------------+--------
v1-user-152116183ee325463901430bb9efb8c9 | azure    | BAR  | az://seqeralabs.azure-benchmarking |
```

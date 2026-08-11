Run `tw data-links delete -h` to view all the required and optional fields for deleting a custom data-link from a workspace.

Users with the `MAINTAIN` role and above for a workspace can delete custom data-links.

:::note
`tw data-links delete` removes only the data-link record from Seqera Platform. It does not delete the files in cloud storage. To delete those files, use your cloud provider's tools.
:::

```bash
tw data-links delete -w seqeralabs/showcase -i v1-user-152116183ee325463901430bb9efb8c9

data-link 'v1-user-152116183ee325463901430bb9efb8c9' deleted at '138659136604200' workspace.
```

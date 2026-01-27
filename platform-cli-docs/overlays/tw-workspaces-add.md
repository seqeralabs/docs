:::note
Workspace management operations require organization `OWNER` permissions.
:::

Run `tw workspaces add -h` to view the required and optional fields for adding your workspace.

In the example below, we create a shared workspace to be used for sharing pipelines with other private workspaces. See [Shared workspaces][shared-workspaces] for more information.

```bash
tw workspaces add --name=shared-workspace --full-name=shared-workspace-for-all  --org=my-tower-org --visibility=SHARED

  A 'SHARED' workspace 'shared-workspace' added for 'my-tower-org' organization
```

:::note
By default, a workspace is set to private when created.
:::

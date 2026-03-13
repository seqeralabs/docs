Run `tw labels add -h` to view the required and optional fields for adding a label.

:::note
[Resource labels](../resource-labels/overview) consist of a `name=value` pair and can only be applied to compute environments, pipelines, runs, and actions.
[Labels](../labels/overview) require only a name and can be applied to pipelines, runs, and actions.
:::

```bash
tw labels add -n Label1 -w DocTestOrg2/Testing -v Value1

Label 'Label1=Value1' added at 'DocTestOrg2/Testing' workspace with id '268741348267491'
```

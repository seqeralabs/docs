Run `tw datasets add -h` to view the required and optional fields for adding a dataset.

Add a preconfigured dataset file to a workspace (include the `--header` flag if the first row of your samplesheet file is a header):

```bash
tw datasets add --name=samplesheet1 --header samplesheet_test.csv

Dataset 'samplesheet1' added at user workspace with id '60gGrD4I2Gk0TUpEGOj5Td'
```

:::note
The maximum supported dataset file size is 10 MB.
:::

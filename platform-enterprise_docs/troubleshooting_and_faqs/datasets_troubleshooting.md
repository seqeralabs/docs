---
title: "Datasets"
description: "Dataset troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, database, datasets]
---

When working with datasets, you might encounter the following issues.

## Common issues

#### Dataset upload fails with the API

When you upload a dataset through the Seqera UI or CLI, Seqera performs some steps automatically. Uploading through the API requires two additional steps:

1. Explicitly define the MIME type of the file you upload.
2. Make two API calls: first create a dataset object, then upload the samplesheet to it.

Create the dataset object:

```bash
curl -X POST "https://api.cloud.seqera.io/workspaces/$WORKSPACE_ID/datasets/" -H "Content-Type: application/json" -H "Authorization: Bearer $TOWER_ACCESS_TOKEN" --data '{"name":"placeholder", "description":"A placeholder for the data we will submit in the next call"}'
```

Upload the samplesheet to the dataset object:

```bash
curl -X POST "https://api.cloud.seqera.io/workspaces/$WORKSPACE_ID/datasets/$DATASET_ID/upload"  -H "Accept: application/json"  -H "Authorization: Bearer $TOWER_ACCESS_TOKEN"  -H "Content-Type: multipart/form-data" -F "file=@samplesheet_full.csv; type=text/csv"
```

:::tip
You can also upload a dataset to a workspace with the [`tw` CLI](https://github.com/seqeralabs/tower-cli):

    ```bash
    tw datasets add --name "cli_uploaded_samplesheet" ./samplesheet_full.csv
    ```
:::

#### Datasets converted to `application/vnd.ms-excel` data type

```
"Given file is not a dataset file. Detected media type: 'application/vnd.ms-excel'. Allowed types: 'text/csv, text/tab-separated-values'"
```

This issue occurs in Firefox on Seqera versions earlier than 22.2.0.

To resolve, upgrade to 22.2.0 or later, or use Chrome.

#### TSV-formatted datasets not shown

In Seqera version 22.2, TSV datasets were unavailable in the input data drop-down on the launch form. This was fixed in version 22.4.1.

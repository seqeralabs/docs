Run `tw runs list -h` to view all the required and optional fields for listing runs in a workspace.

```bash
tw runs list

  Pipeline runs at [seqeralabs / testing] workspace:

    ID             | Status    | Project Name               | Run Name                        | Username              | Submit Date
    ----------------+-----------+----------------------------+---------------------------------+-----------------------+-------------------------------
    49Gb5XVMud2e7H | FAILED    | seqeralabs/nf-aggregate    | distraught_archimedes           | user1 | Fri, 31 May 2024 16:22:10 GMT
    4anNFvTUwRFDp  | SUCCEEDED | nextflow-io/rnaseq-nf      | nasty_kilby                     | user1   | Fri, 31 May 2024 15:23:12 GMT
    3wo3Kfni6Kl3hO | SUCCEEDED | nf-core/proteinfold        | reverent_linnaeus               | user2   | Fri, 31 May 2024 15:22:38 GMT

<snip>

    4fIRrFgZV3eDb1 | FAILED    | nextflow-io/hello          | gigantic_lichterman             | user1          | Mon, 29 Apr 2024 08:44:47 GMT
    cHEdKBXmdoQQM  | FAILED    | mathysgrapotte/stimulus    | mighty_poitras                  | user3            | Mon, 29 Apr 2024 08:08:52 GMT
```

Use the optional `--filter` flag to filter the list of runs returned by one or more `keyword:value` entries:

- `status`
- `label`
- `workflowId`
- `runName`
- `username`
- `projectName`
- `after`
- `before`
- `sessionId`
- `is:starred`

If no `keyword` is defined, the filtering is applied to the `runName`, `projectName` (the pipeline name), and `username`.

:::note
The `after` and `before` flags require an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp with UTC timezone (`YYYY-MM-DDThh:mm:ss.sssZ`).
:::

```bash
tw runs list --filter hello_slurm_20240530

  Pipeline runs at [seqeralabs / showcase] workspace:

    ID            | Status    | Project Name      | Run Name                             | Username   | Submit Date
    ---------------+-----------+-------------------+--------------------------------------+------------+-------------------------------
    pZeJBOLtIvP7R | SUCCEEDED | nextflow-io/hello | hello_slurm_20240530_e75584566f774e7 | user1 | Thu, 30 May 2024 09:12:51 GMT
```

Multiple filter criteria can be defined:

```bash
tw runs list --filter="after:2024-05-29T00:00:00.000Z before:2024-05-30T00:00:00.000Z username:user1"

  Pipeline runs at [seqeralabs / testing] workspace:

    ID             | Status    | Project Name          | Run Name           | Username    | Submit Date
    ----------------+-----------+-----------------------+--------------------+-------------+-------------------------------
    xJvK95W6YUmEz  | SUCCEEDED | nextflow-io/rnaseq-nf | ondemand2          | user1       | Wed, 29 May 2024 20:35:28 GMT
    1c1ckn9a3j0xF0 | SUCCEEDED | nextflow-io/rnaseq-nf | fargate            | user1       | Wed, 29 May 2024 20:28:02 GMT
    3sYX1acJ01T7rL | SUCCEEDED | nextflow-io/rnaseq-nf | min1vpcu-spot      | user1       | Wed, 29 May 2024 20:27:47 GMT
    4ZYJGWJCttXqXq | SUCCEEDED | nextflow-io/rnaseq-nf | min1cpu-ondemand   | user1       | Wed, 29 May 2024 20:25:21 GMT
    4LCxsffTqf3ysT | SUCCEEDED | nextflow-io/rnaseq-nf | lonely_northcutt   | user1       | Wed, 29 May 2024 20:09:51 GMT
    4Y8EcyopNiYBlJ | SUCCEEDED | nextflow-io/rnaseq-nf | fargate            | user1       | Wed, 29 May 2024 18:53:47 GMT
    dyKevNwxK50XX  | SUCCEEDED | mark814/nr-test       | cheeky_cuvier      | user1       | Wed, 29 May 2024 12:21:10 GMT
    eS6sVB5A387aR  | SUCCEEDED | mark814/nr-test       | evil_murdock       | user1       | Wed, 29 May 2024 12:11:08 GMT
```

A leading and trailing `*` wildcard character is supported:

```bash
tw runs list --filter="*man/rnaseq-*"

  Pipeline runs at [seqeralabs / testing] workspace:

    ID             | Status    | Project Name        | Run Name            | Username       | Submit Date
    ----------------+-----------+---------------------+---------------------+----------------+-------------------------------
    5z4AMshti4g0GK | SUCCEEDED | robnewman/rnaseq-nf | admiring_darwin     | user1     | Tue, 16 Jan 2024 19:56:29 GMT
    62LqiS4O4FatSy | SUCCEEDED | robnewman/rnaseq-nf | cheeky_yonath       | user1 | Wed, 3 Jan 2024 12:36:09 GMT
    3k2nu8ZmcBFSGv | SUCCEEDED | robnewman/rnaseq-nf | compassionate_jones | user3   | Tue, 2 Jan 2024 16:22:26 GMT
    3zG2ggf5JsniNW | SUCCEEDED | robnewman/rnaseq-nf | fervent_payne       | user1     | Wed, 20 Dec 2023 23:55:17 GMT
    1SNIcSXRuJMSNZ | SUCCEEDED | robnewman/rnaseq-nf | curious_babbage     | user3     | Thu, 28 Sep 2023 17:48:04 GMT
    5lI2fZUZfiokBI | SUCCEEDED | robnewman/rnaseq-nf | boring_heisenberg   | user2     | Thu, 28 Sep 2023 12:29:27 GMT
    5I4lsRXIHVEjNB | SUCCEEDED | robnewman/rnaseq-nf | ecstatic_ptolemy    | user2     | Wed, 27 Sep 2023 22:06:19 GMT
```

Run `tw data-links upload -h` to view all the required and optional fields for uploading files and directories to a data-link in a workspace.

### Upload files

Command:

```bash
tw data-links upload -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/file.txt
```

Example output:

```bash
Fetching data-links.
  Waiting DONE status....FETCHING.........DONE  [DONE]

Uploading file: file.txt
....
 Progress: [========================================] 100% (269/269 KBs, ETA: 0.0s, Elapsed: 1s)
```

Example output:

```bash
Successfully uploaded files


     Type | File count | Path
    ------+------------+-----------------------------------
     FILE | 1          | file.txt
```

### Upload directories

Command:

```bash
tw data-links upload -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/my-directory/

Uploading file: my-directory/file.txt
....
 Progress: [========================================] 100% (5/5 bytes, ETA: 0.0s, Elapsed: 0s)


Successfully uploaded files


     Type   | File count | Path
    --------+------------+---------------
     FOLDER | 1          | my-directory/
```

### Upload options

Control progress output and parallelism:

- `--silent` suppresses the per-file lines and the progress bar. Use it in scripts or when logging to a file.
- `--concurrency` sets how many file chunks upload in parallel. The default is 4. Each in-flight chunk buffers up to 250 MB. Peak memory use is roughly the concurrency value multiplied by 250 MB. Set `--concurrency 1` to upload chunks sequentially. Values below 1 are rejected. This option has no effect on Google Cloud Storage uploads, which are always sequential.

Command:

```bash
tw data-links upload -n my-bucket -c <credentials_ID> -w <workspace_ID> --concurrency 8 --silent path/to/large-file.bam
```

### Large uploads

Files upload in 250 MB parts. When a part fails with a transient error, such as a dropped connection, throttling, or an HTTP 5xx response, the CLI retries that part with exponential backoff, up to 5 attempts.

For AWS S3 and Seqera Compute data-links, the CLI also recovers when the signed upload URLs expire before the upload finishes. It requests fresh URLs for the remaining parts from Seqera Platform and continues the same upload. The refresh does not appear in the progress output. URL refresh requires Seqera Cloud or Seqera Enterprise 26.2 or later. On earlier Enterprise versions, the upload stops with the following error:

```
Token refresh is not supported for this Platform version.
```

Azure Blob Storage and Google Cloud Storage uploads cannot refresh expired URLs. An upload that outlives its URLs fails. Run the command again to restart it.

| Provider             | Parallel parts | Retries transient errors | Refreshes expired URLs |
| -------------------- | -------------- | ------------------------ | ---------------------- |
| AWS S3               | Yes            | Yes                      | Yes                    |
| Seqera Compute       | Yes            | Yes                      | Yes                    |
| Azure Blob Storage   | Yes            | Yes                      | No                     |
| Google Cloud Storage | No             | Yes                      | No                     |

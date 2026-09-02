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
 Progress: [========================================] 100% (269/269 KBs, ETA: 0.0s)
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
 Progress: [========================================] 100% (5/5 bytes, ETA: 0.0s)


Successfully uploaded files


     Type   | File count | Path
    --------+------------+---------------
     FOLDER | 1          | my-directory/
```

### Upload options

Control progress output and parallelism for large uploads:

- `--silent` suppresses the per-file lines and the progress bar. Use it in scripts or when logging to a file.
- `--concurrency` sets how many file chunks upload in parallel. The default is 4. Each in-flight chunk buffers up to 250 MB, so peak memory use is roughly the concurrency value multiplied by 250 MB. Set `--concurrency=1` to upload chunks sequentially. Values below 1 are rejected.

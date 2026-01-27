Run `tw data-links download -h` to view all the required and optional fields for downloading files and directories from a data-link in a workspace.

### Download files

```bash
tw data-links download -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/file.txt

Downloading file: file.txt
....
 Progress: [========================================] 100% (269/269 KBs, ETA: 0.0s)

  Successfully downloaded files


     Type | File count | Path
    ------+------------+-----------------------------------
     FILE | 1          | file.txt
```

### Download directories

```bash
tw data-links download -n my-bucket -c <credentials_ID> -w <workspace_ID> path/to/my-directory/

Downloading file: my-directory/file.txt
....
 Progress: [========================================] 100% (5/5 bytes, ETA: 0.0s)

  Successfully downloaded files


     Type   | File count | Path
    --------+------------+---------------
     FOLDER | 1          | my-directory/
```

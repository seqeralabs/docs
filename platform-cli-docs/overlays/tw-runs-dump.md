Run `tw runs dump -h` to view all the required and optional fields for dumping all logs and details of a run in a workspace. The supported formats are `.tar.xz` and `.tar.gz`. In the example below, we dump all the logs and details for the run with ID `5z4AMshti4g0GK` to the output file `file.tar.gz`.

Command:

```bash
tw runs dump -i 5z4AMshti4g0GK -o file.tar.gz
- Tower info
- Workflow details
- Task details
```

Example output:

```bash
Pipeline run '5z4AMshti4g0GK' at [seqeralabs / testing] workspace details dump at 'file.tar.gz'
```

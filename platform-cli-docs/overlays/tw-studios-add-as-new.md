Add a Studio from an existing Studio and checkpoint. Use this to experiment without changing the parent Studio state.

Command:

```bash
tw studios add-as-new \
  --parent-id=657ddbca \
  --name=analysis-env-from-parent \
  --workspace=community/showcase \
  --description="New sandbox for temporary analysis" \
  --cpu=2 \
  --memory=8192 \
  --auto-start
```

Example output:

```console
Studio 19a3abbd CREATED at [community / showcase] workspace and auto-started.
```

For a private Studio, use `--private --allow-user=<USER>` to allow one additional user, identified by numeric ID, username, or email address, to connect to and start it.

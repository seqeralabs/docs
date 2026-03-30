Run `tw studios start-as-new -h` to view the required and optional fields for adding and starting a new session from an existing session checkpoint.

Add a new session from an existing parent Studio session and checkpoint. Useful for experimentation without impacting the parent Studio session state.

Command:

```bash
tw studios start-as-new -pid=657ddbca \
-n=analysis-env-from-parent \
-w community/showcase \
--description="New sandbox for temporary analysis"  \
--cpu=2 \
--memory=8192 \
-a
```

Example output:

```bash
Studio 19a3abbd CREATED at [community / showcase] workspace and auto-started.
```

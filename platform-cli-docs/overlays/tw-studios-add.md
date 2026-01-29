Run `tw studios add -h` to view the required and optional fields for adding sessions.

Add a new Studio session in a workspace.

Command:

```bash
tw studios add -n new-analysis -w community/showcase \
--description="New Python analysis for RNA experiment ABC" \
--template="public.cr.seqera.io/platform/data-studio-jupyter:4.1.5-0.7" \
--compute-env=48bB2PDk83AxskE40lealy \
--cpu=2 \
--memory=8192
```

Example output:

```bash
Studio 2aa60bb7 CREATED at [community / showcase] workspace.
```

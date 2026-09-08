### Example

Launch a pipeline directly from its repository URL:

```bash
tw launch https://github.com/nf-core/rnaseq \
  --params-file=./custom_rnaseq_params.yaml \
  --config=<path/to/nextflow/conf/file> \
  --compute-env=my_aws_ce \
  --revision 3.8.1 \
  --profile=test,docker
```

Example output:

```console
Workflow 2XDXxX0vCX8xhx submitted at user workspace.

    https://cloud.seqera.io/user/user1/watch/2XDXxX0vCX8xhx
```

- Pipeline parameters are defined in `custom_rnaseq_params.yaml`.
- The optional `--config` file overrides values from the pipeline repository's `nextflow.conf` and ignores values in Platform pipeline or compute environment **Nextflow config** fields.
- Use `--profile` and `--revision` to select Nextflow profiles and a Git revision.
- Omit `--compute-env` to use the workspace primary compute environment.

:::note
CLI users have the same permissions as in the Platform UI. Launch users can run preconfigured pipelines in accessible workspaces, but they cannot add or run a new pipeline directly from its repository URL.
:::

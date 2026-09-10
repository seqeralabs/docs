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

### Nextflow version, syntax parser, and output directory

Override the Nextflow runtime settings saved with the pipeline for a single launch:

```bash
tw launch https://github.com/nf-core/rnaseq \
  --compute-env=my_aws_ce \
  --nextflow-version=<nextflow_version> \
  --syntax-parser=v2 \
  --output-dir=s3://<bucket name>/results
```

- `--nextflow-version` selects a Nextflow release from the Platform version catalog. The version must meet the minimum required by the compute environment. See [Nextflow version][nextflow-version] for defaults and availability by compute environment type.
- `--syntax-parser` accepts `v1` or `v2`. See [Enable Nextflow syntax parser v2][syntax-parser-v2] for runtime requirements and defaults.
- `--output-dir` sets the directory for workflow outputs and is passed to Nextflow as `-output-dir`. It is separate from a pipeline `outdir` parameter. See [Output directory][output-directory].

Each option takes precedence over the value stored in the pipeline's launch configuration. Omit an option to keep the stored value.

:::note
CLI users have the same permissions as in the Platform UI. Launch users can run preconfigured pipelines in accessible workspaces, but they cannot add or run a new pipeline directly from its repository URL.
:::

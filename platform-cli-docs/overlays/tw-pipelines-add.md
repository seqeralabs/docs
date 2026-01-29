Run `tw pipelines add -h` to view the required and optional fields for adding your pipeline.

Add a pre-configured pipeline to the Launchpad:

```bash
tw pipelines add --name=my_rnaseq_nf_pipeline \
--params-file=my_rnaseq_nf_pipeline_params.yaml \
--config=<path/to/nextflow/conf/file> \
https://github.com/nextflow-io/rnaseq-nf

New pipeline 'my_rnaseq_nf_pipeline' added at user workspace
```

The optional `--params-file` flag is used to pass a set of default parameters that will be associated with the pipeline in the Launchpad.

The optional `--config` flag is used to pass a custom Nextflow configuration file — configuration values passed here override the same values in the default pipeline repository `nextflow.conf` file. When this flag is set, all configuration values specified in Platform pipeline or compute environment **Nextflow config** fields are ignored.

:::tip
The `params-file` or `--config` file must be a YAML or JSON file using [Nextflow configuration][nextflow-config] syntax.
:::

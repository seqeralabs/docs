The default launch parameters can be changed with the `update` command:

```bash
tw pipelines update --name=my_rnaseq_nf_pipeline \
--params-file=my_rnaseq_nf_pipeline_params_2.yaml
```

Options you omit keep their stored values. For example, updating only `--params-file` leaves the pipeline's saved Nextflow version, syntax parser, and output directory unchanged.

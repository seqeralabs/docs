Export the configuration details of a pipeline in JSON format for scripting and reproducibility purposes.

Command:

```bash
tw pipelines export --name=my_rnaseq_nf_pipeline my_rnaseq_nf_pipeline_v1.json
```

Example output:

```bash
Pipeline exported into 'my_rnaseq_nf_pipeline_v1.json'
```

Similarly, a pipeline can be imported to a workspace from a previously exported JSON file.

Command:

```bash
tw pipelines import --name=my_rnaseq_nf_pipeline_v1 ./my_rnaseq_nf_pipeline_v1.json


New pipeline 'my_rnaseq_nf_pipeline_v1' added at user workspace
```

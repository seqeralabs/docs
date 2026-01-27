Export the configuration details of a compute environment in JSON format for scripting and reproducibility purposes.

```bash
tw compute-envs export --name=my_aws_ce my_aws_ce_v1.json

  Compute environment exported into 'my_aws_ce_v1.json'
```

Similarly, a compute environment can be imported to a workspace from a previously exported JSON file.

```bash
tw compute-envs import --name=my_aws_ce_v1 ./my_aws_ce_v1.json

  New AWS-BATCH compute environment 'my_aws_ce_v1' added at user workspace
```

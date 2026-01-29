Run `tw compute-envs add -h` to view the list of supported providers.

Run `tw compute-envs add <platform> -h` to view the required and optional fields for your provider.

You must add the credentials for your provider before creating your compute environment.

```bash
tw compute-envs add aws-batch forge --name=my_aws_ce \
--credentials=<my_aws_creds_1> --region=eu-west-1 --max-cpus=256 \
--work-dir=s3://<bucket name> --wait=AVAILABLE

  New AWS-BATCH compute environment 'my_aws_ce' added at user workspace
```

This command will:

- Use **Batch Forge** to automatically manage the AWS Batch resource lifecycle (`forge`)
- Use the credentials previously added to the workspace (`--credentials`)
- Create the required AWS Batch resources in the AWS Ireland (`eu-west-1`) region
- Provision a maximum of 256 CPUs in the compute environment (`--max-cpus`)
- Use an existing S3 bucket to store the Nextflow work directory (`--work-dir`)
- Wait until the compute environment has been successfully created and is ready to use (`--wait`)

See the [compute environment][compute-envs] page for your provider for detailed information on Batch Forge and manual compute environment creation.

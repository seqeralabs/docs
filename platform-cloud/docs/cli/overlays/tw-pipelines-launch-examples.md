### Examples

#### Launch a pipeline with default parameters

```bash
tw pipelines launch --id 1234567890abcdef
```

This launches the pipeline using its default configuration and the primary compute environment configured in your workspace.

#### Launch with custom parameters

```bash
tw pipelines launch \
  --id 1234567890abcdef \
  --params-file params.json \
  --compute-env my-aws-batch
```

The `params.json` file should contain your pipeline parameters:

```json
{
  "genome": "GRCh38",
  "reads": "s3://my-bucket/data/*.fastq.gz",
  "outdir": "s3://my-bucket/results"
}
```

#### Launch with inline parameters

```bash
tw pipelines launch \
  --id 1234567890abcdef \
  --params genome=GRCh38 \
  --params reads="s3://my-bucket/data/*.fastq.gz"
```

#### Launch and wait for completion

```bash
tw pipelines launch \
  --id 1234567890abcdef \
  --wait \
  --workspace my-org/my-workspace
```

The `--wait` flag is useful in CI/CD environments where you need to monitor pipeline completion.

#### Launch with a specific revision

```bash
tw pipelines launch \
  --id 1234567890abcdef \
  --revision dev \
  --profile test
```

### Common Workflows

#### Automated CI/CD pipeline execution

```bash
#!/bin/bash
# Launch pipeline and capture run ID
RUN_ID=$(tw pipelines launch \
  --id 1234567890abcdef \
  --params-file params.json \
  --output json | jq -r '.runId')

echo "Launched pipeline run: $RUN_ID"

# Monitor status
tw runs view --id $RUN_ID --wait
```

#### Launch multiple pipelines in parallel

```bash
for sample in sample1 sample2 sample3; do
  tw pipelines launch \
    --id 1234567890abcdef \
    --params sample_id=$sample \
    --name "Analysis-$sample" &
done
wait
```

### Tips

- Use `--workspace` to explicitly specify the workspace when working with multiple organizations
- The `--name` option helps identify runs when launching multiple instances
- Parameter files support both JSON and YAML formats
- Use `--config` to specify a custom Nextflow configuration file
- The `--profile` option activates Nextflow profiles defined in your pipeline

### Related Commands

- [`tw pipelines list`](#tw-pipelines-list) - List available pipelines
- [`tw runs view`](runs.md#tw-runs-view) - Monitor pipeline execution
- [`tw runs cancel`](runs.md#tw-runs-cancel) - Cancel a running pipeline

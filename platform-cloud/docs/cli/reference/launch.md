---
title: tw launch
description: Launch a pipeline
---

# `tw launch`

Launch a pipeline

## Synopsis

```bash
tw launch [OPTIONS]
```

## Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. |  |  |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. |  |  |
| `-n`, `--name` | Custom run name for the workflow execution. |  |  |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. |  |  |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. |  |  |
| `-r`, `--revision` | Git revision, branch, or tag to use. |  |  |
| `--wait` | Wait until workflow reaches specified status: ${COMPLETION-CANDIDATES} |  |  |
| `-l`, `--labels` | Labels to assign to each pipeline run. Provide comma-separated label values (use key=value format for resource labels). Labels will be created if they don't exist |  |  |
| `--launch-container` | Container image to use for the Nextflow launcher. |  |  |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. |  |  |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. |  |  |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. |  |  |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. |  |  |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). |  |  |
| `--main-script` | Alternative main script filename. Default: `main.nf`. |  |  |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. |  |  |
| `--schema-name` | Name of the pipeline schema to use. |  |  |
| `--user-secrets` | Array of user secrets to make available to the pipeline. |  |  |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. |  |  |
| `--disable-optimization` | Turn off the optimization for the pipeline before launching. |  |  |
| `--head-job-cpus` | Number of CPUs allocated for the Nextflow head job. |  |  |
| `--head-job-memory` | Memory allocation for the Nextflow head job in megabytes. |  |  |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `${TOWER_WORKSPACE_ID}` |

### Examples

#### Launch a pipeline with default parameters

```bash
tw launch --id 1234567890abcdef
```

This launches the pipeline using its default configuration and the primary compute environment configured in your workspace.

#### Launch with custom parameters

```bash
tw launch \
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
tw launch \
  --id 1234567890abcdef \
  --params genome=GRCh38 \
  --params reads="s3://my-bucket/data/*.fastq.gz"
```

#### Launch and wait for completion

```bash
tw launch \
  --id 1234567890abcdef \
  --wait \
  --workspace my-org/my-workspace
```

The `--wait` flag is useful in CI/CD environments where you need to monitor pipeline completion.

#### Launch with a specific revision

```bash
tw launch \
  --id 1234567890abcdef \
  --revision dev \
  --profile test
```

### Common Workflows

#### Automated CI/CD pipeline execution

```bash
#!/bin/bash
# Launch pipeline and capture run ID
RUN_ID=$(tw launch \
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
  tw launch \
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

- [`tw pipelines list`](pipelines.md#tw-pipelines-list) - List available pipelines
- [`tw pipelines add`](pipelines.md#tw-pipelines-add) - Add a pipeline to your workspace
- [`tw runs view`](runs.md#tw-runs-view) - Monitor pipeline execution
- [`tw runs cancel`](runs.md#tw-runs-cancel) - Cancel a running pipeline

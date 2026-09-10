---
title: "tw launch"
description: "Launch a pipeline"
---

# `tw launch`

Launch a pipeline

Run `tw launch -h` to view supported launch options.

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

```bash
tw launch [OPTIONS] <PIPELINE_OR_URL>
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `PIPELINE_OR_URL` | Workspace pipeline name or pipeline URL | Yes |

## Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) | No |  |
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. Use '-' to read from stdin. | No |  |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. | No |  |
| `-n`, `--name` | Custom run name for the workflow execution. | No |  |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. | No |  |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. | No |  |
| `-r`, `--revision` | Git revision, branch, or tag to use. Use --commit-id to pin to a specific commit within the revision. | No |  |
| `--commit-id` | Specific Git commit hash to pin the pipeline execution to. | No |  |
| `--version-id` | Pipeline version identifier | Yes |  |
| `--version-name` | Pipeline version name | Yes |  |
| `--wait` | Wait until workflow reaches specified status: SUBMITTED, RUNNING, SUCCEEDED, FAILED, CANCELLED, UNKNOWN | No |  |
| `-l`, `--labels` | Labels to assign to each pipeline run. Provide comma-separated label values (use key=value format for resource labels). Labels will be created if they don't exist | No |  |
| `--launch-container` | Container image to use for the Nextflow launcher. | No |  |
| `--syntax-parser` | Nextflow language syntax parser version: 'v1' (legacy) or 'v2'. Takes precedence over the value stored in the launch configuration. | No |  |
| `--nextflow-version` | Nextflow version to run the workflow with. Must exist in the Platform version catalog and meet the minimum required by the compute environment. Takes precedence over the value stored in the launch configuration. | No |  |
| `--output-dir` | Per-run output directory, passed to Nextflow as '-output-dir'. Requires Nextflow 24.10.0 or later and the workflow outputs syntax. Takes precedence over the value stored in the launch configuration. | No |  |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. Use '-' to read from stdin. | No |  |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. Use '-' to read from stdin. | No |  |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. Use '-' to read from stdin. | No |  |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. | No |  |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). | No |  |
| `--main-script` | Alternative main script filename. Default: `main.nf`. | No |  |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. | No |  |
| `--schema-name` | Name of the pipeline schema to use. | No |  |
| `--user-secrets` | Array of user secrets to make available to the pipeline. | No |  |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. | No |  |
| `--disable-optimization` | Turn off the optimization for the pipeline before launching. | No |  |
| `--head-job-cpus` | Number of CPUs allocated for the Nextflow head job. | No |  |
| `--head-job-memory` | Memory allocation for the Nextflow head job in megabytes. | No |  |

[actions]: /platform-cloud/pipeline-actions/overview
[aws-batch-pipeline-secrets]: /platform-cloud/compute-envs/aws-batch#pipeline-secrets-optional
[aws-cloud-advanced-options]: /platform-cloud/compute-envs/aws-cloud#advanced-options
[compute-envs]: /platform-cloud/compute-envs/overview
[credentials]: /platform-cloud/credentials/overview
[data-explorer]: /platform-cloud/data/data-explorer
[datasets]: /platform-cloud/data/datasets
[git-integration]: /platform-cloud/git/overview
[google-cloud-advanced-options]: /platform-cloud/compute-envs/google-cloud#advanced-options
[labels]: /platform-cloud/labels/overview
[nextflow-config]: https://docs.seqera.io/nextflow/config#config-syntax
[nextflow-version]: /platform-cloud/launch/advanced#nextflow-version
[organizations]: /platform-cloud/orgs-and-teams/organizations
[output-directory]: /platform-cloud/launch/launchpad#output-directory
[participant-roles]: /platform-cloud/orgs-and-teams/roles
[resource-labels]: /platform-cloud/resource-labels/overview
[run-details]: /platform-cloud/monitoring/run-details
[secrets]: /platform-cloud/secrets/overview
[shared-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[studio-checkpoints]: /platform-cloud/studios/managing#studio-session-checkpoints
[studios]: /platform-cloud/studios/overview
[syntax-parser-v2]: /platform-cloud/launch/advanced#enable-nextflow-syntax-parser-v2
[tower-agent]: /platform-cloud/supported_software/agent/overview
[user-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave

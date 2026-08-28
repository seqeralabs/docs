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
[compute-envs]: /platform-cloud/compute-envs/overview
[credentials]: /platform-cloud/credentials/overview
[data-explorer]: /platform-cloud/data/data-explorer
[datasets]: /platform-cloud/data/datasets
[git-integration]: /platform-cloud/git/overview
[labels]: /platform-cloud/labels/overview
[nextflow-config]: https://docs.seqera.io/nextflow/config#config-syntax
[organizations]: /platform-cloud/orgs-and-teams/organizations
[participant-roles]: /platform-cloud/orgs-and-teams/roles
[resource-labels]: /platform-cloud/resource-labels/overview
[run-details]: /platform-cloud/monitoring/run-details
[secrets]: /platform-cloud/secrets/overview
[shared-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[studio-checkpoints]: /platform-cloud/studios/managing#studio-session-checkpoints
[studios]: /platform-cloud/studios/overview
[tower-agent]: /platform-cloud/supported_software/agent/overview
[user-workspaces]: /platform-cloud/orgs-and-teams/workspace-management
[wave-docs]: https://docs.seqera.io/wave

---
title: tw launch
description: Launch a pipeline
---

# tw launch

Launch a pipeline

Run `tw launch -h` to view supported launch options.

Command:

```bash
tw launch [OPTIONS]
```

## Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `--params-file` | Pipeline parameters in JSON or YAML format. Provide the path to a file containing the content. | No | `null` |
| `-c`, `--compute-env` | Compute environment identifier where the pipeline will run. Defaults to workspace primary compute environment if omitted. Provide the name or identifier. | No | `null` |
| `-n`, `--name` | Custom run name for the workflow execution. | No | `null` |
| `--work-dir` | Work directory path where workflow intermediate files are stored. Defaults to compute environment work directory if omitted. | No | `null` |
| `-p`, `--profile` | Array of Nextflow configuration profile names to apply. | No | `null` |
| `-r`, `--revision` | Git revision, branch, or tag to use. | No | `null` |
| `--wait` | Wait until workflow reaches specified status: SUBMITTED, RUNNING, SUCCEEDED, FAILED, CANCELLED | No | `null` |
| `-l`, `--labels` | Labels to assign to each pipeline run. Provide comma-separated label values (use key=value format for resource labels). Labels will be created if they don't exist | No | `null` |
| `--launch-container` | Container image to use for the Nextflow launcher. | No | `null` |
| `--config` | Nextflow configuration as text (overrides config files). Provide the path to a file containing the content. | No | `null` |
| `--pre-run` | Add a script that executes in the nf-launch script prior to invoking Nextflow processes. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No | `null` |
| `--post-run` | Add a script that executes after all Nextflow processes have completed. See: https://docs.seqera.io/platform-cloud/launch/advanced#pre-and-post-run-scripts. Provide the path to a file containing the content. | No | `null` |
| `--pull-latest` | Pull the latest version of the pipeline from the repository. | No | `null` |
| `--stub-run` | Execute a stub run for testing (processes return dummy results). | No | `null` |
| `--main-script` | Alternative main script filename. Default: `main.nf`. | No | `null` |
| `--entry-name` | Workflow entry point name when using Nextflow DSL2. | No | `null` |
| `--schema-name` | Name of the pipeline schema to use. | No | `null` |
| `--user-secrets` | Array of user secrets to make available to the pipeline. | No | `null` |
| `--workspace-secrets` | Array of workspace secrets to make available to the pipeline. | No | `null` |
| `--disable-optimization` | Turn off the optimization for the pipeline before launching. | No | `null` |
| `--head-job-cpus` | Number of CPUs allocated for the Nextflow head job. | No | `null` |
| `--head-job-memory` | Memory allocation for the Nextflow head job in megabytes. | No | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable) | No | `TOWER_WORKSPACE_ID` |

### Example


Command:

```bash
tw launch -w 123456789012345 nf-hello-2026
```

Example output:

```bash
Workflow 7q8r9s0t1u2v3 submitted at [my-organization-updated / my-workspace] workspace.

    https://cloud.seqera.io/orgs/my-organization-updated/workspaces/my-workspace/watch/7q8r9s0t1u2v3
```

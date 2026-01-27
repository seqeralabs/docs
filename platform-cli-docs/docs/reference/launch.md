---
title: tw launch
description: Launch a pipeline
---

# tw launch

Launch a pipeline

Run `tw launch -h` to view supported launch options.

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
| `--wait` | Wait until workflow reaches specified status: SUBMITTED, RUNNING, SUCCEEDED, FAILED, CANCELLED |  |  |
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
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to TOWER_WORKSPACE_ID environment variable) |  | `TOWER_WORKSPACE_ID` |

```bash
tw launch -w 123456789012345 nf-hello-2026

  Workflow 7q8r9s0t1u2v3 submitted at [my-organization-updated / my-workspace] workspace.

    https://cloud.seqera.io/orgs/my-organization-updated/workspaces/my-workspace/watch/7q8r9s0t1u2v3
```

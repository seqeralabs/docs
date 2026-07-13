---
title: "Nextflow"
description: "Nextflow troubleshooting with Seqera Platform."
date created: "2024-08-26"
last updated: "2026-07-06"
tags: [faq, help, nextflow, troubleshooting]
---

When running Nextflow pipelines with Seqera Platform, you might encounter the following issues.

## Nextflow configuration

#### Default Nextflow DSL version

From [Nextflow 22.03.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.03.0-edge), DSL2 is the default syntax.

To minimize disruption to existing pipelines, versions 22.1.x and later default Nextflow head jobs to DSL1 for a transition period (end date to be confirmed). Force your Nextflow head job to use DSL2 syntax with one of the following:

- Add `export NXF_DEFAULT_DSL=2` in the **Advanced options > Pre-run script** field of the launch form.
- Specify `nextflow.enable.dsl = 2` at the top of your Nextflow workflow file.
- Provide the `-dsl2` flag when you invoke the Nextflow CLI, for example `nextflow run ... -dsl2`.

#### Invoke Nextflow CLI run arguments during launch

From [Nextflow v22.09.1-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.09.1-edge), you can specify [Nextflow CLI run arguments](https://docs.seqera.io/nextflow/cli.html?highlight=dump#run) when you launch a pipeline from Seqera. Set the `NXF_CLI_OPTS` environment variable in a [pre-run script](../launch/advanced#pre-and-post-run-scripts):

```bash
export NXF_CLI_OPTS='-dump-hashes'
```

#### Cloud execution: `--outdir` artifacts not available

Nextflow resolves relative paths against the current working directory. On a classic grid HPC, this is usually a subdirectory of `$HOME`. In a cloud execution environment, the path resolves relative to the _container file system_. Output files are lost when the container terminates. See [this Nextflow issue](https://github.com/nextflow-io/nextflow/issues/2661#issuecomment-1047259845) for details.

To resolve, specify the absolute path to your persistent storage with the `NXF_FILE_ROOT` environment variable in your [`nextflow.config`](../launch/advanced#nextflow-config-file) file. Nextflow then resolves relative paths so that output files are written to persistent storage rather than ephemeral container storage.

#### Ignore the Singularity cache

To ignore the Singularity cache, add this to your workflow: `process.container = 'file:///some/singularity/image.sif'`.

#### `Cannot read project manifest … path=nextflow.config`

This warning occurs when the source Git repository's default branch does not contain `main.nf` and `nextflow.config` files, regardless of whether the pipeline uses a non-default revision or branch (e.g., `dev`).

To resolve, create empty `main.nf` and `nextflow.config` files in the default branch. The pipeline can then run and use the `main.nf` and `nextflow.config` from your target revision.

#### Use multiple configuration files for different environments

The main `nextflow.config` file is always imported by default. Instead of managing multiple `nextflow.config` files, each customized for an environment, create environment-specific config files and import them as [config profiles](https://docs.seqera.io/nextflow/config#config-profiles) in the main `nextflow.config`:

```groovy
<truncated>

profiles {
    test { includeConfig 'conf/test.config' }
    prod { includeConfig 'conf/prod.config' }
    uat  { includeConfig 'conf/uat.config'  }
}

<truncated>
```

#### AWS S3 upload file size limits

You might see the following message in your Nextflow log:

```
WARN: Failed to publish file: s3://<bucket-name>
```

These messages are often caused by AWS S3 object size limits when using multipart upload. See the [AWS documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html), particularly _maximum number of parts per upload_.

To resolve, adjust the head job resources and configuration:

- Head Job CPUs: 16
- Head Job Memory: 60000
- [Pre-run script](../launch/advanced#pre-and-post-run-scripts): `export NXF_OPTS="-Xms20G -Xmx40G"`
- Increase the chunk size and slow the transfers in `nextflow.config`:

  ```groovy
  aws {
    batch {
        maxParallelTransfers = 5
        maxTransferAttempts = 3
        delayBetweenAttempts = 30
    }
    client {
        uploadChunkSize = '200MB'
        maxConnections = 10
        maxErrorRetry = 10
        uploadMaxThreads = 10
        uploadMaxAttempts = 10
        uploadRetrySleep = '10 sec'
    }
  }
  ```

#### Nextflow cannot parse a params file

```
Cannot parse params file: /ephemeral/example.json - Cause: Server returned HTTP response code: 403 for URL: https://api.tower.nf/ephemeral/example.json
```

Ephemeral endpoints can be consumed only once. Nextflow versions earlier than 22.04 can call the same endpoint more than once, which causes this error.

To resolve, upgrade Nextflow to version 22.04.x or later.

#### Prevent uploading intermediate files to the AWS S3 work directory

Nextflow only unstages files and folders that you explicitly define as process outputs. If your workflow has processes that generate folder-type outputs, ensure each process also purges any intermediate files in those folders. Otherwise, Nextflow copies the intermediate files during task unstaging. This adds storage costs and lengthens execution times.

#### Values in the repository `nextflow.config` change during launch

Some values in your pipeline repository's `nextflow.config` can change when the pipeline is launched from Seqera, because Seqera applies a set of default values that override the pipeline configuration. For example, this block is specified in your `nextflow.config`:

```groovy
aws {
  region = 'us-east-1'
  client {
    uploadChunkSize = 209715200 // 200 MB
  }
  ...
}
```

When the job starts on the AWS Batch compute environment, `uploadChunkSize` changes:

```groovy
aws {
  region = 'us-east-1'
  client {
      uploadChunkSize = 10485760 // 10 MB
  }
  ...
}
```

This happens because Seqera applies its 10 MB default instead of the value in your `nextflow.config`.

To force the Seqera-invoked job to use your value, add the setting in the workspace launch form's [**Nextflow config file** field](../launch/launchpad). For the example above, add `aws.client.uploadChunkSize = 209715200 // 200 MB`.

Values affected by this behavior include:

- `aws.client.uploadChunkSize`
- `aws.client.storageEncryption`

#### `Missing output file(s) [X] expected by process [Y]` with Fusion v1

Fusion v1 causes tasks that run for less than 60 seconds to fail, because Nextflow doesn't yet detect the output file the task generated. This limitation is inherited from the Goofys driver used in the Fusion v1 implementation. [Fusion v2](../supported_software/fusion/overview.md) resolves this issue.

If you can't update to Fusion v2, instruct Nextflow to wait 60 seconds after the task completes. In **Pipeline settings > Advanced options > Nextflow config file**, add:

```groovy
process.afterScript = 'sleep 60'
```

#### Jobs remain in RUNNING status after canceling a run

Your instance's behavior when you cancel a run depends on the Nextflow [`errorStrategy`](https://docs.seqera.io/nextflow/process#errorstrategy) defined in your process script. If `errorStrategy` is set to `finish`, canceling (or otherwise interrupting) a run starts an orderly shutdown, which instructs Nextflow to wait for submitted jobs to complete. To terminate all jobs when you cancel a run, set `errorStrategy` to `terminate` in your Nextflow config:

```groovy
process terminateError {
  errorStrategy 'terminate'
  script:
  <command>
}
```

#### Cached tasks run from scratch on relaunch

When you relaunch a pipeline, Seqera relies on Nextflow's `resume` functionality to continue the execution. This skips previously completed tasks and uses cached results in downstream tasks, rather than running the completed tasks again. Nextflow calculates each task's unique ID (hash) from the task's:

- Input values
- Input files
- Command line string
- Container ID
- Conda environment
- Environment modules
- Any executed scripts in the bin directory

A change in any of these values changes the task hash, and a changed hash means the task runs again on relaunch. To debug an unexpected relaunch, run the pipeline twice with `dumpHashes=true` set in your Nextflow config file (**Advanced options > Nextflow config file** in the pipeline settings). Nextflow then dumps the task hashes for both executions in the `nextflow.log` file. Compare the log files to find where the hashes diverge.

See [Demystifying Nextflow resume](https://www.nextflow.io/blog/2019/demystifying-nextflow-resume.html) for more on the `resume` mechanism.

#### `Incorrect string value`

```
 [scheduled-executor-thread-2] - WARN  o.h.e.jdbc.spi.SqlExceptionHelper - SQL Error: 1366, SQLState: HY000

 [scheduled-executor-thread-2] - ERROR o.h.e.jdbc.spi.SqlExceptionHelper - (conn=34) Incorrect string value: '\xF0\x9F\x94\x8D |...' for column 'error_report' at row 1

 [scheduled-executor-thread-2] - ERROR i.s.t.service.job.JobSchedulerImpl - Unable to save status of job id=18165; name=nf-workflow-26uD5XXXXXXXX; opId=nf-workflow-26uD5XXXXXXXX; status=UNKNOWN
```

Runs fail when your Nextflow script or config contains illegal characters, such as emojis or other non-UTF8 characters. To resolve, validate your script and config files for illegal characters before you run again.

#### Run fails: Nextflow script exceeds 64 KiB

The Groovy shell that Nextflow uses to execute your workflow has a hard limit on string size (64 KiB). Check the size of your scripts with `ls -llh`. If a script is larger than 65,535 bytes, consider these mitigations:

1. Remove unnecessary code or comments from the script.
2. Move long script bodies into a separate script file in the pipeline `/bin` directory.
3. Use DSL2 so you can move each function, process, and workflow definition into its own script and include them as [modules](https://docs.seqera.io/nextflow/module).

## Nextflow Launcher

#### nf-launcher image compatibility

Your Seqera installation knows the [nf-launcher image](https://quay.io/repository/seqeralabs/nf-launcher?tab=tags) version it needs and sets this value automatically when launching a pipeline.

If you're restricted from using public container registries, see Seqera Enterprise release [instructions](https://docs.seqera.io/changelog/seqera-enterprise/v25.1) for the specific image to set as the default when invoking pipelines.

#### Specify the Nextflow version

Each Seqera Platform release uses a specific nf-launcher image by default. This image is loaded with a specific Nextflow version that any workflow in the container uses by default. Force your jobs to use a newer or older Nextflow version with one of the following:

- Use a [pre-run script](../launch/advanced#pre-and-post-run-scripts) to set the Nextflow version. For example: `export NXF_VER=22.08.0-edge`

## Spot instance failures and retries

Up to version 24.10, Nextflow silently retried Spot instance failures up to five times on AWS Batch and Google Batch. These retries were controlled by cloud-specific configuration parameters (e.g., `aws.batch.maxSpotAttempts`) and happened in cloud infrastructure without explicit visibility to Nextflow.

From version 24.10, the default Spot reclamation retry setting changed to `0` on AWS and Google. By default, no _internal_ retries are attempted on these platforms. Spot reclamations now cause an immediate failure, exposed to Nextflow like any other generic failure (returning, for example, `exit code 1` on AWS). Nextflow treats these failures like any other job failure unless you configure a retry strategy.

#### Impact on existing workflows

If you rely on silent Spot retries (the previous default), you might now see more tasks fail with these characteristics:

- **AWS**: Generic failure with `exit code 1`. You might see messages indicating the host machine was terminated.
- **Google**: Spot reclamation typically produces a specific code, but is now surfaced as a recognizable task failure in Nextflow logs.

Because the default for Spot retries is now zero, you must enable a retry strategy for Nextflow to handle reclaimed Spot instances automatically. For more information, see the [Spot Instance failures and retries](https://docs.seqera.io/nextflow/updating-spot-retries) guide.

## Nextflow syntax parser

Up to version 25.10, Nextflow uses the v1 syntax parser (also known as the legacy parser) by default. The v2 parser introduces stricter validation and is available as an opt-in through `NXF_SYNTAX_PARSER=v2`.

From version 26.04, Nextflow uses the v2 syntax parser by default. Pipelines that run without modification under the v1 parser can fail under v2.

#### Pin the v1 parser

To run existing pipelines unchanged under Nextflow 26, set `NXF_SYNTAX_PARSER` to `v1` in a [pre-run script](../launch/advanced#pre-and-post-run-scripts):

```bash
export NXF_SYNTAX_PARSER=v1
```

This restores the legacy parser behavior.

For migration guidance to the v2 parser, see [Preparing for strict syntax](https://docs.seqera.io/nextflow/strict-syntax).

---
title: "Nextflow"
description: "Nextflow troubleshooting with Seqera Platform."
date: "26 August 2024"
tags: [faq, help, nextflow help, nextflow troubleshooting]
---

### Nextflow configuration

**Default Nextflow DSL version in Seqera Platform**

From [Nextflow 22.03.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.03.0-edge), DSL2 is the default syntax.

To minimize disruption on existing pipelines, version 22.1.x and later are configured to default Nextflow head jobs to DSL1 for a transition period (end date to be confirmed). You can force your Nextflow head job to use DSL2 syntax via any of the following techniques:

- Add `export NXF_DEFAULT_DSL=2` in the **Advanced Features > Pre-run script** field of the Platform launch screen.
- Specify `nextflow.enable.dsl = 2` at the top of your Nextflow workflow file.
- Provide the `-dsl2` flag when invoking the Nextflow CLI (e.g., `nextflow run ... -dsl2`).

**Invoke Nextflow CLI run arguments during Seqera launch**

From [Nextflow v22.09.1-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.09.1-edge), you can specify [Nextflow CLI run arguments](https://www.nextflow.io/docs/latest/cli.html?highlight=dump#run) when invoking a pipeline from Seqera. Set the `NXF_CLI_OPTS` environment variable using a [pre-run script](../launch/advanced#pre-and-post-run-scripts):

```
export NXF_CLI_OPTS='-dump-hashes'
```

**Cloud compute environment execution: `--outdir` artefacts not available**

Nextflow resolves relative paths against the current working directory. In a classic grid HPC, this normally corresponds to a subdirectory of the `$HOME` directory. In a cloud execution environment, however, the path will be resolved relative to the _container file system_, meaning files will be lost when the container is terminated. See [here](https://github.com/nextflow-io/nextflow/issues/2661#issuecomment-1047259845) for more details.

Specify the absolute path to your persistent storage using the `NXF_FILE_ROOT` environment variable in your [`nextflow.config`](../launch/advanced#nextflow-config-file) file. This resolves the relative paths defined in your Netflow script so that output files are written to your stateful storage, rather than ephemeral container storage.

**Nextflow: Ignore Singularity cache**

To ignore the Singularity cache, add this configuration item to your workflow: `process.container = 'file:///some/singularity/image.sif'`.

**Nextflow error: _WARN: Cannot read project manifest ... path=nextflow.config_**

This error can occur when executing a pipeline where the source Git repository's default branch is not populated with `main.nf` and `nextflow.config` files, regardless of whether the invoked pipeline is using a non-default revision/branch (e.g., `dev`).

Currently, you can resolve this by creating empty `main.nf` and `nextflow.config` files in the default branch. This allows the pipeline to run and use the content of the `main.nf` and `nextflow.config` in your target revision.

**Use multiple Nextflow configuration files for different environments**

The main `nextflow.config` file is always imported by default. Instead of managing multiple `nextflow.config` files (each customized for an environment), you can create unique environment config files and import them as [config profiles](https://www.nextflow.io/docs/latest/config.html#config-profiles) in the main `nextflow.config`.

Example:

```
<truncated>

profiles {
    test { includeConfig 'conf/test.config' }
    prod { includeConfig 'conf/prod.config' }
    uat  { includeConfig 'conf/uat.config'  }
}

<truncated>
```

**AWS S3 upload file size limits**

You may encounter _`WARN: Failed to publish file: s3://<bucket-name>`_ log messages. These are often related to AWS S3 object size limitations when using the multipart upload feature.

See the [AWS documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) for more information, particularly _maximum number of parts per upload_.

The following configuration is suggested to overcome AWS limitations:

- Head Job CPUs: 16
- Head Job Memory: 60000
- [Pre-run script](../launch/advanced#pre-and-post-run-scripts): `export NXF_OPTS="-Xms20G -Xmx40G"`
- Increase chunk size and slow down the number of transfers using `nextflow.config`:

  ```
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

**Nextflow unable to parse a params file from Seqera**

Ephemeral endpoints can only be consumed once. Nextflow versions older than 22.04 may try to call the same endpoint more than once, resulting in an error:

_Cannot parse params file: /ephemeral/example.json - Cause: Server returned HTTP response code: 403 for URL: https://api.tower.nf/ephemeral/example.json_

To resolve this problem, upgrade Nextflow to version 22.04.x or later.

**Prevent Nextflow from uploading intermediate files from local scratch to AWS S3 work directory**

Nextflow will only unstage files/folders that have been explicitly defined as process outputs. If your workflow has processes that generate folder-type outputs, ensure that the process also purges any intermediate files in those folders. Otherwise, the intermediate files are copied as part of the task unstaging process, resulting in additional storage costs and lengthened pipeline execution times.

**Values specified in Git repository `nextflow.config` change during Seqera launch**

Some values specified in your pipeline repository's `nextflow.config` may change when the pipeline is invoked via Seqera. This occurs because Seqera is configured with a set of default values that override the pipeline configuration. For example, the following code block is specified in your `nextflow.config`:

```
aws {
  region = 'us-east-1'
  client {
    uploadChunkSize = 209715200 // 200 MB
  }
  ...
}
```

When the job instantiates on the AWS Batch compute environment, the `uploadChunkSize` is changed:

```
aws {
  region = 'us-east-1'
  client {
      uploadChunkSize = 10485760 // 10 MB
  }
  ...
}
```

This change occurs because Seqera superimposes its 10 MB default value rather than the value specified in your `nextflow.config`.

To force the Seqera-invoked job to use your `nextflow.config` value, add the configuration setting in the workspace Launch screen's [**Nextflow config file** field](../launch/launchpad). For the example above, you would add `aws.client.uploadChunkSize = 209715200 // 200 MB`.

Nextflow configuration values affected by this behaviour include:

- `aws.client.uploadChunkSize`
- `aws.client.storageEncryption`

**Fusion v1 execution: _Missing output file(s) [X] expected by process [Y]_ error**

Fusion v1 has a limitation which causes tasks that run for less than 60 seconds to fail as the output file generated by the task is not yet detected by Nextflow. This is a limitation inherited from a Goofys driver used by the Fusion v1 implementation. [Fusion v2](../supported_software/fusion/overview) resolves this issue.

If you can't update to Fusion v2, this issue can be addressed by instructing Nextflow to wait for 60 seconds after the task completes.

From **Pipeline settings > Advanced options > Nextflow config file** add this line to your Nextflow configuration:

```
process.afterScript = 'sleep 60'
```

**Jobs remain in RUNNING status when a pipeline run is canceled**

Your instance's behavior when canceling a run depends on the Nextflow [`errorStrategy`](https://www.nextflow.io/docs/latest/process.html#errorstrategy) defined in your process script. If the process `errorStrategy` is set to `finish`, an orderly pipeline shutdown is initiated when you cancel (or otherwise interrupt) a run. This instructs Nextflow to wait for the completion of any submitted jobs. To ensure that all jobs are terminated when your run is canceled, set `errorStrategy` to `terminate` in your Nextflow config. For example:

```
process terminateError {
  errorStrategy 'terminate'
  script:
  <your command string here>
}
```

**Cached tasks run from scratch during pipeline relaunch**

When relaunching a pipeline, Seqera relies on Nextflow's `resume` functionality for the continuation of a workflow execution. This skips previously completed tasks and uses a cached result in downstream tasks, rather than running the completed tasks again. The unique ID (hash) of the task is calculated using a composition of the task's:

- Input values
- Input files
- Command line string
- Container ID
- Conda environment
- Environment modules
- Any executed scripts in the bin directory

A change in any of these values results in a changed task hash. Changing the task hash value means that the task will be run again when the pipeline is relaunched. To aid debugging efforts when a relaunch behaves unexpectedly, run the pipeline twice with `dumpHashes=true` set in your Nextflow config file (from **Advanced options > Nextflow config file** in the Pipeline settings). This will instruct Nextflow to dump the task hashes for both executions in the `nextflow.log` file. Compare the log files to determine the point at which the hashes diverge in your pipeline when it is resumed.

See [here](https://www.nextflow.io/blog/2019/demystifying-nextflow-resume.html) for more information on the Nextflow `resume` mechanism.

**Run failure: _o.h.e.jdbc.spi.SqlExceptionHelper - Incorrect string value_ error**

```
 [scheduled-executor-thread-2] - WARN  o.h.e.jdbc.spi.SqlExceptionHelper - SQL Error: 1366, SQLState: HY000

 [scheduled-executor-thread-2] - ERROR o.h.e.jdbc.spi.SqlExceptionHelper - (conn=34) Incorrect string value: '\xF0\x9F\x94\x8D |...' for column 'error_report' at row 1

 [scheduled-executor-thread-2] - ERROR i.s.t.service.job.JobSchedulerImpl - Unable to save status of job id=18165; name=nf-workflow-26uD5XXXXXXXX; opId=nf-workflow-26uD5XXXXXXXX; status=UNKNOWN
```

Runs will fail if your Nextflow script or Nextflow config contain illegal characters (such as emojis or other non-UTF8 characters). Validate your script and config files for any illegal characters before atttempting to run again.

**Run failures: Nextflow script exceeds 64KiB**

The Groovy shell used by Nextflow to execute your workflow has a hard limit on string size (64KiB). Check the size of your scripts with the `ls -llh` command. If the size is greater than 65,535 bytes, consider these mitigation techniques:

1. Remove any unnecessary code or comments from the script.
2. Move long script bodies into a separate script file in the pipeline `/bin` directory.
3. Consider using DSL2 so you can move each function, process, and workflow definition into its own script and include these scripts as [modules](https://www.nextflow.io/docs/latest/dsl2.html#modules).

### Nextflow Launcher

**Seqera Platform / [nf-launcher image](https://quay.io/repository/seqeralabs/nf-launcher?tab=tags) compatibility**

Your Seqera installation knows the nf-launcher image version it needs and specifies this value automatically when launching a pipeline.

If you're restricted from using public container registries, see Seqera Enterprise release instructions for the specific image to set as the default when invoking pipelines.

**Specify Nextflow version**

Each Seqera Platform release uses a specific nf-launcher image by default. This image is loaded with a specific Nextflow version that any workflow run in the container uses by default. Force your jobs to use a newer/older version of Nextflow with one of the following strategies:

- Use a [pre-run script](../launch/advanced#pre-and-post-run-scripts) to set the desired Nextflow version. For example: `export NXF_VER=22.08.0-edge`
- For jobs executing in an AWS Batch compute environment, create a [custom job definition](../enterprise/advanced-topics/custom-launch-container) which references a different nf-launcher image.

### Spot instance failures and retries in Nextflow

Up to version 24.10, Nextflow silently retried Spot instance failures up to five times when using AWS Batch or Google Batch. These retries were controlled by cloud-specific configuration parameters (e.g., `aws.batch.maxSpotAttempts`) and happened in cloud infrastructure without explicit visibility to Nextflow.

From version 24.10, the default Spot reclamation retry setting changed to `0` on AWS and Google. By default, no _internal_ retries are attempted on these platforms. Spot reclamations now lead to an immediate failure, exposed to Nextflow in the same way as other generic failures (returning, for example, `exit code 1` on AWS). Nextflow will treat these failures like any other job failure unless you actively configure a retry strategy.

**Impact on existing workflows**

If you rely on silent Spot retries (the previous default behavior), you may now see more tasks fail with the following characteristics:

- **AWS**: Generic failure with `exit code 1`. You may see messages indicating the host machine was terminated.
- **Google**: Spot reclamation typically produces a specific code, but is now surfaced as a recognizable task failure in Nextflow logs.

Since the default for Spot retries is now zero, you must actively enable a retry strategy if you want Nextflow to handle reclaimed Spot instances automatically. For more information, see [manage Spot interruptions](../tutorials/retry-strategy).

---
title: "FAQ"
description: "Frequently asked questions and troubleshooting."
date: "24 Apr 2023"
tags: [faq, help]
---

## API

**Maximum results returned**

Use pagination to fetch the results in smaller chunks through multiple API calls with `max` and `offset` parameters. The error below indidcates that you have run into the maximum result limit:

`{object} length parameter cannot be greater than 100 (current value={value_sent})`

To remedy this, see the example requests below:

```

curl -X GET "https://$TOWER_SERVER_URL/workflow/$WORKFLOW_ID/tasks?workspaceId=$WORKSPACE_ID&max=100" \

-H "Accept: application/json" \

-H "Authorization: Bearer $TOWER_ACCESS_TOKEN"



curl -X GET "https://$TOWER_SERVER_URL/workflow/$WORKFLOW_ID/tasks?workspaceId=$WORKSPACE_ID&max=100&offset=100" \

-H "Accept: application/json" \

-H "Authorization: Bearer $TOWER_ACCESS_TOKEN"

```

**Launch users: 403 HTTP response from requests to `/workflow/launch`**

Launch users have more restricted workspace permissions than maintainers, admins, and owners. To launch pipelines via API calls, Launch users must specify additional values that are optional for other users.

Attempting to launch a pipeline without specifying a `launch.id` in the API payload is equivalent to using **Start Quick Launch** in a workspace (a feature not available to Launch users).

Launch users must add a `launch.id` to pipeline launch requests:

1. Query the list of pipelines via the `/pipelines` endpoint. Find the `pipelineId` of the pipeline you intend to launch.
2. Call the `/pipelines/{pipelineId}/launch` API to retrieve the pipeline's `launch.id`.
3. Include the `launch.id` in your request to the `/workflow/launch` API endpoint:

   ```
   {
     "launch": {
       "id": "Q2kVavFZNVCBkC78foTvf",
       "computeEnvId": "4nqF77d6N1JoJrVrrgB8pH",
       "runName": "sample-run",
       "pipeline": "https://github.com/sample-repo/project",
       "workDir": "s3://myBucketName",
       "revision": "main"
     }
   }
   ```

Alternatively, upgrade your user role to 'Maintain' or higher to be able to quick-launch pipelines.

## Common Errors

**_Unknown pipeline repository or missing credentials_ error from public Github repositories**

GitHub imposes [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) on repository pulls (including public repositories), where unauthenticated requests are capped at 60 requests/hour and authenticated requests are capped at 5000/hour. Seqera Platform users tend to encounter this error due to the 60 request/hour cap.

Try the following:

1. Ensure there's at least one GitHub credential in your workspace's **Credentials** tab.
2. Ensure that the **Access token** field of all GitHub credential objects is populated with a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) value and **not** a user password. GitHub PATs are typically longer than passwords and include a `ghp_` prefix. For example:`ghp*IqIMNOZH6zOwIEB4T9A2g4EHMy8Ji42q4HA`
3. Confirm that your PAT is providing the elevated threshold and transactions are being charged against it:

   `curl -H "Authorization: token ghp_LONG_ALPHANUMERIC_PAT" -H "Accept: application/vnd.github.v3+json" https://api.github.com/rate_limit`

**_Row was updated or deleted by another transaction (or unsaved-value mapping was incorrect)_ error**

This error can occur if incorrect configuration values are assigned to the `backend` and `cron` containers' [`MICRONAUT_ENVIRONMENTS`](./enterprise/configuration/overview#compute-environments) environment variable. You may see other unexpected system behavior, like two exact copies of the same Nextflow job submitted to the executor for scheduling.

Please verify the following:

1. The `MICRONAUT_ENVIRONMENTS` environment variable associated with the `backend` container:
   - Contains `prod,redis,ha`
   - Does not contain `cron`
2. The `MICRONAUT_ENVIRONMENTS` environment variable associated with the `cron` container:
   - Contains `prod,redis,cron`
   - Does not contain `ha`
3. You don't have another copy of the `MICRONAUT_ENVIRONMENTS` environment variable defined elsewhere in your application (such as a `tower.env` file or Kubernetes `ConfigMap`).
4. If you're using a separate container/pod to execute `migrate-db.sh`, ensure there's no `MICRONAUT_ENVIRONMENTS` environment variable assigned to it.

**_No such variable_ error**

This error can occur if you execute a DSL 1-based Nextflow workflow using [Nextflow 22.03.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.03.0-edge) or later.

**Sleep commands in Nextflow workflows**

The `sleep` commands in your Nextflow workflows may differ in behavior depending on where they are:

- If used within an `errorStrategy` block, the Groovy sleep function will be used (which takes its value in milliseconds).
- If used within a process script block, that language's sleep binary/method will be used. **Example:** [this BASH script](https://www.nextflow.io/docs/latest/metrics.html?highlight=sleep) uses the BASH sleep binary, which takes its value in seconds.

## Containers

**Use rootless containers in Nextflow pipelines**

Most containers use the root user by default. However, some users prefer to define a non-root user in the container to minimize the risk of privilege escalation. Because Nextflow and its tasks use a shared work directory to manage input and output data, using rootless containers can lead to file permissions errors in some environments:

```
touch: cannot touch '/fsx/work/ab/27d78d2b9b17ee895b88fcee794226/.command.begin': Permission denied
```

This should not occur when using AWS Batch from Seqera version 22.1.0. In other situations, you can avoid this issue by forcing all task containers to run as root. Add one of the following snippets to your [Nextflow configuration](./launch/advanced#nextflow-config-file):

```
// cloud executors
process.containerOptions = "--user 0:0"

// Kubernetes
k8s.securityContext = [
  "runAsUser": 0,
  "runAsGroup": 0
]
```

## Databases

**Seqera Enterprise 22.2.0: Database connection failure**

Seqera Enterprise 22.2.0 introduced a breaking change whereby the `TOWER_DB_DRIVER` is now required to be `org.mariadb.jdbc.Driver`.

Clients who use Amazon Aurora as their database solution may encounter a _java.sql.SQLNonTransientConnectionException: ... could not load system variables_ error, likely due to a [known error](https://jira.mariadb.org/browse/CONJ-824) tracked within the MariaDB project.

Please modify the Seqera Enterprise configuration as follows to try resolving the problem:

1. Ensure your `TOWER_DB_DRIVER` uses the specified MariaDB URI.
2. Modify your `TOWER_DB_URL` to: `TOWER_DB_URL=jdbc:mysql://YOUR_DOMAIN:YOUR_PORT/YOUR_TOWER_DB?usePipelineAuth=false&useBatchMultiSend=false`

## Datasets

**API: Dataset upload failure**

When uploading datasets via the Seqera UI or CLI, some steps are automatically done on your behalf. To upload datasets via the Seqera API, additional steps are required:

1. Explicitly define the MIME type of the file being uploaded.
2. Make two calls to the API:
   1. Create a dataset object.
   2. Upload the samplesheet to the dataset object.

Example:

```bash
# Step 1: Create the dataset object.
$ curl -X POST "https://api.cloud.seqera.io/workspaces/$WORKSPACE_ID/datasets/" -H "Content-Type: application/json" -H "Authorization: Bearer $TOWER_ACCESS_TOKEN" --data '{"name":"placeholder", "description":"A placeholder for the data we will submit in the next call"}'

# Step 2: Upload the datasheet into the dataset object.
$ curl -X POST "https://api.cloud.seqera.io/workspaces/$WORKSPACE_ID/datasets/$DATASET_ID/upload"  -H "Accept: application/json"  -H "Authorization: Bearer $TOWER_ACCESS_TOKEN"  -H "Content-Type: multipart/form-data" -F "file=@samplesheet_full.csv; type=text/csv"
```

:::tip
You can also use the [tower-cli](https://github.com/seqeralabs/tower-cli) to upload the dataset to a particular workspace:

    ```bash
    tw datasets add --name "cli_uploaded_samplesheet" ./samplesheet_full.csv
    ```

:::

**Datasets converted to 'application/vnd.ms-excel' data type during upload using Firefox**

This is a known issue when using Firefox browser with Seqera versions older than 22.2.0. You can either (a) upgrade to 22.2.0 or higher, or (b) use Chrome.

Seqera displays this error for this issue:

```
"Given file is not a dataset file. Detected media type: 'application/vnd.ms-excel'. Allowed types: 'text/csv, text/tab-separated-values'"
```

**v22.2: TSV-formatted datasets not shown in Tower launch screen input field drop-down menu**

An issue was identified in Seqera version 22.2 which caused TSV datasets to be unavailable in the input data drop-down menu on the launch screen. This has been fixed in version 22.4.1.

## Email and TLS

**TLS errors**

Nextflow and Seqera Platform both have the ability to interact with email providers on your behalf. These providers often require TLS connections, with many now requiring at least TLSv1.2.

TLS connection errors can occur due to variability in the [default TLS version specified by your JDK distribution](https://aws.amazon.com/blogs/opensource/tls-1-0-1-1-changes-in-openjdk-and-amazon-corretto/). If you encounter any of the following errors, there is likely a mismatch between your default TLS version and what is supported by the email provider:

- _Unexpected error sending mail ... TLS 1.0 and 1.1 are not supported. Please upgrade/update your client to support TLS 1.2_
- _ERROR nextflow.script.WorkflowMetadata - Failed to invoke 'workflow.onComplete' event handler ... javax.net.ssl.SSLHandshakeException: No appropriate protocol (protocol is disabled or cipher suites are inappropriate)_

To fix the problem, try the following:

1. Set a JDK environment variable to force Nextflow and Seqera containers to use TLSv1.2 by default:

    ```
    export JAVA_OPTIONS="-Dmail.smtp.ssl.protocols=TLSv1.2"
    ```

2. Add this parameter to your [nextflow.config file](./launch/advanced#nextflow-config-file):

    ```
    mail {
        smtp.ssl.protocols = 'TLSv1.2'
    }
    ```

3. Ensure these values are also set for Nextflow and/or Seqera:

    -   `mail.smtp.starttls.enable=true`
    -   `mail.smtp.starttls.required=true`

## Git integration

**BitBucket authentication failure: _Can't retrieve revisions for pipeline - https://my.bitbucketserver.com/path/to/pipeline/repo - Cause: Get branches operation not supported by BitbucketServerRepositoryProvider provider_**

If you supplied the correct BitBucket credentials and URL details in your `tower.yml` and still experience this error, update your version to at least v22.3.0. This version addresses SCM provider authentication issues and is likely to resolve the retrieval failure described here.

## Healthcheck

**Seqera Platform API healthcheck endpoint**

To implement automated healthcheck functionality, use Seqera's `service-info` endpoint.

Example:

```
# Run a healthcheck and extract the HTTP response code:
$ curl -o /dev/null -s -w "%{http_code}\n" --connect-timeout 2  "https://api.cloud.seqera.io/service-info"  -H "Accept: application/json"
200
```

## Login

**Login failures: screen frozen at `/auth?success=true`**

From version 22.1, Seqera Enterprise implements stricter cookie security by default and will only send an auth cookie if the client is connected via HTTPS. Login attempts via HTTP fail by default.

Set the environment variable `TOWER_ENABLE_UNSAFE_MODE=true` to allow HTTP connectivity to Seqera (**not recommended for production environments**).

**Restrict Seqera access to a set of email addresses, or none**

Removing the email section from the login page is not currently supported. You can, however, restrict which email identities may log into your Seqera Enterprise instance using the `trustedEmails` configuration parameter in your `tower.yml` file:

```yaml
# tower.yml
tower:
  trustedEmails:
    # Any email address pattern which matches will have automatic access.
    - '*@seqera.io`
    - 'named_user@example.com'

    # Alternatively, specify a single entry to deny access to all other emails.
    - 'fake_email_address_which_cannot_be_accessed@your_domain.org'
```

Users with email addresses other than the `trustedEmails` list will undergo an approval process on the **Profile > Admin > Users** page. This has been used effectively as a backup method when SSO becomes unavailable.

:::note

1. You must rebuild your containers (`docker compose down`) to force Seqera to implement this change. Ensure your database is persistent before issuing the teardown command. See [here](./enterprise/docker-compose) for more information.
2. All login attempts are visible to the root user at **Profile > Admin panel > Users**.
3. Any user logged in prior to the restriction will not be subject to the new restriction. An admin of the organization should remove users that have previously logged in via (untrusted) email from the Admin panel users list. This will restart the approval process before they can log in via email.

:::

**Login failure: Admin approval is required when using Entra ID OIDC**

The Entra ID app integrated with Seqera must have user consent settings configured to "Allow user consent for apps" to ensure that admin approval is not required for each application login. See [User consent settings](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/configure-user-consent?pivots=portal#configure-user-consent-settings).

**Google SMTP: _Username and Password not accepted_ errors**

Previously functioning Seqera Enterprise email integration with Google SMTP likely to encounter errors as of May 30, 2022 due to a [security posture change](https://support.google.com/accounts/answer/6010255#more-secure-apps-how&zippy=%2Cuse-more-secure-apps) implemented by Google.

To re-establish email connectivity, see [these instructions](https://support.google.com/accounts/answer/3466521) to provision an app password. Update your `TOWER_SMTP_PASSWORD` environment variable with the app password, then restart the application.

## Logging

**v22.3.1: Broken Nextflow log file**

A Seqera Launcher issue has been identified that affects the Nextflow log file download in version 22.3.1. A patch was released in version 22.3.2 that addresses this behavior. Update to version 22.3.2 or later.

## Miscellaneous

**Maximum parallel Seqera browser tabs**

Due to a limitation of [server-side event technology implementation in HTTP/1.1](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events), up to five tabs can be open simultaneously (per browser product). Any more will remain stuck in a loading state.

## Monitoring

**Integration with 3rd-party Java-based Application Performance Monitoring (APM) solutions**

Mount the APM solution's JAR file in Seqera's `backend` container and set the agent JVM option via the `JAVA_OPTS` env variable.

**Retrieve the trace logs for a Seqera-based workflow run**

Although it's not possible to directly download the trace logs via Seqera, you can configure your workflow to export the file to persistent storage:

1. Set this block in your [`nextflow.config`](./launch/advanced#nextflow-config-file):

   ```nextflow
   trace {
       enabled = true
   }
   ```

2. Add a copy command to your pipeline's **Advanced options > Post-run script** field:

   ```
   # Example: Export the generated trace file to an S3 bucket
   # Ensure that your Nextflow head job has the necessary permissions to interact with the target storage medium
   aws s3 cp ./trace.txt s3://MY_BUCKET/trace/trace.txt
   ```

**Runs monitoring: Seqera Platform intermittently reports _Live events sync offline_**

Seqera Platform uses [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) to push real-time updates to your browser. The client must establish a connection to the server's `/api/live` endpoint to initiate the stream of data, and this connection can occasionally fail due to factors like network latency.

To resolve the issue, please try reloading the Seqera browser tab to reinitiate the client's connection to the server. If reloading fails to resolve the problem, please contact [Seqera support](https://support.seqera.io) for assistance with webserver timeout settings adjustments.

## Nextflow configuration

**Default Nextflow DSL version in Seqera**

From [Nextflow 22.03.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.03.0-edge), DSL2 is the default syntax.

To minimize disruption on existing pipelines, version 22.1.x and later are configured to default Nextflow head jobs to DSL 1 for a transition period (ending TBD).

You can force your Nextflow head job to use DSL2 syntax via any of the following techniques:

- Add `export NXF_DEFAULT_DSL=2` in the **Advanced Features > Pre-run script** field of Seqera Launch UI.

- Specify `nextflow.enable.dsl = 2` at the top of your Nextflow workflow file.

- Provide the `-dsl2` flag when invoking the Nextflow CLI (e.g., `nextflow run ... -dsl2`).

**Invoke Nextflow CLI run arguments during Seqera launch**

From Nextflow v22.09.1-edge, you can specify [Nextflow CLI run arguments](https://www.nextflow.io/docs/latest/cli.html?highlight=dump#run) when invoking a pipeline from Seqera. Set the `NXF_CLI_OPTS` environment variable via [pre-run script](./launch/advanced#pre-and-post-run-scripts):

```
# Example:
export NXF_CLI_OPTS='-dump-hashes'
```

**Cloud compute environment execution: `--outdir` artefacts not available**

Nextflow resolves relative paths against the current working directory. In a classic grid HPC, this normally corresponds to a subdirectory of the `$HOME` directory. In a cloud execution environment, however, the path will be resolved relative to the **container file system**, meaning files will be lost when the container is terminated. See [here](https://github.com/nextflow-io/nextflow/issues/2661#issuecomment-1047259845) for more details.

Specify the absolute path to your persistent storage using the `NXF_FILE_ROOT` environment variable in your [`nextflow.config`](./launch/advanced#nextflow-config-file) file. This resolves the relative paths defined in your Netflow script so that output files are written to your stateful storage, rather than ephemeral container storage.

**Nextflow: Ignore Singularity cache**

To ignore the Singularity cache, add this configuration item to your workflow: `process.container = 'file:///some/singularity/image.sif'`.

**Nextflow error: _WARN: Cannot read project manifest ... path=nextflow.config_**

This error can occur when executing a pipeline where the source Git repository's default branch is not populated with `main.nf` and `nextflow.config` files, regardless of whether the invoked pipeline is using a non-default revision/branch (e.g. `dev`).

Currently, you can resolve this by creating blank `main.nf` and `nextflow.config` files in the default branch. This will allow the pipeline to run, using the content of the `main.nf` and `nextflow.config` in your target revision.

**Use multiple Nextflow configuration files for different environments**

The main `nextflow.config` file will always be imported by default. Instead of managing multiple `nextflow.config` files (each customized for an environment), you can create unique environment config files and import them as [config profiles](https://www.nextflow.io/docs/latest/config.html#config-profiles) in the main `nextflow.config`.

Example:

```
// nextflow.config

<truncated>

profiles {
    test { includeConfig 'conf/test.config' }
    prod { includeConfig 'conf/prod.config' }
    uat  { includeConfig 'conf/uat.config'  }
}

<truncated>
```

**AWS S3 upload file size limits**

You may encounter _`WARN: Failed to publish file: s3://<bucket-name>`_ log messages, often related to AWS S3 object size limitations when using the multipart upload feature.

See the [AWS documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) for more information, particularly _maximum number of parts per upload_.

The following configuration is suggested to overcome AWS limitations:

- Head Job CPUs: 16
- Head Job Memory: 60000
- [Pre-run script](./launch/advanced#pre-and-post-run-scripts): `export NXF_OPTS="-Xms20G -Xmx40G"`
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

Ephemeral endpoints can only be consumed once. Nextflow versions older than `22.04` may try to call the same endpoint more than once, resulting in an error:

_Cannot parse params file: /ephemeral/example.json - Cause: Server returned HTTP response code: 403 for URL: https://api.tower.nf/ephemeral/example.json_

To resolve this problem, upgrade Nextflow to version `22.04.x` or later.

**Prevent Nextflow from uploading intermediate files from local scratch to AWS S3 work directory**

Nextflow will only unstage files/folders that have been explicitly defined as process outputs. If your workflow has processes that generate folder-type outputs, ensure that the process also purges any intermediate files in those folders. Otherwise, the intermediate files are copied as part of the task unstaging process, resulting in additional storage costs and lengthened pipeline execution times.

**Values specified in Git repository `nextflow.config` change during Seqera launch**

Some values specified in your pipeline repository's `nextflow.config` may change when the pipeline is invoked via Seqera. This occurs because Seqera is configured with a set of default values that override the pipeline configuration.

**Example:**
The following code block is specified in your `nextflow.config`:

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

To force the Seqera-invoked job to use your `nextflow.config` value, add the configuration setting in the workspace Launch screen's [**Nextflow config file** field](./launch/launchpad). For our example above, you would add `aws.client.uploadChunkSize = 209715200 // 200 MB`.

Nextflow configuration values affected by this behaviour include:

- aws.client.uploadChunkSize
- aws.client.storageEncryption

**Fusion v1 execution: _Missing output file(s) [X] expected by process [Y]_ error**

Fusion v1 has a limitation which causes tasks that run for less than 60 seconds to fail as the output file generated by the task is not yet detected by Nextflow. This is a limitation inherited from a Goofys driver used by the Fusion v1 implementation. [Fusion v2](./supported_software/fusion/overview) resolves this issue.

If you can't update to Fusion v2, this issue can be addressed by instructing Nextflow to wait for 60 seconds after the task completes.

From **Advanced options > Nextflow config file** in **Pipeline settings**, add this line to your Nextflow configuration:

```
process.afterScript = 'sleep 60'
```

**Jobs remain in RUNNING status when a pipeline run is canceled**

Your instance's behavior when canceling a run depends on the Nextflow [`errorStrategy`](https://www.nextflow.io/docs/latest/process.html#errorstrategy) defined in your process script. If the process `errorStrategy` is set to `finish`, an orderly pipeline shutdown is initiated when you cancel (or otherwise interrupt) a run. This instructs Nextflow to wait for the completion of any submitted jobs. To ensure that all jobs are terminated when your run is canceled, set `errorStrategy` to `terminate` in your Nextflow config. For example:

```bash

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

```bash

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

## Nextflow Launcher

**Seqera Platform / [nf-launcher image](https://quay.io/repository/seqeralabs/nf-launcher?tab=tags) compatibility**

Your Seqera installation knows the nf-launcher image version it needs and will specify this value automatically when launching a pipeline.

If you're restricted from using public container registries, see Seqera Enterprise release instructions for the specific image to set as the default when invoking pipelines.

**Specify Nextflow version**

Each Seqera Platform release uses a specific nf-launcher image by default. This image is loaded with a specific Nextflow version that any workflow run in the container uses by default. Force your jobs to use a newer/older version of Nextflow with one of the following strategies:

- Use a [pre-run script](./launch/advanced#pre-and-post-run-scripts) to set the desired Nextflow version. For example: `export NXF_VER=22.08.0-edge`
- For jobs executing in an AWS Batch compute environment, create a [custom job definition](./enterprise/advanced-topics/custom-launch-container) which references a different nf-launcher image.

## Optimization

**Optimized task failures: _OutOfMemoryError: Container killed due to memory usage_ error**

Improvements are being made to the way Nextflow calculates the optimal memory needed for containerized tasks, which will resolve issues with underestimating memory allocation in an upcoming release.

A temporary workaround for this issue is to implement a `retry` error strategy in the failing process that will increase the allocated memory each time the failed task is retried. Add the following `errorStrategy` block to the failing process:

```bash
process {
    errorStrategy = 'retry'
    maxRetries    = ​3
    memory  = 1.GB * task.attempt
}
```

## Plugins

**Use the Nextflow SQL DB plugin to query AWS Athena**

From [Nextflow 22.05.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.05.0-edge), your Nextflow pipelines can query data from AWS Athena. Add these configuration items to your `nextflow.config` (**Note:** the use of secrets is optional):

```
plugins {
  id 'nf-sqldb@0.4.0'
}

sql {
    db {
        'athena' {
              url = 'jdbc:awsathena://AwsRegion=YOUR_REGION;S3OutputLocation=s3://YOUR_S3_BUCKET'
              user = secrets.ATHENA_USER
              password = secrets.ATHENA_PASSWORD
            }
    }
}
```

Then, call the functionality in your workflow:

```
// Example
  channel.sql.fromQuery("select * from test", db: "athena", emitColumns:true).view()
}
```

See [here](https://github.com/nextflow-io/nf-sqldb/discussions/5) for more information.

## Repositories

**Private Docker registry integration**

Seqera-invoked jobs can pull container images from private Docker registries, such as JFrog Artifactory. The method to enable this depends on your computing platform.

For **AWS Batch**, modify your EC2 Launch Template using [these AWS instructions](https://aws.amazon.com/blogs/compute/how-to-authenticate-private-container-registries-using-aws-batch/).

:::note
This solution requires Docker Engine [17.07 or greater](https://docs.docker.com/engine/release-notes/17.07/), to use `--password-stdin`.<br/>

    You may need to add additional commands to your Launch template, depending on your security posture:<br/>
    `cp /root/.docker/config.json /home/ec2-user/.docker/config.json && chmod 777 /home/ec2-user/.docker/config.json`

:::

For **Azure Batch**, create a **Container registry**-type credential in your Seqera workspace and associate it with the Azure Batch compute environment defined in the same workspace.

For **Kubernetes**, use an `imagePullSecret`, per [#2827](https://github.com/nextflow-io/nextflow/issues/2827).

**Nextflow error: _Remote resource not found_**

This error can occur if the Nextflow head job fails to retrieve the necessary repository credentials from Seqera. If your Nextflow log contains an entry like `DEBUG nextflow.scm.RepositoryProvider - Request [credentials -:-]`, check the protocol of your instance's `TOWER_SERVER_URL` configuration value. This must be set to `https` rather than `http` (unless you are using `TOWER_ENABLE_UNSAFE_MODE` to allow HTTP connections to Seqera in a test environment).

## Secrets

**_Missing AWS execution role arn_ error during Seqera launch**

The [ECS Agent must have access](https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html) to retrieve secrets from the AWS Secrets Manager. Secrets-using pipelines launched from your instance in an AWS Batch compute environment will encounter this error if an IAM Execution Role is not provided. See [Secrets](./secrets/overview) for more information.

**AWS Batch task failures with secrets**

You may encounter errors when executing pipelines that use secrets via AWS Batch:

- If you use nf-sqldb version 0.4.1 or earlier and have secrets in your `nextflow.config`, you may encounter _nextflow.secret.MissingSecretException: Unknown config secret_ errors in your Nextflow log.<br/>
  Resolve this error by explicitly defining the `xpack-amzn` plugin in your configuration:<br/>

  ```
  plugins {
    id 'xpack-amzn'
    id 'nf-sqldb'
  }
  ```

- If you have two or more processes that use the same container image, but only a subset of these processes use secrets, your secret-using processes may fail during the initial run and then succeed when resumed. This is due to a bug in how Nextflow (`22.07.1-edge` and earlier) registers jobs with AWS Batch.

  To resolve the issue, upgrade your Nextflow to version `22.08.0-edge` or later. If you cannot upgrade, use the following as workarounds:

  - Use a different container image for each process.
  - Define the same set of secrets in each process that uses the same container image.

## Tower Agent

**"_Unexpected Exception in WebSocket [...]: Operation timed out java.io.IOException: Operation timed out_" error**

We have improved Tower Agent reconnection logic with the release of version 0.5.0. [Update your Tower Agent version](https://github.com/seqeralabs/tower-agent) before relaunching your pipeline.

## tw CLI

**Connection errors when creating or viewing AWS Batch compute environments with `tw compute-envs` commands**

tw CLI v0.8 and earlier does not support the `SPOT_PRICE_CAPACITY_OPTIMIZED` [allocation strategy](./compute-envs/aws-batch#advanced-options) in AWS Batch. Creating or viewing AWS Batch compute environments with this allocation strategy will lead to errors. This issue will be [addressed in CLI v0.9](https://github.com/seqeralabs/tower-cli/issues/332).

**Segfault errors**

Users of legacy `tw` CLI versions may experience segmentation faults in older operating systems.

To resolve segfault errors, first upgrade your tw CLI to the latest available version. If errors persist, use our alternative Java [JAR-based solution](https://github.com/seqeralabs/tower-cli/releases/download/v0.8.0/tw.jar).

**Insecure HTTP errors**

_ERROR: You are trying to connect to an insecure server: `http://hostname:port/api` if you want to force the connection use '--insecure'. NOT RECOMMENDED!_

This error indicates that your Seqera host accepts connections using insecure HTTP instead of HTTPS. If your host cannot be configured to accept HTTPS connections, add the `--insecure` flag **before** your CLI command:

```
$ tw --insecure info
```

:::caution
HTTP must not be used in production environments.
:::

**Resume/relaunch runs with tw CLI**

Runs can be [relaunched](./launch/cache-resume#relaunch-a-workflow--run) with `tw runs relaunch` .

```
$ tw runs relaunch -i 3adMwRdD75ah6P -w 161372824019700

  Workflow 5fUvqUMB89zr2W submitted at [org / private] workspace.


$ tw runs list -w 161372824019700

  Pipeline runs at [org / private] workspace:

     ID             | Status    | Project Name   | Run Name        | Username    | Submit Date
    ----------------+-----------+----------------+-----------------+-------------+-------------------------------
     5fUvqUMB89zr2W | SUBMITTED | nf/hello       | magical_darwin  | seqera-user | Tue, 10 Sep 2022 14:40:52 GMT
     3adMwRdD75ah6P | SUCCEEDED | nf/hello       | high_hodgkin    | seqera-user | Tue, 10 Sep 2022 13:10:50 GMT

```

## Workspaces

\*Seqera-invoked pipeline contacting a workspace other than the launch workspace\*\*

You may encounter this entry in your Nextflow log:

_Unexpected response for request http://TOWER_SERVER_URL/api/trace/TRACE_ID/begin?workspaceId=WORKSPACE_ID_

If the workspace ID in this message differs from your launch workspace, Seqera retrieved an incorrect Seqera access token from a Nextflow configuration file:

- A Seqera access token may be hardcoded in the `tower.accessToken` block of your `nextflow.config` (either from the Git repository or an override value in the Seqera launch form).
- In an HPC cluster compute environment, the credential user's home directory may contain a stateful `nextflow.config` with a hardcoded access token (e.g., `~/.nextflow/config`).

## AWS

### EBS

**EBS Autoscaling: EBS volumes remain active after job completion**

The EBS autoscaling solution relies on an AWS-provided script which runs on each container host. This script performs AWS EC2 API requests to delete EBS volumes when the jobs using those volumes have been completed.

When running large Batch clusters (hundreds of compute nodes or more), EC2 API rate limits may cause the deletion of unattached EBS volumes to fail. Volumes that remain active after Nextflow jobs have been completed will incur additional costs and should therefore be manually deleted.

You can monitor your AWS account for any orphaned EBS volumes via the EC2 console or with a Lambda function. See [here](https://aws.amazon.com/blogs/mt/controlling-your-aws-costs-by-deleting-unused-amazon-ebs-volumes/) for more information.

### ECS

**ECS Agent Docker image pull frequency**

As part of the AWS Batch creation process, Batch Forge will set ECS Agent parameters in the EC2 launch template that is created for your cluster's EC2 instances:

- For clients using Seqera Enterprise v22.01 or later:
  - Any AWS Batch environment created by Batch Forge will set the ECS Agent's `ECS_IMAGE_PULL_BEHAVIOUR` to `once`.
- For clients using Seqera Enterprise v21.12 or earlier:
  - Any AWS Batch environment created by Batch Forge will set the ECS Agent's `ECS_IMAGE_PULL_BEHAVIOUR` to `default`.

See the [AWS ECS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) for an in-depth explanation of this difference.

:::note
This behaviour can't be changed within Seqera Platform.
:::

**_CannotPullContainerError: Error response from daemon: error parsing HTTP 429 response body: invalid character 'T' looking for beginning of value: "Too Many Requests (HAP429)"_**

Docker Hub imposes a rate limit of 100 anonymous pulls per 6 hours. Add the following to your launch template to avoid this issue:

`echo ECS_IMAGE_PULL_BEHAVIOR=once >> /etc/ecs/ecs.config`

**_CannotInspectContainerError_**

If your run fails with an _Essential container in task exited - CannotInspectContainerError: Could not transition to inspecting; timed out after waiting 30s_ error, try the following:

1. Upgrade your [ECS Agent](https://github.com/aws/amazon-ecs-agent/releases) to [1.54.1](https://github.com/aws/amazon-ecs-agent/pull/2940) or newer. See [here](https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ECS/latest-agent-version.html) for instructions to check your ECS Agent version.
2. Provision more storage for your EC2 instance (preferably via EBS-autoscaling to ensure scalability).
3. If the error is accompanied by _command exit status: 123_ and a _permissions denied_ error tied to a system command, ensure that the ECS Agent binary is set to be executable (`chmod u+x`).

### Queues

**Multiple AWS Batch queues for a single job execution**

Although you can only create/identify a single work queue during the definition of your AWS Batch compute environment in Seqera, you can spread tasks across multiple queues when your job is sent to Batch for execution via your pipeline configuration.

Add the following snippet to your `nextflow.config`, or the **Advanced Features > Nextflow config file** field of the Seqera Launch UI, for processes to be distributed across two AWS Batch queues, depending on the assigned name.

```bash
# nextflow.config

process {
  withName: foo {
    queue: `TowerForge-1jJRSZmHyrrCvCVEOhmL3c-work`
  }
}

process {
  withName: bar {
    queue: `custom-second-queue`
  }
}
```

### Storage

**Enable pipelines to write to S3 buckets that enforces AES256 server-side encryption**

If you need to save files to an S3 bucket with a policy that [enforces AES256 server-side encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html), the [nf-launcher](https://quay.io/repository/seqeralabs/nf-launcher?tab=tags) script which invokes the Nextflow head job requires additional configuration:

1. Add the following configuration to the **Advanced options > Nextflow config file** textbox of the **Launch Pipeline** screen:

   ```
   aws {
     client {
       storageEncryption = 'AES256'
     }
   }
   ```

2. Add the following configuration to the **Advanced options > Pre-run script** textbox of the **Launch Pipeline** screen:

   ```bash
   export TOWER_AWS_SSE=AES256
   ```

**Note:** This solution requires Seqera v21.10.4 and Nextflow [22.04.0](https://github.com/nextflow-io/nextflow/releases/tag/v22.04.0) or later.

## Azure

### Batch compute environments

**Use separate Batch pools for head and compute nodes**

:::warning
After September 30, 2025 low-priority VMs are only available in user subscription pool allocation mode Batch accounts. See the [Microsoft migration guide](https://learn.microsoft.com/en-us/azure/batch/low-priority-vms-retirement-migration-guide) for more information.
:::

The default Azure Batch implementation in Seqera Platform uses a single pool for head and compute nodes. This means that all jobs spawn dedicated/on-demand VMs by default. To save cloud costs by using low priority VMs for compute jobs, specify separate pools for head and compute jobs:

1. Create two Batch pools in Azure:
    - One Dedicated
    - One [Low priority](https://learn.microsoft.com/en-us/azure/batch/batch-spot-vms#differences-between-spot-and-low-priority-vms).
    - **Note**: Both pools must meet the requirements of a pre-existing pool as detailed in the [Nextflow documentation](https://www.nextflow.io/docs/latest/azure.html#requirements-on-pre-existing-named-pools).
2. Create a manual [Azure Batch](./compute-envs/azure-batch#manual) compute environment in Seqera Platform.
3. In **Compute pool name** (step 10 in the guide linked above), specify your dedicated Batch pool.
4. Specify the Low priority pool using the `process.queue` [directive](https://www.nextflow.io/docs/latest/process.html#queue) in your `nextflow.config` file (either via the launch form, or your pipeline repository's `nextflow.config` file).

### AKS

**_... /.git/HEAD.lock: Operation not supported_ error**

This problem can occur if your Nextflow pod uses an Azure Files-type (SMB) Persistent Volume as its storage medium. By default, the `jgit` library used by Nextflow attempts a filesystem link operation which [is not supported](https://docs.microsoft.com/en-us/azure/storage/files/files-smb-protocol?tabs=azure-portal#limitations) by Azure Files (SMB).

To avoid this problem, add the following code snippet in your pipeline's [**Pre-run script**](./launch/advanced#pre-and-post-run-scripts) field:

```bash
cat <<EOT > ~/.gitconfig
[core]
	supportsatomicfilecreation = true
EOT
```

### SSL

**_Problem with the SSL CA cert (path? access rights?)_ error**

This can occur if a tool/library in your task container requires SSL certificates to validate the identity of an external data source.

Mount SSL certificates into the container to resolve this issue. See [SSL/TLS](./enterprise/configuration/ssl_tls#configure-seqera-to-trust-your-private-certificate) for more information.

**Azure SQL database error: _Connections using insecure transport are prohibited while --require_secure_transport=ON_**

This error is due to Azure's default MySQL behavior which enforces the SSL connections between your server and client application, as detailed [here](https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-ssl-connection-security). To fix this, append `useSSL=true&enabledSslProtocolSuites=TLSv1.2&trustServerCertificate=true` to your `TOWER_DB_URL` connection string. For example:

`TOWER_DB_URL=jdbc:mysql://azuredatabase.com/tower?serverTimezone=UTC&useSSL=true&enabledSslProtocolSuites=TLSv1.2&trustServerCertificate=true`

## Google

**VM preemption causes task interruptions**

Running your pipelines on preemptible VMs provides significant cost savings, but increases the likelihood that a task will be interrupted before completion. It is a recommended best practice to implement a retry strategy when you encounter [exit codes](https://cloud.google.com/life-sciences/docs/troubleshooting#retrying_after_encountering_errors) that are commonly related to preemption. For example:

```config
process {
  errorStrategy = { task.exitStatus in [8,10,14] ? 'retry' : 'finish' }
  maxRetries    = 3
  maxErrors     = '-1'
}
```

**Seqera Service account permissions for GLS and GKE**

The following roles must be granted to the `nextflow-service-account`:

1. Cloud Life Sciences Workflows Runner
2. Service Account User
3. Service Usage Consumer
4. Storage Object Admin

For detailed information, see [this guide](https://cloud.google.com/life-sciences/docs/tutorials/nextflow#create_a_service_account_and_add_roles).

## Kubernetes

**_Invalid value: "xxx": must be less or equal to memory limit_ error**

This error may be encountered when you specify a value in the **Head Job memory** field during the creation of a Kubernetes-type compute environment.

If you receive an error that includes _field: spec.containers[x].resources.requests_ and _message: Invalid value: "xxx": must be less than or equal to memory limit_, your Kubernetes cluster may be configured with [system resource limits](https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/) which deny the Nextflow head job's resource request. To isolate the component causing the problem, try to launch a pod directly on your cluster via your Kubernetes administration solution. For example:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: debug
  labels:
    app: debug
spec:
  containers:
    - name: debug
      image: busybox
      command: ["sh", "-c", "sleep 10"]
      resources:
        requests:
          memory: "xxxMi" # or "xxxGi"
  restartPolicy: Never
```

## On-Prem HPC

**_java: command not found_ error**

When submitting jobs to your on-prem HPC (using either SSH or Tower Agent authentication), the following error may appear in your Nextflow logs, even with Java on your `$PATH` environment variable:

```
java: command not found
Nextflow is trying to use the Java VM defined for the following environment variables:
  JAVA_CMD: java
  NXF_OPTS:
```

Possible reasons for this error:

1. The queue where the Nextflow head job runs is in a different environment/node than your login node userspace.
2. If your HPC cluster uses modules, the Java module may not be loaded by default.

To troubleshoot:

1. Open an interactive session with the head job queue.
2. Launch the Nextflow job from the interactive session.
3. If your cluster uses modules:
   - Add `module load <your_java_module>` in the **Advanced Features > Pre-run script** field when creating your HPC compute environment in Seqera.
4. If your cluster doesn't use modules:
   1. Source an environment with Java and Nextflow using the **Advanced Features > Pre-run script** field when creating your HPC compute environment in Seqera.

**Pipeline submissions to HPC clusters fail for some users**

Nextflow launcher scripts will fail if processed by a non-Bash shell (e.g., `zsh`, `tcsh`). This problem can be identified from certain error entries:

1. Your _.nextflow.log_ contains an error like _Invalid workflow status - expected: SUBMITTED; current: FAILED_.
2. Your Seqera **Error report** tab contains an error like:

```yaml
Slurm job submission failed
- command: mkdir -p /home//\<USERNAME\>//scratch; cd /home//\<USERNAME\>//scratch; echo <LONG_BASE64_STRING> | base64 -d > nf-<RUN-ID>.launcher.sh; sbatch ./nf-<RUN-ID>.launcher.sh
- exit   : 1
- message: Submitted batch job <#>
```

Connect to the head node via SSH and run `ps -p $$` to verify your default shell. If you see an entry other than Bash, fix as follows:

1. Check which shells are available to you: `cat /etc/shells`
2. Change your shell: `chsh -s /usr/bin/bash` (the path to the binary may differ, depending on your HPC configuration)
3. If submissions continue to fail after this shell change, ask your Seqera Platform admin to restart the **backend** and **cron** containers, then submit again.

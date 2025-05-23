---
title: "General troubleshooting"
description: "Troubleshooting Seqera Platform"
date: "24 Apr 2023"
tags: [troubleshooting, help]
---

## Common errors

**_timeout is not an integer or out of range_** or **_ERR timeout is not an integer or out of range_**

This error can occur if you're using Seqera Platfrom v24.2 upwards and have an outdated version of Redis. From v24.2 Redis version 6.2 or greater is required. Follow your cloud provider specifications to upgrade your instance.

**_Unknown pipeline repository or missing credentials_ error from public GitHub repositories**

GitHub imposes [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) on repository pulls (including public repositories), where unauthenticated requests are capped at 60 requests/hour and authenticated requests are capped at 5000 requests/hour. Seqera Platform users tend to encounter this error due to the 60 requests/hour cap.

Try the following:

1. Ensure there's at least one GitHub credential in your workspace's **Credentials** tab.
2. Ensure that the **Access token** field of all GitHub credential objects is populated with a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) value and **not** a user password. GitHub PATs are typically longer than passwords and include a `ghp_` prefix. For example: `ghp*IqIMNOZH6zOwIEB4T9A2g4EHMy8Ji42q4HA`
3. Confirm that your PAT is providing the elevated threshold and transactions are being charged against it:

   `curl -H "Authorization: token ghp_LONG_ALPHANUMERIC_PAT" -H "Accept: application/vnd.github.v3+json" https://api.github.com/rate_limit`

**_Row was updated or deleted by another transaction (or unsaved-value mapping was incorrect)_ error**

This error can occur if incorrect configuration values are assigned to the `backend` and `cron` containers' [`MICRONAUT_ENVIRONMENTS`](https://docs.seqera.io/platform-enterprise/latest/enterprise/configuration/overview#compute-environments) environment variable. You may see other unexpected system behavior, like two exact copies of the same Nextflow job submitted to the executor for scheduling.

Verify the following:

1. The `MICRONAUT_ENVIRONMENTS` environment variable associated with the `backend` container:
   - Contains `prod,redis,ha`
   - Does not contain `cron`
2. The `MICRONAUT_ENVIRONMENTS` environment variable associated with the `cron` container:
   - Contains `prod,redis,cron`
   - Does not contain `ha`
3. You don't have another copy of the `MICRONAUT_ENVIRONMENTS` environment variable defined elsewhere in your application (such as a `tower.env` file or Kubernetes `ConfigMap`).
4. If you're using a separate container/pod to execute `migrate-db.sh`, ensure there's no `MICRONAUT_ENVIRONMENTS` environment variable assigned to it.

**_No such variable_ error**

This error can occur if you execute a DSL1-based Nextflow workflow using [Nextflow 22.03.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.03.0-edge) or later.

**Sleep commands in Nextflow workflows**

The `sleep` commands in your Nextflow workflows may differ in behavior depending on where they are:

- If used within an `errorStrategy` block, the Groovy sleep function will be used (which takes its value in milliseconds).
- If used within a process script block, that language's sleep binary/method will be used. For example, [this bash script](https://www.nextflow.io/docs/latest/metrics.html?highlight=sleep) uses the bash sleep binary, which takes its value in seconds.


**Large number of batch job definitions**

Platform normally looks for an existing job definition that matches your workflow requirement. If nothing matches, it recreates the job definition. You can use a simple bash script to clear job definitions. You can tailor this according to your needs, e.g., deregister only job definitions older than x days.

```bash
jobs=$(aws --region eu-west-1 batch describe-job-definitions | jq -r .jobDefinitions[].jobDefinitionArn)

for x in $jobs; do 
  echo "Deregister $x"; 
  sleep 0.01;  
  aws --region eu-west-1 batch deregister-job-definition --job-definition $x; 
done
```

## Containers

**Use rootless containers in Nextflow pipelines**

Most containers use the root user by default. However, some users prefer to define a non-root user in the container to minimize the risk of privilege escalation. Because Nextflow and its tasks use a shared work directory to manage input and output data, using rootless containers can lead to file permissions errors in some environments:

```
touch: cannot touch '/fsx/work/ab/27d78d2b9b17ee895b88fcee794226/.command.begin': Permission denied
```

This should not occur when using AWS Batch from Seqera version 22.1.0. In other situations, you can avoid this issue by forcing all task containers to run as root. Add one of the following snippets to your [Nextflow configuration](../launch/advanced#nextflow-config-file):

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

If you use Amazon Aurora as your database solution, you may encounter a _java.sql.SQLNonTransientConnectionException: ... could not load system variables_ error, likely due to a [known error](https://jira.mariadb.org/browse/CONJ-824) tracked within the MariaDB project.

Please modify the Seqera Enterprise configuration as follows to try resolving the problem:

1. Ensure your `TOWER_DB_DRIVER` uses the specified MariaDB URI.
2. Modify your `TOWER_DB_URL` to: `TOWER_DB_URL=jdbc:mysql://YOUR_DOMAIN:YOUR_PORT/YOUR_TOWER_DB?usePipelineAuth=false&useBatchMultiSend=false`

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

2. Add this parameter to your [nextflow.config file](../launch/advanced#nextflow-config-file):

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

To implement automated healthcheck functionality, use Seqera's `service-info` endpoint. For example:

```
curl -o /dev/null -s -w "%{http_code}\n" --connect-timeout 2  "https://api.cloud.seqera.io/service-info"  -H "Accept: application/json"
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

1. You must rebuild your containers (`docker compose down`) to force Seqera to implement this change. Ensure your database is persistent before issuing the teardown command. See [here](https://docs.seqera.io/platform-enterprise/latest/enterprise/docker-compose) for more information.
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

1. Set this block in your [`nextflow.config`](../launch/advanced#nextflow-config-file):

   ```nextflow
   trace {
       enabled = true
   }
   ```

2. Add a copy command to your pipeline's **Advanced options > Post-run script** field:

   ```
   aws s3 cp ./trace.txt s3://MY_BUCKET/trace/trace.txt
   ```

**Runs monitoring: Seqera Platform intermittently reports _Live events sync offline_**

Seqera Platform uses [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) to push real-time updates to your browser. The client must establish a connection to the server's `/api/live` endpoint to initiate the stream of data, and this connection can occasionally fail due to factors like network latency.

To resolve the issue, try reloading the Platform browser tab to reinitiate the client's connection to the server. If reloading fails to resolve the problem, contact [Seqera support](https://support.seqera.io) for assistance with webserver timeout settings adjustments.


## Optimization

**Optimized task failures: _OutOfMemoryError: Container killed due to memory usage_ error**

Improvements are being made to the way Nextflow calculates the optimal memory needed for containerized tasks, which will resolve issues with underestimating memory allocation in an upcoming release.

A temporary workaround for this issue is to implement a `retry` error strategy in the failing process that will increase the allocated memory each time the failed task is retried. Add the following `errorStrategy` block to the failing process:

```bash
process {
    errorStrategy = 'retry'
    maxRetries    = 3
    memory = { 1.GB * task.attempt }
}
```

## Plugins

**Use the Nextflow SQL DB plugin to query AWS Athena**

From [Nextflow 22.05.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.05.0-edge), your Nextflow pipelines can query data from AWS Athena. Add these configuration items to your `nextflow.config`. The use of secrets is optional:

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

The [ECS Agent must have access](https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html) to retrieve secrets from the AWS Secrets Manager. Secrets-using pipelines launched from your instance in an AWS Batch compute environment will encounter this error if an IAM Execution Role is not provided. See [Secrets](../secrets/overview) for more information.

**AWS Batch task failures with secrets**

You may encounter errors when executing pipelines that use secrets via AWS Batch:

- If you use `nf-sqldb` version 0.4.1 or earlier and have secrets in your `nextflow.config`, you may encounter _nextflow.secret.MissingSecretException: Unknown config secret_ errors in your Nextflow log.
  Resolve this error by explicitly defining the `xpack-amzn` plugin in your configuration:

  ```
  plugins {
    id 'xpack-amzn'
    id 'nf-sqldb'
  }
  ```

- If you have two or more processes that use the same container image, but only a subset of these processes use secrets, your secret-using processes may fail during the initial run and then succeed when resumed. This is due to a bug in how Nextflow (22.07.1-edge and earlier) registers jobs with AWS Batch.

  To resolve the issue, upgrade your Nextflow to version 22.08.0-edge or later. If you cannot upgrade, use the following as workarounds:

  - Use a different container image for each process.
  - Define the same set of secrets in each process that uses the same container image.

## Tower Agent

**"_Unexpected Exception in WebSocket [...]: Operation timed out java.io.IOException: Operation timed out_" error**

We have improved Tower Agent reconnection logic with the release of version 0.5.0. [Update your Tower Agent version](https://github.com/seqeralabs/tower-agent) before relaunching your pipeline.

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

**Seqera Service account permissions for Google Life Sciences and GKE**

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

## On-prem HPC

**_java: command not found_ error**

When submitting jobs to your on-prem HPC (using either SSH or Tower Agent authentication), the following error may appear in your Nextflow logs, even with Java on your `PATH` environment variable:

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

---
title: "General troubleshooting"
description: "Troubleshooting Seqera Platform"
date: "24 Apr 2023"
tags: [troubleshooting, help]
---

When working with Seqera Platform, you might encounter the following issues.

## Common errors

#### `timeout is not an integer or out of range`

This error occurs on Seqera Platform v24.2 and later when Redis is outdated. Version 24.2 requires Redis 6.2 or later. To resolve, upgrade your Redis instance according to your cloud provider's instructions.

#### `Unknown pipeline repository or missing credentials` from public GitHub repositories

GitHub imposes [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) on repository pulls, including public repositories: unauthenticated requests are capped at 60 per hour and authenticated requests at 5000 per hour. This error is usually caused by the 60-per-hour cap.

To resolve:

1. Ensure there's at least one GitHub credential in your workspace's **Credentials** tab.
2. Ensure the **Access token** field of every GitHub credential is populated with a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) and **not** a user password. GitHub personal access tokens (PATs) are typically longer than passwords and include a `ghp_` prefix. For example: `ghp_IqIMNOZH6zOwIEB4T9A2g4EHMy8Ji42q4HA`
3. Confirm that your PAT provides the elevated threshold and that transactions are charged against it:

   `curl -H "Authorization: token ghp_LONG_ALPHANUMERIC_PAT" -H "Accept: application/vnd.github.v3+json" https://api.github.com/rate_limit`

#### `Row was updated or deleted by another transaction (or unsaved-value mapping was incorrect)`

This error occurs when incorrect configuration values are assigned to the `backend` and `cron` containers' [`MICRONAUT_ENVIRONMENTS`](../enterprise/configuration/overview#compute-environments) environment variable. You might see other unexpected behavior, such as two exact copies of the same Nextflow job submitted to the executor for scheduling.

Verify the following:

1. The `MICRONAUT_ENVIRONMENTS` environment variable associated with the `backend` container:
   - Contains `prod,redis,ha`
   - Does not contain `cron`
2. The `MICRONAUT_ENVIRONMENTS` environment variable associated with the `cron` container:
   - Contains `prod,redis,cron`
   - Does not contain `ha`
3. You don't have another copy of the `MICRONAUT_ENVIRONMENTS` environment variable defined elsewhere in your application (such as a `tower.env` file or Kubernetes `ConfigMap`).
4. If you're using a separate container/pod to execute `migrate-db.sh`, ensure there's no `MICRONAUT_ENVIRONMENTS` environment variable assigned to it.

#### `No such variable`

This error occurs when you execute a DSL1-based Nextflow workflow with [Nextflow 22.03.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.03.0-edge) or later.

#### Sleep commands in Nextflow workflows

The behavior of `sleep` commands in your Nextflow workflows depends on where they are used:

- In an `errorStrategy` block, Nextflow uses the Groovy sleep function, which takes its value in milliseconds.
- In a process script block, that language's sleep binary or method is used. For example, [this bash script](https://docs.seqera.io/nextflow/metrics) uses the bash sleep binary, which takes its value in seconds.

#### Large number of batch job definitions

Platform normally looks for an existing job definition that matches your workflow requirement. If nothing matches, it recreates the job definition. Use a bash script to clear job definitions. Tailor it to your needs, for example to deregister only job definitions older than a set number of days:

```bash
jobs=$(aws --region eu-west-1 batch describe-job-definitions | jq -r .jobDefinitions[].jobDefinitionArn)

for x in $jobs; do
  echo "Deregister $x";
  sleep 0.01;
  aws --region eu-west-1 batch deregister-job-definition --job-definition $x;
done
```

## Containers

#### Use rootless containers in Nextflow pipelines

Most containers use the root user by default. Some users prefer a non-root user in the container to minimize the risk of privilege escalation. Because Nextflow and its tasks use a shared work directory to manage input and output data, rootless containers can cause file permission errors in some environments:

```
touch: cannot touch '/fsx/work/ab/27d78d2b9b17ee895b88fcee794226/.command.begin': Permission denied
```

This should not occur with AWS Batch from Seqera version 22.1.0. In other cases, force all task containers to run as root. Add one of the following to your [Nextflow configuration](../launch/advanced#nextflow-config-file):

```groovy
// cloud executors
process.containerOptions = "--user 0:0"

// Kubernetes
k8s.securityContext = [
  "runAsUser": 0,
  "runAsGroup": 0
]
```

## Databases

#### Database connection failure in Seqera Enterprise 22.2.0

Seqera Enterprise 22.2.0 introduced a breaking change: `TOWER_DB_DRIVER` must now be `org.mariadb.jdbc.Driver`.

If you use Amazon Aurora as your database, you might encounter a `java.sql.SQLNonTransientConnectionException: ... could not load system variables` error, likely because of a [known error](https://jira.mariadb.org/browse/CONJ-824) tracked in the MariaDB project.

To resolve, modify the Seqera Enterprise configuration:

1. Ensure your `TOWER_DB_DRIVER` uses the specified MariaDB URI.
2. Modify your `TOWER_DB_URL` to: `TOWER_DB_URL=jdbc:mysql://<domain>:<port>/<database-name>?usePipelineAuth=false&useBatchMultiSend=false`

## Email and TLS

#### TLS errors

Nextflow and Seqera Platform can both interact with email providers on your behalf. These providers often require TLS connections, many now requiring at least TLSv1.2.

TLS connection errors can occur because of variability in the [default TLS version specified by your JDK distribution](https://aws.amazon.com/blogs/opensource/tls-1-0-1-1-changes-in-openjdk-and-amazon-corretto/). If you encounter any of the following errors, there is likely a mismatch between your default TLS version and what the email provider supports:

- `Unexpected error sending mail ... TLS 1.0 and 1.1 are not supported. Please upgrade/update your client to support TLS 1.2`
- `ERROR nextflow.script.WorkflowMetadata - Failed to invoke 'workflow.onComplete' event handler ... javax.net.ssl.SSLHandshakeException: No appropriate protocol (protocol is disabled or cipher suites are inappropriate)`

To resolve:

1. Set a JDK environment variable to force Nextflow and Seqera containers to use TLSv1.2 by default:

    ```bash
    export JAVA_OPTS="-Dmail.smtp.ssl.protocols=TLSv1.2"
    ```

2. Add this parameter to your [nextflow.config file](../launch/advanced#nextflow-config-file):

    ```groovy
    mail {
        smtp.ssl.protocols = 'TLSv1.2'
    }
    ```

3. Ensure these values are also set for Nextflow and Seqera:

    -   `mail.smtp.starttls.enable=true`
    -   `mail.smtp.starttls.required=true`

## Git integration

#### `Get branches operation not supported by BitbucketServerRepositoryProvider provider`

If you supplied the correct Bitbucket credentials and URL details in your `tower.yml` and still see this error, upgrade to at least v22.3.0. This version addresses SCM provider authentication issues and likely resolves the retrieval failure.

## Healthcheck

#### Seqera Platform API healthcheck endpoint

To implement automated healthcheck functionality, use Seqera's `service-info` endpoint. For example:

```bash
curl -o /dev/null -s -w "%{http_code}\n" --connect-timeout 2  "https://api.cloud.seqera.io/service-info"  -H "Accept: application/json"
200
```

## Login

#### Login fails: screen frozen at `/auth?success=true`

From version 22.1, Seqera Enterprise implements stricter cookie security by default and only sends an auth cookie if the client is connected over HTTPS. Login attempts over HTTP fail by default.

To resolve, set the environment variable `TOWER_ENABLE_UNSAFE_MODE=true` to allow HTTP connectivity to Seqera (**not recommended for production environments**).

#### Restrict Seqera access to a set of email addresses

Removing the email section from the login page is not currently supported. You can, however, restrict which email identities can log in to your Seqera Enterprise instance with the `trustedEmails` configuration parameter in your `tower.yml` file:

```yaml
# tower.yml
tower:
  trustedEmails:
    # Any email address pattern which matches will have automatic access.
    - '*@seqera.io'
    - 'named_user@example.com'

    # Alternatively, specify a single entry to deny access to all other emails.
    - 'fake_email_address_which_cannot_be_accessed@your_domain.org'
```

Users with email addresses outside the `trustedEmails` list undergo an approval process on the **Profile > Admin > Users** page. This is an effective backup method when SSO becomes unavailable.

:::note

1. You must rebuild your containers (`docker compose down`) to force Seqera to implement this change. Ensure your database is persistent before you issue the teardown command. See [Docker Compose](../enterprise/platform-docker-compose) for more information.
2. All login attempts are visible to the root user at **Profile > Admin panel > Users**.
3. Any user logged in before the restriction is not subject to the new restriction. An organization admin should remove users that previously logged in with an untrusted email from the Admin panel users list. This restarts the approval process before they can log in by email.

:::

#### Login fails: admin approval required with Entra ID OIDC

The Entra ID app integrated with Seqera must have user consent settings configured to "Allow user consent for apps" so that admin approval is not required for each application login. See [User consent settings](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/configure-user-consent?pivots=portal#configure-user-consent-settings).

#### `Username and Password not accepted` with Google SMTP

Seqera Enterprise email integration with Google SMTP can fail as of May 30, 2022, because of a [security posture change](https://support.google.com/accounts/answer/6010255#more-secure-apps-how&zippy=%2Cuse-more-secure-apps) by Google.

To re-establish email connectivity, follow [these instructions](https://support.google.com/accounts/answer/3466521) to provision an app password. Update your `TOWER_SMTP_PASSWORD` environment variable with the app password, then restart the application.

## Logging

#### Broken Nextflow log file in v22.3.1

A Seqera Launcher issue affects the Nextflow log file download in version 22.3.1. Version 22.3.2 fixes it. Update to version 22.3.2 or later.

## Miscellaneous

#### Maximum parallel Seqera browser tabs

Because of a limitation in [server-side event technology in HTTP/1.1](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events), up to five tabs can be open simultaneously per browser product. Additional tabs remain stuck in a loading state.

## Monitoring

#### Integrate third-party Java Application Performance Monitoring (APM) solutions

Mount the APM solution's JAR file in Seqera's `backend` container and set the agent JVM option through the `JAVA_OPTS` environment variable.

#### Retrieve the trace logs for a workflow run

You can't download the trace logs directly through Seqera, but you can configure your workflow to export the file to persistent storage:

1. Set this block in your [`nextflow.config`](../launch/advanced#nextflow-config-file):

   ```groovy
   trace {
       enabled = true
   }
   ```

2. Add a copy command to your pipeline's **Advanced options > Post-run script** field:

   ```bash
   aws s3 cp ./trace.txt s3://<bucket>/trace/trace.txt
   ```

#### Seqera Platform intermittently reports `Live events sync offline`

Seqera Platform uses [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) to push real-time updates to your browser. The client must connect to the server's `/api/live` endpoint to start the data stream, and this connection can occasionally fail because of factors like network latency.

To resolve, reload the Platform browser tab to reinitiate the client's connection to the server. If reloading fails, contact [Seqera support](https://support.seqera.io) for help adjusting webserver timeout settings.

## Optimization

#### `OutOfMemoryError: Container killed due to memory usage`

Nextflow can underestimate the memory allocation for containerized tasks. As a workaround, add a `retry` error strategy to the failing process that increases the allocated memory on each retry:

```groovy
process {
    errorStrategy = 'retry'
    maxRetries    = 3
    memory = { 1.GB * task.attempt }
}
```

## Plugins

#### Use the Nextflow SQL DB plugin to query AWS Athena

From [Nextflow 22.05.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.05.0-edge), your Nextflow pipelines can query data from AWS Athena. Add these items to your `nextflow.config`. Secrets are optional:

```groovy
plugins {
  id 'nf-sqldb@0.4.0'
}

sql {
    db {
        'athena' {
              url = 'jdbc:awsathena://AwsRegion=<region>;S3OutputLocation=s3://<s3-bucket>'
              user = secrets.ATHENA_USER
              password = secrets.ATHENA_PASSWORD
            }
    }
}
```

Then call the functionality in your workflow:

```groovy
channel.sql.fromQuery("select * from test", db: "athena", emitColumns:true).view()
```

:::note
This example uses the legacy `nf-sqldb@0.4.0` syntax. Newer plugin versions use an explicit `include { fromQuery } from 'plugin/nf-sqldb'` statement instead. See the [nf-sqldb documentation](https://github.com/nextflow-io/nf-sqldb).
:::

See the [nf-sqldb discussion](https://github.com/nextflow-io/nf-sqldb/discussions/5) for more information.

## Repositories

#### Private Docker registry integration

Seqera-invoked jobs can pull container images from private Docker registries, such as JFrog Artifactory. The method depends on your computing platform.

For **AWS Batch**, modify your EC2 launch template using [these AWS instructions](https://docs.aws.amazon.com/batch/latest/userguide/private-registry-auth.html).

:::note
This solution requires Docker Engine [17.07 or later](https://docs.docker.com/engine/release-notes/17.07/) to use `--password-stdin`.

You might need to add commands to your launch template, depending on your security posture:

```bash
cp /root/.docker/config.json /home/ec2-user/.docker/config.json && chmod 777 /home/ec2-user/.docker/config.json
```
:::

For **Azure Batch**, create a **Container registry**-type credential in your Seqera workspace and associate it with the Azure Batch compute environment in the same workspace.

For **Kubernetes**, use an `imagePullSecret`, per [#2827](https://github.com/nextflow-io/nextflow/issues/2827).

#### `Remote resource not found`

This error occurs when the Nextflow head job fails to retrieve the repository credentials from Seqera. If your Nextflow log contains an entry like `DEBUG nextflow.scm.RepositoryProvider - Request [credentials -:-]`, check the protocol of your instance's `TOWER_SERVER_URL` value. It must be set to `https` rather than `http`, unless you use `TOWER_ENABLE_UNSAFE_MODE` to allow HTTP connections to Seqera in a test environment.

## Secrets

#### `Missing AWS execution role arn` during launch

The [ECS agent must have access](https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html) to retrieve secrets from AWS Secrets Manager. Secrets-using pipelines launched in an AWS Batch compute environment encounter this error when an IAM execution role is not provided. See [Secrets](../secrets/overview).

#### AWS Batch task failures with secrets

You might encounter errors when executing pipelines that use secrets on AWS Batch:

- If you use `nf-sqldb` version 0.4.1 or earlier and have secrets in your `nextflow.config`, you might see `nextflow.secret.MissingSecretException: Unknown config secret` errors in your Nextflow log.

To resolve, explicitly define the `xpack-amzn` plugin in your configuration:

  ```groovy
  plugins {
    id 'xpack-amzn'
    id 'nf-sqldb'
  }
  ```

- If you have two or more processes that use the same container image but only some of them use secrets, your secret-using processes might fail during the initial run and then succeed when resumed. This is caused by a bug in how Nextflow (22.07.1-edge and earlier) registers jobs with AWS Batch.

  To resolve, upgrade Nextflow to version 22.08.0-edge or later. If you can't upgrade, use one of these workarounds:

  - Use a different container image for each process.
  - Define the same set of secrets in each process that uses the same container image.

## Tower Agent

#### `Unexpected Exception in WebSocket … Operation timed out`

Tower Agent reconnection logic was improved in version 0.5.0. [Update your Tower Agent](https://github.com/seqeralabs/tower-agent) before relaunching your pipeline.

**Reattach to a running agent**

When you SSH back to the login node, attach to the agent session at any time:

```bash
tmux attach -t tower-agent
```

You can see the current log output. Detach again with **Ctrl-b**, then **d**, to leave the agent running.

**Agent process stopped**

If `tmux ls` shows no sessions, or attaching reveals the agent has exited, restart it as in [Tower Agent setup](../supported_software/agent/overview#start-the-agent-inside-tmux). Common causes: login node reboot, the process killed for exceeding login-node resource limits, or a revoked access token.

**Agent shows as disconnected in Seqera Platform**

If Seqera Platform shows the agent as disconnected while it's running on the cluster, verify that the **Agent Connection ID** in your workspace credential exactly matches the argument you passed to `tw-agent`.

**_Authentication errors_ on agent startup**

Personal access tokens can be revoked or expire. If the agent logs authentication errors, generate a new token in Seqera Platform and restart the agent with the updated `TOWER_ACCESS_TOKEN` value.

**_Permission denied_ on the work directory**

The agent needs read and write access to the work directory. If launches fail with permission errors, confirm that the directory exists and is owned by the user running the agent:

```bash
mkdir -p ~/work
```

**Enable trace logging**

To diagnose connection or execution issues in detail, enable trace-level logging:

```bash
export TOWER_ACCESS_TOKEN=<YOUR TOKEN>
export LOGGER_LEVELS_IO_SEQERA_TOWER_AGENT=TRACE
./tw-agent <YOUR CONNECTION ID>
```

Trace logging shows WebSocket connection details, message exchanges, reconnection attempts, command execution details and exit codes, and full stack traces for errors.

## Google

#### Spot VM preemption causes task interruptions

Spot VMs reduce cost but increase the likelihood that a task is interrupted before completion. When Google Cloud reclaims a Spot VM, Google Cloud Batch terminates the task with exit code `50001`. Add a retry strategy to your Nextflow configuration so interrupted tasks are automatically re-executed. See [Spot Instances](https://docs.seqera.io/nextflow/google#spot-instances) in the Nextflow documentation. For example:

```groovy
process {
  errorStrategy = { task.exitStatus == 50001 ? 'retry' : 'finish' }
  maxRetries    = 5
}
```

#### Seqera service account permissions for Google Cloud Batch

Grant the following roles to the custom service account that submits Batch jobs:

- Batch Agent Reporter (`roles/batch.agentReporter`)
- Batch Job Editor (`roles/batch.jobsEditor`)
- Logs Writer (`roles/logging.logWriter`)
- Logs Viewer (`roles/logging.logViewer`)
- Service Account User (`roles/iam.serviceAccountUser`)
- Storage Admin (`roles/storage.admin`), or bucket-level Storage access

For detailed setup instructions, see [Service account permissions](../compute-envs/google-cloud-batch#service-account-permissions).

## Kubernetes

#### `Invalid value: "xxx": must be less or equal to memory limit`

This error can occur when you specify a value in the **Head Job memory** field while creating a Kubernetes-type compute environment.

If you receive an error that includes `field: spec.containers[x].resources.requests` and `message: Invalid value: "xxx": must be less than or equal to memory limit`, your Kubernetes cluster might be configured with [system resource limits](https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/) that deny the Nextflow head job's resource request. To isolate the component causing the problem, launch a pod directly on your cluster through your Kubernetes administration solution. For example:

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

## On-premises HPC

#### `java: command not found`

When submitting jobs to your on-premises HPC (using either SSH or Tower Agent authentication), the following error might appear in your Nextflow logs, even with Java on your `PATH` environment variable:

```
java: command not found
Nextflow is trying to use the Java VM defined for the following environment variables:
  JAVA_CMD: java
  NXF_OPTS:
```

Possible causes:

1. The queue where the Nextflow head job runs is in a different environment or node than your login node userspace.
2. If your HPC cluster uses modules, the Java module might not be loaded by default.

To troubleshoot:

1. Open an interactive session with the head job queue.
2. Launch the Nextflow job from the interactive session.
3. If your cluster uses modules, add `module load <java-module>` in the **Advanced options > Pre-run script** field when creating your HPC compute environment in Seqera.
4. If your cluster doesn't use modules, source an environment with Java and Nextflow in the **Advanced options > Pre-run script** field when creating your HPC compute environment in Seqera.

#### Pipeline submissions to HPC clusters fail for some users

Nextflow launcher scripts fail if processed by a non-Bash shell, such as zsh or tcsh. You can identify this problem from these error entries:

1. Your `.nextflow.log` contains an error like `Invalid workflow status - expected: SUBMITTED; current: FAILED`.
2. Your Seqera **Error report** tab contains an error like:

```
Slurm job submission failed
- command: mkdir -p /home//\<username\>//scratch; cd /home//\<username\>//scratch; echo <long-base64-string> | base64 -d > nf-<run-id>.launcher.sh; sbatch ./nf-<run-id>.launcher.sh
- exit   : 1
- message: Submitted batch job <#>
```

Connect to the head node over SSH and run `ps -p $$` to verify your default shell. If you see an entry other than Bash, fix it as follows:

1. Check which shells are available: `cat /etc/shells`
2. Change your shell: `chsh -s /usr/bin/bash` (the path to the binary might differ, depending on your HPC configuration).
3. If submissions continue to fail after the shell change, ask your Seqera Platform admin to restart the **backend** and **cron** containers, then submit again.

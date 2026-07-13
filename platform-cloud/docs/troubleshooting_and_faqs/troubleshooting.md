---
title: "General"
description: "Troubleshooting Seqera Platform"
date created: "2023-04-24"
last updated: "2026-07-06"
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

## Git integration

#### `Get branches operation not supported by BitbucketServerRepositoryProvider provider`

If you supplied the correct Bitbucket credentials and URL details in your `tower.yml` and still see this error, upgrade to at least v22.3.0. This version addresses SCM provider authentication issues and likely resolves the retrieval failure.

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

#### Reattach to a running agent

When you SSH back to the login node, attach to the agent session at any time:

```bash
tmux attach -t tower-agent
```

You can see the current log output. Detach again with **Ctrl-b**, then **d**, to leave the agent running.

#### Agent process stopped

If `tmux ls` shows no sessions, or attaching reveals the agent has exited, restart it as in [Tower Agent setup](../supported_software/agent/overview#start-the-agent-inside-tmux). Common causes: login node reboot, the process killed for exceeding login-node resource limits, or a revoked access token.

#### Agent shows as disconnected in Seqera Platform

If Seqera Platform shows the agent as disconnected while it's running on the cluster, verify that the **Agent Connection ID** in your workspace credential exactly matches the argument you passed to `tw-agent`.

#### _Authentication errors_ on agent startup

Personal access tokens can be revoked or expire. If the agent logs authentication errors, generate a new token in Seqera Platform and restart the agent with the updated `TOWER_ACCESS_TOKEN` value.

#### _Permission denied_ on the work directory

The agent needs read and write access to the work directory. If launches fail with permission errors, confirm that the directory exists and is owned by the user running the agent:

```bash
mkdir -p ~/work
```

#### Enable trace logging

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

#### Execution logs don't update in real time for HPC compute environments

While a task runs on an HPC compute environment (such as Slurm, Grid Engine, LSF, or PBS Pro), the **Execution log** tab on the run details page does not refresh automatically.

This is expected behavior. Real-time log streaming is supported only for compute environments that stream logs from a cloud logging service: AWS Batch, Azure Batch, Google Cloud Batch, Kubernetes, and the AWS Cloud and Azure Cloud environments. For HPC compute environments, Seqera Platform retrieves the task log from the task work directory (the task's `.command.log` file) instead of streaming it.

To load the latest log content, change tabs or refresh the page.

Other run details, such as run status, task counters, and metrics, update in real time regardless of the compute environment type.

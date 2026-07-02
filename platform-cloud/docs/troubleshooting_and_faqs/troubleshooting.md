---
title: "General"
description: "Troubleshooting Seqera Platform"
date: "24 Apr 2023"
tags: [troubleshooting, help]
---

## Common errors

**_timeout is not an integer or out of range_** or **_ERR timeout is not an integer or out of range_**

This error can occur if you're using Seqera Platform v24.2 upwards and have an outdated version of Redis. From v24.2 Redis version 6.2 or greater is required. Follow your cloud provider specifications to upgrade your instance.

**_Unknown pipeline repository or missing credentials_ error from public GitHub repositories**

GitHub imposes [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) on repository pulls (including public repositories), where unauthenticated requests are capped at 60 requests/hour and authenticated requests are capped at 5000 requests/hour. Seqera Platform users tend to encounter this error due to the 60 requests/hour cap.

Try the following:

1. Ensure there's at least one GitHub credential in your workspace's **Credentials** tab.
2. Ensure that the **Access token** field of all GitHub credential objects is populated with a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) value and **not** a user password. GitHub PATs are typically longer than passwords and include a `ghp_` prefix. For example: `ghp*IqIMNOZH6zOwIEB4T9A2g4EHMy8Ji42q4HA`
3. Confirm that your PAT is providing the elevated threshold and transactions are being charged against it:

   `curl -H "Authorization: token ghp_LONG_ALPHANUMERIC_PAT" -H "Accept: application/vnd.github.v3+json" https://api.github.com/rate_limit`

**_No such variable_ error**

This error can occur if you execute a DSL1-based Nextflow workflow using [Nextflow 22.03.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.03.0-edge) or later.

**Sleep commands in Nextflow workflows**

The `sleep` commands in your Nextflow workflows may differ in behavior depending on where they are:

- If used within an `errorStrategy` block, the Groovy sleep function will be used (which takes its value in milliseconds).
- If used within a process script block, that language's sleep binary/method will be used. For example, [this bash script](https://docs.seqera.io/nextflow/metrics) uses the bash sleep binary, which takes its value in seconds.


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

## Git integration

**BitBucket authentication failure: _Can't retrieve revisions for pipeline - https://my.bitbucketserver.com/path/to/pipeline/repo - Cause: Get branches operation not supported by BitbucketServerRepositoryProvider provider_**

If you supplied the correct BitBucket credentials and URL details in your `tower.yml` and still experience this error, update your version to at least v22.3.0. This version addresses SCM provider authentication issues and is likely to resolve the retrieval failure described here.


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

For **AWS Batch**, modify your EC2 Launch Template using [these AWS instructions](https://docs.aws.amazon.com/batch/latest/userguide/private-registry-auth.html).

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

**Spot VM preemption causes task interruptions**

Running your pipelines on Spot VMs provides significant cost savings, but increases the likelihood that a task is interrupted before completion. When Google Cloud reclaims a Spot VM, Google Cloud Batch terminates the task with exit code `50001`. Add a retry strategy to your Nextflow configuration so interrupted tasks are automatically re-executed. See [Spot Instances](https://docs.seqera.io/nextflow/google#spot-instances) in the Nextflow documentation for more information. For example:

```config
process {
  errorStrategy = { task.exitStatus == 50001 ? 'retry' : 'finish' }
  maxRetries    = 5
}
```

**Seqera service account permissions for Google Cloud Batch**

Grant the following roles to the custom service account that submits Batch jobs:

- Batch Agent Reporter (`roles/batch.agentReporter`)
- Batch Job Editor (`roles/batch.jobsEditor`)
- Logs Writer (`roles/logging.logWriter`)
- Logs Viewer (`roles/logging.logViewer`)
- Service Account User (`roles/iam.serviceAccountUser`)
- Storage Admin (`roles/storage.admin`), or bucket-level Storage access

For detailed setup instructions, see [Service account permissions](../compute-envs/google-cloud-batch#service-account-permissions).

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

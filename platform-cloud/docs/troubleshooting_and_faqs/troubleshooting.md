---
title: "General"
description: "General troubleshooting for Seqera Platform"
date: "2023-04-23"
toc_max_heading_level: 2
tags: [troubleshooting, help]
---

## Common errors

### Redis timeout error

**Error message:**

```
timeout is not an integer or out of range
```

or

```
ERR timeout is not an integer or out of range
```

**Cause:** This error occurs when using Seqera Platform v24.2 or later with an outdated version of Redis.

**Solution:** Upgrade your Redis instance to version 6.2 or greater. Follow your cloud provider specifications to upgrade your instance.

### GitHub repository access error

**Error message:**

```
Unknown pipeline repository or missing credentials
```

**Cause:** GitHub imposes [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) on repository pulls (including public repositories). Unauthenticated requests are capped at 60 requests/hour and authenticated requests are capped at 5000 requests/hour. This error typically occurs when hitting the 60 requests/hour cap for unauthenticated requests.

**Solution:** To resolve this issue:

1. Ensure there's at least one GitHub credential in your workspace's **Credentials** tab.
2. Ensure that the **Access token** field of all GitHub credential objects is populated with a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) value and **not** a user password. GitHub PATs are typically longer than passwords and include a `ghp_` prefix. For example: `ghp*IqIMNOZH6zOwIEB4T9A2g4EHMy8Ji42q4HA`
3. Confirm that your PAT is providing the elevated threshold and transactions are being charged against it:

   ```bash
   curl -H "Authorization: token ghp_LONG_ALPHANUMERIC_PAT" -H "Accept: application/vnd.github.v3+json" https://api.github.com/rate_limit
   ```

### DSL1 variable error

**Error message:**

```
No such variable
```

**Cause:** This error occurs when executing a DSL1-based Nextflow workflow using [Nextflow 22.03.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.03.0-edge) or later.

**Solution:** Upgrade your workflow to use DSL2 syntax, or use a Nextflow version earlier than 22.03.0-edge.

### Sleep commands in Nextflow workflows

**Problem:** Sleep commands in Nextflow workflows may behave differently than expected.

**Cause:** The `sleep` command behavior differs depending on where it's used in your workflow:

- If used within an `errorStrategy` block, the Groovy sleep function is used (which takes its value in milliseconds).
- If used within a process script block, that language's sleep binary/method is used. For example, [this bash script](https://www.nextflow.io/docs/latest/metrics.html?highlight=sleep) uses the bash sleep binary, which takes its value in seconds.

**Solution:** Be aware of the context where you're using `sleep` and adjust the time value accordingly (milliseconds for `errorStrategy` blocks, seconds for bash process scripts).

### Large number of batch job definitions

**Problem:** Your AWS Batch account has accumulated a large number of job definitions.

**Cause:** Platform looks for an existing job definition that matches your workflow requirement. If nothing matches, it recreates the job definition. Over time, this can lead to a buildup of job definitions.

**Solution:** Use a bash script to clear job definitions. You can tailor this according to your needs, e.g., deregister only job definitions older than x days.

```bash
jobs=$(aws --region eu-west-1 batch describe-job-definitions | jq -r .jobDefinitions[].jobDefinitionArn)

for x in $jobs; do
  echo "Deregister $x";
  sleep 0.01;
  aws --region eu-west-1 batch deregister-job-definition --job-definition $x;
done
```

## Containers

### Rootless container permission errors

**Error message:**

```
touch: cannot touch '/fsx/work/ab/27d78d2b9b17ee895b88fcee794226/.command.begin': Permission denied
```

**Cause:** Most containers use the root user by default. However, some users prefer to define a non-root user in the container to minimize the risk of privilege escalation. Because Nextflow and its tasks use a shared work directory to manage input and output data, using rootless containers can lead to file permissions errors in some environments.

**Solution:** This should not occur when using AWS Batch from Seqera version 22.1.0. In other situations, you can avoid this issue by forcing all task containers to run as root. Add one of the following snippets to your [Nextflow configuration](../launch/advanced#nextflow-config-file):

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

### BitBucket authentication failure

**Error message:**

```
Can't retrieve revisions for pipeline - https://my.bitbucketserver.com/path/to/pipeline/repo - Cause: Get branches operation not supported by BitbucketServerRepositoryProvider provider
```

**Cause:** This error can occur due to SCM provider authentication issues in Seqera Platform versions earlier than v22.3.0.

**Solution:** Update your Seqera Platform version to at least v22.3.0. This version addresses SCM provider authentication issues and is likely to resolve the retrieval failure.


## Optimization

### Out of memory error

**Error message:**

```
OutOfMemoryError: Container killed due to memory usage
```

**Cause:** Nextflow may underestimate the optimal memory needed for containerized tasks, leading to out-of-memory errors.

**Solution:** Improvements are being made to the way Nextflow calculates the optimal memory needed for containerized tasks in an upcoming release.

As a temporary workaround, implement a `retry` error strategy in the failing process that will increase the allocated memory each time the failed task is retried. Add the following `errorStrategy` block to the failing process:

```bash
process {
    errorStrategy = 'retry'
    maxRetries    = 3
    memory = { 1.GB * task.attempt }
}
```

## Plugins

### Query AWS Athena with the Nextflow SQL DB plugin

**Problem:** You need to query data from AWS Athena in your Nextflow pipelines.

**Requirements:** [Nextflow 22.05.0-edge](https://github.com/nextflow-io/nextflow/releases/tag/v22.05.0-edge) or later.

**Solution:** Add these configuration items to your `nextflow.config`. The use of secrets is optional:

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

### Private Docker registry integration

**Problem:** You need Seqera-invoked jobs to pull container images from private Docker registries, such as JFrog Artifactory.

**Solution:** The method to enable this depends on your computing platform.

- **AWS Batch**

    Modify your EC2 Launch Template using [these AWS instructions](https://aws.amazon.com/blogs/compute/how-to-authenticate-private-container-registries-using-aws-batch/).

    :::note
    This solution requires Docker Engine [17.07 or greater](https://docs.docker.com/engine/release-notes/17.07/), to use `--password-stdin`.<br/>

    You may need to add additional commands to your Launch template, depending on your security posture:<br/>
    `cp /root/.docker/config.json /home/ec2-user/.docker/config.json && chmod 777 /home/ec2-user/.docker/config.json`
    :::

- **Azure Batch**

    Create a **Container registry**-type credential in your Seqera workspace and associate it with the Azure Batch compute environment defined in the same workspace.

- **Kubernetes**

    Use an `imagePullSecret`, per [#2827](https://github.com/nextflow-io/nextflow/issues/2827).

### Remote resource not found

**Error message:**

```
Remote resource not found
```

**Cause:** This error can occur if the Nextflow head job fails to retrieve the necessary repository credentials from Seqera. This typically happens when the `TOWER_SERVER_URL` configuration is using the wrong protocol.

**Solution:** Check your Nextflow log for an entry like `DEBUG nextflow.scm.RepositoryProvider - Request [credentials -:-]`. If present, verify that your instance's `TOWER_SERVER_URL` configuration value is set to `https` rather than `http` (unless you are using `TOWER_ENABLE_UNSAFE_MODE` to allow HTTP connections to Seqera in a test environment).

## Secrets

### Missing AWS execution role

**Error message:**

```
Missing AWS execution role arn
```

**Cause:** The [ECS Agent must have access](https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html) to retrieve secrets from the AWS Secrets Manager. This error occurs when pipelines that use secrets are launched in an AWS Batch compute environment without an IAM Execution Role.

**Solution:** Provide an IAM Execution Role when configuring your AWS Batch compute environment. See [Secrets](../secrets/overview) for more information.

### AWS Batch task failures with secrets

**Problem:** Pipelines that use secrets fail when executed via AWS Batch.

**Cause:** There are two common causes:

1. **nf-sqldb plugin version 0.4.1 or earlier**: If you use `nf-sqldb` version 0.4.1 or earlier and have secrets in your `nextflow.config`, you may encounter _nextflow.secret.MissingSecretException: Unknown config secret_ errors in your Nextflow log.

2. **Nextflow job registration bug (22.07.1-edge and earlier)**: If you have two or more processes that use the same container image, but only a subset of these processes use secrets, your secret-using processes may fail during the initial run and then succeed when resumed. This is due to a bug in how Nextflow registers jobs with AWS Batch.

**Solution:** To resolve this issue:

For nf-sqldb, explicitly define the `xpack-amzn` plugin in your configuration:

```
plugins {
  id 'xpack-amzn'
  id 'nf-sqldb'
}
```

For Nextflow job registration, upgrade your Nextflow to version 22.08.0-edge or later.

If you cannot upgrade, use the following as workarounds:

- Use a different container image for each process.
- Define the same set of secrets in each process that uses the same container image.

## Tower Agent

### WebSocket operation timeout

**Error message:**

```
Unexpected Exception in WebSocket [...]: Operation timed out java.io.IOException: Operation timed out
```

**Cause:** This error occurs due to connection timeout issues in Tower Agent versions earlier than 0.5.0.

**Solution:** [Update your Tower Agent version](https://github.com/seqeralabs/tower-agent) to 0.5.0 or later, which includes improved reconnection logic. Then relaunch your pipeline.

## Google

### VM preemption causes task interruptions

**Problem:** Tasks are interrupted before completion when running pipelines on Google Cloud preemptible VMs.

**Cause:** Running pipelines on preemptible VMs provides significant cost savings, but increases the likelihood that a task will be interrupted before completion due to VM preemption.

**Solution:** Implement a retry strategy when you encounter [exit codes](https://cloud.google.com/life-sciences/docs/troubleshooting#retrying_after_encountering_errors) that are commonly related to preemption. For example:

```config
process {
  errorStrategy = { task.exitStatus in [8,10,14] ? 'retry' : 'finish' }
  maxRetries    = 3
  maxErrors     = '-1'
}
```

### Seqera Service account permissions for Google Life Sciences and GKE

**Problem:** You need to configure service account permissions for Google Life Sciences and GKE.

**Requirements:** The following roles must be granted to the `nextflow-service-account`:

1. Cloud Life Sciences Workflows Runner
2. Service Account User
3. Service Usage Consumer
4. Storage Object Admin

**Solution:** Grant the required roles to your service account. For detailed information, see [this guide](https://cloud.google.com/life-sciences/docs/tutorials/nextflow#create_a_service_account_and_add_roles).

## Kubernetes

### Kubernetes memory limit error

**Error message:**

```
field: spec.containers[x].resources.requests
message: Invalid value: "xxx": must be less than or equal to memory limit
```

**Cause:** This error is encountered when you specify a value in the **Head Job memory** field during the creation of a Kubernetes-type compute environment that exceeds the [system resource limits](https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/) configured on your Kubernetes cluster. The cluster's resource limits deny the Nextflow head job's resource request.

**Solution:** To isolate the component causing the problem, try to launch a pod directly on your cluster via your Kubernetes administration solution. For example:

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

If this test pod also fails, adjust your cluster's resource limits or reduce the memory request to comply with the limits.

## On-prem HPC

### _java: command not found_ error

**Error message:** When submitting jobs to your on-prem HPC (using either SSH or Tower Agent authentication), the following error may appear in your Nextflow logs, even with Java on your `PATH` environment variable:

```
java: command not found
Nextflow is trying to use the Java VM defined for the following environment variables:
  JAVA_CMD: java
  NXF_OPTS:
```

**Cause:** There are two possible causes:

1. The queue where the Nextflow head job runs is in a different environment/node than your login node userspace.
2. If your HPC cluster uses modules, the Java module may not be loaded by default.

**Solution:** To resolve this issue:

1. Open an interactive session with the head job queue.
2. Launch the Nextflow job from the interactive session to verify Java availability.
3. If your cluster uses modules:
   - Add `module load <your_java_module>` in the **Advanced Features > Pre-run script** field when creating your HPC compute environment in Seqera.
4. If your cluster doesn't use modules:
   - Source an environment with Java and Nextflow using the **Advanced Features > Pre-run script** field when creating your HPC compute environment in Seqera.

### Pipeline submissions to HPC clusters fail for some users

**Error message:**

1. Your _.nextflow.log_ contains an error like:
   ```
   Invalid workflow status - expected: SUBMITTED; current: FAILED
   ```

2. Your Seqera **Error report** tab contains an error like:
   ```yaml
   Slurm job submission failed
   - command: mkdir -p /home//\<USERNAME\>//scratch; cd /home//\<USERNAME\>//scratch; echo <LONG_BASE64_STRING> | base64 -d > nf-<RUN-ID>.launcher.sh; sbatch ./nf-<RUN-ID>.launcher.sh
   - exit   : 1
   - message: Submitted batch job <#>
   ```

**Cause:** Nextflow launcher scripts will fail if processed by a non-Bash shell (e.g., `zsh`, `tcsh`).

**Solution:** To resolve this issue:

1. Connect to the head node via SSH and run `ps -p $$` to verify your default shell.
2. If you see an entry other than Bash:
   - Check which shells are available to you: `cat /etc/shells`
   - Change your shell: `chsh -s /usr/bin/bash` (the path to the binary may differ, depending on your HPC configuration)
3. If submissions continue to fail after this shell change, ask your Seqera Platform admin to restart the **backend** and **cron** containers, then submit again.

---
title: "AWS troubleshooting"
description: Troubleshooting Tower on AWS
date: "21 Apr 2023"
tags: [aws, troubleshooting, deployment]
---

### Unable to mount the FSx filesystem

While trying to mount the newly created `FSx` filesystem in the compute environment, the following error is observed in `/var/log/tower-forge.log`:

<details>
  <summary>Click to expand error log!</summary>

```bash
mount.lustre: Can't parse NID 'fs-xxxxxxxxxxxx.fsx.us-east-1.amazonaws.com@tcp:/xxxxxxx

This mount helper should only be invoked via the mount (8) command, e.g. mount -t lustre dev dir

```

</details>

**SOLUTION**

Please enable DNS hostnames on your VPC.

### Workflow execution fails with `CannotStartContainerError`

While trying to run workflows on AWS Batch environment with custom VPC and subnets environment, it is possible to encounter the `CannotStartContainerError` issue.

<details>
  <summary>Click to expand error log!</summary>

```bash
Workflow execution completed unsuccessfully
The exit status of the task that caused the workflow execution to fail was: -
CannotStartContainerError: Error response from daemon: failed to initialize logging driver: failed to create Cloudwatch log stream: RequestError: send request failed
caused by: Post https://logs.us-east-2.amazonaws.com/: dial tcp 10.20.10.16:443: i/o time

```

</details>

**SOLUTION**

This error is encountered when the custom VPC configuration are not specified in the `Advanced` settings in Tower for AWS Batch environment.

### Workflow execution fails with `java.net.UnknownHostException`

Workflow executions fails upon launching and the following error message is observed in `.nextflow.log` file.

<details>
  <summary>Click to expand error log!</summary>

```bash
java.net.UnknownHostException: <YOUR_TOWER_HOSTNAME>
	at java.base/java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:220)
	at java.base/java.net.Socket.connect(Socket.java:609)
	at java.base/java.net.Socket.connect(Socket.java:558)
	at java.base/sun.net.NetworkClient.doConnect(NetworkClient.java:182)
	at java.base/sun.net.www.http.HttpClient.openServer(HttpClient.java:474)
	at java.base/sun.net.www.http.HttpClient.openServer(HttpClient.java:569)
	at java.base/sun.net.www.http.HttpClient.<init>(HttpClient.java:242)
	at java.base/sun.net.www.http.HttpClient.New(HttpClient.java:341)
	at java.base/sun.net.www.http.HttpClient.New(HttpClient.java:362)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getNewHttpClient(HttpURLConnection.java:1253)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.plainConnect0(HttpURLConnection.java:1187)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.plainConnect(HttpURLConnection.java:1081)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.connect(HttpURLConnection.java:1015)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1592)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1520)
	at nextflow.file.http.XFileSystemProvider.newInputStream(XFileSystemProvider.groovy:291)
	at java.base/java.nio.file.Files.newInputStream(Files.java:156)
	at java.base/java.nio.file.Files.newBufferedReader(Files.java:2839)
	at org.apache.groovy.nio.extensions.NioExtensions.newReader(NioExtensions.java:1404)
	at org.apache.groovy.nio.extensions.NioExtensions.getText(NioExtensions.java:397)
	at nextflow.scm.ProviderConfig.getFromFile(ProviderConfig.groovy:270)
	at nextflow.scm.ProviderConfig.getDefault(ProviderConfig.groovy:287)
	at nextflow.scm.AssetManager.<init>(AssetManager.groovy:107)
	at nextflow.cli.CmdRun.getScriptFile(CmdRun.groovy:360)
	at nextflow.cli.CmdRun.run(CmdRun.groovy:265)
	at nextflow.cli.Launcher.run(Launcher.groovy:475)
	at nextflow.cli.Launcher.main(Launcher.groovy:657)

```

</details>

**SOLUTION**

This error indicates that Nextflow running in AWS Batch jobs is not able to connect to your Tower instance.

The solution is to specify the correct `VPC` and `Security Group` during the creation of `Compute Environment`. For further information, please refer to the note regarding `Networking configs` after **point-17** in the [AWS compute environment setup guide](https://help.tower.nf/compute-envs/aws-batch/#forge-compute-environment).

### Long running workflow fails because of failure to retrieve ECS metadata

Long running workflows eventually fail with partially completed processes, with the following error message:

```bash
Error when retrieving credentials from container-role: Error retrieving metadata: Received error when attempting to retrieve ECS metadata: Read timeout on endpoint URL: `http://<YOUR_HOST_IP>/v2/credentials/xxxxxxxxxx-a707-2cea702a1fb9`
```

**SOLUTION**

The solution is to increase the throttling rate in the user data script, in the launch template

```bash
echo "ECS_TASK_METADATA_RPS_LIMIT=120,180" >> /etc/ecs/ecs.config
```

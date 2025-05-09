---
title: "Manage AWS Spot interruptions in Seqera Platform"
description: "Managing AWS Spot Interruptions in Seqera Platform."
date: "16 Jul 2024"
tags: [aws, spot, platform, fusion, retry]
---

In AWS Batch environments that use Spot instances, tasks can be interrupted when instances are reclaimed. This is a normal part of how Spot instances operate. The frequency of interruptions can be highly variable, based on factors including the wider demand for AWS services. AWS offers insight into the frequency of Spot reclamations with their **instance-advisor** service, which you can find [here](https://aws.amazon.com/ec2/spot/instance-advisor/).

In Seqera Platform, Spot reclamations may appear through log messages like `Host EC2 (instance i-0282b396e52b4c95d) terminated`. These events often result in non-specific exit codes, such as `143` (indicating `SIGTERM`), or sometimes no exit code at all (`-`), depending on the sequence in which the underlying AWS components are shut down. If you're seeing unexpected task failures with one or more of these features, especially with no obvious application error, it's worth reviewing your Spot configuration and retry strategy.

This guide outlines best practices for mitigating the impact of Spot interruptions and ensuring critical tasks can retry or recover reliably.

## Recommended mitigations

### Use an On-Demand compute environment

For workflows with a significant proportion of long-running processes, the costs of, and mitigations necessary for working with Spot may outweigh the benefits. You may find it simpler and even, possibly, cheaper to simply run those workloads in On-Demand compute environments.

### Move long-running tasks to On-Demand 

Tasks with long runtimes are particularly vulnerable to Spot termination. In Platform, you can explicitly assign critical or long-duration tasks to On-Demand queues and leave other tasks to run in a default Spot queue by default:

```bash
process {
	withName: 'run_bcl2fastq' {
	     queue = 'TowerForge-MyOnDemandQueue'
	} 
}
```

If you don’t already have one, you may need to create an On-Demand compute environment in the Seqera Platform. Once it’s available, you can find the corresponding On-Demand queue name by navigating to **Compute Environments** in the Platform UI. Locate the configuration for your specific On-Demand environment, then scroll down to the **Manual Config Attributes** section. This section lists key configuration details, including queue names. Look for the queue name prefixed with `TowerForge-` if it was created by Forge.

### Use retry strategies for Spot Interruptions

#### Handle retries in Nextflow by setting `errorStrategy` and `maxRetries`

A simple generic retry strategy at the Nextflow level can be more appropriate where run times are sufficiently low that retries are likely to succeed. This can be configured as follows:

```bash
process {
   errorStrategy = 'retry'
   maxRetries = 3 
}
```

This example configuration will apply to all types of job failure. Because Spot reclamations do not produce diagnostic exit codes, it is currently not possible to configure retries at the Nextflow level specifically for reclamations. Note that, given the escalating costs of repeated retries, an On-Demand queue is likely a more cost-effective option than very large numbers of retries. If you still see failures after applying configuration like this, solutions involving On-Demand queues are likely to be more effective at limiting costs and runtimes.

#### Handle retries in AWS by setting `aws.batch.maxSpotAttempts`

If you do not have processes with long runtimes in your workflow (i.e., all processes are under 1 hour runtime), you can consider configuring automatic retries in case of interruption:

`aws.batch.maxSpotAttempts = 3`

This is a global setting (not configurable per process) that in this example allows a job to retry up to three times on a new Spot instance if the original instance is reclaimed. Retries happen automatically within AWS and restart the task from the beginning. Because this occurs behind the scenes, you won't see any evidence of the retries within the Platform. In fact, as far as Nextflow (and Platform) is concerned, only one attempt has occurred, and it will submit the task again to AWS, up to any `maxRetries` configuration you have in place (see above). The total number of retries in that case will be `maxRetries` * `aws.batch.maxSpotAttempts`. For a long running process being pre-empted repeatedly, this can represent very significant costs in time and compute.

:::note
Starting with Nextflow version 24.08.0-edge, the default value for this setting has been changed to `0` to help avoid unexpected expenses, and you should be careful when activating this setting.
::: 

### Implement Spot-to-On-Demand fallback logic

If you prefer to optimize for cost but ensure task reliability, consider a hybrid fallback pattern:

```bash
process {
	withName: 'run_bcl2fastq' {
		errorStrategy = 'retry'
		maxRetries = 2
		queue = { task.attempt > 1 ? 'TowerForge-MyOnDemandQueue' : 'TowerForge-MySpotQueue' }
	}
}
```

With this setup, the first attempt of a task is sent to the Spot queue, while any retries are directed to the On-Demand queue, where they won't be preempted. This helps avoid repeated preemption of longer-running tasks and can serve as a useful default strategy. However, longer-running jobs should still be submitted directly to an On-Demand queue whenever possible, to avoid the unnecessary cost of the initial preemption.

### Consider enabling Fusion Snapshots (preview feature)

Fusion Snapshots can help mitigate interruption risk by checkpointing task state before termination. This is currently in preview and best suited for compute-intensive or long-running tasks. If you're interested in testing this feature, reach out to our support team at https://support.seqera.io and we will be happy to assist you.

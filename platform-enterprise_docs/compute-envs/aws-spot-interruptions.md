---
title: "AWS Spot interruption management"
description: "Manage AWS Spot interruptions in Seqera Platform."
date: "16 Jul 2024"
tags: [aws, spot, platform, fusion, retry]
---

In AWS Batch environments that use Spot instances, tasks can be interrupted when AWS reclaims instances. This is a normal part of how Spot instances operate. The frequency of interruptions varies based on factors including the wider demand on AWS services. AWS shows the frequency of Spot reclamations in its **instance-advisor** service, which you can find [here](https://aws.amazon.com/ec2/spot/instance-advisor/).

In Seqera Platform, Spot reclamations sometimes appear with logging messages like `Host EC2 (instance i-0282b396e52b4c95d) terminated` and produce non-specific exit codes such as `143 (representing `SIGTERM`) or even no exit code at all (`-`), depending on the order in which the underlying AWS components have been destroyed. If you see unexpected task failures with one or more of these features, especially with no obvious application error, review your Spot configuration and retry strategy.

The following practices reduce the impact of Spot interruptions and help critical tasks retry or recover reliably.

## Recommended mitigations

### Use an On-Demand compute environment

For workflows with a significant proportion of long-running processes, the costs of working with Spot, and the mitigations it requires, can outweigh the benefits. It can be simpler, and possibly cheaper, to run those workloads in On-Demand compute environments.

### Move long-running tasks to On-Demand

Tasks with long runtimes are particularly vulnerable to Spot termination. In Platform, you can explicitly assign critical or long-duration tasks to On-Demand queues and leave other tasks to run in a default Spot queue:

```bash
process {
	withName: 'run_bcl2fastq' {
	     queue = 'TowerForge-MyOnDemandQueue'
	}
}
```

If you don't already have one, create an On-Demand compute environment in Seqera Platform. When it's available, find the corresponding On-Demand queue name under **Compute Environments** in the Platform UI. Locate the configuration for your On-Demand environment, then scroll down to the **Manual Config Attributes** section. This section lists key configuration details, including queue names. Look for the queue name prefixed with `TowerForge-` if Forge created it.

### Use retry strategies for Spot Interruptions

#### Handle retries in Nextflow by setting `errorStrategy` and `maxRetries`

A generic retry strategy at the Nextflow level can be more appropriate when run times are short enough that retries are likely to succeed. Configure it as follows:

```bash
process {
   errorStrategy = 'retry'
   maxRetries = 3
}
```

This example configuration applies to all types of job failure. Because Spot reclamations do not produce diagnostic exit codes, you cannot configure retries at the Nextflow level specifically for reclamations. Given the escalating costs of repeated retries, an On-Demand queue is likely more cost-effective than a very large number of retries. If you still see failures after you apply this configuration, On-Demand queues are likely more effective at limiting costs and runtimes.

#### Handle retries in AWS by setting `aws.batch.maxSpotAttempts`

If all processes in your workflow have runtimes short enough to complete before reclamation, consider configuring automatic retries in case of interruption:

`aws.batch.maxSpotAttempts = 3`

This is a global setting (not configurable per process). In this example, it lets a job retry up to three times on a new Spot instance if AWS reclaims the original instance. Retries happen automatically within AWS and restart the task from the beginning. Because this occurs within AWS, you won't see any evidence of the retries in Platform. As far as Nextflow (and Platform) is concerned, only one attempt has occurred. Nextflow submits the task again to AWS, up to any `maxRetries` configuration you have in place (see earlier). The total number of retries in that case is `maxRetries` * `aws.batch.maxSpotAttempts`. For a long-running process that is preempted repeatedly, this can represent significant costs in time and compute.

:::note
Starting with Nextflow version 24.08.0-edge, the default value for this setting is `0` to help avoid unexpected expenses. Be careful when you activate this setting.
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

With this setup, Nextflow sends the first attempt of a task to the Spot queue and directs any retries to the On-Demand queue, where they won't be preempted. This helps avoid repeated preemption of longer-running tasks and can be a useful default strategy. However, submit longer-running jobs directly to an On-Demand queue whenever possible to avoid the unnecessary cost of the initial preemption.

### Consider enabling Fusion Snapshots (preview feature)

Fusion Snapshots can reduce interruption risk by checkpointing task state before termination. Fusion Snapshots is in preview and best suited for compute-intensive or long-running tasks. To test this feature, contact the support team at https://support.seqera.io.

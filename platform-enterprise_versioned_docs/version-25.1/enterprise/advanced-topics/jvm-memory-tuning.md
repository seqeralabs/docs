---
title: "JVM memory tuning"
description: Configure JVM memory parameters for Seqera Platform Enterprise deployments
date created: "2025-12-17"
tags: [configuration, jvm, memory, tuning]
---

# JVM memory tuning

:::warning
JVM memory tuning is an advanced topic that may cause instability and performance issues.
:::

Seqera Platform scales memory allocation based on resources allocated to the application. To best inform available memory, set memory requests and limits on your deployments. We recommend increasing memory allocation before manually configuring JVM settings.

If you wish to manually configure JVM memory, use the following baseline recommendations.

## Memory parameters

Set JVM memory parameters using the `JAVA_OPTS` environment variable. The following parameters control memory allocation:

| Parameter                  | Description                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `-Xms` / `-Xmx`            | Set the initial (`Xms`) and maximum (`Xmx`) heap size. The heap stores Java objects and should be 50-70% of total allocated memory. |
| `-XX:MaxDirectMemorySize`  | Set the maximum direct (off-heap) memory. Used for NIO operations, network buffers, and file I/O.                                   |
| `-XX:ActiveProcessorCount` | Set the number of CPUs available to the JVM. Should match the number of vCPUs allocated to the container.                           |

## Resource allocation guidelines

- **Heap (`-Xmx`)**: 50-70% of total allocated memory
- **Direct memory**: 10-20% of total allocated memory
- **Overhead** (metaspace, thread stacks, native memory): ~10% of total allocated memory

Ensure total JVM memory (heap + direct memory + overhead) does not exceed container memory limits.

## Example configurations

The following table provides example configurations for common deployment sizes. These are starting points and may need to be tuned based on your specific usage patterns.

| vCPU |  RAM  | Heap (`-Xmx`) | Direct Memory | `JAVA_OPTS`                                                                     |
| :--: | :---: | :-----------: | :-----------: | ------------------------------------------------------------------------------- |
|  1   | 2 GB  |     1 GB      |    512 MB     | `-XX:ActiveProcessorCount=1 -Xms500M -Xmx1000M -XX:MaxDirectMemorySize=512m`    |
|  1   | 4 GB  |    2.5 GB     |    800 MB     | `-XX:ActiveProcessorCount=1 -Xms1000M -Xmx2500M -XX:MaxDirectMemorySize=800m`   |
|  2   | 2 GB  |     1 GB      |    512 MB     | `-XX:ActiveProcessorCount=2 -Xms500M -Xmx1000M -XX:MaxDirectMemorySize=512m`    |
|  2   | 4 GB  |     2 GB      |    800 MB     | `-XX:ActiveProcessorCount=2 -Xms1000M -Xmx2000M -XX:MaxDirectMemorySize=800m`   |
|  2   | 8 GB  |     5 GB      |    1.5 GB     | `-XX:ActiveProcessorCount=2 -Xms2000M -Xmx5000M -XX:MaxDirectMemorySize=1500m`  |
|  3   | 2 GB  |     1 GB      |    512 MB     | `-XX:ActiveProcessorCount=3 -Xms500M -Xmx1000M -XX:MaxDirectMemorySize=512m`    |
|  3   | 4 GB  |     2 GB      |    800 MB     | `-XX:ActiveProcessorCount=3 -Xms1000M -Xmx2000M -XX:MaxDirectMemorySize=800m`   |
|  3   | 8 GB  |     5 GB      |    1.5 GB     | `-XX:ActiveProcessorCount=3 -Xms2000M -Xmx5000M -XX:MaxDirectMemorySize=1500m`  |
|  3   | 16 GB |     11 GB     |    2.5 GB     | `-XX:ActiveProcessorCount=3 -Xms4000M -Xmx11000M -XX:MaxDirectMemorySize=2500m` |

## When to adjust memory settings

Adjust your JVM memory settings if you observe the following issues in your deployment:

**Increase heap memory (`-Xmx`)** if you see:

- `OutOfMemoryError: Java heap space` errors in logs
- Garbage collection pauses affecting performance
- Steadily growing memory usage under sustained load

**Increase direct memory (`MaxDirectMemorySize`)** if you see:

- `OutOfMemoryError: Direct buffer memory` errors in logs
- High concurrent workflow launch rates (more than 100 simultaneous workflows)
- Large configuration payloads or extensive API usage

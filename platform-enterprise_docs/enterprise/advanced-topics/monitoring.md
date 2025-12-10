---
title: Seqera Platform Monitoring
headline: "Seqera Platform Monitoring"
description: "A guide on relevant platform metrics"
---

# Seqera Platform Monitoring

## Enabling Observability Metrics

The Seqera Platform Backend has built-in observability metrics which can be enabled by adding `prometheus` to the `MICRONAUT_ENVIRONMENTS` environment variable. This exposes a Prometheus endpoint at `/prometheus` on the default listen port (e.g., `http://localhost:8080/prometheus`).

Combined with infrastructure monitoring tools such as Node Exporter, you can monitor relevant metrics across your deployment.

---

## Key Metrics to Monitor

### JVM Memory Metrics

| Metric                         | Description                                              |
| ------------------------------ | -------------------------------------------------------- |
| `jvm_buffer_memory_used_bytes` | Memory used by JVM buffer pools (direct, mapped)         |
| `jvm_memory_used_bytes`        | Amount of used memory by area (heap/non-heap) and region |
| `jvm_memory_committed_bytes`   | Memory committed for JVM use                             |
| `jvm_memory_max_bytes`         | Maximum memory available for memory management           |
| `jvm_gc_live_data_size_bytes`  | Size of long-lived heap memory pool after reclamation    |
| `jvm_gc_max_data_size_bytes`   | Max size of long-lived heap memory pool                  |

### JVM Garbage Collection

| Metric                                | Description                               |
| ------------------------------------- | ----------------------------------------- |
| `jvm_gc_pause_seconds_sum`            | Total time spent in GC pauses             |
| `jvm_gc_pause_seconds_count`          | Number of GC pause events                 |
| `jvm_gc_pause_seconds_max`            | Maximum GC pause duration                 |
| `jvm_gc_memory_allocated_bytes_total` | Total bytes allocated in young generation |
| `jvm_gc_memory_promoted_bytes_total`  | Bytes promoted to old generation          |

### JVM Threads

| Metric                       | Description                                                       |
| ---------------------------- | ----------------------------------------------------------------- |
| `jvm_threads_live_threads`   | Current number of live threads (daemon + non-daemon)              |
| `jvm_threads_daemon_threads` | Current number of daemon threads                                  |
| `jvm_threads_peak_threads`   | Peak thread count since JVM start                                 |
| `jvm_threads_states_threads` | Thread count by state (runnable, blocked, waiting, timed-waiting) |

### JVM Classes

| Metric                               | Description                            |
| ------------------------------------ | -------------------------------------- |
| `jvm_classes_loaded_classes`         | Currently loaded classes               |
| `jvm_classes_unloaded_classes_total` | Total classes unloaded since JVM start |

### HTTP Server Requests

| Metric                                     | Description                                       |
| ------------------------------------------ | ------------------------------------------------- |
| `http_server_requests_seconds_count`       | Total request count by method, status, and URI    |
| `http_server_requests_seconds_sum`         | Total request duration by method, status, and URI |
| `http_server_requests_seconds_max`         | Maximum request duration                          |
| `http_server_requests_seconds` (quantiles) | Request latency percentiles (p50, p95, p99, p999) |

### HTTP Client Requests

| Metric                               | Description                       |
| ------------------------------------ | --------------------------------- |
| `http_client_requests_seconds_count` | Outbound request count            |
| `http_client_requests_seconds_sum`   | Total outbound request duration   |
| `http_client_requests_seconds_max`   | Maximum outbound request duration |

### Process Metrics

| Metric                       | Description                          |
| ---------------------------- | ------------------------------------ |
| `process_cpu_usage`          | Recent CPU usage for the JVM process |
| `process_cpu_time_ns_total`  | Total CPU time used by the JVM       |
| `process_files_open_files`   | Open file descriptor count           |
| `process_files_max_files`    | Maximum file descriptor limit        |
| `process_uptime_seconds`     | JVM uptime                           |
| `process_start_time_seconds` | Process start time (unix epoch)      |

### System Metrics

| Metric                   | Description                           |
| ------------------------ | ------------------------------------- |
| `system_cpu_usage`       | System-wide CPU usage                 |
| `system_cpu_count`       | Number of processors available to JVM |
| `system_load_average_1m` | 1-minute load average                 |

### Executor Thread Pools

| Metric                           | Description                                                |
| -------------------------------- | ---------------------------------------------------------- |
| `executor_active_threads`        | Currently active threads by pool (io, blocking, scheduled) |
| `executor_pool_size_threads`     | Current thread pool size                                   |
| `executor_pool_max_threads`      | Maximum allowed threads in pool                            |
| `executor_queued_tasks`          | Tasks queued for execution                                 |
| `executor_completed_tasks_total` | Total completed tasks                                      |
| `executor_seconds_sum`           | Total execution time                                       |

### Cache Metrics

| Metric                  | Description                         |
| ----------------------- | ----------------------------------- |
| `cache_size`            | Number of entries in cache          |
| `cache_gets_total`      | Cache hits and misses by cache name |
| `cache_puts_total`      | Cache entries added                 |
| `cache_evictions_total` | Cache eviction count                |

### Hibernate/Database Metrics

| Metric                                   | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| `hibernate_sessions_open_total`          | Total sessions opened                                |
| `hibernate_sessions_closed_total`        | Total sessions closed                                |
| `hibernate_connections_obtained_total`   | Database connections obtained                        |
| `hibernate_query_executions_total`       | Total queries executed                               |
| `hibernate_query_executions_max_seconds` | Slowest query time                                   |
| `hibernate_entities_inserts_total`       | Entity insert operations                             |
| `hibernate_entities_updates_total`       | Entity update operations                             |
| `hibernate_entities_deletes_total`       | Entity delete operations                             |
| `hibernate_entities_loads_total`         | Entity load operations                               |
| `hibernate_transactions_total`           | Transaction count                                    |
| `hibernate_flushes_total`                | Session flush count                                  |
| `hibernate_optimistic_failures_total`    | Optimistic lock failures (StaleObjectStateException) |

### Seqera Platform-Specific Metrics

#### Workflow Metrics

| Metric                                    | Description         |
| ----------------------------------------- | ------------------- |
| `credits_estimation_workflow_added_total` | Workflows added     |
| `credits_estimation_workflow_ended_total` | Workflows completed |
| `credits_estimation_task_started_total`   | Tasks started       |
| `credits_estimation_task_ended_total`     | Tasks ended         |

#### Data Studio Metrics

| Metric                                           | Description                          |
| ------------------------------------------------ | ------------------------------------ |
| `data_studio_startup_time_failure_seconds_sum`   | Time for failed Data Studio startups |
| `data_studio_startup_time_failure_seconds_count` | Failed Data Studio startup count     |

#### Error Tracking

| Metric                         | Description               |
| ------------------------------ | ------------------------- |
| `tower_logs_errors_10secCount` | Errors in last 10 seconds |
| `tower_logs_errors_1minCount`  | Errors in last minute     |
| `tower_logs_errors_5minCount`  | Errors in last 5 minutes  |

### Logging Metrics

| Metric                 | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `logback_events_total` | Log events by level (debug, info, warn, error, trace) |

---

## Recommended Alerting Thresholds

### Critical Alerts

- `jvm_memory_used_bytes{area="heap"}` > 90% of `jvm_memory_max_bytes`
- `process_files_open_files` > 90% of `process_files_max_files`
- `logback_events_total{level="error"}` rate > threshold
- `tower_logs_errors_1minCount` > 0

### Warning Alerts

- `jvm_gc_pause_seconds_sum` rate increasing significantly
- `executor_queued_tasks` > threshold
- `hibernate_optimistic_failures_total` rate increasing
- `http_server_requests_seconds` p99 > acceptable latency

---

## Example PromQL Queries

### Request Rate (requests per second)

```promql
rate(http_server_requests_seconds_count[5m])
```

### Average Request Latency

```promql
rate(http_server_requests_seconds_sum[5m]) / rate(http_server_requests_seconds_count[5m])
```

### JVM Heap Usage Percentage

```promql
sum(jvm_memory_used_bytes{area="heap"}) / sum(jvm_memory_max_bytes{area="heap"}) * 100
```

### GC Pause Rate

```promql
rate(jvm_gc_pause_seconds_sum[5m])
```

### Error Rate

```promql
rate(logback_events_total{level="error"}[5m])
```

### Thread Pool Utilization

```promql
executor_active_threads / executor_pool_size_threads * 100
```
